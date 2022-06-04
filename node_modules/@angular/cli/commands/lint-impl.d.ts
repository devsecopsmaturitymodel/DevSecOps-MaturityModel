/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ArchitectCommand } from '../models/architect-command';
import { Arguments } from '../models/interface';
import { Schema as LintCommandSchema } from './lint';
export declare class LintCommand extends ArchitectCommand<LintCommandSchema> {
    readonly target = "lint";
    readonly multiTarget = true;
    initialize(options: LintCommandSchema & Arguments): Promise<number | void>;
    onMissingTarget(): Promise<void | number>;
}
