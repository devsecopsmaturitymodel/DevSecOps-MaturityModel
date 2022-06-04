/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Specifies automatic styling.
 *
 * @publicApi
 */
export const AUTO_STYLE = '*';
/**
 * Creates a named animation trigger, containing a  list of [`state()`](api/animations/state)
 * and `transition()` entries to be evaluated when the expression
 * bound to the trigger changes.
 *
 * @param name An identifying string.
 * @param definitions  An animation definition object, containing an array of
 * [`state()`](api/animations/state) and `transition()` declarations.
 *
 * @return An object that encapsulates the trigger data.
 *
 * @usageNotes
 * Define an animation trigger in the `animations` section of `@Component` metadata.
 * In the template, reference the trigger by name and bind it to a trigger expression that
 * evaluates to a defined animation state, using the following format:
 *
 * `[@triggerName]="expression"`
 *
 * Animation trigger bindings convert all values to strings, and then match the
 * previous and current values against any linked transitions.
 * Booleans can be specified as `1` or `true` and `0` or `false`.
 *
 * ### Usage Example
 *
 * The following example creates an animation trigger reference based on the provided
 * name value.
 * The provided animation value is expected to be an array consisting of state and
 * transition declarations.
 *
 * ```typescript
 * @Component({
 *   selector: "my-component",
 *   templateUrl: "my-component-tpl.html",
 *   animations: [
 *     trigger("myAnimationTrigger", [
 *       state(...),
 *       state(...),
 *       transition(...),
 *       transition(...)
 *     ])
 *   ]
 * })
 * class MyComponent {
 *   myStatusExp = "something";
 * }
 * ```
 *
 * The template associated with this component makes use of the defined trigger
 * by binding to an element within its template code.
 *
 * ```html
 * <!-- somewhere inside of my-component-tpl.html -->
 * <div [@myAnimationTrigger]="myStatusExp">...</div>
 * ```
 *
 * ### Using an inline function
 * The `transition` animation method also supports reading an inline function which can decide
 * if its associated animation should be run.
 *
 * ```typescript
 * // this method is run each time the `myAnimationTrigger` trigger value changes.
 * function myInlineMatcherFn(fromState: string, toState: string, element: any, params: {[key:
 string]: any}): boolean {
 *   // notice that `element` and `params` are also available here
 *   return toState == 'yes-please-animate';
 * }
 *
 * @Component({
 *   selector: 'my-component',
 *   templateUrl: 'my-component-tpl.html',
 *   animations: [
 *     trigger('myAnimationTrigger', [
 *       transition(myInlineMatcherFn, [
 *         // the animation sequence code
 *       ]),
 *     ])
 *   ]
 * })
 * class MyComponent {
 *   myStatusExp = "yes-please-animate";
 * }
 * ```
 *
 * ### Disabling Animations
 * When true, the special animation control binding `@.disabled` binding prevents
 * all animations from rendering.
 * Place the  `@.disabled` binding on an element to disable
 * animations on the element itself, as well as any inner animation triggers
 * within the element.
 *
 * The following example shows how to use this feature:
 *
 * ```typescript
 * @Component({
 *   selector: 'my-component',
 *   template: `
 *     <div [@.disabled]="isDisabled">
 *       <div [@childAnimation]="exp"></div>
 *     </div>
 *   `,
 *   animations: [
 *     trigger("childAnimation", [
 *       // ...
 *     ])
 *   ]
 * })
 * class MyComponent {
 *   isDisabled = true;
 *   exp = '...';
 * }
 * ```
 *
 * When `@.disabled` is true, it prevents the `@childAnimation` trigger from animating,
 * along with any inner animations.
 *
 * ### Disable animations application-wide
 * When an area of the template is set to have animations disabled,
 * **all** inner components have their animations disabled as well.
 * This means that you can disable all animations for an app
 * by placing a host binding set on `@.disabled` on the topmost Angular component.
 *
 * ```typescript
 * import {Component, HostBinding} from '@angular/core';
 *
 * @Component({
 *   selector: 'app-component',
 *   templateUrl: 'app.component.html',
 * })
 * class AppComponent {
 *   @HostBinding('@.disabled')
 *   public animationsDisabled = true;
 * }
 * ```
 *
 * ### Overriding disablement of inner animations
 * Despite inner animations being disabled, a parent animation can `query()`
 * for inner elements located in disabled areas of the template and still animate
 * them if needed. This is also the case for when a sub animation is
 * queried by a parent and then later animated using `animateChild()`.
 *
 * ### Detecting when an animation is disabled
 * If a region of the DOM (or the entire application) has its animations disabled, the animation
 * trigger callbacks still fire, but for zero seconds. When the callback fires, it provides
 * an instance of an `AnimationEvent`. If animations are disabled,
 * the `.disabled` flag on the event is true.
 *
 * @publicApi
 */
export function trigger(name, definitions) {
    return { type: 7 /* Trigger */, name, definitions, options: {} };
}
/**
 * Defines an animation step that combines styling information with timing information.
 *
 * @param timings Sets `AnimateTimings` for the parent animation.
 * A string in the format "duration [delay] [easing]".
 *  - Duration and delay are expressed as a number and optional time unit,
 * such as "1s" or "10ms" for one second and 10 milliseconds, respectively.
 * The default unit is milliseconds.
 *  - The easing value controls how the animation accelerates and decelerates
 * during its runtime. Value is one of  `ease`, `ease-in`, `ease-out`,
 * `ease-in-out`, or a `cubic-bezier()` function call.
 * If not supplied, no easing is applied.
 *
 * For example, the string "1s 100ms ease-out" specifies a duration of
 * 1000 milliseconds, and delay of 100 ms, and the "ease-out" easing style,
 * which decelerates near the end of the duration.
 * @param styles Sets AnimationStyles for the parent animation.
 * A function call to either `style()` or `keyframes()`
 * that returns a collection of CSS style entries to be applied to the parent animation.
 * When null, uses the styles from the destination state.
 * This is useful when describing an animation step that will complete an animation;
 * see "Animating to the final state" in `transitions()`.
 * @returns An object that encapsulates the animation step.
 *
 * @usageNotes
 * Call within an animation `sequence()`, `{@link animations/group group()}`, or
 * `transition()` call to specify an animation step
 * that applies given style data to the parent animation for a given amount of time.
 *
 * ### Syntax Examples
 * **Timing examples**
 *
 * The following examples show various `timings` specifications.
 * - `animate(500)` : Duration is 500 milliseconds.
 * - `animate("1s")` : Duration is 1000 milliseconds.
 * - `animate("100ms 0.5s")` : Duration is 100 milliseconds, delay is 500 milliseconds.
 * - `animate("5s ease-in")` : Duration is 5000 milliseconds, easing in.
 * - `animate("5s 10ms cubic-bezier(.17,.67,.88,.1)")` : Duration is 5000 milliseconds, delay is 10
 * milliseconds, easing according to a bezier curve.
 *
 * **Style examples**
 *
 * The following example calls `style()` to set a single CSS style.
 * ```typescript
 * animate(500, style({ background: "red" }))
 * ```
 * The following example calls `keyframes()` to set a CSS style
 * to different values for successive keyframes.
 * ```typescript
 * animate(500, keyframes(
 *  [
 *   style({ background: "blue" }),
 *   style({ background: "red" })
 *  ])
 * ```
 *
 * @publicApi
 */
export function animate(timings, styles = null) {
    return { type: 4 /* Animate */, styles, timings };
}
/**
 * @description Defines a list of animation steps to be run in parallel.
 *
 * @param steps An array of animation step objects.
 * - When steps are defined by `style()` or `animate()`
 * function calls, each call within the group is executed instantly.
 * - To specify offset styles to be applied at a later time, define steps with
 * `keyframes()`, or use `animate()` calls with a delay value.
 * For example:
 *
 * ```typescript
 * group([
 *   animate("1s", style({ background: "black" })),
 *   animate("2s", style({ color: "white" }))
 * ])
 * ```
 *
 * @param options An options object containing a delay and
 * developer-defined parameters that provide styling defaults and
 * can be overridden on invocation.
 *
 * @return An object that encapsulates the group data.
 *
 * @usageNotes
 * Grouped animations are useful when a series of styles must be
 * animated at different starting times and closed off at different ending times.
 *
 * When called within a `sequence()` or a
 * `transition()` call, does not continue to the next
 * instruction until all of the inner animation steps have completed.
 *
 * @publicApi
 */
export function group(steps, options = null) {
    return { type: 3 /* Group */, steps, options };
}
/**
 * Defines a list of animation steps to be run sequentially, one by one.
 *
 * @param steps An array of animation step objects.
 * - Steps defined by `style()` calls apply the styling data immediately.
 * - Steps defined by `animate()` calls apply the styling data over time
 *   as specified by the timing data.
 *
 * ```typescript
 * sequence([
 *   style({ opacity: 0 }),
 *   animate("1s", style({ opacity: 1 }))
 * ])
 * ```
 *
 * @param options An options object containing a delay and
 * developer-defined parameters that provide styling defaults and
 * can be overridden on invocation.
 *
 * @return An object that encapsulates the sequence data.
 *
 * @usageNotes
 * When you pass an array of steps to a
 * `transition()` call, the steps run sequentially by default.
 * Compare this to the `{@link animations/group group()}` call, which runs animation steps in
 *parallel.
 *
 * When a sequence is used within a `{@link animations/group group()}` or a `transition()` call,
 * execution continues to the next instruction only after each of the inner animation
 * steps have completed.
 *
 * @publicApi
 **/
export function sequence(steps, options = null) {
    return { type: 2 /* Sequence */, steps, options };
}
/**
 * Declares a key/value object containing CSS properties/styles that
 * can then be used for an animation [`state`](api/animations/state), within an animation
 *`sequence`, or as styling data for calls to `animate()` and `keyframes()`.
 *
 * @param tokens A set of CSS styles or HTML styles associated with an animation state.
 * The value can be any of the following:
 * - A key-value style pair associating a CSS property with a value.
 * - An array of key-value style pairs.
 * - An asterisk (*), to use auto-styling, where styles are derived from the element
 * being animated and applied to the animation when it starts.
 *
 * Auto-styling can be used to define a state that depends on layout or other
 * environmental factors.
 *
 * @return An object that encapsulates the style data.
 *
 * @usageNotes
 * The following examples create animation styles that collect a set of
 * CSS property values:
 *
 * ```typescript
 * // string values for CSS properties
 * style({ background: "red", color: "blue" })
 *
 * // numerical pixel values
 * style({ width: 100, height: 0 })
 * ```
 *
 * The following example uses auto-styling to allow an element to animate from
 * a height of 0 up to its full height:
 *
 * ```
 * style({ height: 0 }),
 * animate("1s", style({ height: "*" }))
 * ```
 *
 * @publicApi
 **/
export function style(tokens) {
    return { type: 6 /* Style */, styles: tokens, offset: null };
}
/**
 * Declares an animation state within a trigger attached to an element.
 *
 * @param name One or more names for the defined state in a comma-separated string.
 * The following reserved state names can be supplied to define a style for specific use
 * cases:
 *
 * - `void` You can associate styles with this name to be used when
 * the element is detached from the application. For example, when an `ngIf` evaluates
 * to false, the state of the associated element is void.
 *  - `*` (asterisk) Indicates the default state. You can associate styles with this name
 * to be used as the fallback when the state that is being animated is not declared
 * within the trigger.
 *
 * @param styles A set of CSS styles associated with this state, created using the
 * `style()` function.
 * This set of styles persists on the element once the state has been reached.
 * @param options Parameters that can be passed to the state when it is invoked.
 * 0 or more key-value pairs.
 * @return An object that encapsulates the new state data.
 *
 * @usageNotes
 * Use the `trigger()` function to register states to an animation trigger.
 * Use the `transition()` function to animate between states.
 * When a state is active within a component, its associated styles persist on the element,
 * even when the animation ends.
 *
 * @publicApi
 **/
export function state(name, styles, options) {
    return { type: 0 /* State */, name, styles, options };
}
/**
 * Defines a set of animation styles, associating each style with an optional `offset` value.
 *
 * @param steps A set of animation styles with optional offset data.
 * The optional `offset` value for a style specifies a percentage of the total animation
 * time at which that style is applied.
 * @returns An object that encapsulates the keyframes data.
 *
 * @usageNotes
 * Use with the `animate()` call. Instead of applying animations
 * from the current state
 * to the destination state, keyframes describe how each style entry is applied and at what point
 * within the animation arc.
 * Compare [CSS Keyframe Animations](https://www.w3schools.com/css/css3_animations.asp).
 *
 * ### Usage
 *
 * In the following example, the offset values describe
 * when each `backgroundColor` value is applied. The color is red at the start, and changes to
 * blue when 20% of the total time has elapsed.
 *
 * ```typescript
 * // the provided offset values
 * animate("5s", keyframes([
 *   style({ backgroundColor: "red", offset: 0 }),
 *   style({ backgroundColor: "blue", offset: 0.2 }),
 *   style({ backgroundColor: "orange", offset: 0.3 }),
 *   style({ backgroundColor: "black", offset: 1 })
 * ]))
 * ```
 *
 * If there are no `offset` values specified in the style entries, the offsets
 * are calculated automatically.
 *
 * ```typescript
 * animate("5s", keyframes([
 *   style({ backgroundColor: "red" }) // offset = 0
 *   style({ backgroundColor: "blue" }) // offset = 0.33
 *   style({ backgroundColor: "orange" }) // offset = 0.66
 *   style({ backgroundColor: "black" }) // offset = 1
 * ]))
 *```

 * @publicApi
 */
export function keyframes(steps) {
    return { type: 5 /* Keyframes */, steps };
}
/**
 * Declares an animation transition which is played when a certain specified condition is met.
 *
 * @param stateChangeExpr A string with a specific format or a function that specifies when the
 * animation transition should occur (see [State Change Expression](#state-change-expression)).
 *
 * @param steps One or more animation objects that represent the animation's instructions.
 *
 * @param options An options object that can be used to specify a delay for the animation or provide
 * custom parameters for it.
 *
 * @returns An object that encapsulates the transition data.
 *
 * @usageNotes
 *
 * ### State Change Expression
 *
 * The State Change Expression instructs Angular when to run the transition's animations, it can
 *either be
 *  - a string with a specific syntax
 *  - or a function that compares the previous and current state (value of the expression bound to
 *    the element's trigger) and returns `true` if the transition should occur or `false` otherwise
 *
 * The string format can be:
 *  - `fromState => toState`, which indicates that the transition's animations should occur then the
 *    expression bound to the trigger's element goes from `fromState` to `toState`
 *
 *    _Example:_
 *      ```typescript
 *        transition('open => closed', animate('.5s ease-out', style({ height: 0 }) ))
 *      ```
 *
 *  - `fromState <=> toState`, which indicates that the transition's animations should occur then
 *    the expression bound to the trigger's element goes from `fromState` to `toState` or vice versa
 *
 *    _Example:_
 *      ```typescript
 *        transition('enabled <=> disabled', animate('1s cubic-bezier(0.8,0.3,0,1)'))
 *      ```
 *
 *  - `:enter`/`:leave`, which indicates that the transition's animations should occur when the
 *    element enters or exists the DOM
 *
 *    _Example:_
 *      ```typescript
 *        transition(':enter', [
 *          style({ opacity: 0 }),
 *          animate('500ms', style({ opacity: 1 }))
 *        ])
 *      ```
 *
 *  - `:increment`/`:decrement`, which indicates that the transition's animations should occur when
 *    the numerical expression bound to the trigger's element has increased in value or decreased
 *
 *    _Example:_
 *      ```typescript
 *        transition(':increment', query('@counter', animateChild()))
 *      ```
 *
 *  - a sequence of any of the above divided by commas, which indicates that transition's animations
 *    should occur whenever one of the state change expressions matches
 *
 *    _Example:_
 *      ```typescript
 *        transition(':increment, * => enabled, :enter', animate('1s ease', keyframes([
 *          style({ transform: 'scale(1)', offset: 0}),
 *          style({ transform: 'scale(1.1)', offset: 0.7}),
 *          style({ transform: 'scale(1)', offset: 1})
 *        ]))),
 *      ```
 *
 * Also note that in such context:
 *  - `void` can be used to indicate the absence of the element
 *  - asterisks can be used as wildcards that match any state
 *  - (as a consequence of the above, `void => *` is equivalent to `:enter` and `* => void` is
 *    equivalent to `:leave`)
 *  - `true` and `false` also match expression values of `1` and `0` respectively (but do not match
 *    _truthy_ and _falsy_ values)
 *
 * <div class="alert is-helpful">
 *
 *  Be careful about entering end leaving elements as their transitions present a common
 *  pitfall for developers.
 *
 *  Note that when an element with a trigger enters the DOM its `:enter` transition always
 *  gets executed, but its `:leave` transition will not be executed if the element is removed
 *  alongside its parent (as it will be removed "without warning" before its transition has
 *  a chance to be executed, the only way that such transition can occur is if the element
 *  is exiting the DOM on its own).
 *
 *
 * </div>
 *
 * ### Animating to a Final State
 *
 * If the final step in a transition is a call to `animate()` that uses a timing value
 * with no `style` data, that step is automatically considered the final animation arc,
 * for the element to reach the final state, in such case Angular automatically adds or removes
 * CSS styles to ensure that the element is in the correct final state.
 *
 *
 * ### Usage Examples
 *
 *  - Transition animations applied based on
 *    the trigger's expression value
 *
 *   ```HTML
 *   <div [@myAnimationTrigger]="myStatusExp">
 *    ...
 *   </div>
 *   ```
 *
 *   ```typescript
 *   trigger("myAnimationTrigger", [
 *     ..., // states
 *     transition("on => off, open => closed", animate(500)),
 *     transition("* <=> error", query('.indicator', animateChild()))
 *   ])
 *   ```
 *
 *  - Transition animations applied based on custom logic dependent
 *    on the trigger's expression value and provided parameters
 *
 *    ```HTML
 *    <div [@myAnimationTrigger]="{
 *     value: stepName,
 *     params: { target: currentTarget }
 *    }">
 *     ...
 *    </div>
 *    ```
 *
 *    ```typescript
 *    trigger("myAnimationTrigger", [
 *      ..., // states
 *      transition(
 *        (fromState, toState, _element, params) =>
 *          ['firststep', 'laststep'].includes(fromState.toLowerCase())
 *          && toState === params?.['target'],
 *        animate('1s')
 *      )
 *    ])
 *    ```
 *
 * @publicApi
 **/
export function transition(stateChangeExpr, steps, options = null) {
    return { type: 1 /* Transition */, expr: stateChangeExpr, animation: steps, options };
}
/**
 * Produces a reusable animation that can be invoked in another animation or sequence,
 * by calling the `useAnimation()` function.
 *
 * @param steps One or more animation objects, as returned by the `animate()`
 * or `sequence()` function, that form a transformation from one state to another.
 * A sequence is used by default when you pass an array.
 * @param options An options object that can contain a delay value for the start of the
 * animation, and additional developer-defined parameters.
 * Provided values for additional parameters are used as defaults,
 * and override values can be passed to the caller on invocation.
 * @returns An object that encapsulates the animation data.
 *
 * @usageNotes
 * The following example defines a reusable animation, providing some default parameter
 * values.
 *
 * ```typescript
 * var fadeAnimation = animation([
 *   style({ opacity: '{{ start }}' }),
 *   animate('{{ time }}',
 *   style({ opacity: '{{ end }}'}))
 *   ],
 *   { params: { time: '1000ms', start: 0, end: 1 }});
 * ```
 *
 * The following invokes the defined animation with a call to `useAnimation()`,
 * passing in override parameter values.
 *
 * ```js
 * useAnimation(fadeAnimation, {
 *   params: {
 *     time: '2s',
 *     start: 1,
 *     end: 0
 *   }
 * })
 * ```
 *
 * If any of the passed-in parameter values are missing from this call,
 * the default values are used. If one or more parameter values are missing before a step is
 * animated, `useAnimation()` throws an error.
 *
 * @publicApi
 */
export function animation(steps, options = null) {
    return { type: 8 /* Reference */, animation: steps, options };
}
/**
 * Executes a queried inner animation element within an animation sequence.
 *
 * @param options An options object that can contain a delay value for the start of the
 * animation, and additional override values for developer-defined parameters.
 * @return An object that encapsulates the child animation data.
 *
 * @usageNotes
 * Each time an animation is triggered in Angular, the parent animation
 * has priority and any child animations are blocked. In order
 * for a child animation to run, the parent animation must query each of the elements
 * containing child animations, and run them using this function.
 *
 * Note that this feature is designed to be used with `query()` and it will only work
 * with animations that are assigned using the Angular animation library. CSS keyframes
 * and transitions are not handled by this API.
 *
 * @publicApi
 */
export function animateChild(options = null) {
    return { type: 9 /* AnimateChild */, options };
}
/**
 * Starts a reusable animation that is created using the `animation()` function.
 *
 * @param animation The reusable animation to start.
 * @param options An options object that can contain a delay value for the start of
 * the animation, and additional override values for developer-defined parameters.
 * @return An object that contains the animation parameters.
 *
 * @publicApi
 */
export function useAnimation(animation, options = null) {
    return { type: 10 /* AnimateRef */, animation, options };
}
/**
 * Finds one or more inner elements within the current element that is
 * being animated within a sequence. Use with `animate()`.
 *
 * @param selector The element to query, or a set of elements that contain Angular-specific
 * characteristics, specified with one or more of the following tokens.
 *  - `query(":enter")` or `query(":leave")` : Query for newly inserted/removed elements (not
 *     all elements can be queried via these tokens, see
 *     [Entering and Leaving Elements](#entering-and-leaving-elements))
 *  - `query(":animating")` : Query all currently animating elements.
 *  - `query("@triggerName")` : Query elements that contain an animation trigger.
 *  - `query("@*")` : Query all elements that contain an animation triggers.
 *  - `query(":self")` : Include the current element into the animation sequence.
 *
 * @param animation One or more animation steps to apply to the queried element or elements.
 * An array is treated as an animation sequence.
 * @param options An options object. Use the 'limit' field to limit the total number of
 * items to collect.
 * @return An object that encapsulates the query data.
 *
 * @usageNotes
 *
 * ### Multiple Tokens
 *
 * Tokens can be merged into a combined query selector string. For example:
 *
 * ```typescript
 *  query(':self, .record:enter, .record:leave, @subTrigger', [...])
 * ```
 *
 * The `query()` function collects multiple elements and works internally by using
 * `element.querySelectorAll`. Use the `limit` field of an options object to limit
 * the total number of items to be collected. For example:
 *
 * ```js
 * query('div', [
 *   animate(...),
 *   animate(...)
 * ], { limit: 1 })
 * ```
 *
 * By default, throws an error when zero items are found. Set the
 * `optional` flag to ignore this error. For example:
 *
 * ```js
 * query('.some-element-that-may-not-be-there', [
 *   animate(...),
 *   animate(...)
 * ], { optional: true })
 * ```
 *
 * ### Entering and Leaving Elements
 *
 * Not all elements can be queried via the `:enter` and `:leave` tokens, the only ones
 * that can are those that Angular assumes can enter/leave based on their own logic
 * (if their insertion/removal is simply a consequence of that of their parent they
 * should be queried via a different token in their parent's `:enter`/`:leave` transitions).
 *
 * The only elements Angular assumes can enter/leave based on their own logic (thus the only
 * ones that can be queried via the `:enter` and `:leave` tokens) are:
 *  - Those inserted dynamically (via `ViewContainerRef`)
 *  - Those that have a structural directive (which, under the hood, are a subset of the above ones)
 *
 * <div class="alert is-helpful">
 *
 *  Note that elements will be successfully queried via `:enter`/`:leave` even if their
 *  insertion/removal is not done manually via `ViewContainerRef`or caused by their structural
 *  directive (e.g. they enter/exit alongside their parent).
 *
 * </div>
 *
 * <div class="alert is-important">
 *
 *  There is an exception to what previously mentioned, besides elements entering/leaving based on
 *  their own logic, elements with an animation trigger can always be queried via `:leave` when
 * their parent is also leaving.
 *
 * </div>
 *
 * ### Usage Example
 *
 * The following example queries for inner elements and animates them
 * individually using `animate()`.
 *
 * ```typescript
 * @Component({
 *   selector: 'inner',
 *   template: `
 *     <div [@queryAnimation]="exp">
 *       <h1>Title</h1>
 *       <div class="content">
 *         Blah blah blah
 *       </div>
 *     </div>
 *   `,
 *   animations: [
 *    trigger('queryAnimation', [
 *      transition('* => goAnimate', [
 *        // hide the inner elements
 *        query('h1', style({ opacity: 0 })),
 *        query('.content', style({ opacity: 0 })),
 *
 *        // animate the inner elements in, one by one
 *        query('h1', animate(1000, style({ opacity: 1 }))),
 *        query('.content', animate(1000, style({ opacity: 1 }))),
 *      ])
 *    ])
 *  ]
 * })
 * class Cmp {
 *   exp = '';
 *
 *   goAnimate() {
 *     this.exp = 'goAnimate';
 *   }
 * }
 * ```
 *
 * @publicApi
 */
export function query(selector, animation, options = null) {
    return { type: 11 /* Query */, selector, animation, options };
}
/**
 * Use within an animation `query()` call to issue a timing gap after
 * each queried item is animated.
 *
 * @param timings A delay value.
 * @param animation One ore more animation steps.
 * @returns An object that encapsulates the stagger data.
 *
 * @usageNotes
 * In the following example, a container element wraps a list of items stamped out
 * by an `ngFor`. The container element contains an animation trigger that will later be set
 * to query for each of the inner items.
 *
 * Each time items are added, the opacity fade-in animation runs,
 * and each removed item is faded out.
 * When either of these animations occur, the stagger effect is
 * applied after each item's animation is started.
 *
 * ```html
 * <!-- list.component.html -->
 * <button (click)="toggle()">Show / Hide Items</button>
 * <hr />
 * <div [@listAnimation]="items.length">
 *   <div *ngFor="let item of items">
 *     {{ item }}
 *   </div>
 * </div>
 * ```
 *
 * Here is the component code:
 *
 * ```typescript
 * import {trigger, transition, style, animate, query, stagger} from '@angular/animations';
 * @Component({
 *   templateUrl: 'list.component.html',
 *   animations: [
 *     trigger('listAnimation', [
 *     ...
 *     ])
 *   ]
 * })
 * class ListComponent {
 *   items = [];
 *
 *   showItems() {
 *     this.items = [0,1,2,3,4];
 *   }
 *
 *   hideItems() {
 *     this.items = [];
 *   }
 *
 *   toggle() {
 *     this.items.length ? this.hideItems() : this.showItems();
 *    }
 *  }
 * ```
 *
 * Here is the animation trigger code:
 *
 * ```typescript
 * trigger('listAnimation', [
 *   transition('* => *', [ // each time the binding value changes
 *     query(':leave', [
 *       stagger(100, [
 *         animate('0.5s', style({ opacity: 0 }))
 *       ])
 *     ]),
 *     query(':enter', [
 *       style({ opacity: 0 }),
 *       stagger(100, [
 *         animate('0.5s', style({ opacity: 1 }))
 *       ])
 *     ])
 *   ])
 * ])
 * ```
 *
 * @publicApi
 */
export function stagger(timings, animation) {
    return { type: 12 /* Stagger */, timings, animation };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX21ldGFkYXRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYW5pbWF0aW9ucy9zcmMvYW5pbWF0aW9uX21ldGFkYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQStKSDs7OztHQUlHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQztBQXlSOUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW1KRztBQUNILE1BQU0sVUFBVSxPQUFPLENBQUMsSUFBWSxFQUFFLFdBQWdDO0lBQ3BFLE9BQU8sRUFBQyxJQUFJLGlCQUErQixFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBQyxDQUFDO0FBQy9FLENBQUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBeURHO0FBQ0gsTUFBTSxVQUFVLE9BQU8sQ0FDbkIsT0FBc0IsRUFDdEIsU0FDSSxJQUFJO0lBQ1YsT0FBTyxFQUFDLElBQUksaUJBQStCLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBQyxDQUFDO0FBQ2hFLENBQUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQ0c7QUFDSCxNQUFNLFVBQVUsS0FBSyxDQUNqQixLQUEwQixFQUFFLFVBQWlDLElBQUk7SUFDbkUsT0FBTyxFQUFDLElBQUksZUFBNkIsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFDLENBQUM7QUFDN0QsQ0FBQztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWdDSTtBQUNKLE1BQU0sVUFBVSxRQUFRLENBQ3BCLEtBQTBCLEVBQUUsVUFBaUMsSUFBSTtJQUNuRSxPQUFPLEVBQUMsSUFBSSxrQkFBZ0MsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFDLENBQUM7QUFDaEUsQ0FBQztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXNDSTtBQUNKLE1BQU0sVUFBVSxLQUFLLENBQUMsTUFDMkM7SUFDL0QsT0FBTyxFQUFDLElBQUksZUFBNkIsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQztBQUMzRSxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUE0Qkk7QUFDSixNQUFNLFVBQVUsS0FBSyxDQUNqQixJQUFZLEVBQUUsTUFBOEIsRUFDNUMsT0FBeUM7SUFDM0MsT0FBTyxFQUFDLElBQUksZUFBNkIsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBQyxDQUFDO0FBQ3BFLENBQUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E0Q0c7QUFDSCxNQUFNLFVBQVUsU0FBUyxDQUFDLEtBQStCO0lBQ3ZELE9BQU8sRUFBQyxJQUFJLG1CQUFpQyxFQUFFLEtBQUssRUFBQyxDQUFDO0FBQ3hELENBQUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWlKSTtBQUNKLE1BQU0sVUFBVSxVQUFVLENBQ3RCLGVBQytGLEVBQy9GLEtBQTRDLEVBQzVDLFVBQWlDLElBQUk7SUFDdkMsT0FBTyxFQUFDLElBQUksb0JBQWtDLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBQyxDQUFDO0FBQ3BHLENBQUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E0Q0c7QUFDSCxNQUFNLFVBQVUsU0FBUyxDQUNyQixLQUE0QyxFQUM1QyxVQUFpQyxJQUFJO0lBQ3ZDLE9BQU8sRUFBQyxJQUFJLG1CQUFpQyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFDLENBQUM7QUFDNUUsQ0FBQztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FrQkc7QUFDSCxNQUFNLFVBQVUsWUFBWSxDQUFDLFVBQW9DLElBQUk7SUFFbkUsT0FBTyxFQUFDLElBQUksc0JBQW9DLEVBQUUsT0FBTyxFQUFDLENBQUM7QUFDN0QsQ0FBQztBQUVEOzs7Ozs7Ozs7R0FTRztBQUNILE1BQU0sVUFBVSxZQUFZLENBQ3hCLFNBQXFDLEVBQ3JDLFVBQWlDLElBQUk7SUFDdkMsT0FBTyxFQUFDLElBQUkscUJBQWtDLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBQyxDQUFDO0FBQ3RFLENBQUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1SEc7QUFDSCxNQUFNLFVBQVUsS0FBSyxDQUNqQixRQUFnQixFQUFFLFNBQWdELEVBQ2xFLFVBQXNDLElBQUk7SUFDNUMsT0FBTyxFQUFDLElBQUksZ0JBQTZCLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUMsQ0FBQztBQUMzRSxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0ErRUc7QUFDSCxNQUFNLFVBQVUsT0FBTyxDQUFDLE9BQXNCLEVBQUUsU0FBZ0Q7SUFFOUYsT0FBTyxFQUFDLElBQUksa0JBQStCLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBQyxDQUFDO0FBQ25FLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgc2V0IG9mIENTUyBzdHlsZXMgZm9yIHVzZSBpbiBhbiBhbmltYXRpb24gc3R5bGUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgybVTdHlsZURhdGEge1xuICBba2V5OiBzdHJpbmddOiBzdHJpbmd8bnVtYmVyO1xufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYW5pbWF0aW9uLXN0ZXAgdGltaW5nIHBhcmFtZXRlcnMgZm9yIGFuIGFuaW1hdGlvbiBzdGVwLlxuICogQHNlZSBgYW5pbWF0ZSgpYFxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGRlY2xhcmUgdHlwZSBBbmltYXRlVGltaW5ncyA9IHtcbiAgLyoqXG4gICAqIFRoZSBmdWxsIGR1cmF0aW9uIG9mIGFuIGFuaW1hdGlvbiBzdGVwLiBBIG51bWJlciBhbmQgb3B0aW9uYWwgdGltZSB1bml0LFxuICAgKiBzdWNoIGFzIFwiMXNcIiBvciBcIjEwbXNcIiBmb3Igb25lIHNlY29uZCBhbmQgMTAgbWlsbGlzZWNvbmRzLCByZXNwZWN0aXZlbHkuXG4gICAqIFRoZSBkZWZhdWx0IHVuaXQgaXMgbWlsbGlzZWNvbmRzLlxuICAgKi9cbiAgZHVyYXRpb246IG51bWJlcixcbiAgLyoqXG4gICAqIFRoZSBkZWxheSBpbiBhcHBseWluZyBhbiBhbmltYXRpb24gc3RlcC4gQSBudW1iZXIgYW5kIG9wdGlvbmFsIHRpbWUgdW5pdC5cbiAgICogVGhlIGRlZmF1bHQgdW5pdCBpcyBtaWxsaXNlY29uZHMuXG4gICAqL1xuICBkZWxheTogbnVtYmVyLFxuICAvKipcbiAgICogQW4gZWFzaW5nIHN0eWxlIHRoYXQgY29udHJvbHMgaG93IGFuIGFuaW1hdGlvbnMgc3RlcCBhY2NlbGVyYXRlc1xuICAgKiBhbmQgZGVjZWxlcmF0ZXMgZHVyaW5nIGl0cyBydW4gdGltZS4gQW4gZWFzaW5nIGZ1bmN0aW9uIHN1Y2ggYXMgYGN1YmljLWJlemllcigpYCxcbiAgICogb3Igb25lIG9mIHRoZSBmb2xsb3dpbmcgY29uc3RhbnRzOlxuICAgKiAtIGBlYXNlLWluYFxuICAgKiAtIGBlYXNlLW91dGBcbiAgICogLSBgZWFzZS1pbi1hbmQtb3V0YFxuICAgKi9cbiAgZWFzaW5nOiBzdHJpbmcgfCBudWxsXG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiBPcHRpb25zIHRoYXQgY29udHJvbCBhbmltYXRpb24gc3R5bGluZyBhbmQgdGltaW5nLlxuICpcbiAqIFRoZSBmb2xsb3dpbmcgYW5pbWF0aW9uIGZ1bmN0aW9ucyBhY2NlcHQgYEFuaW1hdGlvbk9wdGlvbnNgIGRhdGE6XG4gKlxuICogLSBgdHJhbnNpdGlvbigpYFxuICogLSBgc2VxdWVuY2UoKWBcbiAqIC0gYHtAbGluayBhbmltYXRpb25zL2dyb3VwIGdyb3VwKCl9YFxuICogLSBgcXVlcnkoKWBcbiAqIC0gYGFuaW1hdGlvbigpYFxuICogLSBgdXNlQW5pbWF0aW9uKClgXG4gKiAtIGBhbmltYXRlQ2hpbGQoKWBcbiAqXG4gKiBQcm9ncmFtbWF0aWMgYW5pbWF0aW9ucyBidWlsdCB1c2luZyB0aGUgYEFuaW1hdGlvbkJ1aWxkZXJgIHNlcnZpY2UgYWxzb1xuICogbWFrZSB1c2Ugb2YgYEFuaW1hdGlvbk9wdGlvbnNgLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIEFuaW1hdGlvbk9wdGlvbnMge1xuICAvKipcbiAgICogU2V0cyBhIHRpbWUtZGVsYXkgZm9yIGluaXRpYXRpbmcgYW4gYW5pbWF0aW9uIGFjdGlvbi5cbiAgICogQSBudW1iZXIgYW5kIG9wdGlvbmFsIHRpbWUgdW5pdCwgc3VjaCBhcyBcIjFzXCIgb3IgXCIxMG1zXCIgZm9yIG9uZSBzZWNvbmRcbiAgICogYW5kIDEwIG1pbGxpc2Vjb25kcywgcmVzcGVjdGl2ZWx5LlRoZSBkZWZhdWx0IHVuaXQgaXMgbWlsbGlzZWNvbmRzLlxuICAgKiBEZWZhdWx0IHZhbHVlIGlzIDAsIG1lYW5pbmcgbm8gZGVsYXkuXG4gICAqL1xuICBkZWxheT86IG51bWJlcnxzdHJpbmc7XG4gIC8qKlxuICAgKiBBIHNldCBvZiBkZXZlbG9wZXItZGVmaW5lZCBwYXJhbWV0ZXJzIHRoYXQgbW9kaWZ5IHN0eWxpbmcgYW5kIHRpbWluZ1xuICAgKiB3aGVuIGFuIGFuaW1hdGlvbiBhY3Rpb24gc3RhcnRzLiBBbiBhcnJheSBvZiBrZXktdmFsdWUgcGFpcnMsIHdoZXJlIHRoZSBwcm92aWRlZCB2YWx1ZVxuICAgKiBpcyB1c2VkIGFzIGEgZGVmYXVsdC5cbiAgICovXG4gIHBhcmFtcz86IHtbbmFtZTogc3RyaW5nXTogYW55fTtcbn1cblxuLyoqXG4gKiBBZGRzIGR1cmF0aW9uIG9wdGlvbnMgdG8gY29udHJvbCBhbmltYXRpb24gc3R5bGluZyBhbmQgdGltaW5nIGZvciBhIGNoaWxkIGFuaW1hdGlvbi5cbiAqXG4gKiBAc2VlIGBhbmltYXRlQ2hpbGQoKWBcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBBbmltYXRlQ2hpbGRPcHRpb25zIGV4dGVuZHMgQW5pbWF0aW9uT3B0aW9ucyB7XG4gIGR1cmF0aW9uPzogbnVtYmVyfHN0cmluZztcbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb24gQ29uc3RhbnRzIGZvciB0aGUgY2F0ZWdvcmllcyBvZiBwYXJhbWV0ZXJzIHRoYXQgY2FuIGJlIGRlZmluZWQgZm9yIGFuaW1hdGlvbnMuXG4gKlxuICogQSBjb3JyZXNwb25kaW5nIGZ1bmN0aW9uIGRlZmluZXMgYSBzZXQgb2YgcGFyYW1ldGVycyBmb3IgZWFjaCBjYXRlZ29yeSwgYW5kXG4gKiBjb2xsZWN0cyB0aGVtIGludG8gYSBjb3JyZXNwb25kaW5nIGBBbmltYXRpb25NZXRhZGF0YWAgb2JqZWN0LlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNvbnN0IGVudW0gQW5pbWF0aW9uTWV0YWRhdGFUeXBlIHtcbiAgLyoqXG4gICAqIEFzc29jaWF0ZXMgYSBuYW1lZCBhbmltYXRpb24gc3RhdGUgd2l0aCBhIHNldCBvZiBDU1Mgc3R5bGVzLlxuICAgKiBTZWUgW2BzdGF0ZSgpYF0oYXBpL2FuaW1hdGlvbnMvc3RhdGUpXG4gICAqL1xuICBTdGF0ZSA9IDAsXG4gIC8qKlxuICAgKiBEYXRhIGZvciBhIHRyYW5zaXRpb24gZnJvbSBvbmUgYW5pbWF0aW9uIHN0YXRlIHRvIGFub3RoZXIuXG4gICAqIFNlZSBgdHJhbnNpdGlvbigpYFxuICAgKi9cbiAgVHJhbnNpdGlvbiA9IDEsXG4gIC8qKlxuICAgKiBDb250YWlucyBhIHNldCBvZiBhbmltYXRpb24gc3RlcHMuXG4gICAqIFNlZSBgc2VxdWVuY2UoKWBcbiAgICovXG4gIFNlcXVlbmNlID0gMixcbiAgLyoqXG4gICAqIENvbnRhaW5zIGEgc2V0IG9mIGFuaW1hdGlvbiBzdGVwcy5cbiAgICogU2VlIGB7QGxpbmsgYW5pbWF0aW9ucy9ncm91cCBncm91cCgpfWBcbiAgICovXG4gIEdyb3VwID0gMyxcbiAgLyoqXG4gICAqIENvbnRhaW5zIGFuIGFuaW1hdGlvbiBzdGVwLlxuICAgKiBTZWUgYGFuaW1hdGUoKWBcbiAgICovXG4gIEFuaW1hdGUgPSA0LFxuICAvKipcbiAgICogQ29udGFpbnMgYSBzZXQgb2YgYW5pbWF0aW9uIHN0ZXBzLlxuICAgKiBTZWUgYGtleWZyYW1lcygpYFxuICAgKi9cbiAgS2V5ZnJhbWVzID0gNSxcbiAgLyoqXG4gICAqIENvbnRhaW5zIGEgc2V0IG9mIENTUyBwcm9wZXJ0eS12YWx1ZSBwYWlycyBpbnRvIGEgbmFtZWQgc3R5bGUuXG4gICAqIFNlZSBgc3R5bGUoKWBcbiAgICovXG4gIFN0eWxlID0gNixcbiAgLyoqXG4gICAqIEFzc29jaWF0ZXMgYW4gYW5pbWF0aW9uIHdpdGggYW4gZW50cnkgdHJpZ2dlciB0aGF0IGNhbiBiZSBhdHRhY2hlZCB0byBhbiBlbGVtZW50LlxuICAgKiBTZWUgYHRyaWdnZXIoKWBcbiAgICovXG4gIFRyaWdnZXIgPSA3LFxuICAvKipcbiAgICogQ29udGFpbnMgYSByZS11c2FibGUgYW5pbWF0aW9uLlxuICAgKiBTZWUgYGFuaW1hdGlvbigpYFxuICAgKi9cbiAgUmVmZXJlbmNlID0gOCxcbiAgLyoqXG4gICAqIENvbnRhaW5zIGRhdGEgdG8gdXNlIGluIGV4ZWN1dGluZyBjaGlsZCBhbmltYXRpb25zIHJldHVybmVkIGJ5IGEgcXVlcnkuXG4gICAqIFNlZSBgYW5pbWF0ZUNoaWxkKClgXG4gICAqL1xuICBBbmltYXRlQ2hpbGQgPSA5LFxuICAvKipcbiAgICogQ29udGFpbnMgYW5pbWF0aW9uIHBhcmFtZXRlcnMgZm9yIGEgcmUtdXNhYmxlIGFuaW1hdGlvbi5cbiAgICogU2VlIGB1c2VBbmltYXRpb24oKWBcbiAgICovXG4gIEFuaW1hdGVSZWYgPSAxMCxcbiAgLyoqXG4gICAqIENvbnRhaW5zIGNoaWxkLWFuaW1hdGlvbiBxdWVyeSBkYXRhLlxuICAgKiBTZWUgYHF1ZXJ5KClgXG4gICAqL1xuICBRdWVyeSA9IDExLFxuICAvKipcbiAgICogQ29udGFpbnMgZGF0YSBmb3Igc3RhZ2dlcmluZyBhbiBhbmltYXRpb24gc2VxdWVuY2UuXG4gICAqIFNlZSBgc3RhZ2dlcigpYFxuICAgKi9cbiAgU3RhZ2dlciA9IDEyXG59XG5cbi8qKlxuICogU3BlY2lmaWVzIGF1dG9tYXRpYyBzdHlsaW5nLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNvbnN0IEFVVE9fU1RZTEUgPSAnKic7XG5cbi8qKlxuICogQmFzZSBmb3IgYW5pbWF0aW9uIGRhdGEgc3RydWN0dXJlcy5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQW5pbWF0aW9uTWV0YWRhdGEge1xuICB0eXBlOiBBbmltYXRpb25NZXRhZGF0YVR5cGU7XG59XG5cbi8qKlxuICogQ29udGFpbnMgYW4gYW5pbWF0aW9uIHRyaWdnZXIuIEluc3RhbnRpYXRlZCBhbmQgcmV0dXJuZWQgYnkgdGhlXG4gKiBgdHJpZ2dlcigpYCBmdW5jdGlvbi5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhIGV4dGVuZHMgQW5pbWF0aW9uTWV0YWRhdGEge1xuICAvKipcbiAgICogVGhlIHRyaWdnZXIgbmFtZSwgdXNlZCB0byBhc3NvY2lhdGUgaXQgd2l0aCBhbiBlbGVtZW50LiBVbmlxdWUgd2l0aGluIHRoZSBjb21wb25lbnQuXG4gICAqL1xuICBuYW1lOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBBbiBhbmltYXRpb24gZGVmaW5pdGlvbiBvYmplY3QsIGNvbnRhaW5pbmcgYW4gYXJyYXkgb2Ygc3RhdGUgYW5kIHRyYW5zaXRpb24gZGVjbGFyYXRpb25zLlxuICAgKi9cbiAgZGVmaW5pdGlvbnM6IEFuaW1hdGlvbk1ldGFkYXRhW107XG4gIC8qKlxuICAgKiBBbiBvcHRpb25zIG9iamVjdCBjb250YWluaW5nIGEgZGVsYXkgYW5kXG4gICAqIGRldmVsb3Blci1kZWZpbmVkIHBhcmFtZXRlcnMgdGhhdCBwcm92aWRlIHN0eWxpbmcgZGVmYXVsdHMgYW5kXG4gICAqIGNhbiBiZSBvdmVycmlkZGVuIG9uIGludm9jYXRpb24uIERlZmF1bHQgZGVsYXkgaXMgMC5cbiAgICovXG4gIG9wdGlvbnM6IHtwYXJhbXM/OiB7W25hbWU6IHN0cmluZ106IGFueX19fG51bGw7XG59XG5cbi8qKlxuICogRW5jYXBzdWxhdGVzIGFuIGFuaW1hdGlvbiBzdGF0ZSBieSBhc3NvY2lhdGluZyBhIHN0YXRlIG5hbWUgd2l0aCBhIHNldCBvZiBDU1Mgc3R5bGVzLlxuICogSW5zdGFudGlhdGVkIGFuZCByZXR1cm5lZCBieSB0aGUgW2BzdGF0ZSgpYF0oYXBpL2FuaW1hdGlvbnMvc3RhdGUpIGZ1bmN0aW9uLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBbmltYXRpb25TdGF0ZU1ldGFkYXRhIGV4dGVuZHMgQW5pbWF0aW9uTWV0YWRhdGEge1xuICAvKipcbiAgICogVGhlIHN0YXRlIG5hbWUsIHVuaXF1ZSB3aXRoaW4gdGhlIGNvbXBvbmVudC5cbiAgICovXG4gIG5hbWU6IHN0cmluZztcbiAgLyoqXG4gICAqICBUaGUgQ1NTIHN0eWxlcyBhc3NvY2lhdGVkIHdpdGggdGhpcyBzdGF0ZS5cbiAgICovXG4gIHN0eWxlczogQW5pbWF0aW9uU3R5bGVNZXRhZGF0YTtcbiAgLyoqXG4gICAqIEFuIG9wdGlvbnMgb2JqZWN0IGNvbnRhaW5pbmdcbiAgICogZGV2ZWxvcGVyLWRlZmluZWQgcGFyYW1ldGVycyB0aGF0IHByb3ZpZGUgc3R5bGluZyBkZWZhdWx0cyBhbmRcbiAgICogY2FuIGJlIG92ZXJyaWRkZW4gb24gaW52b2NhdGlvbi5cbiAgICovXG4gIG9wdGlvbnM/OiB7cGFyYW1zOiB7W25hbWU6IHN0cmluZ106IGFueX19O1xufVxuXG4vKipcbiAqIEVuY2Fwc3VsYXRlcyBhbiBhbmltYXRpb24gdHJhbnNpdGlvbi4gSW5zdGFudGlhdGVkIGFuZCByZXR1cm5lZCBieSB0aGVcbiAqIGB0cmFuc2l0aW9uKClgIGZ1bmN0aW9uLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBbmltYXRpb25UcmFuc2l0aW9uTWV0YWRhdGEgZXh0ZW5kcyBBbmltYXRpb25NZXRhZGF0YSB7XG4gIC8qKlxuICAgKiBBbiBleHByZXNzaW9uIHRoYXQgZGVzY3JpYmVzIGEgc3RhdGUgY2hhbmdlLlxuICAgKi9cbiAgZXhwcjogc3RyaW5nfFxuICAgICAgKChmcm9tU3RhdGU6IHN0cmluZywgdG9TdGF0ZTogc3RyaW5nLCBlbGVtZW50PzogYW55LFxuICAgICAgICBwYXJhbXM/OiB7W2tleTogc3RyaW5nXTogYW55fSkgPT4gYm9vbGVhbik7XG4gIC8qKlxuICAgKiBPbmUgb3IgbW9yZSBhbmltYXRpb24gb2JqZWN0cyB0byB3aGljaCB0aGlzIHRyYW5zaXRpb24gYXBwbGllcy5cbiAgICovXG4gIGFuaW1hdGlvbjogQW5pbWF0aW9uTWV0YWRhdGF8QW5pbWF0aW9uTWV0YWRhdGFbXTtcbiAgLyoqXG4gICAqIEFuIG9wdGlvbnMgb2JqZWN0IGNvbnRhaW5pbmcgYSBkZWxheSBhbmRcbiAgICogZGV2ZWxvcGVyLWRlZmluZWQgcGFyYW1ldGVycyB0aGF0IHByb3ZpZGUgc3R5bGluZyBkZWZhdWx0cyBhbmRcbiAgICogY2FuIGJlIG92ZXJyaWRkZW4gb24gaW52b2NhdGlvbi4gRGVmYXVsdCBkZWxheSBpcyAwLlxuICAgKi9cbiAgb3B0aW9uczogQW5pbWF0aW9uT3B0aW9uc3xudWxsO1xufVxuXG4vKipcbiAqIEVuY2Fwc3VsYXRlcyBhIHJldXNhYmxlIGFuaW1hdGlvbiwgd2hpY2ggaXMgYSBjb2xsZWN0aW9uIG9mIGluZGl2aWR1YWwgYW5pbWF0aW9uIHN0ZXBzLlxuICogSW5zdGFudGlhdGVkIGFuZCByZXR1cm5lZCBieSB0aGUgYGFuaW1hdGlvbigpYCBmdW5jdGlvbiwgYW5kXG4gKiBwYXNzZWQgdG8gdGhlIGB1c2VBbmltYXRpb24oKWAgZnVuY3Rpb24uXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFuaW1hdGlvblJlZmVyZW5jZU1ldGFkYXRhIGV4dGVuZHMgQW5pbWF0aW9uTWV0YWRhdGEge1xuICAvKipcbiAgICogIE9uZSBvciBtb3JlIGFuaW1hdGlvbiBzdGVwIG9iamVjdHMuXG4gICAqL1xuICBhbmltYXRpb246IEFuaW1hdGlvbk1ldGFkYXRhfEFuaW1hdGlvbk1ldGFkYXRhW107XG4gIC8qKlxuICAgKiBBbiBvcHRpb25zIG9iamVjdCBjb250YWluaW5nIGEgZGVsYXkgYW5kXG4gICAqIGRldmVsb3Blci1kZWZpbmVkIHBhcmFtZXRlcnMgdGhhdCBwcm92aWRlIHN0eWxpbmcgZGVmYXVsdHMgYW5kXG4gICAqIGNhbiBiZSBvdmVycmlkZGVuIG9uIGludm9jYXRpb24uIERlZmF1bHQgZGVsYXkgaXMgMC5cbiAgICovXG4gIG9wdGlvbnM6IEFuaW1hdGlvbk9wdGlvbnN8bnVsbDtcbn1cblxuLyoqXG4gKiBFbmNhcHN1bGF0ZXMgYW4gYW5pbWF0aW9uIHF1ZXJ5LiBJbnN0YW50aWF0ZWQgYW5kIHJldHVybmVkIGJ5XG4gKiB0aGUgYHF1ZXJ5KClgIGZ1bmN0aW9uLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBbmltYXRpb25RdWVyeU1ldGFkYXRhIGV4dGVuZHMgQW5pbWF0aW9uTWV0YWRhdGEge1xuICAvKipcbiAgICogIFRoZSBDU1Mgc2VsZWN0b3IgZm9yIHRoaXMgcXVlcnkuXG4gICAqL1xuICBzZWxlY3Rvcjogc3RyaW5nO1xuICAvKipcbiAgICogT25lIG9yIG1vcmUgYW5pbWF0aW9uIHN0ZXAgb2JqZWN0cy5cbiAgICovXG4gIGFuaW1hdGlvbjogQW5pbWF0aW9uTWV0YWRhdGF8QW5pbWF0aW9uTWV0YWRhdGFbXTtcbiAgLyoqXG4gICAqIEEgcXVlcnkgb3B0aW9ucyBvYmplY3QuXG4gICAqL1xuICBvcHRpb25zOiBBbmltYXRpb25RdWVyeU9wdGlvbnN8bnVsbDtcbn1cblxuLyoqXG4gKiBFbmNhcHN1bGF0ZXMgYSBrZXlmcmFtZXMgc2VxdWVuY2UuIEluc3RhbnRpYXRlZCBhbmQgcmV0dXJuZWQgYnlcbiAqIHRoZSBga2V5ZnJhbWVzKClgIGZ1bmN0aW9uLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBbmltYXRpb25LZXlmcmFtZXNTZXF1ZW5jZU1ldGFkYXRhIGV4dGVuZHMgQW5pbWF0aW9uTWV0YWRhdGEge1xuICAvKipcbiAgICogQW4gYXJyYXkgb2YgYW5pbWF0aW9uIHN0eWxlcy5cbiAgICovXG4gIHN0ZXBzOiBBbmltYXRpb25TdHlsZU1ldGFkYXRhW107XG59XG5cbi8qKlxuICogRW5jYXBzdWxhdGVzIGFuIGFuaW1hdGlvbiBzdHlsZS4gSW5zdGFudGlhdGVkIGFuZCByZXR1cm5lZCBieVxuICogdGhlIGBzdHlsZSgpYCBmdW5jdGlvbi5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQW5pbWF0aW9uU3R5bGVNZXRhZGF0YSBleHRlbmRzIEFuaW1hdGlvbk1ldGFkYXRhIHtcbiAgLyoqXG4gICAqIEEgc2V0IG9mIENTUyBzdHlsZSBwcm9wZXJ0aWVzLlxuICAgKi9cbiAgc3R5bGVzOiAnKid8e1trZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlcn18QXJyYXk8e1trZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlcn18JyonPjtcbiAgLyoqXG4gICAqIEEgcGVyY2VudGFnZSBvZiB0aGUgdG90YWwgYW5pbWF0ZSB0aW1lIGF0IHdoaWNoIHRoZSBzdHlsZSBpcyB0byBiZSBhcHBsaWVkLlxuICAgKi9cbiAgb2Zmc2V0OiBudW1iZXJ8bnVsbDtcbn1cblxuLyoqXG4gKiBFbmNhcHN1bGF0ZXMgYW4gYW5pbWF0aW9uIHN0ZXAuIEluc3RhbnRpYXRlZCBhbmQgcmV0dXJuZWQgYnlcbiAqIHRoZSBgYW5pbWF0ZSgpYCBmdW5jdGlvbi5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQW5pbWF0aW9uQW5pbWF0ZU1ldGFkYXRhIGV4dGVuZHMgQW5pbWF0aW9uTWV0YWRhdGEge1xuICAvKipcbiAgICogVGhlIHRpbWluZyBkYXRhIGZvciB0aGUgc3RlcC5cbiAgICovXG4gIHRpbWluZ3M6IHN0cmluZ3xudW1iZXJ8QW5pbWF0ZVRpbWluZ3M7XG4gIC8qKlxuICAgKiBBIHNldCBvZiBzdHlsZXMgdXNlZCBpbiB0aGUgc3RlcC5cbiAgICovXG4gIHN0eWxlczogQW5pbWF0aW9uU3R5bGVNZXRhZGF0YXxBbmltYXRpb25LZXlmcmFtZXNTZXF1ZW5jZU1ldGFkYXRhfG51bGw7XG59XG5cbi8qKlxuICogRW5jYXBzdWxhdGVzIGEgY2hpbGQgYW5pbWF0aW9uLCB0aGF0IGNhbiBiZSBydW4gZXhwbGljaXRseSB3aGVuIHRoZSBwYXJlbnQgaXMgcnVuLlxuICogSW5zdGFudGlhdGVkIGFuZCByZXR1cm5lZCBieSB0aGUgYGFuaW1hdGVDaGlsZGAgZnVuY3Rpb24uXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFuaW1hdGlvbkFuaW1hdGVDaGlsZE1ldGFkYXRhIGV4dGVuZHMgQW5pbWF0aW9uTWV0YWRhdGEge1xuICAvKipcbiAgICogQW4gb3B0aW9ucyBvYmplY3QgY29udGFpbmluZyBhIGRlbGF5IGFuZFxuICAgKiBkZXZlbG9wZXItZGVmaW5lZCBwYXJhbWV0ZXJzIHRoYXQgcHJvdmlkZSBzdHlsaW5nIGRlZmF1bHRzIGFuZFxuICAgKiBjYW4gYmUgb3ZlcnJpZGRlbiBvbiBpbnZvY2F0aW9uLiBEZWZhdWx0IGRlbGF5IGlzIDAuXG4gICAqL1xuICBvcHRpb25zOiBBbmltYXRpb25PcHRpb25zfG51bGw7XG59XG5cbi8qKlxuICogRW5jYXBzdWxhdGVzIGEgcmV1c2FibGUgYW5pbWF0aW9uLlxuICogSW5zdGFudGlhdGVkIGFuZCByZXR1cm5lZCBieSB0aGUgYHVzZUFuaW1hdGlvbigpYCBmdW5jdGlvbi5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQW5pbWF0aW9uQW5pbWF0ZVJlZk1ldGFkYXRhIGV4dGVuZHMgQW5pbWF0aW9uTWV0YWRhdGEge1xuICAvKipcbiAgICogQW4gYW5pbWF0aW9uIHJlZmVyZW5jZSBvYmplY3QuXG4gICAqL1xuICBhbmltYXRpb246IEFuaW1hdGlvblJlZmVyZW5jZU1ldGFkYXRhO1xuICAvKipcbiAgICogQW4gb3B0aW9ucyBvYmplY3QgY29udGFpbmluZyBhIGRlbGF5IGFuZFxuICAgKiBkZXZlbG9wZXItZGVmaW5lZCBwYXJhbWV0ZXJzIHRoYXQgcHJvdmlkZSBzdHlsaW5nIGRlZmF1bHRzIGFuZFxuICAgKiBjYW4gYmUgb3ZlcnJpZGRlbiBvbiBpbnZvY2F0aW9uLiBEZWZhdWx0IGRlbGF5IGlzIDAuXG4gICAqL1xuICBvcHRpb25zOiBBbmltYXRpb25PcHRpb25zfG51bGw7XG59XG5cbi8qKlxuICogRW5jYXBzdWxhdGVzIGFuIGFuaW1hdGlvbiBzZXF1ZW5jZS5cbiAqIEluc3RhbnRpYXRlZCBhbmQgcmV0dXJuZWQgYnkgdGhlIGBzZXF1ZW5jZSgpYCBmdW5jdGlvbi5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQW5pbWF0aW9uU2VxdWVuY2VNZXRhZGF0YSBleHRlbmRzIEFuaW1hdGlvbk1ldGFkYXRhIHtcbiAgLyoqXG4gICAqICBBbiBhcnJheSBvZiBhbmltYXRpb24gc3RlcCBvYmplY3RzLlxuICAgKi9cbiAgc3RlcHM6IEFuaW1hdGlvbk1ldGFkYXRhW107XG4gIC8qKlxuICAgKiBBbiBvcHRpb25zIG9iamVjdCBjb250YWluaW5nIGEgZGVsYXkgYW5kXG4gICAqIGRldmVsb3Blci1kZWZpbmVkIHBhcmFtZXRlcnMgdGhhdCBwcm92aWRlIHN0eWxpbmcgZGVmYXVsdHMgYW5kXG4gICAqIGNhbiBiZSBvdmVycmlkZGVuIG9uIGludm9jYXRpb24uIERlZmF1bHQgZGVsYXkgaXMgMC5cbiAgICovXG4gIG9wdGlvbnM6IEFuaW1hdGlvbk9wdGlvbnN8bnVsbDtcbn1cblxuLyoqXG4gKiBFbmNhcHN1bGF0ZXMgYW4gYW5pbWF0aW9uIGdyb3VwLlxuICogSW5zdGFudGlhdGVkIGFuZCByZXR1cm5lZCBieSB0aGUgYHtAbGluayBhbmltYXRpb25zL2dyb3VwIGdyb3VwKCl9YCBmdW5jdGlvbi5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQW5pbWF0aW9uR3JvdXBNZXRhZGF0YSBleHRlbmRzIEFuaW1hdGlvbk1ldGFkYXRhIHtcbiAgLyoqXG4gICAqIE9uZSBvciBtb3JlIGFuaW1hdGlvbiBvciBzdHlsZSBzdGVwcyB0aGF0IGZvcm0gdGhpcyBncm91cC5cbiAgICovXG4gIHN0ZXBzOiBBbmltYXRpb25NZXRhZGF0YVtdO1xuICAvKipcbiAgICogQW4gb3B0aW9ucyBvYmplY3QgY29udGFpbmluZyBhIGRlbGF5IGFuZFxuICAgKiBkZXZlbG9wZXItZGVmaW5lZCBwYXJhbWV0ZXJzIHRoYXQgcHJvdmlkZSBzdHlsaW5nIGRlZmF1bHRzIGFuZFxuICAgKiBjYW4gYmUgb3ZlcnJpZGRlbiBvbiBpbnZvY2F0aW9uLiBEZWZhdWx0IGRlbGF5IGlzIDAuXG4gICAqL1xuICBvcHRpb25zOiBBbmltYXRpb25PcHRpb25zfG51bGw7XG59XG5cbi8qKlxuICogRW5jYXBzdWxhdGVzIGFuaW1hdGlvbiBxdWVyeSBvcHRpb25zLlxuICogUGFzc2VkIHRvIHRoZSBgcXVlcnkoKWAgZnVuY3Rpb24uXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgQW5pbWF0aW9uUXVlcnlPcHRpb25zIGV4dGVuZHMgQW5pbWF0aW9uT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUcnVlIGlmIHRoaXMgcXVlcnkgaXMgb3B0aW9uYWwsIGZhbHNlIGlmIGl0IGlzIHJlcXVpcmVkLiBEZWZhdWx0IGlzIGZhbHNlLlxuICAgKiBBIHJlcXVpcmVkIHF1ZXJ5IHRocm93cyBhbiBlcnJvciBpZiBubyBlbGVtZW50cyBhcmUgcmV0cmlldmVkIHdoZW5cbiAgICogdGhlIHF1ZXJ5IGlzIGV4ZWN1dGVkLiBBbiBvcHRpb25hbCBxdWVyeSBkb2VzIG5vdC5cbiAgICpcbiAgICovXG4gIG9wdGlvbmFsPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIEEgbWF4aW11bSB0b3RhbCBudW1iZXIgb2YgcmVzdWx0cyB0byByZXR1cm4gZnJvbSB0aGUgcXVlcnkuXG4gICAqIElmIG5lZ2F0aXZlLCByZXN1bHRzIGFyZSBsaW1pdGVkIGZyb20gdGhlIGVuZCBvZiB0aGUgcXVlcnkgbGlzdCB0b3dhcmRzIHRoZSBiZWdpbm5pbmcuXG4gICAqIEJ5IGRlZmF1bHQsIHJlc3VsdHMgYXJlIG5vdCBsaW1pdGVkLlxuICAgKi9cbiAgbGltaXQ/OiBudW1iZXI7XG59XG5cbi8qKlxuICogRW5jYXBzdWxhdGVzIHBhcmFtZXRlcnMgZm9yIHN0YWdnZXJpbmcgdGhlIHN0YXJ0IHRpbWVzIG9mIGEgc2V0IG9mIGFuaW1hdGlvbiBzdGVwcy5cbiAqIEluc3RhbnRpYXRlZCBhbmQgcmV0dXJuZWQgYnkgdGhlIGBzdGFnZ2VyKClgIGZ1bmN0aW9uLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqKi9cbmV4cG9ydCBpbnRlcmZhY2UgQW5pbWF0aW9uU3RhZ2dlck1ldGFkYXRhIGV4dGVuZHMgQW5pbWF0aW9uTWV0YWRhdGEge1xuICAvKipcbiAgICogVGhlIHRpbWluZyBkYXRhIGZvciB0aGUgc3RlcHMuXG4gICAqL1xuICB0aW1pbmdzOiBzdHJpbmd8bnVtYmVyO1xuICAvKipcbiAgICogT25lIG9yIG1vcmUgYW5pbWF0aW9uIHN0ZXBzLlxuICAgKi9cbiAgYW5pbWF0aW9uOiBBbmltYXRpb25NZXRhZGF0YXxBbmltYXRpb25NZXRhZGF0YVtdO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuYW1lZCBhbmltYXRpb24gdHJpZ2dlciwgY29udGFpbmluZyBhICBsaXN0IG9mIFtgc3RhdGUoKWBdKGFwaS9hbmltYXRpb25zL3N0YXRlKVxuICogYW5kIGB0cmFuc2l0aW9uKClgIGVudHJpZXMgdG8gYmUgZXZhbHVhdGVkIHdoZW4gdGhlIGV4cHJlc3Npb25cbiAqIGJvdW5kIHRvIHRoZSB0cmlnZ2VyIGNoYW5nZXMuXG4gKlxuICogQHBhcmFtIG5hbWUgQW4gaWRlbnRpZnlpbmcgc3RyaW5nLlxuICogQHBhcmFtIGRlZmluaXRpb25zICBBbiBhbmltYXRpb24gZGVmaW5pdGlvbiBvYmplY3QsIGNvbnRhaW5pbmcgYW4gYXJyYXkgb2ZcbiAqIFtgc3RhdGUoKWBdKGFwaS9hbmltYXRpb25zL3N0YXRlKSBhbmQgYHRyYW5zaXRpb24oKWAgZGVjbGFyYXRpb25zLlxuICpcbiAqIEByZXR1cm4gQW4gb2JqZWN0IHRoYXQgZW5jYXBzdWxhdGVzIHRoZSB0cmlnZ2VyIGRhdGEuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqIERlZmluZSBhbiBhbmltYXRpb24gdHJpZ2dlciBpbiB0aGUgYGFuaW1hdGlvbnNgIHNlY3Rpb24gb2YgYEBDb21wb25lbnRgIG1ldGFkYXRhLlxuICogSW4gdGhlIHRlbXBsYXRlLCByZWZlcmVuY2UgdGhlIHRyaWdnZXIgYnkgbmFtZSBhbmQgYmluZCBpdCB0byBhIHRyaWdnZXIgZXhwcmVzc2lvbiB0aGF0XG4gKiBldmFsdWF0ZXMgdG8gYSBkZWZpbmVkIGFuaW1hdGlvbiBzdGF0ZSwgdXNpbmcgdGhlIGZvbGxvd2luZyBmb3JtYXQ6XG4gKlxuICogYFtAdHJpZ2dlck5hbWVdPVwiZXhwcmVzc2lvblwiYFxuICpcbiAqIEFuaW1hdGlvbiB0cmlnZ2VyIGJpbmRpbmdzIGNvbnZlcnQgYWxsIHZhbHVlcyB0byBzdHJpbmdzLCBhbmQgdGhlbiBtYXRjaCB0aGVcbiAqIHByZXZpb3VzIGFuZCBjdXJyZW50IHZhbHVlcyBhZ2FpbnN0IGFueSBsaW5rZWQgdHJhbnNpdGlvbnMuXG4gKiBCb29sZWFucyBjYW4gYmUgc3BlY2lmaWVkIGFzIGAxYCBvciBgdHJ1ZWAgYW5kIGAwYCBvciBgZmFsc2VgLlxuICpcbiAqICMjIyBVc2FnZSBFeGFtcGxlXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIGNyZWF0ZXMgYW4gYW5pbWF0aW9uIHRyaWdnZXIgcmVmZXJlbmNlIGJhc2VkIG9uIHRoZSBwcm92aWRlZFxuICogbmFtZSB2YWx1ZS5cbiAqIFRoZSBwcm92aWRlZCBhbmltYXRpb24gdmFsdWUgaXMgZXhwZWN0ZWQgdG8gYmUgYW4gYXJyYXkgY29uc2lzdGluZyBvZiBzdGF0ZSBhbmRcbiAqIHRyYW5zaXRpb24gZGVjbGFyYXRpb25zLlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIEBDb21wb25lbnQoe1xuICogICBzZWxlY3RvcjogXCJteS1jb21wb25lbnRcIixcbiAqICAgdGVtcGxhdGVVcmw6IFwibXktY29tcG9uZW50LXRwbC5odG1sXCIsXG4gKiAgIGFuaW1hdGlvbnM6IFtcbiAqICAgICB0cmlnZ2VyKFwibXlBbmltYXRpb25UcmlnZ2VyXCIsIFtcbiAqICAgICAgIHN0YXRlKC4uLiksXG4gKiAgICAgICBzdGF0ZSguLi4pLFxuICogICAgICAgdHJhbnNpdGlvbiguLi4pLFxuICogICAgICAgdHJhbnNpdGlvbiguLi4pXG4gKiAgICAgXSlcbiAqICAgXVxuICogfSlcbiAqIGNsYXNzIE15Q29tcG9uZW50IHtcbiAqICAgbXlTdGF0dXNFeHAgPSBcInNvbWV0aGluZ1wiO1xuICogfVxuICogYGBgXG4gKlxuICogVGhlIHRlbXBsYXRlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGNvbXBvbmVudCBtYWtlcyB1c2Ugb2YgdGhlIGRlZmluZWQgdHJpZ2dlclxuICogYnkgYmluZGluZyB0byBhbiBlbGVtZW50IHdpdGhpbiBpdHMgdGVtcGxhdGUgY29kZS5cbiAqXG4gKiBgYGBodG1sXG4gKiA8IS0tIHNvbWV3aGVyZSBpbnNpZGUgb2YgbXktY29tcG9uZW50LXRwbC5odG1sIC0tPlxuICogPGRpdiBbQG15QW5pbWF0aW9uVHJpZ2dlcl09XCJteVN0YXR1c0V4cFwiPi4uLjwvZGl2PlxuICogYGBgXG4gKlxuICogIyMjIFVzaW5nIGFuIGlubGluZSBmdW5jdGlvblxuICogVGhlIGB0cmFuc2l0aW9uYCBhbmltYXRpb24gbWV0aG9kIGFsc28gc3VwcG9ydHMgcmVhZGluZyBhbiBpbmxpbmUgZnVuY3Rpb24gd2hpY2ggY2FuIGRlY2lkZVxuICogaWYgaXRzIGFzc29jaWF0ZWQgYW5pbWF0aW9uIHNob3VsZCBiZSBydW4uXG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogLy8gdGhpcyBtZXRob2QgaXMgcnVuIGVhY2ggdGltZSB0aGUgYG15QW5pbWF0aW9uVHJpZ2dlcmAgdHJpZ2dlciB2YWx1ZSBjaGFuZ2VzLlxuICogZnVuY3Rpb24gbXlJbmxpbmVNYXRjaGVyRm4oZnJvbVN0YXRlOiBzdHJpbmcsIHRvU3RhdGU6IHN0cmluZywgZWxlbWVudDogYW55LCBwYXJhbXM6IHtba2V5OlxuIHN0cmluZ106IGFueX0pOiBib29sZWFuIHtcbiAqICAgLy8gbm90aWNlIHRoYXQgYGVsZW1lbnRgIGFuZCBgcGFyYW1zYCBhcmUgYWxzbyBhdmFpbGFibGUgaGVyZVxuICogICByZXR1cm4gdG9TdGF0ZSA9PSAneWVzLXBsZWFzZS1hbmltYXRlJztcbiAqIH1cbiAqXG4gKiBAQ29tcG9uZW50KHtcbiAqICAgc2VsZWN0b3I6ICdteS1jb21wb25lbnQnLFxuICogICB0ZW1wbGF0ZVVybDogJ215LWNvbXBvbmVudC10cGwuaHRtbCcsXG4gKiAgIGFuaW1hdGlvbnM6IFtcbiAqICAgICB0cmlnZ2VyKCdteUFuaW1hdGlvblRyaWdnZXInLCBbXG4gKiAgICAgICB0cmFuc2l0aW9uKG15SW5saW5lTWF0Y2hlckZuLCBbXG4gKiAgICAgICAgIC8vIHRoZSBhbmltYXRpb24gc2VxdWVuY2UgY29kZVxuICogICAgICAgXSksXG4gKiAgICAgXSlcbiAqICAgXVxuICogfSlcbiAqIGNsYXNzIE15Q29tcG9uZW50IHtcbiAqICAgbXlTdGF0dXNFeHAgPSBcInllcy1wbGVhc2UtYW5pbWF0ZVwiO1xuICogfVxuICogYGBgXG4gKlxuICogIyMjIERpc2FibGluZyBBbmltYXRpb25zXG4gKiBXaGVuIHRydWUsIHRoZSBzcGVjaWFsIGFuaW1hdGlvbiBjb250cm9sIGJpbmRpbmcgYEAuZGlzYWJsZWRgIGJpbmRpbmcgcHJldmVudHNcbiAqIGFsbCBhbmltYXRpb25zIGZyb20gcmVuZGVyaW5nLlxuICogUGxhY2UgdGhlICBgQC5kaXNhYmxlZGAgYmluZGluZyBvbiBhbiBlbGVtZW50IHRvIGRpc2FibGVcbiAqIGFuaW1hdGlvbnMgb24gdGhlIGVsZW1lbnQgaXRzZWxmLCBhcyB3ZWxsIGFzIGFueSBpbm5lciBhbmltYXRpb24gdHJpZ2dlcnNcbiAqIHdpdGhpbiB0aGUgZWxlbWVudC5cbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgaG93IHRvIHVzZSB0aGlzIGZlYXR1cmU6XG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogQENvbXBvbmVudCh7XG4gKiAgIHNlbGVjdG9yOiAnbXktY29tcG9uZW50JyxcbiAqICAgdGVtcGxhdGU6IGBcbiAqICAgICA8ZGl2IFtALmRpc2FibGVkXT1cImlzRGlzYWJsZWRcIj5cbiAqICAgICAgIDxkaXYgW0BjaGlsZEFuaW1hdGlvbl09XCJleHBcIj48L2Rpdj5cbiAqICAgICA8L2Rpdj5cbiAqICAgYCxcbiAqICAgYW5pbWF0aW9uczogW1xuICogICAgIHRyaWdnZXIoXCJjaGlsZEFuaW1hdGlvblwiLCBbXG4gKiAgICAgICAvLyAuLi5cbiAqICAgICBdKVxuICogICBdXG4gKiB9KVxuICogY2xhc3MgTXlDb21wb25lbnQge1xuICogICBpc0Rpc2FibGVkID0gdHJ1ZTtcbiAqICAgZXhwID0gJy4uLic7XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBXaGVuIGBALmRpc2FibGVkYCBpcyB0cnVlLCBpdCBwcmV2ZW50cyB0aGUgYEBjaGlsZEFuaW1hdGlvbmAgdHJpZ2dlciBmcm9tIGFuaW1hdGluZyxcbiAqIGFsb25nIHdpdGggYW55IGlubmVyIGFuaW1hdGlvbnMuXG4gKlxuICogIyMjIERpc2FibGUgYW5pbWF0aW9ucyBhcHBsaWNhdGlvbi13aWRlXG4gKiBXaGVuIGFuIGFyZWEgb2YgdGhlIHRlbXBsYXRlIGlzIHNldCB0byBoYXZlIGFuaW1hdGlvbnMgZGlzYWJsZWQsXG4gKiAqKmFsbCoqIGlubmVyIGNvbXBvbmVudHMgaGF2ZSB0aGVpciBhbmltYXRpb25zIGRpc2FibGVkIGFzIHdlbGwuXG4gKiBUaGlzIG1lYW5zIHRoYXQgeW91IGNhbiBkaXNhYmxlIGFsbCBhbmltYXRpb25zIGZvciBhbiBhcHBcbiAqIGJ5IHBsYWNpbmcgYSBob3N0IGJpbmRpbmcgc2V0IG9uIGBALmRpc2FibGVkYCBvbiB0aGUgdG9wbW9zdCBBbmd1bGFyIGNvbXBvbmVudC5cbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbXBvcnQge0NvbXBvbmVudCwgSG9zdEJpbmRpbmd9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuICpcbiAqIEBDb21wb25lbnQoe1xuICogICBzZWxlY3RvcjogJ2FwcC1jb21wb25lbnQnLFxuICogICB0ZW1wbGF0ZVVybDogJ2FwcC5jb21wb25lbnQuaHRtbCcsXG4gKiB9KVxuICogY2xhc3MgQXBwQ29tcG9uZW50IHtcbiAqICAgQEhvc3RCaW5kaW5nKCdALmRpc2FibGVkJylcbiAqICAgcHVibGljIGFuaW1hdGlvbnNEaXNhYmxlZCA9IHRydWU7XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiAjIyMgT3ZlcnJpZGluZyBkaXNhYmxlbWVudCBvZiBpbm5lciBhbmltYXRpb25zXG4gKiBEZXNwaXRlIGlubmVyIGFuaW1hdGlvbnMgYmVpbmcgZGlzYWJsZWQsIGEgcGFyZW50IGFuaW1hdGlvbiBjYW4gYHF1ZXJ5KClgXG4gKiBmb3IgaW5uZXIgZWxlbWVudHMgbG9jYXRlZCBpbiBkaXNhYmxlZCBhcmVhcyBvZiB0aGUgdGVtcGxhdGUgYW5kIHN0aWxsIGFuaW1hdGVcbiAqIHRoZW0gaWYgbmVlZGVkLiBUaGlzIGlzIGFsc28gdGhlIGNhc2UgZm9yIHdoZW4gYSBzdWIgYW5pbWF0aW9uIGlzXG4gKiBxdWVyaWVkIGJ5IGEgcGFyZW50IGFuZCB0aGVuIGxhdGVyIGFuaW1hdGVkIHVzaW5nIGBhbmltYXRlQ2hpbGQoKWAuXG4gKlxuICogIyMjIERldGVjdGluZyB3aGVuIGFuIGFuaW1hdGlvbiBpcyBkaXNhYmxlZFxuICogSWYgYSByZWdpb24gb2YgdGhlIERPTSAob3IgdGhlIGVudGlyZSBhcHBsaWNhdGlvbikgaGFzIGl0cyBhbmltYXRpb25zIGRpc2FibGVkLCB0aGUgYW5pbWF0aW9uXG4gKiB0cmlnZ2VyIGNhbGxiYWNrcyBzdGlsbCBmaXJlLCBidXQgZm9yIHplcm8gc2Vjb25kcy4gV2hlbiB0aGUgY2FsbGJhY2sgZmlyZXMsIGl0IHByb3ZpZGVzXG4gKiBhbiBpbnN0YW5jZSBvZiBhbiBgQW5pbWF0aW9uRXZlbnRgLiBJZiBhbmltYXRpb25zIGFyZSBkaXNhYmxlZCxcbiAqIHRoZSBgLmRpc2FibGVkYCBmbGFnIG9uIHRoZSBldmVudCBpcyB0cnVlLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRyaWdnZXIobmFtZTogc3RyaW5nLCBkZWZpbml0aW9uczogQW5pbWF0aW9uTWV0YWRhdGFbXSk6IEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YSB7XG4gIHJldHVybiB7dHlwZTogQW5pbWF0aW9uTWV0YWRhdGFUeXBlLlRyaWdnZXIsIG5hbWUsIGRlZmluaXRpb25zLCBvcHRpb25zOiB7fX07XG59XG5cbi8qKlxuICogRGVmaW5lcyBhbiBhbmltYXRpb24gc3RlcCB0aGF0IGNvbWJpbmVzIHN0eWxpbmcgaW5mb3JtYXRpb24gd2l0aCB0aW1pbmcgaW5mb3JtYXRpb24uXG4gKlxuICogQHBhcmFtIHRpbWluZ3MgU2V0cyBgQW5pbWF0ZVRpbWluZ3NgIGZvciB0aGUgcGFyZW50IGFuaW1hdGlvbi5cbiAqIEEgc3RyaW5nIGluIHRoZSBmb3JtYXQgXCJkdXJhdGlvbiBbZGVsYXldIFtlYXNpbmddXCIuXG4gKiAgLSBEdXJhdGlvbiBhbmQgZGVsYXkgYXJlIGV4cHJlc3NlZCBhcyBhIG51bWJlciBhbmQgb3B0aW9uYWwgdGltZSB1bml0LFxuICogc3VjaCBhcyBcIjFzXCIgb3IgXCIxMG1zXCIgZm9yIG9uZSBzZWNvbmQgYW5kIDEwIG1pbGxpc2Vjb25kcywgcmVzcGVjdGl2ZWx5LlxuICogVGhlIGRlZmF1bHQgdW5pdCBpcyBtaWxsaXNlY29uZHMuXG4gKiAgLSBUaGUgZWFzaW5nIHZhbHVlIGNvbnRyb2xzIGhvdyB0aGUgYW5pbWF0aW9uIGFjY2VsZXJhdGVzIGFuZCBkZWNlbGVyYXRlc1xuICogZHVyaW5nIGl0cyBydW50aW1lLiBWYWx1ZSBpcyBvbmUgb2YgIGBlYXNlYCwgYGVhc2UtaW5gLCBgZWFzZS1vdXRgLFxuICogYGVhc2UtaW4tb3V0YCwgb3IgYSBgY3ViaWMtYmV6aWVyKClgIGZ1bmN0aW9uIGNhbGwuXG4gKiBJZiBub3Qgc3VwcGxpZWQsIG5vIGVhc2luZyBpcyBhcHBsaWVkLlxuICpcbiAqIEZvciBleGFtcGxlLCB0aGUgc3RyaW5nIFwiMXMgMTAwbXMgZWFzZS1vdXRcIiBzcGVjaWZpZXMgYSBkdXJhdGlvbiBvZlxuICogMTAwMCBtaWxsaXNlY29uZHMsIGFuZCBkZWxheSBvZiAxMDAgbXMsIGFuZCB0aGUgXCJlYXNlLW91dFwiIGVhc2luZyBzdHlsZSxcbiAqIHdoaWNoIGRlY2VsZXJhdGVzIG5lYXIgdGhlIGVuZCBvZiB0aGUgZHVyYXRpb24uXG4gKiBAcGFyYW0gc3R5bGVzIFNldHMgQW5pbWF0aW9uU3R5bGVzIGZvciB0aGUgcGFyZW50IGFuaW1hdGlvbi5cbiAqIEEgZnVuY3Rpb24gY2FsbCB0byBlaXRoZXIgYHN0eWxlKClgIG9yIGBrZXlmcmFtZXMoKWBcbiAqIHRoYXQgcmV0dXJucyBhIGNvbGxlY3Rpb24gb2YgQ1NTIHN0eWxlIGVudHJpZXMgdG8gYmUgYXBwbGllZCB0byB0aGUgcGFyZW50IGFuaW1hdGlvbi5cbiAqIFdoZW4gbnVsbCwgdXNlcyB0aGUgc3R5bGVzIGZyb20gdGhlIGRlc3RpbmF0aW9uIHN0YXRlLlxuICogVGhpcyBpcyB1c2VmdWwgd2hlbiBkZXNjcmliaW5nIGFuIGFuaW1hdGlvbiBzdGVwIHRoYXQgd2lsbCBjb21wbGV0ZSBhbiBhbmltYXRpb247XG4gKiBzZWUgXCJBbmltYXRpbmcgdG8gdGhlIGZpbmFsIHN0YXRlXCIgaW4gYHRyYW5zaXRpb25zKClgLlxuICogQHJldHVybnMgQW4gb2JqZWN0IHRoYXQgZW5jYXBzdWxhdGVzIHRoZSBhbmltYXRpb24gc3RlcC5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICogQ2FsbCB3aXRoaW4gYW4gYW5pbWF0aW9uIGBzZXF1ZW5jZSgpYCwgYHtAbGluayBhbmltYXRpb25zL2dyb3VwIGdyb3VwKCl9YCwgb3JcbiAqIGB0cmFuc2l0aW9uKClgIGNhbGwgdG8gc3BlY2lmeSBhbiBhbmltYXRpb24gc3RlcFxuICogdGhhdCBhcHBsaWVzIGdpdmVuIHN0eWxlIGRhdGEgdG8gdGhlIHBhcmVudCBhbmltYXRpb24gZm9yIGEgZ2l2ZW4gYW1vdW50IG9mIHRpbWUuXG4gKlxuICogIyMjIFN5bnRheCBFeGFtcGxlc1xuICogKipUaW1pbmcgZXhhbXBsZXMqKlxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZXMgc2hvdyB2YXJpb3VzIGB0aW1pbmdzYCBzcGVjaWZpY2F0aW9ucy5cbiAqIC0gYGFuaW1hdGUoNTAwKWAgOiBEdXJhdGlvbiBpcyA1MDAgbWlsbGlzZWNvbmRzLlxuICogLSBgYW5pbWF0ZShcIjFzXCIpYCA6IER1cmF0aW9uIGlzIDEwMDAgbWlsbGlzZWNvbmRzLlxuICogLSBgYW5pbWF0ZShcIjEwMG1zIDAuNXNcIilgIDogRHVyYXRpb24gaXMgMTAwIG1pbGxpc2Vjb25kcywgZGVsYXkgaXMgNTAwIG1pbGxpc2Vjb25kcy5cbiAqIC0gYGFuaW1hdGUoXCI1cyBlYXNlLWluXCIpYCA6IER1cmF0aW9uIGlzIDUwMDAgbWlsbGlzZWNvbmRzLCBlYXNpbmcgaW4uXG4gKiAtIGBhbmltYXRlKFwiNXMgMTBtcyBjdWJpYy1iZXppZXIoLjE3LC42NywuODgsLjEpXCIpYCA6IER1cmF0aW9uIGlzIDUwMDAgbWlsbGlzZWNvbmRzLCBkZWxheSBpcyAxMFxuICogbWlsbGlzZWNvbmRzLCBlYXNpbmcgYWNjb3JkaW5nIHRvIGEgYmV6aWVyIGN1cnZlLlxuICpcbiAqICoqU3R5bGUgZXhhbXBsZXMqKlxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBjYWxscyBgc3R5bGUoKWAgdG8gc2V0IGEgc2luZ2xlIENTUyBzdHlsZS5cbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGFuaW1hdGUoNTAwLCBzdHlsZSh7IGJhY2tncm91bmQ6IFwicmVkXCIgfSkpXG4gKiBgYGBcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBjYWxscyBga2V5ZnJhbWVzKClgIHRvIHNldCBhIENTUyBzdHlsZVxuICogdG8gZGlmZmVyZW50IHZhbHVlcyBmb3Igc3VjY2Vzc2l2ZSBrZXlmcmFtZXMuXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBhbmltYXRlKDUwMCwga2V5ZnJhbWVzKFxuICogIFtcbiAqICAgc3R5bGUoeyBiYWNrZ3JvdW5kOiBcImJsdWVcIiB9KSxcbiAqICAgc3R5bGUoeyBiYWNrZ3JvdW5kOiBcInJlZFwiIH0pXG4gKiAgXSlcbiAqIGBgYFxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFuaW1hdGUoXG4gICAgdGltaW5nczogc3RyaW5nfG51bWJlcixcbiAgICBzdHlsZXM6IEFuaW1hdGlvblN0eWxlTWV0YWRhdGF8QW5pbWF0aW9uS2V5ZnJhbWVzU2VxdWVuY2VNZXRhZGF0YXxudWxsID1cbiAgICAgICAgbnVsbCk6IEFuaW1hdGlvbkFuaW1hdGVNZXRhZGF0YSB7XG4gIHJldHVybiB7dHlwZTogQW5pbWF0aW9uTWV0YWRhdGFUeXBlLkFuaW1hdGUsIHN0eWxlcywgdGltaW5nc307XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIERlZmluZXMgYSBsaXN0IG9mIGFuaW1hdGlvbiBzdGVwcyB0byBiZSBydW4gaW4gcGFyYWxsZWwuXG4gKlxuICogQHBhcmFtIHN0ZXBzIEFuIGFycmF5IG9mIGFuaW1hdGlvbiBzdGVwIG9iamVjdHMuXG4gKiAtIFdoZW4gc3RlcHMgYXJlIGRlZmluZWQgYnkgYHN0eWxlKClgIG9yIGBhbmltYXRlKClgXG4gKiBmdW5jdGlvbiBjYWxscywgZWFjaCBjYWxsIHdpdGhpbiB0aGUgZ3JvdXAgaXMgZXhlY3V0ZWQgaW5zdGFudGx5LlxuICogLSBUbyBzcGVjaWZ5IG9mZnNldCBzdHlsZXMgdG8gYmUgYXBwbGllZCBhdCBhIGxhdGVyIHRpbWUsIGRlZmluZSBzdGVwcyB3aXRoXG4gKiBga2V5ZnJhbWVzKClgLCBvciB1c2UgYGFuaW1hdGUoKWAgY2FsbHMgd2l0aCBhIGRlbGF5IHZhbHVlLlxuICogRm9yIGV4YW1wbGU6XG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogZ3JvdXAoW1xuICogICBhbmltYXRlKFwiMXNcIiwgc3R5bGUoeyBiYWNrZ3JvdW5kOiBcImJsYWNrXCIgfSkpLFxuICogICBhbmltYXRlKFwiMnNcIiwgc3R5bGUoeyBjb2xvcjogXCJ3aGl0ZVwiIH0pKVxuICogXSlcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSBvcHRpb25zIEFuIG9wdGlvbnMgb2JqZWN0IGNvbnRhaW5pbmcgYSBkZWxheSBhbmRcbiAqIGRldmVsb3Blci1kZWZpbmVkIHBhcmFtZXRlcnMgdGhhdCBwcm92aWRlIHN0eWxpbmcgZGVmYXVsdHMgYW5kXG4gKiBjYW4gYmUgb3ZlcnJpZGRlbiBvbiBpbnZvY2F0aW9uLlxuICpcbiAqIEByZXR1cm4gQW4gb2JqZWN0IHRoYXQgZW5jYXBzdWxhdGVzIHRoZSBncm91cCBkYXRhLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKiBHcm91cGVkIGFuaW1hdGlvbnMgYXJlIHVzZWZ1bCB3aGVuIGEgc2VyaWVzIG9mIHN0eWxlcyBtdXN0IGJlXG4gKiBhbmltYXRlZCBhdCBkaWZmZXJlbnQgc3RhcnRpbmcgdGltZXMgYW5kIGNsb3NlZCBvZmYgYXQgZGlmZmVyZW50IGVuZGluZyB0aW1lcy5cbiAqXG4gKiBXaGVuIGNhbGxlZCB3aXRoaW4gYSBgc2VxdWVuY2UoKWAgb3IgYVxuICogYHRyYW5zaXRpb24oKWAgY2FsbCwgZG9lcyBub3QgY29udGludWUgdG8gdGhlIG5leHRcbiAqIGluc3RydWN0aW9uIHVudGlsIGFsbCBvZiB0aGUgaW5uZXIgYW5pbWF0aW9uIHN0ZXBzIGhhdmUgY29tcGxldGVkLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdyb3VwKFxuICAgIHN0ZXBzOiBBbmltYXRpb25NZXRhZGF0YVtdLCBvcHRpb25zOiBBbmltYXRpb25PcHRpb25zfG51bGwgPSBudWxsKTogQW5pbWF0aW9uR3JvdXBNZXRhZGF0YSB7XG4gIHJldHVybiB7dHlwZTogQW5pbWF0aW9uTWV0YWRhdGFUeXBlLkdyb3VwLCBzdGVwcywgb3B0aW9uc307XG59XG5cbi8qKlxuICogRGVmaW5lcyBhIGxpc3Qgb2YgYW5pbWF0aW9uIHN0ZXBzIHRvIGJlIHJ1biBzZXF1ZW50aWFsbHksIG9uZSBieSBvbmUuXG4gKlxuICogQHBhcmFtIHN0ZXBzIEFuIGFycmF5IG9mIGFuaW1hdGlvbiBzdGVwIG9iamVjdHMuXG4gKiAtIFN0ZXBzIGRlZmluZWQgYnkgYHN0eWxlKClgIGNhbGxzIGFwcGx5IHRoZSBzdHlsaW5nIGRhdGEgaW1tZWRpYXRlbHkuXG4gKiAtIFN0ZXBzIGRlZmluZWQgYnkgYGFuaW1hdGUoKWAgY2FsbHMgYXBwbHkgdGhlIHN0eWxpbmcgZGF0YSBvdmVyIHRpbWVcbiAqICAgYXMgc3BlY2lmaWVkIGJ5IHRoZSB0aW1pbmcgZGF0YS5cbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBzZXF1ZW5jZShbXG4gKiAgIHN0eWxlKHsgb3BhY2l0eTogMCB9KSxcbiAqICAgYW5pbWF0ZShcIjFzXCIsIHN0eWxlKHsgb3BhY2l0eTogMSB9KSlcbiAqIF0pXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gb3B0aW9ucyBBbiBvcHRpb25zIG9iamVjdCBjb250YWluaW5nIGEgZGVsYXkgYW5kXG4gKiBkZXZlbG9wZXItZGVmaW5lZCBwYXJhbWV0ZXJzIHRoYXQgcHJvdmlkZSBzdHlsaW5nIGRlZmF1bHRzIGFuZFxuICogY2FuIGJlIG92ZXJyaWRkZW4gb24gaW52b2NhdGlvbi5cbiAqXG4gKiBAcmV0dXJuIEFuIG9iamVjdCB0aGF0IGVuY2Fwc3VsYXRlcyB0aGUgc2VxdWVuY2UgZGF0YS5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICogV2hlbiB5b3UgcGFzcyBhbiBhcnJheSBvZiBzdGVwcyB0byBhXG4gKiBgdHJhbnNpdGlvbigpYCBjYWxsLCB0aGUgc3RlcHMgcnVuIHNlcXVlbnRpYWxseSBieSBkZWZhdWx0LlxuICogQ29tcGFyZSB0aGlzIHRvIHRoZSBge0BsaW5rIGFuaW1hdGlvbnMvZ3JvdXAgZ3JvdXAoKX1gIGNhbGwsIHdoaWNoIHJ1bnMgYW5pbWF0aW9uIHN0ZXBzIGluXG4gKnBhcmFsbGVsLlxuICpcbiAqIFdoZW4gYSBzZXF1ZW5jZSBpcyB1c2VkIHdpdGhpbiBhIGB7QGxpbmsgYW5pbWF0aW9ucy9ncm91cCBncm91cCgpfWAgb3IgYSBgdHJhbnNpdGlvbigpYCBjYWxsLFxuICogZXhlY3V0aW9uIGNvbnRpbnVlcyB0byB0aGUgbmV4dCBpbnN0cnVjdGlvbiBvbmx5IGFmdGVyIGVhY2ggb2YgdGhlIGlubmVyIGFuaW1hdGlvblxuICogc3RlcHMgaGF2ZSBjb21wbGV0ZWQuXG4gKlxuICogQHB1YmxpY0FwaVxuICoqL1xuZXhwb3J0IGZ1bmN0aW9uIHNlcXVlbmNlKFxuICAgIHN0ZXBzOiBBbmltYXRpb25NZXRhZGF0YVtdLCBvcHRpb25zOiBBbmltYXRpb25PcHRpb25zfG51bGwgPSBudWxsKTogQW5pbWF0aW9uU2VxdWVuY2VNZXRhZGF0YSB7XG4gIHJldHVybiB7dHlwZTogQW5pbWF0aW9uTWV0YWRhdGFUeXBlLlNlcXVlbmNlLCBzdGVwcywgb3B0aW9uc307XG59XG5cbi8qKlxuICogRGVjbGFyZXMgYSBrZXkvdmFsdWUgb2JqZWN0IGNvbnRhaW5pbmcgQ1NTIHByb3BlcnRpZXMvc3R5bGVzIHRoYXRcbiAqIGNhbiB0aGVuIGJlIHVzZWQgZm9yIGFuIGFuaW1hdGlvbiBbYHN0YXRlYF0oYXBpL2FuaW1hdGlvbnMvc3RhdGUpLCB3aXRoaW4gYW4gYW5pbWF0aW9uXG4gKmBzZXF1ZW5jZWAsIG9yIGFzIHN0eWxpbmcgZGF0YSBmb3IgY2FsbHMgdG8gYGFuaW1hdGUoKWAgYW5kIGBrZXlmcmFtZXMoKWAuXG4gKlxuICogQHBhcmFtIHRva2VucyBBIHNldCBvZiBDU1Mgc3R5bGVzIG9yIEhUTUwgc3R5bGVzIGFzc29jaWF0ZWQgd2l0aCBhbiBhbmltYXRpb24gc3RhdGUuXG4gKiBUaGUgdmFsdWUgY2FuIGJlIGFueSBvZiB0aGUgZm9sbG93aW5nOlxuICogLSBBIGtleS12YWx1ZSBzdHlsZSBwYWlyIGFzc29jaWF0aW5nIGEgQ1NTIHByb3BlcnR5IHdpdGggYSB2YWx1ZS5cbiAqIC0gQW4gYXJyYXkgb2Yga2V5LXZhbHVlIHN0eWxlIHBhaXJzLlxuICogLSBBbiBhc3RlcmlzayAoKiksIHRvIHVzZSBhdXRvLXN0eWxpbmcsIHdoZXJlIHN0eWxlcyBhcmUgZGVyaXZlZCBmcm9tIHRoZSBlbGVtZW50XG4gKiBiZWluZyBhbmltYXRlZCBhbmQgYXBwbGllZCB0byB0aGUgYW5pbWF0aW9uIHdoZW4gaXQgc3RhcnRzLlxuICpcbiAqIEF1dG8tc3R5bGluZyBjYW4gYmUgdXNlZCB0byBkZWZpbmUgYSBzdGF0ZSB0aGF0IGRlcGVuZHMgb24gbGF5b3V0IG9yIG90aGVyXG4gKiBlbnZpcm9ubWVudGFsIGZhY3RvcnMuXG4gKlxuICogQHJldHVybiBBbiBvYmplY3QgdGhhdCBlbmNhcHN1bGF0ZXMgdGhlIHN0eWxlIGRhdGEuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZXMgY3JlYXRlIGFuaW1hdGlvbiBzdHlsZXMgdGhhdCBjb2xsZWN0IGEgc2V0IG9mXG4gKiBDU1MgcHJvcGVydHkgdmFsdWVzOlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIC8vIHN0cmluZyB2YWx1ZXMgZm9yIENTUyBwcm9wZXJ0aWVzXG4gKiBzdHlsZSh7IGJhY2tncm91bmQ6IFwicmVkXCIsIGNvbG9yOiBcImJsdWVcIiB9KVxuICpcbiAqIC8vIG51bWVyaWNhbCBwaXhlbCB2YWx1ZXNcbiAqIHN0eWxlKHsgd2lkdGg6IDEwMCwgaGVpZ2h0OiAwIH0pXG4gKiBgYGBcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgdXNlcyBhdXRvLXN0eWxpbmcgdG8gYWxsb3cgYW4gZWxlbWVudCB0byBhbmltYXRlIGZyb21cbiAqIGEgaGVpZ2h0IG9mIDAgdXAgdG8gaXRzIGZ1bGwgaGVpZ2h0OlxuICpcbiAqIGBgYFxuICogc3R5bGUoeyBoZWlnaHQ6IDAgfSksXG4gKiBhbmltYXRlKFwiMXNcIiwgc3R5bGUoeyBoZWlnaHQ6IFwiKlwiIH0pKVxuICogYGBgXG4gKlxuICogQHB1YmxpY0FwaVxuICoqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0eWxlKHRva2VuczogJyonfHtba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXJ9fFxuICAgICAgICAgICAgICAgICAgICAgIEFycmF5PCcqJ3x7W2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyfT4pOiBBbmltYXRpb25TdHlsZU1ldGFkYXRhIHtcbiAgcmV0dXJuIHt0eXBlOiBBbmltYXRpb25NZXRhZGF0YVR5cGUuU3R5bGUsIHN0eWxlczogdG9rZW5zLCBvZmZzZXQ6IG51bGx9O1xufVxuXG4vKipcbiAqIERlY2xhcmVzIGFuIGFuaW1hdGlvbiBzdGF0ZSB3aXRoaW4gYSB0cmlnZ2VyIGF0dGFjaGVkIHRvIGFuIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIG5hbWUgT25lIG9yIG1vcmUgbmFtZXMgZm9yIHRoZSBkZWZpbmVkIHN0YXRlIGluIGEgY29tbWEtc2VwYXJhdGVkIHN0cmluZy5cbiAqIFRoZSBmb2xsb3dpbmcgcmVzZXJ2ZWQgc3RhdGUgbmFtZXMgY2FuIGJlIHN1cHBsaWVkIHRvIGRlZmluZSBhIHN0eWxlIGZvciBzcGVjaWZpYyB1c2VcbiAqIGNhc2VzOlxuICpcbiAqIC0gYHZvaWRgIFlvdSBjYW4gYXNzb2NpYXRlIHN0eWxlcyB3aXRoIHRoaXMgbmFtZSB0byBiZSB1c2VkIHdoZW5cbiAqIHRoZSBlbGVtZW50IGlzIGRldGFjaGVkIGZyb20gdGhlIGFwcGxpY2F0aW9uLiBGb3IgZXhhbXBsZSwgd2hlbiBhbiBgbmdJZmAgZXZhbHVhdGVzXG4gKiB0byBmYWxzZSwgdGhlIHN0YXRlIG9mIHRoZSBhc3NvY2lhdGVkIGVsZW1lbnQgaXMgdm9pZC5cbiAqICAtIGAqYCAoYXN0ZXJpc2spIEluZGljYXRlcyB0aGUgZGVmYXVsdCBzdGF0ZS4gWW91IGNhbiBhc3NvY2lhdGUgc3R5bGVzIHdpdGggdGhpcyBuYW1lXG4gKiB0byBiZSB1c2VkIGFzIHRoZSBmYWxsYmFjayB3aGVuIHRoZSBzdGF0ZSB0aGF0IGlzIGJlaW5nIGFuaW1hdGVkIGlzIG5vdCBkZWNsYXJlZFxuICogd2l0aGluIHRoZSB0cmlnZ2VyLlxuICpcbiAqIEBwYXJhbSBzdHlsZXMgQSBzZXQgb2YgQ1NTIHN0eWxlcyBhc3NvY2lhdGVkIHdpdGggdGhpcyBzdGF0ZSwgY3JlYXRlZCB1c2luZyB0aGVcbiAqIGBzdHlsZSgpYCBmdW5jdGlvbi5cbiAqIFRoaXMgc2V0IG9mIHN0eWxlcyBwZXJzaXN0cyBvbiB0aGUgZWxlbWVudCBvbmNlIHRoZSBzdGF0ZSBoYXMgYmVlbiByZWFjaGVkLlxuICogQHBhcmFtIG9wdGlvbnMgUGFyYW1ldGVycyB0aGF0IGNhbiBiZSBwYXNzZWQgdG8gdGhlIHN0YXRlIHdoZW4gaXQgaXMgaW52b2tlZC5cbiAqIDAgb3IgbW9yZSBrZXktdmFsdWUgcGFpcnMuXG4gKiBAcmV0dXJuIEFuIG9iamVjdCB0aGF0IGVuY2Fwc3VsYXRlcyB0aGUgbmV3IHN0YXRlIGRhdGEuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqIFVzZSB0aGUgYHRyaWdnZXIoKWAgZnVuY3Rpb24gdG8gcmVnaXN0ZXIgc3RhdGVzIHRvIGFuIGFuaW1hdGlvbiB0cmlnZ2VyLlxuICogVXNlIHRoZSBgdHJhbnNpdGlvbigpYCBmdW5jdGlvbiB0byBhbmltYXRlIGJldHdlZW4gc3RhdGVzLlxuICogV2hlbiBhIHN0YXRlIGlzIGFjdGl2ZSB3aXRoaW4gYSBjb21wb25lbnQsIGl0cyBhc3NvY2lhdGVkIHN0eWxlcyBwZXJzaXN0IG9uIHRoZSBlbGVtZW50LFxuICogZXZlbiB3aGVuIHRoZSBhbmltYXRpb24gZW5kcy5cbiAqXG4gKiBAcHVibGljQXBpXG4gKiovXG5leHBvcnQgZnVuY3Rpb24gc3RhdGUoXG4gICAgbmFtZTogc3RyaW5nLCBzdHlsZXM6IEFuaW1hdGlvblN0eWxlTWV0YWRhdGEsXG4gICAgb3B0aW9ucz86IHtwYXJhbXM6IHtbbmFtZTogc3RyaW5nXTogYW55fX0pOiBBbmltYXRpb25TdGF0ZU1ldGFkYXRhIHtcbiAgcmV0dXJuIHt0eXBlOiBBbmltYXRpb25NZXRhZGF0YVR5cGUuU3RhdGUsIG5hbWUsIHN0eWxlcywgb3B0aW9uc307XG59XG5cbi8qKlxuICogRGVmaW5lcyBhIHNldCBvZiBhbmltYXRpb24gc3R5bGVzLCBhc3NvY2lhdGluZyBlYWNoIHN0eWxlIHdpdGggYW4gb3B0aW9uYWwgYG9mZnNldGAgdmFsdWUuXG4gKlxuICogQHBhcmFtIHN0ZXBzIEEgc2V0IG9mIGFuaW1hdGlvbiBzdHlsZXMgd2l0aCBvcHRpb25hbCBvZmZzZXQgZGF0YS5cbiAqIFRoZSBvcHRpb25hbCBgb2Zmc2V0YCB2YWx1ZSBmb3IgYSBzdHlsZSBzcGVjaWZpZXMgYSBwZXJjZW50YWdlIG9mIHRoZSB0b3RhbCBhbmltYXRpb25cbiAqIHRpbWUgYXQgd2hpY2ggdGhhdCBzdHlsZSBpcyBhcHBsaWVkLlxuICogQHJldHVybnMgQW4gb2JqZWN0IHRoYXQgZW5jYXBzdWxhdGVzIHRoZSBrZXlmcmFtZXMgZGF0YS5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICogVXNlIHdpdGggdGhlIGBhbmltYXRlKClgIGNhbGwuIEluc3RlYWQgb2YgYXBwbHlpbmcgYW5pbWF0aW9uc1xuICogZnJvbSB0aGUgY3VycmVudCBzdGF0ZVxuICogdG8gdGhlIGRlc3RpbmF0aW9uIHN0YXRlLCBrZXlmcmFtZXMgZGVzY3JpYmUgaG93IGVhY2ggc3R5bGUgZW50cnkgaXMgYXBwbGllZCBhbmQgYXQgd2hhdCBwb2ludFxuICogd2l0aGluIHRoZSBhbmltYXRpb24gYXJjLlxuICogQ29tcGFyZSBbQ1NTIEtleWZyYW1lIEFuaW1hdGlvbnNdKGh0dHBzOi8vd3d3Lnczc2Nob29scy5jb20vY3NzL2NzczNfYW5pbWF0aW9ucy5hc3ApLlxuICpcbiAqICMjIyBVc2FnZVxuICpcbiAqIEluIHRoZSBmb2xsb3dpbmcgZXhhbXBsZSwgdGhlIG9mZnNldCB2YWx1ZXMgZGVzY3JpYmVcbiAqIHdoZW4gZWFjaCBgYmFja2dyb3VuZENvbG9yYCB2YWx1ZSBpcyBhcHBsaWVkLiBUaGUgY29sb3IgaXMgcmVkIGF0IHRoZSBzdGFydCwgYW5kIGNoYW5nZXMgdG9cbiAqIGJsdWUgd2hlbiAyMCUgb2YgdGhlIHRvdGFsIHRpbWUgaGFzIGVsYXBzZWQuXG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogLy8gdGhlIHByb3ZpZGVkIG9mZnNldCB2YWx1ZXNcbiAqIGFuaW1hdGUoXCI1c1wiLCBrZXlmcmFtZXMoW1xuICogICBzdHlsZSh7IGJhY2tncm91bmRDb2xvcjogXCJyZWRcIiwgb2Zmc2V0OiAwIH0pLFxuICogICBzdHlsZSh7IGJhY2tncm91bmRDb2xvcjogXCJibHVlXCIsIG9mZnNldDogMC4yIH0pLFxuICogICBzdHlsZSh7IGJhY2tncm91bmRDb2xvcjogXCJvcmFuZ2VcIiwgb2Zmc2V0OiAwLjMgfSksXG4gKiAgIHN0eWxlKHsgYmFja2dyb3VuZENvbG9yOiBcImJsYWNrXCIsIG9mZnNldDogMSB9KVxuICogXSkpXG4gKiBgYGBcbiAqXG4gKiBJZiB0aGVyZSBhcmUgbm8gYG9mZnNldGAgdmFsdWVzIHNwZWNpZmllZCBpbiB0aGUgc3R5bGUgZW50cmllcywgdGhlIG9mZnNldHNcbiAqIGFyZSBjYWxjdWxhdGVkIGF1dG9tYXRpY2FsbHkuXG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogYW5pbWF0ZShcIjVzXCIsIGtleWZyYW1lcyhbXG4gKiAgIHN0eWxlKHsgYmFja2dyb3VuZENvbG9yOiBcInJlZFwiIH0pIC8vIG9mZnNldCA9IDBcbiAqICAgc3R5bGUoeyBiYWNrZ3JvdW5kQ29sb3I6IFwiYmx1ZVwiIH0pIC8vIG9mZnNldCA9IDAuMzNcbiAqICAgc3R5bGUoeyBiYWNrZ3JvdW5kQ29sb3I6IFwib3JhbmdlXCIgfSkgLy8gb2Zmc2V0ID0gMC42NlxuICogICBzdHlsZSh7IGJhY2tncm91bmRDb2xvcjogXCJibGFja1wiIH0pIC8vIG9mZnNldCA9IDFcbiAqIF0pKVxuICpgYGBcblxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgZnVuY3Rpb24ga2V5ZnJhbWVzKHN0ZXBzOiBBbmltYXRpb25TdHlsZU1ldGFkYXRhW10pOiBBbmltYXRpb25LZXlmcmFtZXNTZXF1ZW5jZU1ldGFkYXRhIHtcbiAgcmV0dXJuIHt0eXBlOiBBbmltYXRpb25NZXRhZGF0YVR5cGUuS2V5ZnJhbWVzLCBzdGVwc307XG59XG5cbi8qKlxuICogRGVjbGFyZXMgYW4gYW5pbWF0aW9uIHRyYW5zaXRpb24gd2hpY2ggaXMgcGxheWVkIHdoZW4gYSBjZXJ0YWluIHNwZWNpZmllZCBjb25kaXRpb24gaXMgbWV0LlxuICpcbiAqIEBwYXJhbSBzdGF0ZUNoYW5nZUV4cHIgQSBzdHJpbmcgd2l0aCBhIHNwZWNpZmljIGZvcm1hdCBvciBhIGZ1bmN0aW9uIHRoYXQgc3BlY2lmaWVzIHdoZW4gdGhlXG4gKiBhbmltYXRpb24gdHJhbnNpdGlvbiBzaG91bGQgb2NjdXIgKHNlZSBbU3RhdGUgQ2hhbmdlIEV4cHJlc3Npb25dKCNzdGF0ZS1jaGFuZ2UtZXhwcmVzc2lvbikpLlxuICpcbiAqIEBwYXJhbSBzdGVwcyBPbmUgb3IgbW9yZSBhbmltYXRpb24gb2JqZWN0cyB0aGF0IHJlcHJlc2VudCB0aGUgYW5pbWF0aW9uJ3MgaW5zdHJ1Y3Rpb25zLlxuICpcbiAqIEBwYXJhbSBvcHRpb25zIEFuIG9wdGlvbnMgb2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gc3BlY2lmeSBhIGRlbGF5IGZvciB0aGUgYW5pbWF0aW9uIG9yIHByb3ZpZGVcbiAqIGN1c3RvbSBwYXJhbWV0ZXJzIGZvciBpdC5cbiAqXG4gKiBAcmV0dXJucyBBbiBvYmplY3QgdGhhdCBlbmNhcHN1bGF0ZXMgdGhlIHRyYW5zaXRpb24gZGF0YS5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBTdGF0ZSBDaGFuZ2UgRXhwcmVzc2lvblxuICpcbiAqIFRoZSBTdGF0ZSBDaGFuZ2UgRXhwcmVzc2lvbiBpbnN0cnVjdHMgQW5ndWxhciB3aGVuIHRvIHJ1biB0aGUgdHJhbnNpdGlvbidzIGFuaW1hdGlvbnMsIGl0IGNhblxuICplaXRoZXIgYmVcbiAqICAtIGEgc3RyaW5nIHdpdGggYSBzcGVjaWZpYyBzeW50YXhcbiAqICAtIG9yIGEgZnVuY3Rpb24gdGhhdCBjb21wYXJlcyB0aGUgcHJldmlvdXMgYW5kIGN1cnJlbnQgc3RhdGUgKHZhbHVlIG9mIHRoZSBleHByZXNzaW9uIGJvdW5kIHRvXG4gKiAgICB0aGUgZWxlbWVudCdzIHRyaWdnZXIpIGFuZCByZXR1cm5zIGB0cnVlYCBpZiB0aGUgdHJhbnNpdGlvbiBzaG91bGQgb2NjdXIgb3IgYGZhbHNlYCBvdGhlcndpc2VcbiAqXG4gKiBUaGUgc3RyaW5nIGZvcm1hdCBjYW4gYmU6XG4gKiAgLSBgZnJvbVN0YXRlID0+IHRvU3RhdGVgLCB3aGljaCBpbmRpY2F0ZXMgdGhhdCB0aGUgdHJhbnNpdGlvbidzIGFuaW1hdGlvbnMgc2hvdWxkIG9jY3VyIHRoZW4gdGhlXG4gKiAgICBleHByZXNzaW9uIGJvdW5kIHRvIHRoZSB0cmlnZ2VyJ3MgZWxlbWVudCBnb2VzIGZyb20gYGZyb21TdGF0ZWAgdG8gYHRvU3RhdGVgXG4gKlxuICogICAgX0V4YW1wbGU6X1xuICogICAgICBgYGB0eXBlc2NyaXB0XG4gKiAgICAgICAgdHJhbnNpdGlvbignb3BlbiA9PiBjbG9zZWQnLCBhbmltYXRlKCcuNXMgZWFzZS1vdXQnLCBzdHlsZSh7IGhlaWdodDogMCB9KSApKVxuICogICAgICBgYGBcbiAqXG4gKiAgLSBgZnJvbVN0YXRlIDw9PiB0b1N0YXRlYCwgd2hpY2ggaW5kaWNhdGVzIHRoYXQgdGhlIHRyYW5zaXRpb24ncyBhbmltYXRpb25zIHNob3VsZCBvY2N1ciB0aGVuXG4gKiAgICB0aGUgZXhwcmVzc2lvbiBib3VuZCB0byB0aGUgdHJpZ2dlcidzIGVsZW1lbnQgZ29lcyBmcm9tIGBmcm9tU3RhdGVgIHRvIGB0b1N0YXRlYCBvciB2aWNlIHZlcnNhXG4gKlxuICogICAgX0V4YW1wbGU6X1xuICogICAgICBgYGB0eXBlc2NyaXB0XG4gKiAgICAgICAgdHJhbnNpdGlvbignZW5hYmxlZCA8PT4gZGlzYWJsZWQnLCBhbmltYXRlKCcxcyBjdWJpYy1iZXppZXIoMC44LDAuMywwLDEpJykpXG4gKiAgICAgIGBgYFxuICpcbiAqICAtIGA6ZW50ZXJgL2A6bGVhdmVgLCB3aGljaCBpbmRpY2F0ZXMgdGhhdCB0aGUgdHJhbnNpdGlvbidzIGFuaW1hdGlvbnMgc2hvdWxkIG9jY3VyIHdoZW4gdGhlXG4gKiAgICBlbGVtZW50IGVudGVycyBvciBleGlzdHMgdGhlIERPTVxuICpcbiAqICAgIF9FeGFtcGxlOl9cbiAqICAgICAgYGBgdHlwZXNjcmlwdFxuICogICAgICAgIHRyYW5zaXRpb24oJzplbnRlcicsIFtcbiAqICAgICAgICAgIHN0eWxlKHsgb3BhY2l0eTogMCB9KSxcbiAqICAgICAgICAgIGFuaW1hdGUoJzUwMG1zJywgc3R5bGUoeyBvcGFjaXR5OiAxIH0pKVxuICogICAgICAgIF0pXG4gKiAgICAgIGBgYFxuICpcbiAqICAtIGA6aW5jcmVtZW50YC9gOmRlY3JlbWVudGAsIHdoaWNoIGluZGljYXRlcyB0aGF0IHRoZSB0cmFuc2l0aW9uJ3MgYW5pbWF0aW9ucyBzaG91bGQgb2NjdXIgd2hlblxuICogICAgdGhlIG51bWVyaWNhbCBleHByZXNzaW9uIGJvdW5kIHRvIHRoZSB0cmlnZ2VyJ3MgZWxlbWVudCBoYXMgaW5jcmVhc2VkIGluIHZhbHVlIG9yIGRlY3JlYXNlZFxuICpcbiAqICAgIF9FeGFtcGxlOl9cbiAqICAgICAgYGBgdHlwZXNjcmlwdFxuICogICAgICAgIHRyYW5zaXRpb24oJzppbmNyZW1lbnQnLCBxdWVyeSgnQGNvdW50ZXInLCBhbmltYXRlQ2hpbGQoKSkpXG4gKiAgICAgIGBgYFxuICpcbiAqICAtIGEgc2VxdWVuY2Ugb2YgYW55IG9mIHRoZSBhYm92ZSBkaXZpZGVkIGJ5IGNvbW1hcywgd2hpY2ggaW5kaWNhdGVzIHRoYXQgdHJhbnNpdGlvbidzIGFuaW1hdGlvbnNcbiAqICAgIHNob3VsZCBvY2N1ciB3aGVuZXZlciBvbmUgb2YgdGhlIHN0YXRlIGNoYW5nZSBleHByZXNzaW9ucyBtYXRjaGVzXG4gKlxuICogICAgX0V4YW1wbGU6X1xuICogICAgICBgYGB0eXBlc2NyaXB0XG4gKiAgICAgICAgdHJhbnNpdGlvbignOmluY3JlbWVudCwgKiA9PiBlbmFibGVkLCA6ZW50ZXInLCBhbmltYXRlKCcxcyBlYXNlJywga2V5ZnJhbWVzKFtcbiAqICAgICAgICAgIHN0eWxlKHsgdHJhbnNmb3JtOiAnc2NhbGUoMSknLCBvZmZzZXQ6IDB9KSxcbiAqICAgICAgICAgIHN0eWxlKHsgdHJhbnNmb3JtOiAnc2NhbGUoMS4xKScsIG9mZnNldDogMC43fSksXG4gKiAgICAgICAgICBzdHlsZSh7IHRyYW5zZm9ybTogJ3NjYWxlKDEpJywgb2Zmc2V0OiAxfSlcbiAqICAgICAgICBdKSkpLFxuICogICAgICBgYGBcbiAqXG4gKiBBbHNvIG5vdGUgdGhhdCBpbiBzdWNoIGNvbnRleHQ6XG4gKiAgLSBgdm9pZGAgY2FuIGJlIHVzZWQgdG8gaW5kaWNhdGUgdGhlIGFic2VuY2Ugb2YgdGhlIGVsZW1lbnRcbiAqICAtIGFzdGVyaXNrcyBjYW4gYmUgdXNlZCBhcyB3aWxkY2FyZHMgdGhhdCBtYXRjaCBhbnkgc3RhdGVcbiAqICAtIChhcyBhIGNvbnNlcXVlbmNlIG9mIHRoZSBhYm92ZSwgYHZvaWQgPT4gKmAgaXMgZXF1aXZhbGVudCB0byBgOmVudGVyYCBhbmQgYCogPT4gdm9pZGAgaXNcbiAqICAgIGVxdWl2YWxlbnQgdG8gYDpsZWF2ZWApXG4gKiAgLSBgdHJ1ZWAgYW5kIGBmYWxzZWAgYWxzbyBtYXRjaCBleHByZXNzaW9uIHZhbHVlcyBvZiBgMWAgYW5kIGAwYCByZXNwZWN0aXZlbHkgKGJ1dCBkbyBub3QgbWF0Y2hcbiAqICAgIF90cnV0aHlfIGFuZCBfZmFsc3lfIHZhbHVlcylcbiAqXG4gKiA8ZGl2IGNsYXNzPVwiYWxlcnQgaXMtaGVscGZ1bFwiPlxuICpcbiAqICBCZSBjYXJlZnVsIGFib3V0IGVudGVyaW5nIGVuZCBsZWF2aW5nIGVsZW1lbnRzIGFzIHRoZWlyIHRyYW5zaXRpb25zIHByZXNlbnQgYSBjb21tb25cbiAqICBwaXRmYWxsIGZvciBkZXZlbG9wZXJzLlxuICpcbiAqICBOb3RlIHRoYXQgd2hlbiBhbiBlbGVtZW50IHdpdGggYSB0cmlnZ2VyIGVudGVycyB0aGUgRE9NIGl0cyBgOmVudGVyYCB0cmFuc2l0aW9uIGFsd2F5c1xuICogIGdldHMgZXhlY3V0ZWQsIGJ1dCBpdHMgYDpsZWF2ZWAgdHJhbnNpdGlvbiB3aWxsIG5vdCBiZSBleGVjdXRlZCBpZiB0aGUgZWxlbWVudCBpcyByZW1vdmVkXG4gKiAgYWxvbmdzaWRlIGl0cyBwYXJlbnQgKGFzIGl0IHdpbGwgYmUgcmVtb3ZlZCBcIndpdGhvdXQgd2FybmluZ1wiIGJlZm9yZSBpdHMgdHJhbnNpdGlvbiBoYXNcbiAqICBhIGNoYW5jZSB0byBiZSBleGVjdXRlZCwgdGhlIG9ubHkgd2F5IHRoYXQgc3VjaCB0cmFuc2l0aW9uIGNhbiBvY2N1ciBpcyBpZiB0aGUgZWxlbWVudFxuICogIGlzIGV4aXRpbmcgdGhlIERPTSBvbiBpdHMgb3duKS5cbiAqXG4gKlxuICogPC9kaXY+XG4gKlxuICogIyMjIEFuaW1hdGluZyB0byBhIEZpbmFsIFN0YXRlXG4gKlxuICogSWYgdGhlIGZpbmFsIHN0ZXAgaW4gYSB0cmFuc2l0aW9uIGlzIGEgY2FsbCB0byBgYW5pbWF0ZSgpYCB0aGF0IHVzZXMgYSB0aW1pbmcgdmFsdWVcbiAqIHdpdGggbm8gYHN0eWxlYCBkYXRhLCB0aGF0IHN0ZXAgaXMgYXV0b21hdGljYWxseSBjb25zaWRlcmVkIHRoZSBmaW5hbCBhbmltYXRpb24gYXJjLFxuICogZm9yIHRoZSBlbGVtZW50IHRvIHJlYWNoIHRoZSBmaW5hbCBzdGF0ZSwgaW4gc3VjaCBjYXNlIEFuZ3VsYXIgYXV0b21hdGljYWxseSBhZGRzIG9yIHJlbW92ZXNcbiAqIENTUyBzdHlsZXMgdG8gZW5zdXJlIHRoYXQgdGhlIGVsZW1lbnQgaXMgaW4gdGhlIGNvcnJlY3QgZmluYWwgc3RhdGUuXG4gKlxuICpcbiAqICMjIyBVc2FnZSBFeGFtcGxlc1xuICpcbiAqICAtIFRyYW5zaXRpb24gYW5pbWF0aW9ucyBhcHBsaWVkIGJhc2VkIG9uXG4gKiAgICB0aGUgdHJpZ2dlcidzIGV4cHJlc3Npb24gdmFsdWVcbiAqXG4gKiAgIGBgYEhUTUxcbiAqICAgPGRpdiBbQG15QW5pbWF0aW9uVHJpZ2dlcl09XCJteVN0YXR1c0V4cFwiPlxuICogICAgLi4uXG4gKiAgIDwvZGl2PlxuICogICBgYGBcbiAqXG4gKiAgIGBgYHR5cGVzY3JpcHRcbiAqICAgdHJpZ2dlcihcIm15QW5pbWF0aW9uVHJpZ2dlclwiLCBbXG4gKiAgICAgLi4uLCAvLyBzdGF0ZXNcbiAqICAgICB0cmFuc2l0aW9uKFwib24gPT4gb2ZmLCBvcGVuID0+IGNsb3NlZFwiLCBhbmltYXRlKDUwMCkpLFxuICogICAgIHRyYW5zaXRpb24oXCIqIDw9PiBlcnJvclwiLCBxdWVyeSgnLmluZGljYXRvcicsIGFuaW1hdGVDaGlsZCgpKSlcbiAqICAgXSlcbiAqICAgYGBgXG4gKlxuICogIC0gVHJhbnNpdGlvbiBhbmltYXRpb25zIGFwcGxpZWQgYmFzZWQgb24gY3VzdG9tIGxvZ2ljIGRlcGVuZGVudFxuICogICAgb24gdGhlIHRyaWdnZXIncyBleHByZXNzaW9uIHZhbHVlIGFuZCBwcm92aWRlZCBwYXJhbWV0ZXJzXG4gKlxuICogICAgYGBgSFRNTFxuICogICAgPGRpdiBbQG15QW5pbWF0aW9uVHJpZ2dlcl09XCJ7XG4gKiAgICAgdmFsdWU6IHN0ZXBOYW1lLFxuICogICAgIHBhcmFtczogeyB0YXJnZXQ6IGN1cnJlbnRUYXJnZXQgfVxuICogICAgfVwiPlxuICogICAgIC4uLlxuICogICAgPC9kaXY+XG4gKiAgICBgYGBcbiAqXG4gKiAgICBgYGB0eXBlc2NyaXB0XG4gKiAgICB0cmlnZ2VyKFwibXlBbmltYXRpb25UcmlnZ2VyXCIsIFtcbiAqICAgICAgLi4uLCAvLyBzdGF0ZXNcbiAqICAgICAgdHJhbnNpdGlvbihcbiAqICAgICAgICAoZnJvbVN0YXRlLCB0b1N0YXRlLCBfZWxlbWVudCwgcGFyYW1zKSA9PlxuICogICAgICAgICAgWydmaXJzdHN0ZXAnLCAnbGFzdHN0ZXAnXS5pbmNsdWRlcyhmcm9tU3RhdGUudG9Mb3dlckNhc2UoKSlcbiAqICAgICAgICAgICYmIHRvU3RhdGUgPT09IHBhcmFtcz8uWyd0YXJnZXQnXSxcbiAqICAgICAgICBhbmltYXRlKCcxcycpXG4gKiAgICAgIClcbiAqICAgIF0pXG4gKiAgICBgYGBcbiAqXG4gKiBAcHVibGljQXBpXG4gKiovXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNpdGlvbihcbiAgICBzdGF0ZUNoYW5nZUV4cHI6IHN0cmluZ3xcbiAgICAoKGZyb21TdGF0ZTogc3RyaW5nLCB0b1N0YXRlOiBzdHJpbmcsIGVsZW1lbnQ/OiBhbnksIHBhcmFtcz86IHtba2V5OiBzdHJpbmddOiBhbnl9KSA9PiBib29sZWFuKSxcbiAgICBzdGVwczogQW5pbWF0aW9uTWV0YWRhdGF8QW5pbWF0aW9uTWV0YWRhdGFbXSxcbiAgICBvcHRpb25zOiBBbmltYXRpb25PcHRpb25zfG51bGwgPSBudWxsKTogQW5pbWF0aW9uVHJhbnNpdGlvbk1ldGFkYXRhIHtcbiAgcmV0dXJuIHt0eXBlOiBBbmltYXRpb25NZXRhZGF0YVR5cGUuVHJhbnNpdGlvbiwgZXhwcjogc3RhdGVDaGFuZ2VFeHByLCBhbmltYXRpb246IHN0ZXBzLCBvcHRpb25zfTtcbn1cblxuLyoqXG4gKiBQcm9kdWNlcyBhIHJldXNhYmxlIGFuaW1hdGlvbiB0aGF0IGNhbiBiZSBpbnZva2VkIGluIGFub3RoZXIgYW5pbWF0aW9uIG9yIHNlcXVlbmNlLFxuICogYnkgY2FsbGluZyB0aGUgYHVzZUFuaW1hdGlvbigpYCBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0gc3RlcHMgT25lIG9yIG1vcmUgYW5pbWF0aW9uIG9iamVjdHMsIGFzIHJldHVybmVkIGJ5IHRoZSBgYW5pbWF0ZSgpYFxuICogb3IgYHNlcXVlbmNlKClgIGZ1bmN0aW9uLCB0aGF0IGZvcm0gYSB0cmFuc2Zvcm1hdGlvbiBmcm9tIG9uZSBzdGF0ZSB0byBhbm90aGVyLlxuICogQSBzZXF1ZW5jZSBpcyB1c2VkIGJ5IGRlZmF1bHQgd2hlbiB5b3UgcGFzcyBhbiBhcnJheS5cbiAqIEBwYXJhbSBvcHRpb25zIEFuIG9wdGlvbnMgb2JqZWN0IHRoYXQgY2FuIGNvbnRhaW4gYSBkZWxheSB2YWx1ZSBmb3IgdGhlIHN0YXJ0IG9mIHRoZVxuICogYW5pbWF0aW9uLCBhbmQgYWRkaXRpb25hbCBkZXZlbG9wZXItZGVmaW5lZCBwYXJhbWV0ZXJzLlxuICogUHJvdmlkZWQgdmFsdWVzIGZvciBhZGRpdGlvbmFsIHBhcmFtZXRlcnMgYXJlIHVzZWQgYXMgZGVmYXVsdHMsXG4gKiBhbmQgb3ZlcnJpZGUgdmFsdWVzIGNhbiBiZSBwYXNzZWQgdG8gdGhlIGNhbGxlciBvbiBpbnZvY2F0aW9uLlxuICogQHJldHVybnMgQW4gb2JqZWN0IHRoYXQgZW5jYXBzdWxhdGVzIHRoZSBhbmltYXRpb24gZGF0YS5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIGRlZmluZXMgYSByZXVzYWJsZSBhbmltYXRpb24sIHByb3ZpZGluZyBzb21lIGRlZmF1bHQgcGFyYW1ldGVyXG4gKiB2YWx1ZXMuXG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogdmFyIGZhZGVBbmltYXRpb24gPSBhbmltYXRpb24oW1xuICogICBzdHlsZSh7IG9wYWNpdHk6ICd7eyBzdGFydCB9fScgfSksXG4gKiAgIGFuaW1hdGUoJ3t7IHRpbWUgfX0nLFxuICogICBzdHlsZSh7IG9wYWNpdHk6ICd7eyBlbmQgfX0nfSkpXG4gKiAgIF0sXG4gKiAgIHsgcGFyYW1zOiB7IHRpbWU6ICcxMDAwbXMnLCBzdGFydDogMCwgZW5kOiAxIH19KTtcbiAqIGBgYFxuICpcbiAqIFRoZSBmb2xsb3dpbmcgaW52b2tlcyB0aGUgZGVmaW5lZCBhbmltYXRpb24gd2l0aCBhIGNhbGwgdG8gYHVzZUFuaW1hdGlvbigpYCxcbiAqIHBhc3NpbmcgaW4gb3ZlcnJpZGUgcGFyYW1ldGVyIHZhbHVlcy5cbiAqXG4gKiBgYGBqc1xuICogdXNlQW5pbWF0aW9uKGZhZGVBbmltYXRpb24sIHtcbiAqICAgcGFyYW1zOiB7XG4gKiAgICAgdGltZTogJzJzJyxcbiAqICAgICBzdGFydDogMSxcbiAqICAgICBlbmQ6IDBcbiAqICAgfVxuICogfSlcbiAqIGBgYFxuICpcbiAqIElmIGFueSBvZiB0aGUgcGFzc2VkLWluIHBhcmFtZXRlciB2YWx1ZXMgYXJlIG1pc3NpbmcgZnJvbSB0aGlzIGNhbGwsXG4gKiB0aGUgZGVmYXVsdCB2YWx1ZXMgYXJlIHVzZWQuIElmIG9uZSBvciBtb3JlIHBhcmFtZXRlciB2YWx1ZXMgYXJlIG1pc3NpbmcgYmVmb3JlIGEgc3RlcCBpc1xuICogYW5pbWF0ZWQsIGB1c2VBbmltYXRpb24oKWAgdGhyb3dzIGFuIGVycm9yLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFuaW1hdGlvbihcbiAgICBzdGVwczogQW5pbWF0aW9uTWV0YWRhdGF8QW5pbWF0aW9uTWV0YWRhdGFbXSxcbiAgICBvcHRpb25zOiBBbmltYXRpb25PcHRpb25zfG51bGwgPSBudWxsKTogQW5pbWF0aW9uUmVmZXJlbmNlTWV0YWRhdGEge1xuICByZXR1cm4ge3R5cGU6IEFuaW1hdGlvbk1ldGFkYXRhVHlwZS5SZWZlcmVuY2UsIGFuaW1hdGlvbjogc3RlcHMsIG9wdGlvbnN9O1xufVxuXG4vKipcbiAqIEV4ZWN1dGVzIGEgcXVlcmllZCBpbm5lciBhbmltYXRpb24gZWxlbWVudCB3aXRoaW4gYW4gYW5pbWF0aW9uIHNlcXVlbmNlLlxuICpcbiAqIEBwYXJhbSBvcHRpb25zIEFuIG9wdGlvbnMgb2JqZWN0IHRoYXQgY2FuIGNvbnRhaW4gYSBkZWxheSB2YWx1ZSBmb3IgdGhlIHN0YXJ0IG9mIHRoZVxuICogYW5pbWF0aW9uLCBhbmQgYWRkaXRpb25hbCBvdmVycmlkZSB2YWx1ZXMgZm9yIGRldmVsb3Blci1kZWZpbmVkIHBhcmFtZXRlcnMuXG4gKiBAcmV0dXJuIEFuIG9iamVjdCB0aGF0IGVuY2Fwc3VsYXRlcyB0aGUgY2hpbGQgYW5pbWF0aW9uIGRhdGEuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqIEVhY2ggdGltZSBhbiBhbmltYXRpb24gaXMgdHJpZ2dlcmVkIGluIEFuZ3VsYXIsIHRoZSBwYXJlbnQgYW5pbWF0aW9uXG4gKiBoYXMgcHJpb3JpdHkgYW5kIGFueSBjaGlsZCBhbmltYXRpb25zIGFyZSBibG9ja2VkLiBJbiBvcmRlclxuICogZm9yIGEgY2hpbGQgYW5pbWF0aW9uIHRvIHJ1biwgdGhlIHBhcmVudCBhbmltYXRpb24gbXVzdCBxdWVyeSBlYWNoIG9mIHRoZSBlbGVtZW50c1xuICogY29udGFpbmluZyBjaGlsZCBhbmltYXRpb25zLCBhbmQgcnVuIHRoZW0gdXNpbmcgdGhpcyBmdW5jdGlvbi5cbiAqXG4gKiBOb3RlIHRoYXQgdGhpcyBmZWF0dXJlIGlzIGRlc2lnbmVkIHRvIGJlIHVzZWQgd2l0aCBgcXVlcnkoKWAgYW5kIGl0IHdpbGwgb25seSB3b3JrXG4gKiB3aXRoIGFuaW1hdGlvbnMgdGhhdCBhcmUgYXNzaWduZWQgdXNpbmcgdGhlIEFuZ3VsYXIgYW5pbWF0aW9uIGxpYnJhcnkuIENTUyBrZXlmcmFtZXNcbiAqIGFuZCB0cmFuc2l0aW9ucyBhcmUgbm90IGhhbmRsZWQgYnkgdGhpcyBBUEkuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gYW5pbWF0ZUNoaWxkKG9wdGlvbnM6IEFuaW1hdGVDaGlsZE9wdGlvbnN8bnVsbCA9IG51bGwpOlxuICAgIEFuaW1hdGlvbkFuaW1hdGVDaGlsZE1ldGFkYXRhIHtcbiAgcmV0dXJuIHt0eXBlOiBBbmltYXRpb25NZXRhZGF0YVR5cGUuQW5pbWF0ZUNoaWxkLCBvcHRpb25zfTtcbn1cblxuLyoqXG4gKiBTdGFydHMgYSByZXVzYWJsZSBhbmltYXRpb24gdGhhdCBpcyBjcmVhdGVkIHVzaW5nIHRoZSBgYW5pbWF0aW9uKClgIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSBhbmltYXRpb24gVGhlIHJldXNhYmxlIGFuaW1hdGlvbiB0byBzdGFydC5cbiAqIEBwYXJhbSBvcHRpb25zIEFuIG9wdGlvbnMgb2JqZWN0IHRoYXQgY2FuIGNvbnRhaW4gYSBkZWxheSB2YWx1ZSBmb3IgdGhlIHN0YXJ0IG9mXG4gKiB0aGUgYW5pbWF0aW9uLCBhbmQgYWRkaXRpb25hbCBvdmVycmlkZSB2YWx1ZXMgZm9yIGRldmVsb3Blci1kZWZpbmVkIHBhcmFtZXRlcnMuXG4gKiBAcmV0dXJuIEFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBhbmltYXRpb24gcGFyYW1ldGVycy5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1c2VBbmltYXRpb24oXG4gICAgYW5pbWF0aW9uOiBBbmltYXRpb25SZWZlcmVuY2VNZXRhZGF0YSxcbiAgICBvcHRpb25zOiBBbmltYXRpb25PcHRpb25zfG51bGwgPSBudWxsKTogQW5pbWF0aW9uQW5pbWF0ZVJlZk1ldGFkYXRhIHtcbiAgcmV0dXJuIHt0eXBlOiBBbmltYXRpb25NZXRhZGF0YVR5cGUuQW5pbWF0ZVJlZiwgYW5pbWF0aW9uLCBvcHRpb25zfTtcbn1cblxuLyoqXG4gKiBGaW5kcyBvbmUgb3IgbW9yZSBpbm5lciBlbGVtZW50cyB3aXRoaW4gdGhlIGN1cnJlbnQgZWxlbWVudCB0aGF0IGlzXG4gKiBiZWluZyBhbmltYXRlZCB3aXRoaW4gYSBzZXF1ZW5jZS4gVXNlIHdpdGggYGFuaW1hdGUoKWAuXG4gKlxuICogQHBhcmFtIHNlbGVjdG9yIFRoZSBlbGVtZW50IHRvIHF1ZXJ5LCBvciBhIHNldCBvZiBlbGVtZW50cyB0aGF0IGNvbnRhaW4gQW5ndWxhci1zcGVjaWZpY1xuICogY2hhcmFjdGVyaXN0aWNzLCBzcGVjaWZpZWQgd2l0aCBvbmUgb3IgbW9yZSBvZiB0aGUgZm9sbG93aW5nIHRva2Vucy5cbiAqICAtIGBxdWVyeShcIjplbnRlclwiKWAgb3IgYHF1ZXJ5KFwiOmxlYXZlXCIpYCA6IFF1ZXJ5IGZvciBuZXdseSBpbnNlcnRlZC9yZW1vdmVkIGVsZW1lbnRzIChub3RcbiAqICAgICBhbGwgZWxlbWVudHMgY2FuIGJlIHF1ZXJpZWQgdmlhIHRoZXNlIHRva2Vucywgc2VlXG4gKiAgICAgW0VudGVyaW5nIGFuZCBMZWF2aW5nIEVsZW1lbnRzXSgjZW50ZXJpbmctYW5kLWxlYXZpbmctZWxlbWVudHMpKVxuICogIC0gYHF1ZXJ5KFwiOmFuaW1hdGluZ1wiKWAgOiBRdWVyeSBhbGwgY3VycmVudGx5IGFuaW1hdGluZyBlbGVtZW50cy5cbiAqICAtIGBxdWVyeShcIkB0cmlnZ2VyTmFtZVwiKWAgOiBRdWVyeSBlbGVtZW50cyB0aGF0IGNvbnRhaW4gYW4gYW5pbWF0aW9uIHRyaWdnZXIuXG4gKiAgLSBgcXVlcnkoXCJAKlwiKWAgOiBRdWVyeSBhbGwgZWxlbWVudHMgdGhhdCBjb250YWluIGFuIGFuaW1hdGlvbiB0cmlnZ2Vycy5cbiAqICAtIGBxdWVyeShcIjpzZWxmXCIpYCA6IEluY2x1ZGUgdGhlIGN1cnJlbnQgZWxlbWVudCBpbnRvIHRoZSBhbmltYXRpb24gc2VxdWVuY2UuXG4gKlxuICogQHBhcmFtIGFuaW1hdGlvbiBPbmUgb3IgbW9yZSBhbmltYXRpb24gc3RlcHMgdG8gYXBwbHkgdG8gdGhlIHF1ZXJpZWQgZWxlbWVudCBvciBlbGVtZW50cy5cbiAqIEFuIGFycmF5IGlzIHRyZWF0ZWQgYXMgYW4gYW5pbWF0aW9uIHNlcXVlbmNlLlxuICogQHBhcmFtIG9wdGlvbnMgQW4gb3B0aW9ucyBvYmplY3QuIFVzZSB0aGUgJ2xpbWl0JyBmaWVsZCB0byBsaW1pdCB0aGUgdG90YWwgbnVtYmVyIG9mXG4gKiBpdGVtcyB0byBjb2xsZWN0LlxuICogQHJldHVybiBBbiBvYmplY3QgdGhhdCBlbmNhcHN1bGF0ZXMgdGhlIHF1ZXJ5IGRhdGEuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgTXVsdGlwbGUgVG9rZW5zXG4gKlxuICogVG9rZW5zIGNhbiBiZSBtZXJnZWQgaW50byBhIGNvbWJpbmVkIHF1ZXJ5IHNlbGVjdG9yIHN0cmluZy4gRm9yIGV4YW1wbGU6XG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogIHF1ZXJ5KCc6c2VsZiwgLnJlY29yZDplbnRlciwgLnJlY29yZDpsZWF2ZSwgQHN1YlRyaWdnZXInLCBbLi4uXSlcbiAqIGBgYFxuICpcbiAqIFRoZSBgcXVlcnkoKWAgZnVuY3Rpb24gY29sbGVjdHMgbXVsdGlwbGUgZWxlbWVudHMgYW5kIHdvcmtzIGludGVybmFsbHkgYnkgdXNpbmdcbiAqIGBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGxgLiBVc2UgdGhlIGBsaW1pdGAgZmllbGQgb2YgYW4gb3B0aW9ucyBvYmplY3QgdG8gbGltaXRcbiAqIHRoZSB0b3RhbCBudW1iZXIgb2YgaXRlbXMgdG8gYmUgY29sbGVjdGVkLiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGBqc1xuICogcXVlcnkoJ2RpdicsIFtcbiAqICAgYW5pbWF0ZSguLi4pLFxuICogICBhbmltYXRlKC4uLilcbiAqIF0sIHsgbGltaXQ6IDEgfSlcbiAqIGBgYFxuICpcbiAqIEJ5IGRlZmF1bHQsIHRocm93cyBhbiBlcnJvciB3aGVuIHplcm8gaXRlbXMgYXJlIGZvdW5kLiBTZXQgdGhlXG4gKiBgb3B0aW9uYWxgIGZsYWcgdG8gaWdub3JlIHRoaXMgZXJyb3IuIEZvciBleGFtcGxlOlxuICpcbiAqIGBgYGpzXG4gKiBxdWVyeSgnLnNvbWUtZWxlbWVudC10aGF0LW1heS1ub3QtYmUtdGhlcmUnLCBbXG4gKiAgIGFuaW1hdGUoLi4uKSxcbiAqICAgYW5pbWF0ZSguLi4pXG4gKiBdLCB7IG9wdGlvbmFsOiB0cnVlIH0pXG4gKiBgYGBcbiAqXG4gKiAjIyMgRW50ZXJpbmcgYW5kIExlYXZpbmcgRWxlbWVudHNcbiAqXG4gKiBOb3QgYWxsIGVsZW1lbnRzIGNhbiBiZSBxdWVyaWVkIHZpYSB0aGUgYDplbnRlcmAgYW5kIGA6bGVhdmVgIHRva2VucywgdGhlIG9ubHkgb25lc1xuICogdGhhdCBjYW4gYXJlIHRob3NlIHRoYXQgQW5ndWxhciBhc3N1bWVzIGNhbiBlbnRlci9sZWF2ZSBiYXNlZCBvbiB0aGVpciBvd24gbG9naWNcbiAqIChpZiB0aGVpciBpbnNlcnRpb24vcmVtb3ZhbCBpcyBzaW1wbHkgYSBjb25zZXF1ZW5jZSBvZiB0aGF0IG9mIHRoZWlyIHBhcmVudCB0aGV5XG4gKiBzaG91bGQgYmUgcXVlcmllZCB2aWEgYSBkaWZmZXJlbnQgdG9rZW4gaW4gdGhlaXIgcGFyZW50J3MgYDplbnRlcmAvYDpsZWF2ZWAgdHJhbnNpdGlvbnMpLlxuICpcbiAqIFRoZSBvbmx5IGVsZW1lbnRzIEFuZ3VsYXIgYXNzdW1lcyBjYW4gZW50ZXIvbGVhdmUgYmFzZWQgb24gdGhlaXIgb3duIGxvZ2ljICh0aHVzIHRoZSBvbmx5XG4gKiBvbmVzIHRoYXQgY2FuIGJlIHF1ZXJpZWQgdmlhIHRoZSBgOmVudGVyYCBhbmQgYDpsZWF2ZWAgdG9rZW5zKSBhcmU6XG4gKiAgLSBUaG9zZSBpbnNlcnRlZCBkeW5hbWljYWxseSAodmlhIGBWaWV3Q29udGFpbmVyUmVmYClcbiAqICAtIFRob3NlIHRoYXQgaGF2ZSBhIHN0cnVjdHVyYWwgZGlyZWN0aXZlICh3aGljaCwgdW5kZXIgdGhlIGhvb2QsIGFyZSBhIHN1YnNldCBvZiB0aGUgYWJvdmUgb25lcylcbiAqXG4gKiA8ZGl2IGNsYXNzPVwiYWxlcnQgaXMtaGVscGZ1bFwiPlxuICpcbiAqICBOb3RlIHRoYXQgZWxlbWVudHMgd2lsbCBiZSBzdWNjZXNzZnVsbHkgcXVlcmllZCB2aWEgYDplbnRlcmAvYDpsZWF2ZWAgZXZlbiBpZiB0aGVpclxuICogIGluc2VydGlvbi9yZW1vdmFsIGlzIG5vdCBkb25lIG1hbnVhbGx5IHZpYSBgVmlld0NvbnRhaW5lclJlZmBvciBjYXVzZWQgYnkgdGhlaXIgc3RydWN0dXJhbFxuICogIGRpcmVjdGl2ZSAoZS5nLiB0aGV5IGVudGVyL2V4aXQgYWxvbmdzaWRlIHRoZWlyIHBhcmVudCkuXG4gKlxuICogPC9kaXY+XG4gKlxuICogPGRpdiBjbGFzcz1cImFsZXJ0IGlzLWltcG9ydGFudFwiPlxuICpcbiAqICBUaGVyZSBpcyBhbiBleGNlcHRpb24gdG8gd2hhdCBwcmV2aW91c2x5IG1lbnRpb25lZCwgYmVzaWRlcyBlbGVtZW50cyBlbnRlcmluZy9sZWF2aW5nIGJhc2VkIG9uXG4gKiAgdGhlaXIgb3duIGxvZ2ljLCBlbGVtZW50cyB3aXRoIGFuIGFuaW1hdGlvbiB0cmlnZ2VyIGNhbiBhbHdheXMgYmUgcXVlcmllZCB2aWEgYDpsZWF2ZWAgd2hlblxuICogdGhlaXIgcGFyZW50IGlzIGFsc28gbGVhdmluZy5cbiAqXG4gKiA8L2Rpdj5cbiAqXG4gKiAjIyMgVXNhZ2UgRXhhbXBsZVxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBxdWVyaWVzIGZvciBpbm5lciBlbGVtZW50cyBhbmQgYW5pbWF0ZXMgdGhlbVxuICogaW5kaXZpZHVhbGx5IHVzaW5nIGBhbmltYXRlKClgLlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIEBDb21wb25lbnQoe1xuICogICBzZWxlY3RvcjogJ2lubmVyJyxcbiAqICAgdGVtcGxhdGU6IGBcbiAqICAgICA8ZGl2IFtAcXVlcnlBbmltYXRpb25dPVwiZXhwXCI+XG4gKiAgICAgICA8aDE+VGl0bGU8L2gxPlxuICogICAgICAgPGRpdiBjbGFzcz1cImNvbnRlbnRcIj5cbiAqICAgICAgICAgQmxhaCBibGFoIGJsYWhcbiAqICAgICAgIDwvZGl2PlxuICogICAgIDwvZGl2PlxuICogICBgLFxuICogICBhbmltYXRpb25zOiBbXG4gKiAgICB0cmlnZ2VyKCdxdWVyeUFuaW1hdGlvbicsIFtcbiAqICAgICAgdHJhbnNpdGlvbignKiA9PiBnb0FuaW1hdGUnLCBbXG4gKiAgICAgICAgLy8gaGlkZSB0aGUgaW5uZXIgZWxlbWVudHNcbiAqICAgICAgICBxdWVyeSgnaDEnLCBzdHlsZSh7IG9wYWNpdHk6IDAgfSkpLFxuICogICAgICAgIHF1ZXJ5KCcuY29udGVudCcsIHN0eWxlKHsgb3BhY2l0eTogMCB9KSksXG4gKlxuICogICAgICAgIC8vIGFuaW1hdGUgdGhlIGlubmVyIGVsZW1lbnRzIGluLCBvbmUgYnkgb25lXG4gKiAgICAgICAgcXVlcnkoJ2gxJywgYW5pbWF0ZSgxMDAwLCBzdHlsZSh7IG9wYWNpdHk6IDEgfSkpKSxcbiAqICAgICAgICBxdWVyeSgnLmNvbnRlbnQnLCBhbmltYXRlKDEwMDAsIHN0eWxlKHsgb3BhY2l0eTogMSB9KSkpLFxuICogICAgICBdKVxuICogICAgXSlcbiAqICBdXG4gKiB9KVxuICogY2xhc3MgQ21wIHtcbiAqICAgZXhwID0gJyc7XG4gKlxuICogICBnb0FuaW1hdGUoKSB7XG4gKiAgICAgdGhpcy5leHAgPSAnZ29BbmltYXRlJztcbiAqICAgfVxuICogfVxuICogYGBgXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gcXVlcnkoXG4gICAgc2VsZWN0b3I6IHN0cmluZywgYW5pbWF0aW9uOiBBbmltYXRpb25NZXRhZGF0YXxBbmltYXRpb25NZXRhZGF0YVtdLFxuICAgIG9wdGlvbnM6IEFuaW1hdGlvblF1ZXJ5T3B0aW9uc3xudWxsID0gbnVsbCk6IEFuaW1hdGlvblF1ZXJ5TWV0YWRhdGEge1xuICByZXR1cm4ge3R5cGU6IEFuaW1hdGlvbk1ldGFkYXRhVHlwZS5RdWVyeSwgc2VsZWN0b3IsIGFuaW1hdGlvbiwgb3B0aW9uc307XG59XG5cbi8qKlxuICogVXNlIHdpdGhpbiBhbiBhbmltYXRpb24gYHF1ZXJ5KClgIGNhbGwgdG8gaXNzdWUgYSB0aW1pbmcgZ2FwIGFmdGVyXG4gKiBlYWNoIHF1ZXJpZWQgaXRlbSBpcyBhbmltYXRlZC5cbiAqXG4gKiBAcGFyYW0gdGltaW5ncyBBIGRlbGF5IHZhbHVlLlxuICogQHBhcmFtIGFuaW1hdGlvbiBPbmUgb3JlIG1vcmUgYW5pbWF0aW9uIHN0ZXBzLlxuICogQHJldHVybnMgQW4gb2JqZWN0IHRoYXQgZW5jYXBzdWxhdGVzIHRoZSBzdGFnZ2VyIGRhdGEuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqIEluIHRoZSBmb2xsb3dpbmcgZXhhbXBsZSwgYSBjb250YWluZXIgZWxlbWVudCB3cmFwcyBhIGxpc3Qgb2YgaXRlbXMgc3RhbXBlZCBvdXRcbiAqIGJ5IGFuIGBuZ0ZvcmAuIFRoZSBjb250YWluZXIgZWxlbWVudCBjb250YWlucyBhbiBhbmltYXRpb24gdHJpZ2dlciB0aGF0IHdpbGwgbGF0ZXIgYmUgc2V0XG4gKiB0byBxdWVyeSBmb3IgZWFjaCBvZiB0aGUgaW5uZXIgaXRlbXMuXG4gKlxuICogRWFjaCB0aW1lIGl0ZW1zIGFyZSBhZGRlZCwgdGhlIG9wYWNpdHkgZmFkZS1pbiBhbmltYXRpb24gcnVucyxcbiAqIGFuZCBlYWNoIHJlbW92ZWQgaXRlbSBpcyBmYWRlZCBvdXQuXG4gKiBXaGVuIGVpdGhlciBvZiB0aGVzZSBhbmltYXRpb25zIG9jY3VyLCB0aGUgc3RhZ2dlciBlZmZlY3QgaXNcbiAqIGFwcGxpZWQgYWZ0ZXIgZWFjaCBpdGVtJ3MgYW5pbWF0aW9uIGlzIHN0YXJ0ZWQuXG4gKlxuICogYGBgaHRtbFxuICogPCEtLSBsaXN0LmNvbXBvbmVudC5odG1sIC0tPlxuICogPGJ1dHRvbiAoY2xpY2spPVwidG9nZ2xlKClcIj5TaG93IC8gSGlkZSBJdGVtczwvYnV0dG9uPlxuICogPGhyIC8+XG4gKiA8ZGl2IFtAbGlzdEFuaW1hdGlvbl09XCJpdGVtcy5sZW5ndGhcIj5cbiAqICAgPGRpdiAqbmdGb3I9XCJsZXQgaXRlbSBvZiBpdGVtc1wiPlxuICogICAgIHt7IGl0ZW0gfX1cbiAqICAgPC9kaXY+XG4gKiA8L2Rpdj5cbiAqIGBgYFxuICpcbiAqIEhlcmUgaXMgdGhlIGNvbXBvbmVudCBjb2RlOlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGltcG9ydCB7dHJpZ2dlciwgdHJhbnNpdGlvbiwgc3R5bGUsIGFuaW1hdGUsIHF1ZXJ5LCBzdGFnZ2VyfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbiAqIEBDb21wb25lbnQoe1xuICogICB0ZW1wbGF0ZVVybDogJ2xpc3QuY29tcG9uZW50Lmh0bWwnLFxuICogICBhbmltYXRpb25zOiBbXG4gKiAgICAgdHJpZ2dlcignbGlzdEFuaW1hdGlvbicsIFtcbiAqICAgICAuLi5cbiAqICAgICBdKVxuICogICBdXG4gKiB9KVxuICogY2xhc3MgTGlzdENvbXBvbmVudCB7XG4gKiAgIGl0ZW1zID0gW107XG4gKlxuICogICBzaG93SXRlbXMoKSB7XG4gKiAgICAgdGhpcy5pdGVtcyA9IFswLDEsMiwzLDRdO1xuICogICB9XG4gKlxuICogICBoaWRlSXRlbXMoKSB7XG4gKiAgICAgdGhpcy5pdGVtcyA9IFtdO1xuICogICB9XG4gKlxuICogICB0b2dnbGUoKSB7XG4gKiAgICAgdGhpcy5pdGVtcy5sZW5ndGggPyB0aGlzLmhpZGVJdGVtcygpIDogdGhpcy5zaG93SXRlbXMoKTtcbiAqICAgIH1cbiAqICB9XG4gKiBgYGBcbiAqXG4gKiBIZXJlIGlzIHRoZSBhbmltYXRpb24gdHJpZ2dlciBjb2RlOlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIHRyaWdnZXIoJ2xpc3RBbmltYXRpb24nLCBbXG4gKiAgIHRyYW5zaXRpb24oJyogPT4gKicsIFsgLy8gZWFjaCB0aW1lIHRoZSBiaW5kaW5nIHZhbHVlIGNoYW5nZXNcbiAqICAgICBxdWVyeSgnOmxlYXZlJywgW1xuICogICAgICAgc3RhZ2dlcigxMDAsIFtcbiAqICAgICAgICAgYW5pbWF0ZSgnMC41cycsIHN0eWxlKHsgb3BhY2l0eTogMCB9KSlcbiAqICAgICAgIF0pXG4gKiAgICAgXSksXG4gKiAgICAgcXVlcnkoJzplbnRlcicsIFtcbiAqICAgICAgIHN0eWxlKHsgb3BhY2l0eTogMCB9KSxcbiAqICAgICAgIHN0YWdnZXIoMTAwLCBbXG4gKiAgICAgICAgIGFuaW1hdGUoJzAuNXMnLCBzdHlsZSh7IG9wYWNpdHk6IDEgfSkpXG4gKiAgICAgICBdKVxuICogICAgIF0pXG4gKiAgIF0pXG4gKiBdKVxuICogYGBgXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gc3RhZ2dlcih0aW1pbmdzOiBzdHJpbmd8bnVtYmVyLCBhbmltYXRpb246IEFuaW1hdGlvbk1ldGFkYXRhfEFuaW1hdGlvbk1ldGFkYXRhW10pOlxuICAgIEFuaW1hdGlvblN0YWdnZXJNZXRhZGF0YSB7XG4gIHJldHVybiB7dHlwZTogQW5pbWF0aW9uTWV0YWRhdGFUeXBlLlN0YWdnZXIsIHRpbWluZ3MsIGFuaW1hdGlvbn07XG59XG4iXX0=