/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import { ChangeDetectorRef, ElementRef, EventEmitter, OnDestroy, NgZone, AfterViewInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { CanColor, CanDisable, HasTabIndex } from '@angular/material/core';
import * as i0 from "@angular/core";
/**
 * Provider Expression that allows mat-slider to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)] and [formControl].
 * @docs-private
 */
export declare const MAT_SLIDER_VALUE_ACCESSOR: any;
/** A simple change event emitted by the MatSlider component. */
export declare class MatSliderChange {
    /** The MatSlider that changed. */
    source: MatSlider;
    /** The new value of the source slider. */
    value: number | null;
}
/** @docs-private */
declare const _MatSliderBase: import("@angular/material/core")._Constructor<HasTabIndex> & import("@angular/material/core")._AbstractConstructor<HasTabIndex> & import("@angular/material/core")._Constructor<CanColor> & import("@angular/material/core")._AbstractConstructor<CanColor> & import("@angular/material/core")._Constructor<CanDisable> & import("@angular/material/core")._AbstractConstructor<CanDisable> & {
    new (_elementRef: ElementRef): {
        _elementRef: ElementRef;
    };
};
/**
 * Allows users to select from a range of values by moving the slider thumb. It is similar in
 * behavior to the native `<input type="range">` element.
 */
export declare class MatSlider extends _MatSliderBase implements ControlValueAccessor, OnDestroy, CanDisable, CanColor, AfterViewInit, HasTabIndex {
    private _focusMonitor;
    private _changeDetectorRef;
    private _dir;
    private _ngZone;
    _animationMode?: string | undefined;
    /** Whether the slider is inverted. */
    get invert(): boolean;
    set invert(value: BooleanInput);
    private _invert;
    /** The maximum value that the slider can have. */
    get max(): number;
    set max(v: NumberInput);
    private _max;
    /** The minimum value that the slider can have. */
    get min(): number;
    set min(v: NumberInput);
    private _min;
    /** The values at which the thumb will snap. */
    get step(): number;
    set step(v: NumberInput);
    private _step;
    /** Whether or not to show the thumb label. */
    get thumbLabel(): boolean;
    set thumbLabel(value: BooleanInput);
    private _thumbLabel;
    /**
     * How often to show ticks. Relative to the step so that a tick always appears on a step.
     * Ex: Tick interval of 4 with a step of 3 will draw a tick every 4 steps (every 12 values).
     */
    get tickInterval(): 'auto' | number;
    set tickInterval(value: 'auto' | NumberInput);
    private _tickInterval;
    /** Value of the slider. */
    get value(): number;
    set value(v: NumberInput);
    private _value;
    /**
     * Function that will be used to format the value before it is displayed
     * in the thumb label. Can be used to format very large number in order
     * for them to fit into the slider thumb.
     */
    displayWith: (value: number) => string | number;
    /** Text corresponding to the slider's value. Used primarily for improved accessibility. */
    valueText: string;
    /** Whether the slider is vertical. */
    get vertical(): boolean;
    set vertical(value: BooleanInput);
    private _vertical;
    /** Event emitted when the slider value has changed. */
    readonly change: EventEmitter<MatSliderChange>;
    /** Event emitted when the slider thumb moves. */
    readonly input: EventEmitter<MatSliderChange>;
    /**
     * Emits when the raw value of the slider changes. This is here primarily
     * to facilitate the two-way binding for the `value` input.
     * @docs-private
     */
    readonly valueChange: EventEmitter<number | null>;
    /** The value to be used for display purposes. */
    get displayValue(): string | number;
    /** set focus to the host element */
    focus(options?: FocusOptions): void;
    /** blur the host element */
    blur(): void;
    /** onTouch function registered via registerOnTouch (ControlValueAccessor). */
    onTouched: () => any;
    /** The percentage of the slider that coincides with the value. */
    get percent(): number;
    private _percent;
    /**
     * Whether or not the thumb is sliding and what the user is using to slide it with.
     * Used to determine if there should be a transition for the thumb and fill track.
     */
    _isSliding: 'keyboard' | 'pointer' | null;
    /**
     * Whether or not the slider is active (clicked or sliding).
     * Used to shrink and grow the thumb as according to the Material Design spec.
     */
    _isActive: boolean;
    /**
     * Whether the axis of the slider is inverted.
     * (i.e. whether moving the thumb in the positive x or y direction decreases the slider's value).
     */
    _shouldInvertAxis(): boolean;
    /** Whether the slider is at its minimum value. */
    _isMinValue(): boolean;
    /**
     * The amount of space to leave between the slider thumb and the track fill & track background
     * elements.
     */
    _getThumbGap(): 7 | 10 | 0;
    /** CSS styles for the track background element. */
    _getTrackBackgroundStyles(): {
        [key: string]: string;
    };
    /** CSS styles for the track fill element. */
    _getTrackFillStyles(): {
        [key: string]: string;
    };
    /** CSS styles for the ticks container element. */
    _getTicksContainerStyles(): {
        [key: string]: string;
    };
    /** CSS styles for the ticks element. */
    _getTicksStyles(): {
        [key: string]: string;
    };
    _getThumbContainerStyles(): {
        [key: string]: string;
    };
    /** The size of a tick interval as a percentage of the size of the track. */
    private _tickIntervalPercent;
    /** The dimensions of the slider. */
    private _sliderDimensions;
    private _controlValueAccessorChangeFn;
    /** Decimal places to round to, based on the step amount. */
    private _roundToDecimal;
    /** Subscription to the Directionality change EventEmitter. */
    private _dirChangeSubscription;
    /** The value of the slider when the slide start event fires. */
    private _valueOnSlideStart;
    /** Reference to the inner slider wrapper element. */
    private _sliderWrapper;
    /**
     * Whether mouse events should be converted to a slider position by calculating their distance
     * from the right or bottom edge of the slider as opposed to the top or left.
     */
    _shouldInvertMouseCoords(): boolean;
    /** The language direction for this slider element. */
    private _getDirection;
    /** Keeps track of the last pointer event that was captured by the slider. */
    private _lastPointerEvent;
    /** Used to subscribe to global move and end events */
    protected _document: Document;
    /**
     * Identifier used to attribute a touch event to a particular slider.
     * Will be undefined if one of the following conditions is true:
     * - The user isn't dragging using a touch device.
     * - The browser doesn't support `Touch.identifier`.
     * - Dragging hasn't started yet.
     */
    private _touchId;
    constructor(elementRef: ElementRef, _focusMonitor: FocusMonitor, _changeDetectorRef: ChangeDetectorRef, _dir: Directionality, tabIndex: string, _ngZone: NgZone, _document: any, _animationMode?: string | undefined);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    _onMouseenter(): void;
    _onFocus(): void;
    _onBlur(): void;
    _onKeydown(event: KeyboardEvent): void;
    _onKeyup(): void;
    /** Called when the user has put their pointer down on the slider. */
    private _pointerDown;
    /**
     * Called when the user has moved their pointer after
     * starting to drag. Bound on the document level.
     */
    private _pointerMove;
    /** Called when the user has lifted their pointer. Bound on the document level. */
    private _pointerUp;
    /** Called when the window has lost focus. */
    private _windowBlur;
    /** Use defaultView of injected document if available or fallback to global window reference */
    private _getWindow;
    /**
     * Binds our global move and end events. They're bound at the document level and only while
     * dragging so that the user doesn't have to keep their pointer exactly over the slider
     * as they're swiping across the screen.
     */
    private _bindGlobalEvents;
    /** Removes any global event listeners that we may have added. */
    private _removeGlobalEvents;
    /** Increments the slider by the given number of steps (negative number decrements). */
    private _increment;
    /** Calculate the new value from the new physical location. The value will always be snapped. */
    private _updateValueFromPosition;
    /** Emits a change event if the current value is different from the last emitted value. */
    private _emitChangeEvent;
    /** Emits an input event when the current value is different from the last emitted value. */
    private _emitInputEvent;
    /** Updates the amount of space between ticks as a percentage of the width of the slider. */
    private _updateTickIntervalPercent;
    /** Creates a slider change object from the specified value. */
    private _createChangeEvent;
    /** Calculates the percentage of the slider that a value is. */
    private _calculatePercentage;
    /** Calculates the value a percentage of the slider corresponds to. */
    private _calculateValue;
    /** Return a number between two numbers. */
    private _clamp;
    /**
     * Get the bounding client rect of the slider track element.
     * The track is used rather than the native element to ignore the extra space that the thumb can
     * take up.
     */
    private _getSliderDimensions;
    /**
     * Focuses the native element.
     * Currently only used to allow a blur event to fire but will be used with keyboard input later.
     */
    private _focusHostElement;
    /** Blurs the native element. */
    private _blurHostElement;
    /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param value
     */
    writeValue(value: any): void;
    /**
     * Registers a callback to be triggered when the value has changed.
     * Implemented as part of ControlValueAccessor.
     * @param fn Callback to be registered.
     */
    registerOnChange(fn: (value: any) => void): void;
    /**
     * Registers a callback to be triggered when the component is touched.
     * Implemented as part of ControlValueAccessor.
     * @param fn Callback to be registered.
     */
    registerOnTouched(fn: any): void;
    /**
     * Sets whether the component should be disabled.
     * Implemented as part of ControlValueAccessor.
     * @param isDisabled
     */
    setDisabledState(isDisabled: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatSlider, [null, null, null, { optional: true; }, { attribute: "tabindex"; }, null, null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatSlider, "mat-slider", ["matSlider"], { "disabled": "disabled"; "color": "color"; "tabIndex": "tabIndex"; "invert": "invert"; "max": "max"; "min": "min"; "step": "step"; "thumbLabel": "thumbLabel"; "tickInterval": "tickInterval"; "value": "value"; "displayWith": "displayWith"; "valueText": "valueText"; "vertical": "vertical"; }, { "change": "change"; "input": "input"; "valueChange": "valueChange"; }, never, never>;
}
export {};
