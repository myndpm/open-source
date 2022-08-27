import { path as getPath, hasPath } from 'ramda';
import { DynHook } from '../types/events.types';
import { DynNode } from '../types/node.types';

/** Call hooks algorithm reused in dyn-form and DynControlBase */
export function callHooks(
  children: DynNode[],
  { hook, payload, plain }: DynHook,
  force = false,
): void {
  children.forEach(node => {
    const fieldName = node.name;
    // validate the expected payload
    if (!force && !plain && (!payload || fieldName && !hasPath(fieldName.split('.'), payload))) {
      return;
    }
    node.callHook({
      hook,
      payload: !force && !plain && fieldName ? getPath(fieldName.split('.'), payload) : payload,
      plain,
    });
  });
}

// TODO centralize dotted paths manipulation
