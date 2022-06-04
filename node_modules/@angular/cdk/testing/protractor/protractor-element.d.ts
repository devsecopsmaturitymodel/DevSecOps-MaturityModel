/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementDimensions, ModifierKeys, TestElement, TestKey, TextOptions, EventData } from '@angular/cdk/testing';
import { ElementFinder } from 'protractor';
/**
 * A `TestElement` implementation for Protractor.
 * @deprecated
 * @breaking-change 13.0.0
 */
export declare class ProtractorElement implements TestElement {
    readonly element: ElementFinder;
    constructor(element: ElementFinder);
    /** Blur the element. */
    blur(): Promise<void>;
    /** Clear the element's input (for input and textarea elements only). */
    clear(): Promise<void>;
    /**
     * Click the element at the default location for the current environment. If you need to guarantee
     * the element is clicked at a specific location, consider using `click('center')` or
     * `click(x, y)` instead.
     */
    click(modifiers?: ModifierKeys): Promise<void>;
    /** Click the element at the element's center. */
    click(location: 'center', modifiers?: ModifierKeys): Promise<void>;
    /**
     * Click the element at the specified coordinates relative to the top-left of the element.
     * @param relativeX Coordinate within the element, along the X-axis at which to click.
     * @param relativeY Coordinate within the element, along the Y-axis at which to click.
     * @param modifiers Modifier keys held while clicking
     */
    click(relativeX: number, relativeY: number, modifiers?: ModifierKeys): Promise<void>;
    /**
     * Right clicks on the element at the specified coordinates relative to the top-left of it.
     * @param relativeX Coordinate within the element, along the X-axis at which to click.
     * @param relativeY Coordinate within the element, along the Y-axis at which to click.
     * @param modifiers Modifier keys held while clicking
     */
    rightClick(relativeX: number, relativeY: number, modifiers?: ModifierKeys): Promise<void>;
    /** Focus the element. */
    focus(): Promise<void>;
    /** Get the computed value of the given CSS property for the element. */
    getCssValue(property: string): Promise<string>;
    /** Hovers the mouse over the element. */
    hover(): Promise<void>;
    /** Moves the mouse away from the element. */
    mouseAway(): Promise<void>;
    /**
     * Sends the given string to the input as a series of key presses. Also fires input events
     * and attempts to add the string to the Element's value.
     */
    sendKeys(...keys: (string | TestKey)[]): Promise<void>;
    /**
     * Sends the given string to the input as a series of key presses. Also fires input events
     * and attempts to add the string to the Element's value.
     */
    sendKeys(modifiers: ModifierKeys, ...keys: (string | TestKey)[]): Promise<void>;
    /**
     * Gets the text from the element.
     * @param options Options that affect what text is included.
     */
    text(options?: TextOptions): Promise<string>;
    /** Gets the value for the given attribute from the element. */
    getAttribute(name: string): Promise<string | null>;
    /** Checks whether the element has the given class. */
    hasClass(name: string): Promise<boolean>;
    /** Gets the dimensions of the element. */
    getDimensions(): Promise<ElementDimensions>;
    /** Gets the value of a property of an element. */
    getProperty<T = any>(name: string): Promise<T>;
    /** Sets the value of a property of an input. */
    setInputValue(value: string): Promise<void>;
    /** Selects the options at the specified indexes inside of a native `select` element. */
    selectOptions(...optionIndexes: number[]): Promise<void>;
    /** Checks whether this element matches the given selector. */
    matchesSelector(selector: string): Promise<boolean>;
    /** Checks whether the element is focused. */
    isFocused(): Promise<boolean>;
    /**
     * Dispatches an event with a particular name.
     * @param name Name of the event to be dispatched.
     */
    dispatchEvent(name: string, data?: Record<string, EventData>): Promise<void>;
    /** Dispatches all the events that are part of a click event sequence. */
    private _dispatchClickEventSequence;
}
