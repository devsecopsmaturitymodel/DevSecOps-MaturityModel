/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessPredicate, ComponentHarness } from '@angular/cdk/testing';
import { CalendarCellHarnessFilters } from './datepicker-harness-filters';
/** Harness for interacting with a standard Material calendar cell in tests. */
export declare class MatCalendarCellHarness extends ComponentHarness {
    static hostSelector: string;
    /** Reference to the inner content element inside the cell. */
    private _content;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatCalendarCellHarness`
     * that meets certain criteria.
     * @param options Options for filtering which cell instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: CalendarCellHarnessFilters): HarnessPredicate<MatCalendarCellHarness>;
    /** Gets the text of the calendar cell. */
    getText(): Promise<string>;
    /** Gets the aria-label of the calendar cell. */
    getAriaLabel(): Promise<string>;
    /** Whether the cell is selected. */
    isSelected(): Promise<boolean>;
    /** Whether the cell is disabled. */
    isDisabled(): Promise<boolean>;
    /** Whether the cell is currently activated using keyboard navigation. */
    isActive(): Promise<boolean>;
    /** Whether the cell represents today's date. */
    isToday(): Promise<boolean>;
    /** Selects the calendar cell. Won't do anything if the cell is disabled. */
    select(): Promise<void>;
    /** Hovers over the calendar cell. */
    hover(): Promise<void>;
    /** Moves the mouse away from the calendar cell. */
    mouseAway(): Promise<void>;
    /** Focuses the calendar cell. */
    focus(): Promise<void>;
    /** Removes focus from the calendar cell. */
    blur(): Promise<void>;
    /** Whether the cell is the start of the main range. */
    isRangeStart(): Promise<boolean>;
    /** Whether the cell is the end of the main range. */
    isRangeEnd(): Promise<boolean>;
    /** Whether the cell is part of the main range. */
    isInRange(): Promise<boolean>;
    /** Whether the cell is the start of the comparison range. */
    isComparisonRangeStart(): Promise<boolean>;
    /** Whether the cell is the end of the comparison range. */
    isComparisonRangeEnd(): Promise<boolean>;
    /** Whether the cell is inside of the comparison range. */
    isInComparisonRange(): Promise<boolean>;
    /** Whether the cell is the start of the preview range. */
    isPreviewRangeStart(): Promise<boolean>;
    /** Whether the cell is the end of the preview range. */
    isPreviewRangeEnd(): Promise<boolean>;
    /** Whether the cell is inside of the preview range. */
    isInPreviewRange(): Promise<boolean>;
    /** Returns whether the cell has a particular CSS class-based state. */
    private _hasState;
}
