import { __awaiter } from 'tslib';
import { ComponentHarness, HarnessPredicate, parallel } from '@angular/cdk/testing';
import { coerceNumberProperty, coerceBooleanProperty } from '@angular/cdk/coercion';

/** Harness for interacting with a standard mat-slider in tests. */
class MatSliderHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._textLabel = this.locatorFor('.mat-slider-thumb-label-text');
        this._wrapper = this.locatorFor('.mat-slider-wrapper');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatSliderHarness` that meets
     * certain criteria.
     * @param options Options for filtering which slider instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatSliderHarness, options);
    }
    /** Gets the slider's id. */
    getId() {
        return __awaiter(this, void 0, void 0, function* () {
            const id = yield (yield this.host()).getAttribute('id');
            // In case no id has been specified, the "id" property always returns
            // an empty string. To make this method more explicit, we return null.
            return id !== '' ? id : null;
        });
    }
    /**
     * Gets the current display value of the slider. Returns a null promise if the thumb label is
     * disabled.
     */
    getDisplayValue() {
        return __awaiter(this, void 0, void 0, function* () {
            const [host, textLabel] = yield parallel(() => [this.host(), this._textLabel()]);
            if (yield host.hasClass('mat-slider-thumb-label-showing')) {
                return textLabel.text();
            }
            return null;
        });
    }
    /** Gets the current percentage value of the slider. */
    getPercentage() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._calculatePercentage(yield this.getValue());
        });
    }
    /** Gets the current value of the slider. */
    getValue() {
        return __awaiter(this, void 0, void 0, function* () {
            return coerceNumberProperty(yield (yield this.host()).getAttribute('aria-valuenow'));
        });
    }
    /** Gets the maximum value of the slider. */
    getMaxValue() {
        return __awaiter(this, void 0, void 0, function* () {
            return coerceNumberProperty(yield (yield this.host()).getAttribute('aria-valuemax'));
        });
    }
    /** Gets the minimum value of the slider. */
    getMinValue() {
        return __awaiter(this, void 0, void 0, function* () {
            return coerceNumberProperty(yield (yield this.host()).getAttribute('aria-valuemin'));
        });
    }
    /** Whether the slider is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            const disabled = (yield this.host()).getAttribute('aria-disabled');
            return coerceBooleanProperty(yield disabled);
        });
    }
    /** Gets the orientation of the slider. */
    getOrientation() {
        return __awaiter(this, void 0, void 0, function* () {
            // "aria-orientation" will always be set to either "horizontal" or "vertical".
            return (yield this.host()).getAttribute('aria-orientation');
        });
    }
    /**
     * Sets the value of the slider by clicking on the slider track.
     *
     * Note that in rare cases the value cannot be set to the exact specified value. This
     * can happen if not every value of the slider maps to a single pixel that could be
     * clicked using mouse interaction. In such cases consider using the keyboard to
     * select the given value or expand the slider's size for a better user experience.
     */
    setValue(value) {
        return __awaiter(this, void 0, void 0, function* () {
            const [sliderEl, wrapperEl, orientation] = yield parallel(() => [
                this.host(),
                this._wrapper(),
                this.getOrientation(),
            ]);
            let percentage = yield this._calculatePercentage(value);
            const { height, width } = yield wrapperEl.getDimensions();
            const isVertical = orientation === 'vertical';
            // In case the slider is inverted in LTR mode or not inverted in RTL mode,
            // we need to invert the percentage so that the proper value is set.
            if (yield sliderEl.hasClass('mat-slider-invert-mouse-coords')) {
                percentage = 1 - percentage;
            }
            // We need to round the new coordinates because creating fake DOM
            // events will cause the coordinates to be rounded down.
            const relativeX = isVertical ? 0 : Math.round(width * percentage);
            const relativeY = isVertical ? Math.round(height * percentage) : 0;
            yield wrapperEl.click(relativeX, relativeY);
        });
    }
    /** Focuses the slider. */
    focus() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).focus();
        });
    }
    /** Blurs the slider. */
    blur() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).blur();
        });
    }
    /** Whether the slider is focused. */
    isFocused() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).isFocused();
        });
    }
    /** Calculates the percentage of the given value. */
    _calculatePercentage(value) {
        return __awaiter(this, void 0, void 0, function* () {
            const [min, max] = yield parallel(() => [this.getMinValue(), this.getMaxValue()]);
            return (value - min) / (max - min);
        });
    }
}
/** The selector for the host element of a `MatSlider` instance. */
MatSliderHarness.hostSelector = '.mat-slider';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

export { MatSliderHarness };
//# sourceMappingURL=testing.mjs.map
