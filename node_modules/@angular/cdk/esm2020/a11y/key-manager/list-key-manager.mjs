/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { QueryList } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, TAB, A, Z, ZERO, NINE, hasModifierKey, HOME, END, } from '@angular/cdk/keycodes';
import { debounceTime, filter, map, tap } from 'rxjs/operators';
/**
 * This class manages keyboard events for selectable lists. If you pass it a query list
 * of items, it will set the active item correctly when arrow events occur.
 */
export class ListKeyManager {
    constructor(_items) {
        this._items = _items;
        this._activeItemIndex = -1;
        this._activeItem = null;
        this._wrap = false;
        this._letterKeyStream = new Subject();
        this._typeaheadSubscription = Subscription.EMPTY;
        this._vertical = true;
        this._allowedModifierKeys = [];
        this._homeAndEnd = false;
        /**
         * Predicate function that can be used to check whether an item should be skipped
         * by the key manager. By default, disabled items are skipped.
         */
        this._skipPredicateFn = (item) => item.disabled;
        // Buffer for the letters that the user has pressed when the typeahead option is turned on.
        this._pressedLetters = [];
        /**
         * Stream that emits any time the TAB key is pressed, so components can react
         * when focus is shifted off of the list.
         */
        this.tabOut = new Subject();
        /** Stream that emits whenever the active item of the list manager changes. */
        this.change = new Subject();
        // We allow for the items to be an array because, in some cases, the consumer may
        // not have access to a QueryList of the items they want to manage (e.g. when the
        // items aren't being collected via `ViewChildren` or `ContentChildren`).
        if (_items instanceof QueryList) {
            _items.changes.subscribe((newItems) => {
                if (this._activeItem) {
                    const itemArray = newItems.toArray();
                    const newIndex = itemArray.indexOf(this._activeItem);
                    if (newIndex > -1 && newIndex !== this._activeItemIndex) {
                        this._activeItemIndex = newIndex;
                    }
                }
            });
        }
    }
    /**
     * Sets the predicate function that determines which items should be skipped by the
     * list key manager.
     * @param predicate Function that determines whether the given item should be skipped.
     */
    skipPredicate(predicate) {
        this._skipPredicateFn = predicate;
        return this;
    }
    /**
     * Configures wrapping mode, which determines whether the active item will wrap to
     * the other end of list when there are no more items in the given direction.
     * @param shouldWrap Whether the list should wrap when reaching the end.
     */
    withWrap(shouldWrap = true) {
        this._wrap = shouldWrap;
        return this;
    }
    /**
     * Configures whether the key manager should be able to move the selection vertically.
     * @param enabled Whether vertical selection should be enabled.
     */
    withVerticalOrientation(enabled = true) {
        this._vertical = enabled;
        return this;
    }
    /**
     * Configures the key manager to move the selection horizontally.
     * Passing in `null` will disable horizontal movement.
     * @param direction Direction in which the selection can be moved.
     */
    withHorizontalOrientation(direction) {
        this._horizontal = direction;
        return this;
    }
    /**
     * Modifier keys which are allowed to be held down and whose default actions will be prevented
     * as the user is pressing the arrow keys. Defaults to not allowing any modifier keys.
     */
    withAllowedModifierKeys(keys) {
        this._allowedModifierKeys = keys;
        return this;
    }
    /**
     * Turns on typeahead mode which allows users to set the active item by typing.
     * @param debounceInterval Time to wait after the last keystroke before setting the active item.
     */
    withTypeAhead(debounceInterval = 200) {
        if ((typeof ngDevMode === 'undefined' || ngDevMode) &&
            this._items.length &&
            this._items.some(item => typeof item.getLabel !== 'function')) {
            throw Error('ListKeyManager items in typeahead mode must implement the `getLabel` method.');
        }
        this._typeaheadSubscription.unsubscribe();
        // Debounce the presses of non-navigational keys, collect the ones that correspond to letters
        // and convert those letters back into a string. Afterwards find the first item that starts
        // with that string and select it.
        this._typeaheadSubscription = this._letterKeyStream
            .pipe(tap(letter => this._pressedLetters.push(letter)), debounceTime(debounceInterval), filter(() => this._pressedLetters.length > 0), map(() => this._pressedLetters.join('')))
            .subscribe(inputString => {
            const items = this._getItemsArray();
            // Start at 1 because we want to start searching at the item immediately
            // following the current active item.
            for (let i = 1; i < items.length + 1; i++) {
                const index = (this._activeItemIndex + i) % items.length;
                const item = items[index];
                if (!this._skipPredicateFn(item) &&
                    item.getLabel().toUpperCase().trim().indexOf(inputString) === 0) {
                    this.setActiveItem(index);
                    break;
                }
            }
            this._pressedLetters = [];
        });
        return this;
    }
    /**
     * Configures the key manager to activate the first and last items
     * respectively when the Home or End key is pressed.
     * @param enabled Whether pressing the Home or End key activates the first/last item.
     */
    withHomeAndEnd(enabled = true) {
        this._homeAndEnd = enabled;
        return this;
    }
    setActiveItem(item) {
        const previousActiveItem = this._activeItem;
        this.updateActiveItem(item);
        if (this._activeItem !== previousActiveItem) {
            this.change.next(this._activeItemIndex);
        }
    }
    /**
     * Sets the active item depending on the key event passed in.
     * @param event Keyboard event to be used for determining which element should be active.
     */
    onKeydown(event) {
        const keyCode = event.keyCode;
        const modifiers = ['altKey', 'ctrlKey', 'metaKey', 'shiftKey'];
        const isModifierAllowed = modifiers.every(modifier => {
            return !event[modifier] || this._allowedModifierKeys.indexOf(modifier) > -1;
        });
        switch (keyCode) {
            case TAB:
                this.tabOut.next();
                return;
            case DOWN_ARROW:
                if (this._vertical && isModifierAllowed) {
                    this.setNextItemActive();
                    break;
                }
                else {
                    return;
                }
            case UP_ARROW:
                if (this._vertical && isModifierAllowed) {
                    this.setPreviousItemActive();
                    break;
                }
                else {
                    return;
                }
            case RIGHT_ARROW:
                if (this._horizontal && isModifierAllowed) {
                    this._horizontal === 'rtl' ? this.setPreviousItemActive() : this.setNextItemActive();
                    break;
                }
                else {
                    return;
                }
            case LEFT_ARROW:
                if (this._horizontal && isModifierAllowed) {
                    this._horizontal === 'rtl' ? this.setNextItemActive() : this.setPreviousItemActive();
                    break;
                }
                else {
                    return;
                }
            case HOME:
                if (this._homeAndEnd && isModifierAllowed) {
                    this.setFirstItemActive();
                    break;
                }
                else {
                    return;
                }
            case END:
                if (this._homeAndEnd && isModifierAllowed) {
                    this.setLastItemActive();
                    break;
                }
                else {
                    return;
                }
            default:
                if (isModifierAllowed || hasModifierKey(event, 'shiftKey')) {
                    // Attempt to use the `event.key` which also maps it to the user's keyboard language,
                    // otherwise fall back to resolving alphanumeric characters via the keyCode.
                    if (event.key && event.key.length === 1) {
                        this._letterKeyStream.next(event.key.toLocaleUpperCase());
                    }
                    else if ((keyCode >= A && keyCode <= Z) || (keyCode >= ZERO && keyCode <= NINE)) {
                        this._letterKeyStream.next(String.fromCharCode(keyCode));
                    }
                }
                // Note that we return here, in order to avoid preventing
                // the default action of non-navigational keys.
                return;
        }
        this._pressedLetters = [];
        event.preventDefault();
    }
    /** Index of the currently active item. */
    get activeItemIndex() {
        return this._activeItemIndex;
    }
    /** The active item. */
    get activeItem() {
        return this._activeItem;
    }
    /** Gets whether the user is currently typing into the manager using the typeahead feature. */
    isTyping() {
        return this._pressedLetters.length > 0;
    }
    /** Sets the active item to the first enabled item in the list. */
    setFirstItemActive() {
        this._setActiveItemByIndex(0, 1);
    }
    /** Sets the active item to the last enabled item in the list. */
    setLastItemActive() {
        this._setActiveItemByIndex(this._items.length - 1, -1);
    }
    /** Sets the active item to the next enabled item in the list. */
    setNextItemActive() {
        this._activeItemIndex < 0 ? this.setFirstItemActive() : this._setActiveItemByDelta(1);
    }
    /** Sets the active item to a previous enabled item in the list. */
    setPreviousItemActive() {
        this._activeItemIndex < 0 && this._wrap
            ? this.setLastItemActive()
            : this._setActiveItemByDelta(-1);
    }
    updateActiveItem(item) {
        const itemArray = this._getItemsArray();
        const index = typeof item === 'number' ? item : itemArray.indexOf(item);
        const activeItem = itemArray[index];
        // Explicitly check for `null` and `undefined` because other falsy values are valid.
        this._activeItem = activeItem == null ? null : activeItem;
        this._activeItemIndex = index;
    }
    /**
     * This method sets the active item, given a list of items and the delta between the
     * currently active item and the new active item. It will calculate differently
     * depending on whether wrap mode is turned on.
     */
    _setActiveItemByDelta(delta) {
        this._wrap ? this._setActiveInWrapMode(delta) : this._setActiveInDefaultMode(delta);
    }
    /**
     * Sets the active item properly given "wrap" mode. In other words, it will continue to move
     * down the list until it finds an item that is not disabled, and it will wrap if it
     * encounters either end of the list.
     */
    _setActiveInWrapMode(delta) {
        const items = this._getItemsArray();
        for (let i = 1; i <= items.length; i++) {
            const index = (this._activeItemIndex + delta * i + items.length) % items.length;
            const item = items[index];
            if (!this._skipPredicateFn(item)) {
                this.setActiveItem(index);
                return;
            }
        }
    }
    /**
     * Sets the active item properly given the default mode. In other words, it will
     * continue to move down the list until it finds an item that is not disabled. If
     * it encounters either end of the list, it will stop and not wrap.
     */
    _setActiveInDefaultMode(delta) {
        this._setActiveItemByIndex(this._activeItemIndex + delta, delta);
    }
    /**
     * Sets the active item to the first enabled item starting at the index specified. If the
     * item is disabled, it will move in the fallbackDelta direction until it either
     * finds an enabled item or encounters the end of the list.
     */
    _setActiveItemByIndex(index, fallbackDelta) {
        const items = this._getItemsArray();
        if (!items[index]) {
            return;
        }
        while (this._skipPredicateFn(items[index])) {
            index += fallbackDelta;
            if (!items[index]) {
                return;
            }
        }
        this.setActiveItem(index);
    }
    /** Returns the items as an array. */
    _getItemsArray() {
        return this._items instanceof QueryList ? this._items.toArray() : this._items;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC1rZXktbWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvYTExeS9rZXktbWFuYWdlci9saXN0LWtleS1tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDeEMsT0FBTyxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDM0MsT0FBTyxFQUNMLFFBQVEsRUFDUixVQUFVLEVBQ1YsVUFBVSxFQUNWLFdBQVcsRUFDWCxHQUFHLEVBQ0gsQ0FBQyxFQUNELENBQUMsRUFDRCxJQUFJLEVBQ0osSUFBSSxFQUNKLGNBQWMsRUFDZCxJQUFJLEVBQ0osR0FBRyxHQUNKLE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxFQUFDLFlBQVksRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBYzlEOzs7R0FHRztBQUNILE1BQU0sT0FBTyxjQUFjO0lBb0J6QixZQUFvQixNQUEwQjtRQUExQixXQUFNLEdBQU4sTUFBTSxDQUFvQjtRQW5CdEMscUJBQWdCLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDdEIsZ0JBQVcsR0FBYSxJQUFJLENBQUM7UUFDN0IsVUFBSyxHQUFHLEtBQUssQ0FBQztRQUNMLHFCQUFnQixHQUFHLElBQUksT0FBTyxFQUFVLENBQUM7UUFDbEQsMkJBQXNCLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQztRQUM1QyxjQUFTLEdBQUcsSUFBSSxDQUFDO1FBRWpCLHlCQUFvQixHQUFnQyxFQUFFLENBQUM7UUFDdkQsZ0JBQVcsR0FBRyxLQUFLLENBQUM7UUFFNUI7OztXQUdHO1FBQ0sscUJBQWdCLEdBQUcsQ0FBQyxJQUFPLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7UUFFdEQsMkZB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QUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDaEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDMUIsT0FBTzthQUNSO1NBQ0Y7SUFDSCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNLLHVCQUF1QixDQUFDLEtBQWE7UUFDM0MsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVEOzs7O09BSUc7SUFDSyxxQkFBcUIsQ0FBQyxLQUFhLEVBQUUsYUFBcUI7UUFDaEUsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRXBDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDakIsT0FBTztTQUNSO1FBRUQsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDMUMsS0FBSyxJQUFJLGFBQWEsQ0FBQztZQUV2QixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNqQixPQUFPO2FBQ1I7U0FDRjtRQUVELElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVELHFDQUFxQztJQUM3QixjQUFjO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLE1BQU0sWUFBWSxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDaEYsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7UXVlcnlMaXN0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7U3ViamVjdCwgU3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gIFVQX0FSUk9XLFxuICBET1dOX0FSUk9XLFxuICBMRUZUX0FSUk9XLFxuICBSSUdIVF9BUlJPVyxcbiAgVEFCLFxuICBBLFxuICBaLFxuICBaRVJPLFxuICBOSU5FLFxuICBoYXNNb2RpZmllcktleSxcbiAgSE9NRSxcbiAgRU5ELFxufSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtkZWJvdW5jZVRpbWUsIGZpbHRlciwgbWFwLCB0YXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuLyoqIFRoaXMgaW50ZXJmYWNlIGlzIGZvciBpdGVtcyB0aGF0IGNhbiBiZSBwYXNzZWQgdG8gYSBMaXN0S2V5TWFuYWdlci4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTGlzdEtleU1hbmFnZXJPcHRpb24ge1xuICAvKiogV2hldGhlciB0aGUgb3B0aW9uIGlzIGRpc2FibGVkLiAqL1xuICBkaXNhYmxlZD86IGJvb2xlYW47XG5cbiAgLyoqIEdldHMgdGhlIGxhYmVsIGZvciB0aGlzIG9wdGlvbi4gKi9cbiAgZ2V0TGFiZWw/KCk6IHN0cmluZztcbn1cblxuLyoqIE1vZGlmaWVyIGtleXMgaGFuZGxlZCBieSB0aGUgTGlzdEtleU1hbmFnZXIuICovXG5leHBvcnQgdHlwZSBMaXN0S2V5TWFuYWdlck1vZGlmaWVyS2V5ID0gJ2FsdEtleScgfCAnY3RybEtleScgfCAnbWV0YUtleScgfCAnc2hpZnRLZXknO1xuXG4vKipcbiAqIFRoaXMgY2xhc3MgbWFuYWdlcyBrZXlib2FyZCBldmVudHMgZm9yIHNlbGVjdGFibGUgbGlzdHMuIElmIHlvdSBwYXNzIGl0IGEgcXVlcnkgbGlzdFxuICogb2YgaXRlbXMsIGl0IHdpbGwgc2V0IHRoZSBhY3RpdmUgaXRlbSBjb3JyZWN0bHkgd2hlbiBhcnJvdyBldmVudHMgb2NjdXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBMaXN0S2V5TWFuYWdlcjxUIGV4dGVuZHMgTGlzdEtleU1hbmFnZXJPcHRpb24+IHtcbiAgcHJpdmF0ZSBfYWN0aXZlSXRlbUluZGV4ID0gLTE7XG4gIHByaXZhdGUgX2FjdGl2ZUl0ZW06IFQgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBfd3JhcCA9IGZhbHNlO1xuICBwcml2YXRlIHJlYWRvbmx5IF9sZXR0ZXJLZXlTdHJlYW0gPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XG4gIHByaXZhdGUgX3R5cGVhaGVhZFN1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgcHJpdmF0ZSBfdmVydGljYWwgPSB0cnVlO1xuICBwcml2YXRlIF9ob3Jpem9udGFsOiAnbHRyJyB8ICdydGwnIHwgbnVsbDtcbiAgcHJpdmF0ZSBfYWxsb3dlZE1vZGlmaWVyS2V5czogTGlzdEtleU1hbmFnZXJNb2RpZmllcktleVtdID0gW107XG4gIHByaXZhdGUgX2hvbWVBbmRFbmQgPSBmYWxzZTtcblxuICAvKipcbiAgICogUHJlZGljYXRlIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gY2hlY2sgd2hldGhlciBhbiBpdGVtIHNob3VsZCBiZSBza2lwcGVkXG4gICAqIGJ5IHRoZSBrZXkgbWFuYWdlci4gQnkgZGVmYXVsdCwgZGlzYWJsZWQgaXRlbXMgYXJlIHNraXBwZWQuXG4gICAqL1xuICBwcml2YXRlIF9za2lwUHJlZGljYXRlRm4gPSAoaXRlbTogVCkgPT4gaXRlbS5kaXNhYmxlZDtcblxuICAvLyBCdWZmZXIgZm9yIHRoZSBsZXR0ZXJzIHRoYXQgdGhlIHVzZXIgaGFzIHByZXNzZWQgd2hlbiB0aGUgdHlwZWFoZWFkIG9wdGlvbiBpcyB0dXJuZWQgb24uXG4gIHByaXZhdGUgX3ByZXNzZWRMZXR0ZXJzOiBzdHJpbmdbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2l0ZW1zOiBRdWVyeUxpc3Q8VD4gfCBUW10pIHtcbiAgICAvLyBXZSBhbGxvdyBmb3IgdGhlIGl0ZW1zIHRvIGJlIGFuIGFycmF5IGJlY2F1c2UsIGluIHNvbWUgY2FzZXMsIHRoZSBjb25zdW1lciBtYXlcbiAgICAvLyBub3QgaGF2ZSBhY2Nlc3MgdG8gYSBRdWVyeUxpc3Qgb2YgdGhlIGl0ZW1zIHRoZXkgd2FudCB0byBtYW5hZ2UgKGUuZy4gd2hlbiB0aGVcbiAgICAvLyBpdGVtcyBhcmVuJ3QgYmVpbmcgY29sbGVjdGVkIHZpYSBgVmlld0NoaWxkcmVuYCBvciBgQ29udGVudENoaWxkcmVuYCkuXG4gICAgaWYgKF9pdGVtcyBpbnN0YW5jZW9mIFF1ZXJ5TGlzdCkge1xuICAgICAgX2l0ZW1zLmNoYW5nZXMuc3Vic2NyaWJlKChuZXdJdGVtczogUXVlcnlMaXN0PFQ+KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLl9hY3RpdmVJdGVtKSB7XG4gICAgICAgICAgY29uc3QgaXRlbUFycmF5ID0gbmV3SXRlbXMudG9BcnJheSgpO1xuICAgICAgICAgIGNvbnN0IG5ld0luZGV4ID0gaXRlbUFycmF5LmluZGV4T2YodGhpcy5fYWN0aXZlSXRlbSk7XG5cbiAgICAgICAgICBpZiAobmV3SW5kZXggPiAtMSAmJiBuZXdJbmRleCAhPT0gdGhpcy5fYWN0aXZlSXRlbUluZGV4KSB7XG4gICAgICAgICAgICB0aGlzLl9hY3RpdmVJdGVtSW5kZXggPSBuZXdJbmRleDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTdHJlYW0gdGhhdCBlbWl0cyBhbnkgdGltZSB0aGUgVEFCIGtleSBpcyBwcmVzc2VkLCBzbyBjb21wb25lbnRzIGNhbiByZWFjdFxuICAgKiB3aGVuIGZvY3VzIGlzIHNoaWZ0ZWQgb2ZmIG9mIHRoZSBsaXN0LlxuICAgKi9cbiAgcmVhZG9ubHkgdGFiT3V0ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogU3RyZWFtIHRoYXQgZW1pdHMgd2hlbmV2ZXIgdGhlIGFjdGl2ZSBpdGVtIG9mIHRoZSBsaXN0IG1hbmFnZXIgY2hhbmdlcy4gKi9cbiAgcmVhZG9ubHkgY2hhbmdlID0gbmV3IFN1YmplY3Q8bnVtYmVyPigpO1xuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBwcmVkaWNhdGUgZnVuY3Rpb24gdGhhdCBkZXRlcm1pbmVzIHdoaWNoIGl0ZW1zIHNob3VsZCBiZSBza2lwcGVkIGJ5IHRoZVxuICAgKiBsaXN0IGtleSBtYW5hZ2VyLlxuICAgKiBAcGFyYW0gcHJlZGljYXRlIEZ1bmN0aW9uIHRoYXQgZGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBnaXZlbiBpdGVtIHNob3VsZCBiZSBza2lwcGVkLlxuICAgKi9cbiAgc2tpcFByZWRpY2F0ZShwcmVkaWNhdGU6IChpdGVtOiBUKSA9PiBib29sZWFuKTogdGhpcyB7XG4gICAgdGhpcy5fc2tpcFByZWRpY2F0ZUZuID0gcHJlZGljYXRlO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZXMgd3JhcHBpbmcgbW9kZSwgd2hpY2ggZGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBhY3RpdmUgaXRlbSB3aWxsIHdyYXAgdG9cbiAgICogdGhlIG90aGVyIGVuZCBvZiBsaXN0IHdoZW4gdGhlcmUgYXJlIG5vIG1vcmUgaXRlbXMgaW4gdGhlIGdpdmVuIGRpcmVjdGlvbi5cbiAgICogQHBhcmFtIHNob3VsZFdyYXAgV2hldGhlciB0aGUgbGlzdCBzaG91bGQgd3JhcCB3aGVuIHJlYWNoaW5nIHRoZSBlbmQuXG4gICAqL1xuICB3aXRoV3JhcChzaG91bGRXcmFwID0gdHJ1ZSk6IHRoaXMge1xuICAgIHRoaXMuX3dyYXAgPSBzaG91bGRXcmFwO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZXMgd2hldGhlciB0aGUga2V5IG1hbmFnZXIgc2hvdWxkIGJlIGFibGUgdG8gbW92ZSB0aGUgc2VsZWN0aW9uIHZlcnRpY2FsbHkuXG4gICAqIEBwYXJhbSBlbmFibGVkIFdoZXRoZXIgdmVydGljYWwgc2VsZWN0aW9uIHNob3VsZCBiZSBlbmFibGVkLlxuICAgKi9cbiAgd2l0aFZlcnRpY2FsT3JpZW50YXRpb24oZW5hYmxlZDogYm9vbGVhbiA9IHRydWUpOiB0aGlzIHtcbiAgICB0aGlzLl92ZXJ0aWNhbCA9IGVuYWJsZWQ7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQ29uZmlndXJlcyB0aGUga2V5IG1hbmFnZXIgdG8gbW92ZSB0aGUgc2VsZWN0aW9uIGhvcml6b250YWxseS5cbiAgICogUGFzc2luZyBpbiBgbnVsbGAgd2lsbCBkaXNhYmxlIGhvcml6b250YWwgbW92ZW1lbnQuXG4gICAqIEBwYXJhbSBkaXJlY3Rpb24gRGlyZWN0aW9uIGluIHdoaWNoIHRoZSBzZWxlY3Rpb24gY2FuIGJlIG1vdmVkLlxuICAgKi9cbiAgd2l0aEhvcml6b250YWxPcmllbnRhdGlvbihkaXJlY3Rpb246ICdsdHInIHwgJ3J0bCcgfCBudWxsKTogdGhpcyB7XG4gICAgdGhpcy5faG9yaXpvbnRhbCA9IGRpcmVjdGlvbjtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBNb2RpZmllciBrZXlzIHdoaWNoIGFyZSBhbGxvd2VkIHRvIGJlIGhlbGQgZG93biBhbmQgd2hvc2UgZGVmYXVsdCBhY3Rpb25zIHdpbGwgYmUgcHJldmVudGVkXG4gICAqIGFzIHRoZSB1c2VyIGlzIHByZXNzaW5nIHRoZSBhcnJvdyBrZXlzLiBEZWZhdWx0cyB0byBub3QgYWxsb3dpbmcgYW55IG1vZGlmaWVyIGtleXMuXG4gICAqL1xuICB3aXRoQWxsb3dlZE1vZGlmaWVyS2V5cyhrZXlzOiBMaXN0S2V5TWFuYWdlck1vZGlmaWVyS2V5W10pOiB0aGlzIHtcbiAgICB0aGlzLl9hbGxvd2VkTW9kaWZpZXJLZXlzID0ga2V5cztcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBUdXJucyBvbiB0eXBlYWhlYWQgbW9kZSB3aGljaCBhbGxvd3MgdXNlcnMgdG8gc2V0IHRoZSBhY3RpdmUgaXRlbSBieSB0eXBpbmcuXG4gICAqIEBwYXJhbSBkZWJvdW5jZUludGVydmFsIFRpbWUgdG8gd2FpdCBhZnRlciB0aGUgbGFzdCBrZXlzdHJva2UgYmVmb3JlIHNldHRpbmcgdGhlIGFjdGl2ZSBpdGVtLlxuICAgKi9cbiAgd2l0aFR5cGVBaGVhZChkZWJvdW5jZUludGVydmFsOiBudW1iZXIgPSAyMDApOiB0aGlzIHtcbiAgICBpZiAoXG4gICAgICAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSAmJlxuICAgICAgdGhpcy5faXRlbXMubGVuZ3RoICYmXG4gICAgICB0aGlzLl9pdGVtcy5zb21lKGl0ZW0gPT4gdHlwZW9mIGl0ZW0uZ2V0TGFiZWwgIT09ICdmdW5jdGlvbicpXG4gICAgKSB7XG4gICAgICB0aHJvdyBFcnJvcignTGlzdEtleU1hbmFnZXIgaXRlbXMgaW4gdHlwZWFoZWFkIG1vZGUgbXVzdCBpbXBsZW1lbnQgdGhlIGBnZXRMYWJlbGAgbWV0aG9kLicpO1xuICAgIH1cblxuICAgIHRoaXMuX3R5cGVhaGVhZFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuXG4gICAgLy8gRGVib3VuY2UgdGhlIHByZXNzZXMgb2Ygbm9uLW5hdmlnYXRpb25hbCBrZXlzLCBjb2xsZWN0IHRoZSBvbmVzIHRoYXQgY29ycmVzcG9uZCB0byBsZXR0ZXJzXG4gICAgLy8gYW5kIGNvbnZlcnQgdGhvc2UgbGV0dGVycyBiYWNrIGludG8gYSBzdHJpbmcuIEFmdGVyd2FyZHMgZmluZCB0aGUgZmlyc3QgaXRlbSB0aGF0IHN0YXJ0c1xuICAgIC8vIHdpdGggdGhhdCBzdHJpbmcgYW5kIHNlbGVjdCBpdC5cbiAgICB0aGlzLl90eXBlYWhlYWRTdWJzY3JpcHRpb24gPSB0aGlzLl9sZXR0ZXJLZXlTdHJlYW1cbiAgICAgIC5waXBlKFxuICAgICAgICB0YXAobGV0dGVyID0+IHRoaXMuX3ByZXNzZWRMZXR0ZXJzLnB1c2gobGV0dGVyKSksXG4gICAgICAgIGRlYm91bmNlVGltZShkZWJvdW5jZUludGVydmFsKSxcbiAgICAgICAgZmlsdGVyKCgpID0+IHRoaXMuX3ByZXNzZWRMZXR0ZXJzLmxlbmd0aCA+IDApLFxuICAgICAgICBtYXAoKCkgPT4gdGhpcy5fcHJlc3NlZExldHRlcnMuam9pbignJykpLFxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZShpbnB1dFN0cmluZyA9PiB7XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5fZ2V0SXRlbXNBcnJheSgpO1xuXG4gICAgICAgIC8vIFN0YXJ0IGF0IDEgYmVjYXVzZSB3ZSB3YW50IHRvIHN0YXJ0IHNlYXJjaGluZyBhdCB0aGUgaXRlbSBpbW1lZGlhdGVseVxuICAgICAgICAvLyBmb2xsb3dpbmcgdGhlIGN1cnJlbnQgYWN0aXZlIGl0ZW0uXG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgaXRlbXMubGVuZ3RoICsgMTsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgaW5kZXggPSAodGhpcy5fYWN0aXZlSXRlbUluZGV4ICsgaSkgJSBpdGVtcy5sZW5ndGg7XG4gICAgICAgICAgY29uc3QgaXRlbSA9IGl0ZW1zW2luZGV4XTtcblxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICF0aGlzLl9za2lwUHJlZGljYXRlRm4oaXRlbSkgJiZcbiAgICAgICAgICAgIGl0ZW0uZ2V0TGFiZWwhKCkudG9VcHBlckNhc2UoKS50cmltKCkuaW5kZXhPZihpbnB1dFN0cmluZykgPT09IDBcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMuc2V0QWN0aXZlSXRlbShpbmRleCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9wcmVzc2VkTGV0dGVycyA9IFtdO1xuICAgICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25maWd1cmVzIHRoZSBrZXkgbWFuYWdlciB0byBhY3RpdmF0ZSB0aGUgZmlyc3QgYW5kIGxhc3QgaXRlbXNcbiAgICogcmVzcGVjdGl2ZWx5IHdoZW4gdGhlIEhvbWUgb3IgRW5kIGtleSBpcyBwcmVzc2VkLlxuICAgKiBAcGFyYW0gZW5hYmxlZCBXaGV0aGVyIHByZXNzaW5nIHRoZSBIb21lIG9yIEVuZCBrZXkgYWN0aXZhdGVzIHRoZSBmaXJzdC9sYXN0IGl0ZW0uXG4gICAqL1xuICB3aXRoSG9tZUFuZEVuZChlbmFibGVkOiBib29sZWFuID0gdHJ1ZSk6IHRoaXMge1xuICAgIHRoaXMuX2hvbWVBbmRFbmQgPSBlbmFibGVkO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGFjdGl2ZSBpdGVtIHRvIHRoZSBpdGVtIGF0IHRoZSBpbmRleCBzcGVjaWZpZWQuXG4gICAqIEBwYXJhbSBpbmRleCBUaGUgaW5kZXggb2YgdGhlIGl0ZW0gdG8gYmUgc2V0IGFzIGFjdGl2ZS5cbiAgICovXG4gIHNldEFjdGl2ZUl0ZW0oaW5kZXg6IG51bWJlcik6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGFjdGl2ZSBpdGVtIHRvIHRoZSBzcGVjaWZpZWQgaXRlbS5cbiAgICogQHBhcmFtIGl0ZW0gVGhlIGl0ZW0gdG8gYmUgc2V0IGFzIGFjdGl2ZS5cbiAgICovXG4gIHNldEFjdGl2ZUl0ZW0oaXRlbTogVCk6IHZvaWQ7XG5cbiAgc2V0QWN0aXZlSXRlbShpdGVtOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBwcmV2aW91c0FjdGl2ZUl0ZW0gPSB0aGlzLl9hY3RpdmVJdGVtO1xuXG4gICAgdGhpcy51cGRhdGVBY3RpdmVJdGVtKGl0ZW0pO1xuXG4gICAgaWYgKHRoaXMuX2FjdGl2ZUl0ZW0gIT09IHByZXZpb3VzQWN0aXZlSXRlbSkge1xuICAgICAgdGhpcy5jaGFuZ2UubmV4dCh0aGlzLl9hY3RpdmVJdGVtSW5kZXgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBhY3RpdmUgaXRlbSBkZXBlbmRpbmcgb24gdGhlIGtleSBldmVudCBwYXNzZWQgaW4uXG4gICAqIEBwYXJhbSBldmVudCBLZXlib2FyZCBldmVudCB0byBiZSB1c2VkIGZvciBkZXRlcm1pbmluZyB3aGljaCBlbGVtZW50IHNob3VsZCBiZSBhY3RpdmUuXG4gICAqL1xuICBvbktleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCBrZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcbiAgICBjb25zdCBtb2RpZmllcnM6IExpc3RLZXlNYW5hZ2VyTW9kaWZpZXJLZXlbXSA9IFsnYWx0S2V5JywgJ2N0cmxLZXknLCAnbWV0YUtleScsICdzaGlmdEtleSddO1xuICAgIGNvbnN0IGlzTW9kaWZpZXJBbGxvd2VkID0gbW9kaWZpZXJzLmV2ZXJ5KG1vZGlmaWVyID0+IHtcbiAgICAgIHJldHVybiAhZXZlbnRbbW9kaWZpZXJdIHx8IHRoaXMuX2FsbG93ZWRNb2RpZmllcktleXMuaW5kZXhPZihtb2RpZmllcikgPiAtMTtcbiAgICB9KTtcblxuICAgIHN3aXRjaCAoa2V5Q29kZSkge1xuICAgICAgY2FzZSBUQUI6XG4gICAgICAgIHRoaXMudGFiT3V0Lm5leHQoKTtcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBjYXNlIERPV05fQVJST1c6XG4gICAgICAgIGlmICh0aGlzLl92ZXJ0aWNhbCAmJiBpc01vZGlmaWVyQWxsb3dlZCkge1xuICAgICAgICAgIHRoaXMuc2V0TmV4dEl0ZW1BY3RpdmUoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgY2FzZSBVUF9BUlJPVzpcbiAgICAgICAgaWYgKHRoaXMuX3ZlcnRpY2FsICYmIGlzTW9kaWZpZXJBbGxvd2VkKSB7XG4gICAgICAgICAgdGhpcy5zZXRQcmV2aW91c0l0ZW1BY3RpdmUoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgY2FzZSBSSUdIVF9BUlJPVzpcbiAgICAgICAgaWYgKHRoaXMuX2hvcml6b250YWwgJiYgaXNNb2RpZmllckFsbG93ZWQpIHtcbiAgICAgICAgICB0aGlzLl9ob3Jpem9udGFsID09PSAncnRsJyA/IHRoaXMuc2V0UHJldmlvdXNJdGVtQWN0aXZlKCkgOiB0aGlzLnNldE5leHRJdGVtQWN0aXZlKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgIGNhc2UgTEVGVF9BUlJPVzpcbiAgICAgICAgaWYgKHRoaXMuX2hvcml6b250YWwgJiYgaXNNb2RpZmllckFsbG93ZWQpIHtcbiAgICAgICAgICB0aGlzLl9ob3Jpem9udGFsID09PSAncnRsJyA/IHRoaXMuc2V0TmV4dEl0ZW1BY3RpdmUoKSA6IHRoaXMuc2V0UHJldmlvdXNJdGVtQWN0aXZlKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgIGNhc2UgSE9NRTpcbiAgICAgICAgaWYgKHRoaXMuX2hvbWVBbmRFbmQgJiYgaXNNb2RpZmllckFsbG93ZWQpIHtcbiAgICAgICAgICB0aGlzLnNldEZpcnN0SXRlbUFjdGl2ZSgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICBjYXNlIEVORDpcbiAgICAgICAgaWYgKHRoaXMuX2hvbWVBbmRFbmQgJiYgaXNNb2RpZmllckFsbG93ZWQpIHtcbiAgICAgICAgICB0aGlzLnNldExhc3RJdGVtQWN0aXZlKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChpc01vZGlmaWVyQWxsb3dlZCB8fCBoYXNNb2RpZmllcktleShldmVudCwgJ3NoaWZ0S2V5JykpIHtcbiAgICAgICAgICAvLyBBdHRlbXB0IHRvIHVzZSB0aGUgYGV2ZW50LmtleWAgd2hpY2ggYWxzbyBtYXBzIGl0IHRvIHRoZSB1c2VyJ3Mga2V5Ym9hcmQgbGFuZ3VhZ2UsXG4gICAgICAgICAgLy8gb3RoZXJ3aXNlIGZhbGwgYmFjayB0byByZXNvbHZpbmcgYWxwaGFudW1lcmljIGNoYXJhY3RlcnMgdmlhIHRoZSBrZXlDb2RlLlxuICAgICAgICAgIGlmIChldmVudC5rZXkgJiYgZXZlbnQua2V5Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgdGhpcy5fbGV0dGVyS2V5U3RyZWFtLm5leHQoZXZlbnQua2V5LnRvTG9jYWxlVXBwZXJDYXNlKCkpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoKGtleUNvZGUgPj0gQSAmJiBrZXlDb2RlIDw9IFopIHx8IChrZXlDb2RlID49IFpFUk8gJiYga2V5Q29kZSA8PSBOSU5FKSkge1xuICAgICAgICAgICAgdGhpcy5fbGV0dGVyS2V5U3RyZWFtLm5leHQoU3RyaW5nLmZyb21DaGFyQ29kZShrZXlDb2RlKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gTm90ZSB0aGF0IHdlIHJldHVybiBoZXJlLCBpbiBvcmRlciB0byBhdm9pZCBwcmV2ZW50aW5nXG4gICAgICAgIC8vIHRoZSBkZWZhdWx0IGFjdGlvbiBvZiBub24tbmF2aWdhdGlvbmFsIGtleXMuXG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9wcmVzc2VkTGV0dGVycyA9IFtdO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH1cblxuICAvKiogSW5kZXggb2YgdGhlIGN1cnJlbnRseSBhY3RpdmUgaXRlbS4gKi9cbiAgZ2V0IGFjdGl2ZUl0ZW1JbmRleCgpOiBudW1iZXIgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fYWN0aXZlSXRlbUluZGV4O1xuICB9XG5cbiAgLyoqIFRoZSBhY3RpdmUgaXRlbS4gKi9cbiAgZ2V0IGFjdGl2ZUl0ZW0oKTogVCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9hY3RpdmVJdGVtO1xuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciB0aGUgdXNlciBpcyBjdXJyZW50bHkgdHlwaW5nIGludG8gdGhlIG1hbmFnZXIgdXNpbmcgdGhlIHR5cGVhaGVhZCBmZWF0dXJlLiAqL1xuICBpc1R5cGluZygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fcHJlc3NlZExldHRlcnMubGVuZ3RoID4gMDtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBhY3RpdmUgaXRlbSB0byB0aGUgZmlyc3QgZW5hYmxlZCBpdGVtIGluIHRoZSBsaXN0LiAqL1xuICBzZXRGaXJzdEl0ZW1BY3RpdmUoKTogdm9pZCB7XG4gICAgdGhpcy5fc2V0QWN0aXZlSXRlbUJ5SW5kZXgoMCwgMSk7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgYWN0aXZlIGl0ZW0gdG8gdGhlIGxhc3QgZW5hYmxlZCBpdGVtIGluIHRoZSBsaXN0LiAqL1xuICBzZXRMYXN0SXRlbUFjdGl2ZSgpOiB2b2lkIHtcbiAgICB0aGlzLl9zZXRBY3RpdmVJdGVtQnlJbmRleCh0aGlzLl9pdGVtcy5sZW5ndGggLSAxLCAtMSk7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgYWN0aXZlIGl0ZW0gdG8gdGhlIG5leHQgZW5hYmxlZCBpdGVtIGluIHRoZSBsaXN0LiAqL1xuICBzZXROZXh0SXRlbUFjdGl2ZSgpOiB2b2lkIHtcbiAgICB0aGlzLl9hY3RpdmVJdGVtSW5kZXggPCAwID8gdGhpcy5zZXRGaXJzdEl0ZW1BY3RpdmUoKSA6IHRoaXMuX3NldEFjdGl2ZUl0ZW1CeURlbHRhKDEpO1xuICB9XG5cbiAgLyoqIFNldHMgdGhlIGFjdGl2ZSBpdGVtIHRvIGEgcHJldmlvdXMgZW5hYmxlZCBpdGVtIGluIHRoZSBsaXN0LiAqL1xuICBzZXRQcmV2aW91c0l0ZW1BY3RpdmUoKTogdm9pZCB7XG4gICAgdGhpcy5fYWN0aXZlSXRlbUluZGV4IDwgMCAmJiB0aGlzLl93cmFwXG4gICAgICA/IHRoaXMuc2V0TGFzdEl0ZW1BY3RpdmUoKVxuICAgICAgOiB0aGlzLl9zZXRBY3RpdmVJdGVtQnlEZWx0YSgtMSk7XG4gIH1cblxuICAvKipcbiAgICogQWxsb3dzIHNldHRpbmcgdGhlIGFjdGl2ZSB3aXRob3V0IGFueSBvdGhlciBlZmZlY3RzLlxuICAgKiBAcGFyYW0gaW5kZXggSW5kZXggb2YgdGhlIGl0ZW0gdG8gYmUgc2V0IGFzIGFjdGl2ZS5cbiAgICovXG4gIHVwZGF0ZUFjdGl2ZUl0ZW0oaW5kZXg6IG51bWJlcik6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEFsbG93cyBzZXR0aW5nIHRoZSBhY3RpdmUgaXRlbSB3aXRob3V0IGFueSBvdGhlciBlZmZlY3RzLlxuICAgKiBAcGFyYW0gaXRlbSBJdGVtIHRvIGJlIHNldCBhcyBhY3RpdmUuXG4gICAqL1xuICB1cGRhdGVBY3RpdmVJdGVtKGl0ZW06IFQpOiB2b2lkO1xuXG4gIHVwZGF0ZUFjdGl2ZUl0ZW0oaXRlbTogYW55KTogdm9pZCB7XG4gICAgY29uc3QgaXRlbUFycmF5ID0gdGhpcy5fZ2V0SXRlbXNBcnJheSgpO1xuICAgIGNvbnN0IGluZGV4ID0gdHlwZW9mIGl0ZW0gPT09ICdudW1iZXInID8gaXRlbSA6IGl0ZW1BcnJheS5pbmRleE9mKGl0ZW0pO1xuICAgIGNvbnN0IGFjdGl2ZUl0ZW0gPSBpdGVtQXJyYXlbaW5kZXhdO1xuXG4gICAgLy8gRXhwbGljaXRseSBjaGVjayBmb3IgYG51bGxgIGFuZCBgdW5kZWZpbmVkYCBiZWNhdXNlIG90aGVyIGZhbHN5IHZhbHVlcyBhcmUgdmFsaWQuXG4gICAgdGhpcy5fYWN0aXZlSXRlbSA9IGFjdGl2ZUl0ZW0gPT0gbnVsbCA/IG51bGwgOiBhY3RpdmVJdGVtO1xuICAgIHRoaXMuX2FjdGl2ZUl0ZW1JbmRleCA9IGluZGV4O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHNldHMgdGhlIGFjdGl2ZSBpdGVtLCBnaXZlbiBhIGxpc3Qgb2YgaXRlbXMgYW5kIHRoZSBkZWx0YSBiZXR3ZWVuIHRoZVxuICAgKiBjdXJyZW50bHkgYWN0aXZlIGl0ZW0gYW5kIHRoZSBuZXcgYWN0aXZlIGl0ZW0uIEl0IHdpbGwgY2FsY3VsYXRlIGRpZmZlcmVudGx5XG4gICAqIGRlcGVuZGluZyBvbiB3aGV0aGVyIHdyYXAgbW9kZSBpcyB0dXJuZWQgb24uXG4gICAqL1xuICBwcml2YXRlIF9zZXRBY3RpdmVJdGVtQnlEZWx0YShkZWx0YTogLTEgfCAxKTogdm9pZCB7XG4gICAgdGhpcy5fd3JhcCA/IHRoaXMuX3NldEFjdGl2ZUluV3JhcE1vZGUoZGVsdGEpIDogdGhpcy5fc2V0QWN0aXZlSW5EZWZhdWx0TW9kZShkZWx0YSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgYWN0aXZlIGl0ZW0gcHJvcGVybHkgZ2l2ZW4gXCJ3cmFwXCIgbW9kZS4gSW4gb3RoZXIgd29yZHMsIGl0IHdpbGwgY29udGludWUgdG8gbW92ZVxuICAgKiBkb3duIHRoZSBsaXN0IHVudGlsIGl0IGZpbmRzIGFuIGl0ZW0gdGhhdCBpcyBub3QgZGlzYWJsZWQsIGFuZCBpdCB3aWxsIHdyYXAgaWYgaXRcbiAgICogZW5jb3VudGVycyBlaXRoZXIgZW5kIG9mIHRoZSBsaXN0LlxuICAgKi9cbiAgcHJpdmF0ZSBfc2V0QWN0aXZlSW5XcmFwTW9kZShkZWx0YTogLTEgfCAxKTogdm9pZCB7XG4gICAgY29uc3QgaXRlbXMgPSB0aGlzLl9nZXRJdGVtc0FycmF5KCk7XG5cbiAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBpdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgaW5kZXggPSAodGhpcy5fYWN0aXZlSXRlbUluZGV4ICsgZGVsdGEgKiBpICsgaXRlbXMubGVuZ3RoKSAlIGl0ZW1zLmxlbmd0aDtcbiAgICAgIGNvbnN0IGl0ZW0gPSBpdGVtc1tpbmRleF07XG5cbiAgICAgIGlmICghdGhpcy5fc2tpcFByZWRpY2F0ZUZuKGl0ZW0pKSB7XG4gICAgICAgIHRoaXMuc2V0QWN0aXZlSXRlbShpbmRleCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgYWN0aXZlIGl0ZW0gcHJvcGVybHkgZ2l2ZW4gdGhlIGRlZmF1bHQgbW9kZS4gSW4gb3RoZXIgd29yZHMsIGl0IHdpbGxcbiAgICogY29udGludWUgdG8gbW92ZSBkb3duIHRoZSBsaXN0IHVudGlsIGl0IGZpbmRzIGFuIGl0ZW0gdGhhdCBpcyBub3QgZGlzYWJsZWQuIElmXG4gICAqIGl0IGVuY291bnRlcnMgZWl0aGVyIGVuZCBvZiB0aGUgbGlzdCwgaXQgd2lsbCBzdG9wIGFuZCBub3Qgd3JhcC5cbiAgICovXG4gIHByaXZhdGUgX3NldEFjdGl2ZUluRGVmYXVsdE1vZGUoZGVsdGE6IC0xIHwgMSk6IHZvaWQge1xuICAgIHRoaXMuX3NldEFjdGl2ZUl0ZW1CeUluZGV4KHRoaXMuX2FjdGl2ZUl0ZW1JbmRleCArIGRlbHRhLCBkZWx0YSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgYWN0aXZlIGl0ZW0gdG8gdGhlIGZpcnN0IGVuYWJsZWQgaXRlbSBzdGFydGluZyBhdCB0aGUgaW5kZXggc3BlY2lmaWVkLiBJZiB0aGVcbiAgICogaXRlbSBpcyBkaXNhYmxlZCwgaXQgd2lsbCBtb3ZlIGluIHRoZSBmYWxsYmFja0RlbHRhIGRpcmVjdGlvbiB1bnRpbCBpdCBlaXRoZXJcbiAgICogZmluZHMgYW4gZW5hYmxlZCBpdGVtIG9yIGVuY291bnRlcnMgdGhlIGVuZCBvZiB0aGUgbGlzdC5cbiAgICovXG4gIHByaXZhdGUgX3NldEFjdGl2ZUl0ZW1CeUluZGV4KGluZGV4OiBudW1iZXIsIGZhbGxiYWNrRGVsdGE6IC0xIHwgMSk6IHZvaWQge1xuICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5fZ2V0SXRlbXNBcnJheSgpO1xuXG4gICAgaWYgKCFpdGVtc1tpbmRleF0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB3aGlsZSAodGhpcy5fc2tpcFByZWRpY2F0ZUZuKGl0ZW1zW2luZGV4XSkpIHtcbiAgICAgIGluZGV4ICs9IGZhbGxiYWNrRGVsdGE7XG5cbiAgICAgIGlmICghaXRlbXNbaW5kZXhdKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNldEFjdGl2ZUl0ZW0oaW5kZXgpO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIGl0ZW1zIGFzIGFuIGFycmF5LiAqL1xuICBwcml2YXRlIF9nZXRJdGVtc0FycmF5KCk6IFRbXSB7XG4gICAgcmV0dXJuIHRoaXMuX2l0ZW1zIGluc3RhbmNlb2YgUXVlcnlMaXN0ID8gdGhpcy5faXRlbXMudG9BcnJheSgpIDogdGhpcy5faXRlbXM7XG4gIH1cbn1cbiJdfQ==