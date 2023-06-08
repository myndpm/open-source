import { path as getPath, hasPath } from 'ramda';
import { DynHook } from '../types/events.types';
import { DynNode } from '../types/node.types';
import { DynTree } from '../types/utils/tree.types';

/** Call hooks algorithm reused in dyn-form and DynControlBase */
export function callHooks(
  children: DynNode[],
  { hook, payload, plain }: DynHook,
  force = false, // force execution on direct childs only (with plain false)
): void {
  children.forEach(node => {
    const fieldName = node.name;
    // validate the expected payload
    if (node.isolated || !force && !plain && (!payload || fieldName && !hasPath(fieldName.split('.'), payload))) {
      return;
    }
    node.callHook({
      hook,
      payload: force ? undefined : !plain && fieldName ? getPath(fieldName.split('.'), payload) : payload,
      plain,
    });
  });
}

/** Algorithm to search in a tree by name */
export function searchNode<T>(
  node: DynTree<T>,
  path: string,
): T|undefined {
  if (node.detached) {
    return undefined; // exclude leaf
  }

  let selector = path.slice(); // clone the path

  // continue to the children if there's no name
  if (node.name) {
    if (node.name === selector) {
      return node;
    } else if (selector.startsWith(`${node.name}.`)) {
      selector = selector.replace(`${node.name}.`, '')
    } else {
      return undefined; // not in this leaf
    }
  }

  // propagate the query to the children
  let result: T|undefined = undefined;
  node.children?.some(child => {
    result = searchNode(child, selector);
    return result ? true : false; // keep the first match
  });

  return result;
}

/** Algorithm to search in a tree by id */
export function searchNodeById<T>(
  node: DynTree<T>,
  dynId: string,
): T|undefined {
  if (node.detached) {
    return undefined; // exclude leaf
  }

  if (node.dynId === dynId) {
    return node;
  }

  // propagate the query to the children
  let result: T|undefined = undefined;
  node.children?.some(child => {
    result = searchNodeById(child, dynId);
    return result ? true : false; // keep the first match
  });

  return result;
}
