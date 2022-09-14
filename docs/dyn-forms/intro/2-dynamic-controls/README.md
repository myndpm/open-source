# Dynamic Controls (Draft)

Here we will learn about the core members of the Dynamic Forms: the Controls.

## Definition

What do we understand about Controls?
Everything is a control: a Group, an Array, a Container, a Control. They can be nested to describe our form hierarchy, or they can be a flat list with nested names (ie. `parentName.controlName`).

## Initialization

While creating a new form, the library recursively instantiates the declared controls of the configuration, and populates their code fields:

1. Its corresponding `config` object (`DynControlConfig`)
2. any `params` specified in the config with its modes,
3. the corresponding `control` instance (`FormControl`, `FormGroup` or `FormArray`)

Each node is connected with a `DynTreeNode` instance which has the API to be programmatically managed, like searching other fields, accessing the `control` instance, the current `params`, manipulating its visibility, etc.

## Instance Types

1. `Container`: component that loads one or more groups via `dyn-group`
2. `Group`: component that loads one or more controls via `dynFactory`
3. `Array`: collection of groups usually loaded via `dyn-group` too.
4. `Control`: corresponds to the basic `FormControl`
5. `Wrapper`: component to layout controls

## Custom Controls

We can easily create new DynControls with the [@myndpm/dyn-forms:control](https://mynd.dev/docs/dyn-forms/intro/schematics) schematic.

### Technical Requirements

What do we need to define a Control?
The control `id` specified in the `static dynControl` property, to reference it in the Configuration Object.

### Provisioning

We can provide our custom controls directly in our module, or encapsulated and reused in another module which can be created with the [@myndpm/dyn-forms:module](https://mynd.dev/docs/dyn-forms/intro/schematics) schematic.

For the first case, we can use `DynFormsModule.forFeature` in the following way:

```typescript
import { DynFormsModule } from '@myndpm/dyn-forms';

DynFormsModule.forFeature({
  controls: [
    MyCustomComponent,
  ],
  priority: 100,
})
```

the `priority` is usefull to override any default control.

The modules can use `getModuleProviders` from `@myndpm/dyn-forms/core` just like the `ui-material` subpackage does (see its [source code](https://github.com/myndpm/open-source/blob/master/libs/forms/ui-material/src/dyn-forms-material.module.ts)).

## Next

- Share your impression and thoughts in [this GitHub thread](https://github.com/myndpm/open-source/discussions/27).
