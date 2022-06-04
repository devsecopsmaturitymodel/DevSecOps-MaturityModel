/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { analytics, logging } from '@angular-devkit/core';
import { AngularWorkspace } from '../utilities/config';
import { Arguments, CommandContext, CommandDescription, CommandDescriptionMap, CommandScope, Option } from './interface';
export interface BaseCommandOptions {
    help?: boolean | string;
}
export declare abstract class Command<T extends BaseCommandOptions = BaseCommandOptions> {
    protected readonly context: CommandContext;
    readonly description: CommandDescription;
    protected readonly logger: logging.Logger;
    protected allowMissingWorkspace: boolean;
    protected useReportAnalytics: boolean;
    readonly workspace?: AngularWorkspace;
    readonly analytics: analytics.Analytics;
    protected static commandMap: () => Promise<CommandDescriptionMap>;
    static setCommandMap(map: () => Promise<CommandDescriptionMap>): void;
    constructor(context: CommandContext, description: CommandDescription, logger: logging.Logger);
    initialize(options: T & Arguments): Promise<number | void>;
    printHelp(): Promise<number>;
    printJsonHelp(): Promise<number>;
    protected printHelpUsage(): Promise<void>;
    protected printHelpOptions(options?: Option[]): Promise<void>;
    validateScope(scope?: CommandScope): Promise<void>;
    reportAnalytics(paths: string[], options: Arguments, dimensions?: (boolean | number | string)[], metrics?: (boolean | number | string)[]): Promise<void>;
    abstract run(options: T & Arguments): Promise<number | void>;
    validateAndRun(options: T & Arguments): Promise<number | void>;
}
