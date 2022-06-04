/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ContentContainerComponentHarness, HarnessPredicate, TestKey } from '@angular/cdk/testing';
import { MatChipAvatarHarness } from './chip-avatar-harness';
import { MatChipRemoveHarness } from './chip-remove-harness';
/** Harness for interacting with a standard selectable Angular Material chip in tests. */
export class MatChipHarness extends ContentContainerComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatChipHarness` that meets
     * certain criteria.
     * @param options Options for filtering which chip instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatChipHarness, options)
            .addOption('text', options.text, (harness, label) => HarnessPredicate.stringMatches(harness.getText(), label))
            .addOption('selected', options.selected, async (harness, selected) => (await harness.isSelected()) === selected);
    }
    /** Gets the text of the chip. */
    async getText() {
        return (await this.host()).text({
            exclude: '.mat-chip-avatar, .mat-chip-trailing-icon, .mat-icon',
        });
    }
    /**
     * Whether the chip is selected.
     * @deprecated Use `MatChipOptionHarness.isSelected` instead.
     * @breaking-change 12.0.0
     */
    async isSelected() {
        return (await this.host()).hasClass('mat-chip-selected');
    }
    /** Whether the chip is disabled. */
    async isDisabled() {
        return (await this.host()).hasClass('mat-chip-disabled');
    }
    /**
     * Selects the given chip. Only applies if it's selectable.
     * @deprecated Use `MatChipOptionHarness.select` instead.
     * @breaking-change 12.0.0
     */
    async select() {
        if (!(await this.isSelected())) {
            await this.toggle();
        }
    }
    /**
     * Deselects the given chip. Only applies if it's selectable.
     * @deprecated Use `MatChipOptionHarness.deselect` instead.
     * @breaking-change 12.0.0
     */
    async deselect() {
        if (await this.isSelected()) {
            await this.toggle();
        }
    }
    /**
     * Toggles the selected state of the given chip. Only applies if it's selectable.
     * @deprecated Use `MatChipOptionHarness.toggle` instead.
     * @breaking-change 12.0.0
     */
    async toggle() {
        return (await this.host()).sendKeys(' ');
    }
    /** Removes the given chip. Only applies if it's removable. */
    async remove() {
        await (await this.host()).sendKeys(TestKey.DELETE);
    }
    /**
     * Gets the remove button inside of a chip.
     * @param filter Optionally filters which remove buttons are included.
     */
    async getRemoveButton(filter = {}) {
        return this.locatorFor(MatChipRemoveHarness.with(filter))();
    }
    /**
     * Gets the avatar inside a chip.
     * @param filter Optionally filters which avatars are included.
     */
    async getAvatar(filter = {}) {
        return this.locatorForOptional(MatChipAvatarHarness.with(filter))();
    }
}
/** The selector for the host element of a `MatChip` instance. */
MatChipHarness.hostSelector = '.mat-chip';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NoaXBzL3Rlc3RpbmcvY2hpcC1oYXJuZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxnQ0FBZ0MsRUFBRSxnQkFBZ0IsRUFBRSxPQUFPLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNqRyxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQU0zRCxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUUzRCx5RkFBeUY7QUFDekYsTUFBTSxPQUFPLGNBQWUsU0FBUSxnQ0FBZ0M7SUFJbEU7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQThCLEVBQUU7UUFDMUMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUM7YUFDakQsU0FBUyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQ2xELGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQ3pEO2FBQ0EsU0FBUyxDQUNSLFVBQVUsRUFDVixPQUFPLENBQUMsUUFBUSxFQUNoQixLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLFFBQVEsQ0FDdkUsQ0FBQztJQUNOLENBQUM7SUFFRCxpQ0FBaUM7SUFDakMsS0FBSyxDQUFDLE9BQU87UUFDWCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDOUIsT0FBTyxFQUFFLHNEQUFzRDtTQUNoRSxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxVQUFVO1FBQ2QsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELG9DQUFvQztJQUNwQyxLQUFLLENBQUMsVUFBVTtRQUNkLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLE1BQU07UUFDVixJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFO1lBQzlCLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ3JCO0lBQ0gsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxLQUFLLENBQUMsUUFBUTtRQUNaLElBQUksTUFBTSxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUU7WUFDM0IsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDckI7SUFDSCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxNQUFNO1FBQ1YsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCw4REFBOEQ7SUFDOUQsS0FBSyxDQUFDLE1BQU07UUFDVixNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsZUFBZSxDQUFDLFNBQW1DLEVBQUU7UUFDekQsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDOUQsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBbUMsRUFBRTtRQUNuRCxPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ3RFLENBQUM7O0FBNUZELGlFQUFpRTtBQUMxRCwyQkFBWSxHQUFHLFdBQVcsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbnRlbnRDb250YWluZXJDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlLCBUZXN0S2V5fSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge01hdENoaXBBdmF0YXJIYXJuZXNzfSBmcm9tICcuL2NoaXAtYXZhdGFyLWhhcm5lc3MnO1xuaW1wb3J0IHtcbiAgQ2hpcEF2YXRhckhhcm5lc3NGaWx0ZXJzLFxuICBDaGlwSGFybmVzc0ZpbHRlcnMsXG4gIENoaXBSZW1vdmVIYXJuZXNzRmlsdGVycyxcbn0gZnJvbSAnLi9jaGlwLWhhcm5lc3MtZmlsdGVycyc7XG5pbXBvcnQge01hdENoaXBSZW1vdmVIYXJuZXNzfSBmcm9tICcuL2NoaXAtcmVtb3ZlLWhhcm5lc3MnO1xuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIHNlbGVjdGFibGUgQW5ndWxhciBNYXRlcmlhbCBjaGlwIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdENoaXBIYXJuZXNzIGV4dGVuZHMgQ29udGVudENvbnRhaW5lckNvbXBvbmVudEhhcm5lc3Mge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdENoaXBgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtY2hpcCc7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYE1hdENoaXBIYXJuZXNzYCB0aGF0IG1lZXRzXG4gICAqIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBjaGlwIGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IENoaXBIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRDaGlwSGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRDaGlwSGFybmVzcywgb3B0aW9ucylcbiAgICAgIC5hZGRPcHRpb24oJ3RleHQnLCBvcHRpb25zLnRleHQsIChoYXJuZXNzLCBsYWJlbCkgPT5cbiAgICAgICAgSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0VGV4dCgpLCBsYWJlbCksXG4gICAgICApXG4gICAgICAuYWRkT3B0aW9uKFxuICAgICAgICAnc2VsZWN0ZWQnLFxuICAgICAgICBvcHRpb25zLnNlbGVjdGVkLFxuICAgICAgICBhc3luYyAoaGFybmVzcywgc2VsZWN0ZWQpID0+IChhd2FpdCBoYXJuZXNzLmlzU2VsZWN0ZWQoKSkgPT09IHNlbGVjdGVkLFxuICAgICAgKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB0ZXh0IG9mIHRoZSBjaGlwLiAqL1xuICBhc3luYyBnZXRUZXh0KCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkudGV4dCh7XG4gICAgICBleGNsdWRlOiAnLm1hdC1jaGlwLWF2YXRhciwgLm1hdC1jaGlwLXRyYWlsaW5nLWljb24sIC5tYXQtaWNvbicsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciB0aGUgY2hpcCBpcyBzZWxlY3RlZC5cbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBNYXRDaGlwT3B0aW9uSGFybmVzcy5pc1NlbGVjdGVkYCBpbnN0ZWFkLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDEyLjAuMFxuICAgKi9cbiAgYXN5bmMgaXNTZWxlY3RlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbWF0LWNoaXAtc2VsZWN0ZWQnKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBjaGlwIGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmhhc0NsYXNzKCdtYXQtY2hpcC1kaXNhYmxlZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbGVjdHMgdGhlIGdpdmVuIGNoaXAuIE9ubHkgYXBwbGllcyBpZiBpdCdzIHNlbGVjdGFibGUuXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgTWF0Q2hpcE9wdGlvbkhhcm5lc3Muc2VsZWN0YCBpbnN0ZWFkLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDEyLjAuMFxuICAgKi9cbiAgYXN5bmMgc2VsZWN0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghKGF3YWl0IHRoaXMuaXNTZWxlY3RlZCgpKSkge1xuICAgICAgYXdhaXQgdGhpcy50b2dnbGUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGVzZWxlY3RzIHRoZSBnaXZlbiBjaGlwLiBPbmx5IGFwcGxpZXMgaWYgaXQncyBzZWxlY3RhYmxlLlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYE1hdENoaXBPcHRpb25IYXJuZXNzLmRlc2VsZWN0YCBpbnN0ZWFkLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDEyLjAuMFxuICAgKi9cbiAgYXN5bmMgZGVzZWxlY3QoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKGF3YWl0IHRoaXMuaXNTZWxlY3RlZCgpKSB7XG4gICAgICBhd2FpdCB0aGlzLnRvZ2dsZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGVzIHRoZSBzZWxlY3RlZCBzdGF0ZSBvZiB0aGUgZ2l2ZW4gY2hpcC4gT25seSBhcHBsaWVzIGlmIGl0J3Mgc2VsZWN0YWJsZS5cbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBNYXRDaGlwT3B0aW9uSGFybmVzcy50b2dnbGVgIGluc3RlYWQuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTIuMC4wXG4gICAqL1xuICBhc3luYyB0b2dnbGUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuc2VuZEtleXMoJyAnKTtcbiAgfVxuXG4gIC8qKiBSZW1vdmVzIHRoZSBnaXZlbiBjaGlwLiBPbmx5IGFwcGxpZXMgaWYgaXQncyByZW1vdmFibGUuICovXG4gIGFzeW5jIHJlbW92ZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLnNlbmRLZXlzKFRlc3RLZXkuREVMRVRFKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSByZW1vdmUgYnV0dG9uIGluc2lkZSBvZiBhIGNoaXAuXG4gICAqIEBwYXJhbSBmaWx0ZXIgT3B0aW9uYWxseSBmaWx0ZXJzIHdoaWNoIHJlbW92ZSBidXR0b25zIGFyZSBpbmNsdWRlZC5cbiAgICovXG4gIGFzeW5jIGdldFJlbW92ZUJ1dHRvbihmaWx0ZXI6IENoaXBSZW1vdmVIYXJuZXNzRmlsdGVycyA9IHt9KTogUHJvbWlzZTxNYXRDaGlwUmVtb3ZlSGFybmVzcz4ge1xuICAgIHJldHVybiB0aGlzLmxvY2F0b3JGb3IoTWF0Q2hpcFJlbW92ZUhhcm5lc3Mud2l0aChmaWx0ZXIpKSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGF2YXRhciBpbnNpZGUgYSBjaGlwLlxuICAgKiBAcGFyYW0gZmlsdGVyIE9wdGlvbmFsbHkgZmlsdGVycyB3aGljaCBhdmF0YXJzIGFyZSBpbmNsdWRlZC5cbiAgICovXG4gIGFzeW5jIGdldEF2YXRhcihmaWx0ZXI6IENoaXBBdmF0YXJIYXJuZXNzRmlsdGVycyA9IHt9KTogUHJvbWlzZTxNYXRDaGlwQXZhdGFySGFybmVzcyB8IG51bGw+IHtcbiAgICByZXR1cm4gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoTWF0Q2hpcEF2YXRhckhhcm5lc3Mud2l0aChmaWx0ZXIpKSgpO1xuICB9XG59XG4iXX0=