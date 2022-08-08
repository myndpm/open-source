import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  DynConfig,
  DynFormControl,
  DynMode,
  DynPartialControlConfig,
} from '@myndpm/dyn-forms/core';
import { combineLatest } from 'rxjs';
import { startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { DynMatMulticheckboxParams } from './multicheckbox.component.params';

@Component({
  selector: 'dyn-mat-multicheckbox',
  templateUrl: './multicheckbox.component.html',
  styleUrls: ['./multicheckbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynMatMulticheckboxComponent
extends DynFormControl<DynMode, DynMatMulticheckboxParams>
implements OnInit {

  static dynControl: 'MULTICHECK' = 'MULTICHECK';

  controls: FormControl[] = [];

  // avoids infinite loop emiting valueChange
  private _internalValueChange = false;

  static createConfig<M extends DynMode>(
    partial: DynPartialControlConfig<M, DynMatMulticheckboxParams>
  ): DynConfig<M, DynMatMulticheckboxParams> {
    return {
      ...partial,
      control: DynMatMulticheckboxComponent.dynControl,
    };
  }

  ngOnInit(): void {
    super.ngOnInit();

    // listen valueChanges to sync the internal checkboxes
    this.control.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        if (!this._internalValueChange) {
          this.params.options.forEach((option, i) => {
            this.controls[i].setValue(this.hasValue(option.key));
          });
        }
        this._internalValueChange = false;
      });

    this.params$.pipe(
      takeUntil(this.onDestroy$),
      switchMap((params) => {
        // map one control to each option
        this.controls = params.options.map((option) => {
          return new FormControl(this.hasValue(option.key))
        });

        return combineLatest(
          this.controls.map(({ value, valueChanges }) => {
            return valueChanges.pipe(startWith(value));
          })
        ).pipe(
          takeUntil(this.onDestroy$),
          // TODO add distinctUntilChanged with lodash.isEqual
          tap((values: boolean[]) => {
            this._internalValueChange = true;
            this.control.setValue(
              values.map((enabled, i) => enabled ? this.params.options[i].key : null).filter(Boolean),
            );
          }),
        );
      }),
    ).subscribe();
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
