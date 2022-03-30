import { readFile, writeFile } from '@myndpm/utils';
import { Observable, of, throwError } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { Schema } from '../schema';
import { logInfo } from '../utils';

export function componentUpdate(opts: Required<Schema>): Observable<any> {
  if (opts.dryRun) {
    logInfo('> Updating component');
    return of(true);
  }
  return readFile(opts.file).pipe(
    concatMap((content) => {
      const source = content.replace(/\.styl$/g, `.scss`);
      return source !== content
        ? writeFile(opts.file, source)
        : throwError(null);
    }),
  );
}
