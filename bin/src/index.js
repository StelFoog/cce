#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var fs_1 = require("fs");
var path = require("path");
var pjson = require("../package.json");
var parseArgs_1 = require("./parseArgs");
var validatePhase_1 = require("./validatePhase");
var compilePhase_1 = require("./compilePhase");
var executePhase_1 = require("./executePhase");
var mainMatch = /main[\n\t ]*?\([^]*?\)[\n\t ]*?\{/;
var modifiedFile = '__cce_mod__.c';
var program = new commander_1.Command();
program.name('cce').description(pjson.description).version(pjson.version, '-v, --version');
program
    .argument('<file>', 'file to compile and run')
    .option('-c, --compiler <compiler>', 'compiler to use, defaults to GCC')
    .option('-ca, --compiler-arguments <arguments>', 'arguments passed to the compiler')
    .option('-ea, --execute-arguments <arguments>', 'arguments passed to the executable result')
    .option('--stdin <file>', 'sets stdin for executable')
    .option('--stdout <file>', 'sets stdout for executable')
    .option('-o, --outfile <name>', 'name of compiled file, defaults to <file>__cce__.o')
    .option('-s, --save', 'saves the file after execution, otherwise it will be deleted')
    .option('-ai, --as-is', 'compiles the original file without modification, could result in unexpected behavior during execution phase')
    .option('-oep, --only-exec-prints', "doesn't print or time verification and compile phases, mainly used for testing");
program.parse();
var file = program.args[0];
var opts = program.opts();
var compiler = (opts === null || opts === void 0 ? void 0 : opts.compiler) || 'gcc';
var compilerArguments = (opts === null || opts === void 0 ? void 0 : opts.compilerArguments) || '';
var executeArguments = (0, parseArgs_1.default)((opts === null || opts === void 0 ? void 0 : opts.executeArguments) || '');
var stdin = (opts === null || opts === void 0 ? void 0 : opts.stdin) || '';
var stdout = (opts === null || opts === void 0 ? void 0 : opts.stdout) || '';
var outfile = (opts === null || opts === void 0 ? void 0 : opts.outfile) || "".concat(file, "__cce__.o");
var save = (opts === null || opts === void 0 ? void 0 : opts.save) || false;
var asIs = (opts === null || opts === void 0 ? void 0 : opts.asIs) || false;
var onlyExecPrints = (opts === null || opts === void 0 ? void 0 : opts.onlyExecPrints) || false;
var cceParams = {
    file: file,
    compiler: compiler,
    compilerArguments: compilerArguments,
    executeArguments: executeArguments,
    stdin: stdin,
    stdout: stdout,
    outfile: outfile,
    save: save,
    asIs: asIs,
    onlyExecPrints: onlyExecPrints,
};
(0, validatePhase_1.default)(cceParams, function (includedFiles) {
    (0, compilePhase_1.default)(cceParams, includedFiles, function () {
        (0, executePhase_1.default)(cceParams);
    });
});
process.on('SIGINT', function () {
    console.log('\nPerforming cleanup...');
    if ((0, fs_1.existsSync)(path.join(process.cwd(), modifiedFile)))
        (0, fs_1.rmSync)(path.join(process.cwd(), modifiedFile));
    if ((0, fs_1.existsSync)(path.join(process.cwd(), outfile)))
        (0, fs_1.rmSync)(path.join(process.cwd(), outfile));
    console.log('Cleanup complete');
    process.exit(0);
});
//# sourceMappingURL=index.js.map