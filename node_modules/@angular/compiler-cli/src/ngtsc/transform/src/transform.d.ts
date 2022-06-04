/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/transform/src/transform" />
import ts from 'typescript';
import { DefaultImportTracker, ImportRewriter } from '../../imports';
import { PerfRecorder } from '../../perf';
import { ReflectionHost } from '../../reflection';
import { TraitCompiler } from './compilation';
export declare function ivyTransformFactory(compilation: TraitCompiler, reflector: ReflectionHost, importRewriter: ImportRewriter, defaultImportTracker: DefaultImportTracker, perf: PerfRecorder, isCore: boolean, isClosureCompilerEnabled: boolean): ts.TransformerFactory<ts.SourceFile>;
