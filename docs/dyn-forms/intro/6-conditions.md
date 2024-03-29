# Matcher Conditions (Draft)

To match a special requirement, we need to define one or more *Conditions*, so when all (`AND`) or one (`OR`) of them are fulfilled we run one or more *Matchers*.

The Condition Function type consists of:

```typescript
interface DynConditionFn {
  (node: DynNode, debug?: boolean): Observable<any>;
}
```

it streams a truthy value whenever the condition is fulfilled or not, for example, we could check if a specific control has the expected value:

```typescript
(node: DynNode) => {
  return node.search('some.control').valueChanges.pipe(
    map(controlValue => controlValue === 'xValue'),
  );
}
```

we can join these conditions with the required operator (`AND | OR`) for our use-case, and then execute a specific `Matcher`.

## Built-in Conditions

The library provides the the `HOOK` (listen and passes the payload of a hook), `MODE` (truthy if the current mode is the specified one) and `DEFAULT` conditions at the moment.

They can be configured just like the other providers:

```typescript
// truthy when we switch to 'edit' mode
when: [ ['MODE', 'edit'] ]

// truthy when we receive the AddItem hook
when: [ ['HOOK', 'AddItem'] ]

// truthy when city control is 'New York' (DEFAULT condition)
when: [
  {
    path: 'city',
    value: 'New York'
  }
]

// or a custom condition with arguments
when: [
  {
    condition: 'MY_CONDITION',
    ...args
  }
]
```

## DEFAULT Condition

Id there's no custom `condition` specified, the `DEFAULT` condition takes care
of listening the value of a specific control and compare it to a expected value.
It receives these parameters to evaluate a specific sibling control:

```typescript
interface DynMatchRelation {
  path: string; // query relative to the control with the matcher
  field?: string; // field to process if the control value is an object
  value?: DynConfigArgs;
  compareFn?: (value: any, valueControl: any) => boolean;
  negate?: boolean; // negate the result of the condition
}
```

The criteria of this condition is as follows:

* if `compareFn` is provided it is used first
* if the configured `value` is an array
  * if the control value is an array it should contain the configured values (intersection)
  * if the control has a plain value it should be in the configured array
* if the configured `value` is plain it should be exactly equal to the control value

Let's suppose we want to `DISABLE` a control when `other.field` has a expected value, then we configure it like this:

```typescript
match: [
  {
    matchers: ['DISABLE'], // one or more matchers
    when: [
      {
        path: 'other.field',
        value: 'expectedValue' // must be equal
      }
    ]
  }
]
```

or if our control is a MultiSelect we can expect an `Array` of values to be present in the `user.roles` value:

```typescript
match: [
  {
    matchers: ['SHOW'],
    when: [
      {
        path: 'user.roles',
        value: ['admin', 'editor'] // intersects
      }
    ]
  },
  {
    matchers: ['DISABLE'],
    when: [
      {
        path: 'user.roles',
        value: 'guest' // included in the control array
      }
    ]
  }
]
```

with this config a control will be shown if the selected roles includes all the configured values (`admin` and `editor`), and also will be disabled if `guest` is included in the list of `user.roles`.

## Next

- Share suggestions to understand the conditions better in [this GitHub thread](https://github.com/myndpm/open-source/discussions/47).
- Continue with the [Events](/docs/dyn-forms/intro/events) docs.