import { Validators } from '@angular/forms';
import { of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DynControlCondition, DynControlConditionFn, DynControlMatchCondition } from './control-matchers.types';
import { DynValidatorProvider } from "./control-validation.types";
import { DynTreeNode } from './tree.types';

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

/**
 * Default condition handler
 */
export const defaultConditions: DynControlCondition[] = [
  {
    id: 'DEFAULT',
    fn: ({ path, value, negation }: DynControlMatchCondition): DynControlConditionFn => {
      return (node: DynTreeNode) => {
        const control = node.query(path);
        if (!control) {
          console.error(`Control '${path}' not found inside a Condition`)
          return of(true); // do not break AND matchers
        }
        return control.valueChanges.pipe(
          startWith(control.value),
          // compare the configured value
          map(controlValue => {
            return Array.isArray(value)
              ? value.includes(controlValue)
              : value === controlValue;
          }),
          // negate the result if needed
          map(result => negation ? !result : result),
        );
      }
    }
  },
].map(
  mapPriority<DynControlCondition>()
);
