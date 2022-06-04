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
 * Migration that looks for class name identifiers that have been removed but
 * cannot be automatically migrated.
 */
export declare class MiscClassNamesMigration extends Migration<null> {
    enabled: boolean;
    visitNode(node: ts.Node): void;
    private _visitIdentifier;
}
