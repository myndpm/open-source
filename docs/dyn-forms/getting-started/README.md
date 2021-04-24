# @myndpm/dyn-form

Here you will find how to build Dynamic Forms for Angular.

## Installation

You can add this library to your Angular project with:

```bash
npm add @myndpm/dyn-forms
# or
yarn add @myndpm/dyn-forms
```

## Setup

It's recommended to import the Dynamic Forms
in the module which declares the component using it.
This library doesn't need anything in the root Application Module,
unless you declare there components that use dyn-forms.

```typescript
import { DynFormsModule } from '@myndpm/dyn-forms';

@NgModule({
  imports: [
    DynFormsModule,
  ]
})
```

The library needs some Dynamic Controls to be provided,
the base module doesn't provide any by default,
so we will need to include a `ui-package` of our preference,
or our own module with our custom controls like:

```typescript
import { DynFormsMaterialModule } from '@myndpm/dyn-forms/ui-material`;

@NgModule({
  imports: [
    DynFormsMaterialModule.forRoot(),
  ]
})
```

The `DynFormsMaterialModule` includes the base module `DynFormsModule`
and other the required providers so you don't need to import anything else.

## Usage

With the previous setup you're able to use the `dyn-form` component:

```html
<dyn-forms [form]="form" [config]="config"></dyn-forms>
```

where the config can be built with some utility functions provided by the `ui-package`:

```typescript
import { DynFormConfig } from '@myndpm/dyn-forms';
import { createMatConfig } from '@myndpm/dyn-forms/ui-material';

const config: DynFormConfig = {
  controls: [
    createMatConfig('INPUT', {
      params: { label: 'My text input' }
    }),
  ],
}
```

Look the [Dynamic Controls](/docs/dyn-forms/intro/dynamic-controls) sections to learn more about their configuration.
