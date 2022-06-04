/**
 * Generates a new, generic resolver definition in the given or default project.
 */
export interface Schema {
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
