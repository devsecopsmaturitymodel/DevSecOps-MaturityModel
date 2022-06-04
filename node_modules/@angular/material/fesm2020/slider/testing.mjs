import { ComponentHarness, HarnessPredicate, parallel } from '@angular/cdk/testing';
import { coerceNumberProperty, coerceBooleanProperty } from '@angular/cdk/coercion';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
    async getId() {
        const id = await (await this.host()).getAttribute('id');
        // In case no id has been specified, the "id" property always returns
        // an empty string. To make this method more explicit, we return null.
        return id !== '' ? id : null;
    }
    /**
     * Gets the current display value of the slider. Returns a null promise if the thumb label is
     * disabled.
     */
    async getDisplayValue() {
        const [host, textLabel] = await parallel(() => [this.host(), this._textLabel()]);
        if (await host.hasClass('mat-slider-thumb-label-showing')) {
            return textLabel.text();
        }
        return null;
    }
    /** Gets the current percentage value of the slider. */
    async getPercentage() {
        return this._calculatePercentage(await this.getValue());
    }
    /** Gets the current value of the slider. */
    async getValue() {
        return coerceNumberProperty(await (await this.host()).getAttribute('aria-valuenow'));
    }
    /** Gets the maximum value of the slider. */
    async getMaxValue() {
        return coerceNumberProperty(await (await this.host()).getAttribute('aria-valuemax'));
    }
    /** Gets the minimum value of the slider. */
    async getMinValue() {
        return coerceNumberProperty(await (await this.host()).getAttribute('aria-valuemin'));
    }
    /** Whether the slider is disabled. */
    async isDisabled() {
        const disabled = (await this.host()).getAttribute('aria-disabled');
        return coerceBooleanProperty(await disabled);
    }
    /** Gets the orientation of the slider. */
    async getOrientation() {
        // "aria-orientation" will always be set to either "horizontal" or "vertical".
        return (await this.host()).getAttribute('aria-orientation');
    }
    /**
     * Sets the value of the slider by clicking on the slider track.
     *
     * Note that in rare cases the value cannot be set to the exact specified value. This
     * can happen if not every value of the slider maps to a single pixel that could be
     * clicked using mouse interaction. In such cases consider using the keyboard to
     * select the given value or expand the slider's size for a better user experience.
     */
    async setValue(value) {
        const [sliderEl, wrapperEl, orientation] = await parallel(() => [
            this.host(),
            this._wrapper(),
            this.getOrientation(),
        ]);
        let percentage = await this._calculatePercentage(value);
        const { height, width } = await wrapperEl.getDimensions();
        const isVertical = orientation === 'vertical';
        // In case the slider is inverted in LTR mode or not inverted in RTL mode,
        // we need to invert the percentage so that the proper value is set.
        if (await sliderEl.hasClass('mat-slider-invert-mouse-coords')) {
            percentage = 1 - percentage;
        }
        // We need to round the new coordinates because creating fake DOM
        // events will cause the coordinates to be rounded down.
        const relativeX = isVertical ? 0 : Math.round(width * percentage);
        const relativeY = isVertical ? Math.round(height * percentage) : 0;
        await wrapperEl.click(relativeX, relativeY);
    }
    /** Focuses the slider. */
    async focus() {
        return (await this.host()).focus();
    }
    /** Blurs the slider. */
    async blur() {
        return (await this.host()).blur();
    }
    /** Whether the slider is focused. */
    async isFocused() {
        return (await this.host()).isFocused();
    }
    /** Calculates the percentage of the given value. */
    async _calculatePercentage(value) {
        const [min, max] = await parallel(() => [this.getMinValue(), this.getMaxValue()]);
        return (value - min) / (max - min);
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
