export interface Schema {
    $schema?: string;
    cli?: CliOptions;
    /**
     * Default project name used in commands.
     */
    defaultProject?: string;
    /**
     * Path where new projects will be created.
     */
    newProjectRoot?: string;
    projects?: Projects;
    schematics?: SchematicOptions;
    version: number;
}
export interface CliOptions {
    /**
     * Share anonymous usage data with the Angular Team at Google.
     */
    analytics?: Analytics;
    analyticsSharing?: AnalyticsSharing;
    /**
     * Control disk cache.
     */
    cache?: Cache;
    /**
     * The default schematics collection to use.
     */
    defaultCollection?: string;
    /**
     * Specify which package manager tool to use.
     */
    packageManager?: PackageManager;
    /**
     * Control CLI specific console warnings
     */
    warnings?: Warnings;
}
/**
 * Share anonymous usage data with the Angular Team at Google.
 */
export declare type Analytics = boolean | string;
export interface AnalyticsSharing {
    /**
     * Analytics sharing info tracking ID.
     */
    tracking?: string;
    /**
     * Analytics sharing info universally unique identifier.
     */
    uuid?: string;
}
/**
 * Control disk cache.
 */
export interface Cache {
    /**
     * Configure whether disk caching is enabled.
     */
    enabled?: boolean;
    /**
     * Configure in which environment disk cache is enabled.
     */
    environment?: Environment;
    /**
     * Cache base path.
     */
    path?: string;
}
/**
 * Configure in which environment disk cache is enabled.
 */
export declare enum Environment {
    All = "all",
    Ci = "ci",
    Local = "local"
}
/**
 * Specify which package manager tool to use.
 *
 * The package manager used to install dependencies.
 */
export declare enum PackageManager {
    Cnpm = "cnpm",
    Npm = "npm",
    Pnpm = "pnpm",
    Yarn = "yarn"
}
/**
 * Control CLI specific console warnings
 */
export interface Warnings {
    /**
     * Show a warning when the global version is newer than the local one.
     */
    versionMismatch?: boolean;
}
export interface Projects {
}
export interface SchematicOptions {
    "@schematics/angular:application"?: AngularApplicationOptionsSchema;
    "@schematics/angular:class"?: AngularClassOptionsSchema;
    "@schematics/angular:component"?: AngularComponentOptionsSchema;
    "@schematics/angular:directive"?: AngularDirectiveOptionsSchema;
    "@schematics/angular:enum"?: AngularEnumOptionsSchema;
    "@schematics/angular:guard"?: AngularGuardOptionsSchema;
    "@schematics/angular:interceptor"?: AngularInterceptorOptionsSchema;
    "@schematics/angular:interface"?: AngularInterfaceOptionsSchema;
    "@schematics/angular:library"?: LibraryOptionsSchema;
    "@schematics/angular:ng-new"?: AngularNgNewOptionsSchema;
    "@schematics/angular:pipe"?: AngularPipeOptionsSchema;
    "@schematics/angular:resolver"?: AngularResolverOptionsSchema;
    "@schematics/angular:service"?: AngularServiceOptionsSchema;
    "@schematics/angular:web-worker"?: AngularWebWorkerOptionsSchema;
}
/**
 * Generates a new basic application definition in the "projects" subfolder of the workspace.
 */
export interface AngularApplicationOptionsSchema {
    /**
     * Include styles inline in the root component.ts file. Only CSS styles can be included
     * inline. Default is false, meaning that an external styles file is created and referenced
     * in the root component.ts file.
     */
    inlineStyle?: boolean;
    /**
     * Include template inline in the root component.ts file. Default is false, meaning that an
     * external template file is created and referenced in the root component.ts file.
     */
    inlineTemplate?: boolean;
    /**
     * Create a bare-bones project without any testing frameworks. (Use for learning purposes
     * only.)
     */
    minimal?: boolean;
    /**
     * The name of the new app.
     */
    name: string;
    /**
     * A prefix to apply to generated selectors.
     */
    prefix?: string;
    /**
     * The root directory of the new app.
     */
    projectRoot?: string;
    /**
     * Create a routing NgModule.
     */
    routing?: boolean;
    /**
     * Skip installing dependency packages.
     */
    skipInstall?: boolean;
    /**
     * Do not add dependencies to the "package.json" file.
     */
    skipPackageJson?: boolean;
    /**
     * Do not create "spec.ts" test files for the application.
     */
    skipTests?: boolean;
    /**
     * Creates an application with stricter bundle budgets settings.
     */
    strict?: boolean;
    /**
     * The file extension or preprocessor to use for style files.
     */
    style?: SchematicsAngularApplicationStyle;
    /**
     * The view encapsulation strategy to use in the new application.
     */
    viewEncapsulation?: ViewEncapsulation;
}
/**
 * The file extension or preprocessor to use for style files.
 */
export declare enum SchematicsAngularApplicationStyle {
    Css = "css",
    Less = "less",
    Sass = "sass",
    Scss = "scss"
}
/**
 * The view encapsulation strategy to use in the new application.
 *
 * The view encapsulation strategy to use in the new component.
 *
 * The view encapsulation strategy to use in the initial project.
 */
export declare enum ViewEncapsulation {
    Emulated = "Emulated",
    None = "None",
    ShadowDom = "ShadowDom"
}
/**
 * Creates a new, generic class definition in the given or default project.
 */
export interface AngularClassOptionsSchema {
    /**
     * The name of the new class.
     */
    name: string;
    /**
     * The path at which to create the class, relative to the workspace root.
     */
    path?: string;
    /**
     * The name of the project.
     */
    project?: string;
    /**
     * Do not create "spec.ts" test files for the new class.
     */
    skipTests?: boolean;
    /**
     * Adds a developer-defined type to the filename, in the format "name.type.ts".
     */
    type?: string;
}
/**
 * Creates a new, generic component definition in the given or default project.
 */
export interface AngularComponentOptionsSchema {
    /**
     * The change detection strategy to use in the new component.
     */
    changeDetection?: ChangeDetection;
    /**
     * Specifies if the style will contain `:host { display: block; }`.
     */
    displayBlock?: boolean;
    /**
     * The declaring NgModule exports this component.
     */
    export?: boolean;
    /**
     * Create the new files at the top level of the current project.
     */
    flat?: boolean;
    /**
     * Include styles inline in the component.ts file. Only CSS styles can be included inline.
     * By default, an external styles file is created and referenced in the component.ts file.
     */
    inlineStyle?: boolean;
    /**
     * Include template inline in the component.ts file. By default, an external template file
     * is created and referenced in the component.ts file.
     */
    inlineTemplate?: boolean;
    /**
     * The declaring NgModule.
     */
    module?: string;
    /**
     * The name of the component.
     */
    name: string;
    /**
     * The path at which to create the component file, relative to the current workspace.
     * Default is a folder with the same name as the component in the project root.
     */
    path?: string;
    /**
     * The prefix to apply to the generated component selector.
     */
    prefix?: string;
    /**
     * The name of the project.
     */
    project?: string;
    /**
     * The HTML selector to use for this component.
     */
    selector?: string;
    /**
     * Do not import this component into the owning NgModule.
     */
    skipImport?: boolean;
    /**
     * Specifies if the component should have a selector or not.
     */
    skipSelector?: boolean;
    /**
     * Do not create "spec.ts" test files for the new component.
     */
    skipTests?: boolean;
    /**
     * The file extension or preprocessor to use for style files, or 'none' to skip generating
     * the style file.
     */
    style?: SchematicsAngularComponentStyle;
    /**
     * Adds a developer-defined type to the filename, in the format "name.type.ts".
     */
    type?: string;
    /**
     * The view encapsulation strategy to use in the new component.
     */
    viewEncapsulation?: ViewEncapsulation;
}
/**
 * The change detection strategy to use in the new component.
 */
export declare enum ChangeDetection {
    Default = "Default",
    OnPush = "OnPush"
}
/**
 * The file extension or preprocessor to use for style files, or 'none' to skip generating
 * the style file.
 */
export declare enum SchematicsAngularComponentStyle {
    Css = "css",
    Less = "less",
    None = "none",
    Sass = "sass",
    Scss = "scss"
}
/**
 * Creates a new, generic directive definition in the given or default project.
 */
export interface AngularDirectiveOptionsSchema {
    /**
     * The declaring NgModule exports this directive.
     */
    export?: boolean;
    /**
     * When true (the default), creates the new files at the top level of the current project.
     */
    flat?: boolean;
    /**
     * The declaring NgModule.
     */
    module?: string;
    /**
     * The name of the new directive.
     */
    name: string;
    /**
     * The path at which to create the interface that defines the directive, relative to the
     * workspace root.
     */
    path?: string;
    /**
     * A prefix to apply to generated selectors.
     */
    prefix?: string;
    /**
     * The name of the project.
     */
    project?: string;
    /**
     * The HTML selector to use for this directive.
     */
    selector?: string;
    /**
     * Do not import this directive into the owning NgModule.
     */
    skipImport?: boolean;
    /**
     * Do not create "spec.ts" test files for the new class.
     */
    skipTests?: boolean;
}
/**
 * Generates a new, generic enum definition for the given or default project.
 */
export interface AngularEnumOptionsSchema {
    /**
     * The name of the enum.
     */
    name: string;
    /**
     * The path at which to create the enum definition, relative to the current workspace.
     */
    path?: string;
    /**
     * The name of the project in which to create the enum. Default is the configured default
     * project for the workspace.
     */
    project?: string;
    /**
     * Adds a developer-defined type to the filename, in the format "name.type.ts".
     */
    type?: string;
}
/**
 * Generates a new, generic route guard definition in the given or default project.
 */
export interface AngularGuardOptionsSchema {
    /**
     * When true (the default), creates the new files at the top level of the current project.
     */
    flat?: boolean;
    /**
     * Specifies which interfaces to implement.
     */
    implements?: Implement[];
    /**
     * The name of the new route guard.
     */
    name: string;
    /**
     * The path at which to create the interface that defines the guard, relative to the current
     * workspace.
     */
    path?: string;
    /**
     * The name of the project.
     */
    project?: string;
    /**
     * Do not create "spec.ts" test files for the new guard.
     */
    skipTests?: boolean;
}
export declare enum Implement {
    CanActivate = "CanActivate",
    CanActivateChild = "CanActivateChild",
    CanDeactivate = "CanDeactivate",
    CanLoad = "CanLoad"
}
/**
 * Creates a new, generic interceptor definition in the given or default project.
 */
export interface AngularInterceptorOptionsSchema {
    /**
     * When true (the default), creates files at the top level of the project.
     */
    flat?: boolean;
    /**
     * The name of the interceptor.
     */
    name: string;
    /**
     * The path at which to create the interceptor, relative to the workspace root.
     */
    path?: string;
    /**
     * The name of the project.
     */
    project?: string;
    /**
     * Do not create "spec.ts" test files for the new interceptor.
     */
    skipTests?: boolean;
}
/**
 * Creates a new, generic interface definition in the given or default project.
 */
export interface AngularInterfaceOptionsSchema {
    /**
     * The name of the interface.
     */
    name: string;
    /**
     * The path at which to create the interface, relative to the workspace root.
     */
    path?: string;
    /**
     * A prefix to apply to generated selectors.
     */
    prefix?: string;
    /**
     * The name of the project.
     */
    project?: string;
    /**
     * Adds a developer-defined type to the filename, in the format "name.type.ts".
     */
    type?: string;
}
/**
 * Creates a new, generic library project in the current workspace.
 */
export interface LibraryOptionsSchema {
    /**
     * The path at which to create the library's public API file, relative to the workspace root.
     */
    entryFile?: string;
    /**
     * The name of the library.
     */
    name: string;
    /**
     * A prefix to apply to generated selectors.
     */
    prefix?: string;
    /**
     * Do not install dependency packages.
     */
    skipInstall?: boolean;
    /**
     * Do not add dependencies to the "package.json" file.
     */
    skipPackageJson?: boolean;
    /**
     * Do not update "tsconfig.json" to add a path mapping for the new library. The path mapping
     * is needed to use the library in an app, but can be disabled here to simplify development.
     */
    skipTsConfig?: boolean;
}
/**
 * Creates a new project by combining the workspace and application schematics.
 */
export interface AngularNgNewOptionsSchema {
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
    style?: SchematicsAngularApplicationStyle;
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
 * Creates a new, generic pipe definition in the given or default project.
 */
export interface AngularPipeOptionsSchema {
    /**
     * The declaring NgModule exports this pipe.
     */
    export?: boolean;
    /**
     * When true (the default) creates files at the top level of the project.
     */
    flat?: boolean;
    /**
     * The declaring NgModule.
     */
    module?: string;
    /**
     * The name of the pipe.
     */
    name: string;
    /**
     * The path at which to create the pipe, relative to the workspace root.
     */
    path?: string;
    /**
     * The name of the project.
     */
    project?: string;
    /**
     * Do not import this pipe into the owning NgModule.
     */
    skipImport?: boolean;
    /**
     * Do not create "spec.ts" test files for the new pipe.
     */
    skipTests?: boolean;
}
/**
 * Generates a new, generic resolver definition in the given or default project.
 */
export interface AngularResolverOptionsSchema {
    /**
     * When true (the default), creates the new files at the top level of the current project.
     */
    flat?: boolean;
    /**
     * The name of the new resolver.
     */
    name: string;
    /**
     * The path at which to create the interface that defines the resolver, relative to the
     * current workspace.
     */
    path?: string;
    /**
     * The name of the project.
     */
    project?: string;
    /**
     * Do not create "spec.ts" test files for the new resolver.
     */
    skipTests?: boolean;
}
/**
 * Creates a new, generic service definition in the given or default project.
 */
export interface AngularServiceOptionsSchema {
    /**
     * When true (the default), creates files at the top level of the project.
     */
    flat?: boolean;
    /**
     * The name of the service.
     */
    name: string;
    /**
     * The path at which to create the service, relative to the workspace root.
     */
    path?: string;
    /**
     * The name of the project.
     */
    project?: string;
    /**
     * Do not create "spec.ts" test files for the new service.
     */
    skipTests?: boolean;
}
/**
 * Creates a new, generic web worker definition in the given or default project.
 */
export interface AngularWebWorkerOptionsSchema {
    /**
     * The name of the worker.
     */
    name: string;
    /**
     * The path at which to create the worker file, relative to the current workspace.
     */
    path?: string;
    /**
     * The name of the project.
     */
    project: string;
    /**
     * Add a worker creation snippet in a sibling file of the same name.
     */
    snippet?: boolean;
}
