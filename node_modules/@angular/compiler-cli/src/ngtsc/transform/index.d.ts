/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/transform" />
export * from './src/api';
export { aliasTransformFactory } from './src/alias';
export { ClassRecord, TraitCompiler } from './src/compilation';
export { declarationTransformFactory, DtsTransformRegistry, IvyDeclarationDtsTransform } from './src/declaration';
export { AnalyzedTrait, PendingTrait, ResolvedTrait, SkippedTrait, Trait, TraitState } from './src/trait';
export { ivyTransformFactory } from './src/transform';
