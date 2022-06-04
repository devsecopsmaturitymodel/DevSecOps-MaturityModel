/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { EventEmitter, AfterContentInit, OnDestroy } from '@angular/core';
import { Direction, Directionality } from './directionality';
import * as i0 from "@angular/core";
/**
 * Directive to listen for changes of direction of part of the DOM.
 *
 * Provides itself as Directionality such that descendant directives only need to ever inject
 * Directionality to get the closest direction.
 */
export declare class Dir implements Directionality, AfterContentInit, OnDestroy {
    /** Normalized direction that accounts for invalid/unsupported values. */
    private _dir;
    /** Whether the `value` has been set to its initial value. */
    private _isInitialized;
    /** Direction as passed in by the consumer. */
    _rawDir: string;
    /** Event emitted when the direction changes. */
    readonly change: EventEmitter<Direction>;
    /** @docs-private */
    get dir(): Direction;
    set dir(value: Direction | 'auto');
    /** Current layout direction of the element. */
    get value(): Direction;
    /** Initialize once default value has been set. */
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<Dir, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<Dir, "[dir]", ["dir"], { "dir": "dir"; }, { "change": "dirChange"; }, never>;
}
