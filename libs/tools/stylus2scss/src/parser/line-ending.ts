import { readFile, writeFile } from '@myndpm/utils';
import { Observable, of, throwError } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { Schema } from '../schema';
import { logInfo } from '../utils';

export function replaceCRLF(opts: Required<Schema>): Observable<any> {
  if (opts.dryRun) {
    logInfo(opts.onlyDiagnose ? '> Detecting CRLF' : '> Replacing CRLF');
    return of(true);
  }
  return readFile(opts.file).pipe(
    concatMap((source) => {
      const lf = source.indexOf('\n');
      const crlf = source[lf - 1] === '\r';
      return opts.onlyDiagnose
        ? crlf
          ? throwError(`! CRLF detected: ${opts.file}`)
          : of(true)
        : crlf
          ? writeFile(opts.file, source.replace(/\r\n/g, '\n'))
          : of(true);
    }),
  );
}
