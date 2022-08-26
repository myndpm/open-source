# TODO

## Documentation

- Matchers: Search abilities of DynNode depending on the form relative paths.

## Forms

- Output events like (formLoaded) (formReady) etc
- Try to detect conflicts with incoming patch values to dirty edit inside the controls
- Declarative validation config with something like <https://vestjs.dev/>
  - Support warning messages for probable mistakes filling data (like age, etc)
  - Configure when to display an error (touched, dirty, touchedAndDirty, formSubmitted)
  - Interpolation of variables inside the validation error messages
- Add support to DynFormConfig.updateOn

## Form Controls

- ui-material: mat-error for radio and checkbox with error state matcher or mat-form-field
- HIDDEN control requirement? dyn-factory not pollting the DOM
- Consider multiple nodes sharing path in different containers
- Check more real-life config changes with modes and matchers
- Check FormDirectives responsibilities to apply in DynControlNode if the validators doesn't work
- Provide config for appearance (theme, full-width, inline)
- How to support the filter-specific options? (config, control, cleanseForUrl, apiFieldName)
- How to have reactive behavior? (readonly, immutable, visible, business-logic)
- Mode Strategy to Display/Filter/Table
- How to style the controls consistently? (calling mod non-encapsulated styles?)
  - CSS config for dyn-factory as default grid?
- Nested DynForms (routed wizard) do not mark the root as loaded
- Pass custom `<ng-template path="group.control">` as projectable content to controls?

## Filters

Special usage of Dynamic Forms.

- Components provided via `DYN_FILTERS_TOKEN` instead overload a unique token?
- Receives and updates URL queryParams
- Can have primary/additional filters
- Have some special handling like query/value/display/request handlers

## Table

Tabulated data fetched with the filters output.

- Dynamically rendered columns (customizable styles, value handler, order field)
- Extensibility with Pagination and Sorting

## DataSource

Data/logic layer separated of the UI.  
Fill a DataSource with a Dynamically generated Form.

## Form Builders

- <https://formio.github.io/angular-demo/#/forms/builder>
- <https://formql.io/example/#/form/contactInfo/edit>

## Troubles

- Buttons without type can trigger `dyn-form` buttons

## Check the approach of similar projects

Invite some authors to discuss and check their issues/feature-requests:

- <https://github.com/ngx-formly/ngx-formly> the oldest dynamic-forms project
- <https://github.com/formio/angular> long standing library, has i18n and data-table grid
- <https://github.com/udos86/ng-dynamic-forms> interesting usage of template directives
- <https://github.com/teradata/covalent> completely dynamic CSS Flexbox layout
- <https://github.com/dynamic-forms/dynamic-forms> bloated typing but fully featured
- <https://github.com/formql/formql> designed an integration with the backend
- <https://github.com/gms1/angular-dynaform> consider its form actions
- <https://github.com/trufla-technology/ngx-tru-forms> based on JSON Schemas
- <https://github.com/FalconSoft/ngx-dynamic-components> XML based configuration
