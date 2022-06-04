/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directionality } from '@angular/cdk/bidi';
import { BooleanInput } from '@angular/cdk/coercion';
import { Overlay, ScrollStrategy } from '@angular/cdk/overlay';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { AfterViewInit, ChangeDetectorRef, ElementRef, InjectionToken, NgZone, OnDestroy, ViewContainerRef, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { MatOption, MatOptionSelectionChange } from '@angular/material/core';
import { MatFormField } from '@angular/material/form-field';
import { Observable } from 'rxjs';
import { _MatAutocompleteBase, MatAutocompleteDefaultOptions } from './autocomplete';
import { _MatAutocompleteOriginBase } from './autocomplete-origin';
import * as i0 from "@angular/core";
/** Injection token that determines the scroll handling while the autocomplete panel is open. */
export declare const MAT_AUTOCOMPLETE_SCROLL_STRATEGY: InjectionToken<() => ScrollStrategy>;
/** @docs-private */
export declare function MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY(overlay: Overlay): () => ScrollStrategy;
/** @docs-private */
export declare const MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER: {
    provide: InjectionToken<() => ScrollStrategy>;
    deps: (typeof Overlay)[];
    useFactory: typeof MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY;
};
/**
 * Provider that allows the autocomplete to register as a ControlValueAccessor.
 * @docs-private
 */
export declare const MAT_AUTOCOMPLETE_VALUE_ACCESSOR: any;
/**
 * Creates an error to be thrown when attempting to use an autocomplete trigger without a panel.
 * @docs-private
 */
export declare function getMatAutocompleteMissingPanelError(): Error;
/** Base class with all of the `MatAutocompleteTrigger` functionality. */
export declare abstract class _MatAutocompleteTriggerBase implements ControlValueAccessor, AfterViewInit, OnChanges, OnDestroy {
    private _element;
    private _overlay;
    private _viewContainerRef;
    private _zone;
    private _changeDetectorRef;
    private _dir;
    private _formField;
    private _document;
    private _viewportRuler;
    private _defaults?;
    private _overlayRef;
    private _portal;
    private _componentDestroyed;
    private _autocompleteDisabled;
    private _scrollStrategy;
    /** Old value of the native input. Used to work around issues with the `input` event on IE. */
    private _previousValue;
    /** Strategy that is used to position the panel. */
    private _positionStrategy;
    /** Whether or not the label state is being overridden. */
    private _manuallyFloatingLabel;
    /** The subscription for closing actions (some are bound to document). */
    private _closingActionsSubscription;
    /** Subscription to viewport size changes. */
    private _viewportSubscription;
    /**
     * Whether the autocomplete can open the next time it is focused. Used to prevent a focused,
     * closed autocomplete from being reopened if the user switches to another browser tab and then
     * comes back.
     */
    private _canOpenOnNextFocus;
    /** Stream of keyboard events that can close the panel. */
    private readonly _closeKeyEventStream;
    /**
     * Event handler for when the window is blurred. Needs to be an
     * arrow function in order to preserve the context.
     */
    private _windowBlurHandler;
    /** `View -> model callback called when value changes` */
    _onChange: (value: any) => void;
    /** `View -> model callback called when autocomplete has been touched` */
    _onTouched: () => void;
    /** The autocomplete panel to be attached to this trigger. */
    autocomplete: _MatAutocompleteBase;
    /**
     * Position of the autocomplete panel relative to the trigger element. A position of `auto`
     * will render the panel underneath the trigger if there is enough space for it to fit in
     * the viewport, otherwise the panel will be shown above it. If the position is set to
     * `above` or `below`, the panel will always be shown above or below the trigger. no matter
     * whether it fits completely in the viewport.
     */
    position: 'auto' | 'above' | 'below';
    /**
     * Reference relative to which to position the autocomplete panel.
     * Defaults to the autocomplete trigger element.
     */
    connectedTo: _MatAutocompleteOriginBase;
    /**
     * `autocomplete` attribute to be set on the input element.
     * @docs-private
     */
    autocompleteAttribute: string;
    /**
     * Whether the autocomplete is disabled. When disabled, the element will
     * act as a regular input and the user won't be able to open the panel.
     */
    get autocompleteDisabled(): boolean;
    set autocompleteDisabled(value: BooleanInput);
    constructor(_element: ElementRef<HTMLInputElement>, _overlay: Overlay, _viewContainerRef: ViewContainerRef, _zone: NgZone, _changeDetectorRef: ChangeDetectorRef, scrollStrategy: any, _dir: Directionality, _formField: MatFormField, _document: any, _viewportRuler: ViewportRuler, _defaults?: MatAutocompleteDefaultOptions | undefined);
    /** Class to apply to the panel when it's above the input. */
    protected abstract _aboveClass: string;
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    /** Whether or not the autocomplete panel is open. */
    get panelOpen(): boolean;
    private _overlayAttached;
    /** Opens the autocomplete suggestion panel. */
    openPanel(): void;
    /** Closes the autocomplete suggestion panel. */
    closePanel(): void;
    /**
     * Updates the position of the autocomplete suggestion panel to ensure that it fits all options
     * within the viewport.
     */
    updatePosition(): void;
    /**
     * A stream of actions that should close the autocomplete panel, including
     * when an option is selected, on blur, and when TAB is pressed.
     */
    get panelClosingActions(): Observable<MatOptionSelectionChange | null>;
    /** Stream of changes to the selection state of the autocomplete options. */
    readonly optionSelections: Observable<MatOptionSelectionChange>;
    /** The currently active option, coerced to MatOption type. */
    get activeOption(): MatOption | null;
    /** Stream of clicks outside of the autocomplete panel. */
    private _getOutsideClickStream;
    writeValue(value: any): void;
    registerOnChange(fn: (value: any) => {}): void;
    registerOnTouched(fn: () => {}): void;
    setDisabledState(isDisabled: boolean): void;
    _handleKeydown(event: KeyboardEvent): void;
    _handleInput(event: KeyboardEvent): void;
    _handleFocus(): void;
    _handleClick(): void;
    /**
     * In "auto" mode, the label will animate down as soon as focus is lost.
     * This causes the value to jump when selecting an option with the mouse.
     * This method manually floats the label until the panel can be closed.
     * @param shouldAnimate Whether the label should be animated when it is floated.
     */
    private _floatLabel;
    /** If the label has been manually elevated, return it to its normal state. */
    private _resetLabel;
    /**
     * This method listens to a stream of panel closing actions and resets the
     * stream every time the option list changes.
     */
    private _subscribeToClosingActions;
    /** Destroys the autocomplete suggestion panel. */
    private _destroyPanel;
    private _setTriggerValue;
    /**
     * This method closes the panel, and if a value is specified, also sets the associated
     * control to that value. It will also mark the control as dirty if this interaction
     * stemmed from the user.
     */
    private _setValueAndClose;
    /**
     * Clear any previous selected option and emit a selection change event for this option
     */
    private _clearPreviousSelectedOption;
    private _attachOverlay;
    private _getOverlayConfig;
    private _getOverlayPosition;
    /** Sets the positions on a position strategy based on the directive's input state. */
    private _setStrategyPositions;
    private _getConnectedElement;
    private _getPanelWidth;
    /** Returns the width of the input element, so the panel width can match it. */
    private _getHostWidth;
    /**
     * Resets the active item to -1 so arrow events will activate the
     * correct options, or to 0 if the consumer opted into it.
     */
    private _resetActiveItem;
    /** Determines whether the panel can be opened. */
    private _canOpen;
    /** Use defaultView of injected document if available or fallback to global window reference */
    private _getWindow;
    /** Scrolls to a particular option in the list. */
    private _scrollToOption;
    static ɵfac: i0.ɵɵFactoryDeclaration<_MatAutocompleteTriggerBase, [null, null, null, null, null, null, { optional: true; }, { optional: true; host: true; }, { optional: true; }, null, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<_MatAutocompleteTriggerBase, never, never, { "autocomplete": "matAutocomplete"; "position": "matAutocompletePosition"; "connectedTo": "matAutocompleteConnectedTo"; "autocompleteAttribute": "autocomplete"; "autocompleteDisabled": "matAutocompleteDisabled"; }, {}, never>;
}
export declare class MatAutocompleteTrigger extends _MatAutocompleteTriggerBase {
    protected _aboveClass: string;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatAutocompleteTrigger, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatAutocompleteTrigger, "input[matAutocomplete], textarea[matAutocomplete]", ["matAutocompleteTrigger"], {}, {}, never>;
}
