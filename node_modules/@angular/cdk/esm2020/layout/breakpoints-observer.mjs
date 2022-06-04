/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceArray } from '@angular/cdk/coercion';
import { Injectable, NgZone } from '@angular/core';
import { combineLatest, concat, Observable, Subject } from 'rxjs';
import { debounceTime, map, skip, startWith, take, takeUntil } from 'rxjs/operators';
import { MediaMatcher } from './media-matcher';
import * as i0 from "@angular/core";
import * as i1 from "./media-matcher";
/** Utility for checking the matching state of @media queries. */
export class BreakpointObserver {
    constructor(_mediaMatcher, _zone) {
        this._mediaMatcher = _mediaMatcher;
        this._zone = _zone;
        /**  A map of all media queries currently being listened for. */
        this._queries = new Map();
        /** A subject for all other observables to takeUntil based on. */
        this._destroySubject = new Subject();
    }
    /** Completes the active subject, signalling to all other observables to complete. */
    ngOnDestroy() {
        this._destroySubject.next();
        this._destroySubject.complete();
    }
    /**
     * Whether one or more media queries match the current viewport size.
     * @param value One or more media queries to check.
     * @returns Whether any of the media queries match.
     */
    isMatched(value) {
        const queries = splitQueries(coerceArray(value));
        return queries.some(mediaQuery => this._registerQuery(mediaQuery).mql.matches);
    }
    /**
     * Gets an observable of results for the given queries that will emit new results for any changes
     * in matching of the given queries.
     * @param value One or more media queries to check.
     * @returns A stream of matches for the given queries.
     */
    observe(value) {
        const queries = splitQueries(coerceArray(value));
        const observables = queries.map(query => this._registerQuery(query).observable);
        let stateObservable = combineLatest(observables);
        // Emit the first state immediately, and then debounce the subsequent emissions.
        stateObservable = concat(stateObservable.pipe(take(1)), stateObservable.pipe(skip(1), debounceTime(0)));
        return stateObservable.pipe(map(breakpointStates => {
            const response = {
                matches: false,
                breakpoints: {},
            };
            breakpointStates.forEach(({ matches, query }) => {
                response.matches = response.matches || matches;
                response.breakpoints[query] = matches;
            });
            return response;
        }));
    }
    /** Registers a specific query to be listened for. */
    _registerQuery(query) {
        // Only set up a new MediaQueryList if it is not already being listened for.
        if (this._queries.has(query)) {
            return this._queries.get(query);
        }
        const mql = this._mediaMatcher.matchMedia(query);
        // Create callback for match changes and add it is as a listener.
        const queryObservable = new Observable((observer) => {
            // Listener callback methods are wrapped to be placed back in ngZone. Callbacks must be placed
            // back into the zone because matchMedia is only included in Zone.js by loading the
            // webapis-media-query.js file alongside the zone.js file.  Additionally, some browsers do not
            // have MediaQueryList inherit from EventTarget, which causes inconsistencies in how Zone.js
            // patches it.
            const handler = (e) => this._zone.run(() => observer.next(e));
            mql.addListener(handler);
            return () => {
                mql.removeListener(handler);
            };
        }).pipe(startWith(mql), map(({ matches }) => ({ query, matches })), takeUntil(this._destroySubject));
        // Add the MediaQueryList to the set of queries.
        const output = { observable: queryObservable, mql };
        this._queries.set(query, output);
        return output;
    }
}
BreakpointObserver.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: BreakpointObserver, deps: [{ token: i1.MediaMatcher }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Injectable });
BreakpointObserver.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: BreakpointObserver, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: BreakpointObserver, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.MediaMatcher }, { type: i0.NgZone }]; } });
/**
 * Split each query string into separate query strings if two queries are provided as comma
 * separated.
 */
function splitQueries(queries) {
    return queries
        .map(query => query.split(','))
        .reduce((a1, a2) => a1.concat(a2))
        .map(query => query.trim());
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJlYWtwb2ludHMtb2JzZXJ2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL2xheW91dC9icmVha3BvaW50cy1vYnNlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDbEQsT0FBTyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQVksTUFBTSxlQUFlLENBQUM7QUFDNUQsT0FBTyxFQUFDLGFBQWEsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFZLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUMxRSxPQUFPLEVBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNuRixPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7OztBQTRCN0MsaUVBQWlFO0FBRWpFLE1BQU0sT0FBTyxrQkFBa0I7SUFNN0IsWUFBb0IsYUFBMkIsRUFBVSxLQUFhO1FBQWxELGtCQUFhLEdBQWIsYUFBYSxDQUFjO1FBQVUsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUx0RSxnRUFBZ0U7UUFDeEQsYUFBUSxHQUFHLElBQUksR0FBRyxFQUFpQixDQUFDO1FBQzVDLGlFQUFpRTtRQUNoRCxvQkFBZSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7SUFFa0IsQ0FBQztJQUUxRSxxRkFBcUY7SUFDckYsV0FBVztRQUNULElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILFNBQVMsQ0FBQyxLQUFpQztRQUN6QyxNQUFNLE9BQU8sR0FBRyxZQUFZLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FB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QUUsR0FBRyxFQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2pDLE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7OytHQXZGVSxrQkFBa0I7bUhBQWxCLGtCQUFrQixjQUROLE1BQU07MkZBQ2xCLGtCQUFrQjtrQkFEOUIsVUFBVTttQkFBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUM7O0FBMkZoQzs7O0dBR0c7QUFDSCxTQUFTLFlBQVksQ0FBQyxPQUEwQjtJQUM5QyxPQUFPLE9BQU87U0FDWCxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzlCLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDakMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFDaEMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2NvZXJjZUFycmF5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtJbmplY3RhYmxlLCBOZ1pvbmUsIE9uRGVzdHJveX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2NvbWJpbmVMYXRlc3QsIGNvbmNhdCwgT2JzZXJ2YWJsZSwgT2JzZXJ2ZXIsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtkZWJvdW5jZVRpbWUsIG1hcCwgc2tpcCwgc3RhcnRXaXRoLCB0YWtlLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7TWVkaWFNYXRjaGVyfSBmcm9tICcuL21lZGlhLW1hdGNoZXInO1xuXG4vKiogVGhlIGN1cnJlbnQgc3RhdGUgb2YgYSBsYXlvdXQgYnJlYWtwb2ludC4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQnJlYWtwb2ludFN0YXRlIHtcbiAgLyoqIFdoZXRoZXIgdGhlIGJyZWFrcG9pbnQgaXMgY3VycmVudGx5IG1hdGNoaW5nLiAqL1xuICBtYXRjaGVzOiBib29sZWFuO1xuICAvKipcbiAgICogQSBrZXkgYm9vbGVhbiBwYWlyIGZvciBlYWNoIHF1ZXJ5IHByb3ZpZGVkIHRvIHRoZSBvYnNlcnZlIG1ldGhvZCxcbiAgICogd2l0aCBpdHMgY3VycmVudCBtYXRjaGVkIHN0YXRlLlxuICAgKi9cbiAgYnJlYWtwb2ludHM6IHtcbiAgICBba2V5OiBzdHJpbmddOiBib29sZWFuO1xuICB9O1xufVxuXG4vKiogVGhlIGN1cnJlbnQgc3RhdGUgb2YgYSBsYXlvdXQgYnJlYWtwb2ludC4gKi9cbmludGVyZmFjZSBJbnRlcm5hbEJyZWFrcG9pbnRTdGF0ZSB7XG4gIC8qKiBXaGV0aGVyIHRoZSBicmVha3BvaW50IGlzIGN1cnJlbnRseSBtYXRjaGluZy4gKi9cbiAgbWF0Y2hlczogYm9vbGVhbjtcbiAgLyoqIFRoZSBtZWRpYSBxdWVyeSBiZWluZyB0byBiZSBtYXRjaGVkICovXG4gIHF1ZXJ5OiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBRdWVyeSB7XG4gIG9ic2VydmFibGU6IE9ic2VydmFibGU8SW50ZXJuYWxCcmVha3BvaW50U3RhdGU+O1xuICBtcWw6IE1lZGlhUXVlcnlMaXN0O1xufVxuXG4vKiogVXRpbGl0eSBmb3IgY2hlY2tpbmcgdGhlIG1hdGNoaW5nIHN0YXRlIG9mIEBtZWRpYSBxdWVyaWVzLiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludE9ic2VydmVyIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgLyoqICBBIG1hcCBvZiBhbGwgbWVkaWEgcXVlcmllcyBjdXJyZW50bHkgYmVpbmcgbGlzdGVuZWQgZm9yLiAqL1xuICBwcml2YXRlIF9xdWVyaWVzID0gbmV3IE1hcDxzdHJpbmcsIFF1ZXJ5PigpO1xuICAvKiogQSBzdWJqZWN0IGZvciBhbGwgb3RoZXIgb2JzZXJ2YWJsZXMgdG8gdGFrZVVudGlsIGJhc2VkIG9uLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9kZXN0cm95U3ViamVjdCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfbWVkaWFNYXRjaGVyOiBNZWRpYU1hdGNoZXIsIHByaXZhdGUgX3pvbmU6IE5nWm9uZSkge31cblxuICAvKiogQ29tcGxldGVzIHRoZSBhY3RpdmUgc3ViamVjdCwgc2lnbmFsbGluZyB0byBhbGwgb3RoZXIgb2JzZXJ2YWJsZXMgdG8gY29tcGxldGUuICovXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2Rlc3Ryb3lTdWJqZWN0Lm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95U3ViamVjdC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgb25lIG9yIG1vcmUgbWVkaWEgcXVlcmllcyBtYXRjaCB0aGUgY3VycmVudCB2aWV3cG9ydCBzaXplLlxuICAgKiBAcGFyYW0gdmFsdWUgT25lIG9yIG1vcmUgbWVkaWEgcXVlcmllcyB0byBjaGVjay5cbiAgICogQHJldHVybnMgV2hldGhlciBhbnkgb2YgdGhlIG1lZGlhIHF1ZXJpZXMgbWF0Y2guXG4gICAqL1xuICBpc01hdGNoZWQodmFsdWU6IHN0cmluZyB8IHJlYWRvbmx5IHN0cmluZ1tdKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcXVlcmllcyA9IHNwbGl0UXVlcmllcyhjb2VyY2VBcnJheSh2YWx1ZSkpO1xuICAgIHJldHVybiBxdWVyaWVzLnNvbWUobWVkaWFRdWVyeSA9PiB0aGlzLl9yZWdpc3RlclF1ZXJ5KG1lZGlhUXVlcnkpLm1xbC5tYXRjaGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGFuIG9ic2VydmFibGUgb2YgcmVzdWx0cyBmb3IgdGhlIGdpdmVuIHF1ZXJpZXMgdGhhdCB3aWxsIGVtaXQgbmV3IHJlc3VsdHMgZm9yIGFueSBjaGFuZ2VzXG4gICAqIGluIG1hdGNoaW5nIG9mIHRoZSBnaXZlbiBxdWVyaWVzLlxuICAgKiBAcGFyYW0gdmFsdWUgT25lIG9yIG1vcmUgbWVkaWEgcXVlcmllcyB0byBjaGVjay5cbiAgICogQHJldHVybnMgQSBzdHJlYW0gb2YgbWF0Y2hlcyBmb3IgdGhlIGdpdmVuIHF1ZXJpZXMuXG4gICAqL1xuICBvYnNlcnZlKHZhbHVlOiBzdHJpbmcgfCByZWFkb25seSBzdHJpbmdbXSk6IE9ic2VydmFibGU8QnJlYWtwb2ludFN0YXRlPiB7XG4gICAgY29uc3QgcXVlcmllcyA9IHNwbGl0UXVlcmllcyhjb2VyY2VBcnJheSh2YWx1ZSkpO1xuICAgIGNvbnN0IG9ic2VydmFibGVzID0gcXVlcmllcy5tYXAocXVlcnkgPT4gdGhpcy5fcmVnaXN0ZXJRdWVyeShxdWVyeSkub2JzZXJ2YWJsZSk7XG5cbiAgICBsZXQgc3RhdGVPYnNlcnZhYmxlID0gY29tYmluZUxhdGVzdChvYnNlcnZhYmxlcyk7XG4gICAgLy8gRW1pdCB0aGUgZmlyc3Qgc3RhdGUgaW1tZWRpYXRlbHksIGFuZCB0aGVuIGRlYm91bmNlIHRoZSBzdWJzZXF1ZW50IGVtaXNzaW9ucy5cbiAgICBzdGF0ZU9ic2VydmFibGUgPSBjb25jYXQoXG4gICAgICBzdGF0ZU9ic2VydmFibGUucGlwZSh0YWtlKDEpKSxcbiAgICAgIHN0YXRlT2JzZXJ2YWJsZS5waXBlKHNraXAoMSksIGRlYm91bmNlVGltZSgwKSksXG4gICAgKTtcbiAgICByZXR1cm4gc3RhdGVPYnNlcnZhYmxlLnBpcGUoXG4gICAgICBtYXAoYnJlYWtwb2ludFN0YXRlcyA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlOiBCcmVha3BvaW50U3RhdGUgPSB7XG4gICAgICAgICAgbWF0Y2hlczogZmFsc2UsXG4gICAgICAgICAgYnJlYWtwb2ludHM6IHt9LFxuICAgICAgICB9O1xuICAgICAgICBicmVha3BvaW50U3RhdGVzLmZvckVhY2goKHttYXRjaGVzLCBxdWVyeX0pID0+IHtcbiAgICAgICAgICByZXNwb25zZS5tYXRjaGVzID0gcmVzcG9uc2UubWF0Y2hlcyB8fCBtYXRjaGVzO1xuICAgICAgICAgIHJlc3BvbnNlLmJyZWFrcG9pbnRzW3F1ZXJ5XSA9IG1hdGNoZXM7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICB9KSxcbiAgICApO1xuICB9XG5cbiAgLyoqIFJlZ2lzdGVycyBhIHNwZWNpZmljIHF1ZXJ5IHRvIGJlIGxpc3RlbmVkIGZvci4gKi9cbiAgcHJpdmF0ZSBfcmVnaXN0ZXJRdWVyeShxdWVyeTogc3RyaW5nKTogUXVlcnkge1xuICAgIC8vIE9ubHkgc2V0IHVwIGEgbmV3IE1lZGlhUXVlcnlMaXN0IGlmIGl0IGlzIG5vdCBhbHJlYWR5IGJlaW5nIGxpc3RlbmVkIGZvci5cbiAgICBpZiAodGhpcy5fcXVlcmllcy5oYXMocXVlcnkpKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcXVlcmllcy5nZXQocXVlcnkpITtcbiAgICB9XG5cbiAgICBjb25zdCBtcWwgPSB0aGlzLl9tZWRpYU1hdGNoZXIubWF0Y2hNZWRpYShxdWVyeSk7XG5cbiAgICAvLyBDcmVhdGUgY2FsbGJhY2sgZm9yIG1hdGNoIGNoYW5nZXMgYW5kIGFkZCBpdCBpcyBhcyBhIGxpc3RlbmVyLlxuICAgIGNvbnN0IHF1ZXJ5T2JzZXJ2YWJsZSA9IG5ldyBPYnNlcnZhYmxlKChvYnNlcnZlcjogT2JzZXJ2ZXI8TWVkaWFRdWVyeUxpc3RFdmVudD4pID0+IHtcbiAgICAgIC8vIExpc3RlbmVyIGNhbGxiYWNrIG1ldGhvZHMgYXJlIHdyYXBwZWQgdG8gYmUgcGxhY2VkIGJhY2sgaW4gbmdab25lLiBDYWxsYmFja3MgbXVzdCBiZSBwbGFjZWRcbiAgICAgIC8vIGJhY2sgaW50byB0aGUgem9uZSBiZWNhdXNlIG1hdGNoTWVkaWEgaXMgb25seSBpbmNsdWRlZCBpbiBab25lLmpzIGJ5IGxvYWRpbmcgdGhlXG4gICAgICAvLyB3ZWJhcGlzLW1lZGlhLXF1ZXJ5LmpzIGZpbGUgYWxvbmdzaWRlIHRoZSB6b25lLmpzIGZpbGUuICBBZGRpdGlvbmFsbHksIHNvbWUgYnJvd3NlcnMgZG8gbm90XG4gICAgICAvLyBoYXZlIE1lZGlhUXVlcnlMaXN0IGluaGVyaXQgZnJvbSBFdmVudFRhcmdldCwgd2hpY2ggY2F1c2VzIGluY29uc2lzdGVuY2llcyBpbiBob3cgWm9uZS5qc1xuICAgICAgLy8gcGF0Y2hlcyBpdC5cbiAgICAgIGNvbnN0IGhhbmRsZXIgPSAoZTogTWVkaWFRdWVyeUxpc3RFdmVudCk6IHZvaWQgPT4gdGhpcy5fem9uZS5ydW4oKCkgPT4gb2JzZXJ2ZXIubmV4dChlKSk7XG4gICAgICBtcWwuYWRkTGlzdGVuZXIoaGFuZGxlcik7XG5cbiAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIG1xbC5yZW1vdmVMaXN0ZW5lcihoYW5kbGVyKTtcbiAgICAgIH07XG4gICAgfSkucGlwZShcbiAgICAgIHN0YXJ0V2l0aChtcWwpLFxuICAgICAgbWFwKCh7bWF0Y2hlc30pID0+ICh7cXVlcnksIG1hdGNoZXN9KSksXG4gICAgICB0YWtlVW50aWwodGhpcy5fZGVzdHJveVN1YmplY3QpLFxuICAgICk7XG5cbiAgICAvLyBBZGQgdGhlIE1lZGlhUXVlcnlMaXN0IHRvIHRoZSBzZXQgb2YgcXVlcmllcy5cbiAgICBjb25zdCBvdXRwdXQgPSB7b2JzZXJ2YWJsZTogcXVlcnlPYnNlcnZhYmxlLCBtcWx9O1xuICAgIHRoaXMuX3F1ZXJpZXMuc2V0KHF1ZXJ5LCBvdXRwdXQpO1xuICAgIHJldHVybiBvdXRwdXQ7XG4gIH1cbn1cblxuLyoqXG4gKiBTcGxpdCBlYWNoIHF1ZXJ5IHN0cmluZyBpbnRvIHNlcGFyYXRlIHF1ZXJ5IHN0cmluZ3MgaWYgdHdvIHF1ZXJpZXMgYXJlIHByb3ZpZGVkIGFzIGNvbW1hXG4gKiBzZXBhcmF0ZWQuXG4gKi9cbmZ1bmN0aW9uIHNwbGl0UXVlcmllcyhxdWVyaWVzOiByZWFkb25seSBzdHJpbmdbXSk6IHJlYWRvbmx5IHN0cmluZ1tdIHtcbiAgcmV0dXJuIHF1ZXJpZXNcbiAgICAubWFwKHF1ZXJ5ID0+IHF1ZXJ5LnNwbGl0KCcsJykpXG4gICAgLnJlZHVjZSgoYTEsIGEyKSA9PiBhMS5jb25jYXQoYTIpKVxuICAgIC5tYXAocXVlcnkgPT4gcXVlcnkudHJpbSgpKTtcbn1cbiJdfQ==