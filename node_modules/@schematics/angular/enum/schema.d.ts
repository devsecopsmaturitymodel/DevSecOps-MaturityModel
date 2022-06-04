/**
 * Generates a new, generic enum definition for the given or default project.
 */
export interface Schema {
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
