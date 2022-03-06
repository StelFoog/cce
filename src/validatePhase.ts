import * as chalk from 'chalk';
import { exec } from 'child_process';
import { existsSync, stat } from 'fs';
import * as path from 'path';
import { cceParams } from '.';
import startLoading from './loading';

export default function validatePhase(params: cceParams, callback: () => any): void {
	const { file, onlyExecPrints, executeArguments, compilerArguments, compiler } = params;
	const filePath = path.join(process.cwd(), file);

	const validatingLoader = !onlyExecPrints && startLoading('Validating');

	// Find errors
	if (executeArguments.error) {
		validatingLoader.error();
		console.error('error: missing dequote from execute arguments');
		process.exit(1);
	}

	// Find warnings
	let warnings: string[] = [];
	if (compilerArguments.match(/(-o|--output)/))
		warnings.push(
			'--compiler-arguments contains an --output option, this could prevent CCE from executing the compiled file, please use the CCE --outfile (-o) option instead'
		);

	executeArguments.specials.forEach((s) => {
		switch (s[0]) {
			case '<': {
				warnings.push(
					'--execute-arguments contains redirect <, this will not have any effect, please use CCE --stdin option instead'
				);
				break;
			}
			case '>': {
				warnings.push(
					'--execute-arguments contains redirect >, this will not have any effect, please use CCE --stdout option instead'
				);
				break;
			}
		}
	});

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

			// Next phase
			callback();
		});
	});
}
