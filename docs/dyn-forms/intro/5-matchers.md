# Matchers (Draft)

Here we will learn how to execute *Matchers* depending on some given *Conditions*.

In complex forms use-cases, some controls directly depend on the value or status of some other form control. Then we implement custom behaviors, like `hiding` a field when another control has some value, or `disabling` it depending on a complex condition, etc.

## Definition

A *Matcher* is a task that is executed when a given set of *Conditions* are fulfilled.
They are able to manipulate the form hierarchy via the `DynNode` service attached to each control.

The `DynMatcherFn` function receives this set of parameters:

```typescript
interface DynMatcherFn {
  (args: {
    node: DynNode;
    hasMatch: boolean;
    firstTime: boolean;
    results: any[];
    debug: boolean;
  }): void;
}
```

and can be configured for each control as follows:

```typescript
createMatConfig('INPUT', {
  name: 'firstName',
  match: [
    {
      matchers: [(args: DynMatcherArgs) => {}]
      when: ...
    }
  ]
```

with these posible conditions:

```typescript
export interface DynMatch {
    matchers: DynConfigProvider<DynMatcherFn>[];
    operator?: 'AND' | 'OR';
    when: Array<DynConfigProvider<DynConditionFn> | DynMatchCondition>;
    negate?: boolean;
    debug?: boolean;
}
```

which means that we trigger the task inside the *Matcher* `when` a set of *Conditions* are fulfilled (all of them `AND` or just one at once `OR`).

When we want to do something only when the conditions are `NOT` fulfilled, we can `negate` the result of the conditions; this is also useful when it's easier to define the opposite case in the configuration.

## Built-in Matchers

The matchers included in the library are `DISABLE`, `ENABLE`, `SHOW`, `HIDE` (display: none), `INVISIBLE` (visibility: hidden), `VALIDATE`, `UPDATEDBY` (detect changes) and `PARAMS` (to update the control parameters with the result of the conditions).

For example the `DISABLE` matcher operates into the form control when the specified conditions are fulfilled (has match):

```typescript
{
  id: 'DISABLE',
  fn: (): DynMatcherFn => {
    return ({ node, hasMatch, debug }) => {
      if (debug) { node.log(`HIDE matcher`, hasMatch); }
      hasMatch ? node.control.disable() : node.control.enable();
    }
  }
},
```

## Conditional Validators

We have a AsyncValidator ready to be configured to conditionally validate a field depending on other control: `RELATED`. The [config-builder demo](https://mynd.dev/demos/dyn-forms/builder) uses it like this:

```typescript
  name: 'serial',
  asyncValidators: {
    RELATED: [{ path: 'accessType', value: MyndAccessType.SmartLock }],
  },
```

And the `serial` control will be required when the `accessType` field is equal to `SmartLock`. We can pass a custom `ValidatorFn` to be used too:

```typescript
  asyncValidators: {
    RELATED: [{ path: 'accessType', value: MyndAccessType.SmartLock }, Validators.min(3)],
  },
```

## Dependency between controls

Sometimes controls depends on other control values, if we use a custom function for the output value we can refresh our control specifying the dependencies:

```typescript
  params: {
    getValue: (node: DynNode) => {
      const value1 = node.search('anotherControl1').value;
      const value2 = node.search('anotherControl2').value;
      return value1 || value2;
    },
  }
  match: [
    {
      matchers: ['UPDATEDBY'],
      operator: 'OR',
      when: [
        { path: 'anotherControl1' },
        { path: 'anotherControl2' }
      ],
    }
  ],
```

## Next

- Check the article about [Conditional Tasks](https://dev.to/myndpm/conditional-tasks-in-dynamic-forms-h8) at dev.to/myndpm
- What else can we implement to support business-logic? join [this discussion](https://github.com/myndpm/open-source/discussions/4).
- Continue with the [Conditions](/docs/dyn-forms/intro/conditions) docs.
