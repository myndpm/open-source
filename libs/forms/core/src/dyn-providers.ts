import { Type } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { difference, equals, path as getPath } from 'ramda';
import { Observable, Subject, isObservable, of } from 'rxjs';
import { filter, first, map, mapTo, startWith, switchMap, tap } from 'rxjs/operators';
import { AbstractDynWrapper, DynWrapperProvider } from './dyn-control-wrapper.class';
import { AbstractDynControl, DynControlProvider } from './dyn-control.class';
import {
  DynCondition,
  DynConditionFn,
  DynMatcher,
  DynMatcherFn,
  DynMatchRelation,
} from './types/matcher.types';
import { DynNode } from './types/node.types';
import { DynFunction, DynFunctionFn } from './types/params.types';
import { DynBaseProvider } from './types/provider.types';
import {
  DynAsyncValidator,
  DynErrorHandler,
  DynErrorHandlerFn,
  DynErrorMessage,
  DynErrorMessages,
  DynErrors,
  DynValidator,
} from './types/validation.types';
import { isPlainObject } from './utils/merge.util';

/**
 * Mapper from plain Type<T> to DynControlProvider
 */
 export function mapControls() {
  return (component: Type<AbstractDynControl>): DynControlProvider => ({
    component,
    control: (component as any).dynControl,
    instance: (component as any).dynInstance,
  });
}

/**
 * Mapper from plain Type<T> to DynWrapperProvider
 */
export function mapWrappers() {
  return (component: Type<AbstractDynWrapper>): DynWrapperProvider => ({
    component,
    wrapper: (component as any).dynWrapper,
  });
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
export const defaultValidators: DynValidator[] = [
  { id: 'required', fn: () => Validators.required },
  { id: 'requiredTrue', fn: () => Validators.requiredTrue },
  { id: 'pattern', fn: (node: DynNode, pattern: string | RegExp) => Validators.pattern(pattern) },
  { id: 'minLength', fn: (node: DynNode, minLength: number) => Validators.minLength(minLength) },
  { id: 'maxLength', fn: (node: DynNode, minLength: number) => Validators.maxLength(minLength) },
  { id: 'email', fn: () => Validators.email },
  { id: 'min', fn: (node: DynNode, min: number) => Validators.min(min) },
  { id: 'max', fn: (node: DynNode, max: number) => Validators.max(max) },
].map(
  mapPriority<DynValidator>()
);

/**
 * Default async validators
 */
export const defaultAsyncValidators: DynAsyncValidator[] = [
  {
    id: 'RELATED',
    fn: (node: DynNode, config: DynMatchRelation, validator: ValidatorFn = Validators.required) => {
      return (control: AbstractControl): Observable<ValidationErrors | null> => {
        return node.root.whenLoaded().pipe(
          switchMap(() => relatedConditionFn(config)(node)),
          map(hasMatch => hasMatch ? validator(control) : null),
          first(),
        );
      }
    }
  },
].map(
  mapPriority<DynAsyncValidator>()
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
      return ({ node, hasMatch, debug }) => {
        if (debug) { node.log(`DISABLE matcher`, hasMatch); }
        hasMatch ? node.control.disable() : node.control.enable();
      }
    }
  },
  {
    id: 'ENABLE',
    fn: (): DynMatcherFn => {
      return ({ node, hasMatch, debug }) => {
        if (debug) { node.log(`ENABLE matcher`, hasMatch); }
        hasMatch ? node.control.enable() : node.control.disable();
      }
    }
  },
  {
    id: 'SHOW',
    fn: (): DynMatcherFn => {
      return ({ node, hasMatch, debug }) => {
        if (debug) { node.log(`SHOW matcher`, hasMatch); }
        hasMatch ? node.visible() : node.hidden();
      }
    }
  },
  {
    id: 'INVISIBLE',
    fn: (): DynMatcherFn => {
      return ({ node, hasMatch, debug }) => {
        if (debug) { node.log(`INVISIBLE matcher`, hasMatch); }
        hasMatch ? node.invisible() : node.visible();
      }
    }
  },
  {
    id: 'HIDE',
    fn: (): DynMatcherFn => {
      return ({ node, hasMatch, debug }) => {
        if (debug) { node.log(`HIDE matcher`, hasMatch); }
        hasMatch ? node.hidden() : node.visible();
      }
    }
  },
  {
    id: 'CALL_HOOK',
    fn: (hook: string): DynMatcherFn => {
      return ({ node, hasMatch, results }) => {
        if (!hook) {
          console.warn(`[Hook] '${node.path.join('.')}' No hook name passed to CALL_HOOK`);
        } else if (hasMatch) {
          const [ payload ] = results;
          node.callHook({ hook, payload });
        }
      }
    }
  },
  {
    id: 'LISTEN_HOOK',
    fn: (observer: Subject<any>): DynMatcherFn => {
      return ({ node, hasMatch, results }) => {
        if (!observer || !isObservable(observer)) {
          console.warn(`[Hook] '${node.path.join('.')}' No observer passed to LISTEN_HOOK`);
        } else if (hasMatch) {
          const [ payload ] = results;
          observer.next(payload);
        }
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
      return (node: DynNode) => {
        return node.mode$.pipe(map(value => value === mode));
      }
    },
  },
  {
    id: 'HOOK',
    fn: (name: string): DynConditionFn => {
      return (node: DynNode) => {
        return node.hook$.pipe(
          filter(({ hook }) => hook === name),
          map(({ payload }) => payload ?? {}),
        );
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
      return ({ control, path }: DynNode) => {
        if (!control.errors) {
          return null;
        }
        // match the control errors with the configured messages
        let currentMatch = [];
        const config = Object.keys(messages).reduce<DynErrors|null>((result, key) => {
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
    fn: (messages: DynErrors): DynErrorHandlerFn => {
      return ({ control }: DynNode) => {
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
      return (node: DynNode) => {
        return node.control.value || defaultText;
      }
    },
  },
  {
    id: 'formatYesNo',
    fn: (isBinary = true, defaultText = '-'): DynFunctionFn<string> => {
      return (node: DynNode) => {
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
      return (node: DynNode) => {
        const value = node.control.value;
        const option = node.params.options.find((o: any) => o.value === value);
        return value && option ? option.value : value;
      }
    },
  },
  {
    id: 'getParamsField',
    fn: (field = 'label', defaultText = '-'): DynFunctionFn<string> => {
      return (node: DynNode) => {
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
  return (node: DynNode, debug = false) => {
    const control = node.search(path);
    if (!control) {
      console.error(`Control '${path}' not found inside a Condition`)
      return of(true); // do not break AND matchers
    }
    if (value === undefined) {
      // triggers with any valueChange
      return control.valueChanges.pipe(
        startWith(control.value),
        tap(() => {
          if (debug) { node.log(`debug condition`, { path, value: control.value }); }
        }),
        mapTo(true),
      );
    }
    return control.valueChanges.pipe(
      startWith(control.value),
      // compare the configured value
      map(controlValue => field && isPlainObject(controlValue)
        ? getPath(field.split('.'), controlValue)
        : controlValue
      ),
      map(controlValue => {
        if (debug) { node.log(`debug condition`, { path, value, controlValue }); }
        return Array.isArray(value)
          ? Array.isArray(controlValue)
            ? !Boolean(difference(value, controlValue).length) // value array is inside controlValue
            : value.includes(controlValue)
          : equals(value, controlValue);
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
