import { DynControlParams } from '@myndpm/dyn-forms/core';

export interface DynMatTableParams extends DynControlParams {
  title: string;
  addNewButtonText: string;
  emptyText?: string;
  headers: string[];
}
