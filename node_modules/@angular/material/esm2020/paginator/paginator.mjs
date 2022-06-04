/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceNumberProperty, coerceBooleanProperty, } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewEncapsulation, InjectionToken, Inject, Optional, Directive, } from '@angular/core';
import { MatPaginatorIntl } from './paginator-intl';
import { mixinInitialized, mixinDisabled, } from '@angular/material/core';
import * as i0 from "@angular/core";
import * as i1 from "./paginator-intl";
import * as i2 from "@angular/material/form-field";
import * as i3 from "@angular/material/select";
import * as i4 from "@angular/material/core";
import * as i5 from "@angular/material/button";
import * as i6 from "@angular/common";
import * as i7 from "@angular/material/tooltip";
/** The default page size if there is no page size and there are no provided page size options. */
const DEFAULT_PAGE_SIZE = 50;
/**
 * Change event object that is emitted when the user selects a
 * different page size or navigates to another page.
 */
export class PageEvent {
}
/** Injection token that can be used to provide the default options for the paginator module. */
export const MAT_PAGINATOR_DEFAULT_OPTIONS = new InjectionToken('MAT_PAGINATOR_DEFAULT_OPTIONS');
// Boilerplate for applying mixins to _MatPaginatorBase.
/** @docs-private */
const _MatPaginatorMixinBase = mixinDisabled(mixinInitialized(class {
}));
/**
 * Base class with all of the `MatPaginator` functionality.
 * @docs-private
 */
export class _MatPaginatorBase extends _MatPaginatorMixinBase {
    constructor(_intl, _changeDetectorRef, defaults) {
        super();
        this._intl = _intl;
        this._changeDetectorRef = _changeDetectorRef;
        this._pageIndex = 0;
        this._length = 0;
        this._pageSizeOptions = [];
        this._hidePageSize = false;
        this._showFirstLastButtons = false;
        /** Event emitted when the paginator changes the page size or page index. */
        this.page = new EventEmitter();
        this._intlChanges = _intl.changes.subscribe(() => this._changeDetectorRef.markForCheck());
        if (defaults) {
            const { pageSize, pageSizeOptions, hidePageSize, showFirstLastButtons } = defaults;
            if (pageSize != null) {
                this._pageSize = pageSize;
            }
            if (pageSizeOptions != null) {
                this._pageSizeOptions = pageSizeOptions;
            }
            if (hidePageSize != null) {
                this._hidePageSize = hidePageSize;
            }
            if (showFirstLastButtons != null) {
                this._showFirstLastButtons = showFirstLastButtons;
            }
        }
    }
    /** The zero-based page index of the displayed list of items. Defaulted to 0. */
    get pageIndex() {
        return this._pageIndex;
    }
    set pageIndex(value) {
        this._pageIndex = Math.max(coerceNumberProperty(value), 0);
        this._changeDetectorRef.markForCheck();
    }
    /** The length of the total number of items that are being paginated. Defaulted to 0. */
    get length() {
        return this._length;
    }
    set length(value) {
        this._length = coerceNumberProperty(value);
        this._changeDetectorRef.markForCheck();
    }
    /** Number of items to display on a page. By default set to 50. */
    get pageSize() {
        return this._pageSize;
    }
    set pageSize(value) {
        this._pageSize = Math.max(coerceNumberProperty(value), 0);
        this._updateDisplayedPageSizeOptions();
    }
    /** The set of provided page size options to display to the user. */
    get pageSizeOptions() {
        return this._pageSizeOptions;
    }
    set pageSizeOptions(value) {
        this._pageSizeOptions = (value || []).map(p => coerceNumberProperty(p));
        this._updateDisplayedPageSizeOptions();
    }
    /** Whether to hide the page size selection UI from the user. */
    get hidePageSize() {
        return this._hidePageSize;
    }
    set hidePageSize(value) {
        this._hidePageSize = coerceBooleanProperty(value);
    }
    /** Whether to show the first/last buttons UI to the user. */
    get showFirstLastButtons() {
        return this._showFirstLastButtons;
    }
    set showFirstLastButtons(value) {
        this._showFirstLastButtons = coerceBooleanProperty(value);
    }
    ngOnInit() {
        this._initialized = true;
        this._updateDisplayedPageSizeOptions();
        this._markInitialized();
    }
    ngOnDestroy() {
        this._intlChanges.unsubscribe();
    }
    /** Advances to the next page if it exists. */
    nextPage() {
        if (!this.hasNextPage()) {
            return;
        }
        const previousPageIndex = this.pageIndex;
        this.pageIndex = this.pageIndex + 1;
        this._emitPageEvent(previousPageIndex);
    }
    /** Move back to the previous page if it exists. */
    previousPage() {
        if (!this.hasPreviousPage()) {
            return;
        }
        const previousPageIndex = this.pageIndex;
        this.pageIndex = this.pageIndex - 1;
        this._emitPageEvent(previousPageIndex);
    }
    /** Move to the first page if not already there. */
    firstPage() {
        // hasPreviousPage being false implies at the start
        if (!this.hasPreviousPage()) {
            return;
        }
        const previousPageIndex = this.pageIndex;
        this.pageIndex = 0;
        this._emitPageEvent(previousPageIndex);
    }
    /** Move to the last page if not already there. */
    lastPage() {
        // hasNextPage being false implies at the end
        if (!this.hasNextPage()) {
            return;
        }
        const previousPageIndex = this.pageIndex;
        this.pageIndex = this.getNumberOfPages() - 1;
        this._emitPageEvent(previousPageIndex);
    }
    /** Whether there is a previous page. */
    hasPreviousPage() {
        return this.pageIndex >= 1 && this.pageSize != 0;
    }
    /** Whether there is a next page. */
    hasNextPage() {
        const maxPageIndex = this.getNumberOfPages() - 1;
        return this.pageIndex < maxPageIndex && this.pageSize != 0;
    }
    /** Calculate the number of pages */
    getNumberOfPages() {
        if (!this.pageSize) {
            return 0;
        }
        return Math.ceil(this.length / this.pageSize);
    }
    /**
     * Changes the page size so that the first item displayed on the page will still be
     * displayed using the new page size.
     *
     * For example, if the page size is 10 and on the second page (items indexed 10-19) then
     * switching so that the page size is 5 will set the third page as the current page so
     * that the 10th item will still be displayed.
     */
    _changePageSize(pageSize) {
        // Current page needs to be updated to reflect the new page size. Navigate to the page
        // containing the previous page's first item.
        const startIndex = this.pageIndex * this.pageSize;
        const previousPageIndex = this.pageIndex;
        this.pageIndex = Math.floor(startIndex / pageSize) || 0;
        this.pageSize = pageSize;
        this._emitPageEvent(previousPageIndex);
    }
    /** Checks whether the buttons for going forwards should be disabled. */
    _nextButtonsDisabled() {
        return this.disabled || !this.hasNextPage();
    }
    /** Checks whether the buttons for going backwards should be disabled. */
    _previousButtonsDisabled() {
        return this.disabled || !this.hasPreviousPage();
    }
    /**
     * Updates the list of page size options to display to the user. Includes making sure that
     * the page size is an option and that the list is sorted.
     */
    _updateDisplayedPageSizeOptions() {
        if (!this._initialized) {
            return;
        }
        // If no page size is provided, use the first page size option or the default page size.
        if (!this.pageSize) {
            this._pageSize =
                this.pageSizeOptions.length != 0 ? this.pageSizeOptions[0] : DEFAULT_PAGE_SIZE;
        }
        this._displayedPageSizeOptions = this.pageSizeOptions.slice();
        if (this._displayedPageSizeOptions.indexOf(this.pageSize) === -1) {
            this._displayedPageSizeOptions.push(this.pageSize);
        }
        // Sort the numbers using a number-specific sort function.
        this._displayedPageSizeOptions.sort((a, b) => a - b);
        this._changeDetectorRef.markForCheck();
    }
    /** Emits an event notifying that a change of the paginator's properties has been triggered. */
    _emitPageEvent(previousPageIndex) {
        this.page.emit({
            previousPageIndex,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            length: this.length,
        });
    }
}
_MatPaginatorBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _MatPaginatorBase, deps: "invalid", target: i0.ɵɵFactoryTarget.Directive });
_MatPaginatorBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: _MatPaginatorBase, inputs: { color: "color", pageIndex: "pageIndex", length: "length", pageSize: "pageSize", pageSizeOptions: "pageSizeOptions", hidePageSize: "hidePageSize", showFirstLastButtons: "showFirstLastButtons" }, outputs: { page: "page" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _MatPaginatorBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i1.MatPaginatorIntl }, { type: i0.ChangeDetectorRef }, { type: undefined }]; }, propDecorators: { color: [{
                type: Input
            }], pageIndex: [{
                type: Input
            }], length: [{
                type: Input
            }], pageSize: [{
                type: Input
            }], pageSizeOptions: [{
                type: Input
            }], hidePageSize: [{
                type: Input
            }], showFirstLastButtons: [{
                type: Input
            }], page: [{
                type: Output
            }] } });
/**
 * Component to provide navigation between paged information. Displays the size of the current
 * page, user-selectable options to change that size, what items are being shown, and
 * navigational button to go to the previous or next page.
 */
export class MatPaginator extends _MatPaginatorBase {
    constructor(intl, changeDetectorRef, defaults) {
        super(intl, changeDetectorRef, defaults);
        if (defaults && defaults.formFieldAppearance != null) {
            this._formFieldAppearance = defaults.formFieldAppearance;
        }
    }
}
MatPaginator.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatPaginator, deps: [{ token: i1.MatPaginatorIntl }, { token: i0.ChangeDetectorRef }, { token: MAT_PAGINATOR_DEFAULT_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Component });
MatPaginator.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: MatPaginator, selector: "mat-paginator", inputs: { disabled: "disabled" }, host: { attributes: { "role": "group" }, classAttribute: "mat-paginator" }, exportAs: ["matPaginator"], usesInheritance: true, ngImport: i0, template: "<div class=\"mat-paginator-outer-container\">\n  <div class=\"mat-paginator-container\">\n    <div class=\"mat-paginator-page-size\" *ngIf=\"!hidePageSize\">\n      <div class=\"mat-paginator-page-size-label\">\n        {{_intl.itemsPerPageLabel}}\n      </div>\n\n      <mat-form-field\n        *ngIf=\"_displayedPageSizeOptions.length > 1\"\n        [appearance]=\"_formFieldAppearance!\"\n        [color]=\"color\"\n        class=\"mat-paginator-page-size-select\">\n        <mat-select\n          [value]=\"pageSize\"\n          [disabled]=\"disabled\"\n          [aria-label]=\"_intl.itemsPerPageLabel\"\n          (selectionChange)=\"_changePageSize($event.value)\">\n          <mat-option *ngFor=\"let pageSizeOption of _displayedPageSizeOptions\" [value]=\"pageSizeOption\">\n            {{pageSizeOption}}\n          </mat-option>\n        </mat-select>\n      </mat-form-field>\n\n      <div\n        class=\"mat-paginator-page-size-value\"\n        *ngIf=\"_displayedPageSizeOptions.length <= 1\">{{pageSize}}</div>\n    </div>\n\n    <div class=\"mat-paginator-range-actions\">\n      <div class=\"mat-paginator-range-label\">\n        {{_intl.getRangeLabel(pageIndex, pageSize, length)}}\n      </div>\n\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-first\"\n              (click)=\"firstPage()\"\n              [attr.aria-label]=\"_intl.firstPageLabel\"\n              [matTooltip]=\"_intl.firstPageLabel\"\n              [matTooltipDisabled]=\"_previousButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_previousButtonsDisabled()\"\n              *ngIf=\"showFirstLastButtons\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z\"/>\n        </svg>\n      </button>\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-previous\"\n              (click)=\"previousPage()\"\n              [attr.aria-label]=\"_intl.previousPageLabel\"\n              [matTooltip]=\"_intl.previousPageLabel\"\n              [matTooltipDisabled]=\"_previousButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_previousButtonsDisabled()\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z\"/>\n        </svg>\n      </button>\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-next\"\n              (click)=\"nextPage()\"\n              [attr.aria-label]=\"_intl.nextPageLabel\"\n              [matTooltip]=\"_intl.nextPageLabel\"\n              [matTooltipDisabled]=\"_nextButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_nextButtonsDisabled()\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"/>\n        </svg>\n      </button>\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-last\"\n              (click)=\"lastPage()\"\n              [attr.aria-label]=\"_intl.lastPageLabel\"\n              [matTooltip]=\"_intl.lastPageLabel\"\n              [matTooltipDisabled]=\"_nextButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_nextButtonsDisabled()\"\n              *ngIf=\"showFirstLastButtons\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z\"/>\n        </svg>\n      </button>\n    </div>\n  </div>\n</div>\n", styles: [".mat-paginator{display:block}.mat-paginator-outer-container{display:flex}.mat-paginator-container{display:flex;align-items:center;justify-content:flex-end;padding:0 8px;flex-wrap:wrap-reverse;width:100%}.mat-paginator-page-size{display:flex;align-items:baseline;margin-right:8px}[dir=rtl] .mat-paginator-page-size{margin-right:0;margin-left:8px}.mat-paginator-page-size-label{margin:0 4px}.mat-paginator-page-size-select{margin:6px 4px 0 4px;width:56px}.mat-paginator-page-size-select.mat-form-field-appearance-outline{width:64px}.mat-paginator-page-size-select.mat-form-field-appearance-fill{width:64px}.mat-paginator-range-label{margin:0 32px 0 24px}.mat-paginator-range-actions{display:flex;align-items:center}.mat-paginator-icon{width:28px;fill:currentColor}[dir=rtl] .mat-paginator-icon{transform:rotate(180deg)}.cdk-high-contrast-active .mat-paginator-icon{fill:CanvasText}\n"], components: [{ type: i2.MatFormField, selector: "mat-form-field", inputs: ["color", "appearance", "hideRequiredMarker", "hintLabel", "floatLabel"], exportAs: ["matFormField"] }, { type: i3.MatSelect, selector: "mat-select", inputs: ["disabled", "disableRipple", "tabIndex"], exportAs: ["matSelect"] }, { type: i4.MatOption, selector: "mat-option", exportAs: ["matOption"] }, { type: i5.MatButton, selector: "button[mat-button], button[mat-raised-button], button[mat-icon-button],             button[mat-fab], button[mat-mini-fab], button[mat-stroked-button],             button[mat-flat-button]", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }], directives: [{ type: i6.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i6.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i7.MatTooltip, selector: "[matTooltip]", exportAs: ["matTooltip"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatPaginator, decorators: [{
            type: Component,
            args: [{ selector: 'mat-paginator', exportAs: 'matPaginator', inputs: ['disabled'], host: {
                        'class': 'mat-paginator',
                        'role': 'group',
                    }, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: "<div class=\"mat-paginator-outer-container\">\n  <div class=\"mat-paginator-container\">\n    <div class=\"mat-paginator-page-size\" *ngIf=\"!hidePageSize\">\n      <div class=\"mat-paginator-page-size-label\">\n        {{_intl.itemsPerPageLabel}}\n      </div>\n\n      <mat-form-field\n        *ngIf=\"_displayedPageSizeOptions.length > 1\"\n        [appearance]=\"_formFieldAppearance!\"\n        [color]=\"color\"\n        class=\"mat-paginator-page-size-select\">\n        <mat-select\n          [value]=\"pageSize\"\n          [disabled]=\"disabled\"\n          [aria-label]=\"_intl.itemsPerPageLabel\"\n          (selectionChange)=\"_changePageSize($event.value)\">\n          <mat-option *ngFor=\"let pageSizeOption of _displayedPageSizeOptions\" [value]=\"pageSizeOption\">\n            {{pageSizeOption}}\n          </mat-option>\n        </mat-select>\n      </mat-form-field>\n\n      <div\n        class=\"mat-paginator-page-size-value\"\n        *ngIf=\"_displayedPageSizeOptions.length <= 1\">{{pageSize}}</div>\n    </div>\n\n    <div class=\"mat-paginator-range-actions\">\n      <div class=\"mat-paginator-range-label\">\n        {{_intl.getRangeLabel(pageIndex, pageSize, length)}}\n      </div>\n\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-first\"\n              (click)=\"firstPage()\"\n              [attr.aria-label]=\"_intl.firstPageLabel\"\n              [matTooltip]=\"_intl.firstPageLabel\"\n              [matTooltipDisabled]=\"_previousButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_previousButtonsDisabled()\"\n              *ngIf=\"showFirstLastButtons\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z\"/>\n        </svg>\n      </button>\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-previous\"\n              (click)=\"previousPage()\"\n              [attr.aria-label]=\"_intl.previousPageLabel\"\n              [matTooltip]=\"_intl.previousPageLabel\"\n              [matTooltipDisabled]=\"_previousButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_previousButtonsDisabled()\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z\"/>\n        </svg>\n      </button>\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-next\"\n              (click)=\"nextPage()\"\n              [attr.aria-label]=\"_intl.nextPageLabel\"\n              [matTooltip]=\"_intl.nextPageLabel\"\n              [matTooltipDisabled]=\"_nextButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_nextButtonsDisabled()\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"/>\n        </svg>\n      </button>\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-last\"\n              (click)=\"lastPage()\"\n              [attr.aria-label]=\"_intl.lastPageLabel\"\n              [matTooltip]=\"_intl.lastPageLabel\"\n              [matTooltipDisabled]=\"_nextButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_nextButtonsDisabled()\"\n              *ngIf=\"showFirstLastButtons\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z\"/>\n        </svg>\n      </button>\n    </div>\n  </div>\n</div>\n", styles: [".mat-paginator{display:block}.mat-paginator-outer-container{display:flex}.mat-paginator-container{display:flex;align-items:center;justify-content:flex-end;padding:0 8px;flex-wrap:wrap-reverse;width:100%}.mat-paginator-page-size{display:flex;align-items:baseline;margin-right:8px}[dir=rtl] .mat-paginator-page-size{margin-right:0;margin-left:8px}.mat-paginator-page-size-label{margin:0 4px}.mat-paginator-page-size-select{margin:6px 4px 0 4px;width:56px}.mat-paginator-page-size-select.mat-form-field-appearance-outline{width:64px}.mat-paginator-page-size-select.mat-form-field-appearance-fill{width:64px}.mat-paginator-range-label{margin:0 32px 0 24px}.mat-paginator-range-actions{display:flex;align-items:center}.mat-paginator-icon{width:28px;fill:currentColor}[dir=rtl] .mat-paginator-icon{transform:rotate(180deg)}.cdk-high-contrast-active .mat-paginator-icon{fill:CanvasText}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.MatPaginatorIntl }, { type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_PAGINATOR_DEFAULT_OPTIONS]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3BhZ2luYXRvci9wYWdpbmF0b3IudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvcGFnaW5hdG9yL3BhZ2luYXRvci5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFDTCxvQkFBb0IsRUFDcEIscUJBQXFCLEdBR3RCLE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFlBQVksRUFDWixLQUFLLEVBR0wsTUFBTSxFQUNOLGlCQUFpQixFQUNqQixjQUFjLEVBQ2QsTUFBTSxFQUNOLFFBQVEsRUFDUixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDbEQsT0FBTyxFQUVMLGdCQUFnQixFQUVoQixhQUFhLEdBRWQsTUFBTSx3QkFBd0IsQ0FBQzs7Ozs7Ozs7O0FBR2hDLGtHQUFrRztBQUNsRyxNQUFNLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztBQUU3Qjs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sU0FBUztDQWVyQjtBQW9CRCxnR0FBZ0c7QUFDaEcsTUFBTSxDQUFDLE1BQU0sNkJBQTZCLEdBQUcsSUFBSSxjQUFjLENBQzdELCtCQUErQixDQUNoQyxDQUFDO0FBRUYsd0RBQXdEO0FBQ3hELG9CQUFvQjtBQUNwQixNQUFNLHNCQUFzQixHQUFHLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQztDQUFRLENBQUMsQ0FBQyxDQUFDO0FBRXpFOzs7R0FHRztBQUVILE1BQU0sT0FBZ0IsaUJBUXBCLFNBQVEsc0JBQXNCO0lBK0U5QixZQUNTLEtBQXVCLEVBQ3RCLGtCQUFxQyxFQUM3QyxRQUFZO1FBRVosS0FBSyxFQUFFLENBQUM7UUFK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LG9CQUFvQixHQUFHLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQztTQUMxRDtJQUNILENBQUM7O3lHQWRVLFlBQVksbUZBT0QsNkJBQTZCOzZGQVB4QyxZQUFZLHNOQ3BYekIsNnVIQXNGQTsyRkQ4UmEsWUFBWTtrQkFieEIsU0FBUzsrQkFDRSxlQUFlLFlBQ2YsY0FBYyxVQUdoQixDQUFDLFVBQVUsQ0FBQyxRQUNkO3dCQUNKLE9BQU8sRUFBRSxlQUFlO3dCQUN4QixNQUFNLEVBQUUsT0FBTztxQkFDaEIsbUJBQ2dCLHVCQUF1QixDQUFDLE1BQU0saUJBQ2hDLGlCQUFpQixDQUFDLElBQUk7OzBCQVNsQyxRQUFROzswQkFBSSxNQUFNOzJCQUFDLDZCQUE2QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBjb2VyY2VOdW1iZXJQcm9wZXJ0eSxcbiAgY29lcmNlQm9vbGVhblByb3BlcnR5LFxuICBCb29sZWFuSW5wdXQsXG4gIE51bWJlcklucHV0LFxufSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5qZWN0LFxuICBPcHRpb25hbCxcbiAgRGlyZWN0aXZlLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7U3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7TWF0UGFnaW5hdG9ySW50bH0gZnJvbSAnLi9wYWdpbmF0b3ItaW50bCc7XG5pbXBvcnQge1xuICBIYXNJbml0aWFsaXplZCxcbiAgbWl4aW5Jbml0aWFsaXplZCxcbiAgVGhlbWVQYWxldHRlLFxuICBtaXhpbkRpc2FibGVkLFxuICBDYW5EaXNhYmxlLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0Rm9ybUZpZWxkQXBwZWFyYW5jZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5cbi8qKiBUaGUgZGVmYXVsdCBwYWdlIHNpemUgaWYgdGhlcmUgaXMgbm8gcGFnZSBzaXplIGFuZCB0aGVyZSBhcmUgbm8gcHJvdmlkZWQgcGFnZSBzaXplIG9wdGlvbnMuICovXG5jb25zdCBERUZBVUxUX1BBR0VfU0laRSA9IDUwO1xuXG4vKipcbiAqIENoYW5nZSBldmVudCBvYmplY3QgdGhhdCBpcyBlbWl0dGVkIHdoZW4gdGhlIHVzZXIgc2VsZWN0cyBhXG4gKiBkaWZmZXJlbnQgcGFnZSBzaXplIG9yIG5hdmlnYXRlcyB0byBhbm90aGVyIHBhZ2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBQYWdlRXZlbnQge1xuICAvKiogVGhlIGN1cnJlbnQgcGFnZSBpbmRleC4gKi9cbiAgcGFnZUluZGV4OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEluZGV4IG9mIHRoZSBwYWdlIHRoYXQgd2FzIHNlbGVjdGVkIHByZXZpb3VzbHkuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjAgVG8gYmUgbWFkZSBpbnRvIGEgcmVxdWlyZWQgcHJvcGVydHkuXG4gICAqL1xuICBwcmV2aW91c1BhZ2VJbmRleD86IG51bWJlcjtcblxuICAvKiogVGhlIGN1cnJlbnQgcGFnZSBzaXplICovXG4gIHBhZ2VTaXplOiBudW1iZXI7XG5cbiAgLyoqIFRoZSBjdXJyZW50IHRvdGFsIG51bWJlciBvZiBpdGVtcyBiZWluZyBwYWdlZCAqL1xuICBsZW5ndGg6IG51bWJlcjtcbn1cblxuLyoqIE9iamVjdCB0aGF0IGNhbiBiZSB1c2VkIHRvIGNvbmZpZ3VyZSB0aGUgZGVmYXVsdCBvcHRpb25zIGZvciB0aGUgcGFnaW5hdG9yIG1vZHVsZS4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0UGFnaW5hdG9yRGVmYXVsdE9wdGlvbnMge1xuICAvKiogTnVtYmVyIG9mIGl0ZW1zIHRvIGRpc3BsYXkgb24gYSBwYWdlLiBCeSBkZWZhdWx0IHNldCB0byA1MC4gKi9cbiAgcGFnZVNpemU/OiBudW1iZXI7XG5cbiAgLyoqIFRoZSBzZXQgb2YgcHJvdmlkZWQgcGFnZSBzaXplIG9wdGlvbnMgdG8gZGlzcGxheSB0byB0aGUgdXNlci4gKi9cbiAgcGFnZVNpemVPcHRpb25zPzogbnVtYmVyW107XG5cbiAgLyoqIFdoZXRoZXIgdG8gaGlkZSB0aGUgcGFnZSBzaXplIHNlbGVjdGlvbiBVSSBmcm9tIHRoZSB1c2VyLiAqL1xuICBoaWRlUGFnZVNpemU/OiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRvIHNob3cgdGhlIGZpcnN0L2xhc3QgYnV0dG9ucyBVSSB0byB0aGUgdXNlci4gKi9cbiAgc2hvd0ZpcnN0TGFzdEJ1dHRvbnM/OiBib29sZWFuO1xuXG4gIC8qKiBUaGUgZGVmYXVsdCBmb3JtLWZpZWxkIGFwcGVhcmFuY2UgdG8gYXBwbHkgdG8gdGhlIHBhZ2Ugc2l6ZSBvcHRpb25zIHNlbGVjdG9yLiAqL1xuICBmb3JtRmllbGRBcHBlYXJhbmNlPzogTWF0Rm9ybUZpZWxkQXBwZWFyYW5jZTtcbn1cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHByb3ZpZGUgdGhlIGRlZmF1bHQgb3B0aW9ucyBmb3IgdGhlIHBhZ2luYXRvciBtb2R1bGUuICovXG5leHBvcnQgY29uc3QgTUFUX1BBR0lOQVRPUl9ERUZBVUxUX09QVElPTlMgPSBuZXcgSW5qZWN0aW9uVG9rZW48TWF0UGFnaW5hdG9yRGVmYXVsdE9wdGlvbnM+KFxuICAnTUFUX1BBR0lOQVRPUl9ERUZBVUxUX09QVElPTlMnLFxuKTtcblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBfTWF0UGFnaW5hdG9yQmFzZS5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jb25zdCBfTWF0UGFnaW5hdG9yTWl4aW5CYXNlID0gbWl4aW5EaXNhYmxlZChtaXhpbkluaXRpYWxpemVkKGNsYXNzIHt9KSk7XG5cbi8qKlxuICogQmFzZSBjbGFzcyB3aXRoIGFsbCBvZiB0aGUgYE1hdFBhZ2luYXRvcmAgZnVuY3Rpb25hbGl0eS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgX01hdFBhZ2luYXRvckJhc2U8XG4gICAgTyBleHRlbmRzIHtcbiAgICAgIHBhZ2VTaXplPzogbnVtYmVyO1xuICAgICAgcGFnZVNpemVPcHRpb25zPzogbnVtYmVyW107XG4gICAgICBoaWRlUGFnZVNpemU/OiBib29sZWFuO1xuICAgICAgc2hvd0ZpcnN0TGFzdEJ1dHRvbnM/OiBib29sZWFuO1xuICAgIH0sXG4gID5cbiAgZXh0ZW5kcyBfTWF0UGFnaW5hdG9yTWl4aW5CYXNlXG4gIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIENhbkRpc2FibGUsIEhhc0luaXRpYWxpemVkXG57XG4gIHByaXZhdGUgX2luaXRpYWxpemVkOiBib29sZWFuO1xuICBwcml2YXRlIF9pbnRsQ2hhbmdlczogU3Vic2NyaXB0aW9uO1xuXG4gIC8qKiBUaGVtZSBjb2xvciB0byBiZSB1c2VkIGZvciB0aGUgdW5kZXJseWluZyBmb3JtIGNvbnRyb2xzLiAqL1xuICBASW5wdXQoKSBjb2xvcjogVGhlbWVQYWxldHRlO1xuXG4gIC8qKiBUaGUgemVyby1iYXNlZCBwYWdlIGluZGV4IG9mIHRoZSBkaXNwbGF5ZWQgbGlzdCBvZiBpdGVtcy4gRGVmYXVsdGVkIHRvIDAuICovXG4gIEBJbnB1dCgpXG4gIGdldCBwYWdlSW5kZXgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fcGFnZUluZGV4O1xuICB9XG4gIHNldCBwYWdlSW5kZXgodmFsdWU6IE51bWJlcklucHV0KSB7XG4gICAgdGhpcy5fcGFnZUluZGV4ID0gTWF0aC5tYXgoY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpLCAwKTtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuICBwcml2YXRlIF9wYWdlSW5kZXggPSAwO1xuXG4gIC8qKiBUaGUgbGVuZ3RoIG9mIHRoZSB0b3RhbCBudW1iZXIgb2YgaXRlbXMgdGhhdCBhcmUgYmVpbmcgcGFnaW5hdGVkLiBEZWZhdWx0ZWQgdG8gMC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGxlbmd0aCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9sZW5ndGg7XG4gIH1cbiAgc2V0IGxlbmd0aCh2YWx1ZTogTnVtYmVySW5wdXQpIHtcbiAgICB0aGlzLl9sZW5ndGggPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSk7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cbiAgcHJpdmF0ZSBfbGVuZ3RoID0gMDtcblxuICAvKiogTnVtYmVyIG9mIGl0ZW1zIHRvIGRpc3BsYXkgb24gYSBwYWdlLiBCeSBkZWZhdWx0IHNldCB0byA1MC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHBhZ2VTaXplKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3BhZ2VTaXplO1xuICB9XG4gIHNldCBwYWdlU2l6ZSh2YWx1ZTogTnVtYmVySW5wdXQpIHtcbiAgICB0aGlzLl9wYWdlU2l6ZSA9IE1hdGgubWF4KGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKSwgMCk7XG4gICAgdGhpcy5fdXBkYXRlRGlzcGxheWVkUGFnZVNpemVPcHRpb25zKCk7XG4gIH1cbiAgcHJpdmF0ZSBfcGFnZVNpemU6IG51bWJlcjtcblxuICAvKiogVGhlIHNldCBvZiBwcm92aWRlZCBwYWdlIHNpemUgb3B0aW9ucyB0byBkaXNwbGF5IHRvIHRoZSB1c2VyLiAqL1xuICBASW5wdXQoKVxuICBnZXQgcGFnZVNpemVPcHRpb25zKCk6IG51bWJlcltdIHtcbiAgICByZXR1cm4gdGhpcy5fcGFnZVNpemVPcHRpb25zO1xuICB9XG4gIHNldCBwYWdlU2l6ZU9wdGlvbnModmFsdWU6IG51bWJlcltdIHwgcmVhZG9ubHkgbnVtYmVyW10pIHtcbiAgICB0aGlzLl9wYWdlU2l6ZU9wdGlvbnMgPSAodmFsdWUgfHwgW10pLm1hcChwID0+IGNvZXJjZU51bWJlclByb3BlcnR5KHApKTtcbiAgICB0aGlzLl91cGRhdGVEaXNwbGF5ZWRQYWdlU2l6ZU9wdGlvbnMoKTtcbiAgfVxuICBwcml2YXRlIF9wYWdlU2l6ZU9wdGlvbnM6IG51bWJlcltdID0gW107XG5cbiAgLyoqIFdoZXRoZXIgdG8gaGlkZSB0aGUgcGFnZSBzaXplIHNlbGVjdGlvbiBVSSBmcm9tIHRoZSB1c2VyLiAqL1xuICBASW5wdXQoKVxuICBnZXQgaGlkZVBhZ2VTaXplKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9oaWRlUGFnZVNpemU7XG4gIH1cbiAgc2V0IGhpZGVQYWdlU2l6ZSh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5faGlkZVBhZ2VTaXplID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9oaWRlUGFnZVNpemUgPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0byBzaG93IHRoZSBmaXJzdC9sYXN0IGJ1dHRvbnMgVUkgdG8gdGhlIHVzZXIuICovXG4gIEBJbnB1dCgpXG4gIGdldCBzaG93Rmlyc3RMYXN0QnV0dG9ucygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fc2hvd0ZpcnN0TGFzdEJ1dHRvbnM7XG4gIH1cbiAgc2V0IHNob3dGaXJzdExhc3RCdXR0b25zKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9zaG93Rmlyc3RMYXN0QnV0dG9ucyA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfc2hvd0ZpcnN0TGFzdEJ1dHRvbnMgPSBmYWxzZTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBwYWdpbmF0b3IgY2hhbmdlcyB0aGUgcGFnZSBzaXplIG9yIHBhZ2UgaW5kZXguICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBwYWdlOiBFdmVudEVtaXR0ZXI8UGFnZUV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8UGFnZUV2ZW50PigpO1xuXG4gIC8qKiBEaXNwbGF5ZWQgc2V0IG9mIHBhZ2Ugc2l6ZSBvcHRpb25zLiBXaWxsIGJlIHNvcnRlZCBhbmQgaW5jbHVkZSBjdXJyZW50IHBhZ2Ugc2l6ZS4gKi9cbiAgX2Rpc3BsYXllZFBhZ2VTaXplT3B0aW9uczogbnVtYmVyW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIF9pbnRsOiBNYXRQYWdpbmF0b3JJbnRsLFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBkZWZhdWx0cz86IE8sXG4gICkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5faW50bENoYW5nZXMgPSBfaW50bC5jaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKSk7XG5cbiAgICBpZiAoZGVmYXVsdHMpIHtcbiAgICAgIGNvbnN0IHtwYWdlU2l6ZSwgcGFnZVNpemVPcHRpb25zLCBoaWRlUGFnZVNpemUsIHNob3dGaXJzdExhc3RCdXR0b25zfSA9IGRlZmF1bHRzO1xuXG4gICAgICBpZiAocGFnZVNpemUgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9wYWdlU2l6ZSA9IHBhZ2VTaXplO1xuICAgICAgfVxuXG4gICAgICBpZiAocGFnZVNpemVPcHRpb25zICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5fcGFnZVNpemVPcHRpb25zID0gcGFnZVNpemVPcHRpb25zO1xuICAgICAgfVxuXG4gICAgICBpZiAoaGlkZVBhZ2VTaXplICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5faGlkZVBhZ2VTaXplID0gaGlkZVBhZ2VTaXplO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2hvd0ZpcnN0TGFzdEJ1dHRvbnMgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9zaG93Rmlyc3RMYXN0QnV0dG9ucyA9IHNob3dGaXJzdExhc3RCdXR0b25zO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX2luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB0aGlzLl91cGRhdGVEaXNwbGF5ZWRQYWdlU2l6ZU9wdGlvbnMoKTtcbiAgICB0aGlzLl9tYXJrSW5pdGlhbGl6ZWQoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2ludGxDaGFuZ2VzLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICAvKiogQWR2YW5jZXMgdG8gdGhlIG5leHQgcGFnZSBpZiBpdCBleGlzdHMuICovXG4gIG5leHRQYWdlKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5oYXNOZXh0UGFnZSgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcHJldmlvdXNQYWdlSW5kZXggPSB0aGlzLnBhZ2VJbmRleDtcbiAgICB0aGlzLnBhZ2VJbmRleCA9IHRoaXMucGFnZUluZGV4ICsgMTtcbiAgICB0aGlzLl9lbWl0UGFnZUV2ZW50KHByZXZpb3VzUGFnZUluZGV4KTtcbiAgfVxuXG4gIC8qKiBNb3ZlIGJhY2sgdG8gdGhlIHByZXZpb3VzIHBhZ2UgaWYgaXQgZXhpc3RzLiAqL1xuICBwcmV2aW91c1BhZ2UoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmhhc1ByZXZpb3VzUGFnZSgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcHJldmlvdXNQYWdlSW5kZXggPSB0aGlzLnBhZ2VJbmRleDtcbiAgICB0aGlzLnBhZ2VJbmRleCA9IHRoaXMucGFnZUluZGV4IC0gMTtcbiAgICB0aGlzLl9lbWl0UGFnZUV2ZW50KHByZXZpb3VzUGFnZUluZGV4KTtcbiAgfVxuXG4gIC8qKiBNb3ZlIHRvIHRoZSBmaXJzdCBwYWdlIGlmIG5vdCBhbHJlYWR5IHRoZXJlLiAqL1xuICBmaXJzdFBhZ2UoKTogdm9pZCB7XG4gICAgLy8gaGFzUHJldmlvdXNQYWdlIGJlaW5nIGZhbHNlIGltcGxpZXMgYXQgdGhlIHN0YXJ0XG4gICAgaWYgKCF0aGlzLmhhc1ByZXZpb3VzUGFnZSgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcHJldmlvdXNQYWdlSW5kZXggPSB0aGlzLnBhZ2VJbmRleDtcbiAgICB0aGlzLnBhZ2VJbmRleCA9IDA7XG4gICAgdGhpcy5fZW1pdFBhZ2VFdmVudChwcmV2aW91c1BhZ2VJbmRleCk7XG4gIH1cblxuICAvKiogTW92ZSB0byB0aGUgbGFzdCBwYWdlIGlmIG5vdCBhbHJlYWR5IHRoZXJlLiAqL1xuICBsYXN0UGFnZSgpOiB2b2lkIHtcbiAgICAvLyBoYXNOZXh0UGFnZSBiZWluZyBmYWxzZSBpbXBsaWVzIGF0IHRoZSBlbmRcbiAgICBpZiAoIXRoaXMuaGFzTmV4dFBhZ2UoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHByZXZpb3VzUGFnZUluZGV4ID0gdGhpcy5wYWdlSW5kZXg7XG4gICAgdGhpcy5wYWdlSW5kZXggPSB0aGlzLmdldE51bWJlck9mUGFnZXMoKSAtIDE7XG4gICAgdGhpcy5fZW1pdFBhZ2VFdmVudChwcmV2aW91c1BhZ2VJbmRleCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGVyZSBpcyBhIHByZXZpb3VzIHBhZ2UuICovXG4gIGhhc1ByZXZpb3VzUGFnZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5wYWdlSW5kZXggPj0gMSAmJiB0aGlzLnBhZ2VTaXplICE9IDA7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGVyZSBpcyBhIG5leHQgcGFnZS4gKi9cbiAgaGFzTmV4dFBhZ2UoKTogYm9vbGVhbiB7XG4gICAgY29uc3QgbWF4UGFnZUluZGV4ID0gdGhpcy5nZXROdW1iZXJPZlBhZ2VzKCkgLSAxO1xuICAgIHJldHVybiB0aGlzLnBhZ2VJbmRleCA8IG1heFBhZ2VJbmRleCAmJiB0aGlzLnBhZ2VTaXplICE9IDA7XG4gIH1cblxuICAvKiogQ2FsY3VsYXRlIHRoZSBudW1iZXIgb2YgcGFnZXMgKi9cbiAgZ2V0TnVtYmVyT2ZQYWdlcygpOiBudW1iZXIge1xuICAgIGlmICghdGhpcy5wYWdlU2l6ZSkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIE1hdGguY2VpbCh0aGlzLmxlbmd0aCAvIHRoaXMucGFnZVNpemUpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoYW5nZXMgdGhlIHBhZ2Ugc2l6ZSBzbyB0aGF0IHRoZSBmaXJzdCBpdGVtIGRpc3BsYXllZCBvbiB0aGUgcGFnZSB3aWxsIHN0aWxsIGJlXG4gICAqIGRpc3BsYXllZCB1c2luZyB0aGUgbmV3IHBhZ2Ugc2l6ZS5cbiAgICpcbiAgICogRm9yIGV4YW1wbGUsIGlmIHRoZSBwYWdlIHNpemUgaXMgMTAgYW5kIG9uIHRoZSBzZWNvbmQgcGFnZSAoaXRlbXMgaW5kZXhlZCAxMC0xOSkgdGhlblxuICAgKiBzd2l0Y2hpbmcgc28gdGhhdCB0aGUgcGFnZSBzaXplIGlzIDUgd2lsbCBzZXQgdGhlIHRoaXJkIHBhZ2UgYXMgdGhlIGN1cnJlbnQgcGFnZSBzb1xuICAgKiB0aGF0IHRoZSAxMHRoIGl0ZW0gd2lsbCBzdGlsbCBiZSBkaXNwbGF5ZWQuXG4gICAqL1xuICBfY2hhbmdlUGFnZVNpemUocGFnZVNpemU6IG51bWJlcikge1xuICAgIC8vIEN1cnJlbnQgcGFnZSBuZWVkcyB0byBiZSB1cGRhdGVkIHRvIHJlZmxlY3QgdGhlIG5ldyBwYWdlIHNpemUuIE5hdmlnYXRlIHRvIHRoZSBwYWdlXG4gICAgLy8gY29udGFpbmluZyB0aGUgcHJldmlvdXMgcGFnZSdzIGZpcnN0IGl0ZW0uXG4gICAgY29uc3Qgc3RhcnRJbmRleCA9IHRoaXMucGFnZUluZGV4ICogdGhpcy5wYWdlU2l6ZTtcbiAgICBjb25zdCBwcmV2aW91c1BhZ2VJbmRleCA9IHRoaXMucGFnZUluZGV4O1xuXG4gICAgdGhpcy5wYWdlSW5kZXggPSBNYXRoLmZsb29yKHN0YXJ0SW5kZXggLyBwYWdlU2l6ZSkgfHwgMDtcbiAgICB0aGlzLnBhZ2VTaXplID0gcGFnZVNpemU7XG4gICAgdGhpcy5fZW1pdFBhZ2VFdmVudChwcmV2aW91c1BhZ2VJbmRleCk7XG4gIH1cblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgdGhlIGJ1dHRvbnMgZm9yIGdvaW5nIGZvcndhcmRzIHNob3VsZCBiZSBkaXNhYmxlZC4gKi9cbiAgX25leHRCdXR0b25zRGlzYWJsZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgfHwgIXRoaXMuaGFzTmV4dFBhZ2UoKTtcbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgYnV0dG9ucyBmb3IgZ29pbmcgYmFja3dhcmRzIHNob3VsZCBiZSBkaXNhYmxlZC4gKi9cbiAgX3ByZXZpb3VzQnV0dG9uc0Rpc2FibGVkKCkge1xuICAgIHJldHVybiB0aGlzLmRpc2FibGVkIHx8ICF0aGlzLmhhc1ByZXZpb3VzUGFnZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGxpc3Qgb2YgcGFnZSBzaXplIG9wdGlvbnMgdG8gZGlzcGxheSB0byB0aGUgdXNlci4gSW5jbHVkZXMgbWFraW5nIHN1cmUgdGhhdFxuICAgKiB0aGUgcGFnZSBzaXplIGlzIGFuIG9wdGlvbiBhbmQgdGhhdCB0aGUgbGlzdCBpcyBzb3J0ZWQuXG4gICAqL1xuICBwcml2YXRlIF91cGRhdGVEaXNwbGF5ZWRQYWdlU2l6ZU9wdGlvbnMoKSB7XG4gICAgaWYgKCF0aGlzLl9pbml0aWFsaXplZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIElmIG5vIHBhZ2Ugc2l6ZSBpcyBwcm92aWRlZCwgdXNlIHRoZSBmaXJzdCBwYWdlIHNpemUgb3B0aW9uIG9yIHRoZSBkZWZhdWx0IHBhZ2Ugc2l6ZS5cbiAgICBpZiAoIXRoaXMucGFnZVNpemUpIHtcbiAgICAgIHRoaXMuX3BhZ2VTaXplID1cbiAgICAgICAgdGhpcy5wYWdlU2l6ZU9wdGlvbnMubGVuZ3RoICE9IDAgPyB0aGlzLnBhZ2VTaXplT3B0aW9uc1swXSA6IERFRkFVTFRfUEFHRV9TSVpFO1xuICAgIH1cblxuICAgIHRoaXMuX2Rpc3BsYXllZFBhZ2VTaXplT3B0aW9ucyA9IHRoaXMucGFnZVNpemVPcHRpb25zLnNsaWNlKCk7XG5cbiAgICBpZiAodGhpcy5fZGlzcGxheWVkUGFnZVNpemVPcHRpb25zLmluZGV4T2YodGhpcy5wYWdlU2l6ZSkgPT09IC0xKSB7XG4gICAgICB0aGlzLl9kaXNwbGF5ZWRQYWdlU2l6ZU9wdGlvbnMucHVzaCh0aGlzLnBhZ2VTaXplKTtcbiAgICB9XG5cbiAgICAvLyBTb3J0IHRoZSBudW1iZXJzIHVzaW5nIGEgbnVtYmVyLXNwZWNpZmljIHNvcnQgZnVuY3Rpb24uXG4gICAgdGhpcy5fZGlzcGxheWVkUGFnZVNpemVPcHRpb25zLnNvcnQoKGEsIGIpID0+IGEgLSBiKTtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8qKiBFbWl0cyBhbiBldmVudCBub3RpZnlpbmcgdGhhdCBhIGNoYW5nZSBvZiB0aGUgcGFnaW5hdG9yJ3MgcHJvcGVydGllcyBoYXMgYmVlbiB0cmlnZ2VyZWQuICovXG4gIHByaXZhdGUgX2VtaXRQYWdlRXZlbnQocHJldmlvdXNQYWdlSW5kZXg6IG51bWJlcikge1xuICAgIHRoaXMucGFnZS5lbWl0KHtcbiAgICAgIHByZXZpb3VzUGFnZUluZGV4LFxuICAgICAgcGFnZUluZGV4OiB0aGlzLnBhZ2VJbmRleCxcbiAgICAgIHBhZ2VTaXplOiB0aGlzLnBhZ2VTaXplLFxuICAgICAgbGVuZ3RoOiB0aGlzLmxlbmd0aCxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIENvbXBvbmVudCB0byBwcm92aWRlIG5hdmlnYXRpb24gYmV0d2VlbiBwYWdlZCBpbmZvcm1hdGlvbi4gRGlzcGxheXMgdGhlIHNpemUgb2YgdGhlIGN1cnJlbnRcbiAqIHBhZ2UsIHVzZXItc2VsZWN0YWJsZSBvcHRpb25zIHRvIGNoYW5nZSB0aGF0IHNpemUsIHdoYXQgaXRlbXMgYXJlIGJlaW5nIHNob3duLCBhbmRcbiAqIG5hdmlnYXRpb25hbCBidXR0b24gdG8gZ28gdG8gdGhlIHByZXZpb3VzIG9yIG5leHQgcGFnZS5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXBhZ2luYXRvcicsXG4gIGV4cG9ydEFzOiAnbWF0UGFnaW5hdG9yJyxcbiAgdGVtcGxhdGVVcmw6ICdwYWdpbmF0b3IuaHRtbCcsXG4gIHN0eWxlVXJsczogWydwYWdpbmF0b3IuY3NzJ10sXG4gIGlucHV0czogWydkaXNhYmxlZCddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1wYWdpbmF0b3InLFxuICAgICdyb2xlJzogJ2dyb3VwJyxcbiAgfSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFBhZ2luYXRvciBleHRlbmRzIF9NYXRQYWdpbmF0b3JCYXNlPE1hdFBhZ2luYXRvckRlZmF1bHRPcHRpb25zPiB7XG4gIC8qKiBJZiBzZXQsIHN0eWxlcyB0aGUgXCJwYWdlIHNpemVcIiBmb3JtIGZpZWxkIHdpdGggdGhlIGRlc2lnbmF0ZWQgc3R5bGUuICovXG4gIF9mb3JtRmllbGRBcHBlYXJhbmNlPzogTWF0Rm9ybUZpZWxkQXBwZWFyYW5jZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBpbnRsOiBNYXRQYWdpbmF0b3JJbnRsLFxuICAgIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9QQUdJTkFUT1JfREVGQVVMVF9PUFRJT05TKSBkZWZhdWx0cz86IE1hdFBhZ2luYXRvckRlZmF1bHRPcHRpb25zLFxuICApIHtcbiAgICBzdXBlcihpbnRsLCBjaGFuZ2VEZXRlY3RvclJlZiwgZGVmYXVsdHMpO1xuXG4gICAgaWYgKGRlZmF1bHRzICYmIGRlZmF1bHRzLmZvcm1GaWVsZEFwcGVhcmFuY2UgIT0gbnVsbCkge1xuICAgICAgdGhpcy5fZm9ybUZpZWxkQXBwZWFyYW5jZSA9IGRlZmF1bHRzLmZvcm1GaWVsZEFwcGVhcmFuY2U7XG4gICAgfVxuICB9XG59XG4iLCI8ZGl2IGNsYXNzPVwibWF0LXBhZ2luYXRvci1vdXRlci1jb250YWluZXJcIj5cbiAgPGRpdiBjbGFzcz1cIm1hdC1wYWdpbmF0b3ItY29udGFpbmVyXCI+XG4gICAgPGRpdiBjbGFzcz1cIm1hdC1wYWdpbmF0b3ItcGFnZS1zaXplXCIgKm5nSWY9XCIhaGlkZVBhZ2VTaXplXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibWF0LXBhZ2luYXRvci1wYWdlLXNpemUtbGFiZWxcIj5cbiAgICAgICAge3tfaW50bC5pdGVtc1BlclBhZ2VMYWJlbH19XG4gICAgICA8L2Rpdj5cblxuICAgICAgPG1hdC1mb3JtLWZpZWxkXG4gICAgICAgICpuZ0lmPVwiX2Rpc3BsYXllZFBhZ2VTaXplT3B0aW9ucy5sZW5ndGggPiAxXCJcbiAgICAgICAgW2FwcGVhcmFuY2VdPVwiX2Zvcm1GaWVsZEFwcGVhcmFuY2UhXCJcbiAgICAgICAgW2NvbG9yXT1cImNvbG9yXCJcbiAgICAgICAgY2xhc3M9XCJtYXQtcGFnaW5hdG9yLXBhZ2Utc2l6ZS1zZWxlY3RcIj5cbiAgICAgICAgPG1hdC1zZWxlY3RcbiAgICAgICAgICBbdmFsdWVdPVwicGFnZVNpemVcIlxuICAgICAgICAgIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiXG4gICAgICAgICAgW2FyaWEtbGFiZWxdPVwiX2ludGwuaXRlbXNQZXJQYWdlTGFiZWxcIlxuICAgICAgICAgIChzZWxlY3Rpb25DaGFuZ2UpPVwiX2NoYW5nZVBhZ2VTaXplKCRldmVudC52YWx1ZSlcIj5cbiAgICAgICAgICA8bWF0LW9wdGlvbiAqbmdGb3I9XCJsZXQgcGFnZVNpemVPcHRpb24gb2YgX2Rpc3BsYXllZFBhZ2VTaXplT3B0aW9uc1wiIFt2YWx1ZV09XCJwYWdlU2l6ZU9wdGlvblwiPlxuICAgICAgICAgICAge3twYWdlU2l6ZU9wdGlvbn19XG4gICAgICAgICAgPC9tYXQtb3B0aW9uPlxuICAgICAgICA8L21hdC1zZWxlY3Q+XG4gICAgICA8L21hdC1mb3JtLWZpZWxkPlxuXG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzPVwibWF0LXBhZ2luYXRvci1wYWdlLXNpemUtdmFsdWVcIlxuICAgICAgICAqbmdJZj1cIl9kaXNwbGF5ZWRQYWdlU2l6ZU9wdGlvbnMubGVuZ3RoIDw9IDFcIj57e3BhZ2VTaXplfX08L2Rpdj5cbiAgICA8L2Rpdj5cblxuICAgIDxkaXYgY2xhc3M9XCJtYXQtcGFnaW5hdG9yLXJhbmdlLWFjdGlvbnNcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJtYXQtcGFnaW5hdG9yLXJhbmdlLWxhYmVsXCI+XG4gICAgICAgIHt7X2ludGwuZ2V0UmFuZ2VMYWJlbChwYWdlSW5kZXgsIHBhZ2VTaXplLCBsZW5ndGgpfX1cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8YnV0dG9uIG1hdC1pY29uLWJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgY2xhc3M9XCJtYXQtcGFnaW5hdG9yLW5hdmlnYXRpb24tZmlyc3RcIlxuICAgICAgICAgICAgICAoY2xpY2spPVwiZmlyc3RQYWdlKClcIlxuICAgICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cIl9pbnRsLmZpcnN0UGFnZUxhYmVsXCJcbiAgICAgICAgICAgICAgW21hdFRvb2x0aXBdPVwiX2ludGwuZmlyc3RQYWdlTGFiZWxcIlxuICAgICAgICAgICAgICBbbWF0VG9vbHRpcERpc2FibGVkXT1cIl9wcmV2aW91c0J1dHRvbnNEaXNhYmxlZCgpXCJcbiAgICAgICAgICAgICAgW21hdFRvb2x0aXBQb3NpdGlvbl09XCInYWJvdmUnXCJcbiAgICAgICAgICAgICAgW2Rpc2FibGVkXT1cIl9wcmV2aW91c0J1dHRvbnNEaXNhYmxlZCgpXCJcbiAgICAgICAgICAgICAgKm5nSWY9XCJzaG93Rmlyc3RMYXN0QnV0dG9uc1wiPlxuICAgICAgICA8c3ZnIGNsYXNzPVwibWF0LXBhZ2luYXRvci1pY29uXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZvY3VzYWJsZT1cImZhbHNlXCI+XG4gICAgICAgICAgPHBhdGggZD1cIk0xOC40MSAxNi41OUwxMy44MiAxMmw0LjU5LTQuNTlMMTcgNmwtNiA2IDYgNnpNNiA2aDJ2MTJINnpcIi8+XG4gICAgICAgIDwvc3ZnPlxuICAgICAgPC9idXR0b24+XG4gICAgICA8YnV0dG9uIG1hdC1pY29uLWJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgY2xhc3M9XCJtYXQtcGFnaW5hdG9yLW5hdmlnYXRpb24tcHJldmlvdXNcIlxuICAgICAgICAgICAgICAoY2xpY2spPVwicHJldmlvdXNQYWdlKClcIlxuICAgICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cIl9pbnRsLnByZXZpb3VzUGFnZUxhYmVsXCJcbiAgICAgICAgICAgICAgW21hdFRvb2x0aXBdPVwiX2ludGwucHJldmlvdXNQYWdlTGFiZWxcIlxuICAgICAgICAgICAgICBbbWF0VG9vbHRpcERpc2FibGVkXT1cIl9wcmV2aW91c0J1dHRvbnNEaXNhYmxlZCgpXCJcbiAgICAgICAgICAgICAgW21hdFRvb2x0aXBQb3NpdGlvbl09XCInYWJvdmUnXCJcbiAgICAgICAgICAgICAgW2Rpc2FibGVkXT1cIl9wcmV2aW91c0J1dHRvbnNEaXNhYmxlZCgpXCI+XG4gICAgICAgIDxzdmcgY2xhc3M9XCJtYXQtcGFnaW5hdG9yLWljb25cIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZm9jdXNhYmxlPVwiZmFsc2VcIj5cbiAgICAgICAgICA8cGF0aCBkPVwiTTE1LjQxIDcuNDFMMTQgNmwtNiA2IDYgNiAxLjQxLTEuNDFMMTAuODMgMTJ6XCIvPlxuICAgICAgICA8L3N2Zz5cbiAgICAgIDwvYnV0dG9uPlxuICAgICAgPGJ1dHRvbiBtYXQtaWNvbi1idXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgIGNsYXNzPVwibWF0LXBhZ2luYXRvci1uYXZpZ2F0aW9uLW5leHRcIlxuICAgICAgICAgICAgICAoY2xpY2spPVwibmV4dFBhZ2UoKVwiXG4gICAgICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiX2ludGwubmV4dFBhZ2VMYWJlbFwiXG4gICAgICAgICAgICAgIFttYXRUb29sdGlwXT1cIl9pbnRsLm5leHRQYWdlTGFiZWxcIlxuICAgICAgICAgICAgICBbbWF0VG9vbHRpcERpc2FibGVkXT1cIl9uZXh0QnV0dG9uc0Rpc2FibGVkKClcIlxuICAgICAgICAgICAgICBbbWF0VG9vbHRpcFBvc2l0aW9uXT1cIidhYm92ZSdcIlxuICAgICAgICAgICAgICBbZGlzYWJsZWRdPVwiX25leHRCdXR0b25zRGlzYWJsZWQoKVwiPlxuICAgICAgICA8c3ZnIGNsYXNzPVwibWF0LXBhZ2luYXRvci1pY29uXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZvY3VzYWJsZT1cImZhbHNlXCI+XG4gICAgICAgICAgPHBhdGggZD1cIk0xMCA2TDguNTkgNy40MSAxMy4xNyAxMmwtNC41OCA0LjU5TDEwIDE4bDYtNnpcIi8+XG4gICAgICAgIDwvc3ZnPlxuICAgICAgPC9idXR0b24+XG4gICAgICA8YnV0dG9uIG1hdC1pY29uLWJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgY2xhc3M9XCJtYXQtcGFnaW5hdG9yLW5hdmlnYXRpb24tbGFzdFwiXG4gICAgICAgICAgICAgIChjbGljayk9XCJsYXN0UGFnZSgpXCJcbiAgICAgICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJfaW50bC5sYXN0UGFnZUxhYmVsXCJcbiAgICAgICAgICAgICAgW21hdFRvb2x0aXBdPVwiX2ludGwubGFzdFBhZ2VMYWJlbFwiXG4gICAgICAgICAgICAgIFttYXRUb29sdGlwRGlzYWJsZWRdPVwiX25leHRCdXR0b25zRGlzYWJsZWQoKVwiXG4gICAgICAgICAgICAgIFttYXRUb29sdGlwUG9zaXRpb25dPVwiJ2Fib3ZlJ1wiXG4gICAgICAgICAgICAgIFtkaXNhYmxlZF09XCJfbmV4dEJ1dHRvbnNEaXNhYmxlZCgpXCJcbiAgICAgICAgICAgICAgKm5nSWY9XCJzaG93Rmlyc3RMYXN0QnV0dG9uc1wiPlxuICAgICAgICA8c3ZnIGNsYXNzPVwibWF0LXBhZ2luYXRvci1pY29uXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZvY3VzYWJsZT1cImZhbHNlXCI+XG4gICAgICAgICAgPHBhdGggZD1cIk01LjU5IDcuNDFMMTAuMTggMTJsLTQuNTkgNC41OUw3IDE4bDYtNi02LTZ6TTE2IDZoMnYxMmgtMnpcIi8+XG4gICAgICAgIDwvc3ZnPlxuICAgICAgPC9idXR0b24+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuPC9kaXY+XG4iXX0=