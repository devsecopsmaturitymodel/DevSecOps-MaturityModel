/// <amd-module name="@angular/compiler-cli/ngcc/src/entry_point_finder/utils" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AbsoluteFsPath } from '../../../src/ngtsc/file_system';
import { Logger } from '../../../src/ngtsc/logging';
import { PathMappings } from '../path_mappings';
/**
 * Extract all the base-paths that we need to search for entry-points.
 *
 * This always contains the standard base-path (`sourceDirectory`).
 * But it also parses the `paths` mappings object to guess additional base-paths.
 *
 * For example:
 *
 * ```
 * getBasePaths('/node_modules', {baseUrl: '/dist', paths: {'*': ['lib/*', 'lib/generated/*']}})
 * > ['/node_modules', '/dist/lib']
 * ```
 *
 * Notice that `'/dist'` is not included as there is no `'*'` path,
 * and `'/dist/lib/generated'` is not included as it is covered by `'/dist/lib'`.
 *
 * @param sourceDirectory The standard base-path (e.g. node_modules).
 * @param pathMappings Path mapping configuration, from which to extract additional base-paths.
 */
export declare function getBasePaths(logger: Logger, sourceDirectory: AbsoluteFsPath, pathMappings: PathMappings | undefined): AbsoluteFsPath[];
/**
 * Run a task and track how long it takes.
 *
 * @param task The task whose duration we are tracking.
 * @param log The function to call with the duration of the task.
 * @returns The result of calling `task`.
 */
export declare function trackDuration<T = void>(task: () => T extends Promise<unknown> ? never : T, log: (duration: number) => void): T;
