import { Component, ViewChild } from '@angular/core';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { DynWrapper } from '@myndpm/dyn-forms/core';
import { DynMatFormFieldParams } from './form-field.component.params';

@Component({
  selector: 'dyn-mat-form-field',
  templateUrl: './form-field.component.html',
})
export class DynMatFormFieldWrapper extends DynWrapper<DynMatFormFieldParams> {

  static dynWrapper: 'FORM-FIELD' = 'FORM-FIELD';

  @ViewChild(MatFormField, { static: true })
  formField!: MatFormField;

  attachControl(matFormField: MatFormFieldControl<any>) {
    if (this.formField && matFormField !== this.formField._control) {
      this.formField._control = matFormField;

      // FIXME https://github.com/angular/material2/issues/6728
      const ngControl = matFormField?.ngControl as any;
      if (ngControl?.valueAccessor?.hasOwnProperty('_formField')) {
        ngControl.valueAccessor['_formField'] = this.formField;
      }

      // FIXME https://github.com/angular/components/issues/16209
      const setDescribedByIds = matFormField.setDescribedByIds.bind(matFormField);
      matFormField.setDescribedByIds = (ids: string[]) => {
        setTimeout(() => setDescribedByIds(ids));
      };
    }
  }

  completeParams(params: Partial<DynMatFormFieldParams>): DynMatFormFieldParams {
    return {
      ...params,
      floatLabel: params.floatLabel || 'auto',
    };
  }
}
