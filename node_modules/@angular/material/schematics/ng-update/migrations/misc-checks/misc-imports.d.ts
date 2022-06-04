/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Migration } from '@angular/cdk/schematics';
import * as ts from 'typescript';
/**
 * Migration that detects import declarations that refer to outdated identifiers from
 * Angular Material which cannot be updated automatically.
 */
export declare class MiscImportsMigration extends Migration<null> {
    enabled: boolean;
    visitNode(node: ts.Node): void;
    private _visitImportDeclaration;
    /**
     * Checks for named imports that refer to the deleted animation constants.
     * https://github.com/angular/components/commit/9f3bf274c4f15f0b0fbd8ab7dbf1a453076e66d9
     */
    private _checkAnimationConstants;
}
