export interface Schema {
    /**
     * Which external dependencies to bundle into the bundle. By default, all of node_modules
     * will be bundled.
     */
    bundleDependencies?: BundleDependenciesUnion;
    /**
     * Delete the output path before building.
     */
    deleteOutputPath?: boolean;
    /**
     * URL where files will be deployed.
     * @deprecated Use "baseHref" browser builder option, "APP_BASE_HREF" DI token or a
     * combination of both instead. For more information, see
     * https://angular.io/guide/deployment#the-deploy-url.
     */
    deployUrl?: string;
    /**
     * Exclude the listed external dependencies from being bundled into the bundle. Instead, the
     * created bundle relies on these dependencies to be available during runtime.
     */
    externalDependencies?: string[];
    /**
     * Extract all licenses in a separate file, in the case of production builds only.
     */
    extractLicenses?: boolean;
    /**
     * Replace compilation source files with other compilation source files in the build.
     */
    fileReplacements?: FileReplacement[];
    /**
     * How to handle duplicate translations for i18n.
     */
    i18nDuplicateTranslation?: I18NTranslation;
    /**
     * How to handle missing translations for i18n.
     */
    i18nMissingTranslation?: I18NTranslation;
    /**
     * The stylesheet language to use for the application's inline component styles.
     */
    inlineStyleLanguage?: InlineStyleLanguage;
    /**
     * Translate the bundles in one or more locales.
     */
    localize?: Localize;
    /**
     * The name of the main entry-point file.
     */
    main: string;
    /**
     * Use file name for lazy loaded chunks.
     */
    namedChunks?: boolean;
    /**
     * Enables optimization of the build output. Including minification of scripts and styles,
     * tree-shaking and dead-code elimination. For more information, see
     * https://angular.io/guide/workspace-config#optimization-configuration.
     */
    optimization?: OptimizationUnion;
    /**
     * Define the output filename cache-busting hashing mode.
     */
    outputHashing?: OutputHashing;
    /**
     * Path where output will be placed.
     */
    outputPath: string;
    /**
     * Enable and define the file watching poll time period in milliseconds.
     */
    poll?: number;
    /**
     * Do not use the real path when resolving modules. If unset then will default to `true` if
     * NodeJS option --preserve-symlinks is set.
     */
    preserveSymlinks?: boolean;
    /**
     * Log progress to the console while building.
     */
    progress?: boolean;
    /**
     * The path where style resources will be placed, relative to outputPath.
     */
    resourcesOutputPath?: string;
    /**
     * Show circular dependency warnings on builds.
     * @deprecated The recommended method to detect circular dependencies in project code is to
     * use either a lint rule or other external tooling.
     */
    showCircularDependencies?: boolean;
    /**
     * Output source maps for scripts and styles. For more information, see
     * https://angular.io/guide/workspace-config#source-map-configuration.
     */
    sourceMap?: SourceMapUnion;
    /**
     * Generates a 'stats.json' file which can be analyzed using tools such as
     * 'webpack-bundle-analyzer'.
     */
    statsJson?: boolean;
    /**
     * Options to pass to style preprocessors
     */
    stylePreprocessorOptions?: StylePreprocessorOptions;
    /**
     * The name of the TypeScript configuration file.
     */
    tsConfig: string;
    /**
     * Adds more details to output logging.
     */
    verbose?: boolean;
    /**
     * Run build when files change.
     */
    watch?: boolean;
}
/**
 * Which external dependencies to bundle into the bundle. By default, all of node_modules
 * will be bundled.
 */
export declare type BundleDependenciesUnion = boolean | BundleDependenciesEnum;
export declare enum BundleDependenciesEnum {
    All = "all",
    None = "none"
}
export interface FileReplacement {
    replace?: string;
    replaceWith?: string;
    src?: string;
    with?: string;
}
/**
 * How to handle duplicate translations for i18n.
 *
 * How to handle missing translations for i18n.
 */
export declare enum I18NTranslation {
    Error = "error",
    Ignore = "ignore",
    Warning = "warning"
}
/**
 * The stylesheet language to use for the application's inline component styles.
 */
export declare enum InlineStyleLanguage {
    Css = "css",
    Less = "less",
    Sass = "sass",
    Scss = "scss"
}
/**
 * Translate the bundles in one or more locales.
 */
export declare type Localize = string[] | boolean;
/**
 * Enables optimization of the build output. Including minification of scripts and styles,
 * tree-shaking and dead-code elimination. For more information, see
 * https://angular.io/guide/workspace-config#optimization-configuration.
 */
export declare type OptimizationUnion = boolean | OptimizationClass;
export interface OptimizationClass {
    /**
     * Enables optimization of the scripts output.
     */
    scripts?: boolean;
    /**
     * Enables optimization of the styles output.
     */
    styles?: boolean;
}
/**
 * Define the output filename cache-busting hashing mode.
 */
export declare enum OutputHashing {
    All = "all",
    Bundles = "bundles",
    Media = "media",
    None = "none"
}
/**
 * Output source maps for scripts and styles. For more information, see
 * https://angular.io/guide/workspace-config#source-map-configuration.
 */
export declare type SourceMapUnion = boolean | SourceMapClass;
export interface SourceMapClass {
    /**
     * Output source maps used for error reporting tools.
     */
    hidden?: boolean;
    /**
     * Output source maps for all scripts.
     */
    scripts?: boolean;
    /**
     * Output source maps for all styles.
     */
    styles?: boolean;
    /**
     * Resolve vendor packages source maps.
     */
    vendor?: boolean;
}
/**
 * Options to pass to style preprocessors
 */
export interface StylePreprocessorOptions {
    /**
     * Paths to include. Paths will be resolved to workspace root.
     */
    includePaths?: string[];
}
