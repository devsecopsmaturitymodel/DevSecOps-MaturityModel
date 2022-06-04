/// <amd-module name="@angular/compiler-cli/linker/src/ast/ast_value" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as o from '@angular/compiler';
import { AstHost, Range } from './ast_host';
/**
 * Represents only those types in `T` that are object types.
 */
declare type ObjectType<T> = Extract<T, object>;
/**
 * Represents the value type of an object literal.
 */
declare type ObjectValueType<T> = T extends Record<string, infer R> ? R : never;
/**
 * Represents the value type of an array literal.
 */
declare type ArrayValueType<T> = T extends Array<infer R> ? R : never;
/**
 * Ensures that `This` has its generic type `Actual` conform to the expected generic type in
 * `Expected`, to disallow calling a method if the generic type does not conform.
 */
declare type ConformsTo<This, Actual, Expected> = Actual extends Expected ? This : never;
/**
 * Ensures that `This` is an `AstValue` whose generic type conforms to `Expected`, to disallow
 * calling a method if the value's type does not conform.
 */
declare type HasValueType<This, Expected> = This extends AstValue<infer Actual, any> ? ConformsTo<This, Actual, Expected> : never;
/**
 * Represents only the string keys of type `T`.
 */
declare type PropertyKey<T> = keyof T & string;
/**
 * This helper class wraps an object expression along with an `AstHost` object, exposing helper
 * methods that make it easier to extract the properties of the object.
 *
 * The generic `T` is used as reference type of the expected structure that is represented by this
 * object. It does not achieve full type-safety for the provided operations in correspondence with
 * `T`; its main goal is to provide references to a documented type and ensure that the properties
 * that are read from the object are present.
 *
 * Unfortunately, the generic types are unable to prevent reading an optional property from the
 * object without first having called `has` to ensure that the property exists. This is one example
 * of where full type-safety is not achieved.
 */
export declare class AstObject<T extends object, TExpression> {
    readonly expression: TExpression;
    private obj;
    private host;
    /**
     * Create a new `AstObject` from the given `expression` and `host`.
     */
    static parse<T extends object, TExpression>(expression: TExpression, host: AstHost<TExpression>): AstObject<T, TExpression>;
    private constructor();
    /**
     * Returns true if the object has a property called `propertyName`.
     */
    has(propertyName: PropertyKey<T>): boolean;
    /**
     * Returns the number value of the property called `propertyName`.
     *
     * Throws an error if there is no such property or the property is not a number.
     */
    getNumber<K extends PropertyKey<T>>(this: ConformsTo<this, T[K], number>, propertyName: K): number;
    /**
     * Returns the string value of the property called `propertyName`.
     *
     * Throws an error if there is no such property or the property is not a string.
     */
    getString<K extends PropertyKey<T>>(this: ConformsTo<this, T[K], string>, propertyName: K): string;
    /**
     * Returns the boolean value of the property called `propertyName`.
     *
     * Throws an error if there is no such property or the property is not a boolean.
     */
    getBoolean<K extends PropertyKey<T>>(this: ConformsTo<this, T[K], boolean>, propertyName: K): boolean;
    /**
     * Returns the nested `AstObject` parsed from the property called `propertyName`.
     *
     * Throws an error if there is no such property or the property is not an object.
     */
    getObject<K extends PropertyKey<T>>(this: ConformsTo<this, T[K], object>, propertyName: K): AstObject<ObjectType<T[K]>, TExpression>;
    /**
     * Returns an array of `AstValue` objects parsed from the property called `propertyName`.
     *
     * Throws an error if there is no such property or the property is not an array.
     */
    getArray<K extends PropertyKey<T>>(this: ConformsTo<this, T[K], unknown[]>, propertyName: K): AstValue<ArrayValueType<T[K]>, TExpression>[];
    /**
     * Returns a `WrappedNodeExpr` object that wraps the expression at the property called
     * `propertyName`.
     *
     * Throws an error if there is no such property.
     */
    getOpaque(propertyName: PropertyKey<T>): o.WrappedNodeExpr<TExpression>;
    /**
     * Returns the raw `TExpression` value of the property called `propertyName`.
     *
     * Throws an error if there is no such property.
     */
    getNode(propertyName: PropertyKey<T>): TExpression;
    /**
     * Returns an `AstValue` that wraps the value of the property called `propertyName`.
     *
     * Throws an error if there is no such property.
     */
    getValue<K extends PropertyKey<T>>(propertyName: K): AstValue<T[K], TExpression>;
    /**
     * Converts the AstObject to a raw JavaScript object, mapping each property value (as an
     * `AstValue`) to the generic type (`T`) via the `mapper` function.
     */
    toLiteral<V>(mapper: (value: AstValue<ObjectValueType<T>, TExpression>) => V): Record<string, V>;
    /**
     * Converts the AstObject to a JavaScript Map, mapping each property value (as an
     * `AstValue`) to the generic type (`T`) via the `mapper` function.
     */
    toMap<V>(mapper: (value: AstValue<ObjectValueType<T>, TExpression>) => V): Map<string, V>;
    private getRequiredProperty;
}
/**
 * This helper class wraps an `expression`, exposing methods that use the `host` to give
 * access to the underlying value of the wrapped expression.
 *
 * The generic `T` is used as reference type of the expected type that is represented by this value.
 * It does not achieve full type-safety for the provided operations in correspondence with `T`; its
 * main goal is to provide references to a documented type.
 */
export declare class AstValue<T, TExpression> {
    readonly expression: TExpression;
    private host;
    constructor(expression: TExpression, host: AstHost<TExpression>);
    /**
     * Get the name of the symbol represented by the given expression node, or `null` if it is not a
     * symbol.
     */
    getSymbolName(): string | null;
    /**
     * Is this value a number?
     */
    isNumber(): boolean;
    /**
     * Parse the number from this value, or error if it is not a number.
     */
    getNumber(this: HasValueType<this, number>): number;
    /**
     * Is this value a string?
     */
    isString(): boolean;
    /**
     * Parse the string from this value, or error if it is not a string.
     */
    getString(this: HasValueType<this, string>): string;
    /**
     * Is this value a boolean?
     */
    isBoolean(): boolean;
    /**
     * Parse the boolean from this value, or error if it is not a boolean.
     */
    getBoolean(this: HasValueType<this, boolean>): boolean;
    /**
     * Is this value an object literal?
     */
    isObject(): boolean;
    /**
     * Parse this value into an `AstObject`, or error if it is not an object literal.
     */
    getObject(this: HasValueType<this, object>): AstObject<ObjectType<T>, TExpression>;
    /**
     * Is this value an array literal?
     */
    isArray(): boolean;
    /**
     * Parse this value into an array of `AstValue` objects, or error if it is not an array literal.
     */
    getArray(this: HasValueType<this, unknown[]>): AstValue<ArrayValueType<T>, TExpression>[];
    /**
     * Is this value a function expression?
     */
    isFunction(): boolean;
    /**
     * Extract the return value as an `AstValue` from this value as a function expression, or error if
     * it is not a function expression.
     */
    getFunctionReturnValue<R>(this: HasValueType<this, Function>): AstValue<R, TExpression>;
    isCallExpression(): boolean;
    getCallee(): AstValue<unknown, TExpression>;
    getArguments(): AstValue<unknown, TExpression>[];
    /**
     * Return the `TExpression` of this value wrapped in a `WrappedNodeExpr`.
     */
    getOpaque(): o.WrappedNodeExpr<TExpression>;
    /**
     * Get the range of the location of this value in the original source.
     */
    getRange(): Range;
}
export {};
