import { readFileSync } from 'fs';
import * as path from 'path';

const includeRegex = /#include *?".+"/;

/**
 * Builds an array of all files included by the main file and those included by it and so forth
 * @param file Full path to the file
 * @returns Full path to all the files to be compiled
 */
export default function includedFiles(file: string): string[] {
	const files: string[] = [];

	const lines = readFileSync(file).toString().split('\n');
	lines.forEach((l) => {
		if (l.match(includeRegex)) {
			const filePath = path.join(file, '../', pathFromInclude(l)).replace(/\.h$/, '.c');
			if (!files.includes(filePath)) {
				files.push(filePath);
				files.push(...includedFiles(filePath));
			}
		}
	});

	return files;
}

function pathFromInclude(line: string): string {
	let str = '';
	let quoteFound = false;
	for (let i = 0; i < line.length; i++) {
		const char = line[i];
		if (char === '"' && quoteFound) break;
		else if (char === '"') quoteFound = true;
		else if (quoteFound) str += char;
	}

	return str;
}
