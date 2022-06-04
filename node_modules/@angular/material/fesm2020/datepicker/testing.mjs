import { HarnessPredicate, ComponentHarness, parallel, TestKey } from '@angular/cdk/testing';
import { MatFormFieldControlHarness } from '@angular/material/form-field/testing/control';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

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
/** Sets up the filter predicates for a datepicker input harness. */
function getInputPredicate(type, options) {
    return new HarnessPredicate(type, options)
        .addOption('value', options.value, (harness, value) => {
        return HarnessPredicate.stringMatches(harness.getValue(), value);
    })
        .addOption('placeholder', options.placeholder, (harness, placeholder) => {
        return HarnessPredicate.stringMatches(harness.getPlaceholder(), placeholder);
    });
}
/** Base class for datepicker input harnesses. */
class MatDatepickerInputHarnessBase extends MatFormFieldControlHarness {
    /** Whether the input is disabled. */
    async isDisabled() {
        return (await this.host()).getProperty('disabled');
    }
    /** Whether the input is required. */
    async isRequired() {
        return (await this.host()).getProperty('required');
    }
    /** Gets the value of the input. */
    async getValue() {
        // The "value" property of the native input is always defined.
        return await (await this.host()).getProperty('value');
    }
    /**
     * Sets the value of the input. The value will be set by simulating
     * keypresses that correspond to the given value.
     */
    async setValue(newValue) {
        const inputEl = await this.host();
        await inputEl.clear();
        // We don't want to send keys for the value if the value is an empty
        // string in order to clear the value. Sending keys with an empty string
        // still results in unnecessary focus events.
        if (newValue) {
            await inputEl.sendKeys(newValue);
        }
        await inputEl.dispatchEvent('change');
    }
    /** Gets the placeholder of the input. */
    async getPlaceholder() {
        return await (await this.host()).getProperty('placeholder');
    }
    /**
     * Focuses the input and returns a promise that indicates when the
     * action is complete.
     */
    async focus() {
        return (await this.host()).focus();
    }
    /**
     * Blurs the input and returns a promise that indicates when the
     * action is complete.
     */
    async blur() {
        return (await this.host()).blur();
    }
    /** Whether the input is focused. */
    async isFocused() {
        return (await this.host()).isFocused();
    }
    /** Gets the formatted minimum date for the input's value. */
    async getMin() {
        return (await this.host()).getAttribute('min');
    }
    /** Gets the formatted maximum date for the input's value. */
    async getMax() {
        return (await this.host()).getAttribute('max');
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard Material calendar cell in tests. */
class MatCalendarCellHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        /** Reference to the inner content element inside the cell. */
        this._content = this.locatorFor('.mat-calendar-body-cell-content');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatCalendarCellHarness`
     * that meets certain criteria.
     * @param options Options for filtering which cell instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatCalendarCellHarness, options)
            .addOption('text', options.text, (harness, text) => {
            return HarnessPredicate.stringMatches(harness.getText(), text);
        })
            .addOption('selected', options.selected, async (harness, selected) => {
            return (await harness.isSelected()) === selected;
        })
            .addOption('active', options.active, async (harness, active) => {
            return (await harness.isActive()) === active;
        })
            .addOption('disabled', options.disabled, async (harness, disabled) => {
            return (await harness.isDisabled()) === disabled;
        })
            .addOption('today', options.today, async (harness, today) => {
            return (await harness.isToday()) === today;
        })
            .addOption('inRange', options.inRange, async (harness, inRange) => {
            return (await harness.isInRange()) === inRange;
        })
            .addOption('inComparisonRange', options.inComparisonRange, async (harness, inComparisonRange) => {
            return (await harness.isInComparisonRange()) === inComparisonRange;
        })
            .addOption('inPreviewRange', options.inPreviewRange, async (harness, inPreviewRange) => {
            return (await harness.isInPreviewRange()) === inPreviewRange;
        });
    }
    /** Gets the text of the calendar cell. */
    async getText() {
        return (await this._content()).text();
    }
    /** Gets the aria-label of the calendar cell. */
    async getAriaLabel() {
        // We're guaranteed for the `aria-label` to be defined
        // since this is a private element that we control.
        return (await this.host()).getAttribute('aria-label');
    }
    /** Whether the cell is selected. */
    async isSelected() {
        const host = await this.host();
        return (await host.getAttribute('aria-pressed')) === 'true';
    }
    /** Whether the cell is disabled. */
    async isDisabled() {
        return this._hasState('disabled');
    }
    /** Whether the cell is currently activated using keyboard navigation. */
    async isActive() {
        return this._hasState('active');
    }
    /** Whether the cell represents today's date. */
    async isToday() {
        return (await this._content()).hasClass('mat-calendar-body-today');
    }
    /** Selects the calendar cell. Won't do anything if the cell is disabled. */
    async select() {
        return (await this.host()).click();
    }
    /** Hovers over the calendar cell. */
    async hover() {
        return (await this.host()).hover();
    }
    /** Moves the mouse away from the calendar cell. */
    async mouseAway() {
        return (await this.host()).mouseAway();
    }
    /** Focuses the calendar cell. */
    async focus() {
        return (await this.host()).focus();
    }
    /** Removes focus from the calendar cell. */
    async blur() {
        return (await this.host()).blur();
    }
    /** Whether the cell is the start of the main range. */
    async isRangeStart() {
        return this._hasState('range-start');
    }
    /** Whether the cell is the end of the main range. */
    async isRangeEnd() {
        return this._hasState('range-end');
    }
    /** Whether the cell is part of the main range. */
    async isInRange() {
        return this._hasState('in-range');
    }
    /** Whether the cell is the start of the comparison range. */
    async isComparisonRangeStart() {
        return this._hasState('comparison-start');
    }
    /** Whether the cell is the end of the comparison range. */
    async isComparisonRangeEnd() {
        return this._hasState('comparison-end');
    }
    /** Whether the cell is inside of the comparison range. */
    async isInComparisonRange() {
        return this._hasState('in-comparison-range');
    }
    /** Whether the cell is the start of the preview range. */
    async isPreviewRangeStart() {
        return this._hasState('preview-start');
    }
    /** Whether the cell is the end of the preview range. */
    async isPreviewRangeEnd() {
        return this._hasState('preview-end');
    }
    /** Whether the cell is inside of the preview range. */
    async isInPreviewRange() {
        return this._hasState('in-preview');
    }
    /** Returns whether the cell has a particular CSS class-based state. */
    async _hasState(name) {
        return (await this.host()).hasClass(`mat-calendar-body-${name}`);
    }
}
MatCalendarCellHarness.hostSelector = '.mat-calendar-body-cell';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard Material calendar in tests. */
class MatCalendarHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        /** Queries for the calendar's period toggle button. */
        this._periodButton = this.locatorFor('.mat-calendar-period-button');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatCalendarHarness`
     * that meets certain criteria.
     * @param options Options for filtering which calendar instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatCalendarHarness, options);
    }
    /**
     * Gets a list of cells inside the calendar.
     * @param filter Optionally filters which cells are included.
     */
    async getCells(filter = {}) {
        return this.locatorForAll(MatCalendarCellHarness.with(filter))();
    }
    /** Gets the current view that is being shown inside the calendar. */
    async getCurrentView() {
        if (await this.locatorForOptional('mat-multi-year-view')()) {
            return 2 /* MULTI_YEAR */;
        }
        if (await this.locatorForOptional('mat-year-view')()) {
            return 1 /* YEAR */;
        }
        return 0 /* MONTH */;
    }
    /** Gets the label of the current calendar view. */
    async getCurrentViewLabel() {
        return (await this._periodButton()).text();
    }
    /** Changes the calendar view by clicking on the view toggle button. */
    async changeView() {
        return (await this._periodButton()).click();
    }
    /** Goes to the next page of the current view (e.g. next month when inside the month view). */
    async next() {
        return (await this.locatorFor('.mat-calendar-next-button')()).click();
    }
    /**
     * Goes to the previous page of the current view
     * (e.g. previous month when inside the month view).
     */
    async previous() {
        return (await this.locatorFor('.mat-calendar-previous-button')()).click();
    }
    /**
     * Selects a cell in the current calendar view.
     * @param filter An optional filter to apply to the cells. The first cell matching the filter
     *     will be selected.
     */
    async selectCell(filter = {}) {
        const cells = await this.getCells(filter);
        if (!cells.length) {
            throw Error(`Cannot find calendar cell matching filter ${JSON.stringify(filter)}`);
        }
        await cells[0].select();
    }
}
MatCalendarHarness.hostSelector = '.mat-calendar';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Base class for harnesses that can trigger a calendar. */
class DatepickerTriggerHarnessBase extends ComponentHarness {
    /** Opens the calendar if the trigger is enabled and it has a calendar. */
    async openCalendar() {
        const [isDisabled, hasCalendar] = await parallel(() => [this.isDisabled(), this.hasCalendar()]);
        if (!isDisabled && hasCalendar) {
            return this._openCalendar();
        }
    }
    /** Closes the calendar if it is open. */
    async closeCalendar() {
        if (await this.isCalendarOpen()) {
            await closeCalendar(getCalendarId(this.host()), this.documentRootLocatorFactory());
            // This is necessary so that we wait for the closing animation to finish in touch UI mode.
            await this.forceStabilize();
        }
    }
    /** Gets whether there is a calendar associated with the trigger. */
    async hasCalendar() {
        return (await getCalendarId(this.host())) != null;
    }
    /**
     * Gets the `MatCalendarHarness` that is associated with the trigger.
     * @param filter Optionally filters which calendar is included.
     */
    async getCalendar(filter = {}) {
        return getCalendar(filter, this.host(), this.documentRootLocatorFactory());
    }
}
/** Gets the ID of the calendar that a particular test element can trigger. */
async function getCalendarId(host) {
    return (await host).getAttribute('data-mat-calendar');
}
/** Closes the calendar with a specific ID. */
async function closeCalendar(calendarId, documentLocator) {
    // We close the calendar by clicking on the backdrop, even though all datepicker variants
    // have the ability to close by pressing escape. The backdrop is preferrable, because the
    // escape key has multiple functions inside a range picker (either cancel the current range
    // or close the calendar). Since we don't have access to set the ID on the backdrop in all
    // cases, we set a unique class instead which is the same as the calendar's ID and suffixed
    // with `-backdrop`.
    const backdropSelector = `.${await calendarId}-backdrop`;
    return (await documentLocator.locatorFor(backdropSelector)()).click();
}
/** Gets the test harness for a calendar associated with a particular host. */
async function getCalendar(filter, host, documentLocator) {
    const calendarId = await getCalendarId(host);
    if (!calendarId) {
        throw Error(`Element is not associated with a calendar`);
    }
    return documentLocator.locatorFor(MatCalendarHarness.with({
        ...filter,
        selector: `#${calendarId}`,
    }))();
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard Material datepicker inputs in tests. */
class MatDatepickerInputHarness extends MatDatepickerInputHarnessBase {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatDatepickerInputHarness`
     * that meets certain criteria.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return getInputPredicate(MatDatepickerInputHarness, options);
    }
    /** Gets whether the calendar associated with the input is open. */
    async isCalendarOpen() {
        // `aria-owns` is set only if there's an open datepicker so we can use it as an indicator.
        const host = await this.host();
        return (await host.getAttribute('aria-owns')) != null;
    }
    /** Opens the calendar associated with the input. */
    async openCalendar() {
        const [isDisabled, hasCalendar] = await parallel(() => [this.isDisabled(), this.hasCalendar()]);
        if (!isDisabled && hasCalendar) {
            // Alt + down arrow is the combination for opening the calendar with the keyboard.
            const host = await this.host();
            return host.sendKeys({ alt: true }, TestKey.DOWN_ARROW);
        }
    }
    /** Closes the calendar associated with the input. */
    async closeCalendar() {
        if (await this.isCalendarOpen()) {
            await closeCalendar(getCalendarId(this.host()), this.documentRootLocatorFactory());
            // This is necessary so that we wait for the closing animation to finish in touch UI mode.
            await this.forceStabilize();
        }
    }
    /** Whether a calendar is associated with the input. */
    async hasCalendar() {
        return (await getCalendarId(this.host())) != null;
    }
    /**
     * Gets the `MatCalendarHarness` that is associated with the trigger.
     * @param filter Optionally filters which calendar is included.
     */
    async getCalendar(filter = {}) {
        return getCalendar(filter, this.host(), this.documentRootLocatorFactory());
    }
}
MatDatepickerInputHarness.hostSelector = '.mat-datepicker-input';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard Material datepicker toggle in tests. */
class MatDatepickerToggleHarness extends DatepickerTriggerHarnessBase {
    constructor() {
        super(...arguments);
        /** The clickable button inside the toggle. */
        this._button = this.locatorFor('button');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatDatepickerToggleHarness` that
     * meets certain criteria.
     * @param options Options for filtering which datepicker toggle instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatDatepickerToggleHarness, options);
    }
    /** Gets whether the calendar associated with the toggle is open. */
    async isCalendarOpen() {
        return (await this.host()).hasClass('mat-datepicker-toggle-active');
    }
    /** Whether the toggle is disabled. */
    async isDisabled() {
        const button = await this._button();
        return coerceBooleanProperty(await button.getAttribute('disabled'));
    }
    async _openCalendar() {
        return (await this._button()).click();
    }
}
MatDatepickerToggleHarness.hostSelector = '.mat-datepicker-toggle';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard Material date range start input in tests. */
class MatStartDateHarness extends MatDatepickerInputHarnessBase {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatStartDateHarness`
     * that meets certain criteria.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return getInputPredicate(MatStartDateHarness, options);
    }
}
MatStartDateHarness.hostSelector = '.mat-start-date';
/** Harness for interacting with a standard Material date range end input in tests. */
class MatEndDateHarness extends MatDatepickerInputHarnessBase {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatEndDateHarness`
     * that meets certain criteria.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return getInputPredicate(MatEndDateHarness, options);
    }
}
MatEndDateHarness.hostSelector = '.mat-end-date';
/** Harness for interacting with a standard Material date range input in tests. */
class MatDateRangeInputHarness extends DatepickerTriggerHarnessBase {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatDateRangeInputHarness`
     * that meets certain criteria.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatDateRangeInputHarness, options).addOption('value', options.value, (harness, value) => HarnessPredicate.stringMatches(harness.getValue(), value));
    }
    /** Gets the combined value of the start and end inputs, including the separator. */
    async getValue() {
        const [start, end, separator] = await parallel(() => [
            this.getStartInput().then(input => input.getValue()),
            this.getEndInput().then(input => input.getValue()),
            this.getSeparator(),
        ]);
        return start + `${end ? ` ${separator} ${end}` : ''}`;
    }
    /** Gets the inner start date input inside the range input. */
    async getStartInput() {
        // Don't pass in filters here since the start input is required and there can only be one.
        return this.locatorFor(MatStartDateHarness)();
    }
    /** Gets the inner start date input inside the range input. */
    async getEndInput() {
        // Don't pass in filters here since the end input is required and there can only be one.
        return this.locatorFor(MatEndDateHarness)();
    }
    /** Gets the separator text between the values of the two inputs. */
    async getSeparator() {
        return (await this.locatorFor('.mat-date-range-input-separator')()).text();
    }
    /** Gets whether the range input is disabled. */
    async isDisabled() {
        // We consider the input as disabled if both of the sub-inputs are disabled.
        const [startDisabled, endDisabled] = await parallel(() => [
            this.getStartInput().then(input => input.isDisabled()),
            this.getEndInput().then(input => input.isDisabled()),
        ]);
        return startDisabled && endDisabled;
    }
    /** Gets whether the range input is required. */
    async isRequired() {
        return (await this.host()).hasClass('mat-date-range-input-required');
    }
    /** Opens the calendar associated with the input. */
    async isCalendarOpen() {
        // `aria-owns` is set on both inputs only if there's an
        // open range picker so we can use it as an indicator.
        const startHost = await (await this.getStartInput()).host();
        return (await startHost.getAttribute('aria-owns')) != null;
    }
    async _openCalendar() {
        // Alt + down arrow is the combination for opening the calendar with the keyboard.
        const startHost = await (await this.getStartInput()).host();
        return startHost.sendKeys({ alt: true }, TestKey.DOWN_ARROW);
    }
}
MatDateRangeInputHarness.hostSelector = '.mat-date-range-input';

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

export { MatCalendarCellHarness, MatCalendarHarness, MatDateRangeInputHarness, MatDatepickerInputHarness, MatDatepickerToggleHarness, MatEndDateHarness, MatStartDateHarness };
//# sourceMappingURL=testing.mjs.map
