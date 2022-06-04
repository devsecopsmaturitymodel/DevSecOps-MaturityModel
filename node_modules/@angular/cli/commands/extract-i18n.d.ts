/**
 * Extracts i18n messages from source code.
 */
export interface Schema {
    /**
     * One or more named builder configurations as a comma-separated list as specified in the
     * "configurations" section of angular.json.
     * The builder uses the named configurations to run the given target.
     * For more information, see
     * https://angular.io/guide/workspace-config#alternate-build-configurations.
     * Setting this explicitly overrides the "--prod" flag.
     */
    configuration?: string;
    /**
     * Shows a help message for this command in the console.
     */
    help?: HelpUnion;
    /**
     * Shorthand for "--configuration=production".
     * Set the build configuration to the production target.
     * By default, the production target is set up in the workspace configuration such that all
     * builds make use of bundling, limited tree-shaking, and also limited dead code elimination.
     */
    prod?: boolean;
    /**
     * The name of the project to build. Can be an application or a library.
     */
    project?: string;
}
/**
 * Shows a help message for this command in the console.
 */
export declare type HelpUnion = boolean | HelpEnum;
export declare enum HelpEnum {
    HelpJson = "JSON",
    Json = "json"
}
