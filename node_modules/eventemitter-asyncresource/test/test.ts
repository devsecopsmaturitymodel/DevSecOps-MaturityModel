import EventEmitterAsyncResource from '..';
import { createHook, executionAsyncId, executionAsyncResource } from 'async_hooks';
import { test } from 'tap';
import { promisify } from 'util';

const tick = promisify(setImmediate);

interface InitAsyncEvent {
  name : 'init',
  type : string,
  triggerAsyncId : number,
  resource: object
}
interface OtherAsyncEvent {
  name : 'before' | 'after' | 'destroy'
}
type AsyncEvent = InitAsyncEvent | OtherAsyncEvent;

function makeHook (trackedTypes : string[]) {
  const eventMap = new Map<number, AsyncEvent[]>();

  function log (asyncId : number, name : 'before' | 'after' | 'destroy') {
    const entry = eventMap.get(asyncId);
    if (entry !== undefined) entry.push({ name });
  }

  const hook = createHook({
    init (asyncId, type, triggerAsyncId, resource) {
      if (trackedTypes.includes(type)) {
        eventMap.set(asyncId, [
          { name: 'init', type, triggerAsyncId, resource }
        ]);
      }
    },

    before (asyncId) { log(asyncId, 'before'); },
    after (asyncId) { log(asyncId, 'after'); },
    destroy (asyncId) { log(asyncId, 'destroy'); }
  }).enable();
  return {
    done () {
      hook.disable();
      return new Set(eventMap.values());
    },
    ids () {
      return new Set(eventMap.keys());
    }
  };
}

test('tracks emit() calls correctly using async_hooks', async ({ is, isDeep }) => {
  const tracer = makeHook(['Foo']);

  class Foo extends EventEmitterAsyncResource {}

  const origExecutionAsyncId = executionAsyncId();
  const foo = new Foo();

  let called = false;
  foo.on('someEvent', () => {
    if (typeof executionAsyncResource === 'function') { // Node.js 12+ only
      is(executionAsyncResource(), foo.asyncResource);
    }
    called = true;
  });
  foo.emit('someEvent');
  is(called, true);

  isDeep([foo.asyncId()], [...tracer.ids()]);
  is(foo.triggerAsyncId(), origExecutionAsyncId);
  is(foo.asyncResource.eventEmitter, foo);

  foo.emitDestroy();

  await tick();

  isDeep(tracer.done(), new Set<AsyncEvent[]>([
    [
      { name: 'init', type: 'Foo', triggerAsyncId: origExecutionAsyncId, resource: foo.asyncResource },
      { name: 'before' },
      { name: 'after' },
      { name: 'destroy' }
    ]
  ]));
});

test('can explicitly specify name as positional arg', async ({ isDeep }) => {
  const tracer = makeHook(['ResourceName']);

  const origExecutionAsyncId = executionAsyncId();
  class Foo extends EventEmitterAsyncResource {}

  const foo = new Foo('ResourceName');

  isDeep(tracer.done(), new Set<AsyncEvent[]>([
    [
      { name: 'init', type: 'ResourceName', triggerAsyncId: origExecutionAsyncId, resource: foo.asyncResource }
    ]
  ]));
});

test('can explicitly specify name as option', async ({ isDeep }) => {
  const tracer = makeHook(['ResourceName']);

  const origExecutionAsyncId = executionAsyncId();
  class Foo extends EventEmitterAsyncResource {}

  const foo = new Foo({ name: 'ResourceName' });

  isDeep(tracer.done(), new Set<AsyncEvent[]>([
    [
      { name: 'init', type: 'ResourceName', triggerAsyncId: origExecutionAsyncId, resource: foo.asyncResource }
    ]
  ]));
});

test('is provided as export on itself', async ({ is }) => {
  is(EventEmitterAsyncResource.EventEmitterAsyncResource, EventEmitterAsyncResource);
});
