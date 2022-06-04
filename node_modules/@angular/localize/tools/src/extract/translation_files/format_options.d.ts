/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/localize/tools/src/extract/translation_files/format_options" />
export declare type FormatOptions = Record<string, string>;
export declare type ValidOption = [key: string, values: string[]];
export declare type ValidOptions = ValidOption[];
/**
 * Check that the given `options` are allowed based on the given `validOptions`.
 * @param name The name of the serializer that is receiving the options.
 * @param validOptions An array of valid options and their allowed values.
 * @param options The options to be validated.
 */
export declare function validateOptions(name: string, validOptions: ValidOptions, options: FormatOptions): void;
/**
 * Parse the given `optionString` into a collection of `FormatOptions`.
 * @param optionString The string to parse.
 */
export declare function parseFormatOptions(optionString?: string): FormatOptions;
