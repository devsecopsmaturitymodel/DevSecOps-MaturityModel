/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { IterableChanges, ViewContainerRef } from '@angular/core';
import { _ViewRepeater, _ViewRepeaterItemChanged, _ViewRepeaterItemContext, _ViewRepeaterItemContextFactory, _ViewRepeaterItemValueResolver } from './view-repeater';
/**
 * A repeater that caches views when they are removed from a
 * {@link ViewContainerRef}. When new items are inserted into the container,
 * the repeater will reuse one of the cached views instead of creating a new
 * embedded view. Recycling cached views reduces the quantity of expensive DOM
 * inserts.
 *
 * @template T The type for the embedded view's $implicit property.
 * @template R The type for the item in each IterableDiffer change record.
 * @template C The type for the context passed to each embedded view.
 */
export declare class _RecycleViewRepeaterStrategy<T, R, C extends _ViewRepeaterItemContext<T>> implements _ViewRepeater<T, R, C> {
    /**
     * The size of the cache used to store unused views.
     * Setting the cache size to `0` will disable caching. Defaults to 20 views.
     */
    viewCacheSize: number;
    /**
     * View cache that stores embedded view instances that have been previously stamped out,
     * but don't are not currently rendered. The view repeater will reuse these views rather than
     * creating brand new ones.
     *
     * TODO(michaeljamesparsons) Investigate whether using a linked list would improve performance.
     */
    private _viewCache;
    /** Apply changes to the DOM. */
    applyChanges(changes: IterableChanges<R>, viewContainerRef: ViewContainerRef, itemContextFactory: _ViewRepeaterItemContextFactory<T, R, C>, itemValueResolver: _ViewRepeaterItemValueResolver<T, R>, itemViewChanged?: _ViewRepeaterItemChanged<R, C>): void;
    detach(): void;
    /**
     * Inserts a view for a new item, either from the cache or by creating a new
     * one. Returns `undefined` if the item was inserted into a cached view.
     */
    private _insertView;
    /** Detaches the view at the given index and inserts into the view cache. */
    private _detachAndCacheView;
    /** Moves view at the previous index to the current index. */
    private _moveView;
    /**
     * Cache the given detached view. If the cache is full, the view will be
     * destroyed.
     */
    private _maybeCacheView;
    /** Inserts a recycled view from the cache at the given index. */
    private _insertViewFromCache;
}
