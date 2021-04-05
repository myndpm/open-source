import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynFormConfig } from './form.config';

@Component({
  selector: 'dyn-form',
  templateUrl: './form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent {
  @Input() form = new FormGroup({});
  @Input() config!: DynFormConfig;
}
