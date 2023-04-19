# Events (Draft)

Dynamic controls are able to propagate different events in different ways.

We can pass a function via `params` to be called in the middle of the process of a Dynamic Control,
like opening a confirmation modal before removing a value or item.

## Hooks

Each `DynNode` has the ability to `callHooks` a an event propagated through the subcontrols.
The hook has a string `id` and an optional payload.

```typescript
export interface DynHook {
    hook: string;
    payload?: any;
    plain?: boolean;
}
```

It could be propagated to the all the subcontrols if it's `plain`
or in a hierarchical way if the `payload` matches the subcontrols and `plain` is `false`.

That's the way used by `dyn-form.patchValue` to hierarchically fill the form with a data object.

## Related Matchers

We have the `CALL_HOOK` and `LISTEN_HOOK` matchers to get in the middle of the processes.

```typescript
createMatConfig('AUTOCOMPLETER', {
  name: 'user',
  match: [
    {
      matchers: [{ 'CALL_HOOK': 'NotifyBackend' }],
      when: ...
    }
  ]
```

```typescript
createMatConfig('TABLE', {
  name: 'items',
  match: [
    {
      matchers: [{ 'LISTEN_HOOK': (observer) => {} }],
      when: ...
    }
  ]
```

## Next

- Check the source code of the [table demo](https://mynd.dev/demos/dyn-forms/simple-form) with the `TABLE` control.
- Continue with the [Debugging Options](/docs/dyn-forms/intro/debugging) docs.
