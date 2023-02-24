# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

# [12.8.0](https://github.com/myndpm/open-source/compare/@myndpm/dyn-forms@12.7.6...@myndpm/dyn-forms@12.8.0) (2023-02-24)


### Features

* **forms:** debug logging in DEFAULT condition and some matchers ([8b6e8e9](https://github.com/myndpm/open-source/commit/8b6e8e9d283732e13e57f921f8b9faa25c7cfe42))
* **forms:** force logging via DynNode.log ([048dd6e](https://github.com/myndpm/open-source/commit/048dd6ea1b0aee99187fe3d01d99fccd436b24a0))
* **forms:** optional compareFn for DEFAULT condition ([37b190d](https://github.com/myndpm/open-source/commit/37b190d4bc8276fcc5f5f04a9ea20c482ae935e6))



## [12.7.6](https://github.com/myndpm/open-source/compare/@myndpm/dyn-forms@12.7.5...@myndpm/dyn-forms@12.7.6) (2022-10-28)



## [12.7.5](https://github.com/myndpm/open-source/compare/@myndpm/dyn-forms@12.7.4...@myndpm/dyn-forms@12.7.5) (2022-10-12)


### Bug Fixes

* **forms:** add node.whenLoaded observable ([f9f183d](https://github.com/myndpm/open-source/commit/f9f183dcfdc79831b1850dd1bda090c130a14857))
* **forms:** add unsubscription to DynControlNode ([ce5d62a](https://github.com/myndpm/open-source/commit/ce5d62a53e65ba215345d50a0ecd559d9f67e432))
* **forms:** do not propagate hooks to isolated nodes ([703593c](https://github.com/myndpm/open-source/commit/703593cad62b6bcd3c05e9ed1f2325cc9ef2ebc4))
* **forms:** isolate nodes with custom controls ([91c7fcc](https://github.com/myndpm/open-source/commit/91c7fccdfe80129895608b3a22d2b6951ad980d8))
* **forms:** remove public members of DynControlNode ([610ca95](https://github.com/myndpm/open-source/commit/610ca95022169e5d4b6641cbdfd3c7d119e369fa))



## [12.7.3](https://github.com/myndpm/open-source/compare/@myndpm/dyn-forms@12.7.2...@myndpm/dyn-forms@12.7.3) (2022-10-06)


### Bug Fixes

* **forms:** exclude observables from HIDDEN controls ([782b8d0](https://github.com/myndpm/open-source/commit/782b8d08ff14e14200bed0b7d458eac05df4d54d))
* **forms:** log track and untrack actions ([cc4e755](https://github.com/myndpm/open-source/commit/cc4e75525e9a9bd0c3aee0c5716205747e075c0c))
* **forms:** matchers only applied to the top level component ([d3065ce](https://github.com/myndpm/open-source/commit/d3065ce1cbd412aa7a9a39c1a3a89d3dec8b6465))
* **forms:** support Observables as arguments ([908c734](https://github.com/myndpm/open-source/commit/908c734c287f55f364e262c39f88e5ab1d232188))
* **ui-material:** confirmDelete param for TABLE ([5d3e9df](https://github.com/myndpm/open-source/commit/5d3e9df0a3b355e358d7602bf719c8ab807f4f6e))



## [12.7.2](https://github.com/myndpm/open-source/compare/@myndpm/dyn-forms@12.7.1...@myndpm/dyn-forms@12.7.2) (2022-10-04)


### Bug Fixes

* **forms:** do not count HIDDEN controls ([eee45b0](https://github.com/myndpm/open-source/commit/eee45b0f2c7b1cdbc8c6bc21d89f7609ff8236da))
* **forms:** format logged path ([848454b](https://github.com/myndpm/open-source/commit/848454be182eb2e9fe6b6e0ff70c7dbad475f50c))



## [12.7.1](https://github.com/myndpm/open-source/compare/@myndpm/dyn-forms@12.7.0...@myndpm/dyn-forms@12.7.1) (2022-10-01)



# [12.7.0](https://github.com/myndpm/open-source/compare/@myndpm/dyn-forms@12.6.2...@myndpm/dyn-forms@12.7.0) (2022-09-30)


### Features

* **forms:** add CALL_HOOK and LISTEN_HOOK matchers ([4bb3190](https://github.com/myndpm/open-source/commit/4bb3190434b8dbc1af763ba9d7e06e9140615c4f))
* **ui-material:** hooks for TABLE control ([6371eb4](https://github.com/myndpm/open-source/commit/6371eb4c5ee25f2f8c890fa4c447a44ccd1f904d))



<a name="11.2.11-beta.0"></a>
# 11.2.11-beta.0 (2021-05-12)

### BREAKING CHANGES

* **lib:** Flatten config merging `factory` and `options` into the main object.
* **lib:** Refactor `modeParams` into a partial config object in `modes`.

<a name="11.2.10-beta.6"></a>
# 11.2.10-beta.6 (2021-05-12)

### Bug Fixes

* **core:** A new Injector per Dynamic Control lifecycle.

<a name="11.2.10-beta.2"></a>
# 11.2.10-beta.2 (2021-05-10)

### Features

* **core:** Error handlers and messages.

<a name="11.2.10-beta.0"></a>
# 11.2.10-beta.2 (2021-05-06)

### Features

* **lib:** Inline configuration for handlers.

<a name="11.2.6-beta.0"></a>
# 11.2.6-beta.0 (2021-04-02)

### Features

* **core:** Initial release.
