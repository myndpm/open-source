import { DynFormConfig } from '@myndpm/dyn-forms';
import { createMatConfig } from '@myndpm/dyn-forms/ui-material';
import { IMyndUnit, accessTypes, unitTypes } from './business.types';

export const unitConfig: DynFormConfig = {
  controls: [
    createMatConfig('SELECT', {
      name: 'unitType',
      params: { label: 'Unit Type', options: unitTypes },
    }),
  ],
};

export function buildConfig(
  unit: IMyndUnit,
): DynFormConfig<'edit'|'display'> {
  return {
    modeParams: {
      edit: { readonly: false },
      display: { readonly: true },
    },
    controls: [
      createMatConfig('CHECKBOX', {
        name: 'agentShowing.isRequired',
        params: { label: 'Agent is required?' },
      }),
      createMatConfig('INPUT', {
        name: 'agentShowing.agentName',
        params: { label: 'Agent Name' },
      }),
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
      createMatConfig('CONTAINER', {
        name: 'codeBox',
        controls: [
          createMatConfig('INPUT', {
            name: 'serial',
            params: { label: 'CodeBox Serial #' },
          }),
          createMatConfig('INPUT', {
            name: 'description',
            params: { label: 'Location Description' },
          }),
          createMatConfig('INPUT', {
            name: 'photo',
            params: { label: 'Location Photo' },
          }),
        ],
      }),
      createMatConfig('CONTAINER', {
        name: 'smartLock',
        controls: [
          createMatConfig('INPUT', {
            name: 'provider',
            params: { label: 'Smart Lock Provider' },
          }),
          createMatConfig('INPUT', {
            name: 'type',
            params: { label: 'Smart Lock Type' },
          }),
          createMatConfig('INPUT', {
            name: 'installDate',
            params: { label: 'Install Date' },
          }),
          createMatConfig('INPUT', {
            name: 'serial',
            params: { label: 'Serial' },
          }),
        ],
      }),
    ],
  };
}
