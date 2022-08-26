import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DynFormGroup } from '../dyn-form-group.class';

@Component({
  selector: 'dyn-hidden-group',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynHiddenGroupComponent extends DynFormGroup {
  static dynControl: 'HIDDEN-GROUP' = 'HIDDEN-GROUP';
}
