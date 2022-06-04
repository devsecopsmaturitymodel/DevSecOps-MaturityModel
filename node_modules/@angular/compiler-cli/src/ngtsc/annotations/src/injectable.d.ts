/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/annotations/src/injectable" />
import { R3ClassMetadata, R3DependencyMetadata, R3InjectableMetadata } from '@angular/compiler';
import { InjectableClassRegistry } from '../../metadata';
import { PerfRecorder } from '../../perf';
import { ClassDeclaration, Decorator, ReflectionHost } from '../../reflection';
import { AnalysisOutput, CompileResult, DecoratorHandler, DetectResult, HandlerPrecedence } from '../../transform';
export interface InjectableHandlerData {
    meta: R3InjectableMetadata;
    classMetadata: R3ClassMetadata | null;
    ctorDeps: R3DependencyMetadata[] | 'invalid' | null;
    needsFactory: boolean;
}
/**
 * Adapts the `compileInjectable` compiler for `@Injectable` decorators to the Ivy compiler.
 */
export declare class InjectableDecoratorHandler implements DecoratorHandler<Decorator, InjectableHandlerData, null, unknown> {
    private reflector;
    private isCore;
    private strictCtorDeps;
    private injectableRegistry;
    private perf;
    /**
     * What to do if the injectable already contains a ɵprov property.
     *
     * If true then an error diagnostic is reported.
     * If false then there is no error and a new ɵprov property is not added.
     */
    private errorOnDuplicateProv;
    constructor(reflector: ReflectionHost, isCore: boolean, strictCtorDeps: boolean, injectableRegistry: InjectableClassRegistry, perf: PerfRecorder, 
    /**
     * What to do if the injectable already contains a ɵprov property.
     *
     * If true then an error diagnostic is reported.
     * If false then there is no error and a new ɵprov property is not added.
     */
    errorOnDuplicateProv?: boolean);
    readonly precedence = HandlerPrecedence.SHARED;
    readonly name: string;
    detect(node: ClassDeclaration, decorators: Decorator[] | null): DetectResult<Decorator> | undefined;
    analyze(node: ClassDeclaration, decorator: Readonly<Decorator>): AnalysisOutput<InjectableHandlerData>;
    symbol(): null;
    register(node: ClassDeclaration): void;
    compileFull(node: ClassDeclaration, analysis: Readonly<InjectableHandlerData>): CompileResult[];
    compilePartial(node: ClassDeclaration, analysis: Readonly<InjectableHandlerData>): CompileResult[];
    private compile;
}
