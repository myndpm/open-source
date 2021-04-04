import { DynControlConfig } from './control-config.interface';
import { DynControlParams } from './control-params.interface';

export interface DynBaseConfig<
P extends DynControlParams = DynControlParams
> extends DynControlConfig<P> {
  // form/data hierarchy
  name?: string; // optional fieldName
  controls?: DynBaseConfig[];
  // contexts: { [display|table|filter]: DynControlConfig }
}

export interface DynConfig<
P extends DynControlParams = DynControlParams
> extends DynBaseConfig<P> {
  // form/data hierarchy
  name: string; // mandatory fieldName
}

export type DynPartialControlConfig<
P extends DynControlParams = DynControlParams
> = Omit<DynConfig<P>, 'control'>;
