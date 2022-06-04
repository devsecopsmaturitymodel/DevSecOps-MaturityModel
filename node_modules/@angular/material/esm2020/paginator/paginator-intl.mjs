/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable, Optional, SkipSelf } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * To modify the labels and text displayed, create a new instance of MatPaginatorIntl and
 * include it in a custom provider
 */
export class MatPaginatorIntl {
    constructor() {
        /**
         * Stream to emit from when labels are changed. Use this to notify components when the labels have
         * changed after initialization.
         */
        this.changes = new Subject();
        /** A label for the page size selector. */
        this.itemsPerPageLabel = 'Items per page:';
        /** A label for the button that increments the current page. */
        this.nextPageLabel = 'Next page';
        /** A label for the button that decrements the current page. */
        this.previousPageLabel = 'Previous page';
        /** A label for the button that moves to the first page. */
        this.firstPageLabel = 'First page';
        /** A label for the button that moves to the last page. */
        this.lastPageLabel = 'Last page';
        /** A label for the range of items within the current page and the length of the whole list. */
        this.getRangeLabel = (page, pageSize, length) => {
            if (length == 0 || pageSize == 0) {
                return `0 of ${length}`;
            }
            length = Math.max(length, 0);
            const startIndex = page * pageSize;
            // If the start index exceeds the list length, do not try and fix the end index to the end.
            const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
            return `${startIndex + 1} – ${endIndex} of ${length}`;
        };
    }
}
MatPaginatorIntl.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatPaginatorIntl, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
MatPaginatorIntl.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatPaginatorIntl, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatPaginatorIntl, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
/** @docs-private */
export function MAT_PAGINATOR_INTL_PROVIDER_FACTORY(parentIntl) {
    return parentIntl || new MatPaginatorIntl();
}
/** @docs-private */
export const MAT_PAGINATOR_INTL_PROVIDER = {
    // If there is already an MatPaginatorIntl available, use that. Otherwise, provide a new one.
    provide: MatPaginatorIntl,
    deps: [[new Optional(), new SkipSelf(), MatPaginatorIntl]],
    useFactory: MAT_PAGINATOR_INTL_PROVIDER_FACTORY,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdG9yLWludGwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvcGFnaW5hdG9yL3BhZ2luYXRvci1pbnRsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM3RCxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDOztBQUU3Qjs7O0dBR0c7QUFFSCxNQUFNLE9BQU8sZ0JBQWdCO0lBRDdCO1FBRUU7OztXQUdHO1FBQ00sWUFBTyxHQUFrQixJQUFJLE9BQU8sRUFBUSxDQUFDO1FBRXRELDBDQUEwQztRQUMxQyxzQkFBaUIsR0FBVyxpQkFBaUIsQ0FBQztRQUU5QywrREFBK0Q7UUFDL0Qsa0JBQWEsR0FBVyxXQUFXLENBQUM7UUFFcEMsK0RBQStEO1FBQy9ELHNCQUFpQixHQUFXLGVBQWUsQ0FBQztRQUU1QywyREFBMkQ7UUFDM0QsbUJBQWMsR0FBVyxZQUFZLENBQUM7UUFFdEMsMERBQTBEO1FBQzFELGtCQUFhLEdBQVcsV0FBVyxDQUFDO1FBRXBDLCtGQUErRjtRQUMvRixrQkFBYSxHQUErRCxDQUMxRSxJQUFZLEVBQ1osUUFBZ0IsRUFDaEIsTUFBYyxFQUNkLEVBQUU7WUFDRixJQUFJLE1BQU0sSUFBSSxDQUFDLElBQUksUUFBUSxJQUFJLENBQUMsRUFBRTtnQkFDaEMsT0FBTyxRQUFRLE1BQU0sRUFBRSxDQUFDO2FBQ3pCO1lBRUQsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBRTdCLE1BQU0sVUFBVSxHQUFHLElBQUksR0FBRyxRQUFRLENBQUM7WUFFbkMsMkZBQTJGO1lBQzNGLE1BQU0sUUFBUSxHQUNaLFVBQVUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQztZQUV4RixPQUFPLEdBQUcsVUFBVSxHQUFHLENBQUMsTUFBTSxRQUFRLE9BQU8sTUFBTSxFQUFFLENBQUM7UUFDeEQsQ0FBQyxDQUFDO0tBQ0g7OzZHQTFDWSxnQkFBZ0I7aUhBQWhCLGdCQUFnQixjQURKLE1BQU07MkZBQ2xCLGdCQUFnQjtrQkFENUIsVUFBVTttQkFBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUM7O0FBNkNoQyxvQkFBb0I7QUFDcEIsTUFBTSxVQUFVLG1DQUFtQyxDQUFDLFVBQTRCO0lBQzlFLE9BQU8sVUFBVSxJQUFJLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztBQUM5QyxDQUFDO0FBRUQsb0JBQW9CO0FBQ3BCLE1BQU0sQ0FBQyxNQUFNLDJCQUEyQixHQUFHO0lBQ3pDLDZGQUE2RjtJQUM3RixPQUFPLEVBQUUsZ0JBQWdCO0lBQ3pCLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxRQUFRLEVBQUUsRUFBRSxJQUFJLFFBQVEsRUFBRSxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDMUQsVUFBVSxFQUFFLG1DQUFtQztDQUNoRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SW5qZWN0YWJsZSwgT3B0aW9uYWwsIFNraXBTZWxmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5cbi8qKlxuICogVG8gbW9kaWZ5IHRoZSBsYWJlbHMgYW5kIHRleHQgZGlzcGxheWVkLCBjcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgTWF0UGFnaW5hdG9ySW50bCBhbmRcbiAqIGluY2x1ZGUgaXQgaW4gYSBjdXN0b20gcHJvdmlkZXJcbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTWF0UGFnaW5hdG9ySW50bCB7XG4gIC8qKlxuICAgKiBTdHJlYW0gdG8gZW1pdCBmcm9tIHdoZW4gbGFiZWxzIGFyZSBjaGFuZ2VkLiBVc2UgdGhpcyB0byBub3RpZnkgY29tcG9uZW50cyB3aGVuIHRoZSBsYWJlbHMgaGF2ZVxuICAgKiBjaGFuZ2VkIGFmdGVyIGluaXRpYWxpemF0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgY2hhbmdlczogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIEEgbGFiZWwgZm9yIHRoZSBwYWdlIHNpemUgc2VsZWN0b3IuICovXG4gIGl0ZW1zUGVyUGFnZUxhYmVsOiBzdHJpbmcgPSAnSXRlbXMgcGVyIHBhZ2U6JztcblxuICAvKiogQSBsYWJlbCBmb3IgdGhlIGJ1dHRvbiB0aGF0IGluY3JlbWVudHMgdGhlIGN1cnJlbnQgcGFnZS4gKi9cbiAgbmV4dFBhZ2VMYWJlbDogc3RyaW5nID0gJ05leHQgcGFnZSc7XG5cbiAgLyoqIEEgbGFiZWwgZm9yIHRoZSBidXR0b24gdGhhdCBkZWNyZW1lbnRzIHRoZSBjdXJyZW50IHBhZ2UuICovXG4gIHByZXZpb3VzUGFnZUxhYmVsOiBzdHJpbmcgPSAnUHJldmlvdXMgcGFnZSc7XG5cbiAgLyoqIEEgbGFiZWwgZm9yIHRoZSBidXR0b24gdGhhdCBtb3ZlcyB0byB0aGUgZmlyc3QgcGFnZS4gKi9cbiAgZmlyc3RQYWdlTGFiZWw6IHN0cmluZyA9ICdGaXJzdCBwYWdlJztcblxuICAvKiogQSBsYWJlbCBmb3IgdGhlIGJ1dHRvbiB0aGF0IG1vdmVzIHRvIHRoZSBsYXN0IHBhZ2UuICovXG4gIGxhc3RQYWdlTGFiZWw6IHN0cmluZyA9ICdMYXN0IHBhZ2UnO1xuXG4gIC8qKiBBIGxhYmVsIGZvciB0aGUgcmFuZ2Ugb2YgaXRlbXMgd2l0aGluIHRoZSBjdXJyZW50IHBhZ2UgYW5kIHRoZSBsZW5ndGggb2YgdGhlIHdob2xlIGxpc3QuICovXG4gIGdldFJhbmdlTGFiZWw6IChwYWdlOiBudW1iZXIsIHBhZ2VTaXplOiBudW1iZXIsIGxlbmd0aDogbnVtYmVyKSA9PiBzdHJpbmcgPSAoXG4gICAgcGFnZTogbnVtYmVyLFxuICAgIHBhZ2VTaXplOiBudW1iZXIsXG4gICAgbGVuZ3RoOiBudW1iZXIsXG4gICkgPT4ge1xuICAgIGlmIChsZW5ndGggPT0gMCB8fCBwYWdlU2l6ZSA9PSAwKSB7XG4gICAgICByZXR1cm4gYDAgb2YgJHtsZW5ndGh9YDtcbiAgICB9XG5cbiAgICBsZW5ndGggPSBNYXRoLm1heChsZW5ndGgsIDApO1xuXG4gICAgY29uc3Qgc3RhcnRJbmRleCA9IHBhZ2UgKiBwYWdlU2l6ZTtcblxuICAgIC8vIElmIHRoZSBzdGFydCBpbmRleCBleGNlZWRzIHRoZSBsaXN0IGxlbmd0aCwgZG8gbm90IHRyeSBhbmQgZml4IHRoZSBlbmQgaW5kZXggdG8gdGhlIGVuZC5cbiAgICBjb25zdCBlbmRJbmRleCA9XG4gICAgICBzdGFydEluZGV4IDwgbGVuZ3RoID8gTWF0aC5taW4oc3RhcnRJbmRleCArIHBhZ2VTaXplLCBsZW5ndGgpIDogc3RhcnRJbmRleCArIHBhZ2VTaXplO1xuXG4gICAgcmV0dXJuIGAke3N0YXJ0SW5kZXggKyAxfSDigJMgJHtlbmRJbmRleH0gb2YgJHtsZW5ndGh9YDtcbiAgfTtcbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfUEFHSU5BVE9SX0lOVExfUFJPVklERVJfRkFDVE9SWShwYXJlbnRJbnRsOiBNYXRQYWdpbmF0b3JJbnRsKSB7XG4gIHJldHVybiBwYXJlbnRJbnRsIHx8IG5ldyBNYXRQYWdpbmF0b3JJbnRsKCk7XG59XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgY29uc3QgTUFUX1BBR0lOQVRPUl9JTlRMX1BST1ZJREVSID0ge1xuICAvLyBJZiB0aGVyZSBpcyBhbHJlYWR5IGFuIE1hdFBhZ2luYXRvckludGwgYXZhaWxhYmxlLCB1c2UgdGhhdC4gT3RoZXJ3aXNlLCBwcm92aWRlIGEgbmV3IG9uZS5cbiAgcHJvdmlkZTogTWF0UGFnaW5hdG9ySW50bCxcbiAgZGVwczogW1tuZXcgT3B0aW9uYWwoKSwgbmV3IFNraXBTZWxmKCksIE1hdFBhZ2luYXRvckludGxdXSxcbiAgdXNlRmFjdG9yeTogTUFUX1BBR0lOQVRPUl9JTlRMX1BST1ZJREVSX0ZBQ1RPUlksXG59O1xuIl19