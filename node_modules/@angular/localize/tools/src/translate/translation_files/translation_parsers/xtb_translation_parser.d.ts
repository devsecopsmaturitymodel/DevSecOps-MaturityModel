/// <amd-module name="@angular/localize/tools/src/translate/translation_files/translation_parsers/xtb_translation_parser" />
import { ParseAnalysis, ParsedTranslationBundle, TranslationParser } from './translation_parser';
import { XmlTranslationParserHint } from './translation_utils';
/**
 * A translation parser that can load XTB files.
 *
 * http://cldr.unicode.org/development/development-process/design-proposals/xmb
 *
 * @see XmbTranslationSerializer
 * @publicApi used by CLI
 */
export declare class XtbTranslationParser implements TranslationParser<XmlTranslationParserHint> {
    /**
     * @deprecated
     */
    canParse(filePath: string, contents: string): XmlTranslationParserHint | false;
    analyze(filePath: string, contents: string): ParseAnalysis<XmlTranslationParserHint>;
    parse(filePath: string, contents: string, hint?: XmlTranslationParserHint): ParsedTranslationBundle;
    private extractBundle;
    private extractBundleDeprecated;
}
