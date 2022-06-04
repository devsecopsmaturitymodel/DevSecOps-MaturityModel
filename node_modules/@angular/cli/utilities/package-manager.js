"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureCompatibleNpm = exports.getPackageManager = exports.supportsNpm = exports.supportsYarn = void 0;
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const path_1 = require("path");
const semver_1 = require("semver");
const workspace_schema_1 = require("../lib/config/workspace-schema");
const config_1 = require("./config");
function supports(name) {
    try {
        (0, child_process_1.execSync)(`${name} --version`, { stdio: 'ignore' });
        return true;
    }
    catch {
        return false;
    }
}
function supportsYarn() {
    return supports('yarn');
}
exports.supportsYarn = supportsYarn;
function supportsNpm() {
    return supports('npm');
}
exports.supportsNpm = supportsNpm;
async function getPackageManager(root) {
    let packageManager = (await (0, config_1.getConfiguredPackageManager)());
    if (packageManager) {
        return packageManager;
    }
    const hasYarn = supportsYarn();
    const hasYarnLock = (0, fs_1.existsSync)((0, path_1.join)(root, 'yarn.lock'));
    const hasNpm = supportsNpm();
    const hasNpmLock = (0, fs_1.existsSync)((0, path_1.join)(root, 'package-lock.json'));
    if (hasYarn && hasYarnLock && !hasNpmLock) {
        packageManager = workspace_schema_1.PackageManager.Yarn;
    }
    else if (hasNpm && hasNpmLock && !hasYarnLock) {
        packageManager = workspace_schema_1.PackageManager.Npm;
    }
    else if (hasYarn && !hasNpm) {
        packageManager = workspace_schema_1.PackageManager.Yarn;
    }
    else if (hasNpm && !hasYarn) {
        packageManager = workspace_schema_1.PackageManager.Npm;
    }
    // TODO: This should eventually inform the user of ambiguous package manager usage.
    //       Potentially with a prompt to choose and optionally set as the default.
    return packageManager || workspace_schema_1.PackageManager.Npm;
}
exports.getPackageManager = getPackageManager;
/**
 * Checks if the npm version is a supported 7.x version.  If not, display a warning.
 */
async function ensureCompatibleNpm(root) {
    if ((await getPackageManager(root)) !== workspace_schema_1.PackageManager.Npm) {
        return;
    }
    try {
        const versionText = (0, child_process_1.execSync)('npm --version', { encoding: 'utf8', stdio: 'pipe' }).trim();
        const version = (0, semver_1.valid)(versionText);
        if (!version) {
            return;
        }
        if ((0, semver_1.satisfies)(version, '>=7 <7.5.6')) {
            // eslint-disable-next-line no-console
            console.warn(`npm version ${version} detected.` +
                ' When using npm 7 with the Angular CLI, npm version 7.5.6 or higher is recommended.');
        }
    }
    catch {
        // npm is not installed
    }
}
exports.ensureCompatibleNpm = ensureCompatibleNpm;
