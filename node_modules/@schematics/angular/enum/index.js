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
    options.type = options.type ? `.${options.type}` : '';
    return (0, generate_from_files_1.generateFromFiles)(options);
}
exports.default = default_1;
