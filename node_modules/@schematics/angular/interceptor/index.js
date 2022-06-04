"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const generate_from_files_1 = require("../utility/generate-from-files");
function default_1(options) {
    // This schematic uses an older method to implement the flat option
    const flat = options.flat;
    options.flat = true;
    return (0, generate_from_files_1.generateFromFiles)(options, {
        'if-flat': (s) => (flat ? '' : s),
    });
}
exports.default = default_1;
