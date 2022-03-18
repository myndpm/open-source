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

  // add semicolons to properties with inline comments to ensure that they are parsed correctly
  content = content.replace(/^( *)(\S(.+?))( *)(\/\*.*\*\/)$/gm, '$1$2;$4$5');

  const ast = new Parser(content).parse();

  return visitor(ast, options, variables, mixins);
}
