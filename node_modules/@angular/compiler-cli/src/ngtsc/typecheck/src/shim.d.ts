/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/typecheck/src/shim" />
import ts from 'typescript';
import { AbsoluteFsPath } from '../../file_system';
import { PerFileShimGenerator } from '../../shims/api';
/**
 * A `ShimGenerator` which adds type-checking files to the `ts.Program`.
 *
 * This is a requirement for performant template type-checking, as TypeScript will only reuse
 * information in the main program when creating the type-checking program if the set of files in
 * each are exactly the same. Thus, the main program also needs the synthetic type-checking files.
 */
export declare class TypeCheckShimGenerator implements PerFileShimGenerator {
    readonly extensionPrefix = "ngtypecheck";
    readonly shouldEmit = false;
    generateShimForFile(sf: ts.SourceFile, genFilePath: AbsoluteFsPath, priorShimSf: ts.SourceFile | null): ts.SourceFile;
    static shimFor(fileName: AbsoluteFsPath): AbsoluteFsPath;
}
