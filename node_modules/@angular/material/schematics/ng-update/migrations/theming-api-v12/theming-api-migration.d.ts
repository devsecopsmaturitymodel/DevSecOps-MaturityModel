/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { SchematicContext } from '@angular-devkit/schematics';
import { DevkitMigration, ResolvedResource, TargetVersion } from '@angular/cdk/schematics';
/** Migration that switches all Sass files using Material theming APIs to `@use`. */
export declare class ThemingApiMigration extends DevkitMigration<null> {
    /** Number of files that have been migrated. */
    static migratedFileCount: number;
    enabled: boolean;
    visitStylesheet(stylesheet: ResolvedResource): void;
    /** Logs out the number of migrated files at the end of the migration. */
    static globalPostMigration(_tree: unknown, _targetVersion: TargetVersion, context: SchematicContext): void;
}
