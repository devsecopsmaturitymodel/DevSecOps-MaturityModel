"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRecorderBom = exports.UpdateRecorderBase = void 0;
const exception_1 = require("../exception/exception");
const update_buffer_1 = require("../utility/update-buffer");
class UpdateRecorderBase {
    constructor(entry) {
        this._original = Buffer.from(entry.content);
        this._content = update_buffer_1.UpdateBufferBase.create(entry.content);
        this._path = entry.path;
    }
    static createFromFileEntry(entry) {
        const c0 = entry.content.byteLength > 0 && entry.content.readUInt8(0);
        const c1 = entry.content.byteLength > 1 && entry.content.readUInt8(1);
        const c2 = entry.content.byteLength > 2 && entry.content.readUInt8(2);
        // Check if we're BOM.
        if (c0 == 0xef && c1 == 0xbb && c2 == 0xbf) {
            return new UpdateRecorderBom(entry);
        }
        else if (c0 === 0xff && c1 == 0xfe) {
            return new UpdateRecorderBom(entry);
        }
        else if (c0 === 0xfe && c1 == 0xff) {
            return new UpdateRecorderBom(entry);
        }
        return new UpdateRecorderBase(entry);
    }
    get path() {
        return this._path;
    }
    // These just record changes.
    insertLeft(index, content) {
        this._content.insertLeft(index, typeof content == 'string' ? Buffer.from(content) : content);
        return this;
    }
    insertRight(index, content) {
        this._content.insertRight(index, typeof content == 'string' ? Buffer.from(content) : content);
        return this;
    }
    remove(index, length) {
        this._content.remove(index, length);
        return this;
    }
    apply(content) {
        if (!content.equals(this._content.original)) {
            throw new exception_1.ContentHasMutatedException(this.path);
        }
        return this._content.generate();
    }
}
exports.UpdateRecorderBase = UpdateRecorderBase;
class UpdateRecorderBom extends UpdateRecorderBase {
    constructor(entry, _delta = 1) {
        super(entry);
        this._delta = _delta;
    }
    insertLeft(index, content) {
        return super.insertLeft(index + this._delta, content);
    }
    insertRight(index, content) {
        return super.insertRight(index + this._delta, content);
    }
    remove(index, length) {
        return super.remove(index + this._delta, length);
    }
}
exports.UpdateRecorderBom = UpdateRecorderBom;
