/**
 * Adds support for an external library to your project.
 */
export interface Schema {
    /**
     * The package to be added.
     */
    collection?: string;
    /**
     * Disable interactive input prompts for options with a default.
     */
    defaults?: boolean;
    /**
     * Shows a help message for this command in the console.
     */
    help?: HelpUnion;
    /**
     * Enable interactive input prompts.
     */
    interactive?: boolean;
    /**
     * The NPM registry to use.
     */
    registry?: string;
    /**
     * Skip asking a confirmation prompt before installing and executing the package. Ensure
     * package name is correct prior to using this option.
     */
    skipConfirmation?: boolean;
    /**
     * Display additional details about internal operations during execution.
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
