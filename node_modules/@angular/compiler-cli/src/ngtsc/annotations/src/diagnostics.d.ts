/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/annotations/src/diagnostics" />
import ts from 'typescript';
import { FatalDiagnosticError } from '../../diagnostics';
import { Reference } from '../../imports';
import { InjectableClassRegistry, MetadataReader } from '../../metadata';
import { PartialEvaluator, ResolvedValue } from '../../partial_evaluator';
import { ClassDeclaration, ReflectionHost } from '../../reflection';
import { LocalModuleScopeRegistry } from '../../scope';
/**
 * Creates a `FatalDiagnosticError` for a node that did not evaluate to the expected type. The
 * diagnostic that is created will include details on why the value is incorrect, i.e. it includes
 * a representation of the actual type that was unsupported, or in the case of a dynamic value the
 * trace to the node where the dynamic value originated.
 *
 * @param node The node for which the diagnostic should be produced.
 * @param value The evaluated value that has the wrong type.
 * @param messageText The message text of the error.
 */
export declare function createValueHasWrongTypeError(node: ts.Node, value: ResolvedValue, messageText: string): FatalDiagnosticError;
/**
 * Gets the diagnostics for a set of provider classes.
 * @param providerClasses Classes that should be checked.
 * @param providersDeclaration Node that declares the providers array.
 * @param registry Registry that keeps track of the registered injectable classes.
 */
export declare function getProviderDiagnostics(providerClasses: Set<Reference<ClassDeclaration>>, providersDeclaration: ts.Expression, registry: InjectableClassRegistry): ts.Diagnostic[];
export declare function getDirectiveDiagnostics(node: ClassDeclaration, reader: MetadataReader, evaluator: PartialEvaluator, reflector: ReflectionHost, scopeRegistry: LocalModuleScopeRegistry, kind: string): ts.Diagnostic[] | null;
export declare function getUndecoratedClassWithAngularFeaturesDiagnostic(node: ClassDeclaration): ts.Diagnostic;
export declare function checkInheritanceOfDirective(node: ClassDeclaration, reader: MetadataReader, reflector: ReflectionHost, evaluator: PartialEvaluator): ts.Diagnostic | null;
