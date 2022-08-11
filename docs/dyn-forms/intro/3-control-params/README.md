# Control Parameters (Draft)

Here we will understand all about the input Control Parameters.

## Definition

What do we understand about Parameters?
The parameters behave as the only `@Input` of the DynControls.
We pass any required data to the Control through the params, which can be async.
They could be also updated via Matchers.

## Initialization

The default configuration params are merged with the current mode config (if any).
Also, there can be updates from custom functions like Matchers, or programatical node updates.

## Functions in Parameters

The config has a `paramFns` field which can be used to provide functions by `id`.

The library provides some default functions like `getOptionText`, `getParamsField` and `formatYesNo`. Check how they are used in the [simple dynamic form](https://mynd.dev/demos/dyn-forms/simple-form) demo config.

## Examples

We have used the parameters in the `ui-material` to define the labels, placeholders, etc.
Any kind of data required by the field should be in the `params`.

For safety, the Dynamic Control can implement the `completeParams` method so it can validate
the incoming params and complete the missing fields with default values,
to avoid exceptions in the template and guarantee the expected functionality of the control.

### Material INPUT

We have implemented many of the supported Inputs of `mat-input` in the [DynMatInputComponent](https://github.com/myndpm/open-source/blob/master/libs/forms/ui-material/src/components/input/input.component.ts) parameters.

## Next

- Is it enough with the `params`? share your ideas in [this GitHub thread](https://github.com/myndpm/open-source/discussions/7).
