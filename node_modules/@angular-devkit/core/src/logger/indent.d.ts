/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Logger } from './logger';
export declare class IndentLogger extends Logger {
    constructor(name: string, parent?: Logger | null, indentation?: string);
}
