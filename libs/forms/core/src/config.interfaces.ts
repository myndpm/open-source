import { DynControlConfig } from './control-config.interface';
import { DynControlContexts } from './control-contexts.interfaces';
import { DynControlParams } from './control-params.interfaces';

export interface DynBaseConfig<
P extends DynControlParams = DynControlParams
> extends DynControlConfig<P> {
  // form/data hierarchy
  name?: string; // optional fieldName
  controls?: DynBaseConfig[];
  contexts?: DynControlContexts;
}

export interface DynConfig<
P extends DynControlParams = DynControlParams
> extends DynBaseConfig<P> {
  // form/data hierarchy
  name: string; // mandatory fieldName
}

// useful for Factory Method partial params
export type DynPartialGroupConfig<
P extends DynControlParams = DynControlParams
> = Omit<DynBaseConfig<P>, 'control'>;

export type DynPartialControlConfig<
P extends DynControlParams = DynControlParams
> = Omit<DynConfig<P>, 'control'>;
