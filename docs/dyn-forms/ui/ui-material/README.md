# @myndpm/dyn-forms/ui-material

This subpackage provides the `DynControls` to use the Angular Material components.

## Usage

To provide it in your module you just need to import it:

```typescript
import { ReactiveFormsModule } from '@angular/forms';
import { DynFormsMaterialModule } from '@myndpm/dyn-forms/ui-material`;

@NgModule({
  imports: [
    ReactiveFormsModule,
    DynFormsMaterialModule.forFeature(),
  ]
})
```

and build your config with the provided Factory:

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

You can check the [demos](https://mynd.dev/demos) built with the Material `DynControls`.
