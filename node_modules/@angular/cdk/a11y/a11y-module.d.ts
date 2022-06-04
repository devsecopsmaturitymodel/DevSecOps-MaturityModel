import { HighContrastModeDetector } from './high-contrast-mode/high-contrast-mode-detector';
import * as i0 from "@angular/core";
import * as i1 from "./live-announcer/live-announcer";
import * as i2 from "./focus-trap/focus-trap";
import * as i3 from "./focus-monitor/focus-monitor";
import * as i4 from "@angular/cdk/observers";
export declare class A11yModule {
    constructor(highContrastModeDetector: HighContrastModeDetector);
    static ɵfac: i0.ɵɵFactoryDeclaration<A11yModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<A11yModule, [typeof i1.CdkAriaLive, typeof i2.CdkTrapFocus, typeof i3.CdkMonitorFocus], [typeof i4.ObserversModule], [typeof i1.CdkAriaLive, typeof i2.CdkTrapFocus, typeof i3.CdkMonitorFocus]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<A11yModule>;
}
