/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/** Harness for interacting with a standard mat-icon in tests. */
export class MatIconHarness extends ComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatIconHarness` that meets
     * certain criteria.
     * @param options Options for filtering which icon instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatIconHarness, options)
            .addOption('type', options.type, async (harness, type) => (await harness.getType()) === type)
            .addOption('name', options.name, (harness, text) => HarnessPredicate.stringMatches(harness.getName(), text))
            .addOption('namespace', options.namespace, (harness, text) => HarnessPredicate.stringMatches(harness.getNamespace(), text));
    }
    /** Gets the type of the icon. */
    async getType() {
        const type = await (await this.host()).getAttribute('data-mat-icon-type');
        return type === 'svg' ? 0 /* SVG */ : 1 /* FONT */;
    }
    /** Gets the name of the icon. */
    async getName() {
        const host = await this.host();
        const nameFromDom = await host.getAttribute('data-mat-icon-name');
        // If we managed to figure out the name from the attribute, use it.
        if (nameFromDom) {
            return nameFromDom;
        }
        // Some icons support defining the icon as a ligature.
        // As a fallback, try to extract it from the DOM text.
        if ((await this.getType()) === 1 /* FONT */) {
            return host.text();
        }
        return null;
    }
    /** Gets the namespace of the icon. */
    async getNamespace() {
        return (await this.host()).getAttribute('data-mat-icon-namespace');
    }
    /** Gets whether the icon is inline. */
    async isInline() {
        return (await this.host()).hasClass('mat-icon-inline');
    }
}
/** The selector for the host element of a `MatIcon` instance. */
MatIconHarness.hostSelector = '.mat-icon';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2ljb24vdGVzdGluZy9pY29uLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFHeEUsaUVBQWlFO0FBQ2pFLE1BQU0sT0FBTyxjQUFlLFNBQVEsZ0JBQWdCO0lBSWxEOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUE4QixFQUFFO1FBQzFDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDO2FBQ2pELFNBQVMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLElBQUksQ0FBQzthQUM1RixTQUFTLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FDakQsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FDeEQ7YUFDQSxTQUFTLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FDM0QsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FDN0QsQ0FBQztJQUNOLENBQUM7SUFFRCxpQ0FBaUM7SUFDakMsS0FBSyxDQUFDLE9BQU87UUFDWCxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUMxRSxPQUFPLElBQUksS0FBSyxLQUFLLENBQUMsQ0FBQyxhQUFjLENBQUMsYUFBYyxDQUFDO0lBQ3ZELENBQUM7SUFFRCxpQ0FBaUM7SUFDakMsS0FBSyxDQUFDLE9BQU87UUFDWCxNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUMvQixNQUFNLFdBQVcsR0FBRyxNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUVsRSxtRUFBbUU7UUFDbkUsSUFBSSxXQUFXLEVBQUU7WUFDZixPQUFPLFdBQVcsQ0FBQztTQUNwQjtRQUVELHNEQUFzRDtRQUN0RCxzREFBc0Q7UUFDdEQsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLGlCQUFrQixFQUFFO1lBQzVDLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ3BCO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsc0NBQXNDO0lBQ3RDLEtBQUssQ0FBQyxZQUFZO1FBQ2hCLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFFRCx1Q0FBdUM7SUFDdkMsS0FBSyxDQUFDLFFBQVE7UUFDWixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUN6RCxDQUFDOztBQXJERCxpRUFBaUU7QUFDMUQsMkJBQVksR0FBRyxXQUFXLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge0ljb25IYXJuZXNzRmlsdGVycywgSWNvblR5cGV9IGZyb20gJy4vaWNvbi1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1pY29uIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdEljb25IYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0SWNvbmAgaW5zdGFuY2UuICovXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1pY29uJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0SWNvbkhhcm5lc3NgIHRoYXQgbWVldHNcbiAgICogY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIGljb24gaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogSWNvbkhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdEljb25IYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdEljb25IYXJuZXNzLCBvcHRpb25zKVxuICAgICAgLmFkZE9wdGlvbigndHlwZScsIG9wdGlvbnMudHlwZSwgYXN5bmMgKGhhcm5lc3MsIHR5cGUpID0+IChhd2FpdCBoYXJuZXNzLmdldFR5cGUoKSkgPT09IHR5cGUpXG4gICAgICAuYWRkT3B0aW9uKCduYW1lJywgb3B0aW9ucy5uYW1lLCAoaGFybmVzcywgdGV4dCkgPT5cbiAgICAgICAgSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0TmFtZSgpLCB0ZXh0KSxcbiAgICAgIClcbiAgICAgIC5hZGRPcHRpb24oJ25hbWVzcGFjZScsIG9wdGlvbnMubmFtZXNwYWNlLCAoaGFybmVzcywgdGV4dCkgPT5cbiAgICAgICAgSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0TmFtZXNwYWNlKCksIHRleHQpLFxuICAgICAgKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB0eXBlIG9mIHRoZSBpY29uLiAqL1xuICBhc3luYyBnZXRUeXBlKCk6IFByb21pc2U8SWNvblR5cGU+IHtcbiAgICBjb25zdCB0eXBlID0gYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2RhdGEtbWF0LWljb24tdHlwZScpO1xuICAgIHJldHVybiB0eXBlID09PSAnc3ZnJyA/IEljb25UeXBlLlNWRyA6IEljb25UeXBlLkZPTlQ7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbmFtZSBvZiB0aGUgaWNvbi4gKi9cbiAgYXN5bmMgZ2V0TmFtZSgpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy5ob3N0KCk7XG4gICAgY29uc3QgbmFtZUZyb21Eb20gPSBhd2FpdCBob3N0LmdldEF0dHJpYnV0ZSgnZGF0YS1tYXQtaWNvbi1uYW1lJyk7XG5cbiAgICAvLyBJZiB3ZSBtYW5hZ2VkIHRvIGZpZ3VyZSBvdXQgdGhlIG5hbWUgZnJvbSB0aGUgYXR0cmlidXRlLCB1c2UgaXQuXG4gICAgaWYgKG5hbWVGcm9tRG9tKSB7XG4gICAgICByZXR1cm4gbmFtZUZyb21Eb207XG4gICAgfVxuXG4gICAgLy8gU29tZSBpY29ucyBzdXBwb3J0IGRlZmluaW5nIHRoZSBpY29uIGFzIGEgbGlnYXR1cmUuXG4gICAgLy8gQXMgYSBmYWxsYmFjaywgdHJ5IHRvIGV4dHJhY3QgaXQgZnJvbSB0aGUgRE9NIHRleHQuXG4gICAgaWYgKChhd2FpdCB0aGlzLmdldFR5cGUoKSkgPT09IEljb25UeXBlLkZPTlQpIHtcbiAgICAgIHJldHVybiBob3N0LnRleHQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBuYW1lc3BhY2Ugb2YgdGhlIGljb24uICovXG4gIGFzeW5jIGdldE5hbWVzcGFjZSgpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2RhdGEtbWF0LWljb24tbmFtZXNwYWNlJyk7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIHRoZSBpY29uIGlzIGlubGluZS4gKi9cbiAgYXN5bmMgaXNJbmxpbmUoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ21hdC1pY29uLWlubGluZScpO1xuICB9XG59XG4iXX0=