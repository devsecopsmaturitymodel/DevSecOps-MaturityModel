/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { UpdateRecorder } from '@angular-devkit/schematics';
import { parse5 } from '@angular/cdk/schematics';
/**
 * Removes the specified element. Additionally, preceding whitespace will be removed
 * to not leave empty lines in the resulting HTML.
 */
export declare function removeElementFromHtml(element: parse5.Element, recorder: UpdateRecorder): void;
