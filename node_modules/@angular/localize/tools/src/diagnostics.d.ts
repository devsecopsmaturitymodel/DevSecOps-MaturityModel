/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/localize/tools/src/diagnostics" />
/**
 * How to handle potential diagnostics.
 */
export declare type DiagnosticHandlingStrategy = 'error' | 'warning' | 'ignore';
/**
 * This class is used to collect and then report warnings and errors that occur during the execution
 * of the tools.
 *
 * @publicApi used by CLI
 */
export declare class Diagnostics {
    readonly messages: {
        type: 'warning' | 'error';
        message: string;
    }[];
    get hasErrors(): boolean;
    add(type: DiagnosticHandlingStrategy, message: string): void;
    warn(message: string): void;
    error(message: string): void;
    merge(other: Diagnostics): void;
    formatDiagnostics(message: string): string;
}
