"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEntryPoints = void 0;
const helpers_1 = require("../webpack/utils/helpers");
function generateEntryPoints(options) {
    // Add all styles/scripts, except lazy-loaded ones.
    const extraEntryPoints = (extraEntryPoints, defaultBundleName) => {
        const entryPoints = (0, helpers_1.normalizeExtraEntryPoints)(extraEntryPoints, defaultBundleName)
            .filter((entry) => entry.inject)
            .map((entry) => entry.bundleName);
        // remove duplicates
        return [...new Set(entryPoints)].map((f) => [f, false]);
    };
    const entryPoints = [
        ['runtime', !options.isHMREnabled],
        ['polyfills', true],
        ...extraEntryPoints(options.styles, 'styles'),
        ...extraEntryPoints(options.scripts, 'scripts'),
        ['vendor', true],
        ['main', true],
    ];
    const duplicates = entryPoints.filter(([name]) => entryPoints[0].indexOf(name) !== entryPoints[0].lastIndexOf(name));
    if (duplicates.length > 0) {
        throw new Error(`Multiple bundles have been named the same: '${duplicates.join(`', '`)}'.`);
    }
    return entryPoints;
}
exports.generateEntryPoints = generateEntryPoints;
