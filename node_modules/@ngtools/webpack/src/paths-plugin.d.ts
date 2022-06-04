/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CompilerOptions } from 'typescript';
import type { Configuration } from 'webpack';
export interface TypeScriptPathsPluginOptions extends Pick<CompilerOptions, 'paths' | 'baseUrl'> {
}
declare type Resolver = Exclude<Exclude<Configuration['resolve'], undefined>['resolver'], undefined>;
export declare class TypeScriptPathsPlugin {
    private baseUrl?;
    private patterns?;
    constructor(options?: TypeScriptPathsPluginOptions);
    /**
     * Update the plugin with new path mapping option values.
     * The options will also be preprocessed to reduce the overhead of individual resolve actions
     * during a build.
     *
     * @param options The `paths` and `baseUrl` options from TypeScript's `CompilerOptions`.
     */
    update(options: TypeScriptPathsPluginOptions): void;
    apply(resolver: Resolver): void;
}
export {};
