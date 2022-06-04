/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directionality } from '@angular/cdk/bidi';
import { DOCUMENT } from '@angular/common';
import { ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, Inject, Input, NgZone, Optional, Output, QueryList, SkipSelf, ViewContainerRef, ChangeDetectorRef, Self, } from '@angular/core';
import { coerceBooleanProperty, coerceNumberProperty, coerceElement, } from '@angular/cdk/coercion';
import { Observable, Subject, merge } from 'rxjs';
import { startWith, take, map, takeUntil, switchMap, tap } from 'rxjs/operators';
import { CDK_DRAG_HANDLE, CdkDragHandle } from './drag-handle';
import { CDK_DRAG_PLACEHOLDER, CdkDragPlaceholder } from './drag-placeholder';
import { CDK_DRAG_PREVIEW, CdkDragPreview } from './drag-preview';
import { CDK_DRAG_PARENT } from '../drag-parent';
import { CDK_DROP_LIST } from './drop-list';
import { DragDrop } from '../drag-drop';
import { CDK_DRAG_CONFIG } from './config';
import { assertElementNode } from './assertions';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/bidi";
import * as i2 from "../drag-drop";
import * as i3 from "./drag-handle";
const DRAG_HOST_CLASS = 'cdk-drag';
/** Element that can be moved inside a CdkDropList container. */
export class CdkDrag {
    constructor(
    /** Element that the draggable is attached to. */
    element, 
    /** Droppable container that the draggable is a part of. */
    dropContainer, 
    /**
     * @deprecated `_document` parameter no longer being used and will be removed.
     * @breaking-change 12.0.0
     */
    _document, _ngZone, _viewContainerRef, config, _dir, dragDrop, _changeDetectorRef, _selfHandle, _parentDrag) {
        this.element = element;
        this.dropContainer = dropContainer;
        this._ngZone = _ngZone;
        this._viewContainerRef = _viewContainerRef;
        this._dir = _dir;
        this._changeDetectorRef = _changeDetectorRef;
        this._selfHandle = _selfHandle;
        this._parentDrag = _parentDrag;
        this._destroyed = new Subject();
        /** Emits when the user starts dragging the item. */
        this.started = new EventEmitter();
        /** Emits when the user has released a drag item, before any animations have started. */
        this.released = new EventEmitter();
        /** Emits when the user stops dragging an item in the container. */
        this.ended = new EventEmitter();
        /** Emits when the user has moved the item into a new container. */
        this.entered = new EventEmitter();
        /** Emits when the user removes the item its container by dragging it into another container. */
        this.exited = new EventEmitter();
        /** Emits when the user drops the item inside a container. */
        this.dropped = new EventEmitter();
        /**
         * Emits as the user is dragging the item. Use with caution,
         * because this event will fire for every pixel that the user has dragged.
         */
        this.moved = new Observable((observer) => {
            const subscription = this._dragRef.moved
                .pipe(map(movedEvent => ({
                source: this,
                pointerPosition: movedEvent.pointerPosition,
                event: movedEvent.event,
                delta: movedEvent.delta,
                distance: movedEvent.distance,
            })))
                .subscribe(observer);
            return () => {
                subscription.unsubscribe();
            };
        });
        this._dragRef = dragDrop.createDrag(element, {
            dragStartThreshold: config && config.dragStartThreshold != null ? config.dragStartThreshold : 5,
            pointerDirectionChangeThreshold: config && config.pointerDirectionChangeThreshold != null
                ? config.pointerDirectionChangeThreshold
                : 5,
            zIndex: config?.zIndex,
        });
        this._dragRef.data = this;
        // We have to keep track of the drag instances in order to be able to match an element to
        // a drag instance. We can't go through the global registry of `DragRef`, because the root
        // element could be different.
        CdkDrag._dragInstances.push(this);
        if (config) {
            this._assignDefaults(config);
        }
        // Note that usually the container is assigned when the drop list is picks up the item, but in
        // some cases (mainly transplanted views with OnPush, see #18341) we may end up in a situation
        // where there are no items on the first change detection pass, but the items get picked up as
        // soon as the user triggers another pass by dragging. This is a problem, because the item would
        // have to switch from standalone mode to drag mode in the middle of the dragging sequence which
        // is too late since the two modes save different kinds of information. We work around it by
        // assigning the drop container both from here and the list.
        if (dropContainer) {
            this._dragRef._withDropContainer(dropContainer._dropListRef);
            dropContainer.addItem(this);
        }
        this._syncInputs(this._dragRef);
        this._handleEvents(this._dragRef);
    }
    /** Whether starting to drag this element is disabled. */
    get disabled() {
        return this._disabled || (this.dropContainer && this.dropContainer.disabled);
    }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
        this._dragRef.disabled = this._disabled;
    }
    /**
     * Returns the element that is being used as a placeholder
     * while the current element is being dragged.
     */
    getPlaceholderElement() {
        return this._dragRef.getPlaceholderElement();
    }
    /** Returns the root draggable element. */
    getRootElement() {
        return this._dragRef.getRootElement();
    }
    /** Resets a standalone drag item to its initial position. */
    reset() {
        this._dragRef.reset();
    }
    /**
     * Gets the pixel coordinates of the draggable outside of a drop container.
     */
    getFreeDragPosition() {
        return this._dragRef.getFreeDragPosition();
    }
    ngAfterViewInit() {
        // Normally this isn't in the zone, but it can cause major performance regressions for apps
        // using `zone-patch-rxjs` because it'll trigger a change detection when it unsubscribes.
        this._ngZone.runOutsideAngular(() => {
            // We need to wait for the zone to stabilize, in order for the reference
            // element to be in the proper place in the DOM. This is mostly relevant
            // for draggable elements inside portals since they get stamped out in
            // their original DOM position and then they get transferred to the portal.
            this._ngZone.onStable.pipe(take(1), takeUntil(this._destroyed)).subscribe(() => {
                this._updateRootElement();
                this._setupHandlesListener();
                if (this.freeDragPosition) {
                    this._dragRef.setFreeDragPosition(this.freeDragPosition);
                }
            });
        });
    }
    ngOnChanges(changes) {
        const rootSelectorChange = changes['rootElementSelector'];
        const positionChange = changes['freeDragPosition'];
        // We don't have to react to the first change since it's being
        // handled in `ngAfterViewInit` where it needs to be deferred.
        if (rootSelectorChange && !rootSelectorChange.firstChange) {
            this._updateRootElement();
        }
        // Skip the first change since it's being handled in `ngAfterViewInit`.
        if (positionChange && !positionChange.firstChange && this.freeDragPosition) {
            this._dragRef.setFreeDragPosition(this.freeDragPosition);
        }
    }
    ngOnDestroy() {
        if (this.dropContainer) {
            this.dropContainer.removeItem(this);
        }
        const index = CdkDrag._dragInstances.indexOf(this);
        if (index > -1) {
            CdkDrag._dragInstances.splice(index, 1);
        }
        // Unnecessary in most cases, but used to avoid extra change detections with `zone-paths-rxjs`.
        this._ngZone.runOutsideAngular(() => {
            this._destroyed.next();
            this._destroyed.complete();
            this._dragRef.dispose();
        });
    }
    /** Syncs the root element with the `DragRef`. */
    _updateRootElement() {
        const element = this.element.nativeElement;
        let rootElement = element;
        if (this.rootElementSelector) {
            rootElement =
                element.closest !== undefined
                    ? element.closest(this.rootElementSelector)
                    : // Comment tag doesn't have closest method, so use parent's one.
                        element.parentElement?.closest(this.rootElementSelector);
        }
        if (rootElement && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            assertElementNode(rootElement, 'cdkDrag');
        }
        this._dragRef.withRootElement(rootElement || element);
    }
    /** Gets the boundary element, based on the `boundaryElement` value. */
    _getBoundaryElement() {
        const boundary = this.boundaryElement;
        if (!boundary) {
            return null;
        }
        if (typeof boundary === 'string') {
            return this.element.nativeElement.closest(boundary);
        }
        return coerceElement(boundary);
    }
    /** Syncs the inputs of the CdkDrag with the options of the underlying DragRef. */
    _syncInputs(ref) {
        ref.beforeStarted.subscribe(() => {
            if (!ref.isDragging()) {
                const dir = this._dir;
                const dragStartDelay = this.dragStartDelay;
                const placeholder = this._placeholderTemplate
                    ? {
                        template: this._placeholderTemplate.templateRef,
                        context: this._placeholderTemplate.data,
                        viewContainer: this._viewContainerRef,
                    }
                    : null;
                const preview = this._previewTemplate
                    ? {
                        template: this._previewTemplate.templateRef,
                        context: this._previewTemplate.data,
                        matchSize: this._previewTemplate.matchSize,
                        viewContainer: this._viewContainerRef,
                    }
                    : null;
                ref.disabled = this.disabled;
                ref.lockAxis = this.lockAxis;
                ref.dragStartDelay =
                    typeof dragStartDelay === 'object' && dragStartDelay
                        ? dragStartDelay
                        : coerceNumberProperty(dragStartDelay);
                ref.constrainPosition = this.constrainPosition;
                ref.previewClass = this.previewClass;
                ref
                    .withBoundaryElement(this._getBoundaryElement())
                    .withPlaceholderTemplate(placeholder)
                    .withPreviewTemplate(preview)
                    .withPreviewContainer(this.previewContainer || 'global');
                if (dir) {
                    ref.withDirection(dir.value);
                }
            }
        });
        // This only needs to be resolved once.
        ref.beforeStarted.pipe(take(1)).subscribe(() => {
            // If we managed to resolve a parent through DI, use it.
            if (this._parentDrag) {
                ref.withParent(this._parentDrag._dragRef);
                return;
            }
            // Otherwise fall back to resolving the parent by looking up the DOM. This can happen if
            // the item was projected into another item by something like `ngTemplateOutlet`.
            let parent = this.element.nativeElement.parentElement;
            while (parent) {
                if (parent.classList.contains(DRAG_HOST_CLASS)) {
                    ref.withParent(CdkDrag._dragInstances.find(drag => {
                        return drag.element.nativeElement === parent;
                    })?._dragRef || null);
                    break;
                }
                parent = parent.parentElement;
            }
        });
    }
    /** Handles the events from the underlying `DragRef`. */
    _handleEvents(ref) {
        ref.started.subscribe(() => {
            this.started.emit({ source: this });
            // Since all of these events run outside of change detection,
            // we need to ensure that everything is marked correctly.
            this._changeDetectorRef.markForCheck();
        });
        ref.released.subscribe(() => {
            this.released.emit({ source: this });
        });
        ref.ended.subscribe(event => {
            this.ended.emit({
                source: this,
                distance: event.distance,
                dropPoint: event.dropPoint,
            });
            // Since all of these events run outside of change detection,
            // we need to ensure that everything is marked correctly.
            this._changeDetectorRef.markForCheck();
        });
        ref.entered.subscribe(event => {
            this.entered.emit({
                container: event.container.data,
                item: this,
                currentIndex: event.currentIndex,
            });
        });
        ref.exited.subscribe(event => {
            this.exited.emit({
                container: event.container.data,
                item: this,
            });
        });
        ref.dropped.subscribe(event => {
            this.dropped.emit({
                previousIndex: event.previousIndex,
                currentIndex: event.currentIndex,
                previousContainer: event.previousContainer.data,
                container: event.container.data,
                isPointerOverContainer: event.isPointerOverContainer,
                item: this,
                distance: event.distance,
                dropPoint: event.dropPoint,
            });
        });
    }
    /** Assigns the default input values based on a provided config object. */
    _assignDefaults(config) {
        const { lockAxis, dragStartDelay, constrainPosition, previewClass, boundaryElement, draggingDisabled, rootElementSelector, previewContainer, } = config;
        this.disabled = draggingDisabled == null ? false : draggingDisabled;
        this.dragStartDelay = dragStartDelay || 0;
        if (lockAxis) {
            this.lockAxis = lockAxis;
        }
        if (constrainPosition) {
            this.constrainPosition = constrainPosition;
        }
        if (previewClass) {
            this.previewClass = previewClass;
        }
        if (boundaryElement) {
            this.boundaryElement = boundaryElement;
        }
        if (rootElementSelector) {
            this.rootElementSelector = rootElementSelector;
        }
        if (previewContainer) {
            this.previewContainer = previewContainer;
        }
    }
    /** Sets up the listener that syncs the handles with the drag ref. */
    _setupHandlesListener() {
        // Listen for any newly-added handles.
        this._handles.changes
            .pipe(startWith(this._handles), 
        // Sync the new handles with the DragRef.
        tap((handles) => {
            const childHandleElements = handles
                .filter(handle => handle._parentDrag === this)
                .map(handle => handle.element);
            // Usually handles are only allowed to be a descendant of the drag element, but if
            // the consumer defined a different drag root, we should allow the drag element
            // itself to be a handle too.
            if (this._selfHandle && this.rootElementSelector) {
                childHandleElements.push(this.element);
            }
            this._dragRef.withHandles(childHandleElements);
        }), 
        // Listen if the state of any of the handles changes.
        switchMap((handles) => {
            return merge(...handles.map(item => {
                return item._stateChanges.pipe(startWith(item));
            }));
        }), takeUntil(this._destroyed))
            .subscribe(handleInstance => {
            // Enabled/disable the handle that changed in the DragRef.
            const dragRef = this._dragRef;
            const handle = handleInstance.element.nativeElement;
            handleInstance.disabled ? dragRef.disableHandle(handle) : dragRef.enableHandle(handle);
        });
    }
}
CdkDrag._dragInstances = [];
CdkDrag.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkDrag, deps: [{ token: i0.ElementRef }, { token: CDK_DROP_LIST, optional: true, skipSelf: true }, { token: DOCUMENT }, { token: i0.NgZone }, { token: i0.ViewContainerRef }, { token: CDK_DRAG_CONFIG, optional: true }, { token: i1.Directionality, optional: true }, { token: i2.DragDrop }, { token: i0.ChangeDetectorRef }, { token: CDK_DRAG_HANDLE, optional: true, self: true }, { token: CDK_DRAG_PARENT, optional: true, skipSelf: true }], target: i0.ɵɵFactoryTarget.Directive });
CdkDrag.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: CdkDrag, selector: "[cdkDrag]", inputs: { data: ["cdkDragData", "data"], lockAxis: ["cdkDragLockAxis", "lockAxis"], rootElementSelector: ["cdkDragRootElement", "rootElementSelector"], boundaryElement: ["cdkDragBoundary", "boundaryElement"], dragStartDelay: ["cdkDragStartDelay", "dragStartDelay"], freeDragPosition: ["cdkDragFreeDragPosition", "freeDragPosition"], disabled: ["cdkDragDisabled", "disabled"], constrainPosition: ["cdkDragConstrainPosition", "constrainPosition"], previewClass: ["cdkDragPreviewClass", "previewClass"], previewContainer: ["cdkDragPreviewContainer", "previewContainer"] }, outputs: { started: "cdkDragStarted", released: "cdkDragReleased", ended: "cdkDragEnded", entered: "cdkDragEntered", exited: "cdkDragExited", dropped: "cdkDragDropped", moved: "cdkDragMoved" }, host: { properties: { "class.cdk-drag-disabled": "disabled", "class.cdk-drag-dragging": "_dragRef.isDragging()" }, classAttribute: "cdk-drag" }, providers: [{ provide: CDK_DRAG_PARENT, useExisting: CdkDrag }], queries: [{ propertyName: "_previewTemplate", first: true, predicate: CDK_DRAG_PREVIEW, descendants: true }, { propertyName: "_placeholderTemplate", first: true, predicate: CDK_DRAG_PLACEHOLDER, descendants: true }, { propertyName: "_handles", predicate: CDK_DRAG_HANDLE, descendants: true }], exportAs: ["cdkDrag"], usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkDrag, decorators: [{
            type: Directive,
            args: [{
                    selector: '[cdkDrag]',
                    exportAs: 'cdkDrag',
                    host: {
                        'class': DRAG_HOST_CLASS,
                        '[class.cdk-drag-disabled]': 'disabled',
                        '[class.cdk-drag-dragging]': '_dragRef.isDragging()',
                    },
                    providers: [{ provide: CDK_DRAG_PARENT, useExisting: CdkDrag }],
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [CDK_DROP_LIST]
                }, {
                    type: Optional
                }, {
                    type: SkipSelf
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.NgZone }, { type: i0.ViewContainerRef }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [CDK_DRAG_CONFIG]
                }] }, { type: i1.Directionality, decorators: [{
                    type: Optional
                }] }, { type: i2.DragDrop }, { type: i0.ChangeDetectorRef }, { type: i3.CdkDragHandle, decorators: [{
                    type: Optional
                }, {
                    type: Self
                }, {
                    type: Inject,
                    args: [CDK_DRAG_HANDLE]
                }] }, { type: CdkDrag, decorators: [{
                    type: Optional
                }, {
                    type: SkipSelf
                }, {
                    type: Inject,
                    args: [CDK_DRAG_PARENT]
                }] }]; }, propDecorators: { _handles: [{
                type: ContentChildren,
                args: [CDK_DRAG_HANDLE, { descendants: true }]
            }], _previewTemplate: [{
                type: ContentChild,
                args: [CDK_DRAG_PREVIEW]
            }], _placeholderTemplate: [{
                type: ContentChild,
                args: [CDK_DRAG_PLACEHOLDER]
            }], data: [{
                type: Input,
                args: ['cdkDragData']
            }], lockAxis: [{
                type: Input,
                args: ['cdkDragLockAxis']
            }], rootElementSelector: [{
                type: Input,
                args: ['cdkDragRootElement']
            }], boundaryElement: [{
                type: Input,
                args: ['cdkDragBoundary']
            }], dragStartDelay: [{
                type: Input,
                args: ['cdkDragStartDelay']
            }], freeDragPosition: [{
                type: Input,
                args: ['cdkDragFreeDragPosition']
            }], disabled: [{
                type: Input,
                args: ['cdkDragDisabled']
            }], constrainPosition: [{
                type: Input,
                args: ['cdkDragConstrainPosition']
            }], previewClass: [{
                type: Input,
                args: ['cdkDragPreviewClass']
            }], previewContainer: [{
                type: Input,
                args: ['cdkDragPreviewContainer']
            }], started: [{
                type: Output,
                args: ['cdkDragStarted']
            }], released: [{
                type: Output,
                args: ['cdkDragReleased']
            }], ended: [{
                type: Output,
                args: ['cdkDragEnded']
            }], entered: [{
                type: Output,
                args: ['cdkDragEntered']
            }], exited: [{
                type: Output,
                args: ['cdkDragExited']
            }], dropped: [{
                type: Output,
                args: ['cdkDragDropped']
            }], moved: [{
                type: Output,
                args: ['cdkDragMoved']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvZHJhZy1kcm9wL2RpcmVjdGl2ZXMvZHJhZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDakQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFFTCxZQUFZLEVBQ1osZUFBZSxFQUNmLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUVOLFFBQVEsRUFDUixNQUFNLEVBQ04sU0FBUyxFQUNULFFBQVEsRUFDUixnQkFBZ0IsRUFHaEIsaUJBQWlCLEVBQ2pCLElBQUksR0FDTCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0wscUJBQXFCLEVBQ3JCLG9CQUFvQixFQUNwQixhQUFhLEdBRWQsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQUMsVUFBVSxFQUFZLE9BQU8sRUFBRSxLQUFLLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDMUQsT0FBTyxFQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFVL0UsT0FBTyxFQUFDLGVBQWUsRUFBRSxhQUFhLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDN0QsT0FBTyxFQUFDLG9CQUFvQixFQUFFLGtCQUFrQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDNUUsT0FBTyxFQUFDLGdCQUFnQixFQUFFLGNBQWMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ2hFLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUUvQyxPQUFPLEVBQUMsYUFBYSxFQUFxQyxNQUFNLGFBQWEsQ0FBQztB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QU07MkJBQUMsZUFBZTs0Q0FsSk0sUUFBUTtzQkFBOUQsZUFBZTt1QkFBQyxlQUFlLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDO2dCQUdyQixnQkFBZ0I7c0JBQS9DLFlBQVk7dUJBQUMsZ0JBQWdCO2dCQUdNLG9CQUFvQjtzQkFBdkQsWUFBWTt1QkFBQyxvQkFBb0I7Z0JBR1osSUFBSTtzQkFBekIsS0FBSzt1QkFBQyxhQUFhO2dCQUdNLFFBQVE7c0JBQWpDLEtBQUs7dUJBQUMsaUJBQWlCO2dCQU9LLG1CQUFtQjtzQkFBL0MsS0FBSzt1QkFBQyxvQkFBb0I7Z0JBUUQsZUFBZTtzQkFBeEMsS0FBSzt1QkFBQyxpQkFBaUI7Z0JBTUksY0FBYztzQkFBekMsS0FBSzt1QkFBQyxtQkFBbUI7Z0JBTVEsZ0JBQWdCO3NCQUFqRCxLQUFLO3VCQUFDLHlCQUF5QjtnQkFJNUIsUUFBUTtzQkFEWCxLQUFLO3VCQUFDLGlCQUFpQjtnQkFnQlcsaUJBQWlCO3NCQUFuRCxLQUFLO3VCQUFDLDBCQUEwQjtnQkFHSCxZQUFZO3NCQUF6QyxLQUFLO3VCQUFDLHFCQUFxQjtnQkFlTSxnQkFBZ0I7c0JBQWpELEtBQUs7dUJBQUMseUJBQXlCO2dCQUdHLE9BQU87c0JBQXpDLE1BQU07dUJBQUMsZ0JBQWdCO2dCQUlZLFFBQVE7c0JBQTNDLE1BQU07dUJBQUMsaUJBQWlCO2dCQUlRLEtBQUs7c0JBQXJDLE1BQU07dUJBQUMsY0FBYztnQkFHYSxPQUFPO3NCQUF6QyxNQUFNO3VCQUFDLGdCQUFnQjtnQkFLVSxNQUFNO3NCQUF2QyxNQUFNO3VCQUFDLGVBQWU7Z0JBS1ksT0FBTztzQkFBekMsTUFBTTt1QkFBQyxnQkFBZ0I7Z0JBU2YsS0FBSztzQkFEYixNQUFNO3VCQUFDLGNBQWMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENvbnRlbnRDaGlsZCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgU2tpcFNlbGYsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIE9uQ2hhbmdlcyxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIFNlbGYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgY29lcmNlQm9vbGVhblByb3BlcnR5LFxuICBjb2VyY2VOdW1iZXJQcm9wZXJ0eSxcbiAgY29lcmNlRWxlbWVudCxcbiAgQm9vbGVhbklucHV0LFxufSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBPYnNlcnZlciwgU3ViamVjdCwgbWVyZ2V9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtzdGFydFdpdGgsIHRha2UsIG1hcCwgdGFrZVVudGlsLCBzd2l0Y2hNYXAsIHRhcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtcbiAgQ2RrRHJhZ0Ryb3AsXG4gIENka0RyYWdFbmQsXG4gIENka0RyYWdFbnRlcixcbiAgQ2RrRHJhZ0V4aXQsXG4gIENka0RyYWdNb3ZlLFxuICBDZGtEcmFnU3RhcnQsXG4gIENka0RyYWdSZWxlYXNlLFxufSBmcm9tICcuLi9kcmFnLWV2ZW50cyc7XG5pbXBvcnQge0NES19EUkFHX0hBTkRMRSwgQ2RrRHJhZ0hhbmRsZX0gZnJvbSAnLi9kcmFnLWhhbmRsZSc7XG5pbXBvcnQge0NES19EUkFHX1BMQUNFSE9MREVSLCBDZGtEcmFnUGxhY2Vob2xkZXJ9IGZyb20gJy4vZHJhZy1wbGFjZWhvbGRlcic7XG5pbXBvcnQge0NES19EUkFHX1BSRVZJRVcsIENka0RyYWdQcmV2aWV3fSBmcm9tICcuL2RyYWctcHJldmlldyc7XG5pbXBvcnQge0NES19EUkFHX1BBUkVOVH0gZnJvbSAnLi4vZHJhZy1wYXJlbnQnO1xuaW1wb3J0IHtEcmFnUmVmLCBQb2ludCwgUHJldmlld0NvbnRhaW5lcn0gZnJvbSAnLi4vZHJhZy1yZWYnO1xuaW1wb3J0IHtDREtfRFJPUF9MSVNULCBDZGtEcm9wTGlzdEludGVybmFsIGFzIENka0Ryb3BMaXN0fSBmcm9tICcuL2Ryb3AtbGlzdCc7XG5pbXBvcnQge0RyYWdEcm9wfSBmcm9tICcuLi9kcmFnLWRyb3AnO1xuaW1wb3J0IHtDREtfRFJBR19DT05GSUcsIERyYWdEcm9wQ29uZmlnLCBEcmFnU3RhcnREZWxheSwgRHJhZ0F4aXN9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7YXNzZXJ0RWxlbWVudE5vZGV9IGZyb20gJy4vYXNzZXJ0aW9ucyc7XG5cbmNvbnN0IERSQUdfSE9TVF9DTEFTUyA9ICdjZGstZHJhZyc7XG5cbi8qKiBFbGVtZW50IHRoYXQgY2FuIGJlIG1vdmVkIGluc2lkZSBhIENka0Ryb3BMaXN0IGNvbnRhaW5lci4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tjZGtEcmFnXScsXG4gIGV4cG9ydEFzOiAnY2RrRHJhZycsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiBEUkFHX0hPU1RfQ0xBU1MsXG4gICAgJ1tjbGFzcy5jZGstZHJhZy1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbY2xhc3MuY2RrLWRyYWctZHJhZ2dpbmddJzogJ19kcmFnUmVmLmlzRHJhZ2dpbmcoKScsXG4gIH0sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBDREtfRFJBR19QQVJFTlQsIHVzZUV4aXN0aW5nOiBDZGtEcmFnfV0sXG59KVxuZXhwb3J0IGNsYXNzIENka0RyYWc8VCA9IGFueT4gaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gIHByaXZhdGUgc3RhdGljIF9kcmFnSW5zdGFuY2VzOiBDZGtEcmFnW10gPSBbXTtcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSB1bmRlcmx5aW5nIGRyYWcgaW5zdGFuY2UuICovXG4gIF9kcmFnUmVmOiBEcmFnUmVmPENka0RyYWc8VD4+O1xuXG4gIC8qKiBFbGVtZW50cyB0aGF0IGNhbiBiZSB1c2VkIHRvIGRyYWcgdGhlIGRyYWdnYWJsZSBpdGVtLiAqL1xuICBAQ29udGVudENoaWxkcmVuKENES19EUkFHX0hBTkRMRSwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX2hhbmRsZXM6IFF1ZXJ5TGlzdDxDZGtEcmFnSGFuZGxlPjtcblxuICAvKiogRWxlbWVudCB0aGF0IHdpbGwgYmUgdXNlZCBhcyBhIHRlbXBsYXRlIHRvIGNyZWF0ZSB0aGUgZHJhZ2dhYmxlIGl0ZW0ncyBwcmV2aWV3LiAqL1xuICBAQ29udGVudENoaWxkKENES19EUkFHX1BSRVZJRVcpIF9wcmV2aWV3VGVtcGxhdGU6IENka0RyYWdQcmV2aWV3O1xuXG4gIC8qKiBUZW1wbGF0ZSBmb3IgcGxhY2Vob2xkZXIgZWxlbWVudCByZW5kZXJlZCB0byBzaG93IHdoZXJlIGEgZHJhZ2dhYmxlIHdvdWxkIGJlIGRyb3BwZWQuICovXG4gIEBDb250ZW50Q2hpbGQoQ0RLX0RSQUdfUExBQ0VIT0xERVIpIF9wbGFjZWhvbGRlclRlbXBsYXRlOiBDZGtEcmFnUGxhY2Vob2xkZXI7XG5cbiAgLyoqIEFyYml0cmFyeSBkYXRhIHRvIGF0dGFjaCB0byB0aGlzIGRyYWcgaW5zdGFuY2UuICovXG4gIEBJbnB1dCgnY2RrRHJhZ0RhdGEnKSBkYXRhOiBUO1xuXG4gIC8qKiBMb2NrcyB0aGUgcG9zaXRpb24gb2YgdGhlIGRyYWdnZWQgZWxlbWVudCBhbG9uZyB0aGUgc3BlY2lmaWVkIGF4aXMuICovXG4gIEBJbnB1dCgnY2RrRHJhZ0xvY2tBeGlzJykgbG9ja0F4aXM6IERyYWdBeGlzO1xuXG4gIC8qKlxuICAgKiBTZWxlY3RvciB0aGF0IHdpbGwgYmUgdXNlZCB0byBkZXRlcm1pbmUgdGhlIHJvb3QgZHJhZ2dhYmxlIGVsZW1lbnQsIHN0YXJ0aW5nIGZyb21cbiAgICogdGhlIGBjZGtEcmFnYCBlbGVtZW50IGFuZCBnb2luZyB1cCB0aGUgRE9NLiBQYXNzaW5nIGFuIGFsdGVybmF0ZSByb290IGVsZW1lbnQgaXMgdXNlZnVsXG4gICAqIHdoZW4gdHJ5aW5nIHRvIGVuYWJsZSBkcmFnZ2luZyBvbiBhbiBlbGVtZW50IHRoYXQgeW91IG1pZ2h0IG5vdCBoYXZlIGFjY2VzcyB0by5cbiAgICovXG4gIEBJbnB1dCgnY2RrRHJhZ1Jvb3RFbGVtZW50Jykgcm9vdEVsZW1lbnRTZWxlY3Rvcjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBOb2RlIG9yIHNlbGVjdG9yIHRoYXQgd2lsbCBiZSB1c2VkIHRvIGRldGVybWluZSB0aGUgZWxlbWVudCB0byB3aGljaCB0aGUgZHJhZ2dhYmxlJ3NcbiAgICogcG9zaXRpb24gd2lsbCBiZSBjb25zdHJhaW5lZC4gSWYgYSBzdHJpbmcgaXMgcGFzc2VkIGluLCBpdCdsbCBiZSB1c2VkIGFzIGEgc2VsZWN0b3IgdGhhdFxuICAgKiB3aWxsIGJlIG1hdGNoZWQgc3RhcnRpbmcgZnJvbSB0aGUgZWxlbWVudCdzIHBhcmVudCBhbmQgZ29pbmcgdXAgdGhlIERPTSB1bnRpbCBhIG1hdGNoXG4gICAqIGhhcyBiZWVuIGZvdW5kLlxuICAgKi9cbiAgQElucHV0KCdjZGtEcmFnQm91bmRhcnknKSBib3VuZGFyeUVsZW1lbnQ6IHN0cmluZyB8IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+IHwgSFRNTEVsZW1lbnQ7XG5cbiAgLyoqXG4gICAqIEFtb3VudCBvZiBtaWxsaXNlY29uZHMgdG8gd2FpdCBhZnRlciB0aGUgdXNlciBoYXMgcHV0IHRoZWlyXG4gICAqIHBvaW50ZXIgZG93biBiZWZvcmUgc3RhcnRpbmcgdG8gZHJhZyB0aGUgZWxlbWVudC5cbiAgICovXG4gIEBJbnB1dCgnY2RrRHJhZ1N0YXJ0RGVsYXknKSBkcmFnU3RhcnREZWxheTogRHJhZ1N0YXJ0RGVsYXk7XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHBvc2l0aW9uIG9mIGEgYENka0RyYWdgIHRoYXQgaXMgb3V0c2lkZSBvZiBhIGRyb3AgY29udGFpbmVyLlxuICAgKiBDYW4gYmUgdXNlZCB0byByZXN0b3JlIHRoZSBlbGVtZW50J3MgcG9zaXRpb24gZm9yIGEgcmV0dXJuaW5nIHVzZXIuXG4gICAqL1xuICBASW5wdXQoJ2Nka0RyYWdGcmVlRHJhZ1Bvc2l0aW9uJykgZnJlZURyYWdQb3NpdGlvbjoge3g6IG51bWJlcjsgeTogbnVtYmVyfTtcblxuICAvKiogV2hldGhlciBzdGFydGluZyB0byBkcmFnIHRoaXMgZWxlbWVudCBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KCdjZGtEcmFnRGlzYWJsZWQnKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkIHx8ICh0aGlzLmRyb3BDb250YWluZXIgJiYgdGhpcy5kcm9wQ29udGFpbmVyLmRpc2FibGVkKTtcbiAgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgICB0aGlzLl9kcmFnUmVmLmRpc2FibGVkID0gdGhpcy5fZGlzYWJsZWQ7XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZWQ6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gY3VzdG9taXplIHRoZSBsb2dpYyBvZiBob3cgdGhlIHBvc2l0aW9uIG9mIHRoZSBkcmFnIGl0ZW1cbiAgICogaXMgbGltaXRlZCB3aGlsZSBpdCdzIGJlaW5nIGRyYWdnZWQuIEdldHMgY2FsbGVkIHdpdGggYSBwb2ludCBjb250YWluaW5nIHRoZSBjdXJyZW50IHBvc2l0aW9uXG4gICAqIG9mIHRoZSB1c2VyJ3MgcG9pbnRlciBvbiB0aGUgcGFnZSBhbmQgc2hvdWxkIHJldHVybiBhIHBvaW50IGRlc2NyaWJpbmcgd2hlcmUgdGhlIGl0ZW0gc2hvdWxkXG4gICAqIGJlIHJlbmRlcmVkLlxuICAgKi9cbiAgQElucHV0KCdjZGtEcmFnQ29uc3RyYWluUG9zaXRpb24nKSBjb25zdHJhaW5Qb3NpdGlvbj86IChwb2ludDogUG9pbnQsIGRyYWdSZWY6IERyYWdSZWYpID0+IFBvaW50O1xuXG4gIC8qKiBDbGFzcyB0byBiZSBhZGRlZCB0byB0aGUgcHJldmlldyBlbGVtZW50LiAqL1xuICBASW5wdXQoJ2Nka0RyYWdQcmV2aWV3Q2xhc3MnKSBwcmV2aWV3Q2xhc3M6IHN0cmluZyB8IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBDb25maWd1cmVzIHRoZSBwbGFjZSBpbnRvIHdoaWNoIHRoZSBwcmV2aWV3IG9mIHRoZSBpdGVtIHdpbGwgYmUgaW5zZXJ0ZWQuIENhbiBiZSBjb25maWd1cmVkXG4gICAqIGdsb2JhbGx5IHRocm91Z2ggYENES19EUk9QX0xJU1RgLiBQb3NzaWJsZSB2YWx1ZXM6XG4gICAqIC0gYGdsb2JhbGAgLSBQcmV2aWV3IHdpbGwgYmUgaW5zZXJ0ZWQgYXQgdGhlIGJvdHRvbSBvZiB0aGUgYDxib2R5PmAuIFRoZSBhZHZhbnRhZ2UgaXMgdGhhdFxuICAgKiB5b3UgZG9uJ3QgaGF2ZSB0byB3b3JyeSBhYm91dCBgb3ZlcmZsb3c6IGhpZGRlbmAgb3IgYHotaW5kZXhgLCBidXQgdGhlIGl0ZW0gd29uJ3QgcmV0YWluXG4gICAqIGl0cyBpbmhlcml0ZWQgc3R5bGVzLlxuICAgKiAtIGBwYXJlbnRgIC0gUHJldmlldyB3aWxsIGJlIGluc2VydGVkIGludG8gdGhlIHBhcmVudCBvZiB0aGUgZHJhZyBpdGVtLiBUaGUgYWR2YW50YWdlIGlzIHRoYXRcbiAgICogaW5oZXJpdGVkIHN0eWxlcyB3aWxsIGJlIHByZXNlcnZlZCwgYnV0IGl0IG1heSBiZSBjbGlwcGVkIGJ5IGBvdmVyZmxvdzogaGlkZGVuYCBvciBub3QgYmVcbiAgICogdmlzaWJsZSBkdWUgdG8gYHotaW5kZXhgLiBGdXJ0aGVybW9yZSwgdGhlIHByZXZpZXcgaXMgZ29pbmcgdG8gaGF2ZSBhbiBlZmZlY3Qgb3ZlciBzZWxlY3RvcnNcbiAgICogbGlrZSBgOm50aC1jaGlsZGAgYW5kIHNvbWUgZmxleGJveCBjb25maWd1cmF0aW9ucy5cbiAgICogLSBgRWxlbWVudFJlZjxIVE1MRWxlbWVudD4gfCBIVE1MRWxlbWVudGAgLSBQcmV2aWV3IHdpbGwgYmUgaW5zZXJ0ZWQgaW50byBhIHNwZWNpZmljIGVsZW1lbnQuXG4gICAqIFNhbWUgYWR2YW50YWdlcyBhbmQgZGlzYWR2YW50YWdlcyBhcyBgcGFyZW50YC5cbiAgICovXG4gIEBJbnB1dCgnY2RrRHJhZ1ByZXZpZXdDb250YWluZXInKSBwcmV2aWV3Q29udGFpbmVyOiBQcmV2aWV3Q29udGFpbmVyO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSB1c2VyIHN0YXJ0cyBkcmFnZ2luZyB0aGUgaXRlbS4gKi9cbiAgQE91dHB1dCgnY2RrRHJhZ1N0YXJ0ZWQnKSByZWFkb25seSBzdGFydGVkOiBFdmVudEVtaXR0ZXI8Q2RrRHJhZ1N0YXJ0PiA9XG4gICAgbmV3IEV2ZW50RW1pdHRlcjxDZGtEcmFnU3RhcnQ+KCk7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIHVzZXIgaGFzIHJlbGVhc2VkIGEgZHJhZyBpdGVtLCBiZWZvcmUgYW55IGFuaW1hdGlvbnMgaGF2ZSBzdGFydGVkLiAqL1xuICBAT3V0cHV0KCdjZGtEcmFnUmVsZWFzZWQnKSByZWFkb25seSByZWxlYXNlZDogRXZlbnRFbWl0dGVyPENka0RyYWdSZWxlYXNlPiA9XG4gICAgbmV3IEV2ZW50RW1pdHRlcjxDZGtEcmFnUmVsZWFzZT4oKTtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgdXNlciBzdG9wcyBkcmFnZ2luZyBhbiBpdGVtIGluIHRoZSBjb250YWluZXIuICovXG4gIEBPdXRwdXQoJ2Nka0RyYWdFbmRlZCcpIHJlYWRvbmx5IGVuZGVkOiBFdmVudEVtaXR0ZXI8Q2RrRHJhZ0VuZD4gPSBuZXcgRXZlbnRFbWl0dGVyPENka0RyYWdFbmQ+KCk7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIHVzZXIgaGFzIG1vdmVkIHRoZSBpdGVtIGludG8gYSBuZXcgY29udGFpbmVyLiAqL1xuICBAT3V0cHV0KCdjZGtEcmFnRW50ZXJlZCcpIHJlYWRvbmx5IGVudGVyZWQ6IEV2ZW50RW1pdHRlcjxDZGtEcmFnRW50ZXI8YW55Pj4gPSBuZXcgRXZlbnRFbWl0dGVyPFxuICAgIENka0RyYWdFbnRlcjxhbnk+XG4gID4oKTtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgdXNlciByZW1vdmVzIHRoZSBpdGVtIGl0cyBjb250YWluZXIgYnkgZHJhZ2dpbmcgaXQgaW50byBhbm90aGVyIGNvbnRhaW5lci4gKi9cbiAgQE91dHB1dCgnY2RrRHJhZ0V4aXRlZCcpIHJlYWRvbmx5IGV4aXRlZDogRXZlbnRFbWl0dGVyPENka0RyYWdFeGl0PGFueT4+ID0gbmV3IEV2ZW50RW1pdHRlcjxcbiAgICBDZGtEcmFnRXhpdDxhbnk+XG4gID4oKTtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgdXNlciBkcm9wcyB0aGUgaXRlbSBpbnNpZGUgYSBjb250YWluZXIuICovXG4gIEBPdXRwdXQoJ2Nka0RyYWdEcm9wcGVkJykgcmVhZG9ubHkgZHJvcHBlZDogRXZlbnRFbWl0dGVyPENka0RyYWdEcm9wPGFueT4+ID0gbmV3IEV2ZW50RW1pdHRlcjxcbiAgICBDZGtEcmFnRHJvcDxhbnk+XG4gID4oKTtcblxuICAvKipcbiAgICogRW1pdHMgYXMgdGhlIHVzZXIgaXMgZHJhZ2dpbmcgdGhlIGl0ZW0uIFVzZSB3aXRoIGNhdXRpb24sXG4gICAqIGJlY2F1c2UgdGhpcyBldmVudCB3aWxsIGZpcmUgZm9yIGV2ZXJ5IHBpeGVsIHRoYXQgdGhlIHVzZXIgaGFzIGRyYWdnZWQuXG4gICAqL1xuICBAT3V0cHV0KCdjZGtEcmFnTW92ZWQnKVxuICByZWFkb25seSBtb3ZlZDogT2JzZXJ2YWJsZTxDZGtEcmFnTW92ZTxUPj4gPSBuZXcgT2JzZXJ2YWJsZShcbiAgICAob2JzZXJ2ZXI6IE9ic2VydmVyPENka0RyYWdNb3ZlPFQ+PikgPT4ge1xuICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gdGhpcy5fZHJhZ1JlZi5tb3ZlZFxuICAgICAgICAucGlwZShcbiAgICAgICAgICBtYXAobW92ZWRFdmVudCA9PiAoe1xuICAgICAgICAgICAgc291cmNlOiB0aGlzLFxuICAgICAgICAgICAgcG9pbnRlclBvc2l0aW9uOiBtb3ZlZEV2ZW50LnBvaW50ZXJQb3NpdGlvbixcbiAgICAgICAgICAgIGV2ZW50OiBtb3ZlZEV2ZW50LmV2ZW50LFxuICAgICAgICAgICAgZGVsdGE6IG1vdmVkRXZlbnQuZGVsdGEsXG4gICAgICAgICAgICBkaXN0YW5jZTogbW92ZWRFdmVudC5kaXN0YW5jZSxcbiAgICAgICAgICB9KSksXG4gICAgICAgIClcbiAgICAgICAgLnN1YnNjcmliZShvYnNlcnZlcik7XG5cbiAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgfTtcbiAgICB9LFxuICApO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBFbGVtZW50IHRoYXQgdGhlIGRyYWdnYWJsZSBpcyBhdHRhY2hlZCB0by4gKi9cbiAgICBwdWJsaWMgZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgLyoqIERyb3BwYWJsZSBjb250YWluZXIgdGhhdCB0aGUgZHJhZ2dhYmxlIGlzIGEgcGFydCBvZi4gKi9cbiAgICBASW5qZWN0KENES19EUk9QX0xJU1QpIEBPcHRpb25hbCgpIEBTa2lwU2VsZigpIHB1YmxpYyBkcm9wQ29udGFpbmVyOiBDZGtEcm9wTGlzdCxcbiAgICAvKipcbiAgICAgKiBAZGVwcmVjYXRlZCBgX2RvY3VtZW50YCBwYXJhbWV0ZXIgbm8gbG9uZ2VyIGJlaW5nIHVzZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZC5cbiAgICAgKiBAYnJlYWtpbmctY2hhbmdlIDEyLjAuMFxuICAgICAqL1xuICAgIEBJbmplY3QoRE9DVU1FTlQpIF9kb2N1bWVudDogYW55LFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgIHByaXZhdGUgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChDREtfRFJBR19DT05GSUcpIGNvbmZpZzogRHJhZ0Ryb3BDb25maWcsXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICBkcmFnRHJvcDogRHJhZ0Ryb3AsXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgQEluamVjdChDREtfRFJBR19IQU5ETEUpIHByaXZhdGUgX3NlbGZIYW5kbGU/OiBDZGtEcmFnSGFuZGxlLFxuICAgIEBPcHRpb25hbCgpIEBTa2lwU2VsZigpIEBJbmplY3QoQ0RLX0RSQUdfUEFSRU5UKSBwcml2YXRlIF9wYXJlbnREcmFnPzogQ2RrRHJhZyxcbiAgKSB7XG4gICAgdGhpcy5fZHJhZ1JlZiA9IGRyYWdEcm9wLmNyZWF0ZURyYWcoZWxlbWVudCwge1xuICAgICAgZHJhZ1N0YXJ0VGhyZXNob2xkOlxuICAgICAgICBjb25maWcgJiYgY29uZmlnLmRyYWdTdGFydFRocmVzaG9sZCAhPSBudWxsID8gY29uZmlnLmRyYWdTdGFydFRocmVzaG9sZCA6IDUsXG4gICAgICBwb2ludGVyRGlyZWN0aW9uQ2hhbmdlVGhyZXNob2xkOlxuICAgICAgICBjb25maWcgJiYgY29uZmlnLnBvaW50ZXJEaXJlY3Rpb25DaGFuZ2VUaHJlc2hvbGQgIT0gbnVsbFxuICAgICAgICAgID8gY29uZmlnLnBvaW50ZXJEaXJlY3Rpb25DaGFuZ2VUaHJlc2hvbGRcbiAgICAgICAgICA6IDUsXG4gICAgICB6SW5kZXg6IGNvbmZpZz8uekluZGV4LFxuICAgIH0pO1xuICAgIHRoaXMuX2RyYWdSZWYuZGF0YSA9IHRoaXM7XG5cbiAgICAvLyBXZSBoYXZlIHRvIGtlZXAgdHJhY2sgb2YgdGhlIGRyYWcgaW5zdGFuY2VzIGluIG9yZGVyIHRvIGJlIGFibGUgdG8gbWF0Y2ggYW4gZWxlbWVudCB0b1xuICAgIC8vIGEgZHJhZyBpbnN0YW5jZS4gV2UgY2FuJ3QgZ28gdGhyb3VnaCB0aGUgZ2xvYmFsIHJlZ2lzdHJ5IG9mIGBEcmFnUmVmYCwgYmVjYXVzZSB0aGUgcm9vdFxuICAgIC8vIGVsZW1lbnQgY291bGQgYmUgZGlmZmVyZW50LlxuICAgIENka0RyYWcuX2RyYWdJbnN0YW5jZXMucHVzaCh0aGlzKTtcblxuICAgIGlmIChjb25maWcpIHtcbiAgICAgIHRoaXMuX2Fzc2lnbkRlZmF1bHRzKGNvbmZpZyk7XG4gICAgfVxuXG4gICAgLy8gTm90ZSB0aGF0IHVzdWFsbHkgdGhlIGNvbnRhaW5lciBpcyBhc3NpZ25lZCB3aGVuIHRoZSBkcm9wIGxpc3QgaXMgcGlja3MgdXAgdGhlIGl0ZW0sIGJ1dCBpblxuICAgIC8vIHNvbWUgY2FzZXMgKG1haW5seSB0cmFuc3BsYW50ZWQgdmlld3Mgd2l0aCBPblB1c2gsIHNlZSAjMTgzNDEpIHdlIG1heSBlbmQgdXAgaW4gYSBzaXR1YXRpb25cbiAgICAvLyB3aGVyZSB0aGVyZSBhcmUgbm8gaXRlbXMgb24gdGhlIGZpcnN0IGNoYW5nZSBkZXRlY3Rpb24gcGFzcywgYnV0IHRoZSBpdGVtcyBnZXQgcGlja2VkIHVwIGFzXG4gICAgLy8gc29vbiBhcyB0aGUgdXNlciB0cmlnZ2VycyBhbm90aGVyIHBhc3MgYnkgZHJhZ2dpbmcuIFRoaXMgaXMgYSBwcm9ibGVtLCBiZWNhdXNlIHRoZSBpdGVtIHdvdWxkXG4gICAgLy8gaGF2ZSB0byBzd2l0Y2ggZnJvbSBzdGFuZGFsb25lIG1vZGUgdG8gZHJhZyBtb2RlIGluIHRoZSBtaWRkbGUgb2YgdGhlIGRyYWdnaW5nIHNlcXVlbmNlIHdoaWNoXG4gICAgLy8gaXMgdG9vIGxhdGUgc2luY2UgdGhlIHR3byBtb2RlcyBzYXZlIGRpZmZlcmVudCBraW5kcyBvZiBpbmZvcm1hdGlvbi4gV2Ugd29yayBhcm91bmQgaXQgYnlcbiAgICAvLyBhc3NpZ25pbmcgdGhlIGRyb3AgY29udGFpbmVyIGJvdGggZnJvbSBoZXJlIGFuZCB0aGUgbGlzdC5cbiAgICBpZiAoZHJvcENvbnRhaW5lcikge1xuICAgICAgdGhpcy5fZHJhZ1JlZi5fd2l0aERyb3BDb250YWluZXIoZHJvcENvbnRhaW5lci5fZHJvcExpc3RSZWYpO1xuICAgICAgZHJvcENvbnRhaW5lci5hZGRJdGVtKHRoaXMpO1xuICAgIH1cblxuICAgIHRoaXMuX3N5bmNJbnB1dHModGhpcy5fZHJhZ1JlZik7XG4gICAgdGhpcy5faGFuZGxlRXZlbnRzKHRoaXMuX2RyYWdSZWYpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGVsZW1lbnQgdGhhdCBpcyBiZWluZyB1c2VkIGFzIGEgcGxhY2Vob2xkZXJcbiAgICogd2hpbGUgdGhlIGN1cnJlbnQgZWxlbWVudCBpcyBiZWluZyBkcmFnZ2VkLlxuICAgKi9cbiAgZ2V0UGxhY2Vob2xkZXJFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcbiAgICByZXR1cm4gdGhpcy5fZHJhZ1JlZi5nZXRQbGFjZWhvbGRlckVsZW1lbnQoKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRoZSByb290IGRyYWdnYWJsZSBlbGVtZW50LiAqL1xuICBnZXRSb290RWxlbWVudCgpOiBIVE1MRWxlbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuX2RyYWdSZWYuZ2V0Um9vdEVsZW1lbnQoKTtcbiAgfVxuXG4gIC8qKiBSZXNldHMgYSBzdGFuZGFsb25lIGRyYWcgaXRlbSB0byBpdHMgaW5pdGlhbCBwb3NpdGlvbi4gKi9cbiAgcmVzZXQoKTogdm9pZCB7XG4gICAgdGhpcy5fZHJhZ1JlZi5yZXNldCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHBpeGVsIGNvb3JkaW5hdGVzIG9mIHRoZSBkcmFnZ2FibGUgb3V0c2lkZSBvZiBhIGRyb3AgY29udGFpbmVyLlxuICAgKi9cbiAgZ2V0RnJlZURyYWdQb3NpdGlvbigpOiB7cmVhZG9ubHkgeDogbnVtYmVyOyByZWFkb25seSB5OiBudW1iZXJ9IHtcbiAgICByZXR1cm4gdGhpcy5fZHJhZ1JlZi5nZXRGcmVlRHJhZ1Bvc2l0aW9uKCk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgLy8gTm9ybWFsbHkgdGhpcyBpc24ndCBpbiB0aGUgem9uZSwgYnV0IGl0IGNhbiBjYXVzZSBtYWpvciBwZXJmb3JtYW5jZSByZWdyZXNzaW9ucyBmb3IgYXBwc1xuICAgIC8vIHVzaW5nIGB6b25lLXBhdGNoLXJ4anNgIGJlY2F1c2UgaXQnbGwgdHJpZ2dlciBhIGNoYW5nZSBkZXRlY3Rpb24gd2hlbiBpdCB1bnN1YnNjcmliZXMuXG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIC8vIFdlIG5lZWQgdG8gd2FpdCBmb3IgdGhlIHpvbmUgdG8gc3RhYmlsaXplLCBpbiBvcmRlciBmb3IgdGhlIHJlZmVyZW5jZVxuICAgICAgLy8gZWxlbWVudCB0byBiZSBpbiB0aGUgcHJvcGVyIHBsYWNlIGluIHRoZSBET00uIFRoaXMgaXMgbW9zdGx5IHJlbGV2YW50XG4gICAgICAvLyBmb3IgZHJhZ2dhYmxlIGVsZW1lbnRzIGluc2lkZSBwb3J0YWxzIHNpbmNlIHRoZXkgZ2V0IHN0YW1wZWQgb3V0IGluXG4gICAgICAvLyB0aGVpciBvcmlnaW5hbCBET00gcG9zaXRpb24gYW5kIHRoZW4gdGhleSBnZXQgdHJhbnNmZXJyZWQgdG8gdGhlIHBvcnRhbC5cbiAgICAgIHRoaXMuX25nWm9uZS5vblN0YWJsZS5waXBlKHRha2UoMSksIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLl91cGRhdGVSb290RWxlbWVudCgpO1xuICAgICAgICB0aGlzLl9zZXR1cEhhbmRsZXNMaXN0ZW5lcigpO1xuXG4gICAgICAgIGlmICh0aGlzLmZyZWVEcmFnUG9zaXRpb24pIHtcbiAgICAgICAgICB0aGlzLl9kcmFnUmVmLnNldEZyZWVEcmFnUG9zaXRpb24odGhpcy5mcmVlRHJhZ1Bvc2l0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgY29uc3Qgcm9vdFNlbGVjdG9yQ2hhbmdlID0gY2hhbmdlc1sncm9vdEVsZW1lbnRTZWxlY3RvciddO1xuICAgIGNvbnN0IHBvc2l0aW9uQ2hhbmdlID0gY2hhbmdlc1snZnJlZURyYWdQb3NpdGlvbiddO1xuXG4gICAgLy8gV2UgZG9uJ3QgaGF2ZSB0byByZWFjdCB0byB0aGUgZmlyc3QgY2hhbmdlIHNpbmNlIGl0J3MgYmVpbmdcbiAgICAvLyBoYW5kbGVkIGluIGBuZ0FmdGVyVmlld0luaXRgIHdoZXJlIGl0IG5lZWRzIHRvIGJlIGRlZmVycmVkLlxuICAgIGlmIChyb290U2VsZWN0b3JDaGFuZ2UgJiYgIXJvb3RTZWxlY3RvckNoYW5nZS5maXJzdENoYW5nZSkge1xuICAgICAgdGhpcy5fdXBkYXRlUm9vdEVsZW1lbnQoKTtcbiAgICB9XG5cbiAgICAvLyBTa2lwIHRoZSBmaXJzdCBjaGFuZ2Ugc2luY2UgaXQncyBiZWluZyBoYW5kbGVkIGluIGBuZ0FmdGVyVmlld0luaXRgLlxuICAgIGlmIChwb3NpdGlvbkNoYW5nZSAmJiAhcG9zaXRpb25DaGFuZ2UuZmlyc3RDaGFuZ2UgJiYgdGhpcy5mcmVlRHJhZ1Bvc2l0aW9uKSB7XG4gICAgICB0aGlzLl9kcmFnUmVmLnNldEZyZWVEcmFnUG9zaXRpb24odGhpcy5mcmVlRHJhZ1Bvc2l0aW9uKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5kcm9wQ29udGFpbmVyKSB7XG4gICAgICB0aGlzLmRyb3BDb250YWluZXIucmVtb3ZlSXRlbSh0aGlzKTtcbiAgICB9XG5cbiAgICBjb25zdCBpbmRleCA9IENka0RyYWcuX2RyYWdJbnN0YW5jZXMuaW5kZXhPZih0aGlzKTtcbiAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgQ2RrRHJhZy5fZHJhZ0luc3RhbmNlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cblxuICAgIC8vIFVubmVjZXNzYXJ5IGluIG1vc3QgY2FzZXMsIGJ1dCB1c2VkIHRvIGF2b2lkIGV4dHJhIGNoYW5nZSBkZXRlY3Rpb25zIHdpdGggYHpvbmUtcGF0aHMtcnhqc2AuXG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuX2Rlc3Ryb3llZC5uZXh0KCk7XG4gICAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgICAgIHRoaXMuX2RyYWdSZWYuZGlzcG9zZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIFN5bmNzIHRoZSByb290IGVsZW1lbnQgd2l0aCB0aGUgYERyYWdSZWZgLiAqL1xuICBwcml2YXRlIF91cGRhdGVSb290RWxlbWVudCgpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgbGV0IHJvb3RFbGVtZW50ID0gZWxlbWVudDtcbiAgICBpZiAodGhpcy5yb290RWxlbWVudFNlbGVjdG9yKSB7XG4gICAgICByb290RWxlbWVudCA9XG4gICAgICAgIGVsZW1lbnQuY2xvc2VzdCAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgPyAoZWxlbWVudC5jbG9zZXN0KHRoaXMucm9vdEVsZW1lbnRTZWxlY3RvcikgYXMgSFRNTEVsZW1lbnQpXG4gICAgICAgICAgOiAvLyBDb21tZW50IHRhZyBkb2Vzbid0IGhhdmUgY2xvc2VzdCBtZXRob2QsIHNvIHVzZSBwYXJlbnQncyBvbmUuXG4gICAgICAgICAgICAoZWxlbWVudC5wYXJlbnRFbGVtZW50Py5jbG9zZXN0KHRoaXMucm9vdEVsZW1lbnRTZWxlY3RvcikgYXMgSFRNTEVsZW1lbnQpO1xuICAgIH1cblxuICAgIGlmIChyb290RWxlbWVudCAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgYXNzZXJ0RWxlbWVudE5vZGUocm9vdEVsZW1lbnQsICdjZGtEcmFnJyk7XG4gICAgfVxuXG4gICAgdGhpcy5fZHJhZ1JlZi53aXRoUm9vdEVsZW1lbnQocm9vdEVsZW1lbnQgfHwgZWxlbWVudCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgYm91bmRhcnkgZWxlbWVudCwgYmFzZWQgb24gdGhlIGBib3VuZGFyeUVsZW1lbnRgIHZhbHVlLiAqL1xuICBwcml2YXRlIF9nZXRCb3VuZGFyeUVsZW1lbnQoKSB7XG4gICAgY29uc3QgYm91bmRhcnkgPSB0aGlzLmJvdW5kYXJ5RWxlbWVudDtcblxuICAgIGlmICghYm91bmRhcnkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgYm91bmRhcnkgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2xvc2VzdDxIVE1MRWxlbWVudD4oYm91bmRhcnkpO1xuICAgIH1cblxuICAgIHJldHVybiBjb2VyY2VFbGVtZW50KGJvdW5kYXJ5KTtcbiAgfVxuXG4gIC8qKiBTeW5jcyB0aGUgaW5wdXRzIG9mIHRoZSBDZGtEcmFnIHdpdGggdGhlIG9wdGlvbnMgb2YgdGhlIHVuZGVybHlpbmcgRHJhZ1JlZi4gKi9cbiAgcHJpdmF0ZSBfc3luY0lucHV0cyhyZWY6IERyYWdSZWY8Q2RrRHJhZzxUPj4pIHtcbiAgICByZWYuYmVmb3JlU3RhcnRlZC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaWYgKCFyZWYuaXNEcmFnZ2luZygpKSB7XG4gICAgICAgIGNvbnN0IGRpciA9IHRoaXMuX2RpcjtcbiAgICAgICAgY29uc3QgZHJhZ1N0YXJ0RGVsYXkgPSB0aGlzLmRyYWdTdGFydERlbGF5O1xuICAgICAgICBjb25zdCBwbGFjZWhvbGRlciA9IHRoaXMuX3BsYWNlaG9sZGVyVGVtcGxhdGVcbiAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgdGVtcGxhdGU6IHRoaXMuX3BsYWNlaG9sZGVyVGVtcGxhdGUudGVtcGxhdGVSZWYsXG4gICAgICAgICAgICAgIGNvbnRleHQ6IHRoaXMuX3BsYWNlaG9sZGVyVGVtcGxhdGUuZGF0YSxcbiAgICAgICAgICAgICAgdmlld0NvbnRhaW5lcjogdGhpcy5fdmlld0NvbnRhaW5lclJlZixcbiAgICAgICAgICAgIH1cbiAgICAgICAgICA6IG51bGw7XG4gICAgICAgIGNvbnN0IHByZXZpZXcgPSB0aGlzLl9wcmV2aWV3VGVtcGxhdGVcbiAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgdGVtcGxhdGU6IHRoaXMuX3ByZXZpZXdUZW1wbGF0ZS50ZW1wbGF0ZVJlZixcbiAgICAgICAgICAgICAgY29udGV4dDogdGhpcy5fcHJldmlld1RlbXBsYXRlLmRhdGEsXG4gICAgICAgICAgICAgIG1hdGNoU2l6ZTogdGhpcy5fcHJldmlld1RlbXBsYXRlLm1hdGNoU2l6ZSxcbiAgICAgICAgICAgICAgdmlld0NvbnRhaW5lcjogdGhpcy5fdmlld0NvbnRhaW5lclJlZixcbiAgICAgICAgICAgIH1cbiAgICAgICAgICA6IG51bGw7XG5cbiAgICAgICAgcmVmLmRpc2FibGVkID0gdGhpcy5kaXNhYmxlZDtcbiAgICAgICAgcmVmLmxvY2tBeGlzID0gdGhpcy5sb2NrQXhpcztcbiAgICAgICAgcmVmLmRyYWdTdGFydERlbGF5ID1cbiAgICAgICAgICB0eXBlb2YgZHJhZ1N0YXJ0RGVsYXkgPT09ICdvYmplY3QnICYmIGRyYWdTdGFydERlbGF5XG4gICAgICAgICAgICA/IGRyYWdTdGFydERlbGF5XG4gICAgICAgICAgICA6IGNvZXJjZU51bWJlclByb3BlcnR5KGRyYWdTdGFydERlbGF5KTtcbiAgICAgICAgcmVmLmNvbnN0cmFpblBvc2l0aW9uID0gdGhpcy5jb25zdHJhaW5Qb3NpdGlvbjtcbiAgICAgICAgcmVmLnByZXZpZXdDbGFzcyA9IHRoaXMucHJldmlld0NsYXNzO1xuICAgICAgICByZWZcbiAgICAgICAgICAud2l0aEJvdW5kYXJ5RWxlbWVudCh0aGlzLl9nZXRCb3VuZGFyeUVsZW1lbnQoKSlcbiAgICAgICAgICAud2l0aFBsYWNlaG9sZGVyVGVtcGxhdGUocGxhY2Vob2xkZXIpXG4gICAgICAgICAgLndpdGhQcmV2aWV3VGVtcGxhdGUocHJldmlldylcbiAgICAgICAgICAud2l0aFByZXZpZXdDb250YWluZXIodGhpcy5wcmV2aWV3Q29udGFpbmVyIHx8ICdnbG9iYWwnKTtcblxuICAgICAgICBpZiAoZGlyKSB7XG4gICAgICAgICAgcmVmLndpdGhEaXJlY3Rpb24oZGlyLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gVGhpcyBvbmx5IG5lZWRzIHRvIGJlIHJlc29sdmVkIG9uY2UuXG4gICAgcmVmLmJlZm9yZVN0YXJ0ZWQucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgLy8gSWYgd2UgbWFuYWdlZCB0byByZXNvbHZlIGEgcGFyZW50IHRocm91Z2ggREksIHVzZSBpdC5cbiAgICAgIGlmICh0aGlzLl9wYXJlbnREcmFnKSB7XG4gICAgICAgIHJlZi53aXRoUGFyZW50KHRoaXMuX3BhcmVudERyYWcuX2RyYWdSZWYpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIE90aGVyd2lzZSBmYWxsIGJhY2sgdG8gcmVzb2x2aW5nIHRoZSBwYXJlbnQgYnkgbG9va2luZyB1cCB0aGUgRE9NLiBUaGlzIGNhbiBoYXBwZW4gaWZcbiAgICAgIC8vIHRoZSBpdGVtIHdhcyBwcm9qZWN0ZWQgaW50byBhbm90aGVyIGl0ZW0gYnkgc29tZXRoaW5nIGxpa2UgYG5nVGVtcGxhdGVPdXRsZXRgLlxuICAgICAgbGV0IHBhcmVudCA9IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICB3aGlsZSAocGFyZW50KSB7XG4gICAgICAgIGlmIChwYXJlbnQuY2xhc3NMaXN0LmNvbnRhaW5zKERSQUdfSE9TVF9DTEFTUykpIHtcbiAgICAgICAgICByZWYud2l0aFBhcmVudChcbiAgICAgICAgICAgIENka0RyYWcuX2RyYWdJbnN0YW5jZXMuZmluZChkcmFnID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGRyYWcuZWxlbWVudC5uYXRpdmVFbGVtZW50ID09PSBwYXJlbnQ7XG4gICAgICAgICAgICB9KT8uX2RyYWdSZWYgfHwgbnVsbCxcbiAgICAgICAgICApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMgdGhlIGV2ZW50cyBmcm9tIHRoZSB1bmRlcmx5aW5nIGBEcmFnUmVmYC4gKi9cbiAgcHJpdmF0ZSBfaGFuZGxlRXZlbnRzKHJlZjogRHJhZ1JlZjxDZGtEcmFnPFQ+Pikge1xuICAgIHJlZi5zdGFydGVkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLnN0YXJ0ZWQuZW1pdCh7c291cmNlOiB0aGlzfSk7XG5cbiAgICAgIC8vIFNpbmNlIGFsbCBvZiB0aGVzZSBldmVudHMgcnVuIG91dHNpZGUgb2YgY2hhbmdlIGRldGVjdGlvbixcbiAgICAgIC8vIHdlIG5lZWQgdG8gZW5zdXJlIHRoYXQgZXZlcnl0aGluZyBpcyBtYXJrZWQgY29ycmVjdGx5LlxuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfSk7XG5cbiAgICByZWYucmVsZWFzZWQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMucmVsZWFzZWQuZW1pdCh7c291cmNlOiB0aGlzfSk7XG4gICAgfSk7XG5cbiAgICByZWYuZW5kZWQuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgIHRoaXMuZW5kZWQuZW1pdCh7XG4gICAgICAgIHNvdXJjZTogdGhpcyxcbiAgICAgICAgZGlzdGFuY2U6IGV2ZW50LmRpc3RhbmNlLFxuICAgICAgICBkcm9wUG9pbnQ6IGV2ZW50LmRyb3BQb2ludCxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBTaW5jZSBhbGwgb2YgdGhlc2UgZXZlbnRzIHJ1biBvdXRzaWRlIG9mIGNoYW5nZSBkZXRlY3Rpb24sXG4gICAgICAvLyB3ZSBuZWVkIHRvIGVuc3VyZSB0aGF0IGV2ZXJ5dGhpbmcgaXMgbWFya2VkIGNvcnJlY3RseS5cbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuXG4gICAgcmVmLmVudGVyZWQuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgIHRoaXMuZW50ZXJlZC5lbWl0KHtcbiAgICAgICAgY29udGFpbmVyOiBldmVudC5jb250YWluZXIuZGF0YSxcbiAgICAgICAgaXRlbTogdGhpcyxcbiAgICAgICAgY3VycmVudEluZGV4OiBldmVudC5jdXJyZW50SW5kZXgsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJlZi5leGl0ZWQuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgIHRoaXMuZXhpdGVkLmVtaXQoe1xuICAgICAgICBjb250YWluZXI6IGV2ZW50LmNvbnRhaW5lci5kYXRhLFxuICAgICAgICBpdGVtOiB0aGlzLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZWYuZHJvcHBlZC5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgdGhpcy5kcm9wcGVkLmVtaXQoe1xuICAgICAgICBwcmV2aW91c0luZGV4OiBldmVudC5wcmV2aW91c0luZGV4LFxuICAgICAgICBjdXJyZW50SW5kZXg6IGV2ZW50LmN1cnJlbnRJbmRleCxcbiAgICAgICAgcHJldmlvdXNDb250YWluZXI6IGV2ZW50LnByZXZpb3VzQ29udGFpbmVyLmRhdGEsXG4gICAgICAgIGNvbnRhaW5lcjogZXZlbnQuY29udGFpbmVyLmRhdGEsXG4gICAgICAgIGlzUG9pbnRlck92ZXJDb250YWluZXI6IGV2ZW50LmlzUG9pbnRlck92ZXJDb250YWluZXIsXG4gICAgICAgIGl0ZW06IHRoaXMsXG4gICAgICAgIGRpc3RhbmNlOiBldmVudC5kaXN0YW5jZSxcbiAgICAgICAgZHJvcFBvaW50OiBldmVudC5kcm9wUG9pbnQsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBBc3NpZ25zIHRoZSBkZWZhdWx0IGlucHV0IHZhbHVlcyBiYXNlZCBvbiBhIHByb3ZpZGVkIGNvbmZpZyBvYmplY3QuICovXG4gIHByaXZhdGUgX2Fzc2lnbkRlZmF1bHRzKGNvbmZpZzogRHJhZ0Ryb3BDb25maWcpIHtcbiAgICBjb25zdCB7XG4gICAgICBsb2NrQXhpcyxcbiAgICAgIGRyYWdTdGFydERlbGF5LFxuICAgICAgY29uc3RyYWluUG9zaXRpb24sXG4gICAgICBwcmV2aWV3Q2xhc3MsXG4gICAgICBib3VuZGFyeUVsZW1lbnQsXG4gICAgICBkcmFnZ2luZ0Rpc2FibGVkLFxuICAgICAgcm9vdEVsZW1lbnRTZWxlY3RvcixcbiAgICAgIHByZXZpZXdDb250YWluZXIsXG4gICAgfSA9IGNvbmZpZztcblxuICAgIHRoaXMuZGlzYWJsZWQgPSBkcmFnZ2luZ0Rpc2FibGVkID09IG51bGwgPyBmYWxzZSA6IGRyYWdnaW5nRGlzYWJsZWQ7XG4gICAgdGhpcy5kcmFnU3RhcnREZWxheSA9IGRyYWdTdGFydERlbGF5IHx8IDA7XG5cbiAgICBpZiAobG9ja0F4aXMpIHtcbiAgICAgIHRoaXMubG9ja0F4aXMgPSBsb2NrQXhpcztcbiAgICB9XG5cbiAgICBpZiAoY29uc3RyYWluUG9zaXRpb24pIHtcbiAgICAgIHRoaXMuY29uc3RyYWluUG9zaXRpb24gPSBjb25zdHJhaW5Qb3NpdGlvbjtcbiAgICB9XG5cbiAgICBpZiAocHJldmlld0NsYXNzKSB7XG4gICAgICB0aGlzLnByZXZpZXdDbGFzcyA9IHByZXZpZXdDbGFzcztcbiAgICB9XG5cbiAgICBpZiAoYm91bmRhcnlFbGVtZW50KSB7XG4gICAgICB0aGlzLmJvdW5kYXJ5RWxlbWVudCA9IGJvdW5kYXJ5RWxlbWVudDtcbiAgICB9XG5cbiAgICBpZiAocm9vdEVsZW1lbnRTZWxlY3Rvcikge1xuICAgICAgdGhpcy5yb290RWxlbWVudFNlbGVjdG9yID0gcm9vdEVsZW1lbnRTZWxlY3RvcjtcbiAgICB9XG5cbiAgICBpZiAocHJldmlld0NvbnRhaW5lcikge1xuICAgICAgdGhpcy5wcmV2aWV3Q29udGFpbmVyID0gcHJldmlld0NvbnRhaW5lcjtcbiAgICB9XG4gIH1cblxuICAvKiogU2V0cyB1cCB0aGUgbGlzdGVuZXIgdGhhdCBzeW5jcyB0aGUgaGFuZGxlcyB3aXRoIHRoZSBkcmFnIHJlZi4gKi9cbiAgcHJpdmF0ZSBfc2V0dXBIYW5kbGVzTGlzdGVuZXIoKSB7XG4gICAgLy8gTGlzdGVuIGZvciBhbnkgbmV3bHktYWRkZWQgaGFuZGxlcy5cbiAgICB0aGlzLl9oYW5kbGVzLmNoYW5nZXNcbiAgICAgIC5waXBlKFxuICAgICAgICBzdGFydFdpdGgodGhpcy5faGFuZGxlcyksXG4gICAgICAgIC8vIFN5bmMgdGhlIG5ldyBoYW5kbGVzIHdpdGggdGhlIERyYWdSZWYuXG4gICAgICAgIHRhcCgoaGFuZGxlczogUXVlcnlMaXN0PENka0RyYWdIYW5kbGU+KSA9PiB7XG4gICAgICAgICAgY29uc3QgY2hpbGRIYW5kbGVFbGVtZW50cyA9IGhhbmRsZXNcbiAgICAgICAgICAgIC5maWx0ZXIoaGFuZGxlID0+IGhhbmRsZS5fcGFyZW50RHJhZyA9PT0gdGhpcylcbiAgICAgICAgICAgIC5tYXAoaGFuZGxlID0+IGhhbmRsZS5lbGVtZW50KTtcblxuICAgICAgICAgIC8vIFVzdWFsbHkgaGFuZGxlcyBhcmUgb25seSBhbGxvd2VkIHRvIGJlIGEgZGVzY2VuZGFudCBvZiB0aGUgZHJhZyBlbGVtZW50LCBidXQgaWZcbiAgICAgICAgICAvLyB0aGUgY29uc3VtZXIgZGVmaW5lZCBhIGRpZmZlcmVudCBkcmFnIHJvb3QsIHdlIHNob3VsZCBhbGxvdyB0aGUgZHJhZyBlbGVtZW50XG4gICAgICAgICAgLy8gaXRzZWxmIHRvIGJlIGEgaGFuZGxlIHRvby5cbiAgICAgICAgICBpZiAodGhpcy5fc2VsZkhhbmRsZSAmJiB0aGlzLnJvb3RFbGVtZW50U2VsZWN0b3IpIHtcbiAgICAgICAgICAgIGNoaWxkSGFuZGxlRWxlbWVudHMucHVzaCh0aGlzLmVsZW1lbnQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuX2RyYWdSZWYud2l0aEhhbmRsZXMoY2hpbGRIYW5kbGVFbGVtZW50cyk7XG4gICAgICAgIH0pLFxuICAgICAgICAvLyBMaXN0ZW4gaWYgdGhlIHN0YXRlIG9mIGFueSBvZiB0aGUgaGFuZGxlcyBjaGFuZ2VzLlxuICAgICAgICBzd2l0Y2hNYXAoKGhhbmRsZXM6IFF1ZXJ5TGlzdDxDZGtEcmFnSGFuZGxlPikgPT4ge1xuICAgICAgICAgIHJldHVybiBtZXJnZShcbiAgICAgICAgICAgIC4uLmhhbmRsZXMubWFwKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gaXRlbS5fc3RhdGVDaGFuZ2VzLnBpcGUoc3RhcnRXaXRoKGl0ZW0pKTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICkgYXMgT2JzZXJ2YWJsZTxDZGtEcmFnSGFuZGxlPjtcbiAgICAgICAgfSksXG4gICAgICAgIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpLFxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZShoYW5kbGVJbnN0YW5jZSA9PiB7XG4gICAgICAgIC8vIEVuYWJsZWQvZGlzYWJsZSB0aGUgaGFuZGxlIHRoYXQgY2hhbmdlZCBpbiB0aGUgRHJhZ1JlZi5cbiAgICAgICAgY29uc3QgZHJhZ1JlZiA9IHRoaXMuX2RyYWdSZWY7XG4gICAgICAgIGNvbnN0IGhhbmRsZSA9IGhhbmRsZUluc3RhbmNlLmVsZW1lbnQubmF0aXZlRWxlbWVudDtcbiAgICAgICAgaGFuZGxlSW5zdGFuY2UuZGlzYWJsZWQgPyBkcmFnUmVmLmRpc2FibGVIYW5kbGUoaGFuZGxlKSA6IGRyYWdSZWYuZW5hYmxlSGFuZGxlKGhhbmRsZSk7XG4gICAgICB9KTtcbiAgfVxufVxuIl19