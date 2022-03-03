import { exec, execSync } from 'child_process';
import { existsSync, readFileSync, rmSync } from 'fs';
import path from 'path';
import { Readable } from 'stream';

const timeout = 20 * 1000;

describe('Comiles and executes files', () => {
	let reinstall = false;
	let linked = false;
	beforeAll(() => {
		const yarnGlobal = execSync('yarn global list').toString();
		if (yarnGlobal.includes('cce-cl')) {
			reinstall = true;
			execSync('yarn global remove cce-cl');
		}

		if (!execSync('command -v cce || echo').toString().includes('/cce')) {
			linked = true;
			execSync('yarn link');
		}
	});
	afterAll(() => {
		if (linked) execSync('yarn unlink');
		if (reinstall) execSync('yarn global add cce-cl');
	});

	test(
		'test/cfiles/base.c',
		(done) => {
			exec('cce test/cfiles/base.c -oep', (error, stdout, stderr) => {
				expect(error).toEqual(null);
				expect(stdout).toEqual('Works\nProcess exited with code 0\n');
				expect(stderr).toEqual('');
				done();
			});
		},
		timeout
	);

	test(
		'test/cfiles/error.c',
		(done) => {
			exec('cce test/cfiles/error.c -oep', (error, stdout, stderr) => {
				expect(error).toEqual(null);
				expect(stdout).toEqual('Error\nProcess exited with code 1\n');
				expect(stderr).toEqual('');
				done();
			});
		},
		timeout
	);

	test(
		'test/cfiles/args.c with arguments',
		(done) => {
			exec('cce test/cfiles/args.c -oep -ea "Foo bar"', (error, stdout, stderr) => {
				expect(error).toEqual(null);
				expect(stdout).toEqual(
					'Argument 1: Foo\nArgument 2: bar\n2 total arguments\nProcess exited with code 0\n'
				);
				expect(stderr).toEqual('');
				done();
			});
		},
		timeout
	);

	test(
		'test/cfiles/args.c without arguments',
		(done) => {
			exec('cce test/cfiles/args.c -oep', (error, stdout, stderr) => {
				expect(error).toEqual(null);
				expect(stdout).toEqual('0 total arguments\nProcess exited with code 0\n');
				expect(stderr).toEqual('');
				done();
			});
		},
		timeout
	);

	test(
		'test/cfiles/input.c',
		(done) => {
			const [v1, v2, v3] = [0, 0, 0].map(() => Math.floor(Math.random() % 100));
			const child = exec('cce test/cfiles/input.c -oep', (error, stdout, stderr) => {
				expect(error).toEqual(null);
				expect(stdout).toEqual(
					`recived: ${v1}\nrecived: ${v2}\nrecived: ${v3}\n\nsum: ${
						v1 + v2 + v3
					}\nProcess exited with code 0\n`
				);
				expect(stderr).toEqual('');
				done();
			});
			const stdinStream = new Readable();
			stdinStream.push(`${v1}\n${v2}\n${v3}\n`);
			stdinStream.push(null);
			stdinStream.pipe(child.stdin);
		},
		timeout
	);
});

describe('test flags', () => {
	let reinstall = false;
	let linked = false;
	beforeAll(() => {
		const yarnGlobal = execSync('yarn global list').toString();
		if (yarnGlobal.includes('cce-cl')) {
			reinstall = true;
			execSync('yarn global remove cce-cl');
		}

		if (!execSync('command -v cce || echo').toString().includes('/cce')) {
			linked = true;
			execSync('yarn link');
		}
	});
	afterAll(() => {
		if (linked) execSync('yarn unlink');
		if (reinstall) execSync('yarn global add cce-cl');
	});

	test(
		'--version flag',
		() => {
			const packageVersion = JSON.parse(
				readFileSync(path.join(process.cwd(), 'package.json')).toString()
			).version;
			const cceVersion = execSync('cce --version').toString();

			expect(cceVersion).toEqual(packageVersion + '\n');
		},
		timeout
	);

	test(
		'--save flag',
		() => {
			execSync('cce test/cfiles/base.c --save');

			const outfilePath = path.join(process.cwd(), 'test/cfiles/base.c__cce__.o');

			const exists = existsSync(outfilePath);

			expect(exists).toEqual(true);

			if (exists) rmSync(outfilePath);
		},
		timeout
	);

	test(
		'--outfile flag',
		() => {
			execSync('cce test/cfiles/base.c --save --outfile "test/cfiles/test.o"');

			const outfilePath = path.join(process.cwd(), 'test/cfiles/test.o');

			const exists = existsSync(outfilePath);

			expect(exists).toEqual(true);

			if (exists) rmSync(outfilePath);
		},
		timeout
	);
});
