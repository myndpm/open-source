import { DynControlConfig } from './control-config.types';
import { DynControlMode, DynControlModes } from './control-mode.types';
import { DynControlParams } from './control-params.types';

// single form container/group/array config
export interface DynBaseConfig<
M extends DynControlMode = DynControlMode,
P extends DynControlParams = DynControlParams
> extends DynControlConfig<P> {
  // form/data hierarchy
  name?: string; // optional fieldName
  controls?: DynBaseConfig<M>[];
  modes?: DynControlModes<M>;
  isolated?: boolean; // not part of the form hierarchy
}

// single form control config
export interface DynConfig<
M extends DynControlMode = DynControlMode,
P extends DynControlParams = DynControlParams
> extends DynBaseConfig<M, P> {
  // form/data hierarchy
  name: string; // mandatory fieldName
}

// useful types for Factory Method partial params
export type DynPartialGroupConfig<
M extends DynControlMode = DynControlMode,
P extends DynControlParams = DynControlParams
> = Omit<DynBaseConfig<M, P>, 'control'>;

export type DynPartialControlConfig<
M extends DynControlMode = DynControlMode,
P extends DynControlParams = DynControlParams
> = Omit<DynConfig<M, P>, 'control'>;
