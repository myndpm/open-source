#!/usr/bin/env node

import { exec, jsonRead, renameFile, treeVisit } from '@myndpm/utils';
import { Command } from 'commander';
import { prompt } from 'inquirer';
import { dirname, join, relative } from 'path';
import { Observable, OperatorFunction, from, of, throwError } from 'rxjs';
import { catchError, concatMap, delay, filter, last, mapTo, scan } from 'rxjs/operators';
import { componentUpdate } from './converter/component';
import { stylusConvert, stylusParse } from './converter/stylus2scss';
import { replaceCRLF } from './parser/line-ending';
import { Schema } from './schema';
import { logInfo, logNote, logTitle } from './utils';

const program = new Command();
const version = jsonRead(join(__dirname, '../package.json'), 'version');

program
  .name('stylus2scss')
  .version(`v${version}`)
  .description('CLI util to convert Stylus to SCSS');

program
  .option('--path <path>', 'Path to convert. Defaults to current', process.cwd())
  .option('--git', 'Convert and move files keeping the GIT history', false)
  .option('--dry-run', 'Do not execute and print the steps', false)
  .option('--diagnose', 'List the files to process in the folder', false)
  .option('--convert', 'Convert the file contents only', false)
  .option('--move', 'Only move the .styl files to .scss and update the related components', false)
  .option('--migrate', 'Only run sass-migration on SCSS files', false)
  .option('--quote <quote>', '[convert] use single or double quote', 'single')
  .option('--indent', '[convert] additional output indent', '0')
  .option('--autoprefixer', '[convert] autoprefixer output', false);

program.parse(process.argv);

let counter = 0;
const opts = new Schema(program.opts());
const question = (message: string) => ([{
  message,
  type: 'input',
  name: 'message',
}]);

logTitle(`stylus2scss ${opts.onlyDiagnose ? 'diagnosis' : (opts.onlyMigrate ? 'migration' : 'conversion')}`);

treeVisit(opts.path).pipe(
  filter((file) => opts.isValid(file)),
  waitForAll(),
  concatMap((files) => gitCheck(files)),
  concatMap(files => from(files)),
  // diagnose
  concatMap((file) => {
    if (opts.onlyDiagnose) {
      logInfo('-', relative(dirname(opts.path), file));
      counter++;
    }
    return opts.shouldAnalize(file)
      ? replaceCRLF(opts.withFile(file)).pipe(
          concatMap(() => opts.onlyDiagnose ? of(file) : stylusParse(opts.withFile(file))),
          mapTo(file),
        )
      : of(file);
  }),
  // convert
  concatMap((file) => {
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
    return opts.shouldConvertCommit()
      ? gitCommit(files, 'Message for the convert commit:')
      : of(files);
  }),
  concatMap(files => from(files)),
  // move
  concatMap((file) => {
    if (opts.shouldCheckComponent(file)) {
      const tsFile = file.replace(/\.styl$/, `.ts`);
      return componentUpdate(opts.withFile(tsFile)).pipe(
        concatMap(() => opts.git
          ? exec('git', ['add', tsFile], { dryRun: opts.dryRun }).pipe(delay(50), mapTo(file))
          : of(file)
        ),
        catchError(() => of(file)),
      );
    }
    return of(file);
  }),
  waitForAll(),
  concatMap(files => from(files)),
  concatMap((file) => {
    if (opts.shouldMove(file)) {
      logInfo('+', relative(dirname(opts.path), file));
      counter++;
      const newFile = file.replace(/\.styl$/, `.scss`);
      return opts.git
        ? exec('git', ['mv', file, newFile], { dryRun: opts.dryRun }).pipe(delay(50), mapTo(newFile))
        : !opts.dryRun
          ? renameFile(file, newFile).pipe(mapTo(newFile))
          : logInfo(`> mv ${file} ${newFile}`) || of(newFile);
    }
    return of(file);
  }),
  waitForAll(),
  concatMap((files) => {
    return opts.shouldCommitMove()
      ? gitCommit(files, 'Message for the move commit:')
      : of(files);
  }),
  concatMap(files => from(files)),
  // migrate
  concatMap((file) => {
    if (opts.shouldMigrate(file)) {
      if (opts.onlyMigrate) {
        logInfo('>', relative(dirname(opts.path), file));
        counter++;
      }
      const args: string[] = ['sass-migrator', 'division', opts.dryRun ? '--dry-run' : null, file].filter(Boolean);
      return exec('npx', args, { cwd: __dirname, dryRun: opts.dryRun }).pipe(
        concatMap(() => exec('git', ['add', file], { dryRun: opts.dryRun })),
        mapTo(file),
        catchError((err) => {
          console.error(err);
          return throwError(err);
        }),
      );
    }
    return of(file);
  }),
  waitForAll(),
  concatMap((files) => {
    return opts.shouldCommitMigration()
      ? gitCommit(files, 'Message for the migrate commit:')
      : of(files);
  }),
).subscribe({
  error: (err) => logNote(err),
  complete: () => logNote(`${counter} files ${opts.onlyDiagnose ? 'to process' : 'processed'}`),
});

function waitForAll(): OperatorFunction<string, string[]> {
  return (source$: Observable<string>) => source$.pipe(
    scan<string, string[]>((all, file) => all.concat(file), []),
    last(), // wait until all files are processed
    filter(all => Boolean(all.length)), // prevents EmptyError
  );
  // use concatMap(files => from(files)) to re-emit the files one by one
}

function gitCheck<T>(files: T): Observable<T> {
  return exec('git', ['status']).pipe(
    mapTo(files),
    catchError(() => throwError('Do not use --git outside a repository')),
  );
}

function gitCommit<T>(files: T, ask: string): Observable<T> {
  return exec('git', ['status']).pipe(
    concatMap(() => exec('git', ['diff', '--cached', '--numstat'])),
    concatMap((output) => {
      const lines = (output.stdout?.toString() || '').split('\n').filter(Boolean).length;
      return lines
        ? (!opts.dryRun ? prompt(question(ask)).ui.process : of({ name: '', answer: 'msg' })).pipe(
            concatMap(({ answer }) => exec('git', ['commit', '--no-verify', '-m', `"${answer}"`], { dryRun: opts.dryRun })),
          )
        : of(files);
    }),
    mapTo(files),
    catchError(() => throwError('Do not use --git outside a repository')),
  );
}
