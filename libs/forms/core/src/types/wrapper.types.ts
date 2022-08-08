import { Observable } from 'rxjs';
import { DynControlFunctionFn, DynParams } from './params.types';
import { DynConfigMap, DynConfigProvider } from './provider.types';

export type DynWrapperId = string; // Wrapper ID

export type DynWrapperConfig<TParams extends DynParams = DynParams> = {
  wrapper: DynWrapperId;
  params?: TParams | Observable<TParams>;
  paramFns?: DynConfigMap<DynConfigProvider<DynControlFunctionFn>>;
}

export type DynConfigWrapper<TParams extends DynParams = DynParams> = DynWrapperId | DynWrapperConfig<TParams>;
