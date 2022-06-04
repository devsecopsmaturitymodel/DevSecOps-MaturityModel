/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Output, Directive, EventEmitter, Input, Optional, ChangeDetectorRef, SkipSelf, Inject, } from '@angular/core';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { CDK_ACCORDION, CdkAccordion } from './accordion';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Subscription } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/collections";
import * as i2 from "./accordion";
/** Used to generate unique ID for each accordion item. */
let nextId = 0;
/**
 * An basic directive expected to be extended and decorated as a component.  Sets up all
 * events and attributes needed to be managed by a CdkAccordion parent.
 */
export class CdkAccordionItem {
    constructor(accordion, _changeDetectorRef, _expansionDispatcher) {
        this.accordion = accordion;
        this._changeDetectorRef = _changeDetectorRef;
        this._expansionDispatcher = _expansionDispatcher;
        /** Subscription to openAll/closeAll events. */
        this._openCloseAllSubscription = Subscription.EMPTY;
        /** Event emitted every time the AccordionItem is closed. */
        this.closed = new EventEmitter();
        /** Event emitted every time the AccordionItem is opened. */
        this.opened = new EventEmitter();
        /** Event emitted when the AccordionItem is destroyed. */
        this.destroyed = new EventEmitter();
        /**
         * Emits whenever the expanded state of the accordion changes.
         * Primarily used to facilitate two-way binding.
         * @docs-private
         */
        this.expandedChange = new EventEmitter();
        /** The unique AccordionItem id. */
        this.id = `cdk-accordion-child-${nextId++}`;
        this._expanded = false;
        this._disabled = false;
        /** Unregister function for _expansionDispatcher. */
        this._removeUniqueSelectionListener = () => { };
        this._removeUniqueSelectionListener = _expansionDispatcher.listen((id, accordionId) => {
            if (this.accordion &&
                !this.accordion.multi &&
                this.accordion.id === accordionId &&
                this.id !== id) {
                this.expanded = false;
            }
        });
        // When an accordion item is hosted in an accordion, subscribe to open/close events.
        if (this.accordion) {
            this._openCloseAllSubscription = this._subscribeToOpenCloseAllActions();
        }
    }
    /** Whether the AccordionItem is expanded. */
    get expanded() {
        return this._expanded;
    }
    set expanded(expanded) {
        expanded = coerceBooleanProperty(expanded);
        // Only emit events and update the internal value if the value changes.
        if (this._expanded !== expanded) {
            this._expanded = expanded;
            this.expandedChange.emit(expanded);
            if (expanded) {
                this.opened.emit();
                /**
                 * In the unique selection dispatcher, the id parameter is the id of the CdkAccordionItem,
                 * the name value is the id of the accordion.
                 */
                const accordionId = this.accordion ? this.accordion.id : this.id;
                this._expansionDispatcher.notify(this.id, accordionId);
            }
            else {
                this.closed.emit();
            }
            // Ensures that the animation will run when the value is set outside of an `@Input`.
            // This includes cases like the open, close and toggle methods.
            this._changeDetectorRef.markForCheck();
        }
    }
    /** Whether the AccordionItem is disabled. */
    get disabled() {
        return this._disabled;
    }
    set disabled(disabled) {
        this._disabled = coerceBooleanProperty(disabled);
    }
    /** Emits an event for the accordion item being destroyed. */
    ngOnDestroy() {
        this.opened.complete();
        this.closed.complete();
        this.destroyed.emit();
        this.destroyed.complete();
        this._removeUniqueSelectionListener();
        this._openCloseAllSubscription.unsubscribe();
    }
    /** Toggles the expanded state of the accordion item. */
    toggle() {
        if (!this.disabled) {
            this.expanded = !this.expanded;
        }
    }
    /** Sets the expanded state of the accordion item to false. */
    close() {
        if (!this.disabled) {
            this.expanded = false;
        }
    }
    /** Sets the expanded state of the accordion item to true. */
    open() {
        if (!this.disabled) {
            this.expanded = true;
        }
    }
    _subscribeToOpenCloseAllActions() {
        return this.accordion._openCloseAllActions.subscribe(expanded => {
            // Only change expanded state if item is enabled
            if (!this.disabled) {
                this.expanded = expanded;
            }
        });
    }
}
CdkAccordionItem.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkAccordionItem, deps: [{ token: CDK_ACCORDION, optional: true, skipSelf: true }, { token: i0.ChangeDetectorRef }, { token: i1.UniqueSelectionDispatcher }], target: i0.ɵɵFactoryTarget.Directive });
CdkAccordionItem.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: CdkAccordionItem, selector: "cdk-accordion-item, [cdkAccordionItem]", inputs: { expanded: "expanded", disabled: "disabled" }, outputs: { closed: "closed", opened: "opened", destroyed: "destroyed", expandedChange: "expandedChange" }, providers: [
        // Provide `CDK_ACCORDION` as undefined to prevent nested accordion items from
        // registering to the same accordion.
        { provide: CDK_ACCORDION, useValue: undefined },
    ], exportAs: ["cdkAccordionItem"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkAccordionItem, decorators: [{
            type: Directive,
            args: [{
                    selector: 'cdk-accordion-item, [cdkAccordionItem]',
                    exportAs: 'cdkAccordionItem',
                    providers: [
                        // Provide `CDK_ACCORDION` as undefined to prevent nested accordion items from
                        // registering to the same accordion.
                        { provide: CDK_ACCORDION, useValue: undefined },
                    ],
                }]
        }], ctorParameters: function () { return [{ type: i2.CdkAccordion, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [CDK_ACCORDION]
                }, {
                    type: SkipSelf
                }] }, { type: i0.ChangeDetectorRef }, { type: i1.UniqueSelectionDispatcher }]; }, propDecorators: { closed: [{
                type: Output
            }], opened: [{
                type: Output
            }], destroyed: [{
                type: Output
            }], expandedChange: [{
                type: Output
            }], expanded: [{
                type: Input
            }], disabled: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3JkaW9uLWl0ZW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL2FjY29yZGlvbi9hY2NvcmRpb24taXRlbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQ0wsTUFBTSxFQUNOLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUVMLFFBQVEsRUFDUixpQkFBaUIsRUFDakIsUUFBUSxFQUNSLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMseUJBQXlCLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNuRSxPQUFPLEVBQUMsYUFBYSxFQUFFLFlBQVksRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUN4RCxPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sTUFBTSxDQUFDOzs7O0FBRWxDLDBEQUEwRDtBQUMxRCxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFFZjs7O0dBR0c7QUFVSCxNQUFNLE9BQU8sZ0JBQWdCO0lBaUUzQixZQUN3RCxTQUF1QixFQUNyRSxrQkFBcUMsRUFDbkMsb0JBQStDO1FBRkgsY0FBUyxHQUFULFNBQVMsQ0FBYztRQUNyRSx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW1CO1FBQ25DLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBMkI7UUFuRTNELCtDQUErQztRQUN2Qyw4QkFBeUIsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDO1FBQ3ZELDREQUE0RDtRQUN6QyxXQUFNLEdBQXVCLElBQUksWUFBWSxFQUFRLENBQUM7UUFDekUsNERBQTREO1FBQ3pDLFdBQU0sR0FBdUIsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQUN6RSx5REFBeUQ7UUFDdEMsY0FBUyxHQUF1QixJQUFJLFlBQVksRUFBUSxDQUFDO1FBRTVFOzs7O1dBSUc7UUFDZ0IsbUJBQWMs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QWM7c0JBQWhDLE1BQU07Z0JBT0gsUUFBUTtzQkFEWCxLQUFLO2dCQWlDRixRQUFRO3NCQURYLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgT3V0cHV0LFxuICBEaXJlY3RpdmUsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBTa2lwU2VsZixcbiAgSW5qZWN0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7VW5pcXVlU2VsZWN0aW9uRGlzcGF0Y2hlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcbmltcG9ydCB7Q0RLX0FDQ09SRElPTiwgQ2RrQWNjb3JkaW9ufSBmcm9tICcuL2FjY29yZGlvbic7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuXG4vKiogVXNlZCB0byBnZW5lcmF0ZSB1bmlxdWUgSUQgZm9yIGVhY2ggYWNjb3JkaW9uIGl0ZW0uICovXG5sZXQgbmV4dElkID0gMDtcblxuLyoqXG4gKiBBbiBiYXNpYyBkaXJlY3RpdmUgZXhwZWN0ZWQgdG8gYmUgZXh0ZW5kZWQgYW5kIGRlY29yYXRlZCBhcyBhIGNvbXBvbmVudC4gIFNldHMgdXAgYWxsXG4gKiBldmVudHMgYW5kIGF0dHJpYnV0ZXMgbmVlZGVkIHRvIGJlIG1hbmFnZWQgYnkgYSBDZGtBY2NvcmRpb24gcGFyZW50LlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdjZGstYWNjb3JkaW9uLWl0ZW0sIFtjZGtBY2NvcmRpb25JdGVtXScsXG4gIGV4cG9ydEFzOiAnY2RrQWNjb3JkaW9uSXRlbScsXG4gIHByb3ZpZGVyczogW1xuICAgIC8vIFByb3ZpZGUgYENES19BQ0NPUkRJT05gIGFzIHVuZGVmaW5lZCB0byBwcmV2ZW50IG5lc3RlZCBhY2NvcmRpb24gaXRlbXMgZnJvbVxuICAgIC8vIHJlZ2lzdGVyaW5nIHRvIHRoZSBzYW1lIGFjY29yZGlvbi5cbiAgICB7cHJvdmlkZTogQ0RLX0FDQ09SRElPTiwgdXNlVmFsdWU6IHVuZGVmaW5lZH0sXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIENka0FjY29yZGlvbkl0ZW0gaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICAvKiogU3Vic2NyaXB0aW9uIHRvIG9wZW5BbGwvY2xvc2VBbGwgZXZlbnRzLiAqL1xuICBwcml2YXRlIF9vcGVuQ2xvc2VBbGxTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG4gIC8qKiBFdmVudCBlbWl0dGVkIGV2ZXJ5IHRpbWUgdGhlIEFjY29yZGlvbkl0ZW0gaXMgY2xvc2VkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2xvc2VkOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG4gIC8qKiBFdmVudCBlbWl0dGVkIGV2ZXJ5IHRpbWUgdGhlIEFjY29yZGlvbkl0ZW0gaXMgb3BlbmVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgb3BlbmVkOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIEFjY29yZGlvbkl0ZW0gaXMgZGVzdHJveWVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgZGVzdHJveWVkOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIEVtaXRzIHdoZW5ldmVyIHRoZSBleHBhbmRlZCBzdGF0ZSBvZiB0aGUgYWNjb3JkaW9uIGNoYW5nZXMuXG4gICAqIFByaW1hcmlseSB1c2VkIHRvIGZhY2lsaXRhdGUgdHdvLXdheSBiaW5kaW5nLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgZXhwYW5kZWRDaGFuZ2U6IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICAvKiogVGhlIHVuaXF1ZSBBY2NvcmRpb25JdGVtIGlkLiAqL1xuICByZWFkb25seSBpZDogc3RyaW5nID0gYGNkay1hY2NvcmRpb24tY2hpbGQtJHtuZXh0SWQrK31gO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBBY2NvcmRpb25JdGVtIGlzIGV4cGFuZGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZXhwYW5kZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2V4cGFuZGVkO1xuICB9XG4gIHNldCBleHBhbmRlZChleHBhbmRlZDogQm9vbGVhbklucHV0KSB7XG4gICAgZXhwYW5kZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkoZXhwYW5kZWQpO1xuXG4gICAgLy8gT25seSBlbWl0IGV2ZW50cyBhbmQgdXBkYXRlIHRoZSBpbnRlcm5hbCB2YWx1ZSBpZiB0aGUgdmFsdWUgY2hhbmdlcy5cbiAgICBpZiAodGhpcy5fZXhwYW5kZWQgIT09IGV4cGFuZGVkKSB7XG4gICAgICB0aGlzLl9leHBhbmRlZCA9IGV4cGFuZGVkO1xuICAgICAgdGhpcy5leHBhbmRlZENoYW5nZS5lbWl0KGV4cGFuZGVkKTtcblxuICAgICAgaWYgKGV4cGFuZGVkKSB7XG4gICAgICAgIHRoaXMub3BlbmVkLmVtaXQoKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluIHRoZSB1bmlxdWUgc2VsZWN0aW9uIGRpc3BhdGNoZXIsIHRoZSBpZCBwYXJhbWV0ZXIgaXMgdGhlIGlkIG9mIHRoZSBDZGtBY2NvcmRpb25JdGVtLFxuICAgICAgICAgKiB0aGUgbmFtZSB2YWx1ZSBpcyB0aGUgaWQgb2YgdGhlIGFjY29yZGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGFjY29yZGlvbklkID0gdGhpcy5hY2NvcmRpb24gPyB0aGlzLmFjY29yZGlvbi5pZCA6IHRoaXMuaWQ7XG4gICAgICAgIHRoaXMuX2V4cGFuc2lvbkRpc3BhdGNoZXIubm90aWZ5KHRoaXMuaWQsIGFjY29yZGlvbklkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY2xvc2VkLmVtaXQoKTtcbiAgICAgIH1cblxuICAgICAgLy8gRW5zdXJlcyB0aGF0IHRoZSBhbmltYXRpb24gd2lsbCBydW4gd2hlbiB0aGUgdmFsdWUgaXMgc2V0IG91dHNpZGUgb2YgYW4gYEBJbnB1dGAuXG4gICAgICAvLyBUaGlzIGluY2x1ZGVzIGNhc2VzIGxpa2UgdGhlIG9wZW4sIGNsb3NlIGFuZCB0b2dnbGUgbWV0aG9kcy5cbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9leHBhbmRlZCA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBBY2NvcmRpb25JdGVtIGlzIGRpc2FibGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkO1xuICB9XG4gIHNldCBkaXNhYmxlZChkaXNhYmxlZDogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkoZGlzYWJsZWQpO1xuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVkID0gZmFsc2U7XG5cbiAgLyoqIFVucmVnaXN0ZXIgZnVuY3Rpb24gZm9yIF9leHBhbnNpb25EaXNwYXRjaGVyLiAqL1xuICBwcml2YXRlIF9yZW1vdmVVbmlxdWVTZWxlY3Rpb25MaXN0ZW5lcjogKCkgPT4gdm9pZCA9ICgpID0+IHt9O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQ0RLX0FDQ09SRElPTikgQFNraXBTZWxmKCkgcHVibGljIGFjY29yZGlvbjogQ2RrQWNjb3JkaW9uLFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcm90ZWN0ZWQgX2V4cGFuc2lvbkRpc3BhdGNoZXI6IFVuaXF1ZVNlbGVjdGlvbkRpc3BhdGNoZXIsXG4gICkge1xuICAgIHRoaXMuX3JlbW92ZVVuaXF1ZVNlbGVjdGlvbkxpc3RlbmVyID0gX2V4cGFuc2lvbkRpc3BhdGNoZXIubGlzdGVuKFxuICAgICAgKGlkOiBzdHJpbmcsIGFjY29yZGlvbklkOiBzdHJpbmcpID0+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHRoaXMuYWNjb3JkaW9uICYmXG4gICAgICAgICAgIXRoaXMuYWNjb3JkaW9uLm11bHRpICYmXG4gICAgICAgICAgdGhpcy5hY2NvcmRpb24uaWQgPT09IGFjY29yZGlvbklkICYmXG4gICAgICAgICAgdGhpcy5pZCAhPT0gaWRcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5leHBhbmRlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICk7XG5cbiAgICAvLyBXaGVuIGFuIGFjY29yZGlvbiBpdGVtIGlzIGhvc3RlZCBpbiBhbiBhY2NvcmRpb24sIHN1YnNjcmliZSB0byBvcGVuL2Nsb3NlIGV2ZW50cy5cbiAgICBpZiAodGhpcy5hY2NvcmRpb24pIHtcbiAgICAgIHRoaXMuX29wZW5DbG9zZUFsbFN1YnNjcmlwdGlvbiA9IHRoaXMuX3N1YnNjcmliZVRvT3BlbkNsb3NlQWxsQWN0aW9ucygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBFbWl0cyBhbiBldmVudCBmb3IgdGhlIGFjY29yZGlvbiBpdGVtIGJlaW5nIGRlc3Ryb3llZC4gKi9cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5vcGVuZWQuY29tcGxldGUoKTtcbiAgICB0aGlzLmNsb3NlZC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuZGVzdHJveWVkLmVtaXQoKTtcbiAgICB0aGlzLmRlc3Ryb3llZC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX3JlbW92ZVVuaXF1ZVNlbGVjdGlvbkxpc3RlbmVyKCk7XG4gICAgdGhpcy5fb3BlbkNsb3NlQWxsU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICAvKiogVG9nZ2xlcyB0aGUgZXhwYW5kZWQgc3RhdGUgb2YgdGhlIGFjY29yZGlvbiBpdGVtLiAqL1xuICB0b2dnbGUoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLmV4cGFuZGVkID0gIXRoaXMuZXhwYW5kZWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqIFNldHMgdGhlIGV4cGFuZGVkIHN0YXRlIG9mIHRoZSBhY2NvcmRpb24gaXRlbSB0byBmYWxzZS4gKi9cbiAgY2xvc2UoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLmV4cGFuZGVkID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqIFNldHMgdGhlIGV4cGFuZGVkIHN0YXRlIG9mIHRoZSBhY2NvcmRpb24gaXRlbSB0byB0cnVlLiAqL1xuICBvcGVuKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5leHBhbmRlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfc3Vic2NyaWJlVG9PcGVuQ2xvc2VBbGxBY3Rpb25zKCk6IFN1YnNjcmlwdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMuYWNjb3JkaW9uLl9vcGVuQ2xvc2VBbGxBY3Rpb25zLnN1YnNjcmliZShleHBhbmRlZCA9PiB7XG4gICAgICAvLyBPbmx5IGNoYW5nZSBleHBhbmRlZCBzdGF0ZSBpZiBpdGVtIGlzIGVuYWJsZWRcbiAgICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgICB0aGlzLmV4cGFuZGVkID0gZXhwYW5kZWQ7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==