import { Observable } from 'rxjs';
import { DynFunctionFn, DynParams } from './params.types';
import { DynConfigMap, DynConfigProvider } from './provider.types';

export type DynWrapperId = string; // Wrapper ID

export type DynWrapperConfig<TParams extends DynParams = DynParams> = {
  wrapper: DynWrapperId;
  controlParams?: TParams | Observable<TParams>;
  params?: TParams | Observable<TParams>;
  paramFns?: DynConfigMap<DynConfigProvider<DynFunctionFn>>;
}

export type DynConfigWrapper<TParams extends DynParams = DynParams> = DynWrapperId | DynWrapperConfig<TParams>;
