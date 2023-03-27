import { DynFormConfig } from '@myndpm/dyn-forms';
import { DynNode } from '@myndpm/dyn-forms/core';
import { createMatConfig } from '@myndpm/dyn-forms/ui-material';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComboService } from './combo.service';

export function comboForm(
  comboService: ComboService,
): DynFormConfig<'edit'|'display'|'row'> { // typed mode
  return {
    modes: {
      edit: { params: { readonly: false } },
      display: { params: { readonly: true } },
    },
    controls: [
      createMatConfig('CARD', {
        cssClass: 'row',
        params: {
          title: 'Country and City',
          subtitle: 'Please choose country and see how thhe city options are updated',
        },
        controls: [
          createMatConfig('SELECT', {
            name: 'country',
            validators: ['required'],
            params: {
              label: 'Country',
              options: comboService.getCountries(),
            },
            paramFns: { getValue: 'getOptionText' },
          }),
          createMatConfig('SELECT', {
            name: 'city',
            validators: ['required'],
            params: { label: 'City' },
            paramFns: { getValue: 'getOptionText' },
            match: [
              {
                matchers: ['PARAMS'],
                when: [
                  {
                    condition: 'MAP',
                    path: 'country',
                    fn: (country?: string) => ({
                      options: comboService.getCities(country)
                    })
                  },
                ],
                debug: true,
              },
            ],
          }),
          createMatConfig('SELECT', {
            name: 'summary',
            params: {
              label: 'Summary',
              readonly: true,
            },
            match: [
              {
                matchers: ['PARAMS'],
                when: [
                  (node: DynNode) => combineLatest([
                    node.valueChanges('country'),
                    node.valueChanges('city'),
                  ]).pipe(
                    map(([country, city]) => {
                      const value = `${country}${city ? ` - ${city}` : ''}`;
                      node.patchValue(value);
                      return {
                        options: [{ value, key: value }]
                      };
                    }),
                  ),
                ],
              },
            ],
            modes: {
              edit: { params: { readonly: true } },
            }
          }),
        ],
      }),
    ],
    errorMsgs: {
      country: 'Country is required',
      city: 'City is required',
    },
  };
}
