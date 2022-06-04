/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, ComponentHarnessConstructor, HarnessEnvironment, HarnessLoader, TestElement } from '@angular/cdk/testing';
import { ComponentFixture } from '@angular/core/testing';
/** Options to configure the environment. */
export interface TestbedHarnessEnvironmentOptions {
    /** The query function used to find DOM elements. */
    queryFn: (selector: string, root: Element) => Iterable<Element> | ArrayLike<Element>;
}
/** A `HarnessEnvironment` implementation for Angular's Testbed. */
export declare class TestbedHarnessEnvironment extends HarnessEnvironment<Element> {
    private _fixture;
    /** Whether the environment has been destroyed. */
    private _destroyed;
    /** Observable that emits whenever the test task state changes. */
    private _taskState;
    /** The options for this environment. */
    private _options;
    /** Environment stabilization callback passed to the created test elements. */
    private _stabilizeCallback;
    protected constructor(rawRootElement: Element, _fixture: ComponentFixture<unknown>, options?: TestbedHarnessEnvironmentOptions);
    /** Creates a `HarnessLoader` rooted at the given fixture's root element. */
    static loader(fixture: ComponentFixture<unknown>, options?: TestbedHarnessEnvironmentOptions): HarnessLoader;
    /**
     * Creates a `HarnessLoader` at the document root. This can be used if harnesses are
     * located outside of a fixture (e.g. overlays appended to the document body).
     */
    static documentRootLoader(fixture: ComponentFixture<unknown>, options?: TestbedHarnessEnvironmentOptions): HarnessLoader;
    /** Gets the native DOM element corresponding to the given TestElement. */
    static getNativeElement(el: TestElement): Element;
    /**
     * Creates an instance of the given harness type, using the fixture's root element as the
     * harness's host element. This method should be used when creating a harness for the root element
     * of a fixture, as components do not have the correct selector when they are created as the root
     * of the fixture.
     */
    static harnessForFixture<T extends ComponentHarness>(fixture: ComponentFixture<unknown>, harnessType: ComponentHarnessConstructor<T>, options?: TestbedHarnessEnvironmentOptions): Promise<T>;
    /**
     * Flushes change detection and async tasks captured in the Angular zone.
     * In most cases it should not be necessary to call this manually. However, there may be some edge
     * cases where it is needed to fully flush animation events.
     */
    forceStabilize(): Promise<void>;
    /**
     * Waits for all scheduled or running async tasks to complete. This allows harness
     * authors to wait for async tasks outside of the Angular zone.
     */
    waitForTasksOutsideAngular(): Promise<void>;
    /** Gets the root element for the document. */
    protected getDocumentRoot(): Element;
    /** Creates a `TestElement` from a raw element. */
    protected createTestElement(element: Element): TestElement;
    /** Creates a `HarnessLoader` rooted at the given raw element. */
    protected createEnvironment(element: Element): HarnessEnvironment<Element>;
    /**
     * Gets a list of all elements matching the given selector under this environment's root element.
     */
    protected getAllRawElements(selector: string): Promise<Element[]>;
}
