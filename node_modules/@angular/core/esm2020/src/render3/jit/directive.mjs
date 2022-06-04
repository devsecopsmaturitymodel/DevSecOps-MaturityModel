/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { getCompilerFacade } from '../../compiler/compiler_facade';
import { resolveForwardRef } from '../../di/forward_ref';
import { getReflect, reflectDependencies } from '../../di/jit/util';
import { componentNeedsResolution, maybeQueueResolutionOfComponentResources } from '../../metadata/resource_loading';
import { ViewEncapsulation } from '../../metadata/view';
import { EMPTY_ARRAY, EMPTY_OBJ } from '../../util/empty';
import { initNgDevMode } from '../../util/ng_dev_mode';
import { getComponentDef, getDirectiveDef } from '../definition';
import { NG_COMP_DEF, NG_DIR_DEF, NG_FACTORY_DEF } from '../fields';
import { stringifyForError } from '../util/stringify_utils';
import { angularCoreEnv } from './environment';
import { getJitOptions } from './jit_options';
import { flushModuleScopingQueueAsMuchAsPossible, patchComponentDefWithScope, transitiveScopesFor } from './module';
/**
 * Keep track of the compilation depth to avoid reentrancy issues during JIT compilation. This
 * matters in the following scenario:
 *
 * Consider a component 'A' that extends component 'B', both declared in module 'M'. During
 * the compilation of 'A' the definition of 'B' is requested to capture the inheritance chain,
 * potentially triggering compilation of 'B'. If this nested compilation were to trigger
 * `flushModuleScopingQueueAsMuchAsPossible` it may happen that module 'M' is still pending in the
 * queue, resulting in 'A' and 'B' to be patched with the NgModule scope. As the compilation of
 * 'A' is still in progress, this would introduce a circular dependency on its compilation. To avoid
 * this issue, the module scope queue is only flushed for compilations at the depth 0, to ensure
 * all compilations have finished.
 */
let compilationDepth = 0;
/**
 * Compile an Angular component according to its decorator metadata, and patch the resulting
 * component def (ɵcmp) onto the component type.
 *
 * Compilation may be asynchronous (due to the need to resolve URLs for the component template or
 * other resources, for example). In the event that compilation is not immediate, `compileComponent`
 * will enqueue resource resolution into a global queue and will fail to return the `ɵcmp`
 * until the global queue has been resolved with a call to `resolveComponentResources`.
 */
export function compileComponent(type, metadata) {
    // Initialize ngDevMode. This must be the first statement in compileComponent.
    // See the `initNgDevMode` docstring for more information.
    (typeof ngDevMode === 'undefined' || ngDevMode) && initNgDevMode();
    let ngComponentDef = null;
    // Metadata may have resources which need to be resolved.
    maybeQueueResolutionOfComponentResources(type, metadata);
    // Note that we're using the same function as `Directive`, because that's only subset of metadata
    // that we need to create the ngFactoryDef. We're avoiding using the component metadata
    // because we'd have to resolve the asynchronous templates.
    addDirectiveFactoryDef(type, metadata);
    Object.defineProperty(type, NG_COMP_DEF, {
        get: () => {
            if (ngComponentDef === null) {
                const compiler = getCompilerFacade({ usage: 0 /* Decorator */, kind: 'component', type: type });
                if (componentNeedsResolution(metadata)) {
                    const error = [`Component '${type.name}' is not resolved:`];
                    if (metadata.templateUrl) {
                        error.push(` - templateUrl: ${metadata.templateUrl}`);
                    }
                    if (metadata.styleUrls && metadata.styleUrls.length) {
                        error.push(` - styleUrls: ${JSON.stringify(metadata.styleUrls)}`);
                    }
                    error.push(`Did you run and wait for 'resolveComponentResources()'?`);
                    throw new Error(error.join('\n'));
                }
                // This const was called `jitOptions` previously but had to be renamed to `options` because
                // of a bug with Terser that caused optimized JIT builds to throw a `ReferenceError`.
                // This bug was investigated in https://github.com/angular/angular-cli/issues/17264.
                // We should not rename it back until https://github.com/terser/terser/issues/615 is fixed.
                const options = getJitOptions();
                let preserveWhitespaces = metadata.preserveWhitespaces;
                if (preserveWhitespaces === undefined) {
                    if (options !== null && options.preserveWhitespaces !== undefined) {
                        preserveWhitespaces = options.preserveWhitespaces;
                    }
                    else {
                        preserveWhitespaces = false;
                    }
                }
                let encapsulation = metadata.encapsulation;
                if (encapsulation === undefined) {
                    if (options !== null && options.defaultEncapsulation !== undefined) {
                        encapsulation = options.defaultEncapsulation;
                    }
                    else {
                        encapsulation = ViewEncapsulation.Emulated;
                    }
                }
                const templateUrl = metadata.templateUrl || `ng:///${type.name}/template.html`;
                const meta = {
                    ...directiveMetadata(type, metadata),
                    typeSourceSpan: compiler.createParseSourceSpan('Component', type.name, templateUrl),
                    template: metadata.template || '',
                    preserveWhitespaces,
                    styles: metadata.styles || EMPTY_ARRAY,
                    animations: metadata.animations,
                    directives: [],
                    changeDetection: metadata.changeDetection,
                    pipes: new Map(),
                    encapsulation,
                    interpolation: metadata.interpolation,
                    viewProviders: metadata.viewProviders || null,
                };
                compilationDepth++;
                try {
                    if (meta.usesInheritance) {
                        addDirectiveDefToUndecoratedParents(type);
                    }
                    ngComponentDef = compiler.compileComponent(angularCoreEnv, templateUrl, meta);
                }
                finally {
                    // Ensure that the compilation depth is decremented even when the compilation failed.
                    compilationDepth--;
                }
                if (compilationDepth === 0) {
                    // When NgModule decorator executed, we enqueued the module definition such that
                    // it would only dequeue and add itself as module scope to all of its declarations,
                    // but only if  if all of its declarations had resolved. This call runs the check
                    // to see if any modules that are in the queue can be dequeued and add scope to
                    // their declarations.
                    flushModuleScopingQueueAsMuchAsPossible();
                }
                // If component compilation is async, then the @NgModule annotation which declares the
                // component may execute and set an ngSelectorScope property on the component type. This
                // allows the component to patch itself with directiveDefs from the module after it
                // finishes compiling.
                if (hasSelectorScope(type)) {
                    const scopes = transitiveScopesFor(type.ngSelectorScope);
                    patchComponentDefWithScope(ngComponentDef, scopes);
                }
            }
            return ngComponentDef;
        },
        // Make the property configurable in dev mode to allow overriding in tests
        configurable: !!ngDevMode,
    });
}
function hasSelectorScope(component) {
    return component.ngSelectorScope !== undefined;
}
/**
 * Compile an Angular directive according to its decorator metadata, and patch the resulting
 * directive def onto the component type.
 *
 * In the event that compilation is not immediate, `compileDirective` will return a `Promise` which
 * will resolve when compilation completes and the directive becomes usable.
 */
export function compileDirective(type, directive) {
    let ngDirectiveDef = null;
    addDirectiveFactoryDef(type, directive || {});
    Object.defineProperty(type, NG_DIR_DEF, {
        get: () => {
            if (ngDirectiveDef === null) {
                // `directive` can be null in the case of abstract directives as a base class
                // that use `@Directive()` with no selector. In that case, pass empty object to the
                // `directiveMetadata` function instead of null.
                const meta = getDirectiveMetadata(type, directive || {});
                const compiler = getCompilerFacade({ usage: 0 /* Decorator */, kind: 'directive', type });
                ngDirectiveDef =
                    compiler.compileDirective(angularCoreEnv, meta.sourceMapUrl, meta.metadata);
            }
            return ngDirectiveDef;
        },
        // Make the property configurable in dev mode to allow overriding in tests
        configurable: !!ngDevMode,
    });
}
function getDirectiveMetadata(type, metadata) {
    const name = type && type.name;
    const sourceMapUrl = `ng:///${name}/ɵdir.js`;
    const compiler = getCompilerFacade({ usage: 0 /* Decorator */, kind: 'directive', type });
    const facade = directiveMetadata(type, metadata);
    facade.typeSourceSpan = compiler.createParseSourceSpan('Directive', name, sourceMapUrl);
    if (facade.usesInheritance) {
        addDirectiveDefToUndecoratedParents(type);
    }
    return { metadata: facade, sourceMapUrl };
}
function addDirectiveFactoryDef(type, metadata) {
    let ngFactoryDef = null;
    Object.defineProperty(type, NG_FACTORY_DEF, {
        get: () => {
            if (ngFactoryDef === null) {
                const meta = getDirectiveMetadata(type, metadata);
                const compiler = getCompilerFacade({ usage: 0 /* Decorator */, kind: 'directive', type });
                ngFactoryDef = compiler.compileFactory(angularCoreEnv, `ng:///${type.name}/ɵfac.js`, {
                    name: meta.metadata.name,
                    type: meta.metadata.type,
                    typeArgumentCount: 0,
                    deps: reflectDependencies(type),
                    target: compiler.FactoryTarget.Directive
                });
            }
            return ngFactoryDef;
        },
        // Make the property configurable in dev mode to allow overriding in tests
        configurable: !!ngDevMode,
    });
}
export function extendsDirectlyFromObject(type) {
    return Object.getPrototypeOf(type.prototype) === Object.prototype;
}
/**
 * Extract the `R3DirectiveMetadata` for a particular directive (either a `Directive` or a
 * `Component`).
 */
export function directiveMetadata(type, metadata) {
    // Reflect inputs and outputs.
    const reflect = getReflect();
    const propMetadata = reflect.ownPropMetadata(type);
    return {
        name: type.name,
        type: type,
        selector: metadata.selector !== undefined ? metadata.selector : null,
        host: metadata.host || EMPTY_OBJ,
        propMetadata: propMetadata,
        inputs: metadata.inputs || EMPTY_ARRAY,
        outputs: metadata.outputs || EMPTY_ARRAY,
        queries: extractQueriesMetadata(type, propMetadata, isContentQuery),
        lifecycle: { usesOnChanges: reflect.hasLifecycleHook(type, 'ngOnChanges') },
        typeSourceSpan: null,
        usesInheritance: !extendsDirectlyFromObject(type),
        exportAs: extractExportAs(metadata.exportAs),
        providers: metadata.providers || null,
        viewQueries: extractQueriesMetadata(type, propMetadata, isViewQuery)
    };
}
/**
 * Adds a directive definition to all parent classes of a type that don't have an Angular decorator.
 */
function addDirectiveDefToUndecoratedParents(type) {
    const objPrototype = Object.prototype;
    let parent = Object.getPrototypeOf(type.prototype).constructor;
    // Go up the prototype until we hit `Object`.
    while (parent && parent !== objPrototype) {
        // Since inheritance works if the class was annotated already, we only need to add
        // the def if there are no annotations and the def hasn't been created already.
        if (!getDirectiveDef(parent) && !getComponentDef(parent) &&
            shouldAddAbstractDirective(parent)) {
            compileDirective(parent, null);
        }
        parent = Object.getPrototypeOf(parent);
    }
}
function convertToR3QueryPredicate(selector) {
    return typeof selector === 'string' ? splitByComma(selector) : resolveForwardRef(selector);
}
export function convertToR3QueryMetadata(propertyName, ann) {
    return {
        propertyName: propertyName,
        predicate: convertToR3QueryPredicate(ann.selector),
        descendants: ann.descendants,
        first: ann.first,
        read: ann.read ? ann.read : null,
        static: !!ann.static,
        emitDistinctChangesOnly: !!ann.emitDistinctChangesOnly,
    };
}
function extractQueriesMetadata(type, propMetadata, isQueryAnn) {
    const queriesMeta = [];
    for (const field in propMetadata) {
        if (propMetadata.hasOwnProperty(field)) {
            const annotations = propMetadata[field];
            annotations.forEach(ann => {
                if (isQueryAnn(ann)) {
                    if (!ann.selector) {
                        throw new Error(`Can't construct a query for the property "${field}" of ` +
                            `"${stringifyForError(type)}" since the query selector wasn't defined.`);
                    }
                    if (annotations.some(isInputAnnotation)) {
                        throw new Error(`Cannot combine @Input decorators with query decorators`);
                    }
                    queriesMeta.push(convertToR3QueryMetadata(field, ann));
                }
            });
        }
    }
    return queriesMeta;
}
function extractExportAs(exportAs) {
    return exportAs === undefined ? null : splitByComma(exportAs);
}
function isContentQuery(value) {
    const name = value.ngMetadataName;
    return name === 'ContentChild' || name === 'ContentChildren';
}
function isViewQuery(value) {
    const name = value.ngMetadataName;
    return name === 'ViewChild' || name === 'ViewChildren';
}
function isInputAnnotation(value) {
    return value.ngMetadataName === 'Input';
}
function splitByComma(value) {
    return value.split(',').map(piece => piece.trim());
}
const LIFECYCLE_HOOKS = [
    'ngOnChanges', 'ngOnInit', 'ngOnDestroy', 'ngDoCheck', 'ngAfterViewInit', 'ngAfterViewChecked',
    'ngAfterContentInit', 'ngAfterContentChecked'
];
function shouldAddAbstractDirective(type) {
    const reflect = getReflect();
    if (LIFECYCLE_HOOKS.some(hookName => reflect.hasLifecycleHook(type, hookName))) {
        return true;
    }
    const propMetadata = reflect.propMetadata(type);
    for (const field in propMetadata) {
        const annotations = propMetadata[field];
        for (let i = 0; i < annotations.length; i++) {
            const current = annotations[i];
            const metadataName = current.ngMetadataName;
            if (isInputAnnotation(current) || isContentQuery(current) || isViewQuery(current) ||
                metadataName === 'Output' || metadataName === 'HostBinding' ||
                metadataName === 'HostListener') {
                return true;
            }
        }
    }
    return false;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvcmVuZGVyMy9qaXQvZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxpQkFBaUIsRUFBOEMsTUFBTSxnQ0FBZ0MsQ0FBQztBQUU5RyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUN2RCxPQUFPLEVBQUMsVUFBVSxFQUFFLG1CQUFtQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFJbEUsT0FBTyxFQUFDLHdCQUF3QixFQUFFLHdDQUF3QyxFQUFDLE1BQU0saUNBQWlDLENBQUM7QUFDbkgsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDdEQsT0FBTyxFQUFDLFdBQVcsRUFBRSxTQUFTLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUN4RCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDckQsT0FBTyxFQUFDLGVBQWUsRUFBRSxlQUFlLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDL0QsT0FBTyxFQUFDLFdBQVcsRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBRWxFLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBRTFELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDN0MsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM1QyxPQUFPLEVBQUMsdUNBQXVDLEVBQUUsMEJBQTBCLEVBQUUsbUJBQW1CLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFFbEg7Ozs7Ozs7Ozs7OztHQVlHO0FBQ0gsSUFBSSxnQkFBZ0IsR0FBRyxDQUFDLENBQUM7QUFFekI7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFN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USxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUU7UUFDOUUsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUVELE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFaEQsS0FBSyxNQUFNLEtBQUssSUFBSSxZQUFZLEVBQUU7UUFDaEMsTUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXhDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzNDLE1BQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQixNQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDO1lBRTVDLElBQUksaUJBQWlCLENBQUMsT0FBTyxDQUFDLElBQUksY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUM7Z0JBQzdFLFlBQVksS0FBSyxRQUFRLElBQUksWUFBWSxLQUFLLGFBQWE7Z0JBQzNELFlBQVksS0FBSyxjQUFjLEVBQUU7Z0JBQ25DLE9BQU8sSUFBSSxDQUFDO2FBQ2I7U0FDRjtLQUNGO0lBRUQsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Z2V0Q29tcGlsZXJGYWNhZGUsIEppdENvbXBpbGVyVXNhZ2UsIFIzRGlyZWN0aXZlTWV0YWRhdGFGYWNhZGV9IGZyb20gJy4uLy4uL2NvbXBpbGVyL2NvbXBpbGVyX2ZhY2FkZSc7XG5pbXBvcnQge1IzQ29tcG9uZW50TWV0YWRhdGFGYWNhZGUsIFIzUXVlcnlNZXRhZGF0YUZhY2FkZX0gZnJvbSAnLi4vLi4vY29tcGlsZXIvY29tcGlsZXJfZmFjYWRlX2ludGVyZmFjZSc7XG5pbXBvcnQge3Jlc29sdmVGb3J3YXJkUmVmfSBmcm9tICcuLi8uLi9kaS9mb3J3YXJkX3JlZic7XG5pbXBvcnQge2dldFJlZmxlY3QsIHJlZmxlY3REZXBlbmRlbmNpZXN9IGZyb20gJy4uLy4uL2RpL2ppdC91dGlsJztcbmltcG9ydCB7VHlwZX0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlL3R5cGUnO1xuaW1wb3J0IHtRdWVyeX0gZnJvbSAnLi4vLi4vbWV0YWRhdGEvZGknO1xuaW1wb3J0IHtDb21wb25lbnQsIERpcmVjdGl2ZSwgSW5wdXR9IGZyb20gJy4uLy4uL21ldGFkYXRhL2RpcmVjdGl2ZXMnO1xuaW1wb3J0IHtjb21wb25lbnROZWVkc1Jlc29sdXRpb24sIG1heWJlUXVldWVSZXNvbHV0aW9uT2ZDb21wb25lbnRSZXNvdXJjZXN9IGZyb20gJy4uLy4uL21ldGFkYXRhL3Jlc291cmNlX2xvYWRpbmcnO1xuaW1wb3J0IHtWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnLi4vLi4vbWV0YWRhdGEvdmlldyc7XG5pbXBvcnQge0VNUFRZX0FSUkFZLCBFTVBUWV9PQkp9IGZyb20gJy4uLy4uL3V0aWwvZW1wdHknO1xuaW1wb3J0IHtpbml0TmdEZXZNb2RlfSBmcm9tICcuLi8uLi91dGlsL25nX2Rldl9tb2RlJztcbmltcG9ydCB7Z2V0Q29tcG9uZW50RGVmLCBnZXREaXJlY3RpdmVEZWZ9IGZyb20gJy4uL2RlZmluaXRpb24nO1xuaW1wb3J0IHtOR19DT01QX0RFRiwgTkdfRElSX0RFRiwgTkdfRkFDVE9SWV9ERUZ9IGZyb20gJy4uL2ZpZWxkcyc7XG5pbXBvcnQge0NvbXBvbmVudFR5cGV9IGZyb20gJy4uL2ludGVyZmFjZXMvZGVmaW5pdGlvbic7XG5pbXBvcnQge3N0cmluZ2lmeUZvckVycm9yfSBmcm9tICcuLi91dGlsL3N0cmluZ2lmeV91dGlscyc7XG5cbmltcG9ydCB7YW5ndWxhckNvcmVFbnZ9IGZyb20gJy4vZW52aXJvbm1lbnQnO1xuaW1wb3J0IHtnZXRKaXRPcHRpb25zfSBmcm9tICcuL2ppdF9vcHRpb25zJztcbmltcG9ydCB7Zmx1c2hNb2R1bGVTY29waW5nUXVldWVBc011Y2hBc1Bvc3NpYmxlLCBwYXRjaENvbXBvbmVudERlZldpdGhTY29wZSwgdHJhbnNpdGl2ZVNjb3Blc0Zvcn0gZnJvbSAnLi9tb2R1bGUnO1xuXG4vKipcbiAqIEtlZXAgdHJhY2sgb2YgdGhlIGNvbXBpbGF0aW9uIGRlcHRoIHRvIGF2b2lkIHJlZW50cmFuY3kgaXNzdWVzIGR1cmluZyBKSVQgY29tcGlsYXRpb24uIFRoaXNcbiAqIG1hdHRlcnMgaW4gdGhlIGZvbGxvd2luZyBzY2VuYXJpbzpcbiAqXG4gKiBDb25zaWRlciBhIGNvbXBvbmVudCAnQScgdGhhdCBleHRlbmRzIGNvbXBvbmVudCAnQicsIGJvdGggZGVjbGFyZWQgaW4gbW9kdWxlICdNJy4gRHVyaW5nXG4gKiB0aGUgY29tcGlsYXRpb24gb2YgJ0EnIHRoZSBkZWZpbml0aW9uIG9mICdCJyBpcyByZXF1ZXN0ZWQgdG8gY2FwdHVyZSB0aGUgaW5oZXJpdGFuY2UgY2hhaW4sXG4gKiBwb3RlbnRpYWxseSB0cmlnZ2VyaW5nIGNvbXBpbGF0aW9uIG9mICdCJy4gSWYgdGhpcyBuZXN0ZWQgY29tcGlsYXRpb24gd2VyZSB0byB0cmlnZ2VyXG4gKiBgZmx1c2hNb2R1bGVTY29waW5nUXVldWVBc011Y2hBc1Bvc3NpYmxlYCBpdCBtYXkgaGFwcGVuIHRoYXQgbW9kdWxlICdNJyBpcyBzdGlsbCBwZW5kaW5nIGluIHRoZVxuICogcXVldWUsIHJlc3VsdGluZyBpbiAnQScgYW5kICdCJyB0byBiZSBwYXRjaGVkIHdpdGggdGhlIE5nTW9kdWxlIHNjb3BlLiBBcyB0aGUgY29tcGlsYXRpb24gb2ZcbiAqICdBJyBpcyBzdGlsbCBpbiBwcm9ncmVzcywgdGhpcyB3b3VsZCBpbnRyb2R1Y2UgYSBjaXJjdWxhciBkZXBlbmRlbmN5IG9uIGl0cyBjb21waWxhdGlvbi4gVG8gYXZvaWRcbiAqIHRoaXMgaXNzdWUsIHRoZSBtb2R1bGUgc2NvcGUgcXVldWUgaXMgb25seSBmbHVzaGVkIGZvciBjb21waWxhdGlvbnMgYXQgdGhlIGRlcHRoIDAsIHRvIGVuc3VyZVxuICogYWxsIGNvbXBpbGF0aW9ucyBoYXZlIGZpbmlzaGVkLlxuICovXG5sZXQgY29tcGlsYXRpb25EZXB0aCA9IDA7XG5cbi8qKlxuICogQ29tcGlsZSBhbiBBbmd1bGFyIGNvbXBvbmVudCBhY2NvcmRpbmcgdG8gaXRzIGRlY29yYXRvciBtZXRhZGF0YSwgYW5kIHBhdGNoIHRoZSByZXN1bHRpbmdcbiAqIGNvbXBvbmVudCBkZWYgKMm1Y21wKSBvbnRvIHRoZSBjb21wb25lbnQgdHlwZS5cbiAqXG4gKiBDb21waWxhdGlvbiBtYXkgYmUgYXN5bmNocm9ub3VzIChkdWUgdG8gdGhlIG5lZWQgdG8gcmVzb2x2ZSBVUkxzIGZvciB0aGUgY29tcG9uZW50IHRlbXBsYXRlIG9yXG4gKiBvdGhlciByZXNvdXJjZXMsIGZvciBleGFtcGxlKS4gSW4gdGhlIGV2ZW50IHRoYXQgY29tcGlsYXRpb24gaXMgbm90IGltbWVkaWF0ZSwgYGNvbXBpbGVDb21wb25lbnRgXG4gKiB3aWxsIGVucXVldWUgcmVzb3VyY2UgcmVzb2x1dGlvbiBpbnRvIGEgZ2xvYmFsIHF1ZXVlIGFuZCB3aWxsIGZhaWwgdG8gcmV0dXJuIHRoZSBgybVjbXBgXG4gKiB1bnRpbCB0aGUgZ2xvYmFsIHF1ZXVlIGhhcyBiZWVuIHJlc29sdmVkIHdpdGggYSBjYWxsIHRvIGByZXNvbHZlQ29tcG9uZW50UmVzb3VyY2VzYC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGVDb21wb25lbnQodHlwZTogVHlwZTxhbnk+LCBtZXRhZGF0YTogQ29tcG9uZW50KTogdm9pZCB7XG4gIC8vIEluaXRpYWxpemUgbmdEZXZNb2RlLiBUaGlzIG11c3QgYmUgdGhlIGZpcnN0IHN0YXRlbWVudCBpbiBjb21waWxlQ29tcG9uZW50LlxuICAvLyBTZWUgdGhlIGBpbml0TmdEZXZNb2RlYCBkb2NzdHJpbmcgZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpICYmIGluaXROZ0Rldk1vZGUoKTtcblxuICBsZXQgbmdDb21wb25lbnREZWY6IGFueSA9IG51bGw7XG5cbiAgLy8gTWV0YWRhdGEgbWF5IGhhdmUgcmVzb3VyY2VzIHdoaWNoIG5lZWQgdG8gYmUgcmVzb2x2ZWQuXG4gIG1heWJlUXVldWVSZXNvbHV0aW9uT2ZDb21wb25lbnRSZXNvdXJjZXModHlwZSwgbWV0YWRhdGEpO1xuXG4gIC8vIE5vdGUgdGhhdCB3ZSdyZSB1c2luZyB0aGUgc2FtZSBmdW5jdGlvbiBhcyBgRGlyZWN0aXZlYCwgYmVjYXVzZSB0aGF0J3Mgb25seSBzdWJzZXQgb2YgbWV0YWRhdGFcbiAgLy8gdGhhdCB3ZSBuZWVkIHRvIGNyZWF0ZSB0aGUgbmdGYWN0b3J5RGVmLiBXZSdyZSBhdm9pZGluZyB1c2luZyB0aGUgY29tcG9uZW50IG1ldGFkYXRhXG4gIC8vIGJlY2F1c2Ugd2UnZCBoYXZlIHRvIHJlc29sdmUgdGhlIGFzeW5jaHJvbm91cyB0ZW1wbGF0ZXMuXG4gIGFkZERpcmVjdGl2ZUZhY3RvcnlEZWYodHlwZSwgbWV0YWRhdGEpO1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0eXBlLCBOR19DT01QX0RFRiwge1xuICAgIGdldDogKCkgPT4ge1xuICAgICAgaWYgKG5nQ29tcG9uZW50RGVmID09PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IGNvbXBpbGVyID1cbiAgICAgICAgICAgIGdldENvbXBpbGVyRmFjYWRlKHt1c2FnZTogSml0Q29tcGlsZXJVc2FnZS5EZWNvcmF0b3IsIGtpbmQ6ICdjb21wb25lbnQnLCB0eXBlOiB0eXBlfSk7XG5cbiAgICAgICAgaWYgKGNvbXBvbmVudE5lZWRzUmVzb2x1dGlvbihtZXRhZGF0YSkpIHtcbiAgICAgICAgICBjb25zdCBlcnJvciA9IFtgQ29tcG9uZW50ICcke3R5cGUubmFtZX0nIGlzIG5vdCByZXNvbHZlZDpgXTtcbiAgICAgICAgICBpZiAobWV0YWRhdGEudGVtcGxhdGVVcmwpIHtcbiAgICAgICAgICAgIGVycm9yLnB1c2goYCAtIHRlbXBsYXRlVXJsOiAke21ldGFkYXRhLnRlbXBsYXRlVXJsfWApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAobWV0YWRhdGEuc3R5bGVVcmxzICYmIG1ldGFkYXRhLnN0eWxlVXJscy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGVycm9yLnB1c2goYCAtIHN0eWxlVXJsczogJHtKU09OLnN0cmluZ2lmeShtZXRhZGF0YS5zdHlsZVVybHMpfWApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlcnJvci5wdXNoKGBEaWQgeW91IHJ1biBhbmQgd2FpdCBmb3IgJ3Jlc29sdmVDb21wb25lbnRSZXNvdXJjZXMoKSc/YCk7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yLmpvaW4oJ1xcbicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoaXMgY29uc3Qgd2FzIGNhbGxlZCBgaml0T3B0aW9uc2AgcHJldmlvdXNseSBidXQgaGFkIHRvIGJlIHJlbmFtZWQgdG8gYG9wdGlvbnNgIGJlY2F1c2VcbiAgICAgICAgLy8gb2YgYSBidWcgd2l0aCBUZXJzZXIgdGhhdCBjYXVzZWQgb3B0aW1pemVkIEpJVCBidWlsZHMgdG8gdGhyb3cgYSBgUmVmZXJlbmNlRXJyb3JgLlxuICAgICAgICAvLyBUaGlzIGJ1ZyB3YXMgaW52ZXN0aWdhdGVkIGluIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXItY2xpL2lzc3Vlcy8xNzI2NC5cbiAgICAgICAgLy8gV2Ugc2hvdWxkIG5vdCByZW5hbWUgaXQgYmFjayB1bnRpbCBodHRwczovL2dpdGh1Yi5jb20vdGVyc2VyL3RlcnNlci9pc3N1ZXMvNjE1IGlzIGZpeGVkLlxuICAgICAgICBjb25zdCBvcHRpb25zID0gZ2V0Sml0T3B0aW9ucygpO1xuICAgICAgICBsZXQgcHJlc2VydmVXaGl0ZXNwYWNlcyA9IG1ldGFkYXRhLnByZXNlcnZlV2hpdGVzcGFjZXM7XG4gICAgICAgIGlmIChwcmVzZXJ2ZVdoaXRlc3BhY2VzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBpZiAob3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zLnByZXNlcnZlV2hpdGVzcGFjZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcHJlc2VydmVXaGl0ZXNwYWNlcyA9IG9wdGlvbnMucHJlc2VydmVXaGl0ZXNwYWNlcztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJlc2VydmVXaGl0ZXNwYWNlcyA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgZW5jYXBzdWxhdGlvbiA9IG1ldGFkYXRhLmVuY2Fwc3VsYXRpb247XG4gICAgICAgIGlmIChlbmNhcHN1bGF0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBpZiAob3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zLmRlZmF1bHRFbmNhcHN1bGF0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGVuY2Fwc3VsYXRpb24gPSBvcHRpb25zLmRlZmF1bHRFbmNhcHN1bGF0aW9uO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbmNhcHN1bGF0aW9uID0gVmlld0VuY2Fwc3VsYXRpb24uRW11bGF0ZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdGVtcGxhdGVVcmwgPSBtZXRhZGF0YS50ZW1wbGF0ZVVybCB8fCBgbmc6Ly8vJHt0eXBlLm5hbWV9L3RlbXBsYXRlLmh0bWxgO1xuICAgICAgICBjb25zdCBtZXRhOiBSM0NvbXBvbmVudE1ldGFkYXRhRmFjYWRlID0ge1xuICAgICAgICAgIC4uLmRpcmVjdGl2ZU1ldGFkYXRhKHR5cGUsIG1ldGFkYXRhKSxcbiAgICAgICAgICB0eXBlU291cmNlU3BhbjogY29tcGlsZXIuY3JlYXRlUGFyc2VTb3VyY2VTcGFuKCdDb21wb25lbnQnLCB0eXBlLm5hbWUsIHRlbXBsYXRlVXJsKSxcbiAgICAgICAgICB0ZW1wbGF0ZTogbWV0YWRhdGEudGVtcGxhdGUgfHwgJycsXG4gICAgICAgICAgcHJlc2VydmVXaGl0ZXNwYWNlcyxcbiAgICAgICAgICBzdHlsZXM6IG1ldGFkYXRhLnN0eWxlcyB8fCBFTVBUWV9BUlJBWSxcbiAgICAgICAgICBhbmltYXRpb25zOiBtZXRhZGF0YS5hbmltYXRpb25zLFxuICAgICAgICAgIGRpcmVjdGl2ZXM6IFtdLFxuICAgICAgICAgIGNoYW5nZURldGVjdGlvbjogbWV0YWRhdGEuY2hhbmdlRGV0ZWN0aW9uLFxuICAgICAgICAgIHBpcGVzOiBuZXcgTWFwKCksXG4gICAgICAgICAgZW5jYXBzdWxhdGlvbixcbiAgICAgICAgICBpbnRlcnBvbGF0aW9uOiBtZXRhZGF0YS5pbnRlcnBvbGF0aW9uLFxuICAgICAgICAgIHZpZXdQcm92aWRlcnM6IG1ldGFkYXRhLnZpZXdQcm92aWRlcnMgfHwgbnVsbCxcbiAgICAgICAgfTtcblxuICAgICAgICBjb21waWxhdGlvbkRlcHRoKys7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKG1ldGEudXNlc0luaGVyaXRhbmNlKSB7XG4gICAgICAgICAgICBhZGREaXJlY3RpdmVEZWZUb1VuZGVjb3JhdGVkUGFyZW50cyh0eXBlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbmdDb21wb25lbnREZWYgPSBjb21waWxlci5jb21waWxlQ29tcG9uZW50KGFuZ3VsYXJDb3JlRW52LCB0ZW1wbGF0ZVVybCwgbWV0YSk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgLy8gRW5zdXJlIHRoYXQgdGhlIGNvbXBpbGF0aW9uIGRlcHRoIGlzIGRlY3JlbWVudGVkIGV2ZW4gd2hlbiB0aGUgY29tcGlsYXRpb24gZmFpbGVkLlxuICAgICAgICAgIGNvbXBpbGF0aW9uRGVwdGgtLTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb21waWxhdGlvbkRlcHRoID09PSAwKSB7XG4gICAgICAgICAgLy8gV2hlbiBOZ01vZHVsZSBkZWNvcmF0b3IgZXhlY3V0ZWQsIHdlIGVucXVldWVkIHRoZSBtb2R1bGUgZGVmaW5pdGlvbiBzdWNoIHRoYXRcbiAgICAgICAgICAvLyBpdCB3b3VsZCBvbmx5IGRlcXVldWUgYW5kIGFkZCBpdHNlbGYgYXMgbW9kdWxlIHNjb3BlIHRvIGFsbCBvZiBpdHMgZGVjbGFyYXRpb25zLFxuICAgICAgICAgIC8vIGJ1dCBvbmx5IGlmICBpZiBhbGwgb2YgaXRzIGRlY2xhcmF0aW9ucyBoYWQgcmVzb2x2ZWQuIFRoaXMgY2FsbCBydW5zIHRoZSBjaGVja1xuICAgICAgICAgIC8vIHRvIHNlZSBpZiBhbnkgbW9kdWxlcyB0aGF0IGFyZSBpbiB0aGUgcXVldWUgY2FuIGJlIGRlcXVldWVkIGFuZCBhZGQgc2NvcGUgdG9cbiAgICAgICAgICAvLyB0aGVpciBkZWNsYXJhdGlvbnMuXG4gICAgICAgICAgZmx1c2hNb2R1bGVTY29waW5nUXVldWVBc011Y2hBc1Bvc3NpYmxlKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiBjb21wb25lbnQgY29tcGlsYXRpb24gaXMgYXN5bmMsIHRoZW4gdGhlIEBOZ01vZHVsZSBhbm5vdGF0aW9uIHdoaWNoIGRlY2xhcmVzIHRoZVxuICAgICAgICAvLyBjb21wb25lbnQgbWF5IGV4ZWN1dGUgYW5kIHNldCBhbiBuZ1NlbGVjdG9yU2NvcGUgcHJvcGVydHkgb24gdGhlIGNvbXBvbmVudCB0eXBlLiBUaGlzXG4gICAgICAgIC8vIGFsbG93cyB0aGUgY29tcG9uZW50IHRvIHBhdGNoIGl0c2VsZiB3aXRoIGRpcmVjdGl2ZURlZnMgZnJvbSB0aGUgbW9kdWxlIGFmdGVyIGl0XG4gICAgICAgIC8vIGZpbmlzaGVzIGNvbXBpbGluZy5cbiAgICAgICAgaWYgKGhhc1NlbGVjdG9yU2NvcGUodHlwZSkpIHtcbiAgICAgICAgICBjb25zdCBzY29wZXMgPSB0cmFuc2l0aXZlU2NvcGVzRm9yKHR5cGUubmdTZWxlY3RvclNjb3BlKTtcbiAgICAgICAgICBwYXRjaENvbXBvbmVudERlZldpdGhTY29wZShuZ0NvbXBvbmVudERlZiwgc2NvcGVzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG5nQ29tcG9uZW50RGVmO1xuICAgIH0sXG4gICAgLy8gTWFrZSB0aGUgcHJvcGVydHkgY29uZmlndXJhYmxlIGluIGRldiBtb2RlIHRvIGFsbG93IG92ZXJyaWRpbmcgaW4gdGVzdHNcbiAgICBjb25maWd1cmFibGU6ICEhbmdEZXZNb2RlLFxuICB9KTtcbn1cblxuZnVuY3Rpb24gaGFzU2VsZWN0b3JTY29wZTxUPihjb21wb25lbnQ6IFR5cGU8VD4pOiBjb21wb25lbnQgaXMgVHlwZTxUPiZcbiAgICB7bmdTZWxlY3RvclNjb3BlOiBUeXBlPGFueT59IHtcbiAgcmV0dXJuIChjb21wb25lbnQgYXMge25nU2VsZWN0b3JTY29wZT86IGFueX0pLm5nU2VsZWN0b3JTY29wZSAhPT0gdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIENvbXBpbGUgYW4gQW5ndWxhciBkaXJlY3RpdmUgYWNjb3JkaW5nIHRvIGl0cyBkZWNvcmF0b3IgbWV0YWRhdGEsIGFuZCBwYXRjaCB0aGUgcmVzdWx0aW5nXG4gKiBkaXJlY3RpdmUgZGVmIG9udG8gdGhlIGNvbXBvbmVudCB0eXBlLlxuICpcbiAqIEluIHRoZSBldmVudCB0aGF0IGNvbXBpbGF0aW9uIGlzIG5vdCBpbW1lZGlhdGUsIGBjb21waWxlRGlyZWN0aXZlYCB3aWxsIHJldHVybiBhIGBQcm9taXNlYCB3aGljaFxuICogd2lsbCByZXNvbHZlIHdoZW4gY29tcGlsYXRpb24gY29tcGxldGVzIGFuZCB0aGUgZGlyZWN0aXZlIGJlY29tZXMgdXNhYmxlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZURpcmVjdGl2ZSh0eXBlOiBUeXBlPGFueT4sIGRpcmVjdGl2ZTogRGlyZWN0aXZlfG51bGwpOiB2b2lkIHtcbiAgbGV0IG5nRGlyZWN0aXZlRGVmOiBhbnkgPSBudWxsO1xuXG4gIGFkZERpcmVjdGl2ZUZhY3RvcnlEZWYodHlwZSwgZGlyZWN0aXZlIHx8IHt9KTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkodHlwZSwgTkdfRElSX0RFRiwge1xuICAgIGdldDogKCkgPT4ge1xuICAgICAgaWYgKG5nRGlyZWN0aXZlRGVmID09PSBudWxsKSB7XG4gICAgICAgIC8vIGBkaXJlY3RpdmVgIGNhbiBiZSBudWxsIGluIHRoZSBjYXNlIG9mIGFic3RyYWN0IGRpcmVjdGl2ZXMgYXMgYSBiYXNlIGNsYXNzXG4gICAgICAgIC8vIHRoYXQgdXNlIGBARGlyZWN0aXZlKClgIHdpdGggbm8gc2VsZWN0b3IuIEluIHRoYXQgY2FzZSwgcGFzcyBlbXB0eSBvYmplY3QgdG8gdGhlXG4gICAgICAgIC8vIGBkaXJlY3RpdmVNZXRhZGF0YWAgZnVuY3Rpb24gaW5zdGVhZCBvZiBudWxsLlxuICAgICAgICBjb25zdCBtZXRhID0gZ2V0RGlyZWN0aXZlTWV0YWRhdGEodHlwZSwgZGlyZWN0aXZlIHx8IHt9KTtcbiAgICAgICAgY29uc3QgY29tcGlsZXIgPVxuICAgICAgICAgICAgZ2V0Q29tcGlsZXJGYWNhZGUoe3VzYWdlOiBKaXRDb21waWxlclVzYWdlLkRlY29yYXRvciwga2luZDogJ2RpcmVjdGl2ZScsIHR5cGV9KTtcbiAgICAgICAgbmdEaXJlY3RpdmVEZWYgPVxuICAgICAgICAgICAgY29tcGlsZXIuY29tcGlsZURpcmVjdGl2ZShhbmd1bGFyQ29yZUVudiwgbWV0YS5zb3VyY2VNYXBVcmwsIG1ldGEubWV0YWRhdGEpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5nRGlyZWN0aXZlRGVmO1xuICAgIH0sXG4gICAgLy8gTWFrZSB0aGUgcHJvcGVydHkgY29uZmlndXJhYmxlIGluIGRldiBtb2RlIHRvIGFsbG93IG92ZXJyaWRpbmcgaW4gdGVzdHNcbiAgICBjb25maWd1cmFibGU6ICEhbmdEZXZNb2RlLFxuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0RGlyZWN0aXZlTWV0YWRhdGEodHlwZTogVHlwZTxhbnk+LCBtZXRhZGF0YTogRGlyZWN0aXZlKSB7XG4gIGNvbnN0IG5hbWUgPSB0eXBlICYmIHR5cGUubmFtZTtcbiAgY29uc3Qgc291cmNlTWFwVXJsID0gYG5nOi8vLyR7bmFtZX0vybVkaXIuanNgO1xuICBjb25zdCBjb21waWxlciA9IGdldENvbXBpbGVyRmFjYWRlKHt1c2FnZTogSml0Q29tcGlsZXJVc2FnZS5EZWNvcmF0b3IsIGtpbmQ6ICdkaXJlY3RpdmUnLCB0eXBlfSk7XG4gIGNvbnN0IGZhY2FkZSA9IGRpcmVjdGl2ZU1ldGFkYXRhKHR5cGUgYXMgQ29tcG9uZW50VHlwZTxhbnk+LCBtZXRhZGF0YSk7XG4gIGZhY2FkZS50eXBlU291cmNlU3BhbiA9IGNvbXBpbGVyLmNyZWF0ZVBhcnNlU291cmNlU3BhbignRGlyZWN0aXZlJywgbmFtZSwgc291cmNlTWFwVXJsKTtcbiAgaWYgKGZhY2FkZS51c2VzSW5oZXJpdGFuY2UpIHtcbiAgICBhZGREaXJlY3RpdmVEZWZUb1VuZGVjb3JhdGVkUGFyZW50cyh0eXBlKTtcbiAgfVxuICByZXR1cm4ge21ldGFkYXRhOiBmYWNhZGUsIHNvdXJjZU1hcFVybH07XG59XG5cbmZ1bmN0aW9uIGFkZERpcmVjdGl2ZUZhY3RvcnlEZWYodHlwZTogVHlwZTxhbnk+LCBtZXRhZGF0YTogRGlyZWN0aXZlfENvbXBvbmVudCkge1xuICBsZXQgbmdGYWN0b3J5RGVmOiBhbnkgPSBudWxsO1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0eXBlLCBOR19GQUNUT1JZX0RFRiwge1xuICAgIGdldDogKCkgPT4ge1xuICAgICAgaWYgKG5nRmFjdG9yeURlZiA9PT0gbnVsbCkge1xuICAgICAgICBjb25zdCBtZXRhID0gZ2V0RGlyZWN0aXZlTWV0YWRhdGEodHlwZSwgbWV0YWRhdGEpO1xuICAgICAgICBjb25zdCBjb21waWxlciA9XG4gICAgICAgICAgICBnZXRDb21waWxlckZhY2FkZSh7dXNhZ2U6IEppdENvbXBpbGVyVXNhZ2UuRGVjb3JhdG9yLCBraW5kOiAnZGlyZWN0aXZlJywgdHlwZX0pO1xuICAgICAgICBuZ0ZhY3RvcnlEZWYgPSBjb21waWxlci5jb21waWxlRmFjdG9yeShhbmd1bGFyQ29yZUVudiwgYG5nOi8vLyR7dHlwZS5uYW1lfS/JtWZhYy5qc2AsIHtcbiAgICAgICAgICBuYW1lOiBtZXRhLm1ldGFkYXRhLm5hbWUsXG4gICAgICAgICAgdHlwZTogbWV0YS5tZXRhZGF0YS50eXBlLFxuICAgICAgICAgIHR5cGVBcmd1bWVudENvdW50OiAwLFxuICAgICAgICAgIGRlcHM6IHJlZmxlY3REZXBlbmRlbmNpZXModHlwZSksXG4gICAgICAgICAgdGFyZ2V0OiBjb21waWxlci5GYWN0b3J5VGFyZ2V0LkRpcmVjdGl2ZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZ0ZhY3RvcnlEZWY7XG4gICAgfSxcbiAgICAvLyBNYWtlIHRoZSBwcm9wZXJ0eSBjb25maWd1cmFibGUgaW4gZGV2IG1vZGUgdG8gYWxsb3cgb3ZlcnJpZGluZyBpbiB0ZXN0c1xuICAgIGNvbmZpZ3VyYWJsZTogISFuZ0Rldk1vZGUsXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXh0ZW5kc0RpcmVjdGx5RnJvbU9iamVjdCh0eXBlOiBUeXBlPGFueT4pOiBib29sZWFuIHtcbiAgcmV0dXJuIE9iamVjdC5nZXRQcm90b3R5cGVPZih0eXBlLnByb3RvdHlwZSkgPT09IE9iamVjdC5wcm90b3R5cGU7XG59XG5cbi8qKlxuICogRXh0cmFjdCB0aGUgYFIzRGlyZWN0aXZlTWV0YWRhdGFgIGZvciBhIHBhcnRpY3VsYXIgZGlyZWN0aXZlIChlaXRoZXIgYSBgRGlyZWN0aXZlYCBvciBhXG4gKiBgQ29tcG9uZW50YCkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkaXJlY3RpdmVNZXRhZGF0YSh0eXBlOiBUeXBlPGFueT4sIG1ldGFkYXRhOiBEaXJlY3RpdmUpOiBSM0RpcmVjdGl2ZU1ldGFkYXRhRmFjYWRlIHtcbiAgLy8gUmVmbGVjdCBpbnB1dHMgYW5kIG91dHB1dHMuXG4gIGNvbnN0IHJlZmxlY3QgPSBnZXRSZWZsZWN0KCk7XG4gIGNvbnN0IHByb3BNZXRhZGF0YSA9IHJlZmxlY3Qub3duUHJvcE1ldGFkYXRhKHR5cGUpO1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogdHlwZS5uYW1lLFxuICAgIHR5cGU6IHR5cGUsXG4gICAgc2VsZWN0b3I6IG1ldGFkYXRhLnNlbGVjdG9yICE9PSB1bmRlZmluZWQgPyBtZXRhZGF0YS5zZWxlY3RvciA6IG51bGwsXG4gICAgaG9zdDogbWV0YWRhdGEuaG9zdCB8fCBFTVBUWV9PQkosXG4gICAgcHJvcE1ldGFkYXRhOiBwcm9wTWV0YWRhdGEsXG4gICAgaW5wdXRzOiBtZXRhZGF0YS5pbnB1dHMgfHwgRU1QVFlfQVJSQVksXG4gICAgb3V0cHV0czogbWV0YWRhdGEub3V0cHV0cyB8fCBFTVBUWV9BUlJBWSxcbiAgICBxdWVyaWVzOiBleHRyYWN0UXVlcmllc01ldGFkYXRhKHR5cGUsIHByb3BNZXRhZGF0YSwgaXNDb250ZW50UXVlcnkpLFxuICAgIGxpZmVjeWNsZToge3VzZXNPbkNoYW5nZXM6IHJlZmxlY3QuaGFzTGlmZWN5Y2xlSG9vayh0eXBlLCAnbmdPbkNoYW5nZXMnKX0sXG4gICAgdHlwZVNvdXJjZVNwYW46IG51bGwhLFxuICAgIHVzZXNJbmhlcml0YW5jZTogIWV4dGVuZHNEaXJlY3RseUZyb21PYmplY3QodHlwZSksXG4gICAgZXhwb3J0QXM6IGV4dHJhY3RFeHBvcnRBcyhtZXRhZGF0YS5leHBvcnRBcyksXG4gICAgcHJvdmlkZXJzOiBtZXRhZGF0YS5wcm92aWRlcnMgfHwgbnVsbCxcbiAgICB2aWV3UXVlcmllczogZXh0cmFjdFF1ZXJpZXNNZXRhZGF0YSh0eXBlLCBwcm9wTWV0YWRhdGEsIGlzVmlld1F1ZXJ5KVxuICB9O1xufVxuXG4vKipcbiAqIEFkZHMgYSBkaXJlY3RpdmUgZGVmaW5pdGlvbiB0byBhbGwgcGFyZW50IGNsYXNzZXMgb2YgYSB0eXBlIHRoYXQgZG9uJ3QgaGF2ZSBhbiBBbmd1bGFyIGRlY29yYXRvci5cbiAqL1xuZnVuY3Rpb24gYWRkRGlyZWN0aXZlRGVmVG9VbmRlY29yYXRlZFBhcmVudHModHlwZTogVHlwZTxhbnk+KSB7XG4gIGNvbnN0IG9ialByb3RvdHlwZSA9IE9iamVjdC5wcm90b3R5cGU7XG4gIGxldCBwYXJlbnQgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodHlwZS5wcm90b3R5cGUpLmNvbnN0cnVjdG9yO1xuXG4gIC8vIEdvIHVwIHRoZSBwcm90b3R5cGUgdW50aWwgd2UgaGl0IGBPYmplY3RgLlxuICB3aGlsZSAocGFyZW50ICYmIHBhcmVudCAhPT0gb2JqUHJvdG90eXBlKSB7XG4gICAgLy8gU2luY2UgaW5oZXJpdGFuY2Ugd29ya3MgaWYgdGhlIGNsYXNzIHdhcyBhbm5vdGF0ZWQgYWxyZWFkeSwgd2Ugb25seSBuZWVkIHRvIGFkZFxuICAgIC8vIHRoZSBkZWYgaWYgdGhlcmUgYXJlIG5vIGFubm90YXRpb25zIGFuZCB0aGUgZGVmIGhhc24ndCBiZWVuIGNyZWF0ZWQgYWxyZWFkeS5cbiAgICBpZiAoIWdldERpcmVjdGl2ZURlZihwYXJlbnQpICYmICFnZXRDb21wb25lbnREZWYocGFyZW50KSAmJlxuICAgICAgICBzaG91bGRBZGRBYnN0cmFjdERpcmVjdGl2ZShwYXJlbnQpKSB7XG4gICAgICBjb21waWxlRGlyZWN0aXZlKHBhcmVudCwgbnVsbCk7XG4gICAgfVxuICAgIHBhcmVudCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihwYXJlbnQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRUb1IzUXVlcnlQcmVkaWNhdGUoc2VsZWN0b3I6IGFueSk6IGFueXxzdHJpbmdbXSB7XG4gIHJldHVybiB0eXBlb2Ygc2VsZWN0b3IgPT09ICdzdHJpbmcnID8gc3BsaXRCeUNvbW1hKHNlbGVjdG9yKSA6IHJlc29sdmVGb3J3YXJkUmVmKHNlbGVjdG9yKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRUb1IzUXVlcnlNZXRhZGF0YShwcm9wZXJ0eU5hbWU6IHN0cmluZywgYW5uOiBRdWVyeSk6IFIzUXVlcnlNZXRhZGF0YUZhY2FkZSB7XG4gIHJldHVybiB7XG4gICAgcHJvcGVydHlOYW1lOiBwcm9wZXJ0eU5hbWUsXG4gICAgcHJlZGljYXRlOiBjb252ZXJ0VG9SM1F1ZXJ5UHJlZGljYXRlKGFubi5zZWxlY3RvciksXG4gICAgZGVzY2VuZGFudHM6IGFubi5kZXNjZW5kYW50cyxcbiAgICBmaXJzdDogYW5uLmZpcnN0LFxuICAgIHJlYWQ6IGFubi5yZWFkID8gYW5uLnJlYWQgOiBudWxsLFxuICAgIHN0YXRpYzogISFhbm4uc3RhdGljLFxuICAgIGVtaXREaXN0aW5jdENoYW5nZXNPbmx5OiAhIWFubi5lbWl0RGlzdGluY3RDaGFuZ2VzT25seSxcbiAgfTtcbn1cbmZ1bmN0aW9uIGV4dHJhY3RRdWVyaWVzTWV0YWRhdGEoXG4gICAgdHlwZTogVHlwZTxhbnk+LCBwcm9wTWV0YWRhdGE6IHtba2V5OiBzdHJpbmddOiBhbnlbXX0sXG4gICAgaXNRdWVyeUFubjogKGFubjogYW55KSA9PiBhbm4gaXMgUXVlcnkpOiBSM1F1ZXJ5TWV0YWRhdGFGYWNhZGVbXSB7XG4gIGNvbnN0IHF1ZXJpZXNNZXRhOiBSM1F1ZXJ5TWV0YWRhdGFGYWNhZGVbXSA9IFtdO1xuICBmb3IgKGNvbnN0IGZpZWxkIGluIHByb3BNZXRhZGF0YSkge1xuICAgIGlmIChwcm9wTWV0YWRhdGEuaGFzT3duUHJvcGVydHkoZmllbGQpKSB7XG4gICAgICBjb25zdCBhbm5vdGF0aW9ucyA9IHByb3BNZXRhZGF0YVtmaWVsZF07XG4gICAgICBhbm5vdGF0aW9ucy5mb3JFYWNoKGFubiA9PiB7XG4gICAgICAgIGlmIChpc1F1ZXJ5QW5uKGFubikpIHtcbiAgICAgICAgICBpZiAoIWFubi5zZWxlY3Rvcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgIGBDYW4ndCBjb25zdHJ1Y3QgYSBxdWVyeSBmb3IgdGhlIHByb3BlcnR5IFwiJHtmaWVsZH1cIiBvZiBgICtcbiAgICAgICAgICAgICAgICBgXCIke3N0cmluZ2lmeUZvckVycm9yKHR5cGUpfVwiIHNpbmNlIHRoZSBxdWVyeSBzZWxlY3RvciB3YXNuJ3QgZGVmaW5lZC5gKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGFubm90YXRpb25zLnNvbWUoaXNJbnB1dEFubm90YXRpb24pKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBjb21iaW5lIEBJbnB1dCBkZWNvcmF0b3JzIHdpdGggcXVlcnkgZGVjb3JhdG9yc2ApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBxdWVyaWVzTWV0YS5wdXNoKGNvbnZlcnRUb1IzUXVlcnlNZXRhZGF0YShmaWVsZCwgYW5uKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcXVlcmllc01ldGE7XG59XG5cbmZ1bmN0aW9uIGV4dHJhY3RFeHBvcnRBcyhleHBvcnRBczogc3RyaW5nfHVuZGVmaW5lZCk6IHN0cmluZ1tdfG51bGwge1xuICByZXR1cm4gZXhwb3J0QXMgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBzcGxpdEJ5Q29tbWEoZXhwb3J0QXMpO1xufVxuXG5mdW5jdGlvbiBpc0NvbnRlbnRRdWVyeSh2YWx1ZTogYW55KTogdmFsdWUgaXMgUXVlcnkge1xuICBjb25zdCBuYW1lID0gdmFsdWUubmdNZXRhZGF0YU5hbWU7XG4gIHJldHVybiBuYW1lID09PSAnQ29udGVudENoaWxkJyB8fCBuYW1lID09PSAnQ29udGVudENoaWxkcmVuJztcbn1cblxuZnVuY3Rpb24gaXNWaWV3UXVlcnkodmFsdWU6IGFueSk6IHZhbHVlIGlzIFF1ZXJ5IHtcbiAgY29uc3QgbmFtZSA9IHZhbHVlLm5nTWV0YWRhdGFOYW1lO1xuICByZXR1cm4gbmFtZSA9PT0gJ1ZpZXdDaGlsZCcgfHwgbmFtZSA9PT0gJ1ZpZXdDaGlsZHJlbic7XG59XG5cbmZ1bmN0aW9uIGlzSW5wdXRBbm5vdGF0aW9uKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBJbnB1dCB7XG4gIHJldHVybiB2YWx1ZS5uZ01ldGFkYXRhTmFtZSA9PT0gJ0lucHV0Jztcbn1cblxuZnVuY3Rpb24gc3BsaXRCeUNvbW1hKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gIHJldHVybiB2YWx1ZS5zcGxpdCgnLCcpLm1hcChwaWVjZSA9PiBwaWVjZS50cmltKCkpO1xufVxuXG5jb25zdCBMSUZFQ1lDTEVfSE9PS1MgPSBbXG4gICduZ09uQ2hhbmdlcycsICduZ09uSW5pdCcsICduZ09uRGVzdHJveScsICduZ0RvQ2hlY2snLCAnbmdBZnRlclZpZXdJbml0JywgJ25nQWZ0ZXJWaWV3Q2hlY2tlZCcsXG4gICduZ0FmdGVyQ29udGVudEluaXQnLCAnbmdBZnRlckNvbnRlbnRDaGVja2VkJ1xuXTtcblxuZnVuY3Rpb24gc2hvdWxkQWRkQWJzdHJhY3REaXJlY3RpdmUodHlwZTogVHlwZTxhbnk+KTogYm9vbGVhbiB7XG4gIGNvbnN0IHJlZmxlY3QgPSBnZXRSZWZsZWN0KCk7XG5cbiAgaWYgKExJRkVDWUNMRV9IT09LUy5zb21lKGhvb2tOYW1lID0+IHJlZmxlY3QuaGFzTGlmZWN5Y2xlSG9vayh0eXBlLCBob29rTmFtZSkpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBjb25zdCBwcm9wTWV0YWRhdGEgPSByZWZsZWN0LnByb3BNZXRhZGF0YSh0eXBlKTtcblxuICBmb3IgKGNvbnN0IGZpZWxkIGluIHByb3BNZXRhZGF0YSkge1xuICAgIGNvbnN0IGFubm90YXRpb25zID0gcHJvcE1ldGFkYXRhW2ZpZWxkXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYW5ub3RhdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGN1cnJlbnQgPSBhbm5vdGF0aW9uc1tpXTtcbiAgICAgIGNvbnN0IG1ldGFkYXRhTmFtZSA9IGN1cnJlbnQubmdNZXRhZGF0YU5hbWU7XG5cbiAgICAgIGlmIChpc0lucHV0QW5ub3RhdGlvbihjdXJyZW50KSB8fCBpc0NvbnRlbnRRdWVyeShjdXJyZW50KSB8fCBpc1ZpZXdRdWVyeShjdXJyZW50KSB8fFxuICAgICAgICAgIG1ldGFkYXRhTmFtZSA9PT0gJ091dHB1dCcgfHwgbWV0YWRhdGFOYW1lID09PSAnSG9zdEJpbmRpbmcnIHx8XG4gICAgICAgICAgbWV0YWRhdGFOYW1lID09PSAnSG9zdExpc3RlbmVyJykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG4iXX0=