/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class Log {
    constructor() {
        this.logItems = [];
    }
    add(value /** TODO #9100 */) {
        this.logItems.push(value);
    }
    fn(value /** TODO #9100 */) {
        return (a1 = null, a2 = null, a3 = null, a4 = null, a5 = null) => {
            this.logItems.push(value);
        };
    }
    clear() {
        this.logItems = [];
    }
    result() {
        return this.logItems.join('; ');
    }
}
Log.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: Log, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
Log.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: Log });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: Log, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0aW5nL3NyYy9sb2dnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7QUFHekMsTUFBTSxPQUFPLEdBQUc7SUFHZDtRQUNFLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxHQUFHLENBQUMsS0FBVSxDQUFDLGlCQUFpQjtRQUM5QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsRUFBRSxDQUFDLEtBQVUsQ0FBQyxpQkFBaUI7UUFDN0IsT0FBTyxDQUFDLEtBQVUsSUFBSSxFQUFFLEtBQVUsSUFBSSxFQUFFLEtBQVUsSUFBSSxFQUFFLEtBQVUsSUFBSSxFQUFFLEtBQVUsSUFBSSxFQUFFLEVBQUU7WUFDeEYsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELEtBQUs7UUFDSCxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRUQsTUFBTTtRQUNKLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEMsQ0FBQzs7MkdBdkJVLEdBQUc7K0dBQUgsR0FBRztzR0FBSCxHQUFHO2tCQURmLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIExvZyB7XG4gIGxvZ0l0ZW1zOiBhbnlbXTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmxvZ0l0ZW1zID0gW107XG4gIH1cblxuICBhZGQodmFsdWU6IGFueSAvKiogVE9ETyAjOTEwMCAqLyk6IHZvaWQge1xuICAgIHRoaXMubG9nSXRlbXMucHVzaCh2YWx1ZSk7XG4gIH1cblxuICBmbih2YWx1ZTogYW55IC8qKiBUT0RPICM5MTAwICovKSB7XG4gICAgcmV0dXJuIChhMTogYW55ID0gbnVsbCwgYTI6IGFueSA9IG51bGwsIGEzOiBhbnkgPSBudWxsLCBhNDogYW55ID0gbnVsbCwgYTU6IGFueSA9IG51bGwpID0+IHtcbiAgICAgIHRoaXMubG9nSXRlbXMucHVzaCh2YWx1ZSk7XG4gICAgfTtcbiAgfVxuXG4gIGNsZWFyKCk6IHZvaWQge1xuICAgIHRoaXMubG9nSXRlbXMgPSBbXTtcbiAgfVxuXG4gIHJlc3VsdCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmxvZ0l0ZW1zLmpvaW4oJzsgJyk7XG4gIH1cbn1cbiJdfQ==