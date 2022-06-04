/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/localize/tools/src/migrate/index" />
import { Logger } from '@angular/compiler-cli/private/localize';
export interface MigrateFilesOptions {
    /**
     * The base path for other paths provided in these options.
     * This should either be absolute or relative to the current working directory.
     */
    rootPath: string;
    /** Paths to the files that should be migrated. Should be relative to the `rootPath`. */
    translationFilePaths: string[];
    /** Path to the file containing the message ID mappings. Should be relative to the `rootPath`. */
    mappingFilePath: string;
    /** Logger to use for diagnostic messages. */
    logger: Logger;
}
/** Migrates the legacy message IDs based on the passed in configuration. */
export declare function migrateFiles({ rootPath, translationFilePaths, mappingFilePath, logger, }: MigrateFilesOptions): void;
