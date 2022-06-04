/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/metadata/src/property_mapping" />
import { InputOutputPropertySet } from '@angular/compiler';
/**
 * The name of a class property that backs an input or output declared by a directive or component.
 *
 * This type exists for documentation only.
 */
export declare type ClassPropertyName = string;
/**
 * The name by which an input or output of a directive or component is bound in an Angular template.
 *
 * This type exists for documentation only.
 */
export declare type BindingPropertyName = string;
/**
 * An input or output of a directive that has both a named JavaScript class property on a component
 * or directive class, as well as an Angular template property name used for binding.
 */
export interface InputOrOutput {
    /**
     * The name of the JavaScript property on the component or directive instance for this input or
     * output.
     */
    readonly classPropertyName: ClassPropertyName;
    /**
     * The property name used to bind this input or output in an Angular template.
     */
    readonly bindingPropertyName: BindingPropertyName;
}
/**
 * A mapping of component property and template binding property names, for example containing the
 * inputs of a particular directive or component.
 *
 * A single component property has exactly one input/output annotation (and therefore one binding
 * property name) associated with it, but the same binding property name may be shared across many
 * component property names.
 *
 * Allows bidirectional querying of the mapping - looking up all inputs/outputs with a given
 * property name, or mapping from a specific class property to its binding property name.
 */
export declare class ClassPropertyMapping implements InputOutputPropertySet {
    /**
     * Mapping from class property names to the single `InputOrOutput` for that class property.
     */
    private forwardMap;
    /**
     * Mapping from property names to one or more `InputOrOutput`s which share that name.
     */
    private reverseMap;
    private constructor();
    /**
     * Construct a `ClassPropertyMapping` with no entries.
     */
    static empty(): ClassPropertyMapping;
    /**
     * Construct a `ClassPropertyMapping` from a primitive JS object which maps class property names
     * to either binding property names or an array that contains both names, which is used in on-disk
     * metadata formats (e.g. in .d.ts files).
     */
    static fromMappedObject(obj: {
        [classPropertyName: string]: BindingPropertyName | [ClassPropertyName, BindingPropertyName];
    }): ClassPropertyMapping;
    /**
     * Merge two mappings into one, with class properties from `b` taking precedence over class
     * properties from `a`.
     */
    static merge(a: ClassPropertyMapping, b: ClassPropertyMapping): ClassPropertyMapping;
    /**
     * All class property names mapped in this mapping.
     */
    get classPropertyNames(): ClassPropertyName[];
    /**
     * All binding property names mapped in this mapping.
     */
    get propertyNames(): BindingPropertyName[];
    /**
     * Check whether a mapping for the given property name exists.
     */
    hasBindingPropertyName(propertyName: BindingPropertyName): boolean;
    /**
     * Lookup all `InputOrOutput`s that use this `propertyName`.
     */
    getByBindingPropertyName(propertyName: string): ReadonlyArray<InputOrOutput> | null;
    /**
     * Lookup the `InputOrOutput` associated with a `classPropertyName`.
     */
    getByClassPropertyName(classPropertyName: string): InputOrOutput | null;
    /**
     * Convert this mapping to a primitive JS object which maps each class property directly to the
     * binding property name associated with it.
     */
    toDirectMappedObject(): {
        [classPropertyName: string]: BindingPropertyName;
    };
    /**
     * Convert this mapping to a primitive JS object which maps each class property either to itself
     * (for cases where the binding property name is the same) or to an array which contains both
     * names if they differ.
     *
     * This object format is used when mappings are serialized (for example into .d.ts files).
     */
    toJointMappedObject(): {
        [classPropertyName: string]: BindingPropertyName | [BindingPropertyName, ClassPropertyName];
    };
    /**
     * Implement the iterator protocol and return entry objects which contain the class and binding
     * property names (and are useful for destructuring).
     */
    [Symbol.iterator](): IterableIterator<[ClassPropertyName, BindingPropertyName]>;
}
