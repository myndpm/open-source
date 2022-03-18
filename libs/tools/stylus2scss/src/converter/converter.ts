import { Parser } from 'stylus';
import { Options } from '../schema';
import { visitor } from './visitor';

export function converter(
  content: string,
  options: Options,
  variables: string[] = [],
  mixins: string[] = [],
) {
  if (typeof content !== 'string') {
    return content;
  }

  if (options.comments) {
    content = content.replace(/\/\/\s(.*)/g, '/* !#sign#! $1 */');
  }

  // add semicolons to properties with inline comments to ensure that they are parsed correctly
  content = content.replace(/^( *)(\S(.+?))( *)(\/\*.*\*\/)$/gm, '$1$2;$4$5');

  const ast = new Parser(content).parse();

  const text = visitor(ast, options, variables, mixins);

  // convert special multiline comments to single-line comments
  return text.replace(/\/\*\s!#sign#!\s(.*)\s\*\//g, '// $1')
}
