# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.1.1](https://github.com/EndyKaufman/nestjs-translates/compare/v2.1.0...v2.1.1) (2025-02-21)

### Bug Fixes

- append wrap to asynclocalstorage method next.handle() ([66c19ad](https://github.com/EndyKaufman/nestjs-translates/commit/66c19ada708066a3b6b12ba7ca2e66a46a48c326))

## [2.1.0](https://github.com/EndyKaufman/nestjs-translates/compare/v2.0.2...v2.1.0) (2025-02-21)

### Features

- removed dirty mutation of input data for locale transfer, fixed work with locale transfer via AsyncLocalStorage ([b2820d7](https://github.com/EndyKaufman/nestjs-translates/commit/b2820d7b9822a0a41b2b89b7f5ee27bcedd2c32f))

### [2.0.2](https://github.com/EndyKaufman/nestjs-translates/compare/v2.0.1...v2.0.2) (2025-02-12)

### Bug Fixes

- extend DefaultTranslatesModuleOptions with TranslatesConfig ([bdd9a4c](https://github.com/EndyKaufman/nestjs-translates/commit/bdd9a4cf23f5996b9ed67d684d10fb24dc38eb34))

### [2.0.1](https://github.com/EndyKaufman/nestjs-translates/compare/v2.0.0...v2.0.1) (2024-12-20)

### Bug Fixes

- update getOriginalBodyFromBody ([8dee817](https://github.com/EndyKaufman/nestjs-translates/commit/8dee8177ad69b7c92e81307e7d8733a68b5b41d0))
- update shared index file ([81d5398](https://github.com/EndyKaufman/nestjs-translates/commit/81d5398be6e1a575c2377e38482417f5304abc1c))

## [2.0.0](https://github.com/EndyKaufman/nestjs-translates/compare/v1.3.3...v2.0.0) (2024-12-20)

### ⚠ BREAKING CHANGES

- now for detect user lang in pipe we mutate body of request, for custom logic to update body you can set options for it: addContextToBody, getContextFromBody, getOriginalBodyFromBody

### Features

- remove Scope.REQUEST from TranslatesPipe ([f1481de](https://github.com/EndyKaufman/nestjs-translates/commit/f1481de1f75a6b743355f33ab44243005c06257a))

### [1.3.3](https://github.com/EndyKaufman/nestjs-translates/compare/v1.3.2...v1.3.3) (2024-12-15)

### Bug Fixes

- append use context in TranslateFunction-decorator ([ffa7209](https://github.com/EndyKaufman/nestjs-translates/commit/ffa72094fa2a3baffab0ee6f35702dfaa6d1c531))

### [1.3.2](https://github.com/EndyKaufman/nestjs-translates/compare/v1.3.1...v1.3.2) (2024-12-09)

### Bug Fixes

- add support work with WS in contextRequestDetector ([4953c95](https://github.com/EndyKaufman/nestjs-translates/commit/4953c95f1f9f0e3a30e835e4cedb7041594d95a9))

### [1.3.1](https://github.com/EndyKaufman/nestjs-translates/compare/v1.3.0...v1.3.1) (2024-12-03)

### Bug Fixes

- change async convertObject to sync mode ([38a1230](https://github.com/EndyKaufman/nestjs-translates/commit/38a123006341ab47ee1e76f6f05ef4223fe518f1))

## [1.3.0](https://github.com/EndyKaufman/nestjs-translates/compare/v1.2.0...v1.3.0) (2024-12-01)

### Features

- add TranslatesInterceptor, add contextRequestDetector to options, add InjectTranslateFunction decorator ([9cf1c66](https://github.com/EndyKaufman/nestjs-translates/commit/9cf1c66d56e21dd1eb42cc130ae8764c189c3431))

## [1.2.0](https://github.com/EndyKaufman/nestjs-translates/compare/v1.1.0...v1.2.0) (2024-10-23)

### Features

- share translatesConfig value from TranslatesService ([ca830c6](https://github.com/EndyKaufman/nestjs-translates/commit/ca830c6f24257106ec4735808250050bbc945e3d))

## [1.1.0](https://github.com/EndyKaufman/nestjs-translates/compare/v1.0.5...v1.1.0) (2022-08-10)

### Features

- added static method forFeature for isolated use of translations, added static method forRootDefault with default methods ([ebf0480](https://github.com/EndyKaufman/nestjs-translates/commit/ebf0480b4422198d484f242a15bd66b5a1826ea7))

### [1.0.5](https://github.com/EndyKaufman/nestjs-translates/compare/v1.0.4...v1.0.5) (2022-06-26)

### Bug Fixes

- update peerDependencies ([91968f7](https://github.com/EndyKaufman/nestjs-translates/commit/91968f76df739d8df03768d43a381b71bfa47c70))

### [1.0.4](https://github.com/EndyKaufman/nestjs-translates/compare/v1.0.3...v1.0.4) (2022-06-26)

### Bug Fixes

- bump versions of nest deps, lock deps ([0c05f72](https://github.com/EndyKaufman/nestjs-translates/commit/0c05f72ebf75d579c9b7ca82414bcc4f081b5f55))

### [1.0.3](https://github.com/EndyKaufman/nestjs-translates/compare/v1.0.2...v1.0.3) (2022-03-02)

### Bug Fixes

- move load translates to onModuleInit ([0ad7ae0](https://github.com/EndyKaufman/nestjs-translates/commit/0ad7ae0ae06110dfa585176ed7e795a2602fa0a9))

### [1.0.2](https://github.com/EndyKaufman/nestjs-translates/compare/v1.0.1...v1.0.2) (2022-03-01)

### [1.0.1](https://github.com/EndyKaufman/nestjs-translates/compare/v1.0.0...v1.0.1) (2022-03-01)

## 1.0.0 (2022-03-01)

### Features

- create library with all needed basic logic ([b4db807](https://github.com/EndyKaufman/nestjs-translates/commit/b4db807e82250ab21b4c6c5136acedfb934d68c5))
