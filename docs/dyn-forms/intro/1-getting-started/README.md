# @myndpm/dyn-form

Here you will find how to build Dynamic Forms for Angular.

This library aims to be a quite *generic* and *lightweight* layer on the top of Angular's Reactive Forms to enable a declarative way to build our stuff.

## Installation

You can add this library to your Angular project with:

```bash
npm install @myndpm/dyn-forms
# or
yarn add @myndpm/dyn-forms
```

## Setup

It's recommended to import the Dynamic Forms
in the module which declares the component using it.
This library doesn't need anything in the root Application Module,
unless you declare components that use dyn-forms there.

```typescript
import { DynFormsModule } from '@myndpm/dyn-forms';

@NgModule({
  imports: [
    DynFormsModule,
  ]
})
```

The library needs some Dynamic Controls to be provided,
the core module doesn't provide any by default,
so we will need to include a `ui-package` of our preference
(or build our own module with our custom controls).

```typescript
import { ReactiveFormsModule } from '@angular/forms';
import { DynFormsMaterialModule } from '@myndpm/dyn-forms/ui-material';

@NgModule({
  imports: [
    ReactiveFormsModule,
    DynFormsMaterialModule.forFeature(),
  ]
})
```

The `DynFormsMaterialModule` includes the core module `DynFormsModule`
and the required providers so you don't need to import anything else.

## Usage

With the previous setup you're able to use the `dyn-form` component:

```html
<form [formGroup]="form">
  <dyn-forms [form]="form" [config]="config"></dyn-forms>
</form>
```

where the form is the usual `FormGroup` used in Reactive Forms
and the config can be built with some utility functions provided by the `ui-package`:

```typescript
import { FormGroup } from '@angular/forms';
import { DynFormConfig } from '@myndpm/dyn-forms';
import { createMatConfig } from '@myndpm/dyn-forms/ui-material';

const form = new FormGroup({});

const config: DynFormConfig = {
  controls: [
    createMatConfig('INPUT', {
      params: { label: 'My text input' }
    }),
  ],
}
```

## Next

- Check the source code of the [simple-form](https://github.com/myndpm/open-source/tree/master/apps/website/src/app/demos/submodules/dyn-forms/components/simple) demo.
- Look the [Dynamic Controls](/docs/dyn-forms/intro/dynamic-controls) sections to learn more about their configuration.
- Share your experience and suggestions about this setup in [this GitHub thread](https://github.com/myndpm/open-source/discussions/26).
- Join us on [Discord](https://discord.gg/XxEqkvzeXg).
