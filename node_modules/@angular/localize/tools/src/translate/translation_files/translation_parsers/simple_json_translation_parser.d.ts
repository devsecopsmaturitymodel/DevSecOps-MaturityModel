/// <amd-module name="@angular/localize/tools/src/translate/translation_files/translation_parsers/simple_json_translation_parser" />
import { ParseAnalysis, ParsedTranslationBundle, TranslationParser } from './translation_parser';
interface SimpleJsonFile {
    locale: string;
    translations: {
        [messageId: string]: string;
    };
}
/**
 * A translation parser that can parse JSON that has the form:
 *
 * ```
 * {
 *   "locale": "...",
 *   "translations": {
 *     "message-id": "Target message string",
 *     ...
 *   }
 * }
 * ```
 *
 * @see SimpleJsonTranslationSerializer
 * @publicApi used by CLI
 */
export declare class SimpleJsonTranslationParser implements TranslationParser<SimpleJsonFile> {
    /**
     * @deprecated
     */
    canParse(filePath: string, contents: string): SimpleJsonFile | false;
    analyze(filePath: string, contents: string): ParseAnalysis<SimpleJsonFile>;
    parse(_filePath: string, contents: string, json?: SimpleJsonFile): ParsedTranslationBundle;
}
export {};
