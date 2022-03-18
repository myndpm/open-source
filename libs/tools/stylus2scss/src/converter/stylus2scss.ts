import { readFile, writeFile } from '@myndpm/utils';
import { Observable, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { Parser } from 'stylus';
import { findMixin, findVariable } from '../parser/utils';
import { Schema } from '../schema';
import { logInfo } from '../utils';
import { converter } from './converter';

const GLOBAL_MIXINS: string[] = []
const GLOBAL_VARIABLES: string[] = []

export function stylusParse(opts: Required<Schema>): Observable<any> {
  if (opts.dryRun) {
    logInfo('> Parsing stylus');
    return of(true);
  }
  return readFile(opts.file).pipe(
    map((data) => {
      const ast = new Parser(data).parse();
      ast.nodes.forEach(node => {
        findVariable(node, GLOBAL_VARIABLES);
        findMixin(node, GLOBAL_MIXINS);
      });
    }),
  );
}

export function stylusConvert(opts: Required<Schema>): Observable<any> {
  if (opts.dryRun) {
    logInfo('> Converting stylus');
    return of(true);
  }
  return readFile(opts.file).pipe(
    concatMap((content) => {
      return writeFile(
        opts.file,
        converter(content, opts, GLOBAL_VARIABLES, GLOBAL_MIXINS),
      );
    }),
  );
}
