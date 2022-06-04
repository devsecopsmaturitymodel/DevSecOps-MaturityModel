/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import type { ObjectPattern } from 'copy-webpack-plugin';
import { ScriptTarget } from 'typescript';
import type { Configuration, WebpackOptionsNormalized } from 'webpack';
import { AssetPatternClass, ExtraEntryPoint, ExtraEntryPointClass, OutputHashing } from '../../builders/browser/schema';
import { WebpackConfigOptions } from '../../utils/build-options';
export interface HashFormat {
    chunk: string;
    extract: string;
    file: string;
    script: string;
}
export declare function getOutputHashFormat(outputHashing?: OutputHashing, length?: number): HashFormat;
export declare type NormalizedEntryPoint = Required<ExtraEntryPointClass>;
export declare function normalizeExtraEntryPoints(extraEntryPoints: ExtraEntryPoint[], defaultBundleName: string): NormalizedEntryPoint[];
export declare function assetNameTemplateFactory(hashFormat: HashFormat): (resourcePath: string) => string;
export declare function getInstrumentationExcludedPaths(sourceRoot: string, excludedPaths: string[]): Set<string>;
export declare function getCacheSettings(wco: WebpackConfigOptions, angularVersion: string): WebpackOptionsNormalized['cache'];
export declare function globalScriptsByBundleName(root: string, scripts: ExtraEntryPoint[]): {
    bundleName: string;
    inject: boolean;
    paths: string[];
}[];
export declare function assetPatterns(root: string, assets: AssetPatternClass[]): ObjectPattern[];
export declare function externalizePackages(context: string, request: string | undefined, callback: (error?: Error, result?: string) => void): void;
declare type WebpackStatsOptions = Exclude<Configuration['stats'], string | boolean>;
export declare function getStatsOptions(verbose?: boolean): WebpackStatsOptions;
export declare function getMainFieldsAndConditionNames(target: ScriptTarget, platformServer: boolean): Pick<WebpackOptionsNormalized['resolve'], 'mainFields' | 'conditionNames'>;
export {};
