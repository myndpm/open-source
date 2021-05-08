# Development

## Considerations

This repo uses `yarn` workspaces to let the website to consume the built libraries from the `dist` folder. Once you build them with `yarn build:libs` you will be able to run the website with `yarn start`.

## Publishing to npm

We have scripts to be executed with `npm` instead `yarn` like `npm run npm:dyn-forms` which will build the library for production, will postbuild the schematics, publish to `npmjs` and `github` and create a git tag.
