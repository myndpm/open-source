import { ChangeDetectionStrategy, Component, HostBinding, TemplateRef, ViewChild } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatFormFieldControl } from '@angular/material/form-field';
import { DynConfig, DynFormControl, DynMode, DynPartialControlConfig } from '@myndpm/dyn-forms/core';
import { DynMatFormFieldWrapper } from '../../wrappers';
import { DynMatDatepickerParams } from './datepicker.component.params';

@Component({
  selector: 'dyn-mat-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynMatDatepickerComponent
extends DynFormControl<DynMode, DynMatDatepickerParams> {

  static dynControl: 'DATEPICKER' = 'DATEPICKER';

  static createConfig<M extends DynMode>(
    partial: DynPartialControlConfig<M, DynMatDatepickerParams>
  ): DynConfig<M> {
    return {
      wrappers: ['FORM-FIELD'],
      ...partial,
      control: DynMatDatepickerComponent.dynControl,
    };
  }

  @ViewChild(MatFormFieldControl, { static: true })
  fieldControl!: MatFormFieldControl<any>;

  @ViewChild('ngContent', { static: true })
  ngContent!: TemplateRef<any>;

  @ViewChild('picker', { static: true })
  picker!: MatDatepicker<any>;

  @HostBinding('class.readonly')
  get isReadonly(): boolean {
    return Boolean(this.params.readonly);
  }

  ngOnInit(): void {
    super.ngOnInit();

    // register into the closest mat-form-field wrapper
    const formField = this.node.searchWrapper(DynMatFormFieldWrapper);
    formField?.attachControl(this.fieldControl);
    formField?.addTemplate('suffix', this.ngContent, { picker: this.picker });
  }

  onOpened(): void {
    // the output event triggers change detection
    // and adjust the overlay position to be printed properly
  }

  // TODO https://github.com/angular/components/issues/16761
  // https://github.com/ngx-formly/ngx-formly/blob/main/src/ui/material/datepicker/src/datepicker.type.ts#L127

  completeParams(params: Partial<DynMatDatepickerParams>): DynMatDatepickerParams {
    return {
      ...params,
      floatLabel: params.floatLabel || 'auto',
      placeholder: params.placeholder || '',
    };
  }
}
