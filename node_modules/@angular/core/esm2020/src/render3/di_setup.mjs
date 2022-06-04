/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { resolveForwardRef } from '../di/forward_ref';
import { isClassProvider, isTypeProvider, providerToFactory } from '../di/r3_injector';
import { assertDefined } from '../util/assert';
import { diPublicInInjector, getNodeInjectable, getOrCreateNodeInjectorForNode } from './di';
import { ɵɵdirectiveInject } from './instructions/all';
import { NodeInjectorFactory } from './interfaces/injector';
import { isComponentDef } from './interfaces/type_checks';
import { TVIEW } from './interfaces/view';
import { getCurrentTNode, getLView, getTView } from './state';
/**
 * Resolves the providers which are defined in the DirectiveDef.
 *
 * When inserting the tokens and the factories in their respective arrays, we can assume that
 * this method is called first for the component (if any), and then for other directives on the same
 * node.
 * As a consequence,the providers are always processed in that order:
 * 1) The view providers of the component
 * 2) The providers of the component
 * 3) The providers of the other directives
 * This matches the structure of the injectables arrays of a view (for each node).
 * So the tokens and the factories can be pushed at the end of the arrays, except
 * in one case for multi providers.
 *
 * @param def the directive definition
 * @param providers: Array of `providers`.
 * @param viewProviders: Array of `viewProviders`.
 */
export function providersResolver(def, providers, viewProviders) {
    const tView = getTView();
    if (tView.firstCreatePass) {
        const isComponent = isComponentDef(def);
        // The list of view providers is processed first, and the flags are updated
        resolveProvider(viewProviders, tView.data, tView.blueprint, isComponent, true);
        // Then, the list of providers is processed, and the flags are updated
        resolveProvider(providers, tView.data, tView.blueprint, isComponent, false);
    }
}
/**
 * Resolves a provider and publishes it to the DI system.
 */
function resolveProvider(provider, tInjectables, lInjectablesBlueprint, isComponent, isViewProvider) {
    provider = resolveForwardRef(provider);
    if (Array.isArray(provider)) {
        // Recursively call `resolveProvider`
        // Recursion is OK in this case because this code will not be in hot-path once we implement
        // cloning of the initial state.
        for (let i = 0; i < provider.length; i++) {
            resolveProvider(provider[i], tInjectables, lInjectablesBlueprint, isComponent, isViewProvider);
        }
    }
    else {
        const tView = getTView();
        const lView = getLView();
        let token = isTypeProvider(provider) ? provider : resolveForwardRef(provider.provide);
        let providerFactory = providerToFactory(provider);
        const tNode = getCurrentTNode();
        const beginIndex = tNode.providerIndexes & 1048575 /* ProvidersStartIndexMask */;
        const endIndex = tNode.directiveStart;
        const cptViewProvidersCount = tNode.providerIndexes >> 20 /* CptViewProvidersCountShift */;
        if (isTypeProvider(provider) || !provider.multi) {
            // Single provider case: the factory is created and pushed immediately
            const factory = new NodeInjectorFactory(providerFactory, isViewProvider, ɵɵdirectiveInject);
            const existingFactoryIndex = indexOf(token, tInjectables, isViewProvider ? beginIndex : beginIndex + cptViewProvidersCount, endIndex);
            if (existingFactoryIndex === -1) {
                diPublicInInjector(getOrCreateNodeInjectorForNode(tNode, lView), tView, token);
                registerDestroyHooksIfSupported(tView, provider, tInjectables.length);
                tInjectables.push(token);
                tNode.directiveStart++;
                tNode.directiveEnd++;
                if (isViewProvider) {
                    tNode.providerIndexes += 1048576 /* CptViewProvidersCountShifter */;
                }
                lInjectablesBlueprint.push(factory);
                lView.push(factory);
            }
            else {
                lInjectablesBlueprint[existingFactoryIndex] = factory;
                lView[existingFactoryIndex] = factory;
            }
        }
        else {
            // Multi provider case:
            // We create a multi factory which is going to aggregate all the values.
            // Since the output of such a factory depends on content or view injection,
            // we create two of them, which are linked together.
            //
            // The first one (for view providers) is always in the first block of the injectables array,
            // and the second one (for providers) is always in the second block.
            // This is important because view providers have higher priority. When a multi token
            // is being looked up, the view providers should be found first.
            // Note that it is not possible to have a multi factory in the third block (directive block).
            //
            // The algorithm to process multi providers is as follows:
            // 1) If the multi provider comes from the `viewProviders` of the component:
            //   a) If the special view providers factory doesn't exist, it is created and pushed.
            //   b) Else, the multi provider is added to the existing multi factory.
            // 2) If the multi provider comes from the `providers` of the component or of another
            // directive:
            //   a) If the multi factory doesn't exist, it is created and provider pushed into it.
            //      It is also linked to the multi factory for view providers, if it exists.
            //   b) Else, the multi provider is added to the existing multi factory.
            const existingProvidersFactoryIndex = indexOf(token, tInjectables, beginIndex + cptViewProvidersCount, endIndex);
            const existingViewProvidersFactoryIndex = indexOf(token, tInjectables, beginIndex, beginIndex + cptViewProvidersCount);
            const doesProvidersFactoryExist = existingProvidersFactoryIndex >= 0 &&
                lInjectablesBlueprint[existingProvidersFactoryIndex];
            const doesViewProvidersFactoryExist = existingViewProvidersFactoryIndex >= 0 &&
                lInjectablesBlueprint[existingViewProvidersFactoryIndex];
            if (isViewProvider && !doesViewProvidersFactoryExist ||
                !isViewProvider && !doesProvidersFactoryExist) {
                // Cases 1.a and 2.a
                diPublicInInjector(getOrCreateNodeInjectorForNode(tNode, lView), tView, token);
                const factory = multiFactory(isViewProvider ? multiViewProvidersFactoryResolver : multiProvidersFactoryResolver, lInjectablesBlueprint.length, isViewProvider, isComponent, providerFactory);
                if (!isViewProvider && doesViewProvidersFactoryExist) {
                    lInjectablesBlueprint[existingViewProvidersFactoryIndex].providerFactory = factory;
                }
                registerDestroyHooksIfSupported(tView, provider, tInjectables.length, 0);
                tInjectables.push(token);
                tNode.directiveStart++;
                tNode.directiveEnd++;
                if (isViewProvider) {
                    tNode.providerIndexes += 1048576 /* CptViewProvidersCountShifter */;
                }
                lInjectablesBlueprint.push(factory);
                lView.push(factory);
            }
            else {
                // Cases 1.b and 2.b
                const indexInFactory = multiFactoryAdd(lInjectablesBlueprint[isViewProvider ? existingViewProvidersFactoryIndex :
                    existingProvidersFactoryIndex], providerFactory, !isViewProvider && isComponent);
                registerDestroyHooksIfSupported(tView, provider, existingProvidersFactoryIndex > -1 ? existingProvidersFactoryIndex :
                    existingViewProvidersFactoryIndex, indexInFactory);
            }
            if (!isViewProvider && isComponent && doesViewProvidersFactoryExist) {
                lInjectablesBlueprint[existingViewProvidersFactoryIndex].componentProviders++;
            }
        }
    }
}
/**
 * Registers the `ngOnDestroy` hook of a provider, if the provider supports destroy hooks.
 * @param tView `TView` in which to register the hook.
 * @param provider Provider whose hook should be registered.
 * @param contextIndex Index under which to find the context for the hook when it's being invoked.
 * @param indexInFactory Only required for `multi` providers. Index of the provider in the multi
 * provider factory.
 */
function registerDestroyHooksIfSupported(tView, provider, contextIndex, indexInFactory) {
    const providerIsTypeProvider = isTypeProvider(provider);
    const providerIsClassProvider = isClassProvider(provider);
    if (providerIsTypeProvider || providerIsClassProvider) {
        // Resolve forward references as `useClass` can hold a forward reference.
        const classToken = providerIsClassProvider ? resolveForwardRef(provider.useClass) : provider;
        const prototype = classToken.prototype;
        const ngOnDestroy = prototype.ngOnDestroy;
        if (ngOnDestroy) {
            const hooks = tView.destroyHooks || (tView.destroyHooks = []);
            if (!providerIsTypeProvider && provider.multi) {
                ngDevMode &&
                    assertDefined(indexInFactory, 'indexInFactory when registering multi factory destroy hook');
                const existingCallbacksIndex = hooks.indexOf(contextIndex);
                if (existingCallbacksIndex === -1) {
                    hooks.push(contextIndex, [indexInFactory, ngOnDestroy]);
                }
                else {
                    hooks[existingCallbacksIndex + 1].push(indexInFactory, ngOnDestroy);
                }
            }
            else {
                hooks.push(contextIndex, ngOnDestroy);
            }
        }
    }
}
/**
 * Add a factory in a multi factory.
 * @returns Index at which the factory was inserted.
 */
function multiFactoryAdd(multiFactory, factory, isComponentProvider) {
    if (isComponentProvider) {
        multiFactory.componentProviders++;
    }
    return multiFactory.multi.push(factory) - 1;
}
/**
 * Returns the index of item in the array, but only in the begin to end range.
 */
function indexOf(item, arr, begin, end) {
    for (let i = begin; i < end; i++) {
        if (arr[i] === item)
            return i;
    }
    return -1;
}
/**
 * Use this with `multi` `providers`.
 */
function multiProvidersFactoryResolver(_, tData, lData, tNode) {
    return multiResolve(this.multi, []);
}
/**
 * Use this with `multi` `viewProviders`.
 *
 * This factory knows how to concatenate itself with the existing `multi` `providers`.
 */
function multiViewProvidersFactoryResolver(_, tData, lView, tNode) {
    const factories = this.multi;
    let result;
    if (this.providerFactory) {
        const componentCount = this.providerFactory.componentProviders;
        const multiProviders = getNodeInjectable(lView, lView[TVIEW], this.providerFactory.index, tNode);
        // Copy the section of the array which contains `multi` `providers` from the component
        result = multiProviders.slice(0, componentCount);
        // Insert the `viewProvider` instances.
        multiResolve(factories, result);
        // Copy the section of the array which contains `multi` `providers` from other directives
        for (let i = componentCount; i < multiProviders.length; i++) {
            result.push(multiProviders[i]);
        }
    }
    else {
        result = [];
        // Insert the `viewProvider` instances.
        multiResolve(factories, result);
    }
    return result;
}
/**
 * Maps an array of factories into an array of values.
 */
function multiResolve(factories, result) {
    for (let i = 0; i < factories.length; i++) {
        const factory = factories[i];
        result.push(factory());
    }
    return result;
}
/**
 * Creates a multi factory.
 */
function multiFactory(factoryFn, index, isViewProvider, isComponent, f) {
    const factory = new NodeInjectorFactory(factoryFn, isViewProvider, ɵɵdirectiveInject);
    factory.multi = [];
    factory.index = index;
    factory.componentProviders = 0;
    multiFactoryAdd(factory, f, isComponent && !isViewProvider);
    return factory;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlfc2V0dXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9yZW5kZXIzL2RpX3NldHVwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUdILE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRXBELE9BQU8sRUFBQyxlQUFlLEVBQUUsY0FBYyxFQUFFLGlCQUFpQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDckYsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRTdDLE9BQU8sRUFBQyxrQkFBa0IsRUFBRSxpQkFBaUIsRUFBRSw4QkFBOEIsRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUMzRixPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUVyRCxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUUxRCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDeEQsT0FBTyxFQUFnQyxLQUFLLEVBQVEsTUFBTSxtQkFBbUIsQ0FBQztBQUM5RSxPQUFPLEVBQUMsZUFBZSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFJNUQ7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHO0FBQ0gsTUFBTSxVQUFVLGlCQUFpQixDQUM3QixHQUFvQixFQUFFLFNBQXFCLEVBQUUsYUFBeUI7SUFDeEUsTUFBTSxLQUFLLEdBQUcsUUFBUSxFQUFFLENBQUM7SUFDekIsSUFBSSxLQUFLLENBQUMsZUFBZSxFQUFFO1FBQ3pCLE1BQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUV4QywyRUFBMkU7UUFDM0UsZUFBZSxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRS9FLHNFQUFzRTtRQUN0RSxlQUFlLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDN0U7QUFDSCxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLGVBQWUsQ0FDcEIsUUFBa0IsRUFBRSxZQUFtQixFQUFFLHFCQUE0QyxFQUNyRixXQUFvQixFQUFFLGNBQXVCO0lBQy9DLFFBQVEsR0FBRyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN2QyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDM0IscUNBQXFDO1FBQ3JDLDJGQUEyRjtRQUMzRixnQ0FBZ0M7UUFDaEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDeEMsZUFBZSxDQUNYLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxZQUFZLEVBQUUscUJBQXFCLEVBQUUsV0FBVyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1NBQ3BGO0tBQ0Y7U0FBTTtRQUNMLE1BQU0sS0FBSyxHQUFHLFFBQVEsRUFBRSxDQUFDO1FBQ3pCLE1BQU0sS0FBSyxHQUFHLFFBQVEsRUFBRSxDQUFDO1FBQ3pCLElBQUksS0FBSyxHQUFRLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0YsSUFBSSxlQUFlLEdBQWMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFN0QsTUFBTSxLQUFLLEdBQUcsZUFBZSxFQUFHLENBQUM7UUFDakMsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLGVBQWUsd0NBQStDLENBQUM7UUFDeEYsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQztRQUN0QyxNQUFNLHFCQUFxQixHQUN2QixLQUFLLENBQUMsZUFBZSx1Q0FBbUQsQ0FBQztRQUU3RSxJQUFJLGNBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUU7WUFDL0Msc0VBQXNFO1lBQ3RFLE1BQU0sT0FBTyxHQUFHLElBQUksbUJBQW1CLENBQUMsZUFBZSxFQUFFLGNBQWMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1lBQzVGLE1BQU0sb0JBQW9CLEdBQUcsT0FBTyxDQUNoQyxLQUFLLEVBQUUsWUFBWSxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxVQUFVLEdBQUcscUJBQXFCLEVBQ3JGLFFBQVEsQ0FBQyxDQUFDO1lBQ2QsSUFBSSxvQkFBb0IsS0FBSyxDQUFDLENBQUMsRUFBRTtnQkFDL0Isa0JBQWtCLENBQ2QsOEJBQThCLENBQzFCLEtBQThELEVBQUUsS0FBSyxDQUFDLEVBQzFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDbEIsK0JBQStCLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3RFLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3pCLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDdkIsS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUNyQixJQUFJLGNBQWMsRUFBRTtvQkFDbEIsS0FBSyxDQUFDLGVBQWUsOENBQXFELENBQUM7aUJBQzVFO2dCQUNELHFCQUFxQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDcEMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUNyQjtpQkFBTTtnQkFDTCxxQkFBcUIsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLE9BQU8sQ0FBQztnQkFDdEQsS0FBSyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsT0FBTyxDQUFDO2FBQ3ZDO1NBQ0Y7YUFBTTtZQUNMLHVCQUF1QjtZQUN2Qix3RUFBd0U7WUFDeEUsMkVBQTJFO1lBQzNFLG9EQUFvRDtZQUNwRCxFQUFFO1lBQ0YsNEZBQTRGO1lBQzVGLG9FQUFvRTtZQUNwRSxvRkFBb0Y7WUFDcEYsZ0VBQWdFO1lBQ2hFLDZGQUE2RjtZQUM3RixFQUFFO1lBQ0YsMERBQTBEO1lBQzFELDRFQUE0RTtZQUM1RSxzRkFBc0Y7WUFDdEYsd0VBQXdFO1lBQ3hFLHFGQUFxRjtZQUNyRixhQUFhO1lBQ2Isc0ZBQXNGO1lBQ3RGLGdGQUFnRjtZQUNoRix3RUFBd0U7WUFFeEUsTUFBTSw2QkFBNkIsR0FDL0IsT0FBTyxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsVUFBVSxHQUFHLHFCQUFxQixFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQy9FLE1BQU0saUNBQWlDLEdBQ25DLE9BQU8sQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxVQUFVLEdBQUcscUJBQXFCLENBQUMsQ0FBQztZQUNqRixNQUFNLHlCQUF5QixHQUFHLDZCQUE2QixJQUFJLENBQUM7Z0JBQ2hFLHFCQUFxQixDQUFDLDZCQUE2QixDQUFDLENBQUM7WUFDekQsTUFBTSw2QkFBNkIsR0FBRyxpQ0FBaUMsSUFBSSxDQUFDO2dCQUN4RSxxQkFBcUIsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1lBRTdELElBQUksY0FBYyxJQUFJLENBQUMsNkJBQTZCO2dCQUNoRCxDQUFDLGNBQWMsSUFBSSxDQUFDLHlCQUF5QixFQUFFO2dCQUNqRCxvQkFBb0I7Z0JBQ3BCLGtCQUFrQixDQUNkLDhCQUE4QixDQUMxQixLQUE4RCxFQUFFLEtBQUssQ0FBQyxFQUMxRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ2xCLE1BQU0sT0FBTyxHQUFHLFlBQVksQ0FDeEIsY0FBYyxDQUFDLENBQUMsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLENBQUMsNkJBQTZCLEVBQ2xGLHFCQUFxQixDQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsV0FBVyxFQUFFLGVBQWUsQ0FBQyxDQUFDO2dCQUNoRixJQUFJLENBQUMsY0FBYyxJQUFJLDZCQUE2QixFQUFFO29CQUNwRCxxQkFBcUIsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUM7aUJBQ3BGO2dCQUNELCtCQUErQixDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDekUsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDekIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUN2QixLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7Z0JBQ3JCLElBQUksY0FBYyxFQUFFO29CQUNsQixLQUFLLENBQUMsZUFBZSw4Q0FBcUQsQ0FBQztpQkFDNUU7Z0JBQ0QscUJBQXFCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNwQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ3JCO2lCQUFNO2dCQUNMLG9CQUFvQjtnQkFDcEIsTUFBTSxjQUFjLEdBQUcsZUFBZSxDQUNsQyxxQkFBc0IsQ0FDakIsY0FBYyxDQUFDLENBQUMsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO29CQUNuQyw2QkFBNkIsQ0FBQyxFQUNwRCxlQUFlLEVBQUUsQ0FBQyxjQUFjLElBQUksV0FBVyxDQUFDLENBQUM7Z0JBQ3JELCtCQUErQixDQUMzQixLQUFLLEVBQUUsUUFBUSxFQUNmLDZCQUE2QixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO29CQUMvQixpQ0FBaUMsRUFDdEUsY0FBYyxDQUFDLENBQUM7YUFDckI7WUFDRCxJQUFJLENBQUMsY0FBYyxJQUFJLFdBQVcsSUFBSSw2QkFBNkIsRUFBRTtnQkFDbkUscUJBQXFCLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxrQkFBbUIsRUFBRSxDQUFDO2FBQ2hGO1NBQ0Y7S0FDRjtBQUNILENBQUM7QUFFRDs7Ozs7OztHQU9HO0FBQ0gsU0FBUywrQkFBK0IsQ0FDcEMsS0FBWSxFQUFFLFFBQWtDLEVBQUUsWUFBb0IsRUFDdEUsY0FBdUI7SUFDekIsTUFBTSxzQkFBc0IsR0FBRyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDeEQsTUFBTSx1QkFBdUIsR0FBRyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFMUQsSUFBSSxzQkFBc0IsSUFBSSx1QkFBdUIsRUFBRTtRQUNyRCx5RUFBeUU7UUFDekUsTUFBTSxVQUFVLEdBQUcsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO1FBQzdGLE1BQU0sU0FBUyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUM7UUFDdkMsTUFBTSxXQUFXLEdBQUcsU0FBUyxDQUFDLFdBQVcsQ0FBQztRQUUxQyxJQUFJLFdBQVcsRUFBRTtZQUNmLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxZQUFZLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBRTlELElBQUksQ0FBQyxzQkFBc0IsSUFBTSxRQUEyQixDQUFDLEtBQUssRUFBRTtnQkFDbEUsU0FBUztvQkFDTCxhQUFhLENBQ1QsY0FBYyxFQUFFLDREQUE0RCxDQUFDLENBQUM7Z0JBQ3RGLE1BQU0sc0JBQXNCLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFFM0QsSUFBSSxzQkFBc0IsS0FBSyxDQUFDLENBQUMsRUFBRTtvQkFDakMsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxjQUFjLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztpQkFDekQ7cUJBQU07b0JBQ0osS0FBSyxDQUFDLHNCQUFzQixHQUFHLENBQUMsQ0FBcUIsQ0FBQyxJQUFJLENBQUMsY0FBZSxFQUFFLFdBQVcsQ0FBQyxDQUFDO2lCQUMzRjthQUNGO2lCQUFNO2dCQUNMLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLFdBQVcsQ0FBQyxDQUFDO2FBQ3ZDO1NBQ0Y7S0FDRjtBQUNILENBQUM7QUFFRDs7O0dBR0c7QUFDSCxTQUFTLGVBQWUsQ0FDcEIsWUFBaUMsRUFBRSxPQUFrQixFQUFFLG1CQUE0QjtJQUNyRixJQUFJLG1CQUFtQixFQUFFO1FBQ3ZCLFlBQVksQ0FBQyxrQkFBbUIsRUFBRSxDQUFDO0tBQ3BDO0lBQ0QsT0FBTyxZQUFZLENBQUMsS0FBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDL0MsQ0FBQztBQUVEOztHQUVHO0FBQ0gsU0FBUyxPQUFPLENBQUMsSUFBUyxFQUFFLEdBQVUsRUFBRSxLQUFhLEVBQUUsR0FBVztJQUNoRSxLQUFLLElBQUksQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2hDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUk7WUFBRSxPQUFPLENBQUMsQ0FBQztLQUMvQjtJQUNELE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDWixDQUFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLDZCQUE2QixDQUNQLENBQVksRUFBRSxLQUFZLEVBQUUsS0FBWSxFQUNuRSxLQUF5QjtJQUMzQixPQUFPLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsU0FBUyxpQ0FBaUMsQ0FDWCxDQUFZLEVBQUUsS0FBWSxFQUFFLEtBQVksRUFDbkUsS0FBeUI7SUFDM0IsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQU0sQ0FBQztJQUM5QixJQUFJLE1BQWEsQ0FBQztJQUNsQixJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7UUFDeEIsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxrQkFBbUIsQ0FBQztRQUNoRSxNQUFNLGNBQWMsR0FDaEIsaUJBQWlCLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsZUFBZ0IsQ0FBQyxLQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDaEYsc0ZBQXNGO1FBQ3RGLE1BQU0sR0FBRyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUNqRCx1Q0FBdUM7UUFDdkMsWUFBWSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNoQyx5RkFBeUY7UUFDekYsS0FBSyxJQUFJLENBQUMsR0FBRyxjQUFjLEVBQUUsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDM0QsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNoQztLQUNGO1NBQU07UUFDTCxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ1osdUNBQXVDO1FBQ3ZDLFlBQVksQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDakM7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLFlBQVksQ0FBQyxTQUEyQixFQUFFLE1BQWE7SUFDOUQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDekMsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBZ0IsQ0FBQztRQUM1QyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7S0FDeEI7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLFlBQVksQ0FDakIsU0FFcUMsRUFDckMsS0FBYSxFQUFFLGNBQXVCLEVBQUUsV0FBb0IsRUFDNUQsQ0FBWTtJQUNkLE1BQU0sT0FBTyxHQUFHLElBQUksbUJBQW1CLENBQUMsU0FBUyxFQUFFLGNBQWMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3RGLE9BQU8sQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ25CLE9BQU8sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLE9BQU8sQ0FBQyxrQkFBa0IsR0FBRyxDQUFDLENBQUM7SUFDL0IsZUFBZSxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsV0FBVyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDNUQsT0FBTyxPQUFPLENBQUM7QUFDakIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5cbmltcG9ydCB7cmVzb2x2ZUZvcndhcmRSZWZ9IGZyb20gJy4uL2RpL2ZvcndhcmRfcmVmJztcbmltcG9ydCB7Q2xhc3NQcm92aWRlciwgUHJvdmlkZXIsIFR5cGVQcm92aWRlcn0gZnJvbSAnLi4vZGkvaW50ZXJmYWNlL3Byb3ZpZGVyJztcbmltcG9ydCB7aXNDbGFzc1Byb3ZpZGVyLCBpc1R5cGVQcm92aWRlciwgcHJvdmlkZXJUb0ZhY3Rvcnl9IGZyb20gJy4uL2RpL3IzX2luamVjdG9yJztcbmltcG9ydCB7YXNzZXJ0RGVmaW5lZH0gZnJvbSAnLi4vdXRpbC9hc3NlcnQnO1xuXG5pbXBvcnQge2RpUHVibGljSW5JbmplY3RvciwgZ2V0Tm9kZUluamVjdGFibGUsIGdldE9yQ3JlYXRlTm9kZUluamVjdG9yRm9yTm9kZX0gZnJvbSAnLi9kaSc7XG5pbXBvcnQge8m1ybVkaXJlY3RpdmVJbmplY3R9IGZyb20gJy4vaW5zdHJ1Y3Rpb25zL2FsbCc7XG5pbXBvcnQge0RpcmVjdGl2ZURlZn0gZnJvbSAnLi9pbnRlcmZhY2VzL2RlZmluaXRpb24nO1xuaW1wb3J0IHtOb2RlSW5qZWN0b3JGYWN0b3J5fSBmcm9tICcuL2ludGVyZmFjZXMvaW5qZWN0b3InO1xuaW1wb3J0IHtUQ29udGFpbmVyTm9kZSwgVERpcmVjdGl2ZUhvc3ROb2RlLCBURWxlbWVudENvbnRhaW5lck5vZGUsIFRFbGVtZW50Tm9kZSwgVE5vZGVQcm92aWRlckluZGV4ZXN9IGZyb20gJy4vaW50ZXJmYWNlcy9ub2RlJztcbmltcG9ydCB7aXNDb21wb25lbnREZWZ9IGZyb20gJy4vaW50ZXJmYWNlcy90eXBlX2NoZWNrcyc7XG5pbXBvcnQge0Rlc3Ryb3lIb29rRGF0YSwgTFZpZXcsIFREYXRhLCBUVklFVywgVFZpZXd9IGZyb20gJy4vaW50ZXJmYWNlcy92aWV3JztcbmltcG9ydCB7Z2V0Q3VycmVudFROb2RlLCBnZXRMVmlldywgZ2V0VFZpZXd9IGZyb20gJy4vc3RhdGUnO1xuXG5cblxuLyoqXG4gKiBSZXNvbHZlcyB0aGUgcHJvdmlkZXJzIHdoaWNoIGFyZSBkZWZpbmVkIGluIHRoZSBEaXJlY3RpdmVEZWYuXG4gKlxuICogV2hlbiBpbnNlcnRpbmcgdGhlIHRva2VucyBhbmQgdGhlIGZhY3RvcmllcyBpbiB0aGVpciByZXNwZWN0aXZlIGFycmF5cywgd2UgY2FuIGFzc3VtZSB0aGF0XG4gKiB0aGlzIG1ldGhvZCBpcyBjYWxsZWQgZmlyc3QgZm9yIHRoZSBjb21wb25lbnQgKGlmIGFueSksIGFuZCB0aGVuIGZvciBvdGhlciBkaXJlY3RpdmVzIG9uIHRoZSBzYW1lXG4gKiBub2RlLlxuICogQXMgYSBjb25zZXF1ZW5jZSx0aGUgcHJvdmlkZXJzIGFyZSBhbHdheXMgcHJvY2Vzc2VkIGluIHRoYXQgb3JkZXI6XG4gKiAxKSBUaGUgdmlldyBwcm92aWRlcnMgb2YgdGhlIGNvbXBvbmVudFxuICogMikgVGhlIHByb3ZpZGVycyBvZiB0aGUgY29tcG9uZW50XG4gKiAzKSBUaGUgcHJvdmlkZXJzIG9mIHRoZSBvdGhlciBkaXJlY3RpdmVzXG4gKiBUaGlzIG1hdGNoZXMgdGhlIHN0cnVjdHVyZSBvZiB0aGUgaW5qZWN0YWJsZXMgYXJyYXlzIG9mIGEgdmlldyAoZm9yIGVhY2ggbm9kZSkuXG4gKiBTbyB0aGUgdG9rZW5zIGFuZCB0aGUgZmFjdG9yaWVzIGNhbiBiZSBwdXNoZWQgYXQgdGhlIGVuZCBvZiB0aGUgYXJyYXlzLCBleGNlcHRcbiAqIGluIG9uZSBjYXNlIGZvciBtdWx0aSBwcm92aWRlcnMuXG4gKlxuICogQHBhcmFtIGRlZiB0aGUgZGlyZWN0aXZlIGRlZmluaXRpb25cbiAqIEBwYXJhbSBwcm92aWRlcnM6IEFycmF5IG9mIGBwcm92aWRlcnNgLlxuICogQHBhcmFtIHZpZXdQcm92aWRlcnM6IEFycmF5IG9mIGB2aWV3UHJvdmlkZXJzYC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByb3ZpZGVyc1Jlc29sdmVyPFQ+KFxuICAgIGRlZjogRGlyZWN0aXZlRGVmPFQ+LCBwcm92aWRlcnM6IFByb3ZpZGVyW10sIHZpZXdQcm92aWRlcnM6IFByb3ZpZGVyW10pOiB2b2lkIHtcbiAgY29uc3QgdFZpZXcgPSBnZXRUVmlldygpO1xuICBpZiAodFZpZXcuZmlyc3RDcmVhdGVQYXNzKSB7XG4gICAgY29uc3QgaXNDb21wb25lbnQgPSBpc0NvbXBvbmVudERlZihkZWYpO1xuXG4gICAgLy8gVGhlIGxpc3Qgb2YgdmlldyBwcm92aWRlcnMgaXMgcHJvY2Vzc2VkIGZpcnN0LCBhbmQgdGhlIGZsYWdzIGFyZSB1cGRhdGVkXG4gICAgcmVzb2x2ZVByb3ZpZGVyKHZpZXdQcm92aWRlcnMsIHRWaWV3LmRhdGEsIHRWaWV3LmJsdWVwcmludCwgaXNDb21wb25lbnQsIHRydWUpO1xuXG4gICAgLy8gVGhlbiwgdGhlIGxpc3Qgb2YgcHJvdmlkZXJzIGlzIHByb2Nlc3NlZCwgYW5kIHRoZSBmbGFncyBhcmUgdXBkYXRlZFxuICAgIHJlc29sdmVQcm92aWRlcihwcm92aWRlcnMsIHRWaWV3LmRhdGEsIHRWaWV3LmJsdWVwcmludCwgaXNDb21wb25lbnQsIGZhbHNlKTtcbiAgfVxufVxuXG4vKipcbiAqIFJlc29sdmVzIGEgcHJvdmlkZXIgYW5kIHB1Ymxpc2hlcyBpdCB0byB0aGUgREkgc3lzdGVtLlxuICovXG5mdW5jdGlvbiByZXNvbHZlUHJvdmlkZXIoXG4gICAgcHJvdmlkZXI6IFByb3ZpZGVyLCB0SW5qZWN0YWJsZXM6IFREYXRhLCBsSW5qZWN0YWJsZXNCbHVlcHJpbnQ6IE5vZGVJbmplY3RvckZhY3RvcnlbXSxcbiAgICBpc0NvbXBvbmVudDogYm9vbGVhbiwgaXNWaWV3UHJvdmlkZXI6IGJvb2xlYW4pOiB2b2lkIHtcbiAgcHJvdmlkZXIgPSByZXNvbHZlRm9yd2FyZFJlZihwcm92aWRlcik7XG4gIGlmIChBcnJheS5pc0FycmF5KHByb3ZpZGVyKSkge1xuICAgIC8vIFJlY3Vyc2l2ZWx5IGNhbGwgYHJlc29sdmVQcm92aWRlcmBcbiAgICAvLyBSZWN1cnNpb24gaXMgT0sgaW4gdGhpcyBjYXNlIGJlY2F1c2UgdGhpcyBjb2RlIHdpbGwgbm90IGJlIGluIGhvdC1wYXRoIG9uY2Ugd2UgaW1wbGVtZW50XG4gICAgLy8gY2xvbmluZyBvZiB0aGUgaW5pdGlhbCBzdGF0ZS5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb3ZpZGVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICByZXNvbHZlUHJvdmlkZXIoXG4gICAgICAgICAgcHJvdmlkZXJbaV0sIHRJbmplY3RhYmxlcywgbEluamVjdGFibGVzQmx1ZXByaW50LCBpc0NvbXBvbmVudCwgaXNWaWV3UHJvdmlkZXIpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBjb25zdCB0VmlldyA9IGdldFRWaWV3KCk7XG4gICAgY29uc3QgbFZpZXcgPSBnZXRMVmlldygpO1xuICAgIGxldCB0b2tlbjogYW55ID0gaXNUeXBlUHJvdmlkZXIocHJvdmlkZXIpID8gcHJvdmlkZXIgOiByZXNvbHZlRm9yd2FyZFJlZihwcm92aWRlci5wcm92aWRlKTtcbiAgICBsZXQgcHJvdmlkZXJGYWN0b3J5OiAoKSA9PiBhbnkgPSBwcm92aWRlclRvRmFjdG9yeShwcm92aWRlcik7XG5cbiAgICBjb25zdCB0Tm9kZSA9IGdldEN1cnJlbnRUTm9kZSgpITtcbiAgICBjb25zdCBiZWdpbkluZGV4ID0gdE5vZGUucHJvdmlkZXJJbmRleGVzICYgVE5vZGVQcm92aWRlckluZGV4ZXMuUHJvdmlkZXJzU3RhcnRJbmRleE1hc2s7XG4gICAgY29uc3QgZW5kSW5kZXggPSB0Tm9kZS5kaXJlY3RpdmVTdGFydDtcbiAgICBjb25zdCBjcHRWaWV3UHJvdmlkZXJzQ291bnQgPVxuICAgICAgICB0Tm9kZS5wcm92aWRlckluZGV4ZXMgPj4gVE5vZGVQcm92aWRlckluZGV4ZXMuQ3B0Vmlld1Byb3ZpZGVyc0NvdW50U2hpZnQ7XG5cbiAgICBpZiAoaXNUeXBlUHJvdmlkZXIocHJvdmlkZXIpIHx8ICFwcm92aWRlci5tdWx0aSkge1xuICAgICAgLy8gU2luZ2xlIHByb3ZpZGVyIGNhc2U6IHRoZSBmYWN0b3J5IGlzIGNyZWF0ZWQgYW5kIHB1c2hlZCBpbW1lZGlhdGVseVxuICAgICAgY29uc3QgZmFjdG9yeSA9IG5ldyBOb2RlSW5qZWN0b3JGYWN0b3J5KHByb3ZpZGVyRmFjdG9yeSwgaXNWaWV3UHJvdmlkZXIsIMm1ybVkaXJlY3RpdmVJbmplY3QpO1xuICAgICAgY29uc3QgZXhpc3RpbmdGYWN0b3J5SW5kZXggPSBpbmRleE9mKFxuICAgICAgICAgIHRva2VuLCB0SW5qZWN0YWJsZXMsIGlzVmlld1Byb3ZpZGVyID8gYmVnaW5JbmRleCA6IGJlZ2luSW5kZXggKyBjcHRWaWV3UHJvdmlkZXJzQ291bnQsXG4gICAgICAgICAgZW5kSW5kZXgpO1xuICAgICAgaWYgKGV4aXN0aW5nRmFjdG9yeUluZGV4ID09PSAtMSkge1xuICAgICAgICBkaVB1YmxpY0luSW5qZWN0b3IoXG4gICAgICAgICAgICBnZXRPckNyZWF0ZU5vZGVJbmplY3RvckZvck5vZGUoXG4gICAgICAgICAgICAgICAgdE5vZGUgYXMgVEVsZW1lbnROb2RlIHwgVENvbnRhaW5lck5vZGUgfCBURWxlbWVudENvbnRhaW5lck5vZGUsIGxWaWV3KSxcbiAgICAgICAgICAgIHRWaWV3LCB0b2tlbik7XG4gICAgICAgIHJlZ2lzdGVyRGVzdHJveUhvb2tzSWZTdXBwb3J0ZWQodFZpZXcsIHByb3ZpZGVyLCB0SW5qZWN0YWJsZXMubGVuZ3RoKTtcbiAgICAgICAgdEluamVjdGFibGVzLnB1c2godG9rZW4pO1xuICAgICAgICB0Tm9kZS5kaXJlY3RpdmVTdGFydCsrO1xuICAgICAgICB0Tm9kZS5kaXJlY3RpdmVFbmQrKztcbiAgICAgICAgaWYgKGlzVmlld1Byb3ZpZGVyKSB7XG4gICAgICAgICAgdE5vZGUucHJvdmlkZXJJbmRleGVzICs9IFROb2RlUHJvdmlkZXJJbmRleGVzLkNwdFZpZXdQcm92aWRlcnNDb3VudFNoaWZ0ZXI7XG4gICAgICAgIH1cbiAgICAgICAgbEluamVjdGFibGVzQmx1ZXByaW50LnB1c2goZmFjdG9yeSk7XG4gICAgICAgIGxWaWV3LnB1c2goZmFjdG9yeSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsSW5qZWN0YWJsZXNCbHVlcHJpbnRbZXhpc3RpbmdGYWN0b3J5SW5kZXhdID0gZmFjdG9yeTtcbiAgICAgICAgbFZpZXdbZXhpc3RpbmdGYWN0b3J5SW5kZXhdID0gZmFjdG9yeTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTXVsdGkgcHJvdmlkZXIgY2FzZTpcbiAgICAgIC8vIFdlIGNyZWF0ZSBhIG11bHRpIGZhY3Rvcnkgd2hpY2ggaXMgZ29pbmcgdG8gYWdncmVnYXRlIGFsbCB0aGUgdmFsdWVzLlxuICAgICAgLy8gU2luY2UgdGhlIG91dHB1dCBvZiBzdWNoIGEgZmFjdG9yeSBkZXBlbmRzIG9uIGNvbnRlbnQgb3IgdmlldyBpbmplY3Rpb24sXG4gICAgICAvLyB3ZSBjcmVhdGUgdHdvIG9mIHRoZW0sIHdoaWNoIGFyZSBsaW5rZWQgdG9nZXRoZXIuXG4gICAgICAvL1xuICAgICAgLy8gVGhlIGZpcnN0IG9uZSAoZm9yIHZpZXcgcHJvdmlkZXJzKSBpcyBhbHdheXMgaW4gdGhlIGZpcnN0IGJsb2NrIG9mIHRoZSBpbmplY3RhYmxlcyBhcnJheSxcbiAgICAgIC8vIGFuZCB0aGUgc2Vjb25kIG9uZSAoZm9yIHByb3ZpZGVycykgaXMgYWx3YXlzIGluIHRoZSBzZWNvbmQgYmxvY2suXG4gICAgICAvLyBUaGlzIGlzIGltcG9ydGFudCBiZWNhdXNlIHZpZXcgcHJvdmlkZXJzIGhhdmUgaGlnaGVyIHByaW9yaXR5LiBXaGVuIGEgbXVsdGkgdG9rZW5cbiAgICAgIC8vIGlzIGJlaW5nIGxvb2tlZCB1cCwgdGhlIHZpZXcgcHJvdmlkZXJzIHNob3VsZCBiZSBmb3VuZCBmaXJzdC5cbiAgICAgIC8vIE5vdGUgdGhhdCBpdCBpcyBub3QgcG9zc2libGUgdG8gaGF2ZSBhIG11bHRpIGZhY3RvcnkgaW4gdGhlIHRoaXJkIGJsb2NrIChkaXJlY3RpdmUgYmxvY2spLlxuICAgICAgLy9cbiAgICAgIC8vIFRoZSBhbGdvcml0aG0gdG8gcHJvY2VzcyBtdWx0aSBwcm92aWRlcnMgaXMgYXMgZm9sbG93czpcbiAgICAgIC8vIDEpIElmIHRoZSBtdWx0aSBwcm92aWRlciBjb21lcyBmcm9tIHRoZSBgdmlld1Byb3ZpZGVyc2Agb2YgdGhlIGNvbXBvbmVudDpcbiAgICAgIC8vICAgYSkgSWYgdGhlIHNwZWNpYWwgdmlldyBwcm92aWRlcnMgZmFjdG9yeSBkb2Vzbid0IGV4aXN0LCBpdCBpcyBjcmVhdGVkIGFuZCBwdXNoZWQuXG4gICAgICAvLyAgIGIpIEVsc2UsIHRoZSBtdWx0aSBwcm92aWRlciBpcyBhZGRlZCB0byB0aGUgZXhpc3RpbmcgbXVsdGkgZmFjdG9yeS5cbiAgICAgIC8vIDIpIElmIHRoZSBtdWx0aSBwcm92aWRlciBjb21lcyBmcm9tIHRoZSBgcHJvdmlkZXJzYCBvZiB0aGUgY29tcG9uZW50IG9yIG9mIGFub3RoZXJcbiAgICAgIC8vIGRpcmVjdGl2ZTpcbiAgICAgIC8vICAgYSkgSWYgdGhlIG11bHRpIGZhY3RvcnkgZG9lc24ndCBleGlzdCwgaXQgaXMgY3JlYXRlZCBhbmQgcHJvdmlkZXIgcHVzaGVkIGludG8gaXQuXG4gICAgICAvLyAgICAgIEl0IGlzIGFsc28gbGlua2VkIHRvIHRoZSBtdWx0aSBmYWN0b3J5IGZvciB2aWV3IHByb3ZpZGVycywgaWYgaXQgZXhpc3RzLlxuICAgICAgLy8gICBiKSBFbHNlLCB0aGUgbXVsdGkgcHJvdmlkZXIgaXMgYWRkZWQgdG8gdGhlIGV4aXN0aW5nIG11bHRpIGZhY3RvcnkuXG5cbiAgICAgIGNvbnN0IGV4aXN0aW5nUHJvdmlkZXJzRmFjdG9yeUluZGV4ID1cbiAgICAgICAgICBpbmRleE9mKHRva2VuLCB0SW5qZWN0YWJsZXMsIGJlZ2luSW5kZXggKyBjcHRWaWV3UHJvdmlkZXJzQ291bnQsIGVuZEluZGV4KTtcbiAgICAgIGNvbnN0IGV4aXN0aW5nVmlld1Byb3ZpZGVyc0ZhY3RvcnlJbmRleCA9XG4gICAgICAgICAgaW5kZXhPZih0b2tlbiwgdEluamVjdGFibGVzLCBiZWdpbkluZGV4LCBiZWdpbkluZGV4ICsgY3B0Vmlld1Byb3ZpZGVyc0NvdW50KTtcbiAgICAgIGNvbnN0IGRvZXNQcm92aWRlcnNGYWN0b3J5RXhpc3QgPSBleGlzdGluZ1Byb3ZpZGVyc0ZhY3RvcnlJbmRleCA+PSAwICYmXG4gICAgICAgICAgbEluamVjdGFibGVzQmx1ZXByaW50W2V4aXN0aW5nUHJvdmlkZXJzRmFjdG9yeUluZGV4XTtcbiAgICAgIGNvbnN0IGRvZXNWaWV3UHJvdmlkZXJzRmFjdG9yeUV4aXN0ID0gZXhpc3RpbmdWaWV3UHJvdmlkZXJzRmFjdG9yeUluZGV4ID49IDAgJiZcbiAgICAgICAgICBsSW5qZWN0YWJsZXNCbHVlcHJpbnRbZXhpc3RpbmdWaWV3UHJvdmlkZXJzRmFjdG9yeUluZGV4XTtcblxuICAgICAgaWYgKGlzVmlld1Byb3ZpZGVyICYmICFkb2VzVmlld1Byb3ZpZGVyc0ZhY3RvcnlFeGlzdCB8fFxuICAgICAgICAgICFpc1ZpZXdQcm92aWRlciAmJiAhZG9lc1Byb3ZpZGVyc0ZhY3RvcnlFeGlzdCkge1xuICAgICAgICAvLyBDYXNlcyAxLmEgYW5kIDIuYVxuICAgICAgICBkaVB1YmxpY0luSW5qZWN0b3IoXG4gICAgICAgICAgICBnZXRPckNyZWF0ZU5vZGVJbmplY3RvckZvck5vZGUoXG4gICAgICAgICAgICAgICAgdE5vZGUgYXMgVEVsZW1lbnROb2RlIHwgVENvbnRhaW5lck5vZGUgfCBURWxlbWVudENvbnRhaW5lck5vZGUsIGxWaWV3KSxcbiAgICAgICAgICAgIHRWaWV3LCB0b2tlbik7XG4gICAgICAgIGNvbnN0IGZhY3RvcnkgPSBtdWx0aUZhY3RvcnkoXG4gICAgICAgICAgICBpc1ZpZXdQcm92aWRlciA/IG11bHRpVmlld1Byb3ZpZGVyc0ZhY3RvcnlSZXNvbHZlciA6IG11bHRpUHJvdmlkZXJzRmFjdG9yeVJlc29sdmVyLFxuICAgICAgICAgICAgbEluamVjdGFibGVzQmx1ZXByaW50Lmxlbmd0aCwgaXNWaWV3UHJvdmlkZXIsIGlzQ29tcG9uZW50LCBwcm92aWRlckZhY3RvcnkpO1xuICAgICAgICBpZiAoIWlzVmlld1Byb3ZpZGVyICYmIGRvZXNWaWV3UHJvdmlkZXJzRmFjdG9yeUV4aXN0KSB7XG4gICAgICAgICAgbEluamVjdGFibGVzQmx1ZXByaW50W2V4aXN0aW5nVmlld1Byb3ZpZGVyc0ZhY3RvcnlJbmRleF0ucHJvdmlkZXJGYWN0b3J5ID0gZmFjdG9yeTtcbiAgICAgICAgfVxuICAgICAgICByZWdpc3RlckRlc3Ryb3lIb29rc0lmU3VwcG9ydGVkKHRWaWV3LCBwcm92aWRlciwgdEluamVjdGFibGVzLmxlbmd0aCwgMCk7XG4gICAgICAgIHRJbmplY3RhYmxlcy5wdXNoKHRva2VuKTtcbiAgICAgICAgdE5vZGUuZGlyZWN0aXZlU3RhcnQrKztcbiAgICAgICAgdE5vZGUuZGlyZWN0aXZlRW5kKys7XG4gICAgICAgIGlmIChpc1ZpZXdQcm92aWRlcikge1xuICAgICAgICAgIHROb2RlLnByb3ZpZGVySW5kZXhlcyArPSBUTm9kZVByb3ZpZGVySW5kZXhlcy5DcHRWaWV3UHJvdmlkZXJzQ291bnRTaGlmdGVyO1xuICAgICAgICB9XG4gICAgICAgIGxJbmplY3RhYmxlc0JsdWVwcmludC5wdXNoKGZhY3RvcnkpO1xuICAgICAgICBsVmlldy5wdXNoKGZhY3RvcnkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQ2FzZXMgMS5iIGFuZCAyLmJcbiAgICAgICAgY29uc3QgaW5kZXhJbkZhY3RvcnkgPSBtdWx0aUZhY3RvcnlBZGQoXG4gICAgICAgICAgICBsSW5qZWN0YWJsZXNCbHVlcHJpbnQhXG4gICAgICAgICAgICAgICAgW2lzVmlld1Byb3ZpZGVyID8gZXhpc3RpbmdWaWV3UHJvdmlkZXJzRmFjdG9yeUluZGV4IDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleGlzdGluZ1Byb3ZpZGVyc0ZhY3RvcnlJbmRleF0sXG4gICAgICAgICAgICBwcm92aWRlckZhY3RvcnksICFpc1ZpZXdQcm92aWRlciAmJiBpc0NvbXBvbmVudCk7XG4gICAgICAgIHJlZ2lzdGVyRGVzdHJveUhvb2tzSWZTdXBwb3J0ZWQoXG4gICAgICAgICAgICB0VmlldywgcHJvdmlkZXIsXG4gICAgICAgICAgICBleGlzdGluZ1Byb3ZpZGVyc0ZhY3RvcnlJbmRleCA+IC0xID8gZXhpc3RpbmdQcm92aWRlcnNGYWN0b3J5SW5kZXggOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nVmlld1Byb3ZpZGVyc0ZhY3RvcnlJbmRleCxcbiAgICAgICAgICAgIGluZGV4SW5GYWN0b3J5KTtcbiAgICAgIH1cbiAgICAgIGlmICghaXNWaWV3UHJvdmlkZXIgJiYgaXNDb21wb25lbnQgJiYgZG9lc1ZpZXdQcm92aWRlcnNGYWN0b3J5RXhpc3QpIHtcbiAgICAgICAgbEluamVjdGFibGVzQmx1ZXByaW50W2V4aXN0aW5nVmlld1Byb3ZpZGVyc0ZhY3RvcnlJbmRleF0uY29tcG9uZW50UHJvdmlkZXJzISsrO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFJlZ2lzdGVycyB0aGUgYG5nT25EZXN0cm95YCBob29rIG9mIGEgcHJvdmlkZXIsIGlmIHRoZSBwcm92aWRlciBzdXBwb3J0cyBkZXN0cm95IGhvb2tzLlxuICogQHBhcmFtIHRWaWV3IGBUVmlld2AgaW4gd2hpY2ggdG8gcmVnaXN0ZXIgdGhlIGhvb2suXG4gKiBAcGFyYW0gcHJvdmlkZXIgUHJvdmlkZXIgd2hvc2UgaG9vayBzaG91bGQgYmUgcmVnaXN0ZXJlZC5cbiAqIEBwYXJhbSBjb250ZXh0SW5kZXggSW5kZXggdW5kZXIgd2hpY2ggdG8gZmluZCB0aGUgY29udGV4dCBmb3IgdGhlIGhvb2sgd2hlbiBpdCdzIGJlaW5nIGludm9rZWQuXG4gKiBAcGFyYW0gaW5kZXhJbkZhY3RvcnkgT25seSByZXF1aXJlZCBmb3IgYG11bHRpYCBwcm92aWRlcnMuIEluZGV4IG9mIHRoZSBwcm92aWRlciBpbiB0aGUgbXVsdGlcbiAqIHByb3ZpZGVyIGZhY3RvcnkuXG4gKi9cbmZ1bmN0aW9uIHJlZ2lzdGVyRGVzdHJveUhvb2tzSWZTdXBwb3J0ZWQoXG4gICAgdFZpZXc6IFRWaWV3LCBwcm92aWRlcjogRXhjbHVkZTxQcm92aWRlciwgYW55W10+LCBjb250ZXh0SW5kZXg6IG51bWJlcixcbiAgICBpbmRleEluRmFjdG9yeT86IG51bWJlcikge1xuICBjb25zdCBwcm92aWRlcklzVHlwZVByb3ZpZGVyID0gaXNUeXBlUHJvdmlkZXIocHJvdmlkZXIpO1xuICBjb25zdCBwcm92aWRlcklzQ2xhc3NQcm92aWRlciA9IGlzQ2xhc3NQcm92aWRlcihwcm92aWRlcik7XG5cbiAgaWYgKHByb3ZpZGVySXNUeXBlUHJvdmlkZXIgfHwgcHJvdmlkZXJJc0NsYXNzUHJvdmlkZXIpIHtcbiAgICAvLyBSZXNvbHZlIGZvcndhcmQgcmVmZXJlbmNlcyBhcyBgdXNlQ2xhc3NgIGNhbiBob2xkIGEgZm9yd2FyZCByZWZlcmVuY2UuXG4gICAgY29uc3QgY2xhc3NUb2tlbiA9IHByb3ZpZGVySXNDbGFzc1Byb3ZpZGVyID8gcmVzb2x2ZUZvcndhcmRSZWYocHJvdmlkZXIudXNlQ2xhc3MpIDogcHJvdmlkZXI7XG4gICAgY29uc3QgcHJvdG90eXBlID0gY2xhc3NUb2tlbi5wcm90b3R5cGU7XG4gICAgY29uc3QgbmdPbkRlc3Ryb3kgPSBwcm90b3R5cGUubmdPbkRlc3Ryb3k7XG5cbiAgICBpZiAobmdPbkRlc3Ryb3kpIHtcbiAgICAgIGNvbnN0IGhvb2tzID0gdFZpZXcuZGVzdHJveUhvb2tzIHx8ICh0Vmlldy5kZXN0cm95SG9va3MgPSBbXSk7XG5cbiAgICAgIGlmICghcHJvdmlkZXJJc1R5cGVQcm92aWRlciAmJiAoKHByb3ZpZGVyIGFzIENsYXNzUHJvdmlkZXIpKS5tdWx0aSkge1xuICAgICAgICBuZ0Rldk1vZGUgJiZcbiAgICAgICAgICAgIGFzc2VydERlZmluZWQoXG4gICAgICAgICAgICAgICAgaW5kZXhJbkZhY3RvcnksICdpbmRleEluRmFjdG9yeSB3aGVuIHJlZ2lzdGVyaW5nIG11bHRpIGZhY3RvcnkgZGVzdHJveSBob29rJyk7XG4gICAgICAgIGNvbnN0IGV4aXN0aW5nQ2FsbGJhY2tzSW5kZXggPSBob29rcy5pbmRleE9mKGNvbnRleHRJbmRleCk7XG5cbiAgICAgICAgaWYgKGV4aXN0aW5nQ2FsbGJhY2tzSW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgaG9va3MucHVzaChjb250ZXh0SW5kZXgsIFtpbmRleEluRmFjdG9yeSwgbmdPbkRlc3Ryb3ldKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAoaG9va3NbZXhpc3RpbmdDYWxsYmFja3NJbmRleCArIDFdIGFzIERlc3Ryb3lIb29rRGF0YSkucHVzaChpbmRleEluRmFjdG9yeSEsIG5nT25EZXN0cm95KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaG9va3MucHVzaChjb250ZXh0SW5kZXgsIG5nT25EZXN0cm95KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBBZGQgYSBmYWN0b3J5IGluIGEgbXVsdGkgZmFjdG9yeS5cbiAqIEByZXR1cm5zIEluZGV4IGF0IHdoaWNoIHRoZSBmYWN0b3J5IHdhcyBpbnNlcnRlZC5cbiAqL1xuZnVuY3Rpb24gbXVsdGlGYWN0b3J5QWRkKFxuICAgIG11bHRpRmFjdG9yeTogTm9kZUluamVjdG9yRmFjdG9yeSwgZmFjdG9yeTogKCkgPT4gYW55LCBpc0NvbXBvbmVudFByb3ZpZGVyOiBib29sZWFuKTogbnVtYmVyIHtcbiAgaWYgKGlzQ29tcG9uZW50UHJvdmlkZXIpIHtcbiAgICBtdWx0aUZhY3RvcnkuY29tcG9uZW50UHJvdmlkZXJzISsrO1xuICB9XG4gIHJldHVybiBtdWx0aUZhY3RvcnkubXVsdGkhLnB1c2goZmFjdG9yeSkgLSAxO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGluZGV4IG9mIGl0ZW0gaW4gdGhlIGFycmF5LCBidXQgb25seSBpbiB0aGUgYmVnaW4gdG8gZW5kIHJhbmdlLlxuICovXG5mdW5jdGlvbiBpbmRleE9mKGl0ZW06IGFueSwgYXJyOiBhbnlbXSwgYmVnaW46IG51bWJlciwgZW5kOiBudW1iZXIpIHtcbiAgZm9yIChsZXQgaSA9IGJlZ2luOyBpIDwgZW5kOyBpKyspIHtcbiAgICBpZiAoYXJyW2ldID09PSBpdGVtKSByZXR1cm4gaTtcbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbi8qKlxuICogVXNlIHRoaXMgd2l0aCBgbXVsdGlgIGBwcm92aWRlcnNgLlxuICovXG5mdW5jdGlvbiBtdWx0aVByb3ZpZGVyc0ZhY3RvcnlSZXNvbHZlcihcbiAgICB0aGlzOiBOb2RlSW5qZWN0b3JGYWN0b3J5LCBfOiB1bmRlZmluZWQsIHREYXRhOiBURGF0YSwgbERhdGE6IExWaWV3LFxuICAgIHROb2RlOiBURGlyZWN0aXZlSG9zdE5vZGUpOiBhbnlbXSB7XG4gIHJldHVybiBtdWx0aVJlc29sdmUodGhpcy5tdWx0aSEsIFtdKTtcbn1cblxuLyoqXG4gKiBVc2UgdGhpcyB3aXRoIGBtdWx0aWAgYHZpZXdQcm92aWRlcnNgLlxuICpcbiAqIFRoaXMgZmFjdG9yeSBrbm93cyBob3cgdG8gY29uY2F0ZW5hdGUgaXRzZWxmIHdpdGggdGhlIGV4aXN0aW5nIGBtdWx0aWAgYHByb3ZpZGVyc2AuXG4gKi9cbmZ1bmN0aW9uIG11bHRpVmlld1Byb3ZpZGVyc0ZhY3RvcnlSZXNvbHZlcihcbiAgICB0aGlzOiBOb2RlSW5qZWN0b3JGYWN0b3J5LCBfOiB1bmRlZmluZWQsIHREYXRhOiBURGF0YSwgbFZpZXc6IExWaWV3LFxuICAgIHROb2RlOiBURGlyZWN0aXZlSG9zdE5vZGUpOiBhbnlbXSB7XG4gIGNvbnN0IGZhY3RvcmllcyA9IHRoaXMubXVsdGkhO1xuICBsZXQgcmVzdWx0OiBhbnlbXTtcbiAgaWYgKHRoaXMucHJvdmlkZXJGYWN0b3J5KSB7XG4gICAgY29uc3QgY29tcG9uZW50Q291bnQgPSB0aGlzLnByb3ZpZGVyRmFjdG9yeS5jb21wb25lbnRQcm92aWRlcnMhO1xuICAgIGNvbnN0IG11bHRpUHJvdmlkZXJzID1cbiAgICAgICAgZ2V0Tm9kZUluamVjdGFibGUobFZpZXcsIGxWaWV3W1RWSUVXXSwgdGhpcy5wcm92aWRlckZhY3RvcnkhLmluZGV4ISwgdE5vZGUpO1xuICAgIC8vIENvcHkgdGhlIHNlY3Rpb24gb2YgdGhlIGFycmF5IHdoaWNoIGNvbnRhaW5zIGBtdWx0aWAgYHByb3ZpZGVyc2AgZnJvbSB0aGUgY29tcG9uZW50XG4gICAgcmVzdWx0ID0gbXVsdGlQcm92aWRlcnMuc2xpY2UoMCwgY29tcG9uZW50Q291bnQpO1xuICAgIC8vIEluc2VydCB0aGUgYHZpZXdQcm92aWRlcmAgaW5zdGFuY2VzLlxuICAgIG11bHRpUmVzb2x2ZShmYWN0b3JpZXMsIHJlc3VsdCk7XG4gICAgLy8gQ29weSB0aGUgc2VjdGlvbiBvZiB0aGUgYXJyYXkgd2hpY2ggY29udGFpbnMgYG11bHRpYCBgcHJvdmlkZXJzYCBmcm9tIG90aGVyIGRpcmVjdGl2ZXNcbiAgICBmb3IgKGxldCBpID0gY29tcG9uZW50Q291bnQ7IGkgPCBtdWx0aVByb3ZpZGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0LnB1c2gobXVsdGlQcm92aWRlcnNbaV0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgPSBbXTtcbiAgICAvLyBJbnNlcnQgdGhlIGB2aWV3UHJvdmlkZXJgIGluc3RhbmNlcy5cbiAgICBtdWx0aVJlc29sdmUoZmFjdG9yaWVzLCByZXN1bHQpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogTWFwcyBhbiBhcnJheSBvZiBmYWN0b3JpZXMgaW50byBhbiBhcnJheSBvZiB2YWx1ZXMuXG4gKi9cbmZ1bmN0aW9uIG11bHRpUmVzb2x2ZShmYWN0b3JpZXM6IEFycmF5PCgpID0+IGFueT4sIHJlc3VsdDogYW55W10pOiBhbnlbXSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZmFjdG9yaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgZmFjdG9yeSA9IGZhY3Rvcmllc1tpXSEgYXMgKCkgPT4gbnVsbDtcbiAgICByZXN1bHQucHVzaChmYWN0b3J5KCkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG11bHRpIGZhY3RvcnkuXG4gKi9cbmZ1bmN0aW9uIG11bHRpRmFjdG9yeShcbiAgICBmYWN0b3J5Rm46IChcbiAgICAgICAgdGhpczogTm9kZUluamVjdG9yRmFjdG9yeSwgXzogdW5kZWZpbmVkLCB0RGF0YTogVERhdGEsIGxEYXRhOiBMVmlldyxcbiAgICAgICAgdE5vZGU6IFREaXJlY3RpdmVIb3N0Tm9kZSkgPT4gYW55LFxuICAgIGluZGV4OiBudW1iZXIsIGlzVmlld1Byb3ZpZGVyOiBib29sZWFuLCBpc0NvbXBvbmVudDogYm9vbGVhbixcbiAgICBmOiAoKSA9PiBhbnkpOiBOb2RlSW5qZWN0b3JGYWN0b3J5IHtcbiAgY29uc3QgZmFjdG9yeSA9IG5ldyBOb2RlSW5qZWN0b3JGYWN0b3J5KGZhY3RvcnlGbiwgaXNWaWV3UHJvdmlkZXIsIMm1ybVkaXJlY3RpdmVJbmplY3QpO1xuICBmYWN0b3J5Lm11bHRpID0gW107XG4gIGZhY3RvcnkuaW5kZXggPSBpbmRleDtcbiAgZmFjdG9yeS5jb21wb25lbnRQcm92aWRlcnMgPSAwO1xuICBtdWx0aUZhY3RvcnlBZGQoZmFjdG9yeSwgZiwgaXNDb21wb25lbnQgJiYgIWlzVmlld1Byb3ZpZGVyKTtcbiAgcmV0dXJuIGZhY3Rvcnk7XG59XG4iXX0=