/// <amd-module name="@angular/compiler-cli/ngcc/src/packages/entry_point" />
import { AbsoluteFsPath, ReadonlyFileSystem } from '../../../src/ngtsc/file_system';
import { Logger } from '../../../src/ngtsc/logging';
import { NgccConfiguration } from './configuration';
/**
 * The possible values for the format of an entry-point.
 */
export declare type EntryPointFormat = 'esm5' | 'esm2015' | 'umd' | 'commonjs';
/**
 * An object containing information about an entry-point, including paths
 * to each of the possible entry-point formats.
 */
export interface EntryPoint extends JsonObject {
    /** The name of the entry-point (e.g. `@angular/core` or `@angular/common/http`). */
    name: string;
    /** The path to this entry point. */
    path: AbsoluteFsPath;
    /**
     * The name of the package that contains this entry-point (e.g. `@angular/core` or
     * `@angular/common`).
     */
    packageName: string;
    /** The path to the package that contains this entry-point. */
    packagePath: AbsoluteFsPath;
    /** The URL of the repository. */
    repositoryUrl: string;
    /** The parsed package.json file for this entry-point. */
    packageJson: EntryPointPackageJson;
    /** The path to a typings (.d.ts) file for this entry-point. */
    typings: AbsoluteFsPath;
    /** Is this EntryPoint compiled with the Angular View Engine compiler? */
    compiledByAngular: boolean;
    /** Should ngcc ignore missing dependencies and process this entrypoint anyway? */
    ignoreMissingDependencies: boolean;
    /** Should ngcc generate deep re-exports for this entrypoint? */
    generateDeepReexports: boolean;
}
export declare type JsonPrimitive = string | number | boolean | null;
export declare type JsonValue = JsonPrimitive | JsonArray | JsonObject | undefined;
export interface JsonArray extends Array<JsonValue> {
}
export interface JsonObject {
    [key: string]: JsonValue;
}
export interface PackageJsonFormatPropertiesMap {
    browser?: string;
    fesm2015?: string;
    fesm5?: string;
    es2015?: string;
    esm2015?: string;
    esm5?: string;
    main?: string;
    module?: string;
    types?: string;
    typings?: string;
}
export declare type PackageJsonFormatProperties = keyof PackageJsonFormatPropertiesMap;
/**
 * The properties that may be loaded from the `package.json` file.
 */
export interface EntryPointPackageJson extends JsonObject, PackageJsonFormatPropertiesMap {
    name: string;
    version?: string;
    scripts?: Record<string, string>;
    repository?: string | {
        url: string;
    };
    __processed_by_ivy_ngcc__?: Record<string, string>;
}
export declare type EntryPointJsonProperty = Exclude<PackageJsonFormatProperties, 'types' | 'typings'>;
export declare const SUPPORTED_FORMAT_PROPERTIES: EntryPointJsonProperty[];
/**
 * The path does not represent an entry-point, i.e. there is no package.json at the path and there
 * is no config to force an entry-point.
 */
export declare const NO_ENTRY_POINT = "no-entry-point";
/**
 * The path represents an entry-point that is `ignored` by an ngcc config.
 */
export declare const IGNORED_ENTRY_POINT = "ignored-entry-point";
/**
 * The path has a package.json, but it is not a valid entry-point for ngcc processing.
 */
export declare const INCOMPATIBLE_ENTRY_POINT = "incompatible-entry-point";
/**
 * The result of calling `getEntryPointInfo()`.
 *
 * This will be an `EntryPoint` object if an Angular entry-point was identified;
 * Otherwise it will be a flag indicating one of:
 * * NO_ENTRY_POINT - the path is not an entry-point or ngcc is configured to ignore it
 * * INCOMPATIBLE_ENTRY_POINT - the path was a non-processable entry-point that should be searched
 * for sub-entry-points
 */
export declare type GetEntryPointResult = EntryPoint | typeof IGNORED_ENTRY_POINT | typeof INCOMPATIBLE_ENTRY_POINT | typeof NO_ENTRY_POINT;
/**
 * Try to create an entry-point from the given paths and properties.
 *
 * @param packagePath the absolute path to the containing npm package
 * @param entryPointPath the absolute path to the potential entry-point.
 * @returns
 * - An entry-point if it is valid and not ignored.
 * - `NO_ENTRY_POINT` when there is no package.json at the path and there is no config to force an
 *   entry-point,
 * - `IGNORED_ENTRY_POINT` when the entry-point is ignored by an ngcc config.
 * - `INCOMPATIBLE_ENTRY_POINT` when there is a package.json but it is not a valid Angular compiled
 *   entry-point.
 */
export declare function getEntryPointInfo(fs: ReadonlyFileSystem, config: NgccConfiguration, logger: Logger, packagePath: AbsoluteFsPath, entryPointPath: AbsoluteFsPath): GetEntryPointResult;
export declare function isEntryPoint(result: GetEntryPointResult): result is EntryPoint;
/**
 * Convert a package.json property into an entry-point format.
 *
 * @param property The property to convert to a format.
 * @returns An entry-point format or `undefined` if none match the given property.
 */
export declare function getEntryPointFormat(fs: ReadonlyFileSystem, entryPoint: EntryPoint, property: EntryPointJsonProperty): EntryPointFormat | undefined;
