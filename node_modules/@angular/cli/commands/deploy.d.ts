/**
 * Invokes the deploy builder for a specified project or for the default project in the
 * workspace.
 */
export interface Schema {
    /**
     * One or more named builder configurations as a comma-separated list as specified in the
     * "configurations" section of angular.json.
     * The builder uses the named configurations to run the given target.
     * For more information, see
     * https://angular.io/guide/workspace-config#alternate-build-configurations.
     */
    configuration?: string;
    /**
     * Shows a help message for this command in the console.
     */
    help?: HelpUnion;
    /**
     * The name of the project to deploy.
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
