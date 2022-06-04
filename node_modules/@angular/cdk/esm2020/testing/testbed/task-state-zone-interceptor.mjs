/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BehaviorSubject } from 'rxjs';
/** Unique symbol that is used to patch a property to a proxy zone. */
const stateObservableSymbol = Symbol('ProxyZone_PATCHED#stateObservable');
/**
 * Interceptor that can be set up in a `ProxyZone` instance. The interceptor
 * will keep track of the task state and emit whenever the state changes.
 *
 * This serves as a workaround for https://github.com/angular/angular/issues/32896.
 */
export class TaskStateZoneInterceptor {
    constructor(_lastState) {
        this._lastState = _lastState;
        /** Subject that can be used to emit a new state change. */
        this._stateSubject = new BehaviorSubject(this._lastState ? this._getTaskStateFromInternalZoneState(this._lastState) : { stable: true });
        /** Public observable that emits whenever the task state changes. */
        this.state = this._stateSubject;
    }
    /** This will be called whenever the task state changes in the intercepted zone. */
    onHasTask(delegate, current, target, hasTaskState) {
        if (current === target) {
            this._stateSubject.next(this._getTaskStateFromInternalZoneState(hasTaskState));
        }
    }
    /** Gets the task state from the internal ZoneJS task state. */
    _getTaskStateFromInternalZoneState(state) {
        return { stable: !state.macroTask && !state.microTask };
    }
    /**
     * Sets up the custom task state Zone interceptor in the  `ProxyZone`. Throws if
     * no `ProxyZone` could be found.
     * @returns an observable that emits whenever the task state changes.
     */
    static setup() {
        if (Zone === undefined) {
            throw Error('Could not find ZoneJS. For test harnesses running in TestBed, ' +
                'ZoneJS needs to be installed.');
        }
        // tslint:disable-next-line:variable-name
        const ProxyZoneSpec = Zone['ProxyZoneSpec'];
        // If there is no "ProxyZoneSpec" installed, we throw an error and recommend
        // setting up the proxy zone by pulling in the testing bundle.
        if (!ProxyZoneSpec) {
            throw Error('ProxyZoneSpec is needed for the test harnesses but could not be found. ' +
                'Please make sure that your environment includes zone.js/dist/zone-testing.js');
        }
        // Ensure that there is a proxy zone instance set up, and get
        // a reference to the instance if present.
        const zoneSpec = ProxyZoneSpec.assertPresent();
        // If there already is a delegate registered in the proxy zone, and it
        // is type of the custom task state interceptor, we just use that state
        // observable. This allows us to only intercept Zone once per test
        // (similar to how `fakeAsync` or `async` work).
        if (zoneSpec[stateObservableSymbol]) {
            return zoneSpec[stateObservableSymbol];
        }
        // Since we intercept on environment creation and the fixture has been
        // created before, we might have missed tasks scheduled before. Fortunately
        // the proxy zone keeps track of the previous task state, so we can just pass
        // this as initial state to the task zone interceptor.
        const interceptor = new TaskStateZoneInterceptor(zoneSpec.lastTaskState);
        const zoneSpecOnHasTask = zoneSpec.onHasTask.bind(zoneSpec);
        // We setup the task state interceptor in the `ProxyZone`. Note that we cannot register
        // the interceptor as a new proxy zone delegate because it would mean that other zone
        // delegates (e.g. `FakeAsyncTestZone` or `AsyncTestZone`) can accidentally overwrite/disable
        // our interceptor. Since we just intend to monitor the task state of the proxy zone, it is
        // sufficient to just patch the proxy zone. This also avoids that we interfere with the task
        // queue scheduling logic.
        zoneSpec.onHasTask = function (...args) {
            zoneSpecOnHasTask(...args);
            interceptor.onHasTask(...args);
        };
        return (zoneSpec[stateObservableSymbol] = interceptor.state);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFzay1zdGF0ZS16b25lLWludGVyY2VwdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay90ZXN0aW5nL3Rlc3RiZWQvdGFzay1zdGF0ZS16b25lLWludGVyY2VwdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxlQUFlLEVBQWEsTUFBTSxNQUFNLENBQUM7QUFTakQsc0VBQXNFO0FBQ3RFLE1BQU0scUJBQXFCLEdBQUcsTUFBTSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7QUFPMUU7Ozs7O0dBS0c7QUFDSCxNQUFNLE9BQU8sd0JBQXdCO0lBU25DLFlBQW9CLFVBQStCO1FBQS9CLGVBQVUsR0FBVixVQUFVLENBQXFCO1FBUm5ELDJEQUEyRDtRQUMxQyxrQkFBYSxHQUFHLElBQUksZUFBZSxDQUNsRCxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsa0NBQWtDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FDNUYsQ0FBQztRQUVGLG9FQUFvRTtRQUMzRCxVQUFLLEdBQTBCLElBQUksQ0FBQyxhQUFhLENBQUM7SUFFTCxDQUFDO0lBRXZELG1GQUFtRjtJQUNuRixTQUFTLENBQUMsUUFBc0IsRUFBRSxPQUFhLEVBQUUsTUFBWSxFQUFFLFlBQTBCO1FBQ3ZGLElBQUksT0FBTyxLQUFLLE1BQU0sRUFBRTtZQUN0QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsa0NBQWtDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztTQUNoRjtJQUNILENBQUM7SUFFRCwrREFBK0Q7SUFDdkQsa0NBQWtDLENBQUMsS0FBbUI7UUFDNUQsT0FBTyxFQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxNQUFNLENBQUMsS0FBSztRQUNWLElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtZQUN0QixNQUFNLEtBQUssQ0FDVCxnRUFBZ0U7Z0JBQzlELCtCQUErQixDQUNsQyxDQUFDO1NBQ0g7UUFFRCx5Q0FBeUM7UUFDekMsTUFBTSxhQUFhLEdBQUksSUFBWSxDQUFDLGVBQWUsQ0FBZ0MsQ0FBQztRQUVwRiw0RUFBNEU7UUFDNUUsOERBQThEO1FBQzlELElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDbEIsTUFBTSxLQUFLLENBQ1QseUVBQXlFO2dCQUN2RSw4RUFBOEUsQ0FDakYsQ0FBQztTQUNIO1FBRUQsNkRBQTZEO1FBQzdELDBDQUEwQztRQUMxQyxNQUFNLFFBQVEsR0FBRyxhQUFhLENBQUMsYUFBYSxFQUFzQixDQUFDO1FBRW5FLHNFQUFzRTtRQUN0RSx1RUFBdUU7UUFDdkUsa0VBQWtFO1FBQ2xFLGdEQUFnRDtRQUNoRCxJQUFJLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFO1lBQ25DLE9BQU8sUUFBUSxDQUFDLHFCQUFxQixDQUFFLENBQUM7U0FDekM7UUFFRCxzRUFBc0U7UUFDdEUsMkVBQTJFO1FBQzNFLDZFQUE2RTtRQUM3RSxzREFBc0Q7UUFDdEQsTUFBTSxXQUFXLEdBQUcsSUFBSSx3QkFBd0IsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDekUsTUFBTSxpQkFBaUIsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUU1RCx1RkFBdUY7UUFDdkYscUZBQXFGO1FBQ3JGLDZGQUE2RjtRQUM3RiwyRkFBMkY7UUFDM0YsNEZBQTRGO1FBQzVGLDBCQUEwQjtRQUMxQixRQUFRLENBQUMsU0FBUyxHQUFHLFVBQVUsR0FBRyxJQUE4QztZQUM5RSxpQkFBaUIsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1lBQzNCLFdBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUNqQyxDQUFDLENBQUM7UUFFRixPQUFPLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9ELENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1Byb3h5Wm9uZSwgUHJveHlab25lU3RhdGljfSBmcm9tICcuL3Byb3h5LXpvbmUtdHlwZXMnO1xuXG4vKiogQ3VycmVudCBzdGF0ZSBvZiB0aGUgaW50ZXJjZXB0ZWQgem9uZS4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVGFza1N0YXRlIHtcbiAgLyoqIFdoZXRoZXIgdGhlIHpvbmUgaXMgc3RhYmxlIChpLmUuIG5vIG1pY3JvdGFza3MgYW5kIG1hY3JvdGFza3MpLiAqL1xuICBzdGFibGU6IGJvb2xlYW47XG59XG5cbi8qKiBVbmlxdWUgc3ltYm9sIHRoYXQgaXMgdXNlZCB0byBwYXRjaCBhIHByb3BlcnR5IHRvIGEgcHJveHkgem9uZS4gKi9cbmNvbnN0IHN0YXRlT2JzZXJ2YWJsZVN5bWJvbCA9IFN5bWJvbCgnUHJveHlab25lX1BBVENIRUQjc3RhdGVPYnNlcnZhYmxlJyk7XG5cbi8qKiBUeXBlIHRoYXQgZGVzY3JpYmVzIGEgcG90ZW50aWFsbHkgcGF0Y2hlZCBwcm94eSB6b25lIGluc3RhbmNlLiAqL1xudHlwZSBQYXRjaGVkUHJveHlab25lID0gUHJveHlab25lICYge1xuICBbc3RhdGVPYnNlcnZhYmxlU3ltYm9sXTogdW5kZWZpbmVkIHwgT2JzZXJ2YWJsZTxUYXNrU3RhdGU+O1xufTtcblxuLyoqXG4gKiBJbnRlcmNlcHRvciB0aGF0IGNhbiBiZSBzZXQgdXAgaW4gYSBgUHJveHlab25lYCBpbnN0YW5jZS4gVGhlIGludGVyY2VwdG9yXG4gKiB3aWxsIGtlZXAgdHJhY2sgb2YgdGhlIHRhc2sgc3RhdGUgYW5kIGVtaXQgd2hlbmV2ZXIgdGhlIHN0YXRlIGNoYW5nZXMuXG4gKlxuICogVGhpcyBzZXJ2ZXMgYXMgYSB3b3JrYXJvdW5kIGZvciBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8zMjg5Ni5cbiAqL1xuZXhwb3J0IGNsYXNzIFRhc2tTdGF0ZVpvbmVJbnRlcmNlcHRvciB7XG4gIC8qKiBTdWJqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gZW1pdCBhIG5ldyBzdGF0ZSBjaGFuZ2UuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX3N0YXRlU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8VGFza1N0YXRlPihcbiAgICB0aGlzLl9sYXN0U3RhdGUgPyB0aGlzLl9nZXRUYXNrU3RhdGVGcm9tSW50ZXJuYWxab25lU3RhdGUodGhpcy5fbGFzdFN0YXRlKSA6IHtzdGFibGU6IHRydWV9LFxuICApO1xuXG4gIC8qKiBQdWJsaWMgb2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHdoZW5ldmVyIHRoZSB0YXNrIHN0YXRlIGNoYW5nZXMuICovXG4gIHJlYWRvbmx5IHN0YXRlOiBPYnNlcnZhYmxlPFRhc2tTdGF0ZT4gPSB0aGlzLl9zdGF0ZVN1YmplY3Q7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfbGFzdFN0YXRlOiBIYXNUYXNrU3RhdGUgfCBudWxsKSB7fVxuXG4gIC8qKiBUaGlzIHdpbGwgYmUgY2FsbGVkIHdoZW5ldmVyIHRoZSB0YXNrIHN0YXRlIGNoYW5nZXMgaW4gdGhlIGludGVyY2VwdGVkIHpvbmUuICovXG4gIG9uSGFzVGFzayhkZWxlZ2F0ZTogWm9uZURlbGVnYXRlLCBjdXJyZW50OiBab25lLCB0YXJnZXQ6IFpvbmUsIGhhc1Rhc2tTdGF0ZTogSGFzVGFza1N0YXRlKSB7XG4gICAgaWYgKGN1cnJlbnQgPT09IHRhcmdldCkge1xuICAgICAgdGhpcy5fc3RhdGVTdWJqZWN0Lm5leHQodGhpcy5fZ2V0VGFza1N0YXRlRnJvbUludGVybmFsWm9uZVN0YXRlKGhhc1Rhc2tTdGF0ZSkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB0YXNrIHN0YXRlIGZyb20gdGhlIGludGVybmFsIFpvbmVKUyB0YXNrIHN0YXRlLiAqL1xuICBwcml2YXRlIF9nZXRUYXNrU3RhdGVGcm9tSW50ZXJuYWxab25lU3RhdGUoc3RhdGU6IEhhc1Rhc2tTdGF0ZSk6IFRhc2tTdGF0ZSB7XG4gICAgcmV0dXJuIHtzdGFibGU6ICFzdGF0ZS5tYWNyb1Rhc2sgJiYgIXN0YXRlLm1pY3JvVGFza307XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB1cCB0aGUgY3VzdG9tIHRhc2sgc3RhdGUgWm9uZSBpbnRlcmNlcHRvciBpbiB0aGUgIGBQcm94eVpvbmVgLiBUaHJvd3MgaWZcbiAgICogbm8gYFByb3h5Wm9uZWAgY291bGQgYmUgZm91bmQuXG4gICAqIEByZXR1cm5zIGFuIG9ic2VydmFibGUgdGhhdCBlbWl0cyB3aGVuZXZlciB0aGUgdGFzayBzdGF0ZSBjaGFuZ2VzLlxuICAgKi9cbiAgc3RhdGljIHNldHVwKCk6IE9ic2VydmFibGU8VGFza1N0YXRlPiB7XG4gICAgaWYgKFpvbmUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICdDb3VsZCBub3QgZmluZCBab25lSlMuIEZvciB0ZXN0IGhhcm5lc3NlcyBydW5uaW5nIGluIFRlc3RCZWQsICcgK1xuICAgICAgICAgICdab25lSlMgbmVlZHMgdG8gYmUgaW5zdGFsbGVkLicsXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXG4gICAgY29uc3QgUHJveHlab25lU3BlYyA9IChab25lIGFzIGFueSlbJ1Byb3h5Wm9uZVNwZWMnXSBhcyBQcm94eVpvbmVTdGF0aWMgfCB1bmRlZmluZWQ7XG5cbiAgICAvLyBJZiB0aGVyZSBpcyBubyBcIlByb3h5Wm9uZVNwZWNcIiBpbnN0YWxsZWQsIHdlIHRocm93IGFuIGVycm9yIGFuZCByZWNvbW1lbmRcbiAgICAvLyBzZXR0aW5nIHVwIHRoZSBwcm94eSB6b25lIGJ5IHB1bGxpbmcgaW4gdGhlIHRlc3RpbmcgYnVuZGxlLlxuICAgIGlmICghUHJveHlab25lU3BlYykge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICdQcm94eVpvbmVTcGVjIGlzIG5lZWRlZCBmb3IgdGhlIHRlc3QgaGFybmVzc2VzIGJ1dCBjb3VsZCBub3QgYmUgZm91bmQuICcgK1xuICAgICAgICAgICdQbGVhc2UgbWFrZSBzdXJlIHRoYXQgeW91ciBlbnZpcm9ubWVudCBpbmNsdWRlcyB6b25lLmpzL2Rpc3Qvem9uZS10ZXN0aW5nLmpzJyxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gRW5zdXJlIHRoYXQgdGhlcmUgaXMgYSBwcm94eSB6b25lIGluc3RhbmNlIHNldCB1cCwgYW5kIGdldFxuICAgIC8vIGEgcmVmZXJlbmNlIHRvIHRoZSBpbnN0YW5jZSBpZiBwcmVzZW50LlxuICAgIGNvbnN0IHpvbmVTcGVjID0gUHJveHlab25lU3BlYy5hc3NlcnRQcmVzZW50KCkgYXMgUGF0Y2hlZFByb3h5Wm9uZTtcblxuICAgIC8vIElmIHRoZXJlIGFscmVhZHkgaXMgYSBkZWxlZ2F0ZSByZWdpc3RlcmVkIGluIHRoZSBwcm94eSB6b25lLCBhbmQgaXRcbiAgICAvLyBpcyB0eXBlIG9mIHRoZSBjdXN0b20gdGFzayBzdGF0ZSBpbnRlcmNlcHRvciwgd2UganVzdCB1c2UgdGhhdCBzdGF0ZVxuICAgIC8vIG9ic2VydmFibGUuIFRoaXMgYWxsb3dzIHVzIHRvIG9ubHkgaW50ZXJjZXB0IFpvbmUgb25jZSBwZXIgdGVzdFxuICAgIC8vIChzaW1pbGFyIHRvIGhvdyBgZmFrZUFzeW5jYCBvciBgYXN5bmNgIHdvcmspLlxuICAgIGlmICh6b25lU3BlY1tzdGF0ZU9ic2VydmFibGVTeW1ib2xdKSB7XG4gICAgICByZXR1cm4gem9uZVNwZWNbc3RhdGVPYnNlcnZhYmxlU3ltYm9sXSE7XG4gICAgfVxuXG4gICAgLy8gU2luY2Ugd2UgaW50ZXJjZXB0IG9uIGVudmlyb25tZW50IGNyZWF0aW9uIGFuZCB0aGUgZml4dHVyZSBoYXMgYmVlblxuICAgIC8vIGNyZWF0ZWQgYmVmb3JlLCB3ZSBtaWdodCBoYXZlIG1pc3NlZCB0YXNrcyBzY2hlZHVsZWQgYmVmb3JlLiBGb3J0dW5hdGVseVxuICAgIC8vIHRoZSBwcm94eSB6b25lIGtlZXBzIHRyYWNrIG9mIHRoZSBwcmV2aW91cyB0YXNrIHN0YXRlLCBzbyB3ZSBjYW4ganVzdCBwYXNzXG4gICAgLy8gdGhpcyBhcyBpbml0aWFsIHN0YXRlIHRvIHRoZSB0YXNrIHpvbmUgaW50ZXJjZXB0b3IuXG4gICAgY29uc3QgaW50ZXJjZXB0b3IgPSBuZXcgVGFza1N0YXRlWm9uZUludGVyY2VwdG9yKHpvbmVTcGVjLmxhc3RUYXNrU3RhdGUpO1xuICAgIGNvbnN0IHpvbmVTcGVjT25IYXNUYXNrID0gem9uZVNwZWMub25IYXNUYXNrLmJpbmQoem9uZVNwZWMpO1xuXG4gICAgLy8gV2Ugc2V0dXAgdGhlIHRhc2sgc3RhdGUgaW50ZXJjZXB0b3IgaW4gdGhlIGBQcm94eVpvbmVgLiBOb3RlIHRoYXQgd2UgY2Fubm90IHJlZ2lzdGVyXG4gICAgLy8gdGhlIGludGVyY2VwdG9yIGFzIGEgbmV3IHByb3h5IHpvbmUgZGVsZWdhdGUgYmVjYXVzZSBpdCB3b3VsZCBtZWFuIHRoYXQgb3RoZXIgem9uZVxuICAgIC8vIGRlbGVnYXRlcyAoZS5nLiBgRmFrZUFzeW5jVGVzdFpvbmVgIG9yIGBBc3luY1Rlc3Rab25lYCkgY2FuIGFjY2lkZW50YWxseSBvdmVyd3JpdGUvZGlzYWJsZVxuICAgIC8vIG91ciBpbnRlcmNlcHRvci4gU2luY2Ugd2UganVzdCBpbnRlbmQgdG8gbW9uaXRvciB0aGUgdGFzayBzdGF0ZSBvZiB0aGUgcHJveHkgem9uZSwgaXQgaXNcbiAgICAvLyBzdWZmaWNpZW50IHRvIGp1c3QgcGF0Y2ggdGhlIHByb3h5IHpvbmUuIFRoaXMgYWxzbyBhdm9pZHMgdGhhdCB3ZSBpbnRlcmZlcmUgd2l0aCB0aGUgdGFza1xuICAgIC8vIHF1ZXVlIHNjaGVkdWxpbmcgbG9naWMuXG4gICAgem9uZVNwZWMub25IYXNUYXNrID0gZnVuY3Rpb24gKC4uLmFyZ3M6IFtab25lRGVsZWdhdGUsIFpvbmUsIFpvbmUsIEhhc1Rhc2tTdGF0ZV0pIHtcbiAgICAgIHpvbmVTcGVjT25IYXNUYXNrKC4uLmFyZ3MpO1xuICAgICAgaW50ZXJjZXB0b3Iub25IYXNUYXNrKC4uLmFyZ3MpO1xuICAgIH07XG5cbiAgICByZXR1cm4gKHpvbmVTcGVjW3N0YXRlT2JzZXJ2YWJsZVN5bWJvbF0gPSBpbnRlcmNlcHRvci5zdGF0ZSk7XG4gIH1cbn1cbiJdfQ==