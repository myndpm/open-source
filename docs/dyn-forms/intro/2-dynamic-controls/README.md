# Dynamic Controls (Draft)

Here we will study about the core features of Dynamic Forms: the Controls.

## Definition

What do we understand about Controls?
Everything is a control: a Group, an Array, a Container, a Control. They can be nested to describe our form hierarchy, or can be a flat list with nested names (ie. `parentName.controlName`).

## Initialization

While creating a new form, the library recursively instantiates the declared Dynamic Controls components, and populates their code fields:

1. Its corresponding `config` object (`DynControlConfig`)
2. any `params` specified in the config in modes or matchers,
3. the corresponding `control` instance (`FormControl`, `FormGroup` or `FormArray`)

Each node is connected with a `DynTreeNode` instance which has the API to be programmatically manipulated, like querying and selecting other fields, accessing the `control` instance, the current `params`, manipulating its visibility, etc.

## Custom Controls

We can easily create new DynControls with the [@myndpm/dyn-forms:control schematic](https://mynd.dev/docs/dyn-forms/intro/schematics).

### Technical Requirements

What do we need to define a Control?
An `id` in form of `static dynControl` property. to reference the control in the Configuration Object.

### Provisioning

We can provide our custom controls directly in our module, or encapsulated and reused in another module which can be created with the [@myndpm/dyn-forms:module schematic](https://mynd.dev/docs/dyn-forms/intro/schematics).

## Next

- Share your impression and thoughts in [this GitHub Thread](https://github.com/myndpm/open-source/discussions/27).
