/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Path, PathFragment } from '../path';
import { FileBuffer, FileBufferLike, Host, Stats } from './interface';
export interface SyncHostHandler<StatsT extends object = {}> {
    read(path: Path): FileBuffer;
    list(path: Path): PathFragment[];
    exists(path: Path): boolean;
    isDirectory(path: Path): boolean;
    isFile(path: Path): boolean;
    stat(path: Path): Stats<StatsT> | null;
    write(path: Path, content: FileBufferLike): void;
    delete(path: Path): void;
    rename(from: Path, to: Path): void;
}
export declare function createSyncHost<StatsT extends object = {}>(handler: SyncHostHandler<StatsT>): Host<StatsT>;
