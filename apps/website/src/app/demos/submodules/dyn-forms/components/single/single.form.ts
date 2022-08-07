import { DynFormConfig } from '@myndpm/dyn-forms';
import { createMatConfig } from '@myndpm/dyn-forms/ui-material';

export function singleForm(): DynFormConfig<'form'|'success'> {
  return {
    controls: [
      createMatConfig('CARD', {
        cssClass: 'row',
        params: {
          title: 'Subscribe',
          type: 'email',
        },
        controls: [
          createMatConfig('INPUT', {
            wrapper: 'FORM-FIELD',
            name: 'email',
            validators: ['required'],
            cssClass: 'col-sm-6 col-md-4',
            params: { label: 'Email *' },
          }),
        ],
      }),
    ],
    errorMsgs: {
      email: 'Valid email is mandatory',
    },
  };
}
