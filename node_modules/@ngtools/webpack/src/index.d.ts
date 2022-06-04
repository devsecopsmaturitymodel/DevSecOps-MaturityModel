/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as ivyInternal from './ivy';
export { AngularWebpackLoaderPath, AngularWebpackPlugin, AngularWebpackPluginOptions, default, } from './ivy';
/** @deprecated Deprecated as of v12, please use the direct exports
 * (`AngularWebpackPlugin` instead of `ivy.AngularWebpackPlugin`)
 */
export declare namespace ivy {
    const AngularWebpackLoaderPath: string;
    const AngularWebpackPlugin: typeof ivyInternal.AngularWebpackPlugin;
    type AngularWebpackPlugin = ivyInternal.AngularWebpackPlugin;
    type AngularPluginOptions = ivyInternal.AngularWebpackPluginOptions;
}
