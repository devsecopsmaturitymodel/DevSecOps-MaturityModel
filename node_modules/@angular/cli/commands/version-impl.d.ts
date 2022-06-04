/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Command } from '../models/command';
import { Schema as VersionCommandSchema } from './version';
export declare class VersionCommand extends Command<VersionCommandSchema> {
    static aliases: string[];
    private readonly localRequire;
    private readonly workspaceRequire;
    run(): Promise<void>;
    private getVersion;
    private getPackageManager;
}
