import { join } from 'path';
import { from, Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { readDir, stat } from './rxjs-fs';

/**
 * Similar to @angular-devkit's Tree.visit.
 */

export function treeVisit(path: string): Observable<string> {
  return stat(path).pipe(
    mergeMap((stats) => {
      if (stats.isDirectory()) {
        return readDir(path).pipe(
          mergeMap((files) => from(files)),
          mergeMap((file) => treeVisit(join(path, file)))
        );
      } else if (stats.isFile()) {
        return of(path);
      }
      return throwError(`Not a directory nor file: ${path}`);
    })
  );
}
