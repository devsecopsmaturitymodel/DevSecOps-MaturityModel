/// <amd-module name="@angular/localize/tools/src/extract/duplicates" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AbsoluteFsPath, PathManipulation } from '@angular/compiler-cli/private/localize';
import { ɵParsedMessage } from '@angular/localize';
import { DiagnosticHandlingStrategy, Diagnostics } from '../diagnostics';
/**
 * Check each of the given `messages` to find those that have the same id but different message
 * text. Add diagnostics messages for each of these duplicate messages to the given `diagnostics`
 * object (as necessary).
 */
export declare function checkDuplicateMessages(fs: PathManipulation, messages: ɵParsedMessage[], duplicateMessageHandling: DiagnosticHandlingStrategy, basePath: AbsoluteFsPath): Diagnostics;
