# Development

## Considerations

The `postinstall` script builds the `util` package and setup its workspace from the `dist` folder. There are a couple of dependencies of utils that are in the root folder to be able to build it, and needs to be synced with the package.

To be able to run the website, build the demo package first with `yarn build`.

## Publishing to npm

There's a `release` workflow based on GitHub actions which needs to be executed manually everytime to publish the latest changes to NPM.
