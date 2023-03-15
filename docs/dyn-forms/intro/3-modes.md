# Modes (Draft)

The vision of the library is to reuse the Form not only for edit the data but also to display it.
The `<dyn-form>`  component has a `[mode]` input which receives any arbitrary value from us.
By default the `ui` subpackages and demos uses two modes: `edit` and `display`,
and the `ui-material TABLE` control uses another internal one called `row` for state management purposes.

It's common to see a Profile page where we can update our user information, and usually the same data is shown in the same layout. So the `modes` feature aims to extend and override the default configuration. We can use a different control in a different mode, and extend or override the parameters that it will receive, as the library will merge the default configuration with the mode configuration.

## Usage

The configuration is defined for a default mode, usually the one passed to `dyn-form`.
Once we switch the `[mode]` value, we override the configuration for the controls to behave different.

Let's consider a form to `edit` by default, and after it's submitted we change the mode to `display`.
We could have this kind of control configuration:

```typescript
createMatConfig('INPUT', {
  name: 'address',
  params: {
    label: 'What is your address'
  },
  modes: {
    display: {
      params: {
        label: 'Your address is',
        readonly: true,
      }
    }
  }
}),
```

Can you deduce what's going to happen when the `display` mode values override the main ones?

If we use `[mode]="'edit'"` with this config, the library will compute the default configuration as:

```typescript
{

  control: 'INPUT',
  name: 'address',
  params: {
    label: 'What is your address'
  }
}
```

Once we pass `[mode]="'display'"` the library will recompute the config to:

```typescript
{

  control: 'INPUT',
  name: 'address',
  params: {
    label: 'Your address is',
    readonly: true,
  }
}
```

In this case, we assume an `INPUT` control like the `@myndpm/dyn-forms/ui-material` one which supports a `readonly` parameter which changes its behavior. But we could change the control to another one if we want to.

The concept behind modes, is that our controls shares some convention and common parameters to reuse.

## Form Modes

We can define some global mode overrides at the `DynFormConfig` level, which is sometimes useful to setup a flag like `readonly` for the `display` mode.

## Next

- See it works in the [simple dynamic form](https://mynd.dev/demos/dyn-forms/simple-form) demo.
- Share suggestions to understand the modes better in [this GitHub thread](https://github.com/myndpm/open-source/discussions/46).
- Continue with the [Validators](/docs/dyn-forms/intro/validators) docs.