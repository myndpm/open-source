import { MatDialog } from '@angular/material/dialog';
import { DynFormConfig } from '@myndpm/dyn-forms';
import { DynControlConditionFn, DynControlMatch, DynTreeNode } from '@myndpm/dyn-forms/core';
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
            modes: {
              display: {
                control: 'INPUT',
                paramFns: { getValue: 'formatYesNo' }
              },
            },
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
              when: [isUnitParking(unit$)],
            },
            {
              matchers: [confirmTypeChange(dialog)],
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
            errorMsg: {
              required: 'Serial is required',
            },
          }),
          createMatConfig('INPUT', {
            name: 'description',
            params: { label: 'Location Description' },
          }),
        ],
        options: {
          match: getMatchersFor(MyndAccessType.CodeBox, isUnitParking(unit$)),
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
          match: getMatchersFor(MyndAccessType.SmartLock, isUnitParking(unit$)),
        },
      }),
    ],
  };
}

// custom condition factory for UnitType
function isUnitParking(unit$: Observable<IMyndUnit>) {
  return () => unit$.pipe(map(({ unitType }) => unitType === MyndUnitType.Parking));
}

// custom matcher factory for AccessType
let previousType: MyndAccessType = null;
function confirmTypeChange(dialog: MatDialog) {
  return (node: DynTreeNode) => {
    // will be triggered each time the node changes value
    const currentType = node.control.value;
    // process any previously selected type
    if (previousType && previousType !== currentType) {
      // here we could check if there's anything to delete and prompt if so
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
}

// config matchers for Access Types containers
function getMatchersFor(accessType: MyndAccessType, isParking: DynControlConditionFn): DynControlMatch[] {
  return [
    {
      matchers: ['HIDE'],
      operator: 'OR',
      when: [
        // we need to hide when isParking OR not the current type
        isParking,
        { path: 'accessType', value: accessType, negate: true }
      ],
    },
  ];
}

// data reseter when Access Type changes
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
