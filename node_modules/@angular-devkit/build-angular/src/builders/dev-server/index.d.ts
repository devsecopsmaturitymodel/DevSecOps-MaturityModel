/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BuilderContext } from '@angular-devkit/architect';
import { DevServerBuildOutput, WebpackLoggingCallback } from '@angular-devkit/build-webpack';
import { json } from '@angular-devkit/core';
import { Observable } from 'rxjs';
import webpack from 'webpack';
import { ExecutionTransformer } from '../../transforms';
import { IndexHtmlTransform } from '../../utils/index-file/index-html-generator';
import { Schema } from './schema';
export declare type DevServerBuilderOptions = Schema & json.JsonObject;
/**
 * @experimental Direct usage of this type is considered experimental.
 */
export declare type DevServerBuilderOutput = DevServerBuildOutput & {
    baseUrl: string;
};
/**
 * Reusable implementation of the Angular Webpack development server builder.
 * @param options Dev Server options.
 * @param context The build context.
 * @param transforms A map of transforms that can be used to hook into some logic (such as
 *     transforming webpack configuration before passing it to webpack).
 *
 * @experimental Direct usage of this function is considered experimental.
 */
export declare function serveWebpackBrowser(options: DevServerBuilderOptions, context: BuilderContext, transforms?: {
    webpackConfiguration?: ExecutionTransformer<webpack.Configuration>;
    logging?: WebpackLoggingCallback;
    indexHtml?: IndexHtmlTransform;
}): Observable<DevServerBuilderOutput>;
declare const _default: import("@angular-devkit/architect/src/internal").Builder<Schema & json.JsonObject>;
export default _default;
