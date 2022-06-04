/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef } from '@angular/core';
import { ConnectedOverlayPositionChange, validateHorizontalPosition, validateVerticalPosition, } from './connected-position';
import { Subscription, Subject } from 'rxjs';
import { isElementScrolledOutsideView, isElementClippedByScrolling } from './scroll-clip';
import { coerceCssPixelValue, coerceArray } from '@angular/cdk/coercion';
// TODO: refactor clipping detection into a separate thing (part of scrolling module)
// TODO: doesn't handle both flexible width and height when it has to scroll along both axis.
/** Class to be added to the overlay bounding box. */
const boundingBoxClass = 'cdk-overlay-connected-position-bounding-box';
/** Regex used to split a string on its CSS units. */
const cssUnitPattern = /([A-Za-z%]+)$/;
/**
 * A strategy for positioning overlays. Using this strategy, an overlay is given an
 * implicit position relative some origin element. The relative position is defined in terms of
 * a point on the origin element that is connected to a point on the overlay element. For example,
 * a basic dropdown is connecting the bottom-left corner of the origin to the top-left corner
 * of the overlay.
 */
export class FlexibleConnectedPositionStrategy {
    constructor(connectedTo, _viewportRuler, _document, _platform, _overlayContainer) {
        this._viewportRuler = _viewportRuler;
        this._document = _document;
        this._platform = _platform;
        this._overlayContainer = _overlayContainer;
        /** Last size used for the bounding box. Used to avoid resizing the overlay after open. */
        this._lastBoundingBoxSize = { width: 0, height: 0 };
        /** Whether the overlay was pushed in a previous positioning. */
        this._isPushed = false;
        /** Whether the overlay can be pushed on-screen on the initial open. */
        this._canPush = true;
        /** Whether the overlay can grow via flexible width/height after the initial open. */
        this._growAfterOpen = false;
        /** Whether the overlay's width and height can be constrained to fit within the viewport. */
        this._hasFlexibleDimensions = true;
        /** Whether the overlay position is locked. */
        this._positionLocked = false;
        /** Amount of space that must be maintained between the overlay and the edge of the viewport. */
        this._viewportMargin = 0;
        /** The Scrollable containers used to check scrollable view properties on position change. */
        this._scrollables = [];
        /** Ordered list of preferred positions, from most to least desirable. */
        this._preferredPositions = [];
        /** Subject that emits whenever the position changes. */
        this._positionChanges = new Subject();
        /** Subscription to viewport size changes. */
        this._resizeSubscription = Subscription.EMPTY;
        /** Default offset for the overlay along the x axis. */
        this._offsetX = 0;
        /** Default offset for the overlay along the y axis. */
        this._offsetY = 0;
        /** Keeps track of the CSS classes that the position strategy has applied on the overlay panel. */
        this._appliedPanelClasses = [];
        /** Observable sequence of position changes. */
        this.positionChanges = this._positionChanges;
        this.setOrigin(connectedTo);
    }
    /** Ordered list of preferred positions, from most to least desirable. */
    get positions() {
        return this._preferredPositions;
    }
    /** Attaches this position strategy to an overlay. */
    attach(overlayRef) {
        if (this._overlayRef &&
            overlayRef !== this._overlayRef &&
            (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw Error('This position strategy is already attached to an overlay');
        }
        this._validatePositions();
        overlayRef.hostElement.classList.add(boundingBoxClass);
        this._overlayRef = overlayRef;
        this._boundingBox = overlayRef.hostElement;
        this._pane = overlayRef.overlayElement;
        this._isDisposed = false;
        this._isInitialRender = true;
        this._lastPosition = null;
        this._resizeSubscription.unsubscribe();
        this._resizeSubscription = this._viewportRuler.change().subscribe(() => {
            // When the window is resized, we want to trigger the next reposition as if it
            // was an initial render, in order for the strategy to pick a new optimal position,
            // otherwise position locking will cause it to stay at the old one.
            this._isInitialRender = true;
            this.apply();
        });
    }
    /**
     * Updates the position of the overlay element, using whichever preferred position relative
     * to the origin best fits on-screen.
     *
     * The selection of a position goes as follows:
     *  - If any positions fit completely within the viewport as-is,
     *      choose the first position that does so.
     *  - If flexible dimensions are enabled and at least one satifies the given minimum width/height,
     *      choose the position with the greatest available size modified by the positions' weight.
     *  - If pushing is enabled, take the position that went off-screen the least and push it
     *      on-screen.
     *  - If none of the previous criteria were met, use the position that goes off-screen the least.
     * @docs-private
     */
    apply() {
        // We shouldn't do anything if the strategy was disposed or we're on the server.
        if (this._isDisposed || !this._platform.isBrowser) {
            return;
        }
        // If the position has been applied already (e.g. when the overlay was opened) and the
        // consumer opted into locking in the position, re-use the old position, in order to
        // prevent the overlay from jumping around.
        if (!this._isInitialRender && this._positionLocked && this._lastPosition) {
            this.reapplyLastPosition();
            return;
        }
        this._clearPanelClasses();
        this._resetOverlayElementStyles();
        this._resetBoundingBoxStyles();
        // We need the bounding rects for the origin, the overlay and the container to determine how to position
        // the overlay relative to the origin.
        // We use the viewport rect to determine whether a position would go off-screen.
        this._viewportRect = this._getNarrowedViewportRect();
        this._originRect = this._getOriginRect();
        this._overlayRect = this._pane.getBoundingClientRect();
        this._containerRect = this._overlayContainer.getContainerElement().getBoundingClientRect();
        const originRect = this._originRect;
        const overlayRect = this._overlayRect;
        const viewportRect = this._viewportRect;
        const containerRect = this._containerRect;
        // Positions where the overlay will fit with flexible dimensions.
        const flexibleFits = [];
        // Fallback if none of the preferred positions fit within the viewport.
        let fallback;
        // Go through each of the preferred positions looking for a good fit.
        // If a good fit is found, it will be applied immediately.
        for (let pos of this._preferredPositions) {
            // Get the exact (x, y) coordinate for the point-of-origin on the origin element.
            let originPoint = this._getOriginPoint(originRect, containerRect, pos);
            // From that point-of-origin, get the exact (x, y) coordinate for the top-left corner of the
            // overlay in this position. We use the top-left corner for calculations and later translate
            // this into an appropriate (top, left, bottom, right) style.
            let overlayPoint = this._getOverlayPoint(originPoint, overlayRect, pos);
            // Calculate how well the overlay would fit into the viewport with this point.
            let overlayFit = this._getOverlayFit(overlayPoint, overlayRect, viewportRect, pos);
            // If the overlay, without any further work, fits into the viewport, use this position.
            if (overlayFit.isCompletelyWithinViewport) {
                this._isPushed = false;
                this._applyPosition(pos, originPoint);
                return;
            }
            // If the overlay has flexible dimensions, we can use this position
            // so long as there's enough space for the minimum dimensions.
            if (this._canFitWithFlexibleDimensions(overlayFit, overlayPoint, viewportRect)) {
                // Save positions where the overlay will fit with flexible dimensions. We will use these
                // if none of the positions fit *without* flexible dimensions.
                flexibleFits.push({
                    position: pos,
                    origin: originPoint,
                    overlayRect,
                    boundingBoxRect: this._calculateBoundingBoxRect(originPoint, pos),
                });
                continue;
            }
            // If the current preferred position does not fit on the screen, remember the position
            // if it has more visible area on-screen than we've seen and move onto the next preferred
            // position.
            if (!fallback || fallback.overlayFit.visibleArea < overlayFit.visibleArea) {
                fallback = { overlayFit, overlayPoint, originPoint, position: pos, overlayRect };
            }
        }
        // If there are any positions where the overlay would fit with flexible dimensions, choose the
        // one that has the greatest area available modified by the position's weight
        if (flexibleFits.length) {
            let bestFit = null;
            let bestScore = -1;
            for (const fit of flexibleFits) {
                const score = fit.boundingBoxRect.width * fit.boundingBoxRect.height * (fit.position.weight || 1);
                if (score > bestScore) {
                    bestScore = score;
                    bestFit = fit;
                }
            }
            this._isPushed = false;
            this._applyPosition(bestFit.position, bestFit.origin);
            return;
        }
        // When none of the preferred positions fit within the viewport, take the position
        // that went off-screen the least and attempt to push it on-screen.
        if (this._canPush) {
            // TODO(jelbourn): after pushing, the opening "direction" of the overlay might not make sense.
            this._isPushed = true;
            this._applyPosition(fallback.position, fallback.originPoint);
            return;
        }
        // All options for getting the overlay within the viewport have been exhausted, so go with the
        // position that went off-screen the least.
        this._applyPosition(fallback.position, fallback.originPoint);
    }
    detach() {
        this._clearPanelClasses();
        this._lastPosition = null;
        this._previousPushAmount = null;
        this._resizeSubscription.unsubscribe();
    }
    /** Cleanup after the element gets destroyed. */
    dispose() {
        if (this._isDisposed) {
            return;
        }
        // We can't use `_resetBoundingBoxStyles` here, because it resets
        // some properties to zero, rather than removing them.
        if (this._boundingBox) {
            extendStyles(this._boundingBox.style, {
                top: '',
                left: '',
                right: '',
                bottom: '',
                height: '',
                width: '',
                alignItems: '',
                justifyContent: '',
            });
        }
        if (this._pane) {
            this._resetOverlayElementStyles();
        }
        if (this._overlayRef) {
            this._overlayRef.hostElement.classList.remove(boundingBoxClass);
        }
        this.detach();
        this._positionChanges.complete();
        this._overlayRef = this._boundingBox = null;
        this._isDisposed = true;
    }
    /**
     * This re-aligns the overlay element with the trigger in its last calculated position,
     * even if a position higher in the "preferred positions" list would now fit. This
     * allows one to re-align the panel without changing the orientation of the panel.
     */
    reapplyLastPosition() {
        if (this._isDisposed || !this._platform.isBrowser) {
            return;
        }
        const lastPosition = this._lastPosition;
        if (lastPosition) {
            this._originRect = this._getOriginRect();
            this._overlayRect = this._pane.getBoundingClientRect();
            this._viewportRect = this._getNarrowedViewportRect();
            this._containerRect = this._overlayContainer.getContainerElement().getBoundingClientRect();
            const originPoint = this._getOriginPoint(this._originRect, this._containerRect, lastPosition);
            this._applyPosition(lastPosition, originPoint);
        }
        else {
            this.apply();
        }
    }
    /**
     * Sets the list of Scrollable containers that host the origin element so that
     * on reposition we can evaluate if it or the overlay has been clipped or outside view. Every
     * Scrollable must be an ancestor element of the strategy's origin element.
     */
    withScrollableContainers(scrollables) {
        this._scrollables = scrollables;
        return this;
    }
    /**
     * Adds new preferred positions.
     * @param positions List of positions options for this overlay.
     */
    withPositions(positions) {
        this._preferredPositions = positions;
        // If the last calculated position object isn't part of the positions anymore, clear
        // it in order to avoid it being picked up if the consumer tries to re-apply.
        if (positions.indexOf(this._lastPosition) === -1) {
            this._lastPosition = null;
        }
        this._validatePositions();
        return this;
    }
    /**
     * Sets a minimum distance the overlay may be positioned to the edge of the viewport.
     * @param margin Required margin between the overlay and the viewport edge in pixels.
     */
    withViewportMargin(margin) {
        this._viewportMargin = margin;
        return this;
    }
    /** Sets whether the overlay's width and height can be constrained to fit within the viewport. */
    withFlexibleDimensions(flexibleDimensions = true) {
        this._hasFlexibleDimensions = flexibleDimensions;
        return this;
    }
    /** Sets whether the overlay can grow after the initial open via flexible width/height. */
    withGrowAfterOpen(growAfterOpen = true) {
        this._growAfterOpen = growAfterOpen;
        return this;
    }
    /** Sets whether the overlay can be pushed on-screen if none of the provided positions fit. */
    withPush(canPush = true) {
        this._canPush = canPush;
        return this;
    }
    /**
     * Sets whether the overlay's position should be locked in after it is positioned
     * initially. When an overlay is locked in, it won't attempt to reposition itself
     * when the position is re-applied (e.g. when the user scrolls away).
     * @param isLocked Whether the overlay should locked in.
     */
    withLockedPosition(isLocked = true) {
        this._positionLocked = isLocked;
        return this;
    }
    /**
     * Sets the origin, relative to which to position the overlay.
     * Using an element origin is useful for building components that need to be positioned
     * relatively to a trigger (e.g. dropdown menus or tooltips), whereas using a point can be
     * used for cases like contextual menus which open relative to the user's pointer.
     * @param origin Reference to the new origin.
     */
    setOrigin(origin) {
        this._origin = origin;
        return this;
    }
    /**
     * Sets the default offset for the overlay's connection point on the x-axis.
     * @param offset New offset in the X axis.
     */
    withDefaultOffsetX(offset) {
        this._offsetX = offset;
        return this;
    }
    /**
     * Sets the default offset for the overlay's connection point on the y-axis.
     * @param offset New offset in the Y axis.
     */
    withDefaultOffsetY(offset) {
        this._offsetY = offset;
        return this;
    }
    /**
     * Configures that the position strategy should set a `transform-origin` on some elements
     * inside the overlay, depending on the current position that is being applied. This is
     * useful for the cases where the origin of an animation can change depending on the
     * alignment of the overlay.
     * @param selector CSS selector that will be used to find the target
     *    elements onto which to set the transform origin.
     */
    withTransformOriginOn(selector) {
        this._transformOriginSelector = selector;
        return this;
    }
    /**
     * Gets the (x, y) coordinate of a connection point on the origin based on a relative position.
     */
    _getOriginPoint(originRect, containerRect, pos) {
        let x;
        if (pos.originX == 'center') {
            // Note: when centering we should always use the `left`
            // offset, otherwise the position will be wrong in RTL.
            x = originRect.left + originRect.width / 2;
        }
        else {
            const startX = this._isRtl() ? originRect.right : originRect.left;
            const endX = this._isRtl() ? originRect.left : originRect.right;
            x = pos.originX == 'start' ? startX : endX;
        }
        // When zooming in Safari the container rectangle contains negative values for the position
        // and we need to re-add them to the calculated coordinates.
        if (containerRect.left < 0) {
            x -= containerRect.left;
        }
        let y;
        if (pos.originY == 'center') {
            y = originRect.top + originRect.height / 2;
        }
        else {
            y = pos.originY == 'top' ? originRect.top : originRect.bottom;
        }
        // Normally the containerRect's top value would be zero, however when the overlay is attached to an input
        // (e.g. in an autocomplete), mobile browsers will shift everything in order to put the input in the middle
        // of the screen and to make space for the virtual keyboard. We need to account for this offset,
        // otherwise our positioning will be thrown off.
        // Additionally, when zooming in Safari this fixes the vertical position.
        if (containerRect.top < 0) {
            y -= containerRect.top;
        }
        return { x, y };
    }
    /**
     * Gets the (x, y) coordinate of the top-left corner of the overlay given a given position and
     * origin point to which the overlay should be connected.
     */
    _getOverlayPoint(originPoint, overlayRect, pos) {
        // Calculate the (overlayStartX, overlayStartY), the start of the
        // potential overlay position relative to the origin point.
        let overlayStartX;
        if (pos.overlayX == 'center') {
            overlayStartX = -overlayRect.width / 2;
        }
        else if (pos.overlayX === 'start') {
            overlayStartX = this._isRtl() ? -overlayRect.width : 0;
        }
        else {
            overlayStartX = this._isRtl() ? 0 : -overlayRect.width;
        }
        let overlayStartY;
        if (pos.overlayY == 'center') {
            overlayStartY = -overlayRect.height / 2;
        }
        else {
            overlayStartY = pos.overlayY == 'top' ? 0 : -overlayRect.height;
        }
        // The (x, y) coordinates of the overlay.
        return {
            x: originPoint.x + overlayStartX,
            y: originPoint.y + overlayStartY,
        };
    }
    /** Gets how well an overlay at the given point will fit within the viewport. */
    _getOverlayFit(point, rawOverlayRect, viewport, position) {
        // Round the overlay rect when comparing against the
        // viewport, because the viewport is always rounded.
        const overlay = getRoundedBoundingClientRect(rawOverlayRect);
        let { x, y } = point;
        let offsetX = this._getOffset(position, 'x');
        let offsetY = this._getOffset(position, 'y');
        // Account for the offsets since they could push the overlay out of the viewport.
        if (offsetX) {
            x += offsetX;
        }
        if (offsetY) {
            y += offsetY;
        }
        // How much the overlay would overflow at this position, on each side.
        let leftOverflow = 0 - x;
        let rightOverflow = x + overlay.width - viewport.width;
        let topOverflow = 0 - y;
        let bottomOverflow = y + overlay.height - viewport.height;
        // Visible parts of the element on each axis.
        let visibleWidth = this._subtractOverflows(overlay.width, leftOverflow, rightOverflow);
        let visibleHeight = this._subtractOverflows(overlay.height, topOverflow, bottomOverflow);
        let visibleArea = visibleWidth * visibleHeight;
        return {
            visibleArea,
            isCompletelyWithinViewport: overlay.width * overlay.height === visibleArea,
            fitsInViewportVertically: visibleHeight === overlay.height,
            fitsInViewportHorizontally: visibleWidth == overlay.width,
        };
    }
    /**
     * Whether the overlay can fit within the viewport when it may resize either its width or height.
     * @param fit How well the overlay fits in the viewport at some position.
     * @param point The (x, y) coordinates of the overlay at some position.
     * @param viewport The geometry of the viewport.
     */
    _canFitWithFlexibleDimensions(fit, point, viewport) {
        if (this._hasFlexibleDimensions) {
            const availableHeight = viewport.bottom - point.y;
            const availableWidth = viewport.right - point.x;
            const minHeight = getPixelValue(this._overlayRef.getConfig().minHeight);
            const minWidth = getPixelValue(this._overlayRef.getConfig().minWidth);
            const verticalFit = fit.fitsInViewportVertically || (minHeight != null && minHeight <= availableHeight);
            const horizontalFit = fit.fitsInViewportHorizontally || (minWidth != null && minWidth <= availableWidth);
            return verticalFit && horizontalFit;
        }
        return false;
    }
    /**
     * Gets the point at which the overlay can be "pushed" on-screen. If the overlay is larger than
     * the viewport, the top-left corner will be pushed on-screen (with overflow occuring on the
     * right and bottom).
     *
     * @param start Starting point from which the overlay is pushed.
     * @param rawOverlayRect Dimensions of the overlay.
     * @param scrollPosition Current viewport scroll position.
     * @returns The point at which to position the overlay after pushing. This is effectively a new
     *     originPoint.
     */
    _pushOverlayOnScreen(start, rawOverlayRect, scrollPosition) {
        // If the position is locked and we've pushed the overlay already, reuse the previous push
        // amount, rather than pushing it again. If we were to continue pushing, the element would
        // remain in the viewport, which goes against the expectations when position locking is enabled.
        if (this._previousPushAmount && this._positionLocked) {
            return {
                x: start.x + this._previousPushAmount.x,
                y: start.y + this._previousPushAmount.y,
            };
        }
        // Round the overlay rect when comparing against the
        // viewport, because the viewport is always rounded.
        const overlay = getRoundedBoundingClientRect(rawOverlayRect);
        const viewport = this._viewportRect;
        // Determine how much the overlay goes outside the viewport on each
        // side, which we'll use to decide which direction to push it.
        const overflowRight = Math.max(start.x + overlay.width - viewport.width, 0);
        const overflowBottom = Math.max(start.y + overlay.height - viewport.height, 0);
        const overflowTop = Math.max(viewport.top - scrollPosition.top - start.y, 0);
        const overflowLeft = Math.max(viewport.left - scrollPosition.left - start.x, 0);
        // Amount by which to push the overlay in each axis such that it remains on-screen.
        let pushX = 0;
        let pushY = 0;
        // If the overlay fits completely within the bounds of the viewport, push it from whichever
        // direction is goes off-screen. Otherwise, push the top-left corner such that its in the
        // viewport and allow for the trailing end of the overlay to go out of bounds.
        if (overlay.width <= viewport.width) {
            pushX = overflowLeft || -overflowRight;
        }
        else {
            pushX = start.x < this._viewportMargin ? viewport.left - scrollPosition.left - start.x : 0;
        }
        if (overlay.height <= viewport.height) {
            pushY = overflowTop || -overflowBottom;
        }
        else {
            pushY = start.y < this._viewportMargin ? viewport.top - scrollPosition.top - start.y : 0;
        }
        this._previousPushAmount = { x: pushX, y: pushY };
        return {
            x: start.x + pushX,
            y: start.y + pushY,
        };
    }
    /**
     * Applies a computed position to the overlay and emits a position change.
     * @param position The position preference
     * @param originPoint The point on the origin element where the overlay is connected.
     */
    _applyPosition(position, originPoint) {
        this._setTransformOrigin(position);
        this._setOverlayElementStyles(originPoint, position);
        this._setBoundingBoxStyles(originPoint, position);
        if (position.panelClass) {
            this._addPanelClasses(position.panelClass);
        }
        // Save the last connected position in case the position needs to be re-calculated.
        this._lastPosition = position;
        // Notify that the position has been changed along with its change properties.
        // We only emit if we've got any subscriptions, because the scroll visibility
        // calculcations can be somewhat expensive.
        if (this._positionChanges.observers.length) {
            const scrollableViewProperties = this._getScrollVisibility();
            const changeEvent = new ConnectedOverlayPositionChange(position, scrollableViewProperties);
            this._positionChanges.next(changeEvent);
        }
        this._isInitialRender = false;
    }
    /** Sets the transform origin based on the configured selector and the passed-in position.  */
    _setTransformOrigin(position) {
        if (!this._transformOriginSelector) {
            return;
        }
        const elements = this._boundingBox.querySelectorAll(this._transformOriginSelector);
        let xOrigin;
        let yOrigin = position.overlayY;
        if (position.overlayX === 'center') {
            xOrigin = 'center';
        }
        else if (this._isRtl()) {
            xOrigin = position.overlayX === 'start' ? 'right' : 'left';
        }
        else {
            xOrigin = position.overlayX === 'start' ? 'left' : 'right';
        }
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.transformOrigin = `${xOrigin} ${yOrigin}`;
        }
    }
    /**
     * Gets the position and size of the overlay's sizing container.
     *
     * This method does no measuring and applies no styles so that we can cheaply compute the
     * bounds for all positions and choose the best fit based on these results.
     */
    _calculateBoundingBoxRect(origin, position) {
        const viewport = this._viewportRect;
        const isRtl = this._isRtl();
        let height, top, bottom;
        if (position.overlayY === 'top') {
            // Overlay is opening "downward" and thus is bound by the bottom viewport edge.
            top = origin.y;
            height = viewport.height - top + this._viewportMargin;
        }
        else if (position.overlayY === 'bottom') {
            // Overlay is opening "upward" and thus is bound by the top viewport edge. We need to add
            // the viewport margin back in, because the viewport rect is narrowed down to remove the
            // margin, whereas the `origin` position is calculated based on its `ClientRect`.
            bottom = viewport.height - origin.y + this._viewportMargin * 2;
            height = viewport.height - bottom + this._viewportMargin;
        }
        else {
            // If neither top nor bottom, it means that the overlay is vertically centered on the
            // origin point. Note that we want the position relative to the viewport, rather than
            // the page, which is why we don't use something like `viewport.bottom - origin.y` and
            // `origin.y - viewport.top`.
            const smallestDistanceToViewportEdge = Math.min(viewport.bottom - origin.y + viewport.top, origin.y);
            const previousHeight = this._lastBoundingBoxSize.height;
            height = smallestDistanceToViewportEdge * 2;
            top = origin.y - smallestDistanceToViewportEdge;
            if (height > previousHeight && !this._isInitialRender && !this._growAfterOpen) {
                top = origin.y - previousHeight / 2;
            }
        }
        // The overlay is opening 'right-ward' (the content flows to the right).
        const isBoundedByRightViewportEdge = (position.overlayX === 'start' && !isRtl) || (position.overlayX === 'end' && isRtl);
        // The overlay is opening 'left-ward' (the content flows to the left).
        const isBoundedByLeftViewportEdge = (position.overlayX === 'end' && !isRtl) || (position.overlayX === 'start' && isRtl);
        let width, left, right;
        if (isBoundedByLeftViewportEdge) {
            right = viewport.width - origin.x + this._viewportMargin;
            width = origin.x - this._viewportMargin;
        }
        else if (isBoundedByRightViewportEdge) {
            left = origin.x;
            width = viewport.right - origin.x;
        }
        else {
            // If neither start nor end, it means that the overlay is horizontally centered on the
            // origin point. Note that we want the position relative to the viewport, rather than
            // the page, which is why we don't use something like `viewport.right - origin.x` and
            // `origin.x - viewport.left`.
            const smallestDistanceToViewportEdge = Math.min(viewport.right - origin.x + viewport.left, origin.x);
            const previousWidth = this._lastBoundingBoxSize.width;
            width = smallestDistanceToViewportEdge * 2;
            left = origin.x - smallestDistanceToViewportEdge;
            if (width > previousWidth && !this._isInitialRender && !this._growAfterOpen) {
                left = origin.x - previousWidth / 2;
            }
        }
        return { top: top, left: left, bottom: bottom, right: right, width, height };
    }
    /**
     * Sets the position and size of the overlay's sizing wrapper. The wrapper is positioned on the
     * origin's connection point and stetches to the bounds of the viewport.
     *
     * @param origin The point on the origin element where the overlay is connected.
     * @param position The position preference
     */
    _setBoundingBoxStyles(origin, position) {
        const boundingBoxRect = this._calculateBoundingBoxRect(origin, position);
        // It's weird if the overlay *grows* while scrolling, so we take the last size into account
        // when applying a new size.
        if (!this._isInitialRender && !this._growAfterOpen) {
            boundingBoxRect.height = Math.min(boundingBoxRect.height, this._lastBoundingBoxSize.height);
            boundingBoxRect.width = Math.min(boundingBoxRect.width, this._lastBoundingBoxSize.width);
        }
        const styles = {};
        if (this._hasExactPosition()) {
            styles.top = styles.left = '0';
            styles.bottom = styles.right = styles.maxHeight = styles.maxWidth = '';
            styles.width = styles.height = '100%';
        }
        else {
            const maxHeight = this._overlayRef.getConfig().maxHeight;
            const maxWidth = this._overlayRef.getConfig().maxWidth;
            styles.height = coerceCssPixelValue(boundingBoxRect.height);
            styles.top = coerceCssPixelValue(boundingBoxRect.top);
            styles.bottom = coerceCssPixelValue(boundingBoxRect.bottom);
            styles.width = coerceCssPixelValue(boundingBoxRect.width);
            styles.left = coerceCssPixelValue(boundingBoxRect.left);
            styles.right = coerceCssPixelValue(boundingBoxRect.right);
            // Push the pane content towards the proper direction.
            if (position.overlayX === 'center') {
                styles.alignItems = 'center';
            }
            else {
                styles.alignItems = position.overlayX === 'end' ? 'flex-end' : 'flex-start';
            }
            if (position.overlayY === 'center') {
                styles.justifyContent = 'center';
            }
            else {
                styles.justifyContent = position.overlayY === 'bottom' ? 'flex-end' : 'flex-start';
            }
            if (maxHeight) {
                styles.maxHeight = coerceCssPixelValue(maxHeight);
            }
            if (maxWidth) {
                styles.maxWidth = coerceCssPixelValue(maxWidth);
            }
        }
        this._lastBoundingBoxSize = boundingBoxRect;
        extendStyles(this._boundingBox.style, styles);
    }
    /** Resets the styles for the bounding box so that a new positioning can be computed. */
    _resetBoundingBoxStyles() {
        extendStyles(this._boundingBox.style, {
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            height: '',
            width: '',
            alignItems: '',
            justifyContent: '',
        });
    }
    /** Resets the styles for the overlay pane so that a new positioning can be computed. */
    _resetOverlayElementStyles() {
        extendStyles(this._pane.style, {
            top: '',
            left: '',
            bottom: '',
            right: '',
            position: '',
            transform: '',
        });
    }
    /** Sets positioning styles to the overlay element. */
    _setOverlayElementStyles(originPoint, position) {
        const styles = {};
        const hasExactPosition = this._hasExactPosition();
        const hasFlexibleDimensions = this._hasFlexibleDimensions;
        const config = this._overlayRef.getConfig();
        if (hasExactPosition) {
            const scrollPosition = this._viewportRuler.getViewportScrollPosition();
            extendStyles(styles, this._getExactOverlayY(position, originPoint, scrollPosition));
            extendStyles(styles, this._getExactOverlayX(position, originPoint, scrollPosition));
        }
        else {
            styles.position = 'static';
        }
        // Use a transform to apply the offsets. We do this because the `center` positions rely on
        // being in the normal flex flow and setting a `top` / `left` at all will completely throw
        // off the position. We also can't use margins, because they won't have an effect in some
        // cases where the element doesn't have anything to "push off of". Finally, this works
        // better both with flexible and non-flexible positioning.
        let transformString = '';
        let offsetX = this._getOffset(position, 'x');
        let offsetY = this._getOffset(position, 'y');
        if (offsetX) {
            transformString += `translateX(${offsetX}px) `;
        }
        if (offsetY) {
            transformString += `translateY(${offsetY}px)`;
        }
        styles.transform = transformString.trim();
        // If a maxWidth or maxHeight is specified on the overlay, we remove them. We do this because
        // we need these values to both be set to "100%" for the automatic flexible sizing to work.
        // The maxHeight and maxWidth are set on the boundingBox in order to enforce the constraint.
        // Note that this doesn't apply when we have an exact position, in which case we do want to
        // apply them because they'll be cleared from the bounding box.
        if (config.maxHeight) {
            if (hasExactPosition) {
                styles.maxHeight = coerceCssPixelValue(config.maxHeight);
            }
            else if (hasFlexibleDimensions) {
                styles.maxHeight = '';
            }
        }
        if (config.maxWidth) {
            if (hasExactPosition) {
                styles.maxWidth = coerceCssPixelValue(config.maxWidth);
            }
            else if (hasFlexibleDimensions) {
                styles.maxWidth = '';
            }
        }
        extendStyles(this._pane.style, styles);
    }
    /** Gets the exact top/bottom for the overlay when not using flexible sizing or when pushing. */
    _getExactOverlayY(position, originPoint, scrollPosition) {
        // Reset any existing styles. This is necessary in case the
        // preferred position has changed since the last `apply`.
        let styles = { top: '', bottom: '' };
        let overlayPoint = this._getOverlayPoint(originPoint, this._overlayRect, position);
        if (this._isPushed) {
            overlayPoint = this._pushOverlayOnScreen(overlayPoint, this._overlayRect, scrollPosition);
        }
        // We want to set either `top` or `bottom` based on whether the overlay wants to appear
        // above or below the origin and the direction in which the element will expand.
        if (position.overlayY === 'bottom') {
            // When using `bottom`, we adjust the y position such that it is the distance
            // from the bottom of the viewport rather than the top.
            const documentHeight = this._document.documentElement.clientHeight;
            styles.bottom = `${documentHeight - (overlayPoint.y + this._overlayRect.height)}px`;
        }
        else {
            styles.top = coerceCssPixelValue(overlayPoint.y);
        }
        return styles;
    }
    /** Gets the exact left/right for the overlay when not using flexible sizing or when pushing. */
    _getExactOverlayX(position, originPoint, scrollPosition) {
        // Reset any existing styles. This is necessary in case the preferred position has
        // changed since the last `apply`.
        let styles = { left: '', right: '' };
        let overlayPoint = this._getOverlayPoint(originPoint, this._overlayRect, position);
        if (this._isPushed) {
            overlayPoint = this._pushOverlayOnScreen(overlayPoint, this._overlayRect, scrollPosition);
        }
        // We want to set either `left` or `right` based on whether the overlay wants to appear "before"
        // or "after" the origin, which determines the direction in which the element will expand.
        // For the horizontal axis, the meaning of "before" and "after" change based on whether the
        // page is in RTL or LTR.
        let horizontalStyleProperty;
        if (this._isRtl()) {
            horizontalStyleProperty = position.overlayX === 'end' ? 'left' : 'right';
        }
        else {
            horizontalStyleProperty = position.overlayX === 'end' ? 'right' : 'left';
        }
        // When we're setting `right`, we adjust the x position such that it is the distance
        // from the right edge of the viewport rather than the left edge.
        if (horizontalStyleProperty === 'right') {
            const documentWidth = this._document.documentElement.clientWidth;
            styles.right = `${documentWidth - (overlayPoint.x + this._overlayRect.width)}px`;
        }
        else {
            styles.left = coerceCssPixelValue(overlayPoint.x);
        }
        return styles;
    }
    /**
     * Gets the view properties of the trigger and overlay, including whether they are clipped
     * or completely outside the view of any of the strategy's scrollables.
     */
    _getScrollVisibility() {
        // Note: needs fresh rects since the position could've changed.
        const originBounds = this._getOriginRect();
        const overlayBounds = this._pane.getBoundingClientRect();
        // TODO(jelbourn): instead of needing all of the client rects for these scrolling containers
        // every time, we should be able to use the scrollTop of the containers if the size of those
        // containers hasn't changed.
        const scrollContainerBounds = this._scrollables.map(scrollable => {
            return scrollable.getElementRef().nativeElement.getBoundingClientRect();
        });
        return {
            isOriginClipped: isElementClippedByScrolling(originBounds, scrollContainerBounds),
            isOriginOutsideView: isElementScrolledOutsideView(originBounds, scrollContainerBounds),
            isOverlayClipped: isElementClippedByScrolling(overlayBounds, scrollContainerBounds),
            isOverlayOutsideView: isElementScrolledOutsideView(overlayBounds, scrollContainerBounds),
        };
    }
    /** Subtracts the amount that an element is overflowing on an axis from its length. */
    _subtractOverflows(length, ...overflows) {
        return overflows.reduce((currentValue, currentOverflow) => {
            return currentValue - Math.max(currentOverflow, 0);
        }, length);
    }
    /** Narrows the given viewport rect by the current _viewportMargin. */
    _getNarrowedViewportRect() {
        // We recalculate the viewport rect here ourselves, rather than using the ViewportRuler,
        // because we want to use the `clientWidth` and `clientHeight` as the base. The difference
        // being that the client properties don't include the scrollbar, as opposed to `innerWidth`
        // and `innerHeight` that do. This is necessary, because the overlay container uses
        // 100% `width` and `height` which don't include the scrollbar either.
        const width = this._document.documentElement.clientWidth;
        const height = this._document.documentElement.clientHeight;
        const scrollPosition = this._viewportRuler.getViewportScrollPosition();
        return {
            top: scrollPosition.top + this._viewportMargin,
            left: scrollPosition.left + this._viewportMargin,
            right: scrollPosition.left + width - this._viewportMargin,
            bottom: scrollPosition.top + height - this._viewportMargin,
            width: width - 2 * this._viewportMargin,
            height: height - 2 * this._viewportMargin,
        };
    }
    /** Whether the we're dealing with an RTL context */
    _isRtl() {
        return this._overlayRef.getDirection() === 'rtl';
    }
    /** Determines whether the overlay uses exact or flexible positioning. */
    _hasExactPosition() {
        return !this._hasFlexibleDimensions || this._isPushed;
    }
    /** Retrieves the offset of a position along the x or y axis. */
    _getOffset(position, axis) {
        if (axis === 'x') {
            // We don't do something like `position['offset' + axis]` in
            // order to avoid breking minifiers that rename properties.
            return position.offsetX == null ? this._offsetX : position.offsetX;
        }
        return position.offsetY == null ? this._offsetY : position.offsetY;
    }
    /** Validates that the current position match the expected values. */
    _validatePositions() {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            if (!this._preferredPositions.length) {
                throw Error('FlexibleConnectedPositionStrategy: At least one position is required.');
            }
            // TODO(crisbeto): remove these once Angular's template type
            // checking is advanced enough to catch these cases.
            this._preferredPositions.forEach(pair => {
                validateHorizontalPosition('originX', pair.originX);
                validateVerticalPosition('originY', pair.originY);
                validateHorizontalPosition('overlayX', pair.overlayX);
                validateVerticalPosition('overlayY', pair.overlayY);
            });
        }
    }
    /** Adds a single CSS class or an array of classes on the overlay panel. */
    _addPanelClasses(cssClasses) {
        if (this._pane) {
            coerceArray(cssClasses).forEach(cssClass => {
                if (cssClass !== '' && this._appliedPanelClasses.indexOf(cssClass) === -1) {
                    this._appliedPanelClasses.push(cssClass);
                    this._pane.classList.add(cssClass);
                }
            });
        }
    }
    /** Clears the classes that the position strategy has applied from the overlay panel. */
    _clearPanelClasses() {
        if (this._pane) {
            this._appliedPanelClasses.forEach(cssClass => {
                this._pane.classList.remove(cssClass);
            });
            this._appliedPanelClasses = [];
        }
    }
    /** Returns the ClientRect of the current origin. */
    _getOriginRect() {
        const origin = this._origin;
        if (origin instanceof ElementRef) {
            return origin.nativeElement.getBoundingClientRect();
        }
        // Check for Element so SVG elements are also supported.
        if (origin instanceof Element) {
            return origin.getBoundingClientRect();
        }
        const width = origin.width || 0;
        const height = origin.height || 0;
        // If the origin is a point, return a client rect as if it was a 0x0 element at the point.
        return {
            top: origin.y,
            bottom: origin.y + height,
            left: origin.x,
            right: origin.x + width,
            height,
            width,
        };
    }
}
/** Shallow-extends a stylesheet object with another stylesheet object. */
function extendStyles(destination, source) {
    for (let key in source) {
        if (source.hasOwnProperty(key)) {
            destination[key] = source[key];
        }
    }
    return destination;
}
/**
 * Extracts the pixel value as a number from a value, if it's a number
 * or a CSS pixel string (e.g. `1337px`). Otherwise returns null.
 */
function getPixelValue(input) {
    if (typeof input !== 'number' && input != null) {
        const [value, units] = input.split(cssUnitPattern);
        return !units || units === 'px' ? parseFloat(value) : null;
    }
    return input || null;
}
/**
 * Gets a version of an element's bounding `ClientRect` where all the values are rounded down to
 * the nearest pixel. This allows us to account for the cases where there may be sub-pixel
 * deviations in the `ClientRect` returned by the browser (e.g. when zoomed in with a percentage
 * size, see #21350).
 */
function getRoundedBoundingClientRect(clientRect) {
    return {
        top: Math.floor(clientRect.top),
        right: Math.floor(clientRect.right),
        bottom: Math.floor(clientRect.bottom),
        left: Math.floor(clientRect.left),
        width: Math.floor(clientRect.width),
        height: Math.floor(clientRect.height),
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxleGlibGUtY29ubmVjdGVkLXBvc2l0aW9uLXN0cmF0ZWd5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay9vdmVybGF5L3Bvc2l0aW9uL2ZsZXhpYmxlLWNvbm5lY3RlZC1wb3NpdGlvbi1zdHJhdGVneS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFHSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXpDLE9BQU8sRUFDTCw4QkFBOEIsRUFHOUIsMEJBQTBCLEVBQzFCLHdCQUF3QixHQUN6QixNQUFNLHNCQUFzQixDQUFDO0FBQzlCLE9BQU8sRUFBYSxZQUFZLEVBQUUsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBRXZELE9BQU8sRUFBQyw0QkFBNEIsRUFBRSwyQkFBMkIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN4RixPQUFPLEVBQUMsbUJBQW1CLEVBQUUsV0FBVyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFJdkUscUZBQXFGO0FBQ3JGLDZGQUE2RjtBQUU3RixxREFBcUQ7QUFDckQsTUFBTSxnQkFBZ0IsR0FBRyw2Q0FBNkMsQ0FBQztBQUV2RSxxREFBcUQ7QUFDckQsTUFBTSxjQUFjLEdBQUcsZUFBZSxDQUFDO0FBY3ZDOzs7Ozs7R0FNRztBQUNILE1BQU0sT0FBTyxpQ0FBaUM7SUE2RjVDLFlBQ0UsV0FBb0QsRUFDNUMsY0FBNkIsRUFDN0IsU0FBbUIsRUFDbkIsU0FBbUIsRUFDbkIsaUJBQW1DO1FBSG5DLG1CQUFjLEdBQWQsY0FBYyxDQUFlO1FBQzdCLGNBQVMsR0FBVCxTQUFTLENBQVU7UUFDbkIsY0FBUyxHQUFULFNBQVMsQ0FBVTtRQUNuQixzQkFBaUIsR0FBakIsaUJBQWlCLENBQWtCO1FBM0Y3QywwRkFBMEY7UUFDbEYseUJBQW9CLEdBQUcsRUFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUMs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LE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7S0FDdEMsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtQb3NpdGlvblN0cmF0ZWd5fSBmcm9tICcuL3Bvc2l0aW9uLXN0cmF0ZWd5JztcbmltcG9ydCB7RWxlbWVudFJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1ZpZXdwb3J0UnVsZXIsIENka1Njcm9sbGFibGUsIFZpZXdwb3J0U2Nyb2xsUG9zaXRpb259IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHtcbiAgQ29ubmVjdGVkT3ZlcmxheVBvc2l0aW9uQ2hhbmdlLFxuICBDb25uZWN0aW9uUG9zaXRpb25QYWlyLFxuICBTY3JvbGxpbmdWaXNpYmlsaXR5LFxuICB2YWxpZGF0ZUhvcml6b250YWxQb3NpdGlvbixcbiAgdmFsaWRhdGVWZXJ0aWNhbFBvc2l0aW9uLFxufSBmcm9tICcuL2Nvbm5lY3RlZC1wb3NpdGlvbic7XG5pbXBvcnQge09ic2VydmFibGUsIFN1YnNjcmlwdGlvbiwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge092ZXJsYXlSZWZlcmVuY2V9IGZyb20gJy4uL292ZXJsYXktcmVmZXJlbmNlJztcbmltcG9ydCB7aXNFbGVtZW50U2Nyb2xsZWRPdXRzaWRlVmlldywgaXNFbGVtZW50Q2xpcHBlZEJ5U2Nyb2xsaW5nfSBmcm9tICcuL3Njcm9sbC1jbGlwJztcbmltcG9ydCB7Y29lcmNlQ3NzUGl4ZWxWYWx1ZSwgY29lcmNlQXJyYXl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1BsYXRmb3JtfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtPdmVybGF5Q29udGFpbmVyfSBmcm9tICcuLi9vdmVybGF5LWNvbnRhaW5lcic7XG5cbi8vIFRPRE86IHJlZmFjdG9yIGNsaXBwaW5nIGRldGVjdGlvbiBpbnRvIGEgc2VwYXJhdGUgdGhpbmcgKHBhcnQgb2Ygc2Nyb2xsaW5nIG1vZHVsZSlcbi8vIFRPRE86IGRvZXNuJ3QgaGFuZGxlIGJvdGggZmxleGlibGUgd2lkdGggYW5kIGhlaWdodCB3aGVuIGl0IGhhcyB0byBzY3JvbGwgYWxvbmcgYm90aCBheGlzLlxuXG4vKiogQ2xhc3MgdG8gYmUgYWRkZWQgdG8gdGhlIG92ZXJsYXkgYm91bmRpbmcgYm94LiAqL1xuY29uc3QgYm91bmRpbmdCb3hDbGFzcyA9ICdjZGstb3ZlcmxheS1jb25uZWN0ZWQtcG9zaXRpb24tYm91bmRpbmctYm94JztcblxuLyoqIFJlZ2V4IHVzZWQgdG8gc3BsaXQgYSBzdHJpbmcgb24gaXRzIENTUyB1bml0cy4gKi9cbmNvbnN0IGNzc1VuaXRQYXR0ZXJuID0gLyhbQS1aYS16JV0rKSQvO1xuXG4vKiogUG9zc2libGUgdmFsdWVzIHRoYXQgY2FuIGJlIHNldCBhcyB0aGUgb3JpZ2luIG9mIGEgRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5LiAqL1xuZXhwb3J0IHR5cGUgRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5T3JpZ2luID1cbiAgfCBFbGVtZW50UmVmXG4gIHwgRWxlbWVudFxuICB8IChQb2ludCAmIHtcbiAgICAgIHdpZHRoPzogbnVtYmVyO1xuICAgICAgaGVpZ2h0PzogbnVtYmVyO1xuICAgIH0pO1xuXG4vKiogRXF1aXZhbGVudCBvZiBgQ2xpZW50UmVjdGAgd2l0aG91dCBzb21lIG9mIHRoZSBwcm9wZXJ0aWVzIHdlIGRvbid0IGNhcmUgYWJvdXQuICovXG50eXBlIERpbWVuc2lvbnMgPSBPbWl0PENsaWVudFJlY3QsICd4JyB8ICd5JyB8ICd0b0pTT04nPjtcblxuLyoqXG4gKiBBIHN0cmF0ZWd5IGZvciBwb3NpdGlvbmluZyBvdmVybGF5cy4gVXNpbmcgdGhpcyBzdHJhdGVneSwgYW4gb3ZlcmxheSBpcyBnaXZlbiBhblxuICogaW1wbGljaXQgcG9zaXRpb24gcmVsYXRpdmUgc29tZSBvcmlnaW4gZWxlbWVudC4gVGhlIHJlbGF0aXZlIHBvc2l0aW9uIGlzIGRlZmluZWQgaW4gdGVybXMgb2ZcbiAqIGEgcG9pbnQgb24gdGhlIG9yaWdpbiBlbGVtZW50IHRoYXQgaXMgY29ubmVjdGVkIHRvIGEgcG9pbnQgb24gdGhlIG92ZXJsYXkgZWxlbWVudC4gRm9yIGV4YW1wbGUsXG4gKiBhIGJhc2ljIGRyb3Bkb3duIGlzIGNvbm5lY3RpbmcgdGhlIGJvdHRvbS1sZWZ0IGNvcm5lciBvZiB0aGUgb3JpZ2luIHRvIHRoZSB0b3AtbGVmdCBjb3JuZXJcbiAqIG9mIHRoZSBvdmVybGF5LlxuICovXG5leHBvcnQgY2xhc3MgRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5IGltcGxlbWVudHMgUG9zaXRpb25TdHJhdGVneSB7XG4gIC8qKiBUaGUgb3ZlcmxheSB0byB3aGljaCB0aGlzIHN0cmF0ZWd5IGlzIGF0dGFjaGVkLiAqL1xuICBwcml2YXRlIF9vdmVybGF5UmVmOiBPdmVybGF5UmVmZXJlbmNlO1xuXG4gIC8qKiBXaGV0aGVyIHdlJ3JlIHBlcmZvcm1pbmcgdGhlIHZlcnkgZmlyc3QgcG9zaXRpb25pbmcgb2YgdGhlIG92ZXJsYXkuICovXG4gIHByaXZhdGUgX2lzSW5pdGlhbFJlbmRlcjogYm9vbGVhbjtcblxuICAvKiogTGFzdCBzaXplIHVzZWQgZm9yIHRoZSBib3VuZGluZyBib3guIFVzZWQgdG8gYXZvaWQgcmVzaXppbmcgdGhlIG92ZXJsYXkgYWZ0ZXIgb3Blbi4gKi9cbiAgcHJpdmF0ZSBfbGFzdEJvdW5kaW5nQm94U2l6ZSA9IHt3aWR0aDogMCwgaGVpZ2h0OiAwfTtcblxuICAvKiogV2hldGhlciB0aGUgb3ZlcmxheSB3YXMgcHVzaGVkIGluIGEgcHJldmlvdXMgcG9zaXRpb25pbmcuICovXG4gIHByaXZhdGUgX2lzUHVzaGVkID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG92ZXJsYXkgY2FuIGJlIHB1c2hlZCBvbi1zY3JlZW4gb24gdGhlIGluaXRpYWwgb3Blbi4gKi9cbiAgcHJpdmF0ZSBfY2FuUHVzaCA9IHRydWU7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG92ZXJsYXkgY2FuIGdyb3cgdmlhIGZsZXhpYmxlIHdpZHRoL2hlaWdodCBhZnRlciB0aGUgaW5pdGlhbCBvcGVuLiAqL1xuICBwcml2YXRlIF9ncm93QWZ0ZXJPcGVuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG92ZXJsYXkncyB3aWR0aCBhbmQgaGVpZ2h0IGNhbiBiZSBjb25zdHJhaW5lZCB0byBmaXQgd2l0aGluIHRoZSB2aWV3cG9ydC4gKi9cbiAgcHJpdmF0ZSBfaGFzRmxleGlibGVEaW1lbnNpb25zID0gdHJ1ZTtcblxuICAvKiogV2hldGhlciB0aGUgb3ZlcmxheSBwb3NpdGlvbiBpcyBsb2NrZWQuICovXG4gIHByaXZhdGUgX3Bvc2l0aW9uTG9ja2VkID0gZmFsc2U7XG5cbiAgLyoqIENhY2hlZCBvcmlnaW4gZGltZW5zaW9ucyAqL1xuICBwcml2YXRlIF9vcmlnaW5SZWN0OiBEaW1lbnNpb25zO1xuXG4gIC8qKiBDYWNoZWQgb3ZlcmxheSBkaW1lbnNpb25zICovXG4gIHByaXZhdGUgX292ZXJsYXlSZWN0OiBEaW1lbnNpb25zO1xuXG4gIC8qKiBDYWNoZWQgdmlld3BvcnQgZGltZW5zaW9ucyAqL1xuICBwcml2YXRlIF92aWV3cG9ydFJlY3Q6IERpbWVuc2lvbnM7XG5cbiAgLyoqIENhY2hlZCBjb250YWluZXIgZGltZW5zaW9ucyAqL1xuICBwcml2YXRlIF9jb250YWluZXJSZWN0OiBEaW1lbnNpb25zO1xuXG4gIC8qKiBBbW91bnQgb2Ygc3BhY2UgdGhhdCBtdXN0IGJlIG1haW50YWluZWQgYmV0d2VlbiB0aGUgb3ZlcmxheSBhbmQgdGhlIGVkZ2Ugb2YgdGhlIHZpZXdwb3J0LiAqL1xuICBwcml2YXRlIF92aWV3cG9ydE1hcmdpbiA9IDA7XG5cbiAgLyoqIFRoZSBTY3JvbGxhYmxlIGNvbnRhaW5lcnMgdXNlZCB0byBjaGVjayBzY3JvbGxhYmxlIHZpZXcgcHJvcGVydGllcyBvbiBwb3NpdGlvbiBjaGFuZ2UuICovXG4gIHByaXZhdGUgX3Njcm9sbGFibGVzOiBDZGtTY3JvbGxhYmxlW10gPSBbXTtcblxuICAvKiogT3JkZXJlZCBsaXN0IG9mIHByZWZlcnJlZCBwb3NpdGlvbnMsIGZyb20gbW9zdCB0byBsZWFzdCBkZXNpcmFibGUuICovXG4gIF9wcmVmZXJyZWRQb3NpdGlvbnM6IENvbm5lY3Rpb25Qb3NpdGlvblBhaXJbXSA9IFtdO1xuXG4gIC8qKiBUaGUgb3JpZ2luIGVsZW1lbnQgYWdhaW5zdCB3aGljaCB0aGUgb3ZlcmxheSB3aWxsIGJlIHBvc2l0aW9uZWQuICovXG4gIHByaXZhdGUgX29yaWdpbjogRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5T3JpZ2luO1xuXG4gIC8qKiBUaGUgb3ZlcmxheSBwYW5lIGVsZW1lbnQuICovXG4gIHByaXZhdGUgX3BhbmU6IEhUTUxFbGVtZW50O1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzdHJhdGVneSBoYXMgYmVlbiBkaXNwb3NlZCBvZiBhbHJlYWR5LiAqL1xuICBwcml2YXRlIF9pc0Rpc3Bvc2VkOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBQYXJlbnQgZWxlbWVudCBmb3IgdGhlIG92ZXJsYXkgcGFuZWwgdXNlZCB0byBjb25zdHJhaW4gdGhlIG92ZXJsYXkgcGFuZWwncyBzaXplIHRvIGZpdFxuICAgKiB3aXRoaW4gdGhlIHZpZXdwb3J0LlxuICAgKi9cbiAgcHJpdmF0ZSBfYm91bmRpbmdCb3g6IEhUTUxFbGVtZW50IHwgbnVsbDtcblxuICAvKiogVGhlIGxhc3QgcG9zaXRpb24gdG8gaGF2ZSBiZWVuIGNhbGN1bGF0ZWQgYXMgdGhlIGJlc3QgZml0IHBvc2l0aW9uLiAqL1xuICBwcml2YXRlIF9sYXN0UG9zaXRpb246IENvbm5lY3RlZFBvc2l0aW9uIHwgbnVsbDtcblxuICAvKiogU3ViamVjdCB0aGF0IGVtaXRzIHdoZW5ldmVyIHRoZSBwb3NpdGlvbiBjaGFuZ2VzLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9wb3NpdGlvbkNoYW5nZXMgPSBuZXcgU3ViamVjdDxDb25uZWN0ZWRPdmVybGF5UG9zaXRpb25DaGFuZ2U+KCk7XG5cbiAgLyoqIFN1YnNjcmlwdGlvbiB0byB2aWV3cG9ydCBzaXplIGNoYW5nZXMuICovXG4gIHByaXZhdGUgX3Jlc2l6ZVN1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcblxuICAvKiogRGVmYXVsdCBvZmZzZXQgZm9yIHRoZSBvdmVybGF5IGFsb25nIHRoZSB4IGF4aXMuICovXG4gIHByaXZhdGUgX29mZnNldFggPSAwO1xuXG4gIC8qKiBEZWZhdWx0IG9mZnNldCBmb3IgdGhlIG92ZXJsYXkgYWxvbmcgdGhlIHkgYXhpcy4gKi9cbiAgcHJpdmF0ZSBfb2Zmc2V0WSA9IDA7XG5cbiAgLyoqIFNlbGVjdG9yIHRvIGJlIHVzZWQgd2hlbiBmaW5kaW5nIHRoZSBlbGVtZW50cyBvbiB3aGljaCB0byBzZXQgdGhlIHRyYW5zZm9ybSBvcmlnaW4uICovXG4gIHByaXZhdGUgX3RyYW5zZm9ybU9yaWdpblNlbGVjdG9yOiBzdHJpbmc7XG5cbiAgLyoqIEtlZXBzIHRyYWNrIG9mIHRoZSBDU1MgY2xhc3NlcyB0aGF0IHRoZSBwb3NpdGlvbiBzdHJhdGVneSBoYXMgYXBwbGllZCBvbiB0aGUgb3ZlcmxheSBwYW5lbC4gKi9cbiAgcHJpdmF0ZSBfYXBwbGllZFBhbmVsQ2xhc3Nlczogc3RyaW5nW10gPSBbXTtcblxuICAvKiogQW1vdW50IGJ5IHdoaWNoIHRoZSBvdmVybGF5IHdhcyBwdXNoZWQgaW4gZWFjaCBheGlzIGR1cmluZyB0aGUgbGFzdCB0aW1lIGl0IHdhcyBwb3NpdGlvbmVkLiAqL1xuICBwcml2YXRlIF9wcmV2aW91c1B1c2hBbW91bnQ6IHt4OiBudW1iZXI7IHk6IG51bWJlcn0gfCBudWxsO1xuXG4gIC8qKiBPYnNlcnZhYmxlIHNlcXVlbmNlIG9mIHBvc2l0aW9uIGNoYW5nZXMuICovXG4gIHBvc2l0aW9uQ2hhbmdlczogT2JzZXJ2YWJsZTxDb25uZWN0ZWRPdmVybGF5UG9zaXRpb25DaGFuZ2U+ID0gdGhpcy5fcG9zaXRpb25DaGFuZ2VzO1xuXG4gIC8qKiBPcmRlcmVkIGxpc3Qgb2YgcHJlZmVycmVkIHBvc2l0aW9ucywgZnJvbSBtb3N0IHRvIGxlYXN0IGRlc2lyYWJsZS4gKi9cbiAgZ2V0IHBvc2l0aW9ucygpOiBDb25uZWN0aW9uUG9zaXRpb25QYWlyW10ge1xuICAgIHJldHVybiB0aGlzLl9wcmVmZXJyZWRQb3NpdGlvbnM7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBjb25uZWN0ZWRUbzogRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5T3JpZ2luLFxuICAgIHByaXZhdGUgX3ZpZXdwb3J0UnVsZXI6IFZpZXdwb3J0UnVsZXIsXG4gICAgcHJpdmF0ZSBfZG9jdW1lbnQ6IERvY3VtZW50LFxuICAgIHByaXZhdGUgX3BsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICBwcml2YXRlIF9vdmVybGF5Q29udGFpbmVyOiBPdmVybGF5Q29udGFpbmVyLFxuICApIHtcbiAgICB0aGlzLnNldE9yaWdpbihjb25uZWN0ZWRUbyk7XG4gIH1cblxuICAvKiogQXR0YWNoZXMgdGhpcyBwb3NpdGlvbiBzdHJhdGVneSB0byBhbiBvdmVybGF5LiAqL1xuICBhdHRhY2gob3ZlcmxheVJlZjogT3ZlcmxheVJlZmVyZW5jZSk6IHZvaWQge1xuICAgIGlmIChcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYgJiZcbiAgICAgIG92ZXJsYXlSZWYgIT09IHRoaXMuX292ZXJsYXlSZWYgJiZcbiAgICAgICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpXG4gICAgKSB7XG4gICAgICB0aHJvdyBFcnJvcignVGhpcyBwb3NpdGlvbiBzdHJhdGVneSBpcyBhbHJlYWR5IGF0dGFjaGVkIHRvIGFuIG92ZXJsYXknKTtcbiAgICB9XG5cbiAgICB0aGlzLl92YWxpZGF0ZVBvc2l0aW9ucygpO1xuXG4gICAgb3ZlcmxheVJlZi5ob3N0RWxlbWVudC5jbGFzc0xpc3QuYWRkKGJvdW5kaW5nQm94Q2xhc3MpO1xuXG4gICAgdGhpcy5fb3ZlcmxheVJlZiA9IG92ZXJsYXlSZWY7XG4gICAgdGhpcy5fYm91bmRpbmdCb3ggPSBvdmVybGF5UmVmLmhvc3RFbGVtZW50O1xuICAgIHRoaXMuX3BhbmUgPSBvdmVybGF5UmVmLm92ZXJsYXlFbGVtZW50O1xuICAgIHRoaXMuX2lzRGlzcG9zZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9pc0luaXRpYWxSZW5kZXIgPSB0cnVlO1xuICAgIHRoaXMuX2xhc3RQb3NpdGlvbiA9IG51bGw7XG4gICAgdGhpcy5fcmVzaXplU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fcmVzaXplU3Vic2NyaXB0aW9uID0gdGhpcy5fdmlld3BvcnRSdWxlci5jaGFuZ2UoKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgLy8gV2hlbiB0aGUgd2luZG93IGlzIHJlc2l6ZWQsIHdlIHdhbnQgdG8gdHJpZ2dlciB0aGUgbmV4dCByZXBvc2l0aW9uIGFzIGlmIGl0XG4gICAgICAvLyB3YXMgYW4gaW5pdGlhbCByZW5kZXIsIGluIG9yZGVyIGZvciB0aGUgc3RyYXRlZ3kgdG8gcGljayBhIG5ldyBvcHRpbWFsIHBvc2l0aW9uLFxuICAgICAgLy8gb3RoZXJ3aXNlIHBvc2l0aW9uIGxvY2tpbmcgd2lsbCBjYXVzZSBpdCB0byBzdGF5IGF0IHRoZSBvbGQgb25lLlxuICAgICAgdGhpcy5faXNJbml0aWFsUmVuZGVyID0gdHJ1ZTtcbiAgICAgIHRoaXMuYXBwbHkoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBwb3NpdGlvbiBvZiB0aGUgb3ZlcmxheSBlbGVtZW50LCB1c2luZyB3aGljaGV2ZXIgcHJlZmVycmVkIHBvc2l0aW9uIHJlbGF0aXZlXG4gICAqIHRvIHRoZSBvcmlnaW4gYmVzdCBmaXRzIG9uLXNjcmVlbi5cbiAgICpcbiAgICogVGhlIHNlbGVjdGlvbiBvZiBhIHBvc2l0aW9uIGdvZXMgYXMgZm9sbG93czpcbiAgICogIC0gSWYgYW55IHBvc2l0aW9ucyBmaXQgY29tcGxldGVseSB3aXRoaW4gdGhlIHZpZXdwb3J0IGFzLWlzLFxuICAgKiAgICAgIGNob29zZSB0aGUgZmlyc3QgcG9zaXRpb24gdGhhdCBkb2VzIHNvLlxuICAgKiAgLSBJZiBmbGV4aWJsZSBkaW1lbnNpb25zIGFyZSBlbmFibGVkIGFuZCBhdCBsZWFzdCBvbmUgc2F0aWZpZXMgdGhlIGdpdmVuIG1pbmltdW0gd2lkdGgvaGVpZ2h0LFxuICAgKiAgICAgIGNob29zZSB0aGUgcG9zaXRpb24gd2l0aCB0aGUgZ3JlYXRlc3QgYXZhaWxhYmxlIHNpemUgbW9kaWZpZWQgYnkgdGhlIHBvc2l0aW9ucycgd2VpZ2h0LlxuICAgKiAgLSBJZiBwdXNoaW5nIGlzIGVuYWJsZWQsIHRha2UgdGhlIHBvc2l0aW9uIHRoYXQgd2VudCBvZmYtc2NyZWVuIHRoZSBsZWFzdCBhbmQgcHVzaCBpdFxuICAgKiAgICAgIG9uLXNjcmVlbi5cbiAgICogIC0gSWYgbm9uZSBvZiB0aGUgcHJldmlvdXMgY3JpdGVyaWEgd2VyZSBtZXQsIHVzZSB0aGUgcG9zaXRpb24gdGhhdCBnb2VzIG9mZi1zY3JlZW4gdGhlIGxlYXN0LlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBhcHBseSgpOiB2b2lkIHtcbiAgICAvLyBXZSBzaG91bGRuJ3QgZG8gYW55dGhpbmcgaWYgdGhlIHN0cmF0ZWd5IHdhcyBkaXNwb3NlZCBvciB3ZSdyZSBvbiB0aGUgc2VydmVyLlxuICAgIGlmICh0aGlzLl9pc0Rpc3Bvc2VkIHx8ICF0aGlzLl9wbGF0Zm9ybS5pc0Jyb3dzZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgcG9zaXRpb24gaGFzIGJlZW4gYXBwbGllZCBhbHJlYWR5IChlLmcuIHdoZW4gdGhlIG92ZXJsYXkgd2FzIG9wZW5lZCkgYW5kIHRoZVxuICAgIC8vIGNvbnN1bWVyIG9wdGVkIGludG8gbG9ja2luZyBpbiB0aGUgcG9zaXRpb24sIHJlLXVzZSB0aGUgb2xkIHBvc2l0aW9uLCBpbiBvcmRlciB0b1xuICAgIC8vIHByZXZlbnQgdGhlIG92ZXJsYXkgZnJvbSBqdW1waW5nIGFyb3VuZC5cbiAgICBpZiAoIXRoaXMuX2lzSW5pdGlhbFJlbmRlciAmJiB0aGlzLl9wb3NpdGlvbkxvY2tlZCAmJiB0aGlzLl9sYXN0UG9zaXRpb24pIHtcbiAgICAgIHRoaXMucmVhcHBseUxhc3RQb3NpdGlvbigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2NsZWFyUGFuZWxDbGFzc2VzKCk7XG4gICAgdGhpcy5fcmVzZXRPdmVybGF5RWxlbWVudFN0eWxlcygpO1xuICAgIHRoaXMuX3Jlc2V0Qm91bmRpbmdCb3hTdHlsZXMoKTtcblxuICAgIC8vIFdlIG5lZWQgdGhlIGJvdW5kaW5nIHJlY3RzIGZvciB0aGUgb3JpZ2luLCB0aGUgb3ZlcmxheSBhbmQgdGhlIGNvbnRhaW5lciB0byBkZXRlcm1pbmUgaG93IHRvIHBvc2l0aW9uXG4gICAgLy8gdGhlIG92ZXJsYXkgcmVsYXRpdmUgdG8gdGhlIG9yaWdpbi5cbiAgICAvLyBXZSB1c2UgdGhlIHZpZXdwb3J0IHJlY3QgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgYSBwb3NpdGlvbiB3b3VsZCBnbyBvZmYtc2NyZWVuLlxuICAgIHRoaXMuX3ZpZXdwb3J0UmVjdCA9IHRoaXMuX2dldE5hcnJvd2VkVmlld3BvcnRSZWN0KCk7XG4gICAgdGhpcy5fb3JpZ2luUmVjdCA9IHRoaXMuX2dldE9yaWdpblJlY3QoKTtcbiAgICB0aGlzLl9vdmVybGF5UmVjdCA9IHRoaXMuX3BhbmUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgdGhpcy5fY29udGFpbmVyUmVjdCA9IHRoaXMuX292ZXJsYXlDb250YWluZXIuZ2V0Q29udGFpbmVyRWxlbWVudCgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgY29uc3Qgb3JpZ2luUmVjdCA9IHRoaXMuX29yaWdpblJlY3Q7XG4gICAgY29uc3Qgb3ZlcmxheVJlY3QgPSB0aGlzLl9vdmVybGF5UmVjdDtcbiAgICBjb25zdCB2aWV3cG9ydFJlY3QgPSB0aGlzLl92aWV3cG9ydFJlY3Q7XG4gICAgY29uc3QgY29udGFpbmVyUmVjdCA9IHRoaXMuX2NvbnRhaW5lclJlY3Q7XG5cbiAgICAvLyBQb3NpdGlvbnMgd2hlcmUgdGhlIG92ZXJsYXkgd2lsbCBmaXQgd2l0aCBmbGV4aWJsZSBkaW1lbnNpb25zLlxuICAgIGNvbnN0IGZsZXhpYmxlRml0czogRmxleGlibGVGaXRbXSA9IFtdO1xuXG4gICAgLy8gRmFsbGJhY2sgaWYgbm9uZSBvZiB0aGUgcHJlZmVycmVkIHBvc2l0aW9ucyBmaXQgd2l0aGluIHRoZSB2aWV3cG9ydC5cbiAgICBsZXQgZmFsbGJhY2s6IEZhbGxiYWNrUG9zaXRpb24gfCB1bmRlZmluZWQ7XG5cbiAgICAvLyBHbyB0aHJvdWdoIGVhY2ggb2YgdGhlIHByZWZlcnJlZCBwb3NpdGlvbnMgbG9va2luZyBmb3IgYSBnb29kIGZpdC5cbiAgICAvLyBJZiBhIGdvb2QgZml0IGlzIGZvdW5kLCBpdCB3aWxsIGJlIGFwcGxpZWQgaW1tZWRpYXRlbHkuXG4gICAgZm9yIChsZXQgcG9zIG9mIHRoaXMuX3ByZWZlcnJlZFBvc2l0aW9ucykge1xuICAgICAgLy8gR2V0IHRoZSBleGFjdCAoeCwgeSkgY29vcmRpbmF0ZSBmb3IgdGhlIHBvaW50LW9mLW9yaWdpbiBvbiB0aGUgb3JpZ2luIGVsZW1lbnQuXG4gICAgICBsZXQgb3JpZ2luUG9pbnQgPSB0aGlzLl9nZXRPcmlnaW5Qb2ludChvcmlnaW5SZWN0LCBjb250YWluZXJSZWN0LCBwb3MpO1xuXG4gICAgICAvLyBGcm9tIHRoYXQgcG9pbnQtb2Ytb3JpZ2luLCBnZXQgdGhlIGV4YWN0ICh4LCB5KSBjb29yZGluYXRlIGZvciB0aGUgdG9wLWxlZnQgY29ybmVyIG9mIHRoZVxuICAgICAgLy8gb3ZlcmxheSBpbiB0aGlzIHBvc2l0aW9uLiBXZSB1c2UgdGhlIHRvcC1sZWZ0IGNvcm5lciBmb3IgY2FsY3VsYXRpb25zIGFuZCBsYXRlciB0cmFuc2xhdGVcbiAgICAgIC8vIHRoaXMgaW50byBhbiBhcHByb3ByaWF0ZSAodG9wLCBsZWZ0LCBib3R0b20sIHJpZ2h0KSBzdHlsZS5cbiAgICAgIGxldCBvdmVybGF5UG9pbnQgPSB0aGlzLl9nZXRPdmVybGF5UG9pbnQob3JpZ2luUG9pbnQsIG92ZXJsYXlSZWN0LCBwb3MpO1xuXG4gICAgICAvLyBDYWxjdWxhdGUgaG93IHdlbGwgdGhlIG92ZXJsYXkgd291bGQgZml0IGludG8gdGhlIHZpZXdwb3J0IHdpdGggdGhpcyBwb2ludC5cbiAgICAgIGxldCBvdmVybGF5Rml0ID0gdGhpcy5fZ2V0T3ZlcmxheUZpdChvdmVybGF5UG9pbnQsIG92ZXJsYXlSZWN0LCB2aWV3cG9ydFJlY3QsIHBvcyk7XG5cbiAgICAgIC8vIElmIHRoZSBvdmVybGF5LCB3aXRob3V0IGFueSBmdXJ0aGVyIHdvcmssIGZpdHMgaW50byB0aGUgdmlld3BvcnQsIHVzZSB0aGlzIHBvc2l0aW9uLlxuICAgICAgaWYgKG92ZXJsYXlGaXQuaXNDb21wbGV0ZWx5V2l0aGluVmlld3BvcnQpIHtcbiAgICAgICAgdGhpcy5faXNQdXNoZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fYXBwbHlQb3NpdGlvbihwb3MsIG9yaWdpblBvaW50KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiB0aGUgb3ZlcmxheSBoYXMgZmxleGlibGUgZGltZW5zaW9ucywgd2UgY2FuIHVzZSB0aGlzIHBvc2l0aW9uXG4gICAgICAvLyBzbyBsb25nIGFzIHRoZXJlJ3MgZW5vdWdoIHNwYWNlIGZvciB0aGUgbWluaW11bSBkaW1lbnNpb25zLlxuICAgICAgaWYgKHRoaXMuX2NhbkZpdFdpdGhGbGV4aWJsZURpbWVuc2lvbnMob3ZlcmxheUZpdCwgb3ZlcmxheVBvaW50LCB2aWV3cG9ydFJlY3QpKSB7XG4gICAgICAgIC8vIFNhdmUgcG9zaXRpb25zIHdoZXJlIHRoZSBvdmVybGF5IHdpbGwgZml0IHdpdGggZmxleGlibGUgZGltZW5zaW9ucy4gV2Ugd2lsbCB1c2UgdGhlc2VcbiAgICAgICAgLy8gaWYgbm9uZSBvZiB0aGUgcG9zaXRpb25zIGZpdCAqd2l0aG91dCogZmxleGlibGUgZGltZW5zaW9ucy5cbiAgICAgICAgZmxleGlibGVGaXRzLnB1c2goe1xuICAgICAgICAgIHBvc2l0aW9uOiBwb3MsXG4gICAgICAgICAgb3JpZ2luOiBvcmlnaW5Qb2ludCxcbiAgICAgICAgICBvdmVybGF5UmVjdCxcbiAgICAgICAgICBib3VuZGluZ0JveFJlY3Q6IHRoaXMuX2NhbGN1bGF0ZUJvdW5kaW5nQm94UmVjdChvcmlnaW5Qb2ludCwgcG9zKSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIHRoZSBjdXJyZW50IHByZWZlcnJlZCBwb3NpdGlvbiBkb2VzIG5vdCBmaXQgb24gdGhlIHNjcmVlbiwgcmVtZW1iZXIgdGhlIHBvc2l0aW9uXG4gICAgICAvLyBpZiBpdCBoYXMgbW9yZSB2aXNpYmxlIGFyZWEgb24tc2NyZWVuIHRoYW4gd2UndmUgc2VlbiBhbmQgbW92ZSBvbnRvIHRoZSBuZXh0IHByZWZlcnJlZFxuICAgICAgLy8gcG9zaXRpb24uXG4gICAgICBpZiAoIWZhbGxiYWNrIHx8IGZhbGxiYWNrLm92ZXJsYXlGaXQudmlzaWJsZUFyZWEgPCBvdmVybGF5Rml0LnZpc2libGVBcmVhKSB7XG4gICAgICAgIGZhbGxiYWNrID0ge292ZXJsYXlGaXQsIG92ZXJsYXlQb2ludCwgb3JpZ2luUG9pbnQsIHBvc2l0aW9uOiBwb3MsIG92ZXJsYXlSZWN0fTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiB0aGVyZSBhcmUgYW55IHBvc2l0aW9ucyB3aGVyZSB0aGUgb3ZlcmxheSB3b3VsZCBmaXQgd2l0aCBmbGV4aWJsZSBkaW1lbnNpb25zLCBjaG9vc2UgdGhlXG4gICAgLy8gb25lIHRoYXQgaGFzIHRoZSBncmVhdGVzdCBhcmVhIGF2YWlsYWJsZSBtb2RpZmllZCBieSB0aGUgcG9zaXRpb24ncyB3ZWlnaHRcbiAgICBpZiAoZmxleGlibGVGaXRzLmxlbmd0aCkge1xuICAgICAgbGV0IGJlc3RGaXQ6IEZsZXhpYmxlRml0IHwgbnVsbCA9IG51bGw7XG4gICAgICBsZXQgYmVzdFNjb3JlID0gLTE7XG4gICAgICBmb3IgKGNvbnN0IGZpdCBvZiBmbGV4aWJsZUZpdHMpIHtcbiAgICAgICAgY29uc3Qgc2NvcmUgPVxuICAgICAgICAgIGZpdC5ib3VuZGluZ0JveFJlY3Qud2lkdGggKiBmaXQuYm91bmRpbmdCb3hSZWN0LmhlaWdodCAqIChmaXQucG9zaXRpb24ud2VpZ2h0IHx8IDEpO1xuICAgICAgICBpZiAoc2NvcmUgPiBiZXN0U2NvcmUpIHtcbiAgICAgICAgICBiZXN0U2NvcmUgPSBzY29yZTtcbiAgICAgICAgICBiZXN0Rml0ID0gZml0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2lzUHVzaGVkID0gZmFsc2U7XG4gICAgICB0aGlzLl9hcHBseVBvc2l0aW9uKGJlc3RGaXQhLnBvc2l0aW9uLCBiZXN0Rml0IS5vcmlnaW4pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFdoZW4gbm9uZSBvZiB0aGUgcHJlZmVycmVkIHBvc2l0aW9ucyBmaXQgd2l0aGluIHRoZSB2aWV3cG9ydCwgdGFrZSB0aGUgcG9zaXRpb25cbiAgICAvLyB0aGF0IHdlbnQgb2ZmLXNjcmVlbiB0aGUgbGVhc3QgYW5kIGF0dGVtcHQgdG8gcHVzaCBpdCBvbi1zY3JlZW4uXG4gICAgaWYgKHRoaXMuX2NhblB1c2gpIHtcbiAgICAgIC8vIFRPRE8oamVsYm91cm4pOiBhZnRlciBwdXNoaW5nLCB0aGUgb3BlbmluZyBcImRpcmVjdGlvblwiIG9mIHRoZSBvdmVybGF5IG1pZ2h0IG5vdCBtYWtlIHNlbnNlLlxuICAgICAgdGhpcy5faXNQdXNoZWQgPSB0cnVlO1xuICAgICAgdGhpcy5fYXBwbHlQb3NpdGlvbihmYWxsYmFjayEucG9zaXRpb24sIGZhbGxiYWNrIS5vcmlnaW5Qb2ludCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQWxsIG9wdGlvbnMgZm9yIGdldHRpbmcgdGhlIG92ZXJsYXkgd2l0aGluIHRoZSB2aWV3cG9ydCBoYXZlIGJlZW4gZXhoYXVzdGVkLCBzbyBnbyB3aXRoIHRoZVxuICAgIC8vIHBvc2l0aW9uIHRoYXQgd2VudCBvZmYtc2NyZWVuIHRoZSBsZWFzdC5cbiAgICB0aGlzLl9hcHBseVBvc2l0aW9uKGZhbGxiYWNrIS5wb3NpdGlvbiwgZmFsbGJhY2shLm9yaWdpblBvaW50KTtcbiAgfVxuXG4gIGRldGFjaCgpOiB2b2lkIHtcbiAgICB0aGlzLl9jbGVhclBhbmVsQ2xhc3NlcygpO1xuICAgIHRoaXMuX2xhc3RQb3NpdGlvbiA9IG51bGw7XG4gICAgdGhpcy5fcHJldmlvdXNQdXNoQW1vdW50ID0gbnVsbDtcbiAgICB0aGlzLl9yZXNpemVTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIC8qKiBDbGVhbnVwIGFmdGVyIHRoZSBlbGVtZW50IGdldHMgZGVzdHJveWVkLiAqL1xuICBkaXNwb3NlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9pc0Rpc3Bvc2VkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gV2UgY2FuJ3QgdXNlIGBfcmVzZXRCb3VuZGluZ0JveFN0eWxlc2AgaGVyZSwgYmVjYXVzZSBpdCByZXNldHNcbiAgICAvLyBzb21lIHByb3BlcnRpZXMgdG8gemVybywgcmF0aGVyIHRoYW4gcmVtb3ZpbmcgdGhlbS5cbiAgICBpZiAodGhpcy5fYm91bmRpbmdCb3gpIHtcbiAgICAgIGV4dGVuZFN0eWxlcyh0aGlzLl9ib3VuZGluZ0JveC5zdHlsZSwge1xuICAgICAgICB0b3A6ICcnLFxuICAgICAgICBsZWZ0OiAnJyxcbiAgICAgICAgcmlnaHQ6ICcnLFxuICAgICAgICBib3R0b206ICcnLFxuICAgICAgICBoZWlnaHQ6ICcnLFxuICAgICAgICB3aWR0aDogJycsXG4gICAgICAgIGFsaWduSXRlbXM6ICcnLFxuICAgICAgICBqdXN0aWZ5Q29udGVudDogJycsXG4gICAgICB9IGFzIENTU1N0eWxlRGVjbGFyYXRpb24pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9wYW5lKSB7XG4gICAgICB0aGlzLl9yZXNldE92ZXJsYXlFbGVtZW50U3R5bGVzKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX292ZXJsYXlSZWYpIHtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYuaG9zdEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShib3VuZGluZ0JveENsYXNzKTtcbiAgICB9XG5cbiAgICB0aGlzLmRldGFjaCgpO1xuICAgIHRoaXMuX3Bvc2l0aW9uQ2hhbmdlcy5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX292ZXJsYXlSZWYgPSB0aGlzLl9ib3VuZGluZ0JveCA9IG51bGwhO1xuICAgIHRoaXMuX2lzRGlzcG9zZWQgPSB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgcmUtYWxpZ25zIHRoZSBvdmVybGF5IGVsZW1lbnQgd2l0aCB0aGUgdHJpZ2dlciBpbiBpdHMgbGFzdCBjYWxjdWxhdGVkIHBvc2l0aW9uLFxuICAgKiBldmVuIGlmIGEgcG9zaXRpb24gaGlnaGVyIGluIHRoZSBcInByZWZlcnJlZCBwb3NpdGlvbnNcIiBsaXN0IHdvdWxkIG5vdyBmaXQuIFRoaXNcbiAgICogYWxsb3dzIG9uZSB0byByZS1hbGlnbiB0aGUgcGFuZWwgd2l0aG91dCBjaGFuZ2luZyB0aGUgb3JpZW50YXRpb24gb2YgdGhlIHBhbmVsLlxuICAgKi9cbiAgcmVhcHBseUxhc3RQb3NpdGlvbigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5faXNEaXNwb3NlZCB8fCAhdGhpcy5fcGxhdGZvcm0uaXNCcm93c2VyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbGFzdFBvc2l0aW9uID0gdGhpcy5fbGFzdFBvc2l0aW9uO1xuXG4gICAgaWYgKGxhc3RQb3NpdGlvbikge1xuICAgICAgdGhpcy5fb3JpZ2luUmVjdCA9IHRoaXMuX2dldE9yaWdpblJlY3QoKTtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWN0ID0gdGhpcy5fcGFuZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIHRoaXMuX3ZpZXdwb3J0UmVjdCA9IHRoaXMuX2dldE5hcnJvd2VkVmlld3BvcnRSZWN0KCk7XG4gICAgICB0aGlzLl9jb250YWluZXJSZWN0ID0gdGhpcy5fb3ZlcmxheUNvbnRhaW5lci5nZXRDb250YWluZXJFbGVtZW50KCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgIGNvbnN0IG9yaWdpblBvaW50ID0gdGhpcy5fZ2V0T3JpZ2luUG9pbnQodGhpcy5fb3JpZ2luUmVjdCwgdGhpcy5fY29udGFpbmVyUmVjdCwgbGFzdFBvc2l0aW9uKTtcbiAgICAgIHRoaXMuX2FwcGx5UG9zaXRpb24obGFzdFBvc2l0aW9uLCBvcmlnaW5Qb2ludCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYXBwbHkoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgbGlzdCBvZiBTY3JvbGxhYmxlIGNvbnRhaW5lcnMgdGhhdCBob3N0IHRoZSBvcmlnaW4gZWxlbWVudCBzbyB0aGF0XG4gICAqIG9uIHJlcG9zaXRpb24gd2UgY2FuIGV2YWx1YXRlIGlmIGl0IG9yIHRoZSBvdmVybGF5IGhhcyBiZWVuIGNsaXBwZWQgb3Igb3V0c2lkZSB2aWV3LiBFdmVyeVxuICAgKiBTY3JvbGxhYmxlIG11c3QgYmUgYW4gYW5jZXN0b3IgZWxlbWVudCBvZiB0aGUgc3RyYXRlZ3kncyBvcmlnaW4gZWxlbWVudC5cbiAgICovXG4gIHdpdGhTY3JvbGxhYmxlQ29udGFpbmVycyhzY3JvbGxhYmxlczogQ2RrU2Nyb2xsYWJsZVtdKTogdGhpcyB7XG4gICAgdGhpcy5fc2Nyb2xsYWJsZXMgPSBzY3JvbGxhYmxlcztcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIG5ldyBwcmVmZXJyZWQgcG9zaXRpb25zLlxuICAgKiBAcGFyYW0gcG9zaXRpb25zIExpc3Qgb2YgcG9zaXRpb25zIG9wdGlvbnMgZm9yIHRoaXMgb3ZlcmxheS5cbiAgICovXG4gIHdpdGhQb3NpdGlvbnMocG9zaXRpb25zOiBDb25uZWN0ZWRQb3NpdGlvbltdKTogdGhpcyB7XG4gICAgdGhpcy5fcHJlZmVycmVkUG9zaXRpb25zID0gcG9zaXRpb25zO1xuXG4gICAgLy8gSWYgdGhlIGxhc3QgY2FsY3VsYXRlZCBwb3NpdGlvbiBvYmplY3QgaXNuJ3QgcGFydCBvZiB0aGUgcG9zaXRpb25zIGFueW1vcmUsIGNsZWFyXG4gICAgLy8gaXQgaW4gb3JkZXIgdG8gYXZvaWQgaXQgYmVpbmcgcGlja2VkIHVwIGlmIHRoZSBjb25zdW1lciB0cmllcyB0byByZS1hcHBseS5cbiAgICBpZiAocG9zaXRpb25zLmluZGV4T2YodGhpcy5fbGFzdFBvc2l0aW9uISkgPT09IC0xKSB7XG4gICAgICB0aGlzLl9sYXN0UG9zaXRpb24gPSBudWxsO1xuICAgIH1cblxuICAgIHRoaXMuX3ZhbGlkYXRlUG9zaXRpb25zKCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGEgbWluaW11bSBkaXN0YW5jZSB0aGUgb3ZlcmxheSBtYXkgYmUgcG9zaXRpb25lZCB0byB0aGUgZWRnZSBvZiB0aGUgdmlld3BvcnQuXG4gICAqIEBwYXJhbSBtYXJnaW4gUmVxdWlyZWQgbWFyZ2luIGJldHdlZW4gdGhlIG92ZXJsYXkgYW5kIHRoZSB2aWV3cG9ydCBlZGdlIGluIHBpeGVscy5cbiAgICovXG4gIHdpdGhWaWV3cG9ydE1hcmdpbihtYXJnaW46IG51bWJlcik6IHRoaXMge1xuICAgIHRoaXMuX3ZpZXdwb3J0TWFyZ2luID0gbWFyZ2luO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqIFNldHMgd2hldGhlciB0aGUgb3ZlcmxheSdzIHdpZHRoIGFuZCBoZWlnaHQgY2FuIGJlIGNvbnN0cmFpbmVkIHRvIGZpdCB3aXRoaW4gdGhlIHZpZXdwb3J0LiAqL1xuICB3aXRoRmxleGlibGVEaW1lbnNpb25zKGZsZXhpYmxlRGltZW5zaW9ucyA9IHRydWUpOiB0aGlzIHtcbiAgICB0aGlzLl9oYXNGbGV4aWJsZURpbWVuc2lvbnMgPSBmbGV4aWJsZURpbWVuc2lvbnM7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogU2V0cyB3aGV0aGVyIHRoZSBvdmVybGF5IGNhbiBncm93IGFmdGVyIHRoZSBpbml0aWFsIG9wZW4gdmlhIGZsZXhpYmxlIHdpZHRoL2hlaWdodC4gKi9cbiAgd2l0aEdyb3dBZnRlck9wZW4oZ3Jvd0FmdGVyT3BlbiA9IHRydWUpOiB0aGlzIHtcbiAgICB0aGlzLl9ncm93QWZ0ZXJPcGVuID0gZ3Jvd0FmdGVyT3BlbjtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBTZXRzIHdoZXRoZXIgdGhlIG92ZXJsYXkgY2FuIGJlIHB1c2hlZCBvbi1zY3JlZW4gaWYgbm9uZSBvZiB0aGUgcHJvdmlkZWQgcG9zaXRpb25zIGZpdC4gKi9cbiAgd2l0aFB1c2goY2FuUHVzaCA9IHRydWUpOiB0aGlzIHtcbiAgICB0aGlzLl9jYW5QdXNoID0gY2FuUHVzaDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHdoZXRoZXIgdGhlIG92ZXJsYXkncyBwb3NpdGlvbiBzaG91bGQgYmUgbG9ja2VkIGluIGFmdGVyIGl0IGlzIHBvc2l0aW9uZWRcbiAgICogaW5pdGlhbGx5LiBXaGVuIGFuIG92ZXJsYXkgaXMgbG9ja2VkIGluLCBpdCB3b24ndCBhdHRlbXB0IHRvIHJlcG9zaXRpb24gaXRzZWxmXG4gICAqIHdoZW4gdGhlIHBvc2l0aW9uIGlzIHJlLWFwcGxpZWQgKGUuZy4gd2hlbiB0aGUgdXNlciBzY3JvbGxzIGF3YXkpLlxuICAgKiBAcGFyYW0gaXNMb2NrZWQgV2hldGhlciB0aGUgb3ZlcmxheSBzaG91bGQgbG9ja2VkIGluLlxuICAgKi9cbiAgd2l0aExvY2tlZFBvc2l0aW9uKGlzTG9ja2VkID0gdHJ1ZSk6IHRoaXMge1xuICAgIHRoaXMuX3Bvc2l0aW9uTG9ja2VkID0gaXNMb2NrZWQ7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgb3JpZ2luLCByZWxhdGl2ZSB0byB3aGljaCB0byBwb3NpdGlvbiB0aGUgb3ZlcmxheS5cbiAgICogVXNpbmcgYW4gZWxlbWVudCBvcmlnaW4gaXMgdXNlZnVsIGZvciBidWlsZGluZyBjb21wb25lbnRzIHRoYXQgbmVlZCB0byBiZSBwb3NpdGlvbmVkXG4gICAqIHJlbGF0aXZlbHkgdG8gYSB0cmlnZ2VyIChlLmcuIGRyb3Bkb3duIG1lbnVzIG9yIHRvb2x0aXBzKSwgd2hlcmVhcyB1c2luZyBhIHBvaW50IGNhbiBiZVxuICAgKiB1c2VkIGZvciBjYXNlcyBsaWtlIGNvbnRleHR1YWwgbWVudXMgd2hpY2ggb3BlbiByZWxhdGl2ZSB0byB0aGUgdXNlcidzIHBvaW50ZXIuXG4gICAqIEBwYXJhbSBvcmlnaW4gUmVmZXJlbmNlIHRvIHRoZSBuZXcgb3JpZ2luLlxuICAgKi9cbiAgc2V0T3JpZ2luKG9yaWdpbjogRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5T3JpZ2luKTogdGhpcyB7XG4gICAgdGhpcy5fb3JpZ2luID0gb3JpZ2luO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGRlZmF1bHQgb2Zmc2V0IGZvciB0aGUgb3ZlcmxheSdzIGNvbm5lY3Rpb24gcG9pbnQgb24gdGhlIHgtYXhpcy5cbiAgICogQHBhcmFtIG9mZnNldCBOZXcgb2Zmc2V0IGluIHRoZSBYIGF4aXMuXG4gICAqL1xuICB3aXRoRGVmYXVsdE9mZnNldFgob2Zmc2V0OiBudW1iZXIpOiB0aGlzIHtcbiAgICB0aGlzLl9vZmZzZXRYID0gb2Zmc2V0O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGRlZmF1bHQgb2Zmc2V0IGZvciB0aGUgb3ZlcmxheSdzIGNvbm5lY3Rpb24gcG9pbnQgb24gdGhlIHktYXhpcy5cbiAgICogQHBhcmFtIG9mZnNldCBOZXcgb2Zmc2V0IGluIHRoZSBZIGF4aXMuXG4gICAqL1xuICB3aXRoRGVmYXVsdE9mZnNldFkob2Zmc2V0OiBudW1iZXIpOiB0aGlzIHtcbiAgICB0aGlzLl9vZmZzZXRZID0gb2Zmc2V0O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZXMgdGhhdCB0aGUgcG9zaXRpb24gc3RyYXRlZ3kgc2hvdWxkIHNldCBhIGB0cmFuc2Zvcm0tb3JpZ2luYCBvbiBzb21lIGVsZW1lbnRzXG4gICAqIGluc2lkZSB0aGUgb3ZlcmxheSwgZGVwZW5kaW5nIG9uIHRoZSBjdXJyZW50IHBvc2l0aW9uIHRoYXQgaXMgYmVpbmcgYXBwbGllZC4gVGhpcyBpc1xuICAgKiB1c2VmdWwgZm9yIHRoZSBjYXNlcyB3aGVyZSB0aGUgb3JpZ2luIG9mIGFuIGFuaW1hdGlvbiBjYW4gY2hhbmdlIGRlcGVuZGluZyBvbiB0aGVcbiAgICogYWxpZ25tZW50IG9mIHRoZSBvdmVybGF5LlxuICAgKiBAcGFyYW0gc2VsZWN0b3IgQ1NTIHNlbGVjdG9yIHRoYXQgd2lsbCBiZSB1c2VkIHRvIGZpbmQgdGhlIHRhcmdldFxuICAgKiAgICBlbGVtZW50cyBvbnRvIHdoaWNoIHRvIHNldCB0aGUgdHJhbnNmb3JtIG9yaWdpbi5cbiAgICovXG4gIHdpdGhUcmFuc2Zvcm1PcmlnaW5PbihzZWxlY3Rvcjogc3RyaW5nKTogdGhpcyB7XG4gICAgdGhpcy5fdHJhbnNmb3JtT3JpZ2luU2VsZWN0b3IgPSBzZWxlY3RvcjtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSAoeCwgeSkgY29vcmRpbmF0ZSBvZiBhIGNvbm5lY3Rpb24gcG9pbnQgb24gdGhlIG9yaWdpbiBiYXNlZCBvbiBhIHJlbGF0aXZlIHBvc2l0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0T3JpZ2luUG9pbnQoXG4gICAgb3JpZ2luUmVjdDogRGltZW5zaW9ucyxcbiAgICBjb250YWluZXJSZWN0OiBEaW1lbnNpb25zLFxuICAgIHBvczogQ29ubmVjdGVkUG9zaXRpb24sXG4gICk6IFBvaW50IHtcbiAgICBsZXQgeDogbnVtYmVyO1xuICAgIGlmIChwb3Mub3JpZ2luWCA9PSAnY2VudGVyJykge1xuICAgICAgLy8gTm90ZTogd2hlbiBjZW50ZXJpbmcgd2Ugc2hvdWxkIGFsd2F5cyB1c2UgdGhlIGBsZWZ0YFxuICAgICAgLy8gb2Zmc2V0LCBvdGhlcndpc2UgdGhlIHBvc2l0aW9uIHdpbGwgYmUgd3JvbmcgaW4gUlRMLlxuICAgICAgeCA9IG9yaWdpblJlY3QubGVmdCArIG9yaWdpblJlY3Qud2lkdGggLyAyO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBzdGFydFggPSB0aGlzLl9pc1J0bCgpID8gb3JpZ2luUmVjdC5yaWdodCA6IG9yaWdpblJlY3QubGVmdDtcbiAgICAgIGNvbnN0IGVuZFggPSB0aGlzLl9pc1J0bCgpID8gb3JpZ2luUmVjdC5sZWZ0IDogb3JpZ2luUmVjdC5yaWdodDtcbiAgICAgIHggPSBwb3Mub3JpZ2luWCA9PSAnc3RhcnQnID8gc3RhcnRYIDogZW5kWDtcbiAgICB9XG5cbiAgICAvLyBXaGVuIHpvb21pbmcgaW4gU2FmYXJpIHRoZSBjb250YWluZXIgcmVjdGFuZ2xlIGNvbnRhaW5zIG5lZ2F0aXZlIHZhbHVlcyBmb3IgdGhlIHBvc2l0aW9uXG4gICAgLy8gYW5kIHdlIG5lZWQgdG8gcmUtYWRkIHRoZW0gdG8gdGhlIGNhbGN1bGF0ZWQgY29vcmRpbmF0ZXMuXG4gICAgaWYgKGNvbnRhaW5lclJlY3QubGVmdCA8IDApIHtcbiAgICAgIHggLT0gY29udGFpbmVyUmVjdC5sZWZ0O1xuICAgIH1cblxuICAgIGxldCB5OiBudW1iZXI7XG4gICAgaWYgKHBvcy5vcmlnaW5ZID09ICdjZW50ZXInKSB7XG4gICAgICB5ID0gb3JpZ2luUmVjdC50b3AgKyBvcmlnaW5SZWN0LmhlaWdodCAvIDI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHkgPSBwb3Mub3JpZ2luWSA9PSAndG9wJyA/IG9yaWdpblJlY3QudG9wIDogb3JpZ2luUmVjdC5ib3R0b207XG4gICAgfVxuXG4gICAgLy8gTm9ybWFsbHkgdGhlIGNvbnRhaW5lclJlY3QncyB0b3AgdmFsdWUgd291bGQgYmUgemVybywgaG93ZXZlciB3aGVuIHRoZSBvdmVybGF5IGlzIGF0dGFjaGVkIHRvIGFuIGlucHV0XG4gICAgLy8gKGUuZy4gaW4gYW4gYXV0b2NvbXBsZXRlKSwgbW9iaWxlIGJyb3dzZXJzIHdpbGwgc2hpZnQgZXZlcnl0aGluZyBpbiBvcmRlciB0byBwdXQgdGhlIGlucHV0IGluIHRoZSBtaWRkbGVcbiAgICAvLyBvZiB0aGUgc2NyZWVuIGFuZCB0byBtYWtlIHNwYWNlIGZvciB0aGUgdmlydHVhbCBrZXlib2FyZC4gV2UgbmVlZCB0byBhY2NvdW50IGZvciB0aGlzIG9mZnNldCxcbiAgICAvLyBvdGhlcndpc2Ugb3VyIHBvc2l0aW9uaW5nIHdpbGwgYmUgdGhyb3duIG9mZi5cbiAgICAvLyBBZGRpdGlvbmFsbHksIHdoZW4gem9vbWluZyBpbiBTYWZhcmkgdGhpcyBmaXhlcyB0aGUgdmVydGljYWwgcG9zaXRpb24uXG4gICAgaWYgKGNvbnRhaW5lclJlY3QudG9wIDwgMCkge1xuICAgICAgeSAtPSBjb250YWluZXJSZWN0LnRvcDtcbiAgICB9XG5cbiAgICByZXR1cm4ge3gsIHl9O1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlICh4LCB5KSBjb29yZGluYXRlIG9mIHRoZSB0b3AtbGVmdCBjb3JuZXIgb2YgdGhlIG92ZXJsYXkgZ2l2ZW4gYSBnaXZlbiBwb3NpdGlvbiBhbmRcbiAgICogb3JpZ2luIHBvaW50IHRvIHdoaWNoIHRoZSBvdmVybGF5IHNob3VsZCBiZSBjb25uZWN0ZWQuXG4gICAqL1xuICBwcml2YXRlIF9nZXRPdmVybGF5UG9pbnQoXG4gICAgb3JpZ2luUG9pbnQ6IFBvaW50LFxuICAgIG92ZXJsYXlSZWN0OiBEaW1lbnNpb25zLFxuICAgIHBvczogQ29ubmVjdGVkUG9zaXRpb24sXG4gICk6IFBvaW50IHtcbiAgICAvLyBDYWxjdWxhdGUgdGhlIChvdmVybGF5U3RhcnRYLCBvdmVybGF5U3RhcnRZKSwgdGhlIHN0YXJ0IG9mIHRoZVxuICAgIC8vIHBvdGVudGlhbCBvdmVybGF5IHBvc2l0aW9uIHJlbGF0aXZlIHRvIHRoZSBvcmlnaW4gcG9pbnQuXG4gICAgbGV0IG92ZXJsYXlTdGFydFg6IG51bWJlcjtcbiAgICBpZiAocG9zLm92ZXJsYXlYID09ICdjZW50ZXInKSB7XG4gICAgICBvdmVybGF5U3RhcnRYID0gLW92ZXJsYXlSZWN0LndpZHRoIC8gMjtcbiAgICB9IGVsc2UgaWYgKHBvcy5vdmVybGF5WCA9PT0gJ3N0YXJ0Jykge1xuICAgICAgb3ZlcmxheVN0YXJ0WCA9IHRoaXMuX2lzUnRsKCkgPyAtb3ZlcmxheVJlY3Qud2lkdGggOiAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdmVybGF5U3RhcnRYID0gdGhpcy5faXNSdGwoKSA/IDAgOiAtb3ZlcmxheVJlY3Qud2lkdGg7XG4gICAgfVxuXG4gICAgbGV0IG92ZXJsYXlTdGFydFk6IG51bWJlcjtcbiAgICBpZiAocG9zLm92ZXJsYXlZID09ICdjZW50ZXInKSB7XG4gICAgICBvdmVybGF5U3RhcnRZID0gLW92ZXJsYXlSZWN0LmhlaWdodCAvIDI7XG4gICAgfSBlbHNlIHtcbiAgICAgIG92ZXJsYXlTdGFydFkgPSBwb3Mub3ZlcmxheVkgPT0gJ3RvcCcgPyAwIDogLW92ZXJsYXlSZWN0LmhlaWdodDtcbiAgICB9XG5cbiAgICAvLyBUaGUgKHgsIHkpIGNvb3JkaW5hdGVzIG9mIHRoZSBvdmVybGF5LlxuICAgIHJldHVybiB7XG4gICAgICB4OiBvcmlnaW5Qb2ludC54ICsgb3ZlcmxheVN0YXJ0WCxcbiAgICAgIHk6IG9yaWdpblBvaW50LnkgKyBvdmVybGF5U3RhcnRZLFxuICAgIH07XG4gIH1cblxuICAvKiogR2V0cyBob3cgd2VsbCBhbiBvdmVybGF5IGF0IHRoZSBnaXZlbiBwb2ludCB3aWxsIGZpdCB3aXRoaW4gdGhlIHZpZXdwb3J0LiAqL1xuICBwcml2YXRlIF9nZXRPdmVybGF5Rml0KFxuICAgIHBvaW50OiBQb2ludCxcbiAgICByYXdPdmVybGF5UmVjdDogRGltZW5zaW9ucyxcbiAgICB2aWV3cG9ydDogRGltZW5zaW9ucyxcbiAgICBwb3NpdGlvbjogQ29ubmVjdGVkUG9zaXRpb24sXG4gICk6IE92ZXJsYXlGaXQge1xuICAgIC8vIFJvdW5kIHRoZSBvdmVybGF5IHJlY3Qgd2hlbiBjb21wYXJpbmcgYWdhaW5zdCB0aGVcbiAgICAvLyB2aWV3cG9ydCwgYmVjYXVzZSB0aGUgdmlld3BvcnQgaXMgYWx3YXlzIHJvdW5kZWQuXG4gICAgY29uc3Qgb3ZlcmxheSA9IGdldFJvdW5kZWRCb3VuZGluZ0NsaWVudFJlY3QocmF3T3ZlcmxheVJlY3QpO1xuICAgIGxldCB7eCwgeX0gPSBwb2ludDtcbiAgICBsZXQgb2Zmc2V0WCA9IHRoaXMuX2dldE9mZnNldChwb3NpdGlvbiwgJ3gnKTtcbiAgICBsZXQgb2Zmc2V0WSA9IHRoaXMuX2dldE9mZnNldChwb3NpdGlvbiwgJ3knKTtcblxuICAgIC8vIEFjY291bnQgZm9yIHRoZSBvZmZzZXRzIHNpbmNlIHRoZXkgY291bGQgcHVzaCB0aGUgb3ZlcmxheSBvdXQgb2YgdGhlIHZpZXdwb3J0LlxuICAgIGlmIChvZmZzZXRYKSB7XG4gICAgICB4ICs9IG9mZnNldFg7XG4gICAgfVxuXG4gICAgaWYgKG9mZnNldFkpIHtcbiAgICAgIHkgKz0gb2Zmc2V0WTtcbiAgICB9XG5cbiAgICAvLyBIb3cgbXVjaCB0aGUgb3ZlcmxheSB3b3VsZCBvdmVyZmxvdyBhdCB0aGlzIHBvc2l0aW9uLCBvbiBlYWNoIHNpZGUuXG4gICAgbGV0IGxlZnRPdmVyZmxvdyA9IDAgLSB4O1xuICAgIGxldCByaWdodE92ZXJmbG93ID0geCArIG92ZXJsYXkud2lkdGggLSB2aWV3cG9ydC53aWR0aDtcbiAgICBsZXQgdG9wT3ZlcmZsb3cgPSAwIC0geTtcbiAgICBsZXQgYm90dG9tT3ZlcmZsb3cgPSB5ICsgb3ZlcmxheS5oZWlnaHQgLSB2aWV3cG9ydC5oZWlnaHQ7XG5cbiAgICAvLyBWaXNpYmxlIHBhcnRzIG9mIHRoZSBlbGVtZW50IG9uIGVhY2ggYXhpcy5cbiAgICBsZXQgdmlzaWJsZVdpZHRoID0gdGhpcy5fc3VidHJhY3RPdmVyZmxvd3Mob3ZlcmxheS53aWR0aCwgbGVmdE92ZXJmbG93LCByaWdodE92ZXJmbG93KTtcbiAgICBsZXQgdmlzaWJsZUhlaWdodCA9IHRoaXMuX3N1YnRyYWN0T3ZlcmZsb3dzKG92ZXJsYXkuaGVpZ2h0LCB0b3BPdmVyZmxvdywgYm90dG9tT3ZlcmZsb3cpO1xuICAgIGxldCB2aXNpYmxlQXJlYSA9IHZpc2libGVXaWR0aCAqIHZpc2libGVIZWlnaHQ7XG5cbiAgICByZXR1cm4ge1xuICAgICAgdmlzaWJsZUFyZWEsXG4gICAgICBpc0NvbXBsZXRlbHlXaXRoaW5WaWV3cG9ydDogb3ZlcmxheS53aWR0aCAqIG92ZXJsYXkuaGVpZ2h0ID09PSB2aXNpYmxlQXJlYSxcbiAgICAgIGZpdHNJblZpZXdwb3J0VmVydGljYWxseTogdmlzaWJsZUhlaWdodCA9PT0gb3ZlcmxheS5oZWlnaHQsXG4gICAgICBmaXRzSW5WaWV3cG9ydEhvcml6b250YWxseTogdmlzaWJsZVdpZHRoID09IG92ZXJsYXkud2lkdGgsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBvdmVybGF5IGNhbiBmaXQgd2l0aGluIHRoZSB2aWV3cG9ydCB3aGVuIGl0IG1heSByZXNpemUgZWl0aGVyIGl0cyB3aWR0aCBvciBoZWlnaHQuXG4gICAqIEBwYXJhbSBmaXQgSG93IHdlbGwgdGhlIG92ZXJsYXkgZml0cyBpbiB0aGUgdmlld3BvcnQgYXQgc29tZSBwb3NpdGlvbi5cbiAgICogQHBhcmFtIHBvaW50IFRoZSAoeCwgeSkgY29vcmRpbmF0ZXMgb2YgdGhlIG92ZXJsYXkgYXQgc29tZSBwb3NpdGlvbi5cbiAgICogQHBhcmFtIHZpZXdwb3J0IFRoZSBnZW9tZXRyeSBvZiB0aGUgdmlld3BvcnQuXG4gICAqL1xuICBwcml2YXRlIF9jYW5GaXRXaXRoRmxleGlibGVEaW1lbnNpb25zKGZpdDogT3ZlcmxheUZpdCwgcG9pbnQ6IFBvaW50LCB2aWV3cG9ydDogRGltZW5zaW9ucykge1xuICAgIGlmICh0aGlzLl9oYXNGbGV4aWJsZURpbWVuc2lvbnMpIHtcbiAgICAgIGNvbnN0IGF2YWlsYWJsZUhlaWdodCA9IHZpZXdwb3J0LmJvdHRvbSAtIHBvaW50Lnk7XG4gICAgICBjb25zdCBhdmFpbGFibGVXaWR0aCA9IHZpZXdwb3J0LnJpZ2h0IC0gcG9pbnQueDtcbiAgICAgIGNvbnN0IG1pbkhlaWdodCA9IGdldFBpeGVsVmFsdWUodGhpcy5fb3ZlcmxheVJlZi5nZXRDb25maWcoKS5taW5IZWlnaHQpO1xuICAgICAgY29uc3QgbWluV2lkdGggPSBnZXRQaXhlbFZhbHVlKHRoaXMuX292ZXJsYXlSZWYuZ2V0Q29uZmlnKCkubWluV2lkdGgpO1xuXG4gICAgICBjb25zdCB2ZXJ0aWNhbEZpdCA9XG4gICAgICAgIGZpdC5maXRzSW5WaWV3cG9ydFZlcnRpY2FsbHkgfHwgKG1pbkhlaWdodCAhPSBudWxsICYmIG1pbkhlaWdodCA8PSBhdmFpbGFibGVIZWlnaHQpO1xuICAgICAgY29uc3QgaG9yaXpvbnRhbEZpdCA9XG4gICAgICAgIGZpdC5maXRzSW5WaWV3cG9ydEhvcml6b250YWxseSB8fCAobWluV2lkdGggIT0gbnVsbCAmJiBtaW5XaWR0aCA8PSBhdmFpbGFibGVXaWR0aCk7XG5cbiAgICAgIHJldHVybiB2ZXJ0aWNhbEZpdCAmJiBob3Jpem9udGFsRml0O1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgcG9pbnQgYXQgd2hpY2ggdGhlIG92ZXJsYXkgY2FuIGJlIFwicHVzaGVkXCIgb24tc2NyZWVuLiBJZiB0aGUgb3ZlcmxheSBpcyBsYXJnZXIgdGhhblxuICAgKiB0aGUgdmlld3BvcnQsIHRoZSB0b3AtbGVmdCBjb3JuZXIgd2lsbCBiZSBwdXNoZWQgb24tc2NyZWVuICh3aXRoIG92ZXJmbG93IG9jY3VyaW5nIG9uIHRoZVxuICAgKiByaWdodCBhbmQgYm90dG9tKS5cbiAgICpcbiAgICogQHBhcmFtIHN0YXJ0IFN0YXJ0aW5nIHBvaW50IGZyb20gd2hpY2ggdGhlIG92ZXJsYXkgaXMgcHVzaGVkLlxuICAgKiBAcGFyYW0gcmF3T3ZlcmxheVJlY3QgRGltZW5zaW9ucyBvZiB0aGUgb3ZlcmxheS5cbiAgICogQHBhcmFtIHNjcm9sbFBvc2l0aW9uIEN1cnJlbnQgdmlld3BvcnQgc2Nyb2xsIHBvc2l0aW9uLlxuICAgKiBAcmV0dXJucyBUaGUgcG9pbnQgYXQgd2hpY2ggdG8gcG9zaXRpb24gdGhlIG92ZXJsYXkgYWZ0ZXIgcHVzaGluZy4gVGhpcyBpcyBlZmZlY3RpdmVseSBhIG5ld1xuICAgKiAgICAgb3JpZ2luUG9pbnQuXG4gICAqL1xuICBwcml2YXRlIF9wdXNoT3ZlcmxheU9uU2NyZWVuKFxuICAgIHN0YXJ0OiBQb2ludCxcbiAgICByYXdPdmVybGF5UmVjdDogRGltZW5zaW9ucyxcbiAgICBzY3JvbGxQb3NpdGlvbjogVmlld3BvcnRTY3JvbGxQb3NpdGlvbixcbiAgKTogUG9pbnQge1xuICAgIC8vIElmIHRoZSBwb3NpdGlvbiBpcyBsb2NrZWQgYW5kIHdlJ3ZlIHB1c2hlZCB0aGUgb3ZlcmxheSBhbHJlYWR5LCByZXVzZSB0aGUgcHJldmlvdXMgcHVzaFxuICAgIC8vIGFtb3VudCwgcmF0aGVyIHRoYW4gcHVzaGluZyBpdCBhZ2Fpbi4gSWYgd2Ugd2VyZSB0byBjb250aW51ZSBwdXNoaW5nLCB0aGUgZWxlbWVudCB3b3VsZFxuICAgIC8vIHJlbWFpbiBpbiB0aGUgdmlld3BvcnQsIHdoaWNoIGdvZXMgYWdhaW5zdCB0aGUgZXhwZWN0YXRpb25zIHdoZW4gcG9zaXRpb24gbG9ja2luZyBpcyBlbmFibGVkLlxuICAgIGlmICh0aGlzLl9wcmV2aW91c1B1c2hBbW91bnQgJiYgdGhpcy5fcG9zaXRpb25Mb2NrZWQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHg6IHN0YXJ0LnggKyB0aGlzLl9wcmV2aW91c1B1c2hBbW91bnQueCxcbiAgICAgICAgeTogc3RhcnQueSArIHRoaXMuX3ByZXZpb3VzUHVzaEFtb3VudC55LFxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBSb3VuZCB0aGUgb3ZlcmxheSByZWN0IHdoZW4gY29tcGFyaW5nIGFnYWluc3QgdGhlXG4gICAgLy8gdmlld3BvcnQsIGJlY2F1c2UgdGhlIHZpZXdwb3J0IGlzIGFsd2F5cyByb3VuZGVkLlxuICAgIGNvbnN0IG92ZXJsYXkgPSBnZXRSb3VuZGVkQm91bmRpbmdDbGllbnRSZWN0KHJhd092ZXJsYXlSZWN0KTtcbiAgICBjb25zdCB2aWV3cG9ydCA9IHRoaXMuX3ZpZXdwb3J0UmVjdDtcblxuICAgIC8vIERldGVybWluZSBob3cgbXVjaCB0aGUgb3ZlcmxheSBnb2VzIG91dHNpZGUgdGhlIHZpZXdwb3J0IG9uIGVhY2hcbiAgICAvLyBzaWRlLCB3aGljaCB3ZSdsbCB1c2UgdG8gZGVjaWRlIHdoaWNoIGRpcmVjdGlvbiB0byBwdXNoIGl0LlxuICAgIGNvbnN0IG92ZXJmbG93UmlnaHQgPSBNYXRoLm1heChzdGFydC54ICsgb3ZlcmxheS53aWR0aCAtIHZpZXdwb3J0LndpZHRoLCAwKTtcbiAgICBjb25zdCBvdmVyZmxvd0JvdHRvbSA9IE1hdGgubWF4KHN0YXJ0LnkgKyBvdmVybGF5LmhlaWdodCAtIHZpZXdwb3J0LmhlaWdodCwgMCk7XG4gICAgY29uc3Qgb3ZlcmZsb3dUb3AgPSBNYXRoLm1heCh2aWV3cG9ydC50b3AgLSBzY3JvbGxQb3NpdGlvbi50b3AgLSBzdGFydC55LCAwKTtcbiAgICBjb25zdCBvdmVyZmxvd0xlZnQgPSBNYXRoLm1heCh2aWV3cG9ydC5sZWZ0IC0gc2Nyb2xsUG9zaXRpb24ubGVmdCAtIHN0YXJ0LngsIDApO1xuXG4gICAgLy8gQW1vdW50IGJ5IHdoaWNoIHRvIHB1c2ggdGhlIG92ZXJsYXkgaW4gZWFjaCBheGlzIHN1Y2ggdGhhdCBpdCByZW1haW5zIG9uLXNjcmVlbi5cbiAgICBsZXQgcHVzaFggPSAwO1xuICAgIGxldCBwdXNoWSA9IDA7XG5cbiAgICAvLyBJZiB0aGUgb3ZlcmxheSBmaXRzIGNvbXBsZXRlbHkgd2l0aGluIHRoZSBib3VuZHMgb2YgdGhlIHZpZXdwb3J0LCBwdXNoIGl0IGZyb20gd2hpY2hldmVyXG4gICAgLy8gZGlyZWN0aW9uIGlzIGdvZXMgb2ZmLXNjcmVlbi4gT3RoZXJ3aXNlLCBwdXNoIHRoZSB0b3AtbGVmdCBjb3JuZXIgc3VjaCB0aGF0IGl0cyBpbiB0aGVcbiAgICAvLyB2aWV3cG9ydCBhbmQgYWxsb3cgZm9yIHRoZSB0cmFpbGluZyBlbmQgb2YgdGhlIG92ZXJsYXkgdG8gZ28gb3V0IG9mIGJvdW5kcy5cbiAgICBpZiAob3ZlcmxheS53aWR0aCA8PSB2aWV3cG9ydC53aWR0aCkge1xuICAgICAgcHVzaFggPSBvdmVyZmxvd0xlZnQgfHwgLW92ZXJmbG93UmlnaHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHB1c2hYID0gc3RhcnQueCA8IHRoaXMuX3ZpZXdwb3J0TWFyZ2luID8gdmlld3BvcnQubGVmdCAtIHNjcm9sbFBvc2l0aW9uLmxlZnQgLSBzdGFydC54IDogMDtcbiAgICB9XG5cbiAgICBpZiAob3ZlcmxheS5oZWlnaHQgPD0gdmlld3BvcnQuaGVpZ2h0KSB7XG4gICAgICBwdXNoWSA9IG92ZXJmbG93VG9wIHx8IC1vdmVyZmxvd0JvdHRvbTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHVzaFkgPSBzdGFydC55IDwgdGhpcy5fdmlld3BvcnRNYXJnaW4gPyB2aWV3cG9ydC50b3AgLSBzY3JvbGxQb3NpdGlvbi50b3AgLSBzdGFydC55IDogMDtcbiAgICB9XG5cbiAgICB0aGlzLl9wcmV2aW91c1B1c2hBbW91bnQgPSB7eDogcHVzaFgsIHk6IHB1c2hZfTtcblxuICAgIHJldHVybiB7XG4gICAgICB4OiBzdGFydC54ICsgcHVzaFgsXG4gICAgICB5OiBzdGFydC55ICsgcHVzaFksXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBsaWVzIGEgY29tcHV0ZWQgcG9zaXRpb24gdG8gdGhlIG92ZXJsYXkgYW5kIGVtaXRzIGEgcG9zaXRpb24gY2hhbmdlLlxuICAgKiBAcGFyYW0gcG9zaXRpb24gVGhlIHBvc2l0aW9uIHByZWZlcmVuY2VcbiAgICogQHBhcmFtIG9yaWdpblBvaW50IFRoZSBwb2ludCBvbiB0aGUgb3JpZ2luIGVsZW1lbnQgd2hlcmUgdGhlIG92ZXJsYXkgaXMgY29ubmVjdGVkLlxuICAgKi9cbiAgcHJpdmF0ZSBfYXBwbHlQb3NpdGlvbihwb3NpdGlvbjogQ29ubmVjdGVkUG9zaXRpb24sIG9yaWdpblBvaW50OiBQb2ludCkge1xuICAgIHRoaXMuX3NldFRyYW5zZm9ybU9yaWdpbihwb3NpdGlvbik7XG4gICAgdGhpcy5fc2V0T3ZlcmxheUVsZW1lbnRTdHlsZXMob3JpZ2luUG9pbnQsIHBvc2l0aW9uKTtcbiAgICB0aGlzLl9zZXRCb3VuZGluZ0JveFN0eWxlcyhvcmlnaW5Qb2ludCwgcG9zaXRpb24pO1xuXG4gICAgaWYgKHBvc2l0aW9uLnBhbmVsQ2xhc3MpIHtcbiAgICAgIHRoaXMuX2FkZFBhbmVsQ2xhc3Nlcyhwb3NpdGlvbi5wYW5lbENsYXNzKTtcbiAgICB9XG5cbiAgICAvLyBTYXZlIHRoZSBsYXN0IGNvbm5lY3RlZCBwb3NpdGlvbiBpbiBjYXNlIHRoZSBwb3NpdGlvbiBuZWVkcyB0byBiZSByZS1jYWxjdWxhdGVkLlxuICAgIHRoaXMuX2xhc3RQb3NpdGlvbiA9IHBvc2l0aW9uO1xuXG4gICAgLy8gTm90aWZ5IHRoYXQgdGhlIHBvc2l0aW9uIGhhcyBiZWVuIGNoYW5nZWQgYWxvbmcgd2l0aCBpdHMgY2hhbmdlIHByb3BlcnRpZXMuXG4gICAgLy8gV2Ugb25seSBlbWl0IGlmIHdlJ3ZlIGdvdCBhbnkgc3Vic2NyaXB0aW9ucywgYmVjYXVzZSB0aGUgc2Nyb2xsIHZpc2liaWxpdHlcbiAgICAvLyBjYWxjdWxjYXRpb25zIGNhbiBiZSBzb21ld2hhdCBleHBlbnNpdmUuXG4gICAgaWYgKHRoaXMuX3Bvc2l0aW9uQ2hhbmdlcy5vYnNlcnZlcnMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBzY3JvbGxhYmxlVmlld1Byb3BlcnRpZXMgPSB0aGlzLl9nZXRTY3JvbGxWaXNpYmlsaXR5KCk7XG4gICAgICBjb25zdCBjaGFuZ2VFdmVudCA9IG5ldyBDb25uZWN0ZWRPdmVybGF5UG9zaXRpb25DaGFuZ2UocG9zaXRpb24sIHNjcm9sbGFibGVWaWV3UHJvcGVydGllcyk7XG4gICAgICB0aGlzLl9wb3NpdGlvbkNoYW5nZXMubmV4dChjaGFuZ2VFdmVudCk7XG4gICAgfVxuXG4gICAgdGhpcy5faXNJbml0aWFsUmVuZGVyID0gZmFsc2U7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgdHJhbnNmb3JtIG9yaWdpbiBiYXNlZCBvbiB0aGUgY29uZmlndXJlZCBzZWxlY3RvciBhbmQgdGhlIHBhc3NlZC1pbiBwb3NpdGlvbi4gICovXG4gIHByaXZhdGUgX3NldFRyYW5zZm9ybU9yaWdpbihwb3NpdGlvbjogQ29ubmVjdGVkUG9zaXRpb24pIHtcbiAgICBpZiAoIXRoaXMuX3RyYW5zZm9ybU9yaWdpblNlbGVjdG9yKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZWxlbWVudHM6IE5vZGVMaXN0T2Y8SFRNTEVsZW1lbnQ+ID0gdGhpcy5fYm91bmRpbmdCb3ghLnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICB0aGlzLl90cmFuc2Zvcm1PcmlnaW5TZWxlY3RvcixcbiAgICApO1xuICAgIGxldCB4T3JpZ2luOiAnbGVmdCcgfCAncmlnaHQnIHwgJ2NlbnRlcic7XG4gICAgbGV0IHlPcmlnaW46ICd0b3AnIHwgJ2JvdHRvbScgfCAnY2VudGVyJyA9IHBvc2l0aW9uLm92ZXJsYXlZO1xuXG4gICAgaWYgKHBvc2l0aW9uLm92ZXJsYXlYID09PSAnY2VudGVyJykge1xuICAgICAgeE9yaWdpbiA9ICdjZW50ZXInO1xuICAgIH0gZWxzZSBpZiAodGhpcy5faXNSdGwoKSkge1xuICAgICAgeE9yaWdpbiA9IHBvc2l0aW9uLm92ZXJsYXlYID09PSAnc3RhcnQnID8gJ3JpZ2h0JyA6ICdsZWZ0JztcbiAgICB9IGVsc2Uge1xuICAgICAgeE9yaWdpbiA9IHBvc2l0aW9uLm92ZXJsYXlYID09PSAnc3RhcnQnID8gJ2xlZnQnIDogJ3JpZ2h0JztcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBlbGVtZW50c1tpXS5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSBgJHt4T3JpZ2lufSAke3lPcmlnaW59YDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgcG9zaXRpb24gYW5kIHNpemUgb2YgdGhlIG92ZXJsYXkncyBzaXppbmcgY29udGFpbmVyLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBkb2VzIG5vIG1lYXN1cmluZyBhbmQgYXBwbGllcyBubyBzdHlsZXMgc28gdGhhdCB3ZSBjYW4gY2hlYXBseSBjb21wdXRlIHRoZVxuICAgKiBib3VuZHMgZm9yIGFsbCBwb3NpdGlvbnMgYW5kIGNob29zZSB0aGUgYmVzdCBmaXQgYmFzZWQgb24gdGhlc2UgcmVzdWx0cy5cbiAgICovXG4gIHByaXZhdGUgX2NhbGN1bGF0ZUJvdW5kaW5nQm94UmVjdChvcmlnaW46IFBvaW50LCBwb3NpdGlvbjogQ29ubmVjdGVkUG9zaXRpb24pOiBCb3VuZGluZ0JveFJlY3Qge1xuICAgIGNvbnN0IHZpZXdwb3J0ID0gdGhpcy5fdmlld3BvcnRSZWN0O1xuICAgIGNvbnN0IGlzUnRsID0gdGhpcy5faXNSdGwoKTtcbiAgICBsZXQgaGVpZ2h0OiBudW1iZXIsIHRvcDogbnVtYmVyLCBib3R0b206IG51bWJlcjtcblxuICAgIGlmIChwb3NpdGlvbi5vdmVybGF5WSA9PT0gJ3RvcCcpIHtcbiAgICAgIC8vIE92ZXJsYXkgaXMgb3BlbmluZyBcImRvd253YXJkXCIgYW5kIHRodXMgaXMgYm91bmQgYnkgdGhlIGJvdHRvbSB2aWV3cG9ydCBlZGdlLlxuICAgICAgdG9wID0gb3JpZ2luLnk7XG4gICAgICBoZWlnaHQgPSB2aWV3cG9ydC5oZWlnaHQgLSB0b3AgKyB0aGlzLl92aWV3cG9ydE1hcmdpbjtcbiAgICB9IGVsc2UgaWYgKHBvc2l0aW9uLm92ZXJsYXlZID09PSAnYm90dG9tJykge1xuICAgICAgLy8gT3ZlcmxheSBpcyBvcGVuaW5nIFwidXB3YXJkXCIgYW5kIHRodXMgaXMgYm91bmQgYnkgdGhlIHRvcCB2aWV3cG9ydCBlZGdlLiBXZSBuZWVkIHRvIGFkZFxuICAgICAgLy8gdGhlIHZpZXdwb3J0IG1hcmdpbiBiYWNrIGluLCBiZWNhdXNlIHRoZSB2aWV3cG9ydCByZWN0IGlzIG5hcnJvd2VkIGRvd24gdG8gcmVtb3ZlIHRoZVxuICAgICAgLy8gbWFyZ2luLCB3aGVyZWFzIHRoZSBgb3JpZ2luYCBwb3NpdGlvbiBpcyBjYWxjdWxhdGVkIGJhc2VkIG9uIGl0cyBgQ2xpZW50UmVjdGAuXG4gICAgICBib3R0b20gPSB2aWV3cG9ydC5oZWlnaHQgLSBvcmlnaW4ueSArIHRoaXMuX3ZpZXdwb3J0TWFyZ2luICogMjtcbiAgICAgIGhlaWdodCA9IHZpZXdwb3J0LmhlaWdodCAtIGJvdHRvbSArIHRoaXMuX3ZpZXdwb3J0TWFyZ2luO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZiBuZWl0aGVyIHRvcCBub3IgYm90dG9tLCBpdCBtZWFucyB0aGF0IHRoZSBvdmVybGF5IGlzIHZlcnRpY2FsbHkgY2VudGVyZWQgb24gdGhlXG4gICAgICAvLyBvcmlnaW4gcG9pbnQuIE5vdGUgdGhhdCB3ZSB3YW50IHRoZSBwb3NpdGlvbiByZWxhdGl2ZSB0byB0aGUgdmlld3BvcnQsIHJhdGhlciB0aGFuXG4gICAgICAvLyB0aGUgcGFnZSwgd2hpY2ggaXMgd2h5IHdlIGRvbid0IHVzZSBzb21ldGhpbmcgbGlrZSBgdmlld3BvcnQuYm90dG9tIC0gb3JpZ2luLnlgIGFuZFxuICAgICAgLy8gYG9yaWdpbi55IC0gdmlld3BvcnQudG9wYC5cbiAgICAgIGNvbnN0IHNtYWxsZXN0RGlzdGFuY2VUb1ZpZXdwb3J0RWRnZSA9IE1hdGgubWluKFxuICAgICAgICB2aWV3cG9ydC5ib3R0b20gLSBvcmlnaW4ueSArIHZpZXdwb3J0LnRvcCxcbiAgICAgICAgb3JpZ2luLnksXG4gICAgICApO1xuXG4gICAgICBjb25zdCBwcmV2aW91c0hlaWdodCA9IHRoaXMuX2xhc3RCb3VuZGluZ0JveFNpemUuaGVpZ2h0O1xuXG4gICAgICBoZWlnaHQgPSBzbWFsbGVzdERpc3RhbmNlVG9WaWV3cG9ydEVkZ2UgKiAyO1xuICAgICAgdG9wID0gb3JpZ2luLnkgLSBzbWFsbGVzdERpc3RhbmNlVG9WaWV3cG9ydEVkZ2U7XG5cbiAgICAgIGlmIChoZWlnaHQgPiBwcmV2aW91c0hlaWdodCAmJiAhdGhpcy5faXNJbml0aWFsUmVuZGVyICYmICF0aGlzLl9ncm93QWZ0ZXJPcGVuKSB7XG4gICAgICAgIHRvcCA9IG9yaWdpbi55IC0gcHJldmlvdXNIZWlnaHQgLyAyO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRoZSBvdmVybGF5IGlzIG9wZW5pbmcgJ3JpZ2h0LXdhcmQnICh0aGUgY29udGVudCBmbG93cyB0byB0aGUgcmlnaHQpLlxuICAgIGNvbnN0IGlzQm91bmRlZEJ5UmlnaHRWaWV3cG9ydEVkZ2UgPVxuICAgICAgKHBvc2l0aW9uLm92ZXJsYXlYID09PSAnc3RhcnQnICYmICFpc1J0bCkgfHwgKHBvc2l0aW9uLm92ZXJsYXlYID09PSAnZW5kJyAmJiBpc1J0bCk7XG5cbiAgICAvLyBUaGUgb3ZlcmxheSBpcyBvcGVuaW5nICdsZWZ0LXdhcmQnICh0aGUgY29udGVudCBmbG93cyB0byB0aGUgbGVmdCkuXG4gICAgY29uc3QgaXNCb3VuZGVkQnlMZWZ0Vmlld3BvcnRFZGdlID1cbiAgICAgIChwb3NpdGlvbi5vdmVybGF5WCA9PT0gJ2VuZCcgJiYgIWlzUnRsKSB8fCAocG9zaXRpb24ub3ZlcmxheVggPT09ICdzdGFydCcgJiYgaXNSdGwpO1xuXG4gICAgbGV0IHdpZHRoOiBudW1iZXIsIGxlZnQ6IG51bWJlciwgcmlnaHQ6IG51bWJlcjtcblxuICAgIGlmIChpc0JvdW5kZWRCeUxlZnRWaWV3cG9ydEVkZ2UpIHtcbiAgICAgIHJpZ2h0ID0gdmlld3BvcnQud2lkdGggLSBvcmlnaW4ueCArIHRoaXMuX3ZpZXdwb3J0TWFyZ2luO1xuICAgICAgd2lkdGggPSBvcmlnaW4ueCAtIHRoaXMuX3ZpZXdwb3J0TWFyZ2luO1xuICAgIH0gZWxzZSBpZiAoaXNCb3VuZGVkQnlSaWdodFZpZXdwb3J0RWRnZSkge1xuICAgICAgbGVmdCA9IG9yaWdpbi54O1xuICAgICAgd2lkdGggPSB2aWV3cG9ydC5yaWdodCAtIG9yaWdpbi54O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZiBuZWl0aGVyIHN0YXJ0IG5vciBlbmQsIGl0IG1lYW5zIHRoYXQgdGhlIG92ZXJsYXkgaXMgaG9yaXpvbnRhbGx5IGNlbnRlcmVkIG9uIHRoZVxuICAgICAgLy8gb3JpZ2luIHBvaW50LiBOb3RlIHRoYXQgd2Ugd2FudCB0aGUgcG9zaXRpb24gcmVsYXRpdmUgdG8gdGhlIHZpZXdwb3J0LCByYXRoZXIgdGhhblxuICAgICAgLy8gdGhlIHBhZ2UsIHdoaWNoIGlzIHdoeSB3ZSBkb24ndCB1c2Ugc29tZXRoaW5nIGxpa2UgYHZpZXdwb3J0LnJpZ2h0IC0gb3JpZ2luLnhgIGFuZFxuICAgICAgLy8gYG9yaWdpbi54IC0gdmlld3BvcnQubGVmdGAuXG4gICAgICBjb25zdCBzbWFsbGVzdERpc3RhbmNlVG9WaWV3cG9ydEVkZ2UgPSBNYXRoLm1pbihcbiAgICAgICAgdmlld3BvcnQucmlnaHQgLSBvcmlnaW4ueCArIHZpZXdwb3J0LmxlZnQsXG4gICAgICAgIG9yaWdpbi54LFxuICAgICAgKTtcbiAgICAgIGNvbnN0IHByZXZpb3VzV2lkdGggPSB0aGlzLl9sYXN0Qm91bmRpbmdCb3hTaXplLndpZHRoO1xuXG4gICAgICB3aWR0aCA9IHNtYWxsZXN0RGlzdGFuY2VUb1ZpZXdwb3J0RWRnZSAqIDI7XG4gICAgICBsZWZ0ID0gb3JpZ2luLnggLSBzbWFsbGVzdERpc3RhbmNlVG9WaWV3cG9ydEVkZ2U7XG5cbiAgICAgIGlmICh3aWR0aCA+IHByZXZpb3VzV2lkdGggJiYgIXRoaXMuX2lzSW5pdGlhbFJlbmRlciAmJiAhdGhpcy5fZ3Jvd0FmdGVyT3Blbikge1xuICAgICAgICBsZWZ0ID0gb3JpZ2luLnggLSBwcmV2aW91c1dpZHRoIC8gMjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge3RvcDogdG9wISwgbGVmdDogbGVmdCEsIGJvdHRvbTogYm90dG9tISwgcmlnaHQ6IHJpZ2h0ISwgd2lkdGgsIGhlaWdodH07XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgcG9zaXRpb24gYW5kIHNpemUgb2YgdGhlIG92ZXJsYXkncyBzaXppbmcgd3JhcHBlci4gVGhlIHdyYXBwZXIgaXMgcG9zaXRpb25lZCBvbiB0aGVcbiAgICogb3JpZ2luJ3MgY29ubmVjdGlvbiBwb2ludCBhbmQgc3RldGNoZXMgdG8gdGhlIGJvdW5kcyBvZiB0aGUgdmlld3BvcnQuXG4gICAqXG4gICAqIEBwYXJhbSBvcmlnaW4gVGhlIHBvaW50IG9uIHRoZSBvcmlnaW4gZWxlbWVudCB3aGVyZSB0aGUgb3ZlcmxheSBpcyBjb25uZWN0ZWQuXG4gICAqIEBwYXJhbSBwb3NpdGlvbiBUaGUgcG9zaXRpb24gcHJlZmVyZW5jZVxuICAgKi9cbiAgcHJpdmF0ZSBfc2V0Qm91bmRpbmdCb3hTdHlsZXMob3JpZ2luOiBQb2ludCwgcG9zaXRpb246IENvbm5lY3RlZFBvc2l0aW9uKTogdm9pZCB7XG4gICAgY29uc3QgYm91bmRpbmdCb3hSZWN0ID0gdGhpcy5fY2FsY3VsYXRlQm91bmRpbmdCb3hSZWN0KG9yaWdpbiwgcG9zaXRpb24pO1xuXG4gICAgLy8gSXQncyB3ZWlyZCBpZiB0aGUgb3ZlcmxheSAqZ3Jvd3MqIHdoaWxlIHNjcm9sbGluZywgc28gd2UgdGFrZSB0aGUgbGFzdCBzaXplIGludG8gYWNjb3VudFxuICAgIC8vIHdoZW4gYXBwbHlpbmcgYSBuZXcgc2l6ZS5cbiAgICBpZiAoIXRoaXMuX2lzSW5pdGlhbFJlbmRlciAmJiAhdGhpcy5fZ3Jvd0FmdGVyT3Blbikge1xuICAgICAgYm91bmRpbmdCb3hSZWN0LmhlaWdodCA9IE1hdGgubWluKGJvdW5kaW5nQm94UmVjdC5oZWlnaHQsIHRoaXMuX2xhc3RCb3VuZGluZ0JveFNpemUuaGVpZ2h0KTtcbiAgICAgIGJvdW5kaW5nQm94UmVjdC53aWR0aCA9IE1hdGgubWluKGJvdW5kaW5nQm94UmVjdC53aWR0aCwgdGhpcy5fbGFzdEJvdW5kaW5nQm94U2l6ZS53aWR0aCk7XG4gICAgfVxuXG4gICAgY29uc3Qgc3R5bGVzID0ge30gYXMgQ1NTU3R5bGVEZWNsYXJhdGlvbjtcblxuICAgIGlmICh0aGlzLl9oYXNFeGFjdFBvc2l0aW9uKCkpIHtcbiAgICAgIHN0eWxlcy50b3AgPSBzdHlsZXMubGVmdCA9ICcwJztcbiAgICAgIHN0eWxlcy5ib3R0b20gPSBzdHlsZXMucmlnaHQgPSBzdHlsZXMubWF4SGVpZ2h0ID0gc3R5bGVzLm1heFdpZHRoID0gJyc7XG4gICAgICBzdHlsZXMud2lkdGggPSBzdHlsZXMuaGVpZ2h0ID0gJzEwMCUnO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBtYXhIZWlnaHQgPSB0aGlzLl9vdmVybGF5UmVmLmdldENvbmZpZygpLm1heEhlaWdodDtcbiAgICAgIGNvbnN0IG1heFdpZHRoID0gdGhpcy5fb3ZlcmxheVJlZi5nZXRDb25maWcoKS5tYXhXaWR0aDtcblxuICAgICAgc3R5bGVzLmhlaWdodCA9IGNvZXJjZUNzc1BpeGVsVmFsdWUoYm91bmRpbmdCb3hSZWN0LmhlaWdodCk7XG4gICAgICBzdHlsZXMudG9wID0gY29lcmNlQ3NzUGl4ZWxWYWx1ZShib3VuZGluZ0JveFJlY3QudG9wKTtcbiAgICAgIHN0eWxlcy5ib3R0b20gPSBjb2VyY2VDc3NQaXhlbFZhbHVlKGJvdW5kaW5nQm94UmVjdC5ib3R0b20pO1xuICAgICAgc3R5bGVzLndpZHRoID0gY29lcmNlQ3NzUGl4ZWxWYWx1ZShib3VuZGluZ0JveFJlY3Qud2lkdGgpO1xuICAgICAgc3R5bGVzLmxlZnQgPSBjb2VyY2VDc3NQaXhlbFZhbHVlKGJvdW5kaW5nQm94UmVjdC5sZWZ0KTtcbiAgICAgIHN0eWxlcy5yaWdodCA9IGNvZXJjZUNzc1BpeGVsVmFsdWUoYm91bmRpbmdCb3hSZWN0LnJpZ2h0KTtcblxuICAgICAgLy8gUHVzaCB0aGUgcGFuZSBjb250ZW50IHRvd2FyZHMgdGhlIHByb3BlciBkaXJlY3Rpb24uXG4gICAgICBpZiAocG9zaXRpb24ub3ZlcmxheVggPT09ICdjZW50ZXInKSB7XG4gICAgICAgIHN0eWxlcy5hbGlnbkl0ZW1zID0gJ2NlbnRlcic7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHlsZXMuYWxpZ25JdGVtcyA9IHBvc2l0aW9uLm92ZXJsYXlYID09PSAnZW5kJyA/ICdmbGV4LWVuZCcgOiAnZmxleC1zdGFydCc7XG4gICAgICB9XG5cbiAgICAgIGlmIChwb3NpdGlvbi5vdmVybGF5WSA9PT0gJ2NlbnRlcicpIHtcbiAgICAgICAgc3R5bGVzLmp1c3RpZnlDb250ZW50ID0gJ2NlbnRlcic7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHlsZXMuanVzdGlmeUNvbnRlbnQgPSBwb3NpdGlvbi5vdmVybGF5WSA9PT0gJ2JvdHRvbScgPyAnZmxleC1lbmQnIDogJ2ZsZXgtc3RhcnQnO1xuICAgICAgfVxuXG4gICAgICBpZiAobWF4SGVpZ2h0KSB7XG4gICAgICAgIHN0eWxlcy5tYXhIZWlnaHQgPSBjb2VyY2VDc3NQaXhlbFZhbHVlKG1heEhlaWdodCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChtYXhXaWR0aCkge1xuICAgICAgICBzdHlsZXMubWF4V2lkdGggPSBjb2VyY2VDc3NQaXhlbFZhbHVlKG1heFdpZHRoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9sYXN0Qm91bmRpbmdCb3hTaXplID0gYm91bmRpbmdCb3hSZWN0O1xuXG4gICAgZXh0ZW5kU3R5bGVzKHRoaXMuX2JvdW5kaW5nQm94IS5zdHlsZSwgc3R5bGVzKTtcbiAgfVxuXG4gIC8qKiBSZXNldHMgdGhlIHN0eWxlcyBmb3IgdGhlIGJvdW5kaW5nIGJveCBzbyB0aGF0IGEgbmV3IHBvc2l0aW9uaW5nIGNhbiBiZSBjb21wdXRlZC4gKi9cbiAgcHJpdmF0ZSBfcmVzZXRCb3VuZGluZ0JveFN0eWxlcygpIHtcbiAgICBleHRlbmRTdHlsZXModGhpcy5fYm91bmRpbmdCb3ghLnN0eWxlLCB7XG4gICAgICB0b3A6ICcwJyxcbiAgICAgIGxlZnQ6ICcwJyxcbiAgICAgIHJpZ2h0OiAnMCcsXG4gICAgICBib3R0b206ICcwJyxcbiAgICAgIGhlaWdodDogJycsXG4gICAgICB3aWR0aDogJycsXG4gICAgICBhbGlnbkl0ZW1zOiAnJyxcbiAgICAgIGp1c3RpZnlDb250ZW50OiAnJyxcbiAgICB9IGFzIENTU1N0eWxlRGVjbGFyYXRpb24pO1xuICB9XG5cbiAgLyoqIFJlc2V0cyB0aGUgc3R5bGVzIGZvciB0aGUgb3ZlcmxheSBwYW5lIHNvIHRoYXQgYSBuZXcgcG9zaXRpb25pbmcgY2FuIGJlIGNvbXB1dGVkLiAqL1xuICBwcml2YXRlIF9yZXNldE92ZXJsYXlFbGVtZW50U3R5bGVzKCkge1xuICAgIGV4dGVuZFN0eWxlcyh0aGlzLl9wYW5lLnN0eWxlLCB7XG4gICAgICB0b3A6ICcnLFxuICAgICAgbGVmdDogJycsXG4gICAgICBib3R0b206ICcnLFxuICAgICAgcmlnaHQ6ICcnLFxuICAgICAgcG9zaXRpb246ICcnLFxuICAgICAgdHJhbnNmb3JtOiAnJyxcbiAgICB9IGFzIENTU1N0eWxlRGVjbGFyYXRpb24pO1xuICB9XG5cbiAgLyoqIFNldHMgcG9zaXRpb25pbmcgc3R5bGVzIHRvIHRoZSBvdmVybGF5IGVsZW1lbnQuICovXG4gIHByaXZhdGUgX3NldE92ZXJsYXlFbGVtZW50U3R5bGVzKG9yaWdpblBvaW50OiBQb2ludCwgcG9zaXRpb246IENvbm5lY3RlZFBvc2l0aW9uKTogdm9pZCB7XG4gICAgY29uc3Qgc3R5bGVzID0ge30gYXMgQ1NTU3R5bGVEZWNsYXJhdGlvbjtcbiAgICBjb25zdCBoYXNFeGFjdFBvc2l0aW9uID0gdGhpcy5faGFzRXhhY3RQb3NpdGlvbigpO1xuICAgIGNvbnN0IGhhc0ZsZXhpYmxlRGltZW5zaW9ucyA9IHRoaXMuX2hhc0ZsZXhpYmxlRGltZW5zaW9ucztcbiAgICBjb25zdCBjb25maWcgPSB0aGlzLl9vdmVybGF5UmVmLmdldENvbmZpZygpO1xuXG4gICAgaWYgKGhhc0V4YWN0UG9zaXRpb24pIHtcbiAgICAgIGNvbnN0IHNjcm9sbFBvc2l0aW9uID0gdGhpcy5fdmlld3BvcnRSdWxlci5nZXRWaWV3cG9ydFNjcm9sbFBvc2l0aW9uKCk7XG4gICAgICBleHRlbmRTdHlsZXMoc3R5bGVzLCB0aGlzLl9nZXRFeGFjdE92ZXJsYXlZKHBvc2l0aW9uLCBvcmlnaW5Qb2ludCwgc2Nyb2xsUG9zaXRpb24pKTtcbiAgICAgIGV4dGVuZFN0eWxlcyhzdHlsZXMsIHRoaXMuX2dldEV4YWN0T3ZlcmxheVgocG9zaXRpb24sIG9yaWdpblBvaW50LCBzY3JvbGxQb3NpdGlvbikpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHlsZXMucG9zaXRpb24gPSAnc3RhdGljJztcbiAgICB9XG5cbiAgICAvLyBVc2UgYSB0cmFuc2Zvcm0gdG8gYXBwbHkgdGhlIG9mZnNldHMuIFdlIGRvIHRoaXMgYmVjYXVzZSB0aGUgYGNlbnRlcmAgcG9zaXRpb25zIHJlbHkgb25cbiAgICAvLyBiZWluZyBpbiB0aGUgbm9ybWFsIGZsZXggZmxvdyBhbmQgc2V0dGluZyBhIGB0b3BgIC8gYGxlZnRgIGF0IGFsbCB3aWxsIGNvbXBsZXRlbHkgdGhyb3dcbiAgICAvLyBvZmYgdGhlIHBvc2l0aW9uLiBXZSBhbHNvIGNhbid0IHVzZSBtYXJnaW5zLCBiZWNhdXNlIHRoZXkgd29uJ3QgaGF2ZSBhbiBlZmZlY3QgaW4gc29tZVxuICAgIC8vIGNhc2VzIHdoZXJlIHRoZSBlbGVtZW50IGRvZXNuJ3QgaGF2ZSBhbnl0aGluZyB0byBcInB1c2ggb2ZmIG9mXCIuIEZpbmFsbHksIHRoaXMgd29ya3NcbiAgICAvLyBiZXR0ZXIgYm90aCB3aXRoIGZsZXhpYmxlIGFuZCBub24tZmxleGlibGUgcG9zaXRpb25pbmcuXG4gICAgbGV0IHRyYW5zZm9ybVN0cmluZyA9ICcnO1xuICAgIGxldCBvZmZzZXRYID0gdGhpcy5fZ2V0T2Zmc2V0KHBvc2l0aW9uLCAneCcpO1xuICAgIGxldCBvZmZzZXRZID0gdGhpcy5fZ2V0T2Zmc2V0KHBvc2l0aW9uLCAneScpO1xuXG4gICAgaWYgKG9mZnNldFgpIHtcbiAgICAgIHRyYW5zZm9ybVN0cmluZyArPSBgdHJhbnNsYXRlWCgke29mZnNldFh9cHgpIGA7XG4gICAgfVxuXG4gICAgaWYgKG9mZnNldFkpIHtcbiAgICAgIHRyYW5zZm9ybVN0cmluZyArPSBgdHJhbnNsYXRlWSgke29mZnNldFl9cHgpYDtcbiAgICB9XG5cbiAgICBzdHlsZXMudHJhbnNmb3JtID0gdHJhbnNmb3JtU3RyaW5nLnRyaW0oKTtcblxuICAgIC8vIElmIGEgbWF4V2lkdGggb3IgbWF4SGVpZ2h0IGlzIHNwZWNpZmllZCBvbiB0aGUgb3ZlcmxheSwgd2UgcmVtb3ZlIHRoZW0uIFdlIGRvIHRoaXMgYmVjYXVzZVxuICAgIC8vIHdlIG5lZWQgdGhlc2UgdmFsdWVzIHRvIGJvdGggYmUgc2V0IHRvIFwiMTAwJVwiIGZvciB0aGUgYXV0b21hdGljIGZsZXhpYmxlIHNpemluZyB0byB3b3JrLlxuICAgIC8vIFRoZSBtYXhIZWlnaHQgYW5kIG1heFdpZHRoIGFyZSBzZXQgb24gdGhlIGJvdW5kaW5nQm94IGluIG9yZGVyIHRvIGVuZm9yY2UgdGhlIGNvbnN0cmFpbnQuXG4gICAgLy8gTm90ZSB0aGF0IHRoaXMgZG9lc24ndCBhcHBseSB3aGVuIHdlIGhhdmUgYW4gZXhhY3QgcG9zaXRpb24sIGluIHdoaWNoIGNhc2Ugd2UgZG8gd2FudCB0b1xuICAgIC8vIGFwcGx5IHRoZW0gYmVjYXVzZSB0aGV5J2xsIGJlIGNsZWFyZWQgZnJvbSB0aGUgYm91bmRpbmcgYm94LlxuICAgIGlmIChjb25maWcubWF4SGVpZ2h0KSB7XG4gICAgICBpZiAoaGFzRXhhY3RQb3NpdGlvbikge1xuICAgICAgICBzdHlsZXMubWF4SGVpZ2h0ID0gY29lcmNlQ3NzUGl4ZWxWYWx1ZShjb25maWcubWF4SGVpZ2h0KTtcbiAgICAgIH0gZWxzZSBpZiAoaGFzRmxleGlibGVEaW1lbnNpb25zKSB7XG4gICAgICAgIHN0eWxlcy5tYXhIZWlnaHQgPSAnJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLm1heFdpZHRoKSB7XG4gICAgICBpZiAoaGFzRXhhY3RQb3NpdGlvbikge1xuICAgICAgICBzdHlsZXMubWF4V2lkdGggPSBjb2VyY2VDc3NQaXhlbFZhbHVlKGNvbmZpZy5tYXhXaWR0aCk7XG4gICAgICB9IGVsc2UgaWYgKGhhc0ZsZXhpYmxlRGltZW5zaW9ucykge1xuICAgICAgICBzdHlsZXMubWF4V2lkdGggPSAnJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBleHRlbmRTdHlsZXModGhpcy5fcGFuZS5zdHlsZSwgc3R5bGVzKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBleGFjdCB0b3AvYm90dG9tIGZvciB0aGUgb3ZlcmxheSB3aGVuIG5vdCB1c2luZyBmbGV4aWJsZSBzaXppbmcgb3Igd2hlbiBwdXNoaW5nLiAqL1xuICBwcml2YXRlIF9nZXRFeGFjdE92ZXJsYXlZKFxuICAgIHBvc2l0aW9uOiBDb25uZWN0ZWRQb3NpdGlvbixcbiAgICBvcmlnaW5Qb2ludDogUG9pbnQsXG4gICAgc2Nyb2xsUG9zaXRpb246IFZpZXdwb3J0U2Nyb2xsUG9zaXRpb24sXG4gICkge1xuICAgIC8vIFJlc2V0IGFueSBleGlzdGluZyBzdHlsZXMuIFRoaXMgaXMgbmVjZXNzYXJ5IGluIGNhc2UgdGhlXG4gICAgLy8gcHJlZmVycmVkIHBvc2l0aW9uIGhhcyBjaGFuZ2VkIHNpbmNlIHRoZSBsYXN0IGBhcHBseWAuXG4gICAgbGV0IHN0eWxlcyA9IHt0b3A6ICcnLCBib3R0b206ICcnfSBhcyBDU1NTdHlsZURlY2xhcmF0aW9uO1xuICAgIGxldCBvdmVybGF5UG9pbnQgPSB0aGlzLl9nZXRPdmVybGF5UG9pbnQob3JpZ2luUG9pbnQsIHRoaXMuX292ZXJsYXlSZWN0LCBwb3NpdGlvbik7XG5cbiAgICBpZiAodGhpcy5faXNQdXNoZWQpIHtcbiAgICAgIG92ZXJsYXlQb2ludCA9IHRoaXMuX3B1c2hPdmVybGF5T25TY3JlZW4ob3ZlcmxheVBvaW50LCB0aGlzLl9vdmVybGF5UmVjdCwgc2Nyb2xsUG9zaXRpb24pO1xuICAgIH1cblxuICAgIC8vIFdlIHdhbnQgdG8gc2V0IGVpdGhlciBgdG9wYCBvciBgYm90dG9tYCBiYXNlZCBvbiB3aGV0aGVyIHRoZSBvdmVybGF5IHdhbnRzIHRvIGFwcGVhclxuICAgIC8vIGFib3ZlIG9yIGJlbG93IHRoZSBvcmlnaW4gYW5kIHRoZSBkaXJlY3Rpb24gaW4gd2hpY2ggdGhlIGVsZW1lbnQgd2lsbCBleHBhbmQuXG4gICAgaWYgKHBvc2l0aW9uLm92ZXJsYXlZID09PSAnYm90dG9tJykge1xuICAgICAgLy8gV2hlbiB1c2luZyBgYm90dG9tYCwgd2UgYWRqdXN0IHRoZSB5IHBvc2l0aW9uIHN1Y2ggdGhhdCBpdCBpcyB0aGUgZGlzdGFuY2VcbiAgICAgIC8vIGZyb20gdGhlIGJvdHRvbSBvZiB0aGUgdmlld3BvcnQgcmF0aGVyIHRoYW4gdGhlIHRvcC5cbiAgICAgIGNvbnN0IGRvY3VtZW50SGVpZ2h0ID0gdGhpcy5fZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IS5jbGllbnRIZWlnaHQ7XG4gICAgICBzdHlsZXMuYm90dG9tID0gYCR7ZG9jdW1lbnRIZWlnaHQgLSAob3ZlcmxheVBvaW50LnkgKyB0aGlzLl9vdmVybGF5UmVjdC5oZWlnaHQpfXB4YDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3R5bGVzLnRvcCA9IGNvZXJjZUNzc1BpeGVsVmFsdWUob3ZlcmxheVBvaW50LnkpO1xuICAgIH1cblxuICAgIHJldHVybiBzdHlsZXM7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgZXhhY3QgbGVmdC9yaWdodCBmb3IgdGhlIG92ZXJsYXkgd2hlbiBub3QgdXNpbmcgZmxleGlibGUgc2l6aW5nIG9yIHdoZW4gcHVzaGluZy4gKi9cbiAgcHJpdmF0ZSBfZ2V0RXhhY3RPdmVybGF5WChcbiAgICBwb3NpdGlvbjogQ29ubmVjdGVkUG9zaXRpb24sXG4gICAgb3JpZ2luUG9pbnQ6IFBvaW50LFxuICAgIHNjcm9sbFBvc2l0aW9uOiBWaWV3cG9ydFNjcm9sbFBvc2l0aW9uLFxuICApIHtcbiAgICAvLyBSZXNldCBhbnkgZXhpc3Rpbmcgc3R5bGVzLiBUaGlzIGlzIG5lY2Vzc2FyeSBpbiBjYXNlIHRoZSBwcmVmZXJyZWQgcG9zaXRpb24gaGFzXG4gICAgLy8gY2hhbmdlZCBzaW5jZSB0aGUgbGFzdCBgYXBwbHlgLlxuICAgIGxldCBzdHlsZXMgPSB7bGVmdDogJycsIHJpZ2h0OiAnJ30gYXMgQ1NTU3R5bGVEZWNsYXJhdGlvbjtcbiAgICBsZXQgb3ZlcmxheVBvaW50ID0gdGhpcy5fZ2V0T3ZlcmxheVBvaW50KG9yaWdpblBvaW50LCB0aGlzLl9vdmVybGF5UmVjdCwgcG9zaXRpb24pO1xuXG4gICAgaWYgKHRoaXMuX2lzUHVzaGVkKSB7XG4gICAgICBvdmVybGF5UG9pbnQgPSB0aGlzLl9wdXNoT3ZlcmxheU9uU2NyZWVuKG92ZXJsYXlQb2ludCwgdGhpcy5fb3ZlcmxheVJlY3QsIHNjcm9sbFBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICAvLyBXZSB3YW50IHRvIHNldCBlaXRoZXIgYGxlZnRgIG9yIGByaWdodGAgYmFzZWQgb24gd2hldGhlciB0aGUgb3ZlcmxheSB3YW50cyB0byBhcHBlYXIgXCJiZWZvcmVcIlxuICAgIC8vIG9yIFwiYWZ0ZXJcIiB0aGUgb3JpZ2luLCB3aGljaCBkZXRlcm1pbmVzIHRoZSBkaXJlY3Rpb24gaW4gd2hpY2ggdGhlIGVsZW1lbnQgd2lsbCBleHBhbmQuXG4gICAgLy8gRm9yIHRoZSBob3Jpem9udGFsIGF4aXMsIHRoZSBtZWFuaW5nIG9mIFwiYmVmb3JlXCIgYW5kIFwiYWZ0ZXJcIiBjaGFuZ2UgYmFzZWQgb24gd2hldGhlciB0aGVcbiAgICAvLyBwYWdlIGlzIGluIFJUTCBvciBMVFIuXG4gICAgbGV0IGhvcml6b250YWxTdHlsZVByb3BlcnR5OiAnbGVmdCcgfCAncmlnaHQnO1xuXG4gICAgaWYgKHRoaXMuX2lzUnRsKCkpIHtcbiAgICAgIGhvcml6b250YWxTdHlsZVByb3BlcnR5ID0gcG9zaXRpb24ub3ZlcmxheVggPT09ICdlbmQnID8gJ2xlZnQnIDogJ3JpZ2h0JztcbiAgICB9IGVsc2Uge1xuICAgICAgaG9yaXpvbnRhbFN0eWxlUHJvcGVydHkgPSBwb3NpdGlvbi5vdmVybGF5WCA9PT0gJ2VuZCcgPyAncmlnaHQnIDogJ2xlZnQnO1xuICAgIH1cblxuICAgIC8vIFdoZW4gd2UncmUgc2V0dGluZyBgcmlnaHRgLCB3ZSBhZGp1c3QgdGhlIHggcG9zaXRpb24gc3VjaCB0aGF0IGl0IGlzIHRoZSBkaXN0YW5jZVxuICAgIC8vIGZyb20gdGhlIHJpZ2h0IGVkZ2Ugb2YgdGhlIHZpZXdwb3J0IHJhdGhlciB0aGFuIHRoZSBsZWZ0IGVkZ2UuXG4gICAgaWYgKGhvcml6b250YWxTdHlsZVByb3BlcnR5ID09PSAncmlnaHQnKSB7XG4gICAgICBjb25zdCBkb2N1bWVudFdpZHRoID0gdGhpcy5fZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IS5jbGllbnRXaWR0aDtcbiAgICAgIHN0eWxlcy5yaWdodCA9IGAke2RvY3VtZW50V2lkdGggLSAob3ZlcmxheVBvaW50LnggKyB0aGlzLl9vdmVybGF5UmVjdC53aWR0aCl9cHhgO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHlsZXMubGVmdCA9IGNvZXJjZUNzc1BpeGVsVmFsdWUob3ZlcmxheVBvaW50LngpO1xuICAgIH1cblxuICAgIHJldHVybiBzdHlsZXM7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgdmlldyBwcm9wZXJ0aWVzIG9mIHRoZSB0cmlnZ2VyIGFuZCBvdmVybGF5LCBpbmNsdWRpbmcgd2hldGhlciB0aGV5IGFyZSBjbGlwcGVkXG4gICAqIG9yIGNvbXBsZXRlbHkgb3V0c2lkZSB0aGUgdmlldyBvZiBhbnkgb2YgdGhlIHN0cmF0ZWd5J3Mgc2Nyb2xsYWJsZXMuXG4gICAqL1xuICBwcml2YXRlIF9nZXRTY3JvbGxWaXNpYmlsaXR5KCk6IFNjcm9sbGluZ1Zpc2liaWxpdHkge1xuICAgIC8vIE5vdGU6IG5lZWRzIGZyZXNoIHJlY3RzIHNpbmNlIHRoZSBwb3NpdGlvbiBjb3VsZCd2ZSBjaGFuZ2VkLlxuICAgIGNvbnN0IG9yaWdpbkJvdW5kcyA9IHRoaXMuX2dldE9yaWdpblJlY3QoKTtcbiAgICBjb25zdCBvdmVybGF5Qm91bmRzID0gdGhpcy5fcGFuZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgIC8vIFRPRE8oamVsYm91cm4pOiBpbnN0ZWFkIG9mIG5lZWRpbmcgYWxsIG9mIHRoZSBjbGllbnQgcmVjdHMgZm9yIHRoZXNlIHNjcm9sbGluZyBjb250YWluZXJzXG4gICAgLy8gZXZlcnkgdGltZSwgd2Ugc2hvdWxkIGJlIGFibGUgdG8gdXNlIHRoZSBzY3JvbGxUb3Agb2YgdGhlIGNvbnRhaW5lcnMgaWYgdGhlIHNpemUgb2YgdGhvc2VcbiAgICAvLyBjb250YWluZXJzIGhhc24ndCBjaGFuZ2VkLlxuICAgIGNvbnN0IHNjcm9sbENvbnRhaW5lckJvdW5kcyA9IHRoaXMuX3Njcm9sbGFibGVzLm1hcChzY3JvbGxhYmxlID0+IHtcbiAgICAgIHJldHVybiBzY3JvbGxhYmxlLmdldEVsZW1lbnRSZWYoKS5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGlzT3JpZ2luQ2xpcHBlZDogaXNFbGVtZW50Q2xpcHBlZEJ5U2Nyb2xsaW5nKG9yaWdpbkJvdW5kcywgc2Nyb2xsQ29udGFpbmVyQm91bmRzKSxcbiAgICAgIGlzT3JpZ2luT3V0c2lkZVZpZXc6IGlzRWxlbWVudFNjcm9sbGVkT3V0c2lkZVZpZXcob3JpZ2luQm91bmRzLCBzY3JvbGxDb250YWluZXJCb3VuZHMpLFxuICAgICAgaXNPdmVybGF5Q2xpcHBlZDogaXNFbGVtZW50Q2xpcHBlZEJ5U2Nyb2xsaW5nKG92ZXJsYXlCb3VuZHMsIHNjcm9sbENvbnRhaW5lckJvdW5kcyksXG4gICAgICBpc092ZXJsYXlPdXRzaWRlVmlldzogaXNFbGVtZW50U2Nyb2xsZWRPdXRzaWRlVmlldyhvdmVybGF5Qm91bmRzLCBzY3JvbGxDb250YWluZXJCb3VuZHMpLFxuICAgIH07XG4gIH1cblxuICAvKiogU3VidHJhY3RzIHRoZSBhbW91bnQgdGhhdCBhbiBlbGVtZW50IGlzIG92ZXJmbG93aW5nIG9uIGFuIGF4aXMgZnJvbSBpdHMgbGVuZ3RoLiAqL1xuICBwcml2YXRlIF9zdWJ0cmFjdE92ZXJmbG93cyhsZW5ndGg6IG51bWJlciwgLi4ub3ZlcmZsb3dzOiBudW1iZXJbXSk6IG51bWJlciB7XG4gICAgcmV0dXJuIG92ZXJmbG93cy5yZWR1Y2UoKGN1cnJlbnRWYWx1ZTogbnVtYmVyLCBjdXJyZW50T3ZlcmZsb3c6IG51bWJlcikgPT4ge1xuICAgICAgcmV0dXJuIGN1cnJlbnRWYWx1ZSAtIE1hdGgubWF4KGN1cnJlbnRPdmVyZmxvdywgMCk7XG4gICAgfSwgbGVuZ3RoKTtcbiAgfVxuXG4gIC8qKiBOYXJyb3dzIHRoZSBnaXZlbiB2aWV3cG9ydCByZWN0IGJ5IHRoZSBjdXJyZW50IF92aWV3cG9ydE1hcmdpbi4gKi9cbiAgcHJpdmF0ZSBfZ2V0TmFycm93ZWRWaWV3cG9ydFJlY3QoKTogRGltZW5zaW9ucyB7XG4gICAgLy8gV2UgcmVjYWxjdWxhdGUgdGhlIHZpZXdwb3J0IHJlY3QgaGVyZSBvdXJzZWx2ZXMsIHJhdGhlciB0aGFuIHVzaW5nIHRoZSBWaWV3cG9ydFJ1bGVyLFxuICAgIC8vIGJlY2F1c2Ugd2Ugd2FudCB0byB1c2UgdGhlIGBjbGllbnRXaWR0aGAgYW5kIGBjbGllbnRIZWlnaHRgIGFzIHRoZSBiYXNlLiBUaGUgZGlmZmVyZW5jZVxuICAgIC8vIGJlaW5nIHRoYXQgdGhlIGNsaWVudCBwcm9wZXJ0aWVzIGRvbid0IGluY2x1ZGUgdGhlIHNjcm9sbGJhciwgYXMgb3Bwb3NlZCB0byBgaW5uZXJXaWR0aGBcbiAgICAvLyBhbmQgYGlubmVySGVpZ2h0YCB0aGF0IGRvLiBUaGlzIGlzIG5lY2Vzc2FyeSwgYmVjYXVzZSB0aGUgb3ZlcmxheSBjb250YWluZXIgdXNlc1xuICAgIC8vIDEwMCUgYHdpZHRoYCBhbmQgYGhlaWdodGAgd2hpY2ggZG9uJ3QgaW5jbHVkZSB0aGUgc2Nyb2xsYmFyIGVpdGhlci5cbiAgICBjb25zdCB3aWR0aCA9IHRoaXMuX2RvY3VtZW50LmRvY3VtZW50RWxlbWVudCEuY2xpZW50V2lkdGg7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5fZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IS5jbGllbnRIZWlnaHQ7XG4gICAgY29uc3Qgc2Nyb2xsUG9zaXRpb24gPSB0aGlzLl92aWV3cG9ydFJ1bGVyLmdldFZpZXdwb3J0U2Nyb2xsUG9zaXRpb24oKTtcblxuICAgIHJldHVybiB7XG4gICAgICB0b3A6IHNjcm9sbFBvc2l0aW9uLnRvcCArIHRoaXMuX3ZpZXdwb3J0TWFyZ2luLFxuICAgICAgbGVmdDogc2Nyb2xsUG9zaXRpb24ubGVmdCArIHRoaXMuX3ZpZXdwb3J0TWFyZ2luLFxuICAgICAgcmlnaHQ6IHNjcm9sbFBvc2l0aW9uLmxlZnQgKyB3aWR0aCAtIHRoaXMuX3ZpZXdwb3J0TWFyZ2luLFxuICAgICAgYm90dG9tOiBzY3JvbGxQb3NpdGlvbi50b3AgKyBoZWlnaHQgLSB0aGlzLl92aWV3cG9ydE1hcmdpbixcbiAgICAgIHdpZHRoOiB3aWR0aCAtIDIgKiB0aGlzLl92aWV3cG9ydE1hcmdpbixcbiAgICAgIGhlaWdodDogaGVpZ2h0IC0gMiAqIHRoaXMuX3ZpZXdwb3J0TWFyZ2luLFxuICAgIH07XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgd2UncmUgZGVhbGluZyB3aXRoIGFuIFJUTCBjb250ZXh0ICovXG4gIHByaXZhdGUgX2lzUnRsKCkge1xuICAgIHJldHVybiB0aGlzLl9vdmVybGF5UmVmLmdldERpcmVjdGlvbigpID09PSAncnRsJztcbiAgfVxuXG4gIC8qKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIG92ZXJsYXkgdXNlcyBleGFjdCBvciBmbGV4aWJsZSBwb3NpdGlvbmluZy4gKi9cbiAgcHJpdmF0ZSBfaGFzRXhhY3RQb3NpdGlvbigpIHtcbiAgICByZXR1cm4gIXRoaXMuX2hhc0ZsZXhpYmxlRGltZW5zaW9ucyB8fCB0aGlzLl9pc1B1c2hlZDtcbiAgfVxuXG4gIC8qKiBSZXRyaWV2ZXMgdGhlIG9mZnNldCBvZiBhIHBvc2l0aW9uIGFsb25nIHRoZSB4IG9yIHkgYXhpcy4gKi9cbiAgcHJpdmF0ZSBfZ2V0T2Zmc2V0KHBvc2l0aW9uOiBDb25uZWN0ZWRQb3NpdGlvbiwgYXhpczogJ3gnIHwgJ3knKSB7XG4gICAgaWYgKGF4aXMgPT09ICd4Jykge1xuICAgICAgLy8gV2UgZG9uJ3QgZG8gc29tZXRoaW5nIGxpa2UgYHBvc2l0aW9uWydvZmZzZXQnICsgYXhpc11gIGluXG4gICAgICAvLyBvcmRlciB0byBhdm9pZCBicmVraW5nIG1pbmlmaWVycyB0aGF0IHJlbmFtZSBwcm9wZXJ0aWVzLlxuICAgICAgcmV0dXJuIHBvc2l0aW9uLm9mZnNldFggPT0gbnVsbCA/IHRoaXMuX29mZnNldFggOiBwb3NpdGlvbi5vZmZzZXRYO1xuICAgIH1cblxuICAgIHJldHVybiBwb3NpdGlvbi5vZmZzZXRZID09IG51bGwgPyB0aGlzLl9vZmZzZXRZIDogcG9zaXRpb24ub2Zmc2V0WTtcbiAgfVxuXG4gIC8qKiBWYWxpZGF0ZXMgdGhhdCB0aGUgY3VycmVudCBwb3NpdGlvbiBtYXRjaCB0aGUgZXhwZWN0ZWQgdmFsdWVzLiAqL1xuICBwcml2YXRlIF92YWxpZGF0ZVBvc2l0aW9ucygpOiB2b2lkIHtcbiAgICBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICBpZiAoIXRoaXMuX3ByZWZlcnJlZFBvc2l0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ0ZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneTogQXQgbGVhc3Qgb25lIHBvc2l0aW9uIGlzIHJlcXVpcmVkLicpO1xuICAgICAgfVxuXG4gICAgICAvLyBUT0RPKGNyaXNiZXRvKTogcmVtb3ZlIHRoZXNlIG9uY2UgQW5ndWxhcidzIHRlbXBsYXRlIHR5cGVcbiAgICAgIC8vIGNoZWNraW5nIGlzIGFkdmFuY2VkIGVub3VnaCB0byBjYXRjaCB0aGVzZSBjYXNlcy5cbiAgICAgIHRoaXMuX3ByZWZlcnJlZFBvc2l0aW9ucy5mb3JFYWNoKHBhaXIgPT4ge1xuICAgICAgICB2YWxpZGF0ZUhvcml6b250YWxQb3NpdGlvbignb3JpZ2luWCcsIHBhaXIub3JpZ2luWCk7XG4gICAgICAgIHZhbGlkYXRlVmVydGljYWxQb3NpdGlvbignb3JpZ2luWScsIHBhaXIub3JpZ2luWSk7XG4gICAgICAgIHZhbGlkYXRlSG9yaXpvbnRhbFBvc2l0aW9uKCdvdmVybGF5WCcsIHBhaXIub3ZlcmxheVgpO1xuICAgICAgICB2YWxpZGF0ZVZlcnRpY2FsUG9zaXRpb24oJ292ZXJsYXlZJywgcGFpci5vdmVybGF5WSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKiogQWRkcyBhIHNpbmdsZSBDU1MgY2xhc3Mgb3IgYW4gYXJyYXkgb2YgY2xhc3NlcyBvbiB0aGUgb3ZlcmxheSBwYW5lbC4gKi9cbiAgcHJpdmF0ZSBfYWRkUGFuZWxDbGFzc2VzKGNzc0NsYXNzZXM6IHN0cmluZyB8IHN0cmluZ1tdKSB7XG4gICAgaWYgKHRoaXMuX3BhbmUpIHtcbiAgICAgIGNvZXJjZUFycmF5KGNzc0NsYXNzZXMpLmZvckVhY2goY3NzQ2xhc3MgPT4ge1xuICAgICAgICBpZiAoY3NzQ2xhc3MgIT09ICcnICYmIHRoaXMuX2FwcGxpZWRQYW5lbENsYXNzZXMuaW5kZXhPZihjc3NDbGFzcykgPT09IC0xKSB7XG4gICAgICAgICAgdGhpcy5fYXBwbGllZFBhbmVsQ2xhc3Nlcy5wdXNoKGNzc0NsYXNzKTtcbiAgICAgICAgICB0aGlzLl9wYW5lLmNsYXNzTGlzdC5hZGQoY3NzQ2xhc3MpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKiogQ2xlYXJzIHRoZSBjbGFzc2VzIHRoYXQgdGhlIHBvc2l0aW9uIHN0cmF0ZWd5IGhhcyBhcHBsaWVkIGZyb20gdGhlIG92ZXJsYXkgcGFuZWwuICovXG4gIHByaXZhdGUgX2NsZWFyUGFuZWxDbGFzc2VzKCkge1xuICAgIGlmICh0aGlzLl9wYW5lKSB7XG4gICAgICB0aGlzLl9hcHBsaWVkUGFuZWxDbGFzc2VzLmZvckVhY2goY3NzQ2xhc3MgPT4ge1xuICAgICAgICB0aGlzLl9wYW5lLmNsYXNzTGlzdC5yZW1vdmUoY3NzQ2xhc3MpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9hcHBsaWVkUGFuZWxDbGFzc2VzID0gW107XG4gICAgfVxuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIENsaWVudFJlY3Qgb2YgdGhlIGN1cnJlbnQgb3JpZ2luLiAqL1xuICBwcml2YXRlIF9nZXRPcmlnaW5SZWN0KCk6IERpbWVuc2lvbnMge1xuICAgIGNvbnN0IG9yaWdpbiA9IHRoaXMuX29yaWdpbjtcblxuICAgIGlmIChvcmlnaW4gaW5zdGFuY2VvZiBFbGVtZW50UmVmKSB7XG4gICAgICByZXR1cm4gb3JpZ2luLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgZm9yIEVsZW1lbnQgc28gU1ZHIGVsZW1lbnRzIGFyZSBhbHNvIHN1cHBvcnRlZC5cbiAgICBpZiAob3JpZ2luIGluc3RhbmNlb2YgRWxlbWVudCkge1xuICAgICAgcmV0dXJuIG9yaWdpbi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICB9XG5cbiAgICBjb25zdCB3aWR0aCA9IG9yaWdpbi53aWR0aCB8fCAwO1xuICAgIGNvbnN0IGhlaWdodCA9IG9yaWdpbi5oZWlnaHQgfHwgMDtcblxuICAgIC8vIElmIHRoZSBvcmlnaW4gaXMgYSBwb2ludCwgcmV0dXJuIGEgY2xpZW50IHJlY3QgYXMgaWYgaXQgd2FzIGEgMHgwIGVsZW1lbnQgYXQgdGhlIHBvaW50LlxuICAgIHJldHVybiB7XG4gICAgICB0b3A6IG9yaWdpbi55LFxuICAgICAgYm90dG9tOiBvcmlnaW4ueSArIGhlaWdodCxcbiAgICAgIGxlZnQ6IG9yaWdpbi54LFxuICAgICAgcmlnaHQ6IG9yaWdpbi54ICsgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgICB3aWR0aCxcbiAgICB9O1xuICB9XG59XG5cbi8qKiBBIHNpbXBsZSAoeCwgeSkgY29vcmRpbmF0ZS4gKi9cbmludGVyZmFjZSBQb2ludCB7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xufVxuXG4vKiogUmVjb3JkIG9mIG1lYXN1cmVtZW50cyBmb3IgaG93IGFuIG92ZXJsYXkgKGF0IGEgZ2l2ZW4gcG9zaXRpb24pIGZpdHMgaW50byB0aGUgdmlld3BvcnQuICovXG5pbnRlcmZhY2UgT3ZlcmxheUZpdCB7XG4gIC8qKiBXaGV0aGVyIHRoZSBvdmVybGF5IGZpdHMgY29tcGxldGVseSBpbiB0aGUgdmlld3BvcnQuICovXG4gIGlzQ29tcGxldGVseVdpdGhpblZpZXdwb3J0OiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBvdmVybGF5IGZpdHMgaW4gdGhlIHZpZXdwb3J0IG9uIHRoZSB5LWF4aXMuICovXG4gIGZpdHNJblZpZXdwb3J0VmVydGljYWxseTogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGUgb3ZlcmxheSBmaXRzIGluIHRoZSB2aWV3cG9ydCBvbiB0aGUgeC1heGlzLiAqL1xuICBmaXRzSW5WaWV3cG9ydEhvcml6b250YWxseTogYm9vbGVhbjtcblxuICAvKiogVGhlIHRvdGFsIHZpc2libGUgYXJlYSAoaW4gcHheMikgb2YgdGhlIG92ZXJsYXkgaW5zaWRlIHRoZSB2aWV3cG9ydC4gKi9cbiAgdmlzaWJsZUFyZWE6IG51bWJlcjtcbn1cblxuLyoqIFJlY29yZCBvZiB0aGUgbWVhc3VyZW1lbnRzIGRldGVybWluaW5nIHdoZXRoZXIgYW4gb3ZlcmxheSB3aWxsIGZpdCBpbiBhIHNwZWNpZmljIHBvc2l0aW9uLiAqL1xuaW50ZXJmYWNlIEZhbGxiYWNrUG9zaXRpb24ge1xuICBwb3NpdGlvbjogQ29ubmVjdGVkUG9zaXRpb247XG4gIG9yaWdpblBvaW50OiBQb2ludDtcbiAgb3ZlcmxheVBvaW50OiBQb2ludDtcbiAgb3ZlcmxheUZpdDogT3ZlcmxheUZpdDtcbiAgb3ZlcmxheVJlY3Q6IERpbWVuc2lvbnM7XG59XG5cbi8qKiBQb3NpdGlvbiBhbmQgc2l6ZSBvZiB0aGUgb3ZlcmxheSBzaXppbmcgd3JhcHBlciBmb3IgYSBzcGVjaWZpYyBwb3NpdGlvbi4gKi9cbmludGVyZmFjZSBCb3VuZGluZ0JveFJlY3Qge1xuICB0b3A6IG51bWJlcjtcbiAgbGVmdDogbnVtYmVyO1xuICBib3R0b206IG51bWJlcjtcbiAgcmlnaHQ6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIHdpZHRoOiBudW1iZXI7XG59XG5cbi8qKiBSZWNvcmQgb2YgbWVhc3VyZXMgZGV0ZXJtaW5pbmcgaG93IHdlbGwgYSBnaXZlbiBwb3NpdGlvbiB3aWxsIGZpdCB3aXRoIGZsZXhpYmxlIGRpbWVuc2lvbnMuICovXG5pbnRlcmZhY2UgRmxleGlibGVGaXQge1xuICBwb3NpdGlvbjogQ29ubmVjdGVkUG9zaXRpb247XG4gIG9yaWdpbjogUG9pbnQ7XG4gIG92ZXJsYXlSZWN0OiBEaW1lbnNpb25zO1xuICBib3VuZGluZ0JveFJlY3Q6IEJvdW5kaW5nQm94UmVjdDtcbn1cblxuLyoqIEEgY29ubmVjdGVkIHBvc2l0aW9uIGFzIHNwZWNpZmllZCBieSB0aGUgdXNlci4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29ubmVjdGVkUG9zaXRpb24ge1xuICBvcmlnaW5YOiAnc3RhcnQnIHwgJ2NlbnRlcicgfCAnZW5kJztcbiAgb3JpZ2luWTogJ3RvcCcgfCAnY2VudGVyJyB8ICdib3R0b20nO1xuXG4gIG92ZXJsYXlYOiAnc3RhcnQnIHwgJ2NlbnRlcicgfCAnZW5kJztcbiAgb3ZlcmxheVk6ICd0b3AnIHwgJ2NlbnRlcicgfCAnYm90dG9tJztcblxuICB3ZWlnaHQ/OiBudW1iZXI7XG4gIG9mZnNldFg/OiBudW1iZXI7XG4gIG9mZnNldFk/OiBudW1iZXI7XG4gIHBhbmVsQ2xhc3M/OiBzdHJpbmcgfCBzdHJpbmdbXTtcbn1cblxuLyoqIFNoYWxsb3ctZXh0ZW5kcyBhIHN0eWxlc2hlZXQgb2JqZWN0IHdpdGggYW5vdGhlciBzdHlsZXNoZWV0IG9iamVjdC4gKi9cbmZ1bmN0aW9uIGV4dGVuZFN0eWxlcyhcbiAgZGVzdGluYXRpb246IENTU1N0eWxlRGVjbGFyYXRpb24sXG4gIHNvdXJjZTogQ1NTU3R5bGVEZWNsYXJhdGlvbixcbik6IENTU1N0eWxlRGVjbGFyYXRpb24ge1xuICBmb3IgKGxldCBrZXkgaW4gc291cmNlKSB7XG4gICAgaWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICBkZXN0aW5hdGlvbltrZXldID0gc291cmNlW2tleV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRlc3RpbmF0aW9uO1xufVxuXG4vKipcbiAqIEV4dHJhY3RzIHRoZSBwaXhlbCB2YWx1ZSBhcyBhIG51bWJlciBmcm9tIGEgdmFsdWUsIGlmIGl0J3MgYSBudW1iZXJcbiAqIG9yIGEgQ1NTIHBpeGVsIHN0cmluZyAoZS5nLiBgMTMzN3B4YCkuIE90aGVyd2lzZSByZXR1cm5zIG51bGwuXG4gKi9cbmZ1bmN0aW9uIGdldFBpeGVsVmFsdWUoaW5wdXQ6IG51bWJlciB8IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBudW1iZXIgfCBudWxsIHtcbiAgaWYgKHR5cGVvZiBpbnB1dCAhPT0gJ251bWJlcicgJiYgaW5wdXQgIT0gbnVsbCkge1xuICAgIGNvbnN0IFt2YWx1ZSwgdW5pdHNdID0gaW5wdXQuc3BsaXQoY3NzVW5pdFBhdHRlcm4pO1xuICAgIHJldHVybiAhdW5pdHMgfHwgdW5pdHMgPT09ICdweCcgPyBwYXJzZUZsb2F0KHZhbHVlKSA6IG51bGw7XG4gIH1cblxuICByZXR1cm4gaW5wdXQgfHwgbnVsbDtcbn1cblxuLyoqXG4gKiBHZXRzIGEgdmVyc2lvbiBvZiBhbiBlbGVtZW50J3MgYm91bmRpbmcgYENsaWVudFJlY3RgIHdoZXJlIGFsbCB0aGUgdmFsdWVzIGFyZSByb3VuZGVkIGRvd24gdG9cbiAqIHRoZSBuZWFyZXN0IHBpeGVsLiBUaGlzIGFsbG93cyB1cyB0byBhY2NvdW50IGZvciB0aGUgY2FzZXMgd2hlcmUgdGhlcmUgbWF5IGJlIHN1Yi1waXhlbFxuICogZGV2aWF0aW9ucyBpbiB0aGUgYENsaWVudFJlY3RgIHJldHVybmVkIGJ5IHRoZSBicm93c2VyIChlLmcuIHdoZW4gem9vbWVkIGluIHdpdGggYSBwZXJjZW50YWdlXG4gKiBzaXplLCBzZWUgIzIxMzUwKS5cbiAqL1xuZnVuY3Rpb24gZ2V0Um91bmRlZEJvdW5kaW5nQ2xpZW50UmVjdChjbGllbnRSZWN0OiBEaW1lbnNpb25zKTogRGltZW5zaW9ucyB7XG4gIHJldHVybiB7XG4gICAgdG9wOiBNYXRoLmZsb29yKGNsaWVudFJlY3QudG9wKSxcbiAgICByaWdodDogTWF0aC5mbG9vcihjbGllbnRSZWN0LnJpZ2h0KSxcbiAgICBib3R0b206IE1hdGguZmxvb3IoY2xpZW50UmVjdC5ib3R0b20pLFxuICAgIGxlZnQ6IE1hdGguZmxvb3IoY2xpZW50UmVjdC5sZWZ0KSxcbiAgICB3aWR0aDogTWF0aC5mbG9vcihjbGllbnRSZWN0LndpZHRoKSxcbiAgICBoZWlnaHQ6IE1hdGguZmxvb3IoY2xpZW50UmVjdC5oZWlnaHQpLFxuICB9O1xufVxuIl19