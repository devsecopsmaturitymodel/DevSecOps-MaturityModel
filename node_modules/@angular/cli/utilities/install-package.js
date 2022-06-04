"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTempPackageBin = exports.installTempPackage = exports.installPackage = exports.installAllPackages = void 0;
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const os_1 = require("os");
const path_1 = require("path");
const workspace_schema_1 = require("../lib/config/workspace-schema");
const spinner_1 = require("./spinner");
async function installAllPackages(packageManager = workspace_schema_1.PackageManager.Npm, extraArgs = [], cwd = process.cwd()) {
    const packageManagerArgs = getPackageManagerArguments(packageManager);
    const installArgs = [];
    if (packageManagerArgs.installAll) {
        installArgs.push(packageManagerArgs.installAll);
    }
    installArgs.push(packageManagerArgs.silent);
    const spinner = new spinner_1.Spinner();
    spinner.start('Installing packages...');
    const bufferedOutput = [];
    return new Promise((resolve, reject) => {
        var _a, _b;
        const childProcess = (0, child_process_1.spawn)(packageManager, [...installArgs, ...extraArgs], {
            stdio: 'pipe',
            shell: true,
            cwd,
        }).on('close', (code) => {
            if (code === 0) {
                spinner.succeed('Packages successfully installed.');
                resolve(0);
            }
            else {
                spinner.stop();
                bufferedOutput.forEach(({ stream, data }) => stream.write(data));
                spinner.fail('Package install failed, see above.');
                reject(1);
            }
        });
        (_a = childProcess.stdout) === null || _a === void 0 ? void 0 : _a.on('data', (data) => bufferedOutput.push({ stream: process.stdout, data: data }));
        (_b = childProcess.stderr) === null || _b === void 0 ? void 0 : _b.on('data', (data) => bufferedOutput.push({ stream: process.stderr, data: data }));
    });
}
exports.installAllPackages = installAllPackages;
async function installPackage(packageName, packageManager = workspace_schema_1.PackageManager.Npm, save = true, extraArgs = [], cwd = process.cwd()) {
    const packageManagerArgs = getPackageManagerArguments(packageManager);
    const installArgs = [
        packageManagerArgs.install,
        packageName,
        packageManagerArgs.silent,
    ];
    const spinner = new spinner_1.Spinner();
    spinner.start('Installing package...');
    if (save === 'devDependencies') {
        installArgs.push(packageManagerArgs.saveDev);
    }
    const bufferedOutput = [];
    return new Promise((resolve, reject) => {
        var _a, _b;
        const childProcess = (0, child_process_1.spawn)(packageManager, [...installArgs, ...extraArgs], {
            stdio: 'pipe',
            shell: true,
            cwd,
        }).on('close', (code) => {
            if (code === 0) {
                spinner.succeed('Package successfully installed.');
                resolve(0);
            }
            else {
                spinner.stop();
                bufferedOutput.forEach(({ stream, data }) => stream.write(data));
                spinner.fail('Package install failed, see above.');
                reject(1);
            }
        });
        (_a = childProcess.stdout) === null || _a === void 0 ? void 0 : _a.on('data', (data) => bufferedOutput.push({ stream: process.stdout, data: data }));
        (_b = childProcess.stderr) === null || _b === void 0 ? void 0 : _b.on('data', (data) => bufferedOutput.push({ stream: process.stderr, data: data }));
    });
}
exports.installPackage = installPackage;
async function installTempPackage(packageName, packageManager = workspace_schema_1.PackageManager.Npm, extraArgs) {
    const tempPath = (0, fs_1.mkdtempSync)((0, path_1.join)((0, fs_1.realpathSync)((0, os_1.tmpdir)()), 'angular-cli-packages-'));
    // clean up temp directory on process exit
    process.on('exit', () => {
        try {
            (0, fs_1.rmdirSync)(tempPath, { recursive: true, maxRetries: 3 });
        }
        catch { }
    });
    // NPM will warn when a `package.json` is not found in the install directory
    // Example:
    // npm WARN enoent ENOENT: no such file or directory, open '/tmp/.ng-temp-packages-84Qi7y/package.json'
    // npm WARN .ng-temp-packages-84Qi7y No description
    // npm WARN .ng-temp-packages-84Qi7y No repository field.
    // npm WARN .ng-temp-packages-84Qi7y No license field.
    // While we can use `npm init -y` we will end up needing to update the 'package.json' anyways
    // because of missing fields.
    (0, fs_1.writeFileSync)((0, path_1.join)(tempPath, 'package.json'), JSON.stringify({
        name: 'temp-cli-install',
        description: 'temp-cli-install',
        repository: 'temp-cli-install',
        license: 'MIT',
    }));
    // setup prefix/global modules path
    const packageManagerArgs = getPackageManagerArguments(packageManager);
    const tempNodeModules = (0, path_1.join)(tempPath, 'node_modules');
    // Yarn will not append 'node_modules' to the path
    const prefixPath = packageManager === workspace_schema_1.PackageManager.Yarn ? tempNodeModules : tempPath;
    const installArgs = [
        ...(extraArgs || []),
        `${packageManagerArgs.prefix}="${prefixPath}"`,
        packageManagerArgs.noLockfile,
    ];
    return {
        status: await installPackage(packageName, packageManager, true, installArgs, tempPath),
        tempNodeModules,
    };
}
exports.installTempPackage = installTempPackage;
async function runTempPackageBin(packageName, packageManager = workspace_schema_1.PackageManager.Npm, args = []) {
    const { status: code, tempNodeModules } = await installTempPackage(packageName, packageManager);
    if (code !== 0) {
        return code;
    }
    // Remove version/tag etc... from package name
    // Ex: @angular/cli@latest -> @angular/cli
    const packageNameNoVersion = packageName.substring(0, packageName.lastIndexOf('@'));
    const pkgLocation = (0, path_1.join)(tempNodeModules, packageNameNoVersion);
    const packageJsonPath = (0, path_1.join)(pkgLocation, 'package.json');
    // Get a binary location for this package
    let binPath;
    if ((0, fs_1.existsSync)(packageJsonPath)) {
        const content = (0, fs_1.readFileSync)(packageJsonPath, 'utf-8');
        if (content) {
            const { bin = {} } = JSON.parse(content);
            const binKeys = Object.keys(bin);
            if (binKeys.length) {
                binPath = (0, path_1.resolve)(pkgLocation, bin[binKeys[0]]);
            }
        }
    }
    if (!binPath) {
        throw new Error(`Cannot locate bin for temporary package: ${packageNameNoVersion}.`);
    }
    const { status, error } = (0, child_process_1.spawnSync)(process.execPath, [binPath, ...args], {
        stdio: 'inherit',
        env: {
            ...process.env,
            NG_DISABLE_VERSION_CHECK: 'true',
            NG_CLI_ANALYTICS: 'false',
        },
    });
    if (status === null && error) {
        throw error;
    }
    return status || 0;
}
exports.runTempPackageBin = runTempPackageBin;
function getPackageManagerArguments(packageManager) {
    switch (packageManager) {
        case workspace_schema_1.PackageManager.Yarn:
            return {
                silent: '--silent',
                saveDev: '--dev',
                install: 'add',
                prefix: '--modules-folder',
                noLockfile: '--no-lockfile',
            };
        case workspace_schema_1.PackageManager.Pnpm:
            return {
                silent: '--silent',
                saveDev: '--save-dev',
                install: 'add',
                installAll: 'install',
                prefix: '--prefix',
                noLockfile: '--no-lockfile',
            };
        default:
            return {
                silent: '--quiet',
                saveDev: '--save-dev',
                install: 'install',
                installAll: 'install',
                prefix: '--prefix',
                noLockfile: '--no-package-lock',
            };
    }
}
