import { DynControlConfig } from './control-config.types';
import { DynControlMode, DynControlModes } from './control-mode.types';
import { DynControlParams } from './control-params.types';

// single form container/group/array config
export interface DynBaseConfig<
C extends DynControlMode = DynControlMode,
P extends DynControlParams = DynControlParams
> extends DynControlConfig<P> {
  // form/data hierarchy
  name?: string; // optional fieldName
  controls?: DynBaseConfig<C>[];
  modes?: DynControlModes<C>;
}

// single form control config
export interface DynConfig<
C extends DynControlMode = DynControlMode,
P extends DynControlParams = DynControlParams
> extends DynBaseConfig<C, P> {
  // form/data hierarchy
  name: string; // mandatory fieldName
}

// useful types for Factory Method partial params
export type DynPartialGroupConfig<
C extends DynControlMode = DynControlMode,
P extends DynControlParams = DynControlParams
> = Omit<DynBaseConfig<C, P>, 'control'>;

export type DynPartialControlConfig<
C extends DynControlMode = DynControlMode,
P extends DynControlParams = DynControlParams
> = Omit<DynConfig<C, P>, 'control'>;
