/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { assertLessThan } from '../util/assert';
import { ɵɵdefineInjectable } from './interface/defs';
/**
 * Creates a token that can be used in a DI Provider.
 *
 * Use an `InjectionToken` whenever the type you are injecting is not reified (does not have a
 * runtime representation) such as when injecting an interface, callable type, array or
 * parameterized type.
 *
 * `InjectionToken` is parameterized on `T` which is the type of object which will be returned by
 * the `Injector`. This provides an additional level of type safety.
 *
 * ```
 * interface MyInterface {...}
 * const myInterface = injector.get(new InjectionToken<MyInterface>('SomeToken'));
 * // myInterface is inferred to be MyInterface.
 * ```
 *
 * When creating an `InjectionToken`, you can optionally specify a factory function which returns
 * (possibly by creating) a default value of the parameterized type `T`. This sets up the
 * `InjectionToken` using this factory as a provider as if it was defined explicitly in the
 * application's root injector. If the factory function, which takes zero arguments, needs to inject
 * dependencies, it can do so using the `inject` function.
 * As you can see in the Tree-shakable InjectionToken example below.
 *
 * Additionally, if a `factory` is specified you can also specify the `providedIn` option, which
 * overrides the above behavior and marks the token as belonging to a particular `@NgModule`. As
 * mentioned above, `'root'` is the default value for `providedIn`.
 *
 * @usageNotes
 * ### Basic Examples
 *
 * ### Plain InjectionToken
 *
 * {@example core/di/ts/injector_spec.ts region='InjectionToken'}
 *
 * ### Tree-shakable InjectionToken
 *
 * {@example core/di/ts/injector_spec.ts region='ShakableInjectionToken'}
 *
 *
 * @publicApi
 */
export class InjectionToken {
    /**
     * @param _desc   Description for the token,
     *                used only for debugging purposes,
     *                it should but does not need to be unique
     * @param options Options for the token's usage, as described above
     */
    constructor(_desc, options) {
        this._desc = _desc;
        /** @internal */
        this.ngMetadataName = 'InjectionToken';
        this.ɵprov = undefined;
        if (typeof options == 'number') {
            (typeof ngDevMode === 'undefined' || ngDevMode) &&
                assertLessThan(options, 0, 'Only negative numbers are supported here');
            // This is a special hack to assign __NG_ELEMENT_ID__ to this instance.
            // See `InjectorMarkers`
            this.__NG_ELEMENT_ID__ = options;
        }
        else if (options !== undefined) {
            this.ɵprov = ɵɵdefineInjectable({
                token: this,
                providedIn: options.providedIn || 'root',
                factory: options.factory,
            });
        }
    }
    toString() {
        return `InjectionToken ${this._desc}`;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5qZWN0aW9uX3Rva2VuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvZGkvaW5qZWN0aW9uX3Rva2VuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUdILE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUU5QyxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUVwRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdDRztBQUNILE1BQU0sT0FBTyxjQUFjO0lBTXpCOzs7OztPQUtHO0lBQ0gsWUFBc0IsS0FBYSxFQUFFLE9BRXBDO1FBRnFCLFVBQUssR0FBTCxLQUFLLENBQVE7UUFYbkMsZ0JBQWdCO1FBQ1AsbUJBQWMsR0FBRyxnQkFBZ0IsQ0FBQztRQWF6QyxJQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztRQUN2QixJQUFJLE9BQU8sT0FBTyxJQUFJLFFBQVEsRUFBRTtZQUM5QixDQUFDLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxTQUFTLENBQUM7Z0JBQzNDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLDBDQUEwQyxDQUFDLENBQUM7WUFDM0UsdUVBQXVFO1lBQ3ZFLHdCQUF3QjtZQUN2QixJQUFZLENBQUMsaUJBQWlCLEdBQUcsT0FBTyxDQUFDO1NBQzNDO2FBQU0sSUFBSSxPQUFPLEtBQUssU0FBUyxFQUFFO1lBQ2hDLElBQUksQ0FBQyxLQUFLLEdBQUcsa0JBQWtCLENBQUM7Z0JBQzlCLEtBQUssRUFBRSxJQUFJO2dCQUNYLFVBQVUsRUFBRSxPQUFPLENBQUMsVUFBVSxJQUFJLE1BQU07Z0JBQ3hDLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTzthQUN6QixDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7SUFFRCxRQUFRO1FBQ04sT0FBTyxrQkFBa0IsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3hDLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1R5cGV9IGZyb20gJy4uL2ludGVyZmFjZS90eXBlJztcbmltcG9ydCB7YXNzZXJ0TGVzc1RoYW59IGZyb20gJy4uL3V0aWwvYXNzZXJ0JztcblxuaW1wb3J0IHvJtcm1ZGVmaW5lSW5qZWN0YWJsZX0gZnJvbSAnLi9pbnRlcmZhY2UvZGVmcyc7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgaW4gYSBESSBQcm92aWRlci5cbiAqXG4gKiBVc2UgYW4gYEluamVjdGlvblRva2VuYCB3aGVuZXZlciB0aGUgdHlwZSB5b3UgYXJlIGluamVjdGluZyBpcyBub3QgcmVpZmllZCAoZG9lcyBub3QgaGF2ZSBhXG4gKiBydW50aW1lIHJlcHJlc2VudGF0aW9uKSBzdWNoIGFzIHdoZW4gaW5qZWN0aW5nIGFuIGludGVyZmFjZSwgY2FsbGFibGUgdHlwZSwgYXJyYXkgb3JcbiAqIHBhcmFtZXRlcml6ZWQgdHlwZS5cbiAqXG4gKiBgSW5qZWN0aW9uVG9rZW5gIGlzIHBhcmFtZXRlcml6ZWQgb24gYFRgIHdoaWNoIGlzIHRoZSB0eXBlIG9mIG9iamVjdCB3aGljaCB3aWxsIGJlIHJldHVybmVkIGJ5XG4gKiB0aGUgYEluamVjdG9yYC4gVGhpcyBwcm92aWRlcyBhbiBhZGRpdGlvbmFsIGxldmVsIG9mIHR5cGUgc2FmZXR5LlxuICpcbiAqIGBgYFxuICogaW50ZXJmYWNlIE15SW50ZXJmYWNlIHsuLi59XG4gKiBjb25zdCBteUludGVyZmFjZSA9IGluamVjdG9yLmdldChuZXcgSW5qZWN0aW9uVG9rZW48TXlJbnRlcmZhY2U+KCdTb21lVG9rZW4nKSk7XG4gKiAvLyBteUludGVyZmFjZSBpcyBpbmZlcnJlZCB0byBiZSBNeUludGVyZmFjZS5cbiAqIGBgYFxuICpcbiAqIFdoZW4gY3JlYXRpbmcgYW4gYEluamVjdGlvblRva2VuYCwgeW91IGNhbiBvcHRpb25hbGx5IHNwZWNpZnkgYSBmYWN0b3J5IGZ1bmN0aW9uIHdoaWNoIHJldHVybnNcbiAqIChwb3NzaWJseSBieSBjcmVhdGluZykgYSBkZWZhdWx0IHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXJpemVkIHR5cGUgYFRgLiBUaGlzIHNldHMgdXAgdGhlXG4gKiBgSW5qZWN0aW9uVG9rZW5gIHVzaW5nIHRoaXMgZmFjdG9yeSBhcyBhIHByb3ZpZGVyIGFzIGlmIGl0IHdhcyBkZWZpbmVkIGV4cGxpY2l0bHkgaW4gdGhlXG4gKiBhcHBsaWNhdGlvbidzIHJvb3QgaW5qZWN0b3IuIElmIHRoZSBmYWN0b3J5IGZ1bmN0aW9uLCB3aGljaCB0YWtlcyB6ZXJvIGFyZ3VtZW50cywgbmVlZHMgdG8gaW5qZWN0XG4gKiBkZXBlbmRlbmNpZXMsIGl0IGNhbiBkbyBzbyB1c2luZyB0aGUgYGluamVjdGAgZnVuY3Rpb24uXG4gKiBBcyB5b3UgY2FuIHNlZSBpbiB0aGUgVHJlZS1zaGFrYWJsZSBJbmplY3Rpb25Ub2tlbiBleGFtcGxlIGJlbG93LlxuICpcbiAqIEFkZGl0aW9uYWxseSwgaWYgYSBgZmFjdG9yeWAgaXMgc3BlY2lmaWVkIHlvdSBjYW4gYWxzbyBzcGVjaWZ5IHRoZSBgcHJvdmlkZWRJbmAgb3B0aW9uLCB3aGljaFxuICogb3ZlcnJpZGVzIHRoZSBhYm92ZSBiZWhhdmlvciBhbmQgbWFya3MgdGhlIHRva2VuIGFzIGJlbG9uZ2luZyB0byBhIHBhcnRpY3VsYXIgYEBOZ01vZHVsZWAuIEFzXG4gKiBtZW50aW9uZWQgYWJvdmUsIGAncm9vdCdgIGlzIHRoZSBkZWZhdWx0IHZhbHVlIGZvciBgcHJvdmlkZWRJbmAuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqICMjIyBCYXNpYyBFeGFtcGxlc1xuICpcbiAqICMjIyBQbGFpbiBJbmplY3Rpb25Ub2tlblxuICpcbiAqIHtAZXhhbXBsZSBjb3JlL2RpL3RzL2luamVjdG9yX3NwZWMudHMgcmVnaW9uPSdJbmplY3Rpb25Ub2tlbid9XG4gKlxuICogIyMjIFRyZWUtc2hha2FibGUgSW5qZWN0aW9uVG9rZW5cbiAqXG4gKiB7QGV4YW1wbGUgY29yZS9kaS90cy9pbmplY3Rvcl9zcGVjLnRzIHJlZ2lvbj0nU2hha2FibGVJbmplY3Rpb25Ub2tlbid9XG4gKlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNsYXNzIEluamVjdGlvblRva2VuPFQ+IHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICByZWFkb25seSBuZ01ldGFkYXRhTmFtZSA9ICdJbmplY3Rpb25Ub2tlbic7XG5cbiAgcmVhZG9ubHkgybVwcm92OiB1bmtub3duO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0gX2Rlc2MgICBEZXNjcmlwdGlvbiBmb3IgdGhlIHRva2VuLFxuICAgKiAgICAgICAgICAgICAgICB1c2VkIG9ubHkgZm9yIGRlYnVnZ2luZyBwdXJwb3NlcyxcbiAgICogICAgICAgICAgICAgICAgaXQgc2hvdWxkIGJ1dCBkb2VzIG5vdCBuZWVkIHRvIGJlIHVuaXF1ZVxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciB0aGUgdG9rZW4ncyB1c2FnZSwgYXMgZGVzY3JpYmVkIGFib3ZlXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgX2Rlc2M6IHN0cmluZywgb3B0aW9ucz86IHtcbiAgICBwcm92aWRlZEluPzogVHlwZTxhbnk+fCdyb290J3wncGxhdGZvcm0nfCdhbnknfG51bGwsIGZhY3Rvcnk6ICgpID0+IFRcbiAgfSkge1xuICAgIHRoaXMuybVwcm92ID0gdW5kZWZpbmVkO1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PSAnbnVtYmVyJykge1xuICAgICAgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkgJiZcbiAgICAgICAgICBhc3NlcnRMZXNzVGhhbihvcHRpb25zLCAwLCAnT25seSBuZWdhdGl2ZSBudW1iZXJzIGFyZSBzdXBwb3J0ZWQgaGVyZScpO1xuICAgICAgLy8gVGhpcyBpcyBhIHNwZWNpYWwgaGFjayB0byBhc3NpZ24gX19OR19FTEVNRU5UX0lEX18gdG8gdGhpcyBpbnN0YW5jZS5cbiAgICAgIC8vIFNlZSBgSW5qZWN0b3JNYXJrZXJzYFxuICAgICAgKHRoaXMgYXMgYW55KS5fX05HX0VMRU1FTlRfSURfXyA9IG9wdGlvbnM7XG4gICAgfSBlbHNlIGlmIChvcHRpb25zICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuybVwcm92ID0gybXJtWRlZmluZUluamVjdGFibGUoe1xuICAgICAgICB0b2tlbjogdGhpcyxcbiAgICAgICAgcHJvdmlkZWRJbjogb3B0aW9ucy5wcm92aWRlZEluIHx8ICdyb290JyxcbiAgICAgICAgZmFjdG9yeTogb3B0aW9ucy5mYWN0b3J5LFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYEluamVjdGlvblRva2VuICR7dGhpcy5fZGVzY31gO1xuICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSW5qZWN0YWJsZURlZlRva2VuPFQ+IGV4dGVuZHMgSW5qZWN0aW9uVG9rZW48VD4ge1xuICDJtXByb3Y6IHVua25vd247XG59XG4iXX0=