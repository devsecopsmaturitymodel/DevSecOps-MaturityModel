/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AUTO_STYLE, NoopAnimationPlayer } from '@angular/animations';
import { ɵallowPreviousPlayerStylesMerge as allowPreviousPlayerStylesMerge, ɵcontainsElement as containsElement, ɵgetParentElement as getParentElement, ɵinvokeQuery as invokeQuery, ɵvalidateStyleProperty as validateStyleProperty } from '@angular/animations/browser';
/**
 * @publicApi
 */
export class MockAnimationDriver {
    validateStyleProperty(prop) {
        return validateStyleProperty(prop);
    }
    matchesElement(_element, _selector) {
        return false;
    }
    containsElement(elm1, elm2) {
        return containsElement(elm1, elm2);
    }
    getParentElement(element) {
        return getParentElement(element);
    }
    query(element, selector, multi) {
        return invokeQuery(element, selector, multi);
    }
    computeStyle(element, prop, defaultValue) {
        return defaultValue || '';
    }
    animate(element, keyframes, duration, delay, easing, previousPlayers = []) {
        const player = new MockAnimationPlayer(element, keyframes, duration, delay, easing, previousPlayers);
        MockAnimationDriver.log.push(player);
        return player;
    }
}
MockAnimationDriver.log = [];
/**
 * @publicApi
 */
export class MockAnimationPlayer extends NoopAnimationPlayer {
    constructor(element, keyframes, duration, delay, easing, previousPlayers) {
        super(duration, delay);
        this.element = element;
        this.keyframes = keyframes;
        this.duration = duration;
        this.delay = delay;
        this.easing = easing;
        this.previousPlayers = previousPlayers;
        this.__finished = false;
        this.__started = false;
        this.previousStyles = {};
        this._onInitFns = [];
        this.currentSnapshot = {};
        if (allowPreviousPlayerStylesMerge(duration, delay)) {
            previousPlayers.forEach(player => {
                if (player instanceof MockAnimationPlayer) {
                    const styles = player.currentSnapshot;
                    Object.keys(styles).forEach(prop => this.previousStyles[prop] = styles[prop]);
                }
            });
        }
    }
    /* @internal */
    onInit(fn) {
        this._onInitFns.push(fn);
    }
    /* @internal */
    init() {
        super.init();
        this._onInitFns.forEach(fn => fn());
        this._onInitFns = [];
    }
    reset() {
        super.reset();
        this.__started = false;
    }
    finish() {
        super.finish();
        this.__finished = true;
    }
    destroy() {
        super.destroy();
        this.__finished = true;
    }
    /* @internal */
    triggerMicrotask() { }
    play() {
        super.play();
        this.__started = true;
    }
    hasStarted() {
        return this.__started;
    }
    beforeDestroy() {
        const captures = {};
        Object.keys(this.previousStyles).forEach(prop => {
            captures[prop] = this.previousStyles[prop];
        });
        if (this.hasStarted()) {
            // when assembling the captured styles, it's important that
            // we build the keyframe styles in the following order:
            // {other styles within keyframes, ... previousStyles }
            this.keyframes.forEach(kf => {
                Object.keys(kf).forEach(prop => {
                    if (prop != 'offset') {
                        captures[prop] = this.__finished ? kf[prop] : AUTO_STYLE;
                    }
                });
            });
        }
        this.currentSnapshot = captures;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9ja19hbmltYXRpb25fZHJpdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYW5pbWF0aW9ucy9icm93c2VyL3Rlc3Rpbmcvc3JjL21vY2tfYW5pbWF0aW9uX2RyaXZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxPQUFPLEVBQWtCLFVBQVUsRUFBRSxtQkFBbUIsRUFBYSxNQUFNLHFCQUFxQixDQUFDO0FBQ2pHLE9BQU8sRUFBa0IsK0JBQStCLElBQUksOEJBQThCLEVBQUUsZ0JBQWdCLElBQUksZUFBZSxFQUFFLGlCQUFpQixJQUFJLGdCQUFnQixFQUFFLFlBQVksSUFBSSxXQUFXLEVBQUUsc0JBQXNCLElBQUkscUJBQXFCLEVBQUMsTUFBTSw2QkFBNkIsQ0FBQztBQUd6Ujs7R0FFRztBQUNILE1BQU0sT0FBTyxtQkFBbUI7SUFHOUIscUJBQXFCLENBQUMsSUFBWTtRQUNoQyxPQUFPLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxjQUFjLENBQUMsUUFBYSxFQUFFLFNBQWlCO1FBQzdDLE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELGVBQWUsQ0FBQyxJQUFTLEVBQUUsSUFBUztRQUNsQyxPQUFPLGVBQWUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELGdCQUFnQixDQUFDLE9BQWdCO1FBQy9CLE9BQU8sZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVELEtBQUssQ0FBQyxPQUFZLEVBQUUsUUFBZ0IsRUFBRSxLQUFjO1FBQ2xELE9BQU8sV0FBVyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELFlBQVksQ0FBQyxPQUFZLEVBQUUsSUFBWSxFQUFFLFlBQXFCO1FBQzVELE9BQU8sWUFBWSxJQUFJLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBRUQsT0FBTyxDQUNILE9BQVksRUFBRSxTQUEyQyxFQUFFLFFBQWdCLEVBQUUsS0FBYSxFQUMxRixNQUFjLEVBQUUsa0JBQXlCLEVBQUU7UUFDN0MsTUFBTSxNQUFNLEdBQ1IsSUFBSSxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQzFGLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQWtCLE1BQU0sQ0FBQyxDQUFDO1FBQ3RELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7O0FBakNNLHVCQUFHLEdBQXNCLEVBQUUsQ0FBQztBQW9DckM7O0dBRUc7QUFDSCxNQUFNLE9BQU8sbUJBQW9CLFNBQVEsbUJBQW1CO0lBTzFELFlBQ1csT0FBWSxFQUFTLFNBQTJDLEVBQ2hFLFFBQWdCLEVBQVMsS0FBYSxFQUFTLE1BQWMsRUFDN0QsZUFBc0I7UUFDL0IsS0FBSyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUhkLFlBQU8sR0FBUCxPQUFPLENBQUs7UUFBUyxjQUFTLEdBQVQsU0FBUyxDQUFrQztRQUNoRSxhQUFRLEdBQVIsUUFBUSxDQUFRO1FBQVMsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUFTLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDN0Qsb0JBQWUsR0FBZixlQUFlLENBQU87UUFUekIsZUFBVSxHQUFHLEtBQUssQ0FBQztRQUNuQixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ25CLG1CQUFjLEdBQW1DLEVBQUUsQ0FBQztRQUNuRCxlQUFVLEdBQWtCLEVBQUUsQ0FBQztRQUNoQyxvQkFBZSxHQUFlLEVBQUUsQ0FBQztRQVF0QyxJQUFJLDhCQUE4QixDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsRUFBRTtZQUNuRCxlQUFlLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUMvQixJQUFJLE1BQU0sWUFBWSxtQkFBbUIsRUFBRTtvQkFDekMsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQztvQkFDdEMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2lCQUMvRTtZQUNILENBQUMsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDO0lBRUQsZUFBZTtJQUNmLE1BQU0sQ0FBQyxFQUFhO1FBQ2xCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFRCxlQUFlO0lBQ04sSUFBSTtRQUNYLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRVEsS0FBSztRQUNaLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNkLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQ3pCLENBQUM7SUFFUSxNQUFNO1FBQ2IsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2YsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7SUFDekIsQ0FBQztJQUVRLE9BQU87UUFDZCxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7SUFDekIsQ0FBQztJQUVELGVBQWU7SUFDZixnQkFBZ0IsS0FBSSxDQUFDO0lBRVosSUFBSTtRQUNYLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQ3hCLENBQUM7SUFFUSxVQUFVO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUN4QixDQUFDO0lBRUQsYUFBYTtRQUNYLE1BQU0sUUFBUSxHQUFlLEVBQUUsQ0FBQztRQUVoQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDOUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0MsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRTtZQUNyQiwyREFBMkQ7WUFDM0QsdURBQXVEO1lBQ3ZELHVEQUF1RDtZQUN2RCxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRTtnQkFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQzdCLElBQUksSUFBSSxJQUFJLFFBQVEsRUFBRTt3QkFDcEIsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO3FCQUMxRDtnQkFDSCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxJQUFJLENBQUMsZUFBZSxHQUFHLFFBQVEsQ0FBQztJQUNsQyxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7QW5pbWF0aW9uUGxheWVyLCBBVVRPX1NUWUxFLCBOb29wQW5pbWF0aW9uUGxheWVyLCDJtVN0eWxlRGF0YX0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge0FuaW1hdGlvbkRyaXZlciwgybVhbGxvd1ByZXZpb3VzUGxheWVyU3R5bGVzTWVyZ2UgYXMgYWxsb3dQcmV2aW91c1BsYXllclN0eWxlc01lcmdlLCDJtWNvbnRhaW5zRWxlbWVudCBhcyBjb250YWluc0VsZW1lbnQsIMm1Z2V0UGFyZW50RWxlbWVudCBhcyBnZXRQYXJlbnRFbGVtZW50LCDJtWludm9rZVF1ZXJ5IGFzIGludm9rZVF1ZXJ5LCDJtXZhbGlkYXRlU3R5bGVQcm9wZXJ0eSBhcyB2YWxpZGF0ZVN0eWxlUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMvYnJvd3Nlcic7XG5cblxuLyoqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBjbGFzcyBNb2NrQW5pbWF0aW9uRHJpdmVyIGltcGxlbWVudHMgQW5pbWF0aW9uRHJpdmVyIHtcbiAgc3RhdGljIGxvZzogQW5pbWF0aW9uUGxheWVyW10gPSBbXTtcblxuICB2YWxpZGF0ZVN0eWxlUHJvcGVydHkocHJvcDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHZhbGlkYXRlU3R5bGVQcm9wZXJ0eShwcm9wKTtcbiAgfVxuXG4gIG1hdGNoZXNFbGVtZW50KF9lbGVtZW50OiBhbnksIF9zZWxlY3Rvcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29udGFpbnNFbGVtZW50KGVsbTE6IGFueSwgZWxtMjogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGNvbnRhaW5zRWxlbWVudChlbG0xLCBlbG0yKTtcbiAgfVxuXG4gIGdldFBhcmVudEVsZW1lbnQoZWxlbWVudDogdW5rbm93bik6IHVua25vd24ge1xuICAgIHJldHVybiBnZXRQYXJlbnRFbGVtZW50KGVsZW1lbnQpO1xuICB9XG5cbiAgcXVlcnkoZWxlbWVudDogYW55LCBzZWxlY3Rvcjogc3RyaW5nLCBtdWx0aTogYm9vbGVhbik6IGFueVtdIHtcbiAgICByZXR1cm4gaW52b2tlUXVlcnkoZWxlbWVudCwgc2VsZWN0b3IsIG11bHRpKTtcbiAgfVxuXG4gIGNvbXB1dGVTdHlsZShlbGVtZW50OiBhbnksIHByb3A6IHN0cmluZywgZGVmYXVsdFZhbHVlPzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gZGVmYXVsdFZhbHVlIHx8ICcnO1xuICB9XG5cbiAgYW5pbWF0ZShcbiAgICAgIGVsZW1lbnQ6IGFueSwga2V5ZnJhbWVzOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfG51bWJlcn1bXSwgZHVyYXRpb246IG51bWJlciwgZGVsYXk6IG51bWJlcixcbiAgICAgIGVhc2luZzogc3RyaW5nLCBwcmV2aW91c1BsYXllcnM6IGFueVtdID0gW10pOiBNb2NrQW5pbWF0aW9uUGxheWVyIHtcbiAgICBjb25zdCBwbGF5ZXIgPVxuICAgICAgICBuZXcgTW9ja0FuaW1hdGlvblBsYXllcihlbGVtZW50LCBrZXlmcmFtZXMsIGR1cmF0aW9uLCBkZWxheSwgZWFzaW5nLCBwcmV2aW91c1BsYXllcnMpO1xuICAgIE1vY2tBbmltYXRpb25Ecml2ZXIubG9nLnB1c2goPEFuaW1hdGlvblBsYXllcj5wbGF5ZXIpO1xuICAgIHJldHVybiBwbGF5ZXI7XG4gIH1cbn1cblxuLyoqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBjbGFzcyBNb2NrQW5pbWF0aW9uUGxheWVyIGV4dGVuZHMgTm9vcEFuaW1hdGlvblBsYXllciB7XG4gIHByaXZhdGUgX19maW5pc2hlZCA9IGZhbHNlO1xuICBwcml2YXRlIF9fc3RhcnRlZCA9IGZhbHNlO1xuICBwdWJsaWMgcHJldmlvdXNTdHlsZXM6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd8bnVtYmVyfSA9IHt9O1xuICBwcml2YXRlIF9vbkluaXRGbnM6ICgoKSA9PiBhbnkpW10gPSBbXTtcbiAgcHVibGljIGN1cnJlbnRTbmFwc2hvdDogybVTdHlsZURhdGEgPSB7fTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyBlbGVtZW50OiBhbnksIHB1YmxpYyBrZXlmcmFtZXM6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd8bnVtYmVyfVtdLFxuICAgICAgcHVibGljIGR1cmF0aW9uOiBudW1iZXIsIHB1YmxpYyBkZWxheTogbnVtYmVyLCBwdWJsaWMgZWFzaW5nOiBzdHJpbmcsXG4gICAgICBwdWJsaWMgcHJldmlvdXNQbGF5ZXJzOiBhbnlbXSkge1xuICAgIHN1cGVyKGR1cmF0aW9uLCBkZWxheSk7XG5cbiAgICBpZiAoYWxsb3dQcmV2aW91c1BsYXllclN0eWxlc01lcmdlKGR1cmF0aW9uLCBkZWxheSkpIHtcbiAgICAgIHByZXZpb3VzUGxheWVycy5mb3JFYWNoKHBsYXllciA9PiB7XG4gICAgICAgIGlmIChwbGF5ZXIgaW5zdGFuY2VvZiBNb2NrQW5pbWF0aW9uUGxheWVyKSB7XG4gICAgICAgICAgY29uc3Qgc3R5bGVzID0gcGxheWVyLmN1cnJlbnRTbmFwc2hvdDtcbiAgICAgICAgICBPYmplY3Qua2V5cyhzdHlsZXMpLmZvckVhY2gocHJvcCA9PiB0aGlzLnByZXZpb3VzU3R5bGVzW3Byb3BdID0gc3R5bGVzW3Byb3BdKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyogQGludGVybmFsICovXG4gIG9uSW5pdChmbjogKCkgPT4gYW55KSB7XG4gICAgdGhpcy5fb25Jbml0Rm5zLnB1c2goZm4pO1xuICB9XG5cbiAgLyogQGludGVybmFsICovXG4gIG92ZXJyaWRlIGluaXQoKSB7XG4gICAgc3VwZXIuaW5pdCgpO1xuICAgIHRoaXMuX29uSW5pdEZucy5mb3JFYWNoKGZuID0+IGZuKCkpO1xuICAgIHRoaXMuX29uSW5pdEZucyA9IFtdO1xuICB9XG5cbiAgb3ZlcnJpZGUgcmVzZXQoKSB7XG4gICAgc3VwZXIucmVzZXQoKTtcbiAgICB0aGlzLl9fc3RhcnRlZCA9IGZhbHNlO1xuICB9XG5cbiAgb3ZlcnJpZGUgZmluaXNoKCk6IHZvaWQge1xuICAgIHN1cGVyLmZpbmlzaCgpO1xuICAgIHRoaXMuX19maW5pc2hlZCA9IHRydWU7XG4gIH1cblxuICBvdmVycmlkZSBkZXN0cm95KCk6IHZvaWQge1xuICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgICB0aGlzLl9fZmluaXNoZWQgPSB0cnVlO1xuICB9XG5cbiAgLyogQGludGVybmFsICovXG4gIHRyaWdnZXJNaWNyb3Rhc2soKSB7fVxuXG4gIG92ZXJyaWRlIHBsYXkoKTogdm9pZCB7XG4gICAgc3VwZXIucGxheSgpO1xuICAgIHRoaXMuX19zdGFydGVkID0gdHJ1ZTtcbiAgfVxuXG4gIG92ZXJyaWRlIGhhc1N0YXJ0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX19zdGFydGVkO1xuICB9XG5cbiAgYmVmb3JlRGVzdHJveSgpIHtcbiAgICBjb25zdCBjYXB0dXJlczogybVTdHlsZURhdGEgPSB7fTtcblxuICAgIE9iamVjdC5rZXlzKHRoaXMucHJldmlvdXNTdHlsZXMpLmZvckVhY2gocHJvcCA9PiB7XG4gICAgICBjYXB0dXJlc1twcm9wXSA9IHRoaXMucHJldmlvdXNTdHlsZXNbcHJvcF07XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5oYXNTdGFydGVkKCkpIHtcbiAgICAgIC8vIHdoZW4gYXNzZW1ibGluZyB0aGUgY2FwdHVyZWQgc3R5bGVzLCBpdCdzIGltcG9ydGFudCB0aGF0XG4gICAgICAvLyB3ZSBidWlsZCB0aGUga2V5ZnJhbWUgc3R5bGVzIGluIHRoZSBmb2xsb3dpbmcgb3JkZXI6XG4gICAgICAvLyB7b3RoZXIgc3R5bGVzIHdpdGhpbiBrZXlmcmFtZXMsIC4uLiBwcmV2aW91c1N0eWxlcyB9XG4gICAgICB0aGlzLmtleWZyYW1lcy5mb3JFYWNoKGtmID0+IHtcbiAgICAgICAgT2JqZWN0LmtleXMoa2YpLmZvckVhY2gocHJvcCA9PiB7XG4gICAgICAgICAgaWYgKHByb3AgIT0gJ29mZnNldCcpIHtcbiAgICAgICAgICAgIGNhcHR1cmVzW3Byb3BdID0gdGhpcy5fX2ZpbmlzaGVkID8ga2ZbcHJvcF0gOiBBVVRPX1NUWUxFO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLmN1cnJlbnRTbmFwc2hvdCA9IGNhcHR1cmVzO1xuICB9XG59XG4iXX0=