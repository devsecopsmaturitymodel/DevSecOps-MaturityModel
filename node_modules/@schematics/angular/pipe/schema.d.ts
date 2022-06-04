/**
 * Creates a new, generic pipe definition in the given or default project.
 */
export interface Schema {
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
