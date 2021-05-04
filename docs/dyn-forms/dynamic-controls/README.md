# Dynamic Controls

DRAFT. Here we will study about the core features of Dynamic Forms: the Controls.

## Definition

What do we understand about Controls?
Everything is a control: a Group, an Array, a Container, a Control. They can be nested to describe our form hierarchy.

## Initialization

While creating a new form, the library recursively instantiates the declared Dynamic Controls components, and populates their code fields:

1. Its corresponding `config` object (`DynControlConfig`)
2. any `params` specified in the config in modes or matchers,
3. the corresponding `control` instance (`FormControl`, `FormGroup` or `FormArray`)

## Custom Controls

### Technical Requirements

What do we need to define a Control?
An `id` in form of `static dynControl` property. to reference the control in the Configuration Object.

### Provisioning

We can provide our custom controls directly in our module, or encapsulated and reused in another module.
