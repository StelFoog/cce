type ParsedObject = {
	parsed: string[];
	error: boolean;
	specials: string[];
};

/**
 * parses arguments
 * @param args arguments to parse
 * @returns array of arguments, or `null` if missing a dequote
 */
export default function parseArgs(args: string): ParsedObject {
	const parsed: string[] = [];
	const specials: string[] = [];

	let special = '';
	let quote = false;
	let wasQuote = false;
	let current = '';
	for (let i = 0; i < args.length; i++) {
		const char = args[i];

		/*if (special && current && char == ' ') {
			specials.push(special + current);
			special = '';
			current = '';
		} else */ if (char === '"' && !quote) {
			quote = true;
			wasQuote = true;
		} else if (char === '"') {
			quote = false;
		} else if (!quote && !special && (char === '<' || char === '>')) {
			if (current) {
				parsed.push(current);
				current = '';
			}
			special = char;
		} else if (char === ' ' && !quote) {
			if (current || wasQuote) {
				if (special) {
					specials.push(special + current);
					special = '';
				} else {
					parsed.push(current);
				}
				current = '';
				wasQuote = false;
			}
		} else if (char !== ' ' || quote) {
			current += char;
		}
	}

	if (quote) return { parsed: [], error: true, specials: [] };

	if (current || wasQuote) {
		if (special) specials.push(special + current);
		else parsed.push(current);
	}
	return { parsed, error: false, specials };
}
