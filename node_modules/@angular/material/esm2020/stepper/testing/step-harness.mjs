/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ContentContainerComponentHarness, HarnessPredicate, } from '@angular/cdk/testing';
/** Harness for interacting with a standard Angular Material step in tests. */
export class MatStepHarness extends ContentContainerComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatStepHarness` that meets
     * certain criteria.
     * @param options Options for filtering which steps are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatStepHarness, options)
            .addOption('label', options.label, (harness, label) => HarnessPredicate.stringMatches(harness.getLabel(), label))
            .addOption('selected', options.selected, async (harness, selected) => (await harness.isSelected()) === selected)
            .addOption('completed', options.completed, async (harness, completed) => (await harness.isCompleted()) === completed)
            .addOption('invalid', options.invalid, async (harness, invalid) => (await harness.hasErrors()) === invalid);
    }
    /** Gets the label of the step. */
    async getLabel() {
        return (await this.locatorFor('.mat-step-text-label')()).text();
    }
    /** Gets the `aria-label` of the step. */
    async getAriaLabel() {
        return (await this.host()).getAttribute('aria-label');
    }
    /** Gets the value of the `aria-labelledby` attribute. */
    async getAriaLabelledby() {
        return (await this.host()).getAttribute('aria-labelledby');
    }
    /** Whether the step is selected. */
    async isSelected() {
        const host = await this.host();
        return (await host.getAttribute('aria-selected')) === 'true';
    }
    /** Whether the step has been filled out. */
    async isCompleted() {
        const state = await this._getIconState();
        return state === 'done' || (state === 'edit' && !(await this.isSelected()));
    }
    /**
     * Whether the step is currently showing its error state. Note that this doesn't mean that there
     * are or aren't any invalid form controls inside the step, but that the step is showing its
     * error-specific styling which depends on there being invalid controls, as well as the
     * `ErrorStateMatcher` determining that an error should be shown and that the `showErrors`
     * option was enabled through the `STEPPER_GLOBAL_OPTIONS` injection token.
     */
    async hasErrors() {
        return (await this._getIconState()) === 'error';
    }
    /** Whether the step is optional. */
    async isOptional() {
        // If the node with the optional text is present, it means that the step is optional.
        const optionalNode = await this.locatorForOptional('.mat-step-optional')();
        return !!optionalNode;
    }
    /**
     * Selects the given step by clicking on the label. The step may not be selected
     * if the stepper doesn't allow it (e.g. if there are validation errors).
     */
    async select() {
        await (await this.host()).click();
    }
    async getRootHarnessLoader() {
        const contentId = await (await this.host()).getAttribute('aria-controls');
        return this.documentRootLocatorFactory().harnessLoaderFor(`#${contentId}`);
    }
    /**
     * Gets the state of the step. Note that we have a `StepState` which we could use to type the
     * return value, but it's basically the same as `string`, because the type has `| string`.
     */
    async _getIconState() {
        // The state is exposed on the icon with a class that looks like `mat-step-icon-state-{{state}}`
        const icon = await this.locatorFor('.mat-step-icon')();
        const classes = (await icon.getAttribute('class'));
        const match = classes.match(/mat-step-icon-state-([a-z]+)/);
        if (!match) {
            throw Error(`Could not determine step state from "${classes}".`);
        }
        return match[1];
    }
}
/** The selector for the host element of a `MatStep` instance. */
MatStepHarness.hostSelector = '.mat-step-header';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3N0ZXBwZXIvdGVzdGluZy9zdGVwLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLGdDQUFnQyxFQUNoQyxnQkFBZ0IsR0FFakIsTUFBTSxzQkFBc0IsQ0FBQztBQUc5Qiw4RUFBOEU7QUFDOUUsTUFBTSxPQUFPLGNBQWUsU0FBUSxnQ0FBd0M7SUFJMUU7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQThCLEVBQUU7UUFDMUMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUM7YUFDakQsU0FBUyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQ3BELGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQzFEO2FBQ0EsU0FBUyxDQUNSLFVBQVUsRUFDVixPQUFPLENBQUMsUUFBUSxFQUNoQixLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLFFBQVEsQ0FDdkU7YUFDQSxTQUFTLENBQ1IsV0FBVyxFQUNYLE9BQU8sQ0FBQyxTQUFTLEVBQ2pCLEtBQUssRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssU0FBUyxDQUMxRTthQUNBLFNBQVMsQ0FDUixTQUFTLEVBQ1QsT0FBTyxDQUFDLE9BQU8sRUFDZixLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxT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KiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ29udGVudENvbnRhaW5lckNvbXBvbmVudEhhcm5lc3MsXG4gIEhhcm5lc3NQcmVkaWNhdGUsXG4gIEhhcm5lc3NMb2FkZXIsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7U3RlcEhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL3N0ZXAtaGFybmVzcy1maWx0ZXJzJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBBbmd1bGFyIE1hdGVyaWFsIHN0ZXAgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0U3RlcEhhcm5lc3MgZXh0ZW5kcyBDb250ZW50Q29udGFpbmVyQ29tcG9uZW50SGFybmVzczxzdHJpbmc+IHtcbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRTdGVwYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LXN0ZXAtaGVhZGVyJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0U3RlcEhhcm5lc3NgIHRoYXQgbWVldHNcbiAgICogY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIHN0ZXBzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogU3RlcEhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFN0ZXBIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdFN0ZXBIYXJuZXNzLCBvcHRpb25zKVxuICAgICAgLmFkZE9wdGlvbignbGFiZWwnLCBvcHRpb25zLmxhYmVsLCAoaGFybmVzcywgbGFiZWwpID0+XG4gICAgICAgIEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldExhYmVsKCksIGxhYmVsKSxcbiAgICAgIClcbiAgICAgIC5hZGRPcHRpb24oXG4gICAgICAgICdzZWxlY3RlZCcsXG4gICAgICAgIG9wdGlvbnMuc2VsZWN0ZWQsXG4gICAgICAgIGFzeW5jIChoYXJuZXNzLCBzZWxlY3RlZCkgPT4gKGF3YWl0IGhhcm5lc3MuaXNTZWxlY3RlZCgpKSA9PT0gc2VsZWN0ZWQsXG4gICAgICApXG4gICAgICAuYWRkT3B0aW9uKFxuICAgICAgICAnY29tcGxldGVkJyxcbiAgICAgICAgb3B0aW9ucy5jb21wbGV0ZWQsXG4gICAgICAgIGFzeW5jIChoYXJuZXNzLCBjb21wbGV0ZWQpID0+IChhd2FpdCBoYXJuZXNzLmlzQ29tcGxldGVkKCkpID09PSBjb21wbGV0ZWQsXG4gICAgICApXG4gICAgICAuYWRkT3B0aW9uKFxuICAgICAgICAnaW52YWxpZCcsXG4gICAgICAgIG9wdGlvbnMuaW52YWxpZCxcbiAgICAgICAgYXN5bmMgKGhhcm5lc3MsIGludmFsaWQpID0+IChhd2FpdCBoYXJuZXNzLmhhc0Vycm9ycygpKSA9PT0gaW52YWxpZCxcbiAgICAgICk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbGFiZWwgb2YgdGhlIHN0ZXAuICovXG4gIGFzeW5jIGdldExhYmVsKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmxvY2F0b3JGb3IoJy5tYXQtc3RlcC10ZXh0LWxhYmVsJykoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGBhcmlhLWxhYmVsYCBvZiB0aGUgc3RlcC4gKi9cbiAgYXN5bmMgZ2V0QXJpYUxhYmVsKCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHZhbHVlIG9mIHRoZSBgYXJpYS1sYWJlbGxlZGJ5YCBhdHRyaWJ1dGUuICovXG4gIGFzeW5jIGdldEFyaWFMYWJlbGxlZGJ5KCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbGxlZGJ5Jyk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgc3RlcCBpcyBzZWxlY3RlZC4gKi9cbiAgYXN5bmMgaXNTZWxlY3RlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy5ob3N0KCk7XG4gICAgcmV0dXJuIChhd2FpdCBob3N0LmdldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcpKSA9PT0gJ3RydWUnO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHN0ZXAgaGFzIGJlZW4gZmlsbGVkIG91dC4gKi9cbiAgYXN5bmMgaXNDb21wbGV0ZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3Qgc3RhdGUgPSBhd2FpdCB0aGlzLl9nZXRJY29uU3RhdGUoKTtcbiAgICByZXR1cm4gc3RhdGUgPT09ICdkb25lJyB8fCAoc3RhdGUgPT09ICdlZGl0JyAmJiAhKGF3YWl0IHRoaXMuaXNTZWxlY3RlZCgpKSk7XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciB0aGUgc3RlcCBpcyBjdXJyZW50bHkgc2hvd2luZyBpdHMgZXJyb3Igc3RhdGUuIE5vdGUgdGhhdCB0aGlzIGRvZXNuJ3QgbWVhbiB0aGF0IHRoZXJlXG4gICAqIGFyZSBvciBhcmVuJ3QgYW55IGludmFsaWQgZm9ybSBjb250cm9scyBpbnNpZGUgdGhlIHN0ZXAsIGJ1dCB0aGF0IHRoZSBzdGVwIGlzIHNob3dpbmcgaXRzXG4gICAqIGVycm9yLXNwZWNpZmljIHN0eWxpbmcgd2hpY2ggZGVwZW5kcyBvbiB0aGVyZSBiZWluZyBpbnZhbGlkIGNvbnRyb2xzLCBhcyB3ZWxsIGFzIHRoZVxuICAgKiBgRXJyb3JTdGF0ZU1hdGNoZXJgIGRldGVybWluaW5nIHRoYXQgYW4gZXJyb3Igc2hvdWxkIGJlIHNob3duIGFuZCB0aGF0IHRoZSBgc2hvd0Vycm9yc2BcbiAgICogb3B0aW9uIHdhcyBlbmFibGVkIHRocm91Z2ggdGhlIGBTVEVQUEVSX0dMT0JBTF9PUFRJT05TYCBpbmplY3Rpb24gdG9rZW4uXG4gICAqL1xuICBhc3luYyBoYXNFcnJvcnMoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9nZXRJY29uU3RhdGUoKSkgPT09ICdlcnJvcic7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgc3RlcCBpcyBvcHRpb25hbC4gKi9cbiAgYXN5bmMgaXNPcHRpb25hbCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAvLyBJZiB0aGUgbm9kZSB3aXRoIHRoZSBvcHRpb25hbCB0ZXh0IGlzIHByZXNlbnQsIGl0IG1lYW5zIHRoYXQgdGhlIHN0ZXAgaXMgb3B0aW9uYWwuXG4gICAgY29uc3Qgb3B0aW9uYWxOb2RlID0gYXdhaXQgdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoJy5tYXQtc3RlcC1vcHRpb25hbCcpKCk7XG4gICAgcmV0dXJuICEhb3B0aW9uYWxOb2RlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbGVjdHMgdGhlIGdpdmVuIHN0ZXAgYnkgY2xpY2tpbmcgb24gdGhlIGxhYmVsLiBUaGUgc3RlcCBtYXkgbm90IGJlIHNlbGVjdGVkXG4gICAqIGlmIHRoZSBzdGVwcGVyIGRvZXNuJ3QgYWxsb3cgaXQgKGUuZy4gaWYgdGhlcmUgYXJlIHZhbGlkYXRpb24gZXJyb3JzKS5cbiAgICovXG4gIGFzeW5jIHNlbGVjdCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmNsaWNrKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgYXN5bmMgZ2V0Um9vdEhhcm5lc3NMb2FkZXIoKTogUHJvbWlzZTxIYXJuZXNzTG9hZGVyPiB7XG4gICAgY29uc3QgY29udGVudElkID0gYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnKTtcbiAgICByZXR1cm4gdGhpcy5kb2N1bWVudFJvb3RMb2NhdG9yRmFjdG9yeSgpLmhhcm5lc3NMb2FkZXJGb3IoYCMke2NvbnRlbnRJZH1gKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBzdGF0ZSBvZiB0aGUgc3RlcC4gTm90ZSB0aGF0IHdlIGhhdmUgYSBgU3RlcFN0YXRlYCB3aGljaCB3ZSBjb3VsZCB1c2UgdG8gdHlwZSB0aGVcbiAgICogcmV0dXJuIHZhbHVlLCBidXQgaXQncyBiYXNpY2FsbHkgdGhlIHNhbWUgYXMgYHN0cmluZ2AsIGJlY2F1c2UgdGhlIHR5cGUgaGFzIGB8IHN0cmluZ2AuXG4gICAqL1xuICBwcml2YXRlIGFzeW5jIF9nZXRJY29uU3RhdGUoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAvLyBUaGUgc3RhdGUgaXMgZXhwb3NlZCBvbiB0aGUgaWNvbiB3aXRoIGEgY2xhc3MgdGhhdCBsb29rcyBsaWtlIGBtYXQtc3RlcC1pY29uLXN0YXRlLXt7c3RhdGV9fWBcbiAgICBjb25zdCBpY29uID0gYXdhaXQgdGhpcy5sb2NhdG9yRm9yKCcubWF0LXN0ZXAtaWNvbicpKCk7XG4gICAgY29uc3QgY2xhc3NlcyA9IChhd2FpdCBpY29uLmdldEF0dHJpYnV0ZSgnY2xhc3MnKSkhO1xuICAgIGNvbnN0IG1hdGNoID0gY2xhc3Nlcy5tYXRjaCgvbWF0LXN0ZXAtaWNvbi1zdGF0ZS0oW2Etel0rKS8pO1xuXG4gICAgaWYgKCFtYXRjaCkge1xuICAgICAgdGhyb3cgRXJyb3IoYENvdWxkIG5vdCBkZXRlcm1pbmUgc3RlcCBzdGF0ZSBmcm9tIFwiJHtjbGFzc2VzfVwiLmApO1xuICAgIH1cblxuICAgIHJldHVybiBtYXRjaFsxXTtcbiAgfVxufVxuIl19