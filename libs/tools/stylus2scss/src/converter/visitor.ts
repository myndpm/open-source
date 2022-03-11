import invariant from 'invariant';
import { Nodes } from 'stylus';
import {
  get,
  trimFirst,
  nodesToJSON,
  repeatString,
  getCharLength,
  replaceFirstATSymbol
} from '../utils.js'

let quote = `'`
let callName = ''
let oldLineno = 1
let paramsLength = 0
let returnSymbol = ''
let indentationLevel = 0
let OBJECT_KEY_LIST: string[] = []
let FUNCTION_PARAMS: string[] = []
let PROPERTY_LIST: Array<{ prop: string; value: any }> = []
let VARIABLE_NAME_LIST: string[] = []
let GLOBAL_MIXIN_NAME_LIST: string[] = []
let GLOBAL_VARIABLE_NAME_LIST: string[] = []
let lastPropertyLineno = 0
let lastPropertyLength = 0

let isCall = false
let isCond = false
let isNegate = false
let isObject = false
let isFunction = false
let isProperty = false
let isNamespace = false
let isKeyframes = false
let isArguments = false
let isExpression = false
let isCallParams = false
let isIfExpression = false

let isBlock = false
let ifLength = 0
let binOpLength = 0
let identLength = 0
let selectorLength = 0
let nodesIndex = 0
let nodesLength = 0

let autoprefixer = true

const COMPIL_CONFIT = {
  scss: {
    variable: '$'
  },
  less: {
    variable: '@'
  }
}

const OPERATION_MAP = new Map([
  ['&&', 'and'],
  ['!', 'not'],
  ['||', 'or'],
])

const KEYFRAMES_LIST = [
  '@-webkit-keyframes ',
  '@-moz-keyframes ',
  '@-ms-keyframes ',
  '@-o-keyframes ',
  '@keyframes '
]

const TYPE_VISITOR_MAP: Map<string, any> = new Map<string, any>([
  ['If', visitIf],
  ['Null', visitNull],
  ['Each', visitEach],
  ['RGBA', visitRGBA],
  ['Unit', visitUnit],
  ['Call', visitCall],
  ['Block', visitBlock],
  ['BinOp', visitBinOp],
  ['Ident', visitIdent],
  ['Group', visitGroup],
  ['Query', visitQuery],
  ['Media', visitMedia],
  ['Import', visitImport],
  ['Atrule', visitAtrule],
  ['Extend', visitExtend],
  ['Member', visitMember],
  ['Return', visitReturn],
  ['Object', visitObject],
  ['String', visitString],
  ['Feature', visitFeature],
  ['Ternary', visitTernary],
  ['UnaryOp', visitUnaryOp],
  ['Literal', visitLiteral],
  ['Charset', visitCharset],
  ['Params', visitArguments],
  ['Comment', visitComment],
  ['Property', visitProperty],
  ['Boolean', visitBoolean],
  ['Selector', visitSelector],
  ['Supports', visitSupports],
  ['Function', visitFunction],
  ['Arguments', visitArguments],
  ['Keyframes', visitKeyframes],
  ['QueryList', visitQueryList],
  ['Namespace', visitNamespace],
  ['Expression', visitExpression],
])

function handleLineno(lineno: number | undefined): string {
  return repeatString('\n', (lineno ?? 0) - oldLineno)
}

function trimFnSemicolon(res: string): string {
  return res.replace(/\);/g, ')')
}

function trimSemicolon(res: string, symbol = '') {
  return res.replace(/;/g, '') + symbol
}

function isCallMixin() {
  return !ifLength && !isProperty && !isObject && !isNamespace && !isKeyframes && !isArguments && !identLength && !isCond && !isCallParams && !returnSymbol
}

function isFunctinCallMixin(node: Nodes.Node): node is Nodes.Call {
  if (node.__type === 'Call') {
    return node.block.scope || GLOBAL_MIXIN_NAME_LIST.indexOf(node.name) > -1
  } else {
    return node.__type === 'If' && isFunctionMixin(node.block.nodes)
  }
}

function hasPropertyOrGroup(node: Nodes.Node): boolean {
  return node.__type === 'Property' || node.__type === 'Group' || node.__type === 'Atrule' || node.__type === 'Media'
}

function isFunctionMixin(nodes: Nodes.Node[]): boolean {
  invariant(nodes, 'Missing nodes param');
  const jsonNodes = nodesToJSON(nodes)
  return jsonNodes.some(node => hasPropertyOrGroup(node) || isFunctinCallMixin(node))
}

function getIndentation(): string {
  return repeatString(' ', indentationLevel * 2)
}

function handleLinenoAndIndentation({ lineno }: { lineno: number }) {
  return handleLineno(lineno) + getIndentation()
}

function findNodesType(list: Nodes.Node[], type: string) {
  const nodes = nodesToJSON(list)
  return nodes.find(node => node.__type === type)
}

function visitNode(node: any) {
  if (!node) return ''
  if (!node.nodes) {
    // guarantee to be an array
    node.nodes = []
  }
  const json = node.__type ? node : node.toJSON && node.toJSON()
  const handler = TYPE_VISITOR_MAP.get(json.__type)
  return handler ? handler(node) : ''
}

function recursiveSearchName<T = Nodes.Node>(data: any, property: keyof T, name: keyof T): any {
  return data[property]
    ? recursiveSearchName(data[property], property, name)
    : data[name]
}

// nodes
function visitNodes(list: Nodes.Node[] = []) {
  let text = ''
  const nodes = nodesToJSON(list)
  nodesLength = nodes.length
  nodes.forEach((node, i) => {
    nodesIndex = i
    if (node.__type === 'Comment') {
      const isInlineComment = nodes[i - 1] && (nodes[i - 1].lineno === node.lineno);
      text += visitComment(node, isInlineComment);
    } else {
      text += visitNode(node);
    }
  });
  nodesIndex = 0
  nodesLength = 0
  return text;
}

function visitNull() {
  return null
}

// handler import
function visitImport(node: Nodes.Import) {
  invariant(node, 'Missing node param');
  const before = handleLineno(node.lineno) + '@import '
  oldLineno = node.lineno
  let quote = ''
  let text = ''
  const nodes = nodesToJSON(node.path.nodes || [])
  nodes.forEach(node => {
    text += node.val
    if (!quote && node.quote) quote = node.quote
  })
  const result = text.replace(/\.styl$/g, '.scss')
  return `${before}${quote}${result}${quote};`
}

function visitSelector(node: Nodes.Node) {
  selectorLength++
  invariant(node, 'Missing node param');
  const nodes = nodesToJSON(node.segments)
  const endNode = nodes[nodes.length - 1]
  let before = ''
  if (endNode.lineno) {
    before = handleLineno(endNode.lineno)
    oldLineno = endNode.lineno
  }
  before += getIndentation()
  const segmentText = visitNodes(node.segments)
  selectorLength--
  return before + segmentText
}

function visitGroup(node: Nodes.Group) {
  invariant(node, 'Missing node param');
  const before = handleLinenoAndIndentation(node)
  oldLineno = node.lineno
  const nodes = nodesToJSON(node.nodes)
  let selector = ''
  nodes.forEach((node, idx) => {
    const temp = visitNode(node)
    const result = /^\n/.test(temp) ? temp : temp.replace(/^\s*/, '')
    selector += idx ? ', ' + result : result
  })
  const block = visitBlock(node.block)
  if (isKeyframes && /-|\*|\+|\/|\$/.test(selector)) {
    const len = getCharLength(selector, ' ') - 2
    return `\n${repeatString(' ', len)}#{${trimFirst(selector)}}${block}`
  }
  return selector + block
}

function visitBlock(node: Nodes.Block) {
  isBlock = true
  invariant(node, 'Missing node param');
  indentationLevel++
  const before = ' {'
  const after = `\n${repeatString(' ', (indentationLevel - 1) * 2)}}`
  const text = visitNodes(node.nodes)
  let result = text
  if (isFunction && !/@return/.test(text)) {
    result = ''
    const symbol = repeatString(' ', indentationLevel * 2)
    if (!/\n/.test(text)) {
      result += '\n'
      oldLineno++
    }
    if (!/\s/.test(text)) result += symbol
    result += returnSymbol + text
  }
  if (!/^\n\s*/.test(result)) result = '\n' + repeatString(' ', indentationLevel * 2) + result
  indentationLevel--
  isBlock = false
  return `${before}${result}${after}`
}

function visitLiteral(node: Nodes.Literal) {
  invariant(node, 'Missing node param');
  return node.val || ''
}

function visitProperty({ expr, lineno, segments }: Nodes.Property) {
  const suffix = ';'
  const before = handleLinenoAndIndentation({ lineno })
  oldLineno = lineno
  isProperty = true
  const segmentsText = visitNodes(segments)

  lastPropertyLineno = lineno
  // segmentsText length plus semicolon and space
  lastPropertyLength = segmentsText.length + 2
  if (get(expr, ['nodes', 'length']) === 1) {
    const expNode = expr.nodes[0]
    const ident = expNode.toJSON && expNode.toJSON() || {}
    if (ident.__type === 'Ident') {
      const identVal = get(ident, ['val', 'toJSON']) && ident.val.toJSON() || {}
      if (identVal.__type === 'Expression') {
        const beforeExpText = before + trimFirst(visitExpression(expr))
        const expText = `${before}${segmentsText}: $${ident.name};`
        isProperty = false
        PROPERTY_LIST.unshift({ prop: segmentsText, value: '$' + ident.name })
        return beforeExpText + expText
      }
    }
  }
  const expText = visitExpression(expr)
  PROPERTY_LIST.unshift({ prop: segmentsText, value: expText })
  isProperty = false
  return /\/\//.test(expText)
    ? `${before + segmentsText.replace(/^$/, '')}: ${expText}`
    : trimSemicolon(`${before + segmentsText.replace(/^$/, '')}: ${expText + suffix}`, ';')
}

function visitIdent({ val, name, rest, mixin, property }: Nodes.Ident) {
  identLength++
  const identVal = val && val.toJSON() || ''
  if (identVal.__type === 'Null' || !val) {
    if (isExpression) {
      if (property || isCall) {
        const propertyVal = PROPERTY_LIST.find(item => item.prop === name)
        if (propertyVal) {
          identLength--
          return propertyVal.value
        }
      }
    }
    if (selectorLength && isExpression && !binOpLength) {
      identLength--
      return `#{${name}}`
    }
    if (mixin) {
      identLength--
      return name === 'block' ? '@content;' : `#{$${name}}`
    }
    let nameText = (VARIABLE_NAME_LIST.indexOf(name) > -1 || GLOBAL_VARIABLE_NAME_LIST.indexOf(name) > -1)
      ? replaceFirstATSymbol(name)
      : name
    if (FUNCTION_PARAMS.indexOf(name) > -1) nameText = replaceFirstATSymbol(nameText)
    identLength--
    return rest ? `${nameText}...` : nameText
  }
  if (identVal.__type === 'Expression') {
    if (findNodesType(identVal.nodes, 'Object')) OBJECT_KEY_LIST.push(name)
    const before = handleLinenoAndIndentation(identVal)
    oldLineno = identVal.lineno
    const nodes = nodesToJSON(identVal.nodes || [])
    let expText = ''
    nodes.forEach((node, idx) => {
      expText += idx ? ` ${visitNode(node)}` : visitNode(node)
    })
    VARIABLE_NAME_LIST.push(name)
    identLength--
    return `${before}${replaceFirstATSymbol(name)}: ${trimFnSemicolon(expText)};`
  }
  if (identVal.__type === 'Function') {
    identLength--
    return visitFunction(identVal)
  }
  let identText = visitNode(identVal)
  identLength--
  return `${replaceFirstATSymbol(name)}: ${identText};`
}

function visitExpression(node: Nodes.Expression) {
  invariant(node, 'Missing node param');
  isExpression = true
  const nodes = nodesToJSON(node.nodes)
  const comments: Nodes.Comment[] = []
  let subLineno = 0
  let result = ''
  let before = ''

  if (nodes.every(node => node.__type !== 'Expression')) {
    subLineno = nodes.map(node => node.lineno).sort((curr, next) => next - curr)[0]
  }

  let space = ''
  if (subLineno > node.lineno) {
    before = handleLineno(subLineno)
    oldLineno = subLineno
    if (subLineno > lastPropertyLineno) space = repeatString(' ', lastPropertyLength)
  } else {
    before = handleLineno(node.lineno)
    const callNode = nodes.find(node => node.__type === 'Call')
    if (callNode && !isObject && !isCallMixin()) space = repeatString(' ', lastPropertyLength)
    oldLineno = node.lineno
  }

  nodes.forEach((node, idx) => {
    // handle inline comment
    if (node.__type === 'Comment') {
      comments.push(node)
    } else {
      const nodeText = visitNode(node)
      const symbol = isProperty && node.nodes.length ? ',' : ''
      result += idx ? symbol + ' ' + nodeText : nodeText
    }
  })

  let commentText = comments.map(node => visitNode(node)).join(' ')
  commentText = commentText.replace(/^ +/, ' ')

  isExpression = false

  if (isProperty && /\);/g.test(result)) result = trimFnSemicolon(result) + ';'
  if (commentText) result = result + ';' + commentText
  if (isCall || binOpLength) {
    if (callName === 'url') return result.replace(/\s/g, '')
    return result
  }

  if (!returnSymbol || isIfExpression) {
    return (before && space) ? trimSemicolon(before + getIndentation() + space + result, ';') : result
  }
  let symbol = ''
  if (nodesIndex + 1 === nodesLength) symbol = returnSymbol
  return before + getIndentation() + symbol + result
}

function visitCall({ name, args, lineno, block }: Nodes.Call) {
  isCall = true
  callName = name
  let blockText = ''
  let before = handleLineno(lineno)
  oldLineno = lineno
  if (isCallMixin() || block || selectorLength || GLOBAL_MIXIN_NAME_LIST.indexOf(callName) > -1) {
    before = before || '\n'
    before += getIndentation()
    before += '@include '
  }
  const argsText = visitArguments(args).replace(/;/g, '')
  isCallParams = false
  if (block) blockText = visitBlock(block)
  callName = ''
  isCall = false
  return `${before + name}(${argsText})${blockText};`
}

function visitArguments(node: Nodes.Expression) {
  invariant(node, 'Missing node param');
  isArguments = true
  const nodes = nodesToJSON(node.nodes)
  paramsLength += nodes.length
  let text = ''
  nodes.forEach((node, idx) => {
    const prefix = idx ? ', ' : ''
    let nodeText = visitNode(node)
    if (node.__type === 'Call') isCallParams = true
    if (GLOBAL_VARIABLE_NAME_LIST.indexOf(nodeText) > -1) nodeText = replaceFirstATSymbol(nodeText)
    if (isFunction && !/(^'|")|\d/.test(nodeText) && nodeText) nodeText = replaceFirstATSymbol(nodeText)
    text += prefix + nodeText
    paramsLength--
  })
  if (paramsLength === 0) isArguments = false
  return text || ''
}

function visitRGBA(node: Nodes.RGBA) {
  return node.raw.replace(/ /g, '')
}

function visitUnit({ val, type }: Nodes.Unit
  ) {
  return type ? val + type : val
}

function visitBoolean(node: Nodes.Boolean) {
  return node.val
}

function visitIf(node: Nodes.If, symbol = '@if ') {
  ifLength++
  invariant(node, 'Missing node param');
  let before = ''
  isIfExpression = true
  if (symbol === '@if ') {
    before += handleLinenoAndIndentation(node)
    oldLineno = node.lineno
  }

  const condNode = node.cond?.toJSON() || {}
  isCond = true
  isNegate = node.negate
  const condText = trimSemicolon(visitNode(condNode))
  isCond = false
  isNegate = false
  isIfExpression = false
  const block = visitBlock(node.block)
  let elseText = ''
  if (node.elses?.length) {
    const elses = nodesToJSON(node.elses)
    elses.forEach(node => {
      oldLineno++
      if (node.__type === 'If') {
        elseText += visitIf(node, ' @else if ')
      } else {
        elseText += ' @else' + visitBlock(node)
      }
    })
  }
  ifLength--
  return before + symbol + condText + block + elseText
}

function visitFunction(node: Nodes.Function) {
  invariant(node, 'Missing node param');
  isFunction = true
  const notMixin = !isFunctionMixin(node.block.nodes)
  let before = handleLineno(node.lineno)
  oldLineno = node.lineno
  let symbol = ''
  if (notMixin) {
    returnSymbol = '@return '
    symbol = '@function'
  } else {
    returnSymbol = ''
    symbol = '@mixin'
  }
  const params = nodesToJSON(node.params.nodes || [])
  FUNCTION_PARAMS = params.map(par => par.name)
  let paramsText = ''
  params.forEach((node, idx) => {
    const prefix = idx ? ', ' : ''
    const nodeText = visitNode(node)
    VARIABLE_NAME_LIST.push(nodeText)
    paramsText += prefix + replaceFirstATSymbol(nodeText)
  })
  paramsText = paramsText.replace(/\$ +\$/g, '$')
  const fnName = `${symbol} ${node.name}(${trimSemicolon(paramsText)})`
  const block = visitBlock(node.block)
  returnSymbol = ''
  isFunction = false
  FUNCTION_PARAMS = []
  return before + fnName + block
}

function visitTernary({ cond, lineno }: Nodes.Ternary) {
  let before = handleLineno(lineno)
  oldLineno = lineno
  return before + visitBinOp(cond)
}

function visitBinOp({ op, left, right }: Nodes.BinOp) {
  binOpLength++
  function visitNegate(op: string) {
    if (!isNegate || (op !== '==' && op !== '!=')) {
      return op !== 'is defined' ? op : ''
    }
    return op === '==' ? '!=' : '=='
  }

  if (op === '[]') {
    const leftText = visitNode(left)
    const rightText = visitNode(right)
    binOpLength--
    if (isBlock)
      return `map-get(${leftText}, ${rightText});`
  }

  const leftExp = left ? left.toJSON() : null
  const rightExp = right ? right.toJSON() : null
  const isExp = rightExp?.__type === 'Expression'
  const expText = isExp ? `(${visitNode(rightExp)})` : visitNode(rightExp)
  const symbol = OPERATION_MAP.get(op) ?? visitNegate(op)
  const endSymbol = op === 'is defined' ? '!default;' : ''

  binOpLength--
  return endSymbol
    ? `${trimSemicolon(visitNode(leftExp)).trim()} ${endSymbol}`
    : `${visitNode(leftExp)} ${symbol} ${expText}`
}

function visitUnaryOp({ op, expr }: Nodes.UnaryOp) {
  return `${OPERATION_MAP.get(op) || op}(${visitExpression(expr)})`
}

function visitEach(node: Nodes.Each) {
  invariant(node, 'Missing node param');
  let before = handleLineno(node.lineno)
  oldLineno = node.lineno
  const expr = node.expr && node.expr.toJSON()
  const exprNodes = nodesToJSON(expr.nodes)
  let exprText = `@each $${node.val} in `
  VARIABLE_NAME_LIST.push(node.val)
  exprNodes.forEach((node, idx) => {
    const prefix = node.__type === 'Ident' ? '$' : ''
    const exp = prefix + visitNode(node)
    exprText += idx ? `, ${exp}` : exp
  })
  if (/\.\./.test(exprText)) {
    exprText = exprText.replace('@each', '@for').replace('..', 'through').replace('in', 'from')
  }
  const blank = getIndentation()
  before += blank
  const block = visitBlock(node.block).replace(`$${node.key}`, '')
  return before + exprText + block
}

function visitKeyframes(node: Nodes.Keyframes) {
  isKeyframes = true
  let before = handleLinenoAndIndentation(node)
  oldLineno = node.lineno
  let resultText = ''
  const name = visitNodes(node.segments)
  const isMixin = !!findNodesType(node.segments, 'Expression')
  const blockJson = node.block.toJSON()
  if (blockJson.nodes.length && blockJson.nodes[0].toJSON().__type === 'Expression') {
    throw new Error(`Syntax Error Please check if your @keyframes ${name} are correct.`)
  }
  const block = visitBlock(node.block)
  const text = isMixin ? `#{${name}}${block}` : name + block
  if (autoprefixer) {
    KEYFRAMES_LIST.forEach(name => {
      resultText += before + name + text
    })
  } else {
    resultText += before + '@keyframes ' + text
  }
  isKeyframes = false
  return resultText
}

function visitExtend(node: Nodes.Extend) {
  const before = handleLinenoAndIndentation(node)
  oldLineno = node.lineno
  const text = visitNodes(node.selectors)
  return `${before}@extend ${trimFirst(text)};`
}

function visitQueryList(node:Nodes.QueryList) {
  let text = ''
  const nodes = nodesToJSON(node.nodes)
  nodes.forEach((node, idx) => {
    const nodeText = visitNode(node)
    text += idx ? `, ${nodeText}` : nodeText
  })
  return text
}

function visitQuery(node: Nodes.Query) {
  const type = visitNode(node.type) || ''
  const nodes = nodesToJSON(node.nodes)
  let text = ''
  nodes.forEach((node, idx) => {
    const nodeText = visitNode(node)
    text += idx ? ` and ${nodeText}` : nodeText
  })
  return type === 'screen' ? `${type} and ${text}` : `${type}${text}`
}

function visitMedia(node: Nodes.Media) {
  const before = handleLinenoAndIndentation(node)
  oldLineno = node.lineno
  const val = get(node, ['val'], {})
  const nodeVal = val.toJSON && val.toJSON() || {}
  const valText = visitNode(nodeVal)
  const block = visitBlock(node.block)
  return `${before}@media ${valText + block}`
}

function visitFeature(node: Nodes.Property) {
  const segmentsText = visitNodes(node.segments)
  const expText = visitExpression(node.expr)
  return `(${segmentsText}: ${expText})`
}

function visitComment(node: Nodes.Comment, isInlineComment: boolean) {
  const before = isInlineComment ? ' ' : handleLinenoAndIndentation(node);
  const matchs = node.str.match(/\n/g)
  oldLineno = node.lineno
  if (Array.isArray(matchs)) oldLineno += matchs.length
  const text = node.suppress ? node.str : node.str.replace(/^\/\*/, '/*!')
  return before + text
}

function visitMember({ left, right }: Nodes.Member) {
  const searchName = recursiveSearchName<Nodes.Member>(left, 'left', 'name')
  if (searchName && OBJECT_KEY_LIST.indexOf(searchName) > -1) {
    return `map-get(${visitNode(left)}, ${quote + visitNode(right) + quote})`
  }
  return `${visitNode(left)}.${visitNode(right)}`
}

function visitObject({ vals, lineno }: Nodes.Object) {
  isObject = true
  indentationLevel++
  const before = repeatString(' ', indentationLevel * 2)
  let result = ``
  let count = 0
  for (let key in vals) {
    const resultVal = visitNode(vals[key]).replace(/;/, '')
    const symbol = count ? ',' : ''
    result += `${symbol}\n${before + quote + key + quote}: ${resultVal}`
    count++
  }
  const totalLineno = lineno + count + 2
  oldLineno = totalLineno > oldLineno ? totalLineno : oldLineno
  indentationLevel--
  isObject = false
  return `(${result}\n${repeatString(' ', indentationLevel * 2)})`
}

function visitCharset({ val: { val: value, quote }, lineno }: Nodes.Charset) {
  const before = handleLineno(lineno)
  oldLineno = lineno
  return `${before}@charset ${quote + value + quote};`
}

function visitNamespace({ val, lineno }: Nodes.Namespace) {
  isNamespace = true
  const name = '@namespace '
  const before = handleLineno(lineno)
  oldLineno = lineno
  if (val.type === 'string') {
    const { val: value, quote: valQuote } = val.val
    isNamespace = false
    return before + name + valQuote + value + valQuote + ';'
  }
  return before + name + visitNode(val)
}

function visitAtrule({ type, block, lineno, segments }: Nodes.Atrule) {
  const before = handleLineno(lineno)
  oldLineno = lineno
  const typeText = segments.length ? `@${type} ` : `@${type}`
  return `${before + typeText + visitNodes(segments) + visitBlock(block)}`
}

function visitSupports({ block, lineno, condition }: Nodes.Supports) {
  let before = handleLineno(lineno)
  oldLineno = lineno
  before += getIndentation()
  return `${before}@Supports ${visitNode(condition) + visitBlock(block)}`
}

function visitString({ val, quote }: Nodes.String) {
  return quote + val + quote
}

function visitReturn(node: Nodes.Return) {
  if (isFunction) return visitExpression(node.expr).replace(/\n\s*/g, '')
  return '@return $' + visitExpression(node.expr).replace(/\$|\n\s*/g, '')
}

// handle stylus Syntax Tree
export default function visitor(ast: Nodes.Root, options: any, globalVariableList: string[], globalMixinList: string[]) {
  quote = options.quote
  autoprefixer = options.autoprefixer
  GLOBAL_MIXIN_NAME_LIST = globalMixinList
  GLOBAL_VARIABLE_NAME_LIST = globalVariableList
  let result = visitNodes(ast.nodes) || ''
  const indentation = ' '.repeat(options.indentVueStyleBlock)
  result = result.replace(/(.*\S.*)/g, `${indentation}$1`);
  result = result.replace(/(.*)>>>(.*)/g, `$1/deep/$2`)
  oldLineno = 1
  FUNCTION_PARAMS = []
  OBJECT_KEY_LIST = []
  PROPERTY_LIST = []
  VARIABLE_NAME_LIST = []
  GLOBAL_MIXIN_NAME_LIST = []
  GLOBAL_VARIABLE_NAME_LIST = []
  return result + '\n'
}
