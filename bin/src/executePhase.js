"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var fs_1 = require("fs");
var path = require("path");
function executePhase(params) {
    var outfile = params.outfile, executeArguments = params.executeArguments, stdout = params.stdout, stdin = params.stdin, save = params.save;
    (0, child_process_1.execSync)("chmod +x ".concat(outfile));
    var child = (0, child_process_1.spawn)("./".concat(outfile), executeArguments.parsed);
    var stdoutResult = '';
    child.stdout.setEncoding('utf8');
    if (stdout) {
        child.stdout.on('data', function (data) {
            stdoutResult += data.toString();
        });
    }
    else {
        child.stdout.pipe(process.stdout);
    }
    if (stdin) {
        var stdinFilePath_1 = path.join(process.cwd(), stdin);
        (0, fs_1.readFile)(stdinFilePath_1, function (error, data) {
            if (error) {
                console.error("error: couldn't pass ".concat(stdinFilePath_1, " to stdin, file couldn't be read"));
                process.exit(1);
            }
            child.stdin.write(data + '\0');
        });
    }
    else {
        process.stdin.on('data', function (data) {
            child.stdin.write(data);
        });
    }
    child.on('error', function (err) {
        console.log('Process Error');
        console.log(err);
        if (!save)
            (0, fs_1.rmSync)(outfile);
        process.exit(1);
    });
    child.on('exit', function (code) {
        var exitMessage = "Process exited with code ".concat(code);
        if (stdout) {
            (0, fs_1.writeFile)(path.join(process.cwd(), stdout), stdoutResult + exitMessage, function () {
                if (!save)
                    (0, fs_1.rmSync)(outfile);
                process.exit(0);
            });
        }
        else {
            console.log(exitMessage);
            if (!save)
                (0, fs_1.rmSync)(outfile);
            process.exit(0);
        }
    });
}
exports.default = executePhase;
//# sourceMappingURL=executePhase.js.map