# Schematics

We have schematics since the [v11.2.9-beta.9](https://github.com/myndpm/open-source/releases/tag/%40myndpm%2Fdyn-forms%4011.2.9-beta.9) release.

In VSCode we can use the NxConsole plugin to run the schematics with a friendly UI.

## DynModules

We can easily create new modules to store our DynControls with:

```bash
ng generate @myndpm/dyn-forms:module
  --project=forms
  --path=libs/forms/ui-taiga/src
  --prefix=dyn-tui
  --prefixClass
  --name=DynFormsTaiga
  --controlName=input
  --id=INPUT
```

## DynControls

And we can create the DynControl boilerplate with:

```bash
ng generate @myndpm/dyn-forms:control
  --project=forms
  --path=libs/forms/ui-material/src/components
  --prefix=dyn-mat
  --prefixInterface=I
  --name=slider
  --id=SLIDER
```

We saved a lot of time with these ones :)

## Next

- Learn about the [ui-packages](/docs/dyn-forms/ui).
- Check the [live examples](/docs/dyn-forms/examples).
