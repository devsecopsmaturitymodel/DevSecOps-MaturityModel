"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeWorkspace = exports.readWorkspace = exports.WorkspaceFormat = exports.createWorkspaceHost = void 0;
__exportStar(require("./definitions"), exports);
var host_1 = require("./host");
Object.defineProperty(exports, "createWorkspaceHost", { enumerable: true, get: function () { return host_1.createWorkspaceHost; } });
var core_1 = require("./core");
Object.defineProperty(exports, "WorkspaceFormat", { enumerable: true, get: function () { return core_1.WorkspaceFormat; } });
Object.defineProperty(exports, "readWorkspace", { enumerable: true, get: function () { return core_1.readWorkspace; } });
Object.defineProperty(exports, "writeWorkspace", { enumerable: true, get: function () { return core_1.writeWorkspace; } });
