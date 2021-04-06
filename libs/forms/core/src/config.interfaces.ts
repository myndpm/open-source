import { DynControlConfig } from './control-config.interface';
import { DynControlContext, DynControlContexts } from './control-contexts.interfaces';
import { DynControlParams } from './control-params.interfaces';

export interface DynBaseConfig<
C extends DynControlContext = DynControlContext,
P extends DynControlParams = DynControlParams
> extends DynControlConfig<P> {
  // form/data hierarchy
  name?: string; // optional fieldName
  controls?: DynBaseConfig<C>[];
  contexts?: DynControlContexts<C>;
}

export interface DynConfig<
C extends DynControlContext = DynControlContext,
P extends DynControlParams = DynControlParams
> extends DynBaseConfig<C, P> {
  // form/data hierarchy
  name: string; // mandatory fieldName
}

// useful for Factory Method partial params
export type DynPartialGroupConfig<
C extends DynControlContext = DynControlContext,
P extends DynControlParams = DynControlParams
> = Omit<DynBaseConfig<C, P>, 'control'>;

export type DynPartialControlConfig<
C extends DynControlContext = DynControlContext,
P extends DynControlParams = DynControlParams
> = Omit<DynConfig<C, P>, 'control'>;
