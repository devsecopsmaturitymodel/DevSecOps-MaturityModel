/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { global } from '../util/global';
import localeEn from './locale_en';
/**
 * This const is used to store the locale data registered with `registerLocaleData`
 */
let LOCALE_DATA = {};
/**
 * Register locale data to be used internally by Angular. See the
 * ["I18n guide"](guide/i18n-common-format-data-locale) to know how to import additional locale
 * data.
 *
 * The signature `registerLocaleData(data: any, extraData?: any)` is deprecated since v5.1
 */
export function registerLocaleData(data, localeId, extraData) {
    if (typeof localeId !== 'string') {
        extraData = localeId;
        localeId = data[LocaleDataIndex.LocaleId];
    }
    localeId = localeId.toLowerCase().replace(/_/g, '-');
    LOCALE_DATA[localeId] = data;
    if (extraData) {
        LOCALE_DATA[localeId][LocaleDataIndex.ExtraData] = extraData;
    }
}
/**
 * Finds the locale data for a given locale.
 *
 * @param locale The locale code.
 * @returns The locale data.
 * @see [Internationalization (i18n) Guide](https://angular.io/guide/i18n-overview)
 */
export function findLocaleData(locale) {
    const normalizedLocale = normalizeLocale(locale);
    let match = getLocaleData(normalizedLocale);
    if (match) {
        return match;
    }
    // let's try to find a parent locale
    const parentLocale = normalizedLocale.split('-')[0];
    match = getLocaleData(parentLocale);
    if (match) {
        return match;
    }
    if (parentLocale === 'en') {
        return localeEn;
    }
    throw new Error(`Missing locale data for the locale "${locale}".`);
}
/**
 * Retrieves the default currency code for the given locale.
 *
 * The default is defined as the first currency which is still in use.
 *
 * @param locale The code of the locale whose currency code we want.
 * @returns The code of the default currency for the given locale.
 *
 */
export function getLocaleCurrencyCode(locale) {
    const data = findLocaleData(locale);
    return data[LocaleDataIndex.CurrencyCode] || null;
}
/**
 * Retrieves the plural function used by ICU expressions to determine the plural case to use
 * for a given locale.
 * @param locale A locale code for the locale format rules to use.
 * @returns The plural function for the locale.
 * @see `NgPlural`
 * @see [Internationalization (i18n) Guide](https://angular.io/guide/i18n-overview)
 */
export function getLocalePluralCase(locale) {
    const data = findLocaleData(locale);
    return data[LocaleDataIndex.PluralCase];
}
/**
 * Helper function to get the given `normalizedLocale` from `LOCALE_DATA`
 * or from the global `ng.common.locale`.
 */
export function getLocaleData(normalizedLocale) {
    if (!(normalizedLocale in LOCALE_DATA)) {
        LOCALE_DATA[normalizedLocale] = global.ng && global.ng.common && global.ng.common.locales &&
            global.ng.common.locales[normalizedLocale];
    }
    return LOCALE_DATA[normalizedLocale];
}
/**
 * Helper function to remove all the locale data from `LOCALE_DATA`.
 */
export function unregisterAllLocaleData() {
    LOCALE_DATA = {};
}
/**
 * Index of each type of locale data from the locale data array
 */
export var LocaleDataIndex;
(function (LocaleDataIndex) {
    LocaleDataIndex[LocaleDataIndex["LocaleId"] = 0] = "LocaleId";
    LocaleDataIndex[LocaleDataIndex["DayPeriodsFormat"] = 1] = "DayPeriodsFormat";
    LocaleDataIndex[LocaleDataIndex["DayPeriodsStandalone"] = 2] = "DayPeriodsStandalone";
    LocaleDataIndex[LocaleDataIndex["DaysFormat"] = 3] = "DaysFormat";
    LocaleDataIndex[LocaleDataIndex["DaysStandalone"] = 4] = "DaysStandalone";
    LocaleDataIndex[LocaleDataIndex["MonthsFormat"] = 5] = "MonthsFormat";
    LocaleDataIndex[LocaleDataIndex["MonthsStandalone"] = 6] = "MonthsStandalone";
    LocaleDataIndex[LocaleDataIndex["Eras"] = 7] = "Eras";
    LocaleDataIndex[LocaleDataIndex["FirstDayOfWeek"] = 8] = "FirstDayOfWeek";
    LocaleDataIndex[LocaleDataIndex["WeekendRange"] = 9] = "WeekendRange";
    LocaleDataIndex[LocaleDataIndex["DateFormat"] = 10] = "DateFormat";
    LocaleDataIndex[LocaleDataIndex["TimeFormat"] = 11] = "TimeFormat";
    LocaleDataIndex[LocaleDataIndex["DateTimeFormat"] = 12] = "DateTimeFormat";
    LocaleDataIndex[LocaleDataIndex["NumberSymbols"] = 13] = "NumberSymbols";
    LocaleDataIndex[LocaleDataIndex["NumberFormats"] = 14] = "NumberFormats";
    LocaleDataIndex[LocaleDataIndex["CurrencyCode"] = 15] = "CurrencyCode";
    LocaleDataIndex[LocaleDataIndex["CurrencySymbol"] = 16] = "CurrencySymbol";
    LocaleDataIndex[LocaleDataIndex["CurrencyName"] = 17] = "CurrencyName";
    LocaleDataIndex[LocaleDataIndex["Currencies"] = 18] = "Currencies";
    LocaleDataIndex[LocaleDataIndex["Directionality"] = 19] = "Directionality";
    LocaleDataIndex[LocaleDataIndex["PluralCase"] = 20] = "PluralCase";
    LocaleDataIndex[LocaleDataIndex["ExtraData"] = 21] = "ExtraData";
})(LocaleDataIndex || (LocaleDataIndex = {}));
/**
 * Returns the canonical form of a locale name - lowercase with `_` replaced with `-`.
 */
function normalizeLocale(locale) {
    return locale.toLowerCase().replace(/_/g, '-');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxlX2RhdGFfYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvaTE4bi9sb2NhbGVfZGF0YV9hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXRDLE9BQU8sUUFBUSxNQUFNLGFBQWEsQ0FBQztBQUVuQzs7R0FFRztBQUNILElBQUksV0FBVyxHQUE4QixFQUFFLENBQUM7QUFFaEQ7Ozs7OztHQU1HO0FBQ0gsTUFBTSxVQUFVLGtCQUFrQixDQUFDLElBQVMsRUFBRSxRQUFxQixFQUFFLFNBQWU7SUFDbEYsSUFBSSxPQUFPLFFBQVEsS0FBSyxRQUFRLEVBQUU7UUFDaEMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUNyQixRQUFRLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUMzQztJQUVELFFBQVEsR0FBRyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztJQUVyRCxXQUFXLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBRTdCLElBQUksU0FBUyxFQUFFO1FBQ2IsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsR0FBRyxTQUFTLENBQUM7S0FDOUQ7QUFDSCxDQUFDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsTUFBTSxVQUFVLGNBQWMsQ0FBQyxNQUFjO0lBQzNDLE1BQU0sZ0JBQWdCLEdBQUcsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRWpELElBQUksS0FBSyxHQUFHLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQzVDLElBQUksS0FBSyxFQUFFO1FBQ1QsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUVELG9DQUFvQztJQUNwQyxNQUFNLFlBQVksR0FBRyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEQsS0FBSyxHQUFHLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNwQyxJQUFJLEtBQUssRUFBRTtRQUNULE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFFRCxJQUFJLFlBQVksS0FBSyxJQUFJLEVBQUU7UUFDekIsT0FBTyxRQUFRLENBQUM7S0FDakI7SUFFRCxNQUFNLElBQUksS0FBSyxDQUFDLHVDQUF1QyxNQUFNLElBQUksQ0FBQyxDQUFDO0FBQ3JFLENBQUM7QUFFRDs7Ozs7Ozs7R0FRRztBQUNILE1BQU0sVUFBVSxxQkFBcUIsQ0FBQyxNQUFjO0lBQ2xELE1BQU0sSUFBSSxHQUFHLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNwQyxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLElBQUksSUFBSSxDQUFDO0FBQ3BELENBQUM7QUFFRDs7Ozs7OztHQU9HO0FBQ0gsTUFBTSxVQUFVLG1CQUFtQixDQUFDLE1BQWM7SUFDaEQsTUFBTSxJQUFJLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3BDLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMxQyxDQUFDO0FBSUQ7OztHQUdHO0FBQ0gsTUFBTSxVQUFVLGFBQWEsQ0FBQyxnQkFBd0I7SUFDcEQsSUFBSSxDQUFDLENBQUMsZ0JBQWdCLElBQUksV0FBVyxDQUFDLEVBQUU7UUFDdEMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsTUFBTSxDQUFDLEVBQUUsSUFBSSxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPO1lBQ3JGLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0tBQ2hEO0lBQ0QsT0FBTyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUN2QyxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLFVBQVUsdUJBQXVCO0lBQ3JDLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFDbkIsQ0FBQztBQUVEOztHQUVHO0FBQ0gsTUFBTSxDQUFOLElBQVksZUF1Qlg7QUF2QkQsV0FBWSxlQUFlO0lBQ3pCLDZEQUFZLENBQUE7SUFDWiw2RUFBZ0IsQ0FBQTtJQUNoQixxRkFBb0IsQ0FBQTtJQUNwQixpRUFBVSxDQUFBO0lBQ1YseUVBQWMsQ0FBQTtJQUNkLHFFQUFZLENBQUE7SUFDWiw2RUFBZ0IsQ0FBQTtJQUNoQixxREFBSSxDQUFBO0lBQ0oseUVBQWMsQ0FBQTtJQUNkLHFFQUFZLENBQUE7SUFDWixrRUFBVSxDQUFBO0lBQ1Ysa0VBQVUsQ0FBQTtJQUNWLDBFQUFjLENBQUE7SUFDZCx3RUFBYSxDQUFBO0lBQ2Isd0VBQWEsQ0FBQTtJQUNiLHNFQUFZLENBQUE7SUFDWiwwRUFBYyxDQUFBO0lBQ2Qsc0VBQVksQ0FBQTtJQUNaLGtFQUFVLENBQUE7SUFDViwwRUFBYyxDQUFBO0lBQ2Qsa0VBQVUsQ0FBQTtJQUNWLGdFQUFTLENBQUE7QUFDWCxDQUFDLEVBdkJXLGVBQWUsS0FBZixlQUFlLFFBdUIxQjtBQW9CRDs7R0FFRztBQUNILFNBQVMsZUFBZSxDQUFDLE1BQWM7SUFDckMsT0FBTyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNqRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge2dsb2JhbH0gZnJvbSAnLi4vdXRpbC9nbG9iYWwnO1xuXG5pbXBvcnQgbG9jYWxlRW4gZnJvbSAnLi9sb2NhbGVfZW4nO1xuXG4vKipcbiAqIFRoaXMgY29uc3QgaXMgdXNlZCB0byBzdG9yZSB0aGUgbG9jYWxlIGRhdGEgcmVnaXN0ZXJlZCB3aXRoIGByZWdpc3RlckxvY2FsZURhdGFgXG4gKi9cbmxldCBMT0NBTEVfREFUQToge1tsb2NhbGVJZDogc3RyaW5nXTogYW55fSA9IHt9O1xuXG4vKipcbiAqIFJlZ2lzdGVyIGxvY2FsZSBkYXRhIHRvIGJlIHVzZWQgaW50ZXJuYWxseSBieSBBbmd1bGFyLiBTZWUgdGhlXG4gKiBbXCJJMThuIGd1aWRlXCJdKGd1aWRlL2kxOG4tY29tbW9uLWZvcm1hdC1kYXRhLWxvY2FsZSkgdG8ga25vdyBob3cgdG8gaW1wb3J0IGFkZGl0aW9uYWwgbG9jYWxlXG4gKiBkYXRhLlxuICpcbiAqIFRoZSBzaWduYXR1cmUgYHJlZ2lzdGVyTG9jYWxlRGF0YShkYXRhOiBhbnksIGV4dHJhRGF0YT86IGFueSlgIGlzIGRlcHJlY2F0ZWQgc2luY2UgdjUuMVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJMb2NhbGVEYXRhKGRhdGE6IGFueSwgbG9jYWxlSWQ/OiBzdHJpbmd8YW55LCBleHRyYURhdGE/OiBhbnkpOiB2b2lkIHtcbiAgaWYgKHR5cGVvZiBsb2NhbGVJZCAhPT0gJ3N0cmluZycpIHtcbiAgICBleHRyYURhdGEgPSBsb2NhbGVJZDtcbiAgICBsb2NhbGVJZCA9IGRhdGFbTG9jYWxlRGF0YUluZGV4LkxvY2FsZUlkXTtcbiAgfVxuXG4gIGxvY2FsZUlkID0gbG9jYWxlSWQudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9fL2csICctJyk7XG5cbiAgTE9DQUxFX0RBVEFbbG9jYWxlSWRdID0gZGF0YTtcblxuICBpZiAoZXh0cmFEYXRhKSB7XG4gICAgTE9DQUxFX0RBVEFbbG9jYWxlSWRdW0xvY2FsZURhdGFJbmRleC5FeHRyYURhdGFdID0gZXh0cmFEYXRhO1xuICB9XG59XG5cbi8qKlxuICogRmluZHMgdGhlIGxvY2FsZSBkYXRhIGZvciBhIGdpdmVuIGxvY2FsZS5cbiAqXG4gKiBAcGFyYW0gbG9jYWxlIFRoZSBsb2NhbGUgY29kZS5cbiAqIEByZXR1cm5zIFRoZSBsb2NhbGUgZGF0YS5cbiAqIEBzZWUgW0ludGVybmF0aW9uYWxpemF0aW9uIChpMThuKSBHdWlkZV0oaHR0cHM6Ly9hbmd1bGFyLmlvL2d1aWRlL2kxOG4tb3ZlcnZpZXcpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kTG9jYWxlRGF0YShsb2NhbGU6IHN0cmluZyk6IGFueSB7XG4gIGNvbnN0IG5vcm1hbGl6ZWRMb2NhbGUgPSBub3JtYWxpemVMb2NhbGUobG9jYWxlKTtcblxuICBsZXQgbWF0Y2ggPSBnZXRMb2NhbGVEYXRhKG5vcm1hbGl6ZWRMb2NhbGUpO1xuICBpZiAobWF0Y2gpIHtcbiAgICByZXR1cm4gbWF0Y2g7XG4gIH1cblxuICAvLyBsZXQncyB0cnkgdG8gZmluZCBhIHBhcmVudCBsb2NhbGVcbiAgY29uc3QgcGFyZW50TG9jYWxlID0gbm9ybWFsaXplZExvY2FsZS5zcGxpdCgnLScpWzBdO1xuICBtYXRjaCA9IGdldExvY2FsZURhdGEocGFyZW50TG9jYWxlKTtcbiAgaWYgKG1hdGNoKSB7XG4gICAgcmV0dXJuIG1hdGNoO1xuICB9XG5cbiAgaWYgKHBhcmVudExvY2FsZSA9PT0gJ2VuJykge1xuICAgIHJldHVybiBsb2NhbGVFbjtcbiAgfVxuXG4gIHRocm93IG5ldyBFcnJvcihgTWlzc2luZyBsb2NhbGUgZGF0YSBmb3IgdGhlIGxvY2FsZSBcIiR7bG9jYWxlfVwiLmApO1xufVxuXG4vKipcbiAqIFJldHJpZXZlcyB0aGUgZGVmYXVsdCBjdXJyZW5jeSBjb2RlIGZvciB0aGUgZ2l2ZW4gbG9jYWxlLlxuICpcbiAqIFRoZSBkZWZhdWx0IGlzIGRlZmluZWQgYXMgdGhlIGZpcnN0IGN1cnJlbmN5IHdoaWNoIGlzIHN0aWxsIGluIHVzZS5cbiAqXG4gKiBAcGFyYW0gbG9jYWxlIFRoZSBjb2RlIG9mIHRoZSBsb2NhbGUgd2hvc2UgY3VycmVuY3kgY29kZSB3ZSB3YW50LlxuICogQHJldHVybnMgVGhlIGNvZGUgb2YgdGhlIGRlZmF1bHQgY3VycmVuY3kgZm9yIHRoZSBnaXZlbiBsb2NhbGUuXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9jYWxlQ3VycmVuY3lDb2RlKGxvY2FsZTogc3RyaW5nKTogc3RyaW5nfG51bGwge1xuICBjb25zdCBkYXRhID0gZmluZExvY2FsZURhdGEobG9jYWxlKTtcbiAgcmV0dXJuIGRhdGFbTG9jYWxlRGF0YUluZGV4LkN1cnJlbmN5Q29kZV0gfHwgbnVsbDtcbn1cblxuLyoqXG4gKiBSZXRyaWV2ZXMgdGhlIHBsdXJhbCBmdW5jdGlvbiB1c2VkIGJ5IElDVSBleHByZXNzaW9ucyB0byBkZXRlcm1pbmUgdGhlIHBsdXJhbCBjYXNlIHRvIHVzZVxuICogZm9yIGEgZ2l2ZW4gbG9jYWxlLlxuICogQHBhcmFtIGxvY2FsZSBBIGxvY2FsZSBjb2RlIGZvciB0aGUgbG9jYWxlIGZvcm1hdCBydWxlcyB0byB1c2UuXG4gKiBAcmV0dXJucyBUaGUgcGx1cmFsIGZ1bmN0aW9uIGZvciB0aGUgbG9jYWxlLlxuICogQHNlZSBgTmdQbHVyYWxgXG4gKiBAc2VlIFtJbnRlcm5hdGlvbmFsaXphdGlvbiAoaTE4bikgR3VpZGVdKGh0dHBzOi8vYW5ndWxhci5pby9ndWlkZS9pMThuLW92ZXJ2aWV3KVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9jYWxlUGx1cmFsQ2FzZShsb2NhbGU6IHN0cmluZyk6ICh2YWx1ZTogbnVtYmVyKSA9PiBudW1iZXIge1xuICBjb25zdCBkYXRhID0gZmluZExvY2FsZURhdGEobG9jYWxlKTtcbiAgcmV0dXJuIGRhdGFbTG9jYWxlRGF0YUluZGV4LlBsdXJhbENhc2VdO1xufVxuXG5cblxuLyoqXG4gKiBIZWxwZXIgZnVuY3Rpb24gdG8gZ2V0IHRoZSBnaXZlbiBgbm9ybWFsaXplZExvY2FsZWAgZnJvbSBgTE9DQUxFX0RBVEFgXG4gKiBvciBmcm9tIHRoZSBnbG9iYWwgYG5nLmNvbW1vbi5sb2NhbGVgLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9jYWxlRGF0YShub3JtYWxpemVkTG9jYWxlOiBzdHJpbmcpOiBhbnkge1xuICBpZiAoIShub3JtYWxpemVkTG9jYWxlIGluIExPQ0FMRV9EQVRBKSkge1xuICAgIExPQ0FMRV9EQVRBW25vcm1hbGl6ZWRMb2NhbGVdID0gZ2xvYmFsLm5nICYmIGdsb2JhbC5uZy5jb21tb24gJiYgZ2xvYmFsLm5nLmNvbW1vbi5sb2NhbGVzICYmXG4gICAgICAgIGdsb2JhbC5uZy5jb21tb24ubG9jYWxlc1tub3JtYWxpemVkTG9jYWxlXTtcbiAgfVxuICByZXR1cm4gTE9DQUxFX0RBVEFbbm9ybWFsaXplZExvY2FsZV07XG59XG5cbi8qKlxuICogSGVscGVyIGZ1bmN0aW9uIHRvIHJlbW92ZSBhbGwgdGhlIGxvY2FsZSBkYXRhIGZyb20gYExPQ0FMRV9EQVRBYC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVucmVnaXN0ZXJBbGxMb2NhbGVEYXRhKCkge1xuICBMT0NBTEVfREFUQSA9IHt9O1xufVxuXG4vKipcbiAqIEluZGV4IG9mIGVhY2ggdHlwZSBvZiBsb2NhbGUgZGF0YSBmcm9tIHRoZSBsb2NhbGUgZGF0YSBhcnJheVxuICovXG5leHBvcnQgZW51bSBMb2NhbGVEYXRhSW5kZXgge1xuICBMb2NhbGVJZCA9IDAsXG4gIERheVBlcmlvZHNGb3JtYXQsXG4gIERheVBlcmlvZHNTdGFuZGFsb25lLFxuICBEYXlzRm9ybWF0LFxuICBEYXlzU3RhbmRhbG9uZSxcbiAgTW9udGhzRm9ybWF0LFxuICBNb250aHNTdGFuZGFsb25lLFxuICBFcmFzLFxuICBGaXJzdERheU9mV2VlayxcbiAgV2Vla2VuZFJhbmdlLFxuICBEYXRlRm9ybWF0LFxuICBUaW1lRm9ybWF0LFxuICBEYXRlVGltZUZvcm1hdCxcbiAgTnVtYmVyU3ltYm9scyxcbiAgTnVtYmVyRm9ybWF0cyxcbiAgQ3VycmVuY3lDb2RlLFxuICBDdXJyZW5jeVN5bWJvbCxcbiAgQ3VycmVuY3lOYW1lLFxuICBDdXJyZW5jaWVzLFxuICBEaXJlY3Rpb25hbGl0eSxcbiAgUGx1cmFsQ2FzZSxcbiAgRXh0cmFEYXRhXG59XG5cbi8qKlxuICogSW5kZXggb2YgZWFjaCB0eXBlIG9mIGxvY2FsZSBkYXRhIGZyb20gdGhlIGV4dHJhIGxvY2FsZSBkYXRhIGFycmF5XG4gKi9cbmV4cG9ydCBjb25zdCBlbnVtIEV4dHJhTG9jYWxlRGF0YUluZGV4IHtcbiAgRXh0cmFEYXlQZXJpb2RGb3JtYXRzID0gMCxcbiAgRXh0cmFEYXlQZXJpb2RTdGFuZGFsb25lLFxuICBFeHRyYURheVBlcmlvZHNSdWxlc1xufVxuXG4vKipcbiAqIEluZGV4IG9mIGVhY2ggdmFsdWUgaW4gY3VycmVuY3kgZGF0YSAodXNlZCB0byBkZXNjcmliZSBDVVJSRU5DSUVTX0VOIGluIGN1cnJlbmNpZXMudHMpXG4gKi9cbmV4cG9ydCBjb25zdCBlbnVtIEN1cnJlbmN5SW5kZXgge1xuICBTeW1ib2wgPSAwLFxuICBTeW1ib2xOYXJyb3csXG4gIE5iT2ZEaWdpdHNcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBjYW5vbmljYWwgZm9ybSBvZiBhIGxvY2FsZSBuYW1lIC0gbG93ZXJjYXNlIHdpdGggYF9gIHJlcGxhY2VkIHdpdGggYC1gLlxuICovXG5mdW5jdGlvbiBub3JtYWxpemVMb2NhbGUobG9jYWxlOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gbG9jYWxlLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXy9nLCAnLScpO1xufVxuIl19