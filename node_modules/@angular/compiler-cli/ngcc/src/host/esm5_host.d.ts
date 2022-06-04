/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/ngcc/src/host/esm5_host" />
import ts from 'typescript';
import { ClassDeclaration, ClassMember, Declaration, Decorator, FunctionDefinition } from '../../../src/ngtsc/reflection';
import { Esm2015ReflectionHost, ParamInfo } from './esm2015_host';
import { NgccClassSymbol } from './ngcc_host';
/**
 * ESM5 packages contain ECMAScript IIFE functions that act like classes. For example:
 *
 * ```
 * var CommonModule = (function () {
 *  function CommonModule() {
 *  }
 *  CommonModule.decorators = [ ... ];
 *  return CommonModule;
 * ```
 *
 * * "Classes" are decorated if they have a static property called `decorators`.
 * * Members are decorated if there is a matching key on a static property
 *   called `propDecorators`.
 * * Constructor parameters decorators are found on an object returned from
 *   a static method called `ctorParameters`.
 *
 */
export declare class Esm5ReflectionHost extends Esm2015ReflectionHost {
    getBaseClassExpression(clazz: ClassDeclaration): ts.Expression | null;
    /**
     * Trace an identifier to its declaration, if possible.
     *
     * This method attempts to resolve the declaration of the given identifier, tracing back through
     * imports and re-exports until the original declaration statement is found. A `Declaration`
     * object is returned if the original declaration is found, or `null` is returned otherwise.
     *
     * In ES5, the implementation of a class is a function expression that is hidden inside an IIFE.
     * If we are looking for the declaration of the identifier of the inner function expression, we
     * will get hold of the outer "class" variable declaration and return its identifier instead. See
     * `getClassDeclarationFromInnerFunctionDeclaration()` for more info.
     *
     * @param id a TypeScript `ts.Identifier` to trace back to a declaration.
     *
     * @returns metadata about the `Declaration` if the original declaration is found, or `null`
     * otherwise.
     */
    getDeclarationOfIdentifier(id: ts.Identifier): Declaration | null;
    /**
     * Parse a function declaration to find the relevant metadata about it.
     *
     * In ESM5 we need to do special work with optional arguments to the function, since they get
     * their own initializer statement that needs to be parsed and then not included in the "body"
     * statements of the function.
     *
     * @param node the function declaration to parse.
     * @returns an object containing the node, statements and parameters of the function.
     */
    getDefinitionOfFunction(node: ts.Node): FunctionDefinition | null;
    /**
     * Check whether a `Declaration` corresponds with a known declaration, such as a TypeScript helper
     * function, and set its `known` property to the appropriate `KnownDeclaration`.
     *
     * @param decl The `Declaration` to check.
     * @return The passed in `Declaration` (potentially enhanced with a `KnownDeclaration`).
     */
    detectKnownDeclaration<T extends Declaration>(decl: T): T;
    /**
     * In ES5, the implementation of a class is a function expression that is hidden inside an IIFE,
     * whose value is assigned to a variable (which represents the class to the rest of the program).
     * So we might need to dig around to get hold of the "class" declaration.
     *
     * This method extracts a `NgccClassSymbol` if `declaration` is the function declaration inside
     * the IIFE. Otherwise, undefined is returned.
     *
     * @param declaration the declaration whose symbol we are finding.
     * @returns the symbol for the node or `undefined` if it is not a "class" or has no symbol.
     */
    protected getClassSymbolFromInnerDeclaration(declaration: ts.Node): NgccClassSymbol | undefined;
    /**
     * Find the declarations of the constructor parameters of a class identified by its symbol.
     *
     * In ESM5, there is no "class" so the constructor that we want is actually the inner function
     * declaration inside the IIFE, whose return value is assigned to the outer variable declaration
     * (that represents the class to the rest of the program).
     *
     * @param classSymbol the symbol of the class (i.e. the outer variable declaration) whose
     * parameters we want to find.
     * @returns an array of `ts.ParameterDeclaration` objects representing each of the parameters in
     * the class's constructor or `null` if there is no constructor.
     */
    protected getConstructorParameterDeclarations(classSymbol: NgccClassSymbol): ts.ParameterDeclaration[] | null;
    /**
     * Get the parameter type and decorators for the constructor of a class,
     * where the information is stored on a static method of the class.
     *
     * In this case the decorators are stored in the body of a method
     * (`ctorParatemers`) attached to the constructor function.
     *
     * Note that unlike ESM2015 this is a function expression rather than an arrow
     * function:
     *
     * ```
     * SomeDirective.ctorParameters = function() { return [
     *   { type: ViewContainerRef, },
     *   { type: TemplateRef, },
     *   { type: IterableDiffers, },
     *   { type: undefined, decorators: [{ type: Inject, args: [INJECTED_TOKEN,] },] },
     * ]; };
     * ```
     *
     * @param paramDecoratorsProperty the property that holds the parameter info we want to get.
     * @returns an array of objects containing the type and decorators for each parameter.
     */
    protected getParamInfoFromStaticProperty(paramDecoratorsProperty: ts.Symbol): ParamInfo[] | null;
    /**
     * Reflect over a symbol and extract the member information, combining it with the
     * provided decorator information, and whether it is a static member.
     *
     * If a class member uses accessors (e.g getters and/or setters) then it gets downleveled
     * in ES5 to a single `Object.defineProperty()` call. In that case we must parse this
     * call to extract the one or two ClassMember objects that represent the accessors.
     *
     * @param symbol the symbol for the member to reflect over.
     * @param decorators an array of decorators associated with the member.
     * @param isStatic true if this member is static, false if it is an instance property.
     * @returns the reflected member information, or null if the symbol is not a member.
     */
    protected reflectMembers(symbol: ts.Symbol, decorators?: Decorator[], isStatic?: boolean): ClassMember[] | null;
    /**
     * Find statements related to the given class that may contain calls to a helper.
     *
     * In ESM5 code the helper calls are hidden inside the class's IIFE.
     *
     * @param classSymbol the class whose helper calls we are interested in. We expect this symbol
     * to reference the inner identifier inside the IIFE.
     * @returns an array of statements that may contain helper calls.
     */
    protected getStatementsForClass(classSymbol: NgccClassSymbol): ts.Statement[];
    /**
     * A constructor function may have been "synthesized" by TypeScript during JavaScript emit,
     * in the case no user-defined constructor exists and e.g. property initializers are used.
     * Those initializers need to be emitted into a constructor in JavaScript, so the TypeScript
     * compiler generates a synthetic constructor.
     *
     * We need to identify such constructors as ngcc needs to be able to tell if a class did
     * originally have a constructor in the TypeScript source. For ES5, we can not tell an
     * empty constructor apart from a synthesized constructor, but fortunately that does not
     * matter for the code generated by ngtsc.
     *
     * When a class has a superclass however, a synthesized constructor must not be considered
     * as a user-defined constructor as that prevents a base factory call from being created by
     * ngtsc, resulting in a factory function that does not inject the dependencies of the
     * superclass. Hence, we identify a default synthesized super call in the constructor body,
     * according to the structure that TypeScript's ES2015 to ES5 transformer generates in
     * https://github.com/Microsoft/TypeScript/blob/v3.2.2/src/compiler/transformers/es2015.ts#L1082-L1098
     *
     * Additionally, we handle synthetic delegate constructors that are emitted when TypeScript
     * downlevel's ES2015 synthetically generated to ES5. These vary slightly from the default
     * structure mentioned above because the ES2015 output uses a spread operator, for delegating
     * to the parent constructor, that is preserved through a TypeScript helper in ES5. e.g.
     *
     * ```
     * return _super.apply(this, tslib.__spread(arguments)) || this;
     * ```
     *
     * or, since TypeScript 4.2 it would be
     *
     * ```
     * return _super.apply(this, tslib.__spreadArray([], tslib.__read(arguments))) || this;
     * ```
     *
     * Such constructs can be still considered as synthetic delegate constructors as they are
     * the product of a common TypeScript to ES5 synthetic constructor, just being downleveled
     * to ES5 using `tsc`. See: https://github.com/angular/angular/issues/38453.
     *
     *
     * @param constructor a constructor function to test
     * @returns true if the constructor appears to have been synthesized
     */
    private isSynthesizedConstructor;
    /**
     * Identifies synthesized super calls which pass-through function arguments directly and are
     * being assigned to a common `_this` variable. The following patterns we intend to match:
     *
     * 1. Delegate call emitted by TypeScript when it emits ES5 directly.
     *   ```
     *   var _this = _super !== null && _super.apply(this, arguments) || this;
     *   ```
     *
     * 2. Delegate call emitted by TypeScript when it downlevel's ES2015 to ES5.
     *   ```
     *   var _this = _super.apply(this, tslib.__spread(arguments)) || this;
     *   ```
     *   or using the syntax emitted since TypeScript 4.2:
     *   ```
     *   return _super.apply(this, tslib.__spreadArray([], tslib.__read(arguments))) || this;
     *   ```
     *
     * @param statement a statement that may be a synthesized super call
     * @returns true if the statement looks like a synthesized super call
     */
    private isSynthesizedSuperThisAssignment;
    /**
     * Identifies synthesized super calls which pass-through function arguments directly and
     * are being returned. The following patterns correspond to synthetic super return calls:
     *
     * 1. Delegate call emitted by TypeScript when it emits ES5 directly.
     *   ```
     *   return _super !== null && _super.apply(this, arguments) || this;
     *   ```
     *
     * 2. Delegate call emitted by TypeScript when it downlevel's ES2015 to ES5.
     *   ```
     *   return _super.apply(this, tslib.__spread(arguments)) || this;
     *   ```
     *   or using the syntax emitted since TypeScript 4.2:
     *   ```
     *   return _super.apply(this, tslib.__spreadArray([], tslib.__read(arguments))) || this;
     *   ```
     *
     * @param statement a statement that may be a synthesized super call
     * @returns true if the statement looks like a synthesized super call
     */
    private isSynthesizedSuperReturnStatement;
    /**
     * Identifies synthesized super calls which pass-through function arguments directly. The
     * synthetic delegate super call match the following patterns we intend to match:
     *
     * 1. Delegate call emitted by TypeScript when it emits ES5 directly.
     *   ```
     *   _super !== null && _super.apply(this, arguments) || this;
     *   ```
     *
     * 2. Delegate call emitted by TypeScript when it downlevel's ES2015 to ES5.
     *   ```
     *   _super.apply(this, tslib.__spread(arguments)) || this;
     *   ```
     *   or using the syntax emitted since TypeScript 4.2:
     *   ```
     *   return _super.apply(this, tslib.__spreadArray([], tslib.__read(arguments))) || this;
     *   ```
     *
     * @param expression an expression that may represent a default super call
     * @returns true if the expression corresponds with the above form
     */
    private isSynthesizedDefaultSuperCall;
    /**
     * Tests whether the expression corresponds to a `super` call passing through
     * function arguments without any modification. e.g.
     *
     * ```
     * _super !== null && _super.apply(this, arguments) || this;
     * ```
     *
     * This structure is generated by TypeScript when transforming ES2015 to ES5, see
     * https://github.com/Microsoft/TypeScript/blob/v3.2.2/src/compiler/transformers/es2015.ts#L1148-L1163
     *
     * Additionally, we also handle cases where `arguments` are wrapped by a TypeScript spread
     * helper.
     * This can happen if ES2015 class output contain auto-generated constructors due to class
     * members. The ES2015 output will be using `super(...arguments)` to delegate to the superclass,
     * but once downleveled to ES5, the spread operator will be persisted through a TypeScript spread
     * helper. For example:
     *
     * ```
     * _super.apply(this, __spread(arguments)) || this;
     * ```
     *
     * or, since TypeScript 4.2 it would be
     *
     * ```
     * _super.apply(this, tslib.__spreadArray([], tslib.__read(arguments))) || this;
     * ```
     *
     * More details can be found in: https://github.com/angular/angular/issues/38453.
     *
     * @param expression an expression that may represent a default super call
     * @returns true if the expression corresponds with the above form
     */
    private isSuperApplyCall;
    /**
     * Determines if the provided expression is one of the following call expressions:
     *
     * 1. `__spread(arguments)`
     * 2. `__spreadArray([], __read(arguments))`
     * 3. `__spreadArray([], __read(arguments), false)`
     *
     * The tslib helpers may have been emitted inline as in the above example, or they may be read
     * from a namespace import.
     */
    private isSpreadArgumentsExpression;
    /**
     * Inspects the provided expression and determines if it corresponds with a known helper function
     * as receiver expression.
     */
    private extractKnownHelperCall;
}
