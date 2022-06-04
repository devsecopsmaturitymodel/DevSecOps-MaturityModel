/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
/** Datepicker data that requires internationalization. */
export class MatDatepickerIntl {
    constructor() {
        /**
         * Stream that emits whenever the labels here are changed. Use this to notify
         * components if the labels have changed after initialization.
         */
        this.changes = new Subject();
        /** A label for the calendar popup (used by screen readers). */
        this.calendarLabel = 'Calendar';
        /** A label for the button used to open the calendar popup (used by screen readers). */
        this.openCalendarLabel = 'Open calendar';
        /** Label for the button used to close the calendar popup. */
        this.closeCalendarLabel = 'Close calendar';
        /** A label for the previous month button (used by screen readers). */
        this.prevMonthLabel = 'Previous month';
        /** A label for the next month button (used by screen readers). */
        this.nextMonthLabel = 'Next month';
        /** A label for the previous year button (used by screen readers). */
        this.prevYearLabel = 'Previous year';
        /** A label for the next year button (used by screen readers). */
        this.nextYearLabel = 'Next year';
        /** A label for the previous multi-year button (used by screen readers). */
        this.prevMultiYearLabel = 'Previous 24 years';
        /** A label for the next multi-year button (used by screen readers). */
        this.nextMultiYearLabel = 'Next 24 years';
        /** A label for the 'switch to month view' button (used by screen readers). */
        this.switchToMonthViewLabel = 'Choose date';
        /** A label for the 'switch to year view' button (used by screen readers). */
        this.switchToMultiYearViewLabel = 'Choose month and year';
    }
    /** Formats a range of years. */
    formatYearRange(start, end) {
        return `${start} \u2013 ${end}`;
    }
}
MatDatepickerIntl.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatDatepickerIntl, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
MatDatepickerIntl.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatDatepickerIntl, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatDatepickerIntl, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1pbnRsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci1pbnRsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQzs7QUFFN0IsMERBQTBEO0FBRTFELE1BQU0sT0FBTyxpQkFBaUI7SUFEOUI7UUFFRTs7O1dBR0c7UUFDTSxZQUFPLEdBQWtCLElBQUksT0FBTyxFQUFRLENBQUM7UUFFdEQsK0RBQStEO1FBQy9ELGtCQUFhLEdBQVcsVUFBVSxDQUFDO1FBRW5DLHVGQUF1RjtRQUN2RixzQkFBaUIsR0FBVyxlQUFlLENBQUM7UUFFNUMsNkRBQTZEO1FBQzdELHVCQUFrQixHQUFXLGdCQUFnQixDQUFDO1FBRTlDLHNFQUFzRTtRQUN0RSxtQkFBYyxHQUFXLGdCQUFnQixDQUFDO1FBRTFDLGtFQUFrRTtRQUNsRSxtQkFBYyxHQUFXLFlBQVksQ0FBQztRQUV0QyxxRUFBcUU7UUFDckUsa0JBQWEsR0FBVyxlQUFlLENBQUM7UUFFeEMsaUVBQWlFO1FBQ2pFLGtCQUFhLEdBQVcsV0FBVyxDQUFDO1FBRXBDLDJFQUEyRTtRQUMzRSx1QkFBa0IsR0FBVyxtQkFBbUIsQ0FBQztRQUVqRCx1RUFBdUU7UUFDdkUsdUJBQWtCLEdBQVcsZUFBZSxDQUFDO1FBRTdDLDhFQUE4RTtRQUM5RSwyQkFBc0IsR0FBVyxhQUFhLENBQUM7UUFFL0MsNkVBQTZFO1FBQzdFLCtCQUEwQixHQUFXLHVCQUF1QixDQUFDO0tBTTlEO0lBSkMsZ0NBQWdDO0lBQ2hDLGVBQWUsQ0FBQyxLQUFhLEVBQUUsR0FBVztRQUN4QyxPQUFPLEdBQUcsS0FBSyxXQUFXLEdBQUcsRUFBRSxDQUFDO0lBQ2xDLENBQUM7OzhHQTNDVSxpQkFBaUI7a0hBQWpCLGlCQUFpQixjQURMLE1BQU07MkZBQ2xCLGlCQUFpQjtrQkFEN0IsVUFBVTttQkFBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5cbi8qKiBEYXRlcGlja2VyIGRhdGEgdGhhdCByZXF1aXJlcyBpbnRlcm5hdGlvbmFsaXphdGlvbi4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIE1hdERhdGVwaWNrZXJJbnRsIHtcbiAgLyoqXG4gICAqIFN0cmVhbSB0aGF0IGVtaXRzIHdoZW5ldmVyIHRoZSBsYWJlbHMgaGVyZSBhcmUgY2hhbmdlZC4gVXNlIHRoaXMgdG8gbm90aWZ5XG4gICAqIGNvbXBvbmVudHMgaWYgdGhlIGxhYmVscyBoYXZlIGNoYW5nZWQgYWZ0ZXIgaW5pdGlhbGl6YXRpb24uXG4gICAqL1xuICByZWFkb25seSBjaGFuZ2VzOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogQSBsYWJlbCBmb3IgdGhlIGNhbGVuZGFyIHBvcHVwICh1c2VkIGJ5IHNjcmVlbiByZWFkZXJzKS4gKi9cbiAgY2FsZW5kYXJMYWJlbDogc3RyaW5nID0gJ0NhbGVuZGFyJztcblxuICAvKiogQSBsYWJlbCBmb3IgdGhlIGJ1dHRvbiB1c2VkIHRvIG9wZW4gdGhlIGNhbGVuZGFyIHBvcHVwICh1c2VkIGJ5IHNjcmVlbiByZWFkZXJzKS4gKi9cbiAgb3BlbkNhbGVuZGFyTGFiZWw6IHN0cmluZyA9ICdPcGVuIGNhbGVuZGFyJztcblxuICAvKiogTGFiZWwgZm9yIHRoZSBidXR0b24gdXNlZCB0byBjbG9zZSB0aGUgY2FsZW5kYXIgcG9wdXAuICovXG4gIGNsb3NlQ2FsZW5kYXJMYWJlbDogc3RyaW5nID0gJ0Nsb3NlIGNhbGVuZGFyJztcblxuICAvKiogQSBsYWJlbCBmb3IgdGhlIHByZXZpb3VzIG1vbnRoIGJ1dHRvbiAodXNlZCBieSBzY3JlZW4gcmVhZGVycykuICovXG4gIHByZXZNb250aExhYmVsOiBzdHJpbmcgPSAnUHJldmlvdXMgbW9udGgnO1xuXG4gIC8qKiBBIGxhYmVsIGZvciB0aGUgbmV4dCBtb250aCBidXR0b24gKHVzZWQgYnkgc2NyZWVuIHJlYWRlcnMpLiAqL1xuICBuZXh0TW9udGhMYWJlbDogc3RyaW5nID0gJ05leHQgbW9udGgnO1xuXG4gIC8qKiBBIGxhYmVsIGZvciB0aGUgcHJldmlvdXMgeWVhciBidXR0b24gKHVzZWQgYnkgc2NyZWVuIHJlYWRlcnMpLiAqL1xuICBwcmV2WWVhckxhYmVsOiBzdHJpbmcgPSAnUHJldmlvdXMgeWVhcic7XG5cbiAgLyoqIEEgbGFiZWwgZm9yIHRoZSBuZXh0IHllYXIgYnV0dG9uICh1c2VkIGJ5IHNjcmVlbiByZWFkZXJzKS4gKi9cbiAgbmV4dFllYXJMYWJlbDogc3RyaW5nID0gJ05leHQgeWVhcic7XG5cbiAgLyoqIEEgbGFiZWwgZm9yIHRoZSBwcmV2aW91cyBtdWx0aS15ZWFyIGJ1dHRvbiAodXNlZCBieSBzY3JlZW4gcmVhZGVycykuICovXG4gIHByZXZNdWx0aVllYXJMYWJlbDogc3RyaW5nID0gJ1ByZXZpb3VzIDI0IHllYXJzJztcblxuICAvKiogQSBsYWJlbCBmb3IgdGhlIG5leHQgbXVsdGkteWVhciBidXR0b24gKHVzZWQgYnkgc2NyZWVuIHJlYWRlcnMpLiAqL1xuICBuZXh0TXVsdGlZZWFyTGFiZWw6IHN0cmluZyA9ICdOZXh0IDI0IHllYXJzJztcblxuICAvKiogQSBsYWJlbCBmb3IgdGhlICdzd2l0Y2ggdG8gbW9udGggdmlldycgYnV0dG9uICh1c2VkIGJ5IHNjcmVlbiByZWFkZXJzKS4gKi9cbiAgc3dpdGNoVG9Nb250aFZpZXdMYWJlbDogc3RyaW5nID0gJ0Nob29zZSBkYXRlJztcblxuICAvKiogQSBsYWJlbCBmb3IgdGhlICdzd2l0Y2ggdG8geWVhciB2aWV3JyBidXR0b24gKHVzZWQgYnkgc2NyZWVuIHJlYWRlcnMpLiAqL1xuICBzd2l0Y2hUb011bHRpWWVhclZpZXdMYWJlbDogc3RyaW5nID0gJ0Nob29zZSBtb250aCBhbmQgeWVhcic7XG5cbiAgLyoqIEZvcm1hdHMgYSByYW5nZSBvZiB5ZWFycy4gKi9cbiAgZm9ybWF0WWVhclJhbmdlKHN0YXJ0OiBzdHJpbmcsIGVuZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYCR7c3RhcnR9IFxcdTIwMTMgJHtlbmR9YDtcbiAgfVxufVxuIl19