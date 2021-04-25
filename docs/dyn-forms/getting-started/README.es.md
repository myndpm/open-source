# @myndpm/dyn-form

Aquí encontrarás cómo construir Formularios Dinámicos en Angular.

## Instalación

Puedes añadir esta librería a tu proyecto de Angular con:

```bash
npm add @myndpm/dyn-forms
# or
yarn add @myndpm/dyn-forms
```

## Configuración

Se recomienda importar lo módulos de Formularios Dinámicos
en los módulos que declaran los componentes que lo usan.
Esta librería no necesita importar nada en el Módulo Raíz,
a no ser que declares allí componentes que usen dyn-forms.

```typescript
import { DynFormsModule } from '@myndpm/dyn-forms`;

@NgModule({
  imports: [
    DynFormsModule,
  ]
})
```

La librería necesita que algunos Controles Dinámicos sean provistos,
ya que el módulo base no provee ninguno de forma predeterminada,
así que necesitamos incluir un `ui-package` de nuestra preferencia,
o nuestro propio módulo con nuestros controles personalizados como:

```typescript
import { ReactiveFormsModule } from '@angular/forms';
import { DynFormsMaterialModule } from '@myndpm/dyn-forms/ui-material`;

@NgModule({
  imports: [
    ReactiveFormsModule,
    DynFormsMaterialModule.forRoot(),
  ]
})
```

El módulo `DynFormsMaterialModule` incluye el módulo base `DynFormsModule`
y otros proveedores requeridos para que que no necesitas importar nada más.

## Uso

Con la configuración anterior ahora puedes usar el componente `dyn-form`:

```html
<form [formGroup]="form">
  <dyn-forms [form]="form" [config]="config"></dyn-forms>
</form>
```

donde el formulario es el `FormGroup` que se usa usualmente en Reactive Forms
y la configuración puede ser construída con una función útil provista por el `ui-package`:

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

## A Continuación

- Mira el código fuente del demo [simple-form](https://github.com/myndpm/open-source/tree/master/apps/website/src/app/demos/submodules/dyn-forms/components/simple).
- Revisa la sección de [Controles Dinámicos](/docs/dyn-forms/intro/dynamic-controls) para aprender más sobre la configuración.
