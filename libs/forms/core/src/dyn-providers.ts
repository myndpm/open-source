import { ValidatorFn, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { map, mapTo, startWith } from 'rxjs/operators';
import { DynConfigId } from './control-config.types';
import {
  DynControlCondition,
  DynControlConditionFn,
  DynControlMatchCondition,
  DynControlMatcher,
  DynControlMatcherFn,
} from './control-matchers.types';
import { DynControlFunction, DynControlFunctionFn } from './control-params.types';
import {
  DynControlErrors,
  DynControlValidator,
  DynErrorHandler,
  DynErrorHandlerFn,
  DynErrorMessage,
  DynErrorMessages,
} from './control-validation.types';
import { DynTreeNode } from './tree.types';
import { isPlainObject } from './utils';

/**
 * Base types
 */
export interface DynBaseProvider {
  priority?: number;
}

export type DynHandlerFactory<F> = (...args: any[]) => F;

export interface DynBaseHandler<F> extends DynBaseProvider {
  id: DynConfigId;
  fn: DynHandlerFactory<F>;
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
export const defaultValidators: DynControlValidator[] = [
  { id: 'required', fn: () => Validators.required },
  { id: 'requiredTrue', fn: () => Validators.requiredTrue },
  { id: 'pattern', fn: Validators.pattern },
  { id: 'minLength', fn: Validators.minLength },
  { id: 'maxLength', fn: Validators.maxLength },
  { id: 'email', fn: () => Validators.email },
  { id: 'min', fn: Validators.min },
  { id: 'max', fn: Validators.max },
].map(
  mapPriority<DynControlValidator>()
);

/**
 * Default matchers
 */
export const defaultMatchers: DynControlMatcher[] = [
  {
    id: 'DISABLE',
    fn: (): DynControlMatcherFn => {
      return (node: DynTreeNode, hasMatch: boolean) => {
        hasMatch ? node.control.disable() : node.control.enable();
      }
    }
  },
  {
    id: 'ENABLE',
    fn: (): DynControlMatcherFn => {
      return (node: DynTreeNode, hasMatch: boolean) => {
        hasMatch ? node.control.enable() : node.control.disable();
      }
    }
  },
  {
    id: 'SHOW',
    fn: (): DynControlMatcherFn => {
      return (node: DynTreeNode, hasMatch: boolean) => {
        hasMatch ? node.visible() : node.hidden();
      }
    }
  },
  {
    id: 'INVISIBLE',
    fn: (): DynControlMatcherFn => {
      return (node: DynTreeNode, hasMatch: boolean) => {
        hasMatch ? node.invisible() : node.visible();
      }
    }
  },
  {
    id: 'HIDE',
    fn: (): DynControlMatcherFn => {
      return (node: DynTreeNode, hasMatch: boolean) => {
        hasMatch ? node.hidden() : node.visible();
      }
    }
  },
  {
    id: 'VALIDATE',
    fn: (validator: ValidatorFn = Validators.required): DynControlMatcherFn => {
      return (node: DynTreeNode, hasMatch: boolean) => {
        const error = hasMatch
          ? validator(node.control)
          : null;
        error
          ? node.control.setErrors(error)
          : node.control.updateValueAndValidity();
      }
    }
  },
].map(
  mapPriority<DynControlMatcher>()
);


/**
 * Default condition handler
 */
export const defaultConditions: DynControlCondition[] = [
  {
    id: 'DEFAULT',
    fn: ({ path, value, field, negate }: DynControlMatchCondition): DynControlConditionFn => {
      return (node: DynTreeNode) => {
        const control = node.query(path);
        if (!control) {
          console.error(`Control '${path}' not found inside a Condition`)
          return of(true); // do not break AND matchers
        }
        if (value === undefined) {
          // triggers with any valueChange
          return control.valueChanges.pipe(
            startWith(control.value),
            mapTo(true),
          );
        }
        return control.valueChanges.pipe(
          startWith(control.value),
          // compare the configured value
          map(controlValue => field && isPlainObject(controlValue)
            ? controlValue[field]
            : controlValue
          ),
          map(controlValue => {
            return Array.isArray(value)
              ? value.includes(controlValue)
              : value === controlValue;
          }),
          // negate the result if needed
          map(result => negate ? !result : result),
        );
      }
    },
  },
  {
    id: 'MODE',
    fn: (mode: string): DynControlConditionFn => {
      return (node: DynTreeNode) => {
        return node.mode$.pipe(map(value => value === mode));
      }
    },
  },
].map(
  mapPriority<DynControlCondition>()
);

/**
 * Default error handler
 */
export const defaultErrorHandlers: DynErrorHandler[] = [
  {
    id: 'FORM',
    fn: (messages: DynErrorMessages): DynErrorHandlerFn => {
      return ({ control, path }: DynTreeNode) => {
        if (!control.errors) {
          return null;
        }
        // match the control errors with the configured messages
        let currentMatch = [];
        const config = Object.keys(messages).reduce<DynControlErrors|null>((result, key) => {
          const errorPath = key.split('.');
          if (pathEndsWith(path, errorPath) && errorPath.length > currentMatch.length) {
            currentMatch = errorPath;
            return messages[key]
          }
          return result;
        }, null);

        return config
          ? Object.keys(control.errors).reduce<DynErrorMessage>((result, error) => {
              return result
                ? result
                : typeof config === 'object'
                  ? config[error] ? config[error] : result
                  : config;
            }, null)
          : null;
      }
    }
  },
  {
    id: 'CONTROL',
    fn: (messages: DynControlErrors): DynErrorHandlerFn => {
      return ({ control }: DynTreeNode) => {
        // match the control errors with the configured messages
        return control.errors
          ? Object.keys(control.errors).reduce<DynErrorMessage>((result, error) => {
              return result
                ? result
                : typeof messages === 'object'
                  ? messages![error] ? messages![error] : result
                  : messages;
            }, null)
          : null;
      }
    }
  },
].map(
  mapPriority<DynErrorHandler>()
);


/**
 * Default params functions
 */
export const defaultFunctions: DynControlFunction[] = [
  {
    id: 'formatText',
    fn: (defaultText = '-'): DynControlFunctionFn => {
      return (node: DynTreeNode) => {
        return node.control.value || defaultText;
      }
    },
  },
  {
    id: 'formatYesNo',
    fn: (isBinary = true, defaultText = '-'): DynControlFunctionFn => {
      return (node: DynTreeNode) => {
        return node.control.value === true
          ? 'Yes'
          : isBinary || node.control.value === false
            ? 'No'
            : defaultText;
      }
    },
  },
  {
    id: 'getOptionText',
    fn: (): DynControlFunctionFn => {
      return (node: DynTreeNode) => {
        const value = node.control.value;
        const option = node.params.options.find((o: any) => o.value === value);
        return value && option ? option.value : value;
      }
    },
  },
  {
    id: 'getParamsField',
    fn: (field = 'label', defaultText = '-'): DynControlFunctionFn => {
      return (node: DynTreeNode) => {
        return node.params[field] || defaultText;
      }
    },
  },
].map(
  mapPriority<DynControlCondition>()
);

/**
 * Utils
 */
export function getMapFromRecord<V>(config: Record<string, V>): Map<string, V> {
  return new Map<string, V>(Object.entries(config));
}

// check if the control.path endsWith the provided config
function pathEndsWith(path: string[], config: string[]): boolean {
  return [...config].reverse().every((item, i) => {
    return item === path[path.length - 1 - i];
  });
}
