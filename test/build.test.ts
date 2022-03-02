import { existsSync, readFileSync, statSync } from 'fs';
import path from 'path';
import readdirRecursive from './readdirRecursive';

const binPath = path.join(process.cwd(), 'bin');
const srcPath = path.join(process.cwd(), 'src');

describe('build is valid', () => {
	test('bin directory exists', () => {
		expect(existsSync(binPath)).toEqual(true);
		expect(statSync(binPath).isDirectory()).toEqual(true);
	});

	test('package.json is built', () => {
		expect(JSON.parse(readFileSync(path.join(binPath, 'package.json')).toString())).toEqual(
			JSON.parse(readFileSync(path.join(process.cwd(), 'package.json')).toString())
		);
	});

	test('all files are built', () => {
		const srcFiles = readdirRecursive(path.join(process.cwd(), 'src'));

		const binPaths = srcFiles.map((v) => path.join(binPath, 'src', v.replace(/\.ts$/, '.js')));
		const binMapPaths = srcFiles.map((v) =>
			path.join(binPath, 'src', v.replace(/\.ts$/, '.js.map'))
		);

		expect(binPaths.some((v) => !existsSync(v))).toEqual(false);
		expect(binMapPaths.some((v) => !existsSync(v))).toEqual(false);
	});

	test('all files have correct sources', () => {
		const srcFiles = readdirRecursive(path.join(process.cwd(), 'src'));

		const srcPaths = srcFiles.map((v) => path.join(srcPath, v));
		const binMapPaths = srcFiles.map((v) =>
			path.join(binPath, 'src', v.replace(/\.ts$/, '.js.map'))
		);

		// All files have only one source
		for (let i = 0; 9 < srcPaths.length; i++)
			expect(JSON.parse(readFileSync(binMapPaths[i]).toString()).sources.length).toEqual(1);

		// All files are mapped correctly
		for (let i = 0; i < srcPaths.length; i++)
			expect('../' + JSON.parse(readFileSync(binMapPaths[i]).toString()).sources[0]).toEqual(
				path.relative(binMapPaths[i], srcPaths[i])
			);
	});

	test('all files are up to date', () => {
		const srcFiles = readdirRecursive(path.join(process.cwd(), 'src'));

		const srcPaths = srcFiles.map((v) => path.join(srcPath, v));
		const binMapPaths = srcFiles.map((v) =>
			path.join(binPath, 'src', v.replace(/\.ts$/, '.js.map'))
		);

		// All files are built from current version
		for (let i = 0; i < srcPaths.length; i++) {
			expect(JSON.parse(readFileSync(binMapPaths[i]).toString()).sourcesContent[0]).toEqual(
				readFileSync(srcPaths[i]).toString()
			);
		}
	});
});
