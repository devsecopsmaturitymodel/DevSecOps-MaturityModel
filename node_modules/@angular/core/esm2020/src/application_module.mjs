/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ApplicationRef } from './application_ref';
import { NgModule } from './metadata';
import * as i0 from "./r3_symbols";
import * as i1 from "./application_ref";
/**
 * Re-exported by `BrowserModule`, which is included automatically in the root
 * `AppModule` when you create a new app with the CLI `new` command. Eagerly injects
 * `ApplicationRef` to instantiate it.
 *
 * @publicApi
 */
export class ApplicationModule {
    // Inject ApplicationRef to make it eager...
    constructor(appRef) { }
}
ApplicationModule.ɵfac = function ApplicationModule_Factory(t) { return new (t || ApplicationModule)(i0.ɵɵinject(i1.ApplicationRef)); };
ApplicationModule.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: ApplicationModule });
ApplicationModule.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({});
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.setClassMetadata(ApplicationModule, [{
        type: NgModule
    }], function () { return [{ type: i1.ApplicationRef }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb25fbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvYXBwbGljYXRpb25fbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sWUFBWSxDQUFDOzs7QUFFcEM7Ozs7OztHQU1HO0FBRUgsTUFBTSxPQUFPLGlCQUFpQjtJQUM1Qiw0Q0FBNEM7SUFDNUMsWUFBWSxNQUFzQixJQUFHLENBQUM7O2tGQUYzQixpQkFBaUI7bUVBQWpCLGlCQUFpQjs7c0ZBQWpCLGlCQUFpQjtjQUQ3QixRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7QXBwbGljYXRpb25SZWZ9IGZyb20gJy4vYXBwbGljYXRpb25fcmVmJztcbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJy4vbWV0YWRhdGEnO1xuXG4vKipcbiAqIFJlLWV4cG9ydGVkIGJ5IGBCcm93c2VyTW9kdWxlYCwgd2hpY2ggaXMgaW5jbHVkZWQgYXV0b21hdGljYWxseSBpbiB0aGUgcm9vdFxuICogYEFwcE1vZHVsZWAgd2hlbiB5b3UgY3JlYXRlIGEgbmV3IGFwcCB3aXRoIHRoZSBDTEkgYG5ld2AgY29tbWFuZC4gRWFnZXJseSBpbmplY3RzXG4gKiBgQXBwbGljYXRpb25SZWZgIHRvIGluc3RhbnRpYXRlIGl0LlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQE5nTW9kdWxlKClcbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvbk1vZHVsZSB7XG4gIC8vIEluamVjdCBBcHBsaWNhdGlvblJlZiB0byBtYWtlIGl0IGVhZ2VyLi4uXG4gIGNvbnN0cnVjdG9yKGFwcFJlZjogQXBwbGljYXRpb25SZWYpIHt9XG59XG4iXX0=