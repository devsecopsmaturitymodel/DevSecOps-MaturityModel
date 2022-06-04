/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectorRef, ContentChildren, Directive, ElementRef, EventEmitter, Input, Optional, Output, QueryList, Renderer2 } from '@angular/core';
import { from, of } from 'rxjs';
import { mergeAll } from 'rxjs/operators';
import { NavigationEnd } from '../events';
import { Router } from '../router';
import { RouterLink, RouterLinkWithHref } from './router_link';
import * as i0 from "@angular/core";
import * as i1 from "../router";
import * as i2 from "./router_link";
/**
 *
 * @description
 *
 * Tracks whether the linked route of an element is currently active, and allows you
 * to specify one or more CSS classes to add to the element when the linked route
 * is active.
 *
 * Use this directive to create a visual distinction for elements associated with an active route.
 * For example, the following code highlights the word "Bob" when the router
 * activates the associated route:
 *
 * ```
 * <a routerLink="/user/bob" routerLinkActive="active-link">Bob</a>
 * ```
 *
 * Whenever the URL is either '/user' or '/user/bob', the "active-link" class is
 * added to the anchor tag. If the URL changes, the class is removed.
 *
 * You can set more than one class using a space-separated string or an array.
 * For example:
 *
 * ```
 * <a routerLink="/user/bob" routerLinkActive="class1 class2">Bob</a>
 * <a routerLink="/user/bob" [routerLinkActive]="['class1', 'class2']">Bob</a>
 * ```
 *
 * To add the classes only when the URL matches the link exactly, add the option `exact: true`:
 *
 * ```
 * <a routerLink="/user/bob" routerLinkActive="active-link" [routerLinkActiveOptions]="{exact:
 * true}">Bob</a>
 * ```
 *
 * To directly check the `isActive` status of the link, assign the `RouterLinkActive`
 * instance to a template variable.
 * For example, the following checks the status without assigning any CSS classes:
 *
 * ```
 * <a routerLink="/user/bob" routerLinkActive #rla="routerLinkActive">
 *   Bob {{ rla.isActive ? '(already open)' : ''}}
 * </a>
 * ```
 *
 * You can apply the `RouterLinkActive` directive to an ancestor of linked elements.
 * For example, the following sets the active-link class on the `<div>`  parent tag
 * when the URL is either '/user/jim' or '/user/bob'.
 *
 * ```
 * <div routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}">
 *   <a routerLink="/user/jim">Jim</a>
 *   <a routerLink="/user/bob">Bob</a>
 * </div>
 * ```
 *
 * @ngModule RouterModule
 *
 * @publicApi
 */
export class RouterLinkActive {
    constructor(router, element, renderer, cdr, link, linkWithHref) {
        this.router = router;
        this.element = element;
        this.renderer = renderer;
        this.cdr = cdr;
        this.link = link;
        this.linkWithHref = linkWithHref;
        this.classes = [];
        this.isActive = false;
        /**
         * Options to configure how to determine if the router link is active.
         *
         * These options are passed to the `Router.isActive()` function.
         *
         * @see Router.isActive
         */
        this.routerLinkActiveOptions = { exact: false };
        /**
         *
         * You can use the output `isActiveChange` to get notified each time the link becomes
         * active or inactive.
         *
         * Emits:
         * true  -> Route is active
         * false -> Route is inactive
         *
         * ```
         * <a
         *  routerLink="/user/bob"
         *  routerLinkActive="active-link"
         *  (isActiveChange)="this.onRouterLinkActive($event)">Bob</a>
         * ```
         */
        this.isActiveChange = new EventEmitter();
        this.routerEventsSubscription = router.events.subscribe((s) => {
            if (s instanceof NavigationEnd) {
                this.update();
            }
        });
    }
    /** @nodoc */
    ngAfterContentInit() {
        // `of(null)` is used to force subscribe body to execute once immediately (like `startWith`).
        of(this.links.changes, this.linksWithHrefs.changes, of(null)).pipe(mergeAll()).subscribe(_ => {
            this.update();
            this.subscribeToEachLinkOnChanges();
        });
    }
    subscribeToEachLinkOnChanges() {
        this.linkInputChangesSubscription?.unsubscribe();
        const allLinkChanges = [...this.links.toArray(), ...this.linksWithHrefs.toArray(), this.link, this.linkWithHref]
            .filter((link) => !!link)
            .map(link => link.onChanges);
        this.linkInputChangesSubscription = from(allLinkChanges).pipe(mergeAll()).subscribe(link => {
            if (this.isActive !== this.isLinkActive(this.router)(link)) {
                this.update();
            }
        });
    }
    set routerLinkActive(data) {
        const classes = Array.isArray(data) ? data : data.split(' ');
        this.classes = classes.filter(c => !!c);
    }
    /** @nodoc */
    ngOnChanges(changes) {
        this.update();
    }
    /** @nodoc */
    ngOnDestroy() {
        this.routerEventsSubscription.unsubscribe();
        this.linkInputChangesSubscription?.unsubscribe();
    }
    update() {
        if (!this.links || !this.linksWithHrefs || !this.router.navigated)
            return;
        Promise.resolve().then(() => {
            const hasActiveLinks = this.hasActiveLinks();
            if (this.isActive !== hasActiveLinks) {
                this.isActive = hasActiveLinks;
                this.cdr.markForCheck();
                this.classes.forEach((c) => {
                    if (hasActiveLinks) {
                        this.renderer.addClass(this.element.nativeElement, c);
                    }
                    else {
                        this.renderer.removeClass(this.element.nativeElement, c);
                    }
                });
                // Emit on isActiveChange after classes are updated
                this.isActiveChange.emit(hasActiveLinks);
            }
        });
    }
    isLinkActive(router) {
        const options = isActiveMatchOptions(this.routerLinkActiveOptions) ?
            this.routerLinkActiveOptions :
            // While the types should disallow `undefined` here, it's possible without strict inputs
            (this.routerLinkActiveOptions.exact || false);
        return (link) => link.urlTree ? router.isActive(link.urlTree, options) : false;
    }
    hasActiveLinks() {
        const isActiveCheckFn = this.isLinkActive(this.router);
        return this.link && isActiveCheckFn(this.link) ||
            this.linkWithHref && isActiveCheckFn(this.linkWithHref) ||
            this.links.some(isActiveCheckFn) || this.linksWithHrefs.some(isActiveCheckFn);
    }
}
RouterLinkActive.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: RouterLinkActive, deps: [{ token: i1.Router }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.ChangeDetectorRef }, { token: i2.RouterLink, optional: true }, { token: i2.RouterLinkWithHref, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
RouterLinkActive.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.10", type: RouterLinkActive, selector: "[routerLinkActive]", inputs: { routerLinkActiveOptions: "routerLinkActiveOptions", routerLinkActive: "routerLinkActive" }, outputs: { isActiveChange: "isActiveChange" }, queries: [{ propertyName: "links", predicate: RouterLink, descendants: true }, { propertyName: "linksWithHrefs", predicate: RouterLinkWithHref, descendants: true }], exportAs: ["routerLinkActive"], usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: RouterLinkActive, decorators: [{
            type: Directive,
            args: [{
                    selector: '[routerLinkActive]',
                    exportAs: 'routerLinkActive',
                }]
        }], ctorParameters: function () { return [{ type: i1.Router }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.ChangeDetectorRef }, { type: i2.RouterLink, decorators: [{
                    type: Optional
                }] }, { type: i2.RouterLinkWithHref, decorators: [{
                    type: Optional
                }] }]; }, propDecorators: { links: [{
                type: ContentChildren,
                args: [RouterLink, { descendants: true }]
            }], linksWithHrefs: [{
                type: ContentChildren,
                args: [RouterLinkWithHref, { descendants: true }]
            }], routerLinkActiveOptions: [{
                type: Input
            }], isActiveChange: [{
                type: Output
            }], routerLinkActive: [{
                type: Input
            }] } });
/**
 * Use instead of `'paths' in options` to be compatible with property renaming
 */
function isActiveMatchOptions(options) {
    return !!options.paths;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX2xpbmtfYWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcm91dGVyL3NyYy9kaXJlY3RpdmVzL3JvdXRlcl9saW5rX2FjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQW1CLGlCQUFpQixFQUFFLGVBQWUsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQXdCLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBZ0IsTUFBTSxlQUFlLENBQUM7QUFDNU0sT0FBTyxFQUFDLElBQUksRUFBRSxFQUFFLEVBQWUsTUFBTSxNQUFNLENBQUM7QUFDNUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXhDLE9BQU8sRUFBUSxhQUFhLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDL0MsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUdqQyxPQUFPLEVBQUMsVUFBVSxFQUFFLGtCQUFrQixFQUFDLE1BQU0sZUFBZSxDQUFDOzs7O0FBRzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMERHO0FBS0gsTUFBTSxPQUFPLGdCQUFnQjtJQXFDM0IsWUFDWSxNQUFjLEVBQVUsT0FBbUIsRUFBVSxRQUFtQixFQUMvRCxHQUFzQixFQUFzQixJQUFpQixFQUMxRCxZQUFpQztRQUY3QyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBWTtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDL0QsUUFBRyxHQUFILEdBQUcsQ0FBbUI7UUFBc0IsU0FBSSxHQUFKLElBQUksQ0FBYTtRQUMxRCxpQkFBWSxHQUFaLFlBQVksQ0FBcUI7UUFuQ2pELFlBQU8sR0FBYSxFQUFFLENB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LENBQUM7SUFFTyxjQUFjO1FBQ3BCLE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZELE9BQU8sSUFBSSxDQUFDLElBQUksSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUMxQyxJQUFJLENBQUMsWUFBWSxJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO1lBQ3ZELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ3BGLENBQUM7O3dIQTFIVSxnQkFBZ0I7NEdBQWhCLGdCQUFnQixxT0FDVixVQUFVLG9FQUNWLGtCQUFrQjtzR0FGeEIsZ0JBQWdCO2tCQUo1QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxvQkFBb0I7b0JBQzlCLFFBQVEsRUFBRSxrQkFBa0I7aUJBQzdCOzswQkF3QytDLFFBQVE7OzBCQUNqRCxRQUFROzRDQXZDcUMsS0FBSztzQkFBdEQsZUFBZTt1QkFBQyxVQUFVLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDO2dCQUVoRCxjQUFjO3NCQURiLGVBQWU7dUJBQUMsa0JBQWtCLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDO2dCQWUvQyx1QkFBdUI7c0JBQS9CLEtBQUs7Z0JBa0JhLGNBQWM7c0JBQWhDLE1BQU07Z0JBb0NILGdCQUFnQjtzQkFEbkIsS0FBSzs7QUF1RFI7O0dBRUc7QUFDSCxTQUFTLG9CQUFvQixDQUFDLE9BQ29CO0lBQ2hELE9BQU8sQ0FBQyxDQUFFLE9BQWdDLENBQUMsS0FBSyxDQUFDO0FBQ25ELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtBZnRlckNvbnRlbnRJbml0LCBDaGFuZ2VEZXRlY3RvclJlZiwgQ29udGVudENoaWxkcmVuLCBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBPcHRpb25hbCwgT3V0cHV0LCBRdWVyeUxpc3QsIFJlbmRlcmVyMiwgU2ltcGxlQ2hhbmdlc30gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2Zyb20sIG9mLCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHttZXJnZUFsbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge0V2ZW50LCBOYXZpZ2F0aW9uRW5kfSBmcm9tICcuLi9ldmVudHMnO1xuaW1wb3J0IHtSb3V0ZXJ9IGZyb20gJy4uL3JvdXRlcic7XG5pbXBvcnQge0lzQWN0aXZlTWF0Y2hPcHRpb25zfSBmcm9tICcuLi91cmxfdHJlZSc7XG5cbmltcG9ydCB7Um91dGVyTGluaywgUm91dGVyTGlua1dpdGhIcmVmfSBmcm9tICcuL3JvdXRlcl9saW5rJztcblxuXG4vKipcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqXG4gKiBUcmFja3Mgd2hldGhlciB0aGUgbGlua2VkIHJvdXRlIG9mIGFuIGVsZW1lbnQgaXMgY3VycmVudGx5IGFjdGl2ZSwgYW5kIGFsbG93cyB5b3VcbiAqIHRvIHNwZWNpZnkgb25lIG9yIG1vcmUgQ1NTIGNsYXNzZXMgdG8gYWRkIHRvIHRoZSBlbGVtZW50IHdoZW4gdGhlIGxpbmtlZCByb3V0ZVxuICogaXMgYWN0aXZlLlxuICpcbiAqIFVzZSB0aGlzIGRpcmVjdGl2ZSB0byBjcmVhdGUgYSB2aXN1YWwgZGlzdGluY3Rpb24gZm9yIGVsZW1lbnRzIGFzc29jaWF0ZWQgd2l0aCBhbiBhY3RpdmUgcm91dGUuXG4gKiBGb3IgZXhhbXBsZSwgdGhlIGZvbGxvd2luZyBjb2RlIGhpZ2hsaWdodHMgdGhlIHdvcmQgXCJCb2JcIiB3aGVuIHRoZSByb3V0ZXJcbiAqIGFjdGl2YXRlcyB0aGUgYXNzb2NpYXRlZCByb3V0ZTpcbiAqXG4gKiBgYGBcbiAqIDxhIHJvdXRlckxpbms9XCIvdXNlci9ib2JcIiByb3V0ZXJMaW5rQWN0aXZlPVwiYWN0aXZlLWxpbmtcIj5Cb2I8L2E+XG4gKiBgYGBcbiAqXG4gKiBXaGVuZXZlciB0aGUgVVJMIGlzIGVpdGhlciAnL3VzZXInIG9yICcvdXNlci9ib2InLCB0aGUgXCJhY3RpdmUtbGlua1wiIGNsYXNzIGlzXG4gKiBhZGRlZCB0byB0aGUgYW5jaG9yIHRhZy4gSWYgdGhlIFVSTCBjaGFuZ2VzLCB0aGUgY2xhc3MgaXMgcmVtb3ZlZC5cbiAqXG4gKiBZb3UgY2FuIHNldCBtb3JlIHRoYW4gb25lIGNsYXNzIHVzaW5nIGEgc3BhY2Utc2VwYXJhdGVkIHN0cmluZyBvciBhbiBhcnJheS5cbiAqIEZvciBleGFtcGxlOlxuICpcbiAqIGBgYFxuICogPGEgcm91dGVyTGluaz1cIi91c2VyL2JvYlwiIHJvdXRlckxpbmtBY3RpdmU9XCJjbGFzczEgY2xhc3MyXCI+Qm9iPC9hPlxuICogPGEgcm91dGVyTGluaz1cIi91c2VyL2JvYlwiIFtyb3V0ZXJMaW5rQWN0aXZlXT1cIlsnY2xhc3MxJywgJ2NsYXNzMiddXCI+Qm9iPC9hPlxuICogYGBgXG4gKlxuICogVG8gYWRkIHRoZSBjbGFzc2VzIG9ubHkgd2hlbiB0aGUgVVJMIG1hdGNoZXMgdGhlIGxpbmsgZXhhY3RseSwgYWRkIHRoZSBvcHRpb24gYGV4YWN0OiB0cnVlYDpcbiAqXG4gKiBgYGBcbiAqIDxhIHJvdXRlckxpbms9XCIvdXNlci9ib2JcIiByb3V0ZXJMaW5rQWN0aXZlPVwiYWN0aXZlLWxpbmtcIiBbcm91dGVyTGlua0FjdGl2ZU9wdGlvbnNdPVwie2V4YWN0OlxuICogdHJ1ZX1cIj5Cb2I8L2E+XG4gKiBgYGBcbiAqXG4gKiBUbyBkaXJlY3RseSBjaGVjayB0aGUgYGlzQWN0aXZlYCBzdGF0dXMgb2YgdGhlIGxpbmssIGFzc2lnbiB0aGUgYFJvdXRlckxpbmtBY3RpdmVgXG4gKiBpbnN0YW5jZSB0byBhIHRlbXBsYXRlIHZhcmlhYmxlLlxuICogRm9yIGV4YW1wbGUsIHRoZSBmb2xsb3dpbmcgY2hlY2tzIHRoZSBzdGF0dXMgd2l0aG91dCBhc3NpZ25pbmcgYW55IENTUyBjbGFzc2VzOlxuICpcbiAqIGBgYFxuICogPGEgcm91dGVyTGluaz1cIi91c2VyL2JvYlwiIHJvdXRlckxpbmtBY3RpdmUgI3JsYT1cInJvdXRlckxpbmtBY3RpdmVcIj5cbiAqICAgQm9iIHt7IHJsYS5pc0FjdGl2ZSA/ICcoYWxyZWFkeSBvcGVuKScgOiAnJ319XG4gKiA8L2E+XG4gKiBgYGBcbiAqXG4gKiBZb3UgY2FuIGFwcGx5IHRoZSBgUm91dGVyTGlua0FjdGl2ZWAgZGlyZWN0aXZlIHRvIGFuIGFuY2VzdG9yIG9mIGxpbmtlZCBlbGVtZW50cy5cbiAqIEZvciBleGFtcGxlLCB0aGUgZm9sbG93aW5nIHNldHMgdGhlIGFjdGl2ZS1saW5rIGNsYXNzIG9uIHRoZSBgPGRpdj5gICBwYXJlbnQgdGFnXG4gKiB3aGVuIHRoZSBVUkwgaXMgZWl0aGVyICcvdXNlci9qaW0nIG9yICcvdXNlci9ib2InLlxuICpcbiAqIGBgYFxuICogPGRpdiByb3V0ZXJMaW5rQWN0aXZlPVwiYWN0aXZlLWxpbmtcIiBbcm91dGVyTGlua0FjdGl2ZU9wdGlvbnNdPVwie2V4YWN0OiB0cnVlfVwiPlxuICogICA8YSByb3V0ZXJMaW5rPVwiL3VzZXIvamltXCI+SmltPC9hPlxuICogICA8YSByb3V0ZXJMaW5rPVwiL3VzZXIvYm9iXCI+Qm9iPC9hPlxuICogPC9kaXY+XG4gKiBgYGBcbiAqXG4gKiBAbmdNb2R1bGUgUm91dGVyTW9kdWxlXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbcm91dGVyTGlua0FjdGl2ZV0nLFxuICBleHBvcnRBczogJ3JvdXRlckxpbmtBY3RpdmUnLFxufSlcbmV4cG9ydCBjbGFzcyBSb3V0ZXJMaW5rQWN0aXZlIGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIEFmdGVyQ29udGVudEluaXQge1xuICBAQ29udGVudENoaWxkcmVuKFJvdXRlckxpbmssIHtkZXNjZW5kYW50czogdHJ1ZX0pIGxpbmtzITogUXVlcnlMaXN0PFJvdXRlckxpbms+O1xuICBAQ29udGVudENoaWxkcmVuKFJvdXRlckxpbmtXaXRoSHJlZiwge2Rlc2NlbmRhbnRzOiB0cnVlfSlcbiAgbGlua3NXaXRoSHJlZnMhOiBRdWVyeUxpc3Q8Um91dGVyTGlua1dpdGhIcmVmPjtcblxuICBwcml2YXRlIGNsYXNzZXM6IHN0cmluZ1tdID0gW107XG4gIHByaXZhdGUgcm91dGVyRXZlbnRzU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByaXZhdGUgbGlua0lucHV0Q2hhbmdlc1N1YnNjcmlwdGlvbj86IFN1YnNjcmlwdGlvbjtcbiAgcHVibGljIHJlYWRvbmx5IGlzQWN0aXZlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIE9wdGlvbnMgdG8gY29uZmlndXJlIGhvdyB0byBkZXRlcm1pbmUgaWYgdGhlIHJvdXRlciBsaW5rIGlzIGFjdGl2ZS5cbiAgICpcbiAgICogVGhlc2Ugb3B0aW9ucyBhcmUgcGFzc2VkIHRvIHRoZSBgUm91dGVyLmlzQWN0aXZlKClgIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAc2VlIFJvdXRlci5pc0FjdGl2ZVxuICAgKi9cbiAgQElucHV0KCkgcm91dGVyTGlua0FjdGl2ZU9wdGlvbnM6IHtleGFjdDogYm9vbGVhbn18SXNBY3RpdmVNYXRjaE9wdGlvbnMgPSB7ZXhhY3Q6IGZhbHNlfTtcblxuICAvKipcbiAgICpcbiAgICogWW91IGNhbiB1c2UgdGhlIG91dHB1dCBgaXNBY3RpdmVDaGFuZ2VgIHRvIGdldCBub3RpZmllZCBlYWNoIHRpbWUgdGhlIGxpbmsgYmVjb21lc1xuICAgKiBhY3RpdmUgb3IgaW5hY3RpdmUuXG4gICAqXG4gICAqIEVtaXRzOlxuICAgKiB0cnVlICAtPiBSb3V0ZSBpcyBhY3RpdmVcbiAgICogZmFsc2UgLT4gUm91dGUgaXMgaW5hY3RpdmVcbiAgICpcbiAgICogYGBgXG4gICAqIDxhXG4gICAqICByb3V0ZXJMaW5rPVwiL3VzZXIvYm9iXCJcbiAgICogIHJvdXRlckxpbmtBY3RpdmU9XCJhY3RpdmUtbGlua1wiXG4gICAqICAoaXNBY3RpdmVDaGFuZ2UpPVwidGhpcy5vblJvdXRlckxpbmtBY3RpdmUoJGV2ZW50KVwiPkJvYjwvYT5cbiAgICogYGBgXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgaXNBY3RpdmVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsIHByaXZhdGUgZWxlbWVudDogRWxlbWVudFJlZiwgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgICAgcHJpdmF0ZSByZWFkb25seSBjZHI6IENoYW5nZURldGVjdG9yUmVmLCBAT3B0aW9uYWwoKSBwcml2YXRlIGxpbms/OiBSb3V0ZXJMaW5rLFxuICAgICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBsaW5rV2l0aEhyZWY/OiBSb3V0ZXJMaW5rV2l0aEhyZWYpIHtcbiAgICB0aGlzLnJvdXRlckV2ZW50c1N1YnNjcmlwdGlvbiA9IHJvdXRlci5ldmVudHMuc3Vic2NyaWJlKChzOiBFdmVudCkgPT4ge1xuICAgICAgaWYgKHMgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uRW5kKSB7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKiogQG5vZG9jICovXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpOiB2b2lkIHtcbiAgICAvLyBgb2YobnVsbClgIGlzIHVzZWQgdG8gZm9yY2Ugc3Vic2NyaWJlIGJvZHkgdG8gZXhlY3V0ZSBvbmNlIGltbWVkaWF0ZWx5IChsaWtlIGBzdGFydFdpdGhgKS5cbiAgICBvZih0aGlzLmxpbmtzLmNoYW5nZXMsIHRoaXMubGlua3NXaXRoSHJlZnMuY2hhbmdlcywgb2YobnVsbCkpLnBpcGUobWVyZ2VBbGwoKSkuc3Vic2NyaWJlKF8gPT4ge1xuICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICAgIHRoaXMuc3Vic2NyaWJlVG9FYWNoTGlua09uQ2hhbmdlcygpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzdWJzY3JpYmVUb0VhY2hMaW5rT25DaGFuZ2VzKCkge1xuICAgIHRoaXMubGlua0lucHV0Q2hhbmdlc1N1YnNjcmlwdGlvbj8udW5zdWJzY3JpYmUoKTtcbiAgICBjb25zdCBhbGxMaW5rQ2hhbmdlcyA9XG4gICAgICAgIFsuLi50aGlzLmxpbmtzLnRvQXJyYXkoKSwgLi4udGhpcy5saW5rc1dpdGhIcmVmcy50b0FycmF5KCksIHRoaXMubGluaywgdGhpcy5saW5rV2l0aEhyZWZdXG4gICAgICAgICAgICAuZmlsdGVyKChsaW5rKTogbGluayBpcyBSb3V0ZXJMaW5rfFJvdXRlckxpbmtXaXRoSHJlZiA9PiAhIWxpbmspXG4gICAgICAgICAgICAubWFwKGxpbmsgPT4gbGluay5vbkNoYW5nZXMpO1xuICAgIHRoaXMubGlua0lucHV0Q2hhbmdlc1N1YnNjcmlwdGlvbiA9IGZyb20oYWxsTGlua0NoYW5nZXMpLnBpcGUobWVyZ2VBbGwoKSkuc3Vic2NyaWJlKGxpbmsgPT4ge1xuICAgICAgaWYgKHRoaXMuaXNBY3RpdmUgIT09IHRoaXMuaXNMaW5rQWN0aXZlKHRoaXMucm91dGVyKShsaW5rKSkge1xuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IHJvdXRlckxpbmtBY3RpdmUoZGF0YTogc3RyaW5nW118c3RyaW5nKSB7XG4gICAgY29uc3QgY2xhc3NlcyA9IEFycmF5LmlzQXJyYXkoZGF0YSkgPyBkYXRhIDogZGF0YS5zcGxpdCgnICcpO1xuICAgIHRoaXMuY2xhc3NlcyA9IGNsYXNzZXMuZmlsdGVyKGMgPT4gISFjKTtcbiAgfVxuXG4gIC8qKiBAbm9kb2MgKi9cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIHRoaXMudXBkYXRlKCk7XG4gIH1cbiAgLyoqIEBub2RvYyAqL1xuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnJvdXRlckV2ZW50c1N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMubGlua0lucHV0Q2hhbmdlc1N1YnNjcmlwdGlvbj8udW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5saW5rcyB8fCAhdGhpcy5saW5rc1dpdGhIcmVmcyB8fCAhdGhpcy5yb3V0ZXIubmF2aWdhdGVkKSByZXR1cm47XG4gICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICBjb25zdCBoYXNBY3RpdmVMaW5rcyA9IHRoaXMuaGFzQWN0aXZlTGlua3MoKTtcbiAgICAgIGlmICh0aGlzLmlzQWN0aXZlICE9PSBoYXNBY3RpdmVMaW5rcykge1xuICAgICAgICAodGhpcyBhcyBhbnkpLmlzQWN0aXZlID0gaGFzQWN0aXZlTGlua3M7XG4gICAgICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICB0aGlzLmNsYXNzZXMuZm9yRWFjaCgoYykgPT4ge1xuICAgICAgICAgIGlmIChoYXNBY3RpdmVMaW5rcykge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCwgYyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIGMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gRW1pdCBvbiBpc0FjdGl2ZUNoYW5nZSBhZnRlciBjbGFzc2VzIGFyZSB1cGRhdGVkXG4gICAgICAgIHRoaXMuaXNBY3RpdmVDaGFuZ2UuZW1pdChoYXNBY3RpdmVMaW5rcyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGlzTGlua0FjdGl2ZShyb3V0ZXI6IFJvdXRlcik6IChsaW5rOiAoUm91dGVyTGlua3xSb3V0ZXJMaW5rV2l0aEhyZWYpKSA9PiBib29sZWFuIHtcbiAgICBjb25zdCBvcHRpb25zOiBib29sZWFufElzQWN0aXZlTWF0Y2hPcHRpb25zID1cbiAgICAgICAgaXNBY3RpdmVNYXRjaE9wdGlvbnModGhpcy5yb3V0ZXJMaW5rQWN0aXZlT3B0aW9ucykgP1xuICAgICAgICB0aGlzLnJvdXRlckxpbmtBY3RpdmVPcHRpb25zIDpcbiAgICAgICAgLy8gV2hpbGUgdGhlIHR5cGVzIHNob3VsZCBkaXNhbGxvdyBgdW5kZWZpbmVkYCBoZXJlLCBpdCdzIHBvc3NpYmxlIHdpdGhvdXQgc3RyaWN0IGlucHV0c1xuICAgICAgICAodGhpcy5yb3V0ZXJMaW5rQWN0aXZlT3B0aW9ucy5leGFjdCB8fCBmYWxzZSk7XG4gICAgcmV0dXJuIChsaW5rOiBSb3V0ZXJMaW5rfFJvdXRlckxpbmtXaXRoSHJlZikgPT5cbiAgICAgICAgICAgICAgIGxpbmsudXJsVHJlZSA/IHJvdXRlci5pc0FjdGl2ZShsaW5rLnVybFRyZWUsIG9wdGlvbnMpIDogZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIGhhc0FjdGl2ZUxpbmtzKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGlzQWN0aXZlQ2hlY2tGbiA9IHRoaXMuaXNMaW5rQWN0aXZlKHRoaXMucm91dGVyKTtcbiAgICByZXR1cm4gdGhpcy5saW5rICYmIGlzQWN0aXZlQ2hlY2tGbih0aGlzLmxpbmspIHx8XG4gICAgICAgIHRoaXMubGlua1dpdGhIcmVmICYmIGlzQWN0aXZlQ2hlY2tGbih0aGlzLmxpbmtXaXRoSHJlZikgfHxcbiAgICAgICAgdGhpcy5saW5rcy5zb21lKGlzQWN0aXZlQ2hlY2tGbikgfHwgdGhpcy5saW5rc1dpdGhIcmVmcy5zb21lKGlzQWN0aXZlQ2hlY2tGbik7XG4gIH1cbn1cblxuLyoqXG4gKiBVc2UgaW5zdGVhZCBvZiBgJ3BhdGhzJyBpbiBvcHRpb25zYCB0byBiZSBjb21wYXRpYmxlIHdpdGggcHJvcGVydHkgcmVuYW1pbmdcbiAqL1xuZnVuY3Rpb24gaXNBY3RpdmVNYXRjaE9wdGlvbnMob3B0aW9uczoge2V4YWN0OiBib29sZWFufXxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIElzQWN0aXZlTWF0Y2hPcHRpb25zKTogb3B0aW9ucyBpcyBJc0FjdGl2ZU1hdGNoT3B0aW9ucyB7XG4gIHJldHVybiAhIShvcHRpb25zIGFzIElzQWN0aXZlTWF0Y2hPcHRpb25zKS5wYXRocztcbn1cbiJdfQ==