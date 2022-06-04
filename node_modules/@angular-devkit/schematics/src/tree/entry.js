"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LazyFileEntry = exports.SimpleFileEntry = void 0;
class SimpleFileEntry {
    constructor(_path, _content) {
        this._path = _path;
        this._content = _content;
    }
    get path() {
        return this._path;
    }
    get content() {
        return this._content;
    }
}
exports.SimpleFileEntry = SimpleFileEntry;
class LazyFileEntry {
    constructor(_path, _load) {
        this._path = _path;
        this._load = _load;
        this._content = null;
    }
    get path() {
        return this._path;
    }
    get content() {
        return this._content || (this._content = this._load(this._path));
    }
}
exports.LazyFileEntry = LazyFileEntry;
