"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestProjectHost = void 0;
const core_1 = require("@angular-devkit/core");
const node_1 = require("@angular-devkit/core/node");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
/**
 * @deprecated
 */
class TestProjectHost extends node_1.NodeJsSyncHost {
    constructor(_templateRoot) {
        super();
        this._templateRoot = _templateRoot;
        this._currentRoot = null;
        this._scopedSyncHost = null;
    }
    root() {
        if (this._currentRoot === null) {
            throw new Error('TestProjectHost must be initialized before being used.');
        }
        return this._currentRoot;
    }
    scopedSync() {
        if (this._currentRoot === null || this._scopedSyncHost === null) {
            throw new Error('TestProjectHost must be initialized before being used.');
        }
        return this._scopedSyncHost;
    }
    initialize() {
        const recursiveList = (path) => this.list(path).pipe(
        // Emit each fragment individually.
        (0, operators_1.concatMap)((fragments) => (0, rxjs_1.from)(fragments)), 
        // Join the path with fragment.
        (0, operators_1.map)((fragment) => (0, core_1.join)(path, fragment)), 
        // Emit directory content paths instead of the directory path.
        (0, operators_1.mergeMap)((path) => this.isDirectory(path).pipe((0, operators_1.concatMap)((isDir) => (isDir ? recursiveList(path) : (0, rxjs_1.of)(path))))));
        // Find a unique folder that we can write to to use as current root.
        return this.findUniqueFolderPath().pipe(
        // Save the path and create a scoped host for it.
        (0, operators_1.tap)((newFolderPath) => {
            this._currentRoot = newFolderPath;
            this._scopedSyncHost = new core_1.virtualFs.SyncDelegateHost(new core_1.virtualFs.ScopedHost(this, this.root()));
        }), 
        // List all files in root.
        (0, operators_1.concatMap)(() => recursiveList(this._templateRoot)), 
        // Copy them over to the current root.
        (0, operators_1.concatMap)((from) => {
            const to = (0, core_1.join)(this.root(), (0, core_1.relative)(this._templateRoot, from));
            return this.read(from).pipe((0, operators_1.concatMap)((buffer) => this.write(to, buffer)));
        }), (0, operators_1.map)(() => { }));
    }
    restore() {
        if (this._currentRoot === null) {
            return rxjs_1.EMPTY;
        }
        // Delete the current root and clear the variables.
        // Wait 50ms and retry up to 10 times, to give time for file locks to clear.
        return this.exists(this.root()).pipe((0, operators_1.delay)(50), (0, operators_1.concatMap)((exists) => (exists ? this.delete(this.root()) : rxjs_1.EMPTY)), (0, operators_1.retry)(10), (0, operators_1.finalize)(() => {
            this._currentRoot = null;
            this._scopedSyncHost = null;
        }));
    }
    writeMultipleFiles(files) {
        Object.keys(files).forEach((fileName) => {
            let content = files[fileName];
            if (typeof content == 'string') {
                content = core_1.virtualFs.stringToFileBuffer(content);
            }
            else if (content instanceof Buffer) {
                content = content.buffer.slice(content.byteOffset, content.byteOffset + content.byteLength);
            }
            this.scopedSync().write((0, core_1.normalize)(fileName), content);
        });
    }
    replaceInFile(path, match, replacement) {
        const content = core_1.virtualFs.fileBufferToString(this.scopedSync().read((0, core_1.normalize)(path)));
        this.scopedSync().write((0, core_1.normalize)(path), core_1.virtualFs.stringToFileBuffer(content.replace(match, replacement)));
    }
    appendToFile(path, str) {
        const content = core_1.virtualFs.fileBufferToString(this.scopedSync().read((0, core_1.normalize)(path)));
        this.scopedSync().write((0, core_1.normalize)(path), core_1.virtualFs.stringToFileBuffer(content.concat(str)));
    }
    fileMatchExists(dir, regex) {
        const [fileName] = this.scopedSync()
            .list((0, core_1.normalize)(dir))
            .filter((name) => name.match(regex));
        return fileName || undefined;
    }
    copyFile(from, to) {
        const content = this.scopedSync().read((0, core_1.normalize)(from));
        this.scopedSync().write((0, core_1.normalize)(to), content);
    }
    findUniqueFolderPath() {
        // 11 character alphanumeric string.
        const randomString = Math.random().toString(36).slice(2);
        const newFolderName = `test-project-host-${(0, core_1.basename)(this._templateRoot)}-${randomString}`;
        const newFolderPath = (0, core_1.join)((0, core_1.dirname)(this._templateRoot), newFolderName);
        return this.exists(newFolderPath).pipe((0, operators_1.concatMap)((exists) => (exists ? this.findUniqueFolderPath() : (0, rxjs_1.of)(newFolderPath))));
    }
}
exports.TestProjectHost = TestProjectHost;
