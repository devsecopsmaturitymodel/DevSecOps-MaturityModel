"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostSink = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const update_buffer_1 = require("../utility/update-buffer");
const sink_1 = require("./sink");
class HostSink extends sink_1.SimpleSinkBase {
    constructor(_host, _force = false) {
        super();
        this._host = _host;
        this._force = _force;
        this._filesToDelete = new Set();
        this._filesToRename = new Set();
        this._filesToCreate = new Map();
        this._filesToUpdate = new Map();
    }
    _validateCreateAction(action) {
        return this._force ? rxjs_1.EMPTY : super._validateCreateAction(action);
    }
    _validateFileExists(p) {
        if (this._filesToCreate.has(p) || this._filesToUpdate.has(p)) {
            return (0, rxjs_1.of)(true);
        }
        if (this._filesToDelete.has(p)) {
            return (0, rxjs_1.of)(false);
        }
        for (const [from, to] of this._filesToRename.values()) {
            switch (p) {
                case from:
                    return (0, rxjs_1.of)(false);
                case to:
                    return (0, rxjs_1.of)(true);
            }
        }
        return this._host.exists(p);
    }
    _overwriteFile(path, content) {
        this._filesToUpdate.set(path, update_buffer_1.UpdateBufferBase.create(content));
        return rxjs_1.EMPTY;
    }
    _createFile(path, content) {
        this._filesToCreate.set(path, update_buffer_1.UpdateBufferBase.create(content));
        return rxjs_1.EMPTY;
    }
    _renameFile(from, to) {
        this._filesToRename.add([from, to]);
        return rxjs_1.EMPTY;
    }
    _deleteFile(path) {
        if (this._filesToCreate.has(path)) {
            this._filesToCreate.delete(path);
            this._filesToUpdate.delete(path);
        }
        else {
            this._filesToDelete.add(path);
        }
        return rxjs_1.EMPTY;
    }
    _done() {
        // Really commit everything to the actual filesystem.
        return (0, rxjs_1.concat)((0, rxjs_1.from)([...this._filesToDelete.values()]).pipe((0, operators_1.concatMap)((path) => this._host.delete(path))), (0, rxjs_1.from)([...this._filesToRename.entries()]).pipe((0, operators_1.concatMap)(([_, [path, to]]) => this._host.rename(path, to))), (0, rxjs_1.from)([...this._filesToCreate.entries()]).pipe((0, operators_1.concatMap)(([path, buffer]) => {
            return this._host.write(path, buffer.generate());
        })), (0, rxjs_1.from)([...this._filesToUpdate.entries()]).pipe((0, operators_1.concatMap)(([path, buffer]) => {
            return this._host.write(path, buffer.generate());
        }))).pipe((0, operators_1.reduce)(() => { }));
    }
}
exports.HostSink = HostSink;
