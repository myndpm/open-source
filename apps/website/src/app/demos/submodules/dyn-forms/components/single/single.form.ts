import { DynFormConfig } from '@myndpm/dyn-forms';
import { createMatConfig } from '@myndpm/dyn-forms/ui-material';

export function singleForm(): DynFormConfig<'form'|'success'> {
  return {
    controls: [
      createMatConfig('INPUT', {
        name: 'email',
        validators: ['required', 'email'],
        cssClass: 'col-sm-6 col-md-4',
        params: {
          label: 'Email',
          type: 'email',
        },
      }),
    ],
    errorMsgs: {
      email: 'Valid email is mandatory',
    },
  };
}
