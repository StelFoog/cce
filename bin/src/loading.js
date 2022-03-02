"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk = __importStar(require("chalk"));
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
        },
    };
}
exports.default = startLoading;
//# sourceMappingURL=loading.js.map