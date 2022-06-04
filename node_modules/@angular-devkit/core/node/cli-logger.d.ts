/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <reference types="node" />
import { logging } from '../src';
export interface ProcessOutput {
    write(buffer: string | Buffer): boolean;
}
/**
 * A Logger that sends information to STDOUT and STDERR.
 */
export declare function createConsoleLogger(verbose?: boolean, stdout?: ProcessOutput, stderr?: ProcessOutput, colors?: Partial<Record<logging.LogLevel, (s: string) => string>>): logging.Logger;
