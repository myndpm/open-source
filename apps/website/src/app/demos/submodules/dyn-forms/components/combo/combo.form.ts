import { DynFormConfig } from '@myndpm/dyn-forms';
import { createMatConfig } from '@myndpm/dyn-forms/ui-material';
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
            cssClass: 'col-sm-6 col-md-4',
            params: {
              label: 'Country',
              options: comboService.getCountries(),
            },
            paramFns: { getValue: 'getOptionText' },
          }),
          createMatConfig('SELECT', {
            name: 'city',
            validators: ['required'],
            cssClass: 'col-sm-6 col-md-4',
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
                    }),
                    debug: true
                  },
                ],
              },
            ],
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
