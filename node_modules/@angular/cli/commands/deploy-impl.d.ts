/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ArchitectCommand } from '../models/architect-command';
import { Arguments } from '../models/interface';
import { Schema as DeployCommandSchema } from './deploy';
export declare class DeployCommand extends ArchitectCommand<DeployCommandSchema> {
    readonly target = "deploy";
    readonly missingTargetError = "\nCannot find \"deploy\" target for the specified project.\n\nYou should add a package that implements deployment capabilities for your\nfavorite platform.\n\nFor example:\n  ng add @angular/fire\n  ng add @azure/ng-deploy\n\nFind more packages on npm https://www.npmjs.com/search?q=ng%20deploy\n";
    initialize(options: DeployCommandSchema & Arguments): Promise<number | void>;
}
