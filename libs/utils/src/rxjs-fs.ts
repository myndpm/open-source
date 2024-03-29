import { readFile as rxReadFile } from '@ckapp/rxjs-node-fs';
import { rename } from 'fs';
import { bindNodeCallback, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * RxJs filesystem utilities.
 */

export {
  appendFile,
  readDir,
  stat,
  watch,
  writeFile,
} from '@ckapp/rxjs-node-fs';

export function readFile(
  filepath: string,
  options?: { encoding?: BufferEncoding; flag?: string } | null
): Observable<string> {
  return rxReadFile(filepath, options as any).pipe(
    map((buffer) => buffer?.toString())
  );
}

export const renameFile: (
  oldPath: string,
  newPath: string
) => Observable<void> = bindNodeCallback(rename);
