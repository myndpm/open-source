import { DynOption } from '@myndpm/dyn-forms/core';

export enum MyndAccessType {
  Unknown = "UNKNOWN",
  CodeBox = "CODE_BOX",
  SmartLock = "SMART_LOCK"
}

export const accessTypes: DynOption[] = [
  {
    value: null,
    text: 'None',
  },
  {
    value: MyndAccessType.Unknown,
    text: 'Unknown',
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
