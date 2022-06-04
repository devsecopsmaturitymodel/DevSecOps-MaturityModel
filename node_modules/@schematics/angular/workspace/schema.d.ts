/**
 * Initializes an empty workspace and adds the necessary dependencies required by an Angular
 * application.
 */
export interface Schema {
    /**
     * Create a workspace without any testing frameworks. (Use for learning purposes only.)
     */
    minimal?: boolean;
    /**
     * The name of the workspace.
     */
    name: string;
    /**
     * The path where new projects will be created.
     */
    newProjectRoot?: string;
    /**
     * The package manager used to install dependencies.
     */
    packageManager?: PackageManager;
    /**
     * Create a workspace with stricter type checking options. This setting helps improve
     * maintainability and catch bugs ahead of time. For more information, see
     * https://angular.io/strict
     */
    strict?: boolean;
    /**
     * The version of the Angular CLI to use.
     */
    version: string;
}
/**
 * The package manager used to install dependencies.
 */
export declare enum PackageManager {
    Cnpm = "cnpm",
    Npm = "npm",
    Pnpm = "pnpm",
    Yarn = "yarn"
}
