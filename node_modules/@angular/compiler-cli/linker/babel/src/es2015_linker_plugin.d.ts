/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/linker/babel/src/es2015_linker_plugin" />
import { PluginObj } from './babel_core';
import { LinkerPluginOptions } from './linker_plugin_options';
/**
 * Create a Babel plugin that visits the program, identifying and linking partial declarations.
 *
 * The plugin delegates most of its work to a generic `FileLinker` for each file (`t.Program` in
 * Babel) that is visited.
 */
export declare function createEs2015LinkerPlugin({ fileSystem, logger, ...options }: LinkerPluginOptions): PluginObj;
