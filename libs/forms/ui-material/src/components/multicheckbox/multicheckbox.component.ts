import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  DynConfig,
  DynControlMode,
  DynFormControl,
  DynPartialControlConfig,
} from '@myndpm/dyn-forms/core';
import { combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DynMatMulticheckboxParams } from './multicheckbox.component.params';

@Component({
  selector: 'dyn-mat-multicheckbox',
  templateUrl: './multicheckbox.component.html',
  styleUrls: ['./multicheckbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynMatMulticheckboxComponent
extends DynFormControl<DynControlMode, DynMatMulticheckboxParams>
implements OnInit, OnChanges {

  static dynControl: 'MULTICHECK' = 'MULTICHECK';

  static createConfig<M extends DynControlMode>(
    partial: DynPartialControlConfig<M, DynMatMulticheckboxParams>
  ): DynConfig<M, DynMatMulticheckboxParams> {
    return {
      ...partial,
      control: DynMatMulticheckboxComponent.dynControl,
    };
  }

  controls: FormControl[] = [];

  // avoids infinite loop emiting valueChange
  private _internalValueChange = false;

  ngOnInit(): void {
    super.ngOnInit();

    // listen valueChanges to sync the internal checkboxes
    this.control.valueChanges
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(() => {
        if (!this._internalValueChange) {
          this.params.options.forEach((option, i) => {
            this.controls[i].setValue(this.hasValue(option.value));
          });
        }
        this._internalValueChange = false;
      });
  }

  ngOnChanges(): void {
    // map one control to each option
    this.controls = this.params.options.map((option) => {
      return new FormControl(this.hasValue(option.value))
    });

    // listen the internal controls to sync the high-order control value
    combineLatest(this.controls.map(({ valueChanges }) => valueChanges))
      .pipe(takeUntil(this._paramsChanged))
      .subscribe((values: boolean[]) => {
        this._internalValueChange = true;
        this.control.setValue(
          values.map((enabled, i) => enabled ? this.params.options[i].value : null).filter(Boolean),
        );
      });
  }

  completeParams(params: Partial<DynMatMulticheckboxParams>): DynMatMulticheckboxParams {
    return {
      ...params,
      options: params.options || [],
    };
  }

  private hasValue(option: any): boolean {
    return (
      Array.isArray(this.control.value) ? this.control.value : []
    ).includes(option);
  }
}
