#!/usr/bin/env node

import { jsonRead, treeVisit } from '@myndpm/utils';
import chalk from 'chalk';
import { Command } from 'commander';
import { join, relative } from 'path';
import { of } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { parseOptions } from './schema';

const program = new Command();
const version = jsonRead(join(__dirname, '../package.json'), 'version');

program
  .name('stylus2scss')
  .version(`v${version}`)
  .description('CLI util to convert Stylus to SCSS');

program
  .option('-p, --path <path>', 'Path to convert. Defaults to current', '.')
  .option('--diagnose', 'List the files to process in the folder', false)
  .option('--only-migrate', 'Only run sass-migration on SCSS files', false);

program.parse(process.argv);

const options = parseOptions(program.opts());

console.log(chalk.cyanBright(`stylus2scss ${
  options.diagnose ? 'diagnosis' : (options.onlyMigrate ? 'migration' : 'conversion')
}`));

treeVisit(options.path).pipe(
  filter((file) => {
    return file.endsWith('.styl') || options.onlyMigrate && file.endsWith('.scss');
  }),
  map((file) => ({
    ...options,
    file,
  })),
  // diagnose
  tap(({ path, diagnose, onlyMigrate, file }) => {
    if (diagnose && !onlyMigrate) {
      console.log(chalk.dim('>', relative(path, file)));
    }
  }),
  // convert
  switchMap((options) => {
    if (!options.diagnose && !options.onlyMigrate) {
      // TODO perform conversion
      options.file = options.file.replace(/\.styl$/, '.scss');
    }
    return of(options);
  }),
  // migrate
  switchMap((options) => {
    if (options.file.endsWith('.scss')) {
      if (options.diagnose) {
        console.log(chalk.dim('>', relative(options.path, options.file)));
      } else {
        // TODO perform migration
      }
    }
    return of(options);
  }),
).subscribe();
