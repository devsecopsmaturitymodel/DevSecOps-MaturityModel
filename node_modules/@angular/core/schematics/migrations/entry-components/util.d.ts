/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/core/schematics/migrations/entry-components/util" />
import ts from 'typescript';
/** Finds and migrates all Angular decorators that pass in `entryComponents`. */
export declare function migrateEntryComponentsUsages(typeChecker: ts.TypeChecker, printer: ts.Printer, sourceFile: ts.SourceFile): {
    start: number;
    length: number;
    end: number;
    replacement: string;
}[];
