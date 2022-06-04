/// <amd-module name="@angular/compiler-cli/src/ngtsc/file_system/src/node_js_file_system" />
import { AbsoluteFsPath, FileStats, FileSystem, PathManipulation, PathSegment, PathString, ReadonlyFileSystem } from './types';
/**
 * A wrapper around the Node.js file-system that supports path manipulation.
 */
export declare class NodeJSPathManipulation implements PathManipulation {
    pwd(): AbsoluteFsPath;
    chdir(dir: AbsoluteFsPath): void;
    resolve(...paths: string[]): AbsoluteFsPath;
    dirname<T extends string>(file: T): T;
    join<T extends string>(basePath: T, ...paths: string[]): T;
    isRoot(path: AbsoluteFsPath): boolean;
    isRooted(path: string): boolean;
    relative<T extends PathString>(from: T, to: T): PathSegment | AbsoluteFsPath;
    basename(filePath: string, extension?: string): PathSegment;
    extname(path: AbsoluteFsPath | PathSegment): string;
    normalize<T extends string>(path: T): T;
}
/**
 * A wrapper around the Node.js file-system that supports readonly operations and path manipulation.
 */
export declare class NodeJSReadonlyFileSystem extends NodeJSPathManipulation implements ReadonlyFileSystem {
    private _caseSensitive;
    isCaseSensitive(): boolean;
    exists(path: AbsoluteFsPath): boolean;
    readFile(path: AbsoluteFsPath): string;
    readFileBuffer(path: AbsoluteFsPath): Uint8Array;
    readdir(path: AbsoluteFsPath): PathSegment[];
    lstat(path: AbsoluteFsPath): FileStats;
    stat(path: AbsoluteFsPath): FileStats;
    realpath(path: AbsoluteFsPath): AbsoluteFsPath;
    getDefaultLibLocation(): AbsoluteFsPath;
}
/**
 * A wrapper around the Node.js file-system (i.e. the `fs` package).
 */
export declare class NodeJSFileSystem extends NodeJSReadonlyFileSystem implements FileSystem {
    writeFile(path: AbsoluteFsPath, data: string | Uint8Array, exclusive?: boolean): void;
    removeFile(path: AbsoluteFsPath): void;
    symlink(target: AbsoluteFsPath, path: AbsoluteFsPath): void;
    copyFile(from: AbsoluteFsPath, to: AbsoluteFsPath): void;
    moveFile(from: AbsoluteFsPath, to: AbsoluteFsPath): void;
    ensureDir(path: AbsoluteFsPath): void;
    removeDeep(path: AbsoluteFsPath): void;
    private safeMkdir;
}
