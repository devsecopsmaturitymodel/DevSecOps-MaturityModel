/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ProjectDefinition, TargetDefinition } from '@angular-devkit/core/src/workspace';
import { JsonValue } from '@angular-devkit/core';
/** Object that maps a CLI target to its default builder name. */
export declare const defaultTargetBuilders: {
    build: string;
    test: string;
};
/** Resolves the architect options for the build target of the given project. */
export declare function getProjectTargetOptions(project: ProjectDefinition, buildTarget: string): Record<string, JsonValue | undefined>;
/** Gets all targets from the given project that match the specified builder name. */
export declare function getTargetsByBuilderName(project: ProjectDefinition, builderName: string): TargetDefinition[];
