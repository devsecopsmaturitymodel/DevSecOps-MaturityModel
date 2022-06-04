import { Overlay, OverlayContainer, ScrollStrategy } from '@angular/cdk/overlay';
import { ComponentType } from '@angular/cdk/portal';
import { Location } from '@angular/common';
import { InjectionToken, Injector, OnDestroy, TemplateRef, Type } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MatDialogConfig } from './dialog-config';
import { MatDialogContainer, _MatDialogContainerBase } from './dialog-container';
import { MatDialogRef } from './dialog-ref';
import * as i0 from "@angular/core";
/** Injection token that can be used to access the data that was passed in to a dialog. */
export declare const MAT_DIALOG_DATA: InjectionToken<any>;
/** Injection token that can be used to specify default dialog options. */
export declare const MAT_DIALOG_DEFAULT_OPTIONS: InjectionToken<MatDialogConfig<any>>;
/** Injection token that determines the scroll handling while the dialog is open. */
export declare const MAT_DIALOG_SCROLL_STRATEGY: InjectionToken<() => ScrollStrategy>;
/** @docs-private */
export declare function MAT_DIALOG_SCROLL_STRATEGY_FACTORY(overlay: Overlay): () => ScrollStrategy;
/** @docs-private */
export declare function MAT_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay: Overlay): () => ScrollStrategy;
/** @docs-private */
export declare const MAT_DIALOG_SCROLL_STRATEGY_PROVIDER: {
    provide: InjectionToken<() => ScrollStrategy>;
    deps: (typeof Overlay)[];
    useFactory: typeof MAT_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY;
};
/**
 * Base class for dialog services. The base dialog service allows
 * for arbitrary dialog refs and dialog container components.
 */
export declare abstract class _MatDialogBase<C extends _MatDialogContainerBase> implements OnDestroy {
    private _overlay;
    private _injector;
    private _defaultOptions;
    private _parentDialog;
    private _overlayContainer;
    private _dialogRefConstructor;
    private _dialogContainerType;
    private _dialogDataToken;
    private _openDialogsAtThisLevel;
    private readonly _afterAllClosedAtThisLevel;
    private readonly _afterOpenedAtThisLevel;
    private _ariaHiddenElements;
    private _scrollStrategy;
    /** Keeps track of the currently-open dialogs. */
    get openDialogs(): MatDialogRef<any>[];
    /** Stream that emits when a dialog has been opened. */
    get afterOpened(): Subject<MatDialogRef<any>>;
    _getAfterAllClosed(): Subject<void>;
    /**
     * Stream that emits when all open dialog have finished closing.
     * Will emit on subscribe if there are no open dialogs to begin with.
     */
    readonly afterAllClosed: Observable<void>;
    constructor(_overlay: Overlay, _injector: Injector, _defaultOptions: MatDialogConfig | undefined, _parentDialog: _MatDialogBase<C> | undefined, _overlayContainer: OverlayContainer, scrollStrategy: any, _dialogRefConstructor: Type<MatDialogRef<any>>, _dialogContainerType: Type<C>, _dialogDataToken: InjectionToken<any>, 
    /**
     * @deprecated No longer used. To be removed.
     * @breaking-change 14.0.0
     */
    _animationMode?: 'NoopAnimations' | 'BrowserAnimations');
    /**
     * Opens a modal dialog containing the given component.
     * @param component Type of the component to load into the dialog.
     * @param config Extra configuration options.
     * @returns Reference to the newly-opened dialog.
     */
    open<T, D = any, R = any>(component: ComponentType<T>, config?: MatDialogConfig<D>): MatDialogRef<T, R>;
    /**
     * Opens a modal dialog containing the given template.
     * @param template TemplateRef to instantiate as the dialog content.
     * @param config Extra configuration options.
     * @returns Reference to the newly-opened dialog.
     */
    open<T, D = any, R = any>(template: TemplateRef<T>, config?: MatDialogConfig<D>): MatDialogRef<T, R>;
    open<T, D = any, R = any>(template: ComponentType<T> | TemplateRef<T>, config?: MatDialogConfig<D>): MatDialogRef<T, R>;
    /**
     * Closes all of the currently-open dialogs.
     */
    closeAll(): void;
    /**
     * Finds an open dialog by its id.
     * @param id ID to use when looking up the dialog.
     */
    getDialogById(id: string): MatDialogRef<any> | undefined;
    ngOnDestroy(): void;
    /**
     * Creates the overlay into which the dialog will be loaded.
     * @param config The dialog configuration.
     * @returns A promise resolving to the OverlayRef for the created overlay.
     */
    private _createOverlay;
    /**
     * Creates an overlay config from a dialog config.
     * @param dialogConfig The dialog configuration.
     * @returns The overlay configuration.
     */
    private _getOverlayConfig;
    /**
     * Attaches a dialog container to a dialog's already-created overlay.
     * @param overlay Reference to the dialog's underlying overlay.
     * @param config The dialog configuration.
     * @returns A promise resolving to a ComponentRef for the attached container.
     */
    private _attachDialogContainer;
    /**
     * Attaches the user-provided component to the already-created dialog container.
     * @param componentOrTemplateRef The type of component being loaded into the dialog,
     *     or a TemplateRef to instantiate as the content.
     * @param dialogContainer Reference to the wrapping dialog container.
     * @param overlayRef Reference to the overlay in which the dialog resides.
     * @param config The dialog configuration.
     * @returns A promise resolving to the MatDialogRef that should be returned to the user.
     */
    private _attachDialogContent;
    /**
     * Creates a custom injector to be used inside the dialog. This allows a component loaded inside
     * of a dialog to close itself and, optionally, to return a value.
     * @param config Config object that is used to construct the dialog.
     * @param dialogRef Reference to the dialog.
     * @param dialogContainer Dialog container element that wraps all of the contents.
     * @returns The custom injector that can be used inside the dialog.
     */
    private _createInjector;
    /**
     * Removes a dialog from the array of open dialogs.
     * @param dialogRef Dialog to be removed.
     */
    private _removeOpenDialog;
    /**
     * Hides all of the content that isn't an overlay from assistive technology.
     */
    private _hideNonDialogContentFromAssistiveTechnology;
    /** Closes all of the dialogs in an array. */
    private _closeDialogs;
    static ɵfac: i0.ɵɵFactoryDeclaration<_MatDialogBase<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<_MatDialogBase<any>, never, never, {}, {}, never>;
}
/**
 * Service to open Material Design modal dialogs.
 */
export declare class MatDialog extends _MatDialogBase<MatDialogContainer> {
    constructor(overlay: Overlay, injector: Injector, 
    /**
     * @deprecated `_location` parameter to be removed.
     * @breaking-change 10.0.0
     */
    location: Location, defaultOptions: MatDialogConfig, scrollStrategy: any, parentDialog: MatDialog, overlayContainer: OverlayContainer, 
    /**
     * @deprecated No longer used. To be removed.
     * @breaking-change 14.0.0
     */
    animationMode?: 'NoopAnimations' | 'BrowserAnimations');
    static ɵfac: i0.ɵɵFactoryDeclaration<MatDialog, [null, null, { optional: true; }, { optional: true; }, null, { optional: true; skipSelf: true; }, null, { optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MatDialog>;
}
