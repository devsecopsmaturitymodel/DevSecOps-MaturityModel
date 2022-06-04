/// <amd-module name="@angular/compiler-cli/linker/src/file_linker/linker_environment" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ReadonlyFileSystem } from '../../../src/ngtsc/file_system';
import { Logger } from '../../../src/ngtsc/logging';
import { SourceFileLoader } from '../../../src/ngtsc/sourcemaps';
import { AstFactory } from '../../../src/ngtsc/translator';
import { AstHost } from '../ast/ast_host';
import { LinkerOptions } from './linker_options';
import { Translator } from './translator';
export declare class LinkerEnvironment<TStatement, TExpression> {
    readonly fileSystem: ReadonlyFileSystem;
    readonly logger: Logger;
    readonly host: AstHost<TExpression>;
    readonly factory: AstFactory<TStatement, TExpression>;
    readonly options: LinkerOptions;
    readonly translator: Translator<TStatement, TExpression>;
    readonly sourceFileLoader: SourceFileLoader | null;
    private constructor();
    static create<TStatement, TExpression>(fileSystem: ReadonlyFileSystem, logger: Logger, host: AstHost<TExpression>, factory: AstFactory<TStatement, TExpression>, options: Partial<LinkerOptions>): LinkerEnvironment<TStatement, TExpression>;
}
