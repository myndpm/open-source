import { readFile, writeFile } from '@myndpm/utils';
import prettier, { Options } from 'prettier';
import { Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { Schema } from '../schema';
import { logInfo } from '../utils';

const prettierOptions: Options = {
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'none',
  htmlWhitespaceSensitivity: 'strict',
  bracketSpacing: true,
  arrowParens: 'always',
  proseWrap: 'always',
  endOfLine: 'auto',
  parser: 'angular',
};

export function htmlPrettify(opts: Required<Schema>): Observable<any> {
  if (opts.dryRun) {
    logInfo('> Prettifying html');
    return of(true);
  }
  return readFile(opts.file).pipe(
    concatMap((content) => {
      return writeFile(opts.file, formatter(content));
    }),
  );
}

export function formatter(content: string): string {
  return prettier.format(content, prettierOptions);
}
