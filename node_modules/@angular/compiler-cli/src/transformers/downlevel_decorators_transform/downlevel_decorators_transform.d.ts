/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/transformers/downlevel_decorators_transform/downlevel_decorators_transform" />
import ts from 'typescript';
import { ReflectionHost } from '../../ngtsc/reflection';
/**
 * Gets a transformer for downleveling Angular decorators.
 * @param typeChecker Reference to the program's type checker.
 * @param host Reflection host that is used for determining decorators.
 * @param diagnostics List which will be populated with diagnostics if any.
 * @param isCore Whether the current TypeScript program is for the `@angular/core` package.
 * @param isClosureCompilerEnabled Whether closure annotations need to be added where needed.
 * @param skipClassDecorators Whether class decorators should be skipped from downleveling.
 *   This is useful for JIT mode where class decorators should be preserved as they could rely
 *   on immediate execution. e.g. downleveling `@Injectable` means that the injectable factory
 *   is not created, and injecting the token will not work. If this decorator would not be
 *   downleveled, the `Injectable` decorator will execute immediately on file load, and
 *   Angular will generate the corresponding injectable factory.
 */
export declare function getDownlevelDecoratorsTransform(typeChecker: ts.TypeChecker, host: ReflectionHost, diagnostics: ts.Diagnostic[], isCore: boolean, isClosureCompilerEnabled: boolean, skipClassDecorators: boolean): ts.TransformerFactory<ts.SourceFile>;
