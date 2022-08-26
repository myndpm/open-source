import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DynFormControl } from '../dyn-form-control.class';

@Component({
  selector: 'dyn-hidden-control',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynHiddenControlComponent extends DynFormControl {
  static dynControl: 'HIDDEN' = 'HIDDEN';
}
