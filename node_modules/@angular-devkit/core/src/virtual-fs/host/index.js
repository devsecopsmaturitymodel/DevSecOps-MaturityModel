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
__exportStar(require("./alias"), exports);
__exportStar(require("./buffer"), exports);
__exportStar(require("./create"), exports);
__exportStar(require("./empty"), exports);
__exportStar(require("./interface"), exports);
__exportStar(require("./memory"), exports);
__exportStar(require("./pattern"), exports);
__exportStar(require("./record"), exports);
__exportStar(require("./safe"), exports);
__exportStar(require("./scoped"), exports);
__exportStar(require("./sync"), exports);
__exportStar(require("./resolver"), exports);
__exportStar(require("./test"), exports);
