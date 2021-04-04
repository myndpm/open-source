import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { DynFormConfig } from './form.config';

@Component({
  selector: 'dyn-form',
  templateUrl: './form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    // avoid an exception in the first level of children
    {
      provide: ControlContainer,
      useValue: {},
    },
  ],
})
export class FormComponent {
  @Input() form = new FormGroup({});
  @Input() config!: DynFormConfig;
}
