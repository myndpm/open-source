import { DynControlConfig, DynControlVisibility } from './control.types';
import { DynMode, DynModes } from './mode.types';
import { DynParams } from './params.types';

// single form container/group/array config
export interface DynBaseConfig<
TMode extends DynMode = DynMode,
TParams extends DynParams = DynParams,
> extends DynControlConfig<TParams> {
  // form/data hierarchy
  name?: string; // optional fieldName
  controls?: DynBaseConfig<TMode>[];
  modes?: DynModes<TMode>;
  visibility?: DynControlVisibility;
  isolated?: boolean; // not part of the form hierarchy
  debug?: number;
}

// single form control config
export interface DynConfig<
TMode extends DynMode = DynMode,
TParams extends DynParams = DynParams,
> extends DynBaseConfig<TMode, TParams> {
  // form/data hierarchy
  name: string; // mandatory fieldName
}

// useful types for Factory Method partial params
export type DynPartialGroupConfig<
TMode extends DynMode = DynMode,
TParams extends DynParams = DynParams,
> = Omit<DynBaseConfig<TMode, TParams>, 'control'>;

export type DynPartialControlConfig<
TMode extends DynMode = DynMode,
TParams extends DynParams = DynParams,
> = Omit<DynConfig<TMode, TParams>, 'control'>;
