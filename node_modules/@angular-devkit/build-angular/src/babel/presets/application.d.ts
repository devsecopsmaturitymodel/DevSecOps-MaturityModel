/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import type { ɵParsedTranslation } from '@angular/localize/private';
import type { makeEs2015TranslatePlugin, makeEs5TranslatePlugin, makeLocalePlugin } from '@angular/localize/tools';
export declare type DiagnosticReporter = (type: 'error' | 'warning' | 'info', message: string) => void;
/**
 * An interface representing the factory functions for the `@angular/localize` translation Babel plugins.
 * This must be provided for the ESM imports since dynamic imports are required to be asynchronous and
 * Babel presets currently can only be synchronous.
 *
 */
export interface I18nPluginCreators {
    makeEs2015TranslatePlugin: typeof makeEs2015TranslatePlugin;
    makeEs5TranslatePlugin: typeof makeEs5TranslatePlugin;
    makeLocalePlugin: typeof makeLocalePlugin;
}
export interface ApplicationPresetOptions {
    i18n?: {
        locale: string;
        missingTranslationBehavior?: 'error' | 'warning' | 'ignore';
        translation?: Record<string, ɵParsedTranslation>;
        translationFiles?: string[];
        pluginCreators: I18nPluginCreators;
    };
    angularLinker?: {
        shouldLink: boolean;
        jitMode: boolean;
        linkerPluginCreator: typeof import('@angular/compiler-cli/linker/babel').createEs2015LinkerPlugin;
    };
    forceES5?: boolean;
    forceAsyncTransformation?: boolean;
    instrumentCode?: {
        includedBasePath: string;
        inputSourceMap: unknown;
    };
    optimize?: {
        looseEnums: boolean;
        pureTopLevel: boolean;
        wrapDecorators: boolean;
    };
    diagnosticReporter?: DiagnosticReporter;
}
export default function (api: unknown, options: ApplicationPresetOptions): {
    presets: any[][];
    plugins: any[];
};
