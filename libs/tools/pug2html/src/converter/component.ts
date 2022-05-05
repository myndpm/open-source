import { readFile, writeFile } from '@myndpm/utils';
import { relative } from 'path';
import { Observable, of, throwError } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { formatter } from '../formatter/prettyfy';
import { Schema } from '../schema';
import { logInfo } from '../utils';
import { converter } from './converter';

export function componentUpdate(opts: Required<Schema>): Observable<any> {
  if (opts.dryRun) {
    logInfo('> Updating component');
    return of(true);
  }
  return readFile(opts.file).pipe(
    concatMap((content) => {
      const file = relative(opts.path, opts.file);
      let source = convertTsInlineTemplate(file, content);
      source = convertTsInlineUrlExtension(file, content);
      return source !== content
        ? writeFile(opts.file, source)
        : throwError(null);
    }),
  );
}

function convertTsInlineTemplate(file: string, content: string): string {
  try {
    const replacer = (_: string, g1: string, g2: string, g3: string, g4: string) =>
      `${g1}${g2}${formatter(converter(g3)).trim()}${g4}`;
    return content.replace(/((?:template|code):[\r\n\s]*?)(['"`])([\s\S]*?)(\2)/g, replacer);
  } catch (error: any) {
    const msg = `ERROR: convert inline template failed while processing ${file}. Please, review possible errors.`;
    const details = `${error.code}: ${error.msg} at Pug:${error.line}:${error.column}`;
    console.error(`${msg} ${details}`);
    throw error;
  }
}

function convertTsInlineUrlExtension(file: string, content: string): string {
  try {
    const replacer = (match: string, g1: string, g2: string, g3: string, g4: string, g5: string) =>
      `${g1}${g2}${g3}.html${g5}`;
    return content.replace(/(templateUrl:[\r\n\s]*?)(['"`])([\s\S]*?)([.]pug)(\2)/, replacer);
  } catch (error) {
    console.error(`ERROR: convert inline url extension failed while processing ${file}`, error);
    throw error;
  }
}
