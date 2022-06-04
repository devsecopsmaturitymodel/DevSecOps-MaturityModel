/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { ErrorStateMatcher } from '../error/error-options';
import { AbstractConstructor, Constructor } from './constructor';
/** @docs-private */
export interface CanUpdateErrorState {
    /** Emits whenever the component state changes. */
    readonly stateChanges: Subject<void>;
    /** Updates the error state based on the provided error state matcher. */
    updateErrorState(): void;
    /** Whether the component is in an error state. */
    errorState: boolean;
    /** An object used to control the error state of the component. */
    errorStateMatcher: ErrorStateMatcher;
}
declare type CanUpdateErrorStateCtor = Constructor<CanUpdateErrorState> & AbstractConstructor<CanUpdateErrorState>;
/** @docs-private */
export interface HasErrorState {
    _parentFormGroup: FormGroupDirective;
    _parentForm: NgForm;
    _defaultErrorStateMatcher: ErrorStateMatcher;
    ngControl: NgControl;
}
/**
 * Mixin to augment a directive with updateErrorState method.
 * For component with `errorState` and need to update `errorState`.
 */
export declare function mixinErrorState<T extends AbstractConstructor<HasErrorState>>(base: T): CanUpdateErrorStateCtor & T;
export {};
