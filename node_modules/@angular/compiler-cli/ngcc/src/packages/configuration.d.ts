/// <amd-module name="@angular/compiler-cli/ngcc/src/packages/configuration" />
import { AbsoluteFsPath, PathManipulation, ReadonlyFileSystem } from '../../../src/ngtsc/file_system';
import { PackageJsonFormatPropertiesMap } from './entry_point';
/**
 * The format of a project level configuration file.
 */
export interface NgccProjectConfig {
    /**
     * The packages that are configured by this project config.
     */
    packages?: {
        [packagePath: string]: RawNgccPackageConfig | undefined;
    };
    /**
     * Options that control how locking the process is handled.
     */
    locking?: ProcessLockingConfiguration;
    /**
     * Name of hash algorithm used to generate hashes of the configuration.
     *
     * Defaults to `sha256`.
     */
    hashAlgorithm?: string;
}
/**
 * Options that control how locking the process is handled.
 */
export interface ProcessLockingConfiguration {
    /**
     * The number of times the AsyncLocker will attempt to lock the process before failing.
     * Defaults to 500.
     */
    retryAttempts?: number;
    /**
     * The number of milliseconds between attempts to lock the process.
     * Defaults to 500ms.
     * */
    retryDelay?: number;
}
/**
 * The raw format of a package level configuration (as it appears in configuration files).
 */
export interface RawNgccPackageConfig {
    /**
     * The entry-points to configure for this package.
     *
     * In the config file the keys are paths relative to the package path.
     */
    entryPoints?: {
        [entryPointPath: string]: NgccEntryPointConfig;
    };
    /**
     * A collection of regexes that match deep imports to ignore, for this package, rather than
     * displaying a warning.
     */
    ignorableDeepImportMatchers?: RegExp[];
}
/**
 * Configuration options for an entry-point.
 *
 * The existence of a configuration for a path tells ngcc that this should be considered for
 * processing as an entry-point.
 */
export interface NgccEntryPointConfig {
    /** Do not process (or even acknowledge the existence of) this entry-point, if true. */
    ignore?: boolean;
    /**
     * This property, if provided, holds values that will override equivalent properties in an
     * entry-point's package.json file.
     */
    override?: PackageJsonFormatPropertiesMap;
    /**
     * Normally, ngcc will skip compilation of entrypoints that contain imports that can't be resolved
     * or understood. If this option is specified, ngcc will proceed with compiling the entrypoint
     * even in the face of such missing dependencies.
     */
    ignoreMissingDependencies?: boolean;
    /**
     * Enabling this option for an entrypoint tells ngcc that deep imports might be used for the files
     * it contains, and that it should generate private re-exports alongside the NgModule of all the
     * directives/pipes it makes available in support of those imports.
     */
    generateDeepReexports?: boolean;
}
interface VersionedPackageConfig extends RawNgccPackageConfig {
    versionRange: string;
}
/**
 * The internal representation of a configuration file. Configured packages are transformed into
 * `ProcessedNgccPackageConfig` when a certain version is requested.
 */
export declare class PartiallyProcessedConfig {
    /**
     * The packages that are configured by this project config, keyed by package name.
     */
    packages: Map<string, VersionedPackageConfig[]>;
    /**
     * Options that control how locking the process is handled.
     */
    locking: ProcessLockingConfiguration;
    /**
     * Name of hash algorithm used to generate hashes of the configuration.
     *
     * Defaults to `sha256`.
     */
    hashAlgorithm: string;
    constructor(projectConfig: NgccProjectConfig);
    private splitNameAndVersion;
    /**
     * Registers the configuration for a particular version of the provided package.
     */
    private addPackageConfig;
    /**
     * Finds the configuration for a particular version of the provided package.
     */
    findPackageConfig(packageName: string, version: string | null): VersionedPackageConfig | null;
    /**
     * Converts the configuration into a JSON representation that is used to compute a hash of the
     * configuration.
     */
    toJson(): string;
}
/**
 * The default configuration for ngcc.
 *
 * This is the ultimate fallback configuration that ngcc will use if there is no configuration
 * for a package at the package level or project level.
 *
 * This configuration is for packages that are "dead" - i.e. no longer maintained and so are
 * unlikely to be fixed to work with ngcc, nor provide a package level config of their own.
 *
 * The fallback process for looking up configuration is:
 *
 * Project -> Package -> Default
 *
 * If a package provides its own configuration then that would override this default one.
 *
 * Also application developers can always provide configuration at their project level which
 * will override everything else.
 *
 * Note that the fallback is package based not entry-point based.
 * For example, if a there is configuration for a package at the project level this will replace all
 * entry-point configurations that may have been provided in the package level or default level
 * configurations, even if the project level configuration does not provide for a given entry-point.
 */
export declare const DEFAULT_NGCC_CONFIG: NgccProjectConfig;
/**
 * The processed package level configuration as a result of processing a raw package level config.
 */
export declare class ProcessedNgccPackageConfig implements Omit<RawNgccPackageConfig, 'entryPoints'> {
    /**
     * The absolute path to this instance of the package.
     * Note that there may be multiple instances of a package inside a project in nested
     * `node_modules/`. For example, one at `<project-root>/node_modules/some-package/` and one at
     * `<project-root>/node_modules/other-package/node_modules/some-package/`.
     */
    packagePath: AbsoluteFsPath;
    /**
     * The entry-points to configure for this package.
     *
     * In contrast to `RawNgccPackageConfig`, the paths are absolute and take the path of the specific
     * instance of the package into account.
     */
    entryPoints: Map<AbsoluteFsPath, NgccEntryPointConfig>;
    /**
     * A collection of regexes that match deep imports to ignore, for this package, rather than
     * displaying a warning.
     */
    ignorableDeepImportMatchers: RegExp[];
    constructor(fs: PathManipulation, packagePath: AbsoluteFsPath, { entryPoints, ignorableDeepImportMatchers, }: RawNgccPackageConfig);
}
/**
 * Ngcc has a hierarchical configuration system that lets us "fix up" packages that do not
 * work with ngcc out of the box.
 *
 * There are three levels at which configuration can be declared:
 *
 * * Default level - ngcc comes with built-in configuration for well known cases.
 * * Package level - a library author publishes a configuration with their package to fix known
 *   issues.
 * * Project level - the application developer provides a configuration that fixes issues specific
 *   to the libraries used in their application.
 *
 * Ngcc will match configuration based on the package name but also on its version. This allows
 * configuration to provide different fixes to different version ranges of a package.
 *
 * * Package level configuration is specific to the package version where the configuration is
 *   found.
 * * Default and project level configuration should provide version ranges to ensure that the
 *   configuration is only applied to the appropriate versions of a package.
 *
 * When getting a configuration for a package (via `getConfig()`) the caller should provide the
 * version of the package in question, if available. If it is not provided then the first available
 * configuration for a package is returned.
 */
export declare class NgccConfiguration {
    private fs;
    private defaultConfig;
    private projectConfig;
    private cache;
    readonly hash: string;
    readonly hashAlgorithm: string;
    constructor(fs: ReadonlyFileSystem, baseDir: AbsoluteFsPath);
    /**
     * Get the configuration options for locking the ngcc process.
     */
    getLockingConfig(): Required<ProcessLockingConfiguration>;
    /**
     * Get a configuration for the given `version` of a package at `packagePath`.
     *
     * @param packageName The name of the package whose config we want.
     * @param packagePath The path to the package whose config we want.
     * @param version The version of the package whose config we want, or `null` if the package's
     * package.json did not exist or was invalid.
     */
    getPackageConfig(packageName: string, packagePath: AbsoluteFsPath, version: string | null): ProcessedNgccPackageConfig;
    private getRawPackageConfig;
    private loadProjectConfig;
    private loadPackageConfig;
    private evalSrcFile;
    private computeHash;
}
export {};
