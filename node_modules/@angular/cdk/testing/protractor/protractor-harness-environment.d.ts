/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessEnvironment, HarnessLoader, TestElement } from '@angular/cdk/testing';
import { ElementArrayFinder, ElementFinder } from 'protractor';
/**
 * Options to configure the environment.
 * @deprecated
 * @breaking-change 13.0.0
 */
export interface ProtractorHarnessEnvironmentOptions {
    /** The query function used to find DOM elements. */
    queryFn: (selector: string, root: ElementFinder) => ElementArrayFinder;
}
/**
 * A `HarnessEnvironment` implementation for Protractor.
 * @deprecated As of v13.0.0, this environment no longer works, as it is not
 * compatible with the new [Angular Package Format](https://angular.io/guide/angular-package-format).
 * @breaking-change 13.0.0
 */
export declare class ProtractorHarnessEnvironment extends HarnessEnvironment<ElementFinder> {
    /** The options for this environment. */
    private _options;
    protected constructor(rawRootElement: ElementFinder, options?: ProtractorHarnessEnvironmentOptions);
    /** Creates a `HarnessLoader` rooted at the document root. */
    static loader(options?: ProtractorHarnessEnvironmentOptions): HarnessLoader;
    /** Gets the ElementFinder corresponding to the given TestElement. */
    static getNativeElement(el: TestElement): ElementFinder;
    /**
     * Flushes change detection and async tasks captured in the Angular zone.
     * In most cases it should not be necessary to call this manually. However, there may be some edge
     * cases where it is needed to fully flush animation events.
     */
    forceStabilize(): Promise<void>;
    /** @docs-private */
    waitForTasksOutsideAngular(): Promise<void>;
    /** Gets the root element for the document. */
    protected getDocumentRoot(): ElementFinder;
    /** Creates a `TestElement` from a raw element. */
    protected createTestElement(element: ElementFinder): TestElement;
    /** Creates a `HarnessLoader` rooted at the given raw element. */
    protected createEnvironment(element: ElementFinder): HarnessEnvironment<ElementFinder>;
    /**
     * Gets a list of all elements matching the given selector under this environment's root element.
     */
    protected getAllRawElements(selector: string): Promise<ElementFinder[]>;
}
