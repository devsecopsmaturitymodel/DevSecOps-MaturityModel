/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BuilderContext } from '@angular-devkit/architect';
import { Observable } from 'rxjs';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { BuildResult, WebpackFactory, WebpackLoggingCallback } from '../webpack';
import { Schema as WebpackDevServerBuilderSchema } from './schema';
export declare type WebpackDevServerFactory = typeof WebpackDevServer;
export declare type DevServerBuildOutput = BuildResult & {
    port: number;
    family: string;
    address: string;
};
export declare function runWebpackDevServer(config: webpack.Configuration, context: BuilderContext, options?: {
    devServerConfig?: WebpackDevServer.Configuration;
    logging?: WebpackLoggingCallback;
    webpackFactory?: WebpackFactory;
    webpackDevServerFactory?: WebpackDevServerFactory;
}): Observable<DevServerBuildOutput>;
declare const _default: import("@angular-devkit/architect/src/internal").Builder<WebpackDevServerBuilderSchema & import("../../../core/src").JsonObject>;
export default _default;
