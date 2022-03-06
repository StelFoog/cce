import { execSync, spawn } from 'child_process';
import { readFile, rmSync, writeFile } from 'fs';
import * as path from 'path';
import { cceParams } from '.';

export default function executePhase(params: cceParams): void {
	const { outfile, executeArguments, stdout, stdin, save } = params;

	execSync(`chmod +x ${outfile}`); // in case file isn't automatically made executable
	const child = spawn(`./${outfile}`, executeArguments.parsed);

	// stdout
	let stdoutResult: string = '';
	child.stdout.setEncoding('utf8');
	if (stdout) {
		child.stdout.on('data', (data) => {
			stdoutResult += data.toString();
		});
	} else {
		child.stdout.pipe(process.stdout);
	}

	// stdin
	if (stdin) {
		const stdinFilePath = path.join(process.cwd(), stdin);
		readFile(stdinFilePath, (error, data) => {
			if (error) {
				console.error(`error: couldn't pass ${stdinFilePath} to stdin, file couldn't be read`);
				process.exit(1);
			}
			child.stdin.write(data + '\0');
		});
	} else {
		process.stdin.on('data', (data) => {
			child.stdin.write(data);
		});
	}

	child.on('error', (err) => {
		console.log('Process Error');
		console.log(err);
		if (!save) rmSync(outfile);
		process.exit(1);
	});

	child.on('exit', (code) => {
		const exitMessage = `Process exited with code ${code}`;

		if (stdout) {
			writeFile(path.join(process.cwd(), stdout), stdoutResult + exitMessage, () => {
				if (!save) rmSync(outfile);
				process.exit(0);
			});
		} else {
			console.log(exitMessage);
			if (!save) rmSync(outfile);
			process.exit(0);
		}
	});
}
