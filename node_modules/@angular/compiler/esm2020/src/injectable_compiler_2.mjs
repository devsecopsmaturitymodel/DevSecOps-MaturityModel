/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as o from './output/output_ast';
import { compileFactoryFunction, FactoryTarget, R3FactoryDelegateType } from './render3/r3_factory';
import { Identifiers } from './render3/r3_identifiers';
import { convertFromMaybeForwardRefExpression, typeWithParameters } from './render3/util';
import { DefinitionMap } from './render3/view/util';
export function compileInjectable(meta, resolveForwardRefs) {
    let result = null;
    const factoryMeta = {
        name: meta.name,
        type: meta.type,
        internalType: meta.internalType,
        typeArgumentCount: meta.typeArgumentCount,
        deps: [],
        target: FactoryTarget.Injectable,
    };
    if (meta.useClass !== undefined) {
        // meta.useClass has two modes of operation. Either deps are specified, in which case `new` is
        // used to instantiate the class with dependencies injected, or deps are not specified and
        // the factory of the class is used to instantiate it.
        //
        // A special case exists for useClass: Type where Type is the injectable type itself and no
        // deps are specified, in which case 'useClass' is effectively ignored.
        const useClassOnSelf = meta.useClass.expression.isEquivalent(meta.internalType);
        let deps = undefined;
        if (meta.deps !== undefined) {
            deps = meta.deps;
        }
        if (deps !== undefined) {
            // factory: () => new meta.useClass(...deps)
            result = compileFactoryFunction({
                ...factoryMeta,
                delegate: meta.useClass.expression,
                delegateDeps: deps,
                delegateType: R3FactoryDelegateType.Class,
            });
        }
        else if (useClassOnSelf) {
            result = compileFactoryFunction(factoryMeta);
        }
        else {
            result = {
                statements: [],
                expression: delegateToFactory(meta.type.value, meta.useClass.expression, resolveForwardRefs)
            };
        }
    }
    else if (meta.useFactory !== undefined) {
        if (meta.deps !== undefined) {
            result = compileFactoryFunction({
                ...factoryMeta,
                delegate: meta.useFactory,
                delegateDeps: meta.deps || [],
                delegateType: R3FactoryDelegateType.Function,
            });
        }
        else {
            result = {
                statements: [],
                expression: o.fn([], [new o.ReturnStatement(meta.useFactory.callFn([]))])
            };
        }
    }
    else if (meta.useValue !== undefined) {
        // Note: it's safe to use `meta.useValue` instead of the `USE_VALUE in meta` check used for
        // client code because meta.useValue is an Expression which will be defined even if the actual
        // value is undefined.
        result = compileFactoryFunction({
            ...factoryMeta,
            expression: meta.useValue.expression,
        });
    }
    else if (meta.useExisting !== undefined) {
        // useExisting is an `inject` call on the existing token.
        result = compileFactoryFunction({
            ...factoryMeta,
            expression: o.importExpr(Identifiers.inject).callFn([meta.useExisting.expression]),
        });
    }
    else {
        result = {
            statements: [],
            expression: delegateToFactory(meta.type.value, meta.internalType, resolveForwardRefs)
        };
    }
    const token = meta.internalType;
    const injectableProps = new DefinitionMap();
    injectableProps.set('token', token);
    injectableProps.set('factory', result.expression);
    // Only generate providedIn property if it has a non-null value
    if (meta.providedIn.expression.value !== null) {
        injectableProps.set('providedIn', convertFromMaybeForwardRefExpression(meta.providedIn));
    }
    const expression = o.importExpr(Identifiers.ɵɵdefineInjectable)
        .callFn([injectableProps.toLiteralMap()], undefined, true);
    return {
        expression,
        type: createInjectableType(meta),
        statements: result.statements,
    };
}
export function createInjectableType(meta) {
    return new o.ExpressionType(o.importExpr(Identifiers.InjectableDeclaration, [typeWithParameters(meta.type.type, meta.typeArgumentCount)]));
}
function delegateToFactory(type, internalType, unwrapForwardRefs) {
    if (type.node === internalType.node) {
        // The types are the same, so we can simply delegate directly to the type's factory.
        // ```
        // factory: type.ɵfac
        // ```
        return internalType.prop('ɵfac');
    }
    if (!unwrapForwardRefs) {
        // The type is not wrapped in a `forwardRef()`, so we create a simple factory function that
        // accepts a sub-type as an argument.
        // ```
        // factory: function(t) { return internalType.ɵfac(t); }
        // ```
        return createFactoryFunction(internalType);
    }
    // The internalType is actually wrapped in a `forwardRef()` so we need to resolve that before
    // calling its factory.
    // ```
    // factory: function(t) { return core.resolveForwardRef(type).ɵfac(t); }
    // ```
    const unwrappedType = o.importExpr(Identifiers.resolveForwardRef).callFn([internalType]);
    return createFactoryFunction(unwrappedType);
}
function createFactoryFunction(type) {
    return o.fn([new o.FnParam('t', o.DYNAMIC_TYPE)], [new o.ReturnStatement(type.prop('ɵfac').callFn([o.variable('t')]))]);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5qZWN0YWJsZV9jb21waWxlcl8yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL2luamVjdGFibGVfY29tcGlsZXJfMi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEtBQUssQ0FBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxzQkFBc0IsRUFBRSxhQUFhLEVBQXdCLHFCQUFxQixFQUFvQixNQUFNLHNCQUFzQixDQUFDO0FBQzNJLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNyRCxPQUFPLEVBQUMsb0NBQW9DLEVBQXdHLGtCQUFrQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUwsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBZWxELE1BQU0sVUFBVSxpQkFBaUIsQ0FDN0IsSUFBMEIsRUFBRSxrQkFBMkI7SUFDekQsSUFBSSxNQUFNLEdBQStELElBQUksQ0FBQztJQUU5RSxNQUFNLFdBQVcsR0FBc0I7UUFDckMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1FBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1FBQ2YsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZO1FBQy9CLGlCQUFpQixFQUFFLElBQUksQ0FBQyxpQkFBaUI7UUFDekMsSUFBSSxFQUFFLEVBQUU7UUFDUixNQUFNLEVBQUUsYUFBYSxDQUFDLFVBQVU7S0FDakMsQ0FBQztJQUVGLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxTQUFTLEVBQUU7UUFDL0IsOEZBQThGO1FBQzlGLDBGQUEwRjtRQUMxRixzREFBc0Q7UUFDdEQsRUFBRTtRQUNGLDJGQUEyRjtRQUMzRix1RUFBdUU7UUFFdkUsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLElBQUks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QUFxQixDQUFDLFlBQVksQ0FBQyxDQUFDO0tBQzVDO0lBRUQsNkZBQTZGO0lBQzdGLHVCQUF1QjtJQUN2QixNQUFNO0lBQ04sd0VBQXdFO0lBQ3hFLE1BQU07SUFDTixNQUFNLGFBQWEsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7SUFDekYsT0FBTyxxQkFBcUIsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUM5QyxDQUFDO0FBRUQsU0FBUyxxQkFBcUIsQ0FBQyxJQUFrQjtJQUMvQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQ1AsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUNwQyxDQUFDLElBQUksQ0FBQyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgbyBmcm9tICcuL291dHB1dC9vdXRwdXRfYXN0JztcbmltcG9ydCB7Y29tcGlsZUZhY3RvcnlGdW5jdGlvbiwgRmFjdG9yeVRhcmdldCwgUjNEZXBlbmRlbmN5TWV0YWRhdGEsIFIzRmFjdG9yeURlbGVnYXRlVHlwZSwgUjNGYWN0b3J5TWV0YWRhdGF9IGZyb20gJy4vcmVuZGVyMy9yM19mYWN0b3J5JztcbmltcG9ydCB7SWRlbnRpZmllcnN9IGZyb20gJy4vcmVuZGVyMy9yM19pZGVudGlmaWVycyc7XG5pbXBvcnQge2NvbnZlcnRGcm9tTWF5YmVGb3J3YXJkUmVmRXhwcmVzc2lvbiwgRm9yd2FyZFJlZkhhbmRsaW5nLCBnZW5lcmF0ZUZvcndhcmRSZWYsIE1heWJlRm9yd2FyZFJlZkV4cHJlc3Npb24sIFIzQ29tcGlsZWRFeHByZXNzaW9uLCBSM1JlZmVyZW5jZSwgdHlwZVdpdGhQYXJhbWV0ZXJzfSBmcm9tICcuL3JlbmRlcjMvdXRpbCc7XG5pbXBvcnQge0RlZmluaXRpb25NYXB9IGZyb20gJy4vcmVuZGVyMy92aWV3L3V0aWwnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFIzSW5qZWN0YWJsZU1ldGFkYXRhIHtcbiAgbmFtZTogc3RyaW5nO1xuICB0eXBlOiBSM1JlZmVyZW5jZTtcbiAgaW50ZXJuYWxUeXBlOiBvLkV4cHJlc3Npb247XG4gIHR5cGVBcmd1bWVudENvdW50OiBudW1iZXI7XG4gIHByb3ZpZGVkSW46IE1heWJlRm9yd2FyZFJlZkV4cHJlc3Npb247XG4gIHVzZUNsYXNzPzogTWF5YmVGb3J3YXJkUmVmRXhwcmVzc2lvbjtcbiAgdXNlRmFjdG9yeT86IG8uRXhwcmVzc2lvbjtcbiAgdXNlRXhpc3Rpbmc/OiBNYXliZUZvcndhcmRSZWZFeHByZXNzaW9uO1xuICB1c2VWYWx1ZT86IE1heWJlRm9yd2FyZFJlZkV4cHJlc3Npb247XG4gIGRlcHM/OiBSM0RlcGVuZGVuY3lNZXRhZGF0YVtdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZUluamVjdGFibGUoXG4gICAgbWV0YTogUjNJbmplY3RhYmxlTWV0YWRhdGEsIHJlc29sdmVGb3J3YXJkUmVmczogYm9vbGVhbik6IFIzQ29tcGlsZWRFeHByZXNzaW9uIHtcbiAgbGV0IHJlc3VsdDoge2V4cHJlc3Npb246IG8uRXhwcmVzc2lvbiwgc3RhdGVtZW50czogby5TdGF0ZW1lbnRbXX18bnVsbCA9IG51bGw7XG5cbiAgY29uc3QgZmFjdG9yeU1ldGE6IFIzRmFjdG9yeU1ldGFkYXRhID0ge1xuICAgIG5hbWU6IG1ldGEubmFtZSxcbiAgICB0eXBlOiBtZXRhLnR5cGUsXG4gICAgaW50ZXJuYWxUeXBlOiBtZXRhLmludGVybmFsVHlwZSxcbiAgICB0eXBlQXJndW1lbnRDb3VudDogbWV0YS50eXBlQXJndW1lbnRDb3VudCxcbiAgICBkZXBzOiBbXSxcbiAgICB0YXJnZXQ6IEZhY3RvcnlUYXJnZXQuSW5qZWN0YWJsZSxcbiAgfTtcblxuICBpZiAobWV0YS51c2VDbGFzcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gbWV0YS51c2VDbGFzcyBoYXMgdHdvIG1vZGVzIG9mIG9wZXJhdGlvbi4gRWl0aGVyIGRlcHMgYXJlIHNwZWNpZmllZCwgaW4gd2hpY2ggY2FzZSBgbmV3YCBpc1xuICAgIC8vIHVzZWQgdG8gaW5zdGFudGlhdGUgdGhlIGNsYXNzIHdpdGggZGVwZW5kZW5jaWVzIGluamVjdGVkLCBvciBkZXBzIGFyZSBub3Qgc3BlY2lmaWVkIGFuZFxuICAgIC8vIHRoZSBmYWN0b3J5IG9mIHRoZSBjbGFzcyBpcyB1c2VkIHRvIGluc3RhbnRpYXRlIGl0LlxuICAgIC8vXG4gICAgLy8gQSBzcGVjaWFsIGNhc2UgZXhpc3RzIGZvciB1c2VDbGFzczogVHlwZSB3aGVyZSBUeXBlIGlzIHRoZSBpbmplY3RhYmxlIHR5cGUgaXRzZWxmIGFuZCBub1xuICAgIC8vIGRlcHMgYXJlIHNwZWNpZmllZCwgaW4gd2hpY2ggY2FzZSAndXNlQ2xhc3MnIGlzIGVmZmVjdGl2ZWx5IGlnbm9yZWQuXG5cbiAgICBjb25zdCB1c2VDbGFzc09uU2VsZiA9IG1ldGEudXNlQ2xhc3MuZXhwcmVzc2lvbi5pc0VxdWl2YWxlbnQobWV0YS5pbnRlcm5hbFR5cGUpO1xuICAgIGxldCBkZXBzOiBSM0RlcGVuZGVuY3lNZXRhZGF0YVtdfHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICBpZiAobWV0YS5kZXBzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGRlcHMgPSBtZXRhLmRlcHM7XG4gICAgfVxuXG4gICAgaWYgKGRlcHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gZmFjdG9yeTogKCkgPT4gbmV3IG1ldGEudXNlQ2xhc3MoLi4uZGVwcylcbiAgICAgIHJlc3VsdCA9IGNvbXBpbGVGYWN0b3J5RnVuY3Rpb24oe1xuICAgICAgICAuLi5mYWN0b3J5TWV0YSxcbiAgICAgICAgZGVsZWdhdGU6IG1ldGEudXNlQ2xhc3MuZXhwcmVzc2lvbixcbiAgICAgICAgZGVsZWdhdGVEZXBzOiBkZXBzLFxuICAgICAgICBkZWxlZ2F0ZVR5cGU6IFIzRmFjdG9yeURlbGVnYXRlVHlwZS5DbGFzcyxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodXNlQ2xhc3NPblNlbGYpIHtcbiAgICAgIHJlc3VsdCA9IGNvbXBpbGVGYWN0b3J5RnVuY3Rpb24oZmFjdG9yeU1ldGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQgPSB7XG4gICAgICAgIHN0YXRlbWVudHM6IFtdLFxuICAgICAgICBleHByZXNzaW9uOiBkZWxlZ2F0ZVRvRmFjdG9yeShcbiAgICAgICAgICAgIG1ldGEudHlwZS52YWx1ZSBhcyBvLldyYXBwZWROb2RlRXhwcjxhbnk+LFxuICAgICAgICAgICAgbWV0YS51c2VDbGFzcy5leHByZXNzaW9uIGFzIG8uV3JhcHBlZE5vZGVFeHByPGFueT4sIHJlc29sdmVGb3J3YXJkUmVmcylcbiAgICAgIH07XG4gICAgfVxuICB9IGVsc2UgaWYgKG1ldGEudXNlRmFjdG9yeSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaWYgKG1ldGEuZGVwcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXN1bHQgPSBjb21waWxlRmFjdG9yeUZ1bmN0aW9uKHtcbiAgICAgICAgLi4uZmFjdG9yeU1ldGEsXG4gICAgICAgIGRlbGVnYXRlOiBtZXRhLnVzZUZhY3RvcnksXG4gICAgICAgIGRlbGVnYXRlRGVwczogbWV0YS5kZXBzIHx8IFtdLFxuICAgICAgICBkZWxlZ2F0ZVR5cGU6IFIzRmFjdG9yeURlbGVnYXRlVHlwZS5GdW5jdGlvbixcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQgPSB7XG4gICAgICAgIHN0YXRlbWVudHM6IFtdLFxuICAgICAgICBleHByZXNzaW9uOiBvLmZuKFtdLCBbbmV3IG8uUmV0dXJuU3RhdGVtZW50KG1ldGEudXNlRmFjdG9yeS5jYWxsRm4oW10pKV0pXG4gICAgICB9O1xuICAgIH1cbiAgfSBlbHNlIGlmIChtZXRhLnVzZVZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBOb3RlOiBpdCdzIHNhZmUgdG8gdXNlIGBtZXRhLnVzZVZhbHVlYCBpbnN0ZWFkIG9mIHRoZSBgVVNFX1ZBTFVFIGluIG1ldGFgIGNoZWNrIHVzZWQgZm9yXG4gICAgLy8gY2xpZW50IGNvZGUgYmVjYXVzZSBtZXRhLnVzZVZhbHVlIGlzIGFuIEV4cHJlc3Npb24gd2hpY2ggd2lsbCBiZSBkZWZpbmVkIGV2ZW4gaWYgdGhlIGFjdHVhbFxuICAgIC8vIHZhbHVlIGlzIHVuZGVmaW5lZC5cbiAgICByZXN1bHQgPSBjb21waWxlRmFjdG9yeUZ1bmN0aW9uKHtcbiAgICAgIC4uLmZhY3RvcnlNZXRhLFxuICAgICAgZXhwcmVzc2lvbjogbWV0YS51c2VWYWx1ZS5leHByZXNzaW9uLFxuICAgIH0pO1xuICB9IGVsc2UgaWYgKG1ldGEudXNlRXhpc3RpbmcgIT09IHVuZGVmaW5lZCkge1xuICAgIC8vIHVzZUV4aXN0aW5nIGlzIGFuIGBpbmplY3RgIGNhbGwgb24gdGhlIGV4aXN0aW5nIHRva2VuLlxuICAgIHJlc3VsdCA9IGNvbXBpbGVGYWN0b3J5RnVuY3Rpb24oe1xuICAgICAgLi4uZmFjdG9yeU1ldGEsXG4gICAgICBleHByZXNzaW9uOiBvLmltcG9ydEV4cHIoSWRlbnRpZmllcnMuaW5qZWN0KS5jYWxsRm4oW21ldGEudXNlRXhpc3RpbmcuZXhwcmVzc2lvbl0pLFxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdCA9IHtcbiAgICAgIHN0YXRlbWVudHM6IFtdLFxuICAgICAgZXhwcmVzc2lvbjogZGVsZWdhdGVUb0ZhY3RvcnkoXG4gICAgICAgICAgbWV0YS50eXBlLnZhbHVlIGFzIG8uV3JhcHBlZE5vZGVFeHByPGFueT4sIG1ldGEuaW50ZXJuYWxUeXBlIGFzIG8uV3JhcHBlZE5vZGVFeHByPGFueT4sXG4gICAgICAgICAgcmVzb2x2ZUZvcndhcmRSZWZzKVxuICAgIH07XG4gIH1cblxuICBjb25zdCB0b2tlbiA9IG1ldGEuaW50ZXJuYWxUeXBlO1xuXG4gIGNvbnN0IGluamVjdGFibGVQcm9wcyA9XG4gICAgICBuZXcgRGVmaW5pdGlvbk1hcDx7dG9rZW46IG8uRXhwcmVzc2lvbiwgZmFjdG9yeTogby5FeHByZXNzaW9uLCBwcm92aWRlZEluOiBvLkV4cHJlc3Npb259PigpO1xuICBpbmplY3RhYmxlUHJvcHMuc2V0KCd0b2tlbicsIHRva2VuKTtcbiAgaW5qZWN0YWJsZVByb3BzLnNldCgnZmFjdG9yeScsIHJlc3VsdC5leHByZXNzaW9uKTtcblxuICAvLyBPbmx5IGdlbmVyYXRlIHByb3ZpZGVkSW4gcHJvcGVydHkgaWYgaXQgaGFzIGEgbm9uLW51bGwgdmFsdWVcbiAgaWYgKChtZXRhLnByb3ZpZGVkSW4uZXhwcmVzc2lvbiBhcyBvLkxpdGVyYWxFeHByKS52YWx1ZSAhPT0gbnVsbCkge1xuICAgIGluamVjdGFibGVQcm9wcy5zZXQoJ3Byb3ZpZGVkSW4nLCBjb252ZXJ0RnJvbU1heWJlRm9yd2FyZFJlZkV4cHJlc3Npb24obWV0YS5wcm92aWRlZEluKSk7XG4gIH1cblxuICBjb25zdCBleHByZXNzaW9uID0gby5pbXBvcnRFeHByKElkZW50aWZpZXJzLsm1ybVkZWZpbmVJbmplY3RhYmxlKVxuICAgICAgICAgICAgICAgICAgICAgICAgIC5jYWxsRm4oW2luamVjdGFibGVQcm9wcy50b0xpdGVyYWxNYXAoKV0sIHVuZGVmaW5lZCwgdHJ1ZSk7XG4gIHJldHVybiB7XG4gICAgZXhwcmVzc2lvbixcbiAgICB0eXBlOiBjcmVhdGVJbmplY3RhYmxlVHlwZShtZXRhKSxcbiAgICBzdGF0ZW1lbnRzOiByZXN1bHQuc3RhdGVtZW50cyxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUluamVjdGFibGVUeXBlKG1ldGE6IFIzSW5qZWN0YWJsZU1ldGFkYXRhKSB7XG4gIHJldHVybiBuZXcgby5FeHByZXNzaW9uVHlwZShvLmltcG9ydEV4cHIoXG4gICAgICBJZGVudGlmaWVycy5JbmplY3RhYmxlRGVjbGFyYXRpb24sXG4gICAgICBbdHlwZVdpdGhQYXJhbWV0ZXJzKG1ldGEudHlwZS50eXBlLCBtZXRhLnR5cGVBcmd1bWVudENvdW50KV0pKTtcbn1cblxuZnVuY3Rpb24gZGVsZWdhdGVUb0ZhY3RvcnkoXG4gICAgdHlwZTogby5XcmFwcGVkTm9kZUV4cHI8YW55PiwgaW50ZXJuYWxUeXBlOiBvLldyYXBwZWROb2RlRXhwcjxhbnk+LFxuICAgIHVud3JhcEZvcndhcmRSZWZzOiBib29sZWFuKTogby5FeHByZXNzaW9uIHtcbiAgaWYgKHR5cGUubm9kZSA9PT0gaW50ZXJuYWxUeXBlLm5vZGUpIHtcbiAgICAvLyBUaGUgdHlwZXMgYXJlIHRoZSBzYW1lLCBzbyB3ZSBjYW4gc2ltcGx5IGRlbGVnYXRlIGRpcmVjdGx5IHRvIHRoZSB0eXBlJ3MgZmFjdG9yeS5cbiAgICAvLyBgYGBcbiAgICAvLyBmYWN0b3J5OiB0eXBlLsm1ZmFjXG4gICAgLy8gYGBgXG4gICAgcmV0dXJuIGludGVybmFsVHlwZS5wcm9wKCfJtWZhYycpO1xuICB9XG5cbiAgaWYgKCF1bndyYXBGb3J3YXJkUmVmcykge1xuICAgIC8vIFRoZSB0eXBlIGlzIG5vdCB3cmFwcGVkIGluIGEgYGZvcndhcmRSZWYoKWAsIHNvIHdlIGNyZWF0ZSBhIHNpbXBsZSBmYWN0b3J5IGZ1bmN0aW9uIHRoYXRcbiAgICAvLyBhY2NlcHRzIGEgc3ViLXR5cGUgYXMgYW4gYXJndW1lbnQuXG4gICAgLy8gYGBgXG4gICAgLy8gZmFjdG9yeTogZnVuY3Rpb24odCkgeyByZXR1cm4gaW50ZXJuYWxUeXBlLsm1ZmFjKHQpOyB9XG4gICAgLy8gYGBgXG4gICAgcmV0dXJuIGNyZWF0ZUZhY3RvcnlGdW5jdGlvbihpbnRlcm5hbFR5cGUpO1xuICB9XG5cbiAgLy8gVGhlIGludGVybmFsVHlwZSBpcyBhY3R1YWxseSB3cmFwcGVkIGluIGEgYGZvcndhcmRSZWYoKWAgc28gd2UgbmVlZCB0byByZXNvbHZlIHRoYXQgYmVmb3JlXG4gIC8vIGNhbGxpbmcgaXRzIGZhY3RvcnkuXG4gIC8vIGBgYFxuICAvLyBmYWN0b3J5OiBmdW5jdGlvbih0KSB7IHJldHVybiBjb3JlLnJlc29sdmVGb3J3YXJkUmVmKHR5cGUpLsm1ZmFjKHQpOyB9XG4gIC8vIGBgYFxuICBjb25zdCB1bndyYXBwZWRUeXBlID0gby5pbXBvcnRFeHByKElkZW50aWZpZXJzLnJlc29sdmVGb3J3YXJkUmVmKS5jYWxsRm4oW2ludGVybmFsVHlwZV0pO1xuICByZXR1cm4gY3JlYXRlRmFjdG9yeUZ1bmN0aW9uKHVud3JhcHBlZFR5cGUpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVGYWN0b3J5RnVuY3Rpb24odHlwZTogby5FeHByZXNzaW9uKTogby5GdW5jdGlvbkV4cHIge1xuICByZXR1cm4gby5mbihcbiAgICAgIFtuZXcgby5GblBhcmFtKCd0Jywgby5EWU5BTUlDX1RZUEUpXSxcbiAgICAgIFtuZXcgby5SZXR1cm5TdGF0ZW1lbnQodHlwZS5wcm9wKCfJtWZhYycpLmNhbGxGbihbby52YXJpYWJsZSgndCcpXSkpXSk7XG59XG4iXX0=