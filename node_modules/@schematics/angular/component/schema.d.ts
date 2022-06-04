/**
 * Creates a new, generic component definition in the given or default project.
 */
export interface Schema {
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
    style?: Style;
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
export declare enum Style {
    Css = "css",
    Less = "less",
    None = "none",
    Sass = "sass",
    Scss = "scss"
}
/**
 * The view encapsulation strategy to use in the new component.
 */
export declare enum ViewEncapsulation {
    Emulated = "Emulated",
    None = "None",
    ShadowDom = "ShadowDom"
}
