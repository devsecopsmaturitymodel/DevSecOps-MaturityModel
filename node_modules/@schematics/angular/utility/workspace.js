"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.allTargetOptions = exports.allWorkspaceTargets = exports.createDefaultPath = exports.buildDefaultPath = exports.getWorkspace = exports.updateWorkspace = void 0;
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const workspace_models_1 = require("./workspace-models");
function createHost(tree) {
    return {
        async readFile(path) {
            const data = tree.read(path);
            if (!data) {
                throw new Error('File not found.');
            }
            return core_1.virtualFs.fileBufferToString(data);
        },
        async writeFile(path, data) {
            return tree.overwrite(path, data);
        },
        async isDirectory(path) {
            // approximate a directory check
            return !tree.exists(path) && tree.getDir(path).subfiles.length > 0;
        },
        async isFile(path) {
            return tree.exists(path);
        },
    };
}
function updateWorkspace(updaterOrWorkspace) {
    return async (tree) => {
        const host = createHost(tree);
        if (typeof updaterOrWorkspace === 'function') {
            const { workspace } = await core_1.workspaces.readWorkspace('/', host);
            const result = await updaterOrWorkspace(workspace);
            await core_1.workspaces.writeWorkspace(workspace, host);
            return result || schematics_1.noop;
        }
        else {
            await core_1.workspaces.writeWorkspace(updaterOrWorkspace, host);
            return schematics_1.noop;
        }
    };
}
exports.updateWorkspace = updateWorkspace;
async function getWorkspace(tree, path = '/') {
    const host = createHost(tree);
    const { workspace } = await core_1.workspaces.readWorkspace(path, host);
    return workspace;
}
exports.getWorkspace = getWorkspace;
/**
 * Build a default project path for generating.
 * @param project The project which will have its default path generated.
 */
function buildDefaultPath(project) {
    const root = project.sourceRoot ? `/${project.sourceRoot}/` : `/${project.root}/src/`;
    const projectDirName = project.extensions['projectType'] === workspace_models_1.ProjectType.Application ? 'app' : 'lib';
    return `${root}${projectDirName}`;
}
exports.buildDefaultPath = buildDefaultPath;
async function createDefaultPath(tree, projectName) {
    const workspace = await getWorkspace(tree);
    const project = workspace.projects.get(projectName);
    if (!project) {
        throw new Error(`Project "${projectName}" does not exist.`);
    }
    return buildDefaultPath(project);
}
exports.createDefaultPath = createDefaultPath;
function* allWorkspaceTargets(workspace) {
    for (const [projectName, project] of workspace.projects) {
        for (const [targetName, target] of project.targets) {
            yield [targetName, target, projectName, project];
        }
    }
}
exports.allWorkspaceTargets = allWorkspaceTargets;
function* allTargetOptions(target, skipBaseOptions = false) {
    if (!skipBaseOptions && target.options) {
        yield [undefined, target.options];
    }
    if (!target.configurations) {
        return;
    }
    for (const [name, options] of Object.entries(target.configurations)) {
        if (options !== undefined) {
            yield [name, options];
        }
    }
}
exports.allTargetOptions = allTargetOptions;
