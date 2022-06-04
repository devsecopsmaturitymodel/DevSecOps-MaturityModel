/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Path } from '@angular-devkit/core';
import { ProjectDefinition } from '@angular-devkit/core/src/workspace';
/** Gets the path of the index file in the given project. */
export declare function getProjectIndexFiles(project: ProjectDefinition): Path[];
