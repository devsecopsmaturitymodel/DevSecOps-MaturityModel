/// <amd-module name="@angular/localize/tools/src/translate/source_files/es5_translate_plugin" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { PathManipulation } from '@angular/compiler-cli/private/localize';
import { ɵParsedTranslation } from '@angular/localize';
import { PluginObj } from '../../babel_core';
import { Diagnostics } from '../../diagnostics';
import { TranslatePluginOptions } from '../../source_file_utils';
/**
 * Create a Babel plugin that can be used to do compile-time translation of `$localize` tagged
 * messages.
 *
 * @publicApi used by CLI
 */
export declare function makeEs5TranslatePlugin(diagnostics: Diagnostics, translations: Record<string, ɵParsedTranslation>, { missingTranslation, localizeName }?: TranslatePluginOptions, fs?: PathManipulation): PluginObj;
