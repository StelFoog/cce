"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk = require("chalk");
var loaderIcons = ['▝', '▐', '▗', '▄', '▖', '▌', '▘', '▀'];
function runningTimer(name, time) {
    var loader = loaderIcons[time % loaderIcons.length];
    return "".concat(chalk.gray(loader), " ").concat(name, " \u2014 ").concat((time / 10).toFixed(1), "s");
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
        },
    };
}
exports.default = startLoading;
//# sourceMappingURL=loading.js.map