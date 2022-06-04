"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBufferV2Enabled = void 0;
function isEnabled(variable) {
    return variable === '1' || variable.toLowerCase() === 'true';
}
function isPresent(variable) {
    return typeof variable === 'string' && variable !== '';
}
// Use UpdateBuffer2, which uses magic-string internally.
// TODO: Switch this for the next major release to use UpdateBuffer2 by default.
const updateBufferV2 = process.env['NG_UPDATE_BUFFER_V2'];
exports.updateBufferV2Enabled = isPresent(updateBufferV2) && isEnabled(updateBufferV2);
