import invariant from 'invariant';
import get from 'lodash.get';
import { Nodes, nodes } from 'stylus';
import { nodesToJSON } from '../parser/utils';
import { Options } from '../schema';
import { getCharLength, repeatString, replaceFirstATSymbol, trimFirst } from '../utils';

let QUOTE = `'`;
let AUTOPREFIXER = true;
let VARIABLES: string[] = [];
let MIXINS: string[] = [];

let FNPARAMS: string[] = [];
let KEYLIST: string[] = [];
let PROPLIST: { prop: string; value: any }[] = [];
let VARLIST: string[] = [];

let callName = '';
let lastPropertyLineno = 0;
let lastPropertyLength = 0;
let returnSymbol = '';

let isArguments = false;
let isBlock = false;
let isCall = false;
let isCallParams = false;
let isCond = false;
let isExpression = false;
let isFunction = false;
let isIfExpression = false;
let isImport = false;
let isKeyframes = false;
let isNamespace = false;
let isNegate = false;
let isObject = false;
let isProperty = false;

let binOpLength = 0;
let identLength = 0;
let ifLength = 0;
let indentationLevel = 0;
let nodesIndex = 0;
let nodesLength = 0;
let oldLineno = 1;
let paramsLength = 0;
let selectorLength = 0;

const OPERATION_MAP = new Map([
  ['&&', 'and'],
  ['!', 'not'],
  ['||', 'or'],
]);

const KEYFRAMES_LIST = [
  '@-webkit-keyframes ',
  '@-moz-keyframes ',
  '@-ms-keyframes ',
  '@-o-keyframes ',
  '@keyframes ',
];

// handle stylus Syntax Tree
export function visitor(
  ast: Nodes.Root,
  options: Options,
  variables: string[],
  mixins: string[],
): string {
  QUOTE = options.quote === 'single' ? `'` : `"`;
  AUTOPREFIXER = options.autoprefixer;
  VARIABLES = variables;
  MIXINS = mixins;
  oldLineno = 1;

  let result = handleNodes(ast.nodes) || '';

  FNPARAMS = [];
  KEYLIST = [];
  PROPLIST = [];
  VARLIST = [];
  MIXINS = [];
  VARIABLES = [];

  const indent = ' '.repeat(Number(options.indent));
  result = result.replace(/(.*\S.*)/g, `${indent}$1`);
  result = result.replace(/(.*)>>>(.*)/g, `$1/deep/$2`);
  return (result + '\n').replace(/^\n+/, '');
}

function handleNodes(items: Nodes.Node[] = []) {
  let text = '';
  nodesLength = items.length;
  items.forEach((node, i) => {
    nodesIndex = i;
    text += handleNode(node);
  });
  nodesIndex = 0;
  nodesLength = 0;
  return text;
}

function handleNode(node?: Nodes.Node): string {
  const handler = node && getHandler(node);
  const output = handler ? handler(node) : '';
  return output;
}

function getHandler(node: Nodes.Node): (node: any) => string {
  if (!(node as Nodes.Root).nodes) {
    (node as Nodes.Root).nodes = []; // FIXME use node.nodes?.forEach instead
  }
  const type = node.toJSON().__type;
  switch (type) {
    case 'Arguments': return handleArguments;
    case 'Atblock': return handleAtblock;
    case 'Atrule': return handleAtrule;
    case 'BinOp': return handleBinOp;
    case 'Block': return handleBlock;
    case 'Boolean': return handleBoolean;
    case 'Call': return handleCall;
    case 'Charset': return handleCharset;
    case 'Comment': return handleComment;
    case 'Each': return handleEach;
    case 'Expression': return handleExpression;
    case 'Extend': return handleExtend;
    case 'Feature': return handleFeature;
    case 'Function': return handleFunction;
    case 'Group': return handleGroup;
    case 'HSLA': return handleHSLA;
    case 'Ident': return handleIdent;
    case 'If': return handleIf;
    case 'Import': return handleImport;
    case 'Keyframes': return handleKeyframes;
    case 'Literal': return handleLiteral;
    case 'Media': return handleMedia;
    case 'Member': return handleMember;
    case 'Namespace': return handleNamespace;
    case 'Null': return () => 'null';
    case 'Object': return handleObject;
    case 'Params': return handleArguments;
    case 'Property': return handleProperty;
    case 'Query': return handleQuery;
    case 'QueryList': return handleQueryList;
    case 'Return': return handleReturn;
    case 'RGBA': return handleRGBA;
    case 'Selector': return handleSelector;
    case 'String': return handleString;
    case 'Supports': return handleSupports;
    case 'Ternary': return handleTernary;
    case 'UnaryOp': return handleUnaryOp;
    case 'Unit': return handleUnit;
    default: throw new Error(`No handler for '${type}`);
  }
  return () => '';
}

// handlers

function handleArguments(node: Nodes.Expression) {
  invariant(node, 'Missing node param');
  isArguments = true;

  paramsLength += node.nodes.length;
  let text = '';
  node.nodes.forEach((node, idx) => {
    const prefix = idx ? ', ' : '';
    let nodeText = handleNode(node);
    if (node instanceof nodes.Call) {
      isCallParams = true;
    }
    if (VARIABLES.includes(nodeText)) {
      nodeText = replaceFirstATSymbol(nodeText);
    }
    if (isFunction && !/(^'|")|\d/.test(nodeText) && nodeText) {
      nodeText = replaceFirstATSymbol(nodeText);
    }
    text += prefix + nodeText;
    paramsLength--;
  })
  if (paramsLength === 0) {
    isArguments = false;
  }
  return text || '';
}

function handleAtrule({ type, block, lineno, segments }: Nodes.Atrule): string {
  const before = handleLineno(lineno);
  oldLineno = lineno;
  const typeText = segments.length ? `@${type} ` : `@${type}`;
  return `${before + typeText + handleNodes(segments) + handleBlock(block)}`;
}

function handleAtblock(node: Nodes.Atblock): string {
  const before = handleLinenoAndIndentation(node);
  oldLineno = node.lineno;
  const valText = handleNode(node.val);
  const block = handleBlock(node.block);
  return `${before}@mixin ${valText + block}`;
}

function handleBinOp({ op, left, right }: Nodes.BinOp): string {
  binOpLength++;

  function handleNegate(op: string) {
    if (!isNegate || (op !== '==' && op !== '!=')) {
      return op !== 'is defined' ? op : '';
    }
    return op === '==' ? '!=' : '==';
  }

  if (op === '[]') {
    const leftText = handleNode(left);
    const rightText = handleNode(right);
    binOpLength--;
    if (isBlock) {
      return `map-get(${leftText}, ${rightText});`;
    }
  }

  const isExp = right instanceof nodes.Expression;
  const expText = isExp ? `(${handleNode(right)})` : handleNode(right);
  const symbol = OPERATION_MAP.get(op) ?? handleNegate(op);
  const endSymbol = op === 'is defined' ? '!default;' : '';

  binOpLength--;
  return endSymbol
    ? `${trimSemicolon(handleNode(left)).trim()} ${endSymbol}`
    : `${handleNode(left)} ${symbol} ${expText}`;
}

function handleBlock(node: Nodes.Block | Nodes.Expression): string {
  isBlock = true;
  invariant(node, 'Missing node param');
  indentationLevel++;

  const before = ' {';
  const after = `\n${repeatString(' ', (indentationLevel - 1) * 2)}}`;
  const text = handleNodes(node.nodes);
  let result = text;

  if (isFunction && !/@return/.test(text)) {
    result = '';
    const symbol = repeatString(' ', indentationLevel * 2);
    if (!/\n/.test(text)) {
      result += '\n';
      oldLineno++;
    }
    if (!/\s/.test(text)) {
      result += symbol;
    }
    result += returnSymbol + text;
  }

  if (!/^\n\s*/.test(result)) {
    result = '\n' + repeatString(' ', indentationLevel * 2) + result;
  }

  indentationLevel--;
  isBlock = false;
  return `${before}${result}${after}`;
}

function handleBoolean(node: Nodes.Boolean): string {
  return node.toString();
}

function handleCall({ name, args, lineno, block }: Nodes.Call): string {
  isCall = true;
  callName = name;

  let blockText = '';
  let before = '';
  if (!isImport) {
    if (!isExpression && lineno) {
      before = handleLineno(lineno);
      oldLineno = lineno;
    }
    if (isCallMixin() || block || selectorLength || MIXINS.includes(callName)) {
      before += '@include ';
    }
  }
  const argsText = handleArguments(args).replace(/;/g, '');
  isCallParams = false;
  if (block) {
    blockText = handleBlock(block);
  }
  callName = '';
  isCall = false;
  return `${before + name}(${argsText})${blockText};`;
}

function handleCharset({ val: { val: value, quote }, lineno }: Nodes.Charset): string {
  const before = handleLineno(lineno);
  oldLineno = lineno;
  return `${before}@charset ${quote + value + quote};`;
}

function handleComment(node: Nodes.Comment): string {
  const before = node.inline ? ' ' : handleLinenoAndIndentation(node);
  const matches = node.str.match(/\n/g);
  oldLineno = node.lineno;
  if (Array.isArray(matches)) {
    oldLineno += matches.length;
  }
  return node.suppress
    ? before + node.str
    : before + node.str.replace(/^\/\*/, '/*!');
}

function handleEach(node: Nodes.Each): string {
  invariant(node, 'Missing node param');
  let before = handleLineno(node.lineno);
  oldLineno = node.lineno;

  let exprText = `@each ${node.val}${node.key ? `, ${node.key}` : ''} in `;
  VARIABLES.push(node.val);
  node.expr.nodes.forEach((node, idx) => {
    const exp = handleNode(node);
    exprText += idx ? `, ${exp}` : exp;
  });

  if (/\.\./.test(exprText)) {
    exprText = exprText.replace('@each', '@for').replace('..', 'through').replace('in', 'from');
  }

  const blank = getIndentation();
  before += blank;
  return before + exprText + handleBlock(node.block);
}

function handleFeature(node: Nodes.Property) {
  const segmentsText = handleNodes(node.segments);
  const expText = handleExpression(node.expr);
  return `(${segmentsText}: ${expText})`;
}

function handleExpression(node: Nodes.Expression): string {
  invariant(node, 'Missing node param');
  isExpression = true;

  const comments: Nodes.Comment[] = [];
  let subLineno = node.lineno;
  let result = '';
  let before = '';

  if (node.nodes?.every(node => !(node instanceof nodes.Expression))) {
    subLineno = node.nodes.map(node => node.lineno).sort((curr, next) => next - curr)[0];
  }

  let space = '';
  before = handleLinenoAndIndentation({ lineno: subLineno });
  oldLineno = subLineno;
  if (subLineno > node.lineno) {
    if (subLineno > lastPropertyLineno) {
      space = repeatString(' ', lastPropertyLength);
    }
  } else {
    const callNode = node.nodes?.find(node => node instanceof nodes.Call);
    if (callNode && !isObject && !isCallMixin()) {
      space = repeatString(' ', lastPropertyLength);
    }
  }

  node.nodes?.forEach((node, idx) => {
    // handle inline comment
    if (node instanceof nodes.Comment) {
      comments.push(node);
    } else {
      const nodeText = handleNode(node);
      const symbol = isProperty && (node as Nodes.Root).nodes.length ? ',' : '';
      result += idx ? `${symbol} ${nodeText}` : nodeText;
    }
  });
  result = result.replace(' / ', '/'); // font-size

  let commentText = comments.map(node => handleNode(node)).join(' ');
  commentText = commentText.replace(/^ +/, ' ');

  isExpression = false;

  if (isProperty && /\);/g.test(result)) {
    result = trimFnSemicolon(result) + ';';
  }
  if (commentText) {
    result = result + ';' + commentText;
  }
  if (isCall || binOpLength) {
    return callName === 'url' ? result.replace(/\s/g, '') : result;
  }

  if (!returnSymbol || isIfExpression) {
    return before && space
      ? trimSemicolon(`${before}${getIndentation()}${space}${result}`, ';')
      : `${before}${result}`;
  }

  let symbol = '';
  if (nodesIndex + 1 === nodesLength) {
    symbol = returnSymbol;
  }
  return `${before}${getIndentation()}${symbol}${result}`;
}

function handleExtend(node: Nodes.Extend) {
  const before = handleLinenoAndIndentation(node);
  oldLineno = node.lineno;
  const text = handleNodes(node.selectors);
  return `${before}@extend ${trimFirst(text)};`;
}

function handleFunction(node: Nodes.Function): string {
  invariant(node, 'Missing node param');
  isFunction = true;

  const notMixin = !isFunctionMixin(node.block.nodes);
  const before = handleLineno(node.lineno);
  oldLineno = node.lineno;
  let symbol = '';
  if (notMixin) {
    returnSymbol = '@return ';
    symbol = '@function';
  } else {
    returnSymbol = '';
    symbol = '@mixin';
  }

  const params = nodesToJSON(node.params.nodes || []);
  FNPARAMS = params.map(par => par.name);
  let paramsText = '';
  (node.params.nodes || []).forEach((node, idx) => {
    const prefix = idx ? ', ' : '';
    const nodeText = handleNode(node);
    VARLIST.push(nodeText);
    paramsText += prefix + replaceFirstATSymbol(nodeText);
  })
  paramsText = paramsText.replace(/\$ +\$/g, '$');
  const fnName = `${symbol} ${node.name}(${trimSemicolon(paramsText)})`;
  const block = handleBlock(node.block);

  returnSymbol = '';
  isFunction = false;
  FNPARAMS = [];
  return before + fnName + block;
}

function handleGroup(node: Nodes.Group): string {
  invariant(node, 'Missing node param');
  const before = handleLinenoAndIndentation(node);
  oldLineno = node.lineno;

  let selector = '';
  node.nodes.forEach((node, idx) => {
    const temp = handleNode(node);
    const result = /^\n/.test(temp) ? temp : temp.replace(/^\s*/, '');
    selector += idx ? ', ' + result : result;
  })

  const block = handleBlock(node.block);
  if (isKeyframes && /-|\*|\+|\/|\$/.test(selector)) {
    const len = getCharLength(selector, ' ') - 2;
    return `\n${repeatString(' ', len)}#{${trimFirst(selector)}}${block}`;
  }
  return before + selector + block;
}

function handleHSLA(node: Nodes.HSLA): string {
  return node.rgba.raw.replace(/ /g, '');
}

function handleIdent(node: Nodes.Ident): string {
  identLength++;
  const { rest, property } = node.toJSON();

  if (!node.val || node.val instanceof nodes.Null) {
    if (isExpression && (property || isCall)) {
      const propertyVal = PROPLIST.find(item => item.prop === node.name);
      if (propertyVal) {
        identLength--;
        return propertyVal.value;
      }
    }
    if (selectorLength && isExpression && !binOpLength) {
      identLength--;
      return `#{${node.name}}`;
    }
    if (node.mixin) {
      let before = '';
      if (node.val?.lineno) {
        before = handleLinenoAndIndentation(node.val);
        oldLineno = node.val.lineno;
      }
      const mixinValue = node.name === 'block' ? '@content;' : `@include ${replaceFirstATSymbol(node.name, '')};`;
      identLength--;
      return `${before}${mixinValue}`;
    }
    let nameText = (VARLIST.includes(node.name) || VARIABLES.includes(node.name))
      ? replaceFirstATSymbol(node.name)
      : node.name;
    if (FNPARAMS.includes(node.name)) {
      nameText = replaceFirstATSymbol(nameText);
    }
    identLength--;
    return rest ? `${nameText}...` : nameText;
  }

  if (node.val instanceof nodes.Expression) {
    const comments: Nodes.Comment[] = [];
    if (findNodesType(node.val.nodes, 'Object')) {
      KEYLIST.push(node.name);
    }
    const before = handleLinenoAndIndentation(node.val);
    oldLineno = node.val.lineno;
    let expText = '';
    (node.val.nodes || []).forEach((node, idx) => {
      if (node instanceof nodes.Comment) {
        comments.push(node);
      } else {
        expText += idx ? ` ${handleNode(node)}` : handleNode(node);
      }
    });
    const commentText = comments
      .map(node => handleNode(node))
      .join(' ')
      .replace(/^ +/, ' ');
    VARLIST.push(node.name);
    identLength--;
    return `${before}${replaceFirstATSymbol(node.name)}: ${trimFnSemicolon(expText)}; ${commentText}`;
  }

  if (node.val instanceof nodes.Function) {
    identLength--;
    return handleFunction(node.val);
  }

  const identText = handleNode(node.val);
  identLength--;
  return `${replaceFirstATSymbol(node.name)}: ${identText};`;
}

function handleIf(node: Nodes.If, symbol = '@if '): string {
  ifLength++;
  invariant(node, 'Missing node param');

  let before = '';
  isIfExpression = true;
  if (symbol === '@if ') {
    before += handleLinenoAndIndentation(node);
    oldLineno = node.lineno;
  }

  const condNode = node.cond || null;
  isCond = true;
  isNegate = node.negate;

  const condText = trimSemicolon(handleNode(condNode));
  isCond = false;
  isNegate = false;
  isIfExpression = false;

  const block = handleBlock(node.block);
  let elseText = '';
  if (node.elses?.length) {
    node.elses.forEach(node => {
      oldLineno++;
      if (node instanceof nodes.If) {
        elseText += handleIf(node, ' @else if ');
      } else {
        elseText += ' @else' + handleBlock(node);
      }
    })
  }

  ifLength--;
  return before + symbol + condText + block + elseText;
}

function handleImport(node: Nodes.Import): string {
  invariant(node, 'Missing node param');
  isImport = true;
  const before = handleLineno(node.lineno) + '@import ';
  oldLineno = node.lineno;

  let text = '';
  (node.path.nodes || []).forEach(node => {
    text += handleNode(node);
  });

  isImport = false;
  const result = trimSemicolon(text.replace(/\.styl/g, ''));
  return `${before}${result};`;
}

function handleKeyframes(node: Nodes.Keyframes): string {
  isKeyframes = true;
  const before = handleLinenoAndIndentation(node);
  oldLineno = node.lineno;

  let resultText = '';
  const name = handleNodes(node.segments);
  const isMixin = !!findNodesType(node.segments, 'Expression');
  if (node.block.nodes.length && node.block.first instanceof nodes.Expression) {
    throw new Error(`Syntax Error Please check if your @keyframes ${name} are correct.`);
  }
  const block = handleBlock(node.block);
  const text = isMixin ? `#{${name}}${block}` : name + block;
  if (AUTOPREFIXER) {
    KEYFRAMES_LIST.forEach(name => {
      resultText += before + name + text;
    });
  } else {
    resultText += before + '@keyframes ' + text;
  }
  isKeyframes = false;
  return resultText;
}

function handleLiteral(node: Nodes.Literal): string {
  invariant(node, 'Missing node param');
  let before = '';
  if (node.lineno) {
    before = handleLineno(node.lineno);
    oldLineno = node.lineno;
  }
  return before + (node.val || '');
}

function handleMedia(node: Nodes.Media): string {
  const before = handleLinenoAndIndentation(node);
  oldLineno = node.lineno;
  let valText = handleNode(node.val);
  const block = handleBlock(node.block);
  if (valText[0] === '$') {
    valText = `#{${valText}}`;
  }
  return `${before}@media ${valText + block}`;
}

function handleMember({ left, right }: Nodes.Member) {
  const searchName = recursiveSearchName<Nodes.Member>(left, 'left', 'name');
  if (searchName && KEYLIST.includes(searchName)) {
    return `map-get(${handleNode(left)}, ${QUOTE + handleNode(right) + QUOTE})`;
  }
  return `${handleNode(left)}.${handleNode(right)}`;
}

function handleNamespace({ val, lineno }: Nodes.Namespace): string {
  isNamespace = true;
  const name = '@namespace ';
  const before = handleLineno(lineno);
  oldLineno = lineno;
  if (val.type === 'string') {
    const { val: value, quote: valQuote } = val.val;
    isNamespace = false;
    return before + name + valQuote + value + valQuote + ';';
  }
  return before + name + handleNode(val);
}

function handleObject({ vals, lineno }: Nodes.Object): string {
  isObject = true;
  indentationLevel++;

  const before = repeatString(' ', indentationLevel * 2);
  let result = '';
  let count = 0;
  for (const key in vals) {
    oldLineno = vals[key].lineno;
    const resultVal = handleNode(vals[key]).replace(/;/, '');
    const symbol = count ? ',' : '';
    result += `${symbol}\n${before + QUOTE + key + QUOTE}: ${resultVal}`;
    count++;
  }
  const totalLineno = lineno + count + 2;
  oldLineno = totalLineno > oldLineno ? totalLineno : oldLineno;
  indentationLevel--;
  isObject = false;

  return `(${result}\n${repeatString(' ', indentationLevel * 2)})`;
}

function handleProperty({ expr, lineno, segments }: Nodes.Property): string {
  const suffix = ';';
  const before = handleLinenoAndIndentation({ lineno });
  oldLineno = lineno;
  isProperty = true;

  const segmentsText = handleNodes(segments);
  lastPropertyLineno = lineno;
  // segmentsText length plus semicolon and space
  lastPropertyLength = segmentsText.length + 2;
  if (get(expr, ['nodes', 'length']) === 1) {
    const expNode = expr.nodes[0];
    if (expNode instanceof nodes.Ident) {
      if (expNode.val instanceof nodes.Expression) {
        const beforeExpText = before + trimFirst(handleExpression(expr));
        const expText = `${before}${segmentsText}: $${expNode.name};`;
        isProperty = false;
        PROPLIST.unshift({ prop: segmentsText, value: '$' + expNode.name });
        return beforeExpText + expText;
      }
    }
  }

  const expText = handleExpression(expr);
  PROPLIST.unshift({ prop: segmentsText, value: segmentsText.startsWith('--') ? segmentsText : expText });
  isProperty = false;
  return /\/\//.test(expText)
    ? `${before + segmentsText.replace(/^$/, '')}: ${expText}`
    : trimSemicolon(`${before + segmentsText.replace(/^$/, '')}: ${expText + suffix}`, ';');
}

function handleQuery(node: Nodes.Query): string {
  let text = '';
  node.nodes.forEach((node, idx) => {
    const nodeText = handleNode(node);
    text += idx ? ` and ${nodeText}` : nodeText;
  });
  return node.type === 'screen'
    ? `${node.type} and ${text}`
    : `${node.type}${text}`;
}

function handleQueryList(node:Nodes.QueryList): string {
  let text = '';
  node.nodes.forEach((node, idx) => {
    const nodeText = handleNode(node);
    text += idx ? `, ${nodeText}` : nodeText;
  });
  return text;
}

function handleReturn(node: Nodes.Return): string {
  if (isFunction) {
    return handleExpression(node.expr).replace(/\n\s*/g, '');
  }
  return '@return $' + handleExpression(node.expr).replace(/\$|\n\s*/g, '');
}

function handleRGBA(node: Nodes.RGBA): string {
  return node.raw.replace(/ /g, '');
}

function handleSelector(node: Nodes.Selector): string {
  invariant(node, 'Missing node param');
  selectorLength++;

  const endNode = node.segments[node.segments.length - 1];
  let before = '';
  if (endNode.lineno) {
    before = handleLineno(endNode.lineno);
    oldLineno = endNode.lineno;
  }
  before += getIndentation();
  const segmentText = handleNodes(node.segments);
  selectorLength--;
  return before + segmentText;
}

function handleString({ val, quote }: Nodes.String): string {
  return quote + val + quote;
}

function handleSupports({ block, lineno, condition }: Nodes.Supports): string {
  let before = handleLineno(lineno);
  oldLineno = lineno;
  before += getIndentation();
  return `${before}@Supports ${handleNode(condition) + handleBlock(block)}`;
}

function handleTernary({ cond, lineno }: Nodes.Ternary): string {
  const before = handleLineno(lineno);
  oldLineno = lineno;
  return before + handleBinOp(cond);
}

function handleUnaryOp({ op, expr }: Nodes.UnaryOp): string {
  return `${OPERATION_MAP.get(op) || op}(${handleNode(expr)})`;
}

function handleUnit({ val, type }: Nodes.Unit): string {
  return type ? `${val}${type}` : `${val}`;
}

// utils

function findNodesType(list: Nodes.Node[], type: string) {
  return list.find(node => node.toJSON().__type === type);
}

function getIndentation(sameLine?: boolean): string {
  return sameLine ? '' : repeatString(' ', indentationLevel * 2);
}

function handleLineno(lineno: number): string {
  return repeatString('\n', lineno - oldLineno);
}

function handleLinenoAndIndentation({ lineno }: { lineno: number }) {
  return handleLineno(lineno) + getIndentation(lineno === oldLineno);
}

function hasPropertyOrGroup(node: Nodes.Node): boolean {
  return node instanceof nodes.Property
    || node instanceof nodes.Group
    || node instanceof nodes.Atrule
    || node instanceof nodes.Media;
}

function isCallMixin() {
  return !ifLength && !isProperty && !isObject && !isNamespace && !isKeyframes && !isArguments && !identLength && !isCond && !isCallParams && !returnSymbol;
}

function isFunctionCallMixin(node: Nodes.Node): node is Nodes.Call {
  if (node instanceof nodes.Call) {
    return get(node, ['block', 'scope']) || MIXINS.includes(node.name);
  } else {
    return node instanceof nodes.If && isFunctionMixin(node.block.nodes);
  }
}

function isFunctionMixin(nodes: Nodes.Node[]): boolean {
  invariant(nodes, 'Missing nodes param');
  return nodes.some(node => hasPropertyOrGroup(node) || isFunctionCallMixin(node));
}

function recursiveSearchName<T = Nodes.Node>(data: any, property: keyof T, name: string): any {
  return data[property]
    ? recursiveSearchName(data[property], property, name)
    : data[name];
}

function trimFnSemicolon(res: string): string {
  return res.replace(/\);/g, ')');
}

function trimSemicolon(output: string, symbol = ''): string {
  return output.replace(/;/g, '') + symbol;
}
