/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AUTO_STYLE, NoopAnimationPlayer, ɵAnimationGroupPlayer as AnimationGroupPlayer, ɵPRE_STYLE as PRE_STYLE } from '@angular/animations';
import { ElementInstructionMap } from '../dsl/element_instruction_map';
import { missingEvent, missingTrigger, transitionFailed, triggerTransitionsFailed, unregisteredTrigger, unsupportedTriggerEvent } from '../error_helpers';
import { copyObj, ENTER_CLASSNAME, eraseStyles, LEAVE_CLASSNAME, NG_ANIMATING_CLASSNAME, NG_ANIMATING_SELECTOR, NG_TRIGGER_CLASSNAME, NG_TRIGGER_SELECTOR, setStyles } from '../util';
import { getOrSetAsInMap, listenOnPlayer, makeAnimationEvent, normalizeKeyframes, optimizeGroupPlayer } from './shared';
const QUEUED_CLASSNAME = 'ng-animate-queued';
const QUEUED_SELECTOR = '.ng-animate-queued';
const DISABLED_CLASSNAME = 'ng-animate-disabled';
const DISABLED_SELECTOR = '.ng-animate-disabled';
const STAR_CLASSNAME = 'ng-star-inserted';
const STAR_SELECTOR = '.ng-star-inserted';
const EMPTY_PLAYER_ARRAY = [];
const NULL_REMOVAL_STATE = {
    namespaceId: '',
    setForRemoval: false,
    setForMove: false,
    hasAnimation: false,
    removedBeforeQueried: false
};
const NULL_REMOVED_QUERIED_STATE = {
    namespaceId: '',
    setForMove: false,
    setForRemoval: false,
    hasAnimation: false,
    removedBeforeQueried: true
};
export const REMOVAL_FLAG = '__ng_removed';
export class StateValue {
    constructor(input, namespaceId = '') {
        this.namespaceId = namespaceId;
        const isObj = input && input.hasOwnProperty('value');
        const value = isObj ? input['value'] : input;
        this.value = normalizeTriggerValue(value);
        if (isObj) {
            const options = copyObj(input);
            delete options['value'];
            this.options = options;
        }
        else {
            this.options = {};
        }
        if (!this.options.params) {
            this.options.params = {};
        }
    }
    get params() {
        return this.options.params;
    }
    absorbOptions(options) {
        const newParams = options.params;
        if (newParams) {
            const oldParams = this.options.params;
            Object.keys(newParams).forEach(prop => {
                if (oldParams[prop] == null) {
                    oldParams[prop] = newParams[prop];
                }
            });
        }
    }
}
export const VOID_VALUE = 'void';
export const DEFAULT_STATE_VALUE = new StateValue(VOID_VALUE);
export class AnimationTransitionNamespace {
    constructor(id, hostElement, _engine) {
        this.id = id;
        this.hostElement = hostElement;
        this._engine = _engine;
        this.players = [];
        this._triggers = {};
        this._queue = [];
        this._elementListeners = new Map();
        this._hostClassName = 'ng-tns-' + id;
        addClass(hostElement, this._hostClassName);
    }
    listen(element, name, phase, callback) {
        if (!this._triggers.hasOwnProperty(name)) {
            throw missingTrigger(phase, name);
        }
        if (phase == null || phase.length == 0) {
            throw missingEvent(name);
        }
        if (!isTriggerEventValid(phase)) {
            throw unsupportedTriggerEvent(phase, name);
        }
        const listeners = getOrSetAsInMap(this._elementListeners, element, []);
        const data = { name, phase, callback };
        listeners.push(data);
        const triggersWithStates = getOrSetAsInMap(this._engine.statesByElement, element, {});
        if (!triggersWithStates.hasOwnProperty(name)) {
            addClass(element, NG_TRIGGER_CLASSNAME);
            addClass(element, NG_TRIGGER_CLASSNAME + '-' + name);
            triggersWithStates[name] = DEFAULT_STATE_VALUE;
        }
        return () => {
            // the event listener is removed AFTER the flush has occurred such
            // that leave animations callbacks can fire (otherwise if the node
            // is removed in between then the listeners would be deregistered)
            this._engine.afterFlush(() => {
                const index = listeners.indexOf(data);
                if (index >= 0) {
                    listeners.splice(index, 1);
                }
                if (!this._triggers[name]) {
                    delete triggersWithStates[name];
                }
            });
        };
    }
    register(name, ast) {
        if (this._triggers[name]) {
            // throw
            return false;
        }
        else {
            this._triggers[name] = ast;
            return true;
        }
    }
    _getTrigger(name) {
        const trigger = this._triggers[name];
        if (!trigger) {
            throw unregisteredTrigger(name);
        }
        return trigger;
    }
    trigger(element, triggerName, value, defaultToFallback = true) {
        const trigger = this._getTrigger(triggerName);
        const player = new TransitionAnimationPlayer(this.id, triggerName, element);
        let triggersWithStates = this._engine.statesByElement.get(element);
        if (!triggersWithStates) {
            addClass(element, NG_TRIGGER_CLASSNAME);
            addClass(element, NG_TRIGGER_CLASSNAME + '-' + triggerName);
            this._engine.statesByElement.set(element, triggersWithStates = {});
        }
        let fromState = triggersWithStates[triggerName];
        const toState = new StateValue(value, this.id);
        const isObj = value && value.hasOwnProperty('value');
        if (!isObj && fromState) {
            toState.absorbOptions(fromState.options);
        }
        triggersWithStates[triggerName] = toState;
        if (!fromState) {
            fromState = DEFAULT_STATE_VALUE;
        }
        const isRemoval = toState.value === VOID_VALUE;
        // normally this isn't reached by here, however, if an object expression
        // is passed in then it may be a new object each time. Comparing the value
        // is important since that will stay the same despite there being a new object.
        // The removal arc here is special cased because the same element is triggered
        // twice in the event that it contains animations on the outer/inner portions
        // of the host container
        if (!isRemoval && fromState.value === toState.value) {
            // this means that despite the value not changing, some inner params
            // have changed which means that the animation final styles need to be applied
            if (!objEquals(fromState.params, toState.params)) {
                const errors = [];
                const fromStyles = trigger.matchStyles(fromState.value, fromState.params, errors);
                const toStyles = trigger.matchStyles(toState.value, toState.params, errors);
                if (errors.length) {
                    this._engine.reportError(errors);
                }
                else {
                    this._engine.afterFlush(() => {
                        eraseStyles(element, fromStyles);
                        setStyles(element, toStyles);
                    });
                }
            }
            return;
        }
        const playersOnElement = getOrSetAsInMap(this._engine.playersByElement, element, []);
        playersOnElement.forEach(player => {
            // only remove the player if it is queued on the EXACT same trigger/namespace
            // we only also deal with queued players here because if the animation has
            // started then we want to keep the player alive until the flush happens
            // (which is where the previousPlayers are passed into the new player)
            if (player.namespaceId == this.id && player.triggerName == triggerName && player.queued) {
                player.destroy();
            }
        });
        let transition = trigger.matchTransition(fromState.value, toState.value, element, toState.params);
        let isFallbackTransition = false;
        if (!transition) {
            if (!defaultToFallback)
                return;
            transition = trigger.fallbackTransition;
            isFallbackTransition = true;
        }
        this._engine.totalQueuedPlayers++;
        this._queue.push({ element, triggerName, transition, fromState, toState, player, isFallbackTransition });
        if (!isFallbackTransition) {
            addClass(element, QUEUED_CLASSNAME);
            player.onStart(() => {
                removeClass(element, QUEUED_CLASSNAME);
            });
        }
        player.onDone(() => {
            let index = this.players.indexOf(player);
            if (index >= 0) {
                this.players.splice(index, 1);
            }
            const players = this._engine.playersByElement.get(element);
            if (players) {
                let index = players.indexOf(player);
                if (index >= 0) {
                    players.splice(index, 1);
                }
            }
        });
        this.players.push(player);
        playersOnElement.push(player);
        return player;
    }
    deregister(name) {
        delete this._triggers[name];
        this._engine.statesByElement.forEach((stateMap, element) => {
            delete stateMap[name];
        });
        this._elementListeners.forEach((listeners, element) => {
            this._elementListeners.set(element, listeners.filter(entry => {
                return entry.name != name;
            }));
        });
    }
    clearElementCache(element) {
        this._engine.statesByElement.delete(element);
        this._elementListeners.delete(element);
        const elementPlayers = this._engine.playersByElement.get(element);
        if (elementPlayers) {
            elementPlayers.forEach(player => player.destroy());
            this._engine.playersByElement.delete(element);
        }
    }
    _signalRemovalForInnerTriggers(rootElement, context) {
        const elements = this._engine.driver.query(rootElement, NG_TRIGGER_SELECTOR, true);
        // emulate a leave animation for all inner nodes within this node.
        // If there are no animations found for any of the nodes then clear the cache
        // for the element.
        elements.forEach(elm => {
            // this means that an inner remove() operation has already kicked off
            // the animation on this element...
            if (elm[REMOVAL_FLAG])
                return;
            const namespaces = this._engine.fetchNamespacesByElement(elm);
            if (namespaces.size) {
                namespaces.forEach(ns => ns.triggerLeaveAnimation(elm, context, false, true));
            }
            else {
                this.clearElementCache(elm);
            }
        });
        // If the child elements were removed along with the parent, their animations might not
        // have completed. Clear all the elements from the cache so we don't end up with a memory leak.
        this._engine.afterFlushAnimationsDone(() => elements.forEach(elm => this.clearElementCache(elm)));
    }
    triggerLeaveAnimation(element, context, destroyAfterComplete, defaultToFallback) {
        const triggerStates = this._engine.statesByElement.get(element);
        const previousTriggersValues = new Map();
        if (triggerStates) {
            const players = [];
            Object.keys(triggerStates).forEach(triggerName => {
                previousTriggersValues.set(triggerName, triggerStates[triggerName].value);
                // this check is here in the event that an element is removed
                // twice (both on the host level and the component level)
                if (this._triggers[triggerName]) {
                    const player = this.trigger(element, triggerName, VOID_VALUE, defaultToFallback);
                    if (player) {
                        players.push(player);
                    }
                }
            });
            if (players.length) {
                this._engine.markElementAsRemoved(this.id, element, true, context, previousTriggersValues);
                if (destroyAfterComplete) {
                    optimizeGroupPlayer(players).onDone(() => this._engine.processLeaveNode(element));
                }
                return true;
            }
        }
        return false;
    }
    prepareLeaveAnimationListeners(element) {
        const listeners = this._elementListeners.get(element);
        const elementStates = this._engine.statesByElement.get(element);
        // if this statement fails then it means that the element was picked up
        // by an earlier flush (or there are no listeners at all to track the leave).
        if (listeners && elementStates) {
            const visitedTriggers = new Set();
            listeners.forEach(listener => {
                const triggerName = listener.name;
                if (visitedTriggers.has(triggerName))
                    return;
                visitedTriggers.add(triggerName);
                const trigger = this._triggers[triggerName];
                const transition = trigger.fallbackTransition;
                const fromState = elementStates[triggerName] || DEFAULT_STATE_VALUE;
                const toState = new StateValue(VOID_VALUE);
                const player = new TransitionAnimationPlayer(this.id, triggerName, element);
                this._engine.totalQueuedPlayers++;
                this._queue.push({
                    element,
                    triggerName,
                    transition,
                    fromState,
                    toState,
                    player,
                    isFallbackTransition: true
                });
            });
        }
    }
    removeNode(element, context) {
        const engine = this._engine;
        if (element.childElementCount) {
            this._signalRemovalForInnerTriggers(element, context);
        }
        // this means that a * => VOID animation was detected and kicked off
        if (this.triggerLeaveAnimation(element, context, true))
            return;
        // find the player that is animating and make sure that the
        // removal is delayed until that player has completed
        let containsPotentialParentTransition = false;
        if (engine.totalAnimations) {
            const currentPlayers = engine.players.length ? engine.playersByQueriedElement.get(element) : [];
            // when this `if statement` does not continue forward it means that
            // a previous animation query has selected the current element and
            // is animating it. In this situation want to continue forwards and
            // allow the element to be queued up for animation later.
            if (currentPlayers && currentPlayers.length) {
                containsPotentialParentTransition = true;
            }
            else {
                let parent = element;
                while (parent = parent.parentNode) {
                    const triggers = engine.statesByElement.get(parent);
                    if (triggers) {
                        containsPotentialParentTransition = true;
                        break;
                    }
                }
            }
        }
        // at this stage we know that the element will either get removed
        // during flush or will be picked up by a parent query. Either way
        // we need to fire the listeners for this element when it DOES get
        // removed (once the query parent animation is done or after flush)
        this.prepareLeaveAnimationListeners(element);
        // whether or not a parent has an animation we need to delay the deferral of the leave
        // operation until we have more information (which we do after flush() has been called)
        if (containsPotentialParentTransition) {
            engine.markElementAsRemoved(this.id, element, false, context);
        }
        else {
            const removalFlag = element[REMOVAL_FLAG];
            if (!removalFlag || removalFlag === NULL_REMOVAL_STATE) {
                // we do this after the flush has occurred such
                // that the callbacks can be fired
                engine.afterFlush(() => this.clearElementCache(element));
                engine.destroyInnerAnimations(element);
                engine._onRemovalComplete(element, context);
            }
        }
    }
    insertNode(element, parent) {
        addClass(element, this._hostClassName);
    }
    drainQueuedTransitions(microtaskId) {
        const instructions = [];
        this._queue.forEach(entry => {
            const player = entry.player;
            if (player.destroyed)
                return;
            const element = entry.element;
            const listeners = this._elementListeners.get(element);
            if (listeners) {
                listeners.forEach((listener) => {
                    if (listener.name == entry.triggerName) {
                        const baseEvent = makeAnimationEvent(element, entry.triggerName, entry.fromState.value, entry.toState.value);
                        baseEvent['_data'] = microtaskId;
                        listenOnPlayer(entry.player, listener.phase, baseEvent, listener.callback);
                    }
                });
            }
            if (player.markedForDestroy) {
                this._engine.afterFlush(() => {
                    // now we can destroy the element properly since the event listeners have
                    // been bound to the player
                    player.destroy();
                });
            }
            else {
                instructions.push(entry);
            }
        });
        this._queue = [];
        return instructions.sort((a, b) => {
            // if depCount == 0 them move to front
            // otherwise if a contains b then move back
            const d0 = a.transition.ast.depCount;
            const d1 = b.transition.ast.depCount;
            if (d0 == 0 || d1 == 0) {
                return d0 - d1;
            }
            return this._engine.driver.containsElement(a.element, b.element) ? 1 : -1;
        });
    }
    destroy(context) {
        this.players.forEach(p => p.destroy());
        this._signalRemovalForInnerTriggers(this.hostElement, context);
    }
    elementContainsData(element) {
        let containsData = false;
        if (this._elementListeners.has(element))
            containsData = true;
        containsData =
            (this._queue.find(entry => entry.element === element) ? true : false) || containsData;
        return containsData;
    }
}
export class TransitionAnimationEngine {
    constructor(bodyNode, driver, _normalizer) {
        this.bodyNode = bodyNode;
        this.driver = driver;
        this._normalizer = _normalizer;
        this.players = [];
        this.newHostElements = new Map();
        this.playersByElement = new Map();
        this.playersByQueriedElement = new Map();
        this.statesByElement = new Map();
        this.disabledNodes = new Set();
        this.totalAnimations = 0;
        this.totalQueuedPlayers = 0;
        this._namespaceLookup = {};
        this._namespaceList = [];
        this._flushFns = [];
        this._whenQuietFns = [];
        this.namespacesByHostElement = new Map();
        this.collectedEnterElements = [];
        this.collectedLeaveElements = [];
        // this method is designed to be overridden by the code that uses this engine
        this.onRemovalComplete = (element, context) => { };
    }
    /** @internal */
    _onRemovalComplete(element, context) {
        this.onRemovalComplete(element, context);
    }
    get queuedPlayers() {
        const players = [];
        this._namespaceList.forEach(ns => {
            ns.players.forEach(player => {
                if (player.queued) {
                    players.push(player);
                }
            });
        });
        return players;
    }
    createNamespace(namespaceId, hostElement) {
        const ns = new AnimationTransitionNamespace(namespaceId, hostElement, this);
        if (this.bodyNode && this.driver.containsElement(this.bodyNode, hostElement)) {
            this._balanceNamespaceList(ns, hostElement);
        }
        else {
            // defer this later until flush during when the host element has
            // been inserted so that we know exactly where to place it in
            // the namespace list
            this.newHostElements.set(hostElement, ns);
            // given that this host element is a part of the animation code, it
            // may or may not be inserted by a parent node that is of an
            // animation renderer type. If this happens then we can still have
            // access to this item when we query for :enter nodes. If the parent
            // is a renderer then the set data-structure will normalize the entry
            this.collectEnterElement(hostElement);
        }
        return this._namespaceLookup[namespaceId] = ns;
    }
    _balanceNamespaceList(ns, hostElement) {
        const namespaceList = this._namespaceList;
        const namespacesByHostElement = this.namespacesByHostElement;
        const limit = namespaceList.length - 1;
        if (limit >= 0) {
            let found = false;
            if (this.driver.getParentElement !== undefined) {
                // Fast path for when the driver implements `getParentElement`, which allows us to find the
                // closest ancestor with an existing namespace that we can then insert `ns` after, without
                // having to inspect all existing namespaces.
                let ancestor = this.driver.getParentElement(hostElement);
                while (ancestor) {
                    const ancestorNs = namespacesByHostElement.get(ancestor);
                    if (ancestorNs) {
                        // An animation namespace has been registered for this ancestor, so we insert `ns`
                        // right after it to establish top-down ordering of animation namespaces.
                        const index = namespaceList.indexOf(ancestorNs);
                        namespaceList.splice(index + 1, 0, ns);
                        found = true;
                        break;
                    }
                    ancestor = this.driver.getParentElement(ancestor);
                }
            }
            else {
                // Slow path for backwards compatibility if the driver does not implement
                // `getParentElement`, to be removed once `getParentElement` is a required method.
                for (let i = limit; i >= 0; i--) {
                    const nextNamespace = namespaceList[i];
                    if (this.driver.containsElement(nextNamespace.hostElement, hostElement)) {
                        namespaceList.splice(i + 1, 0, ns);
                        found = true;
                        break;
                    }
                }
            }
            if (!found) {
                // No namespace exists that is an ancestor of `ns`, so `ns` is inserted at the front to
                // ensure that any existing descendants are ordered after `ns`, retaining the desired
                // top-down ordering.
                namespaceList.unshift(ns);
            }
        }
        else {
            namespaceList.push(ns);
        }
        namespacesByHostElement.set(hostElement, ns);
        return ns;
    }
    register(namespaceId, hostElement) {
        let ns = this._namespaceLookup[namespaceId];
        if (!ns) {
            ns = this.createNamespace(namespaceId, hostElement);
        }
        return ns;
    }
    registerTrigger(namespaceId, name, trigger) {
        let ns = this._namespaceLookup[namespaceId];
        if (ns && ns.register(name, trigger)) {
            this.totalAnimations++;
        }
    }
    destroy(namespaceId, context) {
        if (!namespaceId)
            return;
        const ns = this._fetchNamespace(namespaceId);
        this.afterFlush(() => {
            this.namespacesByHostElement.delete(ns.hostElement);
            delete this._namespaceLookup[namespaceId];
            const index = this._namespaceList.indexOf(ns);
            if (index >= 0) {
                this._namespaceList.splice(index, 1);
            }
        });
        this.afterFlushAnimationsDone(() => ns.destroy(context));
    }
    _fetchNamespace(id) {
        return this._namespaceLookup[id];
    }
    fetchNamespacesByElement(element) {
        // normally there should only be one namespace per element, however
        // if @triggers are placed on both the component element and then
        // its host element (within the component code) then there will be
        // two namespaces returned. We use a set here to simply deduplicate
        // the namespaces in case (for the reason described above) there are multiple triggers
        const namespaces = new Set();
        const elementStates = this.statesByElement.get(element);
        if (elementStates) {
            const keys = Object.keys(elementStates);
            for (let i = 0; i < keys.length; i++) {
                const nsId = elementStates[keys[i]].namespaceId;
                if (nsId) {
                    const ns = this._fetchNamespace(nsId);
                    if (ns) {
                        namespaces.add(ns);
                    }
                }
            }
        }
        return namespaces;
    }
    trigger(namespaceId, element, name, value) {
        if (isElementNode(element)) {
            const ns = this._fetchNamespace(namespaceId);
            if (ns) {
                ns.trigger(element, name, value);
                return true;
            }
        }
        return false;
    }
    insertNode(namespaceId, element, parent, insertBefore) {
        if (!isElementNode(element))
            return;
        // special case for when an element is removed and reinserted (move operation)
        // when this occurs we do not want to use the element for deletion later
        const details = element[REMOVAL_FLAG];
        if (details && details.setForRemoval) {
            details.setForRemoval = false;
            details.setForMove = true;
            const index = this.collectedLeaveElements.indexOf(element);
            if (index >= 0) {
                this.collectedLeaveElements.splice(index, 1);
            }
        }
        // in the event that the namespaceId is blank then the caller
        // code does not contain any animation code in it, but it is
        // just being called so that the node is marked as being inserted
        if (namespaceId) {
            const ns = this._fetchNamespace(namespaceId);
            // This if-statement is a workaround for router issue #21947.
            // The router sometimes hits a race condition where while a route
            // is being instantiated a new navigation arrives, triggering leave
            // animation of DOM that has not been fully initialized, until this
            // is resolved, we need to handle the scenario when DOM is not in a
            // consistent state during the animation.
            if (ns) {
                ns.insertNode(element, parent);
            }
        }
        // only *directives and host elements are inserted before
        if (insertBefore) {
            this.collectEnterElement(element);
        }
    }
    collectEnterElement(element) {
        this.collectedEnterElements.push(element);
    }
    markElementAsDisabled(element, value) {
        if (value) {
            if (!this.disabledNodes.has(element)) {
                this.disabledNodes.add(element);
                addClass(element, DISABLED_CLASSNAME);
            }
        }
        else if (this.disabledNodes.has(element)) {
            this.disabledNodes.delete(element);
            removeClass(element, DISABLED_CLASSNAME);
        }
    }
    removeNode(namespaceId, element, isHostElement, context) {
        if (isElementNode(element)) {
            const ns = namespaceId ? this._fetchNamespace(namespaceId) : null;
            if (ns) {
                ns.removeNode(element, context);
            }
            else {
                this.markElementAsRemoved(namespaceId, element, false, context);
            }
            if (isHostElement) {
                const hostNS = this.namespacesByHostElement.get(element);
                if (hostNS && hostNS.id !== namespaceId) {
                    hostNS.removeNode(element, context);
                }
            }
        }
        else {
            this._onRemovalComplete(element, context);
        }
    }
    markElementAsRemoved(namespaceId, element, hasAnimation, context, previousTriggersValues) {
        this.collectedLeaveElements.push(element);
        element[REMOVAL_FLAG] = {
            namespaceId,
            setForRemoval: context,
            hasAnimation,
            removedBeforeQueried: false,
            previousTriggersValues
        };
    }
    listen(namespaceId, element, name, phase, callback) {
        if (isElementNode(element)) {
            return this._fetchNamespace(namespaceId).listen(element, name, phase, callback);
        }
        return () => { };
    }
    _buildInstruction(entry, subTimelines, enterClassName, leaveClassName, skipBuildAst) {
        return entry.transition.build(this.driver, entry.element, entry.fromState.value, entry.toState.value, enterClassName, leaveClassName, entry.fromState.options, entry.toState.options, subTimelines, skipBuildAst);
    }
    destroyInnerAnimations(containerElement) {
        let elements = this.driver.query(containerElement, NG_TRIGGER_SELECTOR, true);
        elements.forEach(element => this.destroyActiveAnimationsForElement(element));
        if (this.playersByQueriedElement.size == 0)
            return;
        elements = this.driver.query(containerElement, NG_ANIMATING_SELECTOR, true);
        elements.forEach(element => this.finishActiveQueriedAnimationOnElement(element));
    }
    destroyActiveAnimationsForElement(element) {
        const players = this.playersByElement.get(element);
        if (players) {
            players.forEach(player => {
                // special case for when an element is set for destruction, but hasn't started.
                // in this situation we want to delay the destruction until the flush occurs
                // so that any event listeners attached to the player are triggered.
                if (player.queued) {
                    player.markedForDestroy = true;
                }
                else {
                    player.destroy();
                }
            });
        }
    }
    finishActiveQueriedAnimationOnElement(element) {
        const players = this.playersByQueriedElement.get(element);
        if (players) {
            players.forEach(player => player.finish());
        }
    }
    whenRenderingDone() {
        return new Promise(resolve => {
            if (this.players.length) {
                return optimizeGroupPlayer(this.players).onDone(() => resolve());
            }
            else {
                resolve();
            }
        });
    }
    processLeaveNode(element) {
        const details = element[REMOVAL_FLAG];
        if (details && details.setForRemoval) {
            // this will prevent it from removing it twice
            element[REMOVAL_FLAG] = NULL_REMOVAL_STATE;
            if (details.namespaceId) {
                this.destroyInnerAnimations(element);
                const ns = this._fetchNamespace(details.namespaceId);
                if (ns) {
                    ns.clearElementCache(element);
                }
            }
            this._onRemovalComplete(element, details.setForRemoval);
        }
        if (element.classList?.contains(DISABLED_CLASSNAME)) {
            this.markElementAsDisabled(element, false);
        }
        this.driver.query(element, DISABLED_SELECTOR, true).forEach(node => {
            this.markElementAsDisabled(node, false);
        });
    }
    flush(microtaskId = -1) {
        let players = [];
        if (this.newHostElements.size) {
            this.newHostElements.forEach((ns, element) => this._balanceNamespaceList(ns, element));
            this.newHostElements.clear();
        }
        if (this.totalAnimations && this.collectedEnterElements.length) {
            for (let i = 0; i < this.collectedEnterElements.length; i++) {
                const elm = this.collectedEnterElements[i];
                addClass(elm, STAR_CLASSNAME);
            }
        }
        if (this._namespaceList.length &&
            (this.totalQueuedPlayers || this.collectedLeaveElements.length)) {
            const cleanupFns = [];
            try {
                players = this._flushAnimations(cleanupFns, microtaskId);
            }
            finally {
                for (let i = 0; i < cleanupFns.length; i++) {
                    cleanupFns[i]();
                }
            }
        }
        else {
            for (let i = 0; i < this.collectedLeaveElements.length; i++) {
                const element = this.collectedLeaveElements[i];
                this.processLeaveNode(element);
            }
        }
        this.totalQueuedPlayers = 0;
        this.collectedEnterElements.length = 0;
        this.collectedLeaveElements.length = 0;
        this._flushFns.forEach(fn => fn());
        this._flushFns = [];
        if (this._whenQuietFns.length) {
            // we move these over to a variable so that
            // if any new callbacks are registered in another
            // flush they do not populate the existing set
            const quietFns = this._whenQuietFns;
            this._whenQuietFns = [];
            if (players.length) {
                optimizeGroupPlayer(players).onDone(() => {
                    quietFns.forEach(fn => fn());
                });
            }
            else {
                quietFns.forEach(fn => fn());
            }
        }
    }
    reportError(errors) {
        throw triggerTransitionsFailed(errors);
    }
    _flushAnimations(cleanupFns, microtaskId) {
        const subTimelines = new ElementInstructionMap();
        const skippedPlayers = [];
        const skippedPlayersMap = new Map();
        const queuedInstructions = [];
        const queriedElements = new Map();
        const allPreStyleElements = new Map();
        const allPostStyleElements = new Map();
        const disabledElementsSet = new Set();
        this.disabledNodes.forEach(node => {
            disabledElementsSet.add(node);
            const nodesThatAreDisabled = this.driver.query(node, QUEUED_SELECTOR, true);
            for (let i = 0; i < nodesThatAreDisabled.length; i++) {
                disabledElementsSet.add(nodesThatAreDisabled[i]);
            }
        });
        const bodyNode = this.bodyNode;
        const allTriggerElements = Array.from(this.statesByElement.keys());
        const enterNodeMap = buildRootMap(allTriggerElements, this.collectedEnterElements);
        // this must occur before the instructions are built below such that
        // the :enter queries match the elements (since the timeline queries
        // are fired during instruction building).
        const enterNodeMapIds = new Map();
        let i = 0;
        enterNodeMap.forEach((nodes, root) => {
            const className = ENTER_CLASSNAME + i++;
            enterNodeMapIds.set(root, className);
            nodes.forEach(node => addClass(node, className));
        });
        const allLeaveNodes = [];
        const mergedLeaveNodes = new Set();
        const leaveNodesWithoutAnimations = new Set();
        for (let i = 0; i < this.collectedLeaveElements.length; i++) {
            const element = this.collectedLeaveElements[i];
            const details = element[REMOVAL_FLAG];
            if (details && details.setForRemoval) {
                allLeaveNodes.push(element);
                mergedLeaveNodes.add(element);
                if (details.hasAnimation) {
                    this.driver.query(element, STAR_SELECTOR, true).forEach(elm => mergedLeaveNodes.add(elm));
                }
                else {
                    leaveNodesWithoutAnimations.add(element);
                }
            }
        }
        const leaveNodeMapIds = new Map();
        const leaveNodeMap = buildRootMap(allTriggerElements, Array.from(mergedLeaveNodes));
        leaveNodeMap.forEach((nodes, root) => {
            const className = LEAVE_CLASSNAME + i++;
            leaveNodeMapIds.set(root, className);
            nodes.forEach(node => addClass(node, className));
        });
        cleanupFns.push(() => {
            enterNodeMap.forEach((nodes, root) => {
                const className = enterNodeMapIds.get(root);
                nodes.forEach(node => removeClass(node, className));
            });
            leaveNodeMap.forEach((nodes, root) => {
                const className = leaveNodeMapIds.get(root);
                nodes.forEach(node => removeClass(node, className));
            });
            allLeaveNodes.forEach(element => {
                this.processLeaveNode(element);
            });
        });
        const allPlayers = [];
        const erroneousTransitions = [];
        for (let i = this._namespaceList.length - 1; i >= 0; i--) {
            const ns = this._namespaceList[i];
            ns.drainQueuedTransitions(microtaskId).forEach(entry => {
                const player = entry.player;
                const element = entry.element;
                allPlayers.push(player);
                if (this.collectedEnterElements.length) {
                    const details = element[REMOVAL_FLAG];
                    // animations for move operations (elements being removed and reinserted,
                    // e.g. when the order of an *ngFor list changes) are currently not supported
                    if (details && details.setForMove) {
                        if (details.previousTriggersValues &&
                            details.previousTriggersValues.has(entry.triggerName)) {
                            const previousValue = details.previousTriggersValues.get(entry.triggerName);
                            // we need to restore the previous trigger value since the element has
                            // only been moved and hasn't actually left the DOM
                            const triggersWithStates = this.statesByElement.get(entry.element);
                            if (triggersWithStates && triggersWithStates[entry.triggerName]) {
                                triggersWithStates[entry.triggerName].value = previousValue;
                            }
                        }
                        player.destroy();
                        return;
                    }
                }
                const nodeIsOrphaned = !bodyNode || !this.driver.containsElement(bodyNode, element);
                const leaveClassName = leaveNodeMapIds.get(element);
                const enterClassName = enterNodeMapIds.get(element);
                const instruction = this._buildInstruction(entry, subTimelines, enterClassName, leaveClassName, nodeIsOrphaned);
                if (instruction.errors && instruction.errors.length) {
                    erroneousTransitions.push(instruction);
                    return;
                }
                // even though the element may not be in the DOM, it may still
                // be added at a later point (due to the mechanics of content
                // projection and/or dynamic component insertion) therefore it's
                // important to still style the element.
                if (nodeIsOrphaned) {
                    player.onStart(() => eraseStyles(element, instruction.fromStyles));
                    player.onDestroy(() => setStyles(element, instruction.toStyles));
                    skippedPlayers.push(player);
                    return;
                }
                // if an unmatched transition is queued and ready to go
                // then it SHOULD NOT render an animation and cancel the
                // previously running animations.
                if (entry.isFallbackTransition) {
                    player.onStart(() => eraseStyles(element, instruction.fromStyles));
                    player.onDestroy(() => setStyles(element, instruction.toStyles));
                    skippedPlayers.push(player);
                    return;
                }
                // this means that if a parent animation uses this animation as a sub-trigger
                // then it will instruct the timeline builder not to add a player delay, but
                // instead stretch the first keyframe gap until the animation starts. This is
                // important in order to prevent extra initialization styles from being
                // required by the user for the animation.
                const timelines = [];
                instruction.timelines.forEach(tl => {
                    tl.stretchStartingKeyframe = true;
                    if (!this.disabledNodes.has(tl.element)) {
                        timelines.push(tl);
                    }
                });
                instruction.timelines = timelines;
                subTimelines.append(element, instruction.timelines);
                const tuple = { instruction, player, element };
                queuedInstructions.push(tuple);
                instruction.queriedElements.forEach(element => getOrSetAsInMap(queriedElements, element, []).push(player));
                instruction.preStyleProps.forEach((stringMap, element) => {
                    const props = Object.keys(stringMap);
                    if (props.length) {
                        let setVal = allPreStyleElements.get(element);
                        if (!setVal) {
                            allPreStyleElements.set(element, setVal = new Set());
                        }
                        props.forEach(prop => setVal.add(prop));
                    }
                });
                instruction.postStyleProps.forEach((stringMap, element) => {
                    const props = Object.keys(stringMap);
                    let setVal = allPostStyleElements.get(element);
                    if (!setVal) {
                        allPostStyleElements.set(element, setVal = new Set());
                    }
                    props.forEach(prop => setVal.add(prop));
                });
            });
        }
        if (erroneousTransitions.length) {
            const errors = [];
            erroneousTransitions.forEach(instruction => {
                errors.push(transitionFailed(instruction.triggerName, instruction.errors));
            });
            allPlayers.forEach(player => player.destroy());
            this.reportError(errors);
        }
        const allPreviousPlayersMap = new Map();
        // this map tells us which element in the DOM tree is contained by
        // which animation. Further down this map will get populated once
        // the players are built and in doing so we can use it to efficiently
        // figure out if a sub player is skipped due to a parent player having priority.
        const animationElementMap = new Map();
        queuedInstructions.forEach(entry => {
            const element = entry.element;
            if (subTimelines.has(element)) {
                animationElementMap.set(element, element);
                this._beforeAnimationBuild(entry.player.namespaceId, entry.instruction, allPreviousPlayersMap);
            }
        });
        skippedPlayers.forEach(player => {
            const element = player.element;
            const previousPlayers = this._getPreviousPlayers(element, false, player.namespaceId, player.triggerName, null);
            previousPlayers.forEach(prevPlayer => {
                getOrSetAsInMap(allPreviousPlayersMap, element, []).push(prevPlayer);
                prevPlayer.destroy();
            });
        });
        // this is a special case for nodes that will be removed either by
        // having their own leave animations or by being queried in a container
        // that will be removed once a parent animation is complete. The idea
        // here is that * styles must be identical to ! styles because of
        // backwards compatibility (* is also filled in by default in many places).
        // Otherwise * styles will return an empty value or "auto" since the element
        // passed to getComputedStyle will not be visible (since * === destination)
        const replaceNodes = allLeaveNodes.filter(node => {
            return replacePostStylesAsPre(node, allPreStyleElements, allPostStyleElements);
        });
        // POST STAGE: fill the * styles
        const postStylesMap = new Map();
        const allLeaveQueriedNodes = cloakAndComputeStyles(postStylesMap, this.driver, leaveNodesWithoutAnimations, allPostStyleElements, AUTO_STYLE);
        allLeaveQueriedNodes.forEach(node => {
            if (replacePostStylesAsPre(node, allPreStyleElements, allPostStyleElements)) {
                replaceNodes.push(node);
            }
        });
        // PRE STAGE: fill the ! styles
        const preStylesMap = new Map();
        enterNodeMap.forEach((nodes, root) => {
            cloakAndComputeStyles(preStylesMap, this.driver, new Set(nodes), allPreStyleElements, PRE_STYLE);
        });
        replaceNodes.forEach(node => {
            const post = postStylesMap.get(node);
            const pre = preStylesMap.get(node);
            postStylesMap.set(node, { ...post, ...pre });
        });
        const rootPlayers = [];
        const subPlayers = [];
        const NO_PARENT_ANIMATION_ELEMENT_DETECTED = {};
        queuedInstructions.forEach(entry => {
            const { element, player, instruction } = entry;
            // this means that it was never consumed by a parent animation which
            // means that it is independent and therefore should be set for animation
            if (subTimelines.has(element)) {
                if (disabledElementsSet.has(element)) {
                    player.onDestroy(() => setStyles(element, instruction.toStyles));
                    player.disabled = true;
                    player.overrideTotalTime(instruction.totalTime);
                    skippedPlayers.push(player);
                    return;
                }
                // this will flow up the DOM and query the map to figure out
                // if a parent animation has priority over it. In the situation
                // that a parent is detected then it will cancel the loop. If
                // nothing is detected, or it takes a few hops to find a parent,
                // then it will fill in the missing nodes and signal them as having
                // a detected parent (or a NO_PARENT value via a special constant).
                let parentWithAnimation = NO_PARENT_ANIMATION_ELEMENT_DETECTED;
                if (animationElementMap.size > 1) {
                    let elm = element;
                    const parentsToAdd = [];
                    while (elm = elm.parentNode) {
                        const detectedParent = animationElementMap.get(elm);
                        if (detectedParent) {
                            parentWithAnimation = detectedParent;
                            break;
                        }
                        parentsToAdd.push(elm);
                    }
                    parentsToAdd.forEach(parent => animationElementMap.set(parent, parentWithAnimation));
                }
                const innerPlayer = this._buildAnimation(player.namespaceId, instruction, allPreviousPlayersMap, skippedPlayersMap, preStylesMap, postStylesMap);
                player.setRealPlayer(innerPlayer);
                if (parentWithAnimation === NO_PARENT_ANIMATION_ELEMENT_DETECTED) {
                    rootPlayers.push(player);
                }
                else {
                    const parentPlayers = this.playersByElement.get(parentWithAnimation);
                    if (parentPlayers && parentPlayers.length) {
                        player.parentPlayer = optimizeGroupPlayer(parentPlayers);
                    }
                    skippedPlayers.push(player);
                }
            }
            else {
                eraseStyles(element, instruction.fromStyles);
                player.onDestroy(() => setStyles(element, instruction.toStyles));
                // there still might be a ancestor player animating this
                // element therefore we will still add it as a sub player
                // even if its animation may be disabled
                subPlayers.push(player);
                if (disabledElementsSet.has(element)) {
                    skippedPlayers.push(player);
                }
            }
        });
        // find all of the sub players' corresponding inner animation players
        subPlayers.forEach(player => {
            // even if no players are found for a sub animation it
            // will still complete itself after the next tick since it's Noop
            const playersForElement = skippedPlayersMap.get(player.element);
            if (playersForElement && playersForElement.length) {
                const innerPlayer = optimizeGroupPlayer(playersForElement);
                player.setRealPlayer(innerPlayer);
            }
        });
        // the reason why we don't actually play the animation is
        // because all that a skipped player is designed to do is to
        // fire the start/done transition callback events
        skippedPlayers.forEach(player => {
            if (player.parentPlayer) {
                player.syncPlayerEvents(player.parentPlayer);
            }
            else {
                player.destroy();
            }
        });
        // run through all of the queued removals and see if they
        // were picked up by a query. If not then perform the removal
        // operation right away unless a parent animation is ongoing.
        for (let i = 0; i < allLeaveNodes.length; i++) {
            const element = allLeaveNodes[i];
            const details = element[REMOVAL_FLAG];
            removeClass(element, LEAVE_CLASSNAME);
            // this means the element has a removal animation that is being
            // taken care of and therefore the inner elements will hang around
            // until that animation is over (or the parent queried animation)
            if (details && details.hasAnimation)
                continue;
            let players = [];
            // if this element is queried or if it contains queried children
            // then we want for the element not to be removed from the page
            // until the queried animations have finished
            if (queriedElements.size) {
                let queriedPlayerResults = queriedElements.get(element);
                if (queriedPlayerResults && queriedPlayerResults.length) {
                    players.push(...queriedPlayerResults);
                }
                let queriedInnerElements = this.driver.query(element, NG_ANIMATING_SELECTOR, true);
                for (let j = 0; j < queriedInnerElements.length; j++) {
                    let queriedPlayers = queriedElements.get(queriedInnerElements[j]);
                    if (queriedPlayers && queriedPlayers.length) {
                        players.push(...queriedPlayers);
                    }
                }
            }
            const activePlayers = players.filter(p => !p.destroyed);
            if (activePlayers.length) {
                removeNodesAfterAnimationDone(this, element, activePlayers);
            }
            else {
                this.processLeaveNode(element);
            }
        }
        // this is required so the cleanup method doesn't remove them
        allLeaveNodes.length = 0;
        rootPlayers.forEach(player => {
            this.players.push(player);
            player.onDone(() => {
                player.destroy();
                const index = this.players.indexOf(player);
                this.players.splice(index, 1);
            });
            player.play();
        });
        return rootPlayers;
    }
    elementContainsData(namespaceId, element) {
        let containsData = false;
        const details = element[REMOVAL_FLAG];
        if (details && details.setForRemoval)
            containsData = true;
        if (this.playersByElement.has(element))
            containsData = true;
        if (this.playersByQueriedElement.has(element))
            containsData = true;
        if (this.statesByElement.has(element))
            containsData = true;
        return this._fetchNamespace(namespaceId).elementContainsData(element) || containsData;
    }
    afterFlush(callback) {
        this._flushFns.push(callback);
    }
    afterFlushAnimationsDone(callback) {
        this._whenQuietFns.push(callback);
    }
    _getPreviousPlayers(element, isQueriedElement, namespaceId, triggerName, toStateValue) {
        let players = [];
        if (isQueriedElement) {
            const queriedElementPlayers = this.playersByQueriedElement.get(element);
            if (queriedElementPlayers) {
                players = queriedElementPlayers;
            }
        }
        else {
            const elementPlayers = this.playersByElement.get(element);
            if (elementPlayers) {
                const isRemovalAnimation = !toStateValue || toStateValue == VOID_VALUE;
                elementPlayers.forEach(player => {
                    if (player.queued)
                        return;
                    if (!isRemovalAnimation && player.triggerName != triggerName)
                        return;
                    players.push(player);
                });
            }
        }
        if (namespaceId || triggerName) {
            players = players.filter(player => {
                if (namespaceId && namespaceId != player.namespaceId)
                    return false;
                if (triggerName && triggerName != player.triggerName)
                    return false;
                return true;
            });
        }
        return players;
    }
    _beforeAnimationBuild(namespaceId, instruction, allPreviousPlayersMap) {
        const triggerName = instruction.triggerName;
        const rootElement = instruction.element;
        // when a removal animation occurs, ALL previous players are collected
        // and destroyed (even if they are outside of the current namespace)
        const targetNameSpaceId = instruction.isRemovalTransition ? undefined : namespaceId;
        const targetTriggerName = instruction.isRemovalTransition ? undefined : triggerName;
        for (const timelineInstruction of instruction.timelines) {
            const element = timelineInstruction.element;
            const isQueriedElement = element !== rootElement;
            const players = getOrSetAsInMap(allPreviousPlayersMap, element, []);
            const previousPlayers = this._getPreviousPlayers(element, isQueriedElement, targetNameSpaceId, targetTriggerName, instruction.toState);
            previousPlayers.forEach(player => {
                const realPlayer = player.getRealPlayer();
                if (realPlayer.beforeDestroy) {
                    realPlayer.beforeDestroy();
                }
                player.destroy();
                players.push(player);
            });
        }
        // this needs to be done so that the PRE/POST styles can be
        // computed properly without interfering with the previous animation
        eraseStyles(rootElement, instruction.fromStyles);
    }
    _buildAnimation(namespaceId, instruction, allPreviousPlayersMap, skippedPlayersMap, preStylesMap, postStylesMap) {
        const triggerName = instruction.triggerName;
        const rootElement = instruction.element;
        // we first run this so that the previous animation player
        // data can be passed into the successive animation players
        const allQueriedPlayers = [];
        const allConsumedElements = new Set();
        const allSubElements = new Set();
        const allNewPlayers = instruction.timelines.map(timelineInstruction => {
            const element = timelineInstruction.element;
            allConsumedElements.add(element);
            // FIXME (matsko): make sure to-be-removed animations are removed properly
            const details = element[REMOVAL_FLAG];
            if (details && details.removedBeforeQueried)
                return new NoopAnimationPlayer(timelineInstruction.duration, timelineInstruction.delay);
            const isQueriedElement = element !== rootElement;
            const previousPlayers = flattenGroupPlayers((allPreviousPlayersMap.get(element) || EMPTY_PLAYER_ARRAY)
                .map(p => p.getRealPlayer()))
                .filter(p => {
                // the `element` is not apart of the AnimationPlayer definition, but
                // Mock/WebAnimations
                // use the element within their implementation. This will be added in Angular5 to
                // AnimationPlayer
                const pp = p;
                return pp.element ? pp.element === element : false;
            });
            const preStyles = preStylesMap.get(element);
            const postStyles = postStylesMap.get(element);
            const keyframes = normalizeKeyframes(this.driver, this._normalizer, element, timelineInstruction.keyframes, preStyles, postStyles);
            const player = this._buildPlayer(timelineInstruction, keyframes, previousPlayers);
            // this means that this particular player belongs to a sub trigger. It is
            // important that we match this player up with the corresponding (@trigger.listener)
            if (timelineInstruction.subTimeline && skippedPlayersMap) {
                allSubElements.add(element);
            }
            if (isQueriedElement) {
                const wrappedPlayer = new TransitionAnimationPlayer(namespaceId, triggerName, element);
                wrappedPlayer.setRealPlayer(player);
                allQueriedPlayers.push(wrappedPlayer);
            }
            return player;
        });
        allQueriedPlayers.forEach(player => {
            getOrSetAsInMap(this.playersByQueriedElement, player.element, []).push(player);
            player.onDone(() => deleteOrUnsetInMap(this.playersByQueriedElement, player.element, player));
        });
        allConsumedElements.forEach(element => addClass(element, NG_ANIMATING_CLASSNAME));
        const player = optimizeGroupPlayer(allNewPlayers);
        player.onDestroy(() => {
            allConsumedElements.forEach(element => removeClass(element, NG_ANIMATING_CLASSNAME));
            setStyles(rootElement, instruction.toStyles);
        });
        // this basically makes all of the callbacks for sub element animations
        // be dependent on the upper players for when they finish
        allSubElements.forEach(element => {
            getOrSetAsInMap(skippedPlayersMap, element, []).push(player);
        });
        return player;
    }
    _buildPlayer(instruction, keyframes, previousPlayers) {
        if (keyframes.length > 0) {
            return this.driver.animate(instruction.element, keyframes, instruction.duration, instruction.delay, instruction.easing, previousPlayers);
        }
        // special case for when an empty transition|definition is provided
        // ... there is no point in rendering an empty animation
        return new NoopAnimationPlayer(instruction.duration, instruction.delay);
    }
}
export class TransitionAnimationPlayer {
    constructor(namespaceId, triggerName, element) {
        this.namespaceId = namespaceId;
        this.triggerName = triggerName;
        this.element = element;
        this._player = new NoopAnimationPlayer();
        this._containsRealPlayer = false;
        this._queuedCallbacks = {};
        this.destroyed = false;
        this.markedForDestroy = false;
        this.disabled = false;
        this.queued = true;
        this.totalTime = 0;
    }
    setRealPlayer(player) {
        if (this._containsRealPlayer)
            return;
        this._player = player;
        Object.keys(this._queuedCallbacks).forEach(phase => {
            this._queuedCallbacks[phase].forEach(callback => listenOnPlayer(player, phase, undefined, callback));
        });
        this._queuedCallbacks = {};
        this._containsRealPlayer = true;
        this.overrideTotalTime(player.totalTime);
        this.queued = false;
    }
    getRealPlayer() {
        return this._player;
    }
    overrideTotalTime(totalTime) {
        this.totalTime = totalTime;
    }
    syncPlayerEvents(player) {
        const p = this._player;
        if (p.triggerCallback) {
            player.onStart(() => p.triggerCallback('start'));
        }
        player.onDone(() => this.finish());
        player.onDestroy(() => this.destroy());
    }
    _queueEvent(name, callback) {
        getOrSetAsInMap(this._queuedCallbacks, name, []).push(callback);
    }
    onDone(fn) {
        if (this.queued) {
            this._queueEvent('done', fn);
        }
        this._player.onDone(fn);
    }
    onStart(fn) {
        if (this.queued) {
            this._queueEvent('start', fn);
        }
        this._player.onStart(fn);
    }
    onDestroy(fn) {
        if (this.queued) {
            this._queueEvent('destroy', fn);
        }
        this._player.onDestroy(fn);
    }
    init() {
        this._player.init();
    }
    hasStarted() {
        return this.queued ? false : this._player.hasStarted();
    }
    play() {
        !this.queued && this._player.play();
    }
    pause() {
        !this.queued && this._player.pause();
    }
    restart() {
        !this.queued && this._player.restart();
    }
    finish() {
        this._player.finish();
    }
    destroy() {
        this.destroyed = true;
        this._player.destroy();
    }
    reset() {
        !this.queued && this._player.reset();
    }
    setPosition(p) {
        if (!this.queued) {
            this._player.setPosition(p);
        }
    }
    getPosition() {
        return this.queued ? 0 : this._player.getPosition();
    }
    /** @internal */
    triggerCallback(phaseName) {
        const p = this._player;
        if (p.triggerCallback) {
            p.triggerCallback(phaseName);
        }
    }
}
function deleteOrUnsetInMap(map, key, value) {
    let currentValues;
    if (map instanceof Map) {
        currentValues = map.get(key);
        if (currentValues) {
            if (currentValues.length) {
                const index = currentValues.indexOf(value);
                currentValues.splice(index, 1);
            }
            if (currentValues.length == 0) {
                map.delete(key);
            }
        }
    }
    else {
        currentValues = map[key];
        if (currentValues) {
            if (currentValues.length) {
                const index = currentValues.indexOf(value);
                currentValues.splice(index, 1);
            }
            if (currentValues.length == 0) {
                delete map[key];
            }
        }
    }
    return currentValues;
}
function normalizeTriggerValue(value) {
    // we use `!= null` here because it's the most simple
    // way to test against a "falsy" value without mixing
    // in empty strings or a zero value. DO NOT OPTIMIZE.
    return value != null ? value : null;
}
function isElementNode(node) {
    return node && node['nodeType'] === 1;
}
function isTriggerEventValid(eventName) {
    return eventName == 'start' || eventName == 'done';
}
function cloakElement(element, value) {
    const oldValue = element.style.display;
    element.style.display = value != null ? value : 'none';
    return oldValue;
}
function cloakAndComputeStyles(valuesMap, driver, elements, elementPropsMap, defaultStyle) {
    const cloakVals = [];
    elements.forEach(element => cloakVals.push(cloakElement(element)));
    const failedElements = [];
    elementPropsMap.forEach((props, element) => {
        const styles = {};
        props.forEach(prop => {
            const value = styles[prop] = driver.computeStyle(element, prop, defaultStyle);
            // there is no easy way to detect this because a sub element could be removed
            // by a parent animation element being detached.
            if (!value || value.length == 0) {
                element[REMOVAL_FLAG] = NULL_REMOVED_QUERIED_STATE;
                failedElements.push(element);
            }
        });
        valuesMap.set(element, styles);
    });
    // we use a index variable here since Set.forEach(a, i) does not return
    // an index value for the closure (but instead just the value)
    let i = 0;
    elements.forEach(element => cloakElement(element, cloakVals[i++]));
    return failedElements;
}
/*
Since the Angular renderer code will return a collection of inserted
nodes in all areas of a DOM tree, it's up to this algorithm to figure
out which nodes are roots for each animation @trigger.

By placing each inserted node into a Set and traversing upwards, it
is possible to find the @trigger elements and well any direct *star
insertion nodes, if a @trigger root is found then the enter element
is placed into the Map[@trigger] spot.
 */
function buildRootMap(roots, nodes) {
    const rootMap = new Map();
    roots.forEach(root => rootMap.set(root, []));
    if (nodes.length == 0)
        return rootMap;
    const NULL_NODE = 1;
    const nodeSet = new Set(nodes);
    const localRootMap = new Map();
    function getRoot(node) {
        if (!node)
            return NULL_NODE;
        let root = localRootMap.get(node);
        if (root)
            return root;
        const parent = node.parentNode;
        if (rootMap.has(parent)) { // ngIf inside @trigger
            root = parent;
        }
        else if (nodeSet.has(parent)) { // ngIf inside ngIf
            root = NULL_NODE;
        }
        else { // recurse upwards
            root = getRoot(parent);
        }
        localRootMap.set(node, root);
        return root;
    }
    nodes.forEach(node => {
        const root = getRoot(node);
        if (root !== NULL_NODE) {
            rootMap.get(root).push(node);
        }
    });
    return rootMap;
}
function addClass(element, className) {
    element.classList?.add(className);
}
function removeClass(element, className) {
    element.classList?.remove(className);
}
function removeNodesAfterAnimationDone(engine, element, players) {
    optimizeGroupPlayer(players).onDone(() => engine.processLeaveNode(element));
}
function flattenGroupPlayers(players) {
    const finalPlayers = [];
    _flattenGroupPlayersRecur(players, finalPlayers);
    return finalPlayers;
}
function _flattenGroupPlayersRecur(players, finalPlayers) {
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        if (player instanceof AnimationGroupPlayer) {
            _flattenGroupPlayersRecur(player.players, finalPlayers);
        }
        else {
            finalPlayers.push(player);
        }
    }
}
function objEquals(a, b) {
    const k1 = Object.keys(a);
    const k2 = Object.keys(b);
    if (k1.length != k2.length)
        return false;
    for (let i = 0; i < k1.length; i++) {
        const prop = k1[i];
        if (!b.hasOwnProperty(prop) || a[prop] !== b[prop])
            return false;
    }
    return true;
}
function replacePostStylesAsPre(element, allPreStyleElements, allPostStyleElements) {
    const postEntry = allPostStyleElements.get(element);
    if (!postEntry)
        return false;
    let preEntry = allPreStyleElements.get(element);
    if (preEntry) {
        postEntry.forEach(data => preEntry.add(data));
    }
    else {
        allPreStyleElements.set(element, postEntry);
    }
    allPostStyleElements.delete(element);
    return true;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNpdGlvbl9hbmltYXRpb25fZW5naW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYW5pbWF0aW9ucy9icm93c2VyL3NyYy9yZW5kZXIvdHJhbnNpdGlvbl9hbmltYXRpb25fZW5naW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFBb0MsVUFBVSxFQUFFLG1CQUFtQixFQUFFLHFCQUFxQixJQUFJLG9CQUFvQixFQUFFLFVBQVUsSUFBSSxTQUFTLEVBQWEsTUFBTSxxQkFBcUIsQ0FBQztBQU0zTCxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxnQ0FBZ0MsQ0FBQztBQUVyRSxPQUFPLEVBQUMsWUFBWSxFQUFFLGNBQWMsRUFBRSxnQkFBZ0IsRUFBRSx3QkFBd0IsRUFBRSxtQkFBbUIsRUFBRSx1QkFBdUIsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQ3hKLE9BQU8sRUFBQyxPQUFPLEVBQUUsZUFBZSxFQUFFLFdBQVcsRUFBbUIsZUFBZSxFQUFFLHNCQUFzQixFQUFFLHFCQUFxQixFQUFFLG9CQUFvQixFQUFFLG1CQUFtQixFQUFFLFNBQVMsRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUdyTSxPQUFPLEVBQUMsZUFBZSxFQUFFLGNBQWMsRUFBRSxrQkFBa0IsRUFBRSxrQkFBa0IsRUFBRSxtQkFBbUIsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUV0SCxNQUFNLGdCQUFnQixHQUFHLG1CQUFtQixDQUFDO0FBQzdDLE1BQU0sZUFBZSxHQUFHLG9CQUFvQixDQUFDO0FBQzdDLE1BQU0sa0JBQWtCLEdBQUcscUJBQXFCLENBQUM7QUFDakQsTUFBTSxpQkFBaUIsR0FBRyxzQkFBc0IsQ0FBQztBQUNqRCxNQUFNLGNBQWMsR0FBRyxrQkFBa0IsQ0FBQztBQUMxQyxNQUFNLGFBQWEsR0FBRyxtQkFBbUIsQ0FBQztBQUUxQyxNQUFNLGtCQUFrQixH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QUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFBRSxPQUFPLEtBQUssQ0FBQztLQUNsRTtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVELFNBQVMsc0JBQXNCLENBQzNCLE9BQVksRUFBRSxtQkFBMEMsRUFDeEQsb0JBQTJDO0lBQzdDLE1BQU0sU0FBUyxHQUFHLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNwRCxJQUFJLENBQUMsU0FBUztRQUFFLE9BQU8sS0FBSyxDQUFDO0lBRTdCLElBQUksUUFBUSxHQUFHLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNoRCxJQUFJLFFBQVEsRUFBRTtRQUNaLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7S0FDaEQ7U0FBTTtRQUNMLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7S0FDN0M7SUFFRCxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDckMsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0FuaW1hdGlvbk9wdGlvbnMsIEFuaW1hdGlvblBsYXllciwgQVVUT19TVFlMRSwgTm9vcEFuaW1hdGlvblBsYXllciwgybVBbmltYXRpb25Hcm91cFBsYXllciBhcyBBbmltYXRpb25Hcm91cFBsYXllciwgybVQUkVfU1RZTEUgYXMgUFJFX1NUWUxFLCDJtVN0eWxlRGF0YX0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5cbmltcG9ydCB7QW5pbWF0aW9uVGltZWxpbmVJbnN0cnVjdGlvbn0gZnJvbSAnLi4vZHNsL2FuaW1hdGlvbl90aW1lbGluZV9pbnN0cnVjdGlvbic7XG5pbXBvcnQge0FuaW1hdGlvblRyYW5zaXRpb25GYWN0b3J5fSBmcm9tICcuLi9kc2wvYW5pbWF0aW9uX3RyYW5zaXRpb25fZmFjdG9yeSc7XG5pbXBvcnQge0FuaW1hdGlvblRyYW5zaXRpb25JbnN0cnVjdGlvbn0gZnJvbSAnLi4vZHNsL2FuaW1hdGlvbl90cmFuc2l0aW9uX2luc3RydWN0aW9uJztcbmltcG9ydCB7QW5pbWF0aW9uVHJpZ2dlcn0gZnJvbSAnLi4vZHNsL2FuaW1hdGlvbl90cmlnZ2VyJztcbmltcG9ydCB7RWxlbWVudEluc3RydWN0aW9uTWFwfSBmcm9tICcuLi9kc2wvZWxlbWVudF9pbnN0cnVjdGlvbl9tYXAnO1xuaW1wb3J0IHtBbmltYXRpb25TdHlsZU5vcm1hbGl6ZXJ9IGZyb20gJy4uL2RzbC9zdHlsZV9ub3JtYWxpemF0aW9uL2FuaW1hdGlvbl9zdHlsZV9ub3JtYWxpemVyJztcbmltcG9ydCB7bWlzc2luZ0V2ZW50LCBtaXNzaW5nVHJpZ2dlciwgdHJhbnNpdGlvbkZhaWxlZCwgdHJpZ2dlclRyYW5zaXRpb25zRmFpbGVkLCB1bnJlZ2lzdGVyZWRUcmlnZ2VyLCB1bnN1cHBvcnRlZFRyaWdnZXJFdmVudH0gZnJvbSAnLi4vZXJyb3JfaGVscGVycyc7XG5pbXBvcnQge2NvcHlPYmosIEVOVEVSX0NMQVNTTkFNRSwgZXJhc2VTdHlsZXMsIGl0ZXJhdG9yVG9BcnJheSwgTEVBVkVfQ0xBU1NOQU1FLCBOR19BTklNQVRJTkdfQ0xBU1NOQU1FLCBOR19BTklNQVRJTkdfU0VMRUNUT1IsIE5HX1RSSUdHRVJfQ0xBU1NOQU1FLCBOR19UUklHR0VSX1NFTEVDVE9SLCBzZXRTdHlsZXN9IGZyb20gJy4uL3V0aWwnO1xuXG5pbXBvcnQge0FuaW1hdGlvbkRyaXZlcn0gZnJvbSAnLi9hbmltYXRpb25fZHJpdmVyJztcbmltcG9ydCB7Z2V0T3JTZXRBc0luTWFwLCBsaXN0ZW5PblBsYXllciwgbWFrZUFuaW1hdGlvbkV2ZW50LCBub3JtYWxpemVLZXlmcmFtZXMsIG9wdGltaXplR3JvdXBQbGF5ZXJ9IGZyb20gJy4vc2hhcmVkJztcblxuY29uc3QgUVVFVUVEX0NMQVNTTkFNRSA9ICduZy1hbmltYXRlLXF1ZXVlZCc7XG5jb25zdCBRVUVVRURfU0VMRUNUT1IgPSAnLm5nLWFuaW1hdGUtcXVldWVkJztcbmNvbnN0IERJU0FCTEVEX0NMQVNTTkFNRSA9ICduZy1hbmltYXRlLWRpc2FibGVkJztcbmNvbnN0IERJU0FCTEVEX1NFTEVDVE9SID0gJy5uZy1hbmltYXRlLWRpc2FibGVkJztcbmNvbnN0IFNUQVJfQ0xBU1NOQU1FID0gJ25nLXN0YXItaW5zZXJ0ZWQnO1xuY29uc3QgU1RBUl9TRUxFQ1RPUiA9ICcubmctc3Rhci1pbnNlcnRlZCc7XG5cbmNvbnN0IEVNUFRZX1BMQVlFUl9BUlJBWTogVHJhbnNpdGlvbkFuaW1hdGlvblBsYXllcltdID0gW107XG5jb25zdCBOVUxMX1JFTU9WQUxfU1RBVEU6IEVsZW1lbnRBbmltYXRpb25TdGF0ZSA9IHtcbiAgbmFtZXNwYWNlSWQ6ICcnLFxuICBzZXRGb3JSZW1vdmFsOiBmYWxzZSxcbiAgc2V0Rm9yTW92ZTogZmFsc2UsXG4gIGhhc0FuaW1hdGlvbjogZmFsc2UsXG4gIHJlbW92ZWRCZWZvcmVRdWVyaWVkOiBmYWxzZVxufTtcbmNvbnN0IE5VTExfUkVNT1ZFRF9RVUVSSUVEX1NUQVRFOiBFbGVtZW50QW5pbWF0aW9uU3RhdGUgPSB7XG4gIG5hbWVzcGFjZUlkOiAnJyxcbiAgc2V0Rm9yTW92ZTogZmFsc2UsXG4gIHNldEZvclJlbW92YWw6IGZhbHNlLFxuICBoYXNBbmltYXRpb246IGZhbHNlLFxuICByZW1vdmVkQmVmb3JlUXVlcmllZDogdHJ1ZVxufTtcblxuaW50ZXJmYWNlIFRyaWdnZXJMaXN0ZW5lciB7XG4gIG5hbWU6IHN0cmluZztcbiAgcGhhc2U6IHN0cmluZztcbiAgY2FsbGJhY2s6IChldmVudDogYW55KSA9PiBhbnk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUXVldWVJbnN0cnVjdGlvbiB7XG4gIGVsZW1lbnQ6IGFueTtcbiAgdHJpZ2dlck5hbWU6IHN0cmluZztcbiAgZnJvbVN0YXRlOiBTdGF0ZVZhbHVlO1xuICB0b1N0YXRlOiBTdGF0ZVZhbHVlO1xuICB0cmFuc2l0aW9uOiBBbmltYXRpb25UcmFuc2l0aW9uRmFjdG9yeTtcbiAgcGxheWVyOiBUcmFuc2l0aW9uQW5pbWF0aW9uUGxheWVyO1xuICBpc0ZhbGxiYWNrVHJhbnNpdGlvbjogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNvbnN0IFJFTU9WQUxfRkxBRyA9ICdfX25nX3JlbW92ZWQnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEVsZW1lbnRBbmltYXRpb25TdGF0ZSB7XG4gIHNldEZvclJlbW92YWw6IGJvb2xlYW47XG4gIHNldEZvck1vdmU6IGJvb2xlYW47XG4gIGhhc0FuaW1hdGlvbjogYm9vbGVhbjtcbiAgbmFtZXNwYWNlSWQ6IHN0cmluZztcbiAgcmVtb3ZlZEJlZm9yZVF1ZXJpZWQ6IGJvb2xlYW47XG4gIHByZXZpb3VzVHJpZ2dlcnNWYWx1ZXM/OiBNYXA8c3RyaW5nLCBzdHJpbmc+O1xufVxuXG5leHBvcnQgY2xhc3MgU3RhdGVWYWx1ZSB7XG4gIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuICBwdWJsaWMgb3B0aW9uczogQW5pbWF0aW9uT3B0aW9ucztcblxuICBnZXQgcGFyYW1zKCk6IHtba2V5OiBzdHJpbmddOiBhbnl9IHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLnBhcmFtcyBhcyB7W2tleTogc3RyaW5nXTogYW55fTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGlucHV0OiBhbnksIHB1YmxpYyBuYW1lc3BhY2VJZDogc3RyaW5nID0gJycpIHtcbiAgICBjb25zdCBpc09iaiA9IGlucHV0ICYmIGlucHV0Lmhhc093blByb3BlcnR5KCd2YWx1ZScpO1xuICAgIGNvbnN0IHZhbHVlID0gaXNPYmogPyBpbnB1dFsndmFsdWUnXSA6IGlucHV0O1xuICAgIHRoaXMudmFsdWUgPSBub3JtYWxpemVUcmlnZ2VyVmFsdWUodmFsdWUpO1xuICAgIGlmIChpc09iaikge1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IGNvcHlPYmooaW5wdXQgYXMgYW55KTtcbiAgICAgIGRlbGV0ZSBvcHRpb25zWyd2YWx1ZSddO1xuICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyBhcyBBbmltYXRpb25PcHRpb25zO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9wdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLm9wdGlvbnMucGFyYW1zKSB7XG4gICAgICB0aGlzLm9wdGlvbnMucGFyYW1zID0ge307XG4gICAgfVxuICB9XG5cbiAgYWJzb3JiT3B0aW9ucyhvcHRpb25zOiBBbmltYXRpb25PcHRpb25zKSB7XG4gICAgY29uc3QgbmV3UGFyYW1zID0gb3B0aW9ucy5wYXJhbXM7XG4gICAgaWYgKG5ld1BhcmFtcykge1xuICAgICAgY29uc3Qgb2xkUGFyYW1zID0gdGhpcy5vcHRpb25zLnBhcmFtcyE7XG4gICAgICBPYmplY3Qua2V5cyhuZXdQYXJhbXMpLmZvckVhY2gocHJvcCA9PiB7XG4gICAgICAgIGlmIChvbGRQYXJhbXNbcHJvcF0gPT0gbnVsbCkge1xuICAgICAgICAgIG9sZFBhcmFtc1twcm9wXSA9IG5ld1BhcmFtc1twcm9wXTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBWT0lEX1ZBTFVFID0gJ3ZvaWQnO1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfU1RBVEVfVkFMVUUgPSBuZXcgU3RhdGVWYWx1ZShWT0lEX1ZBTFVFKTtcblxuZXhwb3J0IGNsYXNzIEFuaW1hdGlvblRyYW5zaXRpb25OYW1lc3BhY2Uge1xuICBwdWJsaWMgcGxheWVyczogVHJhbnNpdGlvbkFuaW1hdGlvblBsYXllcltdID0gW107XG5cbiAgcHJpdmF0ZSBfdHJpZ2dlcnM6IHtbdHJpZ2dlck5hbWU6IHN0cmluZ106IEFuaW1hdGlvblRyaWdnZXJ9ID0ge307XG4gIHByaXZhdGUgX3F1ZXVlOiBRdWV1ZUluc3RydWN0aW9uW10gPSBbXTtcblxuICBwcml2YXRlIF9lbGVtZW50TGlzdGVuZXJzID0gbmV3IE1hcDxhbnksIFRyaWdnZXJMaXN0ZW5lcltdPigpO1xuXG4gIHByaXZhdGUgX2hvc3RDbGFzc05hbWU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyBpZDogc3RyaW5nLCBwdWJsaWMgaG9zdEVsZW1lbnQ6IGFueSwgcHJpdmF0ZSBfZW5naW5lOiBUcmFuc2l0aW9uQW5pbWF0aW9uRW5naW5lKSB7XG4gICAgdGhpcy5faG9zdENsYXNzTmFtZSA9ICduZy10bnMtJyArIGlkO1xuICAgIGFkZENsYXNzKGhvc3RFbGVtZW50LCB0aGlzLl9ob3N0Q2xhc3NOYW1lKTtcbiAgfVxuXG4gIGxpc3RlbihlbGVtZW50OiBhbnksIG5hbWU6IHN0cmluZywgcGhhc2U6IHN0cmluZywgY2FsbGJhY2s6IChldmVudDogYW55KSA9PiBib29sZWFuKTogKCkgPT4gYW55IHtcbiAgICBpZiAoIXRoaXMuX3RyaWdnZXJzLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICB0aHJvdyBtaXNzaW5nVHJpZ2dlcihwaGFzZSwgbmFtZSk7XG4gICAgfVxuXG4gICAgaWYgKHBoYXNlID09IG51bGwgfHwgcGhhc2UubGVuZ3RoID09IDApIHtcbiAgICAgIHRocm93IG1pc3NpbmdFdmVudChuYW1lKTtcbiAgICB9XG5cbiAgICBpZiAoIWlzVHJpZ2dlckV2ZW50VmFsaWQocGhhc2UpKSB7XG4gICAgICB0aHJvdyB1bnN1cHBvcnRlZFRyaWdnZXJFdmVudChwaGFzZSwgbmFtZSk7XG4gICAgfVxuXG4gICAgY29uc3QgbGlzdGVuZXJzID0gZ2V0T3JTZXRBc0luTWFwKHRoaXMuX2VsZW1lbnRMaXN0ZW5lcnMsIGVsZW1lbnQsIFtdKTtcbiAgICBjb25zdCBkYXRhID0ge25hbWUsIHBoYXNlLCBjYWxsYmFja307XG4gICAgbGlzdGVuZXJzLnB1c2goZGF0YSk7XG5cbiAgICBjb25zdCB0cmlnZ2Vyc1dpdGhTdGF0ZXMgPSBnZXRPclNldEFzSW5NYXAodGhpcy5fZW5naW5lLnN0YXRlc0J5RWxlbWVudCwgZWxlbWVudCwge30pO1xuICAgIGlmICghdHJpZ2dlcnNXaXRoU3RhdGVzLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICBhZGRDbGFzcyhlbGVtZW50LCBOR19UUklHR0VSX0NMQVNTTkFNRSk7XG4gICAgICBhZGRDbGFzcyhlbGVtZW50LCBOR19UUklHR0VSX0NMQVNTTkFNRSArICctJyArIG5hbWUpO1xuICAgICAgdHJpZ2dlcnNXaXRoU3RhdGVzW25hbWVdID0gREVGQVVMVF9TVEFURV9WQUxVRTtcbiAgICB9XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgLy8gdGhlIGV2ZW50IGxpc3RlbmVyIGlzIHJlbW92ZWQgQUZURVIgdGhlIGZsdXNoIGhhcyBvY2N1cnJlZCBzdWNoXG4gICAgICAvLyB0aGF0IGxlYXZlIGFuaW1hdGlvbnMgY2FsbGJhY2tzIGNhbiBmaXJlIChvdGhlcndpc2UgaWYgdGhlIG5vZGVcbiAgICAgIC8vIGlzIHJlbW92ZWQgaW4gYmV0d2VlbiB0aGVuIHRoZSBsaXN0ZW5lcnMgd291bGQgYmUgZGVyZWdpc3RlcmVkKVxuICAgICAgdGhpcy5fZW5naW5lLmFmdGVyRmx1c2goKCkgPT4ge1xuICAgICAgICBjb25zdCBpbmRleCA9IGxpc3RlbmVycy5pbmRleE9mKGRhdGEpO1xuICAgICAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICAgIGxpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLl90cmlnZ2Vyc1tuYW1lXSkge1xuICAgICAgICAgIGRlbGV0ZSB0cmlnZ2Vyc1dpdGhTdGF0ZXNbbmFtZV07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG4gIH1cblxuICByZWdpc3RlcihuYW1lOiBzdHJpbmcsIGFzdDogQW5pbWF0aW9uVHJpZ2dlcik6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLl90cmlnZ2Vyc1tuYW1lXSkge1xuICAgICAgLy8gdGhyb3dcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdHJpZ2dlcnNbbmFtZV0gPSBhc3Q7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9nZXRUcmlnZ2VyKG5hbWU6IHN0cmluZykge1xuICAgIGNvbnN0IHRyaWdnZXIgPSB0aGlzLl90cmlnZ2Vyc1tuYW1lXTtcbiAgICBpZiAoIXRyaWdnZXIpIHtcbiAgICAgIHRocm93IHVucmVnaXN0ZXJlZFRyaWdnZXIobmFtZSk7XG4gICAgfVxuICAgIHJldHVybiB0cmlnZ2VyO1xuICB9XG5cbiAgdHJpZ2dlcihlbGVtZW50OiBhbnksIHRyaWdnZXJOYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnksIGRlZmF1bHRUb0ZhbGxiYWNrOiBib29sZWFuID0gdHJ1ZSk6XG4gICAgICBUcmFuc2l0aW9uQW5pbWF0aW9uUGxheWVyfHVuZGVmaW5lZCB7XG4gICAgY29uc3QgdHJpZ2dlciA9IHRoaXMuX2dldFRyaWdnZXIodHJpZ2dlck5hbWUpO1xuICAgIGNvbnN0IHBsYXllciA9IG5ldyBUcmFuc2l0aW9uQW5pbWF0aW9uUGxheWVyKHRoaXMuaWQsIHRyaWdnZXJOYW1lLCBlbGVtZW50KTtcblxuICAgIGxldCB0cmlnZ2Vyc1dpdGhTdGF0ZXMgPSB0aGlzLl9lbmdpbmUuc3RhdGVzQnlFbGVtZW50LmdldChlbGVtZW50KTtcbiAgICBpZiAoIXRyaWdnZXJzV2l0aFN0YXRlcykge1xuICAgICAgYWRkQ2xhc3MoZWxlbWVudCwgTkdfVFJJR0dFUl9DTEFTU05BTUUpO1xuICAgICAgYWRkQ2xhc3MoZWxlbWVudCwgTkdfVFJJR0dFUl9DTEFTU05BTUUgKyAnLScgKyB0cmlnZ2VyTmFtZSk7XG4gICAgICB0aGlzLl9lbmdpbmUuc3RhdGVzQnlFbGVtZW50LnNldChlbGVtZW50LCB0cmlnZ2Vyc1dpdGhTdGF0ZXMgPSB7fSk7XG4gICAgfVxuXG4gICAgbGV0IGZyb21TdGF0ZSA9IHRyaWdnZXJzV2l0aFN0YXRlc1t0cmlnZ2VyTmFtZV07XG4gICAgY29uc3QgdG9TdGF0ZSA9IG5ldyBTdGF0ZVZhbHVlKHZhbHVlLCB0aGlzLmlkKTtcblxuICAgIGNvbnN0IGlzT2JqID0gdmFsdWUgJiYgdmFsdWUuaGFzT3duUHJvcGVydHkoJ3ZhbHVlJyk7XG4gICAgaWYgKCFpc09iaiAmJiBmcm9tU3RhdGUpIHtcbiAgICAgIHRvU3RhdGUuYWJzb3JiT3B0aW9ucyhmcm9tU3RhdGUub3B0aW9ucyk7XG4gICAgfVxuXG4gICAgdHJpZ2dlcnNXaXRoU3RhdGVzW3RyaWdnZXJOYW1lXSA9IHRvU3RhdGU7XG5cbiAgICBpZiAoIWZyb21TdGF0ZSkge1xuICAgICAgZnJvbVN0YXRlID0gREVGQVVMVF9TVEFURV9WQUxVRTtcbiAgICB9XG5cbiAgICBjb25zdCBpc1JlbW92YWwgPSB0b1N0YXRlLnZhbHVlID09PSBWT0lEX1ZBTFVFO1xuXG4gICAgLy8gbm9ybWFsbHkgdGhpcyBpc24ndCByZWFjaGVkIGJ5IGhlcmUsIGhvd2V2ZXIsIGlmIGFuIG9iamVjdCBleHByZXNzaW9uXG4gICAgLy8gaXMgcGFzc2VkIGluIHRoZW4gaXQgbWF5IGJlIGEgbmV3IG9iamVjdCBlYWNoIHRpbWUuIENvbXBhcmluZyB0aGUgdmFsdWVcbiAgICAvLyBpcyBpbXBvcnRhbnQgc2luY2UgdGhhdCB3aWxsIHN0YXkgdGhlIHNhbWUgZGVzcGl0ZSB0aGVyZSBiZWluZyBhIG5ldyBvYmplY3QuXG4gICAgLy8gVGhlIHJlbW92YWwgYXJjIGhlcmUgaXMgc3BlY2lhbCBjYXNlZCBiZWNhdXNlIHRoZSBzYW1lIGVsZW1lbnQgaXMgdHJpZ2dlcmVkXG4gICAgLy8gdHdpY2UgaW4gdGhlIGV2ZW50IHRoYXQgaXQgY29udGFpbnMgYW5pbWF0aW9ucyBvbiB0aGUgb3V0ZXIvaW5uZXIgcG9ydGlvbnNcbiAgICAvLyBvZiB0aGUgaG9zdCBjb250YWluZXJcbiAgICBpZiAoIWlzUmVtb3ZhbCAmJiBmcm9tU3RhdGUudmFsdWUgPT09IHRvU3RhdGUudmFsdWUpIHtcbiAgICAgIC8vIHRoaXMgbWVhbnMgdGhhdCBkZXNwaXRlIHRoZSB2YWx1ZSBub3QgY2hhbmdpbmcsIHNvbWUgaW5uZXIgcGFyYW1zXG4gICAgICAvLyBoYXZlIGNoYW5nZWQgd2hpY2ggbWVhbnMgdGhhdCB0aGUgYW5pbWF0aW9uIGZpbmFsIHN0eWxlcyBuZWVkIHRvIGJlIGFwcGxpZWRcbiAgICAgIGlmICghb2JqRXF1YWxzKGZyb21TdGF0ZS5wYXJhbXMsIHRvU3RhdGUucGFyYW1zKSkge1xuICAgICAgICBjb25zdCBlcnJvcnM6IEVycm9yW10gPSBbXTtcbiAgICAgICAgY29uc3QgZnJvbVN0eWxlcyA9IHRyaWdnZXIubWF0Y2hTdHlsZXMoZnJvbVN0YXRlLnZhbHVlLCBmcm9tU3RhdGUucGFyYW1zLCBlcnJvcnMpO1xuICAgICAgICBjb25zdCB0b1N0eWxlcyA9IHRyaWdnZXIubWF0Y2hTdHlsZXModG9TdGF0ZS52YWx1ZSwgdG9TdGF0ZS5wYXJhbXMsIGVycm9ycyk7XG4gICAgICAgIGlmIChlcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgICAgdGhpcy5fZW5naW5lLnJlcG9ydEVycm9yKGVycm9ycyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fZW5naW5lLmFmdGVyRmx1c2goKCkgPT4ge1xuICAgICAgICAgICAgZXJhc2VTdHlsZXMoZWxlbWVudCwgZnJvbVN0eWxlcyk7XG4gICAgICAgICAgICBzZXRTdHlsZXMoZWxlbWVudCwgdG9TdHlsZXMpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcGxheWVyc09uRWxlbWVudDogVHJhbnNpdGlvbkFuaW1hdGlvblBsYXllcltdID1cbiAgICAgICAgZ2V0T3JTZXRBc0luTWFwKHRoaXMuX2VuZ2luZS5wbGF5ZXJzQnlFbGVtZW50LCBlbGVtZW50LCBbXSk7XG4gICAgcGxheWVyc09uRWxlbWVudC5mb3JFYWNoKHBsYXllciA9PiB7XG4gICAgICAvLyBvbmx5IHJlbW92ZSB0aGUgcGxheWVyIGlmIGl0IGlzIHF1ZXVlZCBvbiB0aGUgRVhBQ1Qgc2FtZSB0cmlnZ2VyL25hbWVzcGFjZVxuICAgICAgLy8gd2Ugb25seSBhbHNvIGRlYWwgd2l0aCBxdWV1ZWQgcGxheWVycyBoZXJlIGJlY2F1c2UgaWYgdGhlIGFuaW1hdGlvbiBoYXNcbiAgICAgIC8vIHN0YXJ0ZWQgdGhlbiB3ZSB3YW50IHRvIGtlZXAgdGhlIHBsYXllciBhbGl2ZSB1bnRpbCB0aGUgZmx1c2ggaGFwcGVuc1xuICAgICAgLy8gKHdoaWNoIGlzIHdoZXJlIHRoZSBwcmV2aW91c1BsYXllcnMgYXJlIHBhc3NlZCBpbnRvIHRoZSBuZXcgcGxheWVyKVxuICAgICAgaWYgKHBsYXllci5uYW1lc3BhY2VJZCA9PSB0aGlzLmlkICYmIHBsYXllci50cmlnZ2VyTmFtZSA9PSB0cmlnZ2VyTmFtZSAmJiBwbGF5ZXIucXVldWVkKSB7XG4gICAgICAgIHBsYXllci5kZXN0cm95KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBsZXQgdHJhbnNpdGlvbiA9XG4gICAgICAgIHRyaWdnZXIubWF0Y2hUcmFuc2l0aW9uKGZyb21TdGF0ZS52YWx1ZSwgdG9TdGF0ZS52YWx1ZSwgZWxlbWVudCwgdG9TdGF0ZS5wYXJhbXMpO1xuICAgIGxldCBpc0ZhbGxiYWNrVHJhbnNpdGlvbiA9IGZhbHNlO1xuICAgIGlmICghdHJhbnNpdGlvbikge1xuICAgICAgaWYgKCFkZWZhdWx0VG9GYWxsYmFjaykgcmV0dXJuO1xuICAgICAgdHJhbnNpdGlvbiA9IHRyaWdnZXIuZmFsbGJhY2tUcmFuc2l0aW9uO1xuICAgICAgaXNGYWxsYmFja1RyYW5zaXRpb24gPSB0cnVlO1xuICAgIH1cblxuICAgIHRoaXMuX2VuZ2luZS50b3RhbFF1ZXVlZFBsYXllcnMrKztcbiAgICB0aGlzLl9xdWV1ZS5wdXNoKFxuICAgICAgICB7ZWxlbWVudCwgdHJpZ2dlck5hbWUsIHRyYW5zaXRpb24sIGZyb21TdGF0ZSwgdG9TdGF0ZSwgcGxheWVyLCBpc0ZhbGxiYWNrVHJhbnNpdGlvbn0pO1xuXG4gICAgaWYgKCFpc0ZhbGxiYWNrVHJhbnNpdGlvbikge1xuICAgICAgYWRkQ2xhc3MoZWxlbWVudCwgUVVFVUVEX0NMQVNTTkFNRSk7XG4gICAgICBwbGF5ZXIub25TdGFydCgoKSA9PiB7XG4gICAgICAgIHJlbW92ZUNsYXNzKGVsZW1lbnQsIFFVRVVFRF9DTEFTU05BTUUpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcGxheWVyLm9uRG9uZSgoKSA9PiB7XG4gICAgICBsZXQgaW5kZXggPSB0aGlzLnBsYXllcnMuaW5kZXhPZihwbGF5ZXIpO1xuICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgdGhpcy5wbGF5ZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHBsYXllcnMgPSB0aGlzLl9lbmdpbmUucGxheWVyc0J5RWxlbWVudC5nZXQoZWxlbWVudCk7XG4gICAgICBpZiAocGxheWVycykge1xuICAgICAgICBsZXQgaW5kZXggPSBwbGF5ZXJzLmluZGV4T2YocGxheWVyKTtcbiAgICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgICBwbGF5ZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMucGxheWVycy5wdXNoKHBsYXllcik7XG4gICAgcGxheWVyc09uRWxlbWVudC5wdXNoKHBsYXllcik7XG5cbiAgICByZXR1cm4gcGxheWVyO1xuICB9XG5cbiAgZGVyZWdpc3RlcihuYW1lOiBzdHJpbmcpIHtcbiAgICBkZWxldGUgdGhpcy5fdHJpZ2dlcnNbbmFtZV07XG5cbiAgICB0aGlzLl9lbmdpbmUuc3RhdGVzQnlFbGVtZW50LmZvckVhY2goKHN0YXRlTWFwLCBlbGVtZW50KSA9PiB7XG4gICAgICBkZWxldGUgc3RhdGVNYXBbbmFtZV07XG4gICAgfSk7XG5cbiAgICB0aGlzLl9lbGVtZW50TGlzdGVuZXJzLmZvckVhY2goKGxpc3RlbmVycywgZWxlbWVudCkgPT4ge1xuICAgICAgdGhpcy5fZWxlbWVudExpc3RlbmVycy5zZXQoZWxlbWVudCwgbGlzdGVuZXJzLmZpbHRlcihlbnRyeSA9PiB7XG4gICAgICAgIHJldHVybiBlbnRyeS5uYW1lICE9IG5hbWU7XG4gICAgICB9KSk7XG4gICAgfSk7XG4gIH1cblxuICBjbGVhckVsZW1lbnRDYWNoZShlbGVtZW50OiBhbnkpIHtcbiAgICB0aGlzLl9lbmdpbmUuc3RhdGVzQnlFbGVtZW50LmRlbGV0ZShlbGVtZW50KTtcbiAgICB0aGlzLl9lbGVtZW50TGlzdGVuZXJzLmRlbGV0ZShlbGVtZW50KTtcbiAgICBjb25zdCBlbGVtZW50UGxheWVycyA9IHRoaXMuX2VuZ2luZS5wbGF5ZXJzQnlFbGVtZW50LmdldChlbGVtZW50KTtcbiAgICBpZiAoZWxlbWVudFBsYXllcnMpIHtcbiAgICAgIGVsZW1lbnRQbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHBsYXllci5kZXN0cm95KCkpO1xuICAgICAgdGhpcy5fZW5naW5lLnBsYXllcnNCeUVsZW1lbnQuZGVsZXRlKGVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3NpZ25hbFJlbW92YWxGb3JJbm5lclRyaWdnZXJzKHJvb3RFbGVtZW50OiBhbnksIGNvbnRleHQ6IGFueSkge1xuICAgIGNvbnN0IGVsZW1lbnRzID0gdGhpcy5fZW5naW5lLmRyaXZlci5xdWVyeShyb290RWxlbWVudCwgTkdfVFJJR0dFUl9TRUxFQ1RPUiwgdHJ1ZSk7XG5cbiAgICAvLyBlbXVsYXRlIGEgbGVhdmUgYW5pbWF0aW9uIGZvciBhbGwgaW5uZXIgbm9kZXMgd2l0aGluIHRoaXMgbm9kZS5cbiAgICAvLyBJZiB0aGVyZSBhcmUgbm8gYW5pbWF0aW9ucyBmb3VuZCBmb3IgYW55IG9mIHRoZSBub2RlcyB0aGVuIGNsZWFyIHRoZSBjYWNoZVxuICAgIC8vIGZvciB0aGUgZWxlbWVudC5cbiAgICBlbGVtZW50cy5mb3JFYWNoKGVsbSA9PiB7XG4gICAgICAvLyB0aGlzIG1lYW5zIHRoYXQgYW4gaW5uZXIgcmVtb3ZlKCkgb3BlcmF0aW9uIGhhcyBhbHJlYWR5IGtpY2tlZCBvZmZcbiAgICAgIC8vIHRoZSBhbmltYXRpb24gb24gdGhpcyBlbGVtZW50Li4uXG4gICAgICBpZiAoZWxtW1JFTU9WQUxfRkxBR10pIHJldHVybjtcblxuICAgICAgY29uc3QgbmFtZXNwYWNlcyA9IHRoaXMuX2VuZ2luZS5mZXRjaE5hbWVzcGFjZXNCeUVsZW1lbnQoZWxtKTtcbiAgICAgIGlmIChuYW1lc3BhY2VzLnNpemUpIHtcbiAgICAgICAgbmFtZXNwYWNlcy5mb3JFYWNoKG5zID0+IG5zLnRyaWdnZXJMZWF2ZUFuaW1hdGlvbihlbG0sIGNvbnRleHQsIGZhbHNlLCB0cnVlKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNsZWFyRWxlbWVudENhY2hlKGVsbSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBJZiB0aGUgY2hpbGQgZWxlbWVudHMgd2VyZSByZW1vdmVkIGFsb25nIHdpdGggdGhlIHBhcmVudCwgdGhlaXIgYW5pbWF0aW9ucyBtaWdodCBub3RcbiAgICAvLyBoYXZlIGNvbXBsZXRlZC4gQ2xlYXIgYWxsIHRoZSBlbGVtZW50cyBmcm9tIHRoZSBjYWNoZSBzbyB3ZSBkb24ndCBlbmQgdXAgd2l0aCBhIG1lbW9yeSBsZWFrLlxuICAgIHRoaXMuX2VuZ2luZS5hZnRlckZsdXNoQW5pbWF0aW9uc0RvbmUoXG4gICAgICAgICgpID0+IGVsZW1lbnRzLmZvckVhY2goZWxtID0+IHRoaXMuY2xlYXJFbGVtZW50Q2FjaGUoZWxtKSkpO1xuICB9XG5cbiAgdHJpZ2dlckxlYXZlQW5pbWF0aW9uKFxuICAgICAgZWxlbWVudDogYW55LCBjb250ZXh0OiBhbnksIGRlc3Ryb3lBZnRlckNvbXBsZXRlPzogYm9vbGVhbixcbiAgICAgIGRlZmF1bHRUb0ZhbGxiYWNrPzogYm9vbGVhbik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHRyaWdnZXJTdGF0ZXMgPSB0aGlzLl9lbmdpbmUuc3RhdGVzQnlFbGVtZW50LmdldChlbGVtZW50KTtcbiAgICBjb25zdCBwcmV2aW91c1RyaWdnZXJzVmFsdWVzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbiAgICBpZiAodHJpZ2dlclN0YXRlcykge1xuICAgICAgY29uc3QgcGxheWVyczogVHJhbnNpdGlvbkFuaW1hdGlvblBsYXllcltdID0gW107XG4gICAgICBPYmplY3Qua2V5cyh0cmlnZ2VyU3RhdGVzKS5mb3JFYWNoKHRyaWdnZXJOYW1lID0+IHtcbiAgICAgICAgcHJldmlvdXNUcmlnZ2Vyc1ZhbHVlcy5zZXQodHJpZ2dlck5hbWUsIHRyaWdnZXJTdGF0ZXNbdHJpZ2dlck5hbWVdLnZhbHVlKTtcbiAgICAgICAgLy8gdGhpcyBjaGVjayBpcyBoZXJlIGluIHRoZSBldmVudCB0aGF0IGFuIGVsZW1lbnQgaXMgcmVtb3ZlZFxuICAgICAgICAvLyB0d2ljZSAoYm90aCBvbiB0aGUgaG9zdCBsZXZlbCBhbmQgdGhlIGNvbXBvbmVudCBsZXZlbClcbiAgICAgICAgaWYgKHRoaXMuX3RyaWdnZXJzW3RyaWdnZXJOYW1lXSkge1xuICAgICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMudHJpZ2dlcihlbGVtZW50LCB0cmlnZ2VyTmFtZSwgVk9JRF9WQUxVRSwgZGVmYXVsdFRvRmFsbGJhY2spO1xuICAgICAgICAgIGlmIChwbGF5ZXIpIHtcbiAgICAgICAgICAgIHBsYXllcnMucHVzaChwbGF5ZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmIChwbGF5ZXJzLmxlbmd0aCkge1xuICAgICAgICB0aGlzLl9lbmdpbmUubWFya0VsZW1lbnRBc1JlbW92ZWQodGhpcy5pZCwgZWxlbWVudCwgdHJ1ZSwgY29udGV4dCwgcHJldmlvdXNUcmlnZ2Vyc1ZhbHVlcyk7XG4gICAgICAgIGlmIChkZXN0cm95QWZ0ZXJDb21wbGV0ZSkge1xuICAgICAgICAgIG9wdGltaXplR3JvdXBQbGF5ZXIocGxheWVycykub25Eb25lKCgpID0+IHRoaXMuX2VuZ2luZS5wcm9jZXNzTGVhdmVOb2RlKGVsZW1lbnQpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJlcGFyZUxlYXZlQW5pbWF0aW9uTGlzdGVuZXJzKGVsZW1lbnQ6IGFueSkge1xuICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuX2VsZW1lbnRMaXN0ZW5lcnMuZ2V0KGVsZW1lbnQpO1xuICAgIGNvbnN0IGVsZW1lbnRTdGF0ZXMgPSB0aGlzLl9lbmdpbmUuc3RhdGVzQnlFbGVtZW50LmdldChlbGVtZW50KTtcblxuICAgIC8vIGlmIHRoaXMgc3RhdGVtZW50IGZhaWxzIHRoZW4gaXQgbWVhbnMgdGhhdCB0aGUgZWxlbWVudCB3YXMgcGlja2VkIHVwXG4gICAgLy8gYnkgYW4gZWFybGllciBmbHVzaCAob3IgdGhlcmUgYXJlIG5vIGxpc3RlbmVycyBhdCBhbGwgdG8gdHJhY2sgdGhlIGxlYXZlKS5cbiAgICBpZiAobGlzdGVuZXJzICYmIGVsZW1lbnRTdGF0ZXMpIHtcbiAgICAgIGNvbnN0IHZpc2l0ZWRUcmlnZ2VycyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgICAgbGlzdGVuZXJzLmZvckVhY2gobGlzdGVuZXIgPT4ge1xuICAgICAgICBjb25zdCB0cmlnZ2VyTmFtZSA9IGxpc3RlbmVyLm5hbWU7XG4gICAgICAgIGlmICh2aXNpdGVkVHJpZ2dlcnMuaGFzKHRyaWdnZXJOYW1lKSkgcmV0dXJuO1xuICAgICAgICB2aXNpdGVkVHJpZ2dlcnMuYWRkKHRyaWdnZXJOYW1lKTtcblxuICAgICAgICBjb25zdCB0cmlnZ2VyID0gdGhpcy5fdHJpZ2dlcnNbdHJpZ2dlck5hbWVdO1xuICAgICAgICBjb25zdCB0cmFuc2l0aW9uID0gdHJpZ2dlci5mYWxsYmFja1RyYW5zaXRpb247XG4gICAgICAgIGNvbnN0IGZyb21TdGF0ZSA9IGVsZW1lbnRTdGF0ZXNbdHJpZ2dlck5hbWVdIHx8IERFRkFVTFRfU1RBVEVfVkFMVUU7XG4gICAgICAgIGNvbnN0IHRvU3RhdGUgPSBuZXcgU3RhdGVWYWx1ZShWT0lEX1ZBTFVFKTtcbiAgICAgICAgY29uc3QgcGxheWVyID0gbmV3IFRyYW5zaXRpb25BbmltYXRpb25QbGF5ZXIodGhpcy5pZCwgdHJpZ2dlck5hbWUsIGVsZW1lbnQpO1xuXG4gICAgICAgIHRoaXMuX2VuZ2luZS50b3RhbFF1ZXVlZFBsYXllcnMrKztcbiAgICAgICAgdGhpcy5fcXVldWUucHVzaCh7XG4gICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICB0cmlnZ2VyTmFtZSxcbiAgICAgICAgICB0cmFuc2l0aW9uLFxuICAgICAgICAgIGZyb21TdGF0ZSxcbiAgICAgICAgICB0b1N0YXRlLFxuICAgICAgICAgIHBsYXllcixcbiAgICAgICAgICBpc0ZhbGxiYWNrVHJhbnNpdGlvbjogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZU5vZGUoZWxlbWVudDogYW55LCBjb250ZXh0OiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBlbmdpbmUgPSB0aGlzLl9lbmdpbmU7XG4gICAgaWYgKGVsZW1lbnQuY2hpbGRFbGVtZW50Q291bnQpIHtcbiAgICAgIHRoaXMuX3NpZ25hbFJlbW92YWxGb3JJbm5lclRyaWdnZXJzKGVsZW1lbnQsIGNvbnRleHQpO1xuICAgIH1cblxuICAgIC8vIHRoaXMgbWVhbnMgdGhhdCBhICogPT4gVk9JRCBhbmltYXRpb24gd2FzIGRldGVjdGVkIGFuZCBraWNrZWQgb2ZmXG4gICAgaWYgKHRoaXMudHJpZ2dlckxlYXZlQW5pbWF0aW9uKGVsZW1lbnQsIGNvbnRleHQsIHRydWUpKSByZXR1cm47XG5cbiAgICAvLyBmaW5kIHRoZSBwbGF5ZXIgdGhhdCBpcyBhbmltYXRpbmcgYW5kIG1ha2Ugc3VyZSB0aGF0IHRoZVxuICAgIC8vIHJlbW92YWwgaXMgZGVsYXllZCB1bnRpbCB0aGF0IHBsYXllciBoYXMgY29tcGxldGVkXG4gICAgbGV0IGNvbnRhaW5zUG90ZW50aWFsUGFyZW50VHJhbnNpdGlvbiA9IGZhbHNlO1xuICAgIGlmIChlbmdpbmUudG90YWxBbmltYXRpb25zKSB7XG4gICAgICBjb25zdCBjdXJyZW50UGxheWVycyA9XG4gICAgICAgICAgZW5naW5lLnBsYXllcnMubGVuZ3RoID8gZW5naW5lLnBsYXllcnNCeVF1ZXJpZWRFbGVtZW50LmdldChlbGVtZW50KSA6IFtdO1xuXG4gICAgICAvLyB3aGVuIHRoaXMgYGlmIHN0YXRlbWVudGAgZG9lcyBub3QgY29udGludWUgZm9yd2FyZCBpdCBtZWFucyB0aGF0XG4gICAgICAvLyBhIHByZXZpb3VzIGFuaW1hdGlvbiBxdWVyeSBoYXMgc2VsZWN0ZWQgdGhlIGN1cnJlbnQgZWxlbWVudCBhbmRcbiAgICAgIC8vIGlzIGFuaW1hdGluZyBpdC4gSW4gdGhpcyBzaXR1YXRpb24gd2FudCB0byBjb250aW51ZSBmb3J3YXJkcyBhbmRcbiAgICAgIC8vIGFsbG93IHRoZSBlbGVtZW50IHRvIGJlIHF1ZXVlZCB1cCBmb3IgYW5pbWF0aW9uIGxhdGVyLlxuICAgICAgaWYgKGN1cnJlbnRQbGF5ZXJzICYmIGN1cnJlbnRQbGF5ZXJzLmxlbmd0aCkge1xuICAgICAgICBjb250YWluc1BvdGVudGlhbFBhcmVudFRyYW5zaXRpb24gPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHBhcmVudCA9IGVsZW1lbnQ7XG4gICAgICAgIHdoaWxlIChwYXJlbnQgPSBwYXJlbnQucGFyZW50Tm9kZSkge1xuICAgICAgICAgIGNvbnN0IHRyaWdnZXJzID0gZW5naW5lLnN0YXRlc0J5RWxlbWVudC5nZXQocGFyZW50KTtcbiAgICAgICAgICBpZiAodHJpZ2dlcnMpIHtcbiAgICAgICAgICAgIGNvbnRhaW5zUG90ZW50aWFsUGFyZW50VHJhbnNpdGlvbiA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBhdCB0aGlzIHN0YWdlIHdlIGtub3cgdGhhdCB0aGUgZWxlbWVudCB3aWxsIGVpdGhlciBnZXQgcmVtb3ZlZFxuICAgIC8vIGR1cmluZyBmbHVzaCBvciB3aWxsIGJlIHBpY2tlZCB1cCBieSBhIHBhcmVudCBxdWVyeS4gRWl0aGVyIHdheVxuICAgIC8vIHdlIG5lZWQgdG8gZmlyZSB0aGUgbGlzdGVuZXJzIGZvciB0aGlzIGVsZW1lbnQgd2hlbiBpdCBET0VTIGdldFxuICAgIC8vIHJlbW92ZWQgKG9uY2UgdGhlIHF1ZXJ5IHBhcmVudCBhbmltYXRpb24gaXMgZG9uZSBvciBhZnRlciBmbHVzaClcbiAgICB0aGlzLnByZXBhcmVMZWF2ZUFuaW1hdGlvbkxpc3RlbmVycyhlbGVtZW50KTtcblxuICAgIC8vIHdoZXRoZXIgb3Igbm90IGEgcGFyZW50IGhhcyBhbiBhbmltYXRpb24gd2UgbmVlZCB0byBkZWxheSB0aGUgZGVmZXJyYWwgb2YgdGhlIGxlYXZlXG4gICAgLy8gb3BlcmF0aW9uIHVudGlsIHdlIGhhdmUgbW9yZSBpbmZvcm1hdGlvbiAod2hpY2ggd2UgZG8gYWZ0ZXIgZmx1c2goKSBoYXMgYmVlbiBjYWxsZWQpXG4gICAgaWYgKGNvbnRhaW5zUG90ZW50aWFsUGFyZW50VHJhbnNpdGlvbikge1xuICAgICAgZW5naW5lLm1hcmtFbGVtZW50QXNSZW1vdmVkKHRoaXMuaWQsIGVsZW1lbnQsIGZhbHNlLCBjb250ZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcmVtb3ZhbEZsYWcgPSBlbGVtZW50W1JFTU9WQUxfRkxBR107XG4gICAgICBpZiAoIXJlbW92YWxGbGFnIHx8IHJlbW92YWxGbGFnID09PSBOVUxMX1JFTU9WQUxfU1RBVEUpIHtcbiAgICAgICAgLy8gd2UgZG8gdGhpcyBhZnRlciB0aGUgZmx1c2ggaGFzIG9jY3VycmVkIHN1Y2hcbiAgICAgICAgLy8gdGhhdCB0aGUgY2FsbGJhY2tzIGNhbiBiZSBmaXJlZFxuICAgICAgICBlbmdpbmUuYWZ0ZXJGbHVzaCgoKSA9PiB0aGlzLmNsZWFyRWxlbWVudENhY2hlKGVsZW1lbnQpKTtcbiAgICAgICAgZW5naW5lLmRlc3Ryb3lJbm5lckFuaW1hdGlvbnMoZWxlbWVudCk7XG4gICAgICAgIGVuZ2luZS5fb25SZW1vdmFsQ29tcGxldGUoZWxlbWVudCwgY29udGV4dCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaW5zZXJ0Tm9kZShlbGVtZW50OiBhbnksIHBhcmVudDogYW55KTogdm9pZCB7XG4gICAgYWRkQ2xhc3MoZWxlbWVudCwgdGhpcy5faG9zdENsYXNzTmFtZSk7XG4gIH1cblxuICBkcmFpblF1ZXVlZFRyYW5zaXRpb25zKG1pY3JvdGFza0lkOiBudW1iZXIpOiBRdWV1ZUluc3RydWN0aW9uW10ge1xuICAgIGNvbnN0IGluc3RydWN0aW9uczogUXVldWVJbnN0cnVjdGlvbltdID0gW107XG4gICAgdGhpcy5fcXVldWUuZm9yRWFjaChlbnRyeSA9PiB7XG4gICAgICBjb25zdCBwbGF5ZXIgPSBlbnRyeS5wbGF5ZXI7XG4gICAgICBpZiAocGxheWVyLmRlc3Ryb3llZCkgcmV0dXJuO1xuXG4gICAgICBjb25zdCBlbGVtZW50ID0gZW50cnkuZWxlbWVudDtcbiAgICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuX2VsZW1lbnRMaXN0ZW5lcnMuZ2V0KGVsZW1lbnQpO1xuICAgICAgaWYgKGxpc3RlbmVycykge1xuICAgICAgICBsaXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXI6IFRyaWdnZXJMaXN0ZW5lcikgPT4ge1xuICAgICAgICAgIGlmIChsaXN0ZW5lci5uYW1lID09IGVudHJ5LnRyaWdnZXJOYW1lKSB7XG4gICAgICAgICAgICBjb25zdCBiYXNlRXZlbnQgPSBtYWtlQW5pbWF0aW9uRXZlbnQoXG4gICAgICAgICAgICAgICAgZWxlbWVudCwgZW50cnkudHJpZ2dlck5hbWUsIGVudHJ5LmZyb21TdGF0ZS52YWx1ZSwgZW50cnkudG9TdGF0ZS52YWx1ZSk7XG4gICAgICAgICAgICAoYmFzZUV2ZW50IGFzIGFueSlbJ19kYXRhJ10gPSBtaWNyb3Rhc2tJZDtcbiAgICAgICAgICAgIGxpc3Rlbk9uUGxheWVyKGVudHJ5LnBsYXllciwgbGlzdGVuZXIucGhhc2UsIGJhc2VFdmVudCwgbGlzdGVuZXIuY2FsbGJhY2spO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwbGF5ZXIubWFya2VkRm9yRGVzdHJveSkge1xuICAgICAgICB0aGlzLl9lbmdpbmUuYWZ0ZXJGbHVzaCgoKSA9PiB7XG4gICAgICAgICAgLy8gbm93IHdlIGNhbiBkZXN0cm95IHRoZSBlbGVtZW50IHByb3Blcmx5IHNpbmNlIHRoZSBldmVudCBsaXN0ZW5lcnMgaGF2ZVxuICAgICAgICAgIC8vIGJlZW4gYm91bmQgdG8gdGhlIHBsYXllclxuICAgICAgICAgIHBsYXllci5kZXN0cm95KCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goZW50cnkpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5fcXVldWUgPSBbXTtcblxuICAgIHJldHVybiBpbnN0cnVjdGlvbnMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgLy8gaWYgZGVwQ291bnQgPT0gMCB0aGVtIG1vdmUgdG8gZnJvbnRcbiAgICAgIC8vIG90aGVyd2lzZSBpZiBhIGNvbnRhaW5zIGIgdGhlbiBtb3ZlIGJhY2tcbiAgICAgIGNvbnN0IGQwID0gYS50cmFuc2l0aW9uLmFzdC5kZXBDb3VudDtcbiAgICAgIGNvbnN0IGQxID0gYi50cmFuc2l0aW9uLmFzdC5kZXBDb3VudDtcbiAgICAgIGlmIChkMCA9PSAwIHx8IGQxID09IDApIHtcbiAgICAgICAgcmV0dXJuIGQwIC0gZDE7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5fZW5naW5lLmRyaXZlci5jb250YWluc0VsZW1lbnQoYS5lbGVtZW50LCBiLmVsZW1lbnQpID8gMSA6IC0xO1xuICAgIH0pO1xuICB9XG5cbiAgZGVzdHJveShjb250ZXh0OiBhbnkpIHtcbiAgICB0aGlzLnBsYXllcnMuZm9yRWFjaChwID0+IHAuZGVzdHJveSgpKTtcbiAgICB0aGlzLl9zaWduYWxSZW1vdmFsRm9ySW5uZXJUcmlnZ2Vycyh0aGlzLmhvc3RFbGVtZW50LCBjb250ZXh0KTtcbiAgfVxuXG4gIGVsZW1lbnRDb250YWluc0RhdGEoZWxlbWVudDogYW55KTogYm9vbGVhbiB7XG4gICAgbGV0IGNvbnRhaW5zRGF0YSA9IGZhbHNlO1xuICAgIGlmICh0aGlzLl9lbGVtZW50TGlzdGVuZXJzLmhhcyhlbGVtZW50KSkgY29udGFpbnNEYXRhID0gdHJ1ZTtcbiAgICBjb250YWluc0RhdGEgPVxuICAgICAgICAodGhpcy5fcXVldWUuZmluZChlbnRyeSA9PiBlbnRyeS5lbGVtZW50ID09PSBlbGVtZW50KSA/IHRydWUgOiBmYWxzZSkgfHwgY29udGFpbnNEYXRhO1xuICAgIHJldHVybiBjb250YWluc0RhdGE7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBRdWV1ZWRUcmFuc2l0aW9uIHtcbiAgZWxlbWVudDogYW55O1xuICBpbnN0cnVjdGlvbjogQW5pbWF0aW9uVHJhbnNpdGlvbkluc3RydWN0aW9uO1xuICBwbGF5ZXI6IFRyYW5zaXRpb25BbmltYXRpb25QbGF5ZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2l0aW9uQW5pbWF0aW9uRW5naW5lIHtcbiAgcHVibGljIHBsYXllcnM6IFRyYW5zaXRpb25BbmltYXRpb25QbGF5ZXJbXSA9IFtdO1xuICBwdWJsaWMgbmV3SG9zdEVsZW1lbnRzID0gbmV3IE1hcDxhbnksIEFuaW1hdGlvblRyYW5zaXRpb25OYW1lc3BhY2U+KCk7XG4gIHB1YmxpYyBwbGF5ZXJzQnlFbGVtZW50ID0gbmV3IE1hcDxhbnksIFRyYW5zaXRpb25BbmltYXRpb25QbGF5ZXJbXT4oKTtcbiAgcHVibGljIHBsYXllcnNCeVF1ZXJpZWRFbGVtZW50ID0gbmV3IE1hcDxhbnksIFRyYW5zaXRpb25BbmltYXRpb25QbGF5ZXJbXT4oKTtcbiAgcHVibGljIHN0YXRlc0J5RWxlbWVudCA9IG5ldyBNYXA8YW55LCB7W3RyaWdnZXJOYW1lOiBzdHJpbmddOiBTdGF0ZVZhbHVlfT4oKTtcbiAgcHVibGljIGRpc2FibGVkTm9kZXMgPSBuZXcgU2V0PGFueT4oKTtcblxuICBwdWJsaWMgdG90YWxBbmltYXRpb25zID0gMDtcbiAgcHVibGljIHRvdGFsUXVldWVkUGxheWVycyA9IDA7XG5cbiAgcHJpdmF0ZSBfbmFtZXNwYWNlTG9va3VwOiB7W2lkOiBzdHJpbmddOiBBbmltYXRpb25UcmFuc2l0aW9uTmFtZXNwYWNlfSA9IHt9O1xuICBwcml2YXRlIF9uYW1lc3BhY2VMaXN0OiBBbmltYXRpb25UcmFuc2l0aW9uTmFtZXNwYWNlW10gPSBbXTtcbiAgcHJpdmF0ZSBfZmx1c2hGbnM6ICgoKSA9PiBhbnkpW10gPSBbXTtcbiAgcHJpdmF0ZSBfd2hlblF1aWV0Rm5zOiAoKCkgPT4gYW55KVtdID0gW107XG5cbiAgcHVibGljIG5hbWVzcGFjZXNCeUhvc3RFbGVtZW50ID0gbmV3IE1hcDxhbnksIEFuaW1hdGlvblRyYW5zaXRpb25OYW1lc3BhY2U+KCk7XG4gIHB1YmxpYyBjb2xsZWN0ZWRFbnRlckVsZW1lbnRzOiBhbnlbXSA9IFtdO1xuICBwdWJsaWMgY29sbGVjdGVkTGVhdmVFbGVtZW50czogYW55W10gPSBbXTtcblxuICAvLyB0aGlzIG1ldGhvZCBpcyBkZXNpZ25lZCB0byBiZSBvdmVycmlkZGVuIGJ5IHRoZSBjb2RlIHRoYXQgdXNlcyB0aGlzIGVuZ2luZVxuICBwdWJsaWMgb25SZW1vdmFsQ29tcGxldGUgPSAoZWxlbWVudDogYW55LCBjb250ZXh0OiBhbnkpID0+IHt9O1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX29uUmVtb3ZhbENvbXBsZXRlKGVsZW1lbnQ6IGFueSwgY29udGV4dDogYW55KSB7XG4gICAgdGhpcy5vblJlbW92YWxDb21wbGV0ZShlbGVtZW50LCBjb250ZXh0KTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHVibGljIGJvZHlOb2RlOiBhbnksIHB1YmxpYyBkcml2ZXI6IEFuaW1hdGlvbkRyaXZlcixcbiAgICAgIHByaXZhdGUgX25vcm1hbGl6ZXI6IEFuaW1hdGlvblN0eWxlTm9ybWFsaXplcikge31cblxuICBnZXQgcXVldWVkUGxheWVycygpOiBUcmFuc2l0aW9uQW5pbWF0aW9uUGxheWVyW10ge1xuICAgIGNvbnN0IHBsYXllcnM6IFRyYW5zaXRpb25BbmltYXRpb25QbGF5ZXJbXSA9IFtdO1xuICAgIHRoaXMuX25hbWVzcGFjZUxpc3QuZm9yRWFjaChucyA9PiB7XG4gICAgICBucy5wbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHtcbiAgICAgICAgaWYgKHBsYXllci5xdWV1ZWQpIHtcbiAgICAgICAgICBwbGF5ZXJzLnB1c2gocGxheWVyKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHBsYXllcnM7XG4gIH1cblxuICBjcmVhdGVOYW1lc3BhY2UobmFtZXNwYWNlSWQ6IHN0cmluZywgaG9zdEVsZW1lbnQ6IGFueSkge1xuICAgIGNvbnN0IG5zID0gbmV3IEFuaW1hdGlvblRyYW5zaXRpb25OYW1lc3BhY2UobmFtZXNwYWNlSWQsIGhvc3RFbGVtZW50LCB0aGlzKTtcbiAgICBpZiAodGhpcy5ib2R5Tm9kZSAmJiB0aGlzLmRyaXZlci5jb250YWluc0VsZW1lbnQodGhpcy5ib2R5Tm9kZSwgaG9zdEVsZW1lbnQpKSB7XG4gICAgICB0aGlzLl9iYWxhbmNlTmFtZXNwYWNlTGlzdChucywgaG9zdEVsZW1lbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBkZWZlciB0aGlzIGxhdGVyIHVudGlsIGZsdXNoIGR1cmluZyB3aGVuIHRoZSBob3N0IGVsZW1lbnQgaGFzXG4gICAgICAvLyBiZWVuIGluc2VydGVkIHNvIHRoYXQgd2Uga25vdyBleGFjdGx5IHdoZXJlIHRvIHBsYWNlIGl0IGluXG4gICAgICAvLyB0aGUgbmFtZXNwYWNlIGxpc3RcbiAgICAgIHRoaXMubmV3SG9zdEVsZW1lbnRzLnNldChob3N0RWxlbWVudCwgbnMpO1xuXG4gICAgICAvLyBnaXZlbiB0aGF0IHRoaXMgaG9zdCBlbGVtZW50IGlzIGEgcGFydCBvZiB0aGUgYW5pbWF0aW9uIGNvZGUsIGl0XG4gICAgICAvLyBtYXkgb3IgbWF5IG5vdCBiZSBpbnNlcnRlZCBieSBhIHBhcmVudCBub2RlIHRoYXQgaXMgb2YgYW5cbiAgICAgIC8vIGFuaW1hdGlvbiByZW5kZXJlciB0eXBlLiBJZiB0aGlzIGhhcHBlbnMgdGhlbiB3ZSBjYW4gc3RpbGwgaGF2ZVxuICAgICAgLy8gYWNjZXNzIHRvIHRoaXMgaXRlbSB3aGVuIHdlIHF1ZXJ5IGZvciA6ZW50ZXIgbm9kZXMuIElmIHRoZSBwYXJlbnRcbiAgICAgIC8vIGlzIGEgcmVuZGVyZXIgdGhlbiB0aGUgc2V0IGRhdGEtc3RydWN0dXJlIHdpbGwgbm9ybWFsaXplIHRoZSBlbnRyeVxuICAgICAgdGhpcy5jb2xsZWN0RW50ZXJFbGVtZW50KGhvc3RFbGVtZW50KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX25hbWVzcGFjZUxvb2t1cFtuYW1lc3BhY2VJZF0gPSBucztcbiAgfVxuXG4gIHByaXZhdGUgX2JhbGFuY2VOYW1lc3BhY2VMaXN0KG5zOiBBbmltYXRpb25UcmFuc2l0aW9uTmFtZXNwYWNlLCBob3N0RWxlbWVudDogYW55KSB7XG4gICAgY29uc3QgbmFtZXNwYWNlTGlzdCA9IHRoaXMuX25hbWVzcGFjZUxpc3Q7XG4gICAgY29uc3QgbmFtZXNwYWNlc0J5SG9zdEVsZW1lbnQgPSB0aGlzLm5hbWVzcGFjZXNCeUhvc3RFbGVtZW50O1xuICAgIGNvbnN0IGxpbWl0ID0gbmFtZXNwYWNlTGlzdC5sZW5ndGggLSAxO1xuICAgIGlmIChsaW1pdCA+PSAwKSB7XG4gICAgICBsZXQgZm91bmQgPSBmYWxzZTtcbiAgICAgIGlmICh0aGlzLmRyaXZlci5nZXRQYXJlbnRFbGVtZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gRmFzdCBwYXRoIGZvciB3aGVuIHRoZSBkcml2ZXIgaW1wbGVtZW50cyBgZ2V0UGFyZW50RWxlbWVudGAsIHdoaWNoIGFsbG93cyB1cyB0byBmaW5kIHRoZVxuICAgICAgICAvLyBjbG9zZXN0IGFuY2VzdG9yIHdpdGggYW4gZXhpc3RpbmcgbmFtZXNwYWNlIHRoYXQgd2UgY2FuIHRoZW4gaW5zZXJ0IGBuc2AgYWZ0ZXIsIHdpdGhvdXRcbiAgICAgICAgLy8gaGF2aW5nIHRvIGluc3BlY3QgYWxsIGV4aXN0aW5nIG5hbWVzcGFjZXMuXG4gICAgICAgIGxldCBhbmNlc3RvciA9IHRoaXMuZHJpdmVyLmdldFBhcmVudEVsZW1lbnQoaG9zdEVsZW1lbnQpO1xuICAgICAgICB3aGlsZSAoYW5jZXN0b3IpIHtcbiAgICAgICAgICBjb25zdCBhbmNlc3Rvck5zID0gbmFtZXNwYWNlc0J5SG9zdEVsZW1lbnQuZ2V0KGFuY2VzdG9yKTtcbiAgICAgICAgICBpZiAoYW5jZXN0b3JOcykge1xuICAgICAgICAgICAgLy8gQW4gYW5pbWF0aW9uIG5hbWVzcGFjZSBoYXMgYmVlbiByZWdpc3RlcmVkIGZvciB0aGlzIGFuY2VzdG9yLCBzbyB3ZSBpbnNlcnQgYG5zYFxuICAgICAgICAgICAgLy8gcmlnaHQgYWZ0ZXIgaXQgdG8gZXN0YWJsaXNoIHRvcC1kb3duIG9yZGVyaW5nIG9mIGFuaW1hdGlvbiBuYW1lc3BhY2VzLlxuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBuYW1lc3BhY2VMaXN0LmluZGV4T2YoYW5jZXN0b3JOcyk7XG4gICAgICAgICAgICBuYW1lc3BhY2VMaXN0LnNwbGljZShpbmRleCArIDEsIDAsIG5zKTtcbiAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBhbmNlc3RvciA9IHRoaXMuZHJpdmVyLmdldFBhcmVudEVsZW1lbnQoYW5jZXN0b3IpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBTbG93IHBhdGggZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IGlmIHRoZSBkcml2ZXIgZG9lcyBub3QgaW1wbGVtZW50XG4gICAgICAgIC8vIGBnZXRQYXJlbnRFbGVtZW50YCwgdG8gYmUgcmVtb3ZlZCBvbmNlIGBnZXRQYXJlbnRFbGVtZW50YCBpcyBhIHJlcXVpcmVkIG1ldGhvZC5cbiAgICAgICAgZm9yIChsZXQgaSA9IGxpbWl0OyBpID49IDA7IGktLSkge1xuICAgICAgICAgIGNvbnN0IG5leHROYW1lc3BhY2UgPSBuYW1lc3BhY2VMaXN0W2ldO1xuICAgICAgICAgIGlmICh0aGlzLmRyaXZlci5jb250YWluc0VsZW1lbnQobmV4dE5hbWVzcGFjZS5ob3N0RWxlbWVudCwgaG9zdEVsZW1lbnQpKSB7XG4gICAgICAgICAgICBuYW1lc3BhY2VMaXN0LnNwbGljZShpICsgMSwgMCwgbnMpO1xuICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgIC8vIE5vIG5hbWVzcGFjZSBleGlzdHMgdGhhdCBpcyBhbiBhbmNlc3RvciBvZiBgbnNgLCBzbyBgbnNgIGlzIGluc2VydGVkIGF0IHRoZSBmcm9udCB0b1xuICAgICAgICAvLyBlbnN1cmUgdGhhdCBhbnkgZXhpc3RpbmcgZGVzY2VuZGFudHMgYXJlIG9yZGVyZWQgYWZ0ZXIgYG5zYCwgcmV0YWluaW5nIHRoZSBkZXNpcmVkXG4gICAgICAgIC8vIHRvcC1kb3duIG9yZGVyaW5nLlxuICAgICAgICBuYW1lc3BhY2VMaXN0LnVuc2hpZnQobnMpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lc3BhY2VMaXN0LnB1c2gobnMpO1xuICAgIH1cblxuICAgIG5hbWVzcGFjZXNCeUhvc3RFbGVtZW50LnNldChob3N0RWxlbWVudCwgbnMpO1xuICAgIHJldHVybiBucztcbiAgfVxuXG4gIHJlZ2lzdGVyKG5hbWVzcGFjZUlkOiBzdHJpbmcsIGhvc3RFbGVtZW50OiBhbnkpIHtcbiAgICBsZXQgbnMgPSB0aGlzLl9uYW1lc3BhY2VMb29rdXBbbmFtZXNwYWNlSWRdO1xuICAgIGlmICghbnMpIHtcbiAgICAgIG5zID0gdGhpcy5jcmVhdGVOYW1lc3BhY2UobmFtZXNwYWNlSWQsIGhvc3RFbGVtZW50KTtcbiAgICB9XG4gICAgcmV0dXJuIG5zO1xuICB9XG5cbiAgcmVnaXN0ZXJUcmlnZ2VyKG5hbWVzcGFjZUlkOiBzdHJpbmcsIG5hbWU6IHN0cmluZywgdHJpZ2dlcjogQW5pbWF0aW9uVHJpZ2dlcikge1xuICAgIGxldCBucyA9IHRoaXMuX25hbWVzcGFjZUxvb2t1cFtuYW1lc3BhY2VJZF07XG4gICAgaWYgKG5zICYmIG5zLnJlZ2lzdGVyKG5hbWUsIHRyaWdnZXIpKSB7XG4gICAgICB0aGlzLnRvdGFsQW5pbWF0aW9ucysrO1xuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3kobmFtZXNwYWNlSWQ6IHN0cmluZywgY29udGV4dDogYW55KSB7XG4gICAgaWYgKCFuYW1lc3BhY2VJZCkgcmV0dXJuO1xuXG4gICAgY29uc3QgbnMgPSB0aGlzLl9mZXRjaE5hbWVzcGFjZShuYW1lc3BhY2VJZCk7XG5cbiAgICB0aGlzLmFmdGVyRmx1c2goKCkgPT4ge1xuICAgICAgdGhpcy5uYW1lc3BhY2VzQnlIb3N0RWxlbWVudC5kZWxldGUobnMuaG9zdEVsZW1lbnQpO1xuICAgICAgZGVsZXRlIHRoaXMuX25hbWVzcGFjZUxvb2t1cFtuYW1lc3BhY2VJZF07XG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuX25hbWVzcGFjZUxpc3QuaW5kZXhPZihucyk7XG4gICAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICB0aGlzLl9uYW1lc3BhY2VMaXN0LnNwbGljZShpbmRleCwgMSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmFmdGVyRmx1c2hBbmltYXRpb25zRG9uZSgoKSA9PiBucy5kZXN0cm95KGNvbnRleHQpKTtcbiAgfVxuXG4gIHByaXZhdGUgX2ZldGNoTmFtZXNwYWNlKGlkOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5fbmFtZXNwYWNlTG9va3VwW2lkXTtcbiAgfVxuXG4gIGZldGNoTmFtZXNwYWNlc0J5RWxlbWVudChlbGVtZW50OiBhbnkpOiBTZXQ8QW5pbWF0aW9uVHJhbnNpdGlvbk5hbWVzcGFjZT4ge1xuICAgIC8vIG5vcm1hbGx5IHRoZXJlIHNob3VsZCBvbmx5IGJlIG9uZSBuYW1lc3BhY2UgcGVyIGVsZW1lbnQsIGhvd2V2ZXJcbiAgICAvLyBpZiBAdHJpZ2dlcnMgYXJlIHBsYWNlZCBvbiBib3RoIHRoZSBjb21wb25lbnQgZWxlbWVudCBhbmQgdGhlblxuICAgIC8vIGl0cyBob3N0IGVsZW1lbnQgKHdpdGhpbiB0aGUgY29tcG9uZW50IGNvZGUpIHRoZW4gdGhlcmUgd2lsbCBiZVxuICAgIC8vIHR3byBuYW1lc3BhY2VzIHJldHVybmVkLiBXZSB1c2UgYSBzZXQgaGVyZSB0byBzaW1wbHkgZGVkdXBsaWNhdGVcbiAgICAvLyB0aGUgbmFtZXNwYWNlcyBpbiBjYXNlIChmb3IgdGhlIHJlYXNvbiBkZXNjcmliZWQgYWJvdmUpIHRoZXJlIGFyZSBtdWx0aXBsZSB0cmlnZ2Vyc1xuICAgIGNvbnN0IG5hbWVzcGFjZXMgPSBuZXcgU2V0PEFuaW1hdGlvblRyYW5zaXRpb25OYW1lc3BhY2U+KCk7XG4gICAgY29uc3QgZWxlbWVudFN0YXRlcyA9IHRoaXMuc3RhdGVzQnlFbGVtZW50LmdldChlbGVtZW50KTtcbiAgICBpZiAoZWxlbWVudFN0YXRlcykge1xuICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGVsZW1lbnRTdGF0ZXMpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IG5zSWQgPSBlbGVtZW50U3RhdGVzW2tleXNbaV1dLm5hbWVzcGFjZUlkO1xuICAgICAgICBpZiAobnNJZCkge1xuICAgICAgICAgIGNvbnN0IG5zID0gdGhpcy5fZmV0Y2hOYW1lc3BhY2UobnNJZCk7XG4gICAgICAgICAgaWYgKG5zKSB7XG4gICAgICAgICAgICBuYW1lc3BhY2VzLmFkZChucyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuYW1lc3BhY2VzO1xuICB9XG5cbiAgdHJpZ2dlcihuYW1lc3BhY2VJZDogc3RyaW5nLCBlbGVtZW50OiBhbnksIG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSk6IGJvb2xlYW4ge1xuICAgIGlmIChpc0VsZW1lbnROb2RlKGVsZW1lbnQpKSB7XG4gICAgICBjb25zdCBucyA9IHRoaXMuX2ZldGNoTmFtZXNwYWNlKG5hbWVzcGFjZUlkKTtcbiAgICAgIGlmIChucykge1xuICAgICAgICBucy50cmlnZ2VyKGVsZW1lbnQsIG5hbWUsIHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGluc2VydE5vZGUobmFtZXNwYWNlSWQ6IHN0cmluZywgZWxlbWVudDogYW55LCBwYXJlbnQ6IGFueSwgaW5zZXJ0QmVmb3JlOiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKCFpc0VsZW1lbnROb2RlKGVsZW1lbnQpKSByZXR1cm47XG5cbiAgICAvLyBzcGVjaWFsIGNhc2UgZm9yIHdoZW4gYW4gZWxlbWVudCBpcyByZW1vdmVkIGFuZCByZWluc2VydGVkIChtb3ZlIG9wZXJhdGlvbilcbiAgICAvLyB3aGVuIHRoaXMgb2NjdXJzIHdlIGRvIG5vdCB3YW50IHRvIHVzZSB0aGUgZWxlbWVudCBmb3IgZGVsZXRpb24gbGF0ZXJcbiAgICBjb25zdCBkZXRhaWxzID0gZWxlbWVudFtSRU1PVkFMX0ZMQUddIGFzIEVsZW1lbnRBbmltYXRpb25TdGF0ZTtcbiAgICBpZiAoZGV0YWlscyAmJiBkZXRhaWxzLnNldEZvclJlbW92YWwpIHtcbiAgICAgIGRldGFpbHMuc2V0Rm9yUmVtb3ZhbCA9IGZhbHNlO1xuICAgICAgZGV0YWlscy5zZXRGb3JNb3ZlID0gdHJ1ZTtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5jb2xsZWN0ZWRMZWF2ZUVsZW1lbnRzLmluZGV4T2YoZWxlbWVudCk7XG4gICAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICB0aGlzLmNvbGxlY3RlZExlYXZlRWxlbWVudHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBpbiB0aGUgZXZlbnQgdGhhdCB0aGUgbmFtZXNwYWNlSWQgaXMgYmxhbmsgdGhlbiB0aGUgY2FsbGVyXG4gICAgLy8gY29kZSBkb2VzIG5vdCBjb250YWluIGFueSBhbmltYXRpb24gY29kZSBpbiBpdCwgYnV0IGl0IGlzXG4gICAgLy8ganVzdCBiZWluZyBjYWxsZWQgc28gdGhhdCB0aGUgbm9kZSBpcyBtYXJrZWQgYXMgYmVpbmcgaW5zZXJ0ZWRcbiAgICBpZiAobmFtZXNwYWNlSWQpIHtcbiAgICAgIGNvbnN0IG5zID0gdGhpcy5fZmV0Y2hOYW1lc3BhY2UobmFtZXNwYWNlSWQpO1xuICAgICAgLy8gVGhpcyBpZi1zdGF0ZW1lbnQgaXMgYSB3b3JrYXJvdW5kIGZvciByb3V0ZXIgaXNzdWUgIzIxOTQ3LlxuICAgICAgLy8gVGhlIHJvdXRlciBzb21ldGltZXMgaGl0cyBhIHJhY2UgY29uZGl0aW9uIHdoZXJlIHdoaWxlIGEgcm91dGVcbiAgICAgIC8vIGlzIGJlaW5nIGluc3RhbnRpYXRlZCBhIG5ldyBuYXZpZ2F0aW9uIGFycml2ZXMsIHRyaWdnZXJpbmcgbGVhdmVcbiAgICAgIC8vIGFuaW1hdGlvbiBvZiBET00gdGhhdCBoYXMgbm90IGJlZW4gZnVsbHkgaW5pdGlhbGl6ZWQsIHVudGlsIHRoaXNcbiAgICAgIC8vIGlzIHJlc29sdmVkLCB3ZSBuZWVkIHRvIGhhbmRsZSB0aGUgc2NlbmFyaW8gd2hlbiBET00gaXMgbm90IGluIGFcbiAgICAgIC8vIGNvbnNpc3RlbnQgc3RhdGUgZHVyaW5nIHRoZSBhbmltYXRpb24uXG4gICAgICBpZiAobnMpIHtcbiAgICAgICAgbnMuaW5zZXJ0Tm9kZShlbGVtZW50LCBwYXJlbnQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIG9ubHkgKmRpcmVjdGl2ZXMgYW5kIGhvc3QgZWxlbWVudHMgYXJlIGluc2VydGVkIGJlZm9yZVxuICAgIGlmIChpbnNlcnRCZWZvcmUpIHtcbiAgICAgIHRoaXMuY29sbGVjdEVudGVyRWxlbWVudChlbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICBjb2xsZWN0RW50ZXJFbGVtZW50KGVsZW1lbnQ6IGFueSkge1xuICAgIHRoaXMuY29sbGVjdGVkRW50ZXJFbGVtZW50cy5wdXNoKGVsZW1lbnQpO1xuICB9XG5cbiAgbWFya0VsZW1lbnRBc0Rpc2FibGVkKGVsZW1lbnQ6IGFueSwgdmFsdWU6IGJvb2xlYW4pIHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIGlmICghdGhpcy5kaXNhYmxlZE5vZGVzLmhhcyhlbGVtZW50KSkge1xuICAgICAgICB0aGlzLmRpc2FibGVkTm9kZXMuYWRkKGVsZW1lbnQpO1xuICAgICAgICBhZGRDbGFzcyhlbGVtZW50LCBESVNBQkxFRF9DTEFTU05BTUUpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5kaXNhYmxlZE5vZGVzLmhhcyhlbGVtZW50KSkge1xuICAgICAgdGhpcy5kaXNhYmxlZE5vZGVzLmRlbGV0ZShlbGVtZW50KTtcbiAgICAgIHJlbW92ZUNsYXNzKGVsZW1lbnQsIERJU0FCTEVEX0NMQVNTTkFNRSk7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlTm9kZShuYW1lc3BhY2VJZDogc3RyaW5nLCBlbGVtZW50OiBhbnksIGlzSG9zdEVsZW1lbnQ6IGJvb2xlYW4sIGNvbnRleHQ6IGFueSk6IHZvaWQge1xuICAgIGlmIChpc0VsZW1lbnROb2RlKGVsZW1lbnQpKSB7XG4gICAgICBjb25zdCBucyA9IG5hbWVzcGFjZUlkID8gdGhpcy5fZmV0Y2hOYW1lc3BhY2UobmFtZXNwYWNlSWQpIDogbnVsbDtcbiAgICAgIGlmIChucykge1xuICAgICAgICBucy5yZW1vdmVOb2RlKGVsZW1lbnQsIGNvbnRleHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5tYXJrRWxlbWVudEFzUmVtb3ZlZChuYW1lc3BhY2VJZCwgZWxlbWVudCwgZmFsc2UsIGNvbnRleHQpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNIb3N0RWxlbWVudCkge1xuICAgICAgICBjb25zdCBob3N0TlMgPSB0aGlzLm5hbWVzcGFjZXNCeUhvc3RFbGVtZW50LmdldChlbGVtZW50KTtcbiAgICAgICAgaWYgKGhvc3ROUyAmJiBob3N0TlMuaWQgIT09IG5hbWVzcGFjZUlkKSB7XG4gICAgICAgICAgaG9zdE5TLnJlbW92ZU5vZGUoZWxlbWVudCwgY29udGV4dCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fb25SZW1vdmFsQ29tcGxldGUoZWxlbWVudCwgY29udGV4dCk7XG4gICAgfVxuICB9XG5cbiAgbWFya0VsZW1lbnRBc1JlbW92ZWQoXG4gICAgICBuYW1lc3BhY2VJZDogc3RyaW5nLCBlbGVtZW50OiBhbnksIGhhc0FuaW1hdGlvbj86IGJvb2xlYW4sIGNvbnRleHQ/OiBhbnksXG4gICAgICBwcmV2aW91c1RyaWdnZXJzVmFsdWVzPzogTWFwPHN0cmluZywgc3RyaW5nPikge1xuICAgIHRoaXMuY29sbGVjdGVkTGVhdmVFbGVtZW50cy5wdXNoKGVsZW1lbnQpO1xuICAgIGVsZW1lbnRbUkVNT1ZBTF9GTEFHXSA9IHtcbiAgICAgIG5hbWVzcGFjZUlkLFxuICAgICAgc2V0Rm9yUmVtb3ZhbDogY29udGV4dCxcbiAgICAgIGhhc0FuaW1hdGlvbixcbiAgICAgIHJlbW92ZWRCZWZvcmVRdWVyaWVkOiBmYWxzZSxcbiAgICAgIHByZXZpb3VzVHJpZ2dlcnNWYWx1ZXNcbiAgICB9O1xuICB9XG5cbiAgbGlzdGVuKFxuICAgICAgbmFtZXNwYWNlSWQ6IHN0cmluZywgZWxlbWVudDogYW55LCBuYW1lOiBzdHJpbmcsIHBoYXNlOiBzdHJpbmcsXG4gICAgICBjYWxsYmFjazogKGV2ZW50OiBhbnkpID0+IGJvb2xlYW4pOiAoKSA9PiBhbnkge1xuICAgIGlmIChpc0VsZW1lbnROb2RlKGVsZW1lbnQpKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZmV0Y2hOYW1lc3BhY2UobmFtZXNwYWNlSWQpLmxpc3RlbihlbGVtZW50LCBuYW1lLCBwaGFzZSwgY2FsbGJhY2spO1xuICAgIH1cbiAgICByZXR1cm4gKCkgPT4ge307XG4gIH1cblxuICBwcml2YXRlIF9idWlsZEluc3RydWN0aW9uKFxuICAgICAgZW50cnk6IFF1ZXVlSW5zdHJ1Y3Rpb24sIHN1YlRpbWVsaW5lczogRWxlbWVudEluc3RydWN0aW9uTWFwLCBlbnRlckNsYXNzTmFtZTogc3RyaW5nLFxuICAgICAgbGVhdmVDbGFzc05hbWU6IHN0cmluZywgc2tpcEJ1aWxkQXN0PzogYm9vbGVhbikge1xuICAgIHJldHVybiBlbnRyeS50cmFuc2l0aW9uLmJ1aWxkKFxuICAgICAgICB0aGlzLmRyaXZlciwgZW50cnkuZWxlbWVudCwgZW50cnkuZnJvbVN0YXRlLnZhbHVlLCBlbnRyeS50b1N0YXRlLnZhbHVlLCBlbnRlckNsYXNzTmFtZSxcbiAgICAgICAgbGVhdmVDbGFzc05hbWUsIGVudHJ5LmZyb21TdGF0ZS5vcHRpb25zLCBlbnRyeS50b1N0YXRlLm9wdGlvbnMsIHN1YlRpbWVsaW5lcywgc2tpcEJ1aWxkQXN0KTtcbiAgfVxuXG4gIGRlc3Ryb3lJbm5lckFuaW1hdGlvbnMoY29udGFpbmVyRWxlbWVudDogYW55KSB7XG4gICAgbGV0IGVsZW1lbnRzID0gdGhpcy5kcml2ZXIucXVlcnkoY29udGFpbmVyRWxlbWVudCwgTkdfVFJJR0dFUl9TRUxFQ1RPUiwgdHJ1ZSk7XG4gICAgZWxlbWVudHMuZm9yRWFjaChlbGVtZW50ID0+IHRoaXMuZGVzdHJveUFjdGl2ZUFuaW1hdGlvbnNGb3JFbGVtZW50KGVsZW1lbnQpKTtcblxuICAgIGlmICh0aGlzLnBsYXllcnNCeVF1ZXJpZWRFbGVtZW50LnNpemUgPT0gMCkgcmV0dXJuO1xuXG4gICAgZWxlbWVudHMgPSB0aGlzLmRyaXZlci5xdWVyeShjb250YWluZXJFbGVtZW50LCBOR19BTklNQVRJTkdfU0VMRUNUT1IsIHRydWUpO1xuICAgIGVsZW1lbnRzLmZvckVhY2goZWxlbWVudCA9PiB0aGlzLmZpbmlzaEFjdGl2ZVF1ZXJpZWRBbmltYXRpb25PbkVsZW1lbnQoZWxlbWVudCkpO1xuICB9XG5cbiAgZGVzdHJveUFjdGl2ZUFuaW1hdGlvbnNGb3JFbGVtZW50KGVsZW1lbnQ6IGFueSkge1xuICAgIGNvbnN0IHBsYXllcnMgPSB0aGlzLnBsYXllcnNCeUVsZW1lbnQuZ2V0KGVsZW1lbnQpO1xuICAgIGlmIChwbGF5ZXJzKSB7XG4gICAgICBwbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHtcbiAgICAgICAgLy8gc3BlY2lhbCBjYXNlIGZvciB3aGVuIGFuIGVsZW1lbnQgaXMgc2V0IGZvciBkZXN0cnVjdGlvbiwgYnV0IGhhc24ndCBzdGFydGVkLlxuICAgICAgICAvLyBpbiB0aGlzIHNpdHVhdGlvbiB3ZSB3YW50IHRvIGRlbGF5IHRoZSBkZXN0cnVjdGlvbiB1bnRpbCB0aGUgZmx1c2ggb2NjdXJzXG4gICAgICAgIC8vIHNvIHRoYXQgYW55IGV2ZW50IGxpc3RlbmVycyBhdHRhY2hlZCB0byB0aGUgcGxheWVyIGFyZSB0cmlnZ2VyZWQuXG4gICAgICAgIGlmIChwbGF5ZXIucXVldWVkKSB7XG4gICAgICAgICAgcGxheWVyLm1hcmtlZEZvckRlc3Ryb3kgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBsYXllci5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGZpbmlzaEFjdGl2ZVF1ZXJpZWRBbmltYXRpb25PbkVsZW1lbnQoZWxlbWVudDogYW55KSB7XG4gICAgY29uc3QgcGxheWVycyA9IHRoaXMucGxheWVyc0J5UXVlcmllZEVsZW1lbnQuZ2V0KGVsZW1lbnQpO1xuICAgIGlmIChwbGF5ZXJzKSB7XG4gICAgICBwbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHBsYXllci5maW5pc2goKSk7XG4gICAgfVxuICB9XG5cbiAgd2hlblJlbmRlcmluZ0RvbmUoKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4ocmVzb2x2ZSA9PiB7XG4gICAgICBpZiAodGhpcy5wbGF5ZXJzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gb3B0aW1pemVHcm91cFBsYXllcih0aGlzLnBsYXllcnMpLm9uRG9uZSgoKSA9PiByZXNvbHZlKCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJvY2Vzc0xlYXZlTm9kZShlbGVtZW50OiBhbnkpIHtcbiAgICBjb25zdCBkZXRhaWxzID0gZWxlbWVudFtSRU1PVkFMX0ZMQUddIGFzIEVsZW1lbnRBbmltYXRpb25TdGF0ZTtcbiAgICBpZiAoZGV0YWlscyAmJiBkZXRhaWxzLnNldEZvclJlbW92YWwpIHtcbiAgICAgIC8vIHRoaXMgd2lsbCBwcmV2ZW50IGl0IGZyb20gcmVtb3ZpbmcgaXQgdHdpY2VcbiAgICAgIGVsZW1lbnRbUkVNT1ZBTF9GTEFHXSA9IE5VTExfUkVNT1ZBTF9TVEFURTtcbiAgICAgIGlmIChkZXRhaWxzLm5hbWVzcGFjZUlkKSB7XG4gICAgICAgIHRoaXMuZGVzdHJveUlubmVyQW5pbWF0aW9ucyhlbGVtZW50KTtcbiAgICAgICAgY29uc3QgbnMgPSB0aGlzLl9mZXRjaE5hbWVzcGFjZShkZXRhaWxzLm5hbWVzcGFjZUlkKTtcbiAgICAgICAgaWYgKG5zKSB7XG4gICAgICAgICAgbnMuY2xlYXJFbGVtZW50Q2FjaGUoZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuX29uUmVtb3ZhbENvbXBsZXRlKGVsZW1lbnQsIGRldGFpbHMuc2V0Rm9yUmVtb3ZhbCk7XG4gICAgfVxuXG4gICAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0Py5jb250YWlucyhESVNBQkxFRF9DTEFTU05BTUUpKSB7XG4gICAgICB0aGlzLm1hcmtFbGVtZW50QXNEaXNhYmxlZChlbGVtZW50LCBmYWxzZSk7XG4gICAgfVxuXG4gICAgdGhpcy5kcml2ZXIucXVlcnkoZWxlbWVudCwgRElTQUJMRURfU0VMRUNUT1IsIHRydWUpLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICB0aGlzLm1hcmtFbGVtZW50QXNEaXNhYmxlZChub2RlLCBmYWxzZSk7XG4gICAgfSk7XG4gIH1cblxuICBmbHVzaChtaWNyb3Rhc2tJZDogbnVtYmVyID0gLTEpIHtcbiAgICBsZXQgcGxheWVyczogQW5pbWF0aW9uUGxheWVyW10gPSBbXTtcbiAgICBpZiAodGhpcy5uZXdIb3N0RWxlbWVudHMuc2l6ZSkge1xuICAgICAgdGhpcy5uZXdIb3N0RWxlbWVudHMuZm9yRWFjaCgobnMsIGVsZW1lbnQpID0+IHRoaXMuX2JhbGFuY2VOYW1lc3BhY2VMaXN0KG5zLCBlbGVtZW50KSk7XG4gICAgICB0aGlzLm5ld0hvc3RFbGVtZW50cy5jbGVhcigpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnRvdGFsQW5pbWF0aW9ucyAmJiB0aGlzLmNvbGxlY3RlZEVudGVyRWxlbWVudHMubGVuZ3RoKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY29sbGVjdGVkRW50ZXJFbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBlbG0gPSB0aGlzLmNvbGxlY3RlZEVudGVyRWxlbWVudHNbaV07XG4gICAgICAgIGFkZENsYXNzKGVsbSwgU1RBUl9DTEFTU05BTUUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLl9uYW1lc3BhY2VMaXN0Lmxlbmd0aCAmJlxuICAgICAgICAodGhpcy50b3RhbFF1ZXVlZFBsYXllcnMgfHwgdGhpcy5jb2xsZWN0ZWRMZWF2ZUVsZW1lbnRzLmxlbmd0aCkpIHtcbiAgICAgIGNvbnN0IGNsZWFudXBGbnM6IEZ1bmN0aW9uW10gPSBbXTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHBsYXllcnMgPSB0aGlzLl9mbHVzaEFuaW1hdGlvbnMoY2xlYW51cEZucywgbWljcm90YXNrSWQpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjbGVhbnVwRm5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY2xlYW51cEZuc1tpXSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jb2xsZWN0ZWRMZWF2ZUVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmNvbGxlY3RlZExlYXZlRWxlbWVudHNbaV07XG4gICAgICAgIHRoaXMucHJvY2Vzc0xlYXZlTm9kZShlbGVtZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnRvdGFsUXVldWVkUGxheWVycyA9IDA7XG4gICAgdGhpcy5jb2xsZWN0ZWRFbnRlckVsZW1lbnRzLmxlbmd0aCA9IDA7XG4gICAgdGhpcy5jb2xsZWN0ZWRMZWF2ZUVsZW1lbnRzLmxlbmd0aCA9IDA7XG4gICAgdGhpcy5fZmx1c2hGbnMuZm9yRWFjaChmbiA9PiBmbigpKTtcbiAgICB0aGlzLl9mbHVzaEZucyA9IFtdO1xuXG4gICAgaWYgKHRoaXMuX3doZW5RdWlldEZucy5sZW5ndGgpIHtcbiAgICAgIC8vIHdlIG1vdmUgdGhlc2Ugb3ZlciB0byBhIHZhcmlhYmxlIHNvIHRoYXRcbiAgICAgIC8vIGlmIGFueSBuZXcgY2FsbGJhY2tzIGFyZSByZWdpc3RlcmVkIGluIGFub3RoZXJcbiAgICAgIC8vIGZsdXNoIHRoZXkgZG8gbm90IHBvcHVsYXRlIHRoZSBleGlzdGluZyBzZXRcbiAgICAgIGNvbnN0IHF1aWV0Rm5zID0gdGhpcy5fd2hlblF1aWV0Rm5zO1xuICAgICAgdGhpcy5fd2hlblF1aWV0Rm5zID0gW107XG5cbiAgICAgIGlmIChwbGF5ZXJzLmxlbmd0aCkge1xuICAgICAgICBvcHRpbWl6ZUdyb3VwUGxheWVyKHBsYXllcnMpLm9uRG9uZSgoKSA9PiB7XG4gICAgICAgICAgcXVpZXRGbnMuZm9yRWFjaChmbiA9PiBmbigpKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBxdWlldEZucy5mb3JFYWNoKGZuID0+IGZuKCkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlcG9ydEVycm9yKGVycm9yczogRXJyb3JbXSkge1xuICAgIHRocm93IHRyaWdnZXJUcmFuc2l0aW9uc0ZhaWxlZChlcnJvcnMpO1xuICB9XG5cbiAgcHJpdmF0ZSBfZmx1c2hBbmltYXRpb25zKGNsZWFudXBGbnM6IEZ1bmN0aW9uW10sIG1pY3JvdGFza0lkOiBudW1iZXIpOlxuICAgICAgVHJhbnNpdGlvbkFuaW1hdGlvblBsYXllcltdIHtcbiAgICBjb25zdCBzdWJUaW1lbGluZXMgPSBuZXcgRWxlbWVudEluc3RydWN0aW9uTWFwKCk7XG4gICAgY29uc3Qgc2tpcHBlZFBsYXllcnM6IFRyYW5zaXRpb25BbmltYXRpb25QbGF5ZXJbXSA9IFtdO1xuICAgIGNvbnN0IHNraXBwZWRQbGF5ZXJzTWFwID0gbmV3IE1hcDxhbnksIEFuaW1hdGlvblBsYXllcltdPigpO1xuICAgIGNvbnN0IHF1ZXVlZEluc3RydWN0aW9uczogUXVldWVkVHJhbnNpdGlvbltdID0gW107XG4gICAgY29uc3QgcXVlcmllZEVsZW1lbnRzID0gbmV3IE1hcDxhbnksIFRyYW5zaXRpb25BbmltYXRpb25QbGF5ZXJbXT4oKTtcbiAgICBjb25zdCBhbGxQcmVTdHlsZUVsZW1lbnRzID0gbmV3IE1hcDxhbnksIFNldDxzdHJpbmc+PigpO1xuICAgIGNvbnN0IGFsbFBvc3RTdHlsZUVsZW1lbnRzID0gbmV3IE1hcDxhbnksIFNldDxzdHJpbmc+PigpO1xuXG4gICAgY29uc3QgZGlzYWJsZWRFbGVtZW50c1NldCA9IG5ldyBTZXQ8YW55PigpO1xuICAgIHRoaXMuZGlzYWJsZWROb2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgZGlzYWJsZWRFbGVtZW50c1NldC5hZGQobm9kZSk7XG4gICAgICBjb25zdCBub2Rlc1RoYXRBcmVEaXNhYmxlZCA9IHRoaXMuZHJpdmVyLnF1ZXJ5KG5vZGUsIFFVRVVFRF9TRUxFQ1RPUiwgdHJ1ZSk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVzVGhhdEFyZURpc2FibGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGRpc2FibGVkRWxlbWVudHNTZXQuYWRkKG5vZGVzVGhhdEFyZURpc2FibGVkW2ldKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IGJvZHlOb2RlID0gdGhpcy5ib2R5Tm9kZTtcbiAgICBjb25zdCBhbGxUcmlnZ2VyRWxlbWVudHMgPSBBcnJheS5mcm9tKHRoaXMuc3RhdGVzQnlFbGVtZW50LmtleXMoKSk7XG4gICAgY29uc3QgZW50ZXJOb2RlTWFwID0gYnVpbGRSb290TWFwKGFsbFRyaWdnZXJFbGVtZW50cywgdGhpcy5jb2xsZWN0ZWRFbnRlckVsZW1lbnRzKTtcblxuICAgIC8vIHRoaXMgbXVzdCBvY2N1ciBiZWZvcmUgdGhlIGluc3RydWN0aW9ucyBhcmUgYnVpbHQgYmVsb3cgc3VjaCB0aGF0XG4gICAgLy8gdGhlIDplbnRlciBxdWVyaWVzIG1hdGNoIHRoZSBlbGVtZW50cyAoc2luY2UgdGhlIHRpbWVsaW5lIHF1ZXJpZXNcbiAgICAvLyBhcmUgZmlyZWQgZHVyaW5nIGluc3RydWN0aW9uIGJ1aWxkaW5nKS5cbiAgICBjb25zdCBlbnRlck5vZGVNYXBJZHMgPSBuZXcgTWFwPGFueSwgc3RyaW5nPigpO1xuICAgIGxldCBpID0gMDtcbiAgICBlbnRlck5vZGVNYXAuZm9yRWFjaCgobm9kZXMsIHJvb3QpID0+IHtcbiAgICAgIGNvbnN0IGNsYXNzTmFtZSA9IEVOVEVSX0NMQVNTTkFNRSArIGkrKztcbiAgICAgIGVudGVyTm9kZU1hcElkcy5zZXQocm9vdCwgY2xhc3NOYW1lKTtcbiAgICAgIG5vZGVzLmZvckVhY2gobm9kZSA9PiBhZGRDbGFzcyhub2RlLCBjbGFzc05hbWUpKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGFsbExlYXZlTm9kZXM6IGFueVtdID0gW107XG4gICAgY29uc3QgbWVyZ2VkTGVhdmVOb2RlcyA9IG5ldyBTZXQ8YW55PigpO1xuICAgIGNvbnN0IGxlYXZlTm9kZXNXaXRob3V0QW5pbWF0aW9ucyA9IG5ldyBTZXQ8YW55PigpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jb2xsZWN0ZWRMZWF2ZUVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5jb2xsZWN0ZWRMZWF2ZUVsZW1lbnRzW2ldO1xuICAgICAgY29uc3QgZGV0YWlscyA9IGVsZW1lbnRbUkVNT1ZBTF9GTEFHXSBhcyBFbGVtZW50QW5pbWF0aW9uU3RhdGU7XG4gICAgICBpZiAoZGV0YWlscyAmJiBkZXRhaWxzLnNldEZvclJlbW92YWwpIHtcbiAgICAgICAgYWxsTGVhdmVOb2Rlcy5wdXNoKGVsZW1lbnQpO1xuICAgICAgICBtZXJnZWRMZWF2ZU5vZGVzLmFkZChlbGVtZW50KTtcbiAgICAgICAgaWYgKGRldGFpbHMuaGFzQW5pbWF0aW9uKSB7XG4gICAgICAgICAgdGhpcy5kcml2ZXIucXVlcnkoZWxlbWVudCwgU1RBUl9TRUxFQ1RPUiwgdHJ1ZSkuZm9yRWFjaChlbG0gPT4gbWVyZ2VkTGVhdmVOb2Rlcy5hZGQoZWxtKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGVhdmVOb2Rlc1dpdGhvdXRBbmltYXRpb25zLmFkZChlbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGxlYXZlTm9kZU1hcElkcyA9IG5ldyBNYXA8YW55LCBzdHJpbmc+KCk7XG4gICAgY29uc3QgbGVhdmVOb2RlTWFwID0gYnVpbGRSb290TWFwKGFsbFRyaWdnZXJFbGVtZW50cywgQXJyYXkuZnJvbShtZXJnZWRMZWF2ZU5vZGVzKSk7XG4gICAgbGVhdmVOb2RlTWFwLmZvckVhY2goKG5vZGVzLCByb290KSA9PiB7XG4gICAgICBjb25zdCBjbGFzc05hbWUgPSBMRUFWRV9DTEFTU05BTUUgKyBpKys7XG4gICAgICBsZWF2ZU5vZGVNYXBJZHMuc2V0KHJvb3QsIGNsYXNzTmFtZSk7XG4gICAgICBub2Rlcy5mb3JFYWNoKG5vZGUgPT4gYWRkQ2xhc3Mobm9kZSwgY2xhc3NOYW1lKSk7XG4gICAgfSk7XG5cbiAgICBjbGVhbnVwRm5zLnB1c2goKCkgPT4ge1xuICAgICAgZW50ZXJOb2RlTWFwLmZvckVhY2goKG5vZGVzLCByb290KSA9PiB7XG4gICAgICAgIGNvbnN0IGNsYXNzTmFtZSA9IGVudGVyTm9kZU1hcElkcy5nZXQocm9vdCkhO1xuICAgICAgICBub2Rlcy5mb3JFYWNoKG5vZGUgPT4gcmVtb3ZlQ2xhc3Mobm9kZSwgY2xhc3NOYW1lKSk7XG4gICAgICB9KTtcblxuICAgICAgbGVhdmVOb2RlTWFwLmZvckVhY2goKG5vZGVzLCByb290KSA9PiB7XG4gICAgICAgIGNvbnN0IGNsYXNzTmFtZSA9IGxlYXZlTm9kZU1hcElkcy5nZXQocm9vdCkhO1xuICAgICAgICBub2Rlcy5mb3JFYWNoKG5vZGUgPT4gcmVtb3ZlQ2xhc3Mobm9kZSwgY2xhc3NOYW1lKSk7XG4gICAgICB9KTtcblxuICAgICAgYWxsTGVhdmVOb2Rlcy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICB0aGlzLnByb2Nlc3NMZWF2ZU5vZGUoZWxlbWVudCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGFsbFBsYXllcnM6IFRyYW5zaXRpb25BbmltYXRpb25QbGF5ZXJbXSA9IFtdO1xuICAgIGNvbnN0IGVycm9uZW91c1RyYW5zaXRpb25zOiBBbmltYXRpb25UcmFuc2l0aW9uSW5zdHJ1Y3Rpb25bXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSB0aGlzLl9uYW1lc3BhY2VMaXN0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjb25zdCBucyA9IHRoaXMuX25hbWVzcGFjZUxpc3RbaV07XG4gICAgICBucy5kcmFpblF1ZXVlZFRyYW5zaXRpb25zKG1pY3JvdGFza0lkKS5mb3JFYWNoKGVudHJ5ID0+IHtcbiAgICAgICAgY29uc3QgcGxheWVyID0gZW50cnkucGxheWVyO1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gZW50cnkuZWxlbWVudDtcbiAgICAgICAgYWxsUGxheWVycy5wdXNoKHBsYXllcik7XG5cbiAgICAgICAgaWYgKHRoaXMuY29sbGVjdGVkRW50ZXJFbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICBjb25zdCBkZXRhaWxzID0gZWxlbWVudFtSRU1PVkFMX0ZMQUddIGFzIEVsZW1lbnRBbmltYXRpb25TdGF0ZTtcbiAgICAgICAgICAvLyBhbmltYXRpb25zIGZvciBtb3ZlIG9wZXJhdGlvbnMgKGVsZW1lbnRzIGJlaW5nIHJlbW92ZWQgYW5kIHJlaW5zZXJ0ZWQsXG4gICAgICAgICAgLy8gZS5nLiB3aGVuIHRoZSBvcmRlciBvZiBhbiAqbmdGb3IgbGlzdCBjaGFuZ2VzKSBhcmUgY3VycmVudGx5IG5vdCBzdXBwb3J0ZWRcbiAgICAgICAgICBpZiAoZGV0YWlscyAmJiBkZXRhaWxzLnNldEZvck1vdmUpIHtcbiAgICAgICAgICAgIGlmIChkZXRhaWxzLnByZXZpb3VzVHJpZ2dlcnNWYWx1ZXMgJiZcbiAgICAgICAgICAgICAgICBkZXRhaWxzLnByZXZpb3VzVHJpZ2dlcnNWYWx1ZXMuaGFzKGVudHJ5LnRyaWdnZXJOYW1lKSkge1xuICAgICAgICAgICAgICBjb25zdCBwcmV2aW91c1ZhbHVlID0gZGV0YWlscy5wcmV2aW91c1RyaWdnZXJzVmFsdWVzLmdldChlbnRyeS50cmlnZ2VyTmFtZSkgYXMgc3RyaW5nO1xuXG4gICAgICAgICAgICAgIC8vIHdlIG5lZWQgdG8gcmVzdG9yZSB0aGUgcHJldmlvdXMgdHJpZ2dlciB2YWx1ZSBzaW5jZSB0aGUgZWxlbWVudCBoYXNcbiAgICAgICAgICAgICAgLy8gb25seSBiZWVuIG1vdmVkIGFuZCBoYXNuJ3QgYWN0dWFsbHkgbGVmdCB0aGUgRE9NXG4gICAgICAgICAgICAgIGNvbnN0IHRyaWdnZXJzV2l0aFN0YXRlcyA9IHRoaXMuc3RhdGVzQnlFbGVtZW50LmdldChlbnRyeS5lbGVtZW50KTtcbiAgICAgICAgICAgICAgaWYgKHRyaWdnZXJzV2l0aFN0YXRlcyAmJiB0cmlnZ2Vyc1dpdGhTdGF0ZXNbZW50cnkudHJpZ2dlck5hbWVdKSB7XG4gICAgICAgICAgICAgICAgdHJpZ2dlcnNXaXRoU3RhdGVzW2VudHJ5LnRyaWdnZXJOYW1lXS52YWx1ZSA9IHByZXZpb3VzVmFsdWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGxheWVyLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBub2RlSXNPcnBoYW5lZCA9ICFib2R5Tm9kZSB8fCAhdGhpcy5kcml2ZXIuY29udGFpbnNFbGVtZW50KGJvZHlOb2RlLCBlbGVtZW50KTtcbiAgICAgICAgY29uc3QgbGVhdmVDbGFzc05hbWUgPSBsZWF2ZU5vZGVNYXBJZHMuZ2V0KGVsZW1lbnQpITtcbiAgICAgICAgY29uc3QgZW50ZXJDbGFzc05hbWUgPSBlbnRlck5vZGVNYXBJZHMuZ2V0KGVsZW1lbnQpITtcbiAgICAgICAgY29uc3QgaW5zdHJ1Y3Rpb24gPSB0aGlzLl9idWlsZEluc3RydWN0aW9uKFxuICAgICAgICAgICAgZW50cnksIHN1YlRpbWVsaW5lcywgZW50ZXJDbGFzc05hbWUsIGxlYXZlQ2xhc3NOYW1lLCBub2RlSXNPcnBoYW5lZCkhO1xuICAgICAgICBpZiAoaW5zdHJ1Y3Rpb24uZXJyb3JzICYmIGluc3RydWN0aW9uLmVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgICBlcnJvbmVvdXNUcmFuc2l0aW9ucy5wdXNoKGluc3RydWN0aW9uKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBldmVuIHRob3VnaCB0aGUgZWxlbWVudCBtYXkgbm90IGJlIGluIHRoZSBET00sIGl0IG1heSBzdGlsbFxuICAgICAgICAvLyBiZSBhZGRlZCBhdCBhIGxhdGVyIHBvaW50IChkdWUgdG8gdGhlIG1lY2hhbmljcyBvZiBjb250ZW50XG4gICAgICAgIC8vIHByb2plY3Rpb24gYW5kL29yIGR5bmFtaWMgY29tcG9uZW50IGluc2VydGlvbikgdGhlcmVmb3JlIGl0J3NcbiAgICAgICAgLy8gaW1wb3J0YW50IHRvIHN0aWxsIHN0eWxlIHRoZSBlbGVtZW50LlxuICAgICAgICBpZiAobm9kZUlzT3JwaGFuZWQpIHtcbiAgICAgICAgICBwbGF5ZXIub25TdGFydCgoKSA9PiBlcmFzZVN0eWxlcyhlbGVtZW50LCBpbnN0cnVjdGlvbi5mcm9tU3R5bGVzKSk7XG4gICAgICAgICAgcGxheWVyLm9uRGVzdHJveSgoKSA9PiBzZXRTdHlsZXMoZWxlbWVudCwgaW5zdHJ1Y3Rpb24udG9TdHlsZXMpKTtcbiAgICAgICAgICBza2lwcGVkUGxheWVycy5wdXNoKHBsYXllcik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgYW4gdW5tYXRjaGVkIHRyYW5zaXRpb24gaXMgcXVldWVkIGFuZCByZWFkeSB0byBnb1xuICAgICAgICAvLyB0aGVuIGl0IFNIT1VMRCBOT1QgcmVuZGVyIGFuIGFuaW1hdGlvbiBhbmQgY2FuY2VsIHRoZVxuICAgICAgICAvLyBwcmV2aW91c2x5IHJ1bm5pbmcgYW5pbWF0aW9ucy5cbiAgICAgICAgaWYgKGVudHJ5LmlzRmFsbGJhY2tUcmFuc2l0aW9uKSB7XG4gICAgICAgICAgcGxheWVyLm9uU3RhcnQoKCkgPT4gZXJhc2VTdHlsZXMoZWxlbWVudCwgaW5zdHJ1Y3Rpb24uZnJvbVN0eWxlcykpO1xuICAgICAgICAgIHBsYXllci5vbkRlc3Ryb3koKCkgPT4gc2V0U3R5bGVzKGVsZW1lbnQsIGluc3RydWN0aW9uLnRvU3R5bGVzKSk7XG4gICAgICAgICAgc2tpcHBlZFBsYXllcnMucHVzaChwbGF5ZXIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRoaXMgbWVhbnMgdGhhdCBpZiBhIHBhcmVudCBhbmltYXRpb24gdXNlcyB0aGlzIGFuaW1hdGlvbiBhcyBhIHN1Yi10cmlnZ2VyXG4gICAgICAgIC8vIHRoZW4gaXQgd2lsbCBpbnN0cnVjdCB0aGUgdGltZWxpbmUgYnVpbGRlciBub3QgdG8gYWRkIGEgcGxheWVyIGRlbGF5LCBidXRcbiAgICAgICAgLy8gaW5zdGVhZCBzdHJldGNoIHRoZSBmaXJzdCBrZXlmcmFtZSBnYXAgdW50aWwgdGhlIGFuaW1hdGlvbiBzdGFydHMuIFRoaXMgaXNcbiAgICAgICAgLy8gaW1wb3J0YW50IGluIG9yZGVyIHRvIHByZXZlbnQgZXh0cmEgaW5pdGlhbGl6YXRpb24gc3R5bGVzIGZyb20gYmVpbmdcbiAgICAgICAgLy8gcmVxdWlyZWQgYnkgdGhlIHVzZXIgZm9yIHRoZSBhbmltYXRpb24uXG4gICAgICAgIGNvbnN0IHRpbWVsaW5lczogQW5pbWF0aW9uVGltZWxpbmVJbnN0cnVjdGlvbltdID0gW107XG4gICAgICAgIGluc3RydWN0aW9uLnRpbWVsaW5lcy5mb3JFYWNoKHRsID0+IHtcbiAgICAgICAgICB0bC5zdHJldGNoU3RhcnRpbmdLZXlmcmFtZSA9IHRydWU7XG4gICAgICAgICAgaWYgKCF0aGlzLmRpc2FibGVkTm9kZXMuaGFzKHRsLmVsZW1lbnQpKSB7XG4gICAgICAgICAgICB0aW1lbGluZXMucHVzaCh0bCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaW5zdHJ1Y3Rpb24udGltZWxpbmVzID0gdGltZWxpbmVzO1xuXG4gICAgICAgIHN1YlRpbWVsaW5lcy5hcHBlbmQoZWxlbWVudCwgaW5zdHJ1Y3Rpb24udGltZWxpbmVzKTtcblxuICAgICAgICBjb25zdCB0dXBsZSA9IHtpbnN0cnVjdGlvbiwgcGxheWVyLCBlbGVtZW50fTtcblxuICAgICAgICBxdWV1ZWRJbnN0cnVjdGlvbnMucHVzaCh0dXBsZSk7XG5cbiAgICAgICAgaW5zdHJ1Y3Rpb24ucXVlcmllZEVsZW1lbnRzLmZvckVhY2goXG4gICAgICAgICAgICBlbGVtZW50ID0+IGdldE9yU2V0QXNJbk1hcChxdWVyaWVkRWxlbWVudHMsIGVsZW1lbnQsIFtdKS5wdXNoKHBsYXllcikpO1xuXG4gICAgICAgIGluc3RydWN0aW9uLnByZVN0eWxlUHJvcHMuZm9yRWFjaCgoc3RyaW5nTWFwLCBlbGVtZW50KSA9PiB7XG4gICAgICAgICAgY29uc3QgcHJvcHMgPSBPYmplY3Qua2V5cyhzdHJpbmdNYXApO1xuICAgICAgICAgIGlmIChwcm9wcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGxldCBzZXRWYWw6IFNldDxzdHJpbmc+ID0gYWxsUHJlU3R5bGVFbGVtZW50cy5nZXQoZWxlbWVudCkhO1xuICAgICAgICAgICAgaWYgKCFzZXRWYWwpIHtcbiAgICAgICAgICAgICAgYWxsUHJlU3R5bGVFbGVtZW50cy5zZXQoZWxlbWVudCwgc2V0VmFsID0gbmV3IFNldDxzdHJpbmc+KCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJvcHMuZm9yRWFjaChwcm9wID0+IHNldFZhbC5hZGQocHJvcCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaW5zdHJ1Y3Rpb24ucG9zdFN0eWxlUHJvcHMuZm9yRWFjaCgoc3RyaW5nTWFwLCBlbGVtZW50KSA9PiB7XG4gICAgICAgICAgY29uc3QgcHJvcHMgPSBPYmplY3Qua2V5cyhzdHJpbmdNYXApO1xuICAgICAgICAgIGxldCBzZXRWYWw6IFNldDxzdHJpbmc+ID0gYWxsUG9zdFN0eWxlRWxlbWVudHMuZ2V0KGVsZW1lbnQpITtcbiAgICAgICAgICBpZiAoIXNldFZhbCkge1xuICAgICAgICAgICAgYWxsUG9zdFN0eWxlRWxlbWVudHMuc2V0KGVsZW1lbnQsIHNldFZhbCA9IG5ldyBTZXQ8c3RyaW5nPigpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcHJvcHMuZm9yRWFjaChwcm9wID0+IHNldFZhbC5hZGQocHJvcCkpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChlcnJvbmVvdXNUcmFuc2l0aW9ucy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGVycm9yczogRXJyb3JbXSA9IFtdO1xuICAgICAgZXJyb25lb3VzVHJhbnNpdGlvbnMuZm9yRWFjaChpbnN0cnVjdGlvbiA9PiB7XG4gICAgICAgIGVycm9ycy5wdXNoKHRyYW5zaXRpb25GYWlsZWQoaW5zdHJ1Y3Rpb24udHJpZ2dlck5hbWUsIGluc3RydWN0aW9uLmVycm9ycyEpKTtcbiAgICAgIH0pO1xuXG4gICAgICBhbGxQbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHBsYXllci5kZXN0cm95KCkpO1xuICAgICAgdGhpcy5yZXBvcnRFcnJvcihlcnJvcnMpO1xuICAgIH1cblxuICAgIGNvbnN0IGFsbFByZXZpb3VzUGxheWVyc01hcCA9IG5ldyBNYXA8YW55LCBUcmFuc2l0aW9uQW5pbWF0aW9uUGxheWVyW10+KCk7XG4gICAgLy8gdGhpcyBtYXAgdGVsbHMgdXMgd2hpY2ggZWxlbWVudCBpbiB0aGUgRE9NIHRyZWUgaXMgY29udGFpbmVkIGJ5XG4gICAgLy8gd2hpY2ggYW5pbWF0aW9uLiBGdXJ0aGVyIGRvd24gdGhpcyBtYXAgd2lsbCBnZXQgcG9wdWxhdGVkIG9uY2VcbiAgICAvLyB0aGUgcGxheWVycyBhcmUgYnVpbHQgYW5kIGluIGRvaW5nIHNvIHdlIGNhbiB1c2UgaXQgdG8gZWZmaWNpZW50bHlcbiAgICAvLyBmaWd1cmUgb3V0IGlmIGEgc3ViIHBsYXllciBpcyBza2lwcGVkIGR1ZSB0byBhIHBhcmVudCBwbGF5ZXIgaGF2aW5nIHByaW9yaXR5LlxuICAgIGNvbnN0IGFuaW1hdGlvbkVsZW1lbnRNYXAgPSBuZXcgTWFwPGFueSwgYW55PigpO1xuICAgIHF1ZXVlZEluc3RydWN0aW9ucy5mb3JFYWNoKGVudHJ5ID0+IHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBlbnRyeS5lbGVtZW50O1xuICAgICAgaWYgKHN1YlRpbWVsaW5lcy5oYXMoZWxlbWVudCkpIHtcbiAgICAgICAgYW5pbWF0aW9uRWxlbWVudE1hcC5zZXQoZWxlbWVudCwgZWxlbWVudCk7XG4gICAgICAgIHRoaXMuX2JlZm9yZUFuaW1hdGlvbkJ1aWxkKFxuICAgICAgICAgICAgZW50cnkucGxheWVyLm5hbWVzcGFjZUlkLCBlbnRyeS5pbnN0cnVjdGlvbiwgYWxsUHJldmlvdXNQbGF5ZXJzTWFwKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHNraXBwZWRQbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBwbGF5ZXIuZWxlbWVudDtcbiAgICAgIGNvbnN0IHByZXZpb3VzUGxheWVycyA9XG4gICAgICAgICAgdGhpcy5fZ2V0UHJldmlvdXNQbGF5ZXJzKGVsZW1lbnQsIGZhbHNlLCBwbGF5ZXIubmFtZXNwYWNlSWQsIHBsYXllci50cmlnZ2VyTmFtZSwgbnVsbCk7XG4gICAgICBwcmV2aW91c1BsYXllcnMuZm9yRWFjaChwcmV2UGxheWVyID0+IHtcbiAgICAgICAgZ2V0T3JTZXRBc0luTWFwKGFsbFByZXZpb3VzUGxheWVyc01hcCwgZWxlbWVudCwgW10pLnB1c2gocHJldlBsYXllcik7XG4gICAgICAgIHByZXZQbGF5ZXIuZGVzdHJveSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyB0aGlzIGlzIGEgc3BlY2lhbCBjYXNlIGZvciBub2RlcyB0aGF0IHdpbGwgYmUgcmVtb3ZlZCBlaXRoZXIgYnlcbiAgICAvLyBoYXZpbmcgdGhlaXIgb3duIGxlYXZlIGFuaW1hdGlvbnMgb3IgYnkgYmVpbmcgcXVlcmllZCBpbiBhIGNvbnRhaW5lclxuICAgIC8vIHRoYXQgd2lsbCBiZSByZW1vdmVkIG9uY2UgYSBwYXJlbnQgYW5pbWF0aW9uIGlzIGNvbXBsZXRlLiBUaGUgaWRlYVxuICAgIC8vIGhlcmUgaXMgdGhhdCAqIHN0eWxlcyBtdXN0IGJlIGlkZW50aWNhbCB0byAhIHN0eWxlcyBiZWNhdXNlIG9mXG4gICAgLy8gYmFja3dhcmRzIGNvbXBhdGliaWxpdHkgKCogaXMgYWxzbyBmaWxsZWQgaW4gYnkgZGVmYXVsdCBpbiBtYW55IHBsYWNlcykuXG4gICAgLy8gT3RoZXJ3aXNlICogc3R5bGVzIHdpbGwgcmV0dXJuIGFuIGVtcHR5IHZhbHVlIG9yIFwiYXV0b1wiIHNpbmNlIHRoZSBlbGVtZW50XG4gICAgLy8gcGFzc2VkIHRvIGdldENvbXB1dGVkU3R5bGUgd2lsbCBub3QgYmUgdmlzaWJsZSAoc2luY2UgKiA9PT0gZGVzdGluYXRpb24pXG4gICAgY29uc3QgcmVwbGFjZU5vZGVzID0gYWxsTGVhdmVOb2Rlcy5maWx0ZXIobm9kZSA9PiB7XG4gICAgICByZXR1cm4gcmVwbGFjZVBvc3RTdHlsZXNBc1ByZShub2RlLCBhbGxQcmVTdHlsZUVsZW1lbnRzLCBhbGxQb3N0U3R5bGVFbGVtZW50cyk7XG4gICAgfSk7XG5cbiAgICAvLyBQT1NUIFNUQUdFOiBmaWxsIHRoZSAqIHN0eWxlc1xuICAgIGNvbnN0IHBvc3RTdHlsZXNNYXAgPSBuZXcgTWFwPGFueSwgybVTdHlsZURhdGE+KCk7XG4gICAgY29uc3QgYWxsTGVhdmVRdWVyaWVkTm9kZXMgPSBjbG9ha0FuZENvbXB1dGVTdHlsZXMoXG4gICAgICAgIHBvc3RTdHlsZXNNYXAsIHRoaXMuZHJpdmVyLCBsZWF2ZU5vZGVzV2l0aG91dEFuaW1hdGlvbnMsIGFsbFBvc3RTdHlsZUVsZW1lbnRzLCBBVVRPX1NUWUxFKTtcblxuICAgIGFsbExlYXZlUXVlcmllZE5vZGVzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICBpZiAocmVwbGFjZVBvc3RTdHlsZXNBc1ByZShub2RlLCBhbGxQcmVTdHlsZUVsZW1lbnRzLCBhbGxQb3N0U3R5bGVFbGVtZW50cykpIHtcbiAgICAgICAgcmVwbGFjZU5vZGVzLnB1c2gobm9kZSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBQUkUgU1RBR0U6IGZpbGwgdGhlICEgc3R5bGVzXG4gICAgY29uc3QgcHJlU3R5bGVzTWFwID0gbmV3IE1hcDxhbnksIMm1U3R5bGVEYXRhPigpO1xuICAgIGVudGVyTm9kZU1hcC5mb3JFYWNoKChub2Rlcywgcm9vdCkgPT4ge1xuICAgICAgY2xvYWtBbmRDb21wdXRlU3R5bGVzKFxuICAgICAgICAgIHByZVN0eWxlc01hcCwgdGhpcy5kcml2ZXIsIG5ldyBTZXQobm9kZXMpLCBhbGxQcmVTdHlsZUVsZW1lbnRzLCBQUkVfU1RZTEUpO1xuICAgIH0pO1xuXG4gICAgcmVwbGFjZU5vZGVzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICBjb25zdCBwb3N0ID0gcG9zdFN0eWxlc01hcC5nZXQobm9kZSk7XG4gICAgICBjb25zdCBwcmUgPSBwcmVTdHlsZXNNYXAuZ2V0KG5vZGUpO1xuICAgICAgcG9zdFN0eWxlc01hcC5zZXQobm9kZSwgey4uLnBvc3QsIC4uLnByZX0gYXMgYW55KTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHJvb3RQbGF5ZXJzOiBUcmFuc2l0aW9uQW5pbWF0aW9uUGxheWVyW10gPSBbXTtcbiAgICBjb25zdCBzdWJQbGF5ZXJzOiBUcmFuc2l0aW9uQW5pbWF0aW9uUGxheWVyW10gPSBbXTtcbiAgICBjb25zdCBOT19QQVJFTlRfQU5JTUFUSU9OX0VMRU1FTlRfREVURUNURUQgPSB7fTtcbiAgICBxdWV1ZWRJbnN0cnVjdGlvbnMuZm9yRWFjaChlbnRyeSA9PiB7XG4gICAgICBjb25zdCB7ZWxlbWVudCwgcGxheWVyLCBpbnN0cnVjdGlvbn0gPSBlbnRyeTtcbiAgICAgIC8vIHRoaXMgbWVhbnMgdGhhdCBpdCB3YXMgbmV2ZXIgY29uc3VtZWQgYnkgYSBwYXJlbnQgYW5pbWF0aW9uIHdoaWNoXG4gICAgICAvLyBtZWFucyB0aGF0IGl0IGlzIGluZGVwZW5kZW50IGFuZCB0aGVyZWZvcmUgc2hvdWxkIGJlIHNldCBmb3IgYW5pbWF0aW9uXG4gICAgICBpZiAoc3ViVGltZWxpbmVzLmhhcyhlbGVtZW50KSkge1xuICAgICAgICBpZiAoZGlzYWJsZWRFbGVtZW50c1NldC5oYXMoZWxlbWVudCkpIHtcbiAgICAgICAgICBwbGF5ZXIub25EZXN0cm95KCgpID0+IHNldFN0eWxlcyhlbGVtZW50LCBpbnN0cnVjdGlvbi50b1N0eWxlcykpO1xuICAgICAgICAgIHBsYXllci5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgcGxheWVyLm92ZXJyaWRlVG90YWxUaW1lKGluc3RydWN0aW9uLnRvdGFsVGltZSk7XG4gICAgICAgICAgc2tpcHBlZFBsYXllcnMucHVzaChwbGF5ZXIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRoaXMgd2lsbCBmbG93IHVwIHRoZSBET00gYW5kIHF1ZXJ5IHRoZSBtYXAgdG8gZmlndXJlIG91dFxuICAgICAgICAvLyBpZiBhIHBhcmVudCBhbmltYXRpb24gaGFzIHByaW9yaXR5IG92ZXIgaXQuIEluIHRoZSBzaXR1YXRpb25cbiAgICAgICAgLy8gdGhhdCBhIHBhcmVudCBpcyBkZXRlY3RlZCB0aGVuIGl0IHdpbGwgY2FuY2VsIHRoZSBsb29wLiBJZlxuICAgICAgICAvLyBub3RoaW5nIGlzIGRldGVjdGVkLCBvciBpdCB0YWtlcyBhIGZldyBob3BzIHRvIGZpbmQgYSBwYXJlbnQsXG4gICAgICAgIC8vIHRoZW4gaXQgd2lsbCBmaWxsIGluIHRoZSBtaXNzaW5nIG5vZGVzIGFuZCBzaWduYWwgdGhlbSBhcyBoYXZpbmdcbiAgICAgICAgLy8gYSBkZXRlY3RlZCBwYXJlbnQgKG9yIGEgTk9fUEFSRU5UIHZhbHVlIHZpYSBhIHNwZWNpYWwgY29uc3RhbnQpLlxuICAgICAgICBsZXQgcGFyZW50V2l0aEFuaW1hdGlvbjogYW55ID0gTk9fUEFSRU5UX0FOSU1BVElPTl9FTEVNRU5UX0RFVEVDVEVEO1xuICAgICAgICBpZiAoYW5pbWF0aW9uRWxlbWVudE1hcC5zaXplID4gMSkge1xuICAgICAgICAgIGxldCBlbG0gPSBlbGVtZW50O1xuICAgICAgICAgIGNvbnN0IHBhcmVudHNUb0FkZDogYW55W10gPSBbXTtcbiAgICAgICAgICB3aGlsZSAoZWxtID0gZWxtLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGRldGVjdGVkUGFyZW50ID0gYW5pbWF0aW9uRWxlbWVudE1hcC5nZXQoZWxtKTtcbiAgICAgICAgICAgIGlmIChkZXRlY3RlZFBhcmVudCkge1xuICAgICAgICAgICAgICBwYXJlbnRXaXRoQW5pbWF0aW9uID0gZGV0ZWN0ZWRQYXJlbnQ7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGFyZW50c1RvQWRkLnB1c2goZWxtKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcGFyZW50c1RvQWRkLmZvckVhY2gocGFyZW50ID0+IGFuaW1hdGlvbkVsZW1lbnRNYXAuc2V0KHBhcmVudCwgcGFyZW50V2l0aEFuaW1hdGlvbikpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaW5uZXJQbGF5ZXIgPSB0aGlzLl9idWlsZEFuaW1hdGlvbihcbiAgICAgICAgICAgIHBsYXllci5uYW1lc3BhY2VJZCwgaW5zdHJ1Y3Rpb24sIGFsbFByZXZpb3VzUGxheWVyc01hcCwgc2tpcHBlZFBsYXllcnNNYXAsIHByZVN0eWxlc01hcCxcbiAgICAgICAgICAgIHBvc3RTdHlsZXNNYXApO1xuXG4gICAgICAgIHBsYXllci5zZXRSZWFsUGxheWVyKGlubmVyUGxheWVyKTtcblxuICAgICAgICBpZiAocGFyZW50V2l0aEFuaW1hdGlvbiA9PT0gTk9fUEFSRU5UX0FOSU1BVElPTl9FTEVNRU5UX0RFVEVDVEVEKSB7XG4gICAgICAgICAgcm9vdFBsYXllcnMucHVzaChwbGF5ZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IHBhcmVudFBsYXllcnMgPSB0aGlzLnBsYXllcnNCeUVsZW1lbnQuZ2V0KHBhcmVudFdpdGhBbmltYXRpb24pO1xuICAgICAgICAgIGlmIChwYXJlbnRQbGF5ZXJzICYmIHBhcmVudFBsYXllcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBwbGF5ZXIucGFyZW50UGxheWVyID0gb3B0aW1pemVHcm91cFBsYXllcihwYXJlbnRQbGF5ZXJzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2tpcHBlZFBsYXllcnMucHVzaChwbGF5ZXIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlcmFzZVN0eWxlcyhlbGVtZW50LCBpbnN0cnVjdGlvbi5mcm9tU3R5bGVzKTtcbiAgICAgICAgcGxheWVyLm9uRGVzdHJveSgoKSA9PiBzZXRTdHlsZXMoZWxlbWVudCwgaW5zdHJ1Y3Rpb24udG9TdHlsZXMpKTtcbiAgICAgICAgLy8gdGhlcmUgc3RpbGwgbWlnaHQgYmUgYSBhbmNlc3RvciBwbGF5ZXIgYW5pbWF0aW5nIHRoaXNcbiAgICAgICAgLy8gZWxlbWVudCB0aGVyZWZvcmUgd2Ugd2lsbCBzdGlsbCBhZGQgaXQgYXMgYSBzdWIgcGxheWVyXG4gICAgICAgIC8vIGV2ZW4gaWYgaXRzIGFuaW1hdGlvbiBtYXkgYmUgZGlzYWJsZWRcbiAgICAgICAgc3ViUGxheWVycy5wdXNoKHBsYXllcik7XG4gICAgICAgIGlmIChkaXNhYmxlZEVsZW1lbnRzU2V0LmhhcyhlbGVtZW50KSkge1xuICAgICAgICAgIHNraXBwZWRQbGF5ZXJzLnB1c2gocGxheWVyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gZmluZCBhbGwgb2YgdGhlIHN1YiBwbGF5ZXJzJyBjb3JyZXNwb25kaW5nIGlubmVyIGFuaW1hdGlvbiBwbGF5ZXJzXG4gICAgc3ViUGxheWVycy5mb3JFYWNoKHBsYXllciA9PiB7XG4gICAgICAvLyBldmVuIGlmIG5vIHBsYXllcnMgYXJlIGZvdW5kIGZvciBhIHN1YiBhbmltYXRpb24gaXRcbiAgICAgIC8vIHdpbGwgc3RpbGwgY29tcGxldGUgaXRzZWxmIGFmdGVyIHRoZSBuZXh0IHRpY2sgc2luY2UgaXQncyBOb29wXG4gICAgICBjb25zdCBwbGF5ZXJzRm9yRWxlbWVudCA9IHNraXBwZWRQbGF5ZXJzTWFwLmdldChwbGF5ZXIuZWxlbWVudCk7XG4gICAgICBpZiAocGxheWVyc0ZvckVsZW1lbnQgJiYgcGxheWVyc0ZvckVsZW1lbnQubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IGlubmVyUGxheWVyID0gb3B0aW1pemVHcm91cFBsYXllcihwbGF5ZXJzRm9yRWxlbWVudCk7XG4gICAgICAgIHBsYXllci5zZXRSZWFsUGxheWVyKGlubmVyUGxheWVyKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIHRoZSByZWFzb24gd2h5IHdlIGRvbid0IGFjdHVhbGx5IHBsYXkgdGhlIGFuaW1hdGlvbiBpc1xuICAgIC8vIGJlY2F1c2UgYWxsIHRoYXQgYSBza2lwcGVkIHBsYXllciBpcyBkZXNpZ25lZCB0byBkbyBpcyB0b1xuICAgIC8vIGZpcmUgdGhlIHN0YXJ0L2RvbmUgdHJhbnNpdGlvbiBjYWxsYmFjayBldmVudHNcbiAgICBza2lwcGVkUGxheWVycy5mb3JFYWNoKHBsYXllciA9PiB7XG4gICAgICBpZiAocGxheWVyLnBhcmVudFBsYXllcikge1xuICAgICAgICBwbGF5ZXIuc3luY1BsYXllckV2ZW50cyhwbGF5ZXIucGFyZW50UGxheWVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBsYXllci5kZXN0cm95KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBydW4gdGhyb3VnaCBhbGwgb2YgdGhlIHF1ZXVlZCByZW1vdmFscyBhbmQgc2VlIGlmIHRoZXlcbiAgICAvLyB3ZXJlIHBpY2tlZCB1cCBieSBhIHF1ZXJ5LiBJZiBub3QgdGhlbiBwZXJmb3JtIHRoZSByZW1vdmFsXG4gICAgLy8gb3BlcmF0aW9uIHJpZ2h0IGF3YXkgdW5sZXNzIGEgcGFyZW50IGFuaW1hdGlvbiBpcyBvbmdvaW5nLlxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWxsTGVhdmVOb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZWxlbWVudCA9IGFsbExlYXZlTm9kZXNbaV07XG4gICAgICBjb25zdCBkZXRhaWxzID0gZWxlbWVudFtSRU1PVkFMX0ZMQUddIGFzIEVsZW1lbnRBbmltYXRpb25TdGF0ZTtcbiAgICAgIHJlbW92ZUNsYXNzKGVsZW1lbnQsIExFQVZFX0NMQVNTTkFNRSk7XG5cbiAgICAgIC8vIHRoaXMgbWVhbnMgdGhlIGVsZW1lbnQgaGFzIGEgcmVtb3ZhbCBhbmltYXRpb24gdGhhdCBpcyBiZWluZ1xuICAgICAgLy8gdGFrZW4gY2FyZSBvZiBhbmQgdGhlcmVmb3JlIHRoZSBpbm5lciBlbGVtZW50cyB3aWxsIGhhbmcgYXJvdW5kXG4gICAgICAvLyB1bnRpbCB0aGF0IGFuaW1hdGlvbiBpcyBvdmVyIChvciB0aGUgcGFyZW50IHF1ZXJpZWQgYW5pbWF0aW9uKVxuICAgICAgaWYgKGRldGFpbHMgJiYgZGV0YWlscy5oYXNBbmltYXRpb24pIGNvbnRpbnVlO1xuXG4gICAgICBsZXQgcGxheWVyczogVHJhbnNpdGlvbkFuaW1hdGlvblBsYXllcltdID0gW107XG5cbiAgICAgIC8vIGlmIHRoaXMgZWxlbWVudCBpcyBxdWVyaWVkIG9yIGlmIGl0IGNvbnRhaW5zIHF1ZXJpZWQgY2hpbGRyZW5cbiAgICAgIC8vIHRoZW4gd2Ugd2FudCBmb3IgdGhlIGVsZW1lbnQgbm90IHRvIGJlIHJlbW92ZWQgZnJvbSB0aGUgcGFnZVxuICAgICAgLy8gdW50aWwgdGhlIHF1ZXJpZWQgYW5pbWF0aW9ucyBoYXZlIGZpbmlzaGVkXG4gICAgICBpZiAocXVlcmllZEVsZW1lbnRzLnNpemUpIHtcbiAgICAgICAgbGV0IHF1ZXJpZWRQbGF5ZXJSZXN1bHRzID0gcXVlcmllZEVsZW1lbnRzLmdldChlbGVtZW50KTtcbiAgICAgICAgaWYgKHF1ZXJpZWRQbGF5ZXJSZXN1bHRzICYmIHF1ZXJpZWRQbGF5ZXJSZXN1bHRzLmxlbmd0aCkge1xuICAgICAgICAgIHBsYXllcnMucHVzaCguLi5xdWVyaWVkUGxheWVyUmVzdWx0cyk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcXVlcmllZElubmVyRWxlbWVudHMgPSB0aGlzLmRyaXZlci5xdWVyeShlbGVtZW50LCBOR19BTklNQVRJTkdfU0VMRUNUT1IsIHRydWUpO1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHF1ZXJpZWRJbm5lckVsZW1lbnRzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgbGV0IHF1ZXJpZWRQbGF5ZXJzID0gcXVlcmllZEVsZW1lbnRzLmdldChxdWVyaWVkSW5uZXJFbGVtZW50c1tqXSk7XG4gICAgICAgICAgaWYgKHF1ZXJpZWRQbGF5ZXJzICYmIHF1ZXJpZWRQbGF5ZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgcGxheWVycy5wdXNoKC4uLnF1ZXJpZWRQbGF5ZXJzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgYWN0aXZlUGxheWVycyA9IHBsYXllcnMuZmlsdGVyKHAgPT4gIXAuZGVzdHJveWVkKTtcbiAgICAgIGlmIChhY3RpdmVQbGF5ZXJzLmxlbmd0aCkge1xuICAgICAgICByZW1vdmVOb2Rlc0FmdGVyQW5pbWF0aW9uRG9uZSh0aGlzLCBlbGVtZW50LCBhY3RpdmVQbGF5ZXJzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucHJvY2Vzc0xlYXZlTm9kZShlbGVtZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB0aGlzIGlzIHJlcXVpcmVkIHNvIHRoZSBjbGVhbnVwIG1ldGhvZCBkb2Vzbid0IHJlbW92ZSB0aGVtXG4gICAgYWxsTGVhdmVOb2Rlcy5sZW5ndGggPSAwO1xuXG4gICAgcm9vdFBsYXllcnMuZm9yRWFjaChwbGF5ZXIgPT4ge1xuICAgICAgdGhpcy5wbGF5ZXJzLnB1c2gocGxheWVyKTtcbiAgICAgIHBsYXllci5vbkRvbmUoKCkgPT4ge1xuICAgICAgICBwbGF5ZXIuZGVzdHJveSgpO1xuXG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5wbGF5ZXJzLmluZGV4T2YocGxheWVyKTtcbiAgICAgICAgdGhpcy5wbGF5ZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICB9KTtcbiAgICAgIHBsYXllci5wbGF5KCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcm9vdFBsYXllcnM7XG4gIH1cblxuICBlbGVtZW50Q29udGFpbnNEYXRhKG5hbWVzcGFjZUlkOiBzdHJpbmcsIGVsZW1lbnQ6IGFueSkge1xuICAgIGxldCBjb250YWluc0RhdGEgPSBmYWxzZTtcbiAgICBjb25zdCBkZXRhaWxzID0gZWxlbWVudFtSRU1PVkFMX0ZMQUddIGFzIEVsZW1lbnRBbmltYXRpb25TdGF0ZTtcbiAgICBpZiAoZGV0YWlscyAmJiBkZXRhaWxzLnNldEZvclJlbW92YWwpIGNvbnRhaW5zRGF0YSA9IHRydWU7XG4gICAgaWYgKHRoaXMucGxheWVyc0J5RWxlbWVudC5oYXMoZWxlbWVudCkpIGNvbnRhaW5zRGF0YSA9IHRydWU7XG4gICAgaWYgKHRoaXMucGxheWVyc0J5UXVlcmllZEVsZW1lbnQuaGFzKGVsZW1lbnQpKSBjb250YWluc0RhdGEgPSB0cnVlO1xuICAgIGlmICh0aGlzLnN0YXRlc0J5RWxlbWVudC5oYXMoZWxlbWVudCkpIGNvbnRhaW5zRGF0YSA9IHRydWU7XG4gICAgcmV0dXJuIHRoaXMuX2ZldGNoTmFtZXNwYWNlKG5hbWVzcGFjZUlkKS5lbGVtZW50Q29udGFpbnNEYXRhKGVsZW1lbnQpIHx8IGNvbnRhaW5zRGF0YTtcbiAgfVxuXG4gIGFmdGVyRmx1c2goY2FsbGJhY2s6ICgpID0+IGFueSkge1xuICAgIHRoaXMuX2ZsdXNoRm5zLnB1c2goY2FsbGJhY2spO1xuICB9XG5cbiAgYWZ0ZXJGbHVzaEFuaW1hdGlvbnNEb25lKGNhbGxiYWNrOiAoKSA9PiBhbnkpIHtcbiAgICB0aGlzLl93aGVuUXVpZXRGbnMucHVzaChjYWxsYmFjayk7XG4gIH1cblxuICBwcml2YXRlIF9nZXRQcmV2aW91c1BsYXllcnMoXG4gICAgICBlbGVtZW50OiBzdHJpbmcsIGlzUXVlcmllZEVsZW1lbnQ6IGJvb2xlYW4sIG5hbWVzcGFjZUlkPzogc3RyaW5nLCB0cmlnZ2VyTmFtZT86IHN0cmluZyxcbiAgICAgIHRvU3RhdGVWYWx1ZT86IGFueSk6IFRyYW5zaXRpb25BbmltYXRpb25QbGF5ZXJbXSB7XG4gICAgbGV0IHBsYXllcnM6IFRyYW5zaXRpb25BbmltYXRpb25QbGF5ZXJbXSA9IFtdO1xuICAgIGlmIChpc1F1ZXJpZWRFbGVtZW50KSB7XG4gICAgICBjb25zdCBxdWVyaWVkRWxlbWVudFBsYXllcnMgPSB0aGlzLnBsYXllcnNCeVF1ZXJpZWRFbGVtZW50LmdldChlbGVtZW50KTtcbiAgICAgIGlmIChxdWVyaWVkRWxlbWVudFBsYXllcnMpIHtcbiAgICAgICAgcGxheWVycyA9IHF1ZXJpZWRFbGVtZW50UGxheWVycztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZWxlbWVudFBsYXllcnMgPSB0aGlzLnBsYXllcnNCeUVsZW1lbnQuZ2V0KGVsZW1lbnQpO1xuICAgICAgaWYgKGVsZW1lbnRQbGF5ZXJzKSB7XG4gICAgICAgIGNvbnN0IGlzUmVtb3ZhbEFuaW1hdGlvbiA9ICF0b1N0YXRlVmFsdWUgfHwgdG9TdGF0ZVZhbHVlID09IFZPSURfVkFMVUU7XG4gICAgICAgIGVsZW1lbnRQbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHtcbiAgICAgICAgICBpZiAocGxheWVyLnF1ZXVlZCkgcmV0dXJuO1xuICAgICAgICAgIGlmICghaXNSZW1vdmFsQW5pbWF0aW9uICYmIHBsYXllci50cmlnZ2VyTmFtZSAhPSB0cmlnZ2VyTmFtZSkgcmV0dXJuO1xuICAgICAgICAgIHBsYXllcnMucHVzaChwbGF5ZXIpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG5hbWVzcGFjZUlkIHx8IHRyaWdnZXJOYW1lKSB7XG4gICAgICBwbGF5ZXJzID0gcGxheWVycy5maWx0ZXIocGxheWVyID0+IHtcbiAgICAgICAgaWYgKG5hbWVzcGFjZUlkICYmIG5hbWVzcGFjZUlkICE9IHBsYXllci5uYW1lc3BhY2VJZCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAodHJpZ2dlck5hbWUgJiYgdHJpZ2dlck5hbWUgIT0gcGxheWVyLnRyaWdnZXJOYW1lKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBwbGF5ZXJzO1xuICB9XG5cbiAgcHJpdmF0ZSBfYmVmb3JlQW5pbWF0aW9uQnVpbGQoXG4gICAgICBuYW1lc3BhY2VJZDogc3RyaW5nLCBpbnN0cnVjdGlvbjogQW5pbWF0aW9uVHJhbnNpdGlvbkluc3RydWN0aW9uLFxuICAgICAgYWxsUHJldmlvdXNQbGF5ZXJzTWFwOiBNYXA8YW55LCBUcmFuc2l0aW9uQW5pbWF0aW9uUGxheWVyW10+KSB7XG4gICAgY29uc3QgdHJpZ2dlck5hbWUgPSBpbnN0cnVjdGlvbi50cmlnZ2VyTmFtZTtcbiAgICBjb25zdCByb290RWxlbWVudCA9IGluc3RydWN0aW9uLmVsZW1lbnQ7XG5cbiAgICAvLyB3aGVuIGEgcmVtb3ZhbCBhbmltYXRpb24gb2NjdXJzLCBBTEwgcHJldmlvdXMgcGxheWVycyBhcmUgY29sbGVjdGVkXG4gICAgLy8gYW5kIGRlc3Ryb3llZCAoZXZlbiBpZiB0aGV5IGFyZSBvdXRzaWRlIG9mIHRoZSBjdXJyZW50IG5hbWVzcGFjZSlcbiAgICBjb25zdCB0YXJnZXROYW1lU3BhY2VJZDogc3RyaW5nfHVuZGVmaW5lZCA9XG4gICAgICAgIGluc3RydWN0aW9uLmlzUmVtb3ZhbFRyYW5zaXRpb24gPyB1bmRlZmluZWQgOiBuYW1lc3BhY2VJZDtcbiAgICBjb25zdCB0YXJnZXRUcmlnZ2VyTmFtZTogc3RyaW5nfHVuZGVmaW5lZCA9XG4gICAgICAgIGluc3RydWN0aW9uLmlzUmVtb3ZhbFRyYW5zaXRpb24gPyB1bmRlZmluZWQgOiB0cmlnZ2VyTmFtZTtcblxuICAgIGZvciAoY29uc3QgdGltZWxpbmVJbnN0cnVjdGlvbiBvZiBpbnN0cnVjdGlvbi50aW1lbGluZXMpIHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aW1lbGluZUluc3RydWN0aW9uLmVsZW1lbnQ7XG4gICAgICBjb25zdCBpc1F1ZXJpZWRFbGVtZW50ID0gZWxlbWVudCAhPT0gcm9vdEVsZW1lbnQ7XG4gICAgICBjb25zdCBwbGF5ZXJzID0gZ2V0T3JTZXRBc0luTWFwKGFsbFByZXZpb3VzUGxheWVyc01hcCwgZWxlbWVudCwgW10pO1xuICAgICAgY29uc3QgcHJldmlvdXNQbGF5ZXJzID0gdGhpcy5fZ2V0UHJldmlvdXNQbGF5ZXJzKFxuICAgICAgICAgIGVsZW1lbnQsIGlzUXVlcmllZEVsZW1lbnQsIHRhcmdldE5hbWVTcGFjZUlkLCB0YXJnZXRUcmlnZ2VyTmFtZSwgaW5zdHJ1Y3Rpb24udG9TdGF0ZSk7XG4gICAgICBwcmV2aW91c1BsYXllcnMuZm9yRWFjaChwbGF5ZXIgPT4ge1xuICAgICAgICBjb25zdCByZWFsUGxheWVyID0gKHBsYXllciBhcyBUcmFuc2l0aW9uQW5pbWF0aW9uUGxheWVyKS5nZXRSZWFsUGxheWVyKCkgYXMgYW55O1xuICAgICAgICBpZiAocmVhbFBsYXllci5iZWZvcmVEZXN0cm95KSB7XG4gICAgICAgICAgcmVhbFBsYXllci5iZWZvcmVEZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgICAgcGxheWVyLmRlc3Ryb3koKTtcbiAgICAgICAgcGxheWVycy5wdXNoKHBsYXllcik7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyB0aGlzIG5lZWRzIHRvIGJlIGRvbmUgc28gdGhhdCB0aGUgUFJFL1BPU1Qgc3R5bGVzIGNhbiBiZVxuICAgIC8vIGNvbXB1dGVkIHByb3Blcmx5IHdpdGhvdXQgaW50ZXJmZXJpbmcgd2l0aCB0aGUgcHJldmlvdXMgYW5pbWF0aW9uXG4gICAgZXJhc2VTdHlsZXMocm9vdEVsZW1lbnQsIGluc3RydWN0aW9uLmZyb21TdHlsZXMpO1xuICB9XG5cbiAgcHJpdmF0ZSBfYnVpbGRBbmltYXRpb24oXG4gICAgICBuYW1lc3BhY2VJZDogc3RyaW5nLCBpbnN0cnVjdGlvbjogQW5pbWF0aW9uVHJhbnNpdGlvbkluc3RydWN0aW9uLFxuICAgICAgYWxsUHJldmlvdXNQbGF5ZXJzTWFwOiBNYXA8YW55LCBUcmFuc2l0aW9uQW5pbWF0aW9uUGxheWVyW10+LFxuICAgICAgc2tpcHBlZFBsYXllcnNNYXA6IE1hcDxhbnksIEFuaW1hdGlvblBsYXllcltdPiwgcHJlU3R5bGVzTWFwOiBNYXA8YW55LCDJtVN0eWxlRGF0YT4sXG4gICAgICBwb3N0U3R5bGVzTWFwOiBNYXA8YW55LCDJtVN0eWxlRGF0YT4pOiBBbmltYXRpb25QbGF5ZXIge1xuICAgIGNvbnN0IHRyaWdnZXJOYW1lID0gaW5zdHJ1Y3Rpb24udHJpZ2dlck5hbWU7XG4gICAgY29uc3Qgcm9vdEVsZW1lbnQgPSBpbnN0cnVjdGlvbi5lbGVtZW50O1xuXG4gICAgLy8gd2UgZmlyc3QgcnVuIHRoaXMgc28gdGhhdCB0aGUgcHJldmlvdXMgYW5pbWF0aW9uIHBsYXllclxuICAgIC8vIGRhdGEgY2FuIGJlIHBhc3NlZCBpbnRvIHRoZSBzdWNjZXNzaXZlIGFuaW1hdGlvbiBwbGF5ZXJzXG4gICAgY29uc3QgYWxsUXVlcmllZFBsYXllcnM6IFRyYW5zaXRpb25BbmltYXRpb25QbGF5ZXJbXSA9IFtdO1xuICAgIGNvbnN0IGFsbENvbnN1bWVkRWxlbWVudHMgPSBuZXcgU2V0PGFueT4oKTtcbiAgICBjb25zdCBhbGxTdWJFbGVtZW50cyA9IG5ldyBTZXQ8YW55PigpO1xuICAgIGNvbnN0IGFsbE5ld1BsYXllcnMgPSBpbnN0cnVjdGlvbi50aW1lbGluZXMubWFwKHRpbWVsaW5lSW5zdHJ1Y3Rpb24gPT4ge1xuICAgICAgY29uc3QgZWxlbWVudCA9IHRpbWVsaW5lSW5zdHJ1Y3Rpb24uZWxlbWVudDtcbiAgICAgIGFsbENvbnN1bWVkRWxlbWVudHMuYWRkKGVsZW1lbnQpO1xuXG4gICAgICAvLyBGSVhNRSAobWF0c2tvKTogbWFrZSBzdXJlIHRvLWJlLXJlbW92ZWQgYW5pbWF0aW9ucyBhcmUgcmVtb3ZlZCBwcm9wZXJseVxuICAgICAgY29uc3QgZGV0YWlscyA9IGVsZW1lbnRbUkVNT1ZBTF9GTEFHXTtcbiAgICAgIGlmIChkZXRhaWxzICYmIGRldGFpbHMucmVtb3ZlZEJlZm9yZVF1ZXJpZWQpXG4gICAgICAgIHJldHVybiBuZXcgTm9vcEFuaW1hdGlvblBsYXllcih0aW1lbGluZUluc3RydWN0aW9uLmR1cmF0aW9uLCB0aW1lbGluZUluc3RydWN0aW9uLmRlbGF5KTtcblxuICAgICAgY29uc3QgaXNRdWVyaWVkRWxlbWVudCA9IGVsZW1lbnQgIT09IHJvb3RFbGVtZW50O1xuICAgICAgY29uc3QgcHJldmlvdXNQbGF5ZXJzID1cbiAgICAgICAgICBmbGF0dGVuR3JvdXBQbGF5ZXJzKChhbGxQcmV2aW91c1BsYXllcnNNYXAuZ2V0KGVsZW1lbnQpIHx8IEVNUFRZX1BMQVlFUl9BUlJBWSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKHAgPT4gcC5nZXRSZWFsUGxheWVyKCkpKVxuICAgICAgICAgICAgICAuZmlsdGVyKHAgPT4ge1xuICAgICAgICAgICAgICAgIC8vIHRoZSBgZWxlbWVudGAgaXMgbm90IGFwYXJ0IG9mIHRoZSBBbmltYXRpb25QbGF5ZXIgZGVmaW5pdGlvbiwgYnV0XG4gICAgICAgICAgICAgICAgLy8gTW9jay9XZWJBbmltYXRpb25zXG4gICAgICAgICAgICAgICAgLy8gdXNlIHRoZSBlbGVtZW50IHdpdGhpbiB0aGVpciBpbXBsZW1lbnRhdGlvbi4gVGhpcyB3aWxsIGJlIGFkZGVkIGluIEFuZ3VsYXI1IHRvXG4gICAgICAgICAgICAgICAgLy8gQW5pbWF0aW9uUGxheWVyXG4gICAgICAgICAgICAgICAgY29uc3QgcHAgPSBwIGFzIGFueTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHAuZWxlbWVudCA/IHBwLmVsZW1lbnQgPT09IGVsZW1lbnQgOiBmYWxzZTtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHByZVN0eWxlcyA9IHByZVN0eWxlc01hcC5nZXQoZWxlbWVudCk7XG4gICAgICBjb25zdCBwb3N0U3R5bGVzID0gcG9zdFN0eWxlc01hcC5nZXQoZWxlbWVudCk7XG4gICAgICBjb25zdCBrZXlmcmFtZXMgPSBub3JtYWxpemVLZXlmcmFtZXMoXG4gICAgICAgICAgdGhpcy5kcml2ZXIsIHRoaXMuX25vcm1hbGl6ZXIsIGVsZW1lbnQsIHRpbWVsaW5lSW5zdHJ1Y3Rpb24ua2V5ZnJhbWVzLCBwcmVTdHlsZXMsXG4gICAgICAgICAgcG9zdFN0eWxlcyk7XG4gICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLl9idWlsZFBsYXllcih0aW1lbGluZUluc3RydWN0aW9uLCBrZXlmcmFtZXMsIHByZXZpb3VzUGxheWVycyk7XG5cbiAgICAgIC8vIHRoaXMgbWVhbnMgdGhhdCB0aGlzIHBhcnRpY3VsYXIgcGxheWVyIGJlbG9uZ3MgdG8gYSBzdWIgdHJpZ2dlci4gSXQgaXNcbiAgICAgIC8vIGltcG9ydGFudCB0aGF0IHdlIG1hdGNoIHRoaXMgcGxheWVyIHVwIHdpdGggdGhlIGNvcnJlc3BvbmRpbmcgKEB0cmlnZ2VyLmxpc3RlbmVyKVxuICAgICAgaWYgKHRpbWVsaW5lSW5zdHJ1Y3Rpb24uc3ViVGltZWxpbmUgJiYgc2tpcHBlZFBsYXllcnNNYXApIHtcbiAgICAgICAgYWxsU3ViRWxlbWVudHMuYWRkKGVsZW1lbnQpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNRdWVyaWVkRWxlbWVudCkge1xuICAgICAgICBjb25zdCB3cmFwcGVkUGxheWVyID0gbmV3IFRyYW5zaXRpb25BbmltYXRpb25QbGF5ZXIobmFtZXNwYWNlSWQsIHRyaWdnZXJOYW1lLCBlbGVtZW50KTtcbiAgICAgICAgd3JhcHBlZFBsYXllci5zZXRSZWFsUGxheWVyKHBsYXllcik7XG4gICAgICAgIGFsbFF1ZXJpZWRQbGF5ZXJzLnB1c2god3JhcHBlZFBsYXllcik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwbGF5ZXI7XG4gICAgfSk7XG5cbiAgICBhbGxRdWVyaWVkUGxheWVycy5mb3JFYWNoKHBsYXllciA9PiB7XG4gICAgICBnZXRPclNldEFzSW5NYXAodGhpcy5wbGF5ZXJzQnlRdWVyaWVkRWxlbWVudCwgcGxheWVyLmVsZW1lbnQsIFtdKS5wdXNoKHBsYXllcik7XG4gICAgICBwbGF5ZXIub25Eb25lKCgpID0+IGRlbGV0ZU9yVW5zZXRJbk1hcCh0aGlzLnBsYXllcnNCeVF1ZXJpZWRFbGVtZW50LCBwbGF5ZXIuZWxlbWVudCwgcGxheWVyKSk7XG4gICAgfSk7XG5cbiAgICBhbGxDb25zdW1lZEVsZW1lbnRzLmZvckVhY2goZWxlbWVudCA9PiBhZGRDbGFzcyhlbGVtZW50LCBOR19BTklNQVRJTkdfQ0xBU1NOQU1FKSk7XG4gICAgY29uc3QgcGxheWVyID0gb3B0aW1pemVHcm91cFBsYXllcihhbGxOZXdQbGF5ZXJzKTtcbiAgICBwbGF5ZXIub25EZXN0cm95KCgpID0+IHtcbiAgICAgIGFsbENvbnN1bWVkRWxlbWVudHMuZm9yRWFjaChlbGVtZW50ID0+IHJlbW92ZUNsYXNzKGVsZW1lbnQsIE5HX0FOSU1BVElOR19DTEFTU05BTUUpKTtcbiAgICAgIHNldFN0eWxlcyhyb290RWxlbWVudCwgaW5zdHJ1Y3Rpb24udG9TdHlsZXMpO1xuICAgIH0pO1xuXG4gICAgLy8gdGhpcyBiYXNpY2FsbHkgbWFrZXMgYWxsIG9mIHRoZSBjYWxsYmFja3MgZm9yIHN1YiBlbGVtZW50IGFuaW1hdGlvbnNcbiAgICAvLyBiZSBkZXBlbmRlbnQgb24gdGhlIHVwcGVyIHBsYXllcnMgZm9yIHdoZW4gdGhleSBmaW5pc2hcbiAgICBhbGxTdWJFbGVtZW50cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgZ2V0T3JTZXRBc0luTWFwKHNraXBwZWRQbGF5ZXJzTWFwLCBlbGVtZW50LCBbXSkucHVzaChwbGF5ZXIpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHBsYXllcjtcbiAgfVxuXG4gIHByaXZhdGUgX2J1aWxkUGxheWVyKFxuICAgICAgaW5zdHJ1Y3Rpb246IEFuaW1hdGlvblRpbWVsaW5lSW5zdHJ1Y3Rpb24sIGtleWZyYW1lczogybVTdHlsZURhdGFbXSxcbiAgICAgIHByZXZpb3VzUGxheWVyczogQW5pbWF0aW9uUGxheWVyW10pOiBBbmltYXRpb25QbGF5ZXIge1xuICAgIGlmIChrZXlmcmFtZXMubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIHRoaXMuZHJpdmVyLmFuaW1hdGUoXG4gICAgICAgICAgaW5zdHJ1Y3Rpb24uZWxlbWVudCwga2V5ZnJhbWVzLCBpbnN0cnVjdGlvbi5kdXJhdGlvbiwgaW5zdHJ1Y3Rpb24uZGVsYXksXG4gICAgICAgICAgaW5zdHJ1Y3Rpb24uZWFzaW5nLCBwcmV2aW91c1BsYXllcnMpO1xuICAgIH1cblxuICAgIC8vIHNwZWNpYWwgY2FzZSBmb3Igd2hlbiBhbiBlbXB0eSB0cmFuc2l0aW9ufGRlZmluaXRpb24gaXMgcHJvdmlkZWRcbiAgICAvLyAuLi4gdGhlcmUgaXMgbm8gcG9pbnQgaW4gcmVuZGVyaW5nIGFuIGVtcHR5IGFuaW1hdGlvblxuICAgIHJldHVybiBuZXcgTm9vcEFuaW1hdGlvblBsYXllcihpbnN0cnVjdGlvbi5kdXJhdGlvbiwgaW5zdHJ1Y3Rpb24uZGVsYXkpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2l0aW9uQW5pbWF0aW9uUGxheWVyIGltcGxlbWVudHMgQW5pbWF0aW9uUGxheWVyIHtcbiAgcHJpdmF0ZSBfcGxheWVyOiBBbmltYXRpb25QbGF5ZXIgPSBuZXcgTm9vcEFuaW1hdGlvblBsYXllcigpO1xuICBwcml2YXRlIF9jb250YWluc1JlYWxQbGF5ZXIgPSBmYWxzZTtcblxuICBwcml2YXRlIF9xdWV1ZWRDYWxsYmFja3M6IHtbbmFtZTogc3RyaW5nXTogKCgpID0+IGFueSlbXX0gPSB7fTtcbiAgcHVibGljIHJlYWRvbmx5IGRlc3Ryb3llZCA9IGZhbHNlO1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHVibGljIHBhcmVudFBsYXllciE6IEFuaW1hdGlvblBsYXllcjtcblxuICBwdWJsaWMgbWFya2VkRm9yRGVzdHJveTogYm9vbGVhbiA9IGZhbHNlO1xuICBwdWJsaWMgZGlzYWJsZWQgPSBmYWxzZTtcblxuICByZWFkb25seSBxdWV1ZWQ6IGJvb2xlYW4gPSB0cnVlO1xuICBwdWJsaWMgcmVhZG9ubHkgdG90YWxUaW1lOiBudW1iZXIgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lc3BhY2VJZDogc3RyaW5nLCBwdWJsaWMgdHJpZ2dlck5hbWU6IHN0cmluZywgcHVibGljIGVsZW1lbnQ6IGFueSkge31cblxuICBzZXRSZWFsUGxheWVyKHBsYXllcjogQW5pbWF0aW9uUGxheWVyKSB7XG4gICAgaWYgKHRoaXMuX2NvbnRhaW5zUmVhbFBsYXllcikgcmV0dXJuO1xuXG4gICAgdGhpcy5fcGxheWVyID0gcGxheWVyO1xuICAgIE9iamVjdC5rZXlzKHRoaXMuX3F1ZXVlZENhbGxiYWNrcykuZm9yRWFjaChwaGFzZSA9PiB7XG4gICAgICB0aGlzLl9xdWV1ZWRDYWxsYmFja3NbcGhhc2VdLmZvckVhY2goXG4gICAgICAgICAgY2FsbGJhY2sgPT4gbGlzdGVuT25QbGF5ZXIocGxheWVyLCBwaGFzZSwgdW5kZWZpbmVkLCBjYWxsYmFjaykpO1xuICAgIH0pO1xuICAgIHRoaXMuX3F1ZXVlZENhbGxiYWNrcyA9IHt9O1xuICAgIHRoaXMuX2NvbnRhaW5zUmVhbFBsYXllciA9IHRydWU7XG4gICAgdGhpcy5vdmVycmlkZVRvdGFsVGltZShwbGF5ZXIudG90YWxUaW1lKTtcbiAgICAodGhpcyBhcyB7cXVldWVkOiBib29sZWFufSkucXVldWVkID0gZmFsc2U7XG4gIH1cblxuICBnZXRSZWFsUGxheWVyKCkge1xuICAgIHJldHVybiB0aGlzLl9wbGF5ZXI7XG4gIH1cblxuICBvdmVycmlkZVRvdGFsVGltZSh0b3RhbFRpbWU6IG51bWJlcikge1xuICAgICh0aGlzIGFzIGFueSkudG90YWxUaW1lID0gdG90YWxUaW1lO1xuICB9XG5cbiAgc3luY1BsYXllckV2ZW50cyhwbGF5ZXI6IEFuaW1hdGlvblBsYXllcikge1xuICAgIGNvbnN0IHAgPSB0aGlzLl9wbGF5ZXIgYXMgYW55O1xuICAgIGlmIChwLnRyaWdnZXJDYWxsYmFjaykge1xuICAgICAgcGxheWVyLm9uU3RhcnQoKCkgPT4gcC50cmlnZ2VyQ2FsbGJhY2shKCdzdGFydCcpKTtcbiAgICB9XG4gICAgcGxheWVyLm9uRG9uZSgoKSA9PiB0aGlzLmZpbmlzaCgpKTtcbiAgICBwbGF5ZXIub25EZXN0cm95KCgpID0+IHRoaXMuZGVzdHJveSgpKTtcbiAgfVxuXG4gIHByaXZhdGUgX3F1ZXVlRXZlbnQobmFtZTogc3RyaW5nLCBjYWxsYmFjazogKGV2ZW50OiBhbnkpID0+IGFueSk6IHZvaWQge1xuICAgIGdldE9yU2V0QXNJbk1hcCh0aGlzLl9xdWV1ZWRDYWxsYmFja3MsIG5hbWUsIFtdKS5wdXNoKGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9uRG9uZShmbjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnF1ZXVlZCkge1xuICAgICAgdGhpcy5fcXVldWVFdmVudCgnZG9uZScsIGZuKTtcbiAgICB9XG4gICAgdGhpcy5fcGxheWVyLm9uRG9uZShmbik7XG4gIH1cblxuICBvblN0YXJ0KGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucXVldWVkKSB7XG4gICAgICB0aGlzLl9xdWV1ZUV2ZW50KCdzdGFydCcsIGZuKTtcbiAgICB9XG4gICAgdGhpcy5fcGxheWVyLm9uU3RhcnQoZm4pO1xuICB9XG5cbiAgb25EZXN0cm95KGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucXVldWVkKSB7XG4gICAgICB0aGlzLl9xdWV1ZUV2ZW50KCdkZXN0cm95JywgZm4pO1xuICAgIH1cbiAgICB0aGlzLl9wbGF5ZXIub25EZXN0cm95KGZuKTtcbiAgfVxuXG4gIGluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5fcGxheWVyLmluaXQoKTtcbiAgfVxuXG4gIGhhc1N0YXJ0ZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucXVldWVkID8gZmFsc2UgOiB0aGlzLl9wbGF5ZXIuaGFzU3RhcnRlZCgpO1xuICB9XG5cbiAgcGxheSgpOiB2b2lkIHtcbiAgICAhdGhpcy5xdWV1ZWQgJiYgdGhpcy5fcGxheWVyLnBsYXkoKTtcbiAgfVxuXG4gIHBhdXNlKCk6IHZvaWQge1xuICAgICF0aGlzLnF1ZXVlZCAmJiB0aGlzLl9wbGF5ZXIucGF1c2UoKTtcbiAgfVxuXG4gIHJlc3RhcnQoKTogdm9pZCB7XG4gICAgIXRoaXMucXVldWVkICYmIHRoaXMuX3BsYXllci5yZXN0YXJ0KCk7XG4gIH1cblxuICBmaW5pc2goKTogdm9pZCB7XG4gICAgdGhpcy5fcGxheWVyLmZpbmlzaCgpO1xuICB9XG5cbiAgZGVzdHJveSgpOiB2b2lkIHtcbiAgICAodGhpcyBhcyB7ZGVzdHJveWVkOiBib29sZWFufSkuZGVzdHJveWVkID0gdHJ1ZTtcbiAgICB0aGlzLl9wbGF5ZXIuZGVzdHJveSgpO1xuICB9XG5cbiAgcmVzZXQoKTogdm9pZCB7XG4gICAgIXRoaXMucXVldWVkICYmIHRoaXMuX3BsYXllci5yZXNldCgpO1xuICB9XG5cbiAgc2V0UG9zaXRpb24ocDogYW55KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnF1ZXVlZCkge1xuICAgICAgdGhpcy5fcGxheWVyLnNldFBvc2l0aW9uKHApO1xuICAgIH1cbiAgfVxuXG4gIGdldFBvc2l0aW9uKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMucXVldWVkID8gMCA6IHRoaXMuX3BsYXllci5nZXRQb3NpdGlvbigpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICB0cmlnZ2VyQ2FsbGJhY2socGhhc2VOYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBwID0gdGhpcy5fcGxheWVyIGFzIGFueTtcbiAgICBpZiAocC50cmlnZ2VyQ2FsbGJhY2spIHtcbiAgICAgIHAudHJpZ2dlckNhbGxiYWNrKHBoYXNlTmFtZSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZU9yVW5zZXRJbk1hcChtYXA6IE1hcDxhbnksIGFueVtdPnx7W2tleTogc3RyaW5nXTogYW55fSwga2V5OiBhbnksIHZhbHVlOiBhbnkpIHtcbiAgbGV0IGN1cnJlbnRWYWx1ZXM6IGFueVtdfG51bGx8dW5kZWZpbmVkO1xuICBpZiAobWFwIGluc3RhbmNlb2YgTWFwKSB7XG4gICAgY3VycmVudFZhbHVlcyA9IG1hcC5nZXQoa2V5KTtcbiAgICBpZiAoY3VycmVudFZhbHVlcykge1xuICAgICAgaWYgKGN1cnJlbnRWYWx1ZXMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gY3VycmVudFZhbHVlcy5pbmRleE9mKHZhbHVlKTtcbiAgICAgICAgY3VycmVudFZhbHVlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgfVxuICAgICAgaWYgKGN1cnJlbnRWYWx1ZXMubGVuZ3RoID09IDApIHtcbiAgICAgICAgbWFwLmRlbGV0ZShrZXkpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBjdXJyZW50VmFsdWVzID0gbWFwW2tleV07XG4gICAgaWYgKGN1cnJlbnRWYWx1ZXMpIHtcbiAgICAgIGlmIChjdXJyZW50VmFsdWVzLmxlbmd0aCkge1xuICAgICAgICBjb25zdCBpbmRleCA9IGN1cnJlbnRWYWx1ZXMuaW5kZXhPZih2YWx1ZSk7XG4gICAgICAgIGN1cnJlbnRWYWx1ZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cbiAgICAgIGlmIChjdXJyZW50VmFsdWVzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIGRlbGV0ZSBtYXBba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGN1cnJlbnRWYWx1ZXM7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVRyaWdnZXJWYWx1ZSh2YWx1ZTogYW55KTogYW55IHtcbiAgLy8gd2UgdXNlIGAhPSBudWxsYCBoZXJlIGJlY2F1c2UgaXQncyB0aGUgbW9zdCBzaW1wbGVcbiAgLy8gd2F5IHRvIHRlc3QgYWdhaW5zdCBhIFwiZmFsc3lcIiB2YWx1ZSB3aXRob3V0IG1peGluZ1xuICAvLyBpbiBlbXB0eSBzdHJpbmdzIG9yIGEgemVybyB2YWx1ZS4gRE8gTk9UIE9QVElNSVpFLlxuICByZXR1cm4gdmFsdWUgIT0gbnVsbCA/IHZhbHVlIDogbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNFbGVtZW50Tm9kZShub2RlOiBhbnkpIHtcbiAgcmV0dXJuIG5vZGUgJiYgbm9kZVsnbm9kZVR5cGUnXSA9PT0gMTtcbn1cblxuZnVuY3Rpb24gaXNUcmlnZ2VyRXZlbnRWYWxpZChldmVudE5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gZXZlbnROYW1lID09ICdzdGFydCcgfHwgZXZlbnROYW1lID09ICdkb25lJztcbn1cblxuZnVuY3Rpb24gY2xvYWtFbGVtZW50KGVsZW1lbnQ6IGFueSwgdmFsdWU/OiBzdHJpbmcpIHtcbiAgY29uc3Qgb2xkVmFsdWUgPSBlbGVtZW50LnN0eWxlLmRpc3BsYXk7XG4gIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IHZhbHVlICE9IG51bGwgPyB2YWx1ZSA6ICdub25lJztcbiAgcmV0dXJuIG9sZFZhbHVlO1xufVxuXG5mdW5jdGlvbiBjbG9ha0FuZENvbXB1dGVTdHlsZXMoXG4gICAgdmFsdWVzTWFwOiBNYXA8YW55LCDJtVN0eWxlRGF0YT4sIGRyaXZlcjogQW5pbWF0aW9uRHJpdmVyLCBlbGVtZW50czogU2V0PGFueT4sXG4gICAgZWxlbWVudFByb3BzTWFwOiBNYXA8YW55LCBTZXQ8c3RyaW5nPj4sIGRlZmF1bHRTdHlsZTogc3RyaW5nKTogYW55W10ge1xuICBjb25zdCBjbG9ha1ZhbHM6IHN0cmluZ1tdID0gW107XG4gIGVsZW1lbnRzLmZvckVhY2goZWxlbWVudCA9PiBjbG9ha1ZhbHMucHVzaChjbG9ha0VsZW1lbnQoZWxlbWVudCkpKTtcblxuICBjb25zdCBmYWlsZWRFbGVtZW50czogYW55W10gPSBbXTtcblxuICBlbGVtZW50UHJvcHNNYXAuZm9yRWFjaCgocHJvcHM6IFNldDxzdHJpbmc+LCBlbGVtZW50OiBhbnkpID0+IHtcbiAgICBjb25zdCBzdHlsZXM6IMm1U3R5bGVEYXRhID0ge307XG4gICAgcHJvcHMuZm9yRWFjaChwcm9wID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gc3R5bGVzW3Byb3BdID0gZHJpdmVyLmNvbXB1dGVTdHlsZShlbGVtZW50LCBwcm9wLCBkZWZhdWx0U3R5bGUpO1xuXG4gICAgICAvLyB0aGVyZSBpcyBubyBlYXN5IHdheSB0byBkZXRlY3QgdGhpcyBiZWNhdXNlIGEgc3ViIGVsZW1lbnQgY291bGQgYmUgcmVtb3ZlZFxuICAgICAgLy8gYnkgYSBwYXJlbnQgYW5pbWF0aW9uIGVsZW1lbnQgYmVpbmcgZGV0YWNoZWQuXG4gICAgICBpZiAoIXZhbHVlIHx8IHZhbHVlLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIGVsZW1lbnRbUkVNT1ZBTF9GTEFHXSA9IE5VTExfUkVNT1ZFRF9RVUVSSUVEX1NUQVRFO1xuICAgICAgICBmYWlsZWRFbGVtZW50cy5wdXNoKGVsZW1lbnQpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHZhbHVlc01hcC5zZXQoZWxlbWVudCwgc3R5bGVzKTtcbiAgfSk7XG5cbiAgLy8gd2UgdXNlIGEgaW5kZXggdmFyaWFibGUgaGVyZSBzaW5jZSBTZXQuZm9yRWFjaChhLCBpKSBkb2VzIG5vdCByZXR1cm5cbiAgLy8gYW4gaW5kZXggdmFsdWUgZm9yIHRoZSBjbG9zdXJlIChidXQgaW5zdGVhZCBqdXN0IHRoZSB2YWx1ZSlcbiAgbGV0IGkgPSAwO1xuICBlbGVtZW50cy5mb3JFYWNoKGVsZW1lbnQgPT4gY2xvYWtFbGVtZW50KGVsZW1lbnQsIGNsb2FrVmFsc1tpKytdKSk7XG5cbiAgcmV0dXJuIGZhaWxlZEVsZW1lbnRzO1xufVxuXG4vKlxuU2luY2UgdGhlIEFuZ3VsYXIgcmVuZGVyZXIgY29kZSB3aWxsIHJldHVybiBhIGNvbGxlY3Rpb24gb2YgaW5zZXJ0ZWRcbm5vZGVzIGluIGFsbCBhcmVhcyBvZiBhIERPTSB0cmVlLCBpdCdzIHVwIHRvIHRoaXMgYWxnb3JpdGhtIHRvIGZpZ3VyZVxub3V0IHdoaWNoIG5vZGVzIGFyZSByb290cyBmb3IgZWFjaCBhbmltYXRpb24gQHRyaWdnZXIuXG5cbkJ5IHBsYWNpbmcgZWFjaCBpbnNlcnRlZCBub2RlIGludG8gYSBTZXQgYW5kIHRyYXZlcnNpbmcgdXB3YXJkcywgaXRcbmlzIHBvc3NpYmxlIHRvIGZpbmQgdGhlIEB0cmlnZ2VyIGVsZW1lbnRzIGFuZCB3ZWxsIGFueSBkaXJlY3QgKnN0YXJcbmluc2VydGlvbiBub2RlcywgaWYgYSBAdHJpZ2dlciByb290IGlzIGZvdW5kIHRoZW4gdGhlIGVudGVyIGVsZW1lbnRcbmlzIHBsYWNlZCBpbnRvIHRoZSBNYXBbQHRyaWdnZXJdIHNwb3QuXG4gKi9cbmZ1bmN0aW9uIGJ1aWxkUm9vdE1hcChyb290czogYW55W10sIG5vZGVzOiBhbnlbXSk6IE1hcDxhbnksIGFueVtdPiB7XG4gIGNvbnN0IHJvb3RNYXAgPSBuZXcgTWFwPGFueSwgYW55W10+KCk7XG4gIHJvb3RzLmZvckVhY2gocm9vdCA9PiByb290TWFwLnNldChyb290LCBbXSkpO1xuXG4gIGlmIChub2Rlcy5sZW5ndGggPT0gMCkgcmV0dXJuIHJvb3RNYXA7XG5cbiAgY29uc3QgTlVMTF9OT0RFID0gMTtcbiAgY29uc3Qgbm9kZVNldCA9IG5ldyBTZXQobm9kZXMpO1xuICBjb25zdCBsb2NhbFJvb3RNYXAgPSBuZXcgTWFwPGFueSwgYW55PigpO1xuXG4gIGZ1bmN0aW9uIGdldFJvb3Qobm9kZTogYW55KTogYW55IHtcbiAgICBpZiAoIW5vZGUpIHJldHVybiBOVUxMX05PREU7XG5cbiAgICBsZXQgcm9vdCA9IGxvY2FsUm9vdE1hcC5nZXQobm9kZSk7XG4gICAgaWYgKHJvb3QpIHJldHVybiByb290O1xuXG4gICAgY29uc3QgcGFyZW50ID0gbm9kZS5wYXJlbnROb2RlO1xuICAgIGlmIChyb290TWFwLmhhcyhwYXJlbnQpKSB7ICAvLyBuZ0lmIGluc2lkZSBAdHJpZ2dlclxuICAgICAgcm9vdCA9IHBhcmVudDtcbiAgICB9IGVsc2UgaWYgKG5vZGVTZXQuaGFzKHBhcmVudCkpIHsgIC8vIG5nSWYgaW5zaWRlIG5nSWZcbiAgICAgIHJvb3QgPSBOVUxMX05PREU7XG4gICAgfSBlbHNlIHsgIC8vIHJlY3Vyc2UgdXB3YXJkc1xuICAgICAgcm9vdCA9IGdldFJvb3QocGFyZW50KTtcbiAgICB9XG5cbiAgICBsb2NhbFJvb3RNYXAuc2V0KG5vZGUsIHJvb3QpO1xuICAgIHJldHVybiByb290O1xuICB9XG5cbiAgbm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICBjb25zdCByb290ID0gZ2V0Um9vdChub2RlKTtcbiAgICBpZiAocm9vdCAhPT0gTlVMTF9OT0RFKSB7XG4gICAgICByb290TWFwLmdldChyb290KSEucHVzaChub2RlKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiByb290TWFwO1xufVxuXG5mdW5jdGlvbiBhZGRDbGFzcyhlbGVtZW50OiBhbnksIGNsYXNzTmFtZTogc3RyaW5nKSB7XG4gIGVsZW1lbnQuY2xhc3NMaXN0Py5hZGQoY2xhc3NOYW1lKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlQ2xhc3MoZWxlbWVudDogYW55LCBjbGFzc05hbWU6IHN0cmluZykge1xuICBlbGVtZW50LmNsYXNzTGlzdD8ucmVtb3ZlKGNsYXNzTmFtZSk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZU5vZGVzQWZ0ZXJBbmltYXRpb25Eb25lKFxuICAgIGVuZ2luZTogVHJhbnNpdGlvbkFuaW1hdGlvbkVuZ2luZSwgZWxlbWVudDogYW55LCBwbGF5ZXJzOiBBbmltYXRpb25QbGF5ZXJbXSkge1xuICBvcHRpbWl6ZUdyb3VwUGxheWVyKHBsYXllcnMpLm9uRG9uZSgoKSA9PiBlbmdpbmUucHJvY2Vzc0xlYXZlTm9kZShlbGVtZW50KSk7XG59XG5cbmZ1bmN0aW9uIGZsYXR0ZW5Hcm91cFBsYXllcnMocGxheWVyczogQW5pbWF0aW9uUGxheWVyW10pOiBBbmltYXRpb25QbGF5ZXJbXSB7XG4gIGNvbnN0IGZpbmFsUGxheWVyczogQW5pbWF0aW9uUGxheWVyW10gPSBbXTtcbiAgX2ZsYXR0ZW5Hcm91cFBsYXllcnNSZWN1cihwbGF5ZXJzLCBmaW5hbFBsYXllcnMpO1xuICByZXR1cm4gZmluYWxQbGF5ZXJzO1xufVxuXG5mdW5jdGlvbiBfZmxhdHRlbkdyb3VwUGxheWVyc1JlY3VyKHBsYXllcnM6IEFuaW1hdGlvblBsYXllcltdLCBmaW5hbFBsYXllcnM6IEFuaW1hdGlvblBsYXllcltdKSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHBsYXllciA9IHBsYXllcnNbaV07XG4gICAgaWYgKHBsYXllciBpbnN0YW5jZW9mIEFuaW1hdGlvbkdyb3VwUGxheWVyKSB7XG4gICAgICBfZmxhdHRlbkdyb3VwUGxheWVyc1JlY3VyKHBsYXllci5wbGF5ZXJzLCBmaW5hbFBsYXllcnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmaW5hbFBsYXllcnMucHVzaChwbGF5ZXIpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBvYmpFcXVhbHMoYToge1trZXk6IHN0cmluZ106IGFueX0sIGI6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogYm9vbGVhbiB7XG4gIGNvbnN0IGsxID0gT2JqZWN0LmtleXMoYSk7XG4gIGNvbnN0IGsyID0gT2JqZWN0LmtleXMoYik7XG4gIGlmIChrMS5sZW5ndGggIT0gazIubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgazEubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBwcm9wID0gazFbaV07XG4gICAgaWYgKCFiLmhhc093blByb3BlcnR5KHByb3ApIHx8IGFbcHJvcF0gIT09IGJbcHJvcF0pIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gcmVwbGFjZVBvc3RTdHlsZXNBc1ByZShcbiAgICBlbGVtZW50OiBhbnksIGFsbFByZVN0eWxlRWxlbWVudHM6IE1hcDxhbnksIFNldDxzdHJpbmc+PixcbiAgICBhbGxQb3N0U3R5bGVFbGVtZW50czogTWFwPGFueSwgU2V0PHN0cmluZz4+KTogYm9vbGVhbiB7XG4gIGNvbnN0IHBvc3RFbnRyeSA9IGFsbFBvc3RTdHlsZUVsZW1lbnRzLmdldChlbGVtZW50KTtcbiAgaWYgKCFwb3N0RW50cnkpIHJldHVybiBmYWxzZTtcblxuICBsZXQgcHJlRW50cnkgPSBhbGxQcmVTdHlsZUVsZW1lbnRzLmdldChlbGVtZW50KTtcbiAgaWYgKHByZUVudHJ5KSB7XG4gICAgcG9zdEVudHJ5LmZvckVhY2goZGF0YSA9PiBwcmVFbnRyeSEuYWRkKGRhdGEpKTtcbiAgfSBlbHNlIHtcbiAgICBhbGxQcmVTdHlsZUVsZW1lbnRzLnNldChlbGVtZW50LCBwb3N0RW50cnkpO1xuICB9XG5cbiAgYWxsUG9zdFN0eWxlRWxlbWVudHMuZGVsZXRlKGVsZW1lbnQpO1xuICByZXR1cm4gdHJ1ZTtcbn1cbiJdfQ==