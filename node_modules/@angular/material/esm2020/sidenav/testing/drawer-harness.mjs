/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/**
 * Base class for the drawer harness functionality.
 * @docs-private
 */
export class MatDrawerHarnessBase extends ContentContainerComponentHarness {
    /** Whether the drawer is open. */
    async isOpen() {
        return (await this.host()).hasClass('mat-drawer-opened');
    }
    /** Gets the position of the drawer inside its container. */
    async getPosition() {
        const host = await this.host();
        return (await host.hasClass('mat-drawer-end')) ? 'end' : 'start';
    }
    /** Gets the mode that the drawer is in. */
    async getMode() {
        const host = await this.host();
        if (await host.hasClass('mat-drawer-push')) {
            return 'push';
        }
        if (await host.hasClass('mat-drawer-side')) {
            return 'side';
        }
        return 'over';
    }
}
/** Harness for interacting with a standard mat-drawer in tests. */
export class MatDrawerHarness extends MatDrawerHarnessBase {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatDrawerHarness` that meets
     * certain criteria.
     * @param options Options for filtering which drawer instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatDrawerHarness, options).addOption('position', options.position, async (harness, position) => (await harness.getPosition()) === position);
    }
}
/** The selector for the host element of a `MatDrawer` instance. */
MatDrawerHarness.hostSelector = '.mat-drawer';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd2VyLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2lkZW5hdi90ZXN0aW5nL2RyYXdlci1oYXJuZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxnQ0FBZ0MsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBR3hGOzs7R0FHRztBQUNILE1BQU0sT0FBTyxvQkFBcUIsU0FBUSxnQ0FBd0M7SUFDaEYsa0NBQWtDO0lBQ2xDLEtBQUssQ0FBQyxNQUFNO1FBQ1YsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELDREQUE0RDtJQUM1RCxLQUFLLENBQUMsV0FBVztRQUNmLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQy9CLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztJQUNuRSxDQUFDO0lBRUQsMkNBQTJDO0lBQzNDLEtBQUssQ0FBQyxPQUFPO1FBQ1gsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFL0IsSUFBSSxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsRUFBRTtZQUMxQyxPQUFPLE1BQU0sQ0FBQztTQUNmO1FBRUQsSUFBSSxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsRUFBRTtZQUMxQyxPQUFPLE1BQU0sQ0FBQztTQUNmO1FBRUQsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztDQUNGO0FBRUQsbUVBQW1FO0FBQ25FLE1BQU0sT0FBTyxnQkFBaUIsU0FBUSxvQkFBb0I7SUFJeEQ7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQWdDLEVBQUU7UUFDNUMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FDOUQsVUFBVSxFQUNWLE9BQU8sQ0FBQyxRQUFRLEVBQ2hCLEtBQUssRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssUUFBUSxDQUN4RSxDQUFDO0lBQ0osQ0FBQzs7QUFmRCxtRUFBbUU7QUFDNUQsNkJBQVksR0FBRyxhQUFhLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb250ZW50Q29udGFpbmVyQ29tcG9uZW50SGFybmVzcywgSGFybmVzc1ByZWRpY2F0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtEcmF3ZXJIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9kcmF3ZXItaGFybmVzcy1maWx0ZXJzJztcblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciB0aGUgZHJhd2VyIGhhcm5lc3MgZnVuY3Rpb25hbGl0eS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNsYXNzIE1hdERyYXdlckhhcm5lc3NCYXNlIGV4dGVuZHMgQ29udGVudENvbnRhaW5lckNvbXBvbmVudEhhcm5lc3M8c3RyaW5nPiB7XG4gIC8qKiBXaGV0aGVyIHRoZSBkcmF3ZXIgaXMgb3Blbi4gKi9cbiAgYXN5bmMgaXNPcGVuKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmhhc0NsYXNzKCdtYXQtZHJhd2VyLW9wZW5lZCcpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHBvc2l0aW9uIG9mIHRoZSBkcmF3ZXIgaW5zaWRlIGl0cyBjb250YWluZXIuICovXG4gIGFzeW5jIGdldFBvc2l0aW9uKCk6IFByb21pc2U8J3N0YXJ0JyB8ICdlbmQnPiB7XG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMuaG9zdCgpO1xuICAgIHJldHVybiAoYXdhaXQgaG9zdC5oYXNDbGFzcygnbWF0LWRyYXdlci1lbmQnKSkgPyAnZW5kJyA6ICdzdGFydCc7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbW9kZSB0aGF0IHRoZSBkcmF3ZXIgaXMgaW4uICovXG4gIGFzeW5jIGdldE1vZGUoKTogUHJvbWlzZTwnb3ZlcicgfCAncHVzaCcgfCAnc2lkZSc+IHtcbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy5ob3N0KCk7XG5cbiAgICBpZiAoYXdhaXQgaG9zdC5oYXNDbGFzcygnbWF0LWRyYXdlci1wdXNoJykpIHtcbiAgICAgIHJldHVybiAncHVzaCc7XG4gICAgfVxuXG4gICAgaWYgKGF3YWl0IGhvc3QuaGFzQ2xhc3MoJ21hdC1kcmF3ZXItc2lkZScpKSB7XG4gICAgICByZXR1cm4gJ3NpZGUnO1xuICAgIH1cblxuICAgIHJldHVybiAnb3Zlcic7XG4gIH1cbn1cblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtZHJhd2VyIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdERyYXdlckhhcm5lc3MgZXh0ZW5kcyBNYXREcmF3ZXJIYXJuZXNzQmFzZSB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0RHJhd2VyYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LWRyYXdlcic7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYE1hdERyYXdlckhhcm5lc3NgIHRoYXQgbWVldHNcbiAgICogY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIGRyYXdlciBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBEcmF3ZXJIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXREcmF3ZXJIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdERyYXdlckhhcm5lc3MsIG9wdGlvbnMpLmFkZE9wdGlvbihcbiAgICAgICdwb3NpdGlvbicsXG4gICAgICBvcHRpb25zLnBvc2l0aW9uLFxuICAgICAgYXN5bmMgKGhhcm5lc3MsIHBvc2l0aW9uKSA9PiAoYXdhaXQgaGFybmVzcy5nZXRQb3NpdGlvbigpKSA9PT0gcG9zaXRpb24sXG4gICAgKTtcbiAgfVxufVxuIl19