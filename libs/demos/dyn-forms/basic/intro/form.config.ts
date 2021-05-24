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
            { value: '- Choose one -', key: null },
            { value: 'Colombia', key: 'CO' },
            { value: 'United States', key: 'US' },
            { value: 'China', key: 'CN' },
            { value: 'Russia', key: 'RU' },
            { value: 'Other', key: 'XX' },
          ],
        },
      }),
      createMatConfig('RADIO', {
        name: 'terms',
        params: {
          options: [
            { value: 'Speaker', key: 'SPEAKER' },
            { value: 'Attendant', key: 'ATTENDANT' },
          ],
        },
      }),
    ],
  };
}
