"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionCommand = void 0;
const child_process_1 = require("child_process");
const module_1 = __importDefault(require("module"));
const command_1 = require("../models/command");
const color_1 = require("../utilities/color");
const package_manager_1 = require("../utilities/package-manager");
/**
 * Major versions of Node.js that are officially supported by Angular.
 */
const SUPPORTED_NODE_MAJORS = [12, 14, 16];
class VersionCommand extends command_1.Command {
    constructor() {
        super(...arguments);
        this.localRequire = module_1.default.createRequire(__filename);
        // Trailing slash is used to allow the path to be treated as a directory
        this.workspaceRequire = module_1.default.createRequire(this.context.root + '/');
    }
    async run() {
        const cliPackage = this.localRequire('../package.json');
        let workspacePackage;
        try {
            workspacePackage = this.workspaceRequire('./package.json');
        }
        catch { }
        const [nodeMajor] = process.versions.node.split('.').map((part) => Number(part));
        const unsupportedNodeVersion = !SUPPORTED_NODE_MAJORS.includes(nodeMajor);
        const patterns = [
            /^@angular\/.*/,
            /^@angular-devkit\/.*/,
            /^@bazel\/.*/,
            /^@ngtools\/.*/,
            /^@nguniversal\/.*/,
            /^@schematics\/.*/,
            /^rxjs$/,
            /^typescript$/,
            /^ng-packagr$/,
            /^webpack$/,
        ];
        const packageNames = [
            ...Object.keys(cliPackage.dependencies || {}),
            ...Object.keys(cliPackage.devDependencies || {}),
            ...Object.keys((workspacePackage === null || workspacePackage === void 0 ? void 0 : workspacePackage.dependencies) || {}),
            ...Object.keys((workspacePackage === null || workspacePackage === void 0 ? void 0 : workspacePackage.devDependencies) || {}),
        ];
        const versions = packageNames
            .filter((x) => patterns.some((p) => p.test(x)))
            .reduce((acc, name) => {
            if (name in acc) {
                return acc;
            }
            acc[name] = this.getVersion(name);
            return acc;
        }, {});
        const ngCliVersion = cliPackage.version;
        let angularCoreVersion = '';
        const angularSameAsCore = [];
        if (workspacePackage) {
            // Filter all angular versions that are the same as core.
            angularCoreVersion = versions['@angular/core'];
            if (angularCoreVersion) {
                for (const angularPackage of Object.keys(versions)) {
                    if (versions[angularPackage] == angularCoreVersion &&
                        angularPackage.startsWith('@angular/')) {
                        angularSameAsCore.push(angularPackage.replace(/^@angular\//, ''));
                        delete versions[angularPackage];
                    }
                }
                // Make sure we list them in alphabetical order.
                angularSameAsCore.sort();
            }
        }
        const namePad = ' '.repeat(Object.keys(versions).sort((a, b) => b.length - a.length)[0].length + 3);
        const asciiArt = `
     _                      _                 ____ _     ___
    / \\   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
   / △ \\ | '_ \\ / _\` | | | | |/ _\` | '__|   | |   | |    | |
  / ___ \\| | | | (_| | |_| | | (_| | |      | |___| |___ | |
 /_/   \\_\\_| |_|\\__, |\\__,_|_|\\__,_|_|       \\____|_____|___|
                |___/
    `
            .split('\n')
            .map((x) => color_1.colors.red(x))
            .join('\n');
        this.logger.info(asciiArt);
        this.logger.info(`
      Angular CLI: ${ngCliVersion}
      Node: ${process.versions.node}${unsupportedNodeVersion ? ' (Unsupported)' : ''}
      Package Manager: ${await this.getPackageManager()}
      OS: ${process.platform} ${process.arch}

      Angular: ${angularCoreVersion}
      ... ${angularSameAsCore
            .reduce((acc, name) => {
            // Perform a simple word wrap around 60.
            if (acc.length == 0) {
                return [name];
            }
            const line = acc[acc.length - 1] + ', ' + name;
            if (line.length > 60) {
                acc.push(name);
            }
            else {
                acc[acc.length - 1] = line;
            }
            return acc;
        }, [])
            .join('\n... ')}

      Package${namePad.slice(7)}Version
      -------${namePad.replace(/ /g, '-')}------------------
      ${Object.keys(versions)
            .map((module) => `${module}${namePad.slice(module.length)}${versions[module]}`)
            .sort()
            .join('\n')}
    `.replace(/^ {6}/gm, ''));
        if (unsupportedNodeVersion) {
            this.logger.warn(`Warning: The current version of Node (${process.versions.node}) is not supported by Angular.`);
        }
    }
    getVersion(moduleName) {
        let packageInfo;
        let cliOnly = false;
        // Try to find the package in the workspace
        try {
            packageInfo = this.workspaceRequire(`${moduleName}/package.json`);
        }
        catch { }
        // If not found, try to find within the CLI
        if (!packageInfo) {
            try {
                packageInfo = this.localRequire(`${moduleName}/package.json`);
                cliOnly = true;
            }
            catch { }
        }
        let version;
        // If found, attempt to get the version
        if (packageInfo) {
            try {
                version = packageInfo.version + (cliOnly ? ' (cli-only)' : '');
            }
            catch { }
        }
        return version || '<error>';
    }
    async getPackageManager() {
        try {
            const manager = await (0, package_manager_1.getPackageManager)(this.context.root);
            const version = (0, child_process_1.execSync)(`${manager} --version`, {
                encoding: 'utf8',
                stdio: ['ignore', 'pipe', 'ignore'],
                env: {
                    ...process.env,
                    //  NPM updater notifier will prevents the child process from closing until it timeout after 3 minutes.
                    NO_UPDATE_NOTIFIER: '1',
                    NPM_CONFIG_UPDATE_NOTIFIER: 'false',
                },
            }).trim();
            return `${manager} ${version}`;
        }
        catch {
            return '<error>';
        }
    }
}
exports.VersionCommand = VersionCommand;
VersionCommand.aliases = ['v'];
