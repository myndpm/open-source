# Layout Options (Work In Progress)

There's an open discussion about this topic [here](https://github.com/myndpm/open-source/discussions/5) to make a bigger design choice. Right now we are injecting CSS classes to the `DynControl` via `config.cssClass` and we are able to build grids with some CSS toolkits. There are default classes with the field name and visibility like `dyn-control-firstName` and `dyn-hidden`.

## Example

Simple form configurated with Bootstrap's Grid CSS classes:

```typescript
controls: [
  createMatConfig('CARD', {
    name: 'billing',
    cssClass: 'row',
    controls: [
      createMatConfig('INPUT', {
        name: 'firstName',
        cssClass: 'col-sm-6 col-md-4',
      }),
      createMatConfig('INPUT', {
        name: 'lastName',
        cssClass: 'col-sm-6 col-md-4',
      }),
      createMatConfig('INPUT', {
        name: 'address1',
        cssClass: 'col-12 col-md-8',
      }),
      createMatConfig('INPUT', {
        name: 'address2',
        cssClass: 'col-12 col-md-8',
      }),
      createMatConfig('SELECT', {
        name: 'country',
        cssClass: 'col-sm-6 col-md-4',
      }),
      createMatConfig('INPUT', {
        name: 'zipCode',
        cssClass: 'col-sm-6 col-md-4',
      }),
    ],
  }),
]
```

Full example available at <https://mynd.dev/demos/dyn-forms/simple-form>.

## Next

- How can we style the dynamic forms consistently? join [this discussion](https://github.com/myndpm/open-source/discussions/5).
- Continue with the [Schematics](/docs/dyn-forms/intro/schematics) docs.
