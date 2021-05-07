import { DynFormConfig } from '@myndpm/dyn-forms';
import { createMatConfig } from '@myndpm/dyn-forms/ui-material';

export function buildConfig(): DynFormConfig<'edit'|'display'> { // typed mode
  return {
    controls: [
      createMatConfig('INPUT', {
        name: 'agentShowing.agentName',
        params: { label: 'Agent Name' },
      }),
    ],
  };
}
