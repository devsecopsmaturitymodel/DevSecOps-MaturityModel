/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AnimationBuilder, AnimationFactory, sequence } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, RendererFactory2, ViewEncapsulation } from '@angular/core';
import * as i0 from "@angular/core";
export class BrowserAnimationBuilder extends AnimationBuilder {
    constructor(rootRenderer, doc) {
        super();
        this._nextAnimationId = 0;
        const typeData = { id: '0', encapsulation: ViewEncapsulation.None, styles: [], data: { animation: [] } };
        this._renderer = rootRenderer.createRenderer(doc.body, typeData);
    }
    build(animation) {
        const id = this._nextAnimationId.toString();
        this._nextAnimationId++;
        const entry = Array.isArray(animation) ? sequence(animation) : animation;
        issueAnimationCommand(this._renderer, null, id, 'register', [entry]);
        return new BrowserAnimationFactory(id, this._renderer);
    }
}
BrowserAnimationBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: BrowserAnimationBuilder, deps: [{ token: i0.RendererFactory2 }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable });
BrowserAnimationBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: BrowserAnimationBuilder });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: BrowserAnimationBuilder, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i0.RendererFactory2 }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
export class BrowserAnimationFactory extends AnimationFactory {
    constructor(_id, _renderer) {
        super();
        this._id = _id;
        this._renderer = _renderer;
    }
    create(element, options) {
        return new RendererAnimationPlayer(this._id, element, options || {}, this._renderer);
    }
}
export class RendererAnimationPlayer {
    constructor(id, element, options, _renderer) {
        this.id = id;
        this.element = element;
        this._renderer = _renderer;
        this.parentPlayer = null;
        this._started = false;
        this.totalTime = 0;
        this._command('create', options);
    }
    _listen(eventName, callback) {
        return this._renderer.listen(this.element, `@@${this.id}:${eventName}`, callback);
    }
    _command(command, ...args) {
        return issueAnimationCommand(this._renderer, this.element, this.id, command, args);
    }
    onDone(fn) {
        this._listen('done', fn);
    }
    onStart(fn) {
        this._listen('start', fn);
    }
    onDestroy(fn) {
        this._listen('destroy', fn);
    }
    init() {
        this._command('init');
    }
    hasStarted() {
        return this._started;
    }
    play() {
        this._command('play');
        this._started = true;
    }
    pause() {
        this._command('pause');
    }
    restart() {
        this._command('restart');
    }
    finish() {
        this._command('finish');
    }
    destroy() {
        this._command('destroy');
    }
    reset() {
        this._command('reset');
        this._started = false;
    }
    setPosition(p) {
        this._command('setPosition', p);
    }
    getPosition() {
        return this._renderer.engine.players[+this.id]?.getPosition() ?? 0;
    }
}
function issueAnimationCommand(renderer, element, id, command, args) {
    return renderer.setProperty(element, `@@${id}:${command}`, args);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX2J1aWxkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMvc3JjL2FuaW1hdGlvbl9idWlsZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBd0QsUUFBUSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDdkksT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFpQixpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7QUFLckcsTUFBTSxPQUFPLHVCQUF3QixTQUFRLGdCQUFnQjtJQUkzRCxZQUFZLFlBQThCLEVBQW9CLEdBQVE7UUFDcEUsS0FBSyxFQUFFLENBQUM7UUFKRixxQkFBZ0IsR0FBRyxDQUFDLENBQUM7UUFLM0IsTUFBTSxRQUFRLEdBQ1YsRUFBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBQyxTQUFTLEVBQUUsRUFBRSxFQUFDLEVBQ3JFLENBQUM7UUFDbEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxZQUFZLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFzQixDQUFDO0lBQ3hGLENBQUM7SUFFRCxLQUFLLENBQUMsU0FBZ0Q7UUFDcEQsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzVDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQ3hCLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FB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O1FBQ0osSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRUQsT0FBTztRQUNMLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUVELEtBQUs7UUFDSCxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxXQUFXLENBQUMsQ0FBUztRQUNuQixJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQsV0FBVztRQUNULE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNyRSxDQUFDO0NBR0Y7QUFFRCxTQUFTLHFCQUFxQixDQUMxQixRQUEyQixFQUFFLE9BQVksRUFBRSxFQUFVLEVBQUUsT0FBZSxFQUFFLElBQVc7SUFDckYsT0FBTyxRQUFRLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxPQUFPLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNuRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0FuaW1hdGlvbkJ1aWxkZXIsIEFuaW1hdGlvbkZhY3RvcnksIEFuaW1hdGlvbk1ldGFkYXRhLCBBbmltYXRpb25PcHRpb25zLCBBbmltYXRpb25QbGF5ZXIsIHNlcXVlbmNlfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0luamVjdCwgSW5qZWN0YWJsZSwgUmVuZGVyZXJGYWN0b3J5MiwgUmVuZGVyZXJUeXBlMiwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0FuaW1hdGlvblJlbmRlcmVyfSBmcm9tICcuL2FuaW1hdGlvbl9yZW5kZXJlcic7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBCcm93c2VyQW5pbWF0aW9uQnVpbGRlciBleHRlbmRzIEFuaW1hdGlvbkJ1aWxkZXIge1xuICBwcml2YXRlIF9uZXh0QW5pbWF0aW9uSWQgPSAwO1xuICBwcml2YXRlIF9yZW5kZXJlcjogQW5pbWF0aW9uUmVuZGVyZXI7XG5cbiAgY29uc3RydWN0b3Iocm9vdFJlbmRlcmVyOiBSZW5kZXJlckZhY3RvcnkyLCBASW5qZWN0KERPQ1VNRU5UKSBkb2M6IGFueSkge1xuICAgIHN1cGVyKCk7XG4gICAgY29uc3QgdHlwZURhdGEgPVxuICAgICAgICB7aWQ6ICcwJywgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSwgc3R5bGVzOiBbXSwgZGF0YToge2FuaW1hdGlvbjogW119fSBhc1xuICAgICAgICBSZW5kZXJlclR5cGUyO1xuICAgIHRoaXMuX3JlbmRlcmVyID0gcm9vdFJlbmRlcmVyLmNyZWF0ZVJlbmRlcmVyKGRvYy5ib2R5LCB0eXBlRGF0YSkgYXMgQW5pbWF0aW9uUmVuZGVyZXI7XG4gIH1cblxuICBidWlsZChhbmltYXRpb246IEFuaW1hdGlvbk1ldGFkYXRhfEFuaW1hdGlvbk1ldGFkYXRhW10pOiBBbmltYXRpb25GYWN0b3J5IHtcbiAgICBjb25zdCBpZCA9IHRoaXMuX25leHRBbmltYXRpb25JZC50b1N0cmluZygpO1xuICAgIHRoaXMuX25leHRBbmltYXRpb25JZCsrO1xuICAgIGNvbnN0IGVudHJ5ID0gQXJyYXkuaXNBcnJheShhbmltYXRpb24pID8gc2VxdWVuY2UoYW5pbWF0aW9uKSA6IGFuaW1hdGlvbjtcbiAgICBpc3N1ZUFuaW1hdGlvbkNvbW1hbmQodGhpcy5fcmVuZGVyZXIsIG51bGwsIGlkLCAncmVnaXN0ZXInLCBbZW50cnldKTtcbiAgICByZXR1cm4gbmV3IEJyb3dzZXJBbmltYXRpb25GYWN0b3J5KGlkLCB0aGlzLl9yZW5kZXJlcik7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEJyb3dzZXJBbmltYXRpb25GYWN0b3J5IGV4dGVuZHMgQW5pbWF0aW9uRmFjdG9yeSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2lkOiBzdHJpbmcsIHByaXZhdGUgX3JlbmRlcmVyOiBBbmltYXRpb25SZW5kZXJlcikge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBjcmVhdGUoZWxlbWVudDogYW55LCBvcHRpb25zPzogQW5pbWF0aW9uT3B0aW9ucyk6IEFuaW1hdGlvblBsYXllciB7XG4gICAgcmV0dXJuIG5ldyBSZW5kZXJlckFuaW1hdGlvblBsYXllcih0aGlzLl9pZCwgZWxlbWVudCwgb3B0aW9ucyB8fCB7fSwgdGhpcy5fcmVuZGVyZXIpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSZW5kZXJlckFuaW1hdGlvblBsYXllciBpbXBsZW1lbnRzIEFuaW1hdGlvblBsYXllciB7XG4gIHB1YmxpYyBwYXJlbnRQbGF5ZXI6IEFuaW1hdGlvblBsYXllcnxudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBfc3RhcnRlZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHVibGljIGlkOiBzdHJpbmcsIHB1YmxpYyBlbGVtZW50OiBhbnksIG9wdGlvbnM6IEFuaW1hdGlvbk9wdGlvbnMsXG4gICAgICBwcml2YXRlIF9yZW5kZXJlcjogQW5pbWF0aW9uUmVuZGVyZXIpIHtcbiAgICB0aGlzLl9jb21tYW5kKCdjcmVhdGUnLCBvcHRpb25zKTtcbiAgfVxuXG4gIHByaXZhdGUgX2xpc3RlbihldmVudE5hbWU6IHN0cmluZywgY2FsbGJhY2s6IChldmVudDogYW55KSA9PiBhbnkpOiAoKSA9PiB2b2lkIHtcbiAgICByZXR1cm4gdGhpcy5fcmVuZGVyZXIubGlzdGVuKHRoaXMuZWxlbWVudCwgYEBAJHt0aGlzLmlkfToke2V2ZW50TmFtZX1gLCBjYWxsYmFjayk7XG4gIH1cblxuICBwcml2YXRlIF9jb21tYW5kKGNvbW1hbmQ6IHN0cmluZywgLi4uYXJnczogYW55W10pIHtcbiAgICByZXR1cm4gaXNzdWVBbmltYXRpb25Db21tYW5kKHRoaXMuX3JlbmRlcmVyLCB0aGlzLmVsZW1lbnQsIHRoaXMuaWQsIGNvbW1hbmQsIGFyZ3MpO1xuICB9XG5cbiAgb25Eb25lKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5fbGlzdGVuKCdkb25lJywgZm4pO1xuICB9XG5cbiAgb25TdGFydChmbjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMuX2xpc3Rlbignc3RhcnQnLCBmbik7XG4gIH1cblxuICBvbkRlc3Ryb3koZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLl9saXN0ZW4oJ2Rlc3Ryb3knLCBmbik7XG4gIH1cblxuICBpbml0KCk6IHZvaWQge1xuICAgIHRoaXMuX2NvbW1hbmQoJ2luaXQnKTtcbiAgfVxuXG4gIGhhc1N0YXJ0ZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXJ0ZWQ7XG4gIH1cblxuICBwbGF5KCk6IHZvaWQge1xuICAgIHRoaXMuX2NvbW1hbmQoJ3BsYXknKTtcbiAgICB0aGlzLl9zdGFydGVkID0gdHJ1ZTtcbiAgfVxuXG4gIHBhdXNlKCk6IHZvaWQge1xuICAgIHRoaXMuX2NvbW1hbmQoJ3BhdXNlJyk7XG4gIH1cblxuICByZXN0YXJ0KCk6IHZvaWQge1xuICAgIHRoaXMuX2NvbW1hbmQoJ3Jlc3RhcnQnKTtcbiAgfVxuXG4gIGZpbmlzaCgpOiB2b2lkIHtcbiAgICB0aGlzLl9jb21tYW5kKCdmaW5pc2gnKTtcbiAgfVxuXG4gIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5fY29tbWFuZCgnZGVzdHJveScpO1xuICB9XG5cbiAgcmVzZXQoKTogdm9pZCB7XG4gICAgdGhpcy5fY29tbWFuZCgncmVzZXQnKTtcbiAgICB0aGlzLl9zdGFydGVkID0gZmFsc2U7XG4gIH1cblxuICBzZXRQb3NpdGlvbihwOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLl9jb21tYW5kKCdzZXRQb3NpdGlvbicsIHApO1xuICB9XG5cbiAgZ2V0UG9zaXRpb24oKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fcmVuZGVyZXIuZW5naW5lLnBsYXllcnNbK3RoaXMuaWRdPy5nZXRQb3NpdGlvbigpID8/IDA7XG4gIH1cblxuICBwdWJsaWMgdG90YWxUaW1lID0gMDtcbn1cblxuZnVuY3Rpb24gaXNzdWVBbmltYXRpb25Db21tYW5kKFxuICAgIHJlbmRlcmVyOiBBbmltYXRpb25SZW5kZXJlciwgZWxlbWVudDogYW55LCBpZDogc3RyaW5nLCBjb21tYW5kOiBzdHJpbmcsIGFyZ3M6IGFueVtdKTogYW55IHtcbiAgcmV0dXJuIHJlbmRlcmVyLnNldFByb3BlcnR5KGVsZW1lbnQsIGBAQCR7aWR9OiR7Y29tbWFuZH1gLCBhcmdzKTtcbn1cbiJdfQ==