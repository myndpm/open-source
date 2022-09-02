import { readFile, writeFile } from '@myndpm/utils';
import { relative } from 'path';
import { Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { Schema } from '../schema';
import { logInfo, logNote } from '../utils';
import { converter } from './converter';

export function pugConvert(opts: Required<Schema>): Observable<any> {
  if (opts.dryRun) {
    logInfo('> Converting pug');
    return of(true);
  }
  return readFile(opts.file).pipe(
    concatMap((content) => {
      const file = relative(opts.path, opts.file);
      let source = converter(content);
      // show wanings
      if (source.indexOf('$implicit') !== -1) {
        logNote(`please check how let-* of $implicit were converted: ${file}`);
      }
      if (source.indexOf('ngForOf') !== -1) {
        logNote(`please check how let-* of ngForOf were converted: ${file}`);
      }
      return writeFile(opts.file, source);
    }),
  );
}
