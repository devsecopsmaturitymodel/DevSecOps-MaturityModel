/// <amd-module name="@angular/localize/tools/src/translate/translation_files/translation_parsers/xliff2_translation_parser" />
import { ParseAnalysis, ParsedTranslationBundle, TranslationParser } from './translation_parser';
import { XmlTranslationParserHint } from './translation_utils';
/**
 * A translation parser that can load translations from XLIFF 2 files.
 *
 * https://docs.oasis-open.org/xliff/xliff-core/v2.0/os/xliff-core-v2.0-os.html
 *
 * @see Xliff2TranslationSerializer
 * @publicApi used by CLI
 */
export declare class Xliff2TranslationParser implements TranslationParser<XmlTranslationParserHint> {
    /**
     * @deprecated
     */
    canParse(filePath: string, contents: string): XmlTranslationParserHint | false;
    analyze(filePath: string, contents: string): ParseAnalysis<XmlTranslationParserHint>;
    parse(filePath: string, contents: string, hint?: XmlTranslationParserHint): ParsedTranslationBundle;
    private extractBundle;
    private extractBundleDeprecated;
}
