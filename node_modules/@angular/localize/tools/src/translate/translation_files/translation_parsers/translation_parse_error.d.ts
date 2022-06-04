/// <amd-module name="@angular/localize/tools/src/translate/translation_files/translation_parsers/translation_parse_error" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ParseErrorLevel, ParseSourceSpan } from '@angular/compiler';
/**
 * This error is thrown when there is a problem parsing a translation file.
 */
export declare class TranslationParseError extends Error {
    span: ParseSourceSpan;
    msg: string;
    level: ParseErrorLevel;
    constructor(span: ParseSourceSpan, msg: string, level?: ParseErrorLevel);
}
