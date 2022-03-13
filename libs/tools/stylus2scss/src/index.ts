#!/usr/bin/env node

import { exec, jsonRead, treeVisit } from '@myndpm/utils';
import chalk from 'chalk';
import { Command } from 'commander';
import { join, relative } from 'path';
import { of } from 'rxjs';
import { concatMap, filter, map, mapTo, mergeMap } from 'rxjs/operators';
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

let counter = 0;
const options = parseOptions(program.opts());

console.log(chalk.cyanBright(`stylus2scss ${
  options.diagnose ? 'diagnosis' : (options.onlyMigrate ? 'migration' : 'conversion')
}`));

treeVisit(options.path).pipe(
  filter((file) => {
    return file.endsWith('.styl') || options.onlyMigrate && file.endsWith('.scss');
  }),
  map((file) => ({ ...options, file })),
  concatMap((opts) => {
    // diagnose
    if (!opts.onlyMigrate) {
      console.log(chalk.dim(opts.diagnose ? '>' : '-', relative(opts.path, opts.file)));
      if (options.diagnose) {
        counter++;
      }
    }
    // convert
    if (!options.diagnose && !options.onlyMigrate) {
      const file = opts.file.replace(/\.styl$/, '.scss');
      // TODO perform conversion
      return exec('git', ['mv', opts.file, file]).pipe(
        mapTo({ ...opts, file }),
      );
    }
    return of(opts);
  }),
  mergeMap((opts) => {
    // migrate
    if (opts.file.endsWith('.scss')) {
      console.log(chalk.dim(opts.diagnose ? '>' : '+', relative(opts.path, opts.file)));
      counter++;
      // TODO perform migration
    }
    return of(opts);
  }),
).subscribe({
  complete: () => {
    console.log(chalk.yellow(
      `${counter} files ${options.diagnose ? 'to process' : 'processed'}`
    ));
  },
});
