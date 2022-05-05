import { readFile, writeFile } from '@myndpm/utils';
import { Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { Schema } from '../schema';
import { logInfo } from '../utils';
import { converter } from './converter';

export function pugConvert(opts: Required<Schema>): Observable<any> {
  if (opts.dryRun) {
    logInfo('> Converting pug');
    return of(true);
  }
  return readFile(opts.file).pipe(
    concatMap((content) => {
      return writeFile(opts.file, converter(content));
    }),
  );
}
