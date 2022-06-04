/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Input, ContentChildren, QueryList, } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CdkAccordion } from '@angular/cdk/accordion';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { startWith } from 'rxjs/operators';
import { MAT_ACCORDION, } from './accordion-base';
import { MatExpansionPanelHeader } from './expansion-panel-header';
import * as i0 from "@angular/core";
/**
 * Directive for a Material Design Accordion.
 */
export class MatAccordion extends CdkAccordion {
    constructor() {
        super(...arguments);
        /** Headers belonging to this accordion. */
        this._ownHeaders = new QueryList();
        this._hideToggle = false;
        /**
         * Display mode used for all expansion panels in the accordion. Currently two display
         * modes exist:
         *  default - a gutter-like spacing is placed around any expanded panel, placing the expanded
         *     panel at a different elevation from the rest of the accordion.
         *  flat - no spacing is placed around expanded panels, showing all panels at the same
         *     elevation.
         */
        this.displayMode = 'default';
        /** The position of the expansion indicator. */
        this.togglePosition = 'after';
    }
    /** Whether the expansion indicator should be hidden. */
    get hideToggle() {
        return this._hideToggle;
    }
    set hideToggle(show) {
        this._hideToggle = coerceBooleanProperty(show);
    }
    ngAfterContentInit() {
        this._headers.changes
            .pipe(startWith(this._headers))
            .subscribe((headers) => {
            this._ownHeaders.reset(headers.filter(header => header.panel.accordion === this));
            this._ownHeaders.notifyOnChanges();
        });
        this._keyManager = new FocusKeyManager(this._ownHeaders).withWrap().withHomeAndEnd();
    }
    /** Handles keyboard events coming in from the panel headers. */
    _handleHeaderKeydown(event) {
        this._keyManager.onKeydown(event);
    }
    _handleHeaderFocus(header) {
        this._keyManager.updateActiveItem(header);
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        this._ownHeaders.destroy();
    }
}
MatAccordion.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatAccordion, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MatAccordion.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatAccordion, selector: "mat-accordion", inputs: { multi: "multi", hideToggle: "hideToggle", displayMode: "displayMode", togglePosition: "togglePosition" }, host: { properties: { "class.mat-accordion-multi": "this.multi" }, classAttribute: "mat-accordion" }, providers: [
        {
            provide: MAT_ACCORDION,
            useExisting: MatAccordion,
        },
    ], queries: [{ propertyName: "_headers", predicate: MatExpansionPanelHeader, descendants: true }], exportAs: ["matAccordion"], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatAccordion, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-accordion',
                    exportAs: 'matAccordion',
                    inputs: ['multi'],
                    providers: [
                        {
                            provide: MAT_ACCORDION,
                            useExisting: MatAccordion,
                        },
                    ],
                    host: {
                        class: 'mat-accordion',
                        // Class binding which is only used by the test harness as there is no other
                        // way for the harness to detect if multiple panel support is enabled.
                        '[class.mat-accordion-multi]': 'this.multi',
                    },
                }]
        }], propDecorators: { _headers: [{
                type: ContentChildren,
                args: [MatExpansionPanelHeader, { descendants: true }]
            }], hideToggle: [{
                type: Input
            }], displayMode: [{
                type: Input
            }], togglePosition: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3JkaW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2V4cGFuc2lvbi9hY2NvcmRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBQ0wsZUFBZSxFQUNmLFNBQVMsR0FHVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDcEQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6QyxPQUFPLEVBQ0wsYUFBYSxHQUlkLE1BQU0sa0JBQWtCLENBQUM7QUFDMUIsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sMEJBQTBCLENBQUM7O0FBRWpFOztHQUVHO0FBa0JILE1BQU0sT0FBTyxZQUNYLFNBQVEsWUFBWTtJQWxCdEI7O1FBdUJFLDJDQUEyQztRQUNuQyxnQkFBVyxHQUFHLElBQUksU0FBUyxFQUEyQixDQUFDO1FBY3ZELGdCQUFXLEdBQVksS0FBSyxDQUFDO1FBRXJDOzs7Ozs7O1dBT0c7UUFDTSxnQkFBVyxHQUE0QixTQUFTLENBQUM7UUFFMUQsK0NBQStDO1FBQ3RDLG1CQUFjLEdBQStCLE9BQU8sQ0FBQztLQTBCL0Q7SUEvQ0Msd0RBQXdEO0lBQ3hELElBQ0ksVUFBVTtRQUNaLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUMxQixDQUFDO0lBQ0QsSUFBSSxVQUFVLENBQUMsSUFBa0I7UUFDL0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBZ0JELGtCQUFrQjtRQUNoQixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU87YUFDbEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDOUIsU0FBUyxDQUFDLENBQUMsT0FBMkMsRUFBRSxFQUFFO1lBQ3pELElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2xGLElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUM7UUFFTCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUN2RixDQUFDO0lBRUQsZ0VBQWdFO0lBQ2hFLG9CQUFvQixDQUFDLEtBQW9CO1FBQ3ZDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxrQkFBa0IsQ0FBQyxNQUErQjtRQUNoRCxJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFUSxXQUFXO1FBQ2xCLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzdCLENBQUM7O3lHQTNEVSxZQUFZOzZGQUFaLFlBQVksa1FBYlo7UUFDVDtZQUNFLE9BQU8sRUFBRSxhQUFhO1lBQ3RCLFdBQVcsRUFBRSxZQUFZO1NBQzFCO0tBQ0YsbURBa0JnQix1QkFBdUI7MkZBVjdCLFlBQVk7a0JBakJ4QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxlQUFlO29CQUN6QixRQUFRLEVBQUUsY0FBYztvQkFDeEIsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDO29CQUNqQixTQUFTLEVBQUU7d0JBQ1Q7NEJBQ0UsT0FBTyxFQUFFLGFBQWE7NEJBQ3RCLFdBQVcsY0FBYzt5QkFDMUI7cUJBQ0Y7b0JBQ0QsSUFBSSxFQUFFO3dCQUNKLEtBQUssRUFBRSxlQUFlO3dCQUN0Qiw0RUFBNEU7d0JBQzVFLHNFQUFzRTt3QkFDdEUsNkJBQTZCLEVBQUUsWUFBWTtxQkFDNUM7aUJBQ0Y7OEJBWUMsUUFBUTtzQkFEUCxlQUFlO3VCQUFDLHVCQUF1QixFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQztnQkFLekQsVUFBVTtzQkFEYixLQUFLO2dCQWlCRyxXQUFXO3NCQUFuQixLQUFLO2dCQUdHLGNBQWM7c0JBQXRCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBJbnB1dCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBRdWVyeUxpc3QsXG4gIEFmdGVyQ29udGVudEluaXQsXG4gIE9uRGVzdHJveSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtDZGtBY2NvcmRpb259IGZyb20gJ0Bhbmd1bGFyL2Nkay9hY2NvcmRpb24nO1xuaW1wb3J0IHtGb2N1c0tleU1hbmFnZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7c3RhcnRXaXRofSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge1xuICBNQVRfQUNDT1JESU9OLFxuICBNYXRBY2NvcmRpb25CYXNlLFxuICBNYXRBY2NvcmRpb25EaXNwbGF5TW9kZSxcbiAgTWF0QWNjb3JkaW9uVG9nZ2xlUG9zaXRpb24sXG59IGZyb20gJy4vYWNjb3JkaW9uLWJhc2UnO1xuaW1wb3J0IHtNYXRFeHBhbnNpb25QYW5lbEhlYWRlcn0gZnJvbSAnLi9leHBhbnNpb24tcGFuZWwtaGVhZGVyJztcblxuLyoqXG4gKiBEaXJlY3RpdmUgZm9yIGEgTWF0ZXJpYWwgRGVzaWduIEFjY29yZGlvbi5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LWFjY29yZGlvbicsXG4gIGV4cG9ydEFzOiAnbWF0QWNjb3JkaW9uJyxcbiAgaW5wdXRzOiBbJ211bHRpJ10sXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6IE1BVF9BQ0NPUkRJT04sXG4gICAgICB1c2VFeGlzdGluZzogTWF0QWNjb3JkaW9uLFxuICAgIH0sXG4gIF0sXG4gIGhvc3Q6IHtcbiAgICBjbGFzczogJ21hdC1hY2NvcmRpb24nLFxuICAgIC8vIENsYXNzIGJpbmRpbmcgd2hpY2ggaXMgb25seSB1c2VkIGJ5IHRoZSB0ZXN0IGhhcm5lc3MgYXMgdGhlcmUgaXMgbm8gb3RoZXJcbiAgICAvLyB3YXkgZm9yIHRoZSBoYXJuZXNzIHRvIGRldGVjdCBpZiBtdWx0aXBsZSBwYW5lbCBzdXBwb3J0IGlzIGVuYWJsZWQuXG4gICAgJ1tjbGFzcy5tYXQtYWNjb3JkaW9uLW11bHRpXSc6ICd0aGlzLm11bHRpJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0QWNjb3JkaW9uXG4gIGV4dGVuZHMgQ2RrQWNjb3JkaW9uXG4gIGltcGxlbWVudHMgTWF0QWNjb3JkaW9uQmFzZSwgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95XG57XG4gIHByaXZhdGUgX2tleU1hbmFnZXI6IEZvY3VzS2V5TWFuYWdlcjxNYXRFeHBhbnNpb25QYW5lbEhlYWRlcj47XG5cbiAgLyoqIEhlYWRlcnMgYmVsb25naW5nIHRvIHRoaXMgYWNjb3JkaW9uLiAqL1xuICBwcml2YXRlIF9vd25IZWFkZXJzID0gbmV3IFF1ZXJ5TGlzdDxNYXRFeHBhbnNpb25QYW5lbEhlYWRlcj4oKTtcblxuICAvKiogQWxsIGhlYWRlcnMgaW5zaWRlIHRoZSBhY2NvcmRpb24uIEluY2x1ZGVzIGhlYWRlcnMgaW5zaWRlIG5lc3RlZCBhY2NvcmRpb25zLiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1hdEV4cGFuc2lvblBhbmVsSGVhZGVyLCB7ZGVzY2VuZGFudHM6IHRydWV9KVxuICBfaGVhZGVyczogUXVlcnlMaXN0PE1hdEV4cGFuc2lvblBhbmVsSGVhZGVyPjtcblxuICAvKiogV2hldGhlciB0aGUgZXhwYW5zaW9uIGluZGljYXRvciBzaG91bGQgYmUgaGlkZGVuLiAqL1xuICBASW5wdXQoKVxuICBnZXQgaGlkZVRvZ2dsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faGlkZVRvZ2dsZTtcbiAgfVxuICBzZXQgaGlkZVRvZ2dsZShzaG93OiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9oaWRlVG9nZ2xlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHNob3cpO1xuICB9XG4gIHByaXZhdGUgX2hpZGVUb2dnbGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogRGlzcGxheSBtb2RlIHVzZWQgZm9yIGFsbCBleHBhbnNpb24gcGFuZWxzIGluIHRoZSBhY2NvcmRpb24uIEN1cnJlbnRseSB0d28gZGlzcGxheVxuICAgKiBtb2RlcyBleGlzdDpcbiAgICogIGRlZmF1bHQgLSBhIGd1dHRlci1saWtlIHNwYWNpbmcgaXMgcGxhY2VkIGFyb3VuZCBhbnkgZXhwYW5kZWQgcGFuZWwsIHBsYWNpbmcgdGhlIGV4cGFuZGVkXG4gICAqICAgICBwYW5lbCBhdCBhIGRpZmZlcmVudCBlbGV2YXRpb24gZnJvbSB0aGUgcmVzdCBvZiB0aGUgYWNjb3JkaW9uLlxuICAgKiAgZmxhdCAtIG5vIHNwYWNpbmcgaXMgcGxhY2VkIGFyb3VuZCBleHBhbmRlZCBwYW5lbHMsIHNob3dpbmcgYWxsIHBhbmVscyBhdCB0aGUgc2FtZVxuICAgKiAgICAgZWxldmF0aW9uLlxuICAgKi9cbiAgQElucHV0KCkgZGlzcGxheU1vZGU6IE1hdEFjY29yZGlvbkRpc3BsYXlNb2RlID0gJ2RlZmF1bHQnO1xuXG4gIC8qKiBUaGUgcG9zaXRpb24gb2YgdGhlIGV4cGFuc2lvbiBpbmRpY2F0b3IuICovXG4gIEBJbnB1dCgpIHRvZ2dsZVBvc2l0aW9uOiBNYXRBY2NvcmRpb25Ub2dnbGVQb3NpdGlvbiA9ICdhZnRlcic7XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX2hlYWRlcnMuY2hhbmdlc1xuICAgICAgLnBpcGUoc3RhcnRXaXRoKHRoaXMuX2hlYWRlcnMpKVxuICAgICAgLnN1YnNjcmliZSgoaGVhZGVyczogUXVlcnlMaXN0PE1hdEV4cGFuc2lvblBhbmVsSGVhZGVyPikgPT4ge1xuICAgICAgICB0aGlzLl9vd25IZWFkZXJzLnJlc2V0KGhlYWRlcnMuZmlsdGVyKGhlYWRlciA9PiBoZWFkZXIucGFuZWwuYWNjb3JkaW9uID09PSB0aGlzKSk7XG4gICAgICAgIHRoaXMuX293bkhlYWRlcnMubm90aWZ5T25DaGFuZ2VzKCk7XG4gICAgICB9KTtcblxuICAgIHRoaXMuX2tleU1hbmFnZXIgPSBuZXcgRm9jdXNLZXlNYW5hZ2VyKHRoaXMuX293bkhlYWRlcnMpLndpdGhXcmFwKCkud2l0aEhvbWVBbmRFbmQoKTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGtleWJvYXJkIGV2ZW50cyBjb21pbmcgaW4gZnJvbSB0aGUgcGFuZWwgaGVhZGVycy4gKi9cbiAgX2hhbmRsZUhlYWRlcktleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICB0aGlzLl9rZXlNYW5hZ2VyLm9uS2V5ZG93bihldmVudCk7XG4gIH1cblxuICBfaGFuZGxlSGVhZGVyRm9jdXMoaGVhZGVyOiBNYXRFeHBhbnNpb25QYW5lbEhlYWRlcikge1xuICAgIHRoaXMuX2tleU1hbmFnZXIudXBkYXRlQWN0aXZlSXRlbShoZWFkZXIpO1xuICB9XG5cbiAgb3ZlcnJpZGUgbmdPbkRlc3Ryb3koKSB7XG4gICAgc3VwZXIubmdPbkRlc3Ryb3koKTtcbiAgICB0aGlzLl9vd25IZWFkZXJzLmRlc3Ryb3koKTtcbiAgfVxufVxuIl19