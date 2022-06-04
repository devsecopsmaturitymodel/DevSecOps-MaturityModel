/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Directive, forwardRef, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { VIRTUAL_SCROLL_STRATEGY } from './virtual-scroll-strategy';
import * as i0 from "@angular/core";
/** Virtual scrolling strategy for lists with items of known fixed size. */
export class FixedSizeVirtualScrollStrategy {
    /**
     * @param itemSize The size of the items in the virtually scrolling list.
     * @param minBufferPx The minimum amount of buffer (in pixels) before needing to render more
     * @param maxBufferPx The amount of buffer (in pixels) to render when rendering more.
     */
    constructor(itemSize, minBufferPx, maxBufferPx) {
        this._scrolledIndexChange = new Subject();
        /** @docs-private Implemented as part of VirtualScrollStrategy. */
        this.scrolledIndexChange = this._scrolledIndexChange.pipe(distinctUntilChanged());
        /** The attached viewport. */
        this._viewport = null;
        this._itemSize = itemSize;
        this._minBufferPx = minBufferPx;
        this._maxBufferPx = maxBufferPx;
    }
    /**
     * Attaches this scroll strategy to a viewport.
     * @param viewport The viewport to attach this strategy to.
     */
    attach(viewport) {
        this._viewport = viewport;
        this._updateTotalContentSize();
        this._updateRenderedRange();
    }
    /** Detaches this scroll strategy from the currently attached viewport. */
    detach() {
        this._scrolledIndexChange.complete();
        this._viewport = null;
    }
    /**
     * Update the item size and buffer size.
     * @param itemSize The size of the items in the virtually scrolling list.
     * @param minBufferPx The minimum amount of buffer (in pixels) before needing to render more
     * @param maxBufferPx The amount of buffer (in pixels) to render when rendering more.
     */
    updateItemAndBufferSize(itemSize, minBufferPx, maxBufferPx) {
        if (maxBufferPx < minBufferPx && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw Error('CDK virtual scroll: maxBufferPx must be greater than or equal to minBufferPx');
        }
        this._itemSize = itemSize;
        this._minBufferPx = minBufferPx;
        this._maxBufferPx = maxBufferPx;
        this._updateTotalContentSize();
        this._updateRenderedRange();
    }
    /** @docs-private Implemented as part of VirtualScrollStrategy. */
    onContentScrolled() {
        this._updateRenderedRange();
    }
    /** @docs-private Implemented as part of VirtualScrollStrategy. */
    onDataLengthChanged() {
        this._updateTotalContentSize();
        this._updateRenderedRange();
    }
    /** @docs-private Implemented as part of VirtualScrollStrategy. */
    onContentRendered() {
        /* no-op */
    }
    /** @docs-private Implemented as part of VirtualScrollStrategy. */
    onRenderedOffsetChanged() {
        /* no-op */
    }
    /**
     * Scroll to the offset for the given index.
     * @param index The index of the element to scroll to.
     * @param behavior The ScrollBehavior to use when scrolling.
     */
    scrollToIndex(index, behavior) {
        if (this._viewport) {
            this._viewport.scrollToOffset(index * this._itemSize, behavior);
        }
    }
    /** Update the viewport's total content size. */
    _updateTotalContentSize() {
        if (!this._viewport) {
            return;
        }
        this._viewport.setTotalContentSize(this._viewport.getDataLength() * this._itemSize);
    }
    /** Update the viewport's rendered range. */
    _updateRenderedRange() {
        if (!this._viewport) {
            return;
        }
        const renderedRange = this._viewport.getRenderedRange();
        const newRange = { start: renderedRange.start, end: renderedRange.end };
        const viewportSize = this._viewport.getViewportSize();
        const dataLength = this._viewport.getDataLength();
        let scrollOffset = this._viewport.measureScrollOffset();
        // Prevent NaN as result when dividing by zero.
        let firstVisibleIndex = this._itemSize > 0 ? scrollOffset / this._itemSize : 0;
        // If user scrolls to the bottom of the list and data changes to a smaller list
        if (newRange.end > dataLength) {
            // We have to recalculate the first visible index based on new data length and viewport size.
            const maxVisibleItems = Math.ceil(viewportSize / this._itemSize);
            const newVisibleIndex = Math.max(0, Math.min(firstVisibleIndex, dataLength - maxVisibleItems));
            // If first visible index changed we must update scroll offset to handle start/end buffers
            // Current range must also be adjusted to cover the new position (bottom of new list).
            if (firstVisibleIndex != newVisibleIndex) {
                firstVisibleIndex = newVisibleIndex;
                scrollOffset = newVisibleIndex * this._itemSize;
                newRange.start = Math.floor(firstVisibleIndex);
            }
            newRange.end = Math.max(0, Math.min(dataLength, newRange.start + maxVisibleItems));
        }
        const startBuffer = scrollOffset - newRange.start * this._itemSize;
        if (startBuffer < this._minBufferPx && newRange.start != 0) {
            const expandStart = Math.ceil((this._maxBufferPx - startBuffer) / this._itemSize);
            newRange.start = Math.max(0, newRange.start - expandStart);
            newRange.end = Math.min(dataLength, Math.ceil(firstVisibleIndex + (viewportSize + this._minBufferPx) / this._itemSize));
        }
        else {
            const endBuffer = newRange.end * this._itemSize - (scrollOffset + viewportSize);
            if (endBuffer < this._minBufferPx && newRange.end != dataLength) {
                const expandEnd = Math.ceil((this._maxBufferPx - endBuffer) / this._itemSize);
                if (expandEnd > 0) {
                    newRange.end = Math.min(dataLength, newRange.end + expandEnd);
                    newRange.start = Math.max(0, Math.floor(firstVisibleIndex - this._minBufferPx / this._itemSize));
                }
            }
        }
        this._viewport.setRenderedRange(newRange);
        this._viewport.setRenderedContentOffset(this._itemSize * newRange.start);
        this._scrolledIndexChange.next(Math.floor(firstVisibleIndex));
    }
}
/**
 * Provider factory for `FixedSizeVirtualScrollStrategy` that simply extracts the already created
 * `FixedSizeVirtualScrollStrategy` from the given directive.
 * @param fixedSizeDir The instance of `CdkFixedSizeVirtualScroll` to extract the
 *     `FixedSizeVirtualScrollStrategy` from.
 */
export function _fixedSizeVirtualScrollStrategyFactory(fixedSizeDir) {
    return fixedSizeDir._scrollStrategy;
}
/** A virtual scroll strategy that supports fixed-size items. */
export class CdkFixedSizeVirtualScroll {
    constructor() {
        this._itemSize = 20;
        this._minBufferPx = 100;
        this._maxBufferPx = 200;
        /** The scroll strategy used by this directive. */
        this._scrollStrategy = new FixedSizeVirtualScrollStrategy(this.itemSize, this.minBufferPx, this.maxBufferPx);
    }
    /** The size of the items in the list (in pixels). */
    get itemSize() {
        return this._itemSize;
    }
    set itemSize(value) {
        this._itemSize = coerceNumberProperty(value);
    }
    /**
     * The minimum amount of buffer rendered beyond the viewport (in pixels).
     * If the amount of buffer dips below this number, more items will be rendered. Defaults to 100px.
     */
    get minBufferPx() {
        return this._minBufferPx;
    }
    set minBufferPx(value) {
        this._minBufferPx = coerceNumberProperty(value);
    }
    /**
     * The number of pixels worth of buffer to render for when rendering new items. Defaults to 200px.
     */
    get maxBufferPx() {
        return this._maxBufferPx;
    }
    set maxBufferPx(value) {
        this._maxBufferPx = coerceNumberProperty(value);
    }
    ngOnChanges() {
        this._scrollStrategy.updateItemAndBufferSize(this.itemSize, this.minBufferPx, this.maxBufferPx);
    }
}
CdkFixedSizeVirtualScroll.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkFixedSizeVirtualScroll, deps: [], target: i0.ɵɵFactoryTarget.Directive });
CdkFixedSizeVirtualScroll.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: CdkFixedSizeVirtualScroll, selector: "cdk-virtual-scroll-viewport[itemSize]", inputs: { itemSize: "itemSize", minBufferPx: "minBufferPx", maxBufferPx: "maxBufferPx" }, providers: [
        {
            provide: VIRTUAL_SCROLL_STRATEGY,
            useFactory: _fixedSizeVirtualScrollStrategyFactory,
            deps: [forwardRef(() => CdkFixedSizeVirtualScroll)],
        },
    ], usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkFixedSizeVirtualScroll, decorators: [{
            type: Directive,
            args: [{
                    selector: 'cdk-virtual-scroll-viewport[itemSize]',
                    providers: [
                        {
                            provide: VIRTUAL_SCROLL_STRATEGY,
                            useFactory: _fixedSizeVirtualScrollStrategyFactory,
                            deps: [forwardRef(() => CdkFixedSizeVirtualScroll)],
                        },
                    ],
                }]
        }], propDecorators: { itemSize: [{
                type: Input
            }], minBufferPx: [{
                type: Input
            }], maxBufferPx: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZml4ZWQtc2l6ZS12aXJ0dWFsLXNjcm9sbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvc2Nyb2xsaW5nL2ZpeGVkLXNpemUtdmlydHVhbC1zY3JvbGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLG9CQUFvQixFQUFjLE1BQU0sdUJBQXVCLENBQUM7QUFDeEUsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFZLE1BQU0sZUFBZSxDQUFDO0FBQ3RFLE9BQU8sRUFBYSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDekMsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDcEQsT0FBTyxFQUFDLHVCQUF1QixFQUF3QixNQUFNLDJCQUEyQixDQUFDOztBQUd6RiwyRUFBMkU7QUFDM0UsTUFBTSxPQUFPLDhCQUE4QjtJQWtCekM7Ozs7T0FJRztJQUNILFlBQVksUUFBZ0IsRUFBRSxXQUFtQixFQUFFLFdBQW1CO1FBdEJyRCx5QkFBb0IsR0FBRyxJQUFJLE9BQU8sRUFBVSxDQUFDO1FBRTlELGtFQUFrRTtRQUNsRSx3QkFBbUIsR0FBdUIsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUM7UUFFakcsNkJBQTZCO1FBQ3JCLGNBQVMsR0FBb0MsSUFBSSxDQUFDO1FBaUJ4RCxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUMxQixJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQztRQUNoQyxJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQztJQUNsQyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsTUFBTSxDQUFDLFFBQWtDO1FBQ3ZDLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzFCLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFFRCwwRUFBMEU7SUFDMUUsTUFBTTtRQUNKLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNyQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztJQUN4QixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCx1QkFBdUIsQ0FBQyxRQUFnQixFQUFFLFdBQW1CLEVBQUUsV0FBbUI7UUFDaEYsSUFBSSxXQUFXLEdBQUcsV0FBVyxJQUFJLENBQUMsT0FBTyxTQUFTLEtBQUssV0FBVyxJQUFJLFNBQVMsQ0FBQyxFQUFFO1lBQ2hGLE1BQU0sS0FBSyxDQUFDLDhFQUE4RSxDQUFDLENBQUM7U0FDN0Y7UUFDRCxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUMxQixJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQztRQUNoQyxJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQztRQUNoQyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBRUQsa0VBQWtFO0lBQ2xFLGlCQUFpQjtRQUNmLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFFRCxrRUFBa0U7SUFDbEUsbUJBQW1CO1FBQ2pCLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFFRCxrRUFBa0U7SUFDbEUsaUJBQWlCO1FBQ2YsV0FBVztJQUNiLENBQUM7SUFFRCxrRUFBa0U7SUFDbEUsdUJBQXVCO1FBQ3JCLFdBQVc7SUFDYixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILGFBQWEsQ0FBQyxLQUFhLEVBQUUsUUFBd0I7UUFDbkQsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQ2pFO0lBQ0gsQ0FBQztJQUVELGdEQUFnRDtJQUN4Qyx1QkFBdUI7UUFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbkIsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN0RixDQUFDO0lBRUQsNENBQTRDO0lBQ3BDLG9CQUFvQjtRQUMxQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNuQixPQUFPO1NBQ1I7UUFFRCxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDeEQsTUFBTSxRQUFRLEdBQUcsRUFBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsYUFBYSxDQUFDLEdBQUcsRUFBQyxDQUFDO1FBQ3RFLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDdEQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNsRCxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDeEQsK0NBQStDO1FBQy9DLElBQUksaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFL0UsK0VBQStFO1FBQy9FLElBQUksUUFBUSxDQUFDLEdBQUcsR0FBRyxVQUFVLEVBQUU7WUFDN0IsNkZBQTZGO1lBQzdGLE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNqRSxNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUM5QixDQUFDLEVBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxVQUFVLEdBQUcsZUFBZSxDQUFDLENBQzFELENBQUM7WUFFRiwwRkFBMEY7WUFDMUYsc0ZBQXNGO1lBQ3RGLElBQUksaUJBQWlCLElBQUksZUFBZSxFQUFFO2dCQUN4QyxpQkFBaUIsR0FBRyxlQUFlLENBQUM7Z0JBQ3BDLFlBQVksR0FBRyxlQUFlLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztnQkFDaEQsUUFBUSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7YUFDaEQ7WUFFRCxRQUFRLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxLQUFLLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQztTQUNwRjtRQUVELE1BQU0sV0FBVyxHQUFHLFlBQVksR0FBRyxRQUFRLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDbkUsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLFlBQVksSUFBSSxRQUFRLENBQUMsS0FBSyxJQUFJLENBQUMsRUFBRTtZQUMxRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDbEYsUUFBUSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxDQUFDO1lBQzNELFFBQVEsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FDckIsVUFBVSxFQUNWLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FDbkYsQ0FBQztTQUNIO2FBQU07WUFDTCxNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDLENBQUM7WUFDaEYsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksSUFBSSxRQUFRLENBQUMsR0FBRyxJQUFJLFVBQVUsRUFBRTtnQkFDL0QsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUM5RSxJQUFJLFNBQVMsR0FBRyxDQUFDLEVBQUU7b0JBQ2pCLFFBQVEsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsQ0FBQztvQkFDOUQsUUFBUSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUN2QixDQUFDLEVBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FDbkUsQ0FBQztpQkFDSDthQUNGO1NBQ0Y7UUFFRCxJQUFJLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxTQUFTLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztJQUNoRSxDQUFDO0NBQ0Y7QUFFRDs7Ozs7R0FLRztBQUNILE1BQU0sVUFBVSxzQ0FBc0MsQ0FBQyxZQUF1QztJQUM1RixPQUFPLFlBQVksQ0FBQyxlQUFlLENBQUM7QUFDdEMsQ0FBQztBQUVELGdFQUFnRTtBQVdoRSxNQUFNLE9BQU8seUJBQXlCO0lBVnRDO1FBbUJFLGNBQVMsR0FBRyxFQUFFLENBQUM7UUFhZixpQkFBWSxHQUFHLEdBQUcsQ0FBQztRQVluQixpQkFBWSxHQUFHLEdBQUcsQ0FBQztRQUVuQixrREFBa0Q7UUFDbEQsb0JBQWUsR0FBRyxJQUFJLDhCQUE4QixDQUNsRCxJQUFJLENBQUMsUUFBUSxFQUNiLElBQUksQ0FBQyxXQUFXLEVBQ2hCLElBQUksQ0FBQyxXQUFXLENBQ2pCLENBQUM7S0FLSDtJQTdDQyxxREFBcUQ7SUFDckQsSUFDSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUFDRCxJQUFJLFFBQVEsQ0FBQyxLQUFrQjtRQUM3QixJQUFJLENBQUMsU0FBUyxHQUFHLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFHRDs7O09BR0c7SUFDSCxJQUNJLFdBQVc7UUFDYixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDM0IsQ0FBQztJQUNELElBQUksV0FBVyxDQUFDLEtBQWtCO1FBQ2hDLElBQUksQ0FBQyxZQUFZLEdBQUcsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUdEOztPQUVHO0lBQ0gsSUFDSSxXQUFXO1FBQ2IsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQzNCLENBQUM7SUFDRCxJQUFJLFdBQVcsQ0FBQyxLQUFrQjtRQUNoQyxJQUFJLENBQUMsWUFBWSxHQUFHLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFVRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLGVBQWUsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ2xHLENBQUM7O3NIQTdDVSx5QkFBeUI7MEdBQXpCLHlCQUF5QiwwSkFSekI7UUFDVDtZQUNFLE9BQU8sRUFBRSx1QkFBdUI7WUFDaEMsVUFBVSxFQUFFLHNDQUFzQztZQUNsRCxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMseUJBQXlCLENBQUMsQ0FBQztTQUNwRDtLQUNGOzJGQUVVLHlCQUF5QjtrQkFWckMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsdUNBQXVDO29CQUNqRCxTQUFTLEVBQUU7d0JBQ1Q7NEJBQ0UsT0FBTyxFQUFFLHVCQUF1Qjs0QkFDaEMsVUFBVSxFQUFFLHNDQUFzQzs0QkFDbEQsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO3lCQUNwRDtxQkFDRjtpQkFDRjs4QkFJSyxRQUFRO3NCQURYLEtBQUs7Z0JBY0YsV0FBVztzQkFEZCxLQUFLO2dCQWFGLFdBQVc7c0JBRGQsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2NvZXJjZU51bWJlclByb3BlcnR5LCBOdW1iZXJJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7RGlyZWN0aXZlLCBmb3J3YXJkUmVmLCBJbnB1dCwgT25DaGFuZ2VzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2Rpc3RpbmN0VW50aWxDaGFuZ2VkfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge1ZJUlRVQUxfU0NST0xMX1NUUkFURUdZLCBWaXJ0dWFsU2Nyb2xsU3RyYXRlZ3l9IGZyb20gJy4vdmlydHVhbC1zY3JvbGwtc3RyYXRlZ3knO1xuaW1wb3J0IHtDZGtWaXJ0dWFsU2Nyb2xsVmlld3BvcnR9IGZyb20gJy4vdmlydHVhbC1zY3JvbGwtdmlld3BvcnQnO1xuXG4vKiogVmlydHVhbCBzY3JvbGxpbmcgc3RyYXRlZ3kgZm9yIGxpc3RzIHdpdGggaXRlbXMgb2Yga25vd24gZml4ZWQgc2l6ZS4gKi9cbmV4cG9ydCBjbGFzcyBGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsU3RyYXRlZ3kgaW1wbGVtZW50cyBWaXJ0dWFsU2Nyb2xsU3RyYXRlZ3kge1xuICBwcml2YXRlIHJlYWRvbmx5IF9zY3JvbGxlZEluZGV4Q2hhbmdlID0gbmV3IFN1YmplY3Q8bnVtYmVyPigpO1xuXG4gIC8qKiBAZG9jcy1wcml2YXRlIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgVmlydHVhbFNjcm9sbFN0cmF0ZWd5LiAqL1xuICBzY3JvbGxlZEluZGV4Q2hhbmdlOiBPYnNlcnZhYmxlPG51bWJlcj4gPSB0aGlzLl9zY3JvbGxlZEluZGV4Q2hhbmdlLnBpcGUoZGlzdGluY3RVbnRpbENoYW5nZWQoKSk7XG5cbiAgLyoqIFRoZSBhdHRhY2hlZCB2aWV3cG9ydC4gKi9cbiAgcHJpdmF0ZSBfdmlld3BvcnQ6IENka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydCB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBUaGUgc2l6ZSBvZiB0aGUgaXRlbXMgaW4gdGhlIHZpcnR1YWxseSBzY3JvbGxpbmcgbGlzdC4gKi9cbiAgcHJpdmF0ZSBfaXRlbVNpemU6IG51bWJlcjtcblxuICAvKiogVGhlIG1pbmltdW0gYW1vdW50IG9mIGJ1ZmZlciByZW5kZXJlZCBiZXlvbmQgdGhlIHZpZXdwb3J0IChpbiBwaXhlbHMpLiAqL1xuICBwcml2YXRlIF9taW5CdWZmZXJQeDogbnVtYmVyO1xuXG4gIC8qKiBUaGUgbnVtYmVyIG9mIGJ1ZmZlciBpdGVtcyB0byByZW5kZXIgYmV5b25kIHRoZSBlZGdlIG9mIHRoZSB2aWV3cG9ydCAoaW4gcGl4ZWxzKS4gKi9cbiAgcHJpdmF0ZSBfbWF4QnVmZmVyUHg6IG51bWJlcjtcblxuICAvKipcbiAgICogQHBhcmFtIGl0ZW1TaXplIFRoZSBzaXplIG9mIHRoZSBpdGVtcyBpbiB0aGUgdmlydHVhbGx5IHNjcm9sbGluZyBsaXN0LlxuICAgKiBAcGFyYW0gbWluQnVmZmVyUHggVGhlIG1pbmltdW0gYW1vdW50IG9mIGJ1ZmZlciAoaW4gcGl4ZWxzKSBiZWZvcmUgbmVlZGluZyB0byByZW5kZXIgbW9yZVxuICAgKiBAcGFyYW0gbWF4QnVmZmVyUHggVGhlIGFtb3VudCBvZiBidWZmZXIgKGluIHBpeGVscykgdG8gcmVuZGVyIHdoZW4gcmVuZGVyaW5nIG1vcmUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihpdGVtU2l6ZTogbnVtYmVyLCBtaW5CdWZmZXJQeDogbnVtYmVyLCBtYXhCdWZmZXJQeDogbnVtYmVyKSB7XG4gICAgdGhpcy5faXRlbVNpemUgPSBpdGVtU2l6ZTtcbiAgICB0aGlzLl9taW5CdWZmZXJQeCA9IG1pbkJ1ZmZlclB4O1xuICAgIHRoaXMuX21heEJ1ZmZlclB4ID0gbWF4QnVmZmVyUHg7XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoZXMgdGhpcyBzY3JvbGwgc3RyYXRlZ3kgdG8gYSB2aWV3cG9ydC5cbiAgICogQHBhcmFtIHZpZXdwb3J0IFRoZSB2aWV3cG9ydCB0byBhdHRhY2ggdGhpcyBzdHJhdGVneSB0by5cbiAgICovXG4gIGF0dGFjaCh2aWV3cG9ydDogQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0KSB7XG4gICAgdGhpcy5fdmlld3BvcnQgPSB2aWV3cG9ydDtcbiAgICB0aGlzLl91cGRhdGVUb3RhbENvbnRlbnRTaXplKCk7XG4gICAgdGhpcy5fdXBkYXRlUmVuZGVyZWRSYW5nZSgpO1xuICB9XG5cbiAgLyoqIERldGFjaGVzIHRoaXMgc2Nyb2xsIHN0cmF0ZWd5IGZyb20gdGhlIGN1cnJlbnRseSBhdHRhY2hlZCB2aWV3cG9ydC4gKi9cbiAgZGV0YWNoKCkge1xuICAgIHRoaXMuX3Njcm9sbGVkSW5kZXhDaGFuZ2UuY29tcGxldGUoKTtcbiAgICB0aGlzLl92aWV3cG9ydCA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIHRoZSBpdGVtIHNpemUgYW5kIGJ1ZmZlciBzaXplLlxuICAgKiBAcGFyYW0gaXRlbVNpemUgVGhlIHNpemUgb2YgdGhlIGl0ZW1zIGluIHRoZSB2aXJ0dWFsbHkgc2Nyb2xsaW5nIGxpc3QuXG4gICAqIEBwYXJhbSBtaW5CdWZmZXJQeCBUaGUgbWluaW11bSBhbW91bnQgb2YgYnVmZmVyIChpbiBwaXhlbHMpIGJlZm9yZSBuZWVkaW5nIHRvIHJlbmRlciBtb3JlXG4gICAqIEBwYXJhbSBtYXhCdWZmZXJQeCBUaGUgYW1vdW50IG9mIGJ1ZmZlciAoaW4gcGl4ZWxzKSB0byByZW5kZXIgd2hlbiByZW5kZXJpbmcgbW9yZS5cbiAgICovXG4gIHVwZGF0ZUl0ZW1BbmRCdWZmZXJTaXplKGl0ZW1TaXplOiBudW1iZXIsIG1pbkJ1ZmZlclB4OiBudW1iZXIsIG1heEJ1ZmZlclB4OiBudW1iZXIpIHtcbiAgICBpZiAobWF4QnVmZmVyUHggPCBtaW5CdWZmZXJQeCAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ0NESyB2aXJ0dWFsIHNjcm9sbDogbWF4QnVmZmVyUHggbXVzdCBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gbWluQnVmZmVyUHgnKTtcbiAgICB9XG4gICAgdGhpcy5faXRlbVNpemUgPSBpdGVtU2l6ZTtcbiAgICB0aGlzLl9taW5CdWZmZXJQeCA9IG1pbkJ1ZmZlclB4O1xuICAgIHRoaXMuX21heEJ1ZmZlclB4ID0gbWF4QnVmZmVyUHg7XG4gICAgdGhpcy5fdXBkYXRlVG90YWxDb250ZW50U2l6ZSgpO1xuICAgIHRoaXMuX3VwZGF0ZVJlbmRlcmVkUmFuZ2UoKTtcbiAgfVxuXG4gIC8qKiBAZG9jcy1wcml2YXRlIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgVmlydHVhbFNjcm9sbFN0cmF0ZWd5LiAqL1xuICBvbkNvbnRlbnRTY3JvbGxlZCgpIHtcbiAgICB0aGlzLl91cGRhdGVSZW5kZXJlZFJhbmdlKCk7XG4gIH1cblxuICAvKiogQGRvY3MtcHJpdmF0ZSBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIFZpcnR1YWxTY3JvbGxTdHJhdGVneS4gKi9cbiAgb25EYXRhTGVuZ3RoQ2hhbmdlZCgpIHtcbiAgICB0aGlzLl91cGRhdGVUb3RhbENvbnRlbnRTaXplKCk7XG4gICAgdGhpcy5fdXBkYXRlUmVuZGVyZWRSYW5nZSgpO1xuICB9XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBWaXJ0dWFsU2Nyb2xsU3RyYXRlZ3kuICovXG4gIG9uQ29udGVudFJlbmRlcmVkKCkge1xuICAgIC8qIG5vLW9wICovXG4gIH1cblxuICAvKiogQGRvY3MtcHJpdmF0ZSBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIFZpcnR1YWxTY3JvbGxTdHJhdGVneS4gKi9cbiAgb25SZW5kZXJlZE9mZnNldENoYW5nZWQoKSB7XG4gICAgLyogbm8tb3AgKi9cbiAgfVxuXG4gIC8qKlxuICAgKiBTY3JvbGwgdG8gdGhlIG9mZnNldCBmb3IgdGhlIGdpdmVuIGluZGV4LlxuICAgKiBAcGFyYW0gaW5kZXggVGhlIGluZGV4IG9mIHRoZSBlbGVtZW50IHRvIHNjcm9sbCB0by5cbiAgICogQHBhcmFtIGJlaGF2aW9yIFRoZSBTY3JvbGxCZWhhdmlvciB0byB1c2Ugd2hlbiBzY3JvbGxpbmcuXG4gICAqL1xuICBzY3JvbGxUb0luZGV4KGluZGV4OiBudW1iZXIsIGJlaGF2aW9yOiBTY3JvbGxCZWhhdmlvcik6IHZvaWQge1xuICAgIGlmICh0aGlzLl92aWV3cG9ydCkge1xuICAgICAgdGhpcy5fdmlld3BvcnQuc2Nyb2xsVG9PZmZzZXQoaW5kZXggKiB0aGlzLl9pdGVtU2l6ZSwgYmVoYXZpb3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBVcGRhdGUgdGhlIHZpZXdwb3J0J3MgdG90YWwgY29udGVudCBzaXplLiAqL1xuICBwcml2YXRlIF91cGRhdGVUb3RhbENvbnRlbnRTaXplKCkge1xuICAgIGlmICghdGhpcy5fdmlld3BvcnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl92aWV3cG9ydC5zZXRUb3RhbENvbnRlbnRTaXplKHRoaXMuX3ZpZXdwb3J0LmdldERhdGFMZW5ndGgoKSAqIHRoaXMuX2l0ZW1TaXplKTtcbiAgfVxuXG4gIC8qKiBVcGRhdGUgdGhlIHZpZXdwb3J0J3MgcmVuZGVyZWQgcmFuZ2UuICovXG4gIHByaXZhdGUgX3VwZGF0ZVJlbmRlcmVkUmFuZ2UoKSB7XG4gICAgaWYgKCF0aGlzLl92aWV3cG9ydCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHJlbmRlcmVkUmFuZ2UgPSB0aGlzLl92aWV3cG9ydC5nZXRSZW5kZXJlZFJhbmdlKCk7XG4gICAgY29uc3QgbmV3UmFuZ2UgPSB7c3RhcnQ6IHJlbmRlcmVkUmFuZ2Uuc3RhcnQsIGVuZDogcmVuZGVyZWRSYW5nZS5lbmR9O1xuICAgIGNvbnN0IHZpZXdwb3J0U2l6ZSA9IHRoaXMuX3ZpZXdwb3J0LmdldFZpZXdwb3J0U2l6ZSgpO1xuICAgIGNvbnN0IGRhdGFMZW5ndGggPSB0aGlzLl92aWV3cG9ydC5nZXREYXRhTGVuZ3RoKCk7XG4gICAgbGV0IHNjcm9sbE9mZnNldCA9IHRoaXMuX3ZpZXdwb3J0Lm1lYXN1cmVTY3JvbGxPZmZzZXQoKTtcbiAgICAvLyBQcmV2ZW50IE5hTiBhcyByZXN1bHQgd2hlbiBkaXZpZGluZyBieSB6ZXJvLlxuICAgIGxldCBmaXJzdFZpc2libGVJbmRleCA9IHRoaXMuX2l0ZW1TaXplID4gMCA/IHNjcm9sbE9mZnNldCAvIHRoaXMuX2l0ZW1TaXplIDogMDtcblxuICAgIC8vIElmIHVzZXIgc2Nyb2xscyB0byB0aGUgYm90dG9tIG9mIHRoZSBsaXN0IGFuZCBkYXRhIGNoYW5nZXMgdG8gYSBzbWFsbGVyIGxpc3RcbiAgICBpZiAobmV3UmFuZ2UuZW5kID4gZGF0YUxlbmd0aCkge1xuICAgICAgLy8gV2UgaGF2ZSB0byByZWNhbGN1bGF0ZSB0aGUgZmlyc3QgdmlzaWJsZSBpbmRleCBiYXNlZCBvbiBuZXcgZGF0YSBsZW5ndGggYW5kIHZpZXdwb3J0IHNpemUuXG4gICAgICBjb25zdCBtYXhWaXNpYmxlSXRlbXMgPSBNYXRoLmNlaWwodmlld3BvcnRTaXplIC8gdGhpcy5faXRlbVNpemUpO1xuICAgICAgY29uc3QgbmV3VmlzaWJsZUluZGV4ID0gTWF0aC5tYXgoXG4gICAgICAgIDAsXG4gICAgICAgIE1hdGgubWluKGZpcnN0VmlzaWJsZUluZGV4LCBkYXRhTGVuZ3RoIC0gbWF4VmlzaWJsZUl0ZW1zKSxcbiAgICAgICk7XG5cbiAgICAgIC8vIElmIGZpcnN0IHZpc2libGUgaW5kZXggY2hhbmdlZCB3ZSBtdXN0IHVwZGF0ZSBzY3JvbGwgb2Zmc2V0IHRvIGhhbmRsZSBzdGFydC9lbmQgYnVmZmVyc1xuICAgICAgLy8gQ3VycmVudCByYW5nZSBtdXN0IGFsc28gYmUgYWRqdXN0ZWQgdG8gY292ZXIgdGhlIG5ldyBwb3NpdGlvbiAoYm90dG9tIG9mIG5ldyBsaXN0KS5cbiAgICAgIGlmIChmaXJzdFZpc2libGVJbmRleCAhPSBuZXdWaXNpYmxlSW5kZXgpIHtcbiAgICAgICAgZmlyc3RWaXNpYmxlSW5kZXggPSBuZXdWaXNpYmxlSW5kZXg7XG4gICAgICAgIHNjcm9sbE9mZnNldCA9IG5ld1Zpc2libGVJbmRleCAqIHRoaXMuX2l0ZW1TaXplO1xuICAgICAgICBuZXdSYW5nZS5zdGFydCA9IE1hdGguZmxvb3IoZmlyc3RWaXNpYmxlSW5kZXgpO1xuICAgICAgfVxuXG4gICAgICBuZXdSYW5nZS5lbmQgPSBNYXRoLm1heCgwLCBNYXRoLm1pbihkYXRhTGVuZ3RoLCBuZXdSYW5nZS5zdGFydCArIG1heFZpc2libGVJdGVtcykpO1xuICAgIH1cblxuICAgIGNvbnN0IHN0YXJ0QnVmZmVyID0gc2Nyb2xsT2Zmc2V0IC0gbmV3UmFuZ2Uuc3RhcnQgKiB0aGlzLl9pdGVtU2l6ZTtcbiAgICBpZiAoc3RhcnRCdWZmZXIgPCB0aGlzLl9taW5CdWZmZXJQeCAmJiBuZXdSYW5nZS5zdGFydCAhPSAwKSB7XG4gICAgICBjb25zdCBleHBhbmRTdGFydCA9IE1hdGguY2VpbCgodGhpcy5fbWF4QnVmZmVyUHggLSBzdGFydEJ1ZmZlcikgLyB0aGlzLl9pdGVtU2l6ZSk7XG4gICAgICBuZXdSYW5nZS5zdGFydCA9IE1hdGgubWF4KDAsIG5ld1JhbmdlLnN0YXJ0IC0gZXhwYW5kU3RhcnQpO1xuICAgICAgbmV3UmFuZ2UuZW5kID0gTWF0aC5taW4oXG4gICAgICAgIGRhdGFMZW5ndGgsXG4gICAgICAgIE1hdGguY2VpbChmaXJzdFZpc2libGVJbmRleCArICh2aWV3cG9ydFNpemUgKyB0aGlzLl9taW5CdWZmZXJQeCkgLyB0aGlzLl9pdGVtU2l6ZSksXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBlbmRCdWZmZXIgPSBuZXdSYW5nZS5lbmQgKiB0aGlzLl9pdGVtU2l6ZSAtIChzY3JvbGxPZmZzZXQgKyB2aWV3cG9ydFNpemUpO1xuICAgICAgaWYgKGVuZEJ1ZmZlciA8IHRoaXMuX21pbkJ1ZmZlclB4ICYmIG5ld1JhbmdlLmVuZCAhPSBkYXRhTGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IGV4cGFuZEVuZCA9IE1hdGguY2VpbCgodGhpcy5fbWF4QnVmZmVyUHggLSBlbmRCdWZmZXIpIC8gdGhpcy5faXRlbVNpemUpO1xuICAgICAgICBpZiAoZXhwYW5kRW5kID4gMCkge1xuICAgICAgICAgIG5ld1JhbmdlLmVuZCA9IE1hdGgubWluKGRhdGFMZW5ndGgsIG5ld1JhbmdlLmVuZCArIGV4cGFuZEVuZCk7XG4gICAgICAgICAgbmV3UmFuZ2Uuc3RhcnQgPSBNYXRoLm1heChcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICBNYXRoLmZsb29yKGZpcnN0VmlzaWJsZUluZGV4IC0gdGhpcy5fbWluQnVmZmVyUHggLyB0aGlzLl9pdGVtU2l6ZSksXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX3ZpZXdwb3J0LnNldFJlbmRlcmVkUmFuZ2UobmV3UmFuZ2UpO1xuICAgIHRoaXMuX3ZpZXdwb3J0LnNldFJlbmRlcmVkQ29udGVudE9mZnNldCh0aGlzLl9pdGVtU2l6ZSAqIG5ld1JhbmdlLnN0YXJ0KTtcbiAgICB0aGlzLl9zY3JvbGxlZEluZGV4Q2hhbmdlLm5leHQoTWF0aC5mbG9vcihmaXJzdFZpc2libGVJbmRleCkpO1xuICB9XG59XG5cbi8qKlxuICogUHJvdmlkZXIgZmFjdG9yeSBmb3IgYEZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxTdHJhdGVneWAgdGhhdCBzaW1wbHkgZXh0cmFjdHMgdGhlIGFscmVhZHkgY3JlYXRlZFxuICogYEZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxTdHJhdGVneWAgZnJvbSB0aGUgZ2l2ZW4gZGlyZWN0aXZlLlxuICogQHBhcmFtIGZpeGVkU2l6ZURpciBUaGUgaW5zdGFuY2Ugb2YgYENka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxgIHRvIGV4dHJhY3QgdGhlXG4gKiAgICAgYEZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxTdHJhdGVneWAgZnJvbS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9maXhlZFNpemVWaXJ0dWFsU2Nyb2xsU3RyYXRlZ3lGYWN0b3J5KGZpeGVkU2l6ZURpcjogQ2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbCkge1xuICByZXR1cm4gZml4ZWRTaXplRGlyLl9zY3JvbGxTdHJhdGVneTtcbn1cblxuLyoqIEEgdmlydHVhbCBzY3JvbGwgc3RyYXRlZ3kgdGhhdCBzdXBwb3J0cyBmaXhlZC1zaXplIGl0ZW1zLiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnY2RrLXZpcnR1YWwtc2Nyb2xsLXZpZXdwb3J0W2l0ZW1TaXplXScsXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6IFZJUlRVQUxfU0NST0xMX1NUUkFURUdZLFxuICAgICAgdXNlRmFjdG9yeTogX2ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxTdHJhdGVneUZhY3RvcnksXG4gICAgICBkZXBzOiBbZm9yd2FyZFJlZigoKSA9PiBDZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsKV0sXG4gICAgfSxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG4gIC8qKiBUaGUgc2l6ZSBvZiB0aGUgaXRlbXMgaW4gdGhlIGxpc3QgKGluIHBpeGVscykuICovXG4gIEBJbnB1dCgpXG4gIGdldCBpdGVtU2l6ZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9pdGVtU2l6ZTtcbiAgfVxuICBzZXQgaXRlbVNpemUodmFsdWU6IE51bWJlcklucHV0KSB7XG4gICAgdGhpcy5faXRlbVNpemUgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgX2l0ZW1TaXplID0gMjA7XG5cbiAgLyoqXG4gICAqIFRoZSBtaW5pbXVtIGFtb3VudCBvZiBidWZmZXIgcmVuZGVyZWQgYmV5b25kIHRoZSB2aWV3cG9ydCAoaW4gcGl4ZWxzKS5cbiAgICogSWYgdGhlIGFtb3VudCBvZiBidWZmZXIgZGlwcyBiZWxvdyB0aGlzIG51bWJlciwgbW9yZSBpdGVtcyB3aWxsIGJlIHJlbmRlcmVkLiBEZWZhdWx0cyB0byAxMDBweC5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBtaW5CdWZmZXJQeCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9taW5CdWZmZXJQeDtcbiAgfVxuICBzZXQgbWluQnVmZmVyUHgodmFsdWU6IE51bWJlcklucHV0KSB7XG4gICAgdGhpcy5fbWluQnVmZmVyUHggPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgX21pbkJ1ZmZlclB4ID0gMTAwO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIHBpeGVscyB3b3J0aCBvZiBidWZmZXIgdG8gcmVuZGVyIGZvciB3aGVuIHJlbmRlcmluZyBuZXcgaXRlbXMuIERlZmF1bHRzIHRvIDIwMHB4LlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IG1heEJ1ZmZlclB4KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX21heEJ1ZmZlclB4O1xuICB9XG4gIHNldCBtYXhCdWZmZXJQeCh2YWx1ZTogTnVtYmVySW5wdXQpIHtcbiAgICB0aGlzLl9tYXhCdWZmZXJQeCA9IGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBfbWF4QnVmZmVyUHggPSAyMDA7XG5cbiAgLyoqIFRoZSBzY3JvbGwgc3RyYXRlZ3kgdXNlZCBieSB0aGlzIGRpcmVjdGl2ZS4gKi9cbiAgX3Njcm9sbFN0cmF0ZWd5ID0gbmV3IEZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxTdHJhdGVneShcbiAgICB0aGlzLml0ZW1TaXplLFxuICAgIHRoaXMubWluQnVmZmVyUHgsXG4gICAgdGhpcy5tYXhCdWZmZXJQeCxcbiAgKTtcblxuICBuZ09uQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9zY3JvbGxTdHJhdGVneS51cGRhdGVJdGVtQW5kQnVmZmVyU2l6ZSh0aGlzLml0ZW1TaXplLCB0aGlzLm1pbkJ1ZmZlclB4LCB0aGlzLm1heEJ1ZmZlclB4KTtcbiAgfVxufVxuIl19