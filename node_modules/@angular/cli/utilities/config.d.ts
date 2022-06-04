/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { json, workspaces } from '@angular-devkit/core';
import { JSONFile } from './json-file';
export declare const workspaceSchemaPath: string;
export declare class AngularWorkspace {
    private workspace;
    readonly filePath: string;
    readonly basePath: string;
    constructor(workspace: workspaces.WorkspaceDefinition, filePath: string);
    get extensions(): Record<string, json.JsonValue | undefined>;
    get projects(): workspaces.ProjectDefinitionCollection;
    getCli(): Record<string, any>;
    getProjectCli(projectName: string): Record<string, any>;
    static load(workspaceFilePath: string): Promise<AngularWorkspace>;
}
export declare function getWorkspace(level?: 'local' | 'global'): Promise<AngularWorkspace | null>;
export declare function createGlobalSettings(): string;
export declare function getWorkspaceRaw(level?: 'local' | 'global'): [JSONFile | null, string | null];
export declare function validateWorkspace(data: json.JsonObject): Promise<void>;
export declare function getProjectByCwd(workspace: AngularWorkspace): string | null;
export declare function getConfiguredPackageManager(): Promise<string | null>;
export declare function migrateLegacyGlobalConfig(): boolean;
export declare function getSchematicDefaults(collection: string, schematic: string, project?: string | null): Promise<{}>;
export declare function isWarningEnabled(warning: string): Promise<boolean>;
