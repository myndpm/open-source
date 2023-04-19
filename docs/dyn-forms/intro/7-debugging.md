# Debugging (Draft)

There's a built-in logger at `@myndpm/dyn-forms/logger` which offers different log levels to output in the console.

The levels are in the `DynLogLevel` enum as follows:

* Testing = 2**10
* All = 2**9 - 1
* Runtime = 2**8
* Ready = 2**7
* Load = 2**6
* Lifecycle = 2**5
* Hierarchy = 2**4
* Debug = 2**3
* Warning = 2**2
* Error = 2**1
* Fatal = 2**0
* None = 0

They can be used with bitwise operators like:

* `DynLogLevel.All | DynLogLevel.Testing` (all output plus timestamps)
* `DynLogLevel.Load & DynLogLevel.Runtime` (only load and runtime outputs)

### Usage

To enable this console output we provide `DYN_LOG_LEVEL` into a module we want to check:

```typescript
import { DYN_LOG_LEVEL, DynLogLevel } from '@myndpm/dyn-forms/logger';

  providers: [
    {
      provide: DYN_LOG_LEVEL,
      useValue: DynLogLevel.All | DynLogLevel.Testing,
    }
  ]
```

or also we can debug a specific section of our form by defining the level in the configuration:

```typescript
const config: DynFormConfig = {
  debug: DynLogLevel.Runtime,
  controls: [
    createMatConfig('INPUT', {
      debug: DynLogLevel.None,
```

Note that the nested INPUT disables its output, so we can debug granular controls.

## Debugging Matchers

We can debug what's going on inside the matchers by passing the flag into the config:

```typescript
match: [
  {
    matchers: [...],
    debug: true,
```

This is only available for the matchers implementing the `debug` argument
and showing some console output depending on it like the default ones:

```typescript
// SHOW DynMatcherFn
return ({ node, hasMatch, debug }) => {
  if (debug) { node.log(`SHOW matcher`, hasMatch); }
  hasMatch ? node.visible() : node.hidden();
}
```

## Next

- Continue with the [Layout Options](/docs/dyn-forms/intro/layout) docs.
