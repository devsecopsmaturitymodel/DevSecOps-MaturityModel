/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/core/schematics/utils/load_esm", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.loadCompilerCliMigrationsModule = exports.loadEsmModule = void 0;
    /**
     * This uses a dynamic import to load a module which may be ESM.
     * CommonJS code can load ESM code via a dynamic import. Unfortunately, TypeScript
     * will currently, unconditionally downlevel dynamic import into a require call.
     * require calls cannot load ESM code and will result in a runtime error. To workaround
     * this, a Function constructor is used to prevent TypeScript from changing the dynamic import.
     * Once TypeScript provides support for keeping the dynamic import this workaround can
     * be dropped.
     * This is only intended to be used with Angular framework packages.
     *
     * @param modulePath The path of the module to load.
     * @returns A Promise that resolves to the dynamically imported module.
     */
    function loadEsmModule(modulePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const namespaceObject = (yield new Function('modulePath', `return import(modulePath);`)(modulePath));
            // If it is not ESM then the values needed will be stored in the `default` property.
            // TODO_ESM: This can be removed once `@angular/*` packages are ESM only.
            if (namespaceObject.default) {
                return namespaceObject.default;
            }
            else {
                return namespaceObject;
            }
        });
    }
    exports.loadEsmModule = loadEsmModule;
    /**
     * Attempt to load the new `@angular/compiler-cli/private/migrations` entry. If not yet present
     * the previous deep imports are used to constructor an equivalent object.
     *
     * @returns A Promise that resolves to the dynamically imported compiler-cli private migrations
     * entry or an equivalent object if not available.
     */
    function loadCompilerCliMigrationsModule() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield loadEsmModule('@angular/compiler-cli/private/migrations');
            }
            catch (_a) {
                // rules_nodejs currently does not support exports field entries. This is a temporary workaround
                // that leverages devmode currently being CommonJS. If that changes before rules_nodejs supports
                // exports then this workaround needs to be reworked.
                // TODO_ESM: This can be removed once Bazel supports exports fields.
                return require('@angular/compiler-cli/private/migrations.js');
            }
        });
    }
    exports.loadCompilerCliMigrationsModule = loadCompilerCliMigrationsModule;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZF9lc20uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NjaGVtYXRpY3MvdXRpbHMvbG9hZF9lc20udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBSUg7Ozs7Ozs7Ozs7OztPQVlHO0lBQ0gsU0FBc0IsYUFBYSxDQUFJLFVBQXNCOztZQUMzRCxNQUFNLGVBQWUsR0FDakIsQ0FBQyxNQUFNLElBQUksUUFBUSxDQUFDLFlBQVksRUFBRSw0QkFBNEIsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFFakYsb0ZBQW9GO1lBQ3BGLHlFQUF5RTtZQUN6RSxJQUFJLGVBQWUsQ0FBQyxPQUFPLEVBQUU7Z0JBQzNCLE9BQU8sZUFBZSxDQUFDLE9BQU8sQ0FBQzthQUNoQztpQkFBTTtnQkFDTCxPQUFPLGVBQWUsQ0FBQzthQUN4QjtRQUNILENBQUM7S0FBQTtJQVhELHNDQVdDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsU0FBc0IsK0JBQStCOztZQUVuRCxJQUFJO2dCQUNGLE9BQU8sTUFBTSxhQUFhLENBQUMsMENBQTBDLENBQUMsQ0FBQzthQUN4RTtZQUFDLFdBQU07Z0JBQ04sZ0dBQWdHO2dCQUNoRyxnR0FBZ0c7Z0JBQ2hHLHFEQUFxRDtnQkFDckQsb0VBQW9FO2dCQUNwRSxPQUFPLE9BQU8sQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO2FBQy9EO1FBQ0gsQ0FBQztLQUFBO0lBWEQsMEVBV0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtVUkx9IGZyb20gJ3VybCc7XG5cbi8qKlxuICogVGhpcyB1c2VzIGEgZHluYW1pYyBpbXBvcnQgdG8gbG9hZCBhIG1vZHVsZSB3aGljaCBtYXkgYmUgRVNNLlxuICogQ29tbW9uSlMgY29kZSBjYW4gbG9hZCBFU00gY29kZSB2aWEgYSBkeW5hbWljIGltcG9ydC4gVW5mb3J0dW5hdGVseSwgVHlwZVNjcmlwdFxuICogd2lsbCBjdXJyZW50bHksIHVuY29uZGl0aW9uYWxseSBkb3dubGV2ZWwgZHluYW1pYyBpbXBvcnQgaW50byBhIHJlcXVpcmUgY2FsbC5cbiAqIHJlcXVpcmUgY2FsbHMgY2Fubm90IGxvYWQgRVNNIGNvZGUgYW5kIHdpbGwgcmVzdWx0IGluIGEgcnVudGltZSBlcnJvci4gVG8gd29ya2Fyb3VuZFxuICogdGhpcywgYSBGdW5jdGlvbiBjb25zdHJ1Y3RvciBpcyB1c2VkIHRvIHByZXZlbnQgVHlwZVNjcmlwdCBmcm9tIGNoYW5naW5nIHRoZSBkeW5hbWljIGltcG9ydC5cbiAqIE9uY2UgVHlwZVNjcmlwdCBwcm92aWRlcyBzdXBwb3J0IGZvciBrZWVwaW5nIHRoZSBkeW5hbWljIGltcG9ydCB0aGlzIHdvcmthcm91bmQgY2FuXG4gKiBiZSBkcm9wcGVkLlxuICogVGhpcyBpcyBvbmx5IGludGVuZGVkIHRvIGJlIHVzZWQgd2l0aCBBbmd1bGFyIGZyYW1ld29yayBwYWNrYWdlcy5cbiAqXG4gKiBAcGFyYW0gbW9kdWxlUGF0aCBUaGUgcGF0aCBvZiB0aGUgbW9kdWxlIHRvIGxvYWQuXG4gKiBAcmV0dXJucyBBIFByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0aGUgZHluYW1pY2FsbHkgaW1wb3J0ZWQgbW9kdWxlLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9hZEVzbU1vZHVsZTxUPihtb2R1bGVQYXRoOiBzdHJpbmd8VVJMKTogUHJvbWlzZTxUPiB7XG4gIGNvbnN0IG5hbWVzcGFjZU9iamVjdCA9XG4gICAgICAoYXdhaXQgbmV3IEZ1bmN0aW9uKCdtb2R1bGVQYXRoJywgYHJldHVybiBpbXBvcnQobW9kdWxlUGF0aCk7YCkobW9kdWxlUGF0aCkpO1xuXG4gIC8vIElmIGl0IGlzIG5vdCBFU00gdGhlbiB0aGUgdmFsdWVzIG5lZWRlZCB3aWxsIGJlIHN0b3JlZCBpbiB0aGUgYGRlZmF1bHRgIHByb3BlcnR5LlxuICAvLyBUT0RPX0VTTTogVGhpcyBjYW4gYmUgcmVtb3ZlZCBvbmNlIGBAYW5ndWxhci8qYCBwYWNrYWdlcyBhcmUgRVNNIG9ubHkuXG4gIGlmIChuYW1lc3BhY2VPYmplY3QuZGVmYXVsdCkge1xuICAgIHJldHVybiBuYW1lc3BhY2VPYmplY3QuZGVmYXVsdDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmFtZXNwYWNlT2JqZWN0O1xuICB9XG59XG5cbi8qKlxuICogQXR0ZW1wdCB0byBsb2FkIHRoZSBuZXcgYEBhbmd1bGFyL2NvbXBpbGVyLWNsaS9wcml2YXRlL21pZ3JhdGlvbnNgIGVudHJ5LiBJZiBub3QgeWV0IHByZXNlbnRcbiAqIHRoZSBwcmV2aW91cyBkZWVwIGltcG9ydHMgYXJlIHVzZWQgdG8gY29uc3RydWN0b3IgYW4gZXF1aXZhbGVudCBvYmplY3QuXG4gKlxuICogQHJldHVybnMgQSBQcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gdGhlIGR5bmFtaWNhbGx5IGltcG9ydGVkIGNvbXBpbGVyLWNsaSBwcml2YXRlIG1pZ3JhdGlvbnNcbiAqIGVudHJ5IG9yIGFuIGVxdWl2YWxlbnQgb2JqZWN0IGlmIG5vdCBhdmFpbGFibGUuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2FkQ29tcGlsZXJDbGlNaWdyYXRpb25zTW9kdWxlKCk6XG4gICAgUHJvbWlzZTx0eXBlb2YgaW1wb3J0KCdAYW5ndWxhci9jb21waWxlci1jbGkvcHJpdmF0ZS9taWdyYXRpb25zJyk+IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gYXdhaXQgbG9hZEVzbU1vZHVsZSgnQGFuZ3VsYXIvY29tcGlsZXItY2xpL3ByaXZhdGUvbWlncmF0aW9ucycpO1xuICB9IGNhdGNoIHtcbiAgICAvLyBydWxlc19ub2RlanMgY3VycmVudGx5IGRvZXMgbm90IHN1cHBvcnQgZXhwb3J0cyBmaWVsZCBlbnRyaWVzLiBUaGlzIGlzIGEgdGVtcG9yYXJ5IHdvcmthcm91bmRcbiAgICAvLyB0aGF0IGxldmVyYWdlcyBkZXZtb2RlIGN1cnJlbnRseSBiZWluZyBDb21tb25KUy4gSWYgdGhhdCBjaGFuZ2VzIGJlZm9yZSBydWxlc19ub2RlanMgc3VwcG9ydHNcbiAgICAvLyBleHBvcnRzIHRoZW4gdGhpcyB3b3JrYXJvdW5kIG5lZWRzIHRvIGJlIHJld29ya2VkLlxuICAgIC8vIFRPRE9fRVNNOiBUaGlzIGNhbiBiZSByZW1vdmVkIG9uY2UgQmF6ZWwgc3VwcG9ydHMgZXhwb3J0cyBmaWVsZHMuXG4gICAgcmV0dXJuIHJlcXVpcmUoJ0Bhbmd1bGFyL2NvbXBpbGVyLWNsaS9wcml2YXRlL21pZ3JhdGlvbnMuanMnKTtcbiAgfVxufVxuIl19