/**
 * Creates a new project by combining the workspace and application schematics.
 */
export interface Schema {
    /**
     * Initial git repository commit information.
     */
    commit?: CommitUnion;
    /**
     * Create a new initial application project in the 'src' folder of the new workspace. When
     * false, creates an empty workspace with no initial application. You can then use the
     * generate application command so that all applications are created in the projects folder.
     */
    createApplication?: boolean;
    /**
     * The directory name to create the workspace in.
     */
    directory?: string;
    /**
     * Include styles inline in the component TS file. By default, an external styles file is
     * created and referenced in the component TypeScript file.
     */
    inlineStyle?: boolean;
    /**
     * Include template inline in the component TS file. By default, an external template file
     * is created and referenced in the component TypeScript file.
     */
    inlineTemplate?: boolean;
    /**
     * Link the CLI to the global version (internal development only).
     */
    linkCli?: boolean;
    /**
     * Create a workspace without any testing frameworks. (Use for learning purposes only.)
     */
    minimal?: boolean;
    /**
     * The name of the new workspace and initial project.
     */
    name: string;
    /**
     * The path where new projects will be created, relative to the new workspace root.
     */
    newProjectRoot?: string;
    /**
     * The package manager used to install dependencies.
     */
    packageManager?: PackageManager;
    /**
     * The prefix to apply to generated selectors for the initial project.
     */
    prefix?: string;
    /**
     * Generate a routing module for the initial project.
     */
    routing?: boolean;
    /**
     * Do not initialize a git repository.
     */
    skipGit?: boolean;
    /**
     * Do not install dependency packages.
     */
    skipInstall?: boolean;
    /**
     * Do not generate "spec.ts" test files for the new project.
     */
    skipTests?: boolean;
    /**
     * Creates a workspace with stricter type checking and stricter bundle budgets settings.
     * This setting helps improve maintainability and catch bugs ahead of time. For more
     * information, see https://angular.io/guide/strict-mode
     */
    strict?: boolean;
    /**
     * The file extension or preprocessor to use for style files.
     */
    style?: Style;
    /**
     * The version of the Angular CLI to use.
     */
    version: string;
    /**
     * The view encapsulation strategy to use in the initial project.
     */
    viewEncapsulation?: ViewEncapsulation;
}
/**
 * Initial git repository commit information.
 */
export declare type CommitUnion = boolean | CommitObject;
export interface CommitObject {
    email: string;
    message?: string;
    name: string;
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
/**
 * The file extension or preprocessor to use for style files.
 */
export declare enum Style {
    Css = "css",
    Less = "less",
    Sass = "sass",
    Scss = "scss"
}
/**
 * The view encapsulation strategy to use in the initial project.
 */
export declare enum ViewEncapsulation {
    Emulated = "Emulated",
    None = "None",
    ShadowDom = "ShadowDom"
}
