import { __awaiter } from 'tslib';
import { HarnessPredicate, ComponentHarness, parallel, TestKey } from '@angular/cdk/testing';
import { MatFormFieldControlHarness } from '@angular/material/form-field/testing/control';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

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
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getProperty('disabled');
        });
    }
    /** Whether the input is required. */
    isRequired() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getProperty('required');
        });
    }
    /** Gets the value of the input. */
    getValue() {
        return __awaiter(this, void 0, void 0, function* () {
            // The "value" property of the native input is always defined.
            return yield (yield this.host()).getProperty('value');
        });
    }
    /**
     * Sets the value of the input. The value will be set by simulating
     * keypresses that correspond to the given value.
     */
    setValue(newValue) {
        return __awaiter(this, void 0, void 0, function* () {
            const inputEl = yield this.host();
            yield inputEl.clear();
            // We don't want to send keys for the value if the value is an empty
            // string in order to clear the value. Sending keys with an empty string
            // still results in unnecessary focus events.
            if (newValue) {
                yield inputEl.sendKeys(newValue);
            }
            yield inputEl.dispatchEvent('change');
        });
    }
    /** Gets the placeholder of the input. */
    getPlaceholder() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (yield this.host()).getProperty('placeholder');
        });
    }
    /**
     * Focuses the input and returns a promise that indicates when the
     * action is complete.
     */
    focus() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).focus();
        });
    }
    /**
     * Blurs the input and returns a promise that indicates when the
     * action is complete.
     */
    blur() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).blur();
        });
    }
    /** Whether the input is focused. */
    isFocused() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).isFocused();
        });
    }
    /** Gets the formatted minimum date for the input's value. */
    getMin() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getAttribute('min');
        });
    }
    /** Gets the formatted maximum date for the input's value. */
    getMax() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).getAttribute('max');
        });
    }
}

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
            .addOption('selected', options.selected, (harness, selected) => __awaiter(this, void 0, void 0, function* () {
            return (yield harness.isSelected()) === selected;
        }))
            .addOption('active', options.active, (harness, active) => __awaiter(this, void 0, void 0, function* () {
            return (yield harness.isActive()) === active;
        }))
            .addOption('disabled', options.disabled, (harness, disabled) => __awaiter(this, void 0, void 0, function* () {
            return (yield harness.isDisabled()) === disabled;
        }))
            .addOption('today', options.today, (harness, today) => __awaiter(this, void 0, void 0, function* () {
            return (yield harness.isToday()) === today;
        }))
            .addOption('inRange', options.inRange, (harness, inRange) => __awaiter(this, void 0, void 0, function* () {
            return (yield harness.isInRange()) === inRange;
        }))
            .addOption('inComparisonRange', options.inComparisonRange, (harness, inComparisonRange) => __awaiter(this, void 0, void 0, function* () {
            return (yield harness.isInComparisonRange()) === inComparisonRange;
        }))
            .addOption('inPreviewRange', options.inPreviewRange, (harness, inPreviewRange) => __awaiter(this, void 0, void 0, function* () {
            return (yield harness.isInPreviewRange()) === inPreviewRange;
        }));
    }
    /** Gets the text of the calendar cell. */
    getText() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._content()).text();
        });
    }
    /** Gets the aria-label of the calendar cell. */
    getAriaLabel() {
        return __awaiter(this, void 0, void 0, function* () {
            // We're guaranteed for the `aria-label` to be defined
            // since this is a private element that we control.
            return (yield this.host()).getAttribute('aria-label');
        });
    }
    /** Whether the cell is selected. */
    isSelected() {
        return __awaiter(this, void 0, void 0, function* () {
            const host = yield this.host();
            return (yield host.getAttribute('aria-pressed')) === 'true';
        });
    }
    /** Whether the cell is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._hasState('disabled');
        });
    }
    /** Whether the cell is currently activated using keyboard navigation. */
    isActive() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._hasState('active');
        });
    }
    /** Whether the cell represents today's date. */
    isToday() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._content()).hasClass('mat-calendar-body-today');
        });
    }
    /** Selects the calendar cell. Won't do anything if the cell is disabled. */
    select() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).click();
        });
    }
    /** Hovers over the calendar cell. */
    hover() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hover();
        });
    }
    /** Moves the mouse away from the calendar cell. */
    mouseAway() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).mouseAway();
        });
    }
    /** Focuses the calendar cell. */
    focus() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).focus();
        });
    }
    /** Removes focus from the calendar cell. */
    blur() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).blur();
        });
    }
    /** Whether the cell is the start of the main range. */
    isRangeStart() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._hasState('range-start');
        });
    }
    /** Whether the cell is the end of the main range. */
    isRangeEnd() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._hasState('range-end');
        });
    }
    /** Whether the cell is part of the main range. */
    isInRange() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._hasState('in-range');
        });
    }
    /** Whether the cell is the start of the comparison range. */
    isComparisonRangeStart() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._hasState('comparison-start');
        });
    }
    /** Whether the cell is the end of the comparison range. */
    isComparisonRangeEnd() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._hasState('comparison-end');
        });
    }
    /** Whether the cell is inside of the comparison range. */
    isInComparisonRange() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._hasState('in-comparison-range');
        });
    }
    /** Whether the cell is the start of the preview range. */
    isPreviewRangeStart() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._hasState('preview-start');
        });
    }
    /** Whether the cell is the end of the preview range. */
    isPreviewRangeEnd() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._hasState('preview-end');
        });
    }
    /** Whether the cell is inside of the preview range. */
    isInPreviewRange() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._hasState('in-preview');
        });
    }
    /** Returns whether the cell has a particular CSS class-based state. */
    _hasState(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass(`mat-calendar-body-${name}`);
        });
    }
}
MatCalendarCellHarness.hostSelector = '.mat-calendar-body-cell';

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
    getCells(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.locatorForAll(MatCalendarCellHarness.with(filter))();
        });
    }
    /** Gets the current view that is being shown inside the calendar. */
    getCurrentView() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.locatorForOptional('mat-multi-year-view')()) {
                return 2 /* MULTI_YEAR */;
            }
            if (yield this.locatorForOptional('mat-year-view')()) {
                return 1 /* YEAR */;
            }
            return 0 /* MONTH */;
        });
    }
    /** Gets the label of the current calendar view. */
    getCurrentViewLabel() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._periodButton()).text();
        });
    }
    /** Changes the calendar view by clicking on the view toggle button. */
    changeView() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._periodButton()).click();
        });
    }
    /** Goes to the next page of the current view (e.g. next month when inside the month view). */
    next() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.locatorFor('.mat-calendar-next-button')()).click();
        });
    }
    /**
     * Goes to the previous page of the current view
     * (e.g. previous month when inside the month view).
     */
    previous() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.locatorFor('.mat-calendar-previous-button')()).click();
        });
    }
    /**
     * Selects a cell in the current calendar view.
     * @param filter An optional filter to apply to the cells. The first cell matching the filter
     *     will be selected.
     */
    selectCell(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const cells = yield this.getCells(filter);
            if (!cells.length) {
                throw Error(`Cannot find calendar cell matching filter ${JSON.stringify(filter)}`);
            }
            yield cells[0].select();
        });
    }
}
MatCalendarHarness.hostSelector = '.mat-calendar';

/** Base class for harnesses that can trigger a calendar. */
class DatepickerTriggerHarnessBase extends ComponentHarness {
    /** Opens the calendar if the trigger is enabled and it has a calendar. */
    openCalendar() {
        return __awaiter(this, void 0, void 0, function* () {
            const [isDisabled, hasCalendar] = yield parallel(() => [this.isDisabled(), this.hasCalendar()]);
            if (!isDisabled && hasCalendar) {
                return this._openCalendar();
            }
        });
    }
    /** Closes the calendar if it is open. */
    closeCalendar() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.isCalendarOpen()) {
                yield closeCalendar(getCalendarId(this.host()), this.documentRootLocatorFactory());
                // This is necessary so that we wait for the closing animation to finish in touch UI mode.
                yield this.forceStabilize();
            }
        });
    }
    /** Gets whether there is a calendar associated with the trigger. */
    hasCalendar() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield getCalendarId(this.host())) != null;
        });
    }
    /**
     * Gets the `MatCalendarHarness` that is associated with the trigger.
     * @param filter Optionally filters which calendar is included.
     */
    getCalendar(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return getCalendar(filter, this.host(), this.documentRootLocatorFactory());
        });
    }
}
/** Gets the ID of the calendar that a particular test element can trigger. */
function getCalendarId(host) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield host).getAttribute('data-mat-calendar');
    });
}
/** Closes the calendar with a specific ID. */
function closeCalendar(calendarId, documentLocator) {
    return __awaiter(this, void 0, void 0, function* () {
        // We close the calendar by clicking on the backdrop, even though all datepicker variants
        // have the ability to close by pressing escape. The backdrop is preferrable, because the
        // escape key has multiple functions inside a range picker (either cancel the current range
        // or close the calendar). Since we don't have access to set the ID on the backdrop in all
        // cases, we set a unique class instead which is the same as the calendar's ID and suffixed
        // with `-backdrop`.
        const backdropSelector = `.${yield calendarId}-backdrop`;
        return (yield documentLocator.locatorFor(backdropSelector)()).click();
    });
}
/** Gets the test harness for a calendar associated with a particular host. */
function getCalendar(filter, host, documentLocator) {
    return __awaiter(this, void 0, void 0, function* () {
        const calendarId = yield getCalendarId(host);
        if (!calendarId) {
            throw Error(`Element is not associated with a calendar`);
        }
        return documentLocator.locatorFor(MatCalendarHarness.with(Object.assign(Object.assign({}, filter), { selector: `#${calendarId}` })))();
    });
}

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
    isCalendarOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            // `aria-owns` is set only if there's an open datepicker so we can use it as an indicator.
            const host = yield this.host();
            return (yield host.getAttribute('aria-owns')) != null;
        });
    }
    /** Opens the calendar associated with the input. */
    openCalendar() {
        return __awaiter(this, void 0, void 0, function* () {
            const [isDisabled, hasCalendar] = yield parallel(() => [this.isDisabled(), this.hasCalendar()]);
            if (!isDisabled && hasCalendar) {
                // Alt + down arrow is the combination for opening the calendar with the keyboard.
                const host = yield this.host();
                return host.sendKeys({ alt: true }, TestKey.DOWN_ARROW);
            }
        });
    }
    /** Closes the calendar associated with the input. */
    closeCalendar() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.isCalendarOpen()) {
                yield closeCalendar(getCalendarId(this.host()), this.documentRootLocatorFactory());
                // This is necessary so that we wait for the closing animation to finish in touch UI mode.
                yield this.forceStabilize();
            }
        });
    }
    /** Whether a calendar is associated with the input. */
    hasCalendar() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield getCalendarId(this.host())) != null;
        });
    }
    /**
     * Gets the `MatCalendarHarness` that is associated with the trigger.
     * @param filter Optionally filters which calendar is included.
     */
    getCalendar(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return getCalendar(filter, this.host(), this.documentRootLocatorFactory());
        });
    }
}
MatDatepickerInputHarness.hostSelector = '.mat-datepicker-input';

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
    isCalendarOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-datepicker-toggle-active');
        });
    }
    /** Whether the toggle is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            const button = yield this._button();
            return coerceBooleanProperty(yield button.getAttribute('disabled'));
        });
    }
    _openCalendar() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._button()).click();
        });
    }
}
MatDatepickerToggleHarness.hostSelector = '.mat-datepicker-toggle';

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
    getValue() {
        return __awaiter(this, void 0, void 0, function* () {
            const [start, end, separator] = yield parallel(() => [
                this.getStartInput().then(input => input.getValue()),
                this.getEndInput().then(input => input.getValue()),
                this.getSeparator(),
            ]);
            return start + `${end ? ` ${separator} ${end}` : ''}`;
        });
    }
    /** Gets the inner start date input inside the range input. */
    getStartInput() {
        return __awaiter(this, void 0, void 0, function* () {
            // Don't pass in filters here since the start input is required and there can only be one.
            return this.locatorFor(MatStartDateHarness)();
        });
    }
    /** Gets the inner start date input inside the range input. */
    getEndInput() {
        return __awaiter(this, void 0, void 0, function* () {
            // Don't pass in filters here since the end input is required and there can only be one.
            return this.locatorFor(MatEndDateHarness)();
        });
    }
    /** Gets the separator text between the values of the two inputs. */
    getSeparator() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.locatorFor('.mat-date-range-input-separator')()).text();
        });
    }
    /** Gets whether the range input is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            // We consider the input as disabled if both of the sub-inputs are disabled.
            const [startDisabled, endDisabled] = yield parallel(() => [
                this.getStartInput().then(input => input.isDisabled()),
                this.getEndInput().then(input => input.isDisabled()),
            ]);
            return startDisabled && endDisabled;
        });
    }
    /** Gets whether the range input is required. */
    isRequired() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).hasClass('mat-date-range-input-required');
        });
    }
    /** Opens the calendar associated with the input. */
    isCalendarOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            // `aria-owns` is set on both inputs only if there's an
            // open range picker so we can use it as an indicator.
            const startHost = yield (yield this.getStartInput()).host();
            return (yield startHost.getAttribute('aria-owns')) != null;
        });
    }
    _openCalendar() {
        return __awaiter(this, void 0, void 0, function* () {
            // Alt + down arrow is the combination for opening the calendar with the keyboard.
            const startHost = yield (yield this.getStartInput()).host();
            return startHost.sendKeys({ alt: true }, TestKey.DOWN_ARROW);
        });
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
