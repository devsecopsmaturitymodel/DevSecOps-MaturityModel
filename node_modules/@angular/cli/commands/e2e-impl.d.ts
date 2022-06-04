/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ArchitectCommand } from '../models/architect-command';
import { Arguments } from '../models/interface';
import { Schema as E2eCommandSchema } from './e2e';
export declare class E2eCommand extends ArchitectCommand<E2eCommandSchema> {
    readonly target = "e2e";
    readonly multiTarget = true;
    readonly missingTargetError = "\nCannot find \"e2e\" target for the specified project.\n\nYou should add a package that implements end-to-end testing capabilities.\n\nFor example:\n  Cypress: ng add @cypress/schematic\n  Nightwatch: ng add @nightwatch/schematics\n  WebdriverIO: ng add @wdio/schematics\n\nMore options will be added to the list as they become available.\n";
    initialize(options: E2eCommandSchema & Arguments): Promise<number | void>;
}
