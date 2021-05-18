import { DynControlConfig } from './control-config.types';
import { DynControlMode, DynControlModes } from './control-mode.types';
import { DynControlParams } from './control-params.types';

// single form container/group/array config
export interface DynBaseConfig<
TMode extends DynControlMode = DynControlMode,
TParams extends DynControlParams = DynControlParams
> extends DynControlConfig<TParams> {
  // form/data hierarchy
  name?: string; // optional fieldName
  controls?: DynBaseConfig<TMode>[];
  modes?: DynControlModes<TMode>;
  isolated?: boolean; // not part of the form hierarchy
}

// single form control config
export interface DynConfig<
TMode extends DynControlMode = DynControlMode,
TParams extends DynControlParams = DynControlParams
> extends DynBaseConfig<TMode, TParams> {
  // form/data hierarchy
  name: string; // mandatory fieldName
}

// useful types for Factory Method partial params
export type DynPartialGroupConfig<
TMode extends DynControlMode = DynControlMode,
TParams extends DynControlParams = DynControlParams
> = Omit<DynBaseConfig<TMode, TParams>, 'control'>;

export type DynPartialControlConfig<
TMode extends DynControlMode = DynControlMode,
TParams extends DynControlParams = DynControlParams
> = Omit<DynConfig<TMode, TParams>, 'control'>;
