import * as i0 from "@angular/core";
import * as i1 from "./scrollable";
import * as i2 from "./fixed-size-virtual-scroll";
import * as i3 from "./virtual-for-of";
import * as i4 from "./virtual-scroll-viewport";
import * as i5 from "@angular/cdk/bidi";
export declare class CdkScrollableModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<CdkScrollableModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<CdkScrollableModule, [typeof i1.CdkScrollable], never, [typeof i1.CdkScrollable]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<CdkScrollableModule>;
}
/**
 * @docs-primary-export
 */
export declare class ScrollingModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ScrollingModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ScrollingModule, [typeof i2.CdkFixedSizeVirtualScroll, typeof i3.CdkVirtualForOf, typeof i4.CdkVirtualScrollViewport], [typeof i5.BidiModule, typeof CdkScrollableModule], [typeof i5.BidiModule, typeof CdkScrollableModule, typeof i2.CdkFixedSizeVirtualScroll, typeof i3.CdkVirtualForOf, typeof i4.CdkVirtualScrollViewport]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ScrollingModule>;
}
