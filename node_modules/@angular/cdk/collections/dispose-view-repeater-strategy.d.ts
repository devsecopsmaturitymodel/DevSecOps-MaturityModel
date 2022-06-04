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
 * A repeater that destroys views when they are removed from a
 * {@link ViewContainerRef}. When new items are inserted into the container,
 * the repeater will always construct a new embedded view for each item.
 *
 * @template T The type for the embedded view's $implicit property.
 * @template R The type for the item in each IterableDiffer change record.
 * @template C The type for the context passed to each embedded view.
 */
export declare class _DisposeViewRepeaterStrategy<T, R, C extends _ViewRepeaterItemContext<T>> implements _ViewRepeater<T, R, C> {
    applyChanges(changes: IterableChanges<R>, viewContainerRef: ViewContainerRef, itemContextFactory: _ViewRepeaterItemContextFactory<T, R, C>, itemValueResolver: _ViewRepeaterItemValueResolver<T, R>, itemViewChanged?: _ViewRepeaterItemChanged<R, C>): void;
    detach(): void;
}
