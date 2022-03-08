#!/usr/bin/env node
import { Command } from 'commander';
import { existsSync, rmSync } from 'fs';
import path = require('path');
import pjson = require('../package.json');
import parseArgs, { ParsedObject } from './parseArgs';
import validatePhase from './validatePhase';
import compilePhase from './compilePhase';
import executePhase from './executePhase';

export type Options = {
	compiler?: string;
	compilerArguments?: string;
	executeArguments?: string;
	stdin?: string;
	stdout?: string;
	outfile?: string;
	save?: true;
	asIs?: true;
	onlyExecPrints?: true;
};

export type cceParams = {
	file: string;
	compiler: string;
	compilerArguments: string;
	executeArguments: ParsedObject;
	stdin: string;
	stdout: string;
	outfile: string;
	save: boolean;
	asIs: boolean;
	onlyExecPrints: boolean;
};

const modifiedFileName = '__cce_mod__.c';

// Set up command line argumets and options
const program = new Command();
program.name('cce').description(pjson.description).version(pjson.version, '-v, --version');
program
	.argument('<file>', 'file to compile and run')
	.option('-c, --compiler <compiler>', 'compiler to use, defaults to GCC')
	.option('-ca, --compiler-arguments <arguments>', 'arguments passed to the compiler')
	.option('-ea, --execute-arguments <arguments>', 'arguments passed to the executable result')
	.option('--stdin <file>', 'sets stdin for executable')
	.option('--stdout <file>', 'sets stdout for executable')
	.option('-o, --outfile <name>', 'name of compiled file, defaults to <file>__cce__.o')
	.option('-s, --save', 'saves the file after execution, otherwise it will be deleted')
	.option(
		'-ai, --as-is',
		'compiles the original file without modification, could result in unexpected behavior during execution phase'
	)
	.option(
		'-oep, --only-exec-prints',
		"doesn't print or time verification and compile phases, mainly used for testing"
	);
program.parse();
const [file] = program.args;
const opts = program.opts<Options>();

// Get options
// TODO: Should be extended to use g++ for cpp files
const compiler = opts?.compiler || 'gcc';
const compilerArguments = opts?.compilerArguments || '';
const executeArguments = parseArgs(opts?.executeArguments || '');
const stdin = opts?.stdin || '';
const stdout = opts?.stdout || '';
const outfile = opts?.outfile || `${file}__cce__.o`;
const save = opts?.save || false;
const asIs = opts?.asIs || false;
const onlyExecPrints = opts?.onlyExecPrints || false;

// Create params object
const cceParams: cceParams = {
	file,
	compiler,
	compilerArguments,
	executeArguments,
	stdin,
	stdout,
	outfile,
	save,
	asIs,
	onlyExecPrints,
};

// Run CCE phases
validatePhase(cceParams, (includedFiles) => {
	compilePhase(cceParams, includedFiles, () => {
		executePhase(cceParams);
	});
});

process.on('SIGINT', () => {
	console.log('\nPerforming cleanup...');
	if (existsSync(path.join(process.cwd(), file, '..', modifiedFileName)))
		rmSync(path.join(process.cwd(), file, '..', modifiedFileName));
	if (existsSync(path.join(process.cwd(), outfile))) rmSync(path.join(process.cwd(), outfile));
	console.log('Cleanup complete');
	process.exit(0);
});
