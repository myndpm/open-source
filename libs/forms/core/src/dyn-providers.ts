import { Validators } from '@angular/forms';
import { DynValidatorProvider } from "./control-validation.types";

/**
 * Base provider
 */
export interface DynBaseProvider {
  priority?: number;
}

/**
 * Mapper to add the incoming priority
 */
export function mapPriority<T extends DynBaseProvider>(priority?: number) {
  // TODO verify with real use-cases for the priority order
  return (item: T) => ({ ...item, priority: priority ?? item.priority ?? 0 });
}

/**
 * Default Angular validators
 */
export const defaultValidators: DynValidatorProvider[] = [
  { id: 'required', fn: () => Validators.required },
  { id: 'requiredTrue', fn: () => Validators.requiredTrue },
  { id: 'pattern', fn: Validators.pattern },
  { id: 'minLength', fn: Validators.minLength },
  { id: 'maxLength', fn: Validators.maxLength },
  { id: 'email', fn: () => Validators.email },
  { id: 'min', fn: Validators.min },
  { id: 'max', fn: Validators.max },
].map(
  mapPriority<DynValidatorProvider>()
);
