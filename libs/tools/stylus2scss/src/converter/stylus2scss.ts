import fs from 'fs';
import { get, nodesToJSON } from '../utils';
import visitor from './visitor';
import { Nodes, Parser } from 'stylus';

export function parse(result: string): Nodes.Root {
  return new Parser(result).parse();
}

export function converter(
  result: string,
  options = {
    quote: `'`,
    conver: 'sass',
    autoprefixer: true,
    isSignComment: false,
  },
  globalVariableList: string[] = [],
  globalMixinList: string[] = [],
) {
  if (options.isSignComment) {
    result = result.replace(/\/\/\s(.*)/g, '/* !#sign#! $1 */');
  }

  // add semicolons to properties with inline comments to ensure that they are parsed correctly
  result = result.replace(/^( *)(\S(.+?))( *)(\/\*.*\*\/)$/gm, '$1$2;$4$5');

  if (typeof result !== 'string') return result
  const ast = new Parser(result).parse()
  // console.log(JSON.stringify(ast))
  const text = visitor(ast, options, globalVariableList, globalMixinList)
  // convert special multiline comments to single-line comments
  return text.replace(/\/\*\s!#sign#!\s(.*)\s\*\//g, '// $1')
}


let callLen = 0
const GLOBAL_MIXIN_NAME_LIST: string[] = []
const GLOBAL_VARIABLE_NAME_LIST: string[] = []

const MIXIN_TYPES = [
  'Selector',
  'Property',
]

function isCallMixin(node: Nodes.Node) {
  return node.__type === 'Call' && node.block
}

function findMixin(node: any, mixins: string[] = [], fnList: string[] = []) {
  // val =》 obj, block -> obj, nodes -> arr
  if (node.__type === 'Function' && fnList.indexOf(node.name) < 0) {
    fnList.push(node.name)
  }
  if (fnList.length &&(MIXIN_TYPES.indexOf(node.__type) > -1 || isCallMixin(node))) {
    fnList.forEach(name => {
      if (mixins.indexOf(name) < 0) {
        mixins.push(name)
      }
    })
    fnList = []
  }
  if (get(node, ['val', 'toJSON'])) {
    findMixin(node.val.toJSON(), mixins, fnList)
  }
  if (get(node, ['expr', 'toJSON'])) {
    findMixin(node.expr.toJSON(), mixins, fnList)
  }
  if (get(node, ['block', 'toJSON'])) {
    findMixin(node.block.toJSON(), mixins, fnList)
  }
  if (node.nodes) {
    const nodes = nodesToJSON(node.nodes)
    nodes.forEach(item => findMixin(item, mixins, fnList))
  }
  return mixins
}

function convertStylus(input: string, output: string, options: any, callback: Function) {
  callLen++
  if (/\.styl$/.test(input)) {
    fs.readFile(input, (err, res) => {
      if (err) throw err
      let result = res.toString()
      let outputPath = output
      if (/\.styl$/.test(input)) {
        try {
          if (options.status === 'complete') {
            result = converter(result, options, GLOBAL_VARIABLE_NAME_LIST, GLOBAL_MIXIN_NAME_LIST)
          } else {
            const ast = parse(result)
            const nodes = nodesToJSON(ast.nodes)
            nodes.forEach(node => {
              findMixin(node, GLOBAL_MIXIN_NAME_LIST)
              if (node.__type === 'Ident' && node.val.toJSON().__type === 'Expression') {
                if (GLOBAL_VARIABLE_NAME_LIST.indexOf(node.name) === -1) {
                  GLOBAL_VARIABLE_NAME_LIST.push(node.name)
                }
              }
            })
          }
        } catch (e) {
          result = ''
          callLen--
          console.error('Failed to convert', input)
          return;
        }
        outputPath = output.replace(/\.styl$/, '.' + options.conver)
      }

      fs.writeFile(outputPath, result, err => {
        callLen--
        if (err) throw err
        if (!result) return
        if (callLen === 0) {
          if (options.status === 'complete') {
            callback(Date.now())
          } else {
            callback()
          }
        }
      })
    })
  } else {
    fs.copyFile(input, output, err => {
      callLen--
      if (err) throw err
      if (options.status !== 'complete') return
      if (callLen === 0) {
        if (options.status === 'complete') {
          callback(Date.now())
        } else {
          callback()
        }
      }
    })
  }
}
