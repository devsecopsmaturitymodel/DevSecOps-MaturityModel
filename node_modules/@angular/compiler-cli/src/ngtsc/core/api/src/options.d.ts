/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/core/api/src/options" />
import ts from 'typescript';
import { BazelAndG3Options, DiagnosticOptions, I18nOptions, LegacyNgcOptions, MiscOptions, NgcCompatibilityOptions, StrictTemplateOptions, TargetOptions } from './public_options';
/**
 * Non-public options which are useful during testing of the compiler.
 */
export interface TestOnlyOptions {
    /**
     * An option to enable ngtsc's internal performance tracing.
     *
     * This should be a path to a JSON file where trace information will be written. This is sensitive
     * to the compiler's working directory, and should likely be an absolute path.
     *
     * This is currently not exposed to users as the trace format is still unstable.
     */
    tracePerformance?: string;
}
/**
 * Internal only options for compiler.
 */
export interface InternalOptions {
}
/**
 * A merged interface of all of the various Angular compiler options, as well as the standard
 * `ts.CompilerOptions`.
 *
 * Also includes a few miscellaneous options.
 */
export interface NgCompilerOptions extends ts.CompilerOptions, LegacyNgcOptions, BazelAndG3Options, DiagnosticOptions, NgcCompatibilityOptions, StrictTemplateOptions, TestOnlyOptions, I18nOptions, TargetOptions, InternalOptions, MiscOptions {
    [prop: string]: any;
}
