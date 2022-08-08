import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { first, map, mapTo, startWith, switchMap } from 'rxjs/operators';
import {
  DynCondition,
  DynConditionFn,
  DynMatcher,
  DynMatcherFn,
  DynMatchRelation,
} from './types/matcher.types';
import { DynTreeNode } from './types/node.types';
import { DynFunction, DynFunctionFn } from './types/params.types';
import { DynBaseProvider } from './types/provider.types';
import {
  DynControlAsyncValidator,
  DynControlErrors,
  DynErrorHandler,
  DynErrorHandlerFn,
  DynErrorMessage,
  DynErrorMessages,
  DynValidator,
} from './types/validation.types';
import { isPlainObject } from './utils/merge.util';

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
export const defaultValidators: DynValidator[] = [
  { id: 'required', fn: () => Validators.required },
  { id: 'requiredTrue', fn: () => Validators.requiredTrue },
  { id: 'pattern', fn: (node: DynTreeNode, pattern: string | RegExp) => Validators.pattern(pattern) },
  { id: 'minLength', fn: (node: DynTreeNode, minLength: number) => Validators.minLength(minLength) },
  { id: 'maxLength', fn: (node: DynTreeNode, minLength: number) => Validators.maxLength(minLength) },
  { id: 'email', fn: () => Validators.email },
  { id: 'min', fn: (node: DynTreeNode, min: number) => Validators.min(min) },
  { id: 'max', fn: (node: DynTreeNode, max: number) => Validators.max(max) },
].map(
  mapPriority<DynValidator>()
);

/**
 * Default matchers
 */
export const defaultAsyncValidators: DynControlAsyncValidator[] = [
  {
    id: 'RELATED',
    fn: (node: DynTreeNode, config: DynMatchRelation, validator: ValidatorFn = Validators.required) => {
      return (control: AbstractControl): Observable<ValidationErrors | null> => {
        return node.root.loaded$.pipe(
          first(Boolean),
          switchMap(() => relatedConditionFn(config)(node)),
          map(hasMatch => hasMatch ? validator(control) : null),
          first(),
        );
      }
    }
  },
].map(
  mapPriority<DynControlAsyncValidator>()
);

/**
 * Default matchers
 */
export const defaultMatchers: DynMatcher[] = [
  {
    id: 'PARAMS',
    fn: (): DynMatcherFn => {
      return ({ node, results }) => {
        node.updateParams(results.reduce((res, obj) => ({ ...res, ...obj }), {}))
      }
    }
  },
  {
    id: 'UPDATEDBY',
    fn: (): DynMatcherFn => {
      return ({ node, firstTime }) => {
        if (!firstTime) {
          node.callHook({ hook: 'DetectChanges' });
        }
      }
    }
  },
  {
    id: 'RELATED',
    fn: (): DynMatcherFn => {
      return ({ node, firstTime }) => {
        if (!firstTime) {
          node.control.updateValueAndValidity();
        }
      }
    }
  },
  {
    id: 'VALIDATE',
    fn: (error: ValidationErrors, validator: ValidatorFn = Validators.required): DynMatcherFn => {
      return ({ node, hasMatch }) => {
        if (hasMatch) {
          if (validator(node.control)) {
            node.control.setErrors(error);
          } else {
            node.control.updateValueAndValidity();
          }
        } else {
          node.control.setErrors(null);
        }
      }
    }
  },
  {
    id: 'DISABLE',
    fn: (): DynMatcherFn => {
      return ({ node, hasMatch }) => {
        hasMatch ? node.control.disable() : node.control.enable();
      }
    }
  },
  {
    id: 'ENABLE',
    fn: (): DynMatcherFn => {
      return ({ node, hasMatch }) => {
        hasMatch ? node.control.enable() : node.control.disable();
      }
    }
  },
  {
    id: 'SHOW',
    fn: (): DynMatcherFn => {
      return ({ node, hasMatch }) => {
        hasMatch ? node.visible() : node.hidden();
      }
    }
  },
  {
    id: 'INVISIBLE',
    fn: (): DynMatcherFn => {
      return ({ node, hasMatch }) => {
        hasMatch ? node.invisible() : node.visible();
      }
    }
  },
  {
    id: 'HIDE',
    fn: (): DynMatcherFn => {
      return ({ node, hasMatch }) => {
        hasMatch ? node.hidden() : node.visible();
      }
    }
  },
].map(
  mapPriority<DynMatcher>()
);


/**
 * Default condition handler
 */
export const defaultConditions: DynCondition[] = [
  {
    id: 'DEFAULT',
    fn: relatedConditionFn,
  },
  {
    id: 'MODE',
    fn: (mode: string): DynConditionFn => {
      return (node: DynTreeNode) => {
        return node.mode$.pipe(map(value => value === mode));
      }
    },
  },
].map(
  mapPriority<DynCondition>()
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
export const defaultFunctions: DynFunction[] = [
  {
    id: 'formatText',
    fn: (defaultText = '-'): DynFunctionFn<string> => {
      return (node: DynTreeNode) => {
        return node.control.value || defaultText;
      }
    },
  },
  {
    id: 'formatYesNo',
    fn: (isBinary = true, defaultText = '-'): DynFunctionFn<string> => {
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
    fn: (): DynFunctionFn<string> => {
      return (node: DynTreeNode) => {
        const value = node.control.value;
        const option = node.params.options.find((o: any) => o.value === value);
        return value && option ? option.value : value;
      }
    },
  },
  {
    id: 'getParamsField',
    fn: (field = 'label', defaultText = '-'): DynFunctionFn<string> => {
      return (node: DynTreeNode) => {
        return node.params[field] || defaultText;
      }
    },
  },
].map(
  mapPriority<DynFunction>()
);

/**
 * Related Condition
 */
function relatedConditionFn({ path, value, field, negate }: DynMatchRelation): DynConditionFn {
  return (node: DynTreeNode) => {
    const control = node.search(path);
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
}

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
