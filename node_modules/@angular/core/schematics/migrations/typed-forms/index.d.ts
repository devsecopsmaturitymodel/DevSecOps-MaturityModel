/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/core/schematics/migrations/typed-forms" />
import { Rule, UpdateRecorder } from '@angular-devkit/schematics';
import ts from 'typescript';
import { MigratableNode } from './util';
export default function (): Rule;
export declare function migrateNode(update: UpdateRecorder, node: MigratableNode, importd: ts.ImportSpecifier | null): void;
export declare function insertAnyImport(update: UpdateRecorder, importd: ts.ImportSpecifier): void;
