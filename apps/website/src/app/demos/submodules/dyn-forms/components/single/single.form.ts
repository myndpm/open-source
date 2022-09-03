import { DynFormConfig } from '@myndpm/dyn-forms';
import { createMatConfig } from '@myndpm/dyn-forms/ui-material';
import { SingleSuccessComponent } from './success.control/success.component';

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
        modes: {
          success: SingleSuccessComponent.createConfig(),
        }
      }),
    ],
    errorMsgs: {
      email: 'Valid email is mandatory',
    },
  };
}
