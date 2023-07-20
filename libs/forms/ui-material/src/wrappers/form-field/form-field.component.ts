import { Component, HostBinding, TemplateRef, ViewChild } from '@angular/core';
import { MatLegacyFormField as MatFormField, MatLegacyFormFieldControl as MatFormFieldControl } from '@angular/material/legacy-form-field';
import { DynTemplates, DynWrapper } from '@myndpm/dyn-forms/core';
import { DynMatFormFieldParams } from './form-field.component.params';

@Component({
  selector: 'dyn-mat-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
})
export class DynMatFormFieldWrapper extends DynWrapper<DynMatFormFieldParams> {

  static dynWrapper: 'FORM-FIELD' = 'FORM-FIELD';

  @ViewChild(MatFormField, { static: true })
  formField!: MatFormField;

  templates = new DynTemplates();

  @HostBinding('class.readonly')
  get isReadonly(): boolean {
    return Boolean(this.params.readonly);
  }

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

  addTemplate(id: 'prefix' | 'suffix', template: TemplateRef<any>, params: Record<string, any>): void {
    this.templates.add(id, template, params);
  }

  completeParams(params: Partial<DynMatFormFieldParams>): DynMatFormFieldParams {
    return {
      ...params,
      floatLabel: params.floatLabel || 'auto',
    };
  }
}
