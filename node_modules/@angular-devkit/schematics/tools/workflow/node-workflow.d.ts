/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Path, schema, virtualFs } from '@angular-devkit/core';
import { workflow } from '@angular-devkit/schematics';
import { FileSystemEngine } from '../description';
import { OptionTransform } from '../file-system-engine-host-base';
import { NodeModulesEngineHost } from '../node-module-engine-host';
export interface NodeWorkflowOptions {
    force?: boolean;
    dryRun?: boolean;
    packageManager?: string;
    packageManagerForce?: boolean;
    packageRegistry?: string;
    registry?: schema.CoreSchemaRegistry;
    resolvePaths?: string[];
    schemaValidation?: boolean;
    optionTransforms?: OptionTransform<object, object>[];
    engineHostCreator?: (options: NodeWorkflowOptions) => NodeModulesEngineHost;
}
/**
 * A workflow specifically for Node tools.
 */
export declare class NodeWorkflow extends workflow.BaseWorkflow {
    constructor(root: string, options: NodeWorkflowOptions);
    constructor(host: virtualFs.Host, options: NodeWorkflowOptions & {
        root?: Path;
    });
    get engine(): FileSystemEngine;
    get engineHost(): NodeModulesEngineHost;
}
