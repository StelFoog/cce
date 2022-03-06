"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modifiedFile = exports.mainMatch = void 0;
var chalk = require("chalk");
var child_process_1 = require("child_process");
var fs_1 = require("fs");
var path = require("path");
var loading_1 = require("./loading");
exports.mainMatch = /main[\n\t ]*?\([^]*?\)[\n\t ]*?\{/;
exports.modifiedFile = '__cce_mod__.c';
function compilePhase(params, callback) {
    var file = params.file, onlyExecPrints = params.onlyExecPrints, asIs = params.asIs, compiler = params.compiler, compilerArguments = params.compilerArguments, outfile = params.outfile;
    var compileLoader = !onlyExecPrints && (0, loading_1.default)('Compiling');
    if (asIs) {
        (0, child_process_1.exec)("".concat(compiler, " ").concat(file, " ").concat(compilerArguments || '', " -o ").concat(outfile), function (error, stdout, stderr) {
            if (error) {
                if (!onlyExecPrints)
                    compileLoader.error();
                console.error(stderr);
                process.exit(1);
            }
            if (!(0, fs_1.existsSync)(path.join(process.cwd(), outfile))) {
                if (!onlyExecPrints)
                    compileLoader.error();
                console.error("error: Compiled file not found where expected, likely caused by compiler ".concat(compiler, " not handeling -o in an expected way.") +
                    '\nA possible workaround is to provide the --compiler-arguments and --outfile option with the same filename');
                process.exit(1);
            }
            if (!onlyExecPrints) {
                compileLoader.done();
                console.log(stdout);
            }
            callback();
        });
    }
    else {
        generateModFile(file, function () {
            (0, child_process_1.exec)("".concat(compiler, " ").concat(exports.modifiedFile).concat(compilerArguments && " ".concat(compilerArguments), " -o ").concat(outfile), function (error, stdout, stderr) {
                if (error) {
                    if (!onlyExecPrints)
                        compileLoader.error();
                    console.log();
                    console.error(hideMod(file, stderr));
                    (0, fs_1.rmSync)("".concat(process.cwd(), "/").concat(exports.modifiedFile));
                    process.exit(1);
                }
                (0, fs_1.rmSync)("".concat(process.cwd(), "/").concat(exports.modifiedFile));
                if (!(0, fs_1.existsSync)(path.join(process.cwd(), outfile))) {
                    if (!onlyExecPrints)
                        compileLoader.error();
                    console.error("error: Compiled file not found where expected, likely caused by compiler ".concat(compiler, " not handeling -o in an expected way.") +
                        '\nA possible workaround is to provide the --compiler-arguments and --outfile option with the same filename');
                    process.exit(1);
                }
                if (!onlyExecPrints) {
                    compileLoader.done();
                    console.log();
                    if (stderr || stdout)
                        console.log(chalk.bold('Compiler says:'));
                    if (stderr)
                        console.log(hideMod(file, stderr));
                    if (stdout)
                        console.log(hideMod(file, stdout));
                }
                callback();
            });
        });
    }
}
exports.default = compilePhase;
function generateModFile(file, callback) {
    (0, fs_1.readFile)(file, function (error, data) {
        if (error) {
            console.error(error);
            process.exit(1);
        }
        var original = data.toString();
        var match = exports.mainMatch.exec(original);
        (0, fs_1.writeFile)("".concat(process.cwd(), "/").concat(exports.modifiedFile), '#include <stdio.h>\n' +
            original.slice(0, match.index + match[0].length) +
            '\nsetvbuf(stdout, (void*)0, _IONBF, 0);' +
            original.slice(match.index + match[0].length), function (error) {
            if (error) {
                console.error(error);
                process.exit(1);
            }
            callback();
        });
    });
}
function hideMod(file, text) {
    return (text.replace(new RegExp(exports.modifiedFile, 'g'), file) +
        "\n".concat(chalk
            .hex('#e83')
            .bold('Note:'), " Row numbers can be of by one. Run with flag -ai to get exact values from compilation errors and warnings"));
}
//# sourceMappingURL=compilePhase.js.map