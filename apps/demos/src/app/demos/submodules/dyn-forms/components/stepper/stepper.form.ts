import { Validators } from '@angular/forms';
import { DynFormConfig } from '@myndpm/dyn-forms';
import { createMatConfig } from '@myndpm/dyn-forms/ui-material';

export function step1Form(): DynFormConfig {
  return {
    controls: [
      createMatConfig('CARD', {
        name: 'data',
        factory: { cssClass: 'row' },
        controls: [
          createMatConfig('INPUT', {
            name: 'firstName',
            options: { validators: [Validators.required] },
            factory: { cssClass: 'col-sm-6' },
            params: { label: 'First Name *' },
          }),
          createMatConfig('INPUT', {
            name: 'lastName',
            options: { validators: [Validators.required] },
            factory: { cssClass: 'col-sm-6' },
            params: { label: 'Last Name *' },
          }),
          createMatConfig('INPUT', {
            name: 'phone',
            options: { validators: [Validators.pattern(/^[+]?\d*$/)] },
            factory: { cssClass: 'col-md-6' },
            params: {
              label: 'Phone',
              type: 'tel',
              hint: 'only numbers allowed with Validators.pattern',
            },
          }),
          createMatConfig('INPUT', {
            name: 'birthdate',
            factory: { cssClass: 'col-md-6' },
            params: { label: 'Birth Date', placeholder: 'TODO DATEPICKER' },
          }),
          createMatConfig('SELECT', {
            name: 'birthPlace',
            params: {
              label: 'Place of birth',
              options: [
                { text: '- Choose one -', value: null },
                { text: 'Colombia', value: 'CO' },
                { text: 'United States', value: 'US' },
                { text: 'China', value: 'CN' },
                { text: 'Russia', value: 'RU' },
                { text: 'Other', value: 'XX' },
              ],
            },
          }),
          createMatConfig('CHECKBOX', {
            name: 'notFound',
            params: { label: `I don't see my birth country` },
          }),
        ],
      }),
    ],
  };
}

export function step2Form(): DynFormConfig {
  return {
    controls: [
      createMatConfig('CARD', {
        factory: { cssClass: 'row' },
        controls: [
          createMatConfig('RADIO', {
            name: 'toc',
            options: { validators: [Validators.required] },
            params: {
              label: 'Do you accept the terms and conditions',
              options: [
                { text: 'Yes', value: true },
                { text: 'No', value: false },
              ],
            },
          }),
          createMatConfig('MULTICHECK', {
            name: 'choices',
            options: { validators: [Validators.minLength(1)] },
            params: {
              label: 'Select the applicable choices',
              options: [
                { text: 'Choice 1', value: 1 },
                { text: 'Choice 2', value: 2 },
                { text: 'Choice 3', value: 3 },
              ],
            },
          }),
          createMatConfig('INPUT', {
            name: 'reason',
            params: {
              label: 'Describe the reason to travel these days',
              type: 'textarea',
              rows: 5,
            },
          }),
        ],
      }),
    ],
  };
}
