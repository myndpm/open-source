import { readFile, writeFile } from '@myndpm/utils';
import { basename } from 'path';
import { Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { Schema } from '../schema';
import { logInfo } from '../utils';

export function componentUpdate(styl: string, opts: Required<Schema>): Observable<any> {
  if (opts.dryRun) {
    logInfo('> Updating component');
    return of(true);
  }
  return readFile(opts.file).pipe(
    concatMap((content) => {
      return writeFile(
        opts.file,
        content.replace(basename(styl), basename(styl).replace(/\.styl$/, `.scss`)),
      );
    }),
  );
}
