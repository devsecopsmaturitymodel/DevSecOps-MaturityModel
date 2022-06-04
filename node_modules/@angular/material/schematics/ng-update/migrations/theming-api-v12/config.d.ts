/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Mapping of Material mixins that should be renamed. */
export declare const materialMixins: Record<string, string>;
/** Mapping of Material functions that should be renamed. */
export declare const materialFunctions: Record<string, string>;
/** Mapping of Material variables that should be renamed. */
export declare const materialVariables: Record<string, string>;
/** Mapping of CDK variables that should be renamed. */
export declare const cdkVariables: Record<string, string>;
/** Mapping of CDK mixins that should be renamed. */
export declare const cdkMixins: Record<string, string>;
/**
 * Material variables that have been removed from the public API
 * and which should be replaced with their values.
 */
export declare const removedMaterialVariables: Record<string, string>;
/**
 * Material variables **without a `mat-` prefix** that have been removed from the public API
 * and which should be replaced with their values. These should be migrated only when there's a
 * Material import, because their names could conflict with other variables in the user's app.
 */
export declare const unprefixedRemovedVariables: Record<string, string>;
