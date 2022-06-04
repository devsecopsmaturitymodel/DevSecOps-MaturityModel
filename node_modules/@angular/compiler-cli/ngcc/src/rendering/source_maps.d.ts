/// <amd-module name="@angular/compiler-cli/ngcc/src/rendering/source_maps" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import mapHelpers from 'convert-source-map';
import MagicString from 'magic-string';
import ts from 'typescript';
import { ReadonlyFileSystem } from '../../../src/ngtsc/file_system';
import { Logger } from '../../../src/ngtsc/logging';
import { FileToWrite } from './utils';
export interface SourceMapInfo {
    source: string;
    map: mapHelpers.SourceMapConverter | null;
    isInline: boolean;
}
/**
 * Merge the input and output source-maps, replacing the source-map comment in the output file
 * with an appropriate source-map comment pointing to the merged source-map.
 */
export declare function renderSourceAndMap(logger: Logger, fs: ReadonlyFileSystem, sourceFile: ts.SourceFile, generatedMagicString: MagicString): FileToWrite[];
