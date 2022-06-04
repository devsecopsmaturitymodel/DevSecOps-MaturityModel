/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgZone, OnDestroy, InjectionToken } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * @docs-private
 */
export declare class _Schedule {
    tasks: (() => unknown)[];
    endTasks: (() => unknown)[];
}
/** Injection token used to provide a coalesced style scheduler. */
export declare const _COALESCED_STYLE_SCHEDULER: InjectionToken<_CoalescedStyleScheduler>;
/**
 * Allows grouping up CSSDom mutations after the current execution context.
 * This can significantly improve performance when separate consecutive functions are
 * reading from the CSSDom and then mutating it.
 *
 * @docs-private
 */
export declare class _CoalescedStyleScheduler implements OnDestroy {
    private readonly _ngZone;
    private _currentSchedule;
    private readonly _destroyed;
    constructor(_ngZone: NgZone);
    /**
     * Schedules the specified task to run at the end of the current VM turn.
     */
    schedule(task: () => unknown): void;
    /**
     * Schedules the specified task to run after other scheduled tasks at the end of the current
     * VM turn.
     */
    scheduleEnd(task: () => unknown): void;
    /** Prevent any further tasks from running. */
    ngOnDestroy(): void;
    private _createScheduleIfNeeded;
    private _getScheduleObservable;
    static ɵfac: i0.ɵɵFactoryDeclaration<_CoalescedStyleScheduler, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<_CoalescedStyleScheduler>;
}
