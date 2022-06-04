"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertCompatibleAngularVersion = void 0;
/* eslint-disable no-console */
const core_1 = require("@angular-devkit/core");
const semver_1 = require("semver");
function assertCompatibleAngularVersion(projectRoot) {
    let angularCliPkgJson;
    let angularPkgJson;
    const resolveOptions = { paths: [projectRoot] };
    try {
        const angularPackagePath = require.resolve('@angular/core/package.json', resolveOptions);
        angularPkgJson = require(angularPackagePath);
    }
    catch {
        console.error(core_1.tags.stripIndents `
      You seem to not be depending on "@angular/core". This is an error.
    `);
        process.exit(2);
    }
    if (!(angularPkgJson && angularPkgJson['version'])) {
        console.error(core_1.tags.stripIndents `
      Cannot determine versions of "@angular/core".
      This likely means your local installation is broken. Please reinstall your packages.
    `);
        process.exit(2);
    }
    try {
        const angularCliPkgPath = require.resolve('@angular/cli/package.json', resolveOptions);
        angularCliPkgJson = require(angularCliPkgPath);
        if (!(angularCliPkgJson && angularCliPkgJson['version'])) {
            return;
        }
    }
    catch {
        // Not using @angular-devkit/build-angular with @angular/cli is ok too.
        // In this case we don't provide as many version checks.
        return;
    }
    if (angularCliPkgJson['version'] === '0.0.0' || angularPkgJson['version'] === '0.0.0') {
        // Internal CLI testing version or integration testing in the angular/angular
        // repository with the generated development @angular/core npm package which is versioned "0.0.0".
        return;
    }
    const supportedAngularSemver = require('../../package.json')['peerDependencies']['@angular/compiler-cli'];
    const angularVersion = new semver_1.SemVer(angularPkgJson['version']);
    if (!(0, semver_1.satisfies)(angularVersion, supportedAngularSemver, { includePrerelease: true })) {
        console.error(core_1.tags.stripIndents `
        This version of CLI is only compatible with Angular versions ${supportedAngularSemver},
        but Angular version ${angularVersion} was found instead.

        Please visit the link below to find instructions on how to update Angular.
        https://update.angular.io/
      ` + '\n');
        process.exit(3);
    }
}
exports.assertCompatibleAngularVersion = assertCompatibleAngularVersion;
