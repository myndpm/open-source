import { DynFormConfig } from "@myndpm/dyn-forms";
import { createMatConfig } from "@myndpm/dyn-forms/ui-material";

export function formConfig(): DynFormConfig {
  return {
    controls: [
      createMatConfig('INPUT', {
        name: 'fullName',
        params: { label: 'Full Name' },
      }),
      createMatConfig('INPUT', {
        name: 'address',
        params: { label: 'Address' },
      }),
      createMatConfig('SELECT', {
        name: 'country',
        params: {
          label: 'Country',
          options: [
            { text: '- Choose one -', value: null },
            { text: 'Colombia', value: 'CO' },
            { text: 'United States', value: 'US' },
            { text: 'China', value: 'CN' },
            { text: 'Russia', value: 'RU' },
            { text: 'Other', value: 'XX' },
          ],
        },
      }),
      createMatConfig('RADIO', {
        name: 'terms',
        params: {
          options: [
            { text: 'Speaker', value: 'SPEAKER' },
            { text: 'Attendant', value: 'ATTENDANT' },
          ],
        },
      }),
    ],
  };
}
