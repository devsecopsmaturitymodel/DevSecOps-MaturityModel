/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable, NgZone, InjectionToken } from '@angular/core';
import { from, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import * as i0 from "@angular/core";
/**
 * @docs-private
 */
export class _Schedule {
    constructor() {
        this.tasks = [];
        this.endTasks = [];
    }
}
/** Injection token used to provide a coalesced style scheduler. */
export const _COALESCED_STYLE_SCHEDULER = new InjectionToken('_COALESCED_STYLE_SCHEDULER');
/**
 * Allows grouping up CSSDom mutations after the current execution context.
 * This can significantly improve performance when separate consecutive functions are
 * reading from the CSSDom and then mutating it.
 *
 * @docs-private
 */
export class _CoalescedStyleScheduler {
    constructor(_ngZone) {
        this._ngZone = _ngZone;
        this._currentSchedule = null;
        this._destroyed = new Subject();
    }
    /**
     * Schedules the specified task to run at the end of the current VM turn.
     */
    schedule(task) {
        this._createScheduleIfNeeded();
        this._currentSchedule.tasks.push(task);
    }
    /**
     * Schedules the specified task to run after other scheduled tasks at the end of the current
     * VM turn.
     */
    scheduleEnd(task) {
        this._createScheduleIfNeeded();
        this._currentSchedule.endTasks.push(task);
    }
    /** Prevent any further tasks from running. */
    ngOnDestroy() {
        this._destroyed.next();
        this._destroyed.complete();
    }
    _createScheduleIfNeeded() {
        if (this._currentSchedule) {
            return;
        }
        this._currentSchedule = new _Schedule();
        this._getScheduleObservable()
            .pipe(takeUntil(this._destroyed))
            .subscribe(() => {
            while (this._currentSchedule.tasks.length || this._currentSchedule.endTasks.length) {
                const schedule = this._currentSchedule;
                // Capture new tasks scheduled by the current set of tasks.
                this._currentSchedule = new _Schedule();
                for (const task of schedule.tasks) {
                    task();
                }
                for (const task of schedule.endTasks) {
                    task();
                }
            }
            this._currentSchedule = null;
        });
    }
    _getScheduleObservable() {
        // Use onStable when in the context of an ongoing change detection cycle so that we
        // do not accidentally trigger additional cycles.
        return this._ngZone.isStable
            ? from(Promise.resolve(undefined))
            : this._ngZone.onStable.pipe(take(1));
    }
}
_CoalescedStyleScheduler.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _CoalescedStyleScheduler, deps: [{ token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Injectable });
_CoalescedStyleScheduler.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _CoalescedStyleScheduler });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _CoalescedStyleScheduler, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i0.NgZone }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29hbGVzY2VkLXN0eWxlLXNjaGVkdWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvdGFibGUvY29hbGVzY2VkLXN0eWxlLXNjaGVkdWxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBYSxjQUFjLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDNUUsT0FBTyxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDbkMsT0FBTyxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7QUFFL0M7O0dBRUc7QUFDSCxNQUFNLE9BQU8sU0FBUztJQUF0QjtRQUNFLFVBQUssR0FBc0IsRUFBRSxDQUFDO1FBQzlCLGFBQVEsR0FBc0IsRUFBRSxDQUFDO0lBQ25DLENBQUM7Q0FBQTtBQUVELG1FQUFtRTtBQUNuRSxNQUFNLENBQUMsTUFBTSwwQkFBMEIsR0FBRyxJQUFJLGNBQWMsQ0FDMUQsNEJBQTRCLENBQzdCLENBQUM7QUFFRjs7Ozs7O0dBTUc7QUFFSCxNQUFNLE9BQU8sd0JBQXdCO0lBSW5DLFlBQTZCLE9BQWU7UUFBZixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBSHBDLHFCQUFnQixHQUFxQixJQUFJLENBQUM7UUFDakMsZUFBVSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7SUFFSCxDQUFDO0lBRWhEOztPQUVHO0lBQ0gsUUFBUSxDQUFDLElBQW1CO1FBQzFCLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1FBRS9CLElBQUksQ0FBQyxnQkFBaUIsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRDs7O09BR0c7SUFDSCxXQUFXLENBQUMsSUFBbUI7UUFDN0IsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7UUFFL0IsSUFBSSxDQUFDLGdCQUFpQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVELDhDQUE4QztJQUM5QyxXQUFXO1FBQ1QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFTyx1QkFBdUI7UUFDN0IsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDekIsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7UUFFeEMsSUFBSSxDQUFDLHNCQUFzQixFQUFFO2FBQzFCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQ2hDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7WUFDZCxPQUFPLElBQUksQ0FBQyxnQkFBaUIsQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxnQkFBaUIsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFO2dCQUNwRixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsZ0JBQWlCLENBQUM7Z0JBRXhDLDJEQUEyRDtnQkFDM0QsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7Z0JBRXhDLEtBQUssTUFBTSxJQUFJLElBQUksUUFBUSxDQUFDLEtBQUssRUFBRTtvQkFDakMsSUFBSSxFQUFFLENBQUM7aUJBQ1I7Z0JBRUQsS0FBSyxNQUFNLElBQUksSUFBSSxRQUFRLENBQUMsUUFBUSxFQUFFO29CQUNwQyxJQUFJLEVBQUUsQ0FBQztpQkFDUjthQUNGO1lBRUQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztRQUMvQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTyxzQkFBc0I7UUFDNUIsbUZBQW1GO1FBQ25GLGlEQUFpRDtRQUNqRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUTtZQUMxQixDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQyxDQUFDOztxSEFsRVUsd0JBQXdCO3lIQUF4Qix3QkFBd0I7MkZBQXhCLHdCQUF3QjtrQkFEcEMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGUsIE5nWm9uZSwgT25EZXN0cm95LCBJbmplY3Rpb25Ub2tlbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2Zyb20sIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHt0YWtlLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuLyoqXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjbGFzcyBfU2NoZWR1bGUge1xuICB0YXNrczogKCgpID0+IHVua25vd24pW10gPSBbXTtcbiAgZW5kVGFza3M6ICgoKSA9PiB1bmtub3duKVtdID0gW107XG59XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdXNlZCB0byBwcm92aWRlIGEgY29hbGVzY2VkIHN0eWxlIHNjaGVkdWxlci4gKi9cbmV4cG9ydCBjb25zdCBfQ09BTEVTQ0VEX1NUWUxFX1NDSEVEVUxFUiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxfQ29hbGVzY2VkU3R5bGVTY2hlZHVsZXI+KFxuICAnX0NPQUxFU0NFRF9TVFlMRV9TQ0hFRFVMRVInLFxuKTtcblxuLyoqXG4gKiBBbGxvd3MgZ3JvdXBpbmcgdXAgQ1NTRG9tIG11dGF0aW9ucyBhZnRlciB0aGUgY3VycmVudCBleGVjdXRpb24gY29udGV4dC5cbiAqIFRoaXMgY2FuIHNpZ25pZmljYW50bHkgaW1wcm92ZSBwZXJmb3JtYW5jZSB3aGVuIHNlcGFyYXRlIGNvbnNlY3V0aXZlIGZ1bmN0aW9ucyBhcmVcbiAqIHJlYWRpbmcgZnJvbSB0aGUgQ1NTRG9tIGFuZCB0aGVuIG11dGF0aW5nIGl0LlxuICpcbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIF9Db2FsZXNjZWRTdHlsZVNjaGVkdWxlciBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2N1cnJlbnRTY2hlZHVsZTogX1NjaGVkdWxlIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBfbmdab25lOiBOZ1pvbmUpIHt9XG5cbiAgLyoqXG4gICAqIFNjaGVkdWxlcyB0aGUgc3BlY2lmaWVkIHRhc2sgdG8gcnVuIGF0IHRoZSBlbmQgb2YgdGhlIGN1cnJlbnQgVk0gdHVybi5cbiAgICovXG4gIHNjaGVkdWxlKHRhc2s6ICgpID0+IHVua25vd24pOiB2b2lkIHtcbiAgICB0aGlzLl9jcmVhdGVTY2hlZHVsZUlmTmVlZGVkKCk7XG5cbiAgICB0aGlzLl9jdXJyZW50U2NoZWR1bGUhLnRhc2tzLnB1c2godGFzayk7XG4gIH1cblxuICAvKipcbiAgICogU2NoZWR1bGVzIHRoZSBzcGVjaWZpZWQgdGFzayB0byBydW4gYWZ0ZXIgb3RoZXIgc2NoZWR1bGVkIHRhc2tzIGF0IHRoZSBlbmQgb2YgdGhlIGN1cnJlbnRcbiAgICogVk0gdHVybi5cbiAgICovXG4gIHNjaGVkdWxlRW5kKHRhc2s6ICgpID0+IHVua25vd24pOiB2b2lkIHtcbiAgICB0aGlzLl9jcmVhdGVTY2hlZHVsZUlmTmVlZGVkKCk7XG5cbiAgICB0aGlzLl9jdXJyZW50U2NoZWR1bGUhLmVuZFRhc2tzLnB1c2godGFzayk7XG4gIH1cblxuICAvKiogUHJldmVudCBhbnkgZnVydGhlciB0YXNrcyBmcm9tIHJ1bm5pbmcuICovXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5uZXh0KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLmNvbXBsZXRlKCk7XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVTY2hlZHVsZUlmTmVlZGVkKCkge1xuICAgIGlmICh0aGlzLl9jdXJyZW50U2NoZWR1bGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9jdXJyZW50U2NoZWR1bGUgPSBuZXcgX1NjaGVkdWxlKCk7XG5cbiAgICB0aGlzLl9nZXRTY2hlZHVsZU9ic2VydmFibGUoKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgd2hpbGUgKHRoaXMuX2N1cnJlbnRTY2hlZHVsZSEudGFza3MubGVuZ3RoIHx8IHRoaXMuX2N1cnJlbnRTY2hlZHVsZSEuZW5kVGFza3MubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc3Qgc2NoZWR1bGUgPSB0aGlzLl9jdXJyZW50U2NoZWR1bGUhO1xuXG4gICAgICAgICAgLy8gQ2FwdHVyZSBuZXcgdGFza3Mgc2NoZWR1bGVkIGJ5IHRoZSBjdXJyZW50IHNldCBvZiB0YXNrcy5cbiAgICAgICAgICB0aGlzLl9jdXJyZW50U2NoZWR1bGUgPSBuZXcgX1NjaGVkdWxlKCk7XG5cbiAgICAgICAgICBmb3IgKGNvbnN0IHRhc2sgb2Ygc2NoZWR1bGUudGFza3MpIHtcbiAgICAgICAgICAgIHRhc2soKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmb3IgKGNvbnN0IHRhc2sgb2Ygc2NoZWR1bGUuZW5kVGFza3MpIHtcbiAgICAgICAgICAgIHRhc2soKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9jdXJyZW50U2NoZWR1bGUgPSBudWxsO1xuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9nZXRTY2hlZHVsZU9ic2VydmFibGUoKSB7XG4gICAgLy8gVXNlIG9uU3RhYmxlIHdoZW4gaW4gdGhlIGNvbnRleHQgb2YgYW4gb25nb2luZyBjaGFuZ2UgZGV0ZWN0aW9uIGN5Y2xlIHNvIHRoYXQgd2VcbiAgICAvLyBkbyBub3QgYWNjaWRlbnRhbGx5IHRyaWdnZXIgYWRkaXRpb25hbCBjeWNsZXMuXG4gICAgcmV0dXJuIHRoaXMuX25nWm9uZS5pc1N0YWJsZVxuICAgICAgPyBmcm9tKFByb21pc2UucmVzb2x2ZSh1bmRlZmluZWQpKVxuICAgICAgOiB0aGlzLl9uZ1pvbmUub25TdGFibGUucGlwZSh0YWtlKDEpKTtcbiAgfVxufVxuIl19