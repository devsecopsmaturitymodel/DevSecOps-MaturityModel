/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Architect, Target } from '@angular-devkit/architect';
import { WorkspaceNodeModulesArchitectHost } from '@angular-devkit/architect/node';
import { json } from '@angular-devkit/core';
import { BaseCommandOptions, Command } from './command';
import { Arguments } from './interface';
export interface ArchitectCommandOptions extends BaseCommandOptions {
    project?: string;
    configuration?: string;
    prod?: boolean;
    target?: string;
}
export declare abstract class ArchitectCommand<T extends ArchitectCommandOptions = ArchitectCommandOptions> extends Command<T> {
    protected _architect: Architect;
    protected _architectHost: WorkspaceNodeModulesArchitectHost;
    protected _registry: json.schema.SchemaRegistry;
    protected readonly useReportAnalytics = false;
    protected multiTarget: boolean;
    target: string | undefined;
    missingTargetError: string | undefined;
    protected onMissingTarget(projectName?: string): Promise<void | number>;
    initialize(options: T & Arguments): Promise<number | void>;
    private warnOnMissingNodeModules;
    run(options: ArchitectCommandOptions & Arguments): Promise<number>;
    protected runSingleTarget(target: Target, targetOptions: string[]): Promise<0 | 1>;
    protected runArchitectTarget(options: ArchitectCommandOptions & Arguments): Promise<number>;
    private getProjectNamesByTarget;
    private _makeTargetSpecifier;
}
