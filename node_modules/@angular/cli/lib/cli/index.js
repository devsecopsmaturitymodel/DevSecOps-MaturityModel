"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Version = exports.VERSION = void 0;
const node_1 = require("@angular-devkit/core/node");
const util_1 = require("util");
const command_runner_1 = require("../../models/command-runner");
const color_1 = require("../../utilities/color");
const config_1 = require("../../utilities/config");
const log_file_1 = require("../../utilities/log-file");
const project_1 = require("../../utilities/project");
var version_1 = require("../../models/version");
Object.defineProperty(exports, "VERSION", { enumerable: true, get: function () { return version_1.VERSION; } });
Object.defineProperty(exports, "Version", { enumerable: true, get: function () { return version_1.Version; } });
const debugEnv = process.env['NG_DEBUG'];
const isDebug = debugEnv !== undefined && debugEnv !== '0' && debugEnv.toLowerCase() !== 'false';
/* eslint-disable no-console */
async function default_1(options) {
    // This node version check ensures that the requirements of the project instance of the CLI are met
    const version = process.versions.node.split('.').map((part) => Number(part));
    if (version[0] < 12 || (version[0] === 12 && version[1] < 20)) {
        process.stderr.write(`Node.js version ${process.version} detected.\n` +
            'The Angular CLI requires a minimum v12.20.\n\n' +
            'Please update your Node.js version or visit https://nodejs.org/ for additional instructions.\n');
        return 3;
    }
    const logger = (0, node_1.createConsoleLogger)(isDebug, process.stdout, process.stderr, {
        info: (s) => (color_1.colors.enabled ? s : (0, color_1.removeColor)(s)),
        debug: (s) => (color_1.colors.enabled ? s : (0, color_1.removeColor)(s)),
        warn: (s) => (color_1.colors.enabled ? color_1.colors.bold.yellow(s) : (0, color_1.removeColor)(s)),
        error: (s) => (color_1.colors.enabled ? color_1.colors.bold.red(s) : (0, color_1.removeColor)(s)),
        fatal: (s) => (color_1.colors.enabled ? color_1.colors.bold.red(s) : (0, color_1.removeColor)(s)),
    });
    // Redirect console to logger
    console.info = console.log = function (...args) {
        logger.info((0, util_1.format)(...args));
    };
    console.warn = function (...args) {
        logger.warn((0, util_1.format)(...args));
    };
    console.error = function (...args) {
        logger.error((0, util_1.format)(...args));
    };
    let workspace;
    const workspaceFile = (0, project_1.findWorkspaceFile)();
    if (workspaceFile === null) {
        const [, localPath] = (0, config_1.getWorkspaceRaw)('local');
        if (localPath !== null) {
            logger.fatal(`An invalid configuration file was found ['${localPath}'].` +
                ' Please delete the file before running the command.');
            return 1;
        }
    }
    else {
        try {
            workspace = await config_1.AngularWorkspace.load(workspaceFile);
        }
        catch (e) {
            logger.fatal(`Unable to read workspace file '${workspaceFile}': ${e.message}`);
            return 1;
        }
    }
    try {
        const maybeExitCode = await (0, command_runner_1.runCommand)(options.cliArgs, logger, workspace);
        if (typeof maybeExitCode === 'number') {
            console.assert(Number.isInteger(maybeExitCode));
            return maybeExitCode;
        }
        return 0;
    }
    catch (err) {
        if (err instanceof Error) {
            try {
                const logPath = (0, log_file_1.writeErrorToLogFile)(err);
                logger.fatal(`An unhandled exception occurred: ${err.message}\n` +
                    `See "${logPath}" for further details.`);
            }
            catch (e) {
                logger.fatal(`An unhandled exception occurred: ${err.message}\n` +
                    `Fatal error writing debug log file: ${e.message}`);
                if (err.stack) {
                    logger.fatal(err.stack);
                }
            }
            return 127;
        }
        else if (typeof err === 'string') {
            logger.fatal(err);
        }
        else if (typeof err === 'number') {
            // Log nothing.
        }
        else {
            logger.fatal('An unexpected error occurred: ' + JSON.stringify(err));
        }
        if (options.testing) {
            // eslint-disable-next-line no-debugger
            debugger;
            throw err;
        }
        return 1;
    }
}
exports.default = default_1;
