/// <amd-module name="@angular/compiler-cli/src/ngtsc/file_system/src/helpers" />
import { AbsoluteFsPath, FileSystem, PathSegment, PathString } from './types';
export declare function getFileSystem(): FileSystem;
export declare function setFileSystem(fileSystem: FileSystem): void;
/**
 * Convert the path `path` to an `AbsoluteFsPath`, throwing an error if it's not an absolute path.
 */
export declare function absoluteFrom(path: string): AbsoluteFsPath;
/**
 * Extract an `AbsoluteFsPath` from a `ts.SourceFile`-like object.
 */
export declare function absoluteFromSourceFile(sf: {
    fileName: string;
}): AbsoluteFsPath;
/**
 * Convert the path `path` to a `PathSegment`, throwing an error if it's not a relative path.
 */
export declare function relativeFrom(path: string): PathSegment;
/**
 * Static access to `dirname`.
 */
export declare function dirname<T extends PathString>(file: T): T;
/**
 * Static access to `join`.
 */
export declare function join<T extends PathString>(basePath: T, ...paths: string[]): T;
/**
 * Static access to `resolve`s.
 */
export declare function resolve(basePath: string, ...paths: string[]): AbsoluteFsPath;
/** Returns true when the path provided is the root path. */
export declare function isRoot(path: AbsoluteFsPath): boolean;
/**
 * Static access to `isRooted`.
 */
export declare function isRooted(path: string): boolean;
/**
 * Static access to `relative`.
 */
export declare function relative<T extends PathString>(from: T, to: T): PathSegment | AbsoluteFsPath;
/**
 * Static access to `basename`.
 */
export declare function basename(filePath: PathString, extension?: string): PathSegment;
/**
 * Returns true if the given path is locally relative.
 *
 * This is used to work out if the given path is relative (i.e. not absolute) but also is not
 * escaping the current directory.
 */
export declare function isLocalRelativePath(relativePath: string): boolean;
/**
 * Converts a path to a form suitable for use as a relative module import specifier.
 *
 * In other words it adds the `./` to the path if it is locally relative.
 */
export declare function toRelativeImport(relativePath: PathSegment | AbsoluteFsPath): PathSegment | AbsoluteFsPath;
