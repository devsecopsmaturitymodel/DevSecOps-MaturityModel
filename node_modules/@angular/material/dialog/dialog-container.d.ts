/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AnimationEvent } from '@angular/animations';
import { FocusMonitor, FocusOrigin, FocusTrapFactory, InteractivityChecker } from '@angular/cdk/a11y';
import { BasePortalOutlet, CdkPortalOutlet, ComponentPortal, DomPortal, TemplatePortal } from '@angular/cdk/portal';
import { ChangeDetectorRef, ComponentRef, ElementRef, EmbeddedViewRef, EventEmitter, NgZone } from '@angular/core';
import { MatDialogConfig } from './dialog-config';
import * as i0 from "@angular/core";
/** Event that captures the state of dialog container animations. */
interface DialogAnimationEvent {
    state: 'opened' | 'opening' | 'closing' | 'closed';
    totalTime: number;
}
/**
 * Throws an exception for the case when a ComponentPortal is
 * attached to a DomPortalOutlet without an origin.
 * @docs-private
 */
export declare function throwMatDialogContentAlreadyAttachedError(): void;
/**
 * Base class for the `MatDialogContainer`. The base class does not implement
 * animations as these are left to implementers of the dialog container.
 */
export declare abstract class _MatDialogContainerBase extends BasePortalOutlet {
    protected _elementRef: ElementRef;
    protected _focusTrapFactory: FocusTrapFactory;
    protected _changeDetectorRef: ChangeDetectorRef;
    /** The dialog configuration. */
    _config: MatDialogConfig;
    private readonly _interactivityChecker;
    private readonly _ngZone;
    private _focusMonitor?;
    protected _document: Document;
    /** The portal outlet inside of this container into which the dialog content will be loaded. */
    _portalOutlet: CdkPortalOutlet;
    /** The class that traps and manages focus within the dialog. */
    private _focusTrap;
    /** Emits when an animation state changes. */
    _animationStateChanged: EventEmitter<DialogAnimationEvent>;
    /** Element that was focused before the dialog was opened. Save this to restore upon close. */
    private _elementFocusedBeforeDialogWasOpened;
    /**
     * Type of interaction that led to the dialog being closed. This is used to determine
     * whether the focus style will be applied when returning focus to its original location
     * after the dialog is closed.
     */
    _closeInteractionType: FocusOrigin | null;
    /** ID of the element that should be considered as the dialog's label. */
    _ariaLabelledBy: string | null;
    /** ID for the container DOM element. */
    _id: string;
    constructor(_elementRef: ElementRef, _focusTrapFactory: FocusTrapFactory, _changeDetectorRef: ChangeDetectorRef, _document: any, 
    /** The dialog configuration. */
    _config: MatDialogConfig, _interactivityChecker: InteractivityChecker, _ngZone: NgZone, _focusMonitor?: FocusMonitor | undefined);
    /** Starts the dialog exit animation. */
    abstract _startExitAnimation(): void;
    /** Initializes the dialog container with the attached content. */
    _initializeWithAttachedContent(): void;
    /**
     * Attach a ComponentPortal as content to this dialog container.
     * @param portal Portal to be attached as the dialog content.
     */
    attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T>;
    /**
     * Attach a TemplatePortal as content to this dialog container.
     * @param portal Portal to be attached as the dialog content.
     */
    attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C>;
    /**
     * Attaches a DOM portal to the dialog container.
     * @param portal Portal to be attached.
     * @deprecated To be turned into a method.
     * @breaking-change 10.0.0
     */
    attachDomPortal: (portal: DomPortal) => void;
    /** Moves focus back into the dialog if it was moved out. */
    _recaptureFocus(): void;
    /**
     * Focuses the provided element. If the element is not focusable, it will add a tabIndex
     * attribute to forcefully focus it. The attribute is removed after focus is moved.
     * @param element The element to focus.
     */
    private _forceFocus;
    /**
     * Focuses the first element that matches the given selector within the focus trap.
     * @param selector The CSS selector for the element to set focus to.
     */
    private _focusByCssSelector;
    /**
     * Moves the focus inside the focus trap. When autoFocus is not set to 'dialog', if focus
     * cannot be moved then focus will go to the dialog container.
     */
    protected _trapFocus(): void;
    /** Restores focus to the element that was focused before the dialog opened. */
    protected _restoreFocus(): void;
    /** Focuses the dialog container. */
    private _focusDialogContainer;
    /** Returns whether focus is inside the dialog. */
    private _containsFocus;
    static ɵfac: i0.ɵɵFactoryDeclaration<_MatDialogContainerBase, [null, null, null, { optional: true; }, null, null, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<_MatDialogContainerBase, never, never, {}, {}, never>;
}
/**
 * Internal component that wraps user-provided dialog content.
 * Animation is based on https://material.io/guidelines/motion/choreography.html.
 * @docs-private
 */
export declare class MatDialogContainer extends _MatDialogContainerBase {
    /** State of the dialog animation. */
    _state: 'void' | 'enter' | 'exit';
    /** Callback, invoked whenever an animation on the host completes. */
    _onAnimationDone({ toState, totalTime }: AnimationEvent): void;
    /** Callback, invoked when an animation on the host starts. */
    _onAnimationStart({ toState, totalTime }: AnimationEvent): void;
    /** Starts the dialog exit animation. */
    _startExitAnimation(): void;
    _initializeWithAttachedContent(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatDialogContainer, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatDialogContainer, "mat-dialog-container", never, {}, {}, never, never>;
}
export {};
