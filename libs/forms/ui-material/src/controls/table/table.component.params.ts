import { DynParams } from '@myndpm/dyn-forms/core';
import { Observable } from 'rxjs';

export interface DynMatTableParams extends DynParams {
  title: string;
  addNewButtonText: string;
  emptyText?: string;
  headers: string[];
  confirmDelete?: (payload: any) => Observable<boolean>;
}

/**
 * Hooks
 */

export interface DynMatTableAddItemHook {
  userAction?: boolean;
}
