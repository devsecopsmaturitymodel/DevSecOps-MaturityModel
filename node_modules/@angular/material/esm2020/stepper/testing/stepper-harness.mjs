/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatStepHarness } from './step-harness';
/** Harness for interacting with a standard Material stepper in tests. */
export class MatStepperHarness extends ComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatStepperHarness` that meets
     * certain criteria.
     * @param options Options for filtering which stepper instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatStepperHarness, options).addOption('orientation', options.orientation, async (harness, orientation) => (await harness.getOrientation()) === orientation);
    }
    /**
     * Gets the list of steps in the stepper.
     * @param filter Optionally filters which steps are included.
     */
    async getSteps(filter = {}) {
        return this.locatorForAll(MatStepHarness.with(filter))();
    }
    /** Gets the orientation of the stepper. */
    async getOrientation() {
        const host = await this.host();
        return (await host.hasClass('mat-stepper-horizontal'))
            ? 0 /* HORIZONTAL */
            : 1 /* VERTICAL */;
    }
    /**
     * Selects a step in this stepper.
     * @param filter An optional filter to apply to the child steps. The first step matching the
     *    filter will be selected.
     */
    async selectStep(filter = {}) {
        const steps = await this.getSteps(filter);
        if (!steps.length) {
            throw Error(`Cannot find mat-step matching filter ${JSON.stringify(filter)}`);
        }
        await steps[0].select();
    }
}
/** The selector for the host element of a `MatStepper` instance. */
MatStepperHarness.hostSelector = '.mat-stepper-horizontal, .mat-stepper-vertical';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3N0ZXBwZXIvdGVzdGluZy9zdGVwcGVyLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDeEUsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBTzlDLHlFQUF5RTtBQUN6RSxNQUFNLE9BQU8saUJBQWtCLFNBQVEsZ0JBQWdCO0lBSXJEOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFpQyxFQUFFO1FBQzdDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQy9ELGFBQWEsRUFDYixPQUFPLENBQUMsV0FBVyxFQUNuQixLQUFLLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxLQUFLLFdBQVcsQ0FDakYsQ0FBQztJQUNKLENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsUUFBUSxDQUFDLFNBQTZCLEVBQUU7UUFDNUMsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQzNELENBQUM7SUFFRCwyQ0FBMkM7SUFDM0MsS0FBSyxDQUFDLGNBQWM7UUFDbEIsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDL0IsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1lBQ3BELENBQUM7WUFDRCxDQUFDLGlCQUE0QixDQUFDO0lBQ2xDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLFVBQVUsQ0FBQyxTQUE2QixFQUFFO1FBQzlDLE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNqQixNQUFNLEtBQUssQ0FBQyx3Q0FBd0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDL0U7UUFDRCxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUMxQixDQUFDOztBQTVDRCxvRUFBb0U7QUFDN0QsOEJBQVksR0FBRyxnREFBZ0QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudEhhcm5lc3MsIEhhcm5lc3NQcmVkaWNhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7TWF0U3RlcEhhcm5lc3N9IGZyb20gJy4vc3RlcC1oYXJuZXNzJztcbmltcG9ydCB7XG4gIFN0ZXBwZXJIYXJuZXNzRmlsdGVycyxcbiAgU3RlcEhhcm5lc3NGaWx0ZXJzLFxuICBTdGVwcGVyT3JpZW50YXRpb24sXG59IGZyb20gJy4vc3RlcC1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIE1hdGVyaWFsIHN0ZXBwZXIgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0U3RlcHBlckhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRTdGVwcGVyYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LXN0ZXBwZXItaG9yaXpvbnRhbCwgLm1hdC1zdGVwcGVyLXZlcnRpY2FsJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0U3RlcHBlckhhcm5lc3NgIHRoYXQgbWVldHNcbiAgICogY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIHN0ZXBwZXIgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogU3RlcHBlckhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFN0ZXBwZXJIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdFN0ZXBwZXJIYXJuZXNzLCBvcHRpb25zKS5hZGRPcHRpb24oXG4gICAgICAnb3JpZW50YXRpb24nLFxuICAgICAgb3B0aW9ucy5vcmllbnRhdGlvbixcbiAgICAgIGFzeW5jIChoYXJuZXNzLCBvcmllbnRhdGlvbikgPT4gKGF3YWl0IGhhcm5lc3MuZ2V0T3JpZW50YXRpb24oKSkgPT09IG9yaWVudGF0aW9uLFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgbGlzdCBvZiBzdGVwcyBpbiB0aGUgc3RlcHBlci5cbiAgICogQHBhcmFtIGZpbHRlciBPcHRpb25hbGx5IGZpbHRlcnMgd2hpY2ggc3RlcHMgYXJlIGluY2x1ZGVkLlxuICAgKi9cbiAgYXN5bmMgZ2V0U3RlcHMoZmlsdGVyOiBTdGVwSGFybmVzc0ZpbHRlcnMgPSB7fSk6IFByb21pc2U8TWF0U3RlcEhhcm5lc3NbXT4ge1xuICAgIHJldHVybiB0aGlzLmxvY2F0b3JGb3JBbGwoTWF0U3RlcEhhcm5lc3Mud2l0aChmaWx0ZXIpKSgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIG9yaWVudGF0aW9uIG9mIHRoZSBzdGVwcGVyLiAqL1xuICBhc3luYyBnZXRPcmllbnRhdGlvbigpOiBQcm9taXNlPFN0ZXBwZXJPcmllbnRhdGlvbj4ge1xuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLmhvc3QoKTtcbiAgICByZXR1cm4gKGF3YWl0IGhvc3QuaGFzQ2xhc3MoJ21hdC1zdGVwcGVyLWhvcml6b250YWwnKSlcbiAgICAgID8gU3RlcHBlck9yaWVudGF0aW9uLkhPUklaT05UQUxcbiAgICAgIDogU3RlcHBlck9yaWVudGF0aW9uLlZFUlRJQ0FMO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbGVjdHMgYSBzdGVwIGluIHRoaXMgc3RlcHBlci5cbiAgICogQHBhcmFtIGZpbHRlciBBbiBvcHRpb25hbCBmaWx0ZXIgdG8gYXBwbHkgdG8gdGhlIGNoaWxkIHN0ZXBzLiBUaGUgZmlyc3Qgc3RlcCBtYXRjaGluZyB0aGVcbiAgICogICAgZmlsdGVyIHdpbGwgYmUgc2VsZWN0ZWQuXG4gICAqL1xuICBhc3luYyBzZWxlY3RTdGVwKGZpbHRlcjogU3RlcEhhcm5lc3NGaWx0ZXJzID0ge30pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBzdGVwcyA9IGF3YWl0IHRoaXMuZ2V0U3RlcHMoZmlsdGVyKTtcbiAgICBpZiAoIXN0ZXBzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgRXJyb3IoYENhbm5vdCBmaW5kIG1hdC1zdGVwIG1hdGNoaW5nIGZpbHRlciAke0pTT04uc3RyaW5naWZ5KGZpbHRlcil9YCk7XG4gICAgfVxuICAgIGF3YWl0IHN0ZXBzWzBdLnNlbGVjdCgpO1xuICB9XG59XG4iXX0=