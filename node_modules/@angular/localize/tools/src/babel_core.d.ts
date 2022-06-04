/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/localize/tools/src/babel_core" />
/**
 * This is an interop file allowing for `@babel/core` to be imported in both CommonJS or
 * ES module files. The `@babel/core` package needs some special treatment because:
 *
 * Using a default import does not with CommonJS because the `@babel/core` package does not
 * expose a `default` export at runtime (because it sets the `_esModule` property that causes
 * TS to not create the necessary interop `default` export). On the other side, when loaded
 * as part of an ESM, NodeJS will make all of the exports available as default export.
 *
 * Using named import bindings (i.e. namespace import or actual named bindings) is not
 * working well for ESM because as said before, NodeJS will make all of the exports available
 * as the `default` export. Hence ESM that imports CJS, always should use the default import.
 *
 * There is no solution that would work for both CJS and ESM, so we need to use a custom interop
 * that switches between the named exports or the default exports depending on what is available.
 * This allows the code to run in both ESM (for production) and CJS (for development).
 *
 * TODO(devversion): remove this once devmode uses ESM as well.
 */
import * as _babelNamespace from '@babel/core';
import _typesNamespace = _babelNamespace.types;
export import types = _typesNamespace;
export declare type PluginObj = _babelNamespace.PluginObj;
export declare type ConfigAPI = _babelNamespace.ConfigAPI;
export declare type NodePath<T = _babelNamespace.Node> = _babelNamespace.NodePath<T>;
export declare type TransformOptions = _babelNamespace.TransformOptions;
export declare const NodePath: typeof _babelNamespace.NodePath;
export declare const transformSync: typeof _babelNamespace.transformSync;
export declare const parseSync: typeof _babelNamespace.parseSync;
export declare const transformFromAstSync: typeof _babelNamespace.transformFromAstSync;
