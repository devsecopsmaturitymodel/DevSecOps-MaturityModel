"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleSinkBase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const exception_1 = require("../exception/exception");
const action_1 = require("../tree/action");
const Noop = function () { };
class SimpleSinkBase {
    constructor() {
        this.preCommitAction = Noop;
        this.postCommitAction = Noop;
        this.preCommit = Noop;
        this.postCommit = Noop;
    }
    _fileAlreadyExistException(path) {
        throw new exception_1.FileAlreadyExistException(path);
    }
    _fileDoesNotExistException(path) {
        throw new exception_1.FileDoesNotExistException(path);
    }
    _validateOverwriteAction(action) {
        return this._validateFileExists(action.path).pipe((0, operators_1.map)((b) => {
            if (!b) {
                this._fileDoesNotExistException(action.path);
            }
        }));
    }
    _validateCreateAction(action) {
        return this._validateFileExists(action.path).pipe((0, operators_1.map)((b) => {
            if (b) {
                this._fileAlreadyExistException(action.path);
            }
        }));
    }
    _validateRenameAction(action) {
        return this._validateFileExists(action.path).pipe((0, operators_1.map)((b) => {
            if (!b) {
                this._fileDoesNotExistException(action.path);
            }
        }), (0, operators_1.mergeMap)(() => this._validateFileExists(action.to)), (0, operators_1.map)((b) => {
            if (b) {
                this._fileAlreadyExistException(action.to);
            }
        }));
    }
    _validateDeleteAction(action) {
        return this._validateFileExists(action.path).pipe((0, operators_1.map)((b) => {
            if (!b) {
                this._fileDoesNotExistException(action.path);
            }
        }));
    }
    validateSingleAction(action) {
        switch (action.kind) {
            case 'o':
                return this._validateOverwriteAction(action);
            case 'c':
                return this._validateCreateAction(action);
            case 'r':
                return this._validateRenameAction(action);
            case 'd':
                return this._validateDeleteAction(action);
            default:
                throw new action_1.UnknownActionException(action);
        }
    }
    commitSingleAction(action) {
        return (0, rxjs_1.concat)(this.validateSingleAction(action), new rxjs_1.Observable((observer) => {
            let committed = null;
            switch (action.kind) {
                case 'o':
                    committed = this._overwriteFile(action.path, action.content);
                    break;
                case 'c':
                    committed = this._createFile(action.path, action.content);
                    break;
                case 'r':
                    committed = this._renameFile(action.path, action.to);
                    break;
                case 'd':
                    committed = this._deleteFile(action.path);
                    break;
            }
            if (committed) {
                committed.subscribe(observer);
            }
            else {
                observer.complete();
            }
        })).pipe((0, operators_1.ignoreElements)());
    }
    commit(tree) {
        const actions = (0, rxjs_1.from)(tree.actions);
        return (0, rxjs_1.concat)(this.preCommit() || (0, rxjs_1.of)(null), (0, rxjs_1.defer)(() => actions).pipe((0, operators_1.concatMap)((action) => {
            const maybeAction = this.preCommitAction(action);
            if ((0, rxjs_1.isObservable)(maybeAction) || isPromiseLike(maybeAction)) {
                return maybeAction;
            }
            return (0, rxjs_1.of)(maybeAction || action);
        }), (0, operators_1.concatMap)((action) => {
            return (0, rxjs_1.concat)(this.commitSingleAction(action).pipe((0, operators_1.ignoreElements)()), (0, rxjs_1.of)(action));
        }), (0, operators_1.concatMap)((action) => this.postCommitAction(action) || (0, rxjs_1.of)(null))), (0, rxjs_1.defer)(() => this._done()), (0, rxjs_1.defer)(() => this.postCommit() || (0, rxjs_1.of)(null))).pipe((0, operators_1.ignoreElements)());
    }
}
exports.SimpleSinkBase = SimpleSinkBase;
function isPromiseLike(value) {
    return !!value && typeof value.then === 'function';
}
