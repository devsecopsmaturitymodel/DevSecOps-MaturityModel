"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.url = void 0;
const url_1 = require("url");
function url(urlString) {
    const url = (0, url_1.parse)(urlString);
    return (context) => context.engine.createSourceFromUrl(url, context)(context);
}
exports.url = url;
