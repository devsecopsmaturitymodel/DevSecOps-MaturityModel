/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/** Harness for interacting with a standard Material badge in tests. */
export class MatBadgeHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._badgeElement = this.locatorFor('.mat-badge-content');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a badge with specific attributes.
     * @param options Options for narrowing the search:
     *   - `text` finds a badge host with a particular text.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatBadgeHarness, options).addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text));
    }
    /** Gets a promise for the badge text. */
    async getText() {
        return (await this._badgeElement()).text();
    }
    /** Gets whether the badge is overlapping the content. */
    async isOverlapping() {
        return (await this.host()).hasClass('mat-badge-overlap');
    }
    /** Gets the position of the badge. */
    async getPosition() {
        const host = await this.host();
        let result = '';
        if (await host.hasClass('mat-badge-above')) {
            result += 'above';
        }
        else if (await host.hasClass('mat-badge-below')) {
            result += 'below';
        }
        if (await host.hasClass('mat-badge-before')) {
            result += ' before';
        }
        else if (await host.hasClass('mat-badge-after')) {
            result += ' after';
        }
        return result.trim();
    }
    /** Gets the size of the badge. */
    async getSize() {
        const host = await this.host();
        if (await host.hasClass('mat-badge-small')) {
            return 'small';
        }
        else if (await host.hasClass('mat-badge-large')) {
            return 'large';
        }
        return 'medium';
    }
    /** Gets whether the badge is hidden. */
    async isHidden() {
        return (await this.host()).hasClass('mat-badge-hidden');
    }
    /** Gets whether the badge is disabled. */
    async isDisabled() {
        return (await this.host()).hasClass('mat-badge-disabled');
    }
}
MatBadgeHarness.hostSelector = '.mat-badge';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFkZ2UtaGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9iYWRnZS90ZXN0aW5nL2JhZGdlLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFJeEUsdUVBQXVFO0FBQ3ZFLE1BQU0sT0FBTyxlQUFnQixTQUFRLGdCQUFnQjtJQUFyRDs7UUFpQlUsa0JBQWEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLENBQUM7SUFzRGhFLENBQUM7SUFwRUM7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQStCLEVBQUU7UUFDM0MsT0FBTyxJQUFJLGdCQUFnQixDQUFDLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQzdELE1BQU0sRUFDTixPQUFPLENBQUMsSUFBSSxFQUNaLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FDM0UsQ0FBQztJQUNKLENBQUM7SUFJRCx5Q0FBeUM7SUFDekMsS0FBSyxDQUFDLE9BQU87UUFDWCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUM3QyxDQUFDO0lBRUQseURBQXlEO0lBQ3pELEtBQUssQ0FBQyxhQUFhO1FBQ2pCLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRCxzQ0FBc0M7SUFDdEMsS0FBSyxDQUFDLFdBQVc7UUFDZixNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUMvQixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFFaEIsSUFBSSxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsRUFBRTtZQUMxQyxNQUFNLElBQUksT0FBTyxDQUFDO1NBQ25CO2FBQU0sSUFBSSxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsRUFBRTtZQUNqRCxNQUFNLElBQUksT0FBTyxDQUFDO1NBQ25CO1FBRUQsSUFBSSxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsRUFBRTtZQUMzQyxNQUFNLElBQUksU0FBUyxDQUFDO1NBQ3JCO2FBQU0sSUFBSSxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsRUFBRTtZQUNqRCxNQUFNLElBQUksUUFBUSxDQUFDO1NBQ3BCO1FBRUQsT0FBTyxNQUFNLENBQUMsSUFBSSxFQUFzQixDQUFDO0lBQzNDLENBQUM7SUFFRCxrQ0FBa0M7SUFDbEMsS0FBSyxDQUFDLE9BQU87UUFDWCxNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUUvQixJQUFJLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO1lBQzFDLE9BQU8sT0FBTyxDQUFDO1NBQ2hCO2FBQU0sSUFBSSxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsRUFBRTtZQUNqRCxPQUFPLE9BQU8sQ0FBQztTQUNoQjtRQUVELE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7SUFFRCx3Q0FBd0M7SUFDeEMsS0FBSyxDQUFDLFFBQVE7UUFDWixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRUQsMENBQTBDO0lBQzFDLEtBQUssQ0FBQyxVQUFVO1FBQ2QsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUFDLENBQUM7SUFDNUQsQ0FBQzs7QUFyRU0sNEJBQVksR0FBRyxZQUFZLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge01hdEJhZGdlUG9zaXRpb24sIE1hdEJhZGdlU2l6ZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvYmFkZ2UnO1xuaW1wb3J0IHtCYWRnZUhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL2JhZGdlLWhhcm5lc3MtZmlsdGVycyc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgTWF0ZXJpYWwgYmFkZ2UgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0QmFkZ2VIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1iYWRnZSc7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYmFkZ2Ugd2l0aCBzcGVjaWZpYyBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBuYXJyb3dpbmcgdGhlIHNlYXJjaDpcbiAgICogICAtIGB0ZXh0YCBmaW5kcyBhIGJhZGdlIGhvc3Qgd2l0aCBhIHBhcnRpY3VsYXIgdGV4dC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBCYWRnZUhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdEJhZGdlSGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRCYWRnZUhhcm5lc3MsIG9wdGlvbnMpLmFkZE9wdGlvbihcbiAgICAgICd0ZXh0JyxcbiAgICAgIG9wdGlvbnMudGV4dCxcbiAgICAgIChoYXJuZXNzLCB0ZXh0KSA9PiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRUZXh0KCksIHRleHQpLFxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIF9iYWRnZUVsZW1lbnQgPSB0aGlzLmxvY2F0b3JGb3IoJy5tYXQtYmFkZ2UtY29udGVudCcpO1xuXG4gIC8qKiBHZXRzIGEgcHJvbWlzZSBmb3IgdGhlIGJhZGdlIHRleHQuICovXG4gIGFzeW5jIGdldFRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2JhZGdlRWxlbWVudCgpKS50ZXh0KCk7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIHRoZSBiYWRnZSBpcyBvdmVybGFwcGluZyB0aGUgY29udGVudC4gKi9cbiAgYXN5bmMgaXNPdmVybGFwcGluZygpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbWF0LWJhZGdlLW92ZXJsYXAnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBwb3NpdGlvbiBvZiB0aGUgYmFkZ2UuICovXG4gIGFzeW5jIGdldFBvc2l0aW9uKCk6IFByb21pc2U8TWF0QmFkZ2VQb3NpdGlvbj4ge1xuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLmhvc3QoKTtcbiAgICBsZXQgcmVzdWx0ID0gJyc7XG5cbiAgICBpZiAoYXdhaXQgaG9zdC5oYXNDbGFzcygnbWF0LWJhZGdlLWFib3ZlJykpIHtcbiAgICAgIHJlc3VsdCArPSAnYWJvdmUnO1xuICAgIH0gZWxzZSBpZiAoYXdhaXQgaG9zdC5oYXNDbGFzcygnbWF0LWJhZGdlLWJlbG93JykpIHtcbiAgICAgIHJlc3VsdCArPSAnYmVsb3cnO1xuICAgIH1cblxuICAgIGlmIChhd2FpdCBob3N0Lmhhc0NsYXNzKCdtYXQtYmFkZ2UtYmVmb3JlJykpIHtcbiAgICAgIHJlc3VsdCArPSAnIGJlZm9yZSc7XG4gICAgfSBlbHNlIGlmIChhd2FpdCBob3N0Lmhhc0NsYXNzKCdtYXQtYmFkZ2UtYWZ0ZXInKSkge1xuICAgICAgcmVzdWx0ICs9ICcgYWZ0ZXInO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQudHJpbSgpIGFzIE1hdEJhZGdlUG9zaXRpb247XG4gIH1cblxuICAvKiogR2V0cyB0aGUgc2l6ZSBvZiB0aGUgYmFkZ2UuICovXG4gIGFzeW5jIGdldFNpemUoKTogUHJvbWlzZTxNYXRCYWRnZVNpemU+IHtcbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy5ob3N0KCk7XG5cbiAgICBpZiAoYXdhaXQgaG9zdC5oYXNDbGFzcygnbWF0LWJhZGdlLXNtYWxsJykpIHtcbiAgICAgIHJldHVybiAnc21hbGwnO1xuICAgIH0gZWxzZSBpZiAoYXdhaXQgaG9zdC5oYXNDbGFzcygnbWF0LWJhZGdlLWxhcmdlJykpIHtcbiAgICAgIHJldHVybiAnbGFyZ2UnO1xuICAgIH1cblxuICAgIHJldHVybiAnbWVkaXVtJztcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIGJhZGdlIGlzIGhpZGRlbi4gKi9cbiAgYXN5bmMgaXNIaWRkZW4oKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ21hdC1iYWRnZS1oaWRkZW4nKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIGJhZGdlIGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmhhc0NsYXNzKCdtYXQtYmFkZ2UtZGlzYWJsZWQnKTtcbiAgfVxufVxuIl19