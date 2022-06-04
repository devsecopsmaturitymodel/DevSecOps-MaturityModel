/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { RuleFactory } from '@angular-devkit/schematics';
import { NodeModulesEngineHost } from '@angular-devkit/schematics/tools';
export declare class SchematicEngineHost extends NodeModulesEngineHost {
    protected _resolveReferenceString(refString: string, parentPath: string): {
        ref: RuleFactory<{}>;
        path: string;
    } | null;
}
