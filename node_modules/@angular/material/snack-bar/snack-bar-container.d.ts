/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AnimationEvent } from '@angular/animations';
import { AriaLivePoliteness } from '@angular/cdk/a11y';
import { Platform } from '@angular/cdk/platform';
import { BasePortalOutlet, CdkPortalOutlet, ComponentPortal, TemplatePortal, DomPortal } from '@angular/cdk/portal';
import { ChangeDetectorRef, ComponentRef, ElementRef, EmbeddedViewRef, NgZone, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MatSnackBarConfig } from './snack-bar-config';
import * as i0 from "@angular/core";
/**
 * Internal interface for a snack bar container.
 * @docs-private
 */
export interface _SnackBarContainer {
    snackBarConfig: MatSnackBarConfig;
    readonly _onAnnounce: Subject<any>;
    readonly _onExit: Subject<any>;
    readonly _onEnter: Subject<any>;
    enter: () => void;
    exit: () => Observable<void>;
    attachTemplatePortal: <C>(portal: TemplatePortal<C>) => EmbeddedViewRef<C>;
    attachComponentPortal: <T>(portal: ComponentPortal<T>) => ComponentRef<T>;
}
/**
 * Internal component that wraps user-provided snack bar content.
 * @docs-private
 */
export declare class MatSnackBarContainer extends BasePortalOutlet implements OnDestroy, _SnackBarContainer {
    private _ngZone;
    private _elementRef;
    private _changeDetectorRef;
    private _platform;
    /** The snack bar configuration. */
    snackBarConfig: MatSnackBarConfig;
    /** The number of milliseconds to wait before announcing the snack bar's content. */
    private readonly _announceDelay;
    /** The timeout for announcing the snack bar's content. */
    private _announceTimeoutId;
    /** Whether the component has been destroyed. */
    private _destroyed;
    /** The portal outlet inside of this container into which the snack bar content will be loaded. */
    _portalOutlet: CdkPortalOutlet;
    /** Subject for notifying that the snack bar has announced to screen readers. */
    readonly _onAnnounce: Subject<void>;
    /** Subject for notifying that the snack bar has exited from view. */
    readonly _onExit: Subject<void>;
    /** Subject for notifying that the snack bar has finished entering the view. */
    readonly _onEnter: Subject<void>;
    /** The state of the snack bar animations. */
    _animationState: string;
    /** aria-live value for the live region. */
    _live: AriaLivePoliteness;
    /**
     * Role of the live region. This is only for Firefox as there is a known issue where Firefox +
     * JAWS does not read out aria-live message.
     */
    _role?: 'status' | 'alert';
    constructor(_ngZone: NgZone, _elementRef: ElementRef<HTMLElement>, _changeDetectorRef: ChangeDetectorRef, _platform: Platform, 
    /** The snack bar configuration. */
    snackBarConfig: MatSnackBarConfig);
    /** Attach a component portal as content to this snack bar container. */
    attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T>;
    /** Attach a template portal as content to this snack bar container. */
    attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C>;
    /**
     * Attaches a DOM portal to the snack bar container.
     * @deprecated To be turned into a method.
     * @breaking-change 10.0.0
     */
    attachDomPortal: (portal: DomPortal) => void;
    /** Handle end of animations, updating the state of the snackbar. */
    onAnimationEnd(event: AnimationEvent): void;
    /** Begin animation of snack bar entrance into view. */
    enter(): void;
    /** Begin animation of the snack bar exiting from view. */
    exit(): Observable<void>;
    /** Makes sure the exit callbacks have been invoked when the element is destroyed. */
    ngOnDestroy(): void;
    /**
     * Waits for the zone to settle before removing the element. Helps prevent
     * errors where we end up removing an element which is in the middle of an animation.
     */
    private _completeExit;
    /** Applies the various positioning and user-configured CSS classes to the snack bar. */
    private _applySnackBarClasses;
    /** Asserts that no content is already attached to the container. */
    private _assertNotAttached;
    /**
     * Starts a timeout to move the snack bar content to the live region so screen readers will
     * announce it.
     */
    private _screenReaderAnnounce;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatSnackBarContainer, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatSnackBarContainer, "snack-bar-container", never, {}, {}, never, never>;
}
