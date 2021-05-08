import { DynFormConfig } from '@myndpm/dyn-forms';
import { createMatConfig } from '@myndpm/dyn-forms/ui-material';
import { IMyndUnit, accessTypes, unitTypes, MyndAccessType } from './business.types';

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
      createMatConfig('CONTAINER', {
        name: 'agentShowing',
        controls: [
          createMatConfig('CHECKBOX', {
            name: 'isRequired',
            params: { label: 'Agent is required?' },
          }),
          createMatConfig('INPUT', {
            name: 'agentName',
            params: { label: 'Agent Name' },
            options: {
              match: [{
                matchers: ['SHOW'],
                when: [{ path: 'isRequired', value: true }],
              }],
            },
          }),
        ],
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
        ],
        options: {
          match: [{
            matchers: ['SHOW'],
            when: [{ path: 'accessType', value: MyndAccessType.CodeBox }],
          }],
        },
      }),
      createMatConfig('CONTAINER', {
        name: 'smartLock',
        controls: [
          createMatConfig('INPUT', {
            name: 'serial',
            params: { label: 'Smart Lock Serial #' },
          }),
          createMatConfig('DATEPICKER', {
            name: 'installDate',
            params: { label: 'Install Date' },
          }),
        ],
        options: {
          match: [{
            matchers: ['SHOW'],
            when: [{ path: 'accessType', value: MyndAccessType.SmartLock }],
          }],
        },
      }),
    ],
  };
}
