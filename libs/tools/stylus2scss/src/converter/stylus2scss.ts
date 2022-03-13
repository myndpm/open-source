import { readFile } from '@myndpm/utils';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Parser } from 'stylus';
import { findMixin, findVariable } from '../parser/utils';

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
