"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HmrLoader = void 0;
const path_1 = require("path");
exports.HmrLoader = __filename;
const hmrAcceptPath = (0, path_1.join)(__dirname, './hmr-accept.js').replace(/\\/g, '/');
function default_1(content, 
// Source map types are broken in the webpack type definitions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
map) {
    const source = `${content}

  // HMR Accept Code
  import ngHmrAccept from '${hmrAcceptPath}';
  ngHmrAccept(module);
  `;
    this.callback(null, source, map);
    return;
}
exports.default = default_1;
