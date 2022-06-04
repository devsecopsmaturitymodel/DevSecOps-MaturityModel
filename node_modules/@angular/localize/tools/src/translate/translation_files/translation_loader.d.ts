/// <amd-module name="@angular/localize/tools/src/translate/translation_files/translation_loader" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AbsoluteFsPath, ReadonlyFileSystem } from '@angular/compiler-cli/private/localize';
import { DiagnosticHandlingStrategy, Diagnostics } from '../../diagnostics';
import { TranslationBundle } from '../translator';
import { TranslationParser } from './translation_parsers/translation_parser';
/**
 * Use this class to load a collection of translation files from disk.
 */
export declare class TranslationLoader {
    private fs;
    private translationParsers;
    private duplicateTranslation;
    /** @deprecated */ private diagnostics?;
    constructor(fs: ReadonlyFileSystem, translationParsers: TranslationParser<any>[], duplicateTranslation: DiagnosticHandlingStrategy, 
    /** @deprecated */ diagnostics?: Diagnostics | undefined);
    /**
     * Load and parse the translation files into a collection of `TranslationBundles`.
     *
     * @param translationFilePaths An array, per locale, of absolute paths to translation files.
     *
     * For each locale to be translated, there is an element in `translationFilePaths`. Each element
     * is an array of absolute paths to translation files for that locale.
     * If the array contains more than one translation file, then the translations are merged.
     * If allowed by the `duplicateTranslation` property, when more than one translation has the same
     * message id, the message from the earlier translation file in the array is used.
     * For example, if the files are `[app.xlf, lib-1.xlf, lib-2.xlif]` then a message that appears in
     * `app.xlf` will override the same message in `lib-1.xlf` or `lib-2.xlf`.
     *
     * @param translationFileLocales An array of locales for each of the translation files.
     *
     * If there is a locale provided in `translationFileLocales` then this is used rather than a
     * locale extracted from the file itself.
     * If there is neither a provided locale nor a locale parsed from the file, then an error is
     * thrown.
     * If there are both a provided locale and a locale parsed from the file, and they are not the
     * same, then a warning is reported.
     */
    loadBundles(translationFilePaths: AbsoluteFsPath[][], translationFileLocales: (string | undefined)[]): TranslationBundle[];
    /**
     * Load all the translations from the file at the given `filePath`.
     */
    private loadBundle;
    /**
     * There is more than one `filePath` for this locale, so load each as a bundle and then merge
     * them all together.
     */
    private mergeBundles;
}
