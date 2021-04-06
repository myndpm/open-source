import { Validators } from '@angular/forms';
import { DynControlParams } from '@myndpm/dyn-forms/core';
import { createConfig, DynRadioParams, DynSelectParams } from '@myndpm/dyn-forms/material';
import { DynFormConfig } from '@myndpm/dyn-forms';
import { Observable } from 'rxjs';

export function simpleForm(
  obsParams: Observable<DynControlParams>
): DynFormConfig<'display'> { // typed supported context
  return {
    contextParams: {
      display: { readonly: true },
    },
    controls: [
      createConfig('CARD', {
        name: 'billing',
        factory: { cssClass: 'row' },
        params: obsParams,
        controls: [
          createConfig('INPUT', {
            name: 'firstName',
            options: { validators: [Validators.required] },
            factory: { cssClass: 'col-sm-6 col-md-4' },
            params: { label: 'First Name *' },
          }),
          createConfig('INPUT', {
            name: 'lastName',
            options: { validators: [Validators.required] },
            factory: { cssClass: 'col-sm-6 col-md-4' },
            params: { label: 'Last Name *' },
          }),
          createConfig('DIVIDER', {
            params: { invisible: true },
          }),
          createConfig('INPUT', {
            name: 'address1',
            options: { validators: [Validators.required] },
            factory: { cssClass: 'col-12 col-md-8' },
            params: { label: 'Address Line 1 *' },
          }),
          createConfig('INPUT', {
            name: 'address2',
            factory: { cssClass: 'col-12 col-md-8' },
            params: { label: 'Address Line 2' },
          }),
          createConfig('DIVIDER', {
            params: { invisible: true },
          }),
          createConfig('SELECT', {
            name: 'country',
            options: { validators: [Validators.required] },
            factory: { cssClass: 'col-sm-6 col-md-4' },
            params: {
              label: 'Country',
              options: [
                { text: '- Choose one -', value: null },
                { text: 'Colombia', value: 'CO' },
                { text: 'United States', value: 'US' },
                { text: 'China', value: 'CN' },
                { text: 'Russia', value: 'RU' },
                { text: 'Other', value: 'XX' },
              ],
            },
            contexts: {
              display: {
                control: 'INPUT',
                params: {
                  getValue: (params: DynSelectParams, value: string) => {
                    const option = params.options.find(o => o.value === value);
                    return value && option ? option.text : value;
                  },
                },
              },
            },
          }),
          createConfig('INPUT', {
            name: 'zipCode',
            options: { validators: [Validators.required, Validators.min(0)] },
            factory: { cssClass: 'col-sm-6 col-md-4' },
            params: { label: 'Postal Code *' },
          }),
        ],
      }),
      createConfig('RADIO', {
        name: 'account',
        params: {
          options: [
            { text: 'Create Account', value: 'CREATE' },
            { text: 'Checkout as a Guest', value: 'GUEST' },
          ],
        },
        contexts: {
          display: {
            control: 'INPUT',
            params: {
              getValue: (params: DynRadioParams, value: string) => {
                const option = params.options.find(o => o.value === value);
                return value && option ? option.text : value;
              },
            },
          },
        },
      }),
      createConfig('ARRAY', {
        name: 'products',
        factory: { cssClass: 'row' },
        params: {
          title: 'Products',
          subtitle: 'Items to checkout',
          initItem: true,
        },
        controls: [
          createConfig('INPUT', {
            name: 'product',
            options: { validators: [Validators.required] },
            factory: { cssClass: 'col-6 col-md-8' },
            params: { label: 'Product Name *' },
          }),
          createConfig('INPUT', {
            name: 'quantity',
            options: { validators: [Validators.required, Validators.min(1)] },
            factory: { cssClass: 'col-5 col-md-3' },
            params: { label: 'Quantity *', type: 'number' },
          }),
        ],
      }),
    ],
  };
}
