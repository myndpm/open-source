import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynConfig, DynControlMode, DynFormArray, DynPartialControlConfig } from '@myndpm/dyn-forms/core';
import { filter, takeUntil } from 'rxjs/operators';

import { DynMatTableParams } from './table.component.params';

@Component({
  selector: 'dyn-mat-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynMatTableComponent
extends DynFormArray<DynControlMode, DynMatTableParams>
implements OnInit {

  static dynControl: 'TABLE' = 'TABLE';

  static createConfig<M extends DynControlMode>(
    partial: DynPartialControlConfig<M, DynMatTableParams>
  ): DynConfig<M, DynMatTableParams> {
    return {
      ...partial,
      control: DynMatTableComponent.dynControl,
    };
  }

  get items(): FormGroup[] {
    return this.control.controls as FormGroup[];
  }

  itemIndexForEditing?: number;

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
      this.itemIndexForEditing = this.items.length - 1;
    }
  }

  cancelItemEditing(): void {
    this.itemIndexForEditing = undefined;
  }

  editItem(index: number): void {
    this.itemIndexForEditing = index;
  }

  removeItem(index: number): void {
    super.removeItem(index);
  }

  completeParams(params: Partial<DynMatTableParams>): DynMatTableParams {
    return {
      title: params.title!,
      addNewButtonText: params.addNewButtonText || `Add ${ params.title!.toLowerCase() }`,
      emptyText: params.emptyText || `No ${ params.title!.toLowerCase() }s added`,
      headers: params.headers || [],
    };
  }

  modeFactory = (mode: DynControlMode, index?: string): DynControlMode => {
    return this.itemIndexForEditing === Number(index) ? 'edit' : 'display';
  }
}
