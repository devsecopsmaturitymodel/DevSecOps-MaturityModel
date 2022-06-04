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
 * Migration that walks through every property access expression and and reports a failure if
 * a given property name no longer exists but cannot be automatically migrated.
 */
export declare class MiscPropertyNamesMigration extends Migration<null> {
    enabled: boolean;
    visitNode(node: ts.Node): void;
    private _visitPropertyAccessExpression;
}
