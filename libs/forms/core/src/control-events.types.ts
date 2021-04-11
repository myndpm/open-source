/**
 * callHook contract
 */
export interface DynControlHook {
  hook: string;
  payload: any;
  plain?: boolean; // propagate the payload without modifications
}
