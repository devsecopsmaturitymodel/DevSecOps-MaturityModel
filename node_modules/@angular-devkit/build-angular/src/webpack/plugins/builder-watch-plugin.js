"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuilderWatchPlugin = void 0;
class TimeInfoMap extends Map {
    update(path, timestamp) {
        this.set(path, Object.freeze({ safeTime: timestamp, timestamp }));
    }
    toTimestamps() {
        const timestamps = new Map();
        for (const [file, entry] of this) {
            timestamps.set(file, entry.timestamp);
        }
        return timestamps;
    }
}
class BuilderWatchFileSystem {
    constructor(watcherFactory, inputFileSystem) {
        this.watcherFactory = watcherFactory;
        this.inputFileSystem = inputFileSystem;
    }
    watch(files, directories, missing, startTime, _options, callback, callbackUndelayed) {
        const watchedFiles = new Set(files);
        const watchedDirectories = new Set(directories);
        const watchedMissing = new Set(missing);
        const timeInfo = new TimeInfoMap();
        for (const file of files) {
            timeInfo.update(file, startTime);
        }
        for (const directory of directories) {
            timeInfo.update(directory, startTime);
        }
        const watcher = this.watcherFactory.watch(files, directories, (events) => {
            if (events.length === 0) {
                return;
            }
            if (callbackUndelayed) {
                process.nextTick(() => { var _a; return callbackUndelayed(events[0].path, (_a = events[0].time) !== null && _a !== void 0 ? _a : Date.now()); });
            }
            process.nextTick(() => {
                var _a, _b, _c;
                const removals = new Set();
                const fileChanges = new Set();
                const directoryChanges = new Set();
                const missingChanges = new Set();
                for (const event of events) {
                    (_b = (_a = this.inputFileSystem).purge) === null || _b === void 0 ? void 0 : _b.call(_a, event.path);
                    if (event.type === 'deleted') {
                        timeInfo.delete(event.path);
                        removals.add(event.path);
                    }
                    else {
                        timeInfo.update(event.path, (_c = event.time) !== null && _c !== void 0 ? _c : Date.now());
                        if (watchedFiles.has(event.path)) {
                            fileChanges.add(event.path);
                        }
                        else if (watchedDirectories.has(event.path)) {
                            directoryChanges.add(event.path);
                        }
                        else if (watchedMissing.has(event.path)) {
                            missingChanges.add(event.path);
                        }
                    }
                }
                const timeInfoMap = new Map(timeInfo);
                callback(undefined, timeInfoMap, timeInfoMap, new Set([...fileChanges, ...directoryChanges, ...missingChanges]), removals);
            });
        });
        return {
            close() {
                watcher.close();
            },
            pause() { },
            getFileTimeInfoEntries() {
                return new Map(timeInfo);
            },
            getContextTimeInfoEntries() {
                return new Map(timeInfo);
            },
        };
    }
}
class BuilderWatchPlugin {
    constructor(watcherFactory) {
        this.watcherFactory = watcherFactory;
    }
    apply(compiler) {
        compiler.hooks.environment.tap('BuilderWatchPlugin', () => {
            compiler.watchFileSystem = new BuilderWatchFileSystem(this.watcherFactory, compiler.inputFileSystem);
        });
    }
}
exports.BuilderWatchPlugin = BuilderWatchPlugin;
