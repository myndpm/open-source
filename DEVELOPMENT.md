# Development

## Considerations

The `postinstall` script builds the `util` and `plugin` packages to setup the workspace from the `dist` folder.
The compiled packages and their dependencies are available from /node_modules and consumed by the monorepo.

To be able to run the website, build the demo package first with `yarn build`.

## Publishing to npm

With GitHub Actions, there's a `release` workflow which needs to be manually triggered
to publish the latest changes in the packages to NPM.
