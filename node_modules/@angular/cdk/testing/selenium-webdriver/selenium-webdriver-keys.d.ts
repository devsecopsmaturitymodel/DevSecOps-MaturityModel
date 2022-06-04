/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ModifierKeys } from '@angular/cdk/testing';
/**
 * Maps the `TestKey` constants to WebDriver's `webdriver.Key` constants.
 * See https://github.com/SeleniumHQ/selenium/blob/trunk/javascript/webdriver/key.js#L29
 */
export declare const seleniumWebDriverKeyMap: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    7: string;
    8: string;
    9: string;
    10: string;
    11: string;
    12: string;
    13: string;
    14: string;
    15: string;
    16: string;
    17: string;
    18: string;
    19: string;
    20: string;
    21: string;
    22: string;
    23: string;
    24: string;
    25: string;
    26: string;
    27: string;
    28: string;
    29: string;
};
/** Gets a list of WebDriver `Key`s for the given `ModifierKeys`. */
export declare function getSeleniumWebDriverModifierKeys(modifiers: ModifierKeys): string[];
