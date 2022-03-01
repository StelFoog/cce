"use strict";
exports.__esModule = true;
var chalk = require("chalk");
function runningTimer(name, time) {
    var spinner;
    switch (Math.floor((time % 8) / 2)) {
        case 0:
            spinner = '|';
            break;
        case 1:
            spinner = '/';
            break;
        case 2:
            spinner = '—';
            break;
        case 3:
            spinner = '\\';
            break;
    }
    return "".concat(chalk.bold.gray(spinner), " ").concat(name, " \u2014 ").concat((time / 10).toFixed(1), "s");
}
function startLoading(name) {
    var time = 0;
    process.stdout.write(runningTimer(name, time));
    var interval = setInterval(function () {
        time += 1;
        process.stdout.write("\r\u001B[K".concat(runningTimer(name, time)));
    }, 100);
    return {
        done: function () {
            clearInterval(interval);
            process.stdout.write("\r\u001B[K".concat(chalk.green('✓'), " ").concat(name, " \u2014 ").concat((time / 10).toFixed(1), "s\n"));
        },
        error: function () {
            clearInterval(interval);
            process.stdout.write("\r\u001B[K".concat(chalk.red('✕'), " ").concat(name, " \u2014 ").concat((time / 10).toFixed(1), "s\n"));
        }
    };
}
exports["default"] = startLoading;
//# sourceMappingURL=loading.js.map