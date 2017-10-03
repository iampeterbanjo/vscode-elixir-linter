# Elixirlinter

Provides linting for Elixir files using [Credo](https://github.com/rrrene/credo) for [Visual Studio Code](https://code.visualstudio.com/)

[ ![Codeship Status for iampeterbanjo/vscode-elixir-linter](https://app.codeship.com/projects/cb7e5c40-05b9-0135-edfd-52b395dcacd9/status?branch=master)](https://app.codeship.com/projects/213602)
[![Visual Studio Marketplace](https://img.shields.io/vscode-marketplace/d/iampeterbanjo.elixirlinter.svg)](https://marketplace.visualstudio.com/items?itemName=iampeterbanjo.elixirlinter)

## Features

* Error warning indicator under text
* Tooltips with lint message
* Configurable lint severity levels

![feature tooltips](images/elixirlinter-lint-tooltip.png)

## Requirements

[Credo](https://github.com/rrrene/credo)

## Extension Settings

- `"elixirLinter.useStrict": [true | false]`
- `"elixirLinter.defaultSeverity": [number]`
- `"elixirLinter.consistencySeverity": [number]`
- `"elixirLinter.designSeverity": [number]`
- `"elixirLinter.refactoringSeverity": [number]`
- `"elixirLinter.readabilitySeverity": [number]`
- `"elixirLinter.warningsSeverity": [number]`

### Linting
![show errors and warnings](images/elixirlinter-show-errors-warnings-list.png)
Lint messages appear in the format "Message [Category:Severity level]"

### Severity levels (settings.json)
* 1 = Warning (default). These appear underlined and in errors and warnings list.
* 2 = Information. These appear underlined and in errors and warnings list.
* 3 = Hint. These appear in errors and warnings list only.

### Categories
* Consistency [C]
* Readability [R]
* Refactoring Opportunities [F]
* Software Design [D]
* Warnings [W]

## [Changelog](CHANGELOG.md)

## [Contributing](CONTRIBUTING.md)

## Development

* Getting started: `npm install` then `npm run test:watch`

## Credits

* [vscode-credo](https://github.com/joshjg/vscode-credo)
* [yeoman](http://yeoman.io/)
* [vscode-extension-tutorial](https://github.com/hoovercj/vscode-extension-tutorial)

## [Authors](AUTHORS.md)
