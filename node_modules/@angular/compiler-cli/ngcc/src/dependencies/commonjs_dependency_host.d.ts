/// <amd-module name="@angular/compiler-cli/ngcc/src/dependencies/commonjs_dependency_host" />
import { AbsoluteFsPath } from '../../../src/ngtsc/file_system';
import { DependencyHostBase } from './dependency_host';
/**
 * Helper functions for computing dependencies.
 */
export declare class CommonJsDependencyHost extends DependencyHostBase {
    protected canSkipFile(fileContents: string): boolean;
    protected extractImports(file: AbsoluteFsPath, fileContents: string): Set<string>;
}
/**
 * Check whether a source file needs to be parsed for imports.
 * This is a performance short-circuit, which saves us from creating
 * a TypeScript AST unnecessarily.
 *
 * @param source The content of the source file to check.
 *
 * @returns false if there are definitely no require calls
 * in this file, true otherwise.
 */
export declare function hasRequireCalls(source: string): boolean;
