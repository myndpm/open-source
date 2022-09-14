import { DynConfigWrapper, DynWrapperId } from '../types/wrapper.types';

/**
 * DynWrapperId extract util
 */
export function getWrapperId(config: DynConfigWrapper): DynWrapperId {
  return typeof config !== 'string' ? config.wrapper : config;
}
