/// <amd-module name="@angular/localize/tools/src/translate/index" />
import { DiagnosticHandlingStrategy, Diagnostics } from '../diagnostics';
import { OutputPathFn } from './output_path';
export interface TranslateFilesOptions {
    /**
     * The root path of the files to translate, either absolute or relative to the current working
     * directory. E.g. `dist/en`
     */
    sourceRootPath: string;
    /**
     * The files to translate, relative to the `root` path.
     */
    sourceFilePaths: string[];
    /**
     * An array of paths to the translation files to load, either absolute or relative to the current
     * working directory.
     *
     * For each locale to be translated, there should be an element in `translationFilePaths`.
     * Each element is either an absolute path to the translation file, or an array of absolute paths
     * to translation files, for that locale.
     *
     * If the element contains more than one translation file, then the translations are merged.
     *
     * If allowed by the `duplicateTranslation` property, when more than one translation has the same
     * message id, the message from the earlier translation file in the array is used.
     *
     * For example, if the files are `[app.xlf, lib-1.xlf, lib-2.xlif]` then a message that appears in
     * `app.xlf` will override the same message in `lib-1.xlf` or `lib-2.xlf`.
     */
    translationFilePaths: (string | string[])[];
    /**
     * A collection of the target locales for the translation files.
     *
     * If there is a locale provided in `translationFileLocales` then this is used rather than a
     * locale extracted from the file itself.
     * If there is neither a provided locale nor a locale parsed from the file, then an error is
     * thrown.
     * If there are both a provided locale and a locale parsed from the file, and they are not the
     * same, then a warning is reported.
     */
    translationFileLocales: (string | undefined)[];
    /**
     * A function that computes the output path of where the translated files will be
     * written. The marker `{{LOCALE}}` will be replaced with the target locale. E.g.
     * `dist/{{LOCALE}}`.
     */
    outputPathFn: OutputPathFn;
    /**
     * An object that will receive any diagnostics messages due to the processing.
     */
    diagnostics: Diagnostics;
    /**
     * How to handle missing translations.
     */
    missingTranslation: DiagnosticHandlingStrategy;
    /**
     * How to handle duplicate translations.
     */
    duplicateTranslation: DiagnosticHandlingStrategy;
    /**
     * The locale of the source files.
     * If this is provided then a copy of the application will be created with no translation but just
     * the `$localize` calls stripped out.
     */
    sourceLocale?: string;
}
export declare function translateFiles({ sourceRootPath, sourceFilePaths, translationFilePaths, translationFileLocales, outputPathFn, diagnostics, missingTranslation, duplicateTranslation, sourceLocale }: TranslateFilesOptions): void;
