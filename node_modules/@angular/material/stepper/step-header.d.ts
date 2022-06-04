/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { ChangeDetectorRef, ElementRef, OnDestroy, TemplateRef, AfterViewInit } from '@angular/core';
import { MatStepLabel } from './step-label';
import { MatStepperIntl } from './stepper-intl';
import { MatStepperIconContext } from './stepper-icon';
import { StepState } from '@angular/cdk/stepper';
import { CanColor } from '@angular/material/core';
import * as i0 from "@angular/core";
/** @docs-private */
declare const _MatStepHeaderBase: import("@angular/material/core")._Constructor<CanColor> & import("@angular/material/core")._AbstractConstructor<CanColor> & {
    new (elementRef: ElementRef): {
        _elementRef: ElementRef<HTMLElement>;
        focus(): void;
    };
    ɵfac: unknown;
    ɵdir: unknown;
};
export declare class MatStepHeader extends _MatStepHeaderBase implements AfterViewInit, OnDestroy, CanColor {
    _intl: MatStepperIntl;
    private _focusMonitor;
    private _intlSubscription;
    /** State of the given step. */
    state: StepState;
    /** Label of the given step. */
    label: MatStepLabel | string;
    /** Error message to display when there's an error. */
    errorMessage: string;
    /** Overrides for the header icons, passed in via the stepper. */
    iconOverrides: {
        [key: string]: TemplateRef<MatStepperIconContext>;
    };
    /** Index of the given step. */
    index: number;
    /** Whether the given step is selected. */
    selected: boolean;
    /** Whether the given step label is active. */
    active: boolean;
    /** Whether the given step is optional. */
    optional: boolean;
    /** Whether the ripple should be disabled. */
    disableRipple: boolean;
    constructor(_intl: MatStepperIntl, _focusMonitor: FocusMonitor, _elementRef: ElementRef<HTMLElement>, changeDetectorRef: ChangeDetectorRef);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    /** Focuses the step header. */
    focus(origin?: FocusOrigin, options?: FocusOptions): void;
    /** Returns string label of given step if it is a text label. */
    _stringLabel(): string | null;
    /** Returns MatStepLabel if the label of given step is a template label. */
    _templateLabel(): MatStepLabel | null;
    /** Returns the host HTML element. */
    _getHostElement(): HTMLElement;
    /** Template context variables that are exposed to the `matStepperIcon` instances. */
    _getIconContext(): MatStepperIconContext;
    _getDefaultTextForState(state: StepState): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatStepHeader, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatStepHeader, "mat-step-header", never, { "color": "color"; "state": "state"; "label": "label"; "errorMessage": "errorMessage"; "iconOverrides": "iconOverrides"; "index": "index"; "selected": "selected"; "active": "active"; "optional": "optional"; "disableRipple": "disableRipple"; }, {}, never, never>;
}
export {};
