// form control type
export enum DynInstanceType {
  Wrapper = 'WRAPPER',
  Group = 'GROUP',
  Array = 'ARRAY',
  Control = 'CONTROL',
  Container = 'CONTAINER',
}

// plain/serializable arguments (non-functions)
export type DynConfigPrimitive = undefined | string | boolean | number | Set<any> | RegExp | DynConfigPrimitive[] | { [k: string]: DynConfigPrimitive };
export type DynConfigArgs = DynConfigPrimitive | DynConfigPrimitive[] | null;

/**
 * Visibility handled by DynControl
 */
export type DynVisibility = 'VISIBLE' | 'INVISIBLE' | 'HIDDEN';

/**
 * @deprecated use DynVisibility
 */
export type DynControlVisibility = DynVisibility;
