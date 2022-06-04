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
 * Migration that updates imports which refer to the primary Angular Material
 * entry-point to use the appropriate secondary entry points (e.g. @angular/material/button).
 */
export declare class SecondaryEntryPointsMigration extends Migration<null> {
    printer: ts.Printer;
    enabled: boolean;
    visitNode(declaration: ts.Node): void;
}
