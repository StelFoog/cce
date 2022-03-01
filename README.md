# C - Compile and Execute

Compile and execute a C file, all at once.

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
