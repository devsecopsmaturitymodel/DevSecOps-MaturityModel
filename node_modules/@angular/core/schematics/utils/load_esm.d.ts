/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/core/schematics/utils/load_esm" />
/// <reference types="node" />
import { URL } from 'url';
/**
 * This uses a dynamic import to load a module which may be ESM.
 * CommonJS code can load ESM code via a dynamic import. Unfortunately, TypeScript
 * will currently, unconditionally downlevel dynamic import into a require call.
 * require calls cannot load ESM code and will result in a runtime error. To workaround
 * this, a Function constructor is used to prevent TypeScript from changing the dynamic import.
 * Once TypeScript provides support for keeping the dynamic import this workaround can
 * be dropped.
 * This is only intended to be used with Angular framework packages.
 *
 * @param modulePath The path of the module to load.
 * @returns A Promise that resolves to the dynamically imported module.
 */
export declare function loadEsmModule<T>(modulePath: string | URL): Promise<T>;
/**
 * Attempt to load the new `@angular/compiler-cli/private/migrations` entry. If not yet present
 * the previous deep imports are used to constructor an equivalent object.
 *
 * @returns A Promise that resolves to the dynamically imported compiler-cli private migrations
 * entry or an equivalent object if not available.
 */
export declare function loadCompilerCliMigrationsModule(): Promise<typeof import('@angular/compiler-cli/private/migrations')>;
