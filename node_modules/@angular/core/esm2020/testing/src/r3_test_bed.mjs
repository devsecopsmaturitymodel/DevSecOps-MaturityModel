/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// The formatter and CI disagree on how this import statement should be formatted. Both try to keep
// it on one line, too, which has gotten very hard to read & manage. So disable the formatter for
// this statement only.
/* clang-format off */
import { InjectFlags, Injector, NgZone, ɵflushModuleScopingQueueAsMuchAsPossible as flushModuleScopingQueueAsMuchAsPossible, ɵRender3ComponentFactory as ComponentFactory, ɵresetCompiledComponents as resetCompiledComponents, ɵstringify as stringify, } from '@angular/core';
/* clang-format on */
import { ComponentFixture } from './component_fixture';
import { R3TestBedCompiler } from './r3_test_bed_compiler';
import { ComponentFixtureAutoDetect, ComponentFixtureNoNgZone, TEARDOWN_TESTING_MODULE_ON_DESTROY_DEFAULT, TestComponentRenderer } from './test_bed_common';
let _nextRootElementId = 0;
/**
 * @description
 * Configures and initializes environment for unit testing and provides methods for
 * creating components and services in unit tests.
 *
 * TestBed is the primary api for writing unit tests for Angular applications and libraries.
 *
 * Note: Use `TestBed` in tests. It will be set to either `TestBedViewEngine` or `TestBedRender3`
 * according to the compiler used.
 */
export class TestBedRender3 {
    constructor() {
        // Properties
        this.platform = null;
        this.ngModule = null;
        this._compiler = null;
        this._testModuleRef = null;
        this._activeFixtures = [];
        this._globalCompilationChecked = false;
    }
    /**
     * Initialize the environment for testing with a compiler factory, a PlatformRef, and an
     * angular module. These are common to every test in the suite.
     *
     * This may only be called once, to set up the common providers for the current test
     * suite on the current platform. If you absolutely need to change the providers,
     * first use `resetTestEnvironment`.
     *
     * Test modules and platforms for individual platforms are available from
     * '@angular/<platform_name>/testing'.
     *
     * @publicApi
     */
    static initTestEnvironment(ngModule, platform, summariesOrOptions) {
        const testBed = _getTestBedRender3();
        testBed.initTestEnvironment(ngModule, platform, summariesOrOptions);
        return testBed;
    }
    /**
     * Reset the providers for the test injector.
     *
     * @publicApi
     */
    static resetTestEnvironment() {
        _getTestBedRender3().resetTestEnvironment();
    }
    static configureCompiler(config) {
        _getTestBedRender3().configureCompiler(config);
        return TestBedRender3;
    }
    /**
     * Allows overriding default providers, directives, pipes, modules of the test injector,
     * which are defined in test_injector.js
     */
    static configureTestingModule(moduleDef) {
        _getTestBedRender3().configureTestingModule(moduleDef);
        return TestBedRender3;
    }
    /**
     * Compile components with a `templateUrl` for the test's NgModule.
     * It is necessary to call this function
     * as fetching urls is asynchronous.
     */
    static compileComponents() {
        return _getTestBedRender3().compileComponents();
    }
    static overrideModule(ngModule, override) {
        _getTestBedRender3().overrideModule(ngModule, override);
        return TestBedRender3;
    }
    static overrideComponent(component, override) {
        _getTestBedRender3().overrideComponent(component, override);
        return TestBedRender3;
    }
    static overrideDirective(directive, override) {
        _getTestBedRender3().overrideDirective(directive, override);
        return TestBedRender3;
    }
    static overridePipe(pipe, override) {
        _getTestBedRender3().overridePipe(pipe, override);
        return TestBedRender3;
    }
    static overrideTemplate(component, template) {
        _getTestBedRender3().overrideComponent(component, { set: { template, templateUrl: null } });
        return TestBedRender3;
    }
    /**
     * Overrides the template of the given component, compiling the template
     * in the context of the TestingModule.
     *
     * Note: This works for JIT and AOTed components as well.
     */
    static overrideTemplateUsingTestingModule(component, template) {
        _getTestBedRender3().overrideTemplateUsingTestingModule(component, template);
        return TestBedRender3;
    }
    static overrideProvider(token, provider) {
        _getTestBedRender3().overrideProvider(token, provider);
        return TestBedRender3;
    }
    static inject(token, notFoundValue, flags) {
        return _getTestBedRender3().inject(token, notFoundValue, flags);
    }
    /** @deprecated from v9.0.0 use TestBed.inject */
    static get(token, notFoundValue = Injector.THROW_IF_NOT_FOUND, flags = InjectFlags.Default) {
        return _getTestBedRender3().inject(token, notFoundValue, flags);
    }
    static createComponent(component) {
        return _getTestBedRender3().createComponent(component);
    }
    static resetTestingModule() {
        _getTestBedRender3().resetTestingModule();
        return TestBedRender3;
    }
    static shouldTearDownTestingModule() {
        return _getTestBedRender3().shouldTearDownTestingModule();
    }
    static tearDownTestingModule() {
        _getTestBedRender3().tearDownTestingModule();
    }
    /**
     * Initialize the environment for testing with a compiler factory, a PlatformRef, and an
     * angular module. These are common to every test in the suite.
     *
     * This may only be called once, to set up the common providers for the current test
     * suite on the current platform. If you absolutely need to change the providers,
     * first use `resetTestEnvironment`.
     *
     * Test modules and platforms for individual platforms are available from
     * '@angular/<platform_name>/testing'.
     *
     * @publicApi
     */
    initTestEnvironment(ngModule, platform, summariesOrOptions) {
        if (this.platform || this.ngModule) {
            throw new Error('Cannot set base providers because it has already been called');
        }
        // If `summariesOrOptions` is a function, it means that it's
        // an AOT summaries factory which Ivy doesn't support.
        TestBedRender3._environmentTeardownOptions =
            typeof summariesOrOptions === 'function' ? undefined : summariesOrOptions?.teardown;
        this.platform = platform;
        this.ngModule = ngModule;
        this._compiler = new R3TestBedCompiler(this.platform, this.ngModule);
    }
    /**
     * Reset the providers for the test injector.
     *
     * @publicApi
     */
    resetTestEnvironment() {
        this.resetTestingModule();
        this._compiler = null;
        this.platform = null;
        this.ngModule = null;
        TestBedRender3._environmentTeardownOptions = undefined;
    }
    resetTestingModule() {
        this.checkGlobalCompilationFinished();
        resetCompiledComponents();
        if (this._compiler !== null) {
            this.compiler.restoreOriginalState();
        }
        this._compiler = new R3TestBedCompiler(this.platform, this.ngModule);
        // We have to chain a couple of try/finally blocks, because each step can
        // throw errors and we don't want it to interrupt the next step and we also
        // want an error to be thrown at the end.
        try {
            this.destroyActiveFixtures();
        }
        finally {
            try {
                if (this.shouldTearDownTestingModule()) {
                    this.tearDownTestingModule();
                }
            }
            finally {
                this._testModuleRef = null;
                this._instanceTeardownOptions = undefined;
            }
        }
    }
    configureCompiler(config) {
        if (config.useJit != null) {
            throw new Error('the Render3 compiler JiT mode is not configurable !');
        }
        if (config.providers !== undefined) {
            this.compiler.setCompilerProviders(config.providers);
        }
    }
    configureTestingModule(moduleDef) {
        this.assertNotInstantiated('R3TestBed.configureTestingModule', 'configure the test module');
        // Trigger module scoping queue flush before executing other TestBed operations in a test.
        // This is needed for the first test invocation to ensure that globally declared modules have
        // their components scoped properly. See the `checkGlobalCompilationFinished` function
        // description for additional info.
        this.checkGlobalCompilationFinished();
        // Always re-assign the teardown options, even if they're undefined.
        // This ensures that we don't carry the options between tests.
        this._instanceTeardownOptions = moduleDef.teardown;
        this.compiler.configureTestingModule(moduleDef);
    }
    compileComponents() {
        return this.compiler.compileComponents();
    }
    inject(token, notFoundValue, flags) {
        if (token === TestBedRender3) {
            return this;
        }
        const UNDEFINED = {};
        const result = this.testModuleRef.injector.get(token, UNDEFINED, flags);
        return result === UNDEFINED ? this.compiler.injector.get(token, notFoundValue, flags) :
            result;
    }
    /** @deprecated from v9.0.0 use TestBed.inject */
    get(token, notFoundValue = Injector.THROW_IF_NOT_FOUND, flags = InjectFlags.Default) {
        return this.inject(token, notFoundValue, flags);
    }
    execute(tokens, fn, context) {
        const params = tokens.map(t => this.inject(t));
        return fn.apply(context, params);
    }
    overrideModule(ngModule, override) {
        this.assertNotInstantiated('overrideModule', 'override module metadata');
        this.compiler.overrideModule(ngModule, override);
    }
    overrideComponent(component, override) {
        this.assertNotInstantiated('overrideComponent', 'override component metadata');
        this.compiler.overrideComponent(component, override);
    }
    overrideTemplateUsingTestingModule(component, template) {
        this.assertNotInstantiated('R3TestBed.overrideTemplateUsingTestingModule', 'Cannot override template when the test module has already been instantiated');
        this.compiler.overrideTemplateUsingTestingModule(component, template);
    }
    overrideDirective(directive, override) {
        this.assertNotInstantiated('overrideDirective', 'override directive metadata');
        this.compiler.overrideDirective(directive, override);
    }
    overridePipe(pipe, override) {
        this.assertNotInstantiated('overridePipe', 'override pipe metadata');
        this.compiler.overridePipe(pipe, override);
    }
    /**
     * Overwrites all providers for the given token with the given provider definition.
     */
    overrideProvider(token, provider) {
        this.assertNotInstantiated('overrideProvider', 'override provider');
        this.compiler.overrideProvider(token, provider);
    }
    createComponent(type) {
        const testComponentRenderer = this.inject(TestComponentRenderer);
        const rootElId = `root${_nextRootElementId++}`;
        testComponentRenderer.insertRootElement(rootElId);
        const componentDef = type.ɵcmp;
        if (!componentDef) {
            throw new Error(`It looks like '${stringify(type)}' has not been IVY compiled - it has no 'ɵcmp' field`);
        }
        // TODO: Don't cast as `InjectionToken<boolean>`, proper type is boolean[]
        const noNgZone = this.inject(ComponentFixtureNoNgZone, false);
        // TODO: Don't cast as `InjectionToken<boolean>`, proper type is boolean[]
        const autoDetect = this.inject(ComponentFixtureAutoDetect, false);
        const ngZone = noNgZone ? null : this.inject(NgZone, null);
        const componentFactory = new ComponentFactory(componentDef);
        const initComponent = () => {
            const componentRef = componentFactory.create(Injector.NULL, [], `#${rootElId}`, this.testModuleRef);
            return new ComponentFixture(componentRef, ngZone, autoDetect);
        };
        const fixture = ngZone ? ngZone.run(initComponent) : initComponent();
        this._activeFixtures.push(fixture);
        return fixture;
    }
    /**
     * @internal strip this from published d.ts files due to
     * https://github.com/microsoft/TypeScript/issues/36216
     */
    get compiler() {
        if (this._compiler === null) {
            throw new Error(`Need to call TestBed.initTestEnvironment() first`);
        }
        return this._compiler;
    }
    /**
     * @internal strip this from published d.ts files due to
     * https://github.com/microsoft/TypeScript/issues/36216
     */
    get testModuleRef() {
        if (this._testModuleRef === null) {
            this._testModuleRef = this.compiler.finalize();
        }
        return this._testModuleRef;
    }
    assertNotInstantiated(methodName, methodDescription) {
        if (this._testModuleRef !== null) {
            throw new Error(`Cannot ${methodDescription} when the test module has already been instantiated. ` +
                `Make sure you are not using \`inject\` before \`${methodName}\`.`);
        }
    }
    /**
     * Check whether the module scoping queue should be flushed, and flush it if needed.
     *
     * When the TestBed is reset, it clears the JIT module compilation queue, cancelling any
     * in-progress module compilation. This creates a potential hazard - the very first time the
     * TestBed is initialized (or if it's reset without being initialized), there may be pending
     * compilations of modules declared in global scope. These compilations should be finished.
     *
     * To ensure that globally declared modules have their components scoped properly, this function
     * is called whenever TestBed is initialized or reset. The _first_ time that this happens, prior
     * to any other operations, the scoping queue is flushed.
     */
    checkGlobalCompilationFinished() {
        // Checking _testNgModuleRef is null should not be necessary, but is left in as an additional
        // guard that compilations queued in tests (after instantiation) are never flushed accidentally.
        if (!this._globalCompilationChecked && this._testModuleRef === null) {
            flushModuleScopingQueueAsMuchAsPossible();
        }
        this._globalCompilationChecked = true;
    }
    destroyActiveFixtures() {
        let errorCount = 0;
        this._activeFixtures.forEach((fixture) => {
            try {
                fixture.destroy();
            }
            catch (e) {
                errorCount++;
                console.error('Error during cleanup of component', {
                    component: fixture.componentInstance,
                    stacktrace: e,
                });
            }
        });
        this._activeFixtures = [];
        if (errorCount > 0 && this.shouldRethrowTeardownErrors()) {
            throw Error(`${errorCount} ${(errorCount === 1 ? 'component' : 'components')} ` +
                `threw errors during cleanup`);
        }
    }
    shouldRethrowTeardownErrors() {
        const instanceOptions = this._instanceTeardownOptions;
        const environmentOptions = TestBedRender3._environmentTeardownOptions;
        // If the new teardown behavior hasn't been configured, preserve the old behavior.
        if (!instanceOptions && !environmentOptions) {
            return TEARDOWN_TESTING_MODULE_ON_DESTROY_DEFAULT;
        }
        // Otherwise use the configured behavior or default to rethrowing.
        return instanceOptions?.rethrowErrors ?? environmentOptions?.rethrowErrors ??
            this.shouldTearDownTestingModule();
    }
    shouldTearDownTestingModule() {
        return this._instanceTeardownOptions?.destroyAfterEach ??
            TestBedRender3._environmentTeardownOptions?.destroyAfterEach ??
            TEARDOWN_TESTING_MODULE_ON_DESTROY_DEFAULT;
    }
    tearDownTestingModule() {
        // If the module ref has already been destroyed, we won't be able to get a test renderer.
        if (this._testModuleRef === null) {
            return;
        }
        // Resolve the renderer ahead of time, because we want to remove the root elements as the very
        // last step, but the injector will be destroyed as a part of the module ref destruction.
        const testRenderer = this.inject(TestComponentRenderer);
        try {
            this._testModuleRef.destroy();
        }
        catch (e) {
            if (this.shouldRethrowTeardownErrors()) {
                throw e;
            }
            else {
                console.error('Error during cleanup of a testing module', {
                    component: this._testModuleRef.instance,
                    stacktrace: e,
                });
            }
        }
        finally {
            testRenderer.removeAllRootElements?.();
        }
    }
}
let testBed;
export function _getTestBedRender3() {
    return testBed = testBed || new TestBedRender3();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicjNfdGVzdF9iZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3Rpbmcvc3JjL3IzX3Rlc3RfYmVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILG1HQUFtRztBQUNuRyxpR0FBaUc7QUFDakcsdUJBQXVCO0FBRXZCLHNCQUFzQjtBQUN0QixPQUFPLEVBR0wsV0FBVyxFQUVYLFFBQVEsRUFFUixNQUFNLEVBS04sd0NBQXdDLElBQUksdUNBQXVDLEVBQ25GLHdCQUF3QixJQUFJLGdCQUFnQixFQUU1Qyx3QkFBd0IsSUFBSSx1QkFBdUIsRUFDbkQsVUFBVSxJQUFJLFNBQVMsR0FDeEIsTUFBTSxlQUFlLENBQUM7QUFFdkIscUJBQXFCO0FBRXJCLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBRXJELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBRXpELE9BQU8sRUFBQywwQkFBMEIsRUFBRSx3QkFBd0IsRUFBeUIsMENBQTBDLEVBQWlCLHFCQUFxQixFQUE2QyxNQUFNLG1CQUFtQixDQUFDO0FBRTVPLElBQUksa0JBQWtCLEdBQUcsQ0FBQyxDQUFDO0FBRzNCOzs7Ozs7Ozs7R0FTRztBQUNILE1BQU0sT0FBTyxjQUFjO0lBQTNCO1FBd0pFLGFBQWE7UUFFYixhQUFRLEdBQWdCLElBQUssQ0FBQztRQUM5QixhQUFRLEdBQTBCLElBQUssQ0FBQztRQUVoQyxjQUFTLEdBQTJCLElBQUksQ0FBQztRQUN6QyxtQkFBYyxHQUEwQixJQUFJLENBQUM7UUFFN0Msb0JBQWUsR0FBNEIsRUFBRSxDQUFDO1FBQzlDLDhCQUF5QixHQUFHLEtBQUssQ0FBQztJQW1UNUMsQ0FBQztJQXZjQzs7Ozs7Ozs7Ozs7O09BWUc7SUFDSCxNQUFNLENBQUMsbUJBQW1CLENBQ3RCLFFBQStCLEVBQUUsUUFBcUIsRUFDdEQsa0JBQXlEO1FBQzNELE1BQU0sT0FBTyxHQUFHLGtCQUFrQixFQUFFLENBQUM7UUFDckMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUNwRSxPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILE1BQU0sQ0FBQyxvQkFBb0I7UUFDekIsa0JBQWtCLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0lBQzlDLENBQUM7SUFFRCxNQUFNLENBQUMsaUJBQWlCLENBQUMsTUFBOEM7UUFDckUsa0JBQWtCLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvQyxPQUFPLGNBQXNDLENBQUM7SUFDaEQsQ0FBQztJQUVEOzs7T0FHRztJQUNILE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxTQUE2QjtRQUN6RCxrQkFBa0IsRUFBRSxDQUFDLHNCQUFzQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3ZELE9BQU8sY0FBc0MsQ0FBQztJQUNoRCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILE1BQU0sQ0FBQyxpQkFBaUI7UUFDdEIsT0FBTyxrQkFBa0IsRUFBRSxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDbEQsQ0FBQztJQUVELE1BQU0sQ0FBQyxjQUFjLENBQUMsUUFBbUIsRUFBRSxRQUFvQztRQUM3RSxrQkFBa0IsRUFBRSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDeEQsT0FBTyxjQUFzQyxDQUFDO0lBQ2hELENBQUM7SUFFRCxNQUFNLENBQUMsaUJBQWlCLENBQUMsU0FBb0IsRUFBRSxRQUFxQztRQUVsRixrQkFBa0IsRUFBRSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUM1RCxPQUFPLGNBQXNDLENBQUM7SUFDaEQsQ0FBQztJQUVELE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxTQUFvQixFQUFFLFFBQXFDO1FBRWxGLGtCQUFrQixFQUFFLENBQUMsaUJBQWlCLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzVELE9BQU8sY0FBc0MsQ0FBQztJQUNoRCxDQUFDO0lBRUQsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFlLEVBQUUsUUFBZ0M7UUFDbkUsa0JBQWtCLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2xELE9BQU8sY0FBc0MsQ0FBQztJQUNoRCxDQUFDO0lBRUQsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQW9CLEVBQUUsUUFBZ0I7UUFDNUQsa0JBQWtCLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsRUFBQyxHQUFHLEVBQUUsRUFBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLElBQUssRUFBQyxFQUFDLENBQUMsQ0FBQztRQUN6RixPQUFPLGNBQXNDLENBQUM7SUFDaEQsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLGtDQUFrQyxDQUFDLFNBQW9CLEVBQUUsUUFBZ0I7UUFDOUUsa0JBQWtCLEVBQUUsQ0FBQyxrQ0FBa0MsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDN0UsT0FBTyxjQUFzQyxDQUFDO0lBQ2hELENBQUM7SUFPRCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsS0FBVSxFQUFFLFFBSW5DO1FBQ0Msa0JBQWtCLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDdkQsT0FBTyxjQUFzQyxDQUFDO0lBQ2hELENBQUM7SUFJRCxNQUFNLENBQUMsTUFBTSxDQUFJLEtBQXVCLEVBQUUsYUFBc0IsRUFBRSxLQUFtQjtRQUNuRixPQUFPLGtCQUFrQixFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQU1ELGlEQUFpRDtJQUNqRCxNQUFNLENBQUMsR0FBRyxDQUNOLEtBQVUsRUFBRSxnQkFBcUIsUUFBUSxDQUFDLGtCQUFrQixFQUM1RCxRQUFxQixXQUFXLENBQUMsT0FBTztRQUMxQyxPQUFPLGtCQUFrQixFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVELE1BQU0sQ0FBQyxlQUFlLENBQUksU0FBa0I7UUFDMUMsT0FBTyxrQkFBa0IsRUFBRSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRUQsTUFBTSxDQUFDLGtCQUFrQjtRQUN2QixrQkFBa0IsRUFBRSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDMUMsT0FBTyxjQUFzQyxDQUFDO0lBQ2hELENBQUM7SUFFRCxNQUFNLENBQUMsMkJBQTJCO1FBQ2hDLE9BQU8sa0JBQWtCLEVBQUUsQ0FBQywyQkFBMkIsRUFBRSxDQUFDO0lBQzVELENBQUM7SUFFRCxNQUFNLENBQUMscUJBQXFCO1FBQzFCLGtCQUFrQixFQUFFLENBQUMscUJBQXFCLEVBQUUsQ0FBQztJQUMvQyxDQUFDO0lBYUQ7Ozs7Ozs7Ozs7OztPQVlHO0lBQ0gsbUJBQW1CLENBQ2YsUUFBK0IsRUFBRSxRQUFxQixFQUN0RCxrQkFBeUQ7UUFDM0QsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbEMsTUFBTSxJQUFJLEtBQUssQ0FBQyw4REFBOEQsQ0FBQyxDQUFDO1NBQ2pGO1FBRUQsNERBQTREO1FBQzVELHNEQUFzRDtRQUN0RCxjQUFjLENBQUMsMkJBQTJCO1lBQ3RDLE9BQU8sa0JBQWtCLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLFFBQVEsQ0FBQztRQUV4RixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksaUJBQWlCLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxvQkFBb0I7UUFDbEIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDMUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFLLENBQUM7UUFDdEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFLLENBQUM7UUFDdEIsY0FBYyxDQUFDLDJCQUEyQixHQUFHLFNBQVMsQ0FBQztJQUN6RCxDQUFDO0lBRUQsa0JBQWtCO1FBQ2hCLElBQUksQ0FBQyw4QkFBOEIsRUFBRSxDQUFDO1FBQ3RDLHVCQUF1QixFQUFFLENBQUM7UUFDMUIsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLElBQUksRUFBRTtZQUMzQixJQUFJLENBQUMsUUFBUSxDQUFDLG9CQUFvQixFQUFFLENBQUM7U0FDdEM7UUFDRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksaUJBQWlCLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFckUseUVBQXlFO1FBQ3pFLDJFQUEyRTtRQUMzRSx5Q0FBeUM7UUFDekMsSUFBSTtZQUNGLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1NBQzlCO2dCQUFTO1lBQ1IsSUFBSTtnQkFDRixJQUFJLElBQUksQ0FBQywyQkFBMkIsRUFBRSxFQUFFO29CQUN0QyxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztpQkFDOUI7YUFDRjtvQkFBUztnQkFDUixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztnQkFDM0IsSUFBSSxDQUFDLHdCQUF3QixHQUFHLFNBQVMsQ0FBQzthQUMzQztTQUNGO0lBQ0gsQ0FBQztJQUVELGlCQUFpQixDQUFDLE1BQThDO1FBQzlELElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxJQUFJLEVBQUU7WUFDekIsTUFBTSxJQUFJLEtBQUssQ0FBQyxxREFBcUQsQ0FBQyxDQUFDO1NBQ3hFO1FBRUQsSUFBSSxNQUFNLENBQUMsU0FBUyxLQUFLLFNBQVMsRUFBRTtZQUNsQyxJQUFJLENBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUN0RDtJQUNILENBQUM7SUFFRCxzQkFBc0IsQ0FBQyxTQUE2QjtRQUNsRCxJQUFJLENBQUMscUJBQXFCLENBQUMsa0NBQWtDLEVBQUUsMkJBQTJCLENBQUMsQ0FBQztRQUU1RiwwRkFBMEY7UUFDMUYsNkZBQTZGO1FBQzdGLHNGQUFzRjtRQUN0RixtQ0FBbUM7UUFDbkMsSUFBSSxDQUFDLDhCQUE4QixFQUFFLENBQUM7UUFFdEMsb0VBQW9FO1FBQ3BFLDhEQUE4RDtRQUM5RCxJQUFJLENBQUMsd0JBQXdCLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQztRQUNuRCxJQUFJLENBQUMsUUFBUSxDQUFDLHNCQUFzQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFRCxpQkFBaUI7UUFDZixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUMzQyxDQUFDO0lBSUQsTUFBTSxDQUFJLEtBQXVCLEVBQUUsYUFBc0IsRUFBRSxLQUFtQjtRQUM1RSxJQUFJLEtBQWdCLEtBQUssY0FBYyxFQUFFO1lBQ3ZDLE9BQU8sSUFBVyxDQUFDO1NBQ3BCO1FBQ0QsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ3JCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3hFLE9BQU8sTUFBTSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUUsS0FBSyxDQUFRLENBQUMsQ0FBQztZQUNoRSxNQUFNLENBQUM7SUFDdkMsQ0FBQztJQU1ELGlEQUFpRDtJQUNqRCxHQUFHLENBQUMsS0FBVSxFQUFFLGdCQUFxQixRQUFRLENBQUMsa0JBQWtCLEVBQzVELFFBQXFCLFdBQVcsQ0FBQyxPQUFPO1FBQzFDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFRCxPQUFPLENBQUMsTUFBYSxFQUFFLEVBQVksRUFBRSxPQUFhO1FBQ2hELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0MsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQsY0FBYyxDQUFDLFFBQW1CLEVBQUUsUUFBb0M7UUFDdEUsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGdCQUFnQixFQUFFLDBCQUEwQixDQUFDLENBQUM7UUFDekUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxTQUFvQixFQUFFLFFBQXFDO1FBQzNFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxtQkFBbUIsRUFBRSw2QkFBNkIsQ0FBQyxDQUFDO1FBQy9FLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFRCxrQ0FBa0MsQ0FBQyxTQUFvQixFQUFFLFFBQWdCO1FBQ3ZFLElBQUksQ0FBQyxxQkFBcUIsQ0FDdEIsOENBQThDLEVBQzlDLDZFQUE2RSxDQUFDLENBQUM7UUFDbkYsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQ0FBa0MsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQUVELGlCQUFpQixDQUFDLFNBQW9CLEVBQUUsUUFBcUM7UUFDM0UsSUFBSSxDQUFDLHFCQUFxQixDQUFDLG1CQUFtQixFQUFFLDZCQUE2QixDQUFDLENBQUM7UUFDL0UsSUFBSSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVELFlBQVksQ0FBQyxJQUFlLEVBQUUsUUFBZ0M7UUFDNUQsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGNBQWMsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO1FBQ3JFLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxnQkFBZ0IsQ0FBQyxLQUFVLEVBQUUsUUFBK0Q7UUFFMUYsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixFQUFFLG1CQUFtQixDQUFDLENBQUM7UUFDcEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVELGVBQWUsQ0FBSSxJQUFhO1FBQzlCLE1BQU0scUJBQXFCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1FBQ2pFLE1BQU0sUUFBUSxHQUFHLE9BQU8sa0JBQWtCLEVBQUUsRUFBRSxDQUFDO1FBQy9DLHFCQUFxQixDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRWxELE1BQU0sWUFBWSxHQUFJLElBQVksQ0FBQyxJQUFJLENBQUM7UUFFeEMsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNqQixNQUFNLElBQUksS0FBSyxDQUNYLGtCQUFrQixTQUFTLENBQUMsSUFBSSxDQUFDLHNEQUFzRCxDQUFDLENBQUM7U0FDOUY7UUFFRCwwRUFBMEU7UUFDMUUsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyx3QkFBbUQsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN6RiwwRUFBMEU7UUFDMUUsTUFBTSxVQUFVLEdBQ1osSUFBSSxDQUFDLE1BQU0sQ0FBQywwQkFBcUQsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM5RSxNQUFNLE1BQU0sR0FBZ0IsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUM1RCxNQUFNLGFBQWEsR0FBRyxHQUFHLEVBQUU7WUFDekIsTUFBTSxZQUFZLEdBQ2QsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksUUFBUSxFQUFFLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ25GLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBTSxZQUFZLEVBQUUsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3JFLENBQUMsQ0FBQztRQUNGLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDckUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbkMsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQVksUUFBUTtRQUNsQixJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssSUFBSSxFQUFFO1lBQzNCLE1BQU0sSUFBSSxLQUFLLENBQUMsa0RBQWtELENBQUMsQ0FBQztTQUNyRTtRQUNELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUN4QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFBWSxhQUFhO1FBQ3ZCLElBQUksSUFBSSxDQUFDLGNBQWMsS0FBSyxJQUFJLEVBQUU7WUFDaEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ2hEO1FBQ0QsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO0lBQzdCLENBQUM7SUFFTyxxQkFBcUIsQ0FBQyxVQUFrQixFQUFFLGlCQUF5QjtRQUN6RSxJQUFJLElBQUksQ0FBQyxjQUFjLEtBQUssSUFBSSxFQUFFO1lBQ2hDLE1BQU0sSUFBSSxLQUFLLENBQ1gsVUFBVSxpQkFBaUIsdURBQXVEO2dCQUNsRixtREFBbUQsVUFBVSxLQUFLLENBQUMsQ0FBQztTQUN6RTtJQUNILENBQUM7SUFFRDs7Ozs7Ozs7Ozs7T0FXRztJQUNLLDhCQUE4QjtRQUNwQyw2RkFBNkY7UUFDN0YsZ0dBQWdHO1FBQ2hHLElBQUksQ0FBQyxJQUFJLENBQUMseUJBQXlCLElBQUksSUFBSSxDQUFDLGNBQWMsS0FBSyxJQUFJLEVBQUU7WUFDbkUsdUNBQXVDLEVBQUUsQ0FBQztTQUMzQztRQUNELElBQUksQ0FBQyx5QkFBeUIsR0FBRyxJQUFJLENBQUM7SUFDeEMsQ0FBQztJQUVPLHFCQUFxQjtRQUMzQixJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDbkIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtZQUN2QyxJQUFJO2dCQUNGLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQzthQUNuQjtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNWLFVBQVUsRUFBRSxDQUFDO2dCQUNiLE9BQU8sQ0FBQyxLQUFLLENBQUMsbUNBQW1DLEVBQUU7b0JBQ2pELFNBQVMsRUFBRSxPQUFPLENBQUMsaUJBQWlCO29CQUNwQyxVQUFVLEVBQUUsQ0FBQztpQkFDZCxDQUFDLENBQUM7YUFDSjtRQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUM7UUFFMUIsSUFBSSxVQUFVLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQywyQkFBMkIsRUFBRSxFQUFFO1lBQ3hELE1BQU0sS0FBSyxDQUNQLEdBQUcsVUFBVSxJQUFJLENBQUMsVUFBVSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsR0FBRztnQkFDbkUsNkJBQTZCLENBQUMsQ0FBQztTQUNwQztJQUNILENBQUM7SUFFRCwyQkFBMkI7UUFDekIsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDO1FBQ3RELE1BQU0sa0JBQWtCLEdBQUcsY0FBYyxDQUFDLDJCQUEyQixDQUFDO1FBRXRFLGtGQUFrRjtRQUNsRixJQUFJLENBQUMsZUFBZSxJQUFJLENBQUMsa0JBQWtCLEVBQUU7WUFDM0MsT0FBTywwQ0FBMEMsQ0FBQztTQUNuRDtRQUVELGtFQUFrRTtRQUNsRSxPQUFPLGVBQWUsRUFBRSxhQUFhLElBQUksa0JBQWtCLEVBQUUsYUFBYTtZQUN0RSxJQUFJLENBQUMsMkJBQTJCLEVBQUUsQ0FBQztJQUN6QyxDQUFDO0lBRUQsMkJBQTJCO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLHdCQUF3QixFQUFFLGdCQUFnQjtZQUNsRCxjQUFjLENBQUMsMkJBQTJCLEVBQUUsZ0JBQWdCO1lBQzVELDBDQUEwQyxDQUFDO0lBQ2pELENBQUM7SUFFRCxxQkFBcUI7UUFDbkIseUZBQXlGO1FBQ3pGLElBQUksSUFBSSxDQUFDLGNBQWMsS0FBSyxJQUFJLEVBQUU7WUFDaEMsT0FBTztTQUNSO1FBQ0QsOEZBQThGO1FBQzlGLHlGQUF5RjtRQUN6RixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDeEQsSUFBSTtZQUNGLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDL0I7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLElBQUksSUFBSSxDQUFDLDJCQUEyQixFQUFFLEVBQUU7Z0JBQ3RDLE1BQU0sQ0FBQyxDQUFDO2FBQ1Q7aUJBQU07Z0JBQ0wsT0FBTyxDQUFDLEtBQUssQ0FBQywwQ0FBMEMsRUFBRTtvQkFDeEQsU0FBUyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUTtvQkFDdkMsVUFBVSxFQUFFLENBQUM7aUJBQ2QsQ0FBQyxDQUFDO2FBQ0o7U0FDRjtnQkFBUztZQUNSLFlBQVksQ0FBQyxxQkFBcUIsRUFBRSxFQUFFLENBQUM7U0FDeEM7SUFDSCxDQUFDO0NBQ0Y7QUFFRCxJQUFJLE9BQXVCLENBQUM7QUFFNUIsTUFBTSxVQUFVLGtCQUFrQjtJQUNoQyxPQUFPLE9BQU8sR0FBRyxPQUFPLElBQUksSUFBSSxjQUFjLEVBQUUsQ0FBQztBQUNuRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFRoZSBmb3JtYXR0ZXIgYW5kIENJIGRpc2FncmVlIG9uIGhvdyB0aGlzIGltcG9ydCBzdGF0ZW1lbnQgc2hvdWxkIGJlIGZvcm1hdHRlZC4gQm90aCB0cnkgdG8ga2VlcFxuLy8gaXQgb24gb25lIGxpbmUsIHRvbywgd2hpY2ggaGFzIGdvdHRlbiB2ZXJ5IGhhcmQgdG8gcmVhZCAmIG1hbmFnZS4gU28gZGlzYWJsZSB0aGUgZm9ybWF0dGVyIGZvclxuLy8gdGhpcyBzdGF0ZW1lbnQgb25seS5cblxuLyogY2xhbmctZm9ybWF0IG9mZiAqL1xuaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBEaXJlY3RpdmUsXG4gIEluamVjdEZsYWdzLFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5qZWN0b3IsXG4gIE5nTW9kdWxlLFxuICBOZ1pvbmUsXG4gIFBpcGUsXG4gIFBsYXRmb3JtUmVmLFxuICBQcm92aWRlclRva2VuLFxuICBUeXBlLFxuICDJtWZsdXNoTW9kdWxlU2NvcGluZ1F1ZXVlQXNNdWNoQXNQb3NzaWJsZSBhcyBmbHVzaE1vZHVsZVNjb3BpbmdRdWV1ZUFzTXVjaEFzUG9zc2libGUsXG4gIMm1UmVuZGVyM0NvbXBvbmVudEZhY3RvcnkgYXMgQ29tcG9uZW50RmFjdG9yeSxcbiAgybVSZW5kZXIzTmdNb2R1bGVSZWYgYXMgTmdNb2R1bGVSZWYsXG4gIMm1cmVzZXRDb21waWxlZENvbXBvbmVudHMgYXMgcmVzZXRDb21waWxlZENvbXBvbmVudHMsXG4gIMm1c3RyaW5naWZ5IGFzIHN0cmluZ2lmeSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qIGNsYW5nLWZvcm1hdCBvbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudEZpeHR1cmV9IGZyb20gJy4vY29tcG9uZW50X2ZpeHR1cmUnO1xuaW1wb3J0IHtNZXRhZGF0YU92ZXJyaWRlfSBmcm9tICcuL21ldGFkYXRhX292ZXJyaWRlJztcbmltcG9ydCB7UjNUZXN0QmVkQ29tcGlsZXJ9IGZyb20gJy4vcjNfdGVzdF9iZWRfY29tcGlsZXInO1xuaW1wb3J0IHtUZXN0QmVkfSBmcm9tICcuL3Rlc3RfYmVkJztcbmltcG9ydCB7Q29tcG9uZW50Rml4dHVyZUF1dG9EZXRlY3QsIENvbXBvbmVudEZpeHR1cmVOb05nWm9uZSwgTW9kdWxlVGVhcmRvd25PcHRpb25zLCBURUFSRE9XTl9URVNUSU5HX01PRFVMRV9PTl9ERVNUUk9ZX0RFRkFVTFQsIFRlc3RCZWRTdGF0aWMsIFRlc3RDb21wb25lbnRSZW5kZXJlciwgVGVzdEVudmlyb25tZW50T3B0aW9ucywgVGVzdE1vZHVsZU1ldGFkYXRhfSBmcm9tICcuL3Rlc3RfYmVkX2NvbW1vbic7XG5cbmxldCBfbmV4dFJvb3RFbGVtZW50SWQgPSAwO1xuXG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBDb25maWd1cmVzIGFuZCBpbml0aWFsaXplcyBlbnZpcm9ubWVudCBmb3IgdW5pdCB0ZXN0aW5nIGFuZCBwcm92aWRlcyBtZXRob2RzIGZvclxuICogY3JlYXRpbmcgY29tcG9uZW50cyBhbmQgc2VydmljZXMgaW4gdW5pdCB0ZXN0cy5cbiAqXG4gKiBUZXN0QmVkIGlzIHRoZSBwcmltYXJ5IGFwaSBmb3Igd3JpdGluZyB1bml0IHRlc3RzIGZvciBBbmd1bGFyIGFwcGxpY2F0aW9ucyBhbmQgbGlicmFyaWVzLlxuICpcbiAqIE5vdGU6IFVzZSBgVGVzdEJlZGAgaW4gdGVzdHMuIEl0IHdpbGwgYmUgc2V0IHRvIGVpdGhlciBgVGVzdEJlZFZpZXdFbmdpbmVgIG9yIGBUZXN0QmVkUmVuZGVyM2BcbiAqIGFjY29yZGluZyB0byB0aGUgY29tcGlsZXIgdXNlZC5cbiAqL1xuZXhwb3J0IGNsYXNzIFRlc3RCZWRSZW5kZXIzIGltcGxlbWVudHMgVGVzdEJlZCB7XG4gIC8qKlxuICAgKiBUZWFyZG93biBvcHRpb25zIHRoYXQgaGF2ZSBiZWVuIGNvbmZpZ3VyZWQgYXQgdGhlIGVudmlyb25tZW50IGxldmVsLlxuICAgKiBVc2VkIGFzIGEgZmFsbGJhY2sgaWYgbm8gaW5zdGFuY2UtbGV2ZWwgb3B0aW9ucyBoYXZlIGJlZW4gcHJvdmlkZWQuXG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyBfZW52aXJvbm1lbnRUZWFyZG93bk9wdGlvbnM6IE1vZHVsZVRlYXJkb3duT3B0aW9uc3x1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIFRlYXJkb3duIG9wdGlvbnMgdGhhdCBoYXZlIGJlZW4gY29uZmlndXJlZCBhdCB0aGUgYFRlc3RCZWRgIGluc3RhbmNlIGxldmVsLlxuICAgKiBUaGVzZSBvcHRpb25zIHRha2UgcHJlY2VkZW5jZSBvdmVyIHRoZSBlbnZpcm9uZW1udC1sZXZlbCBvbmVzLlxuICAgKi9cbiAgcHJpdmF0ZSBfaW5zdGFuY2VUZWFyZG93bk9wdGlvbnM6IE1vZHVsZVRlYXJkb3duT3B0aW9uc3x1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIGVudmlyb25tZW50IGZvciB0ZXN0aW5nIHdpdGggYSBjb21waWxlciBmYWN0b3J5LCBhIFBsYXRmb3JtUmVmLCBhbmQgYW5cbiAgICogYW5ndWxhciBtb2R1bGUuIFRoZXNlIGFyZSBjb21tb24gdG8gZXZlcnkgdGVzdCBpbiB0aGUgc3VpdGUuXG4gICAqXG4gICAqIFRoaXMgbWF5IG9ubHkgYmUgY2FsbGVkIG9uY2UsIHRvIHNldCB1cCB0aGUgY29tbW9uIHByb3ZpZGVycyBmb3IgdGhlIGN1cnJlbnQgdGVzdFxuICAgKiBzdWl0ZSBvbiB0aGUgY3VycmVudCBwbGF0Zm9ybS4gSWYgeW91IGFic29sdXRlbHkgbmVlZCB0byBjaGFuZ2UgdGhlIHByb3ZpZGVycyxcbiAgICogZmlyc3QgdXNlIGByZXNldFRlc3RFbnZpcm9ubWVudGAuXG4gICAqXG4gICAqIFRlc3QgbW9kdWxlcyBhbmQgcGxhdGZvcm1zIGZvciBpbmRpdmlkdWFsIHBsYXRmb3JtcyBhcmUgYXZhaWxhYmxlIGZyb21cbiAgICogJ0Bhbmd1bGFyLzxwbGF0Zm9ybV9uYW1lPi90ZXN0aW5nJy5cbiAgICpcbiAgICogQHB1YmxpY0FwaVxuICAgKi9cbiAgc3RhdGljIGluaXRUZXN0RW52aXJvbm1lbnQoXG4gICAgICBuZ01vZHVsZTogVHlwZTxhbnk+fFR5cGU8YW55PltdLCBwbGF0Zm9ybTogUGxhdGZvcm1SZWYsXG4gICAgICBzdW1tYXJpZXNPck9wdGlvbnM/OiBUZXN0RW52aXJvbm1lbnRPcHRpb25zfCgoKSA9PiBhbnlbXSkpOiBUZXN0QmVkIHtcbiAgICBjb25zdCB0ZXN0QmVkID0gX2dldFRlc3RCZWRSZW5kZXIzKCk7XG4gICAgdGVzdEJlZC5pbml0VGVzdEVudmlyb25tZW50KG5nTW9kdWxlLCBwbGF0Zm9ybSwgc3VtbWFyaWVzT3JPcHRpb25zKTtcbiAgICByZXR1cm4gdGVzdEJlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCB0aGUgcHJvdmlkZXJzIGZvciB0aGUgdGVzdCBpbmplY3Rvci5cbiAgICpcbiAgICogQHB1YmxpY0FwaVxuICAgKi9cbiAgc3RhdGljIHJlc2V0VGVzdEVudmlyb25tZW50KCk6IHZvaWQge1xuICAgIF9nZXRUZXN0QmVkUmVuZGVyMygpLnJlc2V0VGVzdEVudmlyb25tZW50KCk7XG4gIH1cblxuICBzdGF0aWMgY29uZmlndXJlQ29tcGlsZXIoY29uZmlnOiB7cHJvdmlkZXJzPzogYW55W107IHVzZUppdD86IGJvb2xlYW47fSk6IFRlc3RCZWRTdGF0aWMge1xuICAgIF9nZXRUZXN0QmVkUmVuZGVyMygpLmNvbmZpZ3VyZUNvbXBpbGVyKGNvbmZpZyk7XG4gICAgcmV0dXJuIFRlc3RCZWRSZW5kZXIzIGFzIGFueSBhcyBUZXN0QmVkU3RhdGljO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93cyBvdmVycmlkaW5nIGRlZmF1bHQgcHJvdmlkZXJzLCBkaXJlY3RpdmVzLCBwaXBlcywgbW9kdWxlcyBvZiB0aGUgdGVzdCBpbmplY3RvcixcbiAgICogd2hpY2ggYXJlIGRlZmluZWQgaW4gdGVzdF9pbmplY3Rvci5qc1xuICAgKi9cbiAgc3RhdGljIGNvbmZpZ3VyZVRlc3RpbmdNb2R1bGUobW9kdWxlRGVmOiBUZXN0TW9kdWxlTWV0YWRhdGEpOiBUZXN0QmVkU3RhdGljIHtcbiAgICBfZ2V0VGVzdEJlZFJlbmRlcjMoKS5jb25maWd1cmVUZXN0aW5nTW9kdWxlKG1vZHVsZURlZik7XG4gICAgcmV0dXJuIFRlc3RCZWRSZW5kZXIzIGFzIGFueSBhcyBUZXN0QmVkU3RhdGljO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbXBpbGUgY29tcG9uZW50cyB3aXRoIGEgYHRlbXBsYXRlVXJsYCBmb3IgdGhlIHRlc3QncyBOZ01vZHVsZS5cbiAgICogSXQgaXMgbmVjZXNzYXJ5IHRvIGNhbGwgdGhpcyBmdW5jdGlvblxuICAgKiBhcyBmZXRjaGluZyB1cmxzIGlzIGFzeW5jaHJvbm91cy5cbiAgICovXG4gIHN0YXRpYyBjb21waWxlQ29tcG9uZW50cygpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiBfZ2V0VGVzdEJlZFJlbmRlcjMoKS5jb21waWxlQ29tcG9uZW50cygpO1xuICB9XG5cbiAgc3RhdGljIG92ZXJyaWRlTW9kdWxlKG5nTW9kdWxlOiBUeXBlPGFueT4sIG92ZXJyaWRlOiBNZXRhZGF0YU92ZXJyaWRlPE5nTW9kdWxlPik6IFRlc3RCZWRTdGF0aWMge1xuICAgIF9nZXRUZXN0QmVkUmVuZGVyMygpLm92ZXJyaWRlTW9kdWxlKG5nTW9kdWxlLCBvdmVycmlkZSk7XG4gICAgcmV0dXJuIFRlc3RCZWRSZW5kZXIzIGFzIGFueSBhcyBUZXN0QmVkU3RhdGljO1xuICB9XG5cbiAgc3RhdGljIG92ZXJyaWRlQ29tcG9uZW50KGNvbXBvbmVudDogVHlwZTxhbnk+LCBvdmVycmlkZTogTWV0YWRhdGFPdmVycmlkZTxDb21wb25lbnQ+KTpcbiAgICAgIFRlc3RCZWRTdGF0aWMge1xuICAgIF9nZXRUZXN0QmVkUmVuZGVyMygpLm92ZXJyaWRlQ29tcG9uZW50KGNvbXBvbmVudCwgb3ZlcnJpZGUpO1xuICAgIHJldHVybiBUZXN0QmVkUmVuZGVyMyBhcyBhbnkgYXMgVGVzdEJlZFN0YXRpYztcbiAgfVxuXG4gIHN0YXRpYyBvdmVycmlkZURpcmVjdGl2ZShkaXJlY3RpdmU6IFR5cGU8YW55Piwgb3ZlcnJpZGU6IE1ldGFkYXRhT3ZlcnJpZGU8RGlyZWN0aXZlPik6XG4gICAgICBUZXN0QmVkU3RhdGljIHtcbiAgICBfZ2V0VGVzdEJlZFJlbmRlcjMoKS5vdmVycmlkZURpcmVjdGl2ZShkaXJlY3RpdmUsIG92ZXJyaWRlKTtcbiAgICByZXR1cm4gVGVzdEJlZFJlbmRlcjMgYXMgYW55IGFzIFRlc3RCZWRTdGF0aWM7XG4gIH1cblxuICBzdGF0aWMgb3ZlcnJpZGVQaXBlKHBpcGU6IFR5cGU8YW55Piwgb3ZlcnJpZGU6IE1ldGFkYXRhT3ZlcnJpZGU8UGlwZT4pOiBUZXN0QmVkU3RhdGljIHtcbiAgICBfZ2V0VGVzdEJlZFJlbmRlcjMoKS5vdmVycmlkZVBpcGUocGlwZSwgb3ZlcnJpZGUpO1xuICAgIHJldHVybiBUZXN0QmVkUmVuZGVyMyBhcyBhbnkgYXMgVGVzdEJlZFN0YXRpYztcbiAgfVxuXG4gIHN0YXRpYyBvdmVycmlkZVRlbXBsYXRlKGNvbXBvbmVudDogVHlwZTxhbnk+LCB0ZW1wbGF0ZTogc3RyaW5nKTogVGVzdEJlZFN0YXRpYyB7XG4gICAgX2dldFRlc3RCZWRSZW5kZXIzKCkub3ZlcnJpZGVDb21wb25lbnQoY29tcG9uZW50LCB7c2V0OiB7dGVtcGxhdGUsIHRlbXBsYXRlVXJsOiBudWxsIX19KTtcbiAgICByZXR1cm4gVGVzdEJlZFJlbmRlcjMgYXMgYW55IGFzIFRlc3RCZWRTdGF0aWM7XG4gIH1cblxuICAvKipcbiAgICogT3ZlcnJpZGVzIHRoZSB0ZW1wbGF0ZSBvZiB0aGUgZ2l2ZW4gY29tcG9uZW50LCBjb21waWxpbmcgdGhlIHRlbXBsYXRlXG4gICAqIGluIHRoZSBjb250ZXh0IG9mIHRoZSBUZXN0aW5nTW9kdWxlLlxuICAgKlxuICAgKiBOb3RlOiBUaGlzIHdvcmtzIGZvciBKSVQgYW5kIEFPVGVkIGNvbXBvbmVudHMgYXMgd2VsbC5cbiAgICovXG4gIHN0YXRpYyBvdmVycmlkZVRlbXBsYXRlVXNpbmdUZXN0aW5nTW9kdWxlKGNvbXBvbmVudDogVHlwZTxhbnk+LCB0ZW1wbGF0ZTogc3RyaW5nKTogVGVzdEJlZFN0YXRpYyB7XG4gICAgX2dldFRlc3RCZWRSZW5kZXIzKCkub3ZlcnJpZGVUZW1wbGF0ZVVzaW5nVGVzdGluZ01vZHVsZShjb21wb25lbnQsIHRlbXBsYXRlKTtcbiAgICByZXR1cm4gVGVzdEJlZFJlbmRlcjMgYXMgYW55IGFzIFRlc3RCZWRTdGF0aWM7XG4gIH1cblxuICBzdGF0aWMgb3ZlcnJpZGVQcm92aWRlcih0b2tlbjogYW55LCBwcm92aWRlcjoge1xuICAgIHVzZUZhY3Rvcnk6IEZ1bmN0aW9uLFxuICAgIGRlcHM6IGFueVtdLFxuICB9KTogVGVzdEJlZFN0YXRpYztcbiAgc3RhdGljIG92ZXJyaWRlUHJvdmlkZXIodG9rZW46IGFueSwgcHJvdmlkZXI6IHt1c2VWYWx1ZTogYW55O30pOiBUZXN0QmVkU3RhdGljO1xuICBzdGF0aWMgb3ZlcnJpZGVQcm92aWRlcih0b2tlbjogYW55LCBwcm92aWRlcjoge1xuICAgIHVzZUZhY3Rvcnk/OiBGdW5jdGlvbixcbiAgICB1c2VWYWx1ZT86IGFueSxcbiAgICBkZXBzPzogYW55W10sXG4gIH0pOiBUZXN0QmVkU3RhdGljIHtcbiAgICBfZ2V0VGVzdEJlZFJlbmRlcjMoKS5vdmVycmlkZVByb3ZpZGVyKHRva2VuLCBwcm92aWRlcik7XG4gICAgcmV0dXJuIFRlc3RCZWRSZW5kZXIzIGFzIGFueSBhcyBUZXN0QmVkU3RhdGljO1xuICB9XG5cbiAgc3RhdGljIGluamVjdDxUPih0b2tlbjogUHJvdmlkZXJUb2tlbjxUPiwgbm90Rm91bmRWYWx1ZT86IFQsIGZsYWdzPzogSW5qZWN0RmxhZ3MpOiBUO1xuICBzdGF0aWMgaW5qZWN0PFQ+KHRva2VuOiBQcm92aWRlclRva2VuPFQ+LCBub3RGb3VuZFZhbHVlOiBudWxsLCBmbGFncz86IEluamVjdEZsYWdzKTogVHxudWxsO1xuICBzdGF0aWMgaW5qZWN0PFQ+KHRva2VuOiBQcm92aWRlclRva2VuPFQ+LCBub3RGb3VuZFZhbHVlPzogVHxudWxsLCBmbGFncz86IEluamVjdEZsYWdzKTogVHxudWxsIHtcbiAgICByZXR1cm4gX2dldFRlc3RCZWRSZW5kZXIzKCkuaW5qZWN0KHRva2VuLCBub3RGb3VuZFZhbHVlLCBmbGFncyk7XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgZnJvbSB2OS4wLjAgdXNlIFRlc3RCZWQuaW5qZWN0ICovXG4gIHN0YXRpYyBnZXQ8VD4odG9rZW46IFByb3ZpZGVyVG9rZW48VD4sIG5vdEZvdW5kVmFsdWU/OiBULCBmbGFncz86IEluamVjdEZsYWdzKTogYW55O1xuICAvKiogQGRlcHJlY2F0ZWQgZnJvbSB2OS4wLjAgdXNlIFRlc3RCZWQuaW5qZWN0ICovXG4gIHN0YXRpYyBnZXQodG9rZW46IGFueSwgbm90Rm91bmRWYWx1ZT86IGFueSk6IGFueTtcbiAgLyoqIEBkZXByZWNhdGVkIGZyb20gdjkuMC4wIHVzZSBUZXN0QmVkLmluamVjdCAqL1xuICBzdGF0aWMgZ2V0KFxuICAgICAgdG9rZW46IGFueSwgbm90Rm91bmRWYWx1ZTogYW55ID0gSW5qZWN0b3IuVEhST1dfSUZfTk9UX0ZPVU5ELFxuICAgICAgZmxhZ3M6IEluamVjdEZsYWdzID0gSW5qZWN0RmxhZ3MuRGVmYXVsdCk6IGFueSB7XG4gICAgcmV0dXJuIF9nZXRUZXN0QmVkUmVuZGVyMygpLmluamVjdCh0b2tlbiwgbm90Rm91bmRWYWx1ZSwgZmxhZ3MpO1xuICB9XG5cbiAgc3RhdGljIGNyZWF0ZUNvbXBvbmVudDxUPihjb21wb25lbnQ6IFR5cGU8VD4pOiBDb21wb25lbnRGaXh0dXJlPFQ+IHtcbiAgICByZXR1cm4gX2dldFRlc3RCZWRSZW5kZXIzKCkuY3JlYXRlQ29tcG9uZW50KGNvbXBvbmVudCk7XG4gIH1cblxuICBzdGF0aWMgcmVzZXRUZXN0aW5nTW9kdWxlKCk6IFRlc3RCZWRTdGF0aWMge1xuICAgIF9nZXRUZXN0QmVkUmVuZGVyMygpLnJlc2V0VGVzdGluZ01vZHVsZSgpO1xuICAgIHJldHVybiBUZXN0QmVkUmVuZGVyMyBhcyBhbnkgYXMgVGVzdEJlZFN0YXRpYztcbiAgfVxuXG4gIHN0YXRpYyBzaG91bGRUZWFyRG93blRlc3RpbmdNb2R1bGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIF9nZXRUZXN0QmVkUmVuZGVyMygpLnNob3VsZFRlYXJEb3duVGVzdGluZ01vZHVsZSgpO1xuICB9XG5cbiAgc3RhdGljIHRlYXJEb3duVGVzdGluZ01vZHVsZSgpOiB2b2lkIHtcbiAgICBfZ2V0VGVzdEJlZFJlbmRlcjMoKS50ZWFyRG93blRlc3RpbmdNb2R1bGUoKTtcbiAgfVxuXG4gIC8vIFByb3BlcnRpZXNcblxuICBwbGF0Zm9ybTogUGxhdGZvcm1SZWYgPSBudWxsITtcbiAgbmdNb2R1bGU6IFR5cGU8YW55PnxUeXBlPGFueT5bXSA9IG51bGwhO1xuXG4gIHByaXZhdGUgX2NvbXBpbGVyOiBSM1Rlc3RCZWRDb21waWxlcnxudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBfdGVzdE1vZHVsZVJlZjogTmdNb2R1bGVSZWY8YW55PnxudWxsID0gbnVsbDtcblxuICBwcml2YXRlIF9hY3RpdmVGaXh0dXJlczogQ29tcG9uZW50Rml4dHVyZTxhbnk+W10gPSBbXTtcbiAgcHJpdmF0ZSBfZ2xvYmFsQ29tcGlsYXRpb25DaGVja2VkID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIGVudmlyb25tZW50IGZvciB0ZXN0aW5nIHdpdGggYSBjb21waWxlciBmYWN0b3J5LCBhIFBsYXRmb3JtUmVmLCBhbmQgYW5cbiAgICogYW5ndWxhciBtb2R1bGUuIFRoZXNlIGFyZSBjb21tb24gdG8gZXZlcnkgdGVzdCBpbiB0aGUgc3VpdGUuXG4gICAqXG4gICAqIFRoaXMgbWF5IG9ubHkgYmUgY2FsbGVkIG9uY2UsIHRvIHNldCB1cCB0aGUgY29tbW9uIHByb3ZpZGVycyBmb3IgdGhlIGN1cnJlbnQgdGVzdFxuICAgKiBzdWl0ZSBvbiB0aGUgY3VycmVudCBwbGF0Zm9ybS4gSWYgeW91IGFic29sdXRlbHkgbmVlZCB0byBjaGFuZ2UgdGhlIHByb3ZpZGVycyxcbiAgICogZmlyc3QgdXNlIGByZXNldFRlc3RFbnZpcm9ubWVudGAuXG4gICAqXG4gICAqIFRlc3QgbW9kdWxlcyBhbmQgcGxhdGZvcm1zIGZvciBpbmRpdmlkdWFsIHBsYXRmb3JtcyBhcmUgYXZhaWxhYmxlIGZyb21cbiAgICogJ0Bhbmd1bGFyLzxwbGF0Zm9ybV9uYW1lPi90ZXN0aW5nJy5cbiAgICpcbiAgICogQHB1YmxpY0FwaVxuICAgKi9cbiAgaW5pdFRlc3RFbnZpcm9ubWVudChcbiAgICAgIG5nTW9kdWxlOiBUeXBlPGFueT58VHlwZTxhbnk+W10sIHBsYXRmb3JtOiBQbGF0Zm9ybVJlZixcbiAgICAgIHN1bW1hcmllc09yT3B0aW9ucz86IFRlc3RFbnZpcm9ubWVudE9wdGlvbnN8KCgpID0+IGFueVtdKSk6IHZvaWQge1xuICAgIGlmICh0aGlzLnBsYXRmb3JtIHx8IHRoaXMubmdNb2R1bGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHNldCBiYXNlIHByb3ZpZGVycyBiZWNhdXNlIGl0IGhhcyBhbHJlYWR5IGJlZW4gY2FsbGVkJyk7XG4gICAgfVxuXG4gICAgLy8gSWYgYHN1bW1hcmllc09yT3B0aW9uc2AgaXMgYSBmdW5jdGlvbiwgaXQgbWVhbnMgdGhhdCBpdCdzXG4gICAgLy8gYW4gQU9UIHN1bW1hcmllcyBmYWN0b3J5IHdoaWNoIEl2eSBkb2Vzbid0IHN1cHBvcnQuXG4gICAgVGVzdEJlZFJlbmRlcjMuX2Vudmlyb25tZW50VGVhcmRvd25PcHRpb25zID1cbiAgICAgICAgdHlwZW9mIHN1bW1hcmllc09yT3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJyA/IHVuZGVmaW5lZCA6IHN1bW1hcmllc09yT3B0aW9ucz8udGVhcmRvd247XG5cbiAgICB0aGlzLnBsYXRmb3JtID0gcGxhdGZvcm07XG4gICAgdGhpcy5uZ01vZHVsZSA9IG5nTW9kdWxlO1xuICAgIHRoaXMuX2NvbXBpbGVyID0gbmV3IFIzVGVzdEJlZENvbXBpbGVyKHRoaXMucGxhdGZvcm0sIHRoaXMubmdNb2R1bGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IHRoZSBwcm92aWRlcnMgZm9yIHRoZSB0ZXN0IGluamVjdG9yLlxuICAgKlxuICAgKiBAcHVibGljQXBpXG4gICAqL1xuICByZXNldFRlc3RFbnZpcm9ubWVudCgpOiB2b2lkIHtcbiAgICB0aGlzLnJlc2V0VGVzdGluZ01vZHVsZSgpO1xuICAgIHRoaXMuX2NvbXBpbGVyID0gbnVsbDtcbiAgICB0aGlzLnBsYXRmb3JtID0gbnVsbCE7XG4gICAgdGhpcy5uZ01vZHVsZSA9IG51bGwhO1xuICAgIFRlc3RCZWRSZW5kZXIzLl9lbnZpcm9ubWVudFRlYXJkb3duT3B0aW9ucyA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJlc2V0VGVzdGluZ01vZHVsZSgpOiB2b2lkIHtcbiAgICB0aGlzLmNoZWNrR2xvYmFsQ29tcGlsYXRpb25GaW5pc2hlZCgpO1xuICAgIHJlc2V0Q29tcGlsZWRDb21wb25lbnRzKCk7XG4gICAgaWYgKHRoaXMuX2NvbXBpbGVyICE9PSBudWxsKSB7XG4gICAgICB0aGlzLmNvbXBpbGVyLnJlc3RvcmVPcmlnaW5hbFN0YXRlKCk7XG4gICAgfVxuICAgIHRoaXMuX2NvbXBpbGVyID0gbmV3IFIzVGVzdEJlZENvbXBpbGVyKHRoaXMucGxhdGZvcm0sIHRoaXMubmdNb2R1bGUpO1xuXG4gICAgLy8gV2UgaGF2ZSB0byBjaGFpbiBhIGNvdXBsZSBvZiB0cnkvZmluYWxseSBibG9ja3MsIGJlY2F1c2UgZWFjaCBzdGVwIGNhblxuICAgIC8vIHRocm93IGVycm9ycyBhbmQgd2UgZG9uJ3Qgd2FudCBpdCB0byBpbnRlcnJ1cHQgdGhlIG5leHQgc3RlcCBhbmQgd2UgYWxzb1xuICAgIC8vIHdhbnQgYW4gZXJyb3IgdG8gYmUgdGhyb3duIGF0IHRoZSBlbmQuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuZGVzdHJveUFjdGl2ZUZpeHR1cmVzKCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICh0aGlzLnNob3VsZFRlYXJEb3duVGVzdGluZ01vZHVsZSgpKSB7XG4gICAgICAgICAgdGhpcy50ZWFyRG93blRlc3RpbmdNb2R1bGUoKTtcbiAgICAgICAgfVxuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5fdGVzdE1vZHVsZVJlZiA9IG51bGw7XG4gICAgICAgIHRoaXMuX2luc3RhbmNlVGVhcmRvd25PcHRpb25zID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbmZpZ3VyZUNvbXBpbGVyKGNvbmZpZzoge3Byb3ZpZGVycz86IGFueVtdOyB1c2VKaXQ/OiBib29sZWFuO30pOiB2b2lkIHtcbiAgICBpZiAoY29uZmlnLnVzZUppdCAhPSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3RoZSBSZW5kZXIzIGNvbXBpbGVyIEppVCBtb2RlIGlzIG5vdCBjb25maWd1cmFibGUgIScpO1xuICAgIH1cblxuICAgIGlmIChjb25maWcucHJvdmlkZXJzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuY29tcGlsZXIuc2V0Q29tcGlsZXJQcm92aWRlcnMoY29uZmlnLnByb3ZpZGVycyk7XG4gICAgfVxuICB9XG5cbiAgY29uZmlndXJlVGVzdGluZ01vZHVsZShtb2R1bGVEZWY6IFRlc3RNb2R1bGVNZXRhZGF0YSk6IHZvaWQge1xuICAgIHRoaXMuYXNzZXJ0Tm90SW5zdGFudGlhdGVkKCdSM1Rlc3RCZWQuY29uZmlndXJlVGVzdGluZ01vZHVsZScsICdjb25maWd1cmUgdGhlIHRlc3QgbW9kdWxlJyk7XG5cbiAgICAvLyBUcmlnZ2VyIG1vZHVsZSBzY29waW5nIHF1ZXVlIGZsdXNoIGJlZm9yZSBleGVjdXRpbmcgb3RoZXIgVGVzdEJlZCBvcGVyYXRpb25zIGluIGEgdGVzdC5cbiAgICAvLyBUaGlzIGlzIG5lZWRlZCBmb3IgdGhlIGZpcnN0IHRlc3QgaW52b2NhdGlvbiB0byBlbnN1cmUgdGhhdCBnbG9iYWxseSBkZWNsYXJlZCBtb2R1bGVzIGhhdmVcbiAgICAvLyB0aGVpciBjb21wb25lbnRzIHNjb3BlZCBwcm9wZXJseS4gU2VlIHRoZSBgY2hlY2tHbG9iYWxDb21waWxhdGlvbkZpbmlzaGVkYCBmdW5jdGlvblxuICAgIC8vIGRlc2NyaXB0aW9uIGZvciBhZGRpdGlvbmFsIGluZm8uXG4gICAgdGhpcy5jaGVja0dsb2JhbENvbXBpbGF0aW9uRmluaXNoZWQoKTtcblxuICAgIC8vIEFsd2F5cyByZS1hc3NpZ24gdGhlIHRlYXJkb3duIG9wdGlvbnMsIGV2ZW4gaWYgdGhleSdyZSB1bmRlZmluZWQuXG4gICAgLy8gVGhpcyBlbnN1cmVzIHRoYXQgd2UgZG9uJ3QgY2FycnkgdGhlIG9wdGlvbnMgYmV0d2VlbiB0ZXN0cy5cbiAgICB0aGlzLl9pbnN0YW5jZVRlYXJkb3duT3B0aW9ucyA9IG1vZHVsZURlZi50ZWFyZG93bjtcbiAgICB0aGlzLmNvbXBpbGVyLmNvbmZpZ3VyZVRlc3RpbmdNb2R1bGUobW9kdWxlRGVmKTtcbiAgfVxuXG4gIGNvbXBpbGVDb21wb25lbnRzKCk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMuY29tcGlsZXIuY29tcGlsZUNvbXBvbmVudHMoKTtcbiAgfVxuXG4gIGluamVjdDxUPih0b2tlbjogUHJvdmlkZXJUb2tlbjxUPiwgbm90Rm91bmRWYWx1ZT86IFQsIGZsYWdzPzogSW5qZWN0RmxhZ3MpOiBUO1xuICBpbmplY3Q8VD4odG9rZW46IFByb3ZpZGVyVG9rZW48VD4sIG5vdEZvdW5kVmFsdWU6IG51bGwsIGZsYWdzPzogSW5qZWN0RmxhZ3MpOiBUfG51bGw7XG4gIGluamVjdDxUPih0b2tlbjogUHJvdmlkZXJUb2tlbjxUPiwgbm90Rm91bmRWYWx1ZT86IFR8bnVsbCwgZmxhZ3M/OiBJbmplY3RGbGFncyk6IFR8bnVsbCB7XG4gICAgaWYgKHRva2VuIGFzIHVua25vd24gPT09IFRlc3RCZWRSZW5kZXIzKSB7XG4gICAgICByZXR1cm4gdGhpcyBhcyBhbnk7XG4gICAgfVxuICAgIGNvbnN0IFVOREVGSU5FRCA9IHt9O1xuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMudGVzdE1vZHVsZVJlZi5pbmplY3Rvci5nZXQodG9rZW4sIFVOREVGSU5FRCwgZmxhZ3MpO1xuICAgIHJldHVybiByZXN1bHQgPT09IFVOREVGSU5FRCA/IHRoaXMuY29tcGlsZXIuaW5qZWN0b3IuZ2V0KHRva2VuLCBub3RGb3VuZFZhbHVlLCBmbGFncykgYXMgYW55IDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQ7XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgZnJvbSB2OS4wLjAgdXNlIFRlc3RCZWQuaW5qZWN0ICovXG4gIGdldDxUPih0b2tlbjogUHJvdmlkZXJUb2tlbjxUPiwgbm90Rm91bmRWYWx1ZT86IFQsIGZsYWdzPzogSW5qZWN0RmxhZ3MpOiBhbnk7XG4gIC8qKiBAZGVwcmVjYXRlZCBmcm9tIHY5LjAuMCB1c2UgVGVzdEJlZC5pbmplY3QgKi9cbiAgZ2V0KHRva2VuOiBhbnksIG5vdEZvdW5kVmFsdWU/OiBhbnkpOiBhbnk7XG4gIC8qKiBAZGVwcmVjYXRlZCBmcm9tIHY5LjAuMCB1c2UgVGVzdEJlZC5pbmplY3QgKi9cbiAgZ2V0KHRva2VuOiBhbnksIG5vdEZvdW5kVmFsdWU6IGFueSA9IEluamVjdG9yLlRIUk9XX0lGX05PVF9GT1VORCxcbiAgICAgIGZsYWdzOiBJbmplY3RGbGFncyA9IEluamVjdEZsYWdzLkRlZmF1bHQpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmluamVjdCh0b2tlbiwgbm90Rm91bmRWYWx1ZSwgZmxhZ3MpO1xuICB9XG5cbiAgZXhlY3V0ZSh0b2tlbnM6IGFueVtdLCBmbjogRnVuY3Rpb24sIGNvbnRleHQ/OiBhbnkpOiBhbnkge1xuICAgIGNvbnN0IHBhcmFtcyA9IHRva2Vucy5tYXAodCA9PiB0aGlzLmluamVjdCh0KSk7XG4gICAgcmV0dXJuIGZuLmFwcGx5KGNvbnRleHQsIHBhcmFtcyk7XG4gIH1cblxuICBvdmVycmlkZU1vZHVsZShuZ01vZHVsZTogVHlwZTxhbnk+LCBvdmVycmlkZTogTWV0YWRhdGFPdmVycmlkZTxOZ01vZHVsZT4pOiB2b2lkIHtcbiAgICB0aGlzLmFzc2VydE5vdEluc3RhbnRpYXRlZCgnb3ZlcnJpZGVNb2R1bGUnLCAnb3ZlcnJpZGUgbW9kdWxlIG1ldGFkYXRhJyk7XG4gICAgdGhpcy5jb21waWxlci5vdmVycmlkZU1vZHVsZShuZ01vZHVsZSwgb3ZlcnJpZGUpO1xuICB9XG5cbiAgb3ZlcnJpZGVDb21wb25lbnQoY29tcG9uZW50OiBUeXBlPGFueT4sIG92ZXJyaWRlOiBNZXRhZGF0YU92ZXJyaWRlPENvbXBvbmVudD4pOiB2b2lkIHtcbiAgICB0aGlzLmFzc2VydE5vdEluc3RhbnRpYXRlZCgnb3ZlcnJpZGVDb21wb25lbnQnLCAnb3ZlcnJpZGUgY29tcG9uZW50IG1ldGFkYXRhJyk7XG4gICAgdGhpcy5jb21waWxlci5vdmVycmlkZUNvbXBvbmVudChjb21wb25lbnQsIG92ZXJyaWRlKTtcbiAgfVxuXG4gIG92ZXJyaWRlVGVtcGxhdGVVc2luZ1Rlc3RpbmdNb2R1bGUoY29tcG9uZW50OiBUeXBlPGFueT4sIHRlbXBsYXRlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmFzc2VydE5vdEluc3RhbnRpYXRlZChcbiAgICAgICAgJ1IzVGVzdEJlZC5vdmVycmlkZVRlbXBsYXRlVXNpbmdUZXN0aW5nTW9kdWxlJyxcbiAgICAgICAgJ0Nhbm5vdCBvdmVycmlkZSB0ZW1wbGF0ZSB3aGVuIHRoZSB0ZXN0IG1vZHVsZSBoYXMgYWxyZWFkeSBiZWVuIGluc3RhbnRpYXRlZCcpO1xuICAgIHRoaXMuY29tcGlsZXIub3ZlcnJpZGVUZW1wbGF0ZVVzaW5nVGVzdGluZ01vZHVsZShjb21wb25lbnQsIHRlbXBsYXRlKTtcbiAgfVxuXG4gIG92ZXJyaWRlRGlyZWN0aXZlKGRpcmVjdGl2ZTogVHlwZTxhbnk+LCBvdmVycmlkZTogTWV0YWRhdGFPdmVycmlkZTxEaXJlY3RpdmU+KTogdm9pZCB7XG4gICAgdGhpcy5hc3NlcnROb3RJbnN0YW50aWF0ZWQoJ292ZXJyaWRlRGlyZWN0aXZlJywgJ292ZXJyaWRlIGRpcmVjdGl2ZSBtZXRhZGF0YScpO1xuICAgIHRoaXMuY29tcGlsZXIub3ZlcnJpZGVEaXJlY3RpdmUoZGlyZWN0aXZlLCBvdmVycmlkZSk7XG4gIH1cblxuICBvdmVycmlkZVBpcGUocGlwZTogVHlwZTxhbnk+LCBvdmVycmlkZTogTWV0YWRhdGFPdmVycmlkZTxQaXBlPik6IHZvaWQge1xuICAgIHRoaXMuYXNzZXJ0Tm90SW5zdGFudGlhdGVkKCdvdmVycmlkZVBpcGUnLCAnb3ZlcnJpZGUgcGlwZSBtZXRhZGF0YScpO1xuICAgIHRoaXMuY29tcGlsZXIub3ZlcnJpZGVQaXBlKHBpcGUsIG92ZXJyaWRlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPdmVyd3JpdGVzIGFsbCBwcm92aWRlcnMgZm9yIHRoZSBnaXZlbiB0b2tlbiB3aXRoIHRoZSBnaXZlbiBwcm92aWRlciBkZWZpbml0aW9uLlxuICAgKi9cbiAgb3ZlcnJpZGVQcm92aWRlcih0b2tlbjogYW55LCBwcm92aWRlcjoge3VzZUZhY3Rvcnk/OiBGdW5jdGlvbiwgdXNlVmFsdWU/OiBhbnksIGRlcHM/OiBhbnlbXX0pOlxuICAgICAgdm9pZCB7XG4gICAgdGhpcy5hc3NlcnROb3RJbnN0YW50aWF0ZWQoJ292ZXJyaWRlUHJvdmlkZXInLCAnb3ZlcnJpZGUgcHJvdmlkZXInKTtcbiAgICB0aGlzLmNvbXBpbGVyLm92ZXJyaWRlUHJvdmlkZXIodG9rZW4sIHByb3ZpZGVyKTtcbiAgfVxuXG4gIGNyZWF0ZUNvbXBvbmVudDxUPih0eXBlOiBUeXBlPFQ+KTogQ29tcG9uZW50Rml4dHVyZTxUPiB7XG4gICAgY29uc3QgdGVzdENvbXBvbmVudFJlbmRlcmVyID0gdGhpcy5pbmplY3QoVGVzdENvbXBvbmVudFJlbmRlcmVyKTtcbiAgICBjb25zdCByb290RWxJZCA9IGByb290JHtfbmV4dFJvb3RFbGVtZW50SWQrK31gO1xuICAgIHRlc3RDb21wb25lbnRSZW5kZXJlci5pbnNlcnRSb290RWxlbWVudChyb290RWxJZCk7XG5cbiAgICBjb25zdCBjb21wb25lbnREZWYgPSAodHlwZSBhcyBhbnkpLsm1Y21wO1xuXG4gICAgaWYgKCFjb21wb25lbnREZWYpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgSXQgbG9va3MgbGlrZSAnJHtzdHJpbmdpZnkodHlwZSl9JyBoYXMgbm90IGJlZW4gSVZZIGNvbXBpbGVkIC0gaXQgaGFzIG5vICfJtWNtcCcgZmllbGRgKTtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiBEb24ndCBjYXN0IGFzIGBJbmplY3Rpb25Ub2tlbjxib29sZWFuPmAsIHByb3BlciB0eXBlIGlzIGJvb2xlYW5bXVxuICAgIGNvbnN0IG5vTmdab25lID0gdGhpcy5pbmplY3QoQ29tcG9uZW50Rml4dHVyZU5vTmdab25lIGFzIEluamVjdGlvblRva2VuPGJvb2xlYW4+LCBmYWxzZSk7XG4gICAgLy8gVE9ETzogRG9uJ3QgY2FzdCBhcyBgSW5qZWN0aW9uVG9rZW48Ym9vbGVhbj5gLCBwcm9wZXIgdHlwZSBpcyBib29sZWFuW11cbiAgICBjb25zdCBhdXRvRGV0ZWN0OiBib29sZWFuID1cbiAgICAgICAgdGhpcy5pbmplY3QoQ29tcG9uZW50Rml4dHVyZUF1dG9EZXRlY3QgYXMgSW5qZWN0aW9uVG9rZW48Ym9vbGVhbj4sIGZhbHNlKTtcbiAgICBjb25zdCBuZ1pvbmU6IE5nWm9uZXxudWxsID0gbm9OZ1pvbmUgPyBudWxsIDogdGhpcy5pbmplY3QoTmdab25lLCBudWxsKTtcbiAgICBjb25zdCBjb21wb25lbnRGYWN0b3J5ID0gbmV3IENvbXBvbmVudEZhY3RvcnkoY29tcG9uZW50RGVmKTtcbiAgICBjb25zdCBpbml0Q29tcG9uZW50ID0gKCkgPT4ge1xuICAgICAgY29uc3QgY29tcG9uZW50UmVmID1cbiAgICAgICAgICBjb21wb25lbnRGYWN0b3J5LmNyZWF0ZShJbmplY3Rvci5OVUxMLCBbXSwgYCMke3Jvb3RFbElkfWAsIHRoaXMudGVzdE1vZHVsZVJlZik7XG4gICAgICByZXR1cm4gbmV3IENvbXBvbmVudEZpeHR1cmU8YW55Pihjb21wb25lbnRSZWYsIG5nWm9uZSwgYXV0b0RldGVjdCk7XG4gICAgfTtcbiAgICBjb25zdCBmaXh0dXJlID0gbmdab25lID8gbmdab25lLnJ1bihpbml0Q29tcG9uZW50KSA6IGluaXRDb21wb25lbnQoKTtcbiAgICB0aGlzLl9hY3RpdmVGaXh0dXJlcy5wdXNoKGZpeHR1cmUpO1xuICAgIHJldHVybiBmaXh0dXJlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbCBzdHJpcCB0aGlzIGZyb20gcHVibGlzaGVkIGQudHMgZmlsZXMgZHVlIHRvXG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMzYyMTZcbiAgICovXG4gIHByaXZhdGUgZ2V0IGNvbXBpbGVyKCk6IFIzVGVzdEJlZENvbXBpbGVyIHtcbiAgICBpZiAodGhpcy5fY29tcGlsZXIgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTmVlZCB0byBjYWxsIFRlc3RCZWQuaW5pdFRlc3RFbnZpcm9ubWVudCgpIGZpcnN0YCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9jb21waWxlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWwgc3RyaXAgdGhpcyBmcm9tIHB1Ymxpc2hlZCBkLnRzIGZpbGVzIGR1ZSB0b1xuICAgKiBodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzM2MjE2XG4gICAqL1xuICBwcml2YXRlIGdldCB0ZXN0TW9kdWxlUmVmKCk6IE5nTW9kdWxlUmVmPGFueT4ge1xuICAgIGlmICh0aGlzLl90ZXN0TW9kdWxlUmVmID09PSBudWxsKSB7XG4gICAgICB0aGlzLl90ZXN0TW9kdWxlUmVmID0gdGhpcy5jb21waWxlci5maW5hbGl6ZSgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fdGVzdE1vZHVsZVJlZjtcbiAgfVxuXG4gIHByaXZhdGUgYXNzZXJ0Tm90SW5zdGFudGlhdGVkKG1ldGhvZE5hbWU6IHN0cmluZywgbWV0aG9kRGVzY3JpcHRpb246IHN0cmluZykge1xuICAgIGlmICh0aGlzLl90ZXN0TW9kdWxlUmVmICE9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYENhbm5vdCAke21ldGhvZERlc2NyaXB0aW9ufSB3aGVuIHRoZSB0ZXN0IG1vZHVsZSBoYXMgYWxyZWFkeSBiZWVuIGluc3RhbnRpYXRlZC4gYCArXG4gICAgICAgICAgYE1ha2Ugc3VyZSB5b3UgYXJlIG5vdCB1c2luZyBcXGBpbmplY3RcXGAgYmVmb3JlIFxcYCR7bWV0aG9kTmFtZX1cXGAuYCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgdGhlIG1vZHVsZSBzY29waW5nIHF1ZXVlIHNob3VsZCBiZSBmbHVzaGVkLCBhbmQgZmx1c2ggaXQgaWYgbmVlZGVkLlxuICAgKlxuICAgKiBXaGVuIHRoZSBUZXN0QmVkIGlzIHJlc2V0LCBpdCBjbGVhcnMgdGhlIEpJVCBtb2R1bGUgY29tcGlsYXRpb24gcXVldWUsIGNhbmNlbGxpbmcgYW55XG4gICAqIGluLXByb2dyZXNzIG1vZHVsZSBjb21waWxhdGlvbi4gVGhpcyBjcmVhdGVzIGEgcG90ZW50aWFsIGhhemFyZCAtIHRoZSB2ZXJ5IGZpcnN0IHRpbWUgdGhlXG4gICAqIFRlc3RCZWQgaXMgaW5pdGlhbGl6ZWQgKG9yIGlmIGl0J3MgcmVzZXQgd2l0aG91dCBiZWluZyBpbml0aWFsaXplZCksIHRoZXJlIG1heSBiZSBwZW5kaW5nXG4gICAqIGNvbXBpbGF0aW9ucyBvZiBtb2R1bGVzIGRlY2xhcmVkIGluIGdsb2JhbCBzY29wZS4gVGhlc2UgY29tcGlsYXRpb25zIHNob3VsZCBiZSBmaW5pc2hlZC5cbiAgICpcbiAgICogVG8gZW5zdXJlIHRoYXQgZ2xvYmFsbHkgZGVjbGFyZWQgbW9kdWxlcyBoYXZlIHRoZWlyIGNvbXBvbmVudHMgc2NvcGVkIHByb3Blcmx5LCB0aGlzIGZ1bmN0aW9uXG4gICAqIGlzIGNhbGxlZCB3aGVuZXZlciBUZXN0QmVkIGlzIGluaXRpYWxpemVkIG9yIHJlc2V0LiBUaGUgX2ZpcnN0XyB0aW1lIHRoYXQgdGhpcyBoYXBwZW5zLCBwcmlvclxuICAgKiB0byBhbnkgb3RoZXIgb3BlcmF0aW9ucywgdGhlIHNjb3BpbmcgcXVldWUgaXMgZmx1c2hlZC5cbiAgICovXG4gIHByaXZhdGUgY2hlY2tHbG9iYWxDb21waWxhdGlvbkZpbmlzaGVkKCk6IHZvaWQge1xuICAgIC8vIENoZWNraW5nIF90ZXN0TmdNb2R1bGVSZWYgaXMgbnVsbCBzaG91bGQgbm90IGJlIG5lY2Vzc2FyeSwgYnV0IGlzIGxlZnQgaW4gYXMgYW4gYWRkaXRpb25hbFxuICAgIC8vIGd1YXJkIHRoYXQgY29tcGlsYXRpb25zIHF1ZXVlZCBpbiB0ZXN0cyAoYWZ0ZXIgaW5zdGFudGlhdGlvbikgYXJlIG5ldmVyIGZsdXNoZWQgYWNjaWRlbnRhbGx5LlxuICAgIGlmICghdGhpcy5fZ2xvYmFsQ29tcGlsYXRpb25DaGVja2VkICYmIHRoaXMuX3Rlc3RNb2R1bGVSZWYgPT09IG51bGwpIHtcbiAgICAgIGZsdXNoTW9kdWxlU2NvcGluZ1F1ZXVlQXNNdWNoQXNQb3NzaWJsZSgpO1xuICAgIH1cbiAgICB0aGlzLl9nbG9iYWxDb21waWxhdGlvbkNoZWNrZWQgPSB0cnVlO1xuICB9XG5cbiAgcHJpdmF0ZSBkZXN0cm95QWN0aXZlRml4dHVyZXMoKTogdm9pZCB7XG4gICAgbGV0IGVycm9yQ291bnQgPSAwO1xuICAgIHRoaXMuX2FjdGl2ZUZpeHR1cmVzLmZvckVhY2goKGZpeHR1cmUpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZpeHR1cmUuZGVzdHJveSgpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBlcnJvckNvdW50Kys7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGR1cmluZyBjbGVhbnVwIG9mIGNvbXBvbmVudCcsIHtcbiAgICAgICAgICBjb21wb25lbnQ6IGZpeHR1cmUuY29tcG9uZW50SW5zdGFuY2UsXG4gICAgICAgICAgc3RhY2t0cmFjZTogZSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5fYWN0aXZlRml4dHVyZXMgPSBbXTtcblxuICAgIGlmIChlcnJvckNvdW50ID4gMCAmJiB0aGlzLnNob3VsZFJldGhyb3dUZWFyZG93bkVycm9ycygpKSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICBgJHtlcnJvckNvdW50fSAkeyhlcnJvckNvdW50ID09PSAxID8gJ2NvbXBvbmVudCcgOiAnY29tcG9uZW50cycpfSBgICtcbiAgICAgICAgICBgdGhyZXcgZXJyb3JzIGR1cmluZyBjbGVhbnVwYCk7XG4gICAgfVxuICB9XG5cbiAgc2hvdWxkUmV0aHJvd1RlYXJkb3duRXJyb3JzKCkge1xuICAgIGNvbnN0IGluc3RhbmNlT3B0aW9ucyA9IHRoaXMuX2luc3RhbmNlVGVhcmRvd25PcHRpb25zO1xuICAgIGNvbnN0IGVudmlyb25tZW50T3B0aW9ucyA9IFRlc3RCZWRSZW5kZXIzLl9lbnZpcm9ubWVudFRlYXJkb3duT3B0aW9ucztcblxuICAgIC8vIElmIHRoZSBuZXcgdGVhcmRvd24gYmVoYXZpb3IgaGFzbid0IGJlZW4gY29uZmlndXJlZCwgcHJlc2VydmUgdGhlIG9sZCBiZWhhdmlvci5cbiAgICBpZiAoIWluc3RhbmNlT3B0aW9ucyAmJiAhZW52aXJvbm1lbnRPcHRpb25zKSB7XG4gICAgICByZXR1cm4gVEVBUkRPV05fVEVTVElOR19NT0RVTEVfT05fREVTVFJPWV9ERUZBVUxUO1xuICAgIH1cblxuICAgIC8vIE90aGVyd2lzZSB1c2UgdGhlIGNvbmZpZ3VyZWQgYmVoYXZpb3Igb3IgZGVmYXVsdCB0byByZXRocm93aW5nLlxuICAgIHJldHVybiBpbnN0YW5jZU9wdGlvbnM/LnJldGhyb3dFcnJvcnMgPz8gZW52aXJvbm1lbnRPcHRpb25zPy5yZXRocm93RXJyb3JzID8/XG4gICAgICAgIHRoaXMuc2hvdWxkVGVhckRvd25UZXN0aW5nTW9kdWxlKCk7XG4gIH1cblxuICBzaG91bGRUZWFyRG93blRlc3RpbmdNb2R1bGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2luc3RhbmNlVGVhcmRvd25PcHRpb25zPy5kZXN0cm95QWZ0ZXJFYWNoID8/XG4gICAgICAgIFRlc3RCZWRSZW5kZXIzLl9lbnZpcm9ubWVudFRlYXJkb3duT3B0aW9ucz8uZGVzdHJveUFmdGVyRWFjaCA/P1xuICAgICAgICBURUFSRE9XTl9URVNUSU5HX01PRFVMRV9PTl9ERVNUUk9ZX0RFRkFVTFQ7XG4gIH1cblxuICB0ZWFyRG93blRlc3RpbmdNb2R1bGUoKSB7XG4gICAgLy8gSWYgdGhlIG1vZHVsZSByZWYgaGFzIGFscmVhZHkgYmVlbiBkZXN0cm95ZWQsIHdlIHdvbid0IGJlIGFibGUgdG8gZ2V0IGEgdGVzdCByZW5kZXJlci5cbiAgICBpZiAodGhpcy5fdGVzdE1vZHVsZVJlZiA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBSZXNvbHZlIHRoZSByZW5kZXJlciBhaGVhZCBvZiB0aW1lLCBiZWNhdXNlIHdlIHdhbnQgdG8gcmVtb3ZlIHRoZSByb290IGVsZW1lbnRzIGFzIHRoZSB2ZXJ5XG4gICAgLy8gbGFzdCBzdGVwLCBidXQgdGhlIGluamVjdG9yIHdpbGwgYmUgZGVzdHJveWVkIGFzIGEgcGFydCBvZiB0aGUgbW9kdWxlIHJlZiBkZXN0cnVjdGlvbi5cbiAgICBjb25zdCB0ZXN0UmVuZGVyZXIgPSB0aGlzLmluamVjdChUZXN0Q29tcG9uZW50UmVuZGVyZXIpO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLl90ZXN0TW9kdWxlUmVmLmRlc3Ryb3koKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAodGhpcy5zaG91bGRSZXRocm93VGVhcmRvd25FcnJvcnMoKSkge1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZHVyaW5nIGNsZWFudXAgb2YgYSB0ZXN0aW5nIG1vZHVsZScsIHtcbiAgICAgICAgICBjb21wb25lbnQ6IHRoaXMuX3Rlc3RNb2R1bGVSZWYuaW5zdGFuY2UsXG4gICAgICAgICAgc3RhY2t0cmFjZTogZSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRlc3RSZW5kZXJlci5yZW1vdmVBbGxSb290RWxlbWVudHM/LigpO1xuICAgIH1cbiAgfVxufVxuXG5sZXQgdGVzdEJlZDogVGVzdEJlZFJlbmRlcjM7XG5cbmV4cG9ydCBmdW5jdGlvbiBfZ2V0VGVzdEJlZFJlbmRlcjMoKTogVGVzdEJlZFJlbmRlcjMge1xuICByZXR1cm4gdGVzdEJlZCA9IHRlc3RCZWQgfHwgbmV3IFRlc3RCZWRSZW5kZXIzKCk7XG59XG4iXX0=