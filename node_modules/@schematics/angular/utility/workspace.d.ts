/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { json, workspaces } from '@angular-devkit/core';
import { Rule, Tree } from '@angular-devkit/schematics';
export declare function updateWorkspace(updater: (workspace: workspaces.WorkspaceDefinition) => void | Rule | PromiseLike<void | Rule>): Rule;
export declare function updateWorkspace(workspace: workspaces.WorkspaceDefinition): Rule;
export declare function getWorkspace(tree: Tree, path?: string): Promise<workspaces.WorkspaceDefinition>;
/**
 * Build a default project path for generating.
 * @param project The project which will have its default path generated.
 */
export declare function buildDefaultPath(project: workspaces.ProjectDefinition): string;
export declare function createDefaultPath(tree: Tree, projectName: string): Promise<string>;
export declare function allWorkspaceTargets(workspace: workspaces.WorkspaceDefinition): Iterable<[string, workspaces.TargetDefinition, string, workspaces.ProjectDefinition]>;
export declare function allTargetOptions(target: workspaces.TargetDefinition, skipBaseOptions?: boolean): Iterable<[string | undefined, Record<string, json.JsonValue | undefined>]>;
