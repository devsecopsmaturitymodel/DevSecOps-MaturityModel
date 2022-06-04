/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/translator/src/typescript_translator" />
import * as o from '@angular/compiler';
import ts from 'typescript';
import { ImportGenerator } from './api/import_generator';
import { TranslatorOptions } from './translator';
export declare function translateExpression(expression: o.Expression, imports: ImportGenerator<ts.Expression>, options?: TranslatorOptions<ts.Expression>): ts.Expression;
export declare function translateStatement(statement: o.Statement, imports: ImportGenerator<ts.Expression>, options?: TranslatorOptions<ts.Expression>): ts.Statement;
