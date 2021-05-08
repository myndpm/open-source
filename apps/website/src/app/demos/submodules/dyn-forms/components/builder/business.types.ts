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
    value: null,
    text: 'None',
  },
  {
    value: MyndAccessType.CodeBox,
    text: 'Code Box',
  },
  {
    value: MyndAccessType.SmartLock,
    text: 'Smart Lock',
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
    value: MyndUnitType.Normal,
    text: 'Normal',
  },
  {
    value: MyndUnitType.Parking,
    text: 'Parking',
  },
  {
    value: MyndUnitType.Storage,
    text: 'Storage',
  },
];

/**
 * Unit
 */
export interface IMyndUnit {
  unitType: MyndUnitType;
}
