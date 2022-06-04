/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { Observable } from 'rxjs';
import webpack from 'webpack';
import { EmittedFiles } from '../utils';
import { Schema as RealWebpackBuilderSchema } from './schema';
export declare type WebpackBuilderSchema = RealWebpackBuilderSchema;
export interface WebpackLoggingCallback {
    (stats: webpack.Stats, config: webpack.Configuration): void;
}
export interface WebpackFactory {
    (config: webpack.Configuration): Observable<webpack.Compiler> | webpack.Compiler;
}
export declare type BuildResult = BuilderOutput & {
    emittedFiles?: EmittedFiles[];
    webpackStats?: webpack.StatsCompilation;
    outputPath: string;
};
export declare function runWebpack(config: webpack.Configuration, context: BuilderContext, options?: {
    logging?: WebpackLoggingCallback;
    webpackFactory?: WebpackFactory;
    shouldProvideStats?: boolean;
}): Observable<BuildResult>;
declare const _default: import("@angular-devkit/architect/src/internal").Builder<RealWebpackBuilderSchema & import("../../../core/src").JsonObject>;
export default _default;
