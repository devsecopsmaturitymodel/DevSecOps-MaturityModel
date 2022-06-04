/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { EventEmitter, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { CdkAccordion } from './accordion';
import { BooleanInput } from '@angular/cdk/coercion';
import * as i0 from "@angular/core";
/**
 * An basic directive expected to be extended and decorated as a component.  Sets up all
 * events and attributes needed to be managed by a CdkAccordion parent.
 */
export declare class CdkAccordionItem implements OnDestroy {
    accordion: CdkAccordion;
    private _changeDetectorRef;
    protected _expansionDispatcher: UniqueSelectionDispatcher;
    /** Subscription to openAll/closeAll events. */
    private _openCloseAllSubscription;
    /** Event emitted every time the AccordionItem is closed. */
    readonly closed: EventEmitter<void>;
    /** Event emitted every time the AccordionItem is opened. */
    readonly opened: EventEmitter<void>;
    /** Event emitted when the AccordionItem is destroyed. */
    readonly destroyed: EventEmitter<void>;
    /**
     * Emits whenever the expanded state of the accordion changes.
     * Primarily used to facilitate two-way binding.
     * @docs-private
     */
    readonly expandedChange: EventEmitter<boolean>;
    /** The unique AccordionItem id. */
    readonly id: string;
    /** Whether the AccordionItem is expanded. */
    get expanded(): boolean;
    set expanded(expanded: BooleanInput);
    private _expanded;
    /** Whether the AccordionItem is disabled. */
    get disabled(): boolean;
    set disabled(disabled: BooleanInput);
    private _disabled;
    /** Unregister function for _expansionDispatcher. */
    private _removeUniqueSelectionListener;
    constructor(accordion: CdkAccordion, _changeDetectorRef: ChangeDetectorRef, _expansionDispatcher: UniqueSelectionDispatcher);
    /** Emits an event for the accordion item being destroyed. */
    ngOnDestroy(): void;
    /** Toggles the expanded state of the accordion item. */
    toggle(): void;
    /** Sets the expanded state of the accordion item to false. */
    close(): void;
    /** Sets the expanded state of the accordion item to true. */
    open(): void;
    private _subscribeToOpenCloseAllActions;
    static ɵfac: i0.ɵɵFactoryDeclaration<CdkAccordionItem, [{ optional: true; skipSelf: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<CdkAccordionItem, "cdk-accordion-item, [cdkAccordionItem]", ["cdkAccordionItem"], { "expanded": "expanded"; "disabled": "disabled"; }, { "closed": "closed"; "opened": "opened"; "destroyed": "destroyed"; "expandedChange": "expandedChange"; }, never>;
}
