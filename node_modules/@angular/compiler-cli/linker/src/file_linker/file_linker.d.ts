/// <amd-module name="@angular/compiler-cli/linker/src/file_linker/file_linker" />
import { AbsoluteFsPath } from '../../../src/ngtsc/file_system';
import { DeclarationScope } from './declaration_scope';
import { LinkerEnvironment } from './linker_environment';
export declare const NO_STATEMENTS: Readonly<any[]>;
/**
 * This class is responsible for linking all the partial declarations found in a single file.
 */
export declare class FileLinker<TConstantScope, TStatement, TExpression> {
    private linkerEnvironment;
    private linkerSelector;
    private emitScopes;
    constructor(linkerEnvironment: LinkerEnvironment<TStatement, TExpression>, sourceUrl: AbsoluteFsPath, code: string);
    /**
     * Return true if the given callee name matches a partial declaration that can be linked.
     */
    isPartialDeclaration(calleeName: string): boolean;
    /**
     * Link the metadata extracted from the args of a call to a partial declaration function.
     *
     * The `declarationScope` is used to determine the scope and strategy of emission of the linked
     * definition and any shared constant statements.
     *
     * @param declarationFn the name of the function used to declare the partial declaration - e.g.
     *     `ɵɵngDeclareDirective`.
     * @param args the arguments passed to the declaration function, should be a single object that
     *     corresponds to the `R3DeclareDirectiveMetadata` or `R3DeclareComponentMetadata` interfaces.
     * @param declarationScope the scope that contains this call to the declaration function.
     */
    linkPartialDeclaration(declarationFn: string, args: TExpression[], declarationScope: DeclarationScope<TConstantScope, TExpression>): TExpression;
    /**
     * Return all the shared constant statements and their associated constant scope references, so
     * that they can be inserted into the source code.
     */
    getConstantStatements(): {
        constantScope: TConstantScope;
        statements: TStatement[];
    }[];
    private getEmitScope;
}
