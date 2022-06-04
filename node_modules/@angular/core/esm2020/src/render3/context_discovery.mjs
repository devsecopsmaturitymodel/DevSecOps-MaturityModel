/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import '../util/ng_dev_mode';
import { assertDefined, assertDomNode } from '../util/assert';
import { EMPTY_ARRAY } from '../util/empty';
import { CONTEXT, HEADER_OFFSET, HOST, TVIEW } from './interfaces/view';
import { getComponentLViewByIndex, unwrapRNode } from './util/view_utils';
/**
 * Returns the matching `LContext` data for a given DOM node, directive or component instance.
 *
 * This function will examine the provided DOM element, component, or directive instance\'s
 * monkey-patched property to derive the `LContext` data. Once called then the monkey-patched
 * value will be that of the newly created `LContext`.
 *
 * If the monkey-patched value is the `LView` instance then the context value for that
 * target will be created and the monkey-patch reference will be updated. Therefore when this
 * function is called it may mutate the provided element\'s, component\'s or any of the associated
 * directive\'s monkey-patch values.
 *
 * If the monkey-patch value is not detected then the code will walk up the DOM until an element
 * is found which contains a monkey-patch reference. When that occurs then the provided element
 * will be updated with a new context (which is then returned). If the monkey-patch value is not
 * detected for a component/directive instance then it will throw an error (all components and
 * directives should be automatically monkey-patched by ivy).
 *
 * @param target Component, Directive or DOM Node.
 */
export function getLContext(target) {
    let mpValue = readPatchedData(target);
    if (mpValue) {
        // only when it's an array is it considered an LView instance
        // ... otherwise it's an already constructed LContext instance
        if (Array.isArray(mpValue)) {
            const lView = mpValue;
            let nodeIndex;
            let component = undefined;
            let directives = undefined;
            if (isComponentInstance(target)) {
                nodeIndex = findViaComponent(lView, target);
                if (nodeIndex == -1) {
                    throw new Error('The provided component was not found in the application');
                }
                component = target;
            }
            else if (isDirectiveInstance(target)) {
                nodeIndex = findViaDirective(lView, target);
                if (nodeIndex == -1) {
                    throw new Error('The provided directive was not found in the application');
                }
                directives = getDirectivesAtNodeIndex(nodeIndex, lView, false);
            }
            else {
                nodeIndex = findViaNativeElement(lView, target);
                if (nodeIndex == -1) {
                    return null;
                }
            }
            // the goal is not to fill the entire context full of data because the lookups
            // are expensive. Instead, only the target data (the element, component, container, ICU
            // expression or directive details) are filled into the context. If called multiple times
            // with different target values then the missing target data will be filled in.
            const native = unwrapRNode(lView[nodeIndex]);
            const existingCtx = readPatchedData(native);
            const context = (existingCtx && !Array.isArray(existingCtx)) ?
                existingCtx :
                createLContext(lView, nodeIndex, native);
            // only when the component has been discovered then update the monkey-patch
            if (component && context.component === undefined) {
                context.component = component;
                attachPatchData(context.component, context);
            }
            // only when the directives have been discovered then update the monkey-patch
            if (directives && context.directives === undefined) {
                context.directives = directives;
                for (let i = 0; i < directives.length; i++) {
                    attachPatchData(directives[i], context);
                }
            }
            attachPatchData(context.native, context);
            mpValue = context;
        }
    }
    else {
        const rElement = target;
        ngDevMode && assertDomNode(rElement);
        // if the context is not found then we need to traverse upwards up the DOM
        // to find the nearest element that has already been monkey patched with data
        let parent = rElement;
        while (parent = parent.parentNode) {
            const parentContext = readPatchedData(parent);
            if (parentContext) {
                let lView;
                if (Array.isArray(parentContext)) {
                    lView = parentContext;
                }
                else {
                    lView = parentContext.lView;
                }
                // the edge of the app was also reached here through another means
                // (maybe because the DOM was changed manually).
                if (!lView) {
                    return null;
                }
                const index = findViaNativeElement(lView, rElement);
                if (index >= 0) {
                    const native = unwrapRNode(lView[index]);
                    const context = createLContext(lView, index, native);
                    attachPatchData(native, context);
                    mpValue = context;
                    break;
                }
            }
        }
    }
    return mpValue || null;
}
/**
 * Creates an empty instance of a `LContext` context
 */
function createLContext(lView, nodeIndex, native) {
    return {
        lView,
        nodeIndex,
        native,
        component: undefined,
        directives: undefined,
        localRefs: undefined,
    };
}
/**
 * Takes a component instance and returns the view for that component.
 *
 * @param componentInstance
 * @returns The component's view
 */
export function getComponentViewByInstance(componentInstance) {
    let lView = readPatchedData(componentInstance);
    let view;
    if (Array.isArray(lView)) {
        const nodeIndex = findViaComponent(lView, componentInstance);
        view = getComponentLViewByIndex(nodeIndex, lView);
        const context = createLContext(lView, nodeIndex, view[HOST]);
        context.component = componentInstance;
        attachPatchData(componentInstance, context);
        attachPatchData(context.native, context);
    }
    else {
        const context = lView;
        view = getComponentLViewByIndex(context.nodeIndex, context.lView);
    }
    return view;
}
/**
 * This property will be monkey-patched on elements, components and directives.
 */
const MONKEY_PATCH_KEY_NAME = '__ngContext__';
/**
 * Assigns the given data to the given target (which could be a component,
 * directive or DOM node instance) using monkey-patching.
 */
export function attachPatchData(target, data) {
    ngDevMode && assertDefined(target, 'Target expected');
    target[MONKEY_PATCH_KEY_NAME] = data;
}
/**
 * Returns the monkey-patch value data present on the target (which could be
 * a component, directive or a DOM node).
 */
export function readPatchedData(target) {
    ngDevMode && assertDefined(target, 'Target expected');
    return target[MONKEY_PATCH_KEY_NAME] || null;
}
export function readPatchedLView(target) {
    const value = readPatchedData(target);
    if (value) {
        return Array.isArray(value) ? value : value.lView;
    }
    return null;
}
export function isComponentInstance(instance) {
    return instance && instance.constructor && instance.constructor.ɵcmp;
}
export function isDirectiveInstance(instance) {
    return instance && instance.constructor && instance.constructor.ɵdir;
}
/**
 * Locates the element within the given LView and returns the matching index
 */
function findViaNativeElement(lView, target) {
    const tView = lView[TVIEW];
    for (let i = HEADER_OFFSET; i < tView.bindingStartIndex; i++) {
        if (unwrapRNode(lView[i]) === target) {
            return i;
        }
    }
    return -1;
}
/**
 * Locates the next tNode (child, sibling or parent).
 */
function traverseNextElement(tNode) {
    if (tNode.child) {
        return tNode.child;
    }
    else if (tNode.next) {
        return tNode.next;
    }
    else {
        // Let's take the following template: <div><span>text</span></div><component/>
        // After checking the text node, we need to find the next parent that has a "next" TNode,
        // in this case the parent `div`, so that we can find the component.
        while (tNode.parent && !tNode.parent.next) {
            tNode = tNode.parent;
        }
        return tNode.parent && tNode.parent.next;
    }
}
/**
 * Locates the component within the given LView and returns the matching index
 */
function findViaComponent(lView, componentInstance) {
    const componentIndices = lView[TVIEW].components;
    if (componentIndices) {
        for (let i = 0; i < componentIndices.length; i++) {
            const elementComponentIndex = componentIndices[i];
            const componentView = getComponentLViewByIndex(elementComponentIndex, lView);
            if (componentView[CONTEXT] === componentInstance) {
                return elementComponentIndex;
            }
        }
    }
    else {
        const rootComponentView = getComponentLViewByIndex(HEADER_OFFSET, lView);
        const rootComponent = rootComponentView[CONTEXT];
        if (rootComponent === componentInstance) {
            // we are dealing with the root element here therefore we know that the
            // element is the very first element after the HEADER data in the lView
            return HEADER_OFFSET;
        }
    }
    return -1;
}
/**
 * Locates the directive within the given LView and returns the matching index
 */
function findViaDirective(lView, directiveInstance) {
    // if a directive is monkey patched then it will (by default)
    // have a reference to the LView of the current view. The
    // element bound to the directive being search lives somewhere
    // in the view data. We loop through the nodes and check their
    // list of directives for the instance.
    let tNode = lView[TVIEW].firstChild;
    while (tNode) {
        const directiveIndexStart = tNode.directiveStart;
        const directiveIndexEnd = tNode.directiveEnd;
        for (let i = directiveIndexStart; i < directiveIndexEnd; i++) {
            if (lView[i] === directiveInstance) {
                return tNode.index;
            }
        }
        tNode = traverseNextElement(tNode);
    }
    return -1;
}
/**
 * Returns a list of directives extracted from the given view based on the
 * provided list of directive index values.
 *
 * @param nodeIndex The node index
 * @param lView The target view data
 * @param includeComponents Whether or not to include components in returned directives
 */
export function getDirectivesAtNodeIndex(nodeIndex, lView, includeComponents) {
    const tNode = lView[TVIEW].data[nodeIndex];
    let directiveStartIndex = tNode.directiveStart;
    if (directiveStartIndex == 0)
        return EMPTY_ARRAY;
    const directiveEndIndex = tNode.directiveEnd;
    if (!includeComponents && tNode.flags & 2 /* isComponentHost */)
        directiveStartIndex++;
    return lView.slice(directiveStartIndex, directiveEndIndex);
}
export function getComponentAtNodeIndex(nodeIndex, lView) {
    const tNode = lView[TVIEW].data[nodeIndex];
    let directiveStartIndex = tNode.directiveStart;
    return tNode.flags & 2 /* isComponentHost */ ? lView[directiveStartIndex] : null;
}
/**
 * Returns a map of local references (local reference name => element or directive instance) that
 * exist on a given element.
 */
export function discoverLocalRefs(lView, nodeIndex) {
    const tNode = lView[TVIEW].data[nodeIndex];
    if (tNode && tNode.localNames) {
        const result = {};
        let localIndex = tNode.index + 1;
        for (let i = 0; i < tNode.localNames.length; i += 2) {
            result[tNode.localNames[i]] = lView[localIndex];
            localIndex++;
        }
        return result;
    }
    return null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dF9kaXNjb3ZlcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9yZW5kZXIzL2NvbnRleHRfZGlzY292ZXJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8scUJBQXFCLENBQUM7QUFFN0IsT0FBTyxFQUFDLGFBQWEsRUFBRSxhQUFhLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM1RCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBSzFDLE9BQU8sRUFBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBUyxLQUFLLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUM3RSxPQUFPLEVBQUMsd0JBQXdCLEVBQUUsV0FBVyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFJeEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtQkc7QUFDSCxNQUFNLFVBQVUsV0FBVyxDQUFDLE1BQVc7SUFDckMsSUFBSSxPQUFPLEdBQUcsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3RDLElBQUksT0FBTyxFQUFFO1FBQ1gsNkRBQTZEO1FBQzdELDhEQUE4RDtRQUM5RCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDMUIsTUFBTSxLQUFLLEdBQVUsT0FBUSxDQUFDO1lBQzlCLElBQUksU0FBaUIsQ0FBQztZQUN0QixJQUFJLFNBQVMsR0FBUSxTQUFTLENBQUM7WUFDL0IsSUFBSSxVQUFVLEdBQXlCLFNBQVMsQ0FBQztZQUVqRCxJQUFJLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUMvQixTQUFTLEdBQUcsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUM1QyxJQUFJLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRTtvQkFDbkIsTUFBTSxJQUFJLEtBQUssQ0FBQyx5REFBeUQs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QUFNLFVBQVUsaUJBQWlCLENBQUMsS0FBWSxFQUFFLFNBQWlCO0lBQy9ELE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFVLENBQUM7SUFDcEQsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLFVBQVUsRUFBRTtRQUM3QixNQUFNLE1BQU0sR0FBeUIsRUFBRSxDQUFDO1FBQ3hDLElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2pDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ25ELE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ2hELFVBQVUsRUFBRSxDQUFDO1NBQ2Q7UUFDRCxPQUFPLE1BQU0sQ0FBQztLQUNmO0lBRUQsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgJy4uL3V0aWwvbmdfZGV2X21vZGUnO1xuXG5pbXBvcnQge2Fzc2VydERlZmluZWQsIGFzc2VydERvbU5vZGV9IGZyb20gJy4uL3V0aWwvYXNzZXJ0JztcbmltcG9ydCB7RU1QVFlfQVJSQVl9IGZyb20gJy4uL3V0aWwvZW1wdHknO1xuXG5pbXBvcnQge0xDb250ZXh0fSBmcm9tICcuL2ludGVyZmFjZXMvY29udGV4dCc7XG5pbXBvcnQge1ROb2RlLCBUTm9kZUZsYWdzfSBmcm9tICcuL2ludGVyZmFjZXMvbm9kZSc7XG5pbXBvcnQge1JFbGVtZW50LCBSTm9kZX0gZnJvbSAnLi9pbnRlcmZhY2VzL3JlbmRlcmVyX2RvbSc7XG5pbXBvcnQge0NPTlRFWFQsIEhFQURFUl9PRkZTRVQsIEhPU1QsIExWaWV3LCBUVklFV30gZnJvbSAnLi9pbnRlcmZhY2VzL3ZpZXcnO1xuaW1wb3J0IHtnZXRDb21wb25lbnRMVmlld0J5SW5kZXgsIHVud3JhcFJOb2RlfSBmcm9tICcuL3V0aWwvdmlld191dGlscyc7XG5cblxuXG4vKipcbiAqIFJldHVybnMgdGhlIG1hdGNoaW5nIGBMQ29udGV4dGAgZGF0YSBmb3IgYSBnaXZlbiBET00gbm9kZSwgZGlyZWN0aXZlIG9yIGNvbXBvbmVudCBpbnN0YW5jZS5cbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIHdpbGwgZXhhbWluZSB0aGUgcHJvdmlkZWQgRE9NIGVsZW1lbnQsIGNvbXBvbmVudCwgb3IgZGlyZWN0aXZlIGluc3RhbmNlXFwnc1xuICogbW9ua2V5LXBhdGNoZWQgcHJvcGVydHkgdG8gZGVyaXZlIHRoZSBgTENvbnRleHRgIGRhdGEuIE9uY2UgY2FsbGVkIHRoZW4gdGhlIG1vbmtleS1wYXRjaGVkXG4gKiB2YWx1ZSB3aWxsIGJlIHRoYXQgb2YgdGhlIG5ld2x5IGNyZWF0ZWQgYExDb250ZXh0YC5cbiAqXG4gKiBJZiB0aGUgbW9ua2V5LXBhdGNoZWQgdmFsdWUgaXMgdGhlIGBMVmlld2AgaW5zdGFuY2UgdGhlbiB0aGUgY29udGV4dCB2YWx1ZSBmb3IgdGhhdFxuICogdGFyZ2V0IHdpbGwgYmUgY3JlYXRlZCBhbmQgdGhlIG1vbmtleS1wYXRjaCByZWZlcmVuY2Ugd2lsbCBiZSB1cGRhdGVkLiBUaGVyZWZvcmUgd2hlbiB0aGlzXG4gKiBmdW5jdGlvbiBpcyBjYWxsZWQgaXQgbWF5IG11dGF0ZSB0aGUgcHJvdmlkZWQgZWxlbWVudFxcJ3MsIGNvbXBvbmVudFxcJ3Mgb3IgYW55IG9mIHRoZSBhc3NvY2lhdGVkXG4gKiBkaXJlY3RpdmVcXCdzIG1vbmtleS1wYXRjaCB2YWx1ZXMuXG4gKlxuICogSWYgdGhlIG1vbmtleS1wYXRjaCB2YWx1ZSBpcyBub3QgZGV0ZWN0ZWQgdGhlbiB0aGUgY29kZSB3aWxsIHdhbGsgdXAgdGhlIERPTSB1bnRpbCBhbiBlbGVtZW50XG4gKiBpcyBmb3VuZCB3aGljaCBjb250YWlucyBhIG1vbmtleS1wYXRjaCByZWZlcmVuY2UuIFdoZW4gdGhhdCBvY2N1cnMgdGhlbiB0aGUgcHJvdmlkZWQgZWxlbWVudFxuICogd2lsbCBiZSB1cGRhdGVkIHdpdGggYSBuZXcgY29udGV4dCAod2hpY2ggaXMgdGhlbiByZXR1cm5lZCkuIElmIHRoZSBtb25rZXktcGF0Y2ggdmFsdWUgaXMgbm90XG4gKiBkZXRlY3RlZCBmb3IgYSBjb21wb25lbnQvZGlyZWN0aXZlIGluc3RhbmNlIHRoZW4gaXQgd2lsbCB0aHJvdyBhbiBlcnJvciAoYWxsIGNvbXBvbmVudHMgYW5kXG4gKiBkaXJlY3RpdmVzIHNob3VsZCBiZSBhdXRvbWF0aWNhbGx5IG1vbmtleS1wYXRjaGVkIGJ5IGl2eSkuXG4gKlxuICogQHBhcmFtIHRhcmdldCBDb21wb25lbnQsIERpcmVjdGl2ZSBvciBET00gTm9kZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldExDb250ZXh0KHRhcmdldDogYW55KTogTENvbnRleHR8bnVsbCB7XG4gIGxldCBtcFZhbHVlID0gcmVhZFBhdGNoZWREYXRhKHRhcmdldCk7XG4gIGlmIChtcFZhbHVlKSB7XG4gICAgLy8gb25seSB3aGVuIGl0J3MgYW4gYXJyYXkgaXMgaXQgY29uc2lkZXJlZCBhbiBMVmlldyBpbnN0YW5jZVxuICAgIC8vIC4uLiBvdGhlcndpc2UgaXQncyBhbiBhbHJlYWR5IGNvbnN0cnVjdGVkIExDb250ZXh0IGluc3RhbmNlXG4gICAgaWYgKEFycmF5LmlzQXJyYXkobXBWYWx1ZSkpIHtcbiAgICAgIGNvbnN0IGxWaWV3OiBMVmlldyA9IG1wVmFsdWUhO1xuICAgICAgbGV0IG5vZGVJbmRleDogbnVtYmVyO1xuICAgICAgbGV0IGNvbXBvbmVudDogYW55ID0gdW5kZWZpbmVkO1xuICAgICAgbGV0IGRpcmVjdGl2ZXM6IGFueVtdfG51bGx8dW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXG4gICAgICBpZiAoaXNDb21wb25lbnRJbnN0YW5jZSh0YXJnZXQpKSB7XG4gICAgICAgIG5vZGVJbmRleCA9IGZpbmRWaWFDb21wb25lbnQobFZpZXcsIHRhcmdldCk7XG4gICAgICAgIGlmIChub2RlSW5kZXggPT0gLTEpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBwcm92aWRlZCBjb21wb25lbnQgd2FzIG5vdCBmb3VuZCBpbiB0aGUgYXBwbGljYXRpb24nKTtcbiAgICAgICAgfVxuICAgICAgICBjb21wb25lbnQgPSB0YXJnZXQ7XG4gICAgICB9IGVsc2UgaWYgKGlzRGlyZWN0aXZlSW5zdGFuY2UodGFyZ2V0KSkge1xuICAgICAgICBub2RlSW5kZXggPSBmaW5kVmlhRGlyZWN0aXZlKGxWaWV3LCB0YXJnZXQpO1xuICAgICAgICBpZiAobm9kZUluZGV4ID09IC0xKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgcHJvdmlkZWQgZGlyZWN0aXZlIHdhcyBub3QgZm91bmQgaW4gdGhlIGFwcGxpY2F0aW9uJyk7XG4gICAgICAgIH1cbiAgICAgICAgZGlyZWN0aXZlcyA9IGdldERpcmVjdGl2ZXNBdE5vZGVJbmRleChub2RlSW5kZXgsIGxWaWV3LCBmYWxzZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub2RlSW5kZXggPSBmaW5kVmlhTmF0aXZlRWxlbWVudChsVmlldywgdGFyZ2V0IGFzIFJFbGVtZW50KTtcbiAgICAgICAgaWYgKG5vZGVJbmRleCA9PSAtMSkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHRoZSBnb2FsIGlzIG5vdCB0byBmaWxsIHRoZSBlbnRpcmUgY29udGV4dCBmdWxsIG9mIGRhdGEgYmVjYXVzZSB0aGUgbG9va3Vwc1xuICAgICAgLy8gYXJlIGV4cGVuc2l2ZS4gSW5zdGVhZCwgb25seSB0aGUgdGFyZ2V0IGRhdGEgKHRoZSBlbGVtZW50LCBjb21wb25lbnQsIGNvbnRhaW5lciwgSUNVXG4gICAgICAvLyBleHByZXNzaW9uIG9yIGRpcmVjdGl2ZSBkZXRhaWxzKSBhcmUgZmlsbGVkIGludG8gdGhlIGNvbnRleHQuIElmIGNhbGxlZCBtdWx0aXBsZSB0aW1lc1xuICAgICAgLy8gd2l0aCBkaWZmZXJlbnQgdGFyZ2V0IHZhbHVlcyB0aGVuIHRoZSBtaXNzaW5nIHRhcmdldCBkYXRhIHdpbGwgYmUgZmlsbGVkIGluLlxuICAgICAgY29uc3QgbmF0aXZlID0gdW53cmFwUk5vZGUobFZpZXdbbm9kZUluZGV4XSk7XG4gICAgICBjb25zdCBleGlzdGluZ0N0eCA9IHJlYWRQYXRjaGVkRGF0YShuYXRpdmUpO1xuICAgICAgY29uc3QgY29udGV4dDogTENvbnRleHQgPSAoZXhpc3RpbmdDdHggJiYgIUFycmF5LmlzQXJyYXkoZXhpc3RpbmdDdHgpKSA/XG4gICAgICAgICAgZXhpc3RpbmdDdHggOlxuICAgICAgICAgIGNyZWF0ZUxDb250ZXh0KGxWaWV3LCBub2RlSW5kZXgsIG5hdGl2ZSk7XG5cbiAgICAgIC8vIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGhhcyBiZWVuIGRpc2NvdmVyZWQgdGhlbiB1cGRhdGUgdGhlIG1vbmtleS1wYXRjaFxuICAgICAgaWYgKGNvbXBvbmVudCAmJiBjb250ZXh0LmNvbXBvbmVudCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnRleHQuY29tcG9uZW50ID0gY29tcG9uZW50O1xuICAgICAgICBhdHRhY2hQYXRjaERhdGEoY29udGV4dC5jb21wb25lbnQsIGNvbnRleHQpO1xuICAgICAgfVxuXG4gICAgICAvLyBvbmx5IHdoZW4gdGhlIGRpcmVjdGl2ZXMgaGF2ZSBiZWVuIGRpc2NvdmVyZWQgdGhlbiB1cGRhdGUgdGhlIG1vbmtleS1wYXRjaFxuICAgICAgaWYgKGRpcmVjdGl2ZXMgJiYgY29udGV4dC5kaXJlY3RpdmVzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29udGV4dC5kaXJlY3RpdmVzID0gZGlyZWN0aXZlcztcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaXJlY3RpdmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgYXR0YWNoUGF0Y2hEYXRhKGRpcmVjdGl2ZXNbaV0sIGNvbnRleHQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGF0dGFjaFBhdGNoRGF0YShjb250ZXh0Lm5hdGl2ZSwgY29udGV4dCk7XG4gICAgICBtcFZhbHVlID0gY29udGV4dDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgckVsZW1lbnQgPSB0YXJnZXQgYXMgUkVsZW1lbnQ7XG4gICAgbmdEZXZNb2RlICYmIGFzc2VydERvbU5vZGUockVsZW1lbnQpO1xuXG4gICAgLy8gaWYgdGhlIGNvbnRleHQgaXMgbm90IGZvdW5kIHRoZW4gd2UgbmVlZCB0byB0cmF2ZXJzZSB1cHdhcmRzIHVwIHRoZSBET01cbiAgICAvLyB0byBmaW5kIHRoZSBuZWFyZXN0IGVsZW1lbnQgdGhhdCBoYXMgYWxyZWFkeSBiZWVuIG1vbmtleSBwYXRjaGVkIHdpdGggZGF0YVxuICAgIGxldCBwYXJlbnQgPSByRWxlbWVudCBhcyBhbnk7XG4gICAgd2hpbGUgKHBhcmVudCA9IHBhcmVudC5wYXJlbnROb2RlKSB7XG4gICAgICBjb25zdCBwYXJlbnRDb250ZXh0ID0gcmVhZFBhdGNoZWREYXRhKHBhcmVudCk7XG4gICAgICBpZiAocGFyZW50Q29udGV4dCkge1xuICAgICAgICBsZXQgbFZpZXc6IExWaWV3fG51bGw7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHBhcmVudENvbnRleHQpKSB7XG4gICAgICAgICAgbFZpZXcgPSBwYXJlbnRDb250ZXh0IGFzIExWaWV3O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxWaWV3ID0gcGFyZW50Q29udGV4dC5sVmlldztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRoZSBlZGdlIG9mIHRoZSBhcHAgd2FzIGFsc28gcmVhY2hlZCBoZXJlIHRocm91Z2ggYW5vdGhlciBtZWFuc1xuICAgICAgICAvLyAobWF5YmUgYmVjYXVzZSB0aGUgRE9NIHdhcyBjaGFuZ2VkIG1hbnVhbGx5KS5cbiAgICAgICAgaWYgKCFsVmlldykge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaW5kZXggPSBmaW5kVmlhTmF0aXZlRWxlbWVudChsVmlldywgckVsZW1lbnQpO1xuICAgICAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICAgIGNvbnN0IG5hdGl2ZSA9IHVud3JhcFJOb2RlKGxWaWV3W2luZGV4XSk7XG4gICAgICAgICAgY29uc3QgY29udGV4dCA9IGNyZWF0ZUxDb250ZXh0KGxWaWV3LCBpbmRleCwgbmF0aXZlKTtcbiAgICAgICAgICBhdHRhY2hQYXRjaERhdGEobmF0aXZlLCBjb250ZXh0KTtcbiAgICAgICAgICBtcFZhbHVlID0gY29udGV4dDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gKG1wVmFsdWUgYXMgTENvbnRleHQpIHx8IG51bGw7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBlbXB0eSBpbnN0YW5jZSBvZiBhIGBMQ29udGV4dGAgY29udGV4dFxuICovXG5mdW5jdGlvbiBjcmVhdGVMQ29udGV4dChsVmlldzogTFZpZXcsIG5vZGVJbmRleDogbnVtYmVyLCBuYXRpdmU6IFJOb2RlKTogTENvbnRleHQge1xuICByZXR1cm4ge1xuICAgIGxWaWV3LFxuICAgIG5vZGVJbmRleCxcbiAgICBuYXRpdmUsXG4gICAgY29tcG9uZW50OiB1bmRlZmluZWQsXG4gICAgZGlyZWN0aXZlczogdW5kZWZpbmVkLFxuICAgIGxvY2FsUmVmczogdW5kZWZpbmVkLFxuICB9O1xufVxuXG4vKipcbiAqIFRha2VzIGEgY29tcG9uZW50IGluc3RhbmNlIGFuZCByZXR1cm5zIHRoZSB2aWV3IGZvciB0aGF0IGNvbXBvbmVudC5cbiAqXG4gKiBAcGFyYW0gY29tcG9uZW50SW5zdGFuY2VcbiAqIEByZXR1cm5zIFRoZSBjb21wb25lbnQncyB2aWV3XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb21wb25lbnRWaWV3QnlJbnN0YW5jZShjb21wb25lbnRJbnN0YW5jZToge30pOiBMVmlldyB7XG4gIGxldCBsVmlldyA9IHJlYWRQYXRjaGVkRGF0YShjb21wb25lbnRJbnN0YW5jZSk7XG4gIGxldCB2aWV3OiBMVmlldztcblxuICBpZiAoQXJyYXkuaXNBcnJheShsVmlldykpIHtcbiAgICBjb25zdCBub2RlSW5kZXggPSBmaW5kVmlhQ29tcG9uZW50KGxWaWV3LCBjb21wb25lbnRJbnN0YW5jZSk7XG4gICAgdmlldyA9IGdldENvbXBvbmVudExWaWV3QnlJbmRleChub2RlSW5kZXgsIGxWaWV3KTtcbiAgICBjb25zdCBjb250ZXh0ID0gY3JlYXRlTENvbnRleHQobFZpZXcsIG5vZGVJbmRleCwgdmlld1tIT1NUXSBhcyBSRWxlbWVudCk7XG4gICAgY29udGV4dC5jb21wb25lbnQgPSBjb21wb25lbnRJbnN0YW5jZTtcbiAgICBhdHRhY2hQYXRjaERhdGEoY29tcG9uZW50SW5zdGFuY2UsIGNvbnRleHQpO1xuICAgIGF0dGFjaFBhdGNoRGF0YShjb250ZXh0Lm5hdGl2ZSwgY29udGV4dCk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgY29udGV4dCA9IGxWaWV3IGFzIGFueSBhcyBMQ29udGV4dDtcbiAgICB2aWV3ID0gZ2V0Q29tcG9uZW50TFZpZXdCeUluZGV4KGNvbnRleHQubm9kZUluZGV4LCBjb250ZXh0LmxWaWV3KTtcbiAgfVxuICByZXR1cm4gdmlldztcbn1cblxuLyoqXG4gKiBUaGlzIHByb3BlcnR5IHdpbGwgYmUgbW9ua2V5LXBhdGNoZWQgb24gZWxlbWVudHMsIGNvbXBvbmVudHMgYW5kIGRpcmVjdGl2ZXMuXG4gKi9cbmNvbnN0IE1PTktFWV9QQVRDSF9LRVlfTkFNRSA9ICdfX25nQ29udGV4dF9fJztcblxuLyoqXG4gKiBBc3NpZ25zIHRoZSBnaXZlbiBkYXRhIHRvIHRoZSBnaXZlbiB0YXJnZXQgKHdoaWNoIGNvdWxkIGJlIGEgY29tcG9uZW50LFxuICogZGlyZWN0aXZlIG9yIERPTSBub2RlIGluc3RhbmNlKSB1c2luZyBtb25rZXktcGF0Y2hpbmcuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhdHRhY2hQYXRjaERhdGEodGFyZ2V0OiBhbnksIGRhdGE6IExWaWV3fExDb250ZXh0KSB7XG4gIG5nRGV2TW9kZSAmJiBhc3NlcnREZWZpbmVkKHRhcmdldCwgJ1RhcmdldCBleHBlY3RlZCcpO1xuICB0YXJnZXRbTU9OS0VZX1BBVENIX0tFWV9OQU1FXSA9IGRhdGE7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbW9ua2V5LXBhdGNoIHZhbHVlIGRhdGEgcHJlc2VudCBvbiB0aGUgdGFyZ2V0ICh3aGljaCBjb3VsZCBiZVxuICogYSBjb21wb25lbnQsIGRpcmVjdGl2ZSBvciBhIERPTSBub2RlKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlYWRQYXRjaGVkRGF0YSh0YXJnZXQ6IGFueSk6IExWaWV3fExDb250ZXh0fG51bGwge1xuICBuZ0Rldk1vZGUgJiYgYXNzZXJ0RGVmaW5lZCh0YXJnZXQsICdUYXJnZXQgZXhwZWN0ZWQnKTtcbiAgcmV0dXJuIHRhcmdldFtNT05LRVlfUEFUQ0hfS0VZX05BTUVdIHx8IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWFkUGF0Y2hlZExWaWV3KHRhcmdldDogYW55KTogTFZpZXd8bnVsbCB7XG4gIGNvbnN0IHZhbHVlID0gcmVhZFBhdGNoZWREYXRhKHRhcmdldCk7XG4gIGlmICh2YWx1ZSkge1xuICAgIHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKSA/IHZhbHVlIDogKHZhbHVlIGFzIExDb250ZXh0KS5sVmlldztcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQ29tcG9uZW50SW5zdGFuY2UoaW5zdGFuY2U6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gaW5zdGFuY2UgJiYgaW5zdGFuY2UuY29uc3RydWN0b3IgJiYgaW5zdGFuY2UuY29uc3RydWN0b3IuybVjbXA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RpcmVjdGl2ZUluc3RhbmNlKGluc3RhbmNlOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIGluc3RhbmNlICYmIGluc3RhbmNlLmNvbnN0cnVjdG9yICYmIGluc3RhbmNlLmNvbnN0cnVjdG9yLsm1ZGlyO1xufVxuXG4vKipcbiAqIExvY2F0ZXMgdGhlIGVsZW1lbnQgd2l0aGluIHRoZSBnaXZlbiBMVmlldyBhbmQgcmV0dXJucyB0aGUgbWF0Y2hpbmcgaW5kZXhcbiAqL1xuZnVuY3Rpb24gZmluZFZpYU5hdGl2ZUVsZW1lbnQobFZpZXc6IExWaWV3LCB0YXJnZXQ6IFJFbGVtZW50KTogbnVtYmVyIHtcbiAgY29uc3QgdFZpZXcgPSBsVmlld1tUVklFV107XG4gIGZvciAobGV0IGkgPSBIRUFERVJfT0ZGU0VUOyBpIDwgdFZpZXcuYmluZGluZ1N0YXJ0SW5kZXg7IGkrKykge1xuICAgIGlmICh1bndyYXBSTm9kZShsVmlld1tpXSkgPT09IHRhcmdldCkge1xuICAgICAgcmV0dXJuIGk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIC0xO1xufVxuXG4vKipcbiAqIExvY2F0ZXMgdGhlIG5leHQgdE5vZGUgKGNoaWxkLCBzaWJsaW5nIG9yIHBhcmVudCkuXG4gKi9cbmZ1bmN0aW9uIHRyYXZlcnNlTmV4dEVsZW1lbnQodE5vZGU6IFROb2RlKTogVE5vZGV8bnVsbCB7XG4gIGlmICh0Tm9kZS5jaGlsZCkge1xuICAgIHJldHVybiB0Tm9kZS5jaGlsZDtcbiAgfSBlbHNlIGlmICh0Tm9kZS5uZXh0KSB7XG4gICAgcmV0dXJuIHROb2RlLm5leHQ7XG4gIH0gZWxzZSB7XG4gICAgLy8gTGV0J3MgdGFrZSB0aGUgZm9sbG93aW5nIHRlbXBsYXRlOiA8ZGl2PjxzcGFuPnRleHQ8L3NwYW4+PC9kaXY+PGNvbXBvbmVudC8+XG4gICAgLy8gQWZ0ZXIgY2hlY2tpbmcgdGhlIHRleHQgbm9kZSwgd2UgbmVlZCB0byBmaW5kIHRoZSBuZXh0IHBhcmVudCB0aGF0IGhhcyBhIFwibmV4dFwiIFROb2RlLFxuICAgIC8vIGluIHRoaXMgY2FzZSB0aGUgcGFyZW50IGBkaXZgLCBzbyB0aGF0IHdlIGNhbiBmaW5kIHRoZSBjb21wb25lbnQuXG4gICAgd2hpbGUgKHROb2RlLnBhcmVudCAmJiAhdE5vZGUucGFyZW50Lm5leHQpIHtcbiAgICAgIHROb2RlID0gdE5vZGUucGFyZW50O1xuICAgIH1cbiAgICByZXR1cm4gdE5vZGUucGFyZW50ICYmIHROb2RlLnBhcmVudC5uZXh0O1xuICB9XG59XG5cbi8qKlxuICogTG9jYXRlcyB0aGUgY29tcG9uZW50IHdpdGhpbiB0aGUgZ2l2ZW4gTFZpZXcgYW5kIHJldHVybnMgdGhlIG1hdGNoaW5nIGluZGV4XG4gKi9cbmZ1bmN0aW9uIGZpbmRWaWFDb21wb25lbnQobFZpZXc6IExWaWV3LCBjb21wb25lbnRJbnN0YW5jZToge30pOiBudW1iZXIge1xuICBjb25zdCBjb21wb25lbnRJbmRpY2VzID0gbFZpZXdbVFZJRVddLmNvbXBvbmVudHM7XG4gIGlmIChjb21wb25lbnRJbmRpY2VzKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb21wb25lbnRJbmRpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBlbGVtZW50Q29tcG9uZW50SW5kZXggPSBjb21wb25lbnRJbmRpY2VzW2ldO1xuICAgICAgY29uc3QgY29tcG9uZW50VmlldyA9IGdldENvbXBvbmVudExWaWV3QnlJbmRleChlbGVtZW50Q29tcG9uZW50SW5kZXgsIGxWaWV3KTtcbiAgICAgIGlmIChjb21wb25lbnRWaWV3W0NPTlRFWFRdID09PSBjb21wb25lbnRJbnN0YW5jZSkge1xuICAgICAgICByZXR1cm4gZWxlbWVudENvbXBvbmVudEluZGV4O1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBjb25zdCByb290Q29tcG9uZW50VmlldyA9IGdldENvbXBvbmVudExWaWV3QnlJbmRleChIRUFERVJfT0ZGU0VULCBsVmlldyk7XG4gICAgY29uc3Qgcm9vdENvbXBvbmVudCA9IHJvb3RDb21wb25lbnRWaWV3W0NPTlRFWFRdO1xuICAgIGlmIChyb290Q29tcG9uZW50ID09PSBjb21wb25lbnRJbnN0YW5jZSkge1xuICAgICAgLy8gd2UgYXJlIGRlYWxpbmcgd2l0aCB0aGUgcm9vdCBlbGVtZW50IGhlcmUgdGhlcmVmb3JlIHdlIGtub3cgdGhhdCB0aGVcbiAgICAgIC8vIGVsZW1lbnQgaXMgdGhlIHZlcnkgZmlyc3QgZWxlbWVudCBhZnRlciB0aGUgSEVBREVSIGRhdGEgaW4gdGhlIGxWaWV3XG4gICAgICByZXR1cm4gSEVBREVSX09GRlNFVDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG4vKipcbiAqIExvY2F0ZXMgdGhlIGRpcmVjdGl2ZSB3aXRoaW4gdGhlIGdpdmVuIExWaWV3IGFuZCByZXR1cm5zIHRoZSBtYXRjaGluZyBpbmRleFxuICovXG5mdW5jdGlvbiBmaW5kVmlhRGlyZWN0aXZlKGxWaWV3OiBMVmlldywgZGlyZWN0aXZlSW5zdGFuY2U6IHt9KTogbnVtYmVyIHtcbiAgLy8gaWYgYSBkaXJlY3RpdmUgaXMgbW9ua2V5IHBhdGNoZWQgdGhlbiBpdCB3aWxsIChieSBkZWZhdWx0KVxuICAvLyBoYXZlIGEgcmVmZXJlbmNlIHRvIHRoZSBMVmlldyBvZiB0aGUgY3VycmVudCB2aWV3LiBUaGVcbiAgLy8gZWxlbWVudCBib3VuZCB0byB0aGUgZGlyZWN0aXZlIGJlaW5nIHNlYXJjaCBsaXZlcyBzb21ld2hlcmVcbiAgLy8gaW4gdGhlIHZpZXcgZGF0YS4gV2UgbG9vcCB0aHJvdWdoIHRoZSBub2RlcyBhbmQgY2hlY2sgdGhlaXJcbiAgLy8gbGlzdCBvZiBkaXJlY3RpdmVzIGZvciB0aGUgaW5zdGFuY2UuXG4gIGxldCB0Tm9kZSA9IGxWaWV3W1RWSUVXXS5maXJzdENoaWxkO1xuICB3aGlsZSAodE5vZGUpIHtcbiAgICBjb25zdCBkaXJlY3RpdmVJbmRleFN0YXJ0ID0gdE5vZGUuZGlyZWN0aXZlU3RhcnQ7XG4gICAgY29uc3QgZGlyZWN0aXZlSW5kZXhFbmQgPSB0Tm9kZS5kaXJlY3RpdmVFbmQ7XG4gICAgZm9yIChsZXQgaSA9IGRpcmVjdGl2ZUluZGV4U3RhcnQ7IGkgPCBkaXJlY3RpdmVJbmRleEVuZDsgaSsrKSB7XG4gICAgICBpZiAobFZpZXdbaV0gPT09IGRpcmVjdGl2ZUluc3RhbmNlKSB7XG4gICAgICAgIHJldHVybiB0Tm9kZS5pbmRleDtcbiAgICAgIH1cbiAgICB9XG4gICAgdE5vZGUgPSB0cmF2ZXJzZU5leHRFbGVtZW50KHROb2RlKTtcbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGxpc3Qgb2YgZGlyZWN0aXZlcyBleHRyYWN0ZWQgZnJvbSB0aGUgZ2l2ZW4gdmlldyBiYXNlZCBvbiB0aGVcbiAqIHByb3ZpZGVkIGxpc3Qgb2YgZGlyZWN0aXZlIGluZGV4IHZhbHVlcy5cbiAqXG4gKiBAcGFyYW0gbm9kZUluZGV4IFRoZSBub2RlIGluZGV4XG4gKiBAcGFyYW0gbFZpZXcgVGhlIHRhcmdldCB2aWV3IGRhdGFcbiAqIEBwYXJhbSBpbmNsdWRlQ29tcG9uZW50cyBXaGV0aGVyIG9yIG5vdCB0byBpbmNsdWRlIGNvbXBvbmVudHMgaW4gcmV0dXJuZWQgZGlyZWN0aXZlc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGlyZWN0aXZlc0F0Tm9kZUluZGV4KFxuICAgIG5vZGVJbmRleDogbnVtYmVyLCBsVmlldzogTFZpZXcsIGluY2x1ZGVDb21wb25lbnRzOiBib29sZWFuKTogYW55W118bnVsbCB7XG4gIGNvbnN0IHROb2RlID0gbFZpZXdbVFZJRVddLmRhdGFbbm9kZUluZGV4XSBhcyBUTm9kZTtcbiAgbGV0IGRpcmVjdGl2ZVN0YXJ0SW5kZXggPSB0Tm9kZS5kaXJlY3RpdmVTdGFydDtcbiAgaWYgKGRpcmVjdGl2ZVN0YXJ0SW5kZXggPT0gMCkgcmV0dXJuIEVNUFRZX0FSUkFZO1xuICBjb25zdCBkaXJlY3RpdmVFbmRJbmRleCA9IHROb2RlLmRpcmVjdGl2ZUVuZDtcbiAgaWYgKCFpbmNsdWRlQ29tcG9uZW50cyAmJiB0Tm9kZS5mbGFncyAmIFROb2RlRmxhZ3MuaXNDb21wb25lbnRIb3N0KSBkaXJlY3RpdmVTdGFydEluZGV4Kys7XG4gIHJldHVybiBsVmlldy5zbGljZShkaXJlY3RpdmVTdGFydEluZGV4LCBkaXJlY3RpdmVFbmRJbmRleCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb21wb25lbnRBdE5vZGVJbmRleChub2RlSW5kZXg6IG51bWJlciwgbFZpZXc6IExWaWV3KToge318bnVsbCB7XG4gIGNvbnN0IHROb2RlID0gbFZpZXdbVFZJRVddLmRhdGFbbm9kZUluZGV4XSBhcyBUTm9kZTtcbiAgbGV0IGRpcmVjdGl2ZVN0YXJ0SW5kZXggPSB0Tm9kZS5kaXJlY3RpdmVTdGFydDtcbiAgcmV0dXJuIHROb2RlLmZsYWdzICYgVE5vZGVGbGFncy5pc0NvbXBvbmVudEhvc3QgPyBsVmlld1tkaXJlY3RpdmVTdGFydEluZGV4XSA6IG51bGw7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIG1hcCBvZiBsb2NhbCByZWZlcmVuY2VzIChsb2NhbCByZWZlcmVuY2UgbmFtZSA9PiBlbGVtZW50IG9yIGRpcmVjdGl2ZSBpbnN0YW5jZSkgdGhhdFxuICogZXhpc3Qgb24gYSBnaXZlbiBlbGVtZW50LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGlzY292ZXJMb2NhbFJlZnMobFZpZXc6IExWaWV3LCBub2RlSW5kZXg6IG51bWJlcik6IHtba2V5OiBzdHJpbmddOiBhbnl9fG51bGwge1xuICBjb25zdCB0Tm9kZSA9IGxWaWV3W1RWSUVXXS5kYXRhW25vZGVJbmRleF0gYXMgVE5vZGU7XG4gIGlmICh0Tm9kZSAmJiB0Tm9kZS5sb2NhbE5hbWVzKSB7XG4gICAgY29uc3QgcmVzdWx0OiB7W2tleTogc3RyaW5nXTogYW55fSA9IHt9O1xuICAgIGxldCBsb2NhbEluZGV4ID0gdE5vZGUuaW5kZXggKyAxO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdE5vZGUubG9jYWxOYW1lcy5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgcmVzdWx0W3ROb2RlLmxvY2FsTmFtZXNbaV1dID0gbFZpZXdbbG9jYWxJbmRleF07XG4gICAgICBsb2NhbEluZGV4Kys7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cbiJdfQ==