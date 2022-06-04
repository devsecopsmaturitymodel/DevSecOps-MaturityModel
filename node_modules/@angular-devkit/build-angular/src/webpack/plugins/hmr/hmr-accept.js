"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line import/no-extraneous-dependencies
const core_1 = require("@angular/core");
const operators_1 = require("rxjs/operators");
function default_1(mod) {
    if (!mod['hot']) {
        return;
    }
    if (!(0, core_1.isDevMode)()) {
        console.error(`[NG HMR] Cannot use HMR when Angular is running in production mode. To prevent production mode, do not call 'enableProdMode()'.`);
        return;
    }
    mod['hot'].accept();
    mod['hot'].dispose(() => {
        if (typeof ng === 'undefined') {
            console.warn(`[NG HMR] Cannot find global 'ng'. Likely this is caused because scripts optimization is enabled.`);
            return;
        }
        if (!ng.getInjector) {
            // View Engine
            return;
        }
        // Reset JIT compiled components cache
        (0, core_1.ɵresetCompiledComponents)();
        const appRoot = getAppRoot();
        if (!appRoot) {
            return;
        }
        const appRef = getApplicationRef(appRoot);
        if (!appRef) {
            return;
        }
        // Inputs that are hidden should be ignored
        const oldInputs = document.querySelectorAll('input:not([type="hidden"]), textarea');
        const oldOptions = document.querySelectorAll('option');
        // Create new application
        appRef.components.forEach((cp) => {
            const element = cp.location.nativeElement;
            const parentNode = element.parentNode;
            parentNode.insertBefore(document.createElement(element.tagName), element);
            parentNode.removeChild(element);
        });
        // Destroy old application, injectors, <style..., etc..
        const platformRef = getPlatformRef(appRoot);
        if (platformRef) {
            platformRef.destroy();
        }
        // Restore all inputs and options
        const bodyElement = document.body;
        if (oldInputs.length + oldOptions.length === 0 || !bodyElement) {
            return;
        }
        // Use a `MutationObserver` to wait until the app-root element has been bootstrapped.
        // ie: when the ng-version attribute is added.
        new MutationObserver((_mutationsList, observer) => {
            observer.disconnect();
            const newAppRoot = getAppRoot();
            if (!newAppRoot) {
                return;
            }
            const newAppRef = getApplicationRef(newAppRoot);
            if (!newAppRef) {
                return;
            }
            // Wait until the application isStable to restore the form values
            newAppRef.isStable
                .pipe((0, operators_1.filter)((isStable) => !!isStable), (0, operators_1.take)(1))
                .subscribe(() => restoreFormValues(oldInputs, oldOptions));
        }).observe(bodyElement, {
            attributes: true,
            subtree: true,
            attributeFilter: ['ng-version'],
        });
    });
}
exports.default = default_1;
function getAppRoot() {
    const appRoot = document.querySelector('[ng-version]');
    if (!appRoot) {
        console.warn('[NG HMR] Cannot find the application root component.');
        return undefined;
    }
    return appRoot;
}
function getToken(appRoot, token) {
    return (typeof ng === 'object' && ng.getInjector(appRoot).get(token)) || undefined;
}
function getApplicationRef(appRoot) {
    const appRef = getToken(appRoot, core_1.ApplicationRef);
    if (!appRef) {
        console.warn(`[NG HMR] Cannot get 'ApplicationRef'.`);
        return undefined;
    }
    return appRef;
}
function getPlatformRef(appRoot) {
    const platformRef = getToken(appRoot, core_1.PlatformRef);
    if (!platformRef) {
        console.warn(`[NG HMR] Cannot get 'PlatformRef'.`);
        return undefined;
    }
    return platformRef;
}
function dispatchEvents(element) {
    element.dispatchEvent(new Event('input', {
        bubbles: true,
        cancelable: true,
    }));
    element.blur();
    element.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
}
function restoreFormValues(oldInputs, oldOptions) {
    // Restore input that are not hidden
    const newInputs = document.querySelectorAll('input:not([type="hidden"]), textarea');
    if (newInputs.length && newInputs.length === oldInputs.length) {
        console.log('[NG HMR] Restoring input/textarea values.');
        for (let index = 0; index < newInputs.length; index++) {
            const newElement = newInputs[index];
            const oldElement = oldInputs[index];
            switch (oldElement.type) {
                case 'button':
                case 'image':
                case 'submit':
                case 'reset':
                    // These types don't need any value change.
                    continue;
                case 'radio':
                case 'checkbox':
                    newElement.checked = oldElement.checked;
                    break;
                case 'color':
                case 'date':
                case 'datetime-local':
                case 'email':
                case 'hidden':
                case 'month':
                case 'number':
                case 'password':
                case 'range':
                case 'search':
                case 'tel':
                case 'text':
                case 'textarea':
                case 'time':
                case 'url':
                case 'week':
                    newElement.value = oldElement.value;
                    break;
                case 'file':
                    // Ignored due: Uncaught DOMException: Failed to set the 'value' property on 'HTMLInputElement':
                    // This input element accepts a filename, which may only be programmatically set to the empty string.
                    break;
                default:
                    console.warn('[NG HMR] Unknown input type ' + oldElement.type + '.');
                    continue;
            }
            dispatchEvents(newElement);
        }
    }
    else if (oldInputs.length) {
        console.warn('[NG HMR] Cannot restore input/textarea values.');
    }
    // Restore option
    const newOptions = document.querySelectorAll('option');
    if (newOptions.length && newOptions.length === oldOptions.length) {
        console.log('[NG HMR] Restoring selected options.');
        for (let index = 0; index < newOptions.length; index++) {
            const newElement = newOptions[index];
            newElement.selected = oldOptions[index].selected;
            dispatchEvents(newElement);
        }
    }
    else if (oldOptions.length) {
        console.warn('[NG HMR] Cannot restore selected options.');
    }
}
