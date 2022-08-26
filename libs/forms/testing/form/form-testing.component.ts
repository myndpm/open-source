import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynFormComponent, DynFormConfig } from '@myndpm/dyn-forms';
import { DynMode } from '@myndpm/dyn-forms/core';

@Component({
  selector: 'dyn-form-testing',
  template: `
<dyn-form
  [config]="config"
  [form]="form"
  [isolated]="true"
  [mode]="mode"
></dyn-form>
`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynFormTestingComponent {
  @Input() config!: DynFormConfig;
  @Input() mode!: DynMode;

  @ViewChild(DynFormComponent, { static: true })
  dynForm!: DynFormComponent;

  form = new FormGroup({});
}
