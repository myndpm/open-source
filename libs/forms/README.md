# @myndpm/dyn-forms

Abstract layer to easily generate Dynamic Forms for Angular.

With this library we are able to dynamically create the Form Controls hierarchy from a Configuration Object, which is comprised of nested configuration objects which corresponds one-to-one with form controls.

The documentation is available at [mynd.dev/docs/dyn-forms](https://mynd.dev/docs/dyn-forms).  
A general introduction is presented in this [article](https://dev.to/myndpm/a-new-approach-to-have-dynamic-forms-in-angular-5d11), the big picture is shown in this [Prezi](https://prezi.com/view/4Ok1bgCWvf0g26FMVwfx/)ntation, and you can play with live code in this [StackBlitz](https://stackblitz.com/edit/myndpm-dyn-forms?file=src/app/simple-form/simple.form.ts).

Technical [packages](https://raw.githubusercontent.com/myndpm/open-source/master/docs/myndpm-dyn-forms-packages.svg) and [sequence](https://raw.githubusercontent.com/myndpm/open-source/master/docs/myndpm-dyn-forms-sequence.svg) diagrams are also available.

## Installation

Add this library to your Angular project:

```bash
npm install @myndpm/dyn-forms
```

and import a `ui-package` to provide controls like the Dynamic-Forms-Material module:

```typescript
import { DynFormsMaterialModule } from '@myndpm/dyn-forms/ui-material';

@NgModule({
  imports: [
    DynFormsMaterialModule.forFeature(),
```

you also can provide your own DynControls (explained later):

```typescript
import { DynFormsModule } from '@myndpm/dyn-forms';

@NgModule({
  imports: [
    DynFormsModule.forFeature({
      controls: [
        {
          control: SelectComponent.dynControl, // 'MYSELECT'
          instance: SelectComponent.dynInstance,
          component: SelectComponent,
        },
        {
          control: InputComponent.dynControl, // 'MYINPUT'
          instance: InputComponent.dynInstance,
          component: InputComponent,
        },
      ],
    }),
```

where [SelectComponent](https://github.com/myndpm/open-source/blob/master/libs/forms/ui-material/src/components/select/select.component.ts)
and [InputComponent](https://github.com/myndpm/open-source/blob/master/libs/forms/ui-material/src/components/input/input.component.ts)
are already implemented in `DynFormsMaterialModule`.

Then with the provided controls you could use them in a Form Configuration like this:

```typescript
export class MyFormComponent {
  form = new FormGroup({});

  config: DynFormConfig = {
    controls: [
      {
        control: 'MYSELECT',
        name: 'option',
        params: {
          label: 'Pick an Option',
          options: [
            { value: 'Option 1', key: 1 },
            { value: 'Option 2', key: 2 },
          ],
        },
      },
      {
        control: 'MYINPUT',
        name: 'quantity',
        validators: [Validators.required],
        params: {
          label: 'Quantity',
          type: 'number',
        },
      },
    ];
  }
}
```

and pass them to the `dyn-form` component in its template:

```html
<dyn-form [form]="form" [config]="config"></dyn-form>
```

and that's it!  
now you can customize the styles and build some custom controls.

## Helpers

The `DynFormsMaterialModule` provides a typed _Factory Method_ to easily create
the config objects corresponding to its DynControls; for example:

```typescript
import { createMatConfig } from '@myndpm/dyn-forms/ui-material';

export class MyFormComponent {
  config: DynFormConfig = {
    controls: [
      createMatConfig('CARD', {
        name: 'group',
        params: { title: 'My Card' },
        controls: [
          createMatConfig('INPUT', {
            name: 'firstName',
            validators: [Validators.required],
            params: { label: 'First Name' },
          }),
          createMatConfig('INPUT', {
            name: 'lastName',
            validators: [Validators.required],
            params: { label: 'Last Name' },
          }),
        ],
      }),
    ]
  };
}
```

This factory will warn you if the provided config object doesn't correspond to the ControlType.

## DynControl

A Dynamic Control is an Angular component that has a `static dynControl` field which acts as an unique ID.
We can reference any component from the configuration object with this ID.

While creating a new form the library recursively instantiates these Dynamic Controls components, and populates their core fields:

1. Its corresponding `config`,
2. any `params` values specified in the config,
3. the corresponding `control` instance (`FormControl`, `FormGroup` or `FormArray`).

From there, we have the required tools for the component to provide any functionality.

## Extending

You can check out the example [source code of @myndpm/dyn-forms/ui-material](https://github.com/myndpm/open-source/tree/master/libs/forms/ui-material/src).
Basically your custom controls need to extend the respective Abstract Dynamic Control
(`DynFormControl`, `DynFormArray`, `DynFormGroup` or `DynFormContainer`) which register the corresponding Form Control into the hierarchy specified in the nested Config Object.

You just need to implement `static dynControl` property which is the unique place where you define your control identificator,
and the `completeParams` method, which is useful to ensure that any partially configured parameters will have the required fields and the template won't be broken.
Also, if you implement OnInit be sure to call the base class too, with `super.ngOnInit()`.

As mentioned in the [Installation](#installation) section, you can provide your controls with the useful
`DynFormsModule.forFeature({ providers, controls })` to avoid boilerplate.

## Share your Feedback

Please share your experience and ideas!  
Impressions, sugestions, improvements, use cases that you've implemented or your company needs, everything is welcome in the [GitHub Discussions](https://github.com/myndpm/open-source/discussions).  
As usual, please report any [Issue](https://github.com/myndpm/open-source/issues/new?labels=bug&template=bug-report.md)
or request a [Feature](https://github.com/myndpm/open-source/issues/new?labels=enhancement&template=feature-request.md).

Enjoy!

&#8722; Mynd.co Frontend Engineering
