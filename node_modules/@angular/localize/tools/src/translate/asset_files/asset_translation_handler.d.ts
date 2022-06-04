/// <amd-module name="@angular/localize/tools/src/translate/asset_files/asset_translation_handler" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AbsoluteFsPath, FileSystem, PathSegment } from '@angular/compiler-cli/private/localize';
import { Diagnostics } from '../../diagnostics';
import { OutputPathFn } from '../output_path';
import { TranslationBundle, TranslationHandler } from '../translator';
/**
 * Translate an asset file by simply copying it to the appropriate translation output paths.
 */
export declare class AssetTranslationHandler implements TranslationHandler {
    private fs;
    constructor(fs: FileSystem);
    canTranslate(_relativeFilePath: PathSegment | AbsoluteFsPath, _contents: Uint8Array): boolean;
    translate(diagnostics: Diagnostics, _sourceRoot: AbsoluteFsPath, relativeFilePath: PathSegment | AbsoluteFsPath, contents: Uint8Array, outputPathFn: OutputPathFn, translations: TranslationBundle[], sourceLocale?: string): void;
    private writeAssetFile;
}
