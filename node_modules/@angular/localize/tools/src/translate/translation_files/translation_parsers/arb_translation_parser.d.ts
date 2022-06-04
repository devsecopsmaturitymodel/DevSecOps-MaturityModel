/// <amd-module name="@angular/localize/tools/src/translate/translation_files/translation_parsers/arb_translation_parser" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ɵMessageId, ɵSourceMessage } from '@angular/localize';
import { ParseAnalysis, ParsedTranslationBundle, TranslationParser } from './translation_parser';
export interface ArbJsonObject extends Record<ɵMessageId, ɵSourceMessage | ArbMetadata> {
    '@@locale': string;
}
export interface ArbMetadata {
    type?: 'text' | 'image' | 'css';
    description?: string;
    ['x-locations']?: ArbLocation[];
}
export interface ArbLocation {
    start: {
        line: number;
        column: number;
    };
    end: {
        line: number;
        column: number;
    };
    file: string;
}
/**
 * A translation parser that can parse JSON formatted as an Application Resource Bundle (ARB).
 *
 * See https://github.com/google/app-resource-bundle/wiki/ApplicationResourceBundleSpecification
 *
 * ```
 * {
 *   "@@locale": "en-US",
 *   "message-id": "Target message string",
 *   "@message-id": {
 *     "type": "text",
 *     "description": "Some description text",
 *     "x-locations": [
 *       {
 *         "start": {"line": 23, "column": 145},
 *         "end": {"line": 24, "column": 53},
 *         "file": "some/file.ts"
 *       },
 *       ...
 *     ]
 *   },
 *   ...
 * }
 * ```
 */
export declare class ArbTranslationParser implements TranslationParser<ArbJsonObject> {
    /**
     * @deprecated
     */
    canParse(filePath: string, contents: string): ArbJsonObject | false;
    analyze(_filePath: string, contents: string): ParseAnalysis<ArbJsonObject>;
    parse(_filePath: string, contents: string, arb?: ArbJsonObject): ParsedTranslationBundle;
    private tryParseArbFormat;
}
