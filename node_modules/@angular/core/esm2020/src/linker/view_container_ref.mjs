/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { isType } from '../interface/type';
import { assertNodeInjector } from '../render3/assert';
import { ComponentFactory as R3ComponentFactory } from '../render3/component_ref';
import { getComponentDef } from '../render3/definition';
import { getParentInjectorLocation, NodeInjector } from '../render3/di';
import { addToViewTree, createLContainer } from '../render3/instructions/shared';
import { CONTAINER_HEADER_OFFSET, NATIVE, VIEW_REFS } from '../render3/interfaces/container';
import { isLContainer } from '../render3/interfaces/type_checks';
import { PARENT, RENDERER, T_HOST, TVIEW } from '../render3/interfaces/view';
import { assertTNodeType } from '../render3/node_assert';
import { addViewToContainer, destroyLView, detachView, getBeforeNodeForView, insertView, nativeInsertBefore, nativeNextSibling, nativeParentNode } from '../render3/node_manipulation';
import { getCurrentTNode, getLView } from '../render3/state';
import { getParentInjectorIndex, getParentInjectorView, hasParentInjector } from '../render3/util/injector_utils';
import { getNativeByTNode, unwrapRNode, viewAttachedToContainer } from '../render3/util/view_utils';
import { ViewRef as R3ViewRef } from '../render3/view_ref';
import { addToArray, removeFromArray } from '../util/array_utils';
import { assertDefined, assertEqual, assertGreaterThan, assertLessThan } from '../util/assert';
import { createElementRef } from './element_ref';
import { NgModuleRef } from './ng_module_factory';
/**
 * Represents a container where one or more views can be attached to a component.
 *
 * Can contain *host views* (created by instantiating a
 * component with the `createComponent()` method), and *embedded views*
 * (created by instantiating a `TemplateRef` with the `createEmbeddedView()` method).
 *
 * A view container instance can contain other view containers,
 * creating a [view hierarchy](guide/glossary#view-tree).
 *
 * @see `ComponentRef`
 * @see `EmbeddedViewRef`
 *
 * @publicApi
 */
export class ViewContainerRef {
}
/**
 * @internal
 * @nocollapse
 */
ViewContainerRef.__NG_ELEMENT_ID__ = injectViewContainerRef;
/**
 * Creates a ViewContainerRef and stores it on the injector. Or, if the ViewContainerRef
 * already exists, retrieves the existing ViewContainerRef.
 *
 * @returns The ViewContainerRef instance to use
 */
export function injectViewContainerRef() {
    const previousTNode = getCurrentTNode();
    return createContainerRef(previousTNode, getLView());
}
const VE_ViewContainerRef = ViewContainerRef;
// TODO(alxhub): cleaning up this indirection triggers a subtle bug in Closure in g3. Once the fix
// for that lands, this can be cleaned up.
const R3ViewContainerRef = class ViewContainerRef extends VE_ViewContainerRef {
    constructor(_lContainer, _hostTNode, _hostLView) {
        super();
        this._lContainer = _lContainer;
        this._hostTNode = _hostTNode;
        this._hostLView = _hostLView;
    }
    get element() {
        return createElementRef(this._hostTNode, this._hostLView);
    }
    get injector() {
        return new NodeInjector(this._hostTNode, this._hostLView);
    }
    /** @deprecated No replacement */
    get parentInjector() {
        const parentLocation = getParentInjectorLocation(this._hostTNode, this._hostLView);
        if (hasParentInjector(parentLocation)) {
            const parentView = getParentInjectorView(parentLocation, this._hostLView);
            const injectorIndex = getParentInjectorIndex(parentLocation);
            ngDevMode && assertNodeInjector(parentView, injectorIndex);
            const parentTNode = parentView[TVIEW].data[injectorIndex + 8 /* TNODE */];
            return new NodeInjector(parentTNode, parentView);
        }
        else {
            return new NodeInjector(null, this._hostLView);
        }
    }
    clear() {
        while (this.length > 0) {
            this.remove(this.length - 1);
        }
    }
    get(index) {
        const viewRefs = getViewRefs(this._lContainer);
        return viewRefs !== null && viewRefs[index] || null;
    }
    get length() {
        return this._lContainer.length - CONTAINER_HEADER_OFFSET;
    }
    createEmbeddedView(templateRef, context, index) {
        const viewRef = templateRef.createEmbeddedView(context || {});
        this.insert(viewRef, index);
        return viewRef;
    }
    createComponent(componentFactoryOrType, indexOrOptions, injector, projectableNodes, ngModuleRef) {
        const isComponentFactory = componentFactoryOrType && !isType(componentFactoryOrType);
        let index;
        // This function supports 2 signatures and we need to handle options correctly for both:
        //   1. When first argument is a Component type. This signature also requires extra
        //      options to be provided as as object (more ergonomic option).
        //   2. First argument is a Component factory. In this case extra options are represented as
        //      positional arguments. This signature is less ergonomic and will be deprecated.
        if (isComponentFactory) {
            if (ngDevMode) {
                assertEqual(typeof indexOrOptions !== 'object', true, 'It looks like Component factory was provided as the first argument ' +
                    'and an options object as the second argument. This combination of arguments ' +
                    'is incompatible. You can either change the first argument to provide Component ' +
                    'type or change the second argument to be a number (representing an index at ' +
                    'which to insert the new component\'s host view into this container)');
            }
            index = indexOrOptions;
        }
        else {
            if (ngDevMode) {
                assertDefined(getComponentDef(componentFactoryOrType), `Provided Component class doesn't contain Component definition. ` +
                    `Please check whether provided class has @Component decorator.`);
                assertEqual(typeof indexOrOptions !== 'number', true, 'It looks like Component type was provided as the first argument ' +
                    'and a number (representing an index at which to insert the new component\'s ' +
                    'host view into this container as the second argument. This combination of arguments ' +
                    'is incompatible. Please use an object as the second argument instead.');
            }
            const options = (indexOrOptions || {});
            index = options.index;
            injector = options.injector;
            projectableNodes = options.projectableNodes;
            ngModuleRef = options.ngModuleRef;
        }
        const componentFactory = isComponentFactory ?
            componentFactoryOrType :
            new R3ComponentFactory(getComponentDef(componentFactoryOrType));
        const contextInjector = injector || this.parentInjector;
        // If an `NgModuleRef` is not provided explicitly, try retrieving it from the DI tree.
        if (!ngModuleRef && componentFactory.ngModule == null) {
            // For the `ComponentFactory` case, entering this logic is very unlikely, since we expect that
            // an instance of a `ComponentFactory`, resolved via `ComponentFactoryResolver` would have an
            // `ngModule` field. This is possible in some test scenarios and potentially in some JIT-based
            // use-cases. For the `ComponentFactory` case we preserve backwards-compatibility and try
            // using a provided injector first, then fall back to the parent injector of this
            // `ViewContainerRef` instance.
            //
            // For the factory-less case, it's critical to establish a connection with the module
            // injector tree (by retrieving an instance of an `NgModuleRef` and accessing its injector),
            // so that a component can use DI tokens provided in MgModules. For this reason, we can not
            // rely on the provided injector, since it might be detached from the DI tree (for example, if
            // it was created via `Injector.create` without specifying a parent injector, or if an
            // injector is retrieved from an `NgModuleRef` created via `createNgModuleRef` using an
            // NgModule outside of a module tree). Instead, we always use `ViewContainerRef`'s parent
            // injector, which is normally connected to the DI tree, which includes module injector
            // subtree.
            const _injector = isComponentFactory ? contextInjector : this.parentInjector;
            // DO NOT REFACTOR. The code here used to have a `injector.get(NgModuleRef, null) ||
            // undefined` expression which seems to cause internal google apps to fail. This is documented
            // in the following internal bug issue: go/b/142967802
            const result = _injector.get(NgModuleRef, null);
            if (result) {
                ngModuleRef = result;
            }
        }
        const componentRef = componentFactory.create(contextInjector, projectableNodes, undefined, ngModuleRef);
        this.insert(componentRef.hostView, index);
        return componentRef;
    }
    insert(viewRef, index) {
        const lView = viewRef._lView;
        const tView = lView[TVIEW];
        if (ngDevMode && viewRef.destroyed) {
            throw new Error('Cannot insert a destroyed View in a ViewContainer!');
        }
        if (viewAttachedToContainer(lView)) {
            // If view is already attached, detach it first so we clean up references appropriately.
            const prevIdx = this.indexOf(viewRef);
            // A view might be attached either to this or a different container. The `prevIdx` for
            // those cases will be:
            // equal to -1 for views attached to this ViewContainerRef
            // >= 0 for views attached to a different ViewContainerRef
            if (prevIdx !== -1) {
                this.detach(prevIdx);
            }
            else {
                const prevLContainer = lView[PARENT];
                ngDevMode &&
                    assertEqual(isLContainer(prevLContainer), true, 'An attached view should have its PARENT point to a container.');
                // We need to re-create a R3ViewContainerRef instance since those are not stored on
                // LView (nor anywhere else).
                const prevVCRef = new R3ViewContainerRef(prevLContainer, prevLContainer[T_HOST], prevLContainer[PARENT]);
                prevVCRef.detach(prevVCRef.indexOf(viewRef));
            }
        }
        // Logical operation of adding `LView` to `LContainer`
        const adjustedIdx = this._adjustIndex(index);
        const lContainer = this._lContainer;
        insertView(tView, lView, lContainer, adjustedIdx);
        // Physical operation of adding the DOM nodes.
        const beforeNode = getBeforeNodeForView(adjustedIdx, lContainer);
        const renderer = lView[RENDERER];
        const parentRNode = nativeParentNode(renderer, lContainer[NATIVE]);
        if (parentRNode !== null) {
            addViewToContainer(tView, lContainer[T_HOST], renderer, lView, parentRNode, beforeNode);
        }
        viewRef.attachToViewContainerRef();
        addToArray(getOrCreateViewRefs(lContainer), adjustedIdx, viewRef);
        return viewRef;
    }
    move(viewRef, newIndex) {
        if (ngDevMode && viewRef.destroyed) {
            throw new Error('Cannot move a destroyed View in a ViewContainer!');
        }
        return this.insert(viewRef, newIndex);
    }
    indexOf(viewRef) {
        const viewRefsArr = getViewRefs(this._lContainer);
        return viewRefsArr !== null ? viewRefsArr.indexOf(viewRef) : -1;
    }
    remove(index) {
        const adjustedIdx = this._adjustIndex(index, -1);
        const detachedView = detachView(this._lContainer, adjustedIdx);
        if (detachedView) {
            // Before destroying the view, remove it from the container's array of `ViewRef`s.
            // This ensures the view container length is updated before calling
            // `destroyLView`, which could recursively call view container methods that
            // rely on an accurate container length.
            // (e.g. a method on this view container being called by a child directive's OnDestroy
            // lifecycle hook)
            removeFromArray(getOrCreateViewRefs(this._lContainer), adjustedIdx);
            destroyLView(detachedView[TVIEW], detachedView);
        }
    }
    detach(index) {
        const adjustedIdx = this._adjustIndex(index, -1);
        const view = detachView(this._lContainer, adjustedIdx);
        const wasDetached = view && removeFromArray(getOrCreateViewRefs(this._lContainer), adjustedIdx) != null;
        return wasDetached ? new R3ViewRef(view) : null;
    }
    _adjustIndex(index, shift = 0) {
        if (index == null) {
            return this.length + shift;
        }
        if (ngDevMode) {
            assertGreaterThan(index, -1, `ViewRef index must be positive, got ${index}`);
            // +1 because it's legal to insert at the end.
            assertLessThan(index, this.length + 1 + shift, 'index');
        }
        return index;
    }
};
function getViewRefs(lContainer) {
    return lContainer[VIEW_REFS];
}
function getOrCreateViewRefs(lContainer) {
    return (lContainer[VIEW_REFS] || (lContainer[VIEW_REFS] = []));
}
/**
 * Creates a ViewContainerRef and stores it on the injector.
 *
 * @param ViewContainerRefToken The ViewContainerRef type
 * @param ElementRefToken The ElementRef type
 * @param hostTNode The node that is requesting a ViewContainerRef
 * @param hostLView The view to which the node belongs
 * @returns The ViewContainerRef instance to use
 */
export function createContainerRef(hostTNode, hostLView) {
    ngDevMode && assertTNodeType(hostTNode, 12 /* AnyContainer */ | 3 /* AnyRNode */);
    let lContainer;
    const slotValue = hostLView[hostTNode.index];
    if (isLContainer(slotValue)) {
        // If the host is a container, we don't need to create a new LContainer
        lContainer = slotValue;
    }
    else {
        let commentNode;
        // If the host is an element container, the native host element is guaranteed to be a
        // comment and we can reuse that comment as anchor element for the new LContainer.
        // The comment node in question is already part of the DOM structure so we don't need to append
        // it again.
        if (hostTNode.type & 8 /* ElementContainer */) {
            commentNode = unwrapRNode(slotValue);
        }
        else {
            // If the host is a regular element, we have to insert a comment node manually which will
            // be used as an anchor when inserting elements. In this specific case we use low-level DOM
            // manipulation to insert it.
            const renderer = hostLView[RENDERER];
            ngDevMode && ngDevMode.rendererCreateComment++;
            commentNode = renderer.createComment(ngDevMode ? 'container' : '');
            const hostNative = getNativeByTNode(hostTNode, hostLView);
            const parentOfHostNative = nativeParentNode(renderer, hostNative);
            nativeInsertBefore(renderer, parentOfHostNative, commentNode, nativeNextSibling(renderer, hostNative), false);
        }
        hostLView[hostTNode.index] = lContainer =
            createLContainer(slotValue, hostLView, commentNode, hostTNode);
        addToViewTree(hostLView, lContainer);
    }
    return new R3ViewContainerRef(lContainer, hostTNode, hostLView);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld19jb250YWluZXJfcmVmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvbGlua2VyL3ZpZXdfY29udGFpbmVyX3JlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFHSCxPQUFPLEVBQUMsTUFBTSxFQUFPLE1BQU0sbUJBQW1CLENBQUM7QUFDL0MsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDckQsT0FBTyxFQUFDLGdCQUFnQixJQUFJLGtCQUFrQixFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDaEYsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3RELE9BQU8sRUFBQyx5QkFBeUIsRUFBRSxZQUFZLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdEUsT0FBTyxFQUFDLGFBQWEsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLGdDQUFnQyxDQUFDO0FBQy9FLE9BQU8sRUFBQyx1QkFBdUIsRUFBYyxNQUFNLEVBQUUsU0FBUyxFQUFDLE1BQU0saUNBQWlDLENBQUM7QUFJdkcsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLG1DQUFtQyxDQUFDO0FBQy9ELE9BQU8sRUFBUSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUMsTUFBTSw0QkFBNEIsQ0FBQztBQUNsRixPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFDLGtCQUFrQixFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsb0JBQW9CLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGlCQUFpQixFQUFFLGdCQUFnQixFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFDckwsT0FBTyxFQUFDLGVBQWUsRUFBRSxRQUFRLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUMzRCxPQUFPLEVBQUMsc0JBQXNCLEVB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QGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdG9yfSBmcm9tICcuLi9kaS9pbmplY3Rvcic7XG5pbXBvcnQge2lzVHlwZSwgVHlwZX0gZnJvbSAnLi4vaW50ZXJmYWNlL3R5cGUnO1xuaW1wb3J0IHthc3NlcnROb2RlSW5qZWN0b3J9IGZyb20gJy4uL3JlbmRlcjMvYXNzZXJ0JztcbmltcG9ydCB7Q29tcG9uZW50RmFjdG9yeSBhcyBSM0NvbXBvbmVudEZhY3Rvcnl9IGZyb20gJy4uL3JlbmRlcjMvY29tcG9uZW50X3JlZic7XG5pbXBvcnQge2dldENvbXBvbmVudERlZn0gZnJvbSAnLi4vcmVuZGVyMy9kZWZpbml0aW9uJztcbmltcG9ydCB7Z2V0UGFyZW50SW5qZWN0b3JMb2NhdGlvbiwgTm9kZUluamVjdG9yfSBmcm9tICcuLi9yZW5kZXIzL2RpJztcbmltcG9ydCB7YWRkVG9WaWV3VHJlZSwgY3JlYXRlTENvbnRhaW5lcn0gZnJvbSAnLi4vcmVuZGVyMy9pbnN0cnVjdGlvbnMvc2hhcmVkJztcbmltcG9ydCB7Q09OVEFJTkVSX0hFQURFUl9PRkZTRVQsIExDb250YWluZXIsIE5BVElWRSwgVklFV19SRUZTfSBmcm9tICcuLi9yZW5kZXIzL2ludGVyZmFjZXMvY29udGFpbmVyJztcbmltcG9ydCB7Tm9kZUluamVjdG9yT2Zmc2V0fSBmcm9tICcuLi9yZW5kZXIzL2ludGVyZmFjZXMvaW5qZWN0b3InO1xuaW1wb3J0IHtUQ29udGFpbmVyTm9kZSwgVERpcmVjdGl2ZUhvc3ROb2RlLCBURWxlbWVudENvbnRhaW5lck5vZGUsIFRFbGVtZW50Tm9kZSwgVE5vZGVUeXBlfSBmcm9tICcuLi9yZW5kZXIzL2ludGVyZmFjZXMvbm9kZSc7XG5pbXBvcnQge1JDb21tZW50LCBSRWxlbWVudH0gZnJvbSAnLi4vcmVuZGVyMy9pbnRlcmZhY2VzL3JlbmRlcmVyX2RvbSc7XG5pbXBvcnQge2lzTENvbnRhaW5lcn0gZnJvbSAnLi4vcmVuZGVyMy9pbnRlcmZhY2VzL3R5cGVfY2hlY2tzJztcbmltcG9ydCB7TFZpZXcsIFBBUkVOVCwgUkVOREVSRVIsIFRfSE9TVCwgVFZJRVd9IGZyb20gJy4uL3JlbmRlcjMvaW50ZXJmYWNlcy92aWV3JztcbmltcG9ydCB7YXNzZXJ0VE5vZGVUeXBlfSBmcm9tICcuLi9yZW5kZXIzL25vZGVfYXNzZXJ0JztcbmltcG9ydCB7YWRkVmlld1RvQ29udGFpbmVyLCBkZXN0cm95TFZpZXcsIGRldGFjaFZpZXcsIGdldEJlZm9yZU5vZGVGb3JWaWV3LCBpbnNlcnRWaWV3LCBuYXRpdmVJbnNlcnRCZWZvcmUsIG5hdGl2ZU5leHRTaWJsaW5nLCBuYXRpdmVQYXJlbnROb2RlfSBmcm9tICcuLi9yZW5kZXIzL25vZGVfbWFuaXB1bGF0aW9uJztcbmltcG9ydCB7Z2V0Q3VycmVudFROb2RlLCBnZXRMVmlld30gZnJvbSAnLi4vcmVuZGVyMy9zdGF0ZSc7XG5pbXBvcnQge2dldFBhcmVudEluamVjdG9ySW5kZXgsIGdldFBhcmVudEluamVjdG9yVmlldywgaGFzUGFyZW50SW5qZWN0b3J9IGZyb20gJy4uL3JlbmRlcjMvdXRpbC9pbmplY3Rvcl91dGlscyc7XG5pbXBvcnQge2dldE5hdGl2ZUJ5VE5vZGUsIHVud3JhcFJOb2RlLCB2aWV3QXR0YWNoZWRUb0NvbnRhaW5lcn0gZnJvbSAnLi4vcmVuZGVyMy91dGlsL3ZpZXdfdXRpbHMnO1xuaW1wb3J0IHtWaWV3UmVmIGFzIFIzVmlld1JlZn0gZnJvbSAnLi4vcmVuZGVyMy92aWV3X3JlZic7XG5pbXBvcnQge2FkZFRvQXJyYXksIHJlbW92ZUZyb21BcnJheX0gZnJvbSAnLi4vdXRpbC9hcnJheV91dGlscyc7XG5pbXBvcnQge2Fzc2VydERlZmluZWQsIGFzc2VydEVxdWFsLCBhc3NlcnRHcmVhdGVyVGhhbiwgYXNzZXJ0TGVzc1RoYW59IGZyb20gJy4uL3V0aWwvYXNzZXJ0JztcblxuaW1wb3J0IHtDb21wb25lbnRGYWN0b3J5LCBDb21wb25lbnRSZWZ9IGZyb20gJy4vY29tcG9uZW50X2ZhY3RvcnknO1xuaW1wb3J0IHtjcmVhdGVFbGVtZW50UmVmLCBFbGVtZW50UmVmfSBmcm9tICcuL2VsZW1lbnRfcmVmJztcbmltcG9ydCB7TmdNb2R1bGVSZWZ9IGZyb20gJy4vbmdfbW9kdWxlX2ZhY3RvcnknO1xuaW1wb3J0IHtUZW1wbGF0ZVJlZn0gZnJvbSAnLi90ZW1wbGF0ZV9yZWYnO1xuaW1wb3J0IHtFbWJlZGRlZFZpZXdSZWYsIFZpZXdSZWZ9IGZyb20gJy4vdmlld19yZWYnO1xuLyoqXG4gKiBSZXByZXNlbnRzIGEgY29udGFpbmVyIHdoZXJlIG9uZSBvciBtb3JlIHZpZXdzIGNhbiBiZSBhdHRhY2hlZCB0byBhIGNvbXBvbmVudC5cbiAqXG4gKiBDYW4gY29udGFpbiAqaG9zdCB2aWV3cyogKGNyZWF0ZWQgYnkgaW5zdGFudGlhdGluZyBhXG4gKiBjb21wb25lbnQgd2l0aCB0aGUgYGNyZWF0ZUNvbXBvbmVudCgpYCBtZXRob2QpLCBhbmQgKmVtYmVkZGVkIHZpZXdzKlxuICogKGNyZWF0ZWQgYnkgaW5zdGFudGlhdGluZyBhIGBUZW1wbGF0ZVJlZmAgd2l0aCB0aGUgYGNyZWF0ZUVtYmVkZGVkVmlldygpYCBtZXRob2QpLlxuICpcbiAqIEEgdmlldyBjb250YWluZXIgaW5zdGFuY2UgY2FuIGNvbnRhaW4gb3RoZXIgdmlldyBjb250YWluZXJzLFxuICogY3JlYXRpbmcgYSBbdmlldyBoaWVyYXJjaHldKGd1aWRlL2dsb3NzYXJ5I3ZpZXctdHJlZSkuXG4gKlxuICogQHNlZSBgQ29tcG9uZW50UmVmYFxuICogQHNlZSBgRW1iZWRkZWRWaWV3UmVmYFxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFZpZXdDb250YWluZXJSZWYge1xuICAvKipcbiAgICogQW5jaG9yIGVsZW1lbnQgdGhhdCBzcGVjaWZpZXMgdGhlIGxvY2F0aW9uIG9mIHRoaXMgY29udGFpbmVyIGluIHRoZSBjb250YWluaW5nIHZpZXcuXG4gICAqIEVhY2ggdmlldyBjb250YWluZXIgY2FuIGhhdmUgb25seSBvbmUgYW5jaG9yIGVsZW1lbnQsIGFuZCBlYWNoIGFuY2hvciBlbGVtZW50XG4gICAqIGNhbiBoYXZlIG9ubHkgYSBzaW5nbGUgdmlldyBjb250YWluZXIuXG4gICAqXG4gICAqIFJvb3QgZWxlbWVudHMgb2Ygdmlld3MgYXR0YWNoZWQgdG8gdGhpcyBjb250YWluZXIgYmVjb21lIHNpYmxpbmdzIG9mIHRoZSBhbmNob3IgZWxlbWVudCBpblxuICAgKiB0aGUgcmVuZGVyZWQgdmlldy5cbiAgICpcbiAgICogQWNjZXNzIHRoZSBgVmlld0NvbnRhaW5lclJlZmAgb2YgYW4gZWxlbWVudCBieSBwbGFjaW5nIGEgYERpcmVjdGl2ZWAgaW5qZWN0ZWRcbiAgICogd2l0aCBgVmlld0NvbnRhaW5lclJlZmAgb24gdGhlIGVsZW1lbnQsIG9yIHVzZSBhIGBWaWV3Q2hpbGRgIHF1ZXJ5LlxuICAgKlxuICAgKiA8IS0tIFRPRE86IHJlbmFtZSB0byBhbmNob3JFbGVtZW50IC0tPlxuICAgKi9cbiAgYWJzdHJhY3QgZ2V0IGVsZW1lbnQoKTogRWxlbWVudFJlZjtcblxuICAvKipcbiAgICogVGhlIFtkZXBlbmRlbmN5IGluamVjdG9yXShndWlkZS9nbG9zc2FyeSNpbmplY3RvcikgZm9yIHRoaXMgdmlldyBjb250YWluZXIuXG4gICAqL1xuICBhYnN0cmFjdCBnZXQgaW5qZWN0b3IoKTogSW5qZWN0b3I7XG5cbiAgLyoqIEBkZXByZWNhdGVkIE5vIHJlcGxhY2VtZW50ICovXG4gIGFic3RyYWN0IGdldCBwYXJlbnRJbmplY3RvcigpOiBJbmplY3RvcjtcblxuICAvKipcbiAgICogRGVzdHJveXMgYWxsIHZpZXdzIGluIHRoaXMgY29udGFpbmVyLlxuICAgKi9cbiAgYWJzdHJhY3QgY2xlYXIoKTogdm9pZDtcblxuICAvKipcbiAgICogUmV0cmlldmVzIGEgdmlldyBmcm9tIHRoaXMgY29udGFpbmVyLlxuICAgKiBAcGFyYW0gaW5kZXggVGhlIDAtYmFzZWQgaW5kZXggb2YgdGhlIHZpZXcgdG8gcmV0cmlldmUuXG4gICAqIEByZXR1cm5zIFRoZSBgVmlld1JlZmAgaW5zdGFuY2UsIG9yIG51bGwgaWYgdGhlIGluZGV4IGlzIG91dCBvZiByYW5nZS5cbiAgICovXG4gIGFic3RyYWN0IGdldChpbmRleDogbnVtYmVyKTogVmlld1JlZnxudWxsO1xuXG4gIC8qKlxuICAgKiBSZXBvcnRzIGhvdyBtYW55IHZpZXdzIGFyZSBjdXJyZW50bHkgYXR0YWNoZWQgdG8gdGhpcyBjb250YWluZXIuXG4gICAqIEByZXR1cm5zIFRoZSBudW1iZXIgb2Ygdmlld3MuXG4gICAqL1xuICBhYnN0cmFjdCBnZXQgbGVuZ3RoKCk6IG51bWJlcjtcblxuICAvKipcbiAgICogSW5zdGFudGlhdGVzIGFuIGVtYmVkZGVkIHZpZXcgYW5kIGluc2VydHMgaXRcbiAgICogaW50byB0aGlzIGNvbnRhaW5lci5cbiAgICogQHBhcmFtIHRlbXBsYXRlUmVmIFRoZSBIVE1MIHRlbXBsYXRlIHRoYXQgZGVmaW5lcyB0aGUgdmlldy5cbiAgICogQHBhcmFtIGNvbnRleHQgVGhlIGRhdGEtYmluZGluZyBjb250ZXh0IG9mIHRoZSBlbWJlZGRlZCB2aWV3LCBhcyBkZWNsYXJlZFxuICAgKiBpbiB0aGUgYDxuZy10ZW1wbGF0ZT5gIHVzYWdlLlxuICAgKiBAcGFyYW0gaW5kZXggVGhlIDAtYmFzZWQgaW5kZXggYXQgd2hpY2ggdG8gaW5zZXJ0IHRoZSBuZXcgdmlldyBpbnRvIHRoaXMgY29udGFpbmVyLlxuICAgKiBJZiBub3Qgc3BlY2lmaWVkLCBhcHBlbmRzIHRoZSBuZXcgdmlldyBhcyB0aGUgbGFzdCBlbnRyeS5cbiAgICpcbiAgICogQHJldHVybnMgVGhlIGBWaWV3UmVmYCBpbnN0YW5jZSBmb3IgdGhlIG5ld2x5IGNyZWF0ZWQgdmlldy5cbiAgICovXG4gIGFic3RyYWN0IGNyZWF0ZUVtYmVkZGVkVmlldzxDPih0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8Qz4sIGNvbnRleHQ/OiBDLCBpbmRleD86IG51bWJlcik6XG4gICAgICBFbWJlZGRlZFZpZXdSZWY8Qz47XG5cbiAgLyoqXG4gICAqIEluc3RhbnRpYXRlcyBhIHNpbmdsZSBjb21wb25lbnQgYW5kIGluc2VydHMgaXRzIGhvc3QgdmlldyBpbnRvIHRoaXMgY29udGFpbmVyLlxuICAgKlxuICAgKiBAcGFyYW0gY29tcG9uZW50VHlwZSBDb21wb25lbnQgVHlwZSB0byB1c2UuXG4gICAqIEBwYXJhbSBvcHRpb25zIEFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIGV4dHJhIHBhcmFtZXRlcnM6XG4gICAqICAqIGluZGV4OiB0aGUgaW5kZXggYXQgd2hpY2ggdG8gaW5zZXJ0IHRoZSBuZXcgY29tcG9uZW50J3MgaG9zdCB2aWV3IGludG8gdGhpcyBjb250YWluZXIuXG4gICAqICAgICAgICAgICBJZiBub3Qgc3BlY2lmaWVkLCBhcHBlbmRzIHRoZSBuZXcgdmlldyBhcyB0aGUgbGFzdCBlbnRyeS5cbiAgICogICogaW5qZWN0b3I6IHRoZSBpbmplY3RvciB0byB1c2UgYXMgdGhlIHBhcmVudCBmb3IgdGhlIG5ldyBjb21wb25lbnQuXG4gICAqICAqIG5nTW9kdWxlUmVmOiBhbiBOZ01vZHVsZVJlZiBvZiB0aGUgY29tcG9uZW50J3MgTmdNb2R1bGUsIHlvdSBzaG91bGQgYWxtb3N0IGFsd2F5cyBwcm92aWRlXG4gICAqICAgICAgICAgICAgICAgICB0aGlzIHRvIGVuc3VyZSB0aGF0IGFsbCBleHBlY3RlZCBwcm92aWRlcnMgYXJlIGF2YWlsYWJsZSBmb3IgdGhlIGNvbXBvbmVudFxuICAgKiAgICAgICAgICAgICAgICAgaW5zdGFudGlhdGlvbi5cbiAgICogICogcHJvamVjdGFibGVOb2RlczogbGlzdCBvZiBET00gbm9kZXMgdGhhdCBzaG91bGQgYmUgcHJvamVjdGVkIHRocm91Z2hcbiAgICogICAgICAgICAgICAgICAgICAgICAgW2A8bmctY29udGVudD5gXShhcGkvY29yZS9uZy1jb250ZW50KSBvZiB0aGUgbmV3IGNvbXBvbmVudCBpbnN0YW5jZS5cbiAgICpcbiAgICogQHJldHVybnMgVGhlIG5ldyBgQ29tcG9uZW50UmVmYCB3aGljaCBjb250YWlucyB0aGUgY29tcG9uZW50IGluc3RhbmNlIGFuZCB0aGUgaG9zdCB2aWV3LlxuICAgKi9cbiAgYWJzdHJhY3QgY3JlYXRlQ29tcG9uZW50PEM+KGNvbXBvbmVudFR5cGU6IFR5cGU8Qz4sIG9wdGlvbnM/OiB7XG4gICAgaW5kZXg/OiBudW1iZXIsXG4gICAgaW5qZWN0b3I/OiBJbmplY3RvcixcbiAgICBuZ01vZHVsZVJlZj86IE5nTW9kdWxlUmVmPHVua25vd24+LFxuICAgIHByb2plY3RhYmxlTm9kZXM/OiBOb2RlW11bXSxcbiAgfSk6IENvbXBvbmVudFJlZjxDPjtcblxuICAvKipcbiAgICogSW5zdGFudGlhdGVzIGEgc2luZ2xlIGNvbXBvbmVudCBhbmQgaW5zZXJ0cyBpdHMgaG9zdCB2aWV3IGludG8gdGhpcyBjb250YWluZXIuXG4gICAqXG4gICAqIEBwYXJhbSBjb21wb25lbnRGYWN0b3J5IENvbXBvbmVudCBmYWN0b3J5IHRvIHVzZS5cbiAgICogQHBhcmFtIGluZGV4IFRoZSBpbmRleCBhdCB3aGljaCB0byBpbnNlcnQgdGhlIG5ldyBjb21wb25lbnQncyBob3N0IHZpZXcgaW50byB0aGlzIGNvbnRhaW5lci5cbiAgICogSWYgbm90IHNwZWNpZmllZCwgYXBwZW5kcyB0aGUgbmV3IHZpZXcgYXMgdGhlIGxhc3QgZW50cnkuXG4gICAqIEBwYXJhbSBpbmplY3RvciBUaGUgaW5qZWN0b3IgdG8gdXNlIGFzIHRoZSBwYXJlbnQgZm9yIHRoZSBuZXcgY29tcG9uZW50LlxuICAgKiBAcGFyYW0gcHJvamVjdGFibGVOb2RlcyBMaXN0IG9mIERPTSBub2RlcyB0aGF0IHNob3VsZCBiZSBwcm9qZWN0ZWQgdGhyb3VnaFxuICAgKiAgICAgW2A8bmctY29udGVudD5gXShhcGkvY29yZS9uZy1jb250ZW50KSBvZiB0aGUgbmV3IGNvbXBvbmVudCBpbnN0YW5jZS5cbiAgICogQHBhcmFtIG5nTW9kdWxlUmVmIEFuIGluc3RhbmNlIG9mIHRoZSBOZ01vZHVsZVJlZiB0aGF0IHJlcHJlc2VudCBhbiBOZ01vZHVsZS5cbiAgICogVGhpcyBpbmZvcm1hdGlvbiBpcyB1c2VkIHRvIHJldHJpZXZlIGNvcnJlc3BvbmRpbmcgTmdNb2R1bGUgaW5qZWN0b3IuXG4gICAqXG4gICAqIEByZXR1cm5zIFRoZSBuZXcgYENvbXBvbmVudFJlZmAgd2hpY2ggY29udGFpbnMgdGhlIGNvbXBvbmVudCBpbnN0YW5jZSBhbmQgdGhlIGhvc3Qgdmlldy5cbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgQW5ndWxhciBubyBsb25nZXIgcmVxdWlyZXMgY29tcG9uZW50IGZhY3RvcmllcyB0byBkeW5hbWljYWxseSBjcmVhdGUgY29tcG9uZW50cy5cbiAgICogICAgIFVzZSBkaWZmZXJlbnQgc2lnbmF0dXJlIG9mIHRoZSBgY3JlYXRlQ29tcG9uZW50YCBtZXRob2QsIHdoaWNoIGFsbG93cyBwYXNzaW5nXG4gICAqICAgICBDb21wb25lbnQgY2xhc3MgZGlyZWN0bHkuXG4gICAqL1xuICBhYnN0cmFjdCBjcmVhdGVDb21wb25lbnQ8Qz4oXG4gICAgICBjb21wb25lbnRGYWN0b3J5OiBDb21wb25lbnRGYWN0b3J5PEM+LCBpbmRleD86IG51bWJlciwgaW5qZWN0b3I/OiBJbmplY3RvcixcbiAgICAgIHByb2plY3RhYmxlTm9kZXM/OiBhbnlbXVtdLCBuZ01vZHVsZVJlZj86IE5nTW9kdWxlUmVmPGFueT4pOiBDb21wb25lbnRSZWY8Qz47XG5cbiAgLyoqXG4gICAqIEluc2VydHMgYSB2aWV3IGludG8gdGhpcyBjb250YWluZXIuXG4gICAqIEBwYXJhbSB2aWV3UmVmIFRoZSB2aWV3IHRvIGluc2VydC5cbiAgICogQHBhcmFtIGluZGV4IFRoZSAwLWJhc2VkIGluZGV4IGF0IHdoaWNoIHRvIGluc2VydCB0aGUgdmlldy5cbiAgICogSWYgbm90IHNwZWNpZmllZCwgYXBwZW5kcyB0aGUgbmV3IHZpZXcgYXMgdGhlIGxhc3QgZW50cnkuXG4gICAqIEByZXR1cm5zIFRoZSBpbnNlcnRlZCBgVmlld1JlZmAgaW5zdGFuY2UuXG4gICAqXG4gICAqL1xuICBhYnN0cmFjdCBpbnNlcnQodmlld1JlZjogVmlld1JlZiwgaW5kZXg/OiBudW1iZXIpOiBWaWV3UmVmO1xuXG4gIC8qKlxuICAgKiBNb3ZlcyBhIHZpZXcgdG8gYSBuZXcgbG9jYXRpb24gaW4gdGhpcyBjb250YWluZXIuXG4gICAqIEBwYXJhbSB2aWV3UmVmIFRoZSB2aWV3IHRvIG1vdmUuXG4gICAqIEBwYXJhbSBpbmRleCBUaGUgMC1iYXNlZCBpbmRleCBvZiB0aGUgbmV3IGxvY2F0aW9uLlxuICAgKiBAcmV0dXJucyBUaGUgbW92ZWQgYFZpZXdSZWZgIGluc3RhbmNlLlxuICAgKi9cbiAgYWJzdHJhY3QgbW92ZSh2aWV3UmVmOiBWaWV3UmVmLCBjdXJyZW50SW5kZXg6IG51bWJlcik6IFZpZXdSZWY7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGluZGV4IG9mIGEgdmlldyB3aXRoaW4gdGhlIGN1cnJlbnQgY29udGFpbmVyLlxuICAgKiBAcGFyYW0gdmlld1JlZiBUaGUgdmlldyB0byBxdWVyeS5cbiAgICogQHJldHVybnMgVGhlIDAtYmFzZWQgaW5kZXggb2YgdGhlIHZpZXcncyBwb3NpdGlvbiBpbiB0aGlzIGNvbnRhaW5lcixcbiAgICogb3IgYC0xYCBpZiB0aGlzIGNvbnRhaW5lciBkb2Vzbid0IGNvbnRhaW4gdGhlIHZpZXcuXG4gICAqL1xuICBhYnN0cmFjdCBpbmRleE9mKHZpZXdSZWY6IFZpZXdSZWYpOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIERlc3Ryb3lzIGEgdmlldyBhdHRhY2hlZCB0byB0aGlzIGNvbnRhaW5lclxuICAgKiBAcGFyYW0gaW5kZXggVGhlIDAtYmFzZWQgaW5kZXggb2YgdGhlIHZpZXcgdG8gZGVzdHJveS5cbiAgICogSWYgbm90IHNwZWNpZmllZCwgdGhlIGxhc3QgdmlldyBpbiB0aGUgY29udGFpbmVyIGlzIHJlbW92ZWQuXG4gICAqL1xuICBhYnN0cmFjdCByZW1vdmUoaW5kZXg/OiBudW1iZXIpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBEZXRhY2hlcyBhIHZpZXcgZnJvbSB0aGlzIGNvbnRhaW5lciB3aXRob3V0IGRlc3Ryb3lpbmcgaXQuXG4gICAqIFVzZSBhbG9uZyB3aXRoIGBpbnNlcnQoKWAgdG8gbW92ZSBhIHZpZXcgd2l0aGluIHRoZSBjdXJyZW50IGNvbnRhaW5lci5cbiAgICogQHBhcmFtIGluZGV4IFRoZSAwLWJhc2VkIGluZGV4IG9mIHRoZSB2aWV3IHRvIGRldGFjaC5cbiAgICogSWYgbm90IHNwZWNpZmllZCwgdGhlIGxhc3QgdmlldyBpbiB0aGUgY29udGFpbmVyIGlzIGRldGFjaGVkLlxuICAgKi9cbiAgYWJzdHJhY3QgZGV0YWNoKGluZGV4PzogbnVtYmVyKTogVmlld1JlZnxudWxsO1xuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICogQG5vY29sbGFwc2VcbiAgICovXG4gIHN0YXRpYyBfX05HX0VMRU1FTlRfSURfXzogKCkgPT4gVmlld0NvbnRhaW5lclJlZiA9IGluamVjdFZpZXdDb250YWluZXJSZWY7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIFZpZXdDb250YWluZXJSZWYgYW5kIHN0b3JlcyBpdCBvbiB0aGUgaW5qZWN0b3IuIE9yLCBpZiB0aGUgVmlld0NvbnRhaW5lclJlZlxuICogYWxyZWFkeSBleGlzdHMsIHJldHJpZXZlcyB0aGUgZXhpc3RpbmcgVmlld0NvbnRhaW5lclJlZi5cbiAqXG4gKiBAcmV0dXJucyBUaGUgVmlld0NvbnRhaW5lclJlZiBpbnN0YW5jZSB0byB1c2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluamVjdFZpZXdDb250YWluZXJSZWYoKTogVmlld0NvbnRhaW5lclJlZiB7XG4gIGNvbnN0IHByZXZpb3VzVE5vZGUgPSBnZXRDdXJyZW50VE5vZGUoKSBhcyBURWxlbWVudE5vZGUgfCBURWxlbWVudENvbnRhaW5lck5vZGUgfCBUQ29udGFpbmVyTm9kZTtcbiAgcmV0dXJuIGNyZWF0ZUNvbnRhaW5lclJlZihwcmV2aW91c1ROb2RlLCBnZXRMVmlldygpKTtcbn1cblxuY29uc3QgVkVfVmlld0NvbnRhaW5lclJlZiA9IFZpZXdDb250YWluZXJSZWY7XG5cbi8vIFRPRE8oYWx4aHViKTogY2xlYW5pbmcgdXAgdGhpcyBpbmRpcmVjdGlvbiB0cmlnZ2VycyBhIHN1YnRsZSBidWcgaW4gQ2xvc3VyZSBpbiBnMy4gT25jZSB0aGUgZml4XG4vLyBmb3IgdGhhdCBsYW5kcywgdGhpcyBjYW4gYmUgY2xlYW5lZCB1cC5cbmNvbnN0IFIzVmlld0NvbnRhaW5lclJlZiA9IGNsYXNzIFZpZXdDb250YWluZXJSZWYgZXh0ZW5kcyBWRV9WaWV3Q29udGFpbmVyUmVmIHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIF9sQ29udGFpbmVyOiBMQ29udGFpbmVyLFxuICAgICAgcHJpdmF0ZSBfaG9zdFROb2RlOiBURWxlbWVudE5vZGV8VENvbnRhaW5lck5vZGV8VEVsZW1lbnRDb250YWluZXJOb2RlLFxuICAgICAgcHJpdmF0ZSBfaG9zdExWaWV3OiBMVmlldykge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBvdmVycmlkZSBnZXQgZWxlbWVudCgpOiBFbGVtZW50UmVmIHtcbiAgICByZXR1cm4gY3JlYXRlRWxlbWVudFJlZih0aGlzLl9ob3N0VE5vZGUsIHRoaXMuX2hvc3RMVmlldyk7XG4gIH1cblxuICBvdmVycmlkZSBnZXQgaW5qZWN0b3IoKTogSW5qZWN0b3Ige1xuICAgIHJldHVybiBuZXcgTm9kZUluamVjdG9yKHRoaXMuX2hvc3RUTm9kZSwgdGhpcy5faG9zdExWaWV3KTtcbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBObyByZXBsYWNlbWVudCAqL1xuICBvdmVycmlkZSBnZXQgcGFyZW50SW5qZWN0b3IoKTogSW5qZWN0b3Ige1xuICAgIGNvbnN0IHBhcmVudExvY2F0aW9uID0gZ2V0UGFyZW50SW5qZWN0b3JMb2NhdGlvbih0aGlzLl9ob3N0VE5vZGUsIHRoaXMuX2hvc3RMVmlldyk7XG4gICAgaWYgKGhhc1BhcmVudEluamVjdG9yKHBhcmVudExvY2F0aW9uKSkge1xuICAgICAgY29uc3QgcGFyZW50VmlldyA9IGdldFBhcmVudEluamVjdG9yVmlldyhwYXJlbnRMb2NhdGlvbiwgdGhpcy5faG9zdExWaWV3KTtcbiAgICAgIGNvbnN0IGluamVjdG9ySW5kZXggPSBnZXRQYXJlbnRJbmplY3RvckluZGV4KHBhcmVudExvY2F0aW9uKTtcbiAgICAgIG5nRGV2TW9kZSAmJiBhc3NlcnROb2RlSW5qZWN0b3IocGFyZW50VmlldywgaW5qZWN0b3JJbmRleCk7XG4gICAgICBjb25zdCBwYXJlbnRUTm9kZSA9XG4gICAgICAgICAgcGFyZW50Vmlld1tUVklFV10uZGF0YVtpbmplY3RvckluZGV4ICsgTm9kZUluamVjdG9yT2Zmc2V0LlROT0RFXSBhcyBURWxlbWVudE5vZGU7XG4gICAgICByZXR1cm4gbmV3IE5vZGVJbmplY3RvcihwYXJlbnRUTm9kZSwgcGFyZW50Vmlldyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgTm9kZUluamVjdG9yKG51bGwsIHRoaXMuX2hvc3RMVmlldyk7XG4gICAgfVxuICB9XG5cbiAgb3ZlcnJpZGUgY2xlYXIoKTogdm9pZCB7XG4gICAgd2hpbGUgKHRoaXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5yZW1vdmUodGhpcy5sZW5ndGggLSAxKTtcbiAgICB9XG4gIH1cblxuICBvdmVycmlkZSBnZXQoaW5kZXg6IG51bWJlcik6IFZpZXdSZWZ8bnVsbCB7XG4gICAgY29uc3Qgdmlld1JlZnMgPSBnZXRWaWV3UmVmcyh0aGlzLl9sQ29udGFpbmVyKTtcbiAgICByZXR1cm4gdmlld1JlZnMgIT09IG51bGwgJiYgdmlld1JlZnNbaW5kZXhdIHx8IG51bGw7XG4gIH1cblxuICBvdmVycmlkZSBnZXQgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2xDb250YWluZXIubGVuZ3RoIC0gQ09OVEFJTkVSX0hFQURFUl9PRkZTRVQ7XG4gIH1cblxuICBvdmVycmlkZSBjcmVhdGVFbWJlZGRlZFZpZXc8Qz4odGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPEM+LCBjb250ZXh0PzogQywgaW5kZXg/OiBudW1iZXIpOlxuICAgICAgRW1iZWRkZWRWaWV3UmVmPEM+IHtcbiAgICBjb25zdCB2aWV3UmVmID0gdGVtcGxhdGVSZWYuY3JlYXRlRW1iZWRkZWRWaWV3KGNvbnRleHQgfHwgPGFueT57fSk7XG4gICAgdGhpcy5pbnNlcnQodmlld1JlZiwgaW5kZXgpO1xuICAgIHJldHVybiB2aWV3UmVmO1xuICB9XG5cbiAgb3ZlcnJpZGUgY3JlYXRlQ29tcG9uZW50PEM+KGNvbXBvbmVudFR5cGU6IFR5cGU8Qz4sIG9wdGlvbnM/OiB7XG4gICAgaW5kZXg/OiBudW1iZXIsXG4gICAgaW5qZWN0b3I/OiBJbmplY3RvcixcbiAgICBwcm9qZWN0YWJsZU5vZGVzPzogTm9kZVtdW10sXG4gICAgbmdNb2R1bGVSZWY/OiBOZ01vZHVsZVJlZjx1bmtub3duPixcbiAgfSk6IENvbXBvbmVudFJlZjxDPjtcbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIEFuZ3VsYXIgbm8gbG9uZ2VyIHJlcXVpcmVzIGNvbXBvbmVudCBmYWN0b3JpZXMgdG8gZHluYW1pY2FsbHkgY3JlYXRlIGNvbXBvbmVudHMuXG4gICAqICAgICBVc2UgZGlmZmVyZW50IHNpZ25hdHVyZSBvZiB0aGUgYGNyZWF0ZUNvbXBvbmVudGAgbWV0aG9kLCB3aGljaCBhbGxvd3MgcGFzc2luZ1xuICAgKiAgICAgQ29tcG9uZW50IGNsYXNzIGRpcmVjdGx5LlxuICAgKi9cbiAgb3ZlcnJpZGUgY3JlYXRlQ29tcG9uZW50PEM+KFxuICAgICAgY29tcG9uZW50RmFjdG9yeTogQ29tcG9uZW50RmFjdG9yeTxDPiwgaW5kZXg/OiBudW1iZXJ8dW5kZWZpbmVkLFxuICAgICAgaW5qZWN0b3I/OiBJbmplY3Rvcnx1bmRlZmluZWQsIHByb2plY3RhYmxlTm9kZXM/OiBhbnlbXVtdfHVuZGVmaW5lZCxcbiAgICAgIG5nTW9kdWxlUmVmPzogTmdNb2R1bGVSZWY8YW55Pnx1bmRlZmluZWQpOiBDb21wb25lbnRSZWY8Qz47XG4gIG92ZXJyaWRlIGNyZWF0ZUNvbXBvbmVudDxDPihcbiAgICAgIGNvbXBvbmVudEZhY3RvcnlPclR5cGU6IENvbXBvbmVudEZhY3Rvcnk8Qz58VHlwZTxDPiwgaW5kZXhPck9wdGlvbnM/OiBudW1iZXJ8dW5kZWZpbmVkfHtcbiAgICAgICAgaW5kZXg/OiBudW1iZXIsXG4gICAgICAgIGluamVjdG9yPzogSW5qZWN0b3IsXG4gICAgICAgIG5nTW9kdWxlUmVmPzogTmdNb2R1bGVSZWY8dW5rbm93bj4sXG4gICAgICAgIHByb2plY3RhYmxlTm9kZXM/OiBOb2RlW11bXSxcbiAgICAgIH0sXG4gICAgICBpbmplY3Rvcj86IEluamVjdG9yfHVuZGVmaW5lZCwgcHJvamVjdGFibGVOb2Rlcz86IGFueVtdW118dW5kZWZpbmVkLFxuICAgICAgbmdNb2R1bGVSZWY/OiBOZ01vZHVsZVJlZjxhbnk+fHVuZGVmaW5lZCk6IENvbXBvbmVudFJlZjxDPiB7XG4gICAgY29uc3QgaXNDb21wb25lbnRGYWN0b3J5ID0gY29tcG9uZW50RmFjdG9yeU9yVHlwZSAmJiAhaXNUeXBlKGNvbXBvbmVudEZhY3RvcnlPclR5cGUpO1xuICAgIGxldCBpbmRleDogbnVtYmVyfHVuZGVmaW5lZDtcblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gc3VwcG9ydHMgMiBzaWduYXR1cmVzIGFuZCB3ZSBuZWVkIHRvIGhhbmRsZSBvcHRpb25zIGNvcnJlY3RseSBmb3IgYm90aDpcbiAgICAvLyAgIDEuIFdoZW4gZmlyc3QgYXJndW1lbnQgaXMgYSBDb21wb25lbnQgdHlwZS4gVGhpcyBzaWduYXR1cmUgYWxzbyByZXF1aXJlcyBleHRyYVxuICAgIC8vICAgICAgb3B0aW9ucyB0byBiZSBwcm92aWRlZCBhcyBhcyBvYmplY3QgKG1vcmUgZXJnb25vbWljIG9wdGlvbikuXG4gICAgLy8gICAyLiBGaXJzdCBhcmd1bWVudCBpcyBhIENvbXBvbmVudCBmYWN0b3J5LiBJbiB0aGlzIGNhc2UgZXh0cmEgb3B0aW9ucyBhcmUgcmVwcmVzZW50ZWQgYXNcbiAgICAvLyAgICAgIHBvc2l0aW9uYWwgYXJndW1lbnRzLiBUaGlzIHNpZ25hdHVyZSBpcyBsZXNzIGVyZ29ub21pYyBhbmQgd2lsbCBiZSBkZXByZWNhdGVkLlxuICAgIGlmIChpc0NvbXBvbmVudEZhY3RvcnkpIHtcbiAgICAgIGlmIChuZ0Rldk1vZGUpIHtcbiAgICAgICAgYXNzZXJ0RXF1YWwoXG4gICAgICAgICAgICB0eXBlb2YgaW5kZXhPck9wdGlvbnMgIT09ICdvYmplY3QnLCB0cnVlLFxuICAgICAgICAgICAgJ0l0IGxvb2tzIGxpa2UgQ29tcG9uZW50IGZhY3Rvcnkgd2FzIHByb3ZpZGVkIGFzIHRoZSBmaXJzdCBhcmd1bWVudCAnICtcbiAgICAgICAgICAgICAgICAnYW5kIGFuIG9wdGlvbnMgb2JqZWN0IGFzIHRoZSBzZWNvbmQgYXJndW1lbnQuIFRoaXMgY29tYmluYXRpb24gb2YgYXJndW1lbnRzICcgK1xuICAgICAgICAgICAgICAgICdpcyBpbmNvbXBhdGlibGUuIFlvdSBjYW4gZWl0aGVyIGNoYW5nZSB0aGUgZmlyc3QgYXJndW1lbnQgdG8gcHJvdmlkZSBDb21wb25lbnQgJyArXG4gICAgICAgICAgICAgICAgJ3R5cGUgb3IgY2hhbmdlIHRoZSBzZWNvbmQgYXJndW1lbnQgdG8gYmUgYSBudW1iZXIgKHJlcHJlc2VudGluZyBhbiBpbmRleCBhdCAnICtcbiAgICAgICAgICAgICAgICAnd2hpY2ggdG8gaW5zZXJ0IHRoZSBuZXcgY29tcG9uZW50XFwncyBob3N0IHZpZXcgaW50byB0aGlzIGNvbnRhaW5lciknKTtcbiAgICAgIH1cbiAgICAgIGluZGV4ID0gaW5kZXhPck9wdGlvbnMgYXMgbnVtYmVyIHwgdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAobmdEZXZNb2RlKSB7XG4gICAgICAgIGFzc2VydERlZmluZWQoXG4gICAgICAgICAgICBnZXRDb21wb25lbnREZWYoY29tcG9uZW50RmFjdG9yeU9yVHlwZSksXG4gICAgICAgICAgICBgUHJvdmlkZWQgQ29tcG9uZW50IGNsYXNzIGRvZXNuJ3QgY29udGFpbiBDb21wb25lbnQgZGVmaW5pdGlvbi4gYCArXG4gICAgICAgICAgICAgICAgYFBsZWFzZSBjaGVjayB3aGV0aGVyIHByb3ZpZGVkIGNsYXNzIGhhcyBAQ29tcG9uZW50IGRlY29yYXRvci5gKTtcbiAgICAgICAgYXNzZXJ0RXF1YWwoXG4gICAgICAgICAgICB0eXBlb2YgaW5kZXhPck9wdGlvbnMgIT09ICdudW1iZXInLCB0cnVlLFxuICAgICAgICAgICAgJ0l0IGxvb2tzIGxpa2UgQ29tcG9uZW50IHR5cGUgd2FzIHByb3ZpZGVkIGFzIHRoZSBmaXJzdCBhcmd1bWVudCAnICtcbiAgICAgICAgICAgICAgICAnYW5kIGEgbnVtYmVyIChyZXByZXNlbnRpbmcgYW4gaW5kZXggYXQgd2hpY2ggdG8gaW5zZXJ0IHRoZSBuZXcgY29tcG9uZW50XFwncyAnICtcbiAgICAgICAgICAgICAgICAnaG9zdCB2aWV3IGludG8gdGhpcyBjb250YWluZXIgYXMgdGhlIHNlY29uZCBhcmd1bWVudC4gVGhpcyBjb21iaW5hdGlvbiBvZiBhcmd1bWVudHMgJyArXG4gICAgICAgICAgICAgICAgJ2lzIGluY29tcGF0aWJsZS4gUGxlYXNlIHVzZSBhbiBvYmplY3QgYXMgdGhlIHNlY29uZCBhcmd1bWVudCBpbnN0ZWFkLicpO1xuICAgICAgfVxuICAgICAgY29uc3Qgb3B0aW9ucyA9IChpbmRleE9yT3B0aW9ucyB8fCB7fSkgYXMge1xuICAgICAgICBpbmRleD86IG51bWJlcixcbiAgICAgICAgaW5qZWN0b3I/OiBJbmplY3RvcixcbiAgICAgICAgbmdNb2R1bGVSZWY/OiBOZ01vZHVsZVJlZjx1bmtub3duPixcbiAgICAgICAgcHJvamVjdGFibGVOb2Rlcz86IE5vZGVbXVtdLFxuICAgICAgfTtcbiAgICAgIGluZGV4ID0gb3B0aW9ucy5pbmRleDtcbiAgICAgIGluamVjdG9yID0gb3B0aW9ucy5pbmplY3RvcjtcbiAgICAgIHByb2plY3RhYmxlTm9kZXMgPSBvcHRpb25zLnByb2plY3RhYmxlTm9kZXM7XG4gICAgICBuZ01vZHVsZVJlZiA9IG9wdGlvbnMubmdNb2R1bGVSZWY7XG4gICAgfVxuXG4gICAgY29uc3QgY29tcG9uZW50RmFjdG9yeTogQ29tcG9uZW50RmFjdG9yeTxDPiA9IGlzQ29tcG9uZW50RmFjdG9yeSA/XG4gICAgICAgIGNvbXBvbmVudEZhY3RvcnlPclR5cGUgYXMgQ29tcG9uZW50RmFjdG9yeTxDPjpcbiAgICAgICAgbmV3IFIzQ29tcG9uZW50RmFjdG9yeShnZXRDb21wb25lbnREZWYoY29tcG9uZW50RmFjdG9yeU9yVHlwZSkhKTtcbiAgICBjb25zdCBjb250ZXh0SW5qZWN0b3IgPSBpbmplY3RvciB8fCB0aGlzLnBhcmVudEluamVjdG9yO1xuXG4gICAgLy8gSWYgYW4gYE5nTW9kdWxlUmVmYCBpcyBub3QgcHJvdmlkZWQgZXhwbGljaXRseSwgdHJ5IHJldHJpZXZpbmcgaXQgZnJvbSB0aGUgREkgdHJlZS5cbiAgICBpZiAoIW5nTW9kdWxlUmVmICYmIChjb21wb25lbnRGYWN0b3J5IGFzIGFueSkubmdNb2R1bGUgPT0gbnVsbCkge1xuICAgICAgLy8gRm9yIHRoZSBgQ29tcG9uZW50RmFjdG9yeWAgY2FzZSwgZW50ZXJpbmcgdGhpcyBsb2dpYyBpcyB2ZXJ5IHVubGlrZWx5LCBzaW5jZSB3ZSBleHBlY3QgdGhhdFxuICAgICAgLy8gYW4gaW5zdGFuY2Ugb2YgYSBgQ29tcG9uZW50RmFjdG9yeWAsIHJlc29sdmVkIHZpYSBgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyYCB3b3VsZCBoYXZlIGFuXG4gICAgICAvLyBgbmdNb2R1bGVgIGZpZWxkLiBUaGlzIGlzIHBvc3NpYmxlIGluIHNvbWUgdGVzdCBzY2VuYXJpb3MgYW5kIHBvdGVudGlhbGx5IGluIHNvbWUgSklULWJhc2VkXG4gICAgICAvLyB1c2UtY2FzZXMuIEZvciB0aGUgYENvbXBvbmVudEZhY3RvcnlgIGNhc2Ugd2UgcHJlc2VydmUgYmFja3dhcmRzLWNvbXBhdGliaWxpdHkgYW5kIHRyeVxuICAgICAgLy8gdXNpbmcgYSBwcm92aWRlZCBpbmplY3RvciBmaXJzdCwgdGhlbiBmYWxsIGJhY2sgdG8gdGhlIHBhcmVudCBpbmplY3RvciBvZiB0aGlzXG4gICAgICAvLyBgVmlld0NvbnRhaW5lclJlZmAgaW5zdGFuY2UuXG4gICAgICAvL1xuICAgICAgLy8gRm9yIHRoZSBmYWN0b3J5LWxlc3MgY2FzZSwgaXQncyBjcml0aWNhbCB0byBlc3RhYmxpc2ggYSBjb25uZWN0aW9uIHdpdGggdGhlIG1vZHVsZVxuICAgICAgLy8gaW5qZWN0b3IgdHJlZSAoYnkgcmV0cmlldmluZyBhbiBpbnN0YW5jZSBvZiBhbiBgTmdNb2R1bGVSZWZgIGFuZCBhY2Nlc3NpbmcgaXRzIGluamVjdG9yKSxcbiAgICAgIC8vIHNvIHRoYXQgYSBjb21wb25lbnQgY2FuIHVzZSBESSB0b2tlbnMgcHJvdmlkZWQgaW4gTWdNb2R1bGVzLiBGb3IgdGhpcyByZWFzb24sIHdlIGNhbiBub3RcbiAgICAgIC8vIHJlbHkgb24gdGhlIHByb3ZpZGVkIGluamVjdG9yLCBzaW5jZSBpdCBtaWdodCBiZSBkZXRhY2hlZCBmcm9tIHRoZSBESSB0cmVlIChmb3IgZXhhbXBsZSwgaWZcbiAgICAgIC8vIGl0IHdhcyBjcmVhdGVkIHZpYSBgSW5qZWN0b3IuY3JlYXRlYCB3aXRob3V0IHNwZWNpZnlpbmcgYSBwYXJlbnQgaW5qZWN0b3IsIG9yIGlmIGFuXG4gICAgICAvLyBpbmplY3RvciBpcyByZXRyaWV2ZWQgZnJvbSBhbiBgTmdNb2R1bGVSZWZgIGNyZWF0ZWQgdmlhIGBjcmVhdGVOZ01vZHVsZVJlZmAgdXNpbmcgYW5cbiAgICAgIC8vIE5nTW9kdWxlIG91dHNpZGUgb2YgYSBtb2R1bGUgdHJlZSkuIEluc3RlYWQsIHdlIGFsd2F5cyB1c2UgYFZpZXdDb250YWluZXJSZWZgJ3MgcGFyZW50XG4gICAgICAvLyBpbmplY3Rvciwgd2hpY2ggaXMgbm9ybWFsbHkgY29ubmVjdGVkIHRvIHRoZSBESSB0cmVlLCB3aGljaCBpbmNsdWRlcyBtb2R1bGUgaW5qZWN0b3JcbiAgICAgIC8vIHN1YnRyZWUuXG4gICAgICBjb25zdCBfaW5qZWN0b3IgPSBpc0NvbXBvbmVudEZhY3RvcnkgPyBjb250ZXh0SW5qZWN0b3IgOiB0aGlzLnBhcmVudEluamVjdG9yO1xuXG4gICAgICAvLyBETyBOT1QgUkVGQUNUT1IuIFRoZSBjb2RlIGhlcmUgdXNlZCB0byBoYXZlIGEgYGluamVjdG9yLmdldChOZ01vZHVsZVJlZiwgbnVsbCkgfHxcbiAgICAgIC8vIHVuZGVmaW5lZGAgZXhwcmVzc2lvbiB3aGljaCBzZWVtcyB0byBjYXVzZSBpbnRlcm5hbCBnb29nbGUgYXBwcyB0byBmYWlsLiBUaGlzIGlzIGRvY3VtZW50ZWRcbiAgICAgIC8vIGluIHRoZSBmb2xsb3dpbmcgaW50ZXJuYWwgYnVnIGlzc3VlOiBnby9iLzE0Mjk2NzgwMlxuICAgICAgY29uc3QgcmVzdWx0ID0gX2luamVjdG9yLmdldChOZ01vZHVsZVJlZiwgbnVsbCk7XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIG5nTW9kdWxlUmVmID0gcmVzdWx0O1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGNvbXBvbmVudFJlZiA9XG4gICAgICAgIGNvbXBvbmVudEZhY3RvcnkuY3JlYXRlKGNvbnRleHRJbmplY3RvciwgcHJvamVjdGFibGVOb2RlcywgdW5kZWZpbmVkLCBuZ01vZHVsZVJlZik7XG4gICAgdGhpcy5pbnNlcnQoY29tcG9uZW50UmVmLmhvc3RWaWV3LCBpbmRleCk7XG4gICAgcmV0dXJuIGNvbXBvbmVudFJlZjtcbiAgfVxuXG4gIG92ZXJyaWRlIGluc2VydCh2aWV3UmVmOiBWaWV3UmVmLCBpbmRleD86IG51bWJlcik6IFZpZXdSZWYge1xuICAgIGNvbnN0IGxWaWV3ID0gKHZpZXdSZWYgYXMgUjNWaWV3UmVmPGFueT4pLl9sVmlldyE7XG4gICAgY29uc3QgdFZpZXcgPSBsVmlld1tUVklFV107XG5cbiAgICBpZiAobmdEZXZNb2RlICYmIHZpZXdSZWYuZGVzdHJveWVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBpbnNlcnQgYSBkZXN0cm95ZWQgVmlldyBpbiBhIFZpZXdDb250YWluZXIhJyk7XG4gICAgfVxuXG4gICAgaWYgKHZpZXdBdHRhY2hlZFRvQ29udGFpbmVyKGxWaWV3KSkge1xuICAgICAgLy8gSWYgdmlldyBpcyBhbHJlYWR5IGF0dGFjaGVkLCBkZXRhY2ggaXQgZmlyc3Qgc28gd2UgY2xlYW4gdXAgcmVmZXJlbmNlcyBhcHByb3ByaWF0ZWx5LlxuXG4gICAgICBjb25zdCBwcmV2SWR4ID0gdGhpcy5pbmRleE9mKHZpZXdSZWYpO1xuXG4gICAgICAvLyBBIHZpZXcgbWlnaHQgYmUgYXR0YWNoZWQgZWl0aGVyIHRvIHRoaXMgb3IgYSBkaWZmZXJlbnQgY29udGFpbmVyLiBUaGUgYHByZXZJZHhgIGZvclxuICAgICAgLy8gdGhvc2UgY2FzZXMgd2lsbCBiZTpcbiAgICAgIC8vIGVxdWFsIHRvIC0xIGZvciB2aWV3cyBhdHRhY2hlZCB0byB0aGlzIFZpZXdDb250YWluZXJSZWZcbiAgICAgIC8vID49IDAgZm9yIHZpZXdzIGF0dGFjaGVkIHRvIGEgZGlmZmVyZW50IFZpZXdDb250YWluZXJSZWZcbiAgICAgIGlmIChwcmV2SWR4ICE9PSAtMSkge1xuICAgICAgICB0aGlzLmRldGFjaChwcmV2SWR4KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHByZXZMQ29udGFpbmVyID0gbFZpZXdbUEFSRU5UXSBhcyBMQ29udGFpbmVyO1xuICAgICAgICBuZ0Rldk1vZGUgJiZcbiAgICAgICAgICAgIGFzc2VydEVxdWFsKFxuICAgICAgICAgICAgICAgIGlzTENvbnRhaW5lcihwcmV2TENvbnRhaW5lciksIHRydWUsXG4gICAgICAgICAgICAgICAgJ0FuIGF0dGFjaGVkIHZpZXcgc2hvdWxkIGhhdmUgaXRzIFBBUkVOVCBwb2ludCB0byBhIGNvbnRhaW5lci4nKTtcblxuXG4gICAgICAgIC8vIFdlIG5lZWQgdG8gcmUtY3JlYXRlIGEgUjNWaWV3Q29udGFpbmVyUmVmIGluc3RhbmNlIHNpbmNlIHRob3NlIGFyZSBub3Qgc3RvcmVkIG9uXG4gICAgICAgIC8vIExWaWV3IChub3IgYW55d2hlcmUgZWxzZSkuXG4gICAgICAgIGNvbnN0IHByZXZWQ1JlZiA9IG5ldyBSM1ZpZXdDb250YWluZXJSZWYoXG4gICAgICAgICAgICBwcmV2TENvbnRhaW5lciwgcHJldkxDb250YWluZXJbVF9IT1NUXSBhcyBURGlyZWN0aXZlSG9zdE5vZGUsIHByZXZMQ29udGFpbmVyW1BBUkVOVF0pO1xuXG4gICAgICAgIHByZXZWQ1JlZi5kZXRhY2gocHJldlZDUmVmLmluZGV4T2Yodmlld1JlZikpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIExvZ2ljYWwgb3BlcmF0aW9uIG9mIGFkZGluZyBgTFZpZXdgIHRvIGBMQ29udGFpbmVyYFxuICAgIGNvbnN0IGFkanVzdGVkSWR4ID0gdGhpcy5fYWRqdXN0SW5kZXgoaW5kZXgpO1xuICAgIGNvbnN0IGxDb250YWluZXIgPSB0aGlzLl9sQ29udGFpbmVyO1xuICAgIGluc2VydFZpZXcodFZpZXcsIGxWaWV3LCBsQ29udGFpbmVyLCBhZGp1c3RlZElkeCk7XG5cbiAgICAvLyBQaHlzaWNhbCBvcGVyYXRpb24gb2YgYWRkaW5nIHRoZSBET00gbm9kZXMuXG4gICAgY29uc3QgYmVmb3JlTm9kZSA9IGdldEJlZm9yZU5vZGVGb3JWaWV3KGFkanVzdGVkSWR4LCBsQ29udGFpbmVyKTtcbiAgICBjb25zdCByZW5kZXJlciA9IGxWaWV3W1JFTkRFUkVSXTtcbiAgICBjb25zdCBwYXJlbnRSTm9kZSA9IG5hdGl2ZVBhcmVudE5vZGUocmVuZGVyZXIsIGxDb250YWluZXJbTkFUSVZFXSBhcyBSRWxlbWVudCB8IFJDb21tZW50KTtcbiAgICBpZiAocGFyZW50Uk5vZGUgIT09IG51bGwpIHtcbiAgICAgIGFkZFZpZXdUb0NvbnRhaW5lcih0VmlldywgbENvbnRhaW5lcltUX0hPU1RdLCByZW5kZXJlciwgbFZpZXcsIHBhcmVudFJOb2RlLCBiZWZvcmVOb2RlKTtcbiAgICB9XG5cbiAgICAodmlld1JlZiBhcyBSM1ZpZXdSZWY8YW55PikuYXR0YWNoVG9WaWV3Q29udGFpbmVyUmVmKCk7XG4gICAgYWRkVG9BcnJheShnZXRPckNyZWF0ZVZpZXdSZWZzKGxDb250YWluZXIpLCBhZGp1c3RlZElkeCwgdmlld1JlZik7XG5cbiAgICByZXR1cm4gdmlld1JlZjtcbiAgfVxuXG4gIG92ZXJyaWRlIG1vdmUodmlld1JlZjogVmlld1JlZiwgbmV3SW5kZXg6IG51bWJlcik6IFZpZXdSZWYge1xuICAgIGlmIChuZ0Rldk1vZGUgJiYgdmlld1JlZi5kZXN0cm95ZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IG1vdmUgYSBkZXN0cm95ZWQgVmlldyBpbiBhIFZpZXdDb250YWluZXIhJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmluc2VydCh2aWV3UmVmLCBuZXdJbmRleCk7XG4gIH1cblxuICBvdmVycmlkZSBpbmRleE9mKHZpZXdSZWY6IFZpZXdSZWYpOiBudW1iZXIge1xuICAgIGNvbnN0IHZpZXdSZWZzQXJyID0gZ2V0Vmlld1JlZnModGhpcy5fbENvbnRhaW5lcik7XG4gICAgcmV0dXJuIHZpZXdSZWZzQXJyICE9PSBudWxsID8gdmlld1JlZnNBcnIuaW5kZXhPZih2aWV3UmVmKSA6IC0xO1xuICB9XG5cbiAgb3ZlcnJpZGUgcmVtb3ZlKGluZGV4PzogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgYWRqdXN0ZWRJZHggPSB0aGlzLl9hZGp1c3RJbmRleChpbmRleCwgLTEpO1xuICAgIGNvbnN0IGRldGFjaGVkVmlldyA9IGRldGFjaFZpZXcodGhpcy5fbENvbnRhaW5lciwgYWRqdXN0ZWRJZHgpO1xuXG4gICAgaWYgKGRldGFjaGVkVmlldykge1xuICAgICAgLy8gQmVmb3JlIGRlc3Ryb3lpbmcgdGhlIHZpZXcsIHJlbW92ZSBpdCBmcm9tIHRoZSBjb250YWluZXIncyBhcnJheSBvZiBgVmlld1JlZmBzLlxuICAgICAgLy8gVGhpcyBlbnN1cmVzIHRoZSB2aWV3IGNvbnRhaW5lciBsZW5ndGggaXMgdXBkYXRlZCBiZWZvcmUgY2FsbGluZ1xuICAgICAgLy8gYGRlc3Ryb3lMVmlld2AsIHdoaWNoIGNvdWxkIHJlY3Vyc2l2ZWx5IGNhbGwgdmlldyBjb250YWluZXIgbWV0aG9kcyB0aGF0XG4gICAgICAvLyByZWx5IG9uIGFuIGFjY3VyYXRlIGNvbnRhaW5lciBsZW5ndGguXG4gICAgICAvLyAoZS5nLiBhIG1ldGhvZCBvbiB0aGlzIHZpZXcgY29udGFpbmVyIGJlaW5nIGNhbGxlZCBieSBhIGNoaWxkIGRpcmVjdGl2ZSdzIE9uRGVzdHJveVxuICAgICAgLy8gbGlmZWN5Y2xlIGhvb2spXG4gICAgICByZW1vdmVGcm9tQXJyYXkoZ2V0T3JDcmVhdGVWaWV3UmVmcyh0aGlzLl9sQ29udGFpbmVyKSwgYWRqdXN0ZWRJZHgpO1xuICAgICAgZGVzdHJveUxWaWV3KGRldGFjaGVkVmlld1tUVklFV10sIGRldGFjaGVkVmlldyk7XG4gICAgfVxuICB9XG5cbiAgb3ZlcnJpZGUgZGV0YWNoKGluZGV4PzogbnVtYmVyKTogVmlld1JlZnxudWxsIHtcbiAgICBjb25zdCBhZGp1c3RlZElkeCA9IHRoaXMuX2FkanVzdEluZGV4KGluZGV4LCAtMSk7XG4gICAgY29uc3QgdmlldyA9IGRldGFjaFZpZXcodGhpcy5fbENvbnRhaW5lciwgYWRqdXN0ZWRJZHgpO1xuXG4gICAgY29uc3Qgd2FzRGV0YWNoZWQgPVxuICAgICAgICB2aWV3ICYmIHJlbW92ZUZyb21BcnJheShnZXRPckNyZWF0ZVZpZXdSZWZzKHRoaXMuX2xDb250YWluZXIpLCBhZGp1c3RlZElkeCkgIT0gbnVsbDtcbiAgICByZXR1cm4gd2FzRGV0YWNoZWQgPyBuZXcgUjNWaWV3UmVmKHZpZXchKSA6IG51bGw7XG4gIH1cblxuICBwcml2YXRlIF9hZGp1c3RJbmRleChpbmRleD86IG51bWJlciwgc2hpZnQ6IG51bWJlciA9IDApIHtcbiAgICBpZiAoaW5kZXggPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMubGVuZ3RoICsgc2hpZnQ7XG4gICAgfVxuICAgIGlmIChuZ0Rldk1vZGUpIHtcbiAgICAgIGFzc2VydEdyZWF0ZXJUaGFuKGluZGV4LCAtMSwgYFZpZXdSZWYgaW5kZXggbXVzdCBiZSBwb3NpdGl2ZSwgZ290ICR7aW5kZXh9YCk7XG4gICAgICAvLyArMSBiZWNhdXNlIGl0J3MgbGVnYWwgdG8gaW5zZXJ0IGF0IHRoZSBlbmQuXG4gICAgICBhc3NlcnRMZXNzVGhhbihpbmRleCwgdGhpcy5sZW5ndGggKyAxICsgc2hpZnQsICdpbmRleCcpO1xuICAgIH1cbiAgICByZXR1cm4gaW5kZXg7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGdldFZpZXdSZWZzKGxDb250YWluZXI6IExDb250YWluZXIpOiBWaWV3UmVmW118bnVsbCB7XG4gIHJldHVybiBsQ29udGFpbmVyW1ZJRVdfUkVGU10gYXMgVmlld1JlZltdO1xufVxuXG5mdW5jdGlvbiBnZXRPckNyZWF0ZVZpZXdSZWZzKGxDb250YWluZXI6IExDb250YWluZXIpOiBWaWV3UmVmW10ge1xuICByZXR1cm4gKGxDb250YWluZXJbVklFV19SRUZTXSB8fCAobENvbnRhaW5lcltWSUVXX1JFRlNdID0gW10pKSBhcyBWaWV3UmVmW107XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIFZpZXdDb250YWluZXJSZWYgYW5kIHN0b3JlcyBpdCBvbiB0aGUgaW5qZWN0b3IuXG4gKlxuICogQHBhcmFtIFZpZXdDb250YWluZXJSZWZUb2tlbiBUaGUgVmlld0NvbnRhaW5lclJlZiB0eXBlXG4gKiBAcGFyYW0gRWxlbWVudFJlZlRva2VuIFRoZSBFbGVtZW50UmVmIHR5cGVcbiAqIEBwYXJhbSBob3N0VE5vZGUgVGhlIG5vZGUgdGhhdCBpcyByZXF1ZXN0aW5nIGEgVmlld0NvbnRhaW5lclJlZlxuICogQHBhcmFtIGhvc3RMVmlldyBUaGUgdmlldyB0byB3aGljaCB0aGUgbm9kZSBiZWxvbmdzXG4gKiBAcmV0dXJucyBUaGUgVmlld0NvbnRhaW5lclJlZiBpbnN0YW5jZSB0byB1c2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNvbnRhaW5lclJlZihcbiAgICBob3N0VE5vZGU6IFRFbGVtZW50Tm9kZXxUQ29udGFpbmVyTm9kZXxURWxlbWVudENvbnRhaW5lck5vZGUsXG4gICAgaG9zdExWaWV3OiBMVmlldyk6IFZpZXdDb250YWluZXJSZWYge1xuICBuZ0Rldk1vZGUgJiYgYXNzZXJ0VE5vZGVUeXBlKGhvc3RUTm9kZSwgVE5vZGVUeXBlLkFueUNvbnRhaW5lciB8IFROb2RlVHlwZS5BbnlSTm9kZSk7XG5cbiAgbGV0IGxDb250YWluZXI6IExDb250YWluZXI7XG4gIGNvbnN0IHNsb3RWYWx1ZSA9IGhvc3RMVmlld1tob3N0VE5vZGUuaW5kZXhdO1xuICBpZiAoaXNMQ29udGFpbmVyKHNsb3RWYWx1ZSkpIHtcbiAgICAvLyBJZiB0aGUgaG9zdCBpcyBhIGNvbnRhaW5lciwgd2UgZG9uJ3QgbmVlZCB0byBjcmVhdGUgYSBuZXcgTENvbnRhaW5lclxuICAgIGxDb250YWluZXIgPSBzbG90VmFsdWU7XG4gIH0gZWxzZSB7XG4gICAgbGV0IGNvbW1lbnROb2RlOiBSQ29tbWVudDtcbiAgICAvLyBJZiB0aGUgaG9zdCBpcyBhbiBlbGVtZW50IGNvbnRhaW5lciwgdGhlIG5hdGl2ZSBob3N0IGVsZW1lbnQgaXMgZ3VhcmFudGVlZCB0byBiZSBhXG4gICAgLy8gY29tbWVudCBhbmQgd2UgY2FuIHJldXNlIHRoYXQgY29tbWVudCBhcyBhbmNob3IgZWxlbWVudCBmb3IgdGhlIG5ldyBMQ29udGFpbmVyLlxuICAgIC8vIFRoZSBjb21tZW50IG5vZGUgaW4gcXVlc3Rpb24gaXMgYWxyZWFkeSBwYXJ0IG9mIHRoZSBET00gc3RydWN0dXJlIHNvIHdlIGRvbid0IG5lZWQgdG8gYXBwZW5kXG4gICAgLy8gaXQgYWdhaW4uXG4gICAgaWYgKGhvc3RUTm9kZS50eXBlICYgVE5vZGVUeXBlLkVsZW1lbnRDb250YWluZXIpIHtcbiAgICAgIGNvbW1lbnROb2RlID0gdW53cmFwUk5vZGUoc2xvdFZhbHVlKSBhcyBSQ29tbWVudDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgdGhlIGhvc3QgaXMgYSByZWd1bGFyIGVsZW1lbnQsIHdlIGhhdmUgdG8gaW5zZXJ0IGEgY29tbWVudCBub2RlIG1hbnVhbGx5IHdoaWNoIHdpbGxcbiAgICAgIC8vIGJlIHVzZWQgYXMgYW4gYW5jaG9yIHdoZW4gaW5zZXJ0aW5nIGVsZW1lbnRzLiBJbiB0aGlzIHNwZWNpZmljIGNhc2Ugd2UgdXNlIGxvdy1sZXZlbCBET01cbiAgICAgIC8vIG1hbmlwdWxhdGlvbiB0byBpbnNlcnQgaXQuXG4gICAgICBjb25zdCByZW5kZXJlciA9IGhvc3RMVmlld1tSRU5ERVJFUl07XG4gICAgICBuZ0Rldk1vZGUgJiYgbmdEZXZNb2RlLnJlbmRlcmVyQ3JlYXRlQ29tbWVudCsrO1xuICAgICAgY29tbWVudE5vZGUgPSByZW5kZXJlci5jcmVhdGVDb21tZW50KG5nRGV2TW9kZSA/ICdjb250YWluZXInIDogJycpO1xuXG4gICAgICBjb25zdCBob3N0TmF0aXZlID0gZ2V0TmF0aXZlQnlUTm9kZShob3N0VE5vZGUsIGhvc3RMVmlldykhO1xuICAgICAgY29uc3QgcGFyZW50T2ZIb3N0TmF0aXZlID0gbmF0aXZlUGFyZW50Tm9kZShyZW5kZXJlciwgaG9zdE5hdGl2ZSk7XG4gICAgICBuYXRpdmVJbnNlcnRCZWZvcmUoXG4gICAgICAgICAgcmVuZGVyZXIsIHBhcmVudE9mSG9zdE5hdGl2ZSEsIGNvbW1lbnROb2RlLCBuYXRpdmVOZXh0U2libGluZyhyZW5kZXJlciwgaG9zdE5hdGl2ZSksXG4gICAgICAgICAgZmFsc2UpO1xuICAgIH1cblxuICAgIGhvc3RMVmlld1tob3N0VE5vZGUuaW5kZXhdID0gbENvbnRhaW5lciA9XG4gICAgICAgIGNyZWF0ZUxDb250YWluZXIoc2xvdFZhbHVlLCBob3N0TFZpZXcsIGNvbW1lbnROb2RlLCBob3N0VE5vZGUpO1xuXG4gICAgYWRkVG9WaWV3VHJlZShob3N0TFZpZXcsIGxDb250YWluZXIpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBSM1ZpZXdDb250YWluZXJSZWYobENvbnRhaW5lciwgaG9zdFROb2RlLCBob3N0TFZpZXcpO1xufVxuIl19