import { DynFormConfig } from '@myndpm/dyn-forms';
import { DynParams } from '@myndpm/dyn-forms/core';
import { createMatConfig } from '@myndpm/dyn-forms/ui-material';
import { Observable } from 'rxjs';

export const simpleData = {
  billing: {
    firstName: 'Mynd',
    lastName: 'Management',
    address1: '1611 Telegraph Ave',
    address2: 'Suite 1200',
    country: 'US',
    zipCode: '94612',
  },
  account: 'GUEST',
  products: [
    {
      product: 'Product 1',
      quantity: 8,
    },
    {
      product: 'Product 2',
      quantity: 4,
    },
  ]
};

export function simpleForm(
  obsParams: Observable<DynParams>
): DynFormConfig<'edit'|'display'|'row'> { // typed mode
  return {
    modes: {
      edit: { params: { readonly: false } },
      display: { params: { readonly: true } },
    },
    controls: [
      createMatConfig('CARD', {
        name: 'billing',
        cssClass: 'row',
        params: obsParams,
        controls: [
          createMatConfig('INPUT', {
            name: 'firstName',
            validators: ['required'],
            cssClass: 'col-sm-6 col-md-4',
            params: { label: 'First Name *' },
          }),
          createMatConfig('INPUT', {
            name: 'lastName',
            validators: ['required'],
            cssClass: 'col-sm-6 col-md-4',
            params: { label: 'Last Name *' },
          }),
          createMatConfig('DIVIDER', {
            params: { invisible: true },
          }),
          createMatConfig('INPUT', {
            name: 'address1',
            validators: { required: null, minLength: 4 },
            cssClass: 'col-12 col-md-8',
            params: { label: 'Address Line 1 *' },
          }),
          createMatConfig('INPUT', {
            name: 'address2',
            cssClass: 'col-12 col-md-8',
            params: { label: 'Address Line 2' },
          }),
          createMatConfig('DIVIDER', {
            params: { invisible: true },
          }),
          createMatConfig('SELECT', {
            name: 'country',
            default: {
              value: 'CO',
              disabled: true,
            },
            validators: ['required'],
            cssClass: 'col-sm-6 col-md-4',
            params: {
              label: 'Country',
              options: [
                { value: '- Choose one -', key: null },
                { value: 'Colombia', key: 'CO' },
                { value: 'United States', key: 'US' },
                { value: 'China', key: 'CN' },
                { value: 'Russia', key: 'RU' },
                { value: 'Other', key: 'XX' },
              ],
            },
            paramFns: { getValue: 'getOptionText' },
          }),
          createMatConfig('INPUT', {
            name: 'zipCode',
            match: [
              {
                matchers: ['ENABLE'],
                operator: 'AND',
                when: [
                  { path: 'firstName', value: 'Mateo' },
                  { path: 'country', value: 'CO' },
                ],
                negate: true
              },
              {
                matchers: ['HIDE'],
                when: [
                  { path: 'account', value: 'GUEST' },
                ]
              },
            ],
            cssClass: 'col-sm-6 col-md-4',
            params: { label: 'Postal Code' },
          }),
        ],
      }),
      createMatConfig('RADIO', {
        name: 'account',
        params: {
          options: [
            { value: 'Create Account', key: 'CREATE' },
            { value: 'Checkout as a Guest', key: 'GUEST' },
          ],
        },
        paramFns: { getValue: 'getOptionText' },
      }),
      createMatConfig('TABLE', {
        name: 'products',
        cssClass: 'row',
        params: {
          title: 'Product',
          headers: ['Product Name', 'Quality'],
          // subtitle: 'Items to checkout',
          // initItem: true,
        },
        controls: [
          createMatConfig('INPUT', {
            name: 'product',
            validators: ['required'],
            cssClass: 'col-6 col-md-8',
            params: { label: 'Product Name *' },
          }),
          createMatConfig('INPUT', {
            name: 'quantity',
            validators: ['required', ['min', 1]],
            cssClass: 'col-5 col-md-3',
            params: { label: 'Quantity *', type: 'number' },
          }),
        ],
        modes: {
          row: {
            params: { readonly: true },
          },
        }
      }),
    ],
    errorMsgs: {
      firstName: 'First name is required',
      lastName: 'Last name is required',
      address1: 'Address is required',
      product: 'Product name is required',
      quantity: 'Quantity is required',
    },
  };
}
