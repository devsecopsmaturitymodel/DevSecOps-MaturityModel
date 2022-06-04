/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { animate, state, style, transition, trigger, } from '@angular/animations';
/**
 * Animations used by the Material snack bar.
 * @docs-private
 */
export const matSnackBarAnimations = {
    /** Animation that shows and hides a snack bar. */
    snackBarState: trigger('state', [
        state('void, hidden', style({
            transform: 'scale(0.8)',
            opacity: 0,
        })),
        state('visible', style({
            transform: 'scale(1)',
            opacity: 1,
        })),
        transition('* => visible', animate('150ms cubic-bezier(0, 0, 0.2, 1)')),
        transition('* => void, * => hidden', animate('75ms cubic-bezier(0.4, 0.0, 1, 1)', style({
            opacity: 0,
        }))),
    ]),
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2stYmFyLWFuaW1hdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc25hY2stYmFyL3NuYWNrLWJhci1hbmltYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFDTCxPQUFPLEVBQ1AsS0FBSyxFQUNMLEtBQUssRUFDTCxVQUFVLEVBQ1YsT0FBTyxHQUVSLE1BQU0scUJBQXFCLENBQUM7QUFFN0I7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBRTlCO0lBQ0Ysa0RBQWtEO0lBQ2xELGFBQWEsRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFO1FBQzlCLEtBQUssQ0FDSCxjQUFjLEVBQ2QsS0FBSyxDQUFDO1lBQ0osU0FBUyxFQUFFLFlBQVk7WUFDdkIsT0FBTyxFQUFFLENBQUM7U0FDWCxDQUFDLENBQ0g7UUFDRCxLQUFLLENBQ0gsU0FBUyxFQUNULEtBQUssQ0FBQztZQUNKLFNBQVMsRUFBRSxVQUFVO1lBQ3JCLE9BQU8sRUFBRSxDQUFDO1NBQ1gsQ0FBQyxDQUNIO1FBQ0QsVUFBVSxDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsa0NBQWtDLENBQUMsQ0FBQztRQUN2RSxVQUFVLENBQ1Isd0JBQXdCLEVBQ3hCLE9BQU8sQ0FDTCxtQ0FBbUMsRUFDbkMsS0FBSyxDQUFDO1lBQ0osT0FBTyxFQUFFLENBQUM7U0FDWCxDQUFDLENBQ0gsQ0FDRjtLQUNGLENBQUM7Q0FDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge1xuICBhbmltYXRlLFxuICBzdGF0ZSxcbiAgc3R5bGUsXG4gIHRyYW5zaXRpb24sXG4gIHRyaWdnZXIsXG4gIEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YSxcbn0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5cbi8qKlxuICogQW5pbWF0aW9ucyB1c2VkIGJ5IHRoZSBNYXRlcmlhbCBzbmFjayBiYXIuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBtYXRTbmFja0JhckFuaW1hdGlvbnM6IHtcbiAgcmVhZG9ubHkgc25hY2tCYXJTdGF0ZTogQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhO1xufSA9IHtcbiAgLyoqIEFuaW1hdGlvbiB0aGF0IHNob3dzIGFuZCBoaWRlcyBhIHNuYWNrIGJhci4gKi9cbiAgc25hY2tCYXJTdGF0ZTogdHJpZ2dlcignc3RhdGUnLCBbXG4gICAgc3RhdGUoXG4gICAgICAndm9pZCwgaGlkZGVuJyxcbiAgICAgIHN0eWxlKHtcbiAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMC44KScsXG4gICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICB9KSxcbiAgICApLFxuICAgIHN0YXRlKFxuICAgICAgJ3Zpc2libGUnLFxuICAgICAgc3R5bGUoe1xuICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgxKScsXG4gICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICB9KSxcbiAgICApLFxuICAgIHRyYW5zaXRpb24oJyogPT4gdmlzaWJsZScsIGFuaW1hdGUoJzE1MG1zIGN1YmljLWJlemllcigwLCAwLCAwLjIsIDEpJykpLFxuICAgIHRyYW5zaXRpb24oXG4gICAgICAnKiA9PiB2b2lkLCAqID0+IGhpZGRlbicsXG4gICAgICBhbmltYXRlKFxuICAgICAgICAnNzVtcyBjdWJpYy1iZXppZXIoMC40LCAwLjAsIDEsIDEpJyxcbiAgICAgICAgc3R5bGUoe1xuICAgICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgIH0pLFxuICAgICAgKSxcbiAgICApLFxuICBdKSxcbn07XG4iXX0=