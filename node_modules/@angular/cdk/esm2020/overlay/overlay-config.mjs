/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NoopScrollStrategy } from './scroll/index';
/** Initial configuration used when creating an overlay. */
export class OverlayConfig {
    constructor(config) {
        /** Strategy to be used when handling scroll events while the overlay is open. */
        this.scrollStrategy = new NoopScrollStrategy();
        /** Custom class to add to the overlay pane. */
        this.panelClass = '';
        /** Whether the overlay has a backdrop. */
        this.hasBackdrop = false;
        /** Custom class to add to the backdrop */
        this.backdropClass = 'cdk-overlay-dark-backdrop';
        /**
         * Whether the overlay should be disposed of when the user goes backwards/forwards in history.
         * Note that this usually doesn't include clicking on links (unless the user is using
         * the `HashLocationStrategy`).
         */
        this.disposeOnNavigation = false;
        if (config) {
            // Use `Iterable` instead of `Array` because TypeScript, as of 3.6.3,
            // loses the array generic type in the `for of`. But we *also* have to use `Array` because
            // typescript won't iterate over an `Iterable` unless you compile with `--downlevelIteration`
            const configKeys = Object.keys(config);
            for (const key of configKeys) {
                if (config[key] !== undefined) {
                    // TypeScript, as of version 3.5, sees the left-hand-side of this expression
                    // as "I don't know *which* key this is, so the only valid value is the intersection
                    // of all the posible values." In this case, that happens to be `undefined`. TypeScript
                    // is not smart enough to see that the right-hand-side is actually an access of the same
                    // exact type with the same exact key, meaning that the value type must be identical.
                    // So we use `any` to work around this.
                    this[key] = config[key];
                }
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3ZlcmxheS1jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL292ZXJsYXkvb3ZlcmxheS1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBSUgsT0FBTyxFQUFpQixrQkFBa0IsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRWxFLDJEQUEyRDtBQUMzRCxNQUFNLE9BQU8sYUFBYTtJQStDeEIsWUFBWSxNQUFzQjtRQTNDbEMsaUZBQWlGO1FBQ2pGLG1CQUFjLEdBQW9CLElBQUksa0JBQWtCLEVBQUUsQ0FBQztRQUUzRCwrQ0FBK0M7UUFDL0MsZUFBVSxHQUF1QixFQUFFLENBQUM7UUFFcEMsMENBQTBDO1FBQzFDLGdCQUFXLEdBQWEsS0FBSyxDQUFDO1FBRTlCLDBDQUEwQztRQUMxQyxrQkFBYSxHQUF1QiwyQkFBMkIsQ0FBQztRQTBCaEU7Ozs7V0FJRztRQUNILHdCQUFtQixHQUFhLEtBQUssQ0FBQztRQUdwQyxJQUFJLE1BQU0sRUFBRTtZQUNWLHFFQUFxRTtZQUNyRSwwRkFBMEY7WUFDMUYsNkZBQTZGO1lBQzdGLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUNaLENBQUM7WUFDMUIsS0FBSyxNQUFNLEdBQUcsSUFBSSxVQUFVLEVBQUU7Z0JBQzVCLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFNBQVMsRUFBRTtvQkFDN0IsNEVBQTRFO29CQUM1RSxvRkFBb0Y7b0JBQ3BGLHVGQUF1RjtvQkFDdkYsd0ZBQXdGO29CQUN4RixxRkFBcUY7b0JBQ3JGLHVDQUF1QztvQkFDdkMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQVEsQ0FBQztpQkFDaEM7YUFDRjtTQUNGO0lBQ0gsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7UG9zaXRpb25TdHJhdGVneX0gZnJvbSAnLi9wb3NpdGlvbi9wb3NpdGlvbi1zdHJhdGVneSc7XG5pbXBvcnQge0RpcmVjdGlvbiwgRGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7U2Nyb2xsU3RyYXRlZ3ksIE5vb3BTY3JvbGxTdHJhdGVneX0gZnJvbSAnLi9zY3JvbGwvaW5kZXgnO1xuXG4vKiogSW5pdGlhbCBjb25maWd1cmF0aW9uIHVzZWQgd2hlbiBjcmVhdGluZyBhbiBvdmVybGF5LiAqL1xuZXhwb3J0IGNsYXNzIE92ZXJsYXlDb25maWcge1xuICAvKiogU3RyYXRlZ3kgd2l0aCB3aGljaCB0byBwb3NpdGlvbiB0aGUgb3ZlcmxheS4gKi9cbiAgcG9zaXRpb25TdHJhdGVneT86IFBvc2l0aW9uU3RyYXRlZ3k7XG5cbiAgLyoqIFN0cmF0ZWd5IHRvIGJlIHVzZWQgd2hlbiBoYW5kbGluZyBzY3JvbGwgZXZlbnRzIHdoaWxlIHRoZSBvdmVybGF5IGlzIG9wZW4uICovXG4gIHNjcm9sbFN0cmF0ZWd5PzogU2Nyb2xsU3RyYXRlZ3kgPSBuZXcgTm9vcFNjcm9sbFN0cmF0ZWd5KCk7XG5cbiAgLyoqIEN1c3RvbSBjbGFzcyB0byBhZGQgdG8gdGhlIG92ZXJsYXkgcGFuZS4gKi9cbiAgcGFuZWxDbGFzcz86IHN0cmluZyB8IHN0cmluZ1tdID0gJyc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG92ZXJsYXkgaGFzIGEgYmFja2Ryb3AuICovXG4gIGhhc0JhY2tkcm9wPzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBDdXN0b20gY2xhc3MgdG8gYWRkIHRvIHRoZSBiYWNrZHJvcCAqL1xuICBiYWNrZHJvcENsYXNzPzogc3RyaW5nIHwgc3RyaW5nW10gPSAnY2RrLW92ZXJsYXktZGFyay1iYWNrZHJvcCc7XG5cbiAgLyoqIFRoZSB3aWR0aCBvZiB0aGUgb3ZlcmxheSBwYW5lbC4gSWYgYSBudW1iZXIgaXMgcHJvdmlkZWQsIHBpeGVsIHVuaXRzIGFyZSBhc3N1bWVkLiAqL1xuICB3aWR0aD86IG51bWJlciB8IHN0cmluZztcblxuICAvKiogVGhlIGhlaWdodCBvZiB0aGUgb3ZlcmxheSBwYW5lbC4gSWYgYSBudW1iZXIgaXMgcHJvdmlkZWQsIHBpeGVsIHVuaXRzIGFyZSBhc3N1bWVkLiAqL1xuICBoZWlnaHQ/OiBudW1iZXIgfCBzdHJpbmc7XG5cbiAgLyoqIFRoZSBtaW4td2lkdGggb2YgdGhlIG92ZXJsYXkgcGFuZWwuIElmIGEgbnVtYmVyIGlzIHByb3ZpZGVkLCBwaXhlbCB1bml0cyBhcmUgYXNzdW1lZC4gKi9cbiAgbWluV2lkdGg/OiBudW1iZXIgfCBzdHJpbmc7XG5cbiAgLyoqIFRoZSBtaW4taGVpZ2h0IG9mIHRoZSBvdmVybGF5IHBhbmVsLiBJZiBhIG51bWJlciBpcyBwcm92aWRlZCwgcGl4ZWwgdW5pdHMgYXJlIGFzc3VtZWQuICovXG4gIG1pbkhlaWdodD86IG51bWJlciB8IHN0cmluZztcblxuICAvKiogVGhlIG1heC13aWR0aCBvZiB0aGUgb3ZlcmxheSBwYW5lbC4gSWYgYSBudW1iZXIgaXMgcHJvdmlkZWQsIHBpeGVsIHVuaXRzIGFyZSBhc3N1bWVkLiAqL1xuICBtYXhXaWR0aD86IG51bWJlciB8IHN0cmluZztcblxuICAvKiogVGhlIG1heC1oZWlnaHQgb2YgdGhlIG92ZXJsYXkgcGFuZWwuIElmIGEgbnVtYmVyIGlzIHByb3ZpZGVkLCBwaXhlbCB1bml0cyBhcmUgYXNzdW1lZC4gKi9cbiAgbWF4SGVpZ2h0PzogbnVtYmVyIHwgc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBEaXJlY3Rpb24gb2YgdGhlIHRleHQgaW4gdGhlIG92ZXJsYXkgcGFuZWwuIElmIGEgYERpcmVjdGlvbmFsaXR5YCBpbnN0YW5jZVxuICAgKiBpcyBwYXNzZWQgaW4sIHRoZSBvdmVybGF5IHdpbGwgaGFuZGxlIGNoYW5nZXMgdG8gaXRzIHZhbHVlIGF1dG9tYXRpY2FsbHkuXG4gICAqL1xuICBkaXJlY3Rpb24/OiBEaXJlY3Rpb24gfCBEaXJlY3Rpb25hbGl0eTtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgb3ZlcmxheSBzaG91bGQgYmUgZGlzcG9zZWQgb2Ygd2hlbiB0aGUgdXNlciBnb2VzIGJhY2t3YXJkcy9mb3J3YXJkcyBpbiBoaXN0b3J5LlxuICAgKiBOb3RlIHRoYXQgdGhpcyB1c3VhbGx5IGRvZXNuJ3QgaW5jbHVkZSBjbGlja2luZyBvbiBsaW5rcyAodW5sZXNzIHRoZSB1c2VyIGlzIHVzaW5nXG4gICAqIHRoZSBgSGFzaExvY2F0aW9uU3RyYXRlZ3lgKS5cbiAgICovXG4gIGRpc3Bvc2VPbk5hdmlnYXRpb24/OiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnPzogT3ZlcmxheUNvbmZpZykge1xuICAgIGlmIChjb25maWcpIHtcbiAgICAgIC8vIFVzZSBgSXRlcmFibGVgIGluc3RlYWQgb2YgYEFycmF5YCBiZWNhdXNlIFR5cGVTY3JpcHQsIGFzIG9mIDMuNi4zLFxuICAgICAgLy8gbG9zZXMgdGhlIGFycmF5IGdlbmVyaWMgdHlwZSBpbiB0aGUgYGZvciBvZmAuIEJ1dCB3ZSAqYWxzbyogaGF2ZSB0byB1c2UgYEFycmF5YCBiZWNhdXNlXG4gICAgICAvLyB0eXBlc2NyaXB0IHdvbid0IGl0ZXJhdGUgb3ZlciBhbiBgSXRlcmFibGVgIHVubGVzcyB5b3UgY29tcGlsZSB3aXRoIGAtLWRvd25sZXZlbEl0ZXJhdGlvbmBcbiAgICAgIGNvbnN0IGNvbmZpZ0tleXMgPSBPYmplY3Qua2V5cyhjb25maWcpIGFzIEl0ZXJhYmxlPGtleW9mIE92ZXJsYXlDb25maWc+ICZcbiAgICAgICAgKGtleW9mIE92ZXJsYXlDb25maWcpW107XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBjb25maWdLZXlzKSB7XG4gICAgICAgIGlmIChjb25maWdba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgLy8gVHlwZVNjcmlwdCwgYXMgb2YgdmVyc2lvbiAzLjUsIHNlZXMgdGhlIGxlZnQtaGFuZC1zaWRlIG9mIHRoaXMgZXhwcmVzc2lvblxuICAgICAgICAgIC8vIGFzIFwiSSBkb24ndCBrbm93ICp3aGljaCoga2V5IHRoaXMgaXMsIHNvIHRoZSBvbmx5IHZhbGlkIHZhbHVlIGlzIHRoZSBpbnRlcnNlY3Rpb25cbiAgICAgICAgICAvLyBvZiBhbGwgdGhlIHBvc2libGUgdmFsdWVzLlwiIEluIHRoaXMgY2FzZSwgdGhhdCBoYXBwZW5zIHRvIGJlIGB1bmRlZmluZWRgLiBUeXBlU2NyaXB0XG4gICAgICAgICAgLy8gaXMgbm90IHNtYXJ0IGVub3VnaCB0byBzZWUgdGhhdCB0aGUgcmlnaHQtaGFuZC1zaWRlIGlzIGFjdHVhbGx5IGFuIGFjY2VzcyBvZiB0aGUgc2FtZVxuICAgICAgICAgIC8vIGV4YWN0IHR5cGUgd2l0aCB0aGUgc2FtZSBleGFjdCBrZXksIG1lYW5pbmcgdGhhdCB0aGUgdmFsdWUgdHlwZSBtdXN0IGJlIGlkZW50aWNhbC5cbiAgICAgICAgICAvLyBTbyB3ZSB1c2UgYGFueWAgdG8gd29yayBhcm91bmQgdGhpcy5cbiAgICAgICAgICB0aGlzW2tleV0gPSBjb25maWdba2V5XSBhcyBhbnk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==