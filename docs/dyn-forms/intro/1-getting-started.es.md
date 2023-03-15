# @myndpm/dyn-form

Aquí encontrarás cómo construir Formularios Dinámicos en Angular.

Esta librería pretende ser una capa muy *genérica* y *ligera* usando los Formularios Reactivos de Angular para habilitar una forma declarativa de construir nuestros formularios.

Es capaz de crear un formulario funcional a partir de un objeto JSON que puede importarse desde un archivo de configuración, venir de la base de datos, o generado desde adaptadores.

## Instalación

Puedes añadir esta librería a tu proyecto de Angular con:

```bash
npm install @myndpm/dyn-forms
# or
yarn add @myndpm/dyn-forms
```

y actualizar una version previa con `ng update @myndpm/dyn-forms`.

## Configuración

Se recomienda importar lo módulos de Formularios Dinámicos
en los módulos que declaran los componentes que usan `<dyn-form>`.
Esta librería no necesita importar nada en el Módulo Raíz,
a no ser que declares allí componentes que usen dyn-forms.

```typescript
import { DynFormsModule } from '@myndpm/dyn-forms';

@NgModule({
  imports: [
    DynFormsModule,
  ]
})
```

La librería necesita que algunos Controles Dinámicos sean provistos,
ya que el módulo base no provee ninguno de forma predeterminada,
así que necesitamos incluir un `ui-package` de nuestra preferencia,
o nuestro propio módulo con nuestros controles personalizados.

```typescript
import { ReactiveFormsModule } from '@angular/forms';
import { DynFormsMaterialModule } from '@myndpm/dyn-forms/ui-material';

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
  <dyn-forms [form]="form" [config]="config" [mode]="mode"></dyn-forms>
</form>
```

donde el formulario es el `FormGroup` que se usa usualmente en Reactive Forms
y la configuración puede ser construída con una factory provista por el `ui-package`:

```typescript
import { FormGroup } from '@angular/forms';
import { DynFormConfig } from '@myndpm/dyn-forms';
import { createMatConfig } from '@myndpm/dyn-forms/ui-material';

const form = new FormGroup({});

const config: DynFormConfig = {
  controls: [
    createMatConfig('INPUT', {
      params: { label: 'Mi nombre' }
    }),
  ],
}
```

## Modos

La visión de esta librería es tambien reusar el formulario para mostrar los datos después de ser editados; esto es equivalente a decir que el formulario tiene diferentes modos como `edit` y `display` (por ejemplo).

La configuración se define para un modo por defecto, y podemos sobreescribir algunos valores para un modo diferente. Consideremos un modo para `edit` por defecto, y luego que es enviado cambia a modo `display`. Podríamos entonces tener una configuración como esta:

```typescript
createMatConfig('INPUT', {
  name: 'address',
  params: {
    label: 'Cual es tu dirección?'
  },
  modes: {
    display: {
      params: {
        label: 'Tu dirección es',
        readonly: true,
      }
    }
  }
}),
```

Puedes deducir qué pasa cuando el modo `display` sobreescribe los valores principales?

Puedes ver cómo funciona en el demo de [formulario dinámico simple](https://mynd.dev/demos/dyn-forms/simple-form).

### Debugueando

Podemos ver qué pasa denro de la libreria proveyendo `DYN_LOG_LEVEL` en el módulo que queremos revisar:

```typescript
import { DYN_LOG_LEVEL, DynLogLevel } from '@myndpm/dyn-forms/logger';

  providers: [
    {
      provide: DYN_LOG_LEVEL,
      useValue: DynLogLevel.All | DynLogLevel.Testing,
    }
  ]
```

y también podemos debuguear una sección específica de nuestro formulario deiniendo el nivel en la configuración:

```typescript
const config: DynFormConfig = {
  debug: DynLogLevel.Runtime,
  controls: [
    createMatConfig('INPUT', {
      debug: DynLogLevel.None,
```

## A Continuación

- Mira el código fuente del demo [simple-form](https://github.com/myndpm/open-source/tree/master/apps/website/src/app/demos/submodules/dyn-forms/components/simple).
- Revisa la sección de [Controles Dinámicos](/docs/dyn-forms/intro/dynamic-controls) para aprender más sobre la configuración.
- Comparte tu experiencia y tus sugerencias en [este hilo de GitHub](https://github.com/myndpm/open-source/discussions/26).
- Únete a nuestro [Discord](https://discord.gg/XxEqkvzeXg).
