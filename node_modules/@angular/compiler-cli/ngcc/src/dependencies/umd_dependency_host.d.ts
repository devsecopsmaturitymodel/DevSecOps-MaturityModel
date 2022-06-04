/// <amd-module name="@angular/compiler-cli/ngcc/src/dependencies/umd_dependency_host" />
import { AbsoluteFsPath } from '../../../src/ngtsc/file_system';
import { DependencyHostBase } from './dependency_host';
/**
 * Helper functions for computing dependencies.
 */
export declare class UmdDependencyHost extends DependencyHostBase {
    protected canSkipFile(fileContents: string): boolean;
    protected extractImports(file: AbsoluteFsPath, fileContents: string): Set<string>;
}
