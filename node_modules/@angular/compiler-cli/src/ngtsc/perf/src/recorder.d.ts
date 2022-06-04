/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/perf/src/recorder" />
import { PerfCheckpoint, PerfEvent, PerfPhase, PerfRecorder } from './api';
/**
 * Serializable performance data for the compilation, using string names.
 */
export interface PerfResults {
    events: Record<string, number>;
    phases: Record<string, number>;
    memory: Record<string, number>;
}
/**
 * A `PerfRecorder` that actively tracks performance statistics.
 */
export declare class ActivePerfRecorder implements PerfRecorder {
    private zeroTime;
    private counters;
    private phaseTime;
    private bytes;
    private currentPhase;
    private currentPhaseEntered;
    /**
     * Creates an `ActivePerfRecoder` with its zero point set to the current time.
     */
    static zeroedToNow(): ActivePerfRecorder;
    private constructor();
    reset(): void;
    memory(after: PerfCheckpoint): void;
    phase(phase: PerfPhase): PerfPhase;
    inPhase<T>(phase: PerfPhase, fn: () => T): T;
    eventCount(counter: PerfEvent, incrementBy?: number): void;
    /**
     * Return the current performance metrics as a serializable object.
     */
    finalize(): PerfResults;
}
/**
 * A `PerfRecorder` that delegates to a target `PerfRecorder` which can be updated later.
 *
 * `DelegatingPerfRecorder` is useful when a compiler class that needs a `PerfRecorder` can outlive
 * the current compilation. This is true for most compiler classes as resource-only changes reuse
 * the same `NgCompiler` for a new compilation.
 */
export declare class DelegatingPerfRecorder implements PerfRecorder {
    target: PerfRecorder;
    constructor(target: PerfRecorder);
    eventCount(counter: PerfEvent, incrementBy?: number): void;
    phase(phase: PerfPhase): PerfPhase;
    inPhase<T>(phase: PerfPhase, fn: () => T): T;
    memory(after: PerfCheckpoint): void;
    reset(): void;
}
