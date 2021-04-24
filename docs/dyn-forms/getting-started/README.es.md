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
import { DynFormsMaterialModule } from '@myndpm/dyn-forms/ui-material`;

@NgModule({
  imports: [
    DynFormsMaterialModule.forRoot(),
  ]
})
```

El módulo `DynFormsMaterialModule` incluye el módulo base `DynFormsModule`
y otros proveedores requeridos para que que no necesitas importar nada más.
