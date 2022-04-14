import { readFile, writeFile } from '@myndpm/utils';
import { relative } from 'path';
import { Observable, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { Parser } from 'stylus';
import { findMixin, findVariable } from '../parser/utils';
import { Schema } from '../schema';
import { logInfo, logNote } from '../utils';
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
      const file = relative(opts.path, opts.file);
      let source = converter(content, opts, GLOBAL_VARIABLES, GLOBAL_MIXINS);
      // replace functions
      if (source.indexOf('alpha(') !== -1) {
        source = source.replace(/alpha\((.*)?\,/g, 'change-color($1, $alpha:')
      }
      if (source.indexOf('embedurl(') !== -1) {
        source = source.replace(/embedurl\(/g, 'url(')
      }
      if (source.indexOf('transparentify(') !== -1) {
        logNote(`! transparentify replaced with rgba: ${file}`);
        source = source.replace(/transparentify\(/g, 'rgba(')
      }
      // known issues
      if (source.indexOf('&#') !== -1) {
        logNote(`&# detected, please remove it temporarily at: ${file}`);
      }
      if (source.indexOf('%s') !== -1) {
        logNote(`! interpolation %s detected: ${file}`);
      }
      if (source.indexOf('@each') !== -1) {
        logNote(`! @each detected: ${file}`);
      }
      if (/\$([\w-]*)?\./.test(source)) {
        logNote(`! map-get() required: ${file}`);
      }
      return writeFile(opts.file, source);
    }),
  );
}
