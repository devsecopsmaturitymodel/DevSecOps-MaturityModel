/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Observable } from 'rxjs';
/** Mixin to augment a directive with an initialized property that will emits when ngOnInit ends. */
export function mixinInitialized(base) {
    return class extends base {
        constructor(...args) {
            super(...args);
            /** Whether this directive has been marked as initialized. */
            this._isInitialized = false;
            /**
             * List of subscribers that subscribed before the directive was initialized. Should be notified
             * during _markInitialized. Set to null after pending subscribers are notified, and should
             * not expect to be populated after.
             */
            this._pendingSubscribers = [];
            /**
             * Observable stream that emits when the directive initializes. If already initialized, the
             * subscriber is stored to be notified once _markInitialized is called.
             */
            this.initialized = new Observable(subscriber => {
                // If initialized, immediately notify the subscriber. Otherwise store the subscriber to notify
                // when _markInitialized is called.
                if (this._isInitialized) {
                    this._notifySubscriber(subscriber);
                }
                else {
                    this._pendingSubscribers.push(subscriber);
                }
            });
        }
        /**
         * Marks the state as initialized and notifies pending subscribers. Should be called at the end
         * of ngOnInit.
         * @docs-private
         */
        _markInitialized() {
            if (this._isInitialized && (typeof ngDevMode === 'undefined' || ngDevMode)) {
                throw Error('This directive has already been marked as initialized and ' +
                    'should not be called twice.');
            }
            this._isInitialized = true;
            this._pendingSubscribers.forEach(this._notifySubscriber);
            this._pendingSubscribers = null;
        }
        /** Emits and completes the subscriber stream (should only emit once). */
        _notifySubscriber(subscriber) {
            subscriber.next();
            subscriber.complete();
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdGlhbGl6ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9jb21tb24tYmVoYXZpb3JzL2luaXRpYWxpemVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQWEsTUFBTSxNQUFNLENBQUM7QUF3QjVDLG9HQUFvRztBQUNwRyxNQUFNLFVBQVUsZ0JBQWdCLENBQTRCLElBQU87SUFDakUsT0FBTyxLQUFNLFNBQVEsSUFBSTtRQXlCdkIsWUFBWSxHQUFHLElBQVc7WUFDeEIsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7WUF6QmpCLDZEQUE2RDtZQUM3RCxtQkFBYyxHQUFHLEtBQUssQ0FBQztZQUV2Qjs7OztlQUlHO1lBQ0gsd0JBQW1CLEdBQThCLEVBQUUsQ0FBQztZQUVwRDs7O2VBR0c7WUFDSCxnQkFBVyxHQUFHLElBQUksVUFBVSxDQUFPLFVBQVUsQ0FBQyxFQUFFO2dCQUM5Qyw4RkFBOEY7Z0JBQzlGLG1DQUFtQztnQkFDbkMsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO29CQUN2QixJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUM7aUJBQ3BDO3FCQUFNO29CQUNMLElBQUksQ0FBQyxtQkFBb0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7aUJBQzVDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFJSCxDQUFDO1FBRUQ7Ozs7V0FJRztRQUNILGdCQUFnQjtZQUNkLElBQUksSUFBSSxDQUFDLGNBQWMsSUFBSSxDQUFDLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxTQUFTLENBQUMsRUFBRTtnQkFDMUUsTUFBTSxLQUFLLENBQ1QsNERBQTREO29CQUMxRCw2QkFBNkIsQ0FDaEMsQ0FBQzthQUNIO1lBRUQsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7WUFFM0IsSUFBSSxDQUFDLG1CQUFvQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUMxRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO1FBQ2xDLENBQUM7UUFFRCx5RUFBeUU7UUFDekUsaUJBQWlCLENBQUMsVUFBNEI7WUFDNUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2xCLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN4QixDQUFDO0tBQ0YsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtPYnNlcnZhYmxlLCBTdWJzY3JpYmVyfSBmcm9tICdyeGpzJztcbmltcG9ydCB7Q29uc3RydWN0b3J9IGZyb20gJy4vY29uc3RydWN0b3InO1xuXG4vKipcbiAqIE1peGluIHRoYXQgYWRkcyBhbiBpbml0aWFsaXplZCBwcm9wZXJ0eSB0byBhIGRpcmVjdGl2ZSB3aGljaCwgd2hlbiBzdWJzY3JpYmVkIHRvLCB3aWxsIGVtaXQgYVxuICogdmFsdWUgb25jZSBtYXJrSW5pdGlhbGl6ZWQgaGFzIGJlZW4gY2FsbGVkLCB3aGljaCBzaG91bGQgYmUgZG9uZSBkdXJpbmcgdGhlIG5nT25Jbml0IGZ1bmN0aW9uLlxuICogSWYgdGhlIHN1YnNjcmlwdGlvbiBpcyBtYWRlIGFmdGVyIGl0IGhhcyBhbHJlYWR5IGJlZW4gbWFya2VkIGFzIGluaXRpYWxpemVkLCB0aGVuIGl0IHdpbGwgdHJpZ2dlclxuICogYW4gZW1pdCBpbW1lZGlhdGVseS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBIYXNJbml0aWFsaXplZCB7XG4gIC8qKiBTdHJlYW0gdGhhdCBlbWl0cyBvbmNlIGR1cmluZyB0aGUgZGlyZWN0aXZlL2NvbXBvbmVudCdzIG5nT25Jbml0LiAqL1xuICBpbml0aWFsaXplZDogT2JzZXJ2YWJsZTx2b2lkPjtcblxuICAvKipcbiAgICogU2V0cyB0aGUgc3RhdGUgYXMgaW5pdGlhbGl6ZWQgYW5kIG11c3QgYmUgY2FsbGVkIGR1cmluZyBuZ09uSW5pdCB0byBub3RpZnkgc3Vic2NyaWJlcnMgdGhhdFxuICAgKiB0aGUgZGlyZWN0aXZlIGhhcyBiZWVuIGluaXRpYWxpemVkLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBfbWFya0luaXRpYWxpemVkOiAoKSA9PiB2b2lkO1xufVxuXG50eXBlIEhhc0luaXRpYWxpemVkQ3RvciA9IENvbnN0cnVjdG9yPEhhc0luaXRpYWxpemVkPjtcblxuLyoqIE1peGluIHRvIGF1Z21lbnQgYSBkaXJlY3RpdmUgd2l0aCBhbiBpbml0aWFsaXplZCBwcm9wZXJ0eSB0aGF0IHdpbGwgZW1pdHMgd2hlbiBuZ09uSW5pdCBlbmRzLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1peGluSW5pdGlhbGl6ZWQ8VCBleHRlbmRzIENvbnN0cnVjdG9yPHt9Pj4oYmFzZTogVCk6IEhhc0luaXRpYWxpemVkQ3RvciAmIFQge1xuICByZXR1cm4gY2xhc3MgZXh0ZW5kcyBiYXNlIHtcbiAgICAvKiogV2hldGhlciB0aGlzIGRpcmVjdGl2ZSBoYXMgYmVlbiBtYXJrZWQgYXMgaW5pdGlhbGl6ZWQuICovXG4gICAgX2lzSW5pdGlhbGl6ZWQgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2Ygc3Vic2NyaWJlcnMgdGhhdCBzdWJzY3JpYmVkIGJlZm9yZSB0aGUgZGlyZWN0aXZlIHdhcyBpbml0aWFsaXplZC4gU2hvdWxkIGJlIG5vdGlmaWVkXG4gICAgICogZHVyaW5nIF9tYXJrSW5pdGlhbGl6ZWQuIFNldCB0byBudWxsIGFmdGVyIHBlbmRpbmcgc3Vic2NyaWJlcnMgYXJlIG5vdGlmaWVkLCBhbmQgc2hvdWxkXG4gICAgICogbm90IGV4cGVjdCB0byBiZSBwb3B1bGF0ZWQgYWZ0ZXIuXG4gICAgICovXG4gICAgX3BlbmRpbmdTdWJzY3JpYmVyczogU3Vic2NyaWJlcjx2b2lkPltdIHwgbnVsbCA9IFtdO1xuXG4gICAgLyoqXG4gICAgICogT2JzZXJ2YWJsZSBzdHJlYW0gdGhhdCBlbWl0cyB3aGVuIHRoZSBkaXJlY3RpdmUgaW5pdGlhbGl6ZXMuIElmIGFscmVhZHkgaW5pdGlhbGl6ZWQsIHRoZVxuICAgICAqIHN1YnNjcmliZXIgaXMgc3RvcmVkIHRvIGJlIG5vdGlmaWVkIG9uY2UgX21hcmtJbml0aWFsaXplZCBpcyBjYWxsZWQuXG4gICAgICovXG4gICAgaW5pdGlhbGl6ZWQgPSBuZXcgT2JzZXJ2YWJsZTx2b2lkPihzdWJzY3JpYmVyID0+IHtcbiAgICAgIC8vIElmIGluaXRpYWxpemVkLCBpbW1lZGlhdGVseSBub3RpZnkgdGhlIHN1YnNjcmliZXIuIE90aGVyd2lzZSBzdG9yZSB0aGUgc3Vic2NyaWJlciB0byBub3RpZnlcbiAgICAgIC8vIHdoZW4gX21hcmtJbml0aWFsaXplZCBpcyBjYWxsZWQuXG4gICAgICBpZiAodGhpcy5faXNJbml0aWFsaXplZCkge1xuICAgICAgICB0aGlzLl9ub3RpZnlTdWJzY3JpYmVyKHN1YnNjcmliZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fcGVuZGluZ1N1YnNjcmliZXJzIS5wdXNoKHN1YnNjcmliZXIpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHtcbiAgICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1hcmtzIHRoZSBzdGF0ZSBhcyBpbml0aWFsaXplZCBhbmQgbm90aWZpZXMgcGVuZGluZyBzdWJzY3JpYmVycy4gU2hvdWxkIGJlIGNhbGxlZCBhdCB0aGUgZW5kXG4gICAgICogb2YgbmdPbkluaXQuXG4gICAgICogQGRvY3MtcHJpdmF0ZVxuICAgICAqL1xuICAgIF9tYXJrSW5pdGlhbGl6ZWQoKTogdm9pZCB7XG4gICAgICBpZiAodGhpcy5faXNJbml0aWFsaXplZCAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAnVGhpcyBkaXJlY3RpdmUgaGFzIGFscmVhZHkgYmVlbiBtYXJrZWQgYXMgaW5pdGlhbGl6ZWQgYW5kICcgK1xuICAgICAgICAgICAgJ3Nob3VsZCBub3QgYmUgY2FsbGVkIHR3aWNlLicsXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2lzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuXG4gICAgICB0aGlzLl9wZW5kaW5nU3Vic2NyaWJlcnMhLmZvckVhY2godGhpcy5fbm90aWZ5U3Vic2NyaWJlcik7XG4gICAgICB0aGlzLl9wZW5kaW5nU3Vic2NyaWJlcnMgPSBudWxsO1xuICAgIH1cblxuICAgIC8qKiBFbWl0cyBhbmQgY29tcGxldGVzIHRoZSBzdWJzY3JpYmVyIHN0cmVhbSAoc2hvdWxkIG9ubHkgZW1pdCBvbmNlKS4gKi9cbiAgICBfbm90aWZ5U3Vic2NyaWJlcihzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPHZvaWQ+KTogdm9pZCB7XG4gICAgICBzdWJzY3JpYmVyLm5leHQoKTtcbiAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICB9XG4gIH07XG59XG4iXX0=