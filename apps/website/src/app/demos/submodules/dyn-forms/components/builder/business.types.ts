import { DynOption } from '@myndpm/dyn-forms/core';

/**
 * Access Types
 */
export enum MyndAccessType {
  CodeBox = "CODE_BOX",
  SmartLock = "SMART_LOCK"
}

export const accessTypes: DynOption[] = [
  {
    key: null,
    value: 'None',
  },
  {
    key: MyndAccessType.CodeBox,
    value: 'Code Box',
  },
  {
    key: MyndAccessType.SmartLock,
    value: 'Smart Lock',
  },
];

/**
 * Unit Types
 */
export enum MyndUnitType {
  Normal = "NORMAL",
  Parking = "PARKING",
  Storage = "STORAGE"
}

export const unitTypes: DynOption[] = [
  {
    key: MyndUnitType.Normal,
    value: 'Normal',
  },
  {
    key: MyndUnitType.Parking,
    value: 'Parking',
  },
  {
    key: MyndUnitType.Storage,
    value: 'Storage',
  },
];

/**
 * Unit
 */
export interface IMyndUnit {
  unitType: MyndUnitType;
}
