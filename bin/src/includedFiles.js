"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path = require("path");
var includeRegex = /#include *?".+"/;
function includedFiles(file) {
    var files = [];
    var lines = (0, fs_1.readFileSync)(file).toString().split('\n');
    lines.forEach(function (l) {
        if (l.match(includeRegex)) {
            var filePath = path.join(file, '../', pathFromInclude(l)).replace(/\.h$/, '.c');
            if (!files.includes(filePath)) {
                files.push(filePath);
                files.push.apply(files, includedFiles(filePath));
            }
        }
    });
    return files;
}
exports.default = includedFiles;
function pathFromInclude(line) {
    var str = '';
    var quoteFound = false;
    for (var i = 0; i < line.length; i++) {
        var char = line[i];
        if (char === '"' && quoteFound)
            break;
        else if (char === '"')
            quoteFound = true;
        else if (quoteFound)
            str += char;
    }
    return str;
}
//# sourceMappingURL=includedFiles.js.map