import { DynFormConfig } from '@myndpm/dyn-forms';
import { createMatConfig } from '@myndpm/dyn-forms/ui-material';
import { accessTypes } from './business.types';

export function buildConfig(): DynFormConfig<'edit'|'display'> { // typed mode
  return {
    modeParams: {
      edit: { readonly: false },
      display: { readonly: true },
    },
    controls: [
      createMatConfig('SELECT', {
        name: 'accessType',
        params: { label: 'Access Type', options: accessTypes },
        modes: {
          display: {
            control: 'INPUT',
            paramFns: { getValue: 'getOptionText' }
          },
        },
      }),
      createMatConfig('CHECKBOX', {
        name: 'agentShowing.isRequired',
        params: { label: 'Agent is required?' },
      }),
      createMatConfig('INPUT', {
        name: 'agentShowing.agentName',
        params: { label: 'Agent Name' },
      }),
    ],
  };
}
