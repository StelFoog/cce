# C - Compile and Execute

[![GitHub package.json version](https://img.shields.io/github/package-json/v/StelFoog/cce)](https://github.com/StelFoog/cce) [![Tests](https://img.shields.io/github/workflow/status/StelFoog/cce/Run%20tests?label=tests)](https://github.com/StelFoog/cce/actions/workflows/test.yml) [![License](https://img.shields.io/github/license/StelFoog/cce)](https://github.com/StelFoog/cce/blob/master/LICENSE.md)

Compile and execute a C file, all at once.

## Installation

**With Yarn** (recomended)

```sh
yarn global add cce-cl
```

**With NPM**

```sh
npm install -g cce-cl
```

## Usage

```sh
cce <file> [options]
```

Runs CCE for the given `file`, with the given `options`.

```sh
cce --help
```

Provides a complete list of options.

## Examples

```sh
cce test.c
```

Compiles and executes the file `test.c`.

```sh
cce test.c --save --execute-arguments "John 10"
```

Compiles and executes the file `test.c` with the arguments `John` and `10`, saving the compiled file after execution.
