/**
 * Pass this schematic to the "run" command to create a service worker
 */
export interface Schema {
    /**
     * The name of the project.
     */
    project: string;
    /**
     * The target to apply service worker to.
     */
    target?: string;
}
