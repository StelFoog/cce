import path from 'path';
import includedFiles from '../src/includedFiles';
import parseArgs from '../src/parseArgs';

describe('parseArgs arguments', () => {
	test('foo bar', () => {
		expect(parseArgs('foo bar')).toEqual({ parsed: ['foo', 'bar'], error: false, specials: [] });
	});

	test('"foo bar"', () => {
		expect(parseArgs('"foo bar"')).toEqual({ parsed: ['foo bar'], error: false, specials: [] });
	});

	test('foo "bar', () => {
		expect(parseArgs('foo "bar')).toEqual({ parsed: [], error: true, specials: [] });
	});

	test('foo "" bar', () => {
		expect(parseArgs('foo "" bar')).toEqual({
			parsed: ['foo', '', 'bar'],
			error: false,
			specials: [],
		});
	});

	test('foo " " bar', () => {
		expect(parseArgs('foo " " bar')).toEqual({
			parsed: ['foo', ' ', 'bar'],
			error: false,
			specials: [],
		});
	});

	test('foo ba"r zot f"o"o ba"r zoot', () => {
		expect(parseArgs('foo ba"r  zot  f"o"o ba"r zot')).toEqual({
			parsed: ['foo', 'bar  zot  foo bar', 'zot'],
			error: false,
			specials: [],
		});
	});

	test('foo   bar zot', () => {
		expect(parseArgs('foo   bar zot')).toEqual({
			parsed: ['foo', 'bar', 'zot'],
			error: false,
			specials: [],
		});
	});

	test('foo ""', () => {
		expect(parseArgs('foo ""')).toEqual({
			parsed: ['foo', ''],
			error: false,
			specials: [],
		});
	});
});

describe('parseArgs special characters', () => {
	test('foo< bar', () => {
		expect(parseArgs('foo< bar')).toEqual({
			parsed: ['foo'],
			error: false,
			specials: ['<bar'],
		});
	});

	test('foo "< bar"', () => {
		expect(parseArgs('foo "< bar"')).toEqual({
			parsed: ['foo', '< bar'],
			error: false,
			specials: [],
		});
	});

	test('foo < "bar zo"t', () => {
		expect(parseArgs('foo < "bar zo"t')).toEqual({
			parsed: ['foo'],
			error: false,
			specials: ['<bar zot'],
		});
	});

	test('foo <ba><>>r', () => {
		expect(parseArgs('foo <ba><>>r')).toEqual({
			parsed: ['foo'],
			error: false,
			specials: ['<ba><>>r'],
		});
	});

	test('foo<   bar >zot', () => {
		expect(parseArgs('foo<   bar >zot')).toEqual({
			parsed: ['foo'],
			error: false,
			specials: ['<bar', '>zot'],
		});
	});

	test('<bar>zot foo', () => {
		expect(parseArgs('foo<bar>zot')).toEqual({
			parsed: ['foo'],
			error: false,
			specials: ['<bar>zot'],
		});
	});

	test('foo < "" bar', () => {
		expect(parseArgs('foo < "" bar')).toEqual({
			parsed: ['foo', 'bar'],
			error: false,
			specials: ['<'],
		});
	});
});

describe('includedFiles', () => {
	test('test/cfiles/args.c', () => {
		expect(includedFiles(path.join(process.cwd(), 'test/cfiles/args.c'))).toEqual([
			path.join(process.cwd(), 'test/cfiles/argPrinter.c'),
		]);
	});

	test('test/cfiles/include/index.c', () => {
		expect(includedFiles(path.join(process.cwd(), 'test/cfiles/include/index.c'))).toEqual([
			path.join(process.cwd(), 'test/cfiles/include/args.c'),
			path.join(process.cwd(), 'test/cfiles/argPrinter.c'),
			path.join(process.cwd(), 'test/cfiles/include/hello/world.c'),
		]);
	});
});
