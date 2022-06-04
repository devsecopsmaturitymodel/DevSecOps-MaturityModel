/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/localize/tools/src/migrate/migrate" />
/** Mapping between legacy message IDs and their cannonical counterparts. */
export declare type MigrationMapping = {
    [legacyId: string]: string;
};
/** Migrates the legacy message IDs within a single file. */
export declare function migrateFile(sourceCode: string, mapping: MigrationMapping): string;
