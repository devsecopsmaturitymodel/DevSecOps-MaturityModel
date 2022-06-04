/// <amd-module name="@angular/localize/tools/src/translate/source_files/source_file_translation_handler" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AbsoluteFsPath, FileSystem, PathSegment } from '@angular/compiler-cli/private/localize';
import { Diagnostics } from '../../diagnostics';
import { TranslatePluginOptions } from '../../source_file_utils';
import { OutputPathFn } from '../output_path';
import { TranslationBundle, TranslationHandler } from '../translator';
/**
 * Translate a file by inlining all messages tagged by `$localize` with the appropriate translated
 * message.
 */
export declare class SourceFileTranslationHandler implements TranslationHandler {
    private fs;
    private translationOptions;
    private sourceLocaleOptions;
    constructor(fs: FileSystem, translationOptions?: TranslatePluginOptions);
    canTranslate(relativeFilePath: PathSegment | AbsoluteFsPath, _contents: Uint8Array): boolean;
    translate(diagnostics: Diagnostics, sourceRoot: AbsoluteFsPath, relativeFilePath: PathSegment, contents: Uint8Array, outputPathFn: OutputPathFn, translations: TranslationBundle[], sourceLocale?: string): void;
    private translateFile;
    private writeSourceFile;
}
