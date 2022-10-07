import { Observable } from 'rxjs';

export interface DynMatTableParams {
  headers: string[];
  trackBy: string;
  title?: string;
  addNewButtonText?: string;
  emptyText?: string;
  disableRemove?: boolean;
  confirmDelete?: (payload: any) => Observable<boolean>;
}

/**
 * Hooks
 */

export interface DynMatTableAddItemHook {
  userAction?: boolean;
}

export interface DynMatTableRemoveItemHook {
  index: number;
  doConfirm?: boolean;
}
