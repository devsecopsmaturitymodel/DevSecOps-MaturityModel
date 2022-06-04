/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Component, ViewEncapsulation, ChangeDetectionStrategy, Directive, Input, Optional, Inject, } from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import * as i0 from "@angular/core";
/**
 * Content of a card, needed as it's used as a selector in the API.
 * @docs-private
 */
export class MatCardContent {
}
MatCardContent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatCardContent, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatCardContent.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatCardContent, selector: "mat-card-content, [mat-card-content], [matCardContent]", host: { classAttribute: "mat-card-content" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatCardContent, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-card-content, [mat-card-content], [matCardContent]',
                    host: { 'class': 'mat-card-content' },
                }]
        }] });
/**
 * Title of a card, needed as it's used as a selector in the API.
 * @docs-private
 */
export class MatCardTitle {
}
MatCardTitle.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatCardTitle, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatCardTitle.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatCardTitle, selector: "mat-card-title, [mat-card-title], [matCardTitle]", host: { classAttribute: "mat-card-title" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatCardTitle, decorators: [{
            type: Directive,
            args: [{
                    selector: `mat-card-title, [mat-card-title], [matCardTitle]`,
                    host: {
                        'class': 'mat-card-title',
                    },
                }]
        }] });
/**
 * Sub-title of a card, needed as it's used as a selector in the API.
 * @docs-private
 */
export class MatCardSubtitle {
}
MatCardSubtitle.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatCardSubtitle, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatCardSubtitle.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatCardSubtitle, selector: "mat-card-subtitle, [mat-card-subtitle], [matCardSubtitle]", host: { classAttribute: "mat-card-subtitle" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatCardSubtitle, decorators: [{
            type: Directive,
            args: [{
                    selector: `mat-card-subtitle, [mat-card-subtitle], [matCardSubtitle]`,
                    host: {
                        'class': 'mat-card-subtitle',
                    },
                }]
        }] });
/**
 * Action section of a card, needed as it's used as a selector in the API.
 * @docs-private
 */
export class MatCardActions {
    constructor() {
        /** Position of the actions inside the card. */
        this.align = 'start';
    }
}
MatCardActions.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatCardActions, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatCardActions.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatCardActions, selector: "mat-card-actions", inputs: { align: "align" }, host: { properties: { "class.mat-card-actions-align-end": "align === \"end\"" }, classAttribute: "mat-card-actions" }, exportAs: ["matCardActions"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatCardActions, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-card-actions',
                    exportAs: 'matCardActions',
                    host: {
                        'class': 'mat-card-actions',
                        '[class.mat-card-actions-align-end]': 'align === "end"',
                    },
                }]
        }], propDecorators: { align: [{
                type: Input
            }] } });
/**
 * Footer of a card, needed as it's used as a selector in the API.
 * @docs-private
 */
export class MatCardFooter {
}
MatCardFooter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatCardFooter, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatCardFooter.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatCardFooter, selector: "mat-card-footer", host: { classAttribute: "mat-card-footer" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatCardFooter, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-card-footer',
                    host: { 'class': 'mat-card-footer' },
                }]
        }] });
/**
 * Image used in a card, needed to add the mat- CSS styling.
 * @docs-private
 */
export class MatCardImage {
}
MatCardImage.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatCardImage, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatCardImage.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatCardImage, selector: "[mat-card-image], [matCardImage]", host: { classAttribute: "mat-card-image" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatCardImage, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mat-card-image], [matCardImage]',
                    host: { 'class': 'mat-card-image' },
                }]
        }] });
/**
 * Image used in a card, needed to add the mat- CSS styling.
 * @docs-private
 */
export class MatCardSmImage {
}
MatCardSmImage.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatCardSmImage, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatCardSmImage.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatCardSmImage, selector: "[mat-card-sm-image], [matCardImageSmall]", host: { classAttribute: "mat-card-sm-image" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatCardSmImage, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mat-card-sm-image], [matCardImageSmall]',
                    host: { 'class': 'mat-card-sm-image' },
                }]
        }] });
/**
 * Image used in a card, needed to add the mat- CSS styling.
 * @docs-private
 */
export class MatCardMdImage {
}
MatCardMdImage.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatCardMdImage, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatCardMdImage.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatCardMdImage, selector: "[mat-card-md-image], [matCardImageMedium]", host: { classAttribute: "mat-card-md-image" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatCardMdImage, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mat-card-md-image], [matCardImageMedium]',
                    host: { 'class': 'mat-card-md-image' },
                }]
        }] });
/**
 * Image used in a card, needed to add the mat- CSS styling.
 * @docs-private
 */
export class MatCardLgImage {
}
MatCardLgImage.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatCardLgImage, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatCardLgImage.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatCardLgImage, selector: "[mat-card-lg-image], [matCardImageLarge]", host: { classAttribute: "mat-card-lg-image" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatCardLgImage, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mat-card-lg-image], [matCardImageLarge]',
                    host: { 'class': 'mat-card-lg-image' },
                }]
        }] });
/**
 * Large image used in a card, needed to add the mat- CSS styling.
 * @docs-private
 */
export class MatCardXlImage {
}
MatCardXlImage.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatCardXlImage, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatCardXlImage.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatCardXlImage, selector: "[mat-card-xl-image], [matCardImageXLarge]", host: { classAttribute: "mat-card-xl-image" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatCardXlImage, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mat-card-xl-image], [matCardImageXLarge]',
                    host: { 'class': 'mat-card-xl-image' },
                }]
        }] });
/**
 * Avatar image used in a card, needed to add the mat- CSS styling.
 * @docs-private
 */
export class MatCardAvatar {
}
MatCardAvatar.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatCardAvatar, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatCardAvatar.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatCardAvatar, selector: "[mat-card-avatar], [matCardAvatar]", host: { classAttribute: "mat-card-avatar" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatCardAvatar, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mat-card-avatar], [matCardAvatar]',
                    host: { 'class': 'mat-card-avatar' },
                }]
        }] });
/**
 * A basic content container component that adds the styles of a Material design card.
 *
 * While this component can be used alone, it also provides a number
 * of preset styles for common card sections, including:
 * - mat-card-title
 * - mat-card-subtitle
 * - mat-card-content
 * - mat-card-actions
 * - mat-card-footer
 */
export class MatCard {
    // @breaking-change 9.0.0 `_animationMode` parameter to be made required.
    constructor(_animationMode) {
        this._animationMode = _animationMode;
    }
}
MatCard.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatCard, deps: [{ token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Component });
MatCard.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: MatCard, selector: "mat-card", host: { properties: { "class._mat-animation-noopable": "_animationMode === \"NoopAnimations\"" }, classAttribute: "mat-card mat-focus-indicator" }, exportAs: ["matCard"], ngImport: i0, template: "<ng-content></ng-content>\n<ng-content select=\"mat-card-footer\"></ng-content>\n", styles: [".mat-card{transition:box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);display:block;position:relative;padding:16px;border-radius:4px}._mat-animation-noopable.mat-card{transition:none;animation:none}.mat-card .mat-divider-horizontal{position:absolute;left:0;width:100%}[dir=rtl] .mat-card .mat-divider-horizontal{left:auto;right:0}.mat-card .mat-divider-horizontal.mat-divider-inset{position:static;margin:0}[dir=rtl] .mat-card .mat-divider-horizontal.mat-divider-inset{margin-right:0}.cdk-high-contrast-active .mat-card{outline:solid 1px}.mat-card-actions,.mat-card-subtitle,.mat-card-content{display:block;margin-bottom:16px}.mat-card-title{display:block;margin-bottom:8px}.mat-card-actions{margin-left:-8px;margin-right:-8px;padding:8px 0}.mat-card-actions-align-end{display:flex;justify-content:flex-end}.mat-card-image{width:calc(100% + 32px);margin:0 -16px 16px -16px;display:block;overflow:hidden}.mat-card-image img{width:100%}.mat-card-footer{display:block;margin:0 -16px -16px -16px}.mat-card-actions .mat-button,.mat-card-actions .mat-raised-button,.mat-card-actions .mat-stroked-button{margin:0 8px}.mat-card-header{display:flex;flex-direction:row}.mat-card-header .mat-card-title{margin-bottom:12px}.mat-card-header-text{margin:0 16px}.mat-card-avatar{height:40px;width:40px;border-radius:50%;flex-shrink:0;object-fit:cover}.mat-card-title-group{display:flex;justify-content:space-between}.mat-card-sm-image{width:80px;height:80px}.mat-card-md-image{width:112px;height:112px}.mat-card-lg-image{width:152px;height:152px}.mat-card-xl-image{width:240px;height:240px;margin:-8px}.mat-card-title-group>.mat-card-xl-image{margin:-8px 0 8px}@media(max-width: 599px){.mat-card-title-group{margin:0}.mat-card-xl-image{margin-left:0;margin-right:0}}.mat-card>:first-child,.mat-card-content>:first-child{margin-top:0}.mat-card>:last-child:not(.mat-card-footer),.mat-card-content>:last-child:not(.mat-card-footer){margin-bottom:0}.mat-card-image:first-child{margin-top:-16px;border-top-left-radius:inherit;border-top-right-radius:inherit}.mat-card>.mat-card-actions:last-child{margin-bottom:-8px;padding-bottom:0}.mat-card-actions:not(.mat-card-actions-align-end) .mat-button:first-child,.mat-card-actions:not(.mat-card-actions-align-end) .mat-raised-button:first-child,.mat-card-actions:not(.mat-card-actions-align-end) .mat-stroked-button:first-child{margin-left:0;margin-right:0}.mat-card-actions-align-end .mat-button:last-child,.mat-card-actions-align-end .mat-raised-button:last-child,.mat-card-actions-align-end .mat-stroked-button:last-child{margin-left:0;margin-right:0}.mat-card-title:not(:first-child),.mat-card-subtitle:not(:first-child){margin-top:-4px}.mat-card-header .mat-card-subtitle:not(:first-child){margin-top:-8px}.mat-card>.mat-card-xl-image:first-child{margin-top:-8px}.mat-card>.mat-card-xl-image:last-child{margin-bottom:-8px}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatCard, decorators: [{
            type: Component,
            args: [{ selector: 'mat-card', exportAs: 'matCard', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, host: {
                        'class': 'mat-card mat-focus-indicator',
                        '[class._mat-animation-noopable]': '_animationMode === "NoopAnimations"',
                    }, template: "<ng-content></ng-content>\n<ng-content select=\"mat-card-footer\"></ng-content>\n", styles: [".mat-card{transition:box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);display:block;position:relative;padding:16px;border-radius:4px}._mat-animation-noopable.mat-card{transition:none;animation:none}.mat-card .mat-divider-horizontal{position:absolute;left:0;width:100%}[dir=rtl] .mat-card .mat-divider-horizontal{left:auto;right:0}.mat-card .mat-divider-horizontal.mat-divider-inset{position:static;margin:0}[dir=rtl] .mat-card .mat-divider-horizontal.mat-divider-inset{margin-right:0}.cdk-high-contrast-active .mat-card{outline:solid 1px}.mat-card-actions,.mat-card-subtitle,.mat-card-content{display:block;margin-bottom:16px}.mat-card-title{display:block;margin-bottom:8px}.mat-card-actions{margin-left:-8px;margin-right:-8px;padding:8px 0}.mat-card-actions-align-end{display:flex;justify-content:flex-end}.mat-card-image{width:calc(100% + 32px);margin:0 -16px 16px -16px;display:block;overflow:hidden}.mat-card-image img{width:100%}.mat-card-footer{display:block;margin:0 -16px -16px -16px}.mat-card-actions .mat-button,.mat-card-actions .mat-raised-button,.mat-card-actions .mat-stroked-button{margin:0 8px}.mat-card-header{display:flex;flex-direction:row}.mat-card-header .mat-card-title{margin-bottom:12px}.mat-card-header-text{margin:0 16px}.mat-card-avatar{height:40px;width:40px;border-radius:50%;flex-shrink:0;object-fit:cover}.mat-card-title-group{display:flex;justify-content:space-between}.mat-card-sm-image{width:80px;height:80px}.mat-card-md-image{width:112px;height:112px}.mat-card-lg-image{width:152px;height:152px}.mat-card-xl-image{width:240px;height:240px;margin:-8px}.mat-card-title-group>.mat-card-xl-image{margin:-8px 0 8px}@media(max-width: 599px){.mat-card-title-group{margin:0}.mat-card-xl-image{margin-left:0;margin-right:0}}.mat-card>:first-child,.mat-card-content>:first-child{margin-top:0}.mat-card>:last-child:not(.mat-card-footer),.mat-card-content>:last-child:not(.mat-card-footer){margin-bottom:0}.mat-card-image:first-child{margin-top:-16px;border-top-left-radius:inherit;border-top-right-radius:inherit}.mat-card>.mat-card-actions:last-child{margin-bottom:-8px;padding-bottom:0}.mat-card-actions:not(.mat-card-actions-align-end) .mat-button:first-child,.mat-card-actions:not(.mat-card-actions-align-end) .mat-raised-button:first-child,.mat-card-actions:not(.mat-card-actions-align-end) .mat-stroked-button:first-child{margin-left:0;margin-right:0}.mat-card-actions-align-end .mat-button:last-child,.mat-card-actions-align-end .mat-raised-button:last-child,.mat-card-actions-align-end .mat-stroked-button:last-child{margin-left:0;margin-right:0}.mat-card-title:not(:first-child),.mat-card-subtitle:not(:first-child){margin-top:-4px}.mat-card-header .mat-card-subtitle:not(:first-child){margin-top:-8px}.mat-card>.mat-card-xl-image:first-child{margin-top:-8px}.mat-card>.mat-card-xl-image:last-child{margin-bottom:-8px}\n"] }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; } });
/**
 * Component intended to be used within the `<mat-card>` component. It adds styles for a
 * preset header section (i.e. a title, subtitle, and avatar layout).
 * @docs-private
 */
export class MatCardHeader {
}
MatCardHeader.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatCardHeader, deps: [], target: i0.ɵɵFactoryTarget.Component });
MatCardHeader.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: MatCardHeader, selector: "mat-card-header", host: { classAttribute: "mat-card-header" }, ngImport: i0, template: "<ng-content select=\"[mat-card-avatar], [matCardAvatar]\"></ng-content>\n<div class=\"mat-card-header-text\">\n  <ng-content\n      select=\"mat-card-title, mat-card-subtitle,\n      [mat-card-title], [mat-card-subtitle],\n      [matCardTitle], [matCardSubtitle]\"></ng-content>\n</div>\n<ng-content></ng-content>\n", changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatCardHeader, decorators: [{
            type: Component,
            args: [{ selector: 'mat-card-header', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, host: { 'class': 'mat-card-header' }, template: "<ng-content select=\"[mat-card-avatar], [matCardAvatar]\"></ng-content>\n<div class=\"mat-card-header-text\">\n  <ng-content\n      select=\"mat-card-title, mat-card-subtitle,\n      [mat-card-title], [mat-card-subtitle],\n      [matCardTitle], [matCardSubtitle]\"></ng-content>\n</div>\n<ng-content></ng-content>\n" }]
        }] });
/**
 * Component intended to be used within the `<mat-card>` component. It adds styles for a preset
 * layout that groups an image with a title section.
 * @docs-private
 */
export class MatCardTitleGroup {
}
MatCardTitleGroup.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatCardTitleGroup, deps: [], target: i0.ɵɵFactoryTarget.Component });
MatCardTitleGroup.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: MatCardTitleGroup, selector: "mat-card-title-group", host: { classAttribute: "mat-card-title-group" }, ngImport: i0, template: "<div>\n  <ng-content\n      select=\"mat-card-title, mat-card-subtitle,\n      [mat-card-title], [mat-card-subtitle],\n      [matCardTitle], [matCardSubtitle]\"></ng-content>\n</div>\n<ng-content select=\"img\"></ng-content>\n<ng-content></ng-content>\n", changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatCardTitleGroup, decorators: [{
            type: Component,
            args: [{ selector: 'mat-card-title-group', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, host: { 'class': 'mat-card-title-group' }, template: "<div>\n  <ng-content\n      select=\"mat-card-title, mat-card-subtitle,\n      [mat-card-title], [mat-card-subtitle],\n      [matCardTitle], [matCardSubtitle]\"></ng-content>\n</div>\n<ng-content select=\"img\"></ng-content>\n<ng-content></ng-content>\n" }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jYXJkL2NhcmQudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY2FyZC9jYXJkLmh0bWwiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY2FyZC9jYXJkLWhlYWRlci5odG1sIiwiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NhcmQvY2FyZC10aXRsZS1ncm91cC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFDTCxTQUFTLEVBQ1QsaUJBQWlCLEVBQ2pCLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsS0FBSyxFQUNMLFFBQVEsRUFDUixNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7O0FBRTNFOzs7R0FHRztBQUtILE1BQU0sT0FBTyxjQUFjOzsyR0FBZCxjQUFjOytGQUFkLGNBQWM7MkZBQWQsY0FBYztrQkFKMUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsd0RBQXdEO29CQUNsRSxJQUFJLEVBQUUsRUFBQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUM7aUJBQ3BDOztBQUdEOzs7R0FHRztBQU9ILE1BQU0sT0FBTyxZQUFZOzt5R0FBWixZQUFZOzZGQUFaLFlBQVk7MkZBQVosWUFBWTtrQkFOeEIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsa0RBQWtEO29CQUM1RCxJQUFJLEVBQUU7d0JBQ0osT0FBTyxFQUFFLGdCQUFnQjtxQkFDMUI7aUJBQ0Y7O0FBR0Q7OztHQUdHO0FBT0gsTUFBTSxPQUFPLGVBQWU7OzRHQUFmLGVBQWU7Z0dBQWYsZUFBZTsyRkFBZixlQUFlO2tCQU4zQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSwyREFBMkQ7b0JBQ3JFLElBQUksRUFB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O0FBUUgsTUFBTSxPQUFPLGFBQWE7OzBHQUFiLGFBQWE7OEZBQWIsYUFBYSxvR0VwTDFCLDZUQVFBOzJGRjRLYSxhQUFhO2tCQVB6QixTQUFTOytCQUNFLGlCQUFpQixpQkFFWixpQkFBaUIsQ0FBQyxJQUFJLG1CQUNwQix1QkFBdUIsQ0FBQyxNQUFNLFFBQ3pDLEVBQUMsT0FBTyxFQUFFLGlCQUFpQixFQUFDOztBQUlwQzs7OztHQUlHO0FBUUgsTUFBTSxPQUFPLGlCQUFpQjs7OEdBQWpCLGlCQUFpQjtrR0FBakIsaUJBQWlCLDhHR2xNOUIsK1BBUUE7MkZIMExhLGlCQUFpQjtrQkFQN0IsU0FBUzsrQkFDRSxzQkFBc0IsaUJBRWpCLGlCQUFpQixDQUFDLElBQUksbUJBQ3BCLHVCQUF1QixDQUFDLE1BQU0sUUFDekMsRUFBQyxPQUFPLEVBQUUsc0JBQXNCLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIERpcmVjdGl2ZSxcbiAgSW5wdXQsXG4gIE9wdGlvbmFsLFxuICBJbmplY3QsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5cbi8qKlxuICogQ29udGVudCBvZiBhIGNhcmQsIG5lZWRlZCBhcyBpdCdzIHVzZWQgYXMgYSBzZWxlY3RvciBpbiB0aGUgQVBJLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtY2FyZC1jb250ZW50LCBbbWF0LWNhcmQtY29udGVudF0sIFttYXRDYXJkQ29udGVudF0nLFxuICBob3N0OiB7J2NsYXNzJzogJ21hdC1jYXJkLWNvbnRlbnQnfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2FyZENvbnRlbnQge31cblxuLyoqXG4gKiBUaXRsZSBvZiBhIGNhcmQsIG5lZWRlZCBhcyBpdCdzIHVzZWQgYXMgYSBzZWxlY3RvciBpbiB0aGUgQVBJLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBtYXQtY2FyZC10aXRsZSwgW21hdC1jYXJkLXRpdGxlXSwgW21hdENhcmRUaXRsZV1gLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1jYXJkLXRpdGxlJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2FyZFRpdGxlIHt9XG5cbi8qKlxuICogU3ViLXRpdGxlIG9mIGEgY2FyZCwgbmVlZGVkIGFzIGl0J3MgdXNlZCBhcyBhIHNlbGVjdG9yIGluIHRoZSBBUEkuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYG1hdC1jYXJkLXN1YnRpdGxlLCBbbWF0LWNhcmQtc3VidGl0bGVdLCBbbWF0Q2FyZFN1YnRpdGxlXWAsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWNhcmQtc3VidGl0bGUnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRDYXJkU3VidGl0bGUge31cblxuLyoqXG4gKiBBY3Rpb24gc2VjdGlvbiBvZiBhIGNhcmQsIG5lZWRlZCBhcyBpdCdzIHVzZWQgYXMgYSBzZWxlY3RvciBpbiB0aGUgQVBJLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtY2FyZC1hY3Rpb25zJyxcbiAgZXhwb3J0QXM6ICdtYXRDYXJkQWN0aW9ucycsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWNhcmQtYWN0aW9ucycsXG4gICAgJ1tjbGFzcy5tYXQtY2FyZC1hY3Rpb25zLWFsaWduLWVuZF0nOiAnYWxpZ24gPT09IFwiZW5kXCInLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRDYXJkQWN0aW9ucyB7XG4gIC8qKiBQb3NpdGlvbiBvZiB0aGUgYWN0aW9ucyBpbnNpZGUgdGhlIGNhcmQuICovXG4gIEBJbnB1dCgpIGFsaWduOiAnc3RhcnQnIHwgJ2VuZCcgPSAnc3RhcnQnO1xufVxuXG4vKipcbiAqIEZvb3RlciBvZiBhIGNhcmQsIG5lZWRlZCBhcyBpdCdzIHVzZWQgYXMgYSBzZWxlY3RvciBpbiB0aGUgQVBJLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtY2FyZC1mb290ZXInLFxuICBob3N0OiB7J2NsYXNzJzogJ21hdC1jYXJkLWZvb3Rlcid9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRDYXJkRm9vdGVyIHt9XG5cbi8qKlxuICogSW1hZ2UgdXNlZCBpbiBhIGNhcmQsIG5lZWRlZCB0byBhZGQgdGhlIG1hdC0gQ1NTIHN0eWxpbmcuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXQtY2FyZC1pbWFnZV0sIFttYXRDYXJkSW1hZ2VdJyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtY2FyZC1pbWFnZSd9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRDYXJkSW1hZ2Uge31cblxuLyoqXG4gKiBJbWFnZSB1c2VkIGluIGEgY2FyZCwgbmVlZGVkIHRvIGFkZCB0aGUgbWF0LSBDU1Mgc3R5bGluZy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdC1jYXJkLXNtLWltYWdlXSwgW21hdENhcmRJbWFnZVNtYWxsXScsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LWNhcmQtc20taW1hZ2UnfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2FyZFNtSW1hZ2Uge31cblxuLyoqXG4gKiBJbWFnZSB1c2VkIGluIGEgY2FyZCwgbmVlZGVkIHRvIGFkZCB0aGUgbWF0LSBDU1Mgc3R5bGluZy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdC1jYXJkLW1kLWltYWdlXSwgW21hdENhcmRJbWFnZU1lZGl1bV0nLFxuICBob3N0OiB7J2NsYXNzJzogJ21hdC1jYXJkLW1kLWltYWdlJ30sXG59KVxuZXhwb3J0IGNsYXNzIE1hdENhcmRNZEltYWdlIHt9XG5cbi8qKlxuICogSW1hZ2UgdXNlZCBpbiBhIGNhcmQsIG5lZWRlZCB0byBhZGQgdGhlIG1hdC0gQ1NTIHN0eWxpbmcuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXQtY2FyZC1sZy1pbWFnZV0sIFttYXRDYXJkSW1hZ2VMYXJnZV0nLFxuICBob3N0OiB7J2NsYXNzJzogJ21hdC1jYXJkLWxnLWltYWdlJ30sXG59KVxuZXhwb3J0IGNsYXNzIE1hdENhcmRMZ0ltYWdlIHt9XG5cbi8qKlxuICogTGFyZ2UgaW1hZ2UgdXNlZCBpbiBhIGNhcmQsIG5lZWRlZCB0byBhZGQgdGhlIG1hdC0gQ1NTIHN0eWxpbmcuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXQtY2FyZC14bC1pbWFnZV0sIFttYXRDYXJkSW1hZ2VYTGFyZ2VdJyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtY2FyZC14bC1pbWFnZSd9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRDYXJkWGxJbWFnZSB7fVxuXG4vKipcbiAqIEF2YXRhciBpbWFnZSB1c2VkIGluIGEgY2FyZCwgbmVlZGVkIHRvIGFkZCB0aGUgbWF0LSBDU1Mgc3R5bGluZy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdC1jYXJkLWF2YXRhcl0sIFttYXRDYXJkQXZhdGFyXScsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LWNhcmQtYXZhdGFyJ30sXG59KVxuZXhwb3J0IGNsYXNzIE1hdENhcmRBdmF0YXIge31cblxuLyoqXG4gKiBBIGJhc2ljIGNvbnRlbnQgY29udGFpbmVyIGNvbXBvbmVudCB0aGF0IGFkZHMgdGhlIHN0eWxlcyBvZiBhIE1hdGVyaWFsIGRlc2lnbiBjYXJkLlxuICpcbiAqIFdoaWxlIHRoaXMgY29tcG9uZW50IGNhbiBiZSB1c2VkIGFsb25lLCBpdCBhbHNvIHByb3ZpZGVzIGEgbnVtYmVyXG4gKiBvZiBwcmVzZXQgc3R5bGVzIGZvciBjb21tb24gY2FyZCBzZWN0aW9ucywgaW5jbHVkaW5nOlxuICogLSBtYXQtY2FyZC10aXRsZVxuICogLSBtYXQtY2FyZC1zdWJ0aXRsZVxuICogLSBtYXQtY2FyZC1jb250ZW50XG4gKiAtIG1hdC1jYXJkLWFjdGlvbnNcbiAqIC0gbWF0LWNhcmQtZm9vdGVyXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1jYXJkJyxcbiAgZXhwb3J0QXM6ICdtYXRDYXJkJyxcbiAgdGVtcGxhdGVVcmw6ICdjYXJkLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnY2FyZC5jc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWNhcmQgbWF0LWZvY3VzLWluZGljYXRvcicsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiAnX2FuaW1hdGlvbk1vZGUgPT09IFwiTm9vcEFuaW1hdGlvbnNcIicsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdENhcmQge1xuICAvLyBAYnJlYWtpbmctY2hhbmdlIDkuMC4wIGBfYW5pbWF0aW9uTW9kZWAgcGFyYW1ldGVyIHRvIGJlIG1hZGUgcmVxdWlyZWQuXG4gIGNvbnN0cnVjdG9yKEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBwdWJsaWMgX2FuaW1hdGlvbk1vZGU/OiBzdHJpbmcpIHt9XG59XG5cbi8qKlxuICogQ29tcG9uZW50IGludGVuZGVkIHRvIGJlIHVzZWQgd2l0aGluIHRoZSBgPG1hdC1jYXJkPmAgY29tcG9uZW50LiBJdCBhZGRzIHN0eWxlcyBmb3IgYVxuICogcHJlc2V0IGhlYWRlciBzZWN0aW9uIChpLmUuIGEgdGl0bGUsIHN1YnRpdGxlLCBhbmQgYXZhdGFyIGxheW91dCkuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1jYXJkLWhlYWRlcicsXG4gIHRlbXBsYXRlVXJsOiAnY2FyZC1oZWFkZXIuaHRtbCcsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBob3N0OiB7J2NsYXNzJzogJ21hdC1jYXJkLWhlYWRlcid9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRDYXJkSGVhZGVyIHt9XG5cbi8qKlxuICogQ29tcG9uZW50IGludGVuZGVkIHRvIGJlIHVzZWQgd2l0aGluIHRoZSBgPG1hdC1jYXJkPmAgY29tcG9uZW50LiBJdCBhZGRzIHN0eWxlcyBmb3IgYSBwcmVzZXRcbiAqIGxheW91dCB0aGF0IGdyb3VwcyBhbiBpbWFnZSB3aXRoIGEgdGl0bGUgc2VjdGlvbi5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWNhcmQtdGl0bGUtZ3JvdXAnLFxuICB0ZW1wbGF0ZVVybDogJ2NhcmQtdGl0bGUtZ3JvdXAuaHRtbCcsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBob3N0OiB7J2NsYXNzJzogJ21hdC1jYXJkLXRpdGxlLWdyb3VwJ30sXG59KVxuZXhwb3J0IGNsYXNzIE1hdENhcmRUaXRsZUdyb3VwIHt9XG4iLCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG48bmctY29udGVudCBzZWxlY3Q9XCJtYXQtY2FyZC1mb290ZXJcIj48L25nLWNvbnRlbnQ+XG4iLCI8bmctY29udGVudCBzZWxlY3Q9XCJbbWF0LWNhcmQtYXZhdGFyXSwgW21hdENhcmRBdmF0YXJdXCI+PC9uZy1jb250ZW50PlxuPGRpdiBjbGFzcz1cIm1hdC1jYXJkLWhlYWRlci10ZXh0XCI+XG4gIDxuZy1jb250ZW50XG4gICAgICBzZWxlY3Q9XCJtYXQtY2FyZC10aXRsZSwgbWF0LWNhcmQtc3VidGl0bGUsXG4gICAgICBbbWF0LWNhcmQtdGl0bGVdLCBbbWF0LWNhcmQtc3VidGl0bGVdLFxuICAgICAgW21hdENhcmRUaXRsZV0sIFttYXRDYXJkU3VidGl0bGVdXCI+PC9uZy1jb250ZW50PlxuPC9kaXY+XG48bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4iLCI8ZGl2PlxuICA8bmctY29udGVudFxuICAgICAgc2VsZWN0PVwibWF0LWNhcmQtdGl0bGUsIG1hdC1jYXJkLXN1YnRpdGxlLFxuICAgICAgW21hdC1jYXJkLXRpdGxlXSwgW21hdC1jYXJkLXN1YnRpdGxlXSxcbiAgICAgIFttYXRDYXJkVGl0bGVdLCBbbWF0Q2FyZFN1YnRpdGxlXVwiPjwvbmctY29udGVudD5cbjwvZGl2PlxuPG5nLWNvbnRlbnQgc2VsZWN0PVwiaW1nXCI+PC9uZy1jb250ZW50PlxuPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuIl19