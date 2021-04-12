import { Provider } from '@angular/core';
import { ControlProvider } from '@myndpm/dyn-forms/core';

export interface DynFormsModuleArgs {
  providers?: Provider[];
  controls: ControlProvider[];
}
