#!/usr/bin/env node

import { exec, jsonRead, renameFile, treeVisit } from '@myndpm/utils';
import { Command } from 'commander';
import { dirname, join, relative } from 'path';
import { Observable, OperatorFunction, from, of } from 'rxjs';
import { concatMap, filter, last, mapTo, mergeMap, scan } from 'rxjs/operators';
import { stylusConvert, stylusParse } from './converter/stylus2scss';
import { replaceCRLF } from './parser/line-ending';
import { Schema } from './schema';
import { logFooter, logInfo, logTitle } from './utils';

const program = new Command();
const version = jsonRead(join(__dirname, '../package.json'), 'version');

program
  .name('stylus2scss')
  .version(`v${version}`)
  .description('CLI util to convert Stylus to SCSS');

program
  .option('--path <path>', 'Path to convert. Defaults to current', process.cwd())
  .option('--lang', 'Target language (scss or less)', 'scss')
  .option('--commit', 'Interactively asks for the commit message after convert and migrate', false)
  .option('--no-git', 'Adds and move the files with GIT control version', true)
  .option('--dry-run', 'Do not execute and print the steps', false)
  .option('--diagnose', 'List the files to process in the folder', false)
  .option('--convert', 'Convert the file contents only', false)
  .option('--migrate', 'Only run sass-migration on SCSS files', false)
  .option('--quote', '[convert] use single or double quote', 'single')
  .option('--indent', '[convert] additional output indent', '0')
  .option('--no-autoprefixer', '[convert] consider autoprefixer', false)
  .option('--no-comments', '[convert] special inline comments processing', true);

program.parse(process.argv);

let counter = 0;
const opts = new Schema(program.opts());

logTitle(`stylus2scss ${opts.diagnose ? 'diagnosis' : (opts.migrate ? 'migration' : 'conversion')}`);

treeVisit(opts.path).pipe(
  filter((file) => opts.isValid(file)),
  concatMap((file) => {
    // diagnose
    if (!opts.onlyMigrate) {
      logInfo(opts.diagnose ? '>' : '-', relative(dirname(opts.path), file));
      if (opts.onlyDiagnose) {
        counter++;
      }
    }
    return of(opts).pipe(
      concatMap(() => replaceCRLF(opts.withFile(file))),
      concatMap(() => opts.shouldAnalize(file)
        ? stylusParse(opts.withFile(file)).pipe(mapTo(file))
        : of(file)
      ),
    );
  }),
  waitForAll(),
  concatMap(files => from(files)), // re-emit the files one by one
  concatMap((file) => {
    // convert
    if (opts.shouldConvert(file)) {
      return stylusConvert(opts.withFile(file)).pipe(
        concatMap(() => opts.git
          ? exec('git', ['add', file], { dryRun: opts.dryRun })
          : of({}),
        ),
        mapTo(file),
      );
    }
    return of(file);
  }),
  waitForAll(),
  concatMap((files) => {
    return opts.shouldCommit()
      ? exec('git', ['status'], { dryRun: opts.dryRun }).pipe(
          concatMap(() => exec('git', ['commit', '--no-verify'], { dryRun: opts.dryRun })),
          mergeMap(() => from(files)),
        )
      : from(files);
  }),
  concatMap((file) => {
    // finish conversion
    if (opts.shouldConvert(file)) {
      const newFile = file.replace(/\.styl$/, '.scss');
      return opts.git
        ? exec('git', ['mv', file, newFile], { dryRun: opts.dryRun }).pipe(mapTo(file))
        : !opts.dryRun
          ? renameFile(file, newFile).pipe(mapTo(file))
          : logInfo(`> mv ${file} ${newFile}`) || of(file);
    }
    return of(file);
  }),
  concatMap((file) => {
    // migrate
    if (opts.shouldMigrate(file)) {
      logInfo(opts.diagnose ? '>' : '+', relative(dirname(opts.path), file));
      counter++;
      // TODO perform migration
    }
    return of(file);
  }),
  waitForAll(),
  concatMap((files) => {
    return opts.shouldCommit()
      ? exec('git', ['status'], { dryRun: opts.dryRun }).pipe(
          concatMap(() => exec('git', ['commit', '--no-verify'], { dryRun: opts.dryRun })),
          mapTo(files),
        )
      : of(files);
  }),
).subscribe({
  error: (err) => console.error(err),
  complete: () => logFooter(`${counter} files ${opts.diagnose ? 'to process' : 'processed'}`),
});

function waitForAll(): OperatorFunction<string, string[]> {
  return (source$: Observable<string>) => source$.pipe(
    scan<string, string[]>((all, file) => all.concat(file), []),
    last(), // wait until all files are processed
    filter(all => Boolean(all.length)), // prevents EmptyError
  );
}
