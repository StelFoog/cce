#!/usr/bin/env node
import * as chalk from 'chalk';
import { exec, execSync, spawn } from 'child_process';
import { Command } from 'commander';
import { existsSync, readFile, rmSync, stat, writeFile } from 'fs';
import path = require('path');
import startLoading from './loading';
import pjson = require('../package.json');

export type Options = {
	compiler?: string;
	compilerArguments?: string;
	executeArguments?: string;
	outfile?: string;
	save?: true;
	asIs?: true;
	onlyExecPrints?: true;
};

const mainMatch = /main[\n\t ]*?\([^]*?\)[\n\t ]*?\{/;
const modifiedFile = '__cce_mod__.c';

// Set up command line argumets and options
const program = new Command();
program.name('cce').description(pjson.description).version(pjson.version, '-v, --version');
program
	.argument('<file>', 'file to compile and run')
	.option('-c, --compiler <compiler>', 'compiler to use, defaults to GCC')
	.option('-ca, --compiler-arguments <arguments>', 'arguments passed to the compiler')
	.option('-ea, --execute-arguments <arguments>', 'arguments passed to the executable result')
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
const executeArguments = opts?.executeArguments || '';
const outfile = opts?.outfile || `${file}__cce__.o`;
const save = opts?.save || false;
const asIs = opts?.asIs || false;
const onlyExecPrints = opts?.onlyExecPrints || false;

// Generate the path to the file
const filePath = path.join(process.cwd(), file);

// Validate options
validateOptions();

function validateOptions() {
	const validatingLoader = !onlyExecPrints && startLoading('Validating');

	let warnings: string[] = [];
	if (compilerArguments.match(/(-o|--output)/))
		warnings.push(
			'--compiler-arguments contains an --output option, this could prevent CCE from executing the compiled file. Please use the CCE --outfile (-o) option instead'
		);

	if (!existsSync(filePath)) {
		if (!onlyExecPrints) validatingLoader.error();
		console.error(`error: file ${filePath} doesn't exist`);
		process.exit(1);
	}

	stat(filePath, (error, stats) => {
		if (error) {
			if (!onlyExecPrints) validatingLoader.error();
			console.error(`error: there was an issue retrieving information about the file ${filePath}`);
			process.exit(1);
		}

		if (!stats.isFile()) {
			if (!onlyExecPrints) validatingLoader.error();
			console.error(`error: ${filePath} is not a file`);
			process.exit(1);
		}

		// Exists and is a file
		exec(`command -v ${compiler}`, async (error) => {
			if (error) {
				if (!onlyExecPrints) validatingLoader.error();
				console.error(`error: compiler ${compiler} doesn't exist`);
				process.exit(1);
			}

			if (!onlyExecPrints) {
				validatingLoader.done();
				warnings.forEach((w) => console.log(`${chalk.hex('#a2e')('Warning:')} ${w}`));
			}

			// Compile the code
			compile();
		});
	});
}

function compile() {
	const compileLoader = !onlyExecPrints && startLoading('Compiling');

	if (asIs) {
		exec(
			`${compiler} ${file}${compilerArguments && ` ${compilerArguments}`} -o ${outfile}`,
			(error, stdout, stderr) => {
				if (error) {
					if (!onlyExecPrints) compileLoader.error();
					console.error(stderr);
					process.exit(1);
				}

				if (!existsSync(path.join(process.cwd(), outfile))) {
					if (!onlyExecPrints) compileLoader.error();
					console.error(
						`error: Compiled file not found where expected, likely caused by compiler ${compiler} not handeling -o in an expected way.` +
							'\nA possible workaround is to provide the --compiler-arguments and --outfile option with the same filename'
					);
					process.exit(1);
				}

				if (!onlyExecPrints) {
					compileLoader.done();
					console.log(stdout);
				}

				// Execute the compiled code
				execute();
			}
		);
	} else {
		generateModFile(() => {
			exec(
				`${compiler} ${modifiedFile}${compilerArguments && ` ${compilerArguments}`} -o ${outfile}`,
				(error, stdout, stderr) => {
					if (error) {
						if (!onlyExecPrints) compileLoader.error();
						console.log();
						console.error(hideMod(stderr));
						rmSync(`${process.cwd()}/${modifiedFile}`);
						process.exit(1);
					}
					rmSync(`${process.cwd()}/${modifiedFile}`);

					if (!existsSync(path.join(process.cwd(), outfile))) {
						if (!onlyExecPrints) compileLoader.error();
						console.error(
							`error: Compiled file not found where expected, likely caused by compiler ${compiler} not handeling -o in an expected way.` +
								'\nA possible workaround is to provide the --compiler-arguments and --outfile option with the same filename'
						);
						process.exit(1);
					}

					if (!onlyExecPrints) {
						compileLoader.done();
						console.log();
						if (stderr || stdout) console.log(chalk.bold('Compiler says:'));
						if (stderr) console.log(hideMod(stderr));
						if (stdout) console.log(hideMod(stdout));
					}

					// Execute the compiled code
					execute();
				}
			);
		});
	}
}

function generateModFile(callback: () => any): void {
	readFile(file, (error, data) => {
		if (error) {
			console.error(error);
			process.exit(1);
		}
		const original = data.toString();
		const match = mainMatch.exec(original);
		writeFile(
			`${process.cwd()}/${modifiedFile}`,
			'#include <stdio.h>\n' +
				original.slice(0, match.index + match[0].length) +
				'\nsetvbuf(stdout, (void*)0, _IONBF, 0);' +
				original.slice(match.index + match[0].length),
			(error) => {
				if (error) {
					console.error(error);
					process.exit(1);
				}

				callback();
			}
		);
	});
}

function hideMod(text: string): string {
	return (
		text.replace(new RegExp(modifiedFile, 'g'), file) +
		`\n${chalk
			.hex('#e83')
			.bold(
				'Note:'
			)} Row numbers can be of by one. Run with flag -ai to get exact values from compilation errors and warnings`
	);
}

function execute() {
	execSync(`chmod +x ${outfile}`); // in case file isn't automatically made executable
	const child = spawn(
		`./${outfile}`,
		executeArguments
			? executeArguments.split(' ') /* TODO: Shouldn't split parts in qoutation marks */
			: undefined
	);

	child.stdout.setEncoding('utf8');
	child.stdout.pipe(process.stdout);
	process.stdin.on('data', (data) => {
		child.stdin.write(data);
	});

	child.on('error', (err) => {
		console.log('Process Error');
		console.log(err);
		if (!save) rmSync(outfile);
		process.exit(1);
	});

	child.on('exit', (code) => {
		console.log(`Process exited with code ${code}`);
		if (!save) rmSync(outfile);
		process.exit(0);
	});
}

process.on('SIGINT', () => {
	console.log('\nPerforming cleanup...');
	if (existsSync(`${process.cwd()}/${modifiedFile}`)) rmSync(`${process.cwd()}/${modifiedFile}`);
	if (existsSync(`${process.cwd()}/${outfile}`)) rmSync(`${process.cwd()}/${outfile}`);
	console.log('Cleanup complete');
	process.exit(0);
});
