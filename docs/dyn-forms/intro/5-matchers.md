# Matchers (Draft)

*Matchers* execute a behavior depending on some configured *Conditions*,
like hiding a control when another one has a specific value,
or a custom business condition triggering some form updates.

A matcher is a task that is executed when a given set of Conditions are fulfilled.
They are basically functions (`DynMatcherFn`) that receives this set of parameters:

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

They are able to manipulate the form hierarchy via the `DynNode` service attached to each control.

## Built-in Matchers

The matchers included in the library are `DISABLE`, `ENABLE`, `SHOW`, `HIDE` (display: none), `INVISIBLE` (visibility: hidden), `VALIDATE`, `UPDATEDBY` (detect changes) and `PARAMS` (to update the control parameters with the result of the conditions).

For example, the `DISABLE` matcher operates into the form control when the specified conditions are fulfilled (has match):

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

## Configuration

We trigger a task inside the Matcher `when` all (`AND`) or some (`OR`) the *Conditions* are truthy:

```typescript
export interface DynMatch {
    matchers: DynConfigProvider<DynMatcherFn>[];
    operator?: 'AND' | 'OR';
    when: Array<DynConfigProvider<DynConditionFn> | DynMatchCondition>;
    negate?: boolean;
    debug?: boolean;
}
```

like the following configuration:

```typescript
createMatConfig('INPUT', {
  name: 'zipCode',
  match: [
    {
      matchers: ['SHOW']
      when: [
        {
          path: 'city',
          value: 'New York'
        }
      ]
    }
  ]
```

## Negation

When we want to do something only when the conditions are `NOT` fulfilled, we can `negate` the result of the conditions, or just one of them; this is also useful when it's easier to define the opposite case in the configuration.

For example, sometimes we don't have a complete list of the values to trigger a Matcher but we know the ones that should not trigger it. So we can negate the single condition or use the opposite Matcher (like show/hide, enable/disable).

```typescript
createMatConfig('INPUT', {
  name: 'zipCode',
  match: [
    {
      matchers: ['HIDE']
      when: [
        {
          path: 'city',
          value: ['New York', 'Medellin'],
          negate: true
        }
      ]
    }
  ]
```

Note that the `DEFAULT` condition operates arrays values, from the configuration and the control, explained in the *Conditions* section.

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
