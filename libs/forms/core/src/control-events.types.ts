/**
 * Visibility handled by dyn-factory
 */
export type DynControlVisibility = 'VISIBLE' | 'INVISIBLE' | 'HIDDEN';

/**
 * callHook contract
 */
export interface DynControlHook {
  hook: string;
  payload: any;
  plain?: boolean; // propagate the payload without modifications
}
