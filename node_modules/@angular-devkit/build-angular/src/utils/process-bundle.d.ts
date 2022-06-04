/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export declare function createI18nPlugins(locale: string, translation: unknown | undefined, missingTranslation: 'error' | 'warning' | 'ignore', shouldInline: boolean, localeDataContent?: string): Promise<{
    diagnostics: import("@angular/localize/tools").Diagnostics;
    plugins: import("@angular/localize/tools/src/babel_core").PluginObj[];
}>;
export interface InlineOptions {
    filename: string;
    code: string;
    map?: string;
    es5: boolean;
    outputPath: string;
    missingTranslation?: 'warning' | 'error' | 'ignore';
    setLocale?: boolean;
}
export declare function inlineLocales(options: InlineOptions): Promise<{
    file: string;
    diagnostics: {
        type: "error" | "warning";
        message: string;
    }[];
    count: number;
} | {
    file: string;
    diagnostics: {
        type: "error" | "warning";
        message: string;
    }[];
}>;
