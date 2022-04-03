## [0.1.0](https://github.com/ChpShy/json2ts/compare/v0.0.5...v0.1.0) (2022-03-31)

### Bug Fixes
- array comment parse bug
### Features
- add config `comment` to output comment
### BREAKING CHANGES
- `contant.ts`: change `COMMENT_KEY` to  `COMMENT_TYPE`
- `options`: fix `spiltType` to  `splitType`


## [0.0.5](https://github.com/ChpShy/json2ts/compare/v0.0.4...v0.0.5) (2022-03-31)
### Bug Fixes
- array parse infinite loop bug when loose a `]`
### Code Refactoring
- extract transform api `normalEntryHandle`
### Features
- add config `indent` to format output