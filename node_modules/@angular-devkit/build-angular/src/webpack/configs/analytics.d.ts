/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BuilderContext } from '@angular-devkit/architect';
import { Configuration } from 'webpack';
import { WebpackConfigOptions } from '../../utils/build-options';
export declare function getAnalyticsConfig(wco: WebpackConfigOptions, context: BuilderContext): Configuration;
