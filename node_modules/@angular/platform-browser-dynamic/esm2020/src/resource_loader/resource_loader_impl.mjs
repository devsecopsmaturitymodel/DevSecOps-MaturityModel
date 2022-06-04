/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ResourceLoader } from '@angular/compiler';
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class ResourceLoaderImpl extends ResourceLoader {
    get(url) {
        let resolve;
        let reject;
        const promise = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'text';
        xhr.onload = function () {
            // responseText is the old-school way of retrieving response (supported by IE8 & 9)
            // response/responseType properties were introduced in ResourceLoader Level2 spec (supported
            // by IE10)
            const response = xhr.response || xhr.responseText;
            // normalize IE9 bug (https://bugs.jquery.com/ticket/1450)
            let status = xhr.status === 1223 ? 204 : xhr.status;
            // fix status code when it is 0 (0 status is undocumented).
            // Occurs when accessing file resources or on Android 4.1 stock browser
            // while retrieving files from application cache.
            if (status === 0) {
                status = response ? 200 : 0;
            }
            if (200 <= status && status <= 300) {
                resolve(response);
            }
            else {
                reject(`Failed to load ${url}`);
            }
        };
        xhr.onerror = function () {
            reject(`Failed to load ${url}`);
        };
        xhr.send();
        return promise;
    }
}
ResourceLoaderImpl.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: ResourceLoaderImpl, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
ResourceLoaderImpl.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: ResourceLoaderImpl });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: ResourceLoaderImpl, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2VfbG9hZGVyX2ltcGwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyLWR5bmFtaWMvc3JjL3Jlc291cmNlX2xvYWRlci9yZXNvdXJjZV9sb2FkZXJfaW1wbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDakQsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7QUFJekMsTUFBTSxPQUFPLGtCQUFtQixTQUFRLGNBQWM7SUFDM0MsR0FBRyxDQUFDLEdBQVc7UUFDdEIsSUFBSSxPQUE4QixDQUFDO1FBQ25DLElBQUksTUFBNEIsQ0FBQztRQUNqQyxNQUFNLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBUyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUMvQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1lBQ2QsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNmLENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxHQUFHLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztRQUNqQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDM0IsR0FBRyxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUM7UUFFMUIsR0FBRyxDQUFDLE1BQU0sR0FBRztZQUNYLG1GQUFtRjtZQUNuRiw0RkFBNEY7WUFDNUYsV0FBVztZQUNYLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxRQUFRLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQztZQUVsRCwwREFBMEQ7WUFDMUQsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztZQUVwRCwyREFBMkQ7WUFDM0QsdUVBQXVFO1lBQ3ZFLGlEQUFpRDtZQUNqRCxJQUFJLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQ2hCLE1BQU0sR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzdCO1lBRUQsSUFBSSxHQUFHLElBQUksTUFBTSxJQUFJLE1BQU0sSUFBSSxHQUFHLEVBQUU7Z0JBQ2xDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUNuQjtpQkFBTTtnQkFDTCxNQUFNLENBQUMsa0JBQWtCLEdBQUcsRUFBRSxDQUFDLENBQUM7YUFDakM7UUFDSCxDQUFDLENBQUM7UUFFRixHQUFHLENBQUMsT0FBTyxHQUFHO1lBQ1osTUFBTSxDQUFDLGtCQUFrQixHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2xDLENBQUMsQ0FBQztRQUVGLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNYLE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7OzBIQXpDVSxrQkFBa0I7OEhBQWxCLGtCQUFrQjtzR0FBbEIsa0JBQWtCO2tCQUQ5QixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge1Jlc291cmNlTG9hZGVyfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBSZXNvdXJjZUxvYWRlckltcGwgZXh0ZW5kcyBSZXNvdXJjZUxvYWRlciB7XG4gIG92ZXJyaWRlIGdldCh1cmw6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgbGV0IHJlc29sdmU6IChyZXN1bHQ6IGFueSkgPT4gdm9pZDtcbiAgICBsZXQgcmVqZWN0OiAoZXJyb3I6IGFueSkgPT4gdm9pZDtcbiAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2U8c3RyaW5nPigocmVzLCByZWopID0+IHtcbiAgICAgIHJlc29sdmUgPSByZXM7XG4gICAgICByZWplY3QgPSByZWo7XG4gICAgfSk7XG4gICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgeGhyLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG4gICAgeGhyLnJlc3BvbnNlVHlwZSA9ICd0ZXh0JztcblxuICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIC8vIHJlc3BvbnNlVGV4dCBpcyB0aGUgb2xkLXNjaG9vbCB3YXkgb2YgcmV0cmlldmluZyByZXNwb25zZSAoc3VwcG9ydGVkIGJ5IElFOCAmIDkpXG4gICAgICAvLyByZXNwb25zZS9yZXNwb25zZVR5cGUgcHJvcGVydGllcyB3ZXJlIGludHJvZHVjZWQgaW4gUmVzb3VyY2VMb2FkZXIgTGV2ZWwyIHNwZWMgKHN1cHBvcnRlZFxuICAgICAgLy8gYnkgSUUxMClcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0geGhyLnJlc3BvbnNlIHx8IHhoci5yZXNwb25zZVRleHQ7XG5cbiAgICAgIC8vIG5vcm1hbGl6ZSBJRTkgYnVnIChodHRwczovL2J1Z3MuanF1ZXJ5LmNvbS90aWNrZXQvMTQ1MClcbiAgICAgIGxldCBzdGF0dXMgPSB4aHIuc3RhdHVzID09PSAxMjIzID8gMjA0IDogeGhyLnN0YXR1cztcblxuICAgICAgLy8gZml4IHN0YXR1cyBjb2RlIHdoZW4gaXQgaXMgMCAoMCBzdGF0dXMgaXMgdW5kb2N1bWVudGVkKS5cbiAgICAgIC8vIE9jY3VycyB3aGVuIGFjY2Vzc2luZyBmaWxlIHJlc291cmNlcyBvciBvbiBBbmRyb2lkIDQuMSBzdG9jayBicm93c2VyXG4gICAgICAvLyB3aGlsZSByZXRyaWV2aW5nIGZpbGVzIGZyb20gYXBwbGljYXRpb24gY2FjaGUuXG4gICAgICBpZiAoc3RhdHVzID09PSAwKSB7XG4gICAgICAgIHN0YXR1cyA9IHJlc3BvbnNlID8gMjAwIDogMDtcbiAgICAgIH1cblxuICAgICAgaWYgKDIwMCA8PSBzdGF0dXMgJiYgc3RhdHVzIDw9IDMwMCkge1xuICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlamVjdChgRmFpbGVkIHRvIGxvYWQgJHt1cmx9YCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICByZWplY3QoYEZhaWxlZCB0byBsb2FkICR7dXJsfWApO1xuICAgIH07XG5cbiAgICB4aHIuc2VuZCgpO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG59XG4iXX0=