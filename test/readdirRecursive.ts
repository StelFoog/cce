import { readdirSync, statSync } from 'fs';
import { join } from 'path';

export default function readdirRecursive(path: string, base: string = ''): string[] {
	const files: string[] = [];

	readdirSync(path).forEach((v) => {
		if (!statSync(join(path, v)).isDirectory()) return files.push(baseAdd(base, v));
		files.push(...readdirRecursive(`${path}/${v}`, baseAdd(base, v)));
	});

	return files;
}

function baseAdd(base: string, add: string): string {
	return base ? `${base}/${add}` : add;
}
