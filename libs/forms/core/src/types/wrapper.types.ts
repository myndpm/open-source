import { Observable } from 'rxjs';
import { DynFunctionFn, DynParams } from './params.types';
import { DynConfigMap, DynConfigProvider } from './provider.types';

export type DynWrapperId = string; // Wrapper ID

export interface DynWrapperConfig<TParams extends DynParams = DynParams> {
  wrapper: DynWrapperId;
  params?: TParams | Observable<TParams>;
  paramFns?: DynConfigMap<DynConfigProvider<DynFunctionFn>>;
}

export type DynConfigWrapper<TParams extends DynParams = DynParams> = DynWrapperId | DynWrapperConfig<TParams>;
