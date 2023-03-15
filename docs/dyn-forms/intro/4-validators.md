# Validators (Draft)

Here we will understand how we provide Validators to our Dynamic Forms.

## Definition

Validators and AsyncValidatos are the well-known Control options that we have in Angular.
We have Validator Functions (`ValidatorFn`) like `Validators.required`, and some others are Validator Factories (`(node, ...args) => ValidatorFn`) which builds a Validator based on some parameters like `Validators.minLength(4)`.

## Default Validators

The library uses Validator Factories for the default Angular Validators: `required`, `requiredTrue`, `pattern`, `minLength`, `maxLength`, `email`, `min` and `max`. The notation to use them in the config is as follows:

```typescript
// without parameters
validators: ['required'],

// with parameters as array
validators: ['required', ['min', 1] ],

// with parameters as object
validators: { required: null, minLength: 4 },

// with an inline ValidatorFn or ValidatorFn factory
validators: [myValidatorFn, myValidatorFactory(args)],
```

## Typings

Validators are also referenced with an `id` connected with a (Async)Validator Factory `fn`:

```typescript
export interface DynValidator {
  id: string;
  fn: (node: DynNode, ...args: any[]) => ValidatorFn; // validator factory
}
```

## Custom Validators

All we need is to provide our `ValidatorFn` Factory with an id and a fn like:

```typescript
DynFormsModule.forFeature({
  validators: [
    {
      id: 'MY_VALIDATOR',
      fn: (node: DynNode, ...args: any[]) => {
        return (control: AbstractControl<any, any>): ValidationErrors | null => {
          ...
        }
      }
    },
  ],
})
```

and consume it in our configuration:

```typescript
createMatConfig('INPUT', {
  name: 'address',
  validators: ['MY_VALIDATOR', ['MY_VALIDATOR', 2] ],
}),
```

## Async Validators

TODO: Reference an AsyncValidator example with a custom API call here.

## Error Messages

After the validators are set, we will get a `ValidationErrors` object like:

```javascript
{ required: true }
```

and we need to translate it to a proper error message.  
As usual, we have many layers and options to define or calculate the error message to show.

We can define a global/container error for the default `FORM` error handler,
and specify the path of the control to configure a single error message for it:

```javascript
const config: DynFormConfig = {
  ...
  errorMsgs: {
    firstName: 'First name is required',
  }
}
```

There's also a `CONTROL` level handling inside each Control Config:

```javascript
createMatConfig('INPUT', {
  name: 'firstName',
  errorMsg: 'Your custom error message here',
```

But let's suppose that this control has many validators and you want to show different error messages for each case, so you can also specify an object with the corresponding messages:

```javascript
createMatConfig('INPUT', {
  name: 'firstName',
  validators: ['required', ['minLength', 2]],
  errorMsg: {
    required: 'First name is mandatory',
    minlength: 'This must be a valid name',
  },
```

These configurations can be handled by parent containers if the control do not specify any,
but the first handler returning a message will be taken, and you can provide your own algorithm. See the [default error handlers](https://github.com/myndpm/open-source/blob/master/libs/forms/core/src/dyn-providers.ts#L186).

## Next

- Check the article about [Parametrized Validators](https://dev.to/myndpm/parametrized-validators-in-dynamic-forms-5emf) at dev.to/myndpm
- Check the source code of the [demos](https://mynd.dev/demos) with already implemented validators.
- Join the Validators discussion in [this GitHub thread](https://github.com/myndpm/open-source/discussions/2) if you have something to say.
- Continue with the [Matchers](/docs/dyn-forms/intro/matchers) docs.
