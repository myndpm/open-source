#!/usr/bin/env node

import { Command } from 'commander';
import { parseOptions } from './schema.js';

const program = new Command();

program
  .name('stylus2scss')
  .description('CLI util to convert Stylus to SCSS');

program
  .option('-p, --path <path>', 'Path to convert. Defaults to current', '.')
  .option('--diagnose', 'Diagnose the stylesheets in the folder', false)
  .option('--only-migrate', 'Only run sass-migration on SCSS files', false);

program.parse(process.argv);

const options = parseOptions(program.opts());

console.log(options);
