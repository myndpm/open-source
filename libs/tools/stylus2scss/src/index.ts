#!/usr/bin/env node

import { FsTree } from '@myndpm/utils';
import chalk from 'chalk';
import { Command } from 'commander';
import { readFileSync } from 'fs';
import { dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';
import { parseOptions } from './schema.js';

const pkgjson = join(dirname(fileURLToPath(import.meta.url)), '../package.json');
const metadata = JSON.parse(readFileSync(pkgjson).toString());

const program = new Command();

program
  .name('stylus2scss')
  .version(metadata.version)
  .description('CLI util to convert Stylus to SCSS');

program
  .option('-p, --path <path>', 'Path to convert. Defaults to current', '.')
  .option('--diagnose', 'List the files to process in the folder', false)
  .option('--only-migrate', 'Only run sass-migration on SCSS files', false);

program.parse(process.argv);

const options = parseOptions(program.opts());
const fstree = new FsTree();

console.log(chalk.cyanBright(`stylus2scss ${
  options.diagnose ? 'diagnosis' : (options.onlyMigrate ? 'migration' : 'conversion')
}`));

fstree.visit(options.path, (path) => {
  if (!(path.endsWith('.styl') || options.onlyMigrate && path.endsWith('.scss'))) {
    return;
  }

  let filepath = path;

  // diagnose
  if (options.diagnose && !options.onlyMigrate) {
    console.log(chalk.dim('>', relative(options.path, path)));
  }

  // convert
  if (!options.diagnose && !options.onlyMigrate) {
    filepath = filepath.replace(/\.styl$/, '.scss');
    // TODO perform conversion
  }

  // migrate
  if (filepath.endsWith('.scss')) {
    if (options.diagnose) {
      console.log(chalk.dim('>', relative(options.path, filepath)));
    } else {
      // TODO perform migration
    }
  }
})
