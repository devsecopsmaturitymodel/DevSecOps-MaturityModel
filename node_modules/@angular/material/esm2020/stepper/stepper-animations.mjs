/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { animate, state, style, transition, trigger, } from '@angular/animations';
/**
 * Animations used by the Material steppers.
 * @docs-private
 */
export const matStepperAnimations = {
    /** Animation that transitions the step along the X axis in a horizontal stepper. */
    horizontalStepTransition: trigger('horizontalStepTransition', [
        state('previous', style({ transform: 'translate3d(-100%, 0, 0)', visibility: 'hidden' })),
        // Transition to `inherit`, rather than `visible`,
        // because visibility on a child element the one from the parent,
        // making this element focusable inside of a `hidden` element.
        state('current', style({ transform: 'none', visibility: 'inherit' })),
        state('next', style({ transform: 'translate3d(100%, 0, 0)', visibility: 'hidden' })),
        transition('* => *', animate('500ms cubic-bezier(0.35, 0, 0.25, 1)')),
    ]),
    /** Animation that transitions the step along the Y axis in a vertical stepper. */
    verticalStepTransition: trigger('verticalStepTransition', [
        state('previous', style({ height: '0px', visibility: 'hidden' })),
        state('next', style({ height: '0px', visibility: 'hidden' })),
        // Transition to `inherit`, rather than `visible`,
        // because visibility on a child element the one from the parent,
        // making this element focusable inside of a `hidden` element.
        state('current', style({ height: '*', visibility: 'inherit' })),
        transition('* <=> current', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci1hbmltYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3N0ZXBwZXIvc3RlcHBlci1hbmltYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFDTCxPQUFPLEVBQ1AsS0FBSyxFQUNMLEtBQUssRUFDTCxVQUFVLEVBQ1YsT0FBTyxHQUVSLE1BQU0scUJBQXFCLENBQUM7QUFFN0I7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sb0JBQW9CLEdBRzdCO0lBQ0Ysb0ZBQW9GO0lBQ3BGLHdCQUF3QixFQUFFLE9BQU8sQ0FBQywwQkFBMEIsRUFBRTtRQUM1RCxLQUFLLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxFQUFDLFNBQVMsRUFBRSwwQkFBMEIsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFDLENBQUMsQ0FBQztRQUN2RixrREFBa0Q7UUFDbEQsaUVBQWlFO1FBQ2pFLDhEQUE4RDtRQUM5RCxLQUFLLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxFQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBQyxDQUFDLENBQUM7UUFDbkUsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBQyxTQUFTLEVBQUUseUJBQXlCLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUM7UUFDbEYsVUFBVSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsc0NBQXNDLENBQUMsQ0FBQztLQUN0RSxDQUFDO0lBRUYsa0ZBQWtGO0lBQ2xGLHNCQUFzQixFQUFFLE9BQU8sQ0FBQyx3QkFBd0IsRUFBRTtRQUN4RCxLQUFLLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUM7UUFDL0QsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDO1FBQzNELGtEQUFrRDtRQUNsRCxpRUFBaUU7UUFDakUsOERBQThEO1FBQzlELEtBQUssQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLEVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQztRQUM3RCxVQUFVLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO0tBQzdFLENBQUM7Q0FDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge1xuICBhbmltYXRlLFxuICBzdGF0ZSxcbiAgc3R5bGUsXG4gIHRyYW5zaXRpb24sXG4gIHRyaWdnZXIsXG4gIEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YSxcbn0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5cbi8qKlxuICogQW5pbWF0aW9ucyB1c2VkIGJ5IHRoZSBNYXRlcmlhbCBzdGVwcGVycy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IG1hdFN0ZXBwZXJBbmltYXRpb25zOiB7XG4gIHJlYWRvbmx5IGhvcml6b250YWxTdGVwVHJhbnNpdGlvbjogQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhO1xuICByZWFkb25seSB2ZXJ0aWNhbFN0ZXBUcmFuc2l0aW9uOiBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGE7XG59ID0ge1xuICAvKiogQW5pbWF0aW9uIHRoYXQgdHJhbnNpdGlvbnMgdGhlIHN0ZXAgYWxvbmcgdGhlIFggYXhpcyBpbiBhIGhvcml6b250YWwgc3RlcHBlci4gKi9cbiAgaG9yaXpvbnRhbFN0ZXBUcmFuc2l0aW9uOiB0cmlnZ2VyKCdob3Jpem9udGFsU3RlcFRyYW5zaXRpb24nLCBbXG4gICAgc3RhdGUoJ3ByZXZpb3VzJywgc3R5bGUoe3RyYW5zZm9ybTogJ3RyYW5zbGF0ZTNkKC0xMDAlLCAwLCAwKScsIHZpc2liaWxpdHk6ICdoaWRkZW4nfSkpLFxuICAgIC8vIFRyYW5zaXRpb24gdG8gYGluaGVyaXRgLCByYXRoZXIgdGhhbiBgdmlzaWJsZWAsXG4gICAgLy8gYmVjYXVzZSB2aXNpYmlsaXR5IG9uIGEgY2hpbGQgZWxlbWVudCB0aGUgb25lIGZyb20gdGhlIHBhcmVudCxcbiAgICAvLyBtYWtpbmcgdGhpcyBlbGVtZW50IGZvY3VzYWJsZSBpbnNpZGUgb2YgYSBgaGlkZGVuYCBlbGVtZW50LlxuICAgIHN0YXRlKCdjdXJyZW50Jywgc3R5bGUoe3RyYW5zZm9ybTogJ25vbmUnLCB2aXNpYmlsaXR5OiAnaW5oZXJpdCd9KSksXG4gICAgc3RhdGUoJ25leHQnLCBzdHlsZSh7dHJhbnNmb3JtOiAndHJhbnNsYXRlM2QoMTAwJSwgMCwgMCknLCB2aXNpYmlsaXR5OiAnaGlkZGVuJ30pKSxcbiAgICB0cmFuc2l0aW9uKCcqID0+IConLCBhbmltYXRlKCc1MDBtcyBjdWJpYy1iZXppZXIoMC4zNSwgMCwgMC4yNSwgMSknKSksXG4gIF0pLFxuXG4gIC8qKiBBbmltYXRpb24gdGhhdCB0cmFuc2l0aW9ucyB0aGUgc3RlcCBhbG9uZyB0aGUgWSBheGlzIGluIGEgdmVydGljYWwgc3RlcHBlci4gKi9cbiAgdmVydGljYWxTdGVwVHJhbnNpdGlvbjogdHJpZ2dlcigndmVydGljYWxTdGVwVHJhbnNpdGlvbicsIFtcbiAgICBzdGF0ZSgncHJldmlvdXMnLCBzdHlsZSh7aGVpZ2h0OiAnMHB4JywgdmlzaWJpbGl0eTogJ2hpZGRlbid9KSksXG4gICAgc3RhdGUoJ25leHQnLCBzdHlsZSh7aGVpZ2h0OiAnMHB4JywgdmlzaWJpbGl0eTogJ2hpZGRlbid9KSksXG4gICAgLy8gVHJhbnNpdGlvbiB0byBgaW5oZXJpdGAsIHJhdGhlciB0aGFuIGB2aXNpYmxlYCxcbiAgICAvLyBiZWNhdXNlIHZpc2liaWxpdHkgb24gYSBjaGlsZCBlbGVtZW50IHRoZSBvbmUgZnJvbSB0aGUgcGFyZW50LFxuICAgIC8vIG1ha2luZyB0aGlzIGVsZW1lbnQgZm9jdXNhYmxlIGluc2lkZSBvZiBhIGBoaWRkZW5gIGVsZW1lbnQuXG4gICAgc3RhdGUoJ2N1cnJlbnQnLCBzdHlsZSh7aGVpZ2h0OiAnKicsIHZpc2liaWxpdHk6ICdpbmhlcml0J30pKSxcbiAgICB0cmFuc2l0aW9uKCcqIDw9PiBjdXJyZW50JywgYW5pbWF0ZSgnMjI1bXMgY3ViaWMtYmV6aWVyKDAuNCwgMC4wLCAwLjIsIDEpJykpLFxuICBdKSxcbn07XG4iXX0=