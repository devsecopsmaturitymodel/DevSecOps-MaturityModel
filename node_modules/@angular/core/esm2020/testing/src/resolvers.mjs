/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Component, Directive, NgModule, Pipe, ɵReflectionCapabilities as ReflectionCapabilities } from '@angular/core';
import { MetadataOverrider } from './metadata_overrider';
const reflection = new ReflectionCapabilities();
/**
 * Allows to override ivy metadata for tests (via the `TestBed`).
 */
class OverrideResolver {
    constructor() {
        this.overrides = new Map();
        this.resolved = new Map();
    }
    addOverride(type, override) {
        const overrides = this.overrides.get(type) || [];
        overrides.push(override);
        this.overrides.set(type, overrides);
        this.resolved.delete(type);
    }
    setOverrides(overrides) {
        this.overrides.clear();
        overrides.forEach(([type, override]) => {
            this.addOverride(type, override);
        });
    }
    getAnnotation(type) {
        const annotations = reflection.annotations(type);
        // Try to find the nearest known Type annotation and make sure that this annotation is an
        // instance of the type we are looking for, so we can use it for resolution. Note: there might
        // be multiple known annotations found due to the fact that Components can extend Directives (so
        // both Directive and Component annotations would be present), so we always check if the known
        // annotation has the right type.
        for (let i = annotations.length - 1; i >= 0; i--) {
            const annotation = annotations[i];
            const isKnownType = annotation instanceof Directive || annotation instanceof Component ||
                annotation instanceof Pipe || annotation instanceof NgModule;
            if (isKnownType) {
                return annotation instanceof this.type ? annotation : null;
            }
        }
        return null;
    }
    resolve(type) {
        let resolved = this.resolved.get(type) || null;
        if (!resolved) {
            resolved = this.getAnnotation(type);
            if (resolved) {
                const overrides = this.overrides.get(type);
                if (overrides) {
                    const overrider = new MetadataOverrider();
                    overrides.forEach(override => {
                        resolved = overrider.overrideMetadata(this.type, resolved, override);
                    });
                }
            }
            this.resolved.set(type, resolved);
        }
        return resolved;
    }
}
export class DirectiveResolver extends OverrideResolver {
    get type() {
        return Directive;
    }
}
export class ComponentResolver extends OverrideResolver {
    get type() {
        return Component;
    }
}
export class PipeResolver extends OverrideResolver {
    get type() {
        return Pipe;
    }
}
export class NgModuleResolver extends OverrideResolver {
    get type() {
        return NgModule;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb2x2ZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0aW5nL3NyYy9yZXNvbHZlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBUSx1QkFBdUIsSUFBSSxzQkFBc0IsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUc1SCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUV2RCxNQUFNLFVBQVUsR0FBRyxJQUFJLHNCQUFzQixFQUFFLENBQUM7QUFXaEQ7O0dBRUc7QUFDSCxNQUFlLGdCQUFnQjtJQUEvQjtRQUNVLGNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBb0MsQ0FBQztRQUN4RCxhQUFRLEdBQUcsSUFBSSxHQUFHLEVBQXFCLENBQUM7SUF1RGxELENBQUM7SUFuREMsV0FBVyxDQUFDLElBQWUsRUFBRSxRQUE2QjtRQUN4RCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDakQsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN6QixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVELFlBQVksQ0FBQyxTQUFrRDtRQUM3RCxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3ZCLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsRUFBRSxFQUFFO1lBQ3JDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELGFBQWEsQ0FBQyxJQUFlO1FBQzNCLE1BQU0sV0FBVyxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakQseUZBQXlGO1FBQ3pGLDhGQUE4RjtRQUM5RixnR0FBZ0c7UUFDaEcsOEZBQThGO1FBQzlGLGlDQUFpQztRQUNqQyxLQUFLLElBQUksQ0FBQyxHQUFHLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDaEQsTUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLE1BQU0sV0FBVyxHQUFHLFVBQVUsWUFBWSxTQUFTLElBQUksVUFBVSxZQUFZLFNBQVM7Z0JBQ2xGLFVBQVUsWUFBWSxJQUFJLElBQUksVUFBVSxZQUFZLFFBQVEsQ0FBQztZQUNqRSxJQUFJLFdBQVcsRUFBRTtnQkFDZixPQUFPLFVBQVUsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFlLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQzthQUNqRTtTQUNGO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsT0FBTyxDQUFDLElBQWU7UUFDckIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDO1FBRS9DLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDYixRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwQyxJQUFJLFFBQVEsRUFBRTtnQkFDWixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDM0MsSUFBSSxTQUFTLEVBQUU7b0JBQ2IsTUFBTSxTQUFTLEdBQUcsSUFBSSxpQkFBaUIsRUFBRSxDQUFDO29CQUMxQyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFO3dCQUMzQixRQUFRLEdBQUcsU0FBUyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO29CQUN4RSxDQUFDLENBQUMsQ0FBQztpQkFDSjthQUNGO1lBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQ25DO1FBRUQsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQztDQUNGO0FBR0QsTUFBTSxPQUFPLGlCQUFrQixTQUFRLGdCQUEyQjtJQUNoRSxJQUFhLElBQUk7UUFDZixPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0NBQ0Y7QUFFRCxNQUFNLE9BQU8saUJBQWtCLFNBQVEsZ0JBQTJCO0lBQ2hFLElBQWEsSUFBSTtRQUNmLE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7Q0FDRjtBQUVELE1BQU0sT0FBTyxZQUFhLFNBQVEsZ0JBQXNCO0lBQ3RELElBQWEsSUFBSTtRQUNmLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztDQUNGO0FBRUQsTUFBTSxPQUFPLGdCQUFpQixTQUFRLGdCQUEwQjtJQUM5RCxJQUFhLElBQUk7UUFDZixPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnQsIERpcmVjdGl2ZSwgTmdNb2R1bGUsIFBpcGUsIFR5cGUsIMm1UmVmbGVjdGlvbkNhcGFiaWxpdGllcyBhcyBSZWZsZWN0aW9uQ2FwYWJpbGl0aWVzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtNZXRhZGF0YU92ZXJyaWRlfSBmcm9tICcuL21ldGFkYXRhX292ZXJyaWRlJztcbmltcG9ydCB7TWV0YWRhdGFPdmVycmlkZXJ9IGZyb20gJy4vbWV0YWRhdGFfb3ZlcnJpZGVyJztcblxuY29uc3QgcmVmbGVjdGlvbiA9IG5ldyBSZWZsZWN0aW9uQ2FwYWJpbGl0aWVzKCk7XG5cbi8qKlxuICogQmFzZSBpbnRlcmZhY2UgdG8gcmVzb2x2ZSBgQENvbXBvbmVudGAsIGBARGlyZWN0aXZlYCwgYEBQaXBlYCBhbmQgYEBOZ01vZHVsZWAuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmVzb2x2ZXI8VD4ge1xuICBhZGRPdmVycmlkZSh0eXBlOiBUeXBlPGFueT4sIG92ZXJyaWRlOiBNZXRhZGF0YU92ZXJyaWRlPFQ+KTogdm9pZDtcbiAgc2V0T3ZlcnJpZGVzKG92ZXJyaWRlczogQXJyYXk8W1R5cGU8YW55PiwgTWV0YWRhdGFPdmVycmlkZTxUPl0+KTogdm9pZDtcbiAgcmVzb2x2ZSh0eXBlOiBUeXBlPGFueT4pOiBUfG51bGw7XG59XG5cbi8qKlxuICogQWxsb3dzIHRvIG92ZXJyaWRlIGl2eSBtZXRhZGF0YSBmb3IgdGVzdHMgKHZpYSB0aGUgYFRlc3RCZWRgKS5cbiAqL1xuYWJzdHJhY3QgY2xhc3MgT3ZlcnJpZGVSZXNvbHZlcjxUPiBpbXBsZW1lbnRzIFJlc29sdmVyPFQ+IHtcbiAgcHJpdmF0ZSBvdmVycmlkZXMgPSBuZXcgTWFwPFR5cGU8YW55PiwgTWV0YWRhdGFPdmVycmlkZTxUPltdPigpO1xuICBwcml2YXRlIHJlc29sdmVkID0gbmV3IE1hcDxUeXBlPGFueT4sIFR8bnVsbD4oKTtcblxuICBhYnN0cmFjdCBnZXQgdHlwZSgpOiBhbnk7XG5cbiAgYWRkT3ZlcnJpZGUodHlwZTogVHlwZTxhbnk+LCBvdmVycmlkZTogTWV0YWRhdGFPdmVycmlkZTxUPikge1xuICAgIGNvbnN0IG92ZXJyaWRlcyA9IHRoaXMub3ZlcnJpZGVzLmdldCh0eXBlKSB8fCBbXTtcbiAgICBvdmVycmlkZXMucHVzaChvdmVycmlkZSk7XG4gICAgdGhpcy5vdmVycmlkZXMuc2V0KHR5cGUsIG92ZXJyaWRlcyk7XG4gICAgdGhpcy5yZXNvbHZlZC5kZWxldGUodHlwZSk7XG4gIH1cblxuICBzZXRPdmVycmlkZXMob3ZlcnJpZGVzOiBBcnJheTxbVHlwZTxhbnk+LCBNZXRhZGF0YU92ZXJyaWRlPFQ+XT4pIHtcbiAgICB0aGlzLm92ZXJyaWRlcy5jbGVhcigpO1xuICAgIG92ZXJyaWRlcy5mb3JFYWNoKChbdHlwZSwgb3ZlcnJpZGVdKSA9PiB7XG4gICAgICB0aGlzLmFkZE92ZXJyaWRlKHR5cGUsIG92ZXJyaWRlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldEFubm90YXRpb24odHlwZTogVHlwZTxhbnk+KTogVHxudWxsIHtcbiAgICBjb25zdCBhbm5vdGF0aW9ucyA9IHJlZmxlY3Rpb24uYW5ub3RhdGlvbnModHlwZSk7XG4gICAgLy8gVHJ5IHRvIGZpbmQgdGhlIG5lYXJlc3Qga25vd24gVHlwZSBhbm5vdGF0aW9uIGFuZCBtYWtlIHN1cmUgdGhhdCB0aGlzIGFubm90YXRpb24gaXMgYW5cbiAgICAvLyBpbnN0YW5jZSBvZiB0aGUgdHlwZSB3ZSBhcmUgbG9va2luZyBmb3IsIHNvIHdlIGNhbiB1c2UgaXQgZm9yIHJlc29sdXRpb24uIE5vdGU6IHRoZXJlIG1pZ2h0XG4gICAgLy8gYmUgbXVsdGlwbGUga25vd24gYW5ub3RhdGlvbnMgZm91bmQgZHVlIHRvIHRoZSBmYWN0IHRoYXQgQ29tcG9uZW50cyBjYW4gZXh0ZW5kIERpcmVjdGl2ZXMgKHNvXG4gICAgLy8gYm90aCBEaXJlY3RpdmUgYW5kIENvbXBvbmVudCBhbm5vdGF0aW9ucyB3b3VsZCBiZSBwcmVzZW50KSwgc28gd2UgYWx3YXlzIGNoZWNrIGlmIHRoZSBrbm93blxuICAgIC8vIGFubm90YXRpb24gaGFzIHRoZSByaWdodCB0eXBlLlxuICAgIGZvciAobGV0IGkgPSBhbm5vdGF0aW9ucy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgYW5ub3RhdGlvbiA9IGFubm90YXRpb25zW2ldO1xuICAgICAgY29uc3QgaXNLbm93blR5cGUgPSBhbm5vdGF0aW9uIGluc3RhbmNlb2YgRGlyZWN0aXZlIHx8IGFubm90YXRpb24gaW5zdGFuY2VvZiBDb21wb25lbnQgfHxcbiAgICAgICAgICBhbm5vdGF0aW9uIGluc3RhbmNlb2YgUGlwZSB8fCBhbm5vdGF0aW9uIGluc3RhbmNlb2YgTmdNb2R1bGU7XG4gICAgICBpZiAoaXNLbm93blR5cGUpIHtcbiAgICAgICAgcmV0dXJuIGFubm90YXRpb24gaW5zdGFuY2VvZiB0aGlzLnR5cGUgPyBhbm5vdGF0aW9uIGFzIFQgOiBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJlc29sdmUodHlwZTogVHlwZTxhbnk+KTogVHxudWxsIHtcbiAgICBsZXQgcmVzb2x2ZWQgPSB0aGlzLnJlc29sdmVkLmdldCh0eXBlKSB8fCBudWxsO1xuXG4gICAgaWYgKCFyZXNvbHZlZCkge1xuICAgICAgcmVzb2x2ZWQgPSB0aGlzLmdldEFubm90YXRpb24odHlwZSk7XG4gICAgICBpZiAocmVzb2x2ZWQpIHtcbiAgICAgICAgY29uc3Qgb3ZlcnJpZGVzID0gdGhpcy5vdmVycmlkZXMuZ2V0KHR5cGUpO1xuICAgICAgICBpZiAob3ZlcnJpZGVzKSB7XG4gICAgICAgICAgY29uc3Qgb3ZlcnJpZGVyID0gbmV3IE1ldGFkYXRhT3ZlcnJpZGVyKCk7XG4gICAgICAgICAgb3ZlcnJpZGVzLmZvckVhY2gob3ZlcnJpZGUgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZWQgPSBvdmVycmlkZXIub3ZlcnJpZGVNZXRhZGF0YSh0aGlzLnR5cGUsIHJlc29sdmVkISwgb3ZlcnJpZGUpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLnJlc29sdmVkLnNldCh0eXBlLCByZXNvbHZlZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc29sdmVkO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIERpcmVjdGl2ZVJlc29sdmVyIGV4dGVuZHMgT3ZlcnJpZGVSZXNvbHZlcjxEaXJlY3RpdmU+IHtcbiAgb3ZlcnJpZGUgZ2V0IHR5cGUoKSB7XG4gICAgcmV0dXJuIERpcmVjdGl2ZTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50UmVzb2x2ZXIgZXh0ZW5kcyBPdmVycmlkZVJlc29sdmVyPENvbXBvbmVudD4ge1xuICBvdmVycmlkZSBnZXQgdHlwZSgpIHtcbiAgICByZXR1cm4gQ29tcG9uZW50O1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQaXBlUmVzb2x2ZXIgZXh0ZW5kcyBPdmVycmlkZVJlc29sdmVyPFBpcGU+IHtcbiAgb3ZlcnJpZGUgZ2V0IHR5cGUoKSB7XG4gICAgcmV0dXJuIFBpcGU7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE5nTW9kdWxlUmVzb2x2ZXIgZXh0ZW5kcyBPdmVycmlkZVJlc29sdmVyPE5nTW9kdWxlPiB7XG4gIG92ZXJyaWRlIGdldCB0eXBlKCkge1xuICAgIHJldHVybiBOZ01vZHVsZTtcbiAgfVxufVxuIl19