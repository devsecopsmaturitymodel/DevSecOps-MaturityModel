/**
 * Creates a new workspace and an initial Angular application.
 */
export interface Schema {
    /**
     * A collection of schematics to use in generating the initial application.
     */
    collection?: string;
    /**
     * Disable interactive input prompts for options with a default.
     */
    defaults?: boolean;
    /**
     * Run through and reports activity without writing out results.
     */
    dryRun?: boolean;
    /**
     * Force overwriting of existing files.
     */
    force?: boolean;
    /**
     * Shows a help message for this command in the console.
     */
    help?: HelpUnion;
    /**
     * Enable interactive input prompts.
     */
    interactive?: boolean;
    /**
     * Add more details to output logging.
     */
    verbose?: boolean;
}
/**
 * Shows a help message for this command in the console.
 */
export declare type HelpUnion = boolean | HelpEnum;
export declare enum HelpEnum {
    HelpJson = "JSON",
    Json = "json"
}
