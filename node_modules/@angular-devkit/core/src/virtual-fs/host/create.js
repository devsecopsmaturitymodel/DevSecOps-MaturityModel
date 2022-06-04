"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSyncHost = void 0;
const rxjs_1 = require("rxjs");
function wrapAction(action) {
    return new rxjs_1.Observable((subscriber) => {
        subscriber.next(action());
        subscriber.complete();
    });
}
function createSyncHost(handler) {
    return new (class {
        get capabilities() {
            return { synchronous: true };
        }
        read(path) {
            return wrapAction(() => handler.read(path));
        }
        list(path) {
            return wrapAction(() => handler.list(path));
        }
        exists(path) {
            return wrapAction(() => handler.exists(path));
        }
        isDirectory(path) {
            return wrapAction(() => handler.isDirectory(path));
        }
        isFile(path) {
            return wrapAction(() => handler.isFile(path));
        }
        stat(path) {
            return wrapAction(() => handler.stat(path));
        }
        write(path, content) {
            return wrapAction(() => handler.write(path, content));
        }
        delete(path) {
            return wrapAction(() => handler.delete(path));
        }
        rename(from, to) {
            return wrapAction(() => handler.rename(from, to));
        }
        watch() {
            return null;
        }
    })();
}
exports.createSyncHost = createSyncHost;
