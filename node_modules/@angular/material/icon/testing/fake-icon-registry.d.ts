/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { OnDestroy } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
declare type PublicApi<T> = {
    [K in keyof T]: T[K] extends (...x: any[]) => T ? (...x: any[]) => PublicApi<T> : T[K];
};
/**
 * A null icon registry that must be imported to allow disabling of custom
 * icons.
 */
export declare class FakeMatIconRegistry implements PublicApi<MatIconRegistry>, OnDestroy {
    addSvgIcon(): this;
    addSvgIconLiteral(): this;
    addSvgIconInNamespace(): this;
    addSvgIconLiteralInNamespace(): this;
    addSvgIconSet(): this;
    addSvgIconSetLiteral(): this;
    addSvgIconSetInNamespace(): this;
    addSvgIconSetLiteralInNamespace(): this;
    registerFontClassAlias(): this;
    classNameForFontAlias(alias: string): string;
    getDefaultFontSetClass(): string;
    getSvgIconFromUrl(): Observable<SVGElement>;
    getNamedSvgIcon(): Observable<SVGElement>;
    setDefaultFontSetClass(): this;
    addSvgIconResolver(): this;
    ngOnDestroy(): void;
    private _generateEmptySvg;
    static ɵfac: i0.ɵɵFactoryDeclaration<FakeMatIconRegistry, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<FakeMatIconRegistry>;
}
/** Import this module in tests to install the null icon registry. */
export declare class MatIconTestingModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatIconTestingModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatIconTestingModule, never, never, never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatIconTestingModule>;
}
export {};
