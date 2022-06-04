/// <reference types="node" />
import { EventEmitter } from 'events';
import { AsyncResource } from 'async_hooks';
declare const kEventEmitter: unique symbol;
declare const kAsyncResource: unique symbol;
declare type EventEmitterOptions = typeof EventEmitter extends {
    new (options?: infer T): EventEmitter;
} ? T : never;
declare type AsyncResourceOptions = typeof AsyncResource extends {
    new (name: string, options?: infer T): AsyncResource;
} ? T : never;
declare type Options = EventEmitterOptions & AsyncResourceOptions & {
    name?: string;
};
declare class EventEmitterReferencingAsyncResource extends AsyncResource {
    [kEventEmitter]: EventEmitter;
    constructor(ee: EventEmitter, type: string, options?: AsyncResourceOptions);
    get eventEmitter(): EventEmitter;
}
declare class EventEmitterAsyncResource extends EventEmitter {
    [kAsyncResource]: EventEmitterReferencingAsyncResource;
    constructor(options?: Options | string);
    emit(event: string | symbol, ...args: any[]): boolean;
    emitDestroy(): void;
    asyncId(): number;
    triggerAsyncId(): number;
    get asyncResource(): EventEmitterReferencingAsyncResource;
    static get EventEmitterAsyncResource(): typeof EventEmitterAsyncResource;
}
export = EventEmitterAsyncResource;
