#!/usr/bin/env node

import { FsTree } from '@myndpm/utils';
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
  .option('--diagnose', 'Diagnose the stylesheets in the folder', false)
  .option('--only-migrate', 'Only run sass-migration on SCSS files', false);

program.parse(process.argv);

const options = parseOptions(program.opts());
const fstree = new FsTree();

fstree.visit(options.path, (path) => {
  console.log(relative(options.path, path))
  // diagnose
  // convert
  // migrate
})
