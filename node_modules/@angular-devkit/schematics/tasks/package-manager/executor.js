"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnknownPackageManagerException = void 0;
const core_1 = require("@angular-devkit/core");
const child_process_1 = require("child_process");
const ora_1 = __importDefault(require("ora"));
const path = __importStar(require("path"));
const rxjs_1 = require("rxjs");
const src_1 = require("../../src");
const packageManagers = {
    'npm': {
        quietArgument: '--quiet',
        commands: {
            installAll: 'install',
            installPackage: 'install',
        },
    },
    'cnpm': {
        commands: {
            installAll: 'install',
            installPackage: 'install',
        },
    },
    'yarn': {
        quietArgument: '--silent',
        commands: {
            installPackage: 'add',
        },
    },
    'pnpm': {
        quietArgument: '--silent',
        commands: {
            installAll: 'install',
            installPackage: 'install',
        },
    },
};
class UnknownPackageManagerException extends core_1.BaseException {
    constructor(name) {
        super(`Unknown package manager "${name}".`);
    }
}
exports.UnknownPackageManagerException = UnknownPackageManagerException;
function default_1(factoryOptions = {}) {
    const packageManagerName = factoryOptions.packageManager || 'npm';
    const packageManagerProfile = packageManagers[packageManagerName];
    if (!packageManagerProfile) {
        throw new UnknownPackageManagerException(packageManagerName);
    }
    const rootDirectory = factoryOptions.rootDirectory || process.cwd();
    return (options = { command: 'install' }) => {
        let taskPackageManagerProfile = packageManagerProfile;
        let taskPackageManagerName = packageManagerName;
        if (factoryOptions.allowPackageManagerOverride && options.packageManager) {
            taskPackageManagerProfile = packageManagers[options.packageManager];
            if (!taskPackageManagerProfile) {
                throw new UnknownPackageManagerException(options.packageManager);
            }
            taskPackageManagerName = options.packageManager;
        }
        const bufferedOutput = [];
        const spawnOptions = {
            stdio: options.hideOutput ? 'pipe' : 'inherit',
            shell: true,
            cwd: path.join(rootDirectory, options.workingDirectory || ''),
        };
        const args = [];
        if (options.packageName) {
            if (options.command === 'install') {
                args.push(taskPackageManagerProfile.commands.installPackage);
            }
            args.push(options.packageName);
        }
        else if (options.command === 'install' && taskPackageManagerProfile.commands.installAll) {
            args.push(taskPackageManagerProfile.commands.installAll);
        }
        if (options.quiet && taskPackageManagerProfile.quietArgument) {
            args.push(taskPackageManagerProfile.quietArgument);
        }
        if (factoryOptions.registry) {
            args.push(`--registry="${factoryOptions.registry}"`);
        }
        if (factoryOptions.force) {
            args.push('--force');
        }
        return new rxjs_1.Observable((obs) => {
            var _a, _b;
            const spinner = (0, ora_1.default)({
                text: `Installing packages (${taskPackageManagerName})...`,
                // Workaround for https://github.com/sindresorhus/ora/issues/136.
                discardStdin: process.platform != 'win32',
            }).start();
            const childProcess = (0, child_process_1.spawn)(taskPackageManagerName, args, spawnOptions).on('close', (code) => {
                if (code === 0) {
                    spinner.succeed('Packages installed successfully.');
                    spinner.stop();
                    obs.next();
                    obs.complete();
                }
                else {
                    if (options.hideOutput) {
                        bufferedOutput.forEach(({ stream, data }) => stream.write(data));
                    }
                    spinner.fail('Package install failed, see above.');
                    obs.error(new src_1.UnsuccessfulWorkflowExecution());
                }
            });
            if (options.hideOutput) {
                (_a = childProcess.stdout) === null || _a === void 0 ? void 0 : _a.on('data', (data) => bufferedOutput.push({ stream: process.stdout, data: data }));
                (_b = childProcess.stderr) === null || _b === void 0 ? void 0 : _b.on('data', (data) => bufferedOutput.push({ stream: process.stderr, data: data }));
            }
        });
    };
}
exports.default = default_1;
