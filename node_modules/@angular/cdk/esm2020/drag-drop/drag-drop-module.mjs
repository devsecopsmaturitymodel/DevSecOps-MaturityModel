/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CdkDropList } from './directives/drop-list';
import { CdkDropListGroup } from './directives/drop-list-group';
import { CdkDrag } from './directives/drag';
import { CdkDragHandle } from './directives/drag-handle';
import { CdkDragPreview } from './directives/drag-preview';
import { CdkDragPlaceholder } from './directives/drag-placeholder';
import { DragDrop } from './drag-drop';
import * as i0 from "@angular/core";
export class DragDropModule {
}
DragDropModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: DragDropModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
DragDropModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: DragDropModule, declarations: [CdkDropList,
        CdkDropListGroup,
        CdkDrag,
        CdkDragHandle,
        CdkDragPreview,
        CdkDragPlaceholder], exports: [CdkScrollableModule,
        CdkDropList,
        CdkDropListGroup,
        CdkDrag,
        CdkDragHandle,
        CdkDragPreview,
        CdkDragPlaceholder] });
DragDropModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: DragDropModule, providers: [DragDrop], imports: [CdkScrollableModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: DragDropModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        CdkDropList,
                        CdkDropListGroup,
                        CdkDrag,
                        CdkDragHandle,
                        CdkDragPreview,
                        CdkDragPlaceholder,
                    ],
                    exports: [
                        CdkScrollableModule,
                        CdkDropList,
                        CdkDropListGroup,
                        CdkDrag,
                        CdkDragHandle,
                        CdkDragPreview,
                        CdkDragPlaceholder,
                    ],
                    providers: [DragDrop],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZy1kcm9wLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvZHJhZy1kcm9wL2RyYWctZHJvcC1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUMzRCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDbkQsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFDOUQsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzFDLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUN2RCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFDekQsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sK0JBQStCLENBQUM7QUFDakUsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGFBQWEsQ0FBQzs7QUFzQnJDLE1BQU0sT0FBTyxjQUFjOzsyR0FBZCxjQUFjOzRHQUFkLGNBQWMsaUJBbEJ2QixXQUFXO1FBQ1gsZ0JBQWdCO1FBQ2hCLE9BQU87UUFDUCxhQUFhO1FBQ2IsY0FBYztRQUNkLGtCQUFrQixhQUdsQixtQkFBbUI7UUFDbkIsV0FBVztRQUNYLGdCQUFnQjtRQUNoQixPQUFPO1FBQ1AsYUFBYTtRQUNiLGNBQWM7UUFDZCxrQkFBa0I7NEdBSVQsY0FBYyxhQUZkLENBQUMsUUFBUSxDQUFDLFlBUm5CLG1CQUFtQjsyRkFVVixjQUFjO2tCQXBCMUIsUUFBUTttQkFBQztvQkFDUixZQUFZLEVBQUU7d0JBQ1osV0FBVzt3QkFDWCxnQkFBZ0I7d0JBQ2hCLE9BQU87d0JBQ1AsYUFBYTt3QkFDYixjQUFjO3dCQUNkLGtCQUFrQjtxQkFDbkI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLG1CQUFtQjt3QkFDbkIsV0FBVzt3QkFDWCxnQkFBZ0I7d0JBQ2hCLE9BQU87d0JBQ1AsYUFBYTt3QkFDYixjQUFjO3dCQUNkLGtCQUFrQjtxQkFDbkI7b0JBQ0QsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDO2lCQUN0QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q2RrU2Nyb2xsYWJsZU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5pbXBvcnQge0Nka0Ryb3BMaXN0fSBmcm9tICcuL2RpcmVjdGl2ZXMvZHJvcC1saXN0JztcbmltcG9ydCB7Q2RrRHJvcExpc3RHcm91cH0gZnJvbSAnLi9kaXJlY3RpdmVzL2Ryb3AtbGlzdC1ncm91cCc7XG5pbXBvcnQge0Nka0RyYWd9IGZyb20gJy4vZGlyZWN0aXZlcy9kcmFnJztcbmltcG9ydCB7Q2RrRHJhZ0hhbmRsZX0gZnJvbSAnLi9kaXJlY3RpdmVzL2RyYWctaGFuZGxlJztcbmltcG9ydCB7Q2RrRHJhZ1ByZXZpZXd9IGZyb20gJy4vZGlyZWN0aXZlcy9kcmFnLXByZXZpZXcnO1xuaW1wb3J0IHtDZGtEcmFnUGxhY2Vob2xkZXJ9IGZyb20gJy4vZGlyZWN0aXZlcy9kcmFnLXBsYWNlaG9sZGVyJztcbmltcG9ydCB7RHJhZ0Ryb3B9IGZyb20gJy4vZHJhZy1kcm9wJztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgQ2RrRHJvcExpc3QsXG4gICAgQ2RrRHJvcExpc3RHcm91cCxcbiAgICBDZGtEcmFnLFxuICAgIENka0RyYWdIYW5kbGUsXG4gICAgQ2RrRHJhZ1ByZXZpZXcsXG4gICAgQ2RrRHJhZ1BsYWNlaG9sZGVyLFxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgQ2RrU2Nyb2xsYWJsZU1vZHVsZSxcbiAgICBDZGtEcm9wTGlzdCxcbiAgICBDZGtEcm9wTGlzdEdyb3VwLFxuICAgIENka0RyYWcsXG4gICAgQ2RrRHJhZ0hhbmRsZSxcbiAgICBDZGtEcmFnUHJldmlldyxcbiAgICBDZGtEcmFnUGxhY2Vob2xkZXIsXG4gIF0sXG4gIHByb3ZpZGVyczogW0RyYWdEcm9wXSxcbn0pXG5leHBvcnQgY2xhc3MgRHJhZ0Ryb3BNb2R1bGUge31cbiJdfQ==