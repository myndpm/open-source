import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { DynConfig, DynFormArray, DynMode, DynPartialControlConfig } from '@myndpm/dyn-forms/core';
import { filter, first, takeUntil } from 'rxjs/operators';

import { DynMatTableAddItemHook, DynMatTableParams, DynMatTableRemoveItemHook } from './table.component.params';

@Component({
  selector: 'dyn-mat-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynMatTableComponent
extends DynFormArray<DynMode, DynMatTableParams>
implements OnInit {

  static dynControl: 'TABLE' = 'TABLE';

  static createConfig<M extends DynMode>(
    partial: DynPartialControlConfig<M, DynMatTableParams>
  ): DynConfig<M, DynMatTableParams> {
    return {
      ...partial,
      control: DynMatTableComponent.dynControl,
    };
  }

  get items(): UntypedFormGroup[] {
    return this.control.controls as UntypedFormGroup[];
  }

  itemIndexForEditing?: number;
  itemIndexForAdding?: number;

  constructor(
    injector: Injector,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.node.mode$
      .pipe(
        filter(mode => mode === 'display'),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => this.itemIndexForEditing = undefined);
  }

  addItem(userAction?: boolean): void {
    super.addItem();
    if (userAction) {
      this.itemIndexForEditing = this.itemIndexForAdding = this.items.length - 1;
    }
  }

  saveItem(index: number): void {
    const item = this.control.at(index);
    if (item.dirty) {
      const hook = this.isAdding(index) ? 'ItemAdded' : 'ItemEdited';
      this.node.callHook({ hook, payload: item.value })
    }
    this.cancelItem();
  }

  cancelItem(index?: number): void {
    if (index !== undefined && this.isAdding(index)) {
      this.removeItem(index);
    }
    this.itemIndexForEditing = this.itemIndexForAdding = undefined;
  }

  editItem(index: number): void {
    this.itemIndexForEditing = index;
  }

  removeItem(index: number, doConfirm: boolean = true): void {
    const payload = this.control.at(index).value;

    const removeIt = () => {
      super.removeItem(index);
      this.node.callHook({ hook: 'ItemRemoved', payload });
    }

    if (doConfirm && this.params.confirmDelete) {
      this.params.confirmDelete(payload)
        .pipe(takeUntil(this.onDestroy$), first())
        .subscribe((result) => {
          if (result) {
            removeIt();
          }
        });
    } else {
      removeIt();
    }
  }

  completeParams(params: Partial<DynMatTableParams>): DynMatTableParams {
    return {
      ...params,
      headers: params.headers || [],
      trackBy: params.trackBy || '',
      title: params.title || '',
      emptyText: params.emptyText || `No ${ (params.title || 'item').toLowerCase() }s added`,
    };
  }

  modeFactory = (mode: DynMode, index?: string): DynMode => {
    return mode !== 'display'
      ? this.itemIndexForEditing === Number(index) ? 'edit' : 'row'
      : mode;
  }

  hookAddItem(payload?: DynMatTableAddItemHook): void {
    this.addItem(payload?.userAction ?? true);
  }

  hookRemoveItem(payload: DynMatTableRemoveItemHook): void {
    this.removeItem(payload.index, payload.doConfirm);
  }

  trackBy = (index: number, { value }: UntypedFormGroup): string => {
    return `${index}-${this.params.trackBy ? value[this.params.trackBy] : JSON.stringify(value)}`;
  }

  private isAdding(index: number): boolean {
    return index === this.itemIndexForAdding && index === this.itemIndexForEditing;
  }
}
