import { DynConfigWrapper, DynWrapperId } from '../types/wrapper.types';

/**
 * DynWrapperId extract util
 */
export function getWrapperId(config: DynConfigWrapper): DynWrapperId {
  return typeof config !== 'string' ? config.wrapper : config;
}

/**
 * Coerce boolean value
 */
export function coerceBoolean(value: any): boolean {
  const falsy = /^(?:f(?:alse)?|no?|0+)$/i;
  return !falsy.test(value) && !!value;
}
