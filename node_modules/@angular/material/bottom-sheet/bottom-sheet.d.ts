import { Overlay } from '@angular/cdk/overlay';
import { ComponentType } from '@angular/cdk/portal';
import { Injector, TemplateRef, InjectionToken, OnDestroy } from '@angular/core';
import { MatBottomSheetConfig } from './bottom-sheet-config';
import { MatBottomSheetRef } from './bottom-sheet-ref';
import * as i0 from "@angular/core";
/** Injection token that can be used to specify default bottom sheet options. */
export declare const MAT_BOTTOM_SHEET_DEFAULT_OPTIONS: InjectionToken<MatBottomSheetConfig<any>>;
/**
 * Service to trigger Material Design bottom sheets.
 */
export declare class MatBottomSheet implements OnDestroy {
    private _overlay;
    private _injector;
    private _parentBottomSheet;
    private _defaultOptions?;
    private _bottomSheetRefAtThisLevel;
    /** Reference to the currently opened bottom sheet. */
    get _openedBottomSheetRef(): MatBottomSheetRef<any> | null;
    set _openedBottomSheetRef(value: MatBottomSheetRef<any> | null);
    constructor(_overlay: Overlay, _injector: Injector, _parentBottomSheet: MatBottomSheet, _defaultOptions?: MatBottomSheetConfig<any> | undefined);
    /**
     * Opens a bottom sheet containing the given component.
     * @param component Type of the component to load into the bottom sheet.
     * @param config Extra configuration options.
     * @returns Reference to the newly-opened bottom sheet.
     */
    open<T, D = any, R = any>(component: ComponentType<T>, config?: MatBottomSheetConfig<D>): MatBottomSheetRef<T, R>;
    /**
     * Opens a bottom sheet containing the given template.
     * @param template TemplateRef to instantiate as the bottom sheet content.
     * @param config Extra configuration options.
     * @returns Reference to the newly-opened bottom sheet.
     */
    open<T, D = any, R = any>(template: TemplateRef<T>, config?: MatBottomSheetConfig<D>): MatBottomSheetRef<T, R>;
    /**
     * Dismisses the currently-visible bottom sheet.
     * @param result Data to pass to the bottom sheet instance.
     */
    dismiss<R = any>(result?: R): void;
    ngOnDestroy(): void;
    /**
     * Attaches the bottom sheet container component to the overlay.
     */
    private _attachContainer;
    /**
     * Creates a new overlay and places it in the correct location.
     * @param config The user-specified bottom sheet config.
     */
    private _createOverlay;
    /**
     * Creates an injector to be used inside of a bottom sheet component.
     * @param config Config that was used to create the bottom sheet.
     * @param bottomSheetRef Reference to the bottom sheet.
     */
    private _createInjector;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatBottomSheet, [null, null, { optional: true; skipSelf: true; }, { optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MatBottomSheet>;
}
