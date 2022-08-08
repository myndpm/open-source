# Matchers and Conditions (Draft)

Here we will learn how to execute Matchers depending on some given Conditions.

In complex forms use-cases, some controls directly depend on the value or status of some other form control. Then we implement custom behaviors, like `hiding` a field when another control has some value, or `disabling` it depending on a complex condition, etc.

## Definition

A `Matcher` is a task that is executed when a given set of `Conditions` are fulfilled. They are able to manipulate the form hierarchy via the `DynTreeNode`.

## Conditions

To match a special requirement, we need to define one or more conditions, so when all (AND) or one (OR) of them are fulfilled we run a particular task. The Condition Function type consists of:

```typescript
interface DynConditionFn {
  (node: DynTreeNode): Observable<any>;
}
```

it streams a truthy value whenever the condition is fulfilled or not, for example, we could check if a specific control has the expected value:

```typescript
(node: DynTreeNode) => {
  return node.search('some.control').valueChanges.pipe(
    map(controlValue => controlValue === 'xValue'),
  );
}
```

we can join these conditions with the required operator (`AND | OR`) for our use-case, and then execute a specific `Matcher`.

## Matchers

We define our requirement with the Matchers that we want to run when all or a single condition is satisfied:

```typescript
match: [
  {
    matchers: ['DISABLE'], // one or more matchers
    when: [{
      // the library provides a DEFAULT condition handler
      // to process path, value and negation
      path: 'other.field',
      value: 'expectedValue'
    }]
  }
]
```

the `DISABLE` matcher is included in the library with `ENABLE`, `SHOW`, `HIDE` (display: none), `INVISIBLE` (visibility: hidden) and `VALIDATE`.

One matcher consists of a function which performs a task in the form hierarchy; to do so, it receives the `DynTreeNode` instance:

```typescript
interface DynMatcherFn {
  (args: {
    node: DynTreeNode;
    hasMatch: boolean;
    firstTime: boolean;
    results: any[];
  }): void;
}
```

For example the `DISABLE` matcher operates into the form control when the specified conditions are fulfilled (has match):

```typescript
{
  id: 'DISABLE',
  fn: (): DynMatcherFn => {
    return ({ node, hasMatch }) => {
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

## Dependency between fields

Sometimes controls depends on other control values, if we use a custom function for the output value we can refresh our control specifying the dependencies:

```typescript
  params: {
    getValue: (node: DynTreeNode) => {
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

- Check the article about [Conditional Tasks](https://dev.to/myndpm/conditional-tasks-in-dynamic-forms-h8) at DEV.to
- What else can we implement to support business-logic? join [this discussion](https://github.com/myndpm/open-source/discussions/4).
