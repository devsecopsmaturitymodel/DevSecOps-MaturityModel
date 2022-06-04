/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BooleanInput } from '@angular/cdk/coercion';
import { AfterContentInit, ChangeDetectorRef, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDatepickerIntl } from './datepicker-intl';
import { MatDatepickerControl, MatDatepickerPanel } from './datepicker-base';
import * as i0 from "@angular/core";
/** Can be used to override the icon of a `matDatepickerToggle`. */
export declare class MatDatepickerToggleIcon {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatDatepickerToggleIcon, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatDatepickerToggleIcon, "[matDatepickerToggleIcon]", never, {}, {}, never>;
}
export declare class MatDatepickerToggle<D> implements AfterContentInit, OnChanges, OnDestroy {
    _intl: MatDatepickerIntl;
    private _changeDetectorRef;
    private _stateChanges;
    /** Datepicker instance that the button will toggle. */
    datepicker: MatDatepickerPanel<MatDatepickerControl<any>, D>;
    /** Tabindex for the toggle. */
    tabIndex: number | null;
    /** Screenreader label for the button. */
    ariaLabel: string;
    /** Whether the toggle button is disabled. */
    get disabled(): boolean;
    set disabled(value: BooleanInput);
    private _disabled;
    /** Whether ripples on the toggle should be disabled. */
    disableRipple: boolean;
    /** Custom icon set by the consumer. */
    _customIcon: MatDatepickerToggleIcon;
    /** Underlying button element. */
    _button: MatButton;
    constructor(_intl: MatDatepickerIntl, _changeDetectorRef: ChangeDetectorRef, defaultTabIndex: string);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    ngAfterContentInit(): void;
    _open(event: Event): void;
    private _watchStateChanges;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatDatepickerToggle<any>, [null, null, { attribute: "tabindex"; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatDatepickerToggle<any>, "mat-datepicker-toggle", ["matDatepickerToggle"], { "datepicker": "for"; "tabIndex": "tabIndex"; "ariaLabel": "aria-label"; "disabled": "disabled"; "disableRipple": "disableRipple"; }, {}, ["_customIcon"], ["[matDatepickerToggleIcon]"]>;
}
