/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Addition mixin and function names that can be updated when invoking migration directly. */
interface ExtraSymbols {
    mixins?: Record<string, string>;
    functions?: Record<string, string>;
    variables?: Record<string, string>;
}
/**
 * Migrates the content of a file to the new theming API. Note that this migration is using plain
 * string manipulation, rather than the AST from PostCSS and the schematics string manipulation
 * APIs, because it allows us to run it inside g3 and to avoid introducing new dependencies.
 * @param fileContent Content of the file.
 * @param oldMaterialPrefix Prefix with which the old Material imports should start.
 *   Has to end with a slash. E.g. if `@import '@angular/material/theming'` should be
 *   matched, the prefix would be `@angular/material/`.
 * @param oldCdkPrefix Prefix with which the old CDK imports should start.
 *   Has to end with a slash. E.g. if `@import '@angular/cdk/overlay'` should be
 *   matched, the prefix would be `@angular/cdk/`.
 * @param newMaterialImportPath New import to the Material theming API (e.g. `@angular/material`).
 * @param newCdkImportPath New import to the CDK Sass APIs (e.g. `@angular/cdk`).
 * @param excludedImports Pattern that can be used to exclude imports from being processed.
 */
export declare function migrateFileContent(fileContent: string, oldMaterialPrefix: string, oldCdkPrefix: string, newMaterialImportPath: string, newCdkImportPath: string, extraMaterialSymbols?: ExtraSymbols, excludedImports?: RegExp): string;
export {};
