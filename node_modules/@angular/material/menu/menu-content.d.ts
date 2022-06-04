import { ApplicationRef, ChangeDetectorRef, ComponentFactoryResolver, InjectionToken, Injector, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * Injection token that can be used to reference instances of `MatMenuContent`. It serves
 * as alternative token to the actual `MatMenuContent` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export declare const MAT_MENU_CONTENT: InjectionToken<MatMenuContent>;
export declare abstract class _MatMenuContentBase implements OnDestroy {
    private _template;
    private _componentFactoryResolver;
    private _appRef;
    private _injector;
    private _viewContainerRef;
    private _document;
    private _changeDetectorRef?;
    private _portal;
    private _outlet;
    /** Emits when the menu content has been attached. */
    readonly _attached: Subject<void>;
    constructor(template: TemplateRef<any>, componentFactoryResolver: ComponentFactoryResolver, appRef: ApplicationRef, injector: Injector, viewContainerRef: ViewContainerRef, document: any, changeDetectorRef: ChangeDetectorRef);
    /**
     * @deprecated `changeDetectorRef` is now a required parameter.
     * @breaking-change 9.0.0
     */
    constructor(template: TemplateRef<any>, componentFactoryResolver: ComponentFactoryResolver, appRef: ApplicationRef, injector: Injector, viewContainerRef: ViewContainerRef, document: any, changeDetectorRef?: ChangeDetectorRef);
    /**
     * Attaches the content with a particular context.
     * @docs-private
     */
    attach(context?: any): void;
    /**
     * Detaches the content.
     * @docs-private
     */
    detach(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<_MatMenuContentBase, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<_MatMenuContentBase, never, never, {}, {}, never>;
}
/**
 * Menu content that will be rendered lazily once the menu is opened.
 */
export declare class MatMenuContent extends _MatMenuContentBase {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatMenuContent, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatMenuContent, "ng-template[matMenuContent]", never, {}, {}, never>;
}
