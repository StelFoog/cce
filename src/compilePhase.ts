import * as chalk from 'chalk';
import { exec } from 'child_process';
import { existsSync, readFile, rmSync, writeFile } from 'fs';
import * as path from 'path';
import { cceParams } from '.';
import startLoading from './loading';

export const mainMatch = /main[\n\t ]*?\([^]*?\)[\n\t ]*?\{/;
const modifiedFileName = '__cce_mod__.c';
let modFile = '';

export default function compilePhase(
	params: cceParams,
	files: string[],
	callback: () => any
): void {
	const { file, onlyExecPrints, asIs, compiler, compilerArguments, outfile } = params;

	const compileLoader = !onlyExecPrints && startLoading('Compiling');

	if (asIs) {
		exec(
			`${compiler} ${file} ${files.join(' ')} ${compilerArguments} -o ${outfile}`,
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

				// Next phase
				callback();
			}
		);
	} else {
		generateModFile(file, () => {
			// console.log(`${compiler} ${modFile} ${files.join(' ')} ${compilerArguments} -o ${outfile}`);
			exec(
				`${compiler} ${modFile} ${files.join(' ')} ${compilerArguments} -o ${outfile}`,
				(error, stdout, stderr) => {
					if (error) {
						if (!onlyExecPrints) compileLoader.error();
						console.log();
						console.error(hideMod(file, stderr));
						rmSync(modFile);
						process.exit(1);
					}
					rmSync(modFile);

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
						if (stderr) console.log(hideMod(file, stderr));
						if (stdout) console.log(hideMod(file, stdout));
					}

					// Next phase
					callback();
				}
			);
		});
	}
}

function generateModFile(file: string, callback: () => any): void {
	readFile(file, (error, data) => {
		if (error) {
			console.error(error);
			process.exit(1);
		}
		const original = data.toString();
		const match = mainMatch.exec(original);
		modFile = path.join(process.cwd(), file, '..', modifiedFileName);
		writeFile(
			modFile,
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

function hideMod(file: string, text: string): string {
	return (
		text.replace(new RegExp(modFile, 'g'), file) +
		`\n${chalk
			.hex('#e83')
			.bold(
				'Note:'
			)} Row numbers can be of by one. Run with flag -ai to get exact values from compilation errors and warnings`
	);
}
