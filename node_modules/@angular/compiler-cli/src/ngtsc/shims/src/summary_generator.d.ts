/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/shims/src/summary_generator" />
import ts from 'typescript';
import { AbsoluteFsPath } from '../../file_system';
import { PerFileShimGenerator } from '../api';
export declare class SummaryGenerator implements PerFileShimGenerator {
    readonly shouldEmit = true;
    readonly extensionPrefix = "ngsummary";
    generateShimForFile(sf: ts.SourceFile, genFilePath: AbsoluteFsPath): ts.SourceFile;
}
