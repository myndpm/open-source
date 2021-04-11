# TODO

## Form Controls

- Check FormDirectives responsibilities to apply in DynFormNode if the validators doesn't work
- Components provided via `forFeature` (via `DYN_CONTROLS_TOKEN`) ✓
- Provide config for appearance (theme, full-width, inline)
- Extensible handlers for different modes (panel, filter, table-cell, mobile?)
- How to add form options? (clear, label, defaultValue, fieldName, placeholder, tooltip, cssClass)
- How to add the filter options? (config, control, cleanseForUrl, apiFieldName)
- How to have reactive behavior? (readonly, immutable, visible, business-logic)
  - Custom behaviors for groups, like isVisible$
- Mode Strategy to Display/Filter/Table
  - Support display mode (config displayHandler, displayParams)
- Customizable error handler
- How to style the controls consistently? (calling mod non-encapsulated styles?)
  - Layout config for dyn-factory? (maybe a default grid? colspan?)

## Filters

Special usage of Dynamic Forms.

- Contracted components provided via `DYN_FILTERS_TOKEN` instead overload a unique token?
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

## Patterns

- Factory of controls for a given config
  - Flyweight enabling the creation of lazy-loaded components
- Strategy of common methods to be supported by the controls
  - (?) awareness of the available strategies
  - Essential methods only, with optional parameters

### OOP

- Inheritance of DynControls
- Composition of FormControls

## Check the approach of similar projects

Invite some authors to discuss:

- <https://github.com/ngx-formly/ngx-formly> the oldest dynamic-forms project
- <https://github.com/dynamic-forms/dynamic-forms> check its object structure
- <https://github.com/gms1/angular-dynaform> consider its form actions
- <https://github.com/udos86/ng-dynamic-forms>
- <https://github.com/formio/angular>
- <https://github.com/anand-kashyap/angular-auth> check its rx-form component
- <https://github.com/trufla-technology/ngx-tru-forms> based on JSON Schemas
- <https://github.com/ngspot/ngx-errors> interesting configuration for errors
- <https://github.com/teradata/covalent> completely dynamic layout
- <https://github.com/FalconSoft/ngx-dynamic-components> check its loading strategy
- <https://github.com/IndigoSoft/ngxd> claims to execute lifecycle hooks better than ComponentFactoryResolver
