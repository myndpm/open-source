# Dynamic Controls (Draft)

Here we will learn about the core components of the Dynamic Forms: the Controls.

## Definition

What do we understand about Controls?
Everything inside the form is a control and is connected to some data: a Group, an Array, a Container, a Control.
Let's imagine a Profile form with the user data as follows:

```typescript
{
  user: {
    firstName: string;
    lastName: string;
  }
}
```

We can describe this form hierarchy in different layouts, one could be a styled container wrapping the nested controls:

```typescript
controls: [
  createMatConfig('CARD', {
    name: 'user',
    params: { title: 'Personal info' },
    controls: [
      createMatConfig('INPUT', {
        name: 'firstName',
        params: { label: 'First Name' }
      }),
      createMatConfig('INPUT', {
        name: 'lastName',
        params: { label: 'Last Name' }
      }),
    ]
  }),
]
```

or a flat list with hierarchical names to reproduce the same data:

```typescript
controls: [
  createMatConfig('INPUT', {
    name: 'user.firstName',
    params: { label: 'First Name' }
  }),
  createMatConfig('INPUT', {
    name: 'user.lastName',
    params: { label: 'Last Name' }
  }),
]
```

## Initialization

While creating a new form, the library recursively instantiates the declared controls of the configuration, and populates their component members:

1. Its `config` object (`DynControlConfig`)
2. any `params` specified in the config with its modes,
3. the corresponding `control` instance (Angular's `FormControl`, `FormGroup` or `FormArray`)

Each control is connected with a node (`DynNode` instance) which has the API to be programmatically managed, like searching other fields, manipulating the current `params`, its visibility, etc.

## Instance Types

1. `Container`: component that loads one or more groups via `dyn-group`
2. `Group`: component that loads one or more controls via `dynFactory`
3. `Array`: collection of groups usually loaded via `dyn-group` too.
4. `Control`: corresponds to the basic `FormControl`
5. `Wrapper`: component to layout controls

## Custom Controls

A control is a simple component extending one of the base classes of the library.
We can easily create new DynControls with the [@myndpm/dyn-forms:control](https://mynd.dev/docs/dyn-forms/intro/schematics) schematic.

### Technical Requirements

What do we need to define a Control?
The component has `static dynControl` property where we define the unique `id` to be referenced in the Configuration Object.

```typescript
class MyCustomList extends DynFormArray {
  static dynControl = 'MYLIST';
}
```

Optionally we can implement a `createConfig` factory and `completeParams` method. You can check example controls in the different ui subpackages.

### Provisioning

We can provide our custom controls directly in our module via `DynFormsModule.forFeature` in the following way:

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

We also can encapsulate them in a module using the [@myndpm/dyn-forms:module](https://mynd.dev/docs/dyn-forms/intro/schematics) schematic, and consuming `getModuleProviders` from `@myndpm/dyn-forms/core` just like the `ui-material` subpackage does (see its [source code](https://github.com/myndpm/open-source/blob/master/libs/forms/ui-material/src/dyn-forms-material.module.ts)).

## Wrappers

We can provide the control components dynamically, but there are more resources that we can define like Wrappers, which can decorate the controls and give them layout.

```typescript
class MyCustomList extends DynWrapper {
  static dynControl = 'MYLIST';
}
```

The only requirement is to extend from the `DynWrapper` base class. They have access to the control parameters and embed the wrapped control within a `dynContainer` in their template:

```html
<ng-container #dynContainer></ng-container>
```

## Providers

As we do with the control components, we can also provide some other resources like functions, error handlers, validators, and some other stuff that will be mentioned in their own section.

We provide factories of those resources connected to a string `id` to be referenced from the Configuration Object.
This enable us to have a plain Configuration Object invoking dynamic resources with some `arg`uments. 

```typescript
export interface DynBaseHandler<T> {
  id: DynConfigId;
  fn: (...args: any[]) => T;
  priority?: number;
}
```

Once we provide the resource:

```typescript
DynFormsModule.forFeature({
  functions: [
    {
      id: 'RESOURCE_ID',
      fn: (...args: any[]) => { ... }
    },
  ],
})
```

We can use any of these notations to reference it in the configuration:

```typescript
'RESOURCE_ID'
['RESOURCE_ID', args]
{ 'RESOURCE_ID': args }
```

## Next

- Share your impression and thoughts in [this GitHub thread](https://github.com/myndpm/open-source/discussions/27).
- Continue with the [Control Parameters](/docs/dyn-forms/intro/params) docs.
