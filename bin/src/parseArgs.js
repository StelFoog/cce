"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parseArgs(args) {
    var parsed = [];
    var specials = [];
    var special = '';
    var quote = false;
    var wasQuote = false;
    var current = '';
    for (var i = 0; i < args.length; i++) {
        var char = args[i];
        if (char === '"' && !quote) {
            quote = true;
            wasQuote = true;
        }
        else if (char === '"') {
            quote = false;
        }
        else if (!quote && !special && (char === '<' || char === '>')) {
            if (current) {
                parsed.push(current);
                current = '';
            }
            special = char;
        }
        else if (char === ' ' && !quote) {
            if (current || wasQuote) {
                if (special) {
                    specials.push(special + current);
                    special = '';
                }
                else {
                    parsed.push(current);
                }
                current = '';
                wasQuote = false;
            }
        }
        else if (char !== ' ' || quote) {
            current += char;
        }
    }
    if (quote)
        return { parsed: [], error: true, specials: [] };
    if (current || wasQuote) {
        if (special)
            specials.push(special + current);
        else
            parsed.push(current);
    }
    return { parsed: parsed, error: false, specials: specials };
}
exports.default = parseArgs;
//# sourceMappingURL=parseArgs.js.map