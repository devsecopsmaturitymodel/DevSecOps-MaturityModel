/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Migration, ResolvedResource } from '@angular/cdk/schematics';
import * as ts from 'typescript';
/**
 * Migration that walks through every property assignment and switches the global `baseSpeedFactor`
 * ripple option to the new global animation config. Also updates every class member assignment
 * that refers to MatRipple#speedFactor.
 */
export declare class RippleSpeedFactorMigration extends Migration<null> {
    enabled: boolean;
    visitNode(node: ts.Node): void;
    visitTemplate(template: ResolvedResource): void;
    /** Switches binary expressions (e.g. myRipple.speedFactor = 0.5) to the new animation config. */
    private _visitBinaryExpression;
    /**
     * Switches the global option `baseSpeedFactor` to the new animation config. For this
     * we assume that the `baseSpeedFactor` is not used in combination with individual
     * speed factors.
     */
    private _visitPropertyAssignment;
    private _replaceText;
}
