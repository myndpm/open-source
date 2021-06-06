# Validators (Draft)

Here we will understand how we provide Validators to our Dynamic Forms.

## Definition

Validators and AsyncValidatos are the well-known Control options that we have in Angular.
We have Validator Functions (`ValidatorFn`) like `Validators.required`, and some others are Validator Factories (`(node, ...args) => ValidatorFn`).

## Default Validators

The library provides the Validator Factories for the default Angular Validators: `required`, `requiredTrue`, `pattern`, `minLength`, `maxLength`, `email`, `min` and `max`. The notation to use them in the config is as follows:

```typescript
// without parameters
validators: ['required'],

// with parameters as array
validators: ['required', ['min', 1] ],

// with parameters as object
validators: { required: null, minLength: 4 },
```

## Typings

Validators are also referenced with an `id` connected with a (Async)Validator Factory `fn`:

```typescript
export interface DynControlValidator {
  id: string;
  fn: (node: DynTreeNode, ...args: any[]) => ValidatorFn; // validator factory
}
```

## Custom Validators

As mentioned, all we need is to provide our `ValidatorFn` Factory with an id and a fn. So we can easily provide them in our module with `DynFormsModule.forFeature({ validators })`.

## Async Validators

TODO: Reference an AsyncValidator example with a custom API call here.

## Next

- Check the article about [Parametrized Validators](https://dev.to/myndpm/parametrized-validators-in-dynamic-forms-5emf) at DEV.to
- Check the source code of the [demos](https://mynd.dev/demos) with already implemented validators.
- Join the Validators discussion in [this GitHub thread](https://github.com/myndpm/open-source/discussions/2) if you have something to say.
