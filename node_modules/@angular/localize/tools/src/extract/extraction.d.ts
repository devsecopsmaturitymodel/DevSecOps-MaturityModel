/// <amd-module name="@angular/localize/tools/src/extract/extraction" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AbsoluteFsPath, Logger, ReadonlyFileSystem } from '@angular/compiler-cli/private/localize';
import { ɵParsedMessage } from '@angular/localize';
export interface ExtractionOptions {
    basePath: AbsoluteFsPath;
    useSourceMaps?: boolean;
    localizeName?: string;
}
/**
 * Extracts parsed messages from file contents, by parsing the contents as JavaScript
 * and looking for occurrences of `$localize` in the source code.
 *
 * @publicApi used by CLI
 */
export declare class MessageExtractor {
    private fs;
    private logger;
    private basePath;
    private useSourceMaps;
    private localizeName;
    private loader;
    constructor(fs: ReadonlyFileSystem, logger: Logger, { basePath, useSourceMaps, localizeName }: ExtractionOptions);
    extractMessages(filename: string): ɵParsedMessage[];
    /**
     * Update the location of each message to point to the source-mapped original source location, if
     * available.
     */
    private updateSourceLocations;
    /**
     * Find the original location using source-maps if available.
     *
     * @param sourceFile The generated `sourceFile` that contains the `location`.
     * @param location The location within the generated `sourceFile` that needs mapping.
     *
     * @returns A new location that refers to the original source location mapped from the given
     *     `location` in the generated `sourceFile`.
     */
    private getOriginalLocation;
}
