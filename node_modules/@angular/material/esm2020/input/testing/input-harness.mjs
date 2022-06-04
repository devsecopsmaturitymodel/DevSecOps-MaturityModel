/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessPredicate, parallel } from '@angular/cdk/testing';
import { MatFormFieldControlHarness } from '@angular/material/form-field/testing/control';
/** Harness for interacting with a standard Material inputs in tests. */
export class MatInputHarness extends MatFormFieldControlHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatInputHarness` that meets
     * certain criteria.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatInputHarness, options)
            .addOption('value', options.value, (harness, value) => {
            return HarnessPredicate.stringMatches(harness.getValue(), value);
        })
            .addOption('placeholder', options.placeholder, (harness, placeholder) => {
            return HarnessPredicate.stringMatches(harness.getPlaceholder(), placeholder);
        });
    }
    /** Whether the input is disabled. */
    async isDisabled() {
        return (await this.host()).getProperty('disabled');
    }
    /** Whether the input is required. */
    async isRequired() {
        return (await this.host()).getProperty('required');
    }
    /** Whether the input is readonly. */
    async isReadonly() {
        return (await this.host()).getProperty('readOnly');
    }
    /** Gets the value of the input. */
    async getValue() {
        // The "value" property of the native input is never undefined.
        return await (await this.host()).getProperty('value');
    }
    /** Gets the name of the input. */
    async getName() {
        // The "name" property of the native input is never undefined.
        return await (await this.host()).getProperty('name');
    }
    /**
     * Gets the type of the input. Returns "textarea" if the input is
     * a textarea.
     */
    async getType() {
        // The "type" property of the native input is never undefined.
        return await (await this.host()).getProperty('type');
    }
    /** Gets the placeholder of the input. */
    async getPlaceholder() {
        const host = await this.host();
        const [nativePlaceholder, fallback] = await parallel(() => [
            host.getProperty('placeholder'),
            host.getAttribute('data-placeholder'),
        ]);
        return nativePlaceholder || fallback || '';
    }
    /** Gets the id of the input. */
    async getId() {
        // The input directive always assigns a unique id to the input in
        // case no id has been explicitly specified.
        return await (await this.host()).getProperty('id');
    }
    /**
     * Focuses the input and returns a promise that indicates when the
     * action is complete.
     */
    async focus() {
        return (await this.host()).focus();
    }
    /**
     * Blurs the input and returns a promise that indicates when the
     * action is complete.
     */
    async blur() {
        return (await this.host()).blur();
    }
    /** Whether the input is focused. */
    async isFocused() {
        return (await this.host()).isFocused();
    }
    /**
     * Sets the value of the input. The value will be set by simulating
     * keypresses that correspond to the given value.
     */
    async setValue(newValue) {
        const inputEl = await this.host();
        await inputEl.clear();
        // We don't want to send keys for the value if the value is an empty
        // string in order to clear the value. Sending keys with an empty string
        // still results in unnecessary focus events.
        if (newValue) {
            await inputEl.sendKeys(newValue);
        }
        // Some input types won't respond to key presses (e.g. `color`) so to be sure that the
        // value is set, we also set the property after the keyboard sequence. Note that we don't
        // want to do it before, because it can cause the value to be entered twice.
        await inputEl.setInputValue(newValue);
    }
}
// TODO: We do not want to handle `select` elements with `matNativeControl` because
// not all methods of this harness work reasonably for native select elements.
// For more details. See: https://github.com/angular/components/pull/18221.
MatInputHarness.hostSelector = '[matInput], input[matNativeControl], textarea[matNativeControl]';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQtaGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9pbnB1dC90ZXN0aW5nL2lucHV0LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGdCQUFnQixFQUFFLFFBQVEsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ2hFLE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLDhDQUE4QyxDQUFDO0FBR3hGLHdFQUF3RTtBQUN4RSxNQUFNLE9BQU8sZUFBZ0IsU0FBUSwwQkFBMEI7SUFNN0Q7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQStCLEVBQUU7UUFDM0MsT0FBTyxJQUFJLGdCQUFnQixDQUFDLGVBQWUsRUFBRSxPQUFPLENBQUM7YUFDbEQsU0FBUyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ3BELE9BQU8sZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNuRSxDQUFDLENBQUM7YUFDRCxTQUFTLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLEVBQUU7WUFDdEUsT0FBTyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQy9FLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELHFDQUFxQztJQUNyQyxLQUFLLENBQUMsVUFBVTtRQUNkLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBVSxVQUFVLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRUQscUNBQXFDO0lBQ3JDLEtB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aUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0hhcm5lc3NQcmVkaWNhdGUsIHBhcmFsbGVsfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge01hdEZvcm1GaWVsZENvbnRyb2xIYXJuZXNzfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9mb3JtLWZpZWxkL3Rlc3RpbmcvY29udHJvbCc7XG5pbXBvcnQge0lucHV0SGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vaW5wdXQtaGFybmVzcy1maWx0ZXJzJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBNYXRlcmlhbCBpbnB1dHMgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0SW5wdXRIYXJuZXNzIGV4dGVuZHMgTWF0Rm9ybUZpZWxkQ29udHJvbEhhcm5lc3Mge1xuICAvLyBUT0RPOiBXZSBkbyBub3Qgd2FudCB0byBoYW5kbGUgYHNlbGVjdGAgZWxlbWVudHMgd2l0aCBgbWF0TmF0aXZlQ29udHJvbGAgYmVjYXVzZVxuICAvLyBub3QgYWxsIG1ldGhvZHMgb2YgdGhpcyBoYXJuZXNzIHdvcmsgcmVhc29uYWJseSBmb3IgbmF0aXZlIHNlbGVjdCBlbGVtZW50cy5cbiAgLy8gRm9yIG1vcmUgZGV0YWlscy4gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTgyMjEuXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnW21hdElucHV0XSwgaW5wdXRbbWF0TmF0aXZlQ29udHJvbF0sIHRleHRhcmVhW21hdE5hdGl2ZUNvbnRyb2xdJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0SW5wdXRIYXJuZXNzYCB0aGF0IG1lZXRzXG4gICAqIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBpbnB1dCBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBJbnB1dEhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdElucHV0SGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRJbnB1dEhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAuYWRkT3B0aW9uKCd2YWx1ZScsIG9wdGlvbnMudmFsdWUsIChoYXJuZXNzLCB2YWx1ZSkgPT4ge1xuICAgICAgICByZXR1cm4gSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0VmFsdWUoKSwgdmFsdWUpO1xuICAgICAgfSlcbiAgICAgIC5hZGRPcHRpb24oJ3BsYWNlaG9sZGVyJywgb3B0aW9ucy5wbGFjZWhvbGRlciwgKGhhcm5lc3MsIHBsYWNlaG9sZGVyKSA9PiB7XG4gICAgICAgIHJldHVybiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRQbGFjZWhvbGRlcigpLCBwbGFjZWhvbGRlcik7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBpbnB1dCBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eTxib29sZWFuPignZGlzYWJsZWQnKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBpbnB1dCBpcyByZXF1aXJlZC4gKi9cbiAgYXN5bmMgaXNSZXF1aXJlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eTxib29sZWFuPigncmVxdWlyZWQnKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBpbnB1dCBpcyByZWFkb25seS4gKi9cbiAgYXN5bmMgaXNSZWFkb25seSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eTxib29sZWFuPigncmVhZE9ubHknKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB2YWx1ZSBvZiB0aGUgaW5wdXQuICovXG4gIGFzeW5jIGdldFZhbHVlKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgLy8gVGhlIFwidmFsdWVcIiBwcm9wZXJ0eSBvZiB0aGUgbmF0aXZlIGlucHV0IGlzIG5ldmVyIHVuZGVmaW5lZC5cbiAgICByZXR1cm4gYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eTxzdHJpbmc+KCd2YWx1ZScpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIG5hbWUgb2YgdGhlIGlucHV0LiAqL1xuICBhc3luYyBnZXROYW1lKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgLy8gVGhlIFwibmFtZVwiIHByb3BlcnR5IG9mIHRoZSBuYXRpdmUgaW5wdXQgaXMgbmV2ZXIgdW5kZWZpbmVkLlxuICAgIHJldHVybiBhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldFByb3BlcnR5PHN0cmluZz4oJ25hbWUnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSB0eXBlIG9mIHRoZSBpbnB1dC4gUmV0dXJucyBcInRleHRhcmVhXCIgaWYgdGhlIGlucHV0IGlzXG4gICAqIGEgdGV4dGFyZWEuXG4gICAqL1xuICBhc3luYyBnZXRUeXBlKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgLy8gVGhlIFwidHlwZVwiIHByb3BlcnR5IG9mIHRoZSBuYXRpdmUgaW5wdXQgaXMgbmV2ZXIgdW5kZWZpbmVkLlxuICAgIHJldHVybiBhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldFByb3BlcnR5PHN0cmluZz4oJ3R5cGUnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBwbGFjZWhvbGRlciBvZiB0aGUgaW5wdXQuICovXG4gIGFzeW5jIGdldFBsYWNlaG9sZGVyKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMuaG9zdCgpO1xuICAgIGNvbnN0IFtuYXRpdmVQbGFjZWhvbGRlciwgZmFsbGJhY2tdID0gYXdhaXQgcGFyYWxsZWwoKCkgPT4gW1xuICAgICAgaG9zdC5nZXRQcm9wZXJ0eSgncGxhY2Vob2xkZXInKSxcbiAgICAgIGhvc3QuZ2V0QXR0cmlidXRlKCdkYXRhLXBsYWNlaG9sZGVyJyksXG4gICAgXSk7XG4gICAgcmV0dXJuIG5hdGl2ZVBsYWNlaG9sZGVyIHx8IGZhbGxiYWNrIHx8ICcnO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGlkIG9mIHRoZSBpbnB1dC4gKi9cbiAgYXN5bmMgZ2V0SWQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAvLyBUaGUgaW5wdXQgZGlyZWN0aXZlIGFsd2F5cyBhc3NpZ25zIGEgdW5pcXVlIGlkIHRvIHRoZSBpbnB1dCBpblxuICAgIC8vIGNhc2Ugbm8gaWQgaGFzIGJlZW4gZXhwbGljaXRseSBzcGVjaWZpZWQuXG4gICAgcmV0dXJuIGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0UHJvcGVydHk8c3RyaW5nPignaWQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb2N1c2VzIHRoZSBpbnB1dCBhbmQgcmV0dXJucyBhIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgd2hlbiB0aGVcbiAgICogYWN0aW9uIGlzIGNvbXBsZXRlLlxuICAgKi9cbiAgYXN5bmMgZm9jdXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZm9jdXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCbHVycyB0aGUgaW5wdXQgYW5kIHJldHVybnMgYSBwcm9taXNlIHRoYXQgaW5kaWNhdGVzIHdoZW4gdGhlXG4gICAqIGFjdGlvbiBpcyBjb21wbGV0ZS5cbiAgICovXG4gIGFzeW5jIGJsdXIoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuYmx1cigpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGlucHV0IGlzIGZvY3VzZWQuICovXG4gIGFzeW5jIGlzRm9jdXNlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5pc0ZvY3VzZWQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB2YWx1ZSBvZiB0aGUgaW5wdXQuIFRoZSB2YWx1ZSB3aWxsIGJlIHNldCBieSBzaW11bGF0aW5nXG4gICAqIGtleXByZXNzZXMgdGhhdCBjb3JyZXNwb25kIHRvIHRoZSBnaXZlbiB2YWx1ZS5cbiAgICovXG4gIGFzeW5jIHNldFZhbHVlKG5ld1ZhbHVlOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBpbnB1dEVsID0gYXdhaXQgdGhpcy5ob3N0KCk7XG4gICAgYXdhaXQgaW5wdXRFbC5jbGVhcigpO1xuICAgIC8vIFdlIGRvbid0IHdhbnQgdG8gc2VuZCBrZXlzIGZvciB0aGUgdmFsdWUgaWYgdGhlIHZhbHVlIGlzIGFuIGVtcHR5XG4gICAgLy8gc3RyaW5nIGluIG9yZGVyIHRvIGNsZWFyIHRoZSB2YWx1ZS4gU2VuZGluZyBrZXlzIHdpdGggYW4gZW1wdHkgc3RyaW5nXG4gICAgLy8gc3RpbGwgcmVzdWx0cyBpbiB1bm5lY2Vzc2FyeSBmb2N1cyBldmVudHMuXG4gICAgaWYgKG5ld1ZhbHVlKSB7XG4gICAgICBhd2FpdCBpbnB1dEVsLnNlbmRLZXlzKG5ld1ZhbHVlKTtcbiAgICB9XG5cbiAgICAvLyBTb21lIGlucHV0IHR5cGVzIHdvbid0IHJlc3BvbmQgdG8ga2V5IHByZXNzZXMgKGUuZy4gYGNvbG9yYCkgc28gdG8gYmUgc3VyZSB0aGF0IHRoZVxuICAgIC8vIHZhbHVlIGlzIHNldCwgd2UgYWxzbyBzZXQgdGhlIHByb3BlcnR5IGFmdGVyIHRoZSBrZXlib2FyZCBzZXF1ZW5jZS4gTm90ZSB0aGF0IHdlIGRvbid0XG4gICAgLy8gd2FudCB0byBkbyBpdCBiZWZvcmUsIGJlY2F1c2UgaXQgY2FuIGNhdXNlIHRoZSB2YWx1ZSB0byBiZSBlbnRlcmVkIHR3aWNlLlxuICAgIGF3YWl0IGlucHV0RWwuc2V0SW5wdXRWYWx1ZShuZXdWYWx1ZSk7XG4gIH1cbn1cbiJdfQ==