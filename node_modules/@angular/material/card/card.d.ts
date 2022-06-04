import * as i0 from "@angular/core";
/**
 * Content of a card, needed as it's used as a selector in the API.
 * @docs-private
 */
export declare class MatCardContent {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardContent, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatCardContent, "mat-card-content, [mat-card-content], [matCardContent]", never, {}, {}, never>;
}
/**
 * Title of a card, needed as it's used as a selector in the API.
 * @docs-private
 */
export declare class MatCardTitle {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardTitle, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatCardTitle, "mat-card-title, [mat-card-title], [matCardTitle]", never, {}, {}, never>;
}
/**
 * Sub-title of a card, needed as it's used as a selector in the API.
 * @docs-private
 */
export declare class MatCardSubtitle {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardSubtitle, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatCardSubtitle, "mat-card-subtitle, [mat-card-subtitle], [matCardSubtitle]", never, {}, {}, never>;
}
/**
 * Action section of a card, needed as it's used as a selector in the API.
 * @docs-private
 */
export declare class MatCardActions {
    /** Position of the actions inside the card. */
    align: 'start' | 'end';
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardActions, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatCardActions, "mat-card-actions", ["matCardActions"], { "align": "align"; }, {}, never>;
}
/**
 * Footer of a card, needed as it's used as a selector in the API.
 * @docs-private
 */
export declare class MatCardFooter {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardFooter, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatCardFooter, "mat-card-footer", never, {}, {}, never>;
}
/**
 * Image used in a card, needed to add the mat- CSS styling.
 * @docs-private
 */
export declare class MatCardImage {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardImage, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatCardImage, "[mat-card-image], [matCardImage]", never, {}, {}, never>;
}
/**
 * Image used in a card, needed to add the mat- CSS styling.
 * @docs-private
 */
export declare class MatCardSmImage {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardSmImage, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatCardSmImage, "[mat-card-sm-image], [matCardImageSmall]", never, {}, {}, never>;
}
/**
 * Image used in a card, needed to add the mat- CSS styling.
 * @docs-private
 */
export declare class MatCardMdImage {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardMdImage, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatCardMdImage, "[mat-card-md-image], [matCardImageMedium]", never, {}, {}, never>;
}
/**
 * Image used in a card, needed to add the mat- CSS styling.
 * @docs-private
 */
export declare class MatCardLgImage {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardLgImage, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatCardLgImage, "[mat-card-lg-image], [matCardImageLarge]", never, {}, {}, never>;
}
/**
 * Large image used in a card, needed to add the mat- CSS styling.
 * @docs-private
 */
export declare class MatCardXlImage {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardXlImage, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatCardXlImage, "[mat-card-xl-image], [matCardImageXLarge]", never, {}, {}, never>;
}
/**
 * Avatar image used in a card, needed to add the mat- CSS styling.
 * @docs-private
 */
export declare class MatCardAvatar {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardAvatar, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatCardAvatar, "[mat-card-avatar], [matCardAvatar]", never, {}, {}, never>;
}
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
export declare class MatCard {
    _animationMode?: string | undefined;
    constructor(_animationMode?: string | undefined);
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCard, [{ optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatCard, "mat-card", ["matCard"], {}, {}, never, ["*", "mat-card-footer"]>;
}
/**
 * Component intended to be used within the `<mat-card>` component. It adds styles for a
 * preset header section (i.e. a title, subtitle, and avatar layout).
 * @docs-private
 */
export declare class MatCardHeader {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardHeader, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatCardHeader, "mat-card-header", never, {}, {}, never, ["[mat-card-avatar], [matCardAvatar]", "mat-card-title, mat-card-subtitle,\n      [mat-card-title], [mat-card-subtitle],\n      [matCardTitle], [matCardSubtitle]", "*"]>;
}
/**
 * Component intended to be used within the `<mat-card>` component. It adds styles for a preset
 * layout that groups an image with a title section.
 * @docs-private
 */
export declare class MatCardTitleGroup {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardTitleGroup, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatCardTitleGroup, "mat-card-title-group", never, {}, {}, never, ["mat-card-title, mat-card-subtitle,\n      [mat-card-title], [mat-card-subtitle],\n      [matCardTitle], [matCardSubtitle]", "img", "*"]>;
}
