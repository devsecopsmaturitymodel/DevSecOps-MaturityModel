/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty, coerceNumberProperty, } from '@angular/cdk/coercion';
import { Directive, ElementRef, Input, NgZone, Optional, Inject, } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { auditTime, takeUntil } from 'rxjs/operators';
import { fromEvent, Subject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/platform";
/** Directive to automatically resize a textarea to fit its content. */
export class CdkTextareaAutosize {
    constructor(_elementRef, _platform, _ngZone, 
    /** @breaking-change 11.0.0 make document required */
    document) {
        this._elementRef = _elementRef;
        this._platform = _platform;
        this._ngZone = _ngZone;
        this._destroyed = new Subject();
        this._enabled = true;
        /**
         * Value of minRows as of last resize. If the minRows has decreased, the
         * height of the textarea needs to be recomputed to reflect the new minimum. The maxHeight
         * does not have the same problem because it does not affect the textarea's scrollHeight.
         */
        this._previousMinRows = -1;
        this._isViewInited = false;
        /** Handles `focus` and `blur` events. */
        this._handleFocusEvent = (event) => {
            this._hasFocus = event.type === 'focus';
        };
        this._document = document;
        this._textareaElement = this._elementRef.nativeElement;
    }
    /** Minimum amount of rows in the textarea. */
    get minRows() {
        return this._minRows;
    }
    set minRows(value) {
        this._minRows = coerceNumberProperty(value);
        this._setMinHeight();
    }
    /** Maximum amount of rows in the textarea. */
    get maxRows() {
        return this._maxRows;
    }
    set maxRows(value) {
        this._maxRows = coerceNumberProperty(value);
        this._setMaxHeight();
    }
    /** Whether autosizing is enabled or not */
    get enabled() {
        return this._enabled;
    }
    set enabled(value) {
        value = coerceBooleanProperty(value);
        // Only act if the actual value changed. This specifically helps to not run
        // resizeToFitContent too early (i.e. before ngAfterViewInit)
        if (this._enabled !== value) {
            (this._enabled = value) ? this.resizeToFitContent(true) : this.reset();
        }
    }
    get placeholder() {
        return this._textareaElement.placeholder;
    }
    set placeholder(value) {
        this._cachedPlaceholderHeight = undefined;
        if (value) {
            this._textareaElement.setAttribute('placeholder', value);
        }
        else {
            this._textareaElement.removeAttribute('placeholder');
        }
        this._cacheTextareaPlaceholderHeight();
    }
    /** Sets the minimum height of the textarea as determined by minRows. */
    _setMinHeight() {
        const minHeight = this.minRows && this._cachedLineHeight ? `${this.minRows * this._cachedLineHeight}px` : null;
        if (minHeight) {
            this._textareaElement.style.minHeight = minHeight;
        }
    }
    /** Sets the maximum height of the textarea as determined by maxRows. */
    _setMaxHeight() {
        const maxHeight = this.maxRows && this._cachedLineHeight ? `${this.maxRows * this._cachedLineHeight}px` : null;
        if (maxHeight) {
            this._textareaElement.style.maxHeight = maxHeight;
        }
    }
    ngAfterViewInit() {
        if (this._platform.isBrowser) {
            // Remember the height which we started with in case autosizing is disabled
            this._initialHeight = this._textareaElement.style.height;
            this.resizeToFitContent();
            this._ngZone.runOutsideAngular(() => {
                const window = this._getWindow();
                fromEvent(window, 'resize')
                    .pipe(auditTime(16), takeUntil(this._destroyed))
                    .subscribe(() => this.resizeToFitContent(true));
                this._textareaElement.addEventListener('focus', this._handleFocusEvent);
                this._textareaElement.addEventListener('blur', this._handleFocusEvent);
            });
            this._isViewInited = true;
            this.resizeToFitContent(true);
        }
    }
    ngOnDestroy() {
        this._textareaElement.removeEventListener('focus', this._handleFocusEvent);
        this._textareaElement.removeEventListener('blur', this._handleFocusEvent);
        this._destroyed.next();
        this._destroyed.complete();
    }
    /**
     * Cache the height of a single-row textarea if it has not already been cached.
     *
     * We need to know how large a single "row" of a textarea is in order to apply minRows and
     * maxRows. For the initial version, we will assume that the height of a single line in the
     * textarea does not ever change.
     */
    _cacheTextareaLineHeight() {
        if (this._cachedLineHeight) {
            return;
        }
        // Use a clone element because we have to override some styles.
        let textareaClone = this._textareaElement.cloneNode(false);
        textareaClone.rows = 1;
        // Use `position: absolute` so that this doesn't cause a browser layout and use
        // `visibility: hidden` so that nothing is rendered. Clear any other styles that
        // would affect the height.
        textareaClone.style.position = 'absolute';
        textareaClone.style.visibility = 'hidden';
        textareaClone.style.border = 'none';
        textareaClone.style.padding = '0';
        textareaClone.style.height = '';
        textareaClone.style.minHeight = '';
        textareaClone.style.maxHeight = '';
        // In Firefox it happens that textarea elements are always bigger than the specified amount
        // of rows. This is because Firefox tries to add extra space for the horizontal scrollbar.
        // As a workaround that removes the extra space for the scrollbar, we can just set overflow
        // to hidden. This ensures that there is no invalid calculation of the line height.
        // See Firefox bug report: https://bugzilla.mozilla.org/show_bug.cgi?id=33654
        textareaClone.style.overflow = 'hidden';
        this._textareaElement.parentNode.appendChild(textareaClone);
        this._cachedLineHeight = textareaClone.clientHeight;
        textareaClone.remove();
        // Min and max heights have to be re-calculated if the cached line height changes
        this._setMinHeight();
        this._setMaxHeight();
    }
    _measureScrollHeight() {
        const element = this._textareaElement;
        const previousMargin = element.style.marginBottom || '';
        const isFirefox = this._platform.FIREFOX;
        const needsMarginFiller = isFirefox && this._hasFocus;
        const measuringClass = isFirefox
            ? 'cdk-textarea-autosize-measuring-firefox'
            : 'cdk-textarea-autosize-measuring';
        // In some cases the page might move around while we're measuring the `textarea` on Firefox. We
        // work around it by assigning a temporary margin with the same height as the `textarea` so that
        // it occupies the same amount of space. See #23233.
        if (needsMarginFiller) {
            element.style.marginBottom = `${element.clientHeight}px`;
        }
        // Reset the textarea height to auto in order to shrink back to its default size.
        // Also temporarily force overflow:hidden, so scroll bars do not interfere with calculations.
        element.classList.add(measuringClass);
        // The measuring class includes a 2px padding to workaround an issue with Chrome,
        // so we account for that extra space here by subtracting 4 (2px top + 2px bottom).
        const scrollHeight = element.scrollHeight - 4;
        element.classList.remove(measuringClass);
        if (needsMarginFiller) {
            element.style.marginBottom = previousMargin;
        }
        return scrollHeight;
    }
    _cacheTextareaPlaceholderHeight() {
        if (!this._isViewInited || this._cachedPlaceholderHeight != undefined) {
            return;
        }
        if (!this.placeholder) {
            this._cachedPlaceholderHeight = 0;
            return;
        }
        const value = this._textareaElement.value;
        this._textareaElement.value = this._textareaElement.placeholder;
        this._cachedPlaceholderHeight = this._measureScrollHeight();
        this._textareaElement.value = value;
    }
    ngDoCheck() {
        if (this._platform.isBrowser) {
            this.resizeToFitContent();
        }
    }
    /**
     * Resize the textarea to fit its content.
     * @param force Whether to force a height recalculation. By default the height will be
     *    recalculated only if the value changed since the last call.
     */
    resizeToFitContent(force = false) {
        // If autosizing is disabled, just skip everything else
        if (!this._enabled) {
            return;
        }
        this._cacheTextareaLineHeight();
        this._cacheTextareaPlaceholderHeight();
        // If we haven't determined the line-height yet, we know we're still hidden and there's no point
        // in checking the height of the textarea.
        if (!this._cachedLineHeight) {
            return;
        }
        const textarea = this._elementRef.nativeElement;
        const value = textarea.value;
        // Only resize if the value or minRows have changed since these calculations can be expensive.
        if (!force && this._minRows === this._previousMinRows && value === this._previousValue) {
            return;
        }
        const scrollHeight = this._measureScrollHeight();
        const height = Math.max(scrollHeight, this._cachedPlaceholderHeight || 0);
        // Use the scrollHeight to know how large the textarea *would* be if fit its entire value.
        textarea.style.height = `${height}px`;
        this._ngZone.runOutsideAngular(() => {
            if (typeof requestAnimationFrame !== 'undefined') {
                requestAnimationFrame(() => this._scrollToCaretPosition(textarea));
            }
            else {
                setTimeout(() => this._scrollToCaretPosition(textarea));
            }
        });
        this._previousValue = value;
        this._previousMinRows = this._minRows;
    }
    /**
     * Resets the textarea to its original size
     */
    reset() {
        // Do not try to change the textarea, if the initialHeight has not been determined yet
        // This might potentially remove styles when reset() is called before ngAfterViewInit
        if (this._initialHeight !== undefined) {
            this._textareaElement.style.height = this._initialHeight;
        }
    }
    _noopInputHandler() {
        // no-op handler that ensures we're running change detection on input events.
    }
    /** Access injected document if available or fallback to global document reference */
    _getDocument() {
        return this._document || document;
    }
    /** Use defaultView of injected document if available or fallback to global window reference */
    _getWindow() {
        const doc = this._getDocument();
        return doc.defaultView || window;
    }
    /**
     * Scrolls a textarea to the caret position. On Firefox resizing the textarea will
     * prevent it from scrolling to the caret position. We need to re-set the selection
     * in order for it to scroll to the proper position.
     */
    _scrollToCaretPosition(textarea) {
        const { selectionStart, selectionEnd } = textarea;
        // IE will throw an "Unspecified error" if we try to set the selection range after the
        // element has been removed from the DOM. Assert that the directive hasn't been destroyed
        // between the time we requested the animation frame and when it was executed.
        // Also note that we have to assert that the textarea is focused before we set the
        // selection range. Setting the selection range on a non-focused textarea will cause
        // it to receive focus on IE and Edge.
        if (!this._destroyed.isStopped && this._hasFocus) {
            textarea.setSelectionRange(selectionStart, selectionEnd);
        }
    }
}
CdkTextareaAutosize.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkTextareaAutosize, deps: [{ token: i0.ElementRef }, { token: i1.Platform }, { token: i0.NgZone }, { token: DOCUMENT, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
CdkTextareaAutosize.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: CdkTextareaAutosize, selector: "textarea[cdkTextareaAutosize]", inputs: { minRows: ["cdkAutosizeMinRows", "minRows"], maxRows: ["cdkAutosizeMaxRows", "maxRows"], enabled: ["cdkTextareaAutosize", "enabled"], placeholder: "placeholder" }, host: { attributes: { "rows": "1" }, listeners: { "input": "_noopInputHandler()" }, classAttribute: "cdk-textarea-autosize" }, exportAs: ["cdkTextareaAutosize"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkTextareaAutosize, decorators: [{
            type: Directive,
            args: [{
                    selector: 'textarea[cdkTextareaAutosize]',
                    exportAs: 'cdkTextareaAutosize',
                    host: {
                        'class': 'cdk-textarea-autosize',
                        // Textarea elements that have the directive applied should have a single row by default.
                        // Browsers normally show two rows by default and therefore this limits the minRows binding.
                        'rows': '1',
                        '(input)': '_noopInputHandler()',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.Platform }, { type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; }, propDecorators: { minRows: [{
                type: Input,
                args: ['cdkAutosizeMinRows']
            }], maxRows: [{
                type: Input,
                args: ['cdkAutosizeMaxRows']
            }], enabled: [{
                type: Input,
                args: ['cdkTextareaAutosize']
            }], placeholder: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b3NpemUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL3RleHQtZmllbGQvYXV0b3NpemUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUVMLHFCQUFxQixFQUNyQixvQkFBb0IsR0FFckIsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDVixLQUFLLEVBSUwsTUFBTSxFQUNOLFFBQVEsRUFDUixNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sRUFBQyxTQUFTLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDcEQsT0FBTyxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDeEMsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDOzs7QUFFekMsdUVBQXVFO0FBWXZFLE1BQU0sT0FBTyxtQkFBbUI7SUFrRjlCLFlBQ1UsV0FBb0MsRUFDcEMsU0FBbUIsRUFDbkIsT0FBZTtJQUN2QixxREFBcUQ7SUFDdkIsUUFBYztRQUpwQyxnQkFBVyxHQUFYLFdBQVcsQ0FBeUI7UUFDcEMsY0FBUyxHQUFULFNBQVMsQ0FBVTtRQUNuQixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBakZSLGVBQVUsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBSTFDLGFBQVEsR0FBWSxJQUFJLENBQUM7UUFFakM7Ozs7V0FJRztRQUNLLHFCQUFnQixHQUFXLENBQUMsQ0FBQyxDQUFDO1FBaUU5QixrQkFBYSxHQUFHLEtBQUssQ0FBQztRQXlKOUIseUNBQXlDO1FBQ2pDLHNCQUFpQixHQUFHLENBQUMsS0FBaUIsRUFBRSxFQUFFO1lBQ2hELElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLElBQUksS0FBSyxPQUFPLENBQUM7UUFDMUMsQ0FBQyxDQUFDO1FBbkpBLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBRTFCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQW9DLENBQUM7SUFDaEYsQ0FBQztJQXpFRCw4Q0FBOEM7SUFDOUMsSUFDSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFDRCxJQUFJLE9BQU8sQ0FBQyxLQUFrQjtRQUM1QixJQUFJLENBQUMsUUFBUSxHQUFHLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRUQsOENBQThDO0lBQzlDLElBQ0ksT0FBTztRQUNULE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDO0lBQ0QsSUFBSSxPQUFPLENBQUMsS0FBa0I7UUFDNUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM1QyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUVELDJDQUEyQztJQUMzQyxJQUNJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUNELElBQUksT0FBTyxDQUFDLEtBQW1CO1FBQzdCLEtBQUssR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVyQywyRUFBMkU7UUFDM0UsNkRBQTZEO1FBQzdELElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxLQUFLLEVBQUU7WUFDM0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUN4RTtJQUNILENBQUM7SUFFRCxJQUNJLFdBQVc7UUFDYixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUM7SUFDM0MsQ0FBQztJQUNELElBQUksV0FBVyxDQUFDLEtBQWE7UUFDM0IsSUFBSSxDQUFDLHdCQUF3QixHQUFHLFNBQVMsQ0FBQztRQUUxQyxJQUFJLEtBQUssRUFBRTtZQUNULElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQzFEO2FBQU07WUFDTCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQ3REO1FBRUQsSUFBSSxDQUFDLCtCQUErQixFQUFFLENBQUM7SUFDekMsQ0FBQztJQTBCRCx3RUFBd0U7SUFDeEUsYUFBYTtRQUNYLE1BQU0sU0FBUyxHQUNiLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUUvRixJQUFJLFNBQVMsRUFBRTtZQUNiLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztTQUNuRDtJQUNILENBQUM7SUFFRCx3RUFBd0U7SUFDeEUsYUFBYTtRQUNYLE1BQU0sU0FBUyxHQUNiLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUUvRixJQUFJLFNBQVMsRUFBRTtZQUNiLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztTQUNuRDtJQUNILENBQUM7SUFFRCxlQUFlO1FBQ2IsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRTtZQUM1QiwyRUFBMkU7WUFDM0UsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztZQUN6RCxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUUxQixJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtnQkFDbEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO2dCQUVqQyxTQUFTLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQztxQkFDeEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO3FCQUMvQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBRWxELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQ3hFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDekUsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztZQUMxQixJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDL0I7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDM0UsSUFBSSxDQUFDLGdCQUFnQixDQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUMxRSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNLLHdCQUF3QjtRQUM5QixJQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtZQUMxQixPQUFPO1NBQ1I7UUFFRCwrREFBK0Q7UUFDL0QsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQXdCLENBQUM7UUFDbEYsYUFBYSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7UUFFdkIsK0VBQStFO1FBQy9FLGdGQUFnRjtRQUNoRiwyQkFBMkI7UUFDM0IsYUFBYSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDO1FBQzFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQztRQUMxQyxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDcEMsYUFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1FBQ2xDLGFBQWEsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNoQyxhQUFhLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFDbkMsYUFBYSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBRW5DLDJGQUEyRjtRQUMzRiwwRkFBMEY7UUFDMUYsMkZBQTJGO1FBQzNGLG1GQUFtRjtRQUNuRiw2RUFBNkU7UUFDN0UsYUFBYSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBRXhDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFXLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxpQkFBaUIsR0FBRyxhQUFhLENBQUMsWUFBWSxDQUFDO1FBQ3BELGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUV2QixpRkFBaUY7UUFDakYsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRU8sb0JBQW9CO1FBQzFCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztRQUN0QyxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksSUFBSSxFQUFFLENBQUM7UUFDeEQsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7UUFDekMsTUFBTSxpQkFBaUIsR0FBRyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUN0RCxNQUFNLGNBQWMsR0FBRyxTQUFTO1lBQzlCLENBQUMsQ0FBQyx5Q0FBeUM7WUFDM0MsQ0FBQyxDQUFDLGlDQUFpQyxDQUFDO1FBRXRDLCtGQUErRjtRQUMvRixnR0FBZ0c7UUFDaEcsb0RBQW9EO1FBQ3BELElBQUksaUJBQWlCLEVBQUU7WUFDckIsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLEdBQUcsR0FBRyxPQUFPLENBQUMsWUFBWSxJQUFJLENBQUM7U0FDMUQ7UUFFRCxpRkFBaUY7UUFDakYsNkZBQTZGO1FBQzdGLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3RDLGlGQUFpRjtRQUNqRixtRkFBbUY7UUFDbkYsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7UUFDOUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFekMsSUFBSSxpQkFBaUIsRUFBRTtZQUNyQixPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksR0FBRyxjQUFjLENBQUM7U0FDN0M7UUFFRCxPQUFPLFlBQVksQ0FBQztJQUN0QixDQUFDO0lBRU8sK0JBQStCO1FBQ3JDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyx3QkFBd0IsSUFBSSxTQUFTLEVBQUU7WUFDckUsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDckIsSUFBSSxDQUFDLHdCQUF3QixHQUFHLENBQUMsQ0FBQztZQUNsQyxPQUFPO1NBQ1I7UUFFRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDO1FBRTFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQztRQUNoRSxJQUFJLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDNUQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDdEMsQ0FBQztJQU9ELFNBQVM7UUFDUCxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFO1lBQzVCLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1NBQzNCO0lBQ0gsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxrQkFBa0IsQ0FBQyxRQUFpQixLQUFLO1FBQ3ZDLHVEQUF1RDtRQUN2RCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNsQixPQUFPO1NBQ1I7UUFFRCxJQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztRQUNoQyxJQUFJLENBQUMsK0JBQStCLEVBQUUsQ0FBQztRQUV2QyxnR0FBZ0c7UUFDaEcsMENBQTBDO1FBQzFDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUU7WUFDM0IsT0FBTztTQUNSO1FBRUQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFvQyxDQUFDO1FBQ3ZFLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7UUFFN0IsOEZBQThGO1FBQzlGLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxJQUFJLENBQUMsZ0JBQWdCLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDdEYsT0FBTztTQUNSO1FBRUQsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDakQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLHdCQUF3QixJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRTFFLDBGQUEwRjtRQUMxRixRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDO1FBRXRDLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFO1lBQ2xDLElBQUksT0FBTyxxQkFBcUIsS0FBSyxXQUFXLEVBQUU7Z0JBQ2hELHFCQUFxQixDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2FBQ3BFO2lCQUFNO2dCQUNMLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzthQUN6RDtRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7UUFDNUIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDeEMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsS0FBSztRQUNILHNGQUFzRjtRQUN0RixxRkFBcUY7UUFDckYsSUFBSSxJQUFJLENBQUMsY0FBYyxLQUFLLFNBQVMsRUFBRTtZQUNyQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO1NBQzFEO0lBQ0gsQ0FBQztJQUVELGlCQUFpQjtRQUNmLDZFQUE2RTtJQUMvRSxDQUFDO0lBRUQscUZBQXFGO0lBQzdFLFlBQVk7UUFDbEIsT0FBTyxJQUFJLENBQUMsU0FBUyxJQUFJLFFBQVEsQ0FBQztJQUNwQyxDQUFDO0lBRUQsK0ZBQStGO0lBQ3ZGLFVBQVU7UUFDaEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ2hDLE9BQU8sR0FBRyxDQUFDLFdBQVcsSUFBSSxNQUFNLENBQUM7SUFDbkMsQ0FBQztJQUVEOzs7O09BSUc7SUFDSyxzQkFBc0IsQ0FBQyxRQUE2QjtRQUMxRCxNQUFNLEVBQUMsY0FBYyxFQUFFLFlBQVksRUFBQyxHQUFHLFFBQVEsQ0FBQztRQUVoRCxzRkFBc0Y7UUFDdEYseUZBQXlGO1FBQ3pGLDhFQUE4RTtRQUM5RSxrRkFBa0Y7UUFDbEYsb0ZBQW9GO1FBQ3BGLHNDQUFzQztRQUN0QyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNoRCxRQUFRLENBQUMsaUJBQWlCLENBQUMsY0FBYyxFQUFFLFlBQVksQ0FBQyxDQUFDO1NBQzFEO0lBQ0gsQ0FBQzs7Z0hBN1VVLG1CQUFtQiwwRkF1RlIsUUFBUTtvR0F2Rm5CLG1CQUFtQjsyRkFBbkIsbUJBQW1CO2tCQVgvQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSwrQkFBK0I7b0JBQ3pDLFFBQVEsRUFBRSxxQkFBcUI7b0JBQy9CLElBQUksRUFBRTt3QkFDSixPQUFPLEVBQUUsdUJBQXVCO3dCQUNoQyx5RkFBeUY7d0JBQ3pGLDRGQUE0Rjt3QkFDNUYsTUFBTSxFQUFFLEdBQUc7d0JBQ1gsU0FBUyxFQUFFLHFCQUFxQjtxQkFDakM7aUJBQ0Y7OzBCQXdGSSxRQUFROzswQkFBSSxNQUFNOzJCQUFDLFFBQVE7NENBbEUxQixPQUFPO3NCQURWLEtBQUs7dUJBQUMsb0JBQW9CO2dCQVd2QixPQUFPO3NCQURWLEtBQUs7dUJBQUMsb0JBQW9CO2dCQVd2QixPQUFPO3NCQURWLEtBQUs7dUJBQUMscUJBQXFCO2dCQWV4QixXQUFXO3NCQURkLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQm9vbGVhbklucHV0LFxuICBjb2VyY2VCb29sZWFuUHJvcGVydHksXG4gIGNvZXJjZU51bWJlclByb3BlcnR5LFxuICBOdW1iZXJJbnB1dCxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgSW5wdXQsXG4gIEFmdGVyVmlld0luaXQsXG4gIERvQ2hlY2ssXG4gIE9uRGVzdHJveSxcbiAgTmdab25lLFxuICBPcHRpb25hbCxcbiAgSW5qZWN0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge2F1ZGl0VGltZSwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge2Zyb21FdmVudCwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG4vKiogRGlyZWN0aXZlIHRvIGF1dG9tYXRpY2FsbHkgcmVzaXplIGEgdGV4dGFyZWEgdG8gZml0IGl0cyBjb250ZW50LiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAndGV4dGFyZWFbY2RrVGV4dGFyZWFBdXRvc2l6ZV0nLFxuICBleHBvcnRBczogJ2Nka1RleHRhcmVhQXV0b3NpemUnLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ2Nkay10ZXh0YXJlYS1hdXRvc2l6ZScsXG4gICAgLy8gVGV4dGFyZWEgZWxlbWVudHMgdGhhdCBoYXZlIHRoZSBkaXJlY3RpdmUgYXBwbGllZCBzaG91bGQgaGF2ZSBhIHNpbmdsZSByb3cgYnkgZGVmYXVsdC5cbiAgICAvLyBCcm93c2VycyBub3JtYWxseSBzaG93IHR3byByb3dzIGJ5IGRlZmF1bHQgYW5kIHRoZXJlZm9yZSB0aGlzIGxpbWl0cyB0aGUgbWluUm93cyBiaW5kaW5nLlxuICAgICdyb3dzJzogJzEnLFxuICAgICcoaW5wdXQpJzogJ19ub29wSW5wdXRIYW5kbGVyKCknLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBDZGtUZXh0YXJlYUF1dG9zaXplIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgRG9DaGVjaywgT25EZXN0cm95IHtcbiAgLyoqIEtlZXAgdHJhY2sgb2YgdGhlIHByZXZpb3VzIHRleHRhcmVhIHZhbHVlIHRvIGF2b2lkIHJlc2l6aW5nIHdoZW4gdGhlIHZhbHVlIGhhc24ndCBjaGFuZ2VkLiAqL1xuICBwcml2YXRlIF9wcmV2aW91c1ZhbHVlPzogc3RyaW5nO1xuICBwcml2YXRlIF9pbml0aWFsSGVpZ2h0OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgcHJpdmF0ZSBfbWluUm93czogbnVtYmVyO1xuICBwcml2YXRlIF9tYXhSb3dzOiBudW1iZXI7XG4gIHByaXZhdGUgX2VuYWJsZWQ6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBWYWx1ZSBvZiBtaW5Sb3dzIGFzIG9mIGxhc3QgcmVzaXplLiBJZiB0aGUgbWluUm93cyBoYXMgZGVjcmVhc2VkLCB0aGVcbiAgICogaGVpZ2h0IG9mIHRoZSB0ZXh0YXJlYSBuZWVkcyB0byBiZSByZWNvbXB1dGVkIHRvIHJlZmxlY3QgdGhlIG5ldyBtaW5pbXVtLiBUaGUgbWF4SGVpZ2h0XG4gICAqIGRvZXMgbm90IGhhdmUgdGhlIHNhbWUgcHJvYmxlbSBiZWNhdXNlIGl0IGRvZXMgbm90IGFmZmVjdCB0aGUgdGV4dGFyZWEncyBzY3JvbGxIZWlnaHQuXG4gICAqL1xuICBwcml2YXRlIF9wcmV2aW91c01pblJvd3M6IG51bWJlciA9IC0xO1xuXG4gIHByaXZhdGUgX3RleHRhcmVhRWxlbWVudDogSFRNTFRleHRBcmVhRWxlbWVudDtcblxuICAvKiogTWluaW11bSBhbW91bnQgb2Ygcm93cyBpbiB0aGUgdGV4dGFyZWEuICovXG4gIEBJbnB1dCgnY2RrQXV0b3NpemVNaW5Sb3dzJylcbiAgZ2V0IG1pblJvd3MoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fbWluUm93cztcbiAgfVxuICBzZXQgbWluUm93cyh2YWx1ZTogTnVtYmVySW5wdXQpIHtcbiAgICB0aGlzLl9taW5Sb3dzID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMuX3NldE1pbkhlaWdodCgpO1xuICB9XG5cbiAgLyoqIE1heGltdW0gYW1vdW50IG9mIHJvd3MgaW4gdGhlIHRleHRhcmVhLiAqL1xuICBASW5wdXQoJ2Nka0F1dG9zaXplTWF4Um93cycpXG4gIGdldCBtYXhSb3dzKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX21heFJvd3M7XG4gIH1cbiAgc2V0IG1heFJvd3ModmFsdWU6IE51bWJlcklucHV0KSB7XG4gICAgdGhpcy5fbWF4Um93cyA9IGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKTtcbiAgICB0aGlzLl9zZXRNYXhIZWlnaHQoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIGF1dG9zaXppbmcgaXMgZW5hYmxlZCBvciBub3QgKi9cbiAgQElucHV0KCdjZGtUZXh0YXJlYUF1dG9zaXplJylcbiAgZ2V0IGVuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2VuYWJsZWQ7XG4gIH1cbiAgc2V0IGVuYWJsZWQodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHZhbHVlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcblxuICAgIC8vIE9ubHkgYWN0IGlmIHRoZSBhY3R1YWwgdmFsdWUgY2hhbmdlZC4gVGhpcyBzcGVjaWZpY2FsbHkgaGVscHMgdG8gbm90IHJ1blxuICAgIC8vIHJlc2l6ZVRvRml0Q29udGVudCB0b28gZWFybHkgKGkuZS4gYmVmb3JlIG5nQWZ0ZXJWaWV3SW5pdClcbiAgICBpZiAodGhpcy5fZW5hYmxlZCAhPT0gdmFsdWUpIHtcbiAgICAgICh0aGlzLl9lbmFibGVkID0gdmFsdWUpID8gdGhpcy5yZXNpemVUb0ZpdENvbnRlbnQodHJ1ZSkgOiB0aGlzLnJlc2V0KCk7XG4gICAgfVxuICB9XG5cbiAgQElucHV0KClcbiAgZ2V0IHBsYWNlaG9sZGVyKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3RleHRhcmVhRWxlbWVudC5wbGFjZWhvbGRlcjtcbiAgfVxuICBzZXQgcGxhY2Vob2xkZXIodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX2NhY2hlZFBsYWNlaG9sZGVySGVpZ2h0ID0gdW5kZWZpbmVkO1xuXG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLl90ZXh0YXJlYUVsZW1lbnQuc2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlcicsIHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdGV4dGFyZWFFbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgncGxhY2Vob2xkZXInKTtcbiAgICB9XG5cbiAgICB0aGlzLl9jYWNoZVRleHRhcmVhUGxhY2Vob2xkZXJIZWlnaHQoKTtcbiAgfVxuXG4gIC8qKiBDYWNoZWQgaGVpZ2h0IG9mIGEgdGV4dGFyZWEgd2l0aCBhIHNpbmdsZSByb3cuICovXG4gIHByaXZhdGUgX2NhY2hlZExpbmVIZWlnaHQ6IG51bWJlcjtcbiAgLyoqIENhY2hlZCBoZWlnaHQgb2YgYSB0ZXh0YXJlYSB3aXRoIG9ubHkgdGhlIHBsYWNlaG9sZGVyLiAqL1xuICBwcml2YXRlIF9jYWNoZWRQbGFjZWhvbGRlckhlaWdodD86IG51bWJlcjtcblxuICAvKiogVXNlZCB0byByZWZlcmVuY2UgY29ycmVjdCBkb2N1bWVudC93aW5kb3cgKi9cbiAgcHJvdGVjdGVkIF9kb2N1bWVudD86IERvY3VtZW50O1xuXG4gIHByaXZhdGUgX2hhc0ZvY3VzOiBib29sZWFuO1xuXG4gIHByaXZhdGUgX2lzVmlld0luaXRlZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgX3BsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICAvKiogQGJyZWFraW5nLWNoYW5nZSAxMS4wLjAgbWFrZSBkb2N1bWVudCByZXF1aXJlZCAqL1xuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoRE9DVU1FTlQpIGRvY3VtZW50PzogYW55LFxuICApIHtcbiAgICB0aGlzLl9kb2N1bWVudCA9IGRvY3VtZW50O1xuXG4gICAgdGhpcy5fdGV4dGFyZWFFbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50IGFzIEhUTUxUZXh0QXJlYUVsZW1lbnQ7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgbWluaW11bSBoZWlnaHQgb2YgdGhlIHRleHRhcmVhIGFzIGRldGVybWluZWQgYnkgbWluUm93cy4gKi9cbiAgX3NldE1pbkhlaWdodCgpOiB2b2lkIHtcbiAgICBjb25zdCBtaW5IZWlnaHQgPVxuICAgICAgdGhpcy5taW5Sb3dzICYmIHRoaXMuX2NhY2hlZExpbmVIZWlnaHQgPyBgJHt0aGlzLm1pblJvd3MgKiB0aGlzLl9jYWNoZWRMaW5lSGVpZ2h0fXB4YCA6IG51bGw7XG5cbiAgICBpZiAobWluSGVpZ2h0KSB7XG4gICAgICB0aGlzLl90ZXh0YXJlYUVsZW1lbnQuc3R5bGUubWluSGVpZ2h0ID0gbWluSGVpZ2h0O1xuICAgIH1cbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBtYXhpbXVtIGhlaWdodCBvZiB0aGUgdGV4dGFyZWEgYXMgZGV0ZXJtaW5lZCBieSBtYXhSb3dzLiAqL1xuICBfc2V0TWF4SGVpZ2h0KCk6IHZvaWQge1xuICAgIGNvbnN0IG1heEhlaWdodCA9XG4gICAgICB0aGlzLm1heFJvd3MgJiYgdGhpcy5fY2FjaGVkTGluZUhlaWdodCA/IGAke3RoaXMubWF4Um93cyAqIHRoaXMuX2NhY2hlZExpbmVIZWlnaHR9cHhgIDogbnVsbDtcblxuICAgIGlmIChtYXhIZWlnaHQpIHtcbiAgICAgIHRoaXMuX3RleHRhcmVhRWxlbWVudC5zdHlsZS5tYXhIZWlnaHQgPSBtYXhIZWlnaHQ7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmICh0aGlzLl9wbGF0Zm9ybS5pc0Jyb3dzZXIpIHtcbiAgICAgIC8vIFJlbWVtYmVyIHRoZSBoZWlnaHQgd2hpY2ggd2Ugc3RhcnRlZCB3aXRoIGluIGNhc2UgYXV0b3NpemluZyBpcyBkaXNhYmxlZFxuICAgICAgdGhpcy5faW5pdGlhbEhlaWdodCA9IHRoaXMuX3RleHRhcmVhRWxlbWVudC5zdHlsZS5oZWlnaHQ7XG4gICAgICB0aGlzLnJlc2l6ZVRvRml0Q29udGVudCgpO1xuXG4gICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICBjb25zdCB3aW5kb3cgPSB0aGlzLl9nZXRXaW5kb3coKTtcblxuICAgICAgICBmcm9tRXZlbnQod2luZG93LCAncmVzaXplJylcbiAgICAgICAgICAucGlwZShhdWRpdFRpbWUoMTYpLCB0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSlcbiAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHRoaXMucmVzaXplVG9GaXRDb250ZW50KHRydWUpKTtcblxuICAgICAgICB0aGlzLl90ZXh0YXJlYUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0aGlzLl9oYW5kbGVGb2N1c0V2ZW50KTtcbiAgICAgICAgdGhpcy5fdGV4dGFyZWFFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLl9oYW5kbGVGb2N1c0V2ZW50KTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl9pc1ZpZXdJbml0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5yZXNpemVUb0ZpdENvbnRlbnQodHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fdGV4dGFyZWFFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5faGFuZGxlRm9jdXNFdmVudCk7XG4gICAgdGhpcy5fdGV4dGFyZWFFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLl9oYW5kbGVGb2N1c0V2ZW50KTtcbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhY2hlIHRoZSBoZWlnaHQgb2YgYSBzaW5nbGUtcm93IHRleHRhcmVhIGlmIGl0IGhhcyBub3QgYWxyZWFkeSBiZWVuIGNhY2hlZC5cbiAgICpcbiAgICogV2UgbmVlZCB0byBrbm93IGhvdyBsYXJnZSBhIHNpbmdsZSBcInJvd1wiIG9mIGEgdGV4dGFyZWEgaXMgaW4gb3JkZXIgdG8gYXBwbHkgbWluUm93cyBhbmRcbiAgICogbWF4Um93cy4gRm9yIHRoZSBpbml0aWFsIHZlcnNpb24sIHdlIHdpbGwgYXNzdW1lIHRoYXQgdGhlIGhlaWdodCBvZiBhIHNpbmdsZSBsaW5lIGluIHRoZVxuICAgKiB0ZXh0YXJlYSBkb2VzIG5vdCBldmVyIGNoYW5nZS5cbiAgICovXG4gIHByaXZhdGUgX2NhY2hlVGV4dGFyZWFMaW5lSGVpZ2h0KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9jYWNoZWRMaW5lSGVpZ2h0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVXNlIGEgY2xvbmUgZWxlbWVudCBiZWNhdXNlIHdlIGhhdmUgdG8gb3ZlcnJpZGUgc29tZSBzdHlsZXMuXG4gICAgbGV0IHRleHRhcmVhQ2xvbmUgPSB0aGlzLl90ZXh0YXJlYUVsZW1lbnQuY2xvbmVOb2RlKGZhbHNlKSBhcyBIVE1MVGV4dEFyZWFFbGVtZW50O1xuICAgIHRleHRhcmVhQ2xvbmUucm93cyA9IDE7XG5cbiAgICAvLyBVc2UgYHBvc2l0aW9uOiBhYnNvbHV0ZWAgc28gdGhhdCB0aGlzIGRvZXNuJ3QgY2F1c2UgYSBicm93c2VyIGxheW91dCBhbmQgdXNlXG4gICAgLy8gYHZpc2liaWxpdHk6IGhpZGRlbmAgc28gdGhhdCBub3RoaW5nIGlzIHJlbmRlcmVkLiBDbGVhciBhbnkgb3RoZXIgc3R5bGVzIHRoYXRcbiAgICAvLyB3b3VsZCBhZmZlY3QgdGhlIGhlaWdodC5cbiAgICB0ZXh0YXJlYUNsb25lLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICB0ZXh0YXJlYUNsb25lLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICB0ZXh0YXJlYUNsb25lLnN0eWxlLmJvcmRlciA9ICdub25lJztcbiAgICB0ZXh0YXJlYUNsb25lLnN0eWxlLnBhZGRpbmcgPSAnMCc7XG4gICAgdGV4dGFyZWFDbG9uZS5zdHlsZS5oZWlnaHQgPSAnJztcbiAgICB0ZXh0YXJlYUNsb25lLnN0eWxlLm1pbkhlaWdodCA9ICcnO1xuICAgIHRleHRhcmVhQ2xvbmUuc3R5bGUubWF4SGVpZ2h0ID0gJyc7XG5cbiAgICAvLyBJbiBGaXJlZm94IGl0IGhhcHBlbnMgdGhhdCB0ZXh0YXJlYSBlbGVtZW50cyBhcmUgYWx3YXlzIGJpZ2dlciB0aGFuIHRoZSBzcGVjaWZpZWQgYW1vdW50XG4gICAgLy8gb2Ygcm93cy4gVGhpcyBpcyBiZWNhdXNlIEZpcmVmb3ggdHJpZXMgdG8gYWRkIGV4dHJhIHNwYWNlIGZvciB0aGUgaG9yaXpvbnRhbCBzY3JvbGxiYXIuXG4gICAgLy8gQXMgYSB3b3JrYXJvdW5kIHRoYXQgcmVtb3ZlcyB0aGUgZXh0cmEgc3BhY2UgZm9yIHRoZSBzY3JvbGxiYXIsIHdlIGNhbiBqdXN0IHNldCBvdmVyZmxvd1xuICAgIC8vIHRvIGhpZGRlbi4gVGhpcyBlbnN1cmVzIHRoYXQgdGhlcmUgaXMgbm8gaW52YWxpZCBjYWxjdWxhdGlvbiBvZiB0aGUgbGluZSBoZWlnaHQuXG4gICAgLy8gU2VlIEZpcmVmb3ggYnVnIHJlcG9ydDogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MzM2NTRcbiAgICB0ZXh0YXJlYUNsb25lLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG5cbiAgICB0aGlzLl90ZXh0YXJlYUVsZW1lbnQucGFyZW50Tm9kZSEuYXBwZW5kQ2hpbGQodGV4dGFyZWFDbG9uZSk7XG4gICAgdGhpcy5fY2FjaGVkTGluZUhlaWdodCA9IHRleHRhcmVhQ2xvbmUuY2xpZW50SGVpZ2h0O1xuICAgIHRleHRhcmVhQ2xvbmUucmVtb3ZlKCk7XG5cbiAgICAvLyBNaW4gYW5kIG1heCBoZWlnaHRzIGhhdmUgdG8gYmUgcmUtY2FsY3VsYXRlZCBpZiB0aGUgY2FjaGVkIGxpbmUgaGVpZ2h0IGNoYW5nZXNcbiAgICB0aGlzLl9zZXRNaW5IZWlnaHQoKTtcbiAgICB0aGlzLl9zZXRNYXhIZWlnaHQoKTtcbiAgfVxuXG4gIHByaXZhdGUgX21lYXN1cmVTY3JvbGxIZWlnaHQoKTogbnVtYmVyIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fdGV4dGFyZWFFbGVtZW50O1xuICAgIGNvbnN0IHByZXZpb3VzTWFyZ2luID0gZWxlbWVudC5zdHlsZS5tYXJnaW5Cb3R0b20gfHwgJyc7XG4gICAgY29uc3QgaXNGaXJlZm94ID0gdGhpcy5fcGxhdGZvcm0uRklSRUZPWDtcbiAgICBjb25zdCBuZWVkc01hcmdpbkZpbGxlciA9IGlzRmlyZWZveCAmJiB0aGlzLl9oYXNGb2N1cztcbiAgICBjb25zdCBtZWFzdXJpbmdDbGFzcyA9IGlzRmlyZWZveFxuICAgICAgPyAnY2RrLXRleHRhcmVhLWF1dG9zaXplLW1lYXN1cmluZy1maXJlZm94J1xuICAgICAgOiAnY2RrLXRleHRhcmVhLWF1dG9zaXplLW1lYXN1cmluZyc7XG5cbiAgICAvLyBJbiBzb21lIGNhc2VzIHRoZSBwYWdlIG1pZ2h0IG1vdmUgYXJvdW5kIHdoaWxlIHdlJ3JlIG1lYXN1cmluZyB0aGUgYHRleHRhcmVhYCBvbiBGaXJlZm94LiBXZVxuICAgIC8vIHdvcmsgYXJvdW5kIGl0IGJ5IGFzc2lnbmluZyBhIHRlbXBvcmFyeSBtYXJnaW4gd2l0aCB0aGUgc2FtZSBoZWlnaHQgYXMgdGhlIGB0ZXh0YXJlYWAgc28gdGhhdFxuICAgIC8vIGl0IG9jY3VwaWVzIHRoZSBzYW1lIGFtb3VudCBvZiBzcGFjZS4gU2VlICMyMzIzMy5cbiAgICBpZiAobmVlZHNNYXJnaW5GaWxsZXIpIHtcbiAgICAgIGVsZW1lbnQuc3R5bGUubWFyZ2luQm90dG9tID0gYCR7ZWxlbWVudC5jbGllbnRIZWlnaHR9cHhgO1xuICAgIH1cblxuICAgIC8vIFJlc2V0IHRoZSB0ZXh0YXJlYSBoZWlnaHQgdG8gYXV0byBpbiBvcmRlciB0byBzaHJpbmsgYmFjayB0byBpdHMgZGVmYXVsdCBzaXplLlxuICAgIC8vIEFsc28gdGVtcG9yYXJpbHkgZm9yY2Ugb3ZlcmZsb3c6aGlkZGVuLCBzbyBzY3JvbGwgYmFycyBkbyBub3QgaW50ZXJmZXJlIHdpdGggY2FsY3VsYXRpb25zLlxuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChtZWFzdXJpbmdDbGFzcyk7XG4gICAgLy8gVGhlIG1lYXN1cmluZyBjbGFzcyBpbmNsdWRlcyBhIDJweCBwYWRkaW5nIHRvIHdvcmthcm91bmQgYW4gaXNzdWUgd2l0aCBDaHJvbWUsXG4gICAgLy8gc28gd2UgYWNjb3VudCBmb3IgdGhhdCBleHRyYSBzcGFjZSBoZXJlIGJ5IHN1YnRyYWN0aW5nIDQgKDJweCB0b3AgKyAycHggYm90dG9tKS5cbiAgICBjb25zdCBzY3JvbGxIZWlnaHQgPSBlbGVtZW50LnNjcm9sbEhlaWdodCAtIDQ7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKG1lYXN1cmluZ0NsYXNzKTtcblxuICAgIGlmIChuZWVkc01hcmdpbkZpbGxlcikge1xuICAgICAgZWxlbWVudC5zdHlsZS5tYXJnaW5Cb3R0b20gPSBwcmV2aW91c01hcmdpbjtcbiAgICB9XG5cbiAgICByZXR1cm4gc2Nyb2xsSGVpZ2h0O1xuICB9XG5cbiAgcHJpdmF0ZSBfY2FjaGVUZXh0YXJlYVBsYWNlaG9sZGVySGVpZ2h0KCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5faXNWaWV3SW5pdGVkIHx8IHRoaXMuX2NhY2hlZFBsYWNlaG9sZGVySGVpZ2h0ICE9IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRoaXMucGxhY2Vob2xkZXIpIHtcbiAgICAgIHRoaXMuX2NhY2hlZFBsYWNlaG9sZGVySGVpZ2h0ID0gMDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuX3RleHRhcmVhRWxlbWVudC52YWx1ZTtcblxuICAgIHRoaXMuX3RleHRhcmVhRWxlbWVudC52YWx1ZSA9IHRoaXMuX3RleHRhcmVhRWxlbWVudC5wbGFjZWhvbGRlcjtcbiAgICB0aGlzLl9jYWNoZWRQbGFjZWhvbGRlckhlaWdodCA9IHRoaXMuX21lYXN1cmVTY3JvbGxIZWlnaHQoKTtcbiAgICB0aGlzLl90ZXh0YXJlYUVsZW1lbnQudmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGBmb2N1c2AgYW5kIGBibHVyYCBldmVudHMuICovXG4gIHByaXZhdGUgX2hhbmRsZUZvY3VzRXZlbnQgPSAoZXZlbnQ6IEZvY3VzRXZlbnQpID0+IHtcbiAgICB0aGlzLl9oYXNGb2N1cyA9IGV2ZW50LnR5cGUgPT09ICdmb2N1cyc7XG4gIH07XG5cbiAgbmdEb0NoZWNrKCkge1xuICAgIGlmICh0aGlzLl9wbGF0Zm9ybS5pc0Jyb3dzZXIpIHtcbiAgICAgIHRoaXMucmVzaXplVG9GaXRDb250ZW50KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlc2l6ZSB0aGUgdGV4dGFyZWEgdG8gZml0IGl0cyBjb250ZW50LlxuICAgKiBAcGFyYW0gZm9yY2UgV2hldGhlciB0byBmb3JjZSBhIGhlaWdodCByZWNhbGN1bGF0aW9uLiBCeSBkZWZhdWx0IHRoZSBoZWlnaHQgd2lsbCBiZVxuICAgKiAgICByZWNhbGN1bGF0ZWQgb25seSBpZiB0aGUgdmFsdWUgY2hhbmdlZCBzaW5jZSB0aGUgbGFzdCBjYWxsLlxuICAgKi9cbiAgcmVzaXplVG9GaXRDb250ZW50KGZvcmNlOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICAvLyBJZiBhdXRvc2l6aW5nIGlzIGRpc2FibGVkLCBqdXN0IHNraXAgZXZlcnl0aGluZyBlbHNlXG4gICAgaWYgKCF0aGlzLl9lbmFibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fY2FjaGVUZXh0YXJlYUxpbmVIZWlnaHQoKTtcbiAgICB0aGlzLl9jYWNoZVRleHRhcmVhUGxhY2Vob2xkZXJIZWlnaHQoKTtcblxuICAgIC8vIElmIHdlIGhhdmVuJ3QgZGV0ZXJtaW5lZCB0aGUgbGluZS1oZWlnaHQgeWV0LCB3ZSBrbm93IHdlJ3JlIHN0aWxsIGhpZGRlbiBhbmQgdGhlcmUncyBubyBwb2ludFxuICAgIC8vIGluIGNoZWNraW5nIHRoZSBoZWlnaHQgb2YgdGhlIHRleHRhcmVhLlxuICAgIGlmICghdGhpcy5fY2FjaGVkTGluZUhlaWdodCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHRleHRhcmVhID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50IGFzIEhUTUxUZXh0QXJlYUVsZW1lbnQ7XG4gICAgY29uc3QgdmFsdWUgPSB0ZXh0YXJlYS52YWx1ZTtcblxuICAgIC8vIE9ubHkgcmVzaXplIGlmIHRoZSB2YWx1ZSBvciBtaW5Sb3dzIGhhdmUgY2hhbmdlZCBzaW5jZSB0aGVzZSBjYWxjdWxhdGlvbnMgY2FuIGJlIGV4cGVuc2l2ZS5cbiAgICBpZiAoIWZvcmNlICYmIHRoaXMuX21pblJvd3MgPT09IHRoaXMuX3ByZXZpb3VzTWluUm93cyAmJiB2YWx1ZSA9PT0gdGhpcy5fcHJldmlvdXNWYWx1ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNjcm9sbEhlaWdodCA9IHRoaXMuX21lYXN1cmVTY3JvbGxIZWlnaHQoKTtcbiAgICBjb25zdCBoZWlnaHQgPSBNYXRoLm1heChzY3JvbGxIZWlnaHQsIHRoaXMuX2NhY2hlZFBsYWNlaG9sZGVySGVpZ2h0IHx8IDApO1xuXG4gICAgLy8gVXNlIHRoZSBzY3JvbGxIZWlnaHQgdG8ga25vdyBob3cgbGFyZ2UgdGhlIHRleHRhcmVhICp3b3VsZCogYmUgaWYgZml0IGl0cyBlbnRpcmUgdmFsdWUuXG4gICAgdGV4dGFyZWEuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0fXB4YDtcblxuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIHJlcXVlc3RBbmltYXRpb25GcmFtZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuX3Njcm9sbFRvQ2FyZXRQb3NpdGlvbih0ZXh0YXJlYSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLl9zY3JvbGxUb0NhcmV0UG9zaXRpb24odGV4dGFyZWEpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuX3ByZXZpb3VzVmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLl9wcmV2aW91c01pblJvd3MgPSB0aGlzLl9taW5Sb3dzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgdGV4dGFyZWEgdG8gaXRzIG9yaWdpbmFsIHNpemVcbiAgICovXG4gIHJlc2V0KCkge1xuICAgIC8vIERvIG5vdCB0cnkgdG8gY2hhbmdlIHRoZSB0ZXh0YXJlYSwgaWYgdGhlIGluaXRpYWxIZWlnaHQgaGFzIG5vdCBiZWVuIGRldGVybWluZWQgeWV0XG4gICAgLy8gVGhpcyBtaWdodCBwb3RlbnRpYWxseSByZW1vdmUgc3R5bGVzIHdoZW4gcmVzZXQoKSBpcyBjYWxsZWQgYmVmb3JlIG5nQWZ0ZXJWaWV3SW5pdFxuICAgIGlmICh0aGlzLl9pbml0aWFsSGVpZ2h0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuX3RleHRhcmVhRWxlbWVudC5zdHlsZS5oZWlnaHQgPSB0aGlzLl9pbml0aWFsSGVpZ2h0O1xuICAgIH1cbiAgfVxuXG4gIF9ub29wSW5wdXRIYW5kbGVyKCkge1xuICAgIC8vIG5vLW9wIGhhbmRsZXIgdGhhdCBlbnN1cmVzIHdlJ3JlIHJ1bm5pbmcgY2hhbmdlIGRldGVjdGlvbiBvbiBpbnB1dCBldmVudHMuXG4gIH1cblxuICAvKiogQWNjZXNzIGluamVjdGVkIGRvY3VtZW50IGlmIGF2YWlsYWJsZSBvciBmYWxsYmFjayB0byBnbG9iYWwgZG9jdW1lbnQgcmVmZXJlbmNlICovXG4gIHByaXZhdGUgX2dldERvY3VtZW50KCk6IERvY3VtZW50IHtcbiAgICByZXR1cm4gdGhpcy5fZG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG4gIH1cblxuICAvKiogVXNlIGRlZmF1bHRWaWV3IG9mIGluamVjdGVkIGRvY3VtZW50IGlmIGF2YWlsYWJsZSBvciBmYWxsYmFjayB0byBnbG9iYWwgd2luZG93IHJlZmVyZW5jZSAqL1xuICBwcml2YXRlIF9nZXRXaW5kb3coKTogV2luZG93IHtcbiAgICBjb25zdCBkb2MgPSB0aGlzLl9nZXREb2N1bWVudCgpO1xuICAgIHJldHVybiBkb2MuZGVmYXVsdFZpZXcgfHwgd2luZG93O1xuICB9XG5cbiAgLyoqXG4gICAqIFNjcm9sbHMgYSB0ZXh0YXJlYSB0byB0aGUgY2FyZXQgcG9zaXRpb24uIE9uIEZpcmVmb3ggcmVzaXppbmcgdGhlIHRleHRhcmVhIHdpbGxcbiAgICogcHJldmVudCBpdCBmcm9tIHNjcm9sbGluZyB0byB0aGUgY2FyZXQgcG9zaXRpb24uIFdlIG5lZWQgdG8gcmUtc2V0IHRoZSBzZWxlY3Rpb25cbiAgICogaW4gb3JkZXIgZm9yIGl0IHRvIHNjcm9sbCB0byB0aGUgcHJvcGVyIHBvc2l0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSBfc2Nyb2xsVG9DYXJldFBvc2l0aW9uKHRleHRhcmVhOiBIVE1MVGV4dEFyZWFFbGVtZW50KSB7XG4gICAgY29uc3Qge3NlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmR9ID0gdGV4dGFyZWE7XG5cbiAgICAvLyBJRSB3aWxsIHRocm93IGFuIFwiVW5zcGVjaWZpZWQgZXJyb3JcIiBpZiB3ZSB0cnkgdG8gc2V0IHRoZSBzZWxlY3Rpb24gcmFuZ2UgYWZ0ZXIgdGhlXG4gICAgLy8gZWxlbWVudCBoYXMgYmVlbiByZW1vdmVkIGZyb20gdGhlIERPTS4gQXNzZXJ0IHRoYXQgdGhlIGRpcmVjdGl2ZSBoYXNuJ3QgYmVlbiBkZXN0cm95ZWRcbiAgICAvLyBiZXR3ZWVuIHRoZSB0aW1lIHdlIHJlcXVlc3RlZCB0aGUgYW5pbWF0aW9uIGZyYW1lIGFuZCB3aGVuIGl0IHdhcyBleGVjdXRlZC5cbiAgICAvLyBBbHNvIG5vdGUgdGhhdCB3ZSBoYXZlIHRvIGFzc2VydCB0aGF0IHRoZSB0ZXh0YXJlYSBpcyBmb2N1c2VkIGJlZm9yZSB3ZSBzZXQgdGhlXG4gICAgLy8gc2VsZWN0aW9uIHJhbmdlLiBTZXR0aW5nIHRoZSBzZWxlY3Rpb24gcmFuZ2Ugb24gYSBub24tZm9jdXNlZCB0ZXh0YXJlYSB3aWxsIGNhdXNlXG4gICAgLy8gaXQgdG8gcmVjZWl2ZSBmb2N1cyBvbiBJRSBhbmQgRWRnZS5cbiAgICBpZiAoIXRoaXMuX2Rlc3Ryb3llZC5pc1N0b3BwZWQgJiYgdGhpcy5faGFzRm9jdXMpIHtcbiAgICAgIHRleHRhcmVhLnNldFNlbGVjdGlvblJhbmdlKHNlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmQpO1xuICAgIH1cbiAgfVxufVxuIl19