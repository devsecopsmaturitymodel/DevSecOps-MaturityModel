/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import type { Compilation, LoaderContext } from 'webpack';
export declare const InlineAngularResourceLoaderPath: string;
export declare const InlineAngularResourceSymbol: unique symbol;
export interface CompilationWithInlineAngularResource extends Compilation {
    [InlineAngularResourceSymbol]: string;
}
export default function (this: LoaderContext<{
    data?: string;
}>): void;
