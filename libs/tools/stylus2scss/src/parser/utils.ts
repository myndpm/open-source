import get from 'lodash.get';
import { Nodes, nodes } from 'stylus';

export function nodesToJSON(nodes: any[]): any[] {
  return nodes.map(node => ({
    nodes: [],
    ...node.toJSON(),
  }));
}

export function findVariable(
  node: Nodes.Node,
  variables: string[],
): void {
  if (node instanceof nodes.Ident && node.val instanceof nodes.Expression) {
    if (!variables.includes(node.name)) {
      variables.push(node.name);
    }
  }
}

export function findMixin(
  node: Nodes.Node,
  mixins: string[],
  functions: string[] = [],
) {
  // val -> obj, block -> obj, nodes -> arr
  if (node instanceof nodes.Function && !functions.includes(node.name)) {
    functions.push(node.name);
  }

  if (functions.length && (
    node instanceof nodes.Selector ||
    node instanceof nodes.Property ||
    isCallMixin(node)
  )) {
    functions.forEach(name => {
      if (!mixins.includes(name)) {
        mixins.push(name)
      }
    })
    functions = [];
  }

  if (node.val instanceof nodes.Node) {
    findMixin(node.val, mixins, functions)
  }

  const expr = get(node, 'expr');
  if (expr instanceof nodes.Node) {
    findMixin(expr, mixins, functions)
  }

  const block = get(node, 'expr');
  if (block instanceof nodes.Node) {
    findMixin(block, mixins, functions)
  }

  if (get(node, 'nodes')) {
    (node as unknown as Nodes.Root).nodes.forEach(
      item => findMixin(item, mixins, functions),
    );
  }

  return mixins;
}

function isCallMixin(node: Nodes.Node) {
  return node instanceof nodes.Call && get(node, 'block');
}
