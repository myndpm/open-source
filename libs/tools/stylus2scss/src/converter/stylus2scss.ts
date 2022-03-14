import { readFile, writeFile } from '@myndpm/utils';
import { Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { Parser } from 'stylus';
import { findMixin, findVariable } from '../parser/utils';
import { Options } from '../schema';
import { converter } from './converter';

const GLOBAL_MIXINS: string[] = []
const GLOBAL_VARIABLES: string[] = []

export function stylusParse(file: string): Observable<any> {
  return readFile(file).pipe(
    map((data) => {
      const ast = new Parser(data).parse();
      ast.nodes.forEach(node => {
        findVariable(node, GLOBAL_VARIABLES);
        findMixin(node, GLOBAL_MIXINS);
      });
    }),
  );
}

export function stylusConvert(options: Required<Options>): Observable<any> {
  return readFile(options.file).pipe(
    concatMap((content) => {
      return writeFile(
        options.file,
        converter(content, options, GLOBAL_VARIABLES, GLOBAL_MIXINS),
      );
    }),
  );
}
