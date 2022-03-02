#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var chalk = require("chalk");
var child_process_1 = require("child_process");
var commander_1 = require("commander");
var fs_1 = require("fs");
var path = require("path");
var loading_1 = require("./loading");
var pjson = require("../package.json");
var mainMatch = /main[\n\t ]*?\([^]*?\)[\n\t ]*?\{/;
var modifiedFile = '__cce_mod__.c';
var program = new commander_1.Command();
program.name('cce').description(pjson.description).version(pjson.version, '-v, -V, --version');
program
    .argument('<file>', 'file to compile and run')
    .option('-c, --compiler <compiler>', 'compiler to use, defaults to GCC')
    .option('-ca, --compiler-arguments <arguments>', 'arguments passed to the compiler')
    .option('-ea, --execute-arguments <arguments>', 'arguments passed to the executable result')
    .option('-o, --outfile <name>', 'name of compiled file, defaults to <file>__cce__.o')
    .option('-s, --save', 'saves the file after execution, otherwise it will be deleted')
    .option('-ai, --as-is', 'compiles the original file without modification, could result in unexpected behavior during execution phase');
program.parse();
var file = program.args[0];
var opts = program.opts();
var compiler = (opts === null || opts === void 0 ? void 0 : opts.compiler) || 'gcc';
var compilerArguments = (opts === null || opts === void 0 ? void 0 : opts.compilerArguments) || '';
var executeArguments = (opts === null || opts === void 0 ? void 0 : opts.executeArguments) || '';
var outfile = (opts === null || opts === void 0 ? void 0 : opts.outfile) || "".concat(file, "__cce__.o");
var save = (opts === null || opts === void 0 ? void 0 : opts.save) || false;
var asIs = (opts === null || opts === void 0 ? void 0 : opts.asIs) || false;
var filePath = path.join(process.cwd(), file);
validateOptions();
function validateOptions() {
    var _this = this;
    var validatingLoader = (0, loading_1["default"])('Validating');
    var warnings = [];
    if (compilerArguments.match(/(-o|--output)/))
        warnings.push('--compiler-arguments contains an --output option, this could prevent CCE from executing the compiled file. Please use the CCE --outfile (-o) option instead');
    if (!(0, fs_1.existsSync)(filePath)) {
        validatingLoader.error();
        console.error("error: file ".concat(filePath, " doesn't exist"));
        process.exit(1);
    }
    (0, fs_1.stat)(filePath, function (error, stats) {
        if (error) {
            validatingLoader.error();
            console.error("error: there was an issue retrieving information about the file ".concat(filePath));
            process.exit(1);
        }
        if (!stats.isFile()) {
            validatingLoader.error();
            console.error("error: ".concat(filePath, " is not a file"));
            process.exit(1);
        }
        (0, child_process_1.exec)("which ".concat(compiler), function (error) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (error) {
                    validatingLoader.error();
                    console.error("error: compiler ".concat(compiler, " doesn't exist"));
                    process.exit(1);
                }
                validatingLoader.done();
                warnings.forEach(function (w) { return console.log("".concat(chalk.hex('#a2e')('Warning:'), " ").concat(w)); });
                compile();
                return [2];
            });
        }); });
    });
}
function compile() {
    var compileLoader = (0, loading_1["default"])('Compiling');
    if (asIs) {
        (0, child_process_1.exec)("".concat(compiler, " ").concat(file).concat(compilerArguments && " ".concat(compilerArguments), " -o ").concat(outfile), function (error, stdout, stderr) {
            if (error) {
                compileLoader.error();
                console.error(stderr);
                process.exit(1);
            }
            if (!(0, fs_1.existsSync)(path.join(process.cwd(), outfile))) {
                compileLoader.error();
                console.error("error: Compiled file not found where expected, likely caused by compiler ".concat(compiler, " not handeling -o in an expected way.") +
                    '\nA possible workaround is to provide the --compiler-arguments and --outfile option with the same filename');
                process.exit(1);
            }
            compileLoader.done();
            console.log(stdout);
            execute();
        });
    }
    else {
        generateModFile(function () {
            (0, child_process_1.exec)("".concat(compiler, " ").concat(modifiedFile).concat(compilerArguments && " ".concat(compilerArguments), " -o ").concat(outfile), function (error, stdout, stderr) {
                if (error) {
                    compileLoader.error();
                    console.log();
                    console.error(hideMod(stderr));
                    (0, fs_1.rmSync)("".concat(process.cwd(), "/").concat(modifiedFile));
                    process.exit(1);
                }
                (0, fs_1.rmSync)("".concat(process.cwd(), "/").concat(modifiedFile));
                if (!(0, fs_1.existsSync)(path.join(process.cwd(), outfile))) {
                    compileLoader.error();
                    console.error("error: Compiled file not found where expected, likely caused by compiler ".concat(compiler, " not handeling -o in an expected way.") +
                        '\nA possible workaround is to provide the --compiler-arguments and --outfile option with the same filename');
                    process.exit(1);
                }
                compileLoader.done();
                console.log();
                if (stderr || stdout)
                    console.log(chalk.bold('Compiler says:'));
                if (stderr)
                    console.log(hideMod(stderr));
                if (stdout)
                    console.log(hideMod(stdout));
                execute();
            });
        });
    }
}
function generateModFile(callback) {
    (0, fs_1.readFile)(file, function (error, data) {
        if (error) {
            console.error(error);
            process.exit(1);
        }
        var original = data.toString();
        var match = mainMatch.exec(original);
        (0, fs_1.writeFile)("".concat(process.cwd(), "/").concat(modifiedFile), original.slice(0, match.index + match[0].length) +
            '\nsetvbuf(stdout, NULL, _IONBF, 0);' +
            original.slice(match.index + match[0].length), function (error) {
            if (error) {
                console.error(error);
                process.exit(1);
            }
            callback();
        });
    });
}
function hideMod(text) {
    return (text.replace(new RegExp(modifiedFile, 'g'), file) +
        "\n".concat(chalk
            .hex('#e83')
            .bold('Note:'), " Row numbers can be of by one. Run with flag -ai to get exact values from compilation errors and warnings"));
}
function execute() {
    (0, child_process_1.execSync)("chmod +x ".concat(outfile));
    var child = (0, child_process_1.spawn)("./".concat(outfile), executeArguments
        ? executeArguments.split(' ')
        : undefined);
    child.stdout.setEncoding('utf8');
    child.stdout.pipe(process.stdout);
    process.stdin.on('data', function (data) {
        child.stdin.write(data);
    });
    child.on('error', function (err) {
        console.log('Process Error');
        console.log(err);
        if (!save)
            (0, fs_1.rmSync)(outfile);
        process.exit(1);
    });
    child.on('exit', function (code) {
        console.error("Process exited with code ".concat(code));
        if (!save)
            (0, fs_1.rmSync)(outfile);
        process.exit(0);
    });
}
process.on('SIGINT', function () {
    console.log('\nPerforming cleanup...');
    if ((0, fs_1.existsSync)("".concat(process.cwd(), "/").concat(modifiedFile)))
        (0, fs_1.rmSync)("".concat(process.cwd(), "/").concat(modifiedFile));
    if ((0, fs_1.existsSync)("".concat(process.cwd(), "/").concat(outfile)))
        (0, fs_1.rmSync)("".concat(process.cwd(), "/").concat(outfile));
    console.log('Cleanup complete');
    process.exit(0);
});
//# sourceMappingURL=index.js.map