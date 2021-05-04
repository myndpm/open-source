# Control Parameters

DRAFT. Here we will understand all about the input Control Parameters.

## Definition

What do we understand about Parameters?
The parameters behave as the only `@Input` of the DynControls.
It receives any required data and also updates via matchers.

## Initialization

The params are initialized with the default configuration and merged with the current mode.
Also, there can be updates from custom functions like Matchers, or programatical node updates.

## Examples

We have used the parameters in the `ui-material` to define the labels, placeholders,
and any kind of data required by the field should be in the `params`.

That's why the Dynamic Control requires the `completeParams` method so we can validate
the incoming params and we complete the missing fields with default values,
so the Control functionality and template works as expected.
