/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Inject, Injectable, Optional } from '@angular/core';
import { APP_BASE_HREF, LocationStrategy } from './location_strategy';
import { PlatformLocation } from './platform_location';
import { joinWithSlash, normalizeQueryParams } from './util';
import * as i0 from "@angular/core";
import * as i1 from "./platform_location";
/**
 * @description
 * A {@link LocationStrategy} used to configure the {@link Location} service to
 * represent its state in the
 * [hash fragment](https://en.wikipedia.org/wiki/Uniform_Resource_Locator#Syntax)
 * of the browser's URL.
 *
 * For instance, if you call `location.go('/foo')`, the browser's URL will become
 * `example.com#/foo`.
 *
 * @usageNotes
 *
 * ### Example
 *
 * {@example common/location/ts/hash_location_component.ts region='LocationComponent'}
 *
 * @publicApi
 */
export class HashLocationStrategy extends LocationStrategy {
    constructor(_platformLocation, _baseHref) {
        super();
        this._platformLocation = _platformLocation;
        this._baseHref = '';
        this._removeListenerFns = [];
        if (_baseHref != null) {
            this._baseHref = _baseHref;
        }
    }
    /** @nodoc */
    ngOnDestroy() {
        while (this._removeListenerFns.length) {
            this._removeListenerFns.pop()();
        }
    }
    onPopState(fn) {
        this._removeListenerFns.push(this._platformLocation.onPopState(fn), this._platformLocation.onHashChange(fn));
    }
    getBaseHref() {
        return this._baseHref;
    }
    path(includeHash = false) {
        // the hash value is always prefixed with a `#`
        // and if it is empty then it will stay empty
        let path = this._platformLocation.hash;
        if (path == null)
            path = '#';
        return path.length > 0 ? path.substring(1) : path;
    }
    prepareExternalUrl(internal) {
        const url = joinWithSlash(this._baseHref, internal);
        return url.length > 0 ? ('#' + url) : url;
    }
    pushState(state, title, path, queryParams) {
        let url = this.prepareExternalUrl(path + normalizeQueryParams(queryParams));
        if (url.length == 0) {
            url = this._platformLocation.pathname;
        }
        this._platformLocation.pushState(state, title, url);
    }
    replaceState(state, title, path, queryParams) {
        let url = this.prepareExternalUrl(path + normalizeQueryParams(queryParams));
        if (url.length == 0) {
            url = this._platformLocation.pathname;
        }
        this._platformLocation.replaceState(state, title, url);
    }
    forward() {
        this._platformLocation.forward();
    }
    back() {
        this._platformLocation.back();
    }
    historyGo(relativePosition = 0) {
        this._platformLocation.historyGo?.(relativePosition);
    }
}
HashLocationStrategy.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: HashLocationStrategy, deps: [{ token: i1.PlatformLocation }, { token: APP_BASE_HREF, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
HashLocationStrategy.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: HashLocationStrategy });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: HashLocationStrategy, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.PlatformLocation }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [APP_BASE_HREF]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFzaF9sb2NhdGlvbl9zdHJhdGVneS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbW1vbi9zcmMvbG9jYXRpb24vaGFzaF9sb2NhdGlvbl9zdHJhdGVneS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUFFLFVBQVUsRUFBYSxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFdEUsT0FBTyxFQUFDLGFBQWEsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3BFLE9BQU8sRUFBeUIsZ0JBQWdCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUM3RSxPQUFPLEVBQUMsYUFBYSxFQUFFLG9CQUFvQixFQUFDLE1BQU0sUUFBUSxDQUFDOzs7QUFJM0Q7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHO0FBRUgsTUFBTSxPQUFPLG9CQUFxQixTQUFRLGdCQUFnQjtJQUl4RCxZQUNZLGlCQUFtQyxFQUNSLFNBQWtCO1FBQ3ZELEtBQUssRUFBRSxDQUFDO1FBRkUsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQUp2QyxjQUFTLEdBQVcsRUFBRSxDQUFDO1FBQ3ZCLHVCQUFrQixHQUFtQixFQUFFLENBQUM7UUFNOUMsSUFBSSxTQUFTLElBQUksSUFBSSxFQUFFO1lBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1NBQzVCO0lBQ0gsQ0FBQztJQUVELGFBQWE7SUFDYixXQUFXO1FBQ1QsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFO1lBQ3JDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLEVBQUcsRUFBRSxDQUFDO1NBQ2xDO0lBQ0gsQ0FBQztJQUVRLFVBQVUsQ0FBQyxFQUEwQjtRQUM1QyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUN4QixJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN0RixDQUFDO0lBRVEsV0FBVztRQUNsQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDeEIsQ0FBQztJQUVRLElBQUksQ0FBQyxjQUF1QixLQUFLO1FBQ3hDLCtDQUErQztRQUMvQyw2Q0FBNkM7UUFDN0MsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQztRQUN2QyxJQUFJLElBQUksSUFBSSxJQUFJO1lBQUUsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUU3QixPQUFPLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDcEQsQ0FBQztJQUVRLGtCQUFrQixDQUFDLFFBQWdCO1FBQzFDLE1BQU0sR0FBRyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3BELE9BQU8sR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDNUMsQ0FBQztJQUVRLFNBQVMsQ0FBQyxLQUFVLEVBQUUsS0FBYSxFQUFFLElBQVksRUFBRSxXQUFtQjtRQUM3RSxJQUFJLEdBQUcsR0FBZ0IsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksR0FBRyxvQkFBb0IsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQ3pGLElBQUksR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7WUFDbkIsR0FBRyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUM7U0FDdkM7UUFDRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVRLFlBQVksQ0FBQyxLQUFVLEVBQUUsS0FBYSxFQUFFLElBQVksRUFBRSxXQUFtQjtRQUNoRixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxHQUFHLG9CQUFvQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDNUUsSUFBSSxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtZQUNuQixHQUFHLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQztTQUN2QztRQUNELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRVEsT0FBTztRQUNkLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNuQyxDQUFDO0lBRVEsSUFBSTtRQUNYLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBRVEsU0FBUyxDQUFDLG1CQUEyQixDQUFDO1FBQzdDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7OzRIQXJFVSxvQkFBb0Isa0RBTVAsYUFBYTtnSUFOMUIsb0JBQW9CO3NHQUFwQixvQkFBb0I7a0JBRGhDLFVBQVU7OzBCQU9KLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMsYUFBYSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdCwgSW5qZWN0YWJsZSwgT25EZXN0cm95LCBPcHRpb25hbH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7QVBQX0JBU0VfSFJFRiwgTG9jYXRpb25TdHJhdGVneX0gZnJvbSAnLi9sb2NhdGlvbl9zdHJhdGVneSc7XG5pbXBvcnQge0xvY2F0aW9uQ2hhbmdlTGlzdGVuZXIsIFBsYXRmb3JtTG9jYXRpb259IGZyb20gJy4vcGxhdGZvcm1fbG9jYXRpb24nO1xuaW1wb3J0IHtqb2luV2l0aFNsYXNoLCBub3JtYWxpemVRdWVyeVBhcmFtc30gZnJvbSAnLi91dGlsJztcblxuXG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBBIHtAbGluayBMb2NhdGlvblN0cmF0ZWd5fSB1c2VkIHRvIGNvbmZpZ3VyZSB0aGUge0BsaW5rIExvY2F0aW9ufSBzZXJ2aWNlIHRvXG4gKiByZXByZXNlbnQgaXRzIHN0YXRlIGluIHRoZVxuICogW2hhc2ggZnJhZ21lbnRdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1VuaWZvcm1fUmVzb3VyY2VfTG9jYXRvciNTeW50YXgpXG4gKiBvZiB0aGUgYnJvd3NlcidzIFVSTC5cbiAqXG4gKiBGb3IgaW5zdGFuY2UsIGlmIHlvdSBjYWxsIGBsb2NhdGlvbi5nbygnL2ZvbycpYCwgdGhlIGJyb3dzZXIncyBVUkwgd2lsbCBiZWNvbWVcbiAqIGBleGFtcGxlLmNvbSMvZm9vYC5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBFeGFtcGxlXG4gKlxuICoge0BleGFtcGxlIGNvbW1vbi9sb2NhdGlvbi90cy9oYXNoX2xvY2F0aW9uX2NvbXBvbmVudC50cyByZWdpb249J0xvY2F0aW9uQ29tcG9uZW50J31cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBIYXNoTG9jYXRpb25TdHJhdGVneSBleHRlbmRzIExvY2F0aW9uU3RyYXRlZ3kgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9iYXNlSHJlZjogc3RyaW5nID0gJyc7XG4gIHByaXZhdGUgX3JlbW92ZUxpc3RlbmVyRm5zOiAoKCkgPT4gdm9pZClbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfcGxhdGZvcm1Mb2NhdGlvbjogUGxhdGZvcm1Mb2NhdGlvbixcbiAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQVBQX0JBU0VfSFJFRikgX2Jhc2VIcmVmPzogc3RyaW5nKSB7XG4gICAgc3VwZXIoKTtcbiAgICBpZiAoX2Jhc2VIcmVmICE9IG51bGwpIHtcbiAgICAgIHRoaXMuX2Jhc2VIcmVmID0gX2Jhc2VIcmVmO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAbm9kb2MgKi9cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgd2hpbGUgKHRoaXMuX3JlbW92ZUxpc3RlbmVyRm5zLmxlbmd0aCkge1xuICAgICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXJGbnMucG9wKCkhKCk7XG4gICAgfVxuICB9XG5cbiAgb3ZlcnJpZGUgb25Qb3BTdGF0ZShmbjogTG9jYXRpb25DaGFuZ2VMaXN0ZW5lcik6IHZvaWQge1xuICAgIHRoaXMuX3JlbW92ZUxpc3RlbmVyRm5zLnB1c2goXG4gICAgICAgIHRoaXMuX3BsYXRmb3JtTG9jYXRpb24ub25Qb3BTdGF0ZShmbiksIHRoaXMuX3BsYXRmb3JtTG9jYXRpb24ub25IYXNoQ2hhbmdlKGZuKSk7XG4gIH1cblxuICBvdmVycmlkZSBnZXRCYXNlSHJlZigpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9iYXNlSHJlZjtcbiAgfVxuXG4gIG92ZXJyaWRlIHBhdGgoaW5jbHVkZUhhc2g6IGJvb2xlYW4gPSBmYWxzZSk6IHN0cmluZyB7XG4gICAgLy8gdGhlIGhhc2ggdmFsdWUgaXMgYWx3YXlzIHByZWZpeGVkIHdpdGggYSBgI2BcbiAgICAvLyBhbmQgaWYgaXQgaXMgZW1wdHkgdGhlbiBpdCB3aWxsIHN0YXkgZW1wdHlcbiAgICBsZXQgcGF0aCA9IHRoaXMuX3BsYXRmb3JtTG9jYXRpb24uaGFzaDtcbiAgICBpZiAocGF0aCA9PSBudWxsKSBwYXRoID0gJyMnO1xuXG4gICAgcmV0dXJuIHBhdGgubGVuZ3RoID4gMCA/IHBhdGguc3Vic3RyaW5nKDEpIDogcGF0aDtcbiAgfVxuXG4gIG92ZXJyaWRlIHByZXBhcmVFeHRlcm5hbFVybChpbnRlcm5hbDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCB1cmwgPSBqb2luV2l0aFNsYXNoKHRoaXMuX2Jhc2VIcmVmLCBpbnRlcm5hbCk7XG4gICAgcmV0dXJuIHVybC5sZW5ndGggPiAwID8gKCcjJyArIHVybCkgOiB1cmw7XG4gIH1cblxuICBvdmVycmlkZSBwdXNoU3RhdGUoc3RhdGU6IGFueSwgdGl0bGU6IHN0cmluZywgcGF0aDogc3RyaW5nLCBxdWVyeVBhcmFtczogc3RyaW5nKSB7XG4gICAgbGV0IHVybDogc3RyaW5nfG51bGwgPSB0aGlzLnByZXBhcmVFeHRlcm5hbFVybChwYXRoICsgbm9ybWFsaXplUXVlcnlQYXJhbXMocXVlcnlQYXJhbXMpKTtcbiAgICBpZiAodXJsLmxlbmd0aCA9PSAwKSB7XG4gICAgICB1cmwgPSB0aGlzLl9wbGF0Zm9ybUxvY2F0aW9uLnBhdGhuYW1lO1xuICAgIH1cbiAgICB0aGlzLl9wbGF0Zm9ybUxvY2F0aW9uLnB1c2hTdGF0ZShzdGF0ZSwgdGl0bGUsIHVybCk7XG4gIH1cblxuICBvdmVycmlkZSByZXBsYWNlU3RhdGUoc3RhdGU6IGFueSwgdGl0bGU6IHN0cmluZywgcGF0aDogc3RyaW5nLCBxdWVyeVBhcmFtczogc3RyaW5nKSB7XG4gICAgbGV0IHVybCA9IHRoaXMucHJlcGFyZUV4dGVybmFsVXJsKHBhdGggKyBub3JtYWxpemVRdWVyeVBhcmFtcyhxdWVyeVBhcmFtcykpO1xuICAgIGlmICh1cmwubGVuZ3RoID09IDApIHtcbiAgICAgIHVybCA9IHRoaXMuX3BsYXRmb3JtTG9jYXRpb24ucGF0aG5hbWU7XG4gICAgfVxuICAgIHRoaXMuX3BsYXRmb3JtTG9jYXRpb24ucmVwbGFjZVN0YXRlKHN0YXRlLCB0aXRsZSwgdXJsKTtcbiAgfVxuXG4gIG92ZXJyaWRlIGZvcndhcmQoKTogdm9pZCB7XG4gICAgdGhpcy5fcGxhdGZvcm1Mb2NhdGlvbi5mb3J3YXJkKCk7XG4gIH1cblxuICBvdmVycmlkZSBiYWNrKCk6IHZvaWQge1xuICAgIHRoaXMuX3BsYXRmb3JtTG9jYXRpb24uYmFjaygpO1xuICB9XG5cbiAgb3ZlcnJpZGUgaGlzdG9yeUdvKHJlbGF0aXZlUG9zaXRpb246IG51bWJlciA9IDApOiB2b2lkIHtcbiAgICB0aGlzLl9wbGF0Zm9ybUxvY2F0aW9uLmhpc3RvcnlHbz8uKHJlbGF0aXZlUG9zaXRpb24pO1xuICB9XG59XG4iXX0=