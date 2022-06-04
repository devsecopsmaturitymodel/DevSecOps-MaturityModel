/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Command } from '../models/command';
import { Arguments } from '../models/interface';
import { Schema as UpdateCommandSchema } from './update';
export declare class UpdateCommand extends Command<UpdateCommandSchema> {
    readonly allowMissingWorkspace = true;
    private workflow;
    private packageManager;
    initialize(options: UpdateCommandSchema & Arguments): Promise<void>;
    private executeSchematic;
    /**
     * @return Whether or not the migration was performed successfully.
     */
    private executeMigration;
    /**
     * @return Whether or not the migrations were performed successfully.
     */
    private executeMigrations;
    private executePackageMigrations;
    run(options: UpdateCommandSchema & Arguments): Promise<number>;
    /**
     * @return Whether or not the commit was successful.
     */
    private commit;
    private checkCleanGit;
    /**
     * Checks if the current installed CLI version is older or newer than a compatible version.
     * @returns the version to install or null when there is no update to install.
     */
    private checkCLIVersion;
    private getCLIUpdateRunnerVersion;
}
