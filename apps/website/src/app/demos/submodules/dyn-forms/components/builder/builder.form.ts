import { MatDialog } from '@angular/material/dialog';
import { DynFormConfig } from '@myndpm/dyn-forms';
import { DynTreeNode } from '@myndpm/dyn-forms/core';
import { createMatConfig } from '@myndpm/dyn-forms/ui-material';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PromptDialog, PromptDialogData } from '../../../../../layout';
import { IMyndUnit, accessTypes, unitTypes, MyndAccessType, MyndUnitType } from './business.types';

export const unitConfig: DynFormConfig = {
  controls: [
    createMatConfig('SELECT', {
      name: 'unitType',
      params: { label: 'Unit Type', options: unitTypes },
    }),
  ],
};

export function buildConfig(
  unit$: Observable<IMyndUnit>,
  dialog: MatDialog,
): DynFormConfig<'edit'|'display'> {
  // custom condition for UnitType
  const isUnitParking = () => {
    return unit$.pipe(map(({ unitType }) => unitType === MyndUnitType.Parking));
  };

  // custom matcher for AccessType
  let previousType: MyndAccessType = null;
  const confirmTypeChange = (node: DynTreeNode) => {
    // will be triggered each time the node changes value
    const currentType = node.control.value;
    // process any previously selected type
    if (previousType && previousType !== currentType) {
      const data: PromptDialogData = {
        title: `Please confirm`,
        content: `The data from the previous type will be removed, are you sure?`,
        no: 'Go back'
      };
      dialog.open(PromptDialog, { data })
        .afterClosed()
        .subscribe(wasConfirmed => {
          if (wasConfirmed) {
            // remove the previous access type data
            changedAccessType(node, previousType);
            previousType = currentType;
          } else {
            // restore the previous value
            node.control.setValue(previousType);
          }
        });
    } else {
      previousType = currentType;
    }
  };

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
        options: {
          match: [
            {
              matchers: ['HIDE'],
              when: [isUnitParking],
            },
            {
              matchers: [confirmTypeChange],
              when: [{ path: 'accessType' }],
            },
          ],
        },
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
            options: {
              match: [{
                matchers: ['VALIDATE'],
                when: [{ path: 'accessType', value: MyndAccessType.CodeBox }],
              }],
            },
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
            options: {
              match: [{
                matchers: ['VALIDATE'],
                when: [{ path: 'accessType', value: MyndAccessType.SmartLock }],
              }],
            },
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

function changedAccessType(node: DynTreeNode, previousType: MyndAccessType): void {
  switch (previousType) {
    case MyndAccessType.CodeBox: {
      node.query('codeBox').patchValue({
        description: null,
        serial: null,
      });
      break;
    }
    case MyndAccessType.SmartLock: {
      node.query('smartLock').patchValue({
        installDate: null,
        serial: null,
      });
      break;
    }
  }
}
