/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CompilerConfig } from '@angular/compiler';
import { Compiler, InjectionToken, Injector, isDevMode, MissingTranslationStrategy, PACKAGE_ROOT_URL, ViewEncapsulation } from '@angular/core';
export const ERROR_COLLECTOR_TOKEN = new InjectionToken('ErrorCollector');
/**
 * A default provider for {@link PACKAGE_ROOT_URL} that maps to '/'.
 */
export const DEFAULT_PACKAGE_URL_PROVIDER = {
    provide: PACKAGE_ROOT_URL,
    useValue: '/'
};
export const COMPILER_PROVIDERS = [{ provide: Compiler, useFactory: () => new Compiler() }];
/**
 * @publicApi
 *
 * @deprecated
 * Ivy JIT mode doesn't require accessing this symbol.
 * See [JIT API changes due to ViewEngine deprecation](guide/deprecations#jit-api-changes) for
 * additional context.
 */
export class JitCompilerFactory {
    /* @internal */
    constructor(defaultOptions) {
        const compilerOptions = {
            useJit: true,
            defaultEncapsulation: ViewEncapsulation.Emulated,
            missingTranslation: MissingTranslationStrategy.Warning,
        };
        this._defaultOptions = [compilerOptions, ...defaultOptions];
    }
    createCompiler(options = []) {
        const opts = _mergeOptions(this._defaultOptions.concat(options));
        const injector = Injector.create([
            COMPILER_PROVIDERS, {
                provide: CompilerConfig,
                useFactory: () => {
                    return new CompilerConfig({
                        // let explicit values from the compiler options overwrite options
                        // from the app providers
                        useJit: opts.useJit,
                        jitDevMode: isDevMode(),
                        // let explicit values from the compiler options overwrite options
                        // from the app providers
                        defaultEncapsulation: opts.defaultEncapsulation,
                        missingTranslation: opts.missingTranslation,
                        preserveWhitespaces: opts.preserveWhitespaces,
                    });
                },
                deps: []
            },
            opts.providers
        ]);
        return injector.get(Compiler);
    }
}
function _mergeOptions(optionsArr) {
    return {
        useJit: _lastDefined(optionsArr.map(options => options.useJit)),
        defaultEncapsulation: _lastDefined(optionsArr.map(options => options.defaultEncapsulation)),
        providers: _mergeArrays(optionsArr.map(options => options.providers)),
        missingTranslation: _lastDefined(optionsArr.map(options => options.missingTranslation)),
        preserveWhitespaces: _lastDefined(optionsArr.map(options => options.preserveWhitespaces)),
    };
}
function _lastDefined(args) {
    for (let i = args.length - 1; i >= 0; i--) {
        if (args[i] !== undefined) {
            return args[i];
        }
    }
    return undefined;
}
function _mergeArrays(parts) {
    const result = [];
    parts.forEach((part) => part && result.push(...part));
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXJfZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLWJyb3dzZXItZHluYW1pYy9zcmMvY29tcGlsZXJfZmFjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDakQsT0FBTyxFQUFDLFFBQVEsRUFBb0MsY0FBYyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsMEJBQTBCLEVBQUUsZ0JBQWdCLEVBQWtCLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRS9MLE1BQU0sQ0FBQyxNQUFNLHFCQUFxQixHQUFHLElBQUksY0FBYyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFFMUU7O0dBRUc7QUFDSCxNQUFNLENBQUMsTUFBTSw0QkFBNEIsR0FBRztJQUMxQyxPQUFPLEVBQUUsZ0JBQWdCO0lBQ3pCLFFBQVEsRUFBRSxHQUFHO0NBQ2QsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLGtCQUFrQixHQUNULENBQUMsRUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLFFBQVEsRUFBRSxFQUFDLENBQUMsQ0FBQztBQUM5RTs7Ozs7OztHQU9HO0FBQ0gsTUFBTSxPQUFPLGtCQUFrQjtJQUc3QixlQUFlO0lBQ2YsWUFBWSxjQUFpQztRQUMzQyxNQUFNLGVBQWUsR0FBb0I7WUFDdkMsTUFBTSxFQUFFLElBQUk7WUFDWixvQkFBb0IsRUFBRSxpQkFBaUIsQ0FBQyxRQUFRO1lBQ2hELGtCQUFrQixFQUFFLDBCQUEwQixDQUFDLE9BQU87U0FDdkQsQ0FBQztRQUVGLElBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxlQUFlLEVBQUUsR0FBRyxjQUFjLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBQ0QsY0FBYyxDQUFDLFVBQTZCLEVBQUU7UUFDNUMsTUFBTSxJQUFJLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDakUsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztZQUMvQixrQkFBa0IsRUFBRTtnQkFDbEIsT0FBTyxFQUFFLGNBQWM7Z0JBQ3ZCLFVBQVUsRUFBRSxHQUFHLEVBQUU7b0JBQ2YsT0FBTyxJQUFJLGNBQWMsQ0FBQzt3QkFDeEIsa0VBQWtFO3dCQUNsRSx5QkFBeUI7d0JBQ3pCLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTt3QkFDbkIsVUFBVSxFQUFFLFNBQVMsRUFBRTt3QkFDdkIsa0VBQWtFO3dCQUNsRSx5QkFBeUI7d0JBQ3pCLG9CQUFvQixFQUFFLElBQUksQ0FBQyxvQkFBb0I7d0JBQy9DLGtCQUFrQixFQUFFLElBQUksQ0FBQyxrQkFBa0I7d0JBQzNDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxtQkFBbUI7cUJBQzlDLENBQUMsQ0FBQztnQkFDTCxDQUFDO2dCQUNELElBQUksRUFBRSxFQUFFO2FBQ1Q7WUFDRCxJQUFJLENBQUMsU0FBVTtTQUNoQixDQUFDLENBQUM7UUFDSCxPQUFPLFFBQVEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDaEMsQ0FBQztDQUNGO0FBRUQsU0FBUyxhQUFhLENBQUMsVUFBNkI7SUFDbEQsT0FBTztRQUNMLE1BQU0sRUFBRSxZQUFZLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvRCxvQkFBb0IsRUFBRSxZQUFZLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQzNGLFNBQVMsRUFBRSxZQUFZLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFVLENBQUMsQ0FBQztRQUN0RSxrQkFBa0IsRUFBRSxZQUFZLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3ZGLG1CQUFtQixFQUFFLFlBQVksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7S0FDMUYsQ0FBQztBQUNKLENBQUM7QUFFRCxTQUFTLFlBQVksQ0FBSSxJQUFTO0lBQ2hDLEtBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN6QyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLEVBQUU7WUFDekIsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDaEI7S0FDRjtJQUNELE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUM7QUFFRCxTQUFTLFlBQVksQ0FBQyxLQUFjO0lBQ2xDLE1BQU0sTUFBTSxHQUFVLEVBQUUsQ0FBQztJQUN6QixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDdEQsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbXBpbGVyQ29uZmlnfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XG5pbXBvcnQge0NvbXBpbGVyLCBDb21waWxlckZhY3RvcnksIENvbXBpbGVyT3B0aW9ucywgSW5qZWN0aW9uVG9rZW4sIEluamVjdG9yLCBpc0Rldk1vZGUsIE1pc3NpbmdUcmFuc2xhdGlvblN0cmF0ZWd5LCBQQUNLQUdFX1JPT1RfVVJMLCBTdGF0aWNQcm92aWRlciwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5leHBvcnQgY29uc3QgRVJST1JfQ09MTEVDVE9SX1RPS0VOID0gbmV3IEluamVjdGlvblRva2VuKCdFcnJvckNvbGxlY3RvcicpO1xuXG4vKipcbiAqIEEgZGVmYXVsdCBwcm92aWRlciBmb3Ige0BsaW5rIFBBQ0tBR0VfUk9PVF9VUkx9IHRoYXQgbWFwcyB0byAnLycuXG4gKi9cbmV4cG9ydCBjb25zdCBERUZBVUxUX1BBQ0tBR0VfVVJMX1BST1ZJREVSID0ge1xuICBwcm92aWRlOiBQQUNLQUdFX1JPT1RfVVJMLFxuICB1c2VWYWx1ZTogJy8nXG59O1xuXG5leHBvcnQgY29uc3QgQ09NUElMRVJfUFJPVklERVJTID1cbiAgICA8U3RhdGljUHJvdmlkZXJbXT5be3Byb3ZpZGU6IENvbXBpbGVyLCB1c2VGYWN0b3J5OiAoKSA9PiBuZXcgQ29tcGlsZXIoKX1dO1xuLyoqXG4gKiBAcHVibGljQXBpXG4gKlxuICogQGRlcHJlY2F0ZWRcbiAqIEl2eSBKSVQgbW9kZSBkb2Vzbid0IHJlcXVpcmUgYWNjZXNzaW5nIHRoaXMgc3ltYm9sLlxuICogU2VlIFtKSVQgQVBJIGNoYW5nZXMgZHVlIHRvIFZpZXdFbmdpbmUgZGVwcmVjYXRpb25dKGd1aWRlL2RlcHJlY2F0aW9ucyNqaXQtYXBpLWNoYW5nZXMpIGZvclxuICogYWRkaXRpb25hbCBjb250ZXh0LlxuICovXG5leHBvcnQgY2xhc3MgSml0Q29tcGlsZXJGYWN0b3J5IGltcGxlbWVudHMgQ29tcGlsZXJGYWN0b3J5IHtcbiAgcHJpdmF0ZSBfZGVmYXVsdE9wdGlvbnM6IENvbXBpbGVyT3B0aW9uc1tdO1xuXG4gIC8qIEBpbnRlcm5hbCAqL1xuICBjb25zdHJ1Y3RvcihkZWZhdWx0T3B0aW9uczogQ29tcGlsZXJPcHRpb25zW10pIHtcbiAgICBjb25zdCBjb21waWxlck9wdGlvbnM6IENvbXBpbGVyT3B0aW9ucyA9IHtcbiAgICAgIHVzZUppdDogdHJ1ZSxcbiAgICAgIGRlZmF1bHRFbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5FbXVsYXRlZCxcbiAgICAgIG1pc3NpbmdUcmFuc2xhdGlvbjogTWlzc2luZ1RyYW5zbGF0aW9uU3RyYXRlZ3kuV2FybmluZyxcbiAgICB9O1xuXG4gICAgdGhpcy5fZGVmYXVsdE9wdGlvbnMgPSBbY29tcGlsZXJPcHRpb25zLCAuLi5kZWZhdWx0T3B0aW9uc107XG4gIH1cbiAgY3JlYXRlQ29tcGlsZXIob3B0aW9uczogQ29tcGlsZXJPcHRpb25zW10gPSBbXSk6IENvbXBpbGVyIHtcbiAgICBjb25zdCBvcHRzID0gX21lcmdlT3B0aW9ucyh0aGlzLl9kZWZhdWx0T3B0aW9ucy5jb25jYXQob3B0aW9ucykpO1xuICAgIGNvbnN0IGluamVjdG9yID0gSW5qZWN0b3IuY3JlYXRlKFtcbiAgICAgIENPTVBJTEVSX1BST1ZJREVSUywge1xuICAgICAgICBwcm92aWRlOiBDb21waWxlckNvbmZpZyxcbiAgICAgICAgdXNlRmFjdG9yeTogKCkgPT4ge1xuICAgICAgICAgIHJldHVybiBuZXcgQ29tcGlsZXJDb25maWcoe1xuICAgICAgICAgICAgLy8gbGV0IGV4cGxpY2l0IHZhbHVlcyBmcm9tIHRoZSBjb21waWxlciBvcHRpb25zIG92ZXJ3cml0ZSBvcHRpb25zXG4gICAgICAgICAgICAvLyBmcm9tIHRoZSBhcHAgcHJvdmlkZXJzXG4gICAgICAgICAgICB1c2VKaXQ6IG9wdHMudXNlSml0LFxuICAgICAgICAgICAgaml0RGV2TW9kZTogaXNEZXZNb2RlKCksXG4gICAgICAgICAgICAvLyBsZXQgZXhwbGljaXQgdmFsdWVzIGZyb20gdGhlIGNvbXBpbGVyIG9wdGlvbnMgb3ZlcndyaXRlIG9wdGlvbnNcbiAgICAgICAgICAgIC8vIGZyb20gdGhlIGFwcCBwcm92aWRlcnNcbiAgICAgICAgICAgIGRlZmF1bHRFbmNhcHN1bGF0aW9uOiBvcHRzLmRlZmF1bHRFbmNhcHN1bGF0aW9uLFxuICAgICAgICAgICAgbWlzc2luZ1RyYW5zbGF0aW9uOiBvcHRzLm1pc3NpbmdUcmFuc2xhdGlvbixcbiAgICAgICAgICAgIHByZXNlcnZlV2hpdGVzcGFjZXM6IG9wdHMucHJlc2VydmVXaGl0ZXNwYWNlcyxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgZGVwczogW11cbiAgICAgIH0sXG4gICAgICBvcHRzLnByb3ZpZGVycyFcbiAgICBdKTtcbiAgICByZXR1cm4gaW5qZWN0b3IuZ2V0KENvbXBpbGVyKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfbWVyZ2VPcHRpb25zKG9wdGlvbnNBcnI6IENvbXBpbGVyT3B0aW9uc1tdKTogQ29tcGlsZXJPcHRpb25zIHtcbiAgcmV0dXJuIHtcbiAgICB1c2VKaXQ6IF9sYXN0RGVmaW5lZChvcHRpb25zQXJyLm1hcChvcHRpb25zID0+IG9wdGlvbnMudXNlSml0KSksXG4gICAgZGVmYXVsdEVuY2Fwc3VsYXRpb246IF9sYXN0RGVmaW5lZChvcHRpb25zQXJyLm1hcChvcHRpb25zID0+IG9wdGlvbnMuZGVmYXVsdEVuY2Fwc3VsYXRpb24pKSxcbiAgICBwcm92aWRlcnM6IF9tZXJnZUFycmF5cyhvcHRpb25zQXJyLm1hcChvcHRpb25zID0+IG9wdGlvbnMucHJvdmlkZXJzISkpLFxuICAgIG1pc3NpbmdUcmFuc2xhdGlvbjogX2xhc3REZWZpbmVkKG9wdGlvbnNBcnIubWFwKG9wdGlvbnMgPT4gb3B0aW9ucy5taXNzaW5nVHJhbnNsYXRpb24pKSxcbiAgICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBfbGFzdERlZmluZWQob3B0aW9uc0Fyci5tYXAob3B0aW9ucyA9PiBvcHRpb25zLnByZXNlcnZlV2hpdGVzcGFjZXMpKSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gX2xhc3REZWZpbmVkPFQ+KGFyZ3M6IFRbXSk6IFR8dW5kZWZpbmVkIHtcbiAgZm9yIChsZXQgaSA9IGFyZ3MubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBpZiAoYXJnc1tpXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gYXJnc1tpXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gX21lcmdlQXJyYXlzKHBhcnRzOiBhbnlbXVtdKTogYW55W10ge1xuICBjb25zdCByZXN1bHQ6IGFueVtdID0gW107XG4gIHBhcnRzLmZvckVhY2goKHBhcnQpID0+IHBhcnQgJiYgcmVzdWx0LnB1c2goLi4ucGFydCkpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuIl19