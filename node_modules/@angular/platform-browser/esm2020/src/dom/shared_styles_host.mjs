/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DOCUMENT, ɵgetDOM as getDOM } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class SharedStylesHost {
    constructor() {
        /** @internal */
        this._stylesSet = new Set();
    }
    addStyles(styles) {
        const additions = new Set();
        styles.forEach(style => {
            if (!this._stylesSet.has(style)) {
                this._stylesSet.add(style);
                additions.add(style);
            }
        });
        this.onStylesAdded(additions);
    }
    onStylesAdded(additions) { }
    getAllStyles() {
        return Array.from(this._stylesSet);
    }
}
SharedStylesHost.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: SharedStylesHost, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
SharedStylesHost.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: SharedStylesHost });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: SharedStylesHost, decorators: [{
            type: Injectable
        }] });
export class DomSharedStylesHost extends SharedStylesHost {
    constructor(_doc) {
        super();
        this._doc = _doc;
        // Maps all registered host nodes to a list of style nodes that have been added to the host node.
        this._hostNodes = new Map();
        this._hostNodes.set(_doc.head, []);
    }
    _addStylesToHost(styles, host, styleNodes) {
        styles.forEach((style) => {
            const styleEl = this._doc.createElement('style');
            styleEl.textContent = style;
            styleNodes.push(host.appendChild(styleEl));
        });
    }
    addHost(hostNode) {
        const styleNodes = [];
        this._addStylesToHost(this._stylesSet, hostNode, styleNodes);
        this._hostNodes.set(hostNode, styleNodes);
    }
    removeHost(hostNode) {
        const styleNodes = this._hostNodes.get(hostNode);
        if (styleNodes) {
            styleNodes.forEach(removeStyle);
        }
        this._hostNodes.delete(hostNode);
    }
    onStylesAdded(additions) {
        this._hostNodes.forEach((styleNodes, hostNode) => {
            this._addStylesToHost(additions, hostNode, styleNodes);
        });
    }
    ngOnDestroy() {
        this._hostNodes.forEach(styleNodes => styleNodes.forEach(removeStyle));
    }
}
DomSharedStylesHost.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: DomSharedStylesHost, deps: [{ token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable });
DomSharedStylesHost.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: DomSharedStylesHost });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: DomSharedStylesHost, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
function removeStyle(styleNode) {
    getDOM().remove(styleNode);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkX3N0eWxlc19ob3N0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tYnJvd3Nlci9zcmMvZG9tL3NoYXJlZF9zdHlsZXNfaG9zdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFFLE9BQU8sSUFBSSxNQUFNLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsTUFBTSxFQUFFLFVBQVUsRUFBWSxNQUFNLGVBQWUsQ0FBQzs7QUFHNUQsTUFBTSxPQUFPLGdCQUFnQjtJQUQ3QjtRQUVFLGdCQUFnQjtRQUNOLGVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFDO0tBa0IxQztJQWhCQyxTQUFTLENBQUMsTUFBZ0I7UUFDeEIsTUFBTSxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQVUsQ0FBQztRQUNwQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDL0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzNCLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDdEI7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVELGFBQWEsQ0FBQyxTQUFzQixJQUFTLENBQUM7SUFFOUMsWUFBWTtRQUNWLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDckMsQ0FBQzs7d0hBbkJVLGdCQUFnQjs0SEFBaEIsZ0JBQWdCO3NHQUFoQixnQkFBZ0I7a0JBRDVCLFVBQVU7O0FBd0JYLE1BQU0sT0FBTyxtQkFBb0IsU0FBUSxnQkFBZ0I7SUFJdkQsWUFBc0MsSUFBUztRQUM3QyxLQUFLLEVBQUUsQ0FBQztRQUQ0QixTQUFJLEdBQUosSUFBSSxDQUFLO1FBSC9DLGlHQUFpRztRQUN6RixlQUFVLEdBQUcsSUFBSSxHQUFHLEVBQWdCLENBQUM7UUFJM0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRU8sZ0JBQWdCLENBQUMsTUFBbUIsRUFBRSxJQUFVLEVBQUUsVUFBa0I7UUFDMUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQWEsRUFBRSxFQUFFO1lBQy9CLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2pELE9BQU8sQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1lBQzVCLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELE9BQU8sQ0FBQyxRQUFjO1FBQ3BCLE1BQU0sVUFBVSxHQUFXLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRCxVQUFVLENBQUMsUUFBYztRQUN2QixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqRCxJQUFJLFVBQVUsRUFBRTtZQUNkLFVBQVUsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDakM7UUFDRCxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRVEsYUFBYSxDQUFDLFNBQXNCO1FBQzNDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxFQUFFO1lBQy9DLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3pELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUN6RSxDQUFDOzsySEF2Q1UsbUJBQW1CLGtCQUlWLFFBQVE7K0hBSmpCLG1CQUFtQjtzR0FBbkIsbUJBQW1CO2tCQUQvQixVQUFVOzswQkFLSSxNQUFNOzJCQUFDLFFBQVE7O0FBc0M5QixTQUFTLFdBQVcsQ0FBQyxTQUFlO0lBQ2xDLE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM3QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RE9DVU1FTlQsIMm1Z2V0RE9NIGFzIGdldERPTX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7SW5qZWN0LCBJbmplY3RhYmxlLCBPbkRlc3Ryb3l9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU2hhcmVkU3R5bGVzSG9zdCB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHJvdGVjdGVkIF9zdHlsZXNTZXQgPSBuZXcgU2V0PHN0cmluZz4oKTtcblxuICBhZGRTdHlsZXMoc3R5bGVzOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIGNvbnN0IGFkZGl0aW9ucyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIHN0eWxlcy5mb3JFYWNoKHN0eWxlID0+IHtcbiAgICAgIGlmICghdGhpcy5fc3R5bGVzU2V0LmhhcyhzdHlsZSkpIHtcbiAgICAgICAgdGhpcy5fc3R5bGVzU2V0LmFkZChzdHlsZSk7XG4gICAgICAgIGFkZGl0aW9ucy5hZGQoc3R5bGUpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMub25TdHlsZXNBZGRlZChhZGRpdGlvbnMpO1xuICB9XG5cbiAgb25TdHlsZXNBZGRlZChhZGRpdGlvbnM6IFNldDxzdHJpbmc+KTogdm9pZCB7fVxuXG4gIGdldEFsbFN0eWxlcygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5fc3R5bGVzU2V0KTtcbiAgfVxufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRG9tU2hhcmVkU3R5bGVzSG9zdCBleHRlbmRzIFNoYXJlZFN0eWxlc0hvc3QgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICAvLyBNYXBzIGFsbCByZWdpc3RlcmVkIGhvc3Qgbm9kZXMgdG8gYSBsaXN0IG9mIHN0eWxlIG5vZGVzIHRoYXQgaGF2ZSBiZWVuIGFkZGVkIHRvIHRoZSBob3N0IG5vZGUuXG4gIHByaXZhdGUgX2hvc3ROb2RlcyA9IG5ldyBNYXA8Tm9kZSwgTm9kZVtdPigpO1xuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgX2RvYzogYW55KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9ob3N0Tm9kZXMuc2V0KF9kb2MuaGVhZCwgW10pO1xuICB9XG5cbiAgcHJpdmF0ZSBfYWRkU3R5bGVzVG9Ib3N0KHN0eWxlczogU2V0PHN0cmluZz4sIGhvc3Q6IE5vZGUsIHN0eWxlTm9kZXM6IE5vZGVbXSk6IHZvaWQge1xuICAgIHN0eWxlcy5mb3JFYWNoKChzdHlsZTogc3RyaW5nKSA9PiB7XG4gICAgICBjb25zdCBzdHlsZUVsID0gdGhpcy5fZG9jLmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICBzdHlsZUVsLnRleHRDb250ZW50ID0gc3R5bGU7XG4gICAgICBzdHlsZU5vZGVzLnB1c2goaG9zdC5hcHBlbmRDaGlsZChzdHlsZUVsKSk7XG4gICAgfSk7XG4gIH1cblxuICBhZGRIb3N0KGhvc3ROb2RlOiBOb2RlKTogdm9pZCB7XG4gICAgY29uc3Qgc3R5bGVOb2RlczogTm9kZVtdID0gW107XG4gICAgdGhpcy5fYWRkU3R5bGVzVG9Ib3N0KHRoaXMuX3N0eWxlc1NldCwgaG9zdE5vZGUsIHN0eWxlTm9kZXMpO1xuICAgIHRoaXMuX2hvc3ROb2Rlcy5zZXQoaG9zdE5vZGUsIHN0eWxlTm9kZXMpO1xuICB9XG5cbiAgcmVtb3ZlSG9zdChob3N0Tm9kZTogTm9kZSk6IHZvaWQge1xuICAgIGNvbnN0IHN0eWxlTm9kZXMgPSB0aGlzLl9ob3N0Tm9kZXMuZ2V0KGhvc3ROb2RlKTtcbiAgICBpZiAoc3R5bGVOb2Rlcykge1xuICAgICAgc3R5bGVOb2Rlcy5mb3JFYWNoKHJlbW92ZVN0eWxlKTtcbiAgICB9XG4gICAgdGhpcy5faG9zdE5vZGVzLmRlbGV0ZShob3N0Tm9kZSk7XG4gIH1cblxuICBvdmVycmlkZSBvblN0eWxlc0FkZGVkKGFkZGl0aW9uczogU2V0PHN0cmluZz4pOiB2b2lkIHtcbiAgICB0aGlzLl9ob3N0Tm9kZXMuZm9yRWFjaCgoc3R5bGVOb2RlcywgaG9zdE5vZGUpID0+IHtcbiAgICAgIHRoaXMuX2FkZFN0eWxlc1RvSG9zdChhZGRpdGlvbnMsIGhvc3ROb2RlLCBzdHlsZU5vZGVzKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuX2hvc3ROb2Rlcy5mb3JFYWNoKHN0eWxlTm9kZXMgPT4gc3R5bGVOb2Rlcy5mb3JFYWNoKHJlbW92ZVN0eWxlKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlU3R5bGUoc3R5bGVOb2RlOiBOb2RlKTogdm9pZCB7XG4gIGdldERPTSgpLnJlbW92ZShzdHlsZU5vZGUpO1xufVxuIl19