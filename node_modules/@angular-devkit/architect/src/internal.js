"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuilderVersionSymbol = exports.BuilderSymbol = void 0;
// Internal types that should not be exported directly. These are used by the host and architect
// itself. Host implementations should import the host.ts file.
/**
 * BuilderSymbol used for knowing if a function was created using createBuilder(). This is a
 * property set on the function that should be `true`.
 * Using Symbol.for() as it's a global registry that's the same for all installations of
 * Architect (if some libraries depends directly on architect instead of sharing the files).
 */
exports.BuilderSymbol = Symbol.for('@angular-devkit/architect:builder');
/**
 * BuilderVersionSymbol used for knowing which version of the library createBuilder() came from.
 * This is to make sure we don't try to use an incompatible builder.
 * Using Symbol.for() as it's a global registry that's the same for all installations of
 * Architect (if some libraries depends directly on architect instead of sharing the files).
 */
exports.BuilderVersionSymbol = Symbol.for('@angular-devkit/architect:version');
