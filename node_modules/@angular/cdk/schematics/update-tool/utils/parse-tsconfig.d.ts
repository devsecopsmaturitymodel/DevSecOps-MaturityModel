/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as ts from 'typescript';
import { FileSystem, WorkspacePath } from '../file-system';
export declare function parseTsconfigFile(tsconfigPath: WorkspacePath, fileSystem: FileSystem): ts.ParsedCommandLine;
