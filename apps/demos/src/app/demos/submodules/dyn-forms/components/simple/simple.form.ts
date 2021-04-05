import { Validators } from '@angular/forms';
import { DynControlParams } from '@myndpm/dyn-forms/core';
import { createConfig } from '@myndpm/dyn-forms/material';
import { DynFormConfig } from '@myndpm/dyn-forms';
import { Observable } from 'rxjs';

export function simpleForm(
  obsParams: Observable<DynControlParams>
): DynFormConfig {
  return {
    controls: [
      createConfig('CARD', {
        name: 'billing',
        factory: { cssClass: 'row' },
        params: obsParams,
        controls: [
          createConfig('INPUT', {
            name: 'firstName',
            factory: { cssClass: 'col-sm-6 col-md-4' },
            params: { label: 'First Name *' },
            options: { validators: [Validators.required] },
          }),
          createConfig('INPUT', {
            name: 'lastName',
            factory: { cssClass: 'col-sm-6 col-md-4' },
            params: { label: 'Last Name *' },
            options: { validators: [Validators.required] },
          }),
          createConfig('INPUT', {
            name: 'address1',
            factory: { cssClass: 'col-12 col-md-9' },
            params: { label: 'Address Line 1 *' },
            options: { validators: [Validators.required] },
          }),
          createConfig('INPUT', {
            name: 'address2',
            factory: { cssClass: 'col-12 col-md-9' },
            params: { label: 'Address Line 2' },
          }),
          createConfig('SELECT', {
            name: 'country',
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
            options: { validators: [Validators.required] },
          }),
          createConfig('INPUT', {
            name: 'zipCode',
            factory: { cssClass: 'col-sm-6 col-md-4' },
            params: { label: 'Postal Code *' },
            options: { validators: [Validators.required, Validators.min(0)] },
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
            factory: { cssClass: 'col-6 col-md-8' },
            params: { label: 'Product Name *' },
            options: { validators: [Validators.required] },
          }),
          createConfig('INPUT', {
            name: 'quantity',
            factory: { cssClass: 'col-3' },
            params: { label: 'Quantity *', type: 'number' },
            options: { validators: [Validators.required, Validators.min(1)] },
          }),
        ],
      }),
    ],
  };
}
