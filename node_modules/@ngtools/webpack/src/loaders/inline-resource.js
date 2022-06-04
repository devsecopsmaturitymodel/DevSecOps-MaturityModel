"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineAngularResourceSymbol = exports.InlineAngularResourceLoaderPath = void 0;
exports.InlineAngularResourceLoaderPath = __filename;
exports.InlineAngularResourceSymbol = Symbol('@ngtools/webpack[angular-resource]');
function default_1() {
    const callback = this.async();
    const { data } = this.getOptions();
    if (data) {
        callback(undefined, Buffer.from(data, 'base64').toString());
    }
    else {
        const content = this._compilation[exports.InlineAngularResourceSymbol];
        callback(undefined, content);
    }
}
exports.default = default_1;
