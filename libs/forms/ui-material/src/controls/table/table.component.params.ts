import { DynParams } from '@myndpm/dyn-forms/core';

export interface DynMatTableParams extends DynParams {
  title: string;
  addNewButtonText: string;
  emptyText?: string;
  headers: string[];
}
