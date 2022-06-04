/**
 * Pass this schematic to the "run" command to set up server-side rendering for an app.
 */
export interface Schema {
    /**
     * The name of the application folder.
     */
    appDir?: string;
    /**
     * The application identifier to use for transition.
     */
    appId?: string;
    /**
     * The name of the main entry-point file.
     */
    main?: string;
    /**
     * The name of the project.
     */
    project: string;
    /**
     * The name of the root NgModule class.
     */
    rootModuleClassName?: string;
    /**
     * The name of the root NgModule file.
     */
    rootModuleFileName?: string;
    /**
     * Do not install packages for dependencies.
     */
    skipInstall?: boolean;
}
