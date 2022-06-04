/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/localize/tools/src/extract/translation_files/icu_parsing" />
/**
 * Split the given `text` into an array of "static strings" and ICU "placeholder names".
 *
 * This is required because ICU expressions in `$localize` tagged messages may contain "dynamic"
 * piece (e.g. interpolations or element markers). These markers need to be translated to
 * placeholders in extracted translation files. So we must parse ICUs to identify them and separate
 * them out so that the translation serializers can render them appropriately.
 *
 * An example of an ICU with interpolations:
 *
 * ```
 * {VAR_PLURAL, plural, one {{INTERPOLATION}} other {{INTERPOLATION_1} post}}
 * ```
 *
 * In this ICU, `INTERPOLATION` and `INTERPOLATION_1` are actually placeholders that will be
 * replaced with dynamic content at runtime.
 *
 * Such placeholders are identifiable as text wrapped in curly braces, within an ICU case
 * expression.
 *
 * To complicate matters, it is possible for ICUs to be nested indefinitely within each other. In
 * such cases, the nested ICU expression appears enclosed in a set of curly braces in the same way
 * as a placeholder. The nested ICU expressions can be differentiated from placeholders as they
 * contain a comma `,`, which separates the ICU value from the ICU type.
 *
 * Furthermore, nested ICUs can have placeholders of their own, which need to be extracted.
 *
 * An example of a nested ICU containing its own placeholders:
 *
 * ```
 * {VAR_SELECT_1, select,
 *   invoice {Invoice for {INTERPOLATION}}
 *   payment {{VAR_SELECT, select,
 *     processor {Payment gateway}
 *     other {{INTERPOLATION_1}}
 *   }}
 * ```
 *
 * @param text Text to be broken.
 * @returns an array of strings, where
 *  - even values are static strings (e.g. 0, 2, 4, etc)
 *  - odd values are placeholder names (e.g. 1, 3, 5, etc)
 */
export declare function extractIcuPlaceholders(text: string): string[];
