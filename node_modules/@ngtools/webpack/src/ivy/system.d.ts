/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <reference types="node" />
import * as ts from 'typescript';
import { Compiler } from 'webpack';
export declare type InputFileSystem = Compiler['inputFileSystem'];
export interface InputFileSystemSync extends InputFileSystem {
    readFileSync(path: string): Buffer;
    statSync(path: string): {
        size: number;
        mtime: Date;
        isDirectory(): boolean;
        isFile(): boolean;
    };
}
export declare function createWebpackSystem(input: InputFileSystemSync, currentDirectory: string): ts.System;
