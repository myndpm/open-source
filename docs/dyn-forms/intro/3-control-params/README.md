# Control Parameters (Draft)

Here we will understand all about the input Control Parameters.

## Definition

What do we understand about Parameters?
The parameters behave as the only `@Input` of the DynControls.
It receives any required data and also updates via matchers.

## Initialization

The params are initialized with the default configuration and merged with the current mode.
Also, there can be updates from custom functions like Matchers, or programatical node updates.

## Functions in Parameters

The config has `paramFns` which can be provided to be referenced by `id`.

The library provides some default functions like `getOptionText`, `getParamsField` and `formatYesNo`.

## Examples

We have used the parameters in the `ui-material` to define the labels, placeholders,
and any kind of data required by the field should be in the `params`.

That's why the Dynamic Control can implement the `completeParams` method so we can validate
the incoming params and we complete the missing fields with default values,
so the Control functionality and template works without exceptions.

### Material INPUT

We have implemented many of the supported Inputs of `mat-input` in the [DynMatInputComponent](https://github.com/myndpm/open-source/blob/master/libs/forms/ui-material/src/components/input/input.component.ts).

## Next

- Is it enough with the `params`? share your ideas in [this GitHub thread](https://github.com/myndpm/open-source/discussions/7).
