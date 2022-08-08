import { Observable } from 'rxjs';
import { DynControlFunctionFn, DynControlParams } from './params.types';
import { DynConfigMap, DynConfigProvider } from './provider.types';

export type DynWrapperId = string; // Wrapper ID

export type DynWrapperConfig<TParams extends DynControlParams = DynControlParams> = {
  wrapper: DynWrapperId;
  params?: TParams | Observable<TParams>;
  paramFns?: DynConfigMap<DynConfigProvider<DynControlFunctionFn>>;
}

export type DynConfigWrapper<TParams extends DynControlParams = DynControlParams> = DynWrapperId | DynWrapperConfig<TParams>;
