/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DEFAULT_CURRENCY_CODE, Inject, LOCALE_ID, Pipe } from '@angular/core';
import { formatCurrency, formatNumber, formatPercent } from '../i18n/format_number';
import { getCurrencySymbol } from '../i18n/locale_data_api';
import { invalidPipeArgumentError } from './invalid_pipe_argument_error';
import * as i0 from "@angular/core";
/**
 * @ngModule CommonModule
 * @description
 *
 * Formats a value according to digit options and locale rules.
 * Locale determines group sizing and separator,
 * decimal point character, and other locale-specific configurations.
 *
 * @see `formatNumber()`
 *
 * @usageNotes
 *
 * ### digitsInfo
 *
 * The value's decimal representation is specified by the `digitsInfo`
 * parameter, written in the following format:<br>
 *
 * ```
 * {minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}
 * ```
 *
 *  - `minIntegerDigits`:
 * The minimum number of integer digits before the decimal point.
 * Default is 1.
 *
 * - `minFractionDigits`:
 * The minimum number of digits after the decimal point.
 * Default is 0.
 *
 *  - `maxFractionDigits`:
 * The maximum number of digits after the decimal point.
 * Default is 3.
 *
 * If the formatted value is truncated it will be rounded using the "to-nearest" method:
 *
 * ```
 * {{3.6 | number: '1.0-0'}}
 * <!--will output '4'-->
 *
 * {{-3.6 | number:'1.0-0'}}
 * <!--will output '-4'-->
 * ```
 *
 * ### locale
 *
 * `locale` will format a value according to locale rules.
 * Locale determines group sizing and separator,
 * decimal point character, and other locale-specific configurations.
 *
 * When not supplied, uses the value of `LOCALE_ID`, which is `en-US` by default.
 *
 * See [Setting your app locale](guide/i18n-common-locale-id).
 *
 * ### Example
 *
 * The following code shows how the pipe transforms values
 * according to various format specifications,
 * where the caller's default locale is `en-US`.
 *
 * <code-example path="common/pipes/ts/number_pipe.ts" region='NumberPipe'></code-example>
 *
 * @publicApi
 */
export class DecimalPipe {
    constructor(_locale) {
        this._locale = _locale;
    }
    /**
     * @param value The value to be formatted.
     * @param digitsInfo Sets digit and decimal representation.
     * [See more](#digitsinfo).
     * @param locale Specifies what locale format rules to use.
     * [See more](#locale).
     */
    transform(value, digitsInfo, locale) {
        if (!isValue(value))
            return null;
        locale = locale || this._locale;
        try {
            const num = strToNumber(value);
            return formatNumber(num, locale, digitsInfo);
        }
        catch (error) {
            throw invalidPipeArgumentError(DecimalPipe, error.message);
        }
    }
}
DecimalPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: DecimalPipe, deps: [{ token: LOCALE_ID }], target: i0.ɵɵFactoryTarget.Pipe });
DecimalPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: DecimalPipe, name: "number" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: DecimalPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'number' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [LOCALE_ID]
                }] }]; } });
/**
 * @ngModule CommonModule
 * @description
 *
 * Transforms a number to a percentage
 * string, formatted according to locale rules that determine group sizing and
 * separator, decimal-point character, and other locale-specific
 * configurations.
 *
 * @see `formatPercent()`
 *
 * @usageNotes
 * The following code shows how the pipe transforms numbers
 * into text strings, according to various format specifications,
 * where the caller's default locale is `en-US`.
 *
 * <code-example path="common/pipes/ts/percent_pipe.ts" region='PercentPipe'></code-example>
 *
 * @publicApi
 */
export class PercentPipe {
    constructor(_locale) {
        this._locale = _locale;
    }
    /**
     *
     * @param value The number to be formatted as a percentage.
     * @param digitsInfo Decimal representation options, specified by a string
     * in the following format:<br>
     * <code>{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}</code>.
     *   - `minIntegerDigits`: The minimum number of integer digits before the decimal point.
     * Default is `1`.
     *   - `minFractionDigits`: The minimum number of digits after the decimal point.
     * Default is `0`.
     *   - `maxFractionDigits`: The maximum number of digits after the decimal point.
     * Default is `0`.
     * @param locale A locale code for the locale format rules to use.
     * When not supplied, uses the value of `LOCALE_ID`, which is `en-US` by default.
     * See [Setting your app locale](guide/i18n-common-locale-id).
     */
    transform(value, digitsInfo, locale) {
        if (!isValue(value))
            return null;
        locale = locale || this._locale;
        try {
            const num = strToNumber(value);
            return formatPercent(num, locale, digitsInfo);
        }
        catch (error) {
            throw invalidPipeArgumentError(PercentPipe, error.message);
        }
    }
}
PercentPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: PercentPipe, deps: [{ token: LOCALE_ID }], target: i0.ɵɵFactoryTarget.Pipe });
PercentPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: PercentPipe, name: "percent" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: PercentPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'percent' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [LOCALE_ID]
                }] }]; } });
/**
 * @ngModule CommonModule
 * @description
 *
 * Transforms a number to a currency string, formatted according to locale rules
 * that determine group sizing and separator, decimal-point character,
 * and other locale-specific configurations.
 *
 * {@a currency-code-deprecation}
 * <div class="alert is-helpful">
 *
 * **Deprecation notice:**
 *
 * The default currency code is currently always `USD` but this is deprecated from v9.
 *
 * **In v11 the default currency code will be taken from the current locale identified by
 * the `LOCALE_ID` token. See the [i18n guide](guide/i18n-common-locale-id) for
 * more information.**
 *
 * If you need the previous behavior then set it by creating a `DEFAULT_CURRENCY_CODE` provider in
 * your application `NgModule`:
 *
 * ```ts
 * {provide: DEFAULT_CURRENCY_CODE, useValue: 'USD'}
 * ```
 *
 * </div>
 *
 * @see `getCurrencySymbol()`
 * @see `formatCurrency()`
 *
 * @usageNotes
 * The following code shows how the pipe transforms numbers
 * into text strings, according to various format specifications,
 * where the caller's default locale is `en-US`.
 *
 * <code-example path="common/pipes/ts/currency_pipe.ts" region='CurrencyPipe'></code-example>
 *
 * @publicApi
 */
export class CurrencyPipe {
    constructor(_locale, _defaultCurrencyCode = 'USD') {
        this._locale = _locale;
        this._defaultCurrencyCode = _defaultCurrencyCode;
    }
    /**
     *
     * @param value The number to be formatted as currency.
     * @param currencyCode The [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code,
     * such as `USD` for the US dollar and `EUR` for the euro. The default currency code can be
     * configured using the `DEFAULT_CURRENCY_CODE` injection token.
     * @param display The format for the currency indicator. One of the following:
     *   - `code`: Show the code (such as `USD`).
     *   - `symbol`(default): Show the symbol (such as `$`).
     *   - `symbol-narrow`: Use the narrow symbol for locales that have two symbols for their
     * currency.
     * For example, the Canadian dollar CAD has the symbol `CA$` and the symbol-narrow `$`. If the
     * locale has no narrow symbol, uses the standard symbol for the locale.
     *   - String: Use the given string value instead of a code or a symbol.
     * For example, an empty string will suppress the currency & symbol.
     *   - Boolean (marked deprecated in v5): `true` for symbol and false for `code`.
     *
     * @param digitsInfo Decimal representation options, specified by a string
     * in the following format:<br>
     * <code>{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}</code>.
     *   - `minIntegerDigits`: The minimum number of integer digits before the decimal point.
     * Default is `1`.
     *   - `minFractionDigits`: The minimum number of digits after the decimal point.
     * Default is `2`.
     *   - `maxFractionDigits`: The maximum number of digits after the decimal point.
     * Default is `2`.
     * If not provided, the number will be formatted with the proper amount of digits,
     * depending on what the [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) specifies.
     * For example, the Canadian dollar has 2 digits, whereas the Chilean peso has none.
     * @param locale A locale code for the locale format rules to use.
     * When not supplied, uses the value of `LOCALE_ID`, which is `en-US` by default.
     * See [Setting your app locale](guide/i18n-common-locale-id).
     */
    transform(value, currencyCode = this._defaultCurrencyCode, display = 'symbol', digitsInfo, locale) {
        if (!isValue(value))
            return null;
        locale = locale || this._locale;
        if (typeof display === 'boolean') {
            if ((typeof ngDevMode === 'undefined' || ngDevMode) && console && console.warn) {
                console.warn(`Warning: the currency pipe has been changed in Angular v5. The symbolDisplay option (third parameter) is now a string instead of a boolean. The accepted values are "code", "symbol" or "symbol-narrow".`);
            }
            display = display ? 'symbol' : 'code';
        }
        let currency = currencyCode || this._defaultCurrencyCode;
        if (display !== 'code') {
            if (display === 'symbol' || display === 'symbol-narrow') {
                currency = getCurrencySymbol(currency, display === 'symbol' ? 'wide' : 'narrow', locale);
            }
            else {
                currency = display;
            }
        }
        try {
            const num = strToNumber(value);
            return formatCurrency(num, locale, currency, currencyCode, digitsInfo);
        }
        catch (error) {
            throw invalidPipeArgumentError(CurrencyPipe, error.message);
        }
    }
}
CurrencyPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: CurrencyPipe, deps: [{ token: LOCALE_ID }, { token: DEFAULT_CURRENCY_CODE }], target: i0.ɵɵFactoryTarget.Pipe });
CurrencyPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: CurrencyPipe, name: "currency" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: CurrencyPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'currency' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [LOCALE_ID]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DEFAULT_CURRENCY_CODE]
                }] }]; } });
function isValue(value) {
    return !(value == null || value === '' || value !== value);
}
/**
 * Transforms a string into a number (if needed).
 */
function strToNumber(value) {
    // Convert strings to numbers
    if (typeof value === 'string' && !isNaN(Number(value) - parseFloat(value))) {
        return Number(value);
    }
    if (typeof value !== 'number') {
        throw new Error(`${value} is not a number`);
    }
    return value;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVtYmVyX3BpcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vc3JjL3BpcGVzL251bWJlcl9waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxxQkFBcUIsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBZ0IsTUFBTSxlQUFlLENBQUM7QUFFNUYsT0FBTyxFQUFDLGNBQWMsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDbEYsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFFMUQsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0sK0JBQStCLENBQUM7O0FBR3ZFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQThERztBQUVILE1BQU0sT0FBTyxXQUFXO0lBQ3RCLFlBQXVDLE9BQWU7UUFBZixZQUFPLEdBQVAsT0FBTyxDQUFRO0lBQUcsQ0FBQztJQUsxRDs7Ozs7O09BTUc7SUFDSCxTQUFTLENBQUMsS0FBbUMsRUFBRSxVQUFtQixFQUFFLE1BQWU7UUFFakYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7WUFBRSxPQUFPLElBQUksQ0FBQztRQUVqQyxNQUFNLEdBQUcsTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUM7UUFFaEMsSUFBSTtZQUNGLE1BQU0sR0FBRyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMvQixPQUFPLFlBQVksQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1NBQzlDO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxNQUFNLHdCQUF3QixDQUFDLFdBQVcsRUFBRyxLQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDdkU7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eEU7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLE1BQU0sd0JBQXdCLENBQUMsWUFBWSxFQUFHLEtBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN4RTtJQUNILENBQUM7O29IQWpGVSxZQUFZLGtCQUVYLFNBQVMsYUFDVCxxQkFBcUI7a0hBSHRCLFlBQVk7c0dBQVosWUFBWTtrQkFEeEIsSUFBSTttQkFBQyxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUM7OzBCQUdqQixNQUFNOzJCQUFDLFNBQVM7OzBCQUNoQixNQUFNOzJCQUFDLHFCQUFxQjs7QUFpRm5DLFNBQVMsT0FBTyxDQUFDLEtBQW1DO0lBQ2xELE9BQU8sQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxLQUFLLEVBQUUsSUFBSSxLQUFLLEtBQUssS0FBSyxDQUFDLENBQUM7QUFDN0QsQ0FBQztBQUVEOztHQUVHO0FBQ0gsU0FBUyxXQUFXLENBQUMsS0FBb0I7SUFDdkMsNkJBQTZCO0lBQzdCLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtRQUMxRSxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN0QjtJQUNELElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO1FBQzdCLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxLQUFLLGtCQUFrQixDQUFDLENBQUM7S0FDN0M7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtERUZBVUxUX0NVUlJFTkNZX0NPREUsIEluamVjdCwgTE9DQUxFX0lELCBQaXBlLCBQaXBlVHJhbnNmb3JtfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtmb3JtYXRDdXJyZW5jeSwgZm9ybWF0TnVtYmVyLCBmb3JtYXRQZXJjZW50fSBmcm9tICcuLi9pMThuL2Zvcm1hdF9udW1iZXInO1xuaW1wb3J0IHtnZXRDdXJyZW5jeVN5bWJvbH0gZnJvbSAnLi4vaTE4bi9sb2NhbGVfZGF0YV9hcGknO1xuXG5pbXBvcnQge2ludmFsaWRQaXBlQXJndW1lbnRFcnJvcn0gZnJvbSAnLi9pbnZhbGlkX3BpcGVfYXJndW1lbnRfZXJyb3InO1xuXG5cbi8qKlxuICogQG5nTW9kdWxlIENvbW1vbk1vZHVsZVxuICogQGRlc2NyaXB0aW9uXG4gKlxuICogRm9ybWF0cyBhIHZhbHVlIGFjY29yZGluZyB0byBkaWdpdCBvcHRpb25zIGFuZCBsb2NhbGUgcnVsZXMuXG4gKiBMb2NhbGUgZGV0ZXJtaW5lcyBncm91cCBzaXppbmcgYW5kIHNlcGFyYXRvcixcbiAqIGRlY2ltYWwgcG9pbnQgY2hhcmFjdGVyLCBhbmQgb3RoZXIgbG9jYWxlLXNwZWNpZmljIGNvbmZpZ3VyYXRpb25zLlxuICpcbiAqIEBzZWUgYGZvcm1hdE51bWJlcigpYFxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIGRpZ2l0c0luZm9cbiAqXG4gKiBUaGUgdmFsdWUncyBkZWNpbWFsIHJlcHJlc2VudGF0aW9uIGlzIHNwZWNpZmllZCBieSB0aGUgYGRpZ2l0c0luZm9gXG4gKiBwYXJhbWV0ZXIsIHdyaXR0ZW4gaW4gdGhlIGZvbGxvd2luZyBmb3JtYXQ6PGJyPlxuICpcbiAqIGBgYFxuICoge21pbkludGVnZXJEaWdpdHN9LnttaW5GcmFjdGlvbkRpZ2l0c30te21heEZyYWN0aW9uRGlnaXRzfVxuICogYGBgXG4gKlxuICogIC0gYG1pbkludGVnZXJEaWdpdHNgOlxuICogVGhlIG1pbmltdW0gbnVtYmVyIG9mIGludGVnZXIgZGlnaXRzIGJlZm9yZSB0aGUgZGVjaW1hbCBwb2ludC5cbiAqIERlZmF1bHQgaXMgMS5cbiAqXG4gKiAtIGBtaW5GcmFjdGlvbkRpZ2l0c2A6XG4gKiBUaGUgbWluaW11bSBudW1iZXIgb2YgZGlnaXRzIGFmdGVyIHRoZSBkZWNpbWFsIHBvaW50LlxuICogRGVmYXVsdCBpcyAwLlxuICpcbiAqICAtIGBtYXhGcmFjdGlvbkRpZ2l0c2A6XG4gKiBUaGUgbWF4aW11bSBudW1iZXIgb2YgZGlnaXRzIGFmdGVyIHRoZSBkZWNpbWFsIHBvaW50LlxuICogRGVmYXVsdCBpcyAzLlxuICpcbiAqIElmIHRoZSBmb3JtYXR0ZWQgdmFsdWUgaXMgdHJ1bmNhdGVkIGl0IHdpbGwgYmUgcm91bmRlZCB1c2luZyB0aGUgXCJ0by1uZWFyZXN0XCIgbWV0aG9kOlxuICpcbiAqIGBgYFxuICoge3szLjYgfCBudW1iZXI6ICcxLjAtMCd9fVxuICogPCEtLXdpbGwgb3V0cHV0ICc0Jy0tPlxuICpcbiAqIHt7LTMuNiB8IG51bWJlcjonMS4wLTAnfX1cbiAqIDwhLS13aWxsIG91dHB1dCAnLTQnLS0+XG4gKiBgYGBcbiAqXG4gKiAjIyMgbG9jYWxlXG4gKlxuICogYGxvY2FsZWAgd2lsbCBmb3JtYXQgYSB2YWx1ZSBhY2NvcmRpbmcgdG8gbG9jYWxlIHJ1bGVzLlxuICogTG9jYWxlIGRldGVybWluZXMgZ3JvdXAgc2l6aW5nIGFuZCBzZXBhcmF0b3IsXG4gKiBkZWNpbWFsIHBvaW50IGNoYXJhY3RlciwgYW5kIG90aGVyIGxvY2FsZS1zcGVjaWZpYyBjb25maWd1cmF0aW9ucy5cbiAqXG4gKiBXaGVuIG5vdCBzdXBwbGllZCwgdXNlcyB0aGUgdmFsdWUgb2YgYExPQ0FMRV9JRGAsIHdoaWNoIGlzIGBlbi1VU2AgYnkgZGVmYXVsdC5cbiAqXG4gKiBTZWUgW1NldHRpbmcgeW91ciBhcHAgbG9jYWxlXShndWlkZS9pMThuLWNvbW1vbi1sb2NhbGUtaWQpLlxuICpcbiAqICMjIyBFeGFtcGxlXG4gKlxuICogVGhlIGZvbGxvd2luZyBjb2RlIHNob3dzIGhvdyB0aGUgcGlwZSB0cmFuc2Zvcm1zIHZhbHVlc1xuICogYWNjb3JkaW5nIHRvIHZhcmlvdXMgZm9ybWF0IHNwZWNpZmljYXRpb25zLFxuICogd2hlcmUgdGhlIGNhbGxlcidzIGRlZmF1bHQgbG9jYWxlIGlzIGBlbi1VU2AuXG4gKlxuICogPGNvZGUtZXhhbXBsZSBwYXRoPVwiY29tbW9uL3BpcGVzL3RzL251bWJlcl9waXBlLnRzXCIgcmVnaW9uPSdOdW1iZXJQaXBlJz48L2NvZGUtZXhhbXBsZT5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbkBQaXBlKHtuYW1lOiAnbnVtYmVyJ30pXG5leHBvcnQgY2xhc3MgRGVjaW1hbFBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgY29uc3RydWN0b3IoQEluamVjdChMT0NBTEVfSUQpIHByaXZhdGUgX2xvY2FsZTogc3RyaW5nKSB7fVxuXG4gIHRyYW5zZm9ybSh2YWx1ZTogbnVtYmVyfHN0cmluZywgZGlnaXRzSW5mbz86IHN0cmluZywgbG9jYWxlPzogc3RyaW5nKTogc3RyaW5nfG51bGw7XG4gIHRyYW5zZm9ybSh2YWx1ZTogbnVsbHx1bmRlZmluZWQsIGRpZ2l0c0luZm8/OiBzdHJpbmcsIGxvY2FsZT86IHN0cmluZyk6IG51bGw7XG4gIHRyYW5zZm9ybSh2YWx1ZTogbnVtYmVyfHN0cmluZ3xudWxsfHVuZGVmaW5lZCwgZGlnaXRzSW5mbz86IHN0cmluZywgbG9jYWxlPzogc3RyaW5nKTogc3RyaW5nfG51bGw7XG4gIC8qKlxuICAgKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIGJlIGZvcm1hdHRlZC5cbiAgICogQHBhcmFtIGRpZ2l0c0luZm8gU2V0cyBkaWdpdCBhbmQgZGVjaW1hbCByZXByZXNlbnRhdGlvbi5cbiAgICogW1NlZSBtb3JlXSgjZGlnaXRzaW5mbykuXG4gICAqIEBwYXJhbSBsb2NhbGUgU3BlY2lmaWVzIHdoYXQgbG9jYWxlIGZvcm1hdCBydWxlcyB0byB1c2UuXG4gICAqIFtTZWUgbW9yZV0oI2xvY2FsZSkuXG4gICAqL1xuICB0cmFuc2Zvcm0odmFsdWU6IG51bWJlcnxzdHJpbmd8bnVsbHx1bmRlZmluZWQsIGRpZ2l0c0luZm8/OiBzdHJpbmcsIGxvY2FsZT86IHN0cmluZyk6IHN0cmluZ1xuICAgICAgfG51bGwge1xuICAgIGlmICghaXNWYWx1ZSh2YWx1ZSkpIHJldHVybiBudWxsO1xuXG4gICAgbG9jYWxlID0gbG9jYWxlIHx8IHRoaXMuX2xvY2FsZTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBudW0gPSBzdHJUb051bWJlcih2YWx1ZSk7XG4gICAgICByZXR1cm4gZm9ybWF0TnVtYmVyKG51bSwgbG9jYWxlLCBkaWdpdHNJbmZvKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhyb3cgaW52YWxpZFBpcGVBcmd1bWVudEVycm9yKERlY2ltYWxQaXBlLCAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEBuZ01vZHVsZSBDb21tb25Nb2R1bGVcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIFRyYW5zZm9ybXMgYSBudW1iZXIgdG8gYSBwZXJjZW50YWdlXG4gKiBzdHJpbmcsIGZvcm1hdHRlZCBhY2NvcmRpbmcgdG8gbG9jYWxlIHJ1bGVzIHRoYXQgZGV0ZXJtaW5lIGdyb3VwIHNpemluZyBhbmRcbiAqIHNlcGFyYXRvciwgZGVjaW1hbC1wb2ludCBjaGFyYWN0ZXIsIGFuZCBvdGhlciBsb2NhbGUtc3BlY2lmaWNcbiAqIGNvbmZpZ3VyYXRpb25zLlxuICpcbiAqIEBzZWUgYGZvcm1hdFBlcmNlbnQoKWBcbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICogVGhlIGZvbGxvd2luZyBjb2RlIHNob3dzIGhvdyB0aGUgcGlwZSB0cmFuc2Zvcm1zIG51bWJlcnNcbiAqIGludG8gdGV4dCBzdHJpbmdzLCBhY2NvcmRpbmcgdG8gdmFyaW91cyBmb3JtYXQgc3BlY2lmaWNhdGlvbnMsXG4gKiB3aGVyZSB0aGUgY2FsbGVyJ3MgZGVmYXVsdCBsb2NhbGUgaXMgYGVuLVVTYC5cbiAqXG4gKiA8Y29kZS1leGFtcGxlIHBhdGg9XCJjb21tb24vcGlwZXMvdHMvcGVyY2VudF9waXBlLnRzXCIgcmVnaW9uPSdQZXJjZW50UGlwZSc+PC9jb2RlLWV4YW1wbGU+XG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5AUGlwZSh7bmFtZTogJ3BlcmNlbnQnfSlcbmV4cG9ydCBjbGFzcyBQZXJjZW50UGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICBjb25zdHJ1Y3RvcihASW5qZWN0KExPQ0FMRV9JRCkgcHJpdmF0ZSBfbG9jYWxlOiBzdHJpbmcpIHt9XG5cbiAgdHJhbnNmb3JtKHZhbHVlOiBudW1iZXJ8c3RyaW5nLCBkaWdpdHNJbmZvPzogc3RyaW5nLCBsb2NhbGU/OiBzdHJpbmcpOiBzdHJpbmd8bnVsbDtcbiAgdHJhbnNmb3JtKHZhbHVlOiBudWxsfHVuZGVmaW5lZCwgZGlnaXRzSW5mbz86IHN0cmluZywgbG9jYWxlPzogc3RyaW5nKTogbnVsbDtcbiAgdHJhbnNmb3JtKHZhbHVlOiBudW1iZXJ8c3RyaW5nfG51bGx8dW5kZWZpbmVkLCBkaWdpdHNJbmZvPzogc3RyaW5nLCBsb2NhbGU/OiBzdHJpbmcpOiBzdHJpbmd8bnVsbDtcbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgbnVtYmVyIHRvIGJlIGZvcm1hdHRlZCBhcyBhIHBlcmNlbnRhZ2UuXG4gICAqIEBwYXJhbSBkaWdpdHNJbmZvIERlY2ltYWwgcmVwcmVzZW50YXRpb24gb3B0aW9ucywgc3BlY2lmaWVkIGJ5IGEgc3RyaW5nXG4gICAqIGluIHRoZSBmb2xsb3dpbmcgZm9ybWF0Ojxicj5cbiAgICogPGNvZGU+e21pbkludGVnZXJEaWdpdHN9LnttaW5GcmFjdGlvbkRpZ2l0c30te21heEZyYWN0aW9uRGlnaXRzfTwvY29kZT4uXG4gICAqICAgLSBgbWluSW50ZWdlckRpZ2l0c2A6IFRoZSBtaW5pbXVtIG51bWJlciBvZiBpbnRlZ2VyIGRpZ2l0cyBiZWZvcmUgdGhlIGRlY2ltYWwgcG9pbnQuXG4gICAqIERlZmF1bHQgaXMgYDFgLlxuICAgKiAgIC0gYG1pbkZyYWN0aW9uRGlnaXRzYDogVGhlIG1pbmltdW0gbnVtYmVyIG9mIGRpZ2l0cyBhZnRlciB0aGUgZGVjaW1hbCBwb2ludC5cbiAgICogRGVmYXVsdCBpcyBgMGAuXG4gICAqICAgLSBgbWF4RnJhY3Rpb25EaWdpdHNgOiBUaGUgbWF4aW11bSBudW1iZXIgb2YgZGlnaXRzIGFmdGVyIHRoZSBkZWNpbWFsIHBvaW50LlxuICAgKiBEZWZhdWx0IGlzIGAwYC5cbiAgICogQHBhcmFtIGxvY2FsZSBBIGxvY2FsZSBjb2RlIGZvciB0aGUgbG9jYWxlIGZvcm1hdCBydWxlcyB0byB1c2UuXG4gICAqIFdoZW4gbm90IHN1cHBsaWVkLCB1c2VzIHRoZSB2YWx1ZSBvZiBgTE9DQUxFX0lEYCwgd2hpY2ggaXMgYGVuLVVTYCBieSBkZWZhdWx0LlxuICAgKiBTZWUgW1NldHRpbmcgeW91ciBhcHAgbG9jYWxlXShndWlkZS9pMThuLWNvbW1vbi1sb2NhbGUtaWQpLlxuICAgKi9cbiAgdHJhbnNmb3JtKHZhbHVlOiBudW1iZXJ8c3RyaW5nfG51bGx8dW5kZWZpbmVkLCBkaWdpdHNJbmZvPzogc3RyaW5nLCBsb2NhbGU/OiBzdHJpbmcpOiBzdHJpbmdcbiAgICAgIHxudWxsIHtcbiAgICBpZiAoIWlzVmFsdWUodmFsdWUpKSByZXR1cm4gbnVsbDtcbiAgICBsb2NhbGUgPSBsb2NhbGUgfHwgdGhpcy5fbG9jYWxlO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBudW0gPSBzdHJUb051bWJlcih2YWx1ZSk7XG4gICAgICByZXR1cm4gZm9ybWF0UGVyY2VudChudW0sIGxvY2FsZSwgZGlnaXRzSW5mbyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRocm93IGludmFsaWRQaXBlQXJndW1lbnRFcnJvcihQZXJjZW50UGlwZSwgKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBAbmdNb2R1bGUgQ29tbW9uTW9kdWxlXG4gKiBAZGVzY3JpcHRpb25cbiAqXG4gKiBUcmFuc2Zvcm1zIGEgbnVtYmVyIHRvIGEgY3VycmVuY3kgc3RyaW5nLCBmb3JtYXR0ZWQgYWNjb3JkaW5nIHRvIGxvY2FsZSBydWxlc1xuICogdGhhdCBkZXRlcm1pbmUgZ3JvdXAgc2l6aW5nIGFuZCBzZXBhcmF0b3IsIGRlY2ltYWwtcG9pbnQgY2hhcmFjdGVyLFxuICogYW5kIG90aGVyIGxvY2FsZS1zcGVjaWZpYyBjb25maWd1cmF0aW9ucy5cbiAqXG4gKiB7QGEgY3VycmVuY3ktY29kZS1kZXByZWNhdGlvbn1cbiAqIDxkaXYgY2xhc3M9XCJhbGVydCBpcy1oZWxwZnVsXCI+XG4gKlxuICogKipEZXByZWNhdGlvbiBub3RpY2U6KipcbiAqXG4gKiBUaGUgZGVmYXVsdCBjdXJyZW5jeSBjb2RlIGlzIGN1cnJlbnRseSBhbHdheXMgYFVTRGAgYnV0IHRoaXMgaXMgZGVwcmVjYXRlZCBmcm9tIHY5LlxuICpcbiAqICoqSW4gdjExIHRoZSBkZWZhdWx0IGN1cnJlbmN5IGNvZGUgd2lsbCBiZSB0YWtlbiBmcm9tIHRoZSBjdXJyZW50IGxvY2FsZSBpZGVudGlmaWVkIGJ5XG4gKiB0aGUgYExPQ0FMRV9JRGAgdG9rZW4uIFNlZSB0aGUgW2kxOG4gZ3VpZGVdKGd1aWRlL2kxOG4tY29tbW9uLWxvY2FsZS1pZCkgZm9yXG4gKiBtb3JlIGluZm9ybWF0aW9uLioqXG4gKlxuICogSWYgeW91IG5lZWQgdGhlIHByZXZpb3VzIGJlaGF2aW9yIHRoZW4gc2V0IGl0IGJ5IGNyZWF0aW5nIGEgYERFRkFVTFRfQ1VSUkVOQ1lfQ09ERWAgcHJvdmlkZXIgaW5cbiAqIHlvdXIgYXBwbGljYXRpb24gYE5nTW9kdWxlYDpcbiAqXG4gKiBgYGB0c1xuICoge3Byb3ZpZGU6IERFRkFVTFRfQ1VSUkVOQ1lfQ09ERSwgdXNlVmFsdWU6ICdVU0QnfVxuICogYGBgXG4gKlxuICogPC9kaXY+XG4gKlxuICogQHNlZSBgZ2V0Q3VycmVuY3lTeW1ib2woKWBcbiAqIEBzZWUgYGZvcm1hdEN1cnJlbmN5KClgXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqIFRoZSBmb2xsb3dpbmcgY29kZSBzaG93cyBob3cgdGhlIHBpcGUgdHJhbnNmb3JtcyBudW1iZXJzXG4gKiBpbnRvIHRleHQgc3RyaW5ncywgYWNjb3JkaW5nIHRvIHZhcmlvdXMgZm9ybWF0IHNwZWNpZmljYXRpb25zLFxuICogd2hlcmUgdGhlIGNhbGxlcidzIGRlZmF1bHQgbG9jYWxlIGlzIGBlbi1VU2AuXG4gKlxuICogPGNvZGUtZXhhbXBsZSBwYXRoPVwiY29tbW9uL3BpcGVzL3RzL2N1cnJlbmN5X3BpcGUudHNcIiByZWdpb249J0N1cnJlbmN5UGlwZSc+PC9jb2RlLWV4YW1wbGU+XG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5AUGlwZSh7bmFtZTogJ2N1cnJlbmN5J30pXG5leHBvcnQgY2xhc3MgQ3VycmVuY3lQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgQEluamVjdChMT0NBTEVfSUQpIHByaXZhdGUgX2xvY2FsZTogc3RyaW5nLFxuICAgICAgQEluamVjdChERUZBVUxUX0NVUlJFTkNZX0NPREUpIHByaXZhdGUgX2RlZmF1bHRDdXJyZW5jeUNvZGU6IHN0cmluZyA9ICdVU0QnKSB7fVxuXG4gIHRyYW5zZm9ybShcbiAgICAgIHZhbHVlOiBudW1iZXJ8c3RyaW5nLCBjdXJyZW5jeUNvZGU/OiBzdHJpbmcsXG4gICAgICBkaXNwbGF5PzogJ2NvZGUnfCdzeW1ib2wnfCdzeW1ib2wtbmFycm93J3xzdHJpbmd8Ym9vbGVhbiwgZGlnaXRzSW5mbz86IHN0cmluZyxcbiAgICAgIGxvY2FsZT86IHN0cmluZyk6IHN0cmluZ3xudWxsO1xuICB0cmFuc2Zvcm0oXG4gICAgICB2YWx1ZTogbnVsbHx1bmRlZmluZWQsIGN1cnJlbmN5Q29kZT86IHN0cmluZyxcbiAgICAgIGRpc3BsYXk/OiAnY29kZSd8J3N5bWJvbCd8J3N5bWJvbC1uYXJyb3cnfHN0cmluZ3xib29sZWFuLCBkaWdpdHNJbmZvPzogc3RyaW5nLFxuICAgICAgbG9jYWxlPzogc3RyaW5nKTogbnVsbDtcbiAgdHJhbnNmb3JtKFxuICAgICAgdmFsdWU6IG51bWJlcnxzdHJpbmd8bnVsbHx1bmRlZmluZWQsIGN1cnJlbmN5Q29kZT86IHN0cmluZyxcbiAgICAgIGRpc3BsYXk/OiAnY29kZSd8J3N5bWJvbCd8J3N5bWJvbC1uYXJyb3cnfHN0cmluZ3xib29sZWFuLCBkaWdpdHNJbmZvPzogc3RyaW5nLFxuICAgICAgbG9jYWxlPzogc3RyaW5nKTogc3RyaW5nfG51bGw7XG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgVGhlIG51bWJlciB0byBiZSBmb3JtYXR0ZWQgYXMgY3VycmVuY3kuXG4gICAqIEBwYXJhbSBjdXJyZW5jeUNvZGUgVGhlIFtJU08gNDIxN10oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSVNPXzQyMTcpIGN1cnJlbmN5IGNvZGUsXG4gICAqIHN1Y2ggYXMgYFVTRGAgZm9yIHRoZSBVUyBkb2xsYXIgYW5kIGBFVVJgIGZvciB0aGUgZXVyby4gVGhlIGRlZmF1bHQgY3VycmVuY3kgY29kZSBjYW4gYmVcbiAgICogY29uZmlndXJlZCB1c2luZyB0aGUgYERFRkFVTFRfQ1VSUkVOQ1lfQ09ERWAgaW5qZWN0aW9uIHRva2VuLlxuICAgKiBAcGFyYW0gZGlzcGxheSBUaGUgZm9ybWF0IGZvciB0aGUgY3VycmVuY3kgaW5kaWNhdG9yLiBPbmUgb2YgdGhlIGZvbGxvd2luZzpcbiAgICogICAtIGBjb2RlYDogU2hvdyB0aGUgY29kZSAoc3VjaCBhcyBgVVNEYCkuXG4gICAqICAgLSBgc3ltYm9sYChkZWZhdWx0KTogU2hvdyB0aGUgc3ltYm9sIChzdWNoIGFzIGAkYCkuXG4gICAqICAgLSBgc3ltYm9sLW5hcnJvd2A6IFVzZSB0aGUgbmFycm93IHN5bWJvbCBmb3IgbG9jYWxlcyB0aGF0IGhhdmUgdHdvIHN5bWJvbHMgZm9yIHRoZWlyXG4gICAqIGN1cnJlbmN5LlxuICAgKiBGb3IgZXhhbXBsZSwgdGhlIENhbmFkaWFuIGRvbGxhciBDQUQgaGFzIHRoZSBzeW1ib2wgYENBJGAgYW5kIHRoZSBzeW1ib2wtbmFycm93IGAkYC4gSWYgdGhlXG4gICAqIGxvY2FsZSBoYXMgbm8gbmFycm93IHN5bWJvbCwgdXNlcyB0aGUgc3RhbmRhcmQgc3ltYm9sIGZvciB0aGUgbG9jYWxlLlxuICAgKiAgIC0gU3RyaW5nOiBVc2UgdGhlIGdpdmVuIHN0cmluZyB2YWx1ZSBpbnN0ZWFkIG9mIGEgY29kZSBvciBhIHN5bWJvbC5cbiAgICogRm9yIGV4YW1wbGUsIGFuIGVtcHR5IHN0cmluZyB3aWxsIHN1cHByZXNzIHRoZSBjdXJyZW5jeSAmIHN5bWJvbC5cbiAgICogICAtIEJvb2xlYW4gKG1hcmtlZCBkZXByZWNhdGVkIGluIHY1KTogYHRydWVgIGZvciBzeW1ib2wgYW5kIGZhbHNlIGZvciBgY29kZWAuXG4gICAqXG4gICAqIEBwYXJhbSBkaWdpdHNJbmZvIERlY2ltYWwgcmVwcmVzZW50YXRpb24gb3B0aW9ucywgc3BlY2lmaWVkIGJ5IGEgc3RyaW5nXG4gICAqIGluIHRoZSBmb2xsb3dpbmcgZm9ybWF0Ojxicj5cbiAgICogPGNvZGU+e21pbkludGVnZXJEaWdpdHN9LnttaW5GcmFjdGlvbkRpZ2l0c30te21heEZyYWN0aW9uRGlnaXRzfTwvY29kZT4uXG4gICAqICAgLSBgbWluSW50ZWdlckRpZ2l0c2A6IFRoZSBtaW5pbXVtIG51bWJlciBvZiBpbnRlZ2VyIGRpZ2l0cyBiZWZvcmUgdGhlIGRlY2ltYWwgcG9pbnQuXG4gICAqIERlZmF1bHQgaXMgYDFgLlxuICAgKiAgIC0gYG1pbkZyYWN0aW9uRGlnaXRzYDogVGhlIG1pbmltdW0gbnVtYmVyIG9mIGRpZ2l0cyBhZnRlciB0aGUgZGVjaW1hbCBwb2ludC5cbiAgICogRGVmYXVsdCBpcyBgMmAuXG4gICAqICAgLSBgbWF4RnJhY3Rpb25EaWdpdHNgOiBUaGUgbWF4aW11bSBudW1iZXIgb2YgZGlnaXRzIGFmdGVyIHRoZSBkZWNpbWFsIHBvaW50LlxuICAgKiBEZWZhdWx0IGlzIGAyYC5cbiAgICogSWYgbm90IHByb3ZpZGVkLCB0aGUgbnVtYmVyIHdpbGwgYmUgZm9ybWF0dGVkIHdpdGggdGhlIHByb3BlciBhbW91bnQgb2YgZGlnaXRzLFxuICAgKiBkZXBlbmRpbmcgb24gd2hhdCB0aGUgW0lTTyA0MjE3XShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9JU09fNDIxNykgc3BlY2lmaWVzLlxuICAgKiBGb3IgZXhhbXBsZSwgdGhlIENhbmFkaWFuIGRvbGxhciBoYXMgMiBkaWdpdHMsIHdoZXJlYXMgdGhlIENoaWxlYW4gcGVzbyBoYXMgbm9uZS5cbiAgICogQHBhcmFtIGxvY2FsZSBBIGxvY2FsZSBjb2RlIGZvciB0aGUgbG9jYWxlIGZvcm1hdCBydWxlcyB0byB1c2UuXG4gICAqIFdoZW4gbm90IHN1cHBsaWVkLCB1c2VzIHRoZSB2YWx1ZSBvZiBgTE9DQUxFX0lEYCwgd2hpY2ggaXMgYGVuLVVTYCBieSBkZWZhdWx0LlxuICAgKiBTZWUgW1NldHRpbmcgeW91ciBhcHAgbG9jYWxlXShndWlkZS9pMThuLWNvbW1vbi1sb2NhbGUtaWQpLlxuICAgKi9cbiAgdHJhbnNmb3JtKFxuICAgICAgdmFsdWU6IG51bWJlcnxzdHJpbmd8bnVsbHx1bmRlZmluZWQsIGN1cnJlbmN5Q29kZTogc3RyaW5nID0gdGhpcy5fZGVmYXVsdEN1cnJlbmN5Q29kZSxcbiAgICAgIGRpc3BsYXk6ICdjb2RlJ3wnc3ltYm9sJ3wnc3ltYm9sLW5hcnJvdyd8c3RyaW5nfGJvb2xlYW4gPSAnc3ltYm9sJywgZGlnaXRzSW5mbz86IHN0cmluZyxcbiAgICAgIGxvY2FsZT86IHN0cmluZyk6IHN0cmluZ3xudWxsIHtcbiAgICBpZiAoIWlzVmFsdWUodmFsdWUpKSByZXR1cm4gbnVsbDtcblxuICAgIGxvY2FsZSA9IGxvY2FsZSB8fCB0aGlzLl9sb2NhbGU7XG5cbiAgICBpZiAodHlwZW9mIGRpc3BsYXkgPT09ICdib29sZWFuJykge1xuICAgICAgaWYgKCh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpICYmIDxhbnk+Y29uc29sZSAmJiA8YW55PmNvbnNvbGUud2Fybikge1xuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICBgV2FybmluZzogdGhlIGN1cnJlbmN5IHBpcGUgaGFzIGJlZW4gY2hhbmdlZCBpbiBBbmd1bGFyIHY1LiBUaGUgc3ltYm9sRGlzcGxheSBvcHRpb24gKHRoaXJkIHBhcmFtZXRlcikgaXMgbm93IGEgc3RyaW5nIGluc3RlYWQgb2YgYSBib29sZWFuLiBUaGUgYWNjZXB0ZWQgdmFsdWVzIGFyZSBcImNvZGVcIiwgXCJzeW1ib2xcIiBvciBcInN5bWJvbC1uYXJyb3dcIi5gKTtcbiAgICAgIH1cbiAgICAgIGRpc3BsYXkgPSBkaXNwbGF5ID8gJ3N5bWJvbCcgOiAnY29kZSc7XG4gICAgfVxuXG4gICAgbGV0IGN1cnJlbmN5OiBzdHJpbmcgPSBjdXJyZW5jeUNvZGUgfHwgdGhpcy5fZGVmYXVsdEN1cnJlbmN5Q29kZTtcbiAgICBpZiAoZGlzcGxheSAhPT0gJ2NvZGUnKSB7XG4gICAgICBpZiAoZGlzcGxheSA9PT0gJ3N5bWJvbCcgfHwgZGlzcGxheSA9PT0gJ3N5bWJvbC1uYXJyb3cnKSB7XG4gICAgICAgIGN1cnJlbmN5ID0gZ2V0Q3VycmVuY3lTeW1ib2woY3VycmVuY3ksIGRpc3BsYXkgPT09ICdzeW1ib2wnID8gJ3dpZGUnIDogJ25hcnJvdycsIGxvY2FsZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdXJyZW5jeSA9IGRpc3BsYXk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG51bSA9IHN0clRvTnVtYmVyKHZhbHVlKTtcbiAgICAgIHJldHVybiBmb3JtYXRDdXJyZW5jeShudW0sIGxvY2FsZSwgY3VycmVuY3ksIGN1cnJlbmN5Q29kZSwgZGlnaXRzSW5mbyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRocm93IGludmFsaWRQaXBlQXJndW1lbnRFcnJvcihDdXJyZW5jeVBpcGUsIChlcnJvciBhcyBFcnJvcikubWVzc2FnZSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGlzVmFsdWUodmFsdWU6IG51bWJlcnxzdHJpbmd8bnVsbHx1bmRlZmluZWQpOiB2YWx1ZSBpcyBudW1iZXJ8c3RyaW5nIHtcbiAgcmV0dXJuICEodmFsdWUgPT0gbnVsbCB8fCB2YWx1ZSA9PT0gJycgfHwgdmFsdWUgIT09IHZhbHVlKTtcbn1cblxuLyoqXG4gKiBUcmFuc2Zvcm1zIGEgc3RyaW5nIGludG8gYSBudW1iZXIgKGlmIG5lZWRlZCkuXG4gKi9cbmZ1bmN0aW9uIHN0clRvTnVtYmVyKHZhbHVlOiBudW1iZXJ8c3RyaW5nKTogbnVtYmVyIHtcbiAgLy8gQ29udmVydCBzdHJpbmdzIHRvIG51bWJlcnNcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgIWlzTmFOKE51bWJlcih2YWx1ZSkgLSBwYXJzZUZsb2F0KHZhbHVlKSkpIHtcbiAgICByZXR1cm4gTnVtYmVyKHZhbHVlKTtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBFcnJvcihgJHt2YWx1ZX0gaXMgbm90IGEgbnVtYmVyYCk7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufVxuIl19