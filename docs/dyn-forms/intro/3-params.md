# Control Parameters (Draft)

Parameters are like the `@Input`s of the Dynamic Controls, they can be plain or reactive,
and the library will take care of filling the values in the `params` member of the component
to be used in the template like:

```html
<mat-card>
  <mat-card-header>
    <mat-card-title *ngIf="params.title">{{ params.title }}</mat-card-title>
    <mat-card-subtitle *ngIf="params.subtitle">{{ params.subtitle }}</mat-card-subtitle>
  </mat-card-header>
  ...
```

Later we will see that we can update the parameters with Matchers or programatical node updates.

## Functions in Parameters

We can provide inline functions in our configuration:

```typescript
createMatConfig('INPUT', {
  name: 'address',
  params: {
    getValue: (node: DynNode) => node.control.value
  },
}),
```

But to keep the object plain we can provide our functions and reference them  by `id`.

```typescript
DynFormsModule.forFeature({
  functions: [
    {
      id: 'MY_FUNCTION_ID',
      fn: (...args: any[]) => {
        return (node: DynNode) => {
          ...
        }
      }
    },
  ],
})
```

The config has a `paramFns` field which can be used like:

```typescript
createMatConfig('INPUT', {
  name: 'address',
  paramFns: {
    getValue: 'MY_FUNCTION_ID'
  },
}),
```

The library provides some default functions like `formatText`, `formatYesNo`, `getOptionText` and `getParamsField`. Check their source code at the [repository](https://github.com/myndpm/open-source/blob/master/libs/forms/core/src/dyn-providers.ts) `defaultFunctions` variable.

## Examples

We have used the parameters in the `ui-material` to define the labels, placeholders, etc.
Any kind of data required by the field should be in the `params` and `paramFns`.

For safety, the Dynamic Control can implement the `completeParams` method so it can validate
the incoming params and complete the missing fields with default values,
to avoid exceptions in the template and guarantee the expected functionality of the control.

### Material INPUT

We have implemented many of the supported Inputs of `mat-input` in the [DynMatInputComponent](https://github.com/myndpm/open-source/blob/master/libs/forms/ui-material/src/components/input/input.component.ts) parameters.

## Next

- Is it enough with the `params`? share your ideas in [this GitHub thread](https://github.com/myndpm/open-source/discussions/7).
- Continue with the [Modes](/docs/dyn-forms/intro/modes) docs.
