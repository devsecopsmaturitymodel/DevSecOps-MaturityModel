/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Logger, LoggerApi } from './logger';
export declare class NullLogger extends Logger {
    constructor(parent?: Logger | null);
    asApi(): LoggerApi;
}
