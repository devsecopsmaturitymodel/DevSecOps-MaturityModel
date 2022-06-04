/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injector } from './injector';
import { THROW_IF_NOT_FOUND } from './injector_compatibility';
import { Self, SkipSelf } from './metadata';
import { cyclicDependencyError, instantiationError, noProviderError, outOfBoundsError } from './reflective_errors';
import { ReflectiveKey } from './reflective_key';
import { resolveReflectiveProviders } from './reflective_provider';
// Threshold for the dynamic version
const UNDEFINED = {};
/**
 * A ReflectiveDependency injection container used for instantiating objects and resolving
 * dependencies.
 *
 * An `Injector` is a replacement for a `new` operator, which can automatically resolve the
 * constructor dependencies.
 *
 * In typical use, application code asks for the dependencies in the constructor and they are
 * resolved by the `Injector`.
 *
 * @usageNotes
 * ### Example
 *
 * The following example creates an `Injector` configured to create `Engine` and `Car`.
 *
 * ```typescript
 * @Injectable()
 * class Engine {
 * }
 *
 * @Injectable()
 * class Car {
 *   constructor(public engine:Engine) {}
 * }
 *
 * var injector = ReflectiveInjector.resolveAndCreate([Car, Engine]);
 * var car = injector.get(Car);
 * expect(car instanceof Car).toBe(true);
 * expect(car.engine instanceof Engine).toBe(true);
 * ```
 *
 * Notice, we don't use the `new` operator because we explicitly want to have the `Injector`
 * resolve all of the object's dependencies automatically.
 *
 * TODO: delete in v14.
 *
 * @deprecated from v5 - slow and brings in a lot of code, Use `Injector.create` instead.
 * @publicApi
 */
export class ReflectiveInjector {
    /**
     * Turns an array of provider definitions into an array of resolved providers.
     *
     * A resolution is a process of flattening multiple nested arrays and converting individual
     * providers into an array of `ResolvedReflectiveProvider`s.
     *
     * @usageNotes
     * ### Example
     *
     * ```typescript
     * @Injectable()
     * class Engine {
     * }
     *
     * @Injectable()
     * class Car {
     *   constructor(public engine:Engine) {}
     * }
     *
     * var providers = ReflectiveInjector.resolve([Car, [[Engine]]]);
     *
     * expect(providers.length).toEqual(2);
     *
     * expect(providers[0] instanceof ResolvedReflectiveProvider).toBe(true);
     * expect(providers[0].key.displayName).toBe("Car");
     * expect(providers[0].dependencies.length).toEqual(1);
     * expect(providers[0].factory).toBeDefined();
     *
     * expect(providers[1].key.displayName).toBe("Engine");
     * });
     * ```
     *
     */
    static resolve(providers) {
        return resolveReflectiveProviders(providers);
    }
    /**
     * Resolves an array of providers and creates an injector from those providers.
     *
     * The passed-in providers can be an array of `Type`, `Provider`,
     * or a recursive array of more providers.
     *
     * @usageNotes
     * ### Example
     *
     * ```typescript
     * @Injectable()
     * class Engine {
     * }
     *
     * @Injectable()
     * class Car {
     *   constructor(public engine:Engine) {}
     * }
     *
     * var injector = ReflectiveInjector.resolveAndCreate([Car, Engine]);
     * expect(injector.get(Car) instanceof Car).toBe(true);
     * ```
     */
    static resolveAndCreate(providers, parent) {
        const ResolvedReflectiveProviders = ReflectiveInjector.resolve(providers);
        return ReflectiveInjector.fromResolvedProviders(ResolvedReflectiveProviders, parent);
    }
    /**
     * Creates an injector from previously resolved providers.
     *
     * This API is the recommended way to construct injectors in performance-sensitive parts.
     *
     * @usageNotes
     * ### Example
     *
     * ```typescript
     * @Injectable()
     * class Engine {
     * }
     *
     * @Injectable()
     * class Car {
     *   constructor(public engine:Engine) {}
     * }
     *
     * var providers = ReflectiveInjector.resolve([Car, Engine]);
     * var injector = ReflectiveInjector.fromResolvedProviders(providers);
     * expect(injector.get(Car) instanceof Car).toBe(true);
     * ```
     */
    static fromResolvedProviders(providers, parent) {
        return new ReflectiveInjector_(providers, parent);
    }
}
export class ReflectiveInjector_ {
    /**
     * Private
     */
    constructor(_providers, _parent) {
        /** @internal */
        this._constructionCounter = 0;
        this._providers = _providers;
        this.parent = _parent || null;
        const len = _providers.length;
        this.keyIds = [];
        this.objs = [];
        for (let i = 0; i < len; i++) {
            this.keyIds[i] = _providers[i].key.id;
            this.objs[i] = UNDEFINED;
        }
    }
    get(token, notFoundValue = THROW_IF_NOT_FOUND) {
        return this._getByKey(ReflectiveKey.get(token), null, notFoundValue);
    }
    resolveAndCreateChild(providers) {
        const ResolvedReflectiveProviders = ReflectiveInjector.resolve(providers);
        return this.createChildFromResolved(ResolvedReflectiveProviders);
    }
    createChildFromResolved(providers) {
        const inj = new ReflectiveInjector_(providers);
        inj.parent = this;
        return inj;
    }
    resolveAndInstantiate(provider) {
        return this.instantiateResolved(ReflectiveInjector.resolve([provider])[0]);
    }
    instantiateResolved(provider) {
        return this._instantiateProvider(provider);
    }
    getProviderAtIndex(index) {
        if (index < 0 || index >= this._providers.length) {
            throw outOfBoundsError(index);
        }
        return this._providers[index];
    }
    /** @internal */
    _new(provider) {
        if (this._constructionCounter++ > this._getMaxNumberOfObjects()) {
            throw cyclicDependencyError(this, provider.key);
        }
        return this._instantiateProvider(provider);
    }
    _getMaxNumberOfObjects() {
        return this.objs.length;
    }
    _instantiateProvider(provider) {
        if (provider.multiProvider) {
            const res = [];
            for (let i = 0; i < provider.resolvedFactories.length; ++i) {
                res[i] = this._instantiate(provider, provider.resolvedFactories[i]);
            }
            return res;
        }
        else {
            return this._instantiate(provider, provider.resolvedFactories[0]);
        }
    }
    _instantiate(provider, ResolvedReflectiveFactory) {
        const factory = ResolvedReflectiveFactory.factory;
        let deps;
        try {
            deps =
                ResolvedReflectiveFactory.dependencies.map(dep => this._getByReflectiveDependency(dep));
        }
        catch (e) {
            if (e.addKey) {
                e.addKey(this, provider.key);
            }
            throw e;
        }
        let obj;
        try {
            obj = factory(...deps);
        }
        catch (e) {
            throw instantiationError(this, e, e.stack, provider.key);
        }
        return obj;
    }
    _getByReflectiveDependency(dep) {
        return this._getByKey(dep.key, dep.visibility, dep.optional ? null : THROW_IF_NOT_FOUND);
    }
    _getByKey(key, visibility, notFoundValue) {
        if (key === ReflectiveInjector_.INJECTOR_KEY) {
            return this;
        }
        if (visibility instanceof Self) {
            return this._getByKeySelf(key, notFoundValue);
        }
        else {
            return this._getByKeyDefault(key, notFoundValue, visibility);
        }
    }
    _getObjByKeyId(keyId) {
        for (let i = 0; i < this.keyIds.length; i++) {
            if (this.keyIds[i] === keyId) {
                if (this.objs[i] === UNDEFINED) {
                    this.objs[i] = this._new(this._providers[i]);
                }
                return this.objs[i];
            }
        }
        return UNDEFINED;
    }
    /** @internal */
    _throwOrNull(key, notFoundValue) {
        if (notFoundValue !== THROW_IF_NOT_FOUND) {
            return notFoundValue;
        }
        else {
            throw noProviderError(this, key);
        }
    }
    /** @internal */
    _getByKeySelf(key, notFoundValue) {
        const obj = this._getObjByKeyId(key.id);
        return (obj !== UNDEFINED) ? obj : this._throwOrNull(key, notFoundValue);
    }
    /** @internal */
    _getByKeyDefault(key, notFoundValue, visibility) {
        let inj;
        if (visibility instanceof SkipSelf) {
            inj = this.parent;
        }
        else {
            inj = this;
        }
        while (inj instanceof ReflectiveInjector_) {
            const inj_ = inj;
            const obj = inj_._getObjByKeyId(key.id);
            if (obj !== UNDEFINED)
                return obj;
            inj = inj_.parent;
        }
        if (inj !== null) {
            return inj.get(key.token, notFoundValue);
        }
        else {
            return this._throwOrNull(key, notFoundValue);
        }
    }
    get displayName() {
        const providers = _mapProviders(this, (b) => ' "' + b.key.displayName + '" ')
            .join(', ');
        return `ReflectiveInjector(providers: [${providers}])`;
    }
    toString() {
        return this.displayName;
    }
}
ReflectiveInjector_.INJECTOR_KEY = ( /* @__PURE__ */ReflectiveKey.get(Injector));
function _mapProviders(injector, fn) {
    const res = [];
    for (let i = 0; i < injector._providers.length; ++i) {
        res[i] = fn(injector.getProviderAtIndex(i));
    }
    return res;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmbGVjdGl2ZV9pbmplY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL2RpL3JlZmxlY3RpdmVfaW5qZWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNwQyxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUU1RCxPQUFPLEVBQUMsSUFBSSxFQUFFLFFBQVEsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUMxQyxPQUFPLEVBQUMscUJBQXFCLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxFQUFFLGdCQUFnQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDakgsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQy9DLE9BQU8sRUFBOEUsMEJBQTBCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUc5SSxvQ0FBb0M7QUFDcEMsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBRXJCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNDRztBQUNILE1BQU0sT0FBZ0Isa0JBQWtCO0lBQ3RDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQWdDRztJQUNILE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBcUI7UUFDbEMsT0FBTywwQkFBMEIsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FzQkc7SUFDSCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBcUIsRUFBRSxNQUFpQjtRQUM5RCxNQUFNLDJCQUEyQixHQUFHLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMxRSxPQUFPLGtCQUFrQixDQUFDLHFCQUFxQixDQUFDLDJCQUEyQixFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZGLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXNCRztJQUNILE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxTQUF1QyxFQUFFLE1BQWlCO1FBRXJGLE9BQU8sSUFBSSxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDcEQsQ0FBQztDQXdIRjtBQUVELE1BQU0sT0FBTyxtQkFBbUI7SUFVOUI7O09BRUc7SUFDSCxZQUFZLFVBQXdDLEVBQUUsT0FBa0I7UUFYeEUsZ0JBQWdCO1FBQ2hCLHlCQUFvQixHQUFXLENBQUMsQ0FBQztRQVcvQixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sSUFBSSxJQUFJLENBQUM7UUFFOUIsTUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQztRQUU5QixJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUVmLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUN0QyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQztTQUMxQjtJQUNILENBQUM7SUFFRCxHQUFHLENBQUMsS0FBVSxFQUFFLGdCQUFxQixrQkFBa0I7UUFDckQsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUFFRCxxQkFBcUIsQ0FBQyxTQUFxQjtRQUN6QyxNQUFNLDJCQUEyQixHQUFHLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMxRSxPQUFPLElBQUksQ0FBQyx1QkFBdUIsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFRCx1QkFBdUIsQ0FBQyxTQUF1QztRQUM3RCxNQUFNLEdBQUcsR0FBRyxJQUFJLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzlDLEdBQWlDLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUNqRCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFRCxxQkFBcUIsQ0FBQyxRQUFrQjtRQUN0QyxPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0UsQ0FBQztJQUVELG1CQUFtQixDQUFDLFFBQW9DO1FBQ3RELE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCxrQkFBa0IsQ0FBQyxLQUFhO1FBQzlCLElBQUksS0FBSyxHQUFHLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7WUFDaEQsTUFBTSxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUMvQjtRQUNELE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLElBQUksQ0FBQyxRQUFvQztRQUN2QyxJQUFJLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxFQUFFO1lBQy9ELE1BQU0scUJBQXFCLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNqRDtRQUNELE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFTyxzQkFBc0I7UUFDNUIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUMxQixDQUFDO0lBRU8sb0JBQW9CLENBQUMsUUFBb0M7UUFDL0QsSUFBSSxRQUFRLENBQUMsYUFBYSxFQUFFO1lBQzFCLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztZQUNmLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO2dCQUMxRCxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDckU7WUFDRCxPQUFPLEdBQUcsQ0FBQztTQUNaO2FBQU07WUFDTCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ25FO0lBQ0gsQ0FBQztJQUVPLFlBQVksQ0FDaEIsUUFBb0MsRUFDcEMseUJBQW9EO1FBQ3RELE1BQU0sT0FBTyxHQUFHLHlCQUF5QixDQUFDLE9BQU8sQ0FBQztRQUVsRCxJQUFJLElBQVcsQ0FBQztRQUNoQixJQUFJO1lBQ0YsSUFBSTtnQkFDQSx5QkFBeUIsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDN0Y7UUFBQyxPQUFPLENBQU0sRUFBRTtZQUNmLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRTtnQkFDWixDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDOUI7WUFDRCxNQUFNLENBQUMsQ0FBQztTQUNUO1FBRUQsSUFBSSxHQUFRLENBQUM7UUFDYixJQUFJO1lBQ0YsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1NBQ3hCO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDVixNQUFNLGtCQUFrQixDQUFDLElBQUksRUFBRSxDQUFDLEVBQUcsQ0FBVyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDckU7UUFFRCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFTywwQkFBMEIsQ0FBQyxHQUF5QjtRQUMxRCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUMzRixDQUFDO0lBRU8sU0FBUyxDQUFDLEdBQWtCLEVBQUUsVUFBOEIsRUFBRSxhQUFrQjtRQUN0RixJQUFJLEdBQUcsS0FBSyxtQkFBbUIsQ0FBQyxZQUFZLEVBQUU7WUFDNUMsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELElBQUksVUFBVSxZQUFZLElBQUksRUFBRTtZQUM5QixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1NBRS9DO2FBQU07WUFDTCxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsYUFBYSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1NBQzlEO0lBQ0gsQ0FBQztJQUVPLGNBQWMsQ0FBQyxLQUFhO1FBQ2xDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMzQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxFQUFFO2dCQUM1QixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxFQUFFO29CQUM5QixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUM5QztnQkFFRCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDckI7U0FDRjtRQUVELE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIsWUFBWSxDQUFDLEdBQWtCLEVBQUUsYUFBa0I7UUFDakQsSUFBSSxhQUFhLEtBQUssa0JBQWtCLEVBQUU7WUFDeEMsT0FBTyxhQUFhLENBQUM7U0FDdEI7YUFBTTtZQUNMLE1BQU0sZUFBZSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztTQUNsQztJQUNILENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIsYUFBYSxDQUFDLEdBQWtCLEVBQUUsYUFBa0I7UUFDbEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDeEMsT0FBTyxDQUFDLEdBQUcsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLGdCQUFnQixDQUFDLEdBQWtCLEVBQUUsYUFBa0IsRUFBRSxVQUE4QjtRQUNyRixJQUFJLEdBQWtCLENBQUM7UUFFdkIsSUFBSSxVQUFVLFlBQVksUUFBUSxFQUFFO1lBQ2xDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1NBQ25CO2FBQU07WUFDTCxHQUFHLEdBQUcsSUFBSSxDQUFDO1NBQ1o7UUFFRCxPQUFPLEdBQUcsWUFBWSxtQkFBbUIsRUFBRTtZQUN6QyxNQUFNLElBQUksR0FBd0IsR0FBRyxDQUFDO1lBQ3RDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3hDLElBQUksR0FBRyxLQUFLLFNBQVM7Z0JBQUUsT0FBTyxHQUFHLENBQUM7WUFDbEMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7U0FDbkI7UUFDRCxJQUFJLEdBQUcsS0FBSyxJQUFJLEVBQUU7WUFDaEIsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7U0FDMUM7YUFBTTtZQUNMLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsYUFBYSxDQUFDLENBQUM7U0FDOUM7SUFDSCxDQUFDO0lBRUQsSUFBSSxXQUFXO1FBQ2IsTUFBTSxTQUFTLEdBQ1gsYUFBYSxDQUFDLElBQUksRUFBRSxDQUFDLENBQTZCLEVBQUUsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7YUFDbEYsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BCLE9BQU8sa0NBQWtDLFNBQVMsSUFBSSxDQUFDO0lBQ3pELENBQUM7SUFFRCxRQUFRO1FBQ04sT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQzFCLENBQUM7O0FBekxjLGdDQUFZLEdBQUcsRUFBQyxlQUFnQixhQUFhLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUE0TDlFLFNBQVMsYUFBYSxDQUFDLFFBQTZCLEVBQUUsRUFBWTtJQUNoRSxNQUFNLEdBQUcsR0FBVSxFQUFFLENBQUM7SUFDdEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1FBQ25ELEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDN0M7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtJbmplY3Rvcn0gZnJvbSAnLi9pbmplY3Rvcic7XG5pbXBvcnQge1RIUk9XX0lGX05PVF9GT1VORH0gZnJvbSAnLi9pbmplY3Rvcl9jb21wYXRpYmlsaXR5JztcbmltcG9ydCB7UHJvdmlkZXJ9IGZyb20gJy4vaW50ZXJmYWNlL3Byb3ZpZGVyJztcbmltcG9ydCB7U2VsZiwgU2tpcFNlbGZ9IGZyb20gJy4vbWV0YWRhdGEnO1xuaW1wb3J0IHtjeWNsaWNEZXBlbmRlbmN5RXJyb3IsIGluc3RhbnRpYXRpb25FcnJvciwgbm9Qcm92aWRlckVycm9yLCBvdXRPZkJvdW5kc0Vycm9yfSBmcm9tICcuL3JlZmxlY3RpdmVfZXJyb3JzJztcbmltcG9ydCB7UmVmbGVjdGl2ZUtleX0gZnJvbSAnLi9yZWZsZWN0aXZlX2tleSc7XG5pbXBvcnQge1JlZmxlY3RpdmVEZXBlbmRlbmN5LCBSZXNvbHZlZFJlZmxlY3RpdmVGYWN0b3J5LCBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlciwgcmVzb2x2ZVJlZmxlY3RpdmVQcm92aWRlcnN9IGZyb20gJy4vcmVmbGVjdGl2ZV9wcm92aWRlcic7XG5cblxuLy8gVGhyZXNob2xkIGZvciB0aGUgZHluYW1pYyB2ZXJzaW9uXG5jb25zdCBVTkRFRklORUQgPSB7fTtcblxuLyoqXG4gKiBBIFJlZmxlY3RpdmVEZXBlbmRlbmN5IGluamVjdGlvbiBjb250YWluZXIgdXNlZCBmb3IgaW5zdGFudGlhdGluZyBvYmplY3RzIGFuZCByZXNvbHZpbmdcbiAqIGRlcGVuZGVuY2llcy5cbiAqXG4gKiBBbiBgSW5qZWN0b3JgIGlzIGEgcmVwbGFjZW1lbnQgZm9yIGEgYG5ld2Agb3BlcmF0b3IsIHdoaWNoIGNhbiBhdXRvbWF0aWNhbGx5IHJlc29sdmUgdGhlXG4gKiBjb25zdHJ1Y3RvciBkZXBlbmRlbmNpZXMuXG4gKlxuICogSW4gdHlwaWNhbCB1c2UsIGFwcGxpY2F0aW9uIGNvZGUgYXNrcyBmb3IgdGhlIGRlcGVuZGVuY2llcyBpbiB0aGUgY29uc3RydWN0b3IgYW5kIHRoZXkgYXJlXG4gKiByZXNvbHZlZCBieSB0aGUgYEluamVjdG9yYC5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICogIyMjIEV4YW1wbGVcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgY3JlYXRlcyBhbiBgSW5qZWN0b3JgIGNvbmZpZ3VyZWQgdG8gY3JlYXRlIGBFbmdpbmVgIGFuZCBgQ2FyYC5cbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBASW5qZWN0YWJsZSgpXG4gKiBjbGFzcyBFbmdpbmUge1xuICogfVxuICpcbiAqIEBJbmplY3RhYmxlKClcbiAqIGNsYXNzIENhciB7XG4gKiAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbmdpbmU6RW5naW5lKSB7fVxuICogfVxuICpcbiAqIHZhciBpbmplY3RvciA9IFJlZmxlY3RpdmVJbmplY3Rvci5yZXNvbHZlQW5kQ3JlYXRlKFtDYXIsIEVuZ2luZV0pO1xuICogdmFyIGNhciA9IGluamVjdG9yLmdldChDYXIpO1xuICogZXhwZWN0KGNhciBpbnN0YW5jZW9mIENhcikudG9CZSh0cnVlKTtcbiAqIGV4cGVjdChjYXIuZW5naW5lIGluc3RhbmNlb2YgRW5naW5lKS50b0JlKHRydWUpO1xuICogYGBgXG4gKlxuICogTm90aWNlLCB3ZSBkb24ndCB1c2UgdGhlIGBuZXdgIG9wZXJhdG9yIGJlY2F1c2Ugd2UgZXhwbGljaXRseSB3YW50IHRvIGhhdmUgdGhlIGBJbmplY3RvcmBcbiAqIHJlc29sdmUgYWxsIG9mIHRoZSBvYmplY3QncyBkZXBlbmRlbmNpZXMgYXV0b21hdGljYWxseS5cbiAqXG4gKiBUT0RPOiBkZWxldGUgaW4gdjE0LlxuICpcbiAqIEBkZXByZWNhdGVkIGZyb20gdjUgLSBzbG93IGFuZCBicmluZ3MgaW4gYSBsb3Qgb2YgY29kZSwgVXNlIGBJbmplY3Rvci5jcmVhdGVgIGluc3RlYWQuXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBSZWZsZWN0aXZlSW5qZWN0b3IgaW1wbGVtZW50cyBJbmplY3RvciB7XG4gIC8qKlxuICAgKiBUdXJucyBhbiBhcnJheSBvZiBwcm92aWRlciBkZWZpbml0aW9ucyBpbnRvIGFuIGFycmF5IG9mIHJlc29sdmVkIHByb3ZpZGVycy5cbiAgICpcbiAgICogQSByZXNvbHV0aW9uIGlzIGEgcHJvY2VzcyBvZiBmbGF0dGVuaW5nIG11bHRpcGxlIG5lc3RlZCBhcnJheXMgYW5kIGNvbnZlcnRpbmcgaW5kaXZpZHVhbFxuICAgKiBwcm92aWRlcnMgaW50byBhbiBhcnJheSBvZiBgUmVzb2x2ZWRSZWZsZWN0aXZlUHJvdmlkZXJgcy5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogIyMjIEV4YW1wbGVcbiAgICpcbiAgICogYGBgdHlwZXNjcmlwdFxuICAgKiBASW5qZWN0YWJsZSgpXG4gICAqIGNsYXNzIEVuZ2luZSB7XG4gICAqIH1cbiAgICpcbiAgICogQEluamVjdGFibGUoKVxuICAgKiBjbGFzcyBDYXIge1xuICAgKiAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbmdpbmU6RW5naW5lKSB7fVxuICAgKiB9XG4gICAqXG4gICAqIHZhciBwcm92aWRlcnMgPSBSZWZsZWN0aXZlSW5qZWN0b3IucmVzb2x2ZShbQ2FyLCBbW0VuZ2luZV1dXSk7XG4gICAqXG4gICAqIGV4cGVjdChwcm92aWRlcnMubGVuZ3RoKS50b0VxdWFsKDIpO1xuICAgKlxuICAgKiBleHBlY3QocHJvdmlkZXJzWzBdIGluc3RhbmNlb2YgUmVzb2x2ZWRSZWZsZWN0aXZlUHJvdmlkZXIpLnRvQmUodHJ1ZSk7XG4gICAqIGV4cGVjdChwcm92aWRlcnNbMF0ua2V5LmRpc3BsYXlOYW1lKS50b0JlKFwiQ2FyXCIpO1xuICAgKiBleHBlY3QocHJvdmlkZXJzWzBdLmRlcGVuZGVuY2llcy5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAqIGV4cGVjdChwcm92aWRlcnNbMF0uZmFjdG9yeSkudG9CZURlZmluZWQoKTtcbiAgICpcbiAgICogZXhwZWN0KHByb3ZpZGVyc1sxXS5rZXkuZGlzcGxheU5hbWUpLnRvQmUoXCJFbmdpbmVcIik7XG4gICAqIH0pO1xuICAgKiBgYGBcbiAgICpcbiAgICovXG4gIHN0YXRpYyByZXNvbHZlKHByb3ZpZGVyczogUHJvdmlkZXJbXSk6IFJlc29sdmVkUmVmbGVjdGl2ZVByb3ZpZGVyW10ge1xuICAgIHJldHVybiByZXNvbHZlUmVmbGVjdGl2ZVByb3ZpZGVycyhwcm92aWRlcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc29sdmVzIGFuIGFycmF5IG9mIHByb3ZpZGVycyBhbmQgY3JlYXRlcyBhbiBpbmplY3RvciBmcm9tIHRob3NlIHByb3ZpZGVycy5cbiAgICpcbiAgICogVGhlIHBhc3NlZC1pbiBwcm92aWRlcnMgY2FuIGJlIGFuIGFycmF5IG9mIGBUeXBlYCwgYFByb3ZpZGVyYCxcbiAgICogb3IgYSByZWN1cnNpdmUgYXJyYXkgb2YgbW9yZSBwcm92aWRlcnMuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqICMjIyBFeGFtcGxlXG4gICAqXG4gICAqIGBgYHR5cGVzY3JpcHRcbiAgICogQEluamVjdGFibGUoKVxuICAgKiBjbGFzcyBFbmdpbmUge1xuICAgKiB9XG4gICAqXG4gICAqIEBJbmplY3RhYmxlKClcbiAgICogY2xhc3MgQ2FyIHtcbiAgICogICBjb25zdHJ1Y3RvcihwdWJsaWMgZW5naW5lOkVuZ2luZSkge31cbiAgICogfVxuICAgKlxuICAgKiB2YXIgaW5qZWN0b3IgPSBSZWZsZWN0aXZlSW5qZWN0b3IucmVzb2x2ZUFuZENyZWF0ZShbQ2FyLCBFbmdpbmVdKTtcbiAgICogZXhwZWN0KGluamVjdG9yLmdldChDYXIpIGluc3RhbmNlb2YgQ2FyKS50b0JlKHRydWUpO1xuICAgKiBgYGBcbiAgICovXG4gIHN0YXRpYyByZXNvbHZlQW5kQ3JlYXRlKHByb3ZpZGVyczogUHJvdmlkZXJbXSwgcGFyZW50PzogSW5qZWN0b3IpOiBSZWZsZWN0aXZlSW5qZWN0b3Ige1xuICAgIGNvbnN0IFJlc29sdmVkUmVmbGVjdGl2ZVByb3ZpZGVycyA9IFJlZmxlY3RpdmVJbmplY3Rvci5yZXNvbHZlKHByb3ZpZGVycyk7XG4gICAgcmV0dXJuIFJlZmxlY3RpdmVJbmplY3Rvci5mcm9tUmVzb2x2ZWRQcm92aWRlcnMoUmVzb2x2ZWRSZWZsZWN0aXZlUHJvdmlkZXJzLCBwYXJlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5qZWN0b3IgZnJvbSBwcmV2aW91c2x5IHJlc29sdmVkIHByb3ZpZGVycy5cbiAgICpcbiAgICogVGhpcyBBUEkgaXMgdGhlIHJlY29tbWVuZGVkIHdheSB0byBjb25zdHJ1Y3QgaW5qZWN0b3JzIGluIHBlcmZvcm1hbmNlLXNlbnNpdGl2ZSBwYXJ0cy5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogIyMjIEV4YW1wbGVcbiAgICpcbiAgICogYGBgdHlwZXNjcmlwdFxuICAgKiBASW5qZWN0YWJsZSgpXG4gICAqIGNsYXNzIEVuZ2luZSB7XG4gICAqIH1cbiAgICpcbiAgICogQEluamVjdGFibGUoKVxuICAgKiBjbGFzcyBDYXIge1xuICAgKiAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbmdpbmU6RW5naW5lKSB7fVxuICAgKiB9XG4gICAqXG4gICAqIHZhciBwcm92aWRlcnMgPSBSZWZsZWN0aXZlSW5qZWN0b3IucmVzb2x2ZShbQ2FyLCBFbmdpbmVdKTtcbiAgICogdmFyIGluamVjdG9yID0gUmVmbGVjdGl2ZUluamVjdG9yLmZyb21SZXNvbHZlZFByb3ZpZGVycyhwcm92aWRlcnMpO1xuICAgKiBleHBlY3QoaW5qZWN0b3IuZ2V0KENhcikgaW5zdGFuY2VvZiBDYXIpLnRvQmUodHJ1ZSk7XG4gICAqIGBgYFxuICAgKi9cbiAgc3RhdGljIGZyb21SZXNvbHZlZFByb3ZpZGVycyhwcm92aWRlcnM6IFJlc29sdmVkUmVmbGVjdGl2ZVByb3ZpZGVyW10sIHBhcmVudD86IEluamVjdG9yKTpcbiAgICAgIFJlZmxlY3RpdmVJbmplY3RvciB7XG4gICAgcmV0dXJuIG5ldyBSZWZsZWN0aXZlSW5qZWN0b3JfKHByb3ZpZGVycywgcGFyZW50KTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFBhcmVudCBvZiB0aGlzIGluamVjdG9yLlxuICAgKlxuICAgKiA8IS0tIFRPRE86IEFkZCBhIGxpbmsgdG8gdGhlIHNlY3Rpb24gb2YgdGhlIHVzZXIgZ3VpZGUgdGFsa2luZyBhYm91dCBoaWVyYXJjaGljYWwgaW5qZWN0aW9uLlxuICAgKiAtLT5cbiAgICovXG4gIGFic3RyYWN0IGdldCBwYXJlbnQoKTogSW5qZWN0b3J8bnVsbDtcblxuICAvKipcbiAgICogUmVzb2x2ZXMgYW4gYXJyYXkgb2YgcHJvdmlkZXJzIGFuZCBjcmVhdGVzIGEgY2hpbGQgaW5qZWN0b3IgZnJvbSB0aG9zZSBwcm92aWRlcnMuXG4gICAqXG4gICAqIDwhLS0gVE9ETzogQWRkIGEgbGluayB0byB0aGUgc2VjdGlvbiBvZiB0aGUgdXNlciBndWlkZSB0YWxraW5nIGFib3V0IGhpZXJhcmNoaWNhbCBpbmplY3Rpb24uXG4gICAqIC0tPlxuICAgKlxuICAgKiBUaGUgcGFzc2VkLWluIHByb3ZpZGVycyBjYW4gYmUgYW4gYXJyYXkgb2YgYFR5cGVgLCBgUHJvdmlkZXJgLFxuICAgKiBvciBhIHJlY3Vyc2l2ZSBhcnJheSBvZiBtb3JlIHByb3ZpZGVycy5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogIyMjIEV4YW1wbGVcbiAgICpcbiAgICogYGBgdHlwZXNjcmlwdFxuICAgKiBjbGFzcyBQYXJlbnRQcm92aWRlciB7fVxuICAgKiBjbGFzcyBDaGlsZFByb3ZpZGVyIHt9XG4gICAqXG4gICAqIHZhciBwYXJlbnQgPSBSZWZsZWN0aXZlSW5qZWN0b3IucmVzb2x2ZUFuZENyZWF0ZShbUGFyZW50UHJvdmlkZXJdKTtcbiAgICogdmFyIGNoaWxkID0gcGFyZW50LnJlc29sdmVBbmRDcmVhdGVDaGlsZChbQ2hpbGRQcm92aWRlcl0pO1xuICAgKlxuICAgKiBleHBlY3QoY2hpbGQuZ2V0KFBhcmVudFByb3ZpZGVyKSBpbnN0YW5jZW9mIFBhcmVudFByb3ZpZGVyKS50b0JlKHRydWUpO1xuICAgKiBleHBlY3QoY2hpbGQuZ2V0KENoaWxkUHJvdmlkZXIpIGluc3RhbmNlb2YgQ2hpbGRQcm92aWRlcikudG9CZSh0cnVlKTtcbiAgICogZXhwZWN0KGNoaWxkLmdldChQYXJlbnRQcm92aWRlcikpLnRvQmUocGFyZW50LmdldChQYXJlbnRQcm92aWRlcikpO1xuICAgKiBgYGBcbiAgICovXG4gIGFic3RyYWN0IHJlc29sdmVBbmRDcmVhdGVDaGlsZChwcm92aWRlcnM6IFByb3ZpZGVyW10pOiBSZWZsZWN0aXZlSW5qZWN0b3I7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBjaGlsZCBpbmplY3RvciBmcm9tIHByZXZpb3VzbHkgcmVzb2x2ZWQgcHJvdmlkZXJzLlxuICAgKlxuICAgKiA8IS0tIFRPRE86IEFkZCBhIGxpbmsgdG8gdGhlIHNlY3Rpb24gb2YgdGhlIHVzZXIgZ3VpZGUgdGFsa2luZyBhYm91dCBoaWVyYXJjaGljYWwgaW5qZWN0aW9uLlxuICAgKiAtLT5cbiAgICpcbiAgICogVGhpcyBBUEkgaXMgdGhlIHJlY29tbWVuZGVkIHdheSB0byBjb25zdHJ1Y3QgaW5qZWN0b3JzIGluIHBlcmZvcm1hbmNlLXNlbnNpdGl2ZSBwYXJ0cy5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogIyMjIEV4YW1wbGVcbiAgICpcbiAgICogYGBgdHlwZXNjcmlwdFxuICAgKiBjbGFzcyBQYXJlbnRQcm92aWRlciB7fVxuICAgKiBjbGFzcyBDaGlsZFByb3ZpZGVyIHt9XG4gICAqXG4gICAqIHZhciBwYXJlbnRQcm92aWRlcnMgPSBSZWZsZWN0aXZlSW5qZWN0b3IucmVzb2x2ZShbUGFyZW50UHJvdmlkZXJdKTtcbiAgICogdmFyIGNoaWxkUHJvdmlkZXJzID0gUmVmbGVjdGl2ZUluamVjdG9yLnJlc29sdmUoW0NoaWxkUHJvdmlkZXJdKTtcbiAgICpcbiAgICogdmFyIHBhcmVudCA9IFJlZmxlY3RpdmVJbmplY3Rvci5mcm9tUmVzb2x2ZWRQcm92aWRlcnMocGFyZW50UHJvdmlkZXJzKTtcbiAgICogdmFyIGNoaWxkID0gcGFyZW50LmNyZWF0ZUNoaWxkRnJvbVJlc29sdmVkKGNoaWxkUHJvdmlkZXJzKTtcbiAgICpcbiAgICogZXhwZWN0KGNoaWxkLmdldChQYXJlbnRQcm92aWRlcikgaW5zdGFuY2VvZiBQYXJlbnRQcm92aWRlcikudG9CZSh0cnVlKTtcbiAgICogZXhwZWN0KGNoaWxkLmdldChDaGlsZFByb3ZpZGVyKSBpbnN0YW5jZW9mIENoaWxkUHJvdmlkZXIpLnRvQmUodHJ1ZSk7XG4gICAqIGV4cGVjdChjaGlsZC5nZXQoUGFyZW50UHJvdmlkZXIpKS50b0JlKHBhcmVudC5nZXQoUGFyZW50UHJvdmlkZXIpKTtcbiAgICogYGBgXG4gICAqL1xuICBhYnN0cmFjdCBjcmVhdGVDaGlsZEZyb21SZXNvbHZlZChwcm92aWRlcnM6IFJlc29sdmVkUmVmbGVjdGl2ZVByb3ZpZGVyW10pOiBSZWZsZWN0aXZlSW5qZWN0b3I7XG5cbiAgLyoqXG4gICAqIFJlc29sdmVzIGEgcHJvdmlkZXIgYW5kIGluc3RhbnRpYXRlcyBhbiBvYmplY3QgaW4gdGhlIGNvbnRleHQgb2YgdGhlIGluamVjdG9yLlxuICAgKlxuICAgKiBUaGUgY3JlYXRlZCBvYmplY3QgZG9lcyBub3QgZ2V0IGNhY2hlZCBieSB0aGUgaW5qZWN0b3IuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqICMjIyBFeGFtcGxlXG4gICAqXG4gICAqIGBgYHR5cGVzY3JpcHRcbiAgICogQEluamVjdGFibGUoKVxuICAgKiBjbGFzcyBFbmdpbmUge1xuICAgKiB9XG4gICAqXG4gICAqIEBJbmplY3RhYmxlKClcbiAgICogY2xhc3MgQ2FyIHtcbiAgICogICBjb25zdHJ1Y3RvcihwdWJsaWMgZW5naW5lOkVuZ2luZSkge31cbiAgICogfVxuICAgKlxuICAgKiB2YXIgaW5qZWN0b3IgPSBSZWZsZWN0aXZlSW5qZWN0b3IucmVzb2x2ZUFuZENyZWF0ZShbRW5naW5lXSk7XG4gICAqXG4gICAqIHZhciBjYXIgPSBpbmplY3Rvci5yZXNvbHZlQW5kSW5zdGFudGlhdGUoQ2FyKTtcbiAgICogZXhwZWN0KGNhci5lbmdpbmUpLnRvQmUoaW5qZWN0b3IuZ2V0KEVuZ2luZSkpO1xuICAgKiBleHBlY3QoY2FyKS5ub3QudG9CZShpbmplY3Rvci5yZXNvbHZlQW5kSW5zdGFudGlhdGUoQ2FyKSk7XG4gICAqIGBgYFxuICAgKi9cbiAgYWJzdHJhY3QgcmVzb2x2ZUFuZEluc3RhbnRpYXRlKHByb3ZpZGVyOiBQcm92aWRlcik6IGFueTtcblxuICAvKipcbiAgICogSW5zdGFudGlhdGVzIGFuIG9iamVjdCB1c2luZyBhIHJlc29sdmVkIHByb3ZpZGVyIGluIHRoZSBjb250ZXh0IG9mIHRoZSBpbmplY3Rvci5cbiAgICpcbiAgICogVGhlIGNyZWF0ZWQgb2JqZWN0IGRvZXMgbm90IGdldCBjYWNoZWQgYnkgdGhlIGluamVjdG9yLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKiAjIyMgRXhhbXBsZVxuICAgKlxuICAgKiBgYGB0eXBlc2NyaXB0XG4gICAqIEBJbmplY3RhYmxlKClcbiAgICogY2xhc3MgRW5naW5lIHtcbiAgICogfVxuICAgKlxuICAgKiBASW5qZWN0YWJsZSgpXG4gICAqIGNsYXNzIENhciB7XG4gICAqICAgY29uc3RydWN0b3IocHVibGljIGVuZ2luZTpFbmdpbmUpIHt9XG4gICAqIH1cbiAgICpcbiAgICogdmFyIGluamVjdG9yID0gUmVmbGVjdGl2ZUluamVjdG9yLnJlc29sdmVBbmRDcmVhdGUoW0VuZ2luZV0pO1xuICAgKiB2YXIgY2FyUHJvdmlkZXIgPSBSZWZsZWN0aXZlSW5qZWN0b3IucmVzb2x2ZShbQ2FyXSlbMF07XG4gICAqIHZhciBjYXIgPSBpbmplY3Rvci5pbnN0YW50aWF0ZVJlc29sdmVkKGNhclByb3ZpZGVyKTtcbiAgICogZXhwZWN0KGNhci5lbmdpbmUpLnRvQmUoaW5qZWN0b3IuZ2V0KEVuZ2luZSkpO1xuICAgKiBleHBlY3QoY2FyKS5ub3QudG9CZShpbmplY3Rvci5pbnN0YW50aWF0ZVJlc29sdmVkKGNhclByb3ZpZGVyKSk7XG4gICAqIGBgYFxuICAgKi9cbiAgYWJzdHJhY3QgaW5zdGFudGlhdGVSZXNvbHZlZChwcm92aWRlcjogUmVzb2x2ZWRSZWZsZWN0aXZlUHJvdmlkZXIpOiBhbnk7XG5cbiAgYWJzdHJhY3QgZ2V0KHRva2VuOiBhbnksIG5vdEZvdW5kVmFsdWU/OiBhbnkpOiBhbnk7XG59XG5cbmV4cG9ydCBjbGFzcyBSZWZsZWN0aXZlSW5qZWN0b3JfIGltcGxlbWVudHMgUmVmbGVjdGl2ZUluamVjdG9yIHtcbiAgcHJpdmF0ZSBzdGF0aWMgSU5KRUNUT1JfS0VZID0gKC8qIEBfX1BVUkVfXyAqLyBSZWZsZWN0aXZlS2V5LmdldChJbmplY3RvcikpO1xuICAvKiogQGludGVybmFsICovXG4gIF9jb25zdHJ1Y3Rpb25Db3VudGVyOiBudW1iZXIgPSAwO1xuICAvKiogQGludGVybmFsICovXG4gIHB1YmxpYyBfcHJvdmlkZXJzOiBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlcltdO1xuICBwdWJsaWMgcmVhZG9ubHkgcGFyZW50OiBJbmplY3RvcnxudWxsO1xuXG4gIGtleUlkczogbnVtYmVyW107XG4gIG9ianM6IGFueVtdO1xuICAvKipcbiAgICogUHJpdmF0ZVxuICAgKi9cbiAgY29uc3RydWN0b3IoX3Byb3ZpZGVyczogUmVzb2x2ZWRSZWZsZWN0aXZlUHJvdmlkZXJbXSwgX3BhcmVudD86IEluamVjdG9yKSB7XG4gICAgdGhpcy5fcHJvdmlkZXJzID0gX3Byb3ZpZGVycztcbiAgICB0aGlzLnBhcmVudCA9IF9wYXJlbnQgfHwgbnVsbDtcblxuICAgIGNvbnN0IGxlbiA9IF9wcm92aWRlcnMubGVuZ3RoO1xuXG4gICAgdGhpcy5rZXlJZHMgPSBbXTtcbiAgICB0aGlzLm9ianMgPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHRoaXMua2V5SWRzW2ldID0gX3Byb3ZpZGVyc1tpXS5rZXkuaWQ7XG4gICAgICB0aGlzLm9ianNbaV0gPSBVTkRFRklORUQ7XG4gICAgfVxuICB9XG5cbiAgZ2V0KHRva2VuOiBhbnksIG5vdEZvdW5kVmFsdWU6IGFueSA9IFRIUk9XX0lGX05PVF9GT1VORCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX2dldEJ5S2V5KFJlZmxlY3RpdmVLZXkuZ2V0KHRva2VuKSwgbnVsbCwgbm90Rm91bmRWYWx1ZSk7XG4gIH1cblxuICByZXNvbHZlQW5kQ3JlYXRlQ2hpbGQocHJvdmlkZXJzOiBQcm92aWRlcltdKTogUmVmbGVjdGl2ZUluamVjdG9yIHtcbiAgICBjb25zdCBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlcnMgPSBSZWZsZWN0aXZlSW5qZWN0b3IucmVzb2x2ZShwcm92aWRlcnMpO1xuICAgIHJldHVybiB0aGlzLmNyZWF0ZUNoaWxkRnJvbVJlc29sdmVkKFJlc29sdmVkUmVmbGVjdGl2ZVByb3ZpZGVycyk7XG4gIH1cblxuICBjcmVhdGVDaGlsZEZyb21SZXNvbHZlZChwcm92aWRlcnM6IFJlc29sdmVkUmVmbGVjdGl2ZVByb3ZpZGVyW10pOiBSZWZsZWN0aXZlSW5qZWN0b3Ige1xuICAgIGNvbnN0IGluaiA9IG5ldyBSZWZsZWN0aXZlSW5qZWN0b3JfKHByb3ZpZGVycyk7XG4gICAgKGluaiBhcyB7cGFyZW50OiBJbmplY3RvciB8IG51bGx9KS5wYXJlbnQgPSB0aGlzO1xuICAgIHJldHVybiBpbmo7XG4gIH1cblxuICByZXNvbHZlQW5kSW5zdGFudGlhdGUocHJvdmlkZXI6IFByb3ZpZGVyKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5pbnN0YW50aWF0ZVJlc29sdmVkKFJlZmxlY3RpdmVJbmplY3Rvci5yZXNvbHZlKFtwcm92aWRlcl0pWzBdKTtcbiAgfVxuXG4gIGluc3RhbnRpYXRlUmVzb2x2ZWQocHJvdmlkZXI6IFJlc29sdmVkUmVmbGVjdGl2ZVByb3ZpZGVyKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5faW5zdGFudGlhdGVQcm92aWRlcihwcm92aWRlcik7XG4gIH1cblxuICBnZXRQcm92aWRlckF0SW5kZXgoaW5kZXg6IG51bWJlcik6IFJlc29sdmVkUmVmbGVjdGl2ZVByb3ZpZGVyIHtcbiAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMuX3Byb3ZpZGVycy5sZW5ndGgpIHtcbiAgICAgIHRocm93IG91dE9mQm91bmRzRXJyb3IoaW5kZXgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fcHJvdmlkZXJzW2luZGV4XTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX25ldyhwcm92aWRlcjogUmVzb2x2ZWRSZWZsZWN0aXZlUHJvdmlkZXIpOiBhbnkge1xuICAgIGlmICh0aGlzLl9jb25zdHJ1Y3Rpb25Db3VudGVyKysgPiB0aGlzLl9nZXRNYXhOdW1iZXJPZk9iamVjdHMoKSkge1xuICAgICAgdGhyb3cgY3ljbGljRGVwZW5kZW5jeUVycm9yKHRoaXMsIHByb3ZpZGVyLmtleSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9pbnN0YW50aWF0ZVByb3ZpZGVyKHByb3ZpZGVyKTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldE1heE51bWJlck9mT2JqZWN0cygpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLm9ianMubGVuZ3RoO1xuICB9XG5cbiAgcHJpdmF0ZSBfaW5zdGFudGlhdGVQcm92aWRlcihwcm92aWRlcjogUmVzb2x2ZWRSZWZsZWN0aXZlUHJvdmlkZXIpOiBhbnkge1xuICAgIGlmIChwcm92aWRlci5tdWx0aVByb3ZpZGVyKSB7XG4gICAgICBjb25zdCByZXMgPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvdmlkZXIucmVzb2x2ZWRGYWN0b3JpZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgcmVzW2ldID0gdGhpcy5faW5zdGFudGlhdGUocHJvdmlkZXIsIHByb3ZpZGVyLnJlc29sdmVkRmFjdG9yaWVzW2ldKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9pbnN0YW50aWF0ZShwcm92aWRlciwgcHJvdmlkZXIucmVzb2x2ZWRGYWN0b3JpZXNbMF0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2luc3RhbnRpYXRlKFxuICAgICAgcHJvdmlkZXI6IFJlc29sdmVkUmVmbGVjdGl2ZVByb3ZpZGVyLFxuICAgICAgUmVzb2x2ZWRSZWZsZWN0aXZlRmFjdG9yeTogUmVzb2x2ZWRSZWZsZWN0aXZlRmFjdG9yeSk6IGFueSB7XG4gICAgY29uc3QgZmFjdG9yeSA9IFJlc29sdmVkUmVmbGVjdGl2ZUZhY3RvcnkuZmFjdG9yeTtcblxuICAgIGxldCBkZXBzOiBhbnlbXTtcbiAgICB0cnkge1xuICAgICAgZGVwcyA9XG4gICAgICAgICAgUmVzb2x2ZWRSZWZsZWN0aXZlRmFjdG9yeS5kZXBlbmRlbmNpZXMubWFwKGRlcCA9PiB0aGlzLl9nZXRCeVJlZmxlY3RpdmVEZXBlbmRlbmN5KGRlcCkpO1xuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgaWYgKGUuYWRkS2V5KSB7XG4gICAgICAgIGUuYWRkS2V5KHRoaXMsIHByb3ZpZGVyLmtleSk7XG4gICAgICB9XG4gICAgICB0aHJvdyBlO1xuICAgIH1cblxuICAgIGxldCBvYmo6IGFueTtcbiAgICB0cnkge1xuICAgICAgb2JqID0gZmFjdG9yeSguLi5kZXBzKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aHJvdyBpbnN0YW50aWF0aW9uRXJyb3IodGhpcywgZSwgKGUgYXMgRXJyb3IpLnN0YWNrLCBwcm92aWRlci5rZXkpO1xuICAgIH1cblxuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICBwcml2YXRlIF9nZXRCeVJlZmxlY3RpdmVEZXBlbmRlbmN5KGRlcDogUmVmbGVjdGl2ZURlcGVuZGVuY3kpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl9nZXRCeUtleShkZXAua2V5LCBkZXAudmlzaWJpbGl0eSwgZGVwLm9wdGlvbmFsID8gbnVsbCA6IFRIUk9XX0lGX05PVF9GT1VORCk7XG4gIH1cblxuICBwcml2YXRlIF9nZXRCeUtleShrZXk6IFJlZmxlY3RpdmVLZXksIHZpc2liaWxpdHk6IFNlbGZ8U2tpcFNlbGZ8bnVsbCwgbm90Rm91bmRWYWx1ZTogYW55KTogYW55IHtcbiAgICBpZiAoa2V5ID09PSBSZWZsZWN0aXZlSW5qZWN0b3JfLklOSkVDVE9SX0tFWSkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKHZpc2liaWxpdHkgaW5zdGFuY2VvZiBTZWxmKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZ2V0QnlLZXlTZWxmKGtleSwgbm90Rm91bmRWYWx1ZSk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX2dldEJ5S2V5RGVmYXVsdChrZXksIG5vdEZvdW5kVmFsdWUsIHZpc2liaWxpdHkpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2dldE9iakJ5S2V5SWQoa2V5SWQ6IG51bWJlcik6IGFueSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmtleUlkcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHRoaXMua2V5SWRzW2ldID09PSBrZXlJZCkge1xuICAgICAgICBpZiAodGhpcy5vYmpzW2ldID09PSBVTkRFRklORUQpIHtcbiAgICAgICAgICB0aGlzLm9ianNbaV0gPSB0aGlzLl9uZXcodGhpcy5fcHJvdmlkZXJzW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLm9ianNbaV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFVOREVGSU5FRDtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3Rocm93T3JOdWxsKGtleTogUmVmbGVjdGl2ZUtleSwgbm90Rm91bmRWYWx1ZTogYW55KTogYW55IHtcbiAgICBpZiAobm90Rm91bmRWYWx1ZSAhPT0gVEhST1dfSUZfTk9UX0ZPVU5EKSB7XG4gICAgICByZXR1cm4gbm90Rm91bmRWYWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbm9Qcm92aWRlckVycm9yKHRoaXMsIGtleSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfZ2V0QnlLZXlTZWxmKGtleTogUmVmbGVjdGl2ZUtleSwgbm90Rm91bmRWYWx1ZTogYW55KTogYW55IHtcbiAgICBjb25zdCBvYmogPSB0aGlzLl9nZXRPYmpCeUtleUlkKGtleS5pZCk7XG4gICAgcmV0dXJuIChvYmogIT09IFVOREVGSU5FRCkgPyBvYmogOiB0aGlzLl90aHJvd09yTnVsbChrZXksIG5vdEZvdW5kVmFsdWUpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfZ2V0QnlLZXlEZWZhdWx0KGtleTogUmVmbGVjdGl2ZUtleSwgbm90Rm91bmRWYWx1ZTogYW55LCB2aXNpYmlsaXR5OiBTZWxmfFNraXBTZWxmfG51bGwpOiBhbnkge1xuICAgIGxldCBpbmo6IEluamVjdG9yfG51bGw7XG5cbiAgICBpZiAodmlzaWJpbGl0eSBpbnN0YW5jZW9mIFNraXBTZWxmKSB7XG4gICAgICBpbmogPSB0aGlzLnBhcmVudDtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5qID0gdGhpcztcbiAgICB9XG5cbiAgICB3aGlsZSAoaW5qIGluc3RhbmNlb2YgUmVmbGVjdGl2ZUluamVjdG9yXykge1xuICAgICAgY29uc3QgaW5qXyA9IDxSZWZsZWN0aXZlSW5qZWN0b3JfPmluajtcbiAgICAgIGNvbnN0IG9iaiA9IGlual8uX2dldE9iakJ5S2V5SWQoa2V5LmlkKTtcbiAgICAgIGlmIChvYmogIT09IFVOREVGSU5FRCkgcmV0dXJuIG9iajtcbiAgICAgIGluaiA9IGlual8ucGFyZW50O1xuICAgIH1cbiAgICBpZiAoaW5qICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gaW5qLmdldChrZXkudG9rZW4sIG5vdEZvdW5kVmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fdGhyb3dPck51bGwoa2V5LCBub3RGb3VuZFZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBnZXQgZGlzcGxheU5hbWUoKTogc3RyaW5nIHtcbiAgICBjb25zdCBwcm92aWRlcnMgPVxuICAgICAgICBfbWFwUHJvdmlkZXJzKHRoaXMsIChiOiBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlcikgPT4gJyBcIicgKyBiLmtleS5kaXNwbGF5TmFtZSArICdcIiAnKVxuICAgICAgICAgICAgLmpvaW4oJywgJyk7XG4gICAgcmV0dXJuIGBSZWZsZWN0aXZlSW5qZWN0b3IocHJvdmlkZXJzOiBbJHtwcm92aWRlcnN9XSlgO1xuICB9XG5cbiAgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5kaXNwbGF5TmFtZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfbWFwUHJvdmlkZXJzKGluamVjdG9yOiBSZWZsZWN0aXZlSW5qZWN0b3JfLCBmbjogRnVuY3Rpb24pOiBhbnlbXSB7XG4gIGNvbnN0IHJlczogYW55W10gPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbmplY3Rvci5fcHJvdmlkZXJzLmxlbmd0aDsgKytpKSB7XG4gICAgcmVzW2ldID0gZm4oaW5qZWN0b3IuZ2V0UHJvdmlkZXJBdEluZGV4KGkpKTtcbiAgfVxuICByZXR1cm4gcmVzO1xufVxuIl19