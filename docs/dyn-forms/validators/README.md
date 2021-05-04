# Validators

DRAFT. Here we will understand how we provide Validators to our Dynamic Forms.

## Definition

Validators and AsyncValidatos are the well-known Control options that we have in Angular.
We have Validator Functions (`ValidatorFn`) like `Validators.required`, and some others are Validator Factories (`(args) => ValidatorFn`).

## Provision

Validators are also referenced with an `id` connected with a (Async)Validator Factory `fn`:

```typescript
export interface DynControlValidator {
  id: string;
  fn: (...args: any[]) => ValidatorFn;
}
```

## Custom Validators

As mentioned, all we need is to provide our ValidatorFn Factory with an id and a fn. So we can easily provide them in our module with `DynFormsModule.forFeature({ validators })`.

## Async Validators

An example of AsyncValidator with a custom API call here.

## Next

- Check the article about [Parametrized Validators](https://dev.to/myndpm/parametrized-validators-in-dynamic-forms-5emf) at DEV.to
