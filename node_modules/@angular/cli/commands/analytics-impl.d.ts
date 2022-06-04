/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Command } from '../models/command';
import { Arguments } from '../models/interface';
import { Schema as AnalyticsCommandSchema } from './analytics';
export declare class AnalyticsCommand extends Command<AnalyticsCommandSchema> {
    run(options: AnalyticsCommandSchema & Arguments): Promise<0 | 1 | 2 | 3 | 4>;
}
