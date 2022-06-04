/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { MatCommonModule } from '@angular/material/core';
import { MatCalendar, MatCalendarHeader } from './calendar';
import { MatCalendarBody } from './calendar-body';
import { MatDatepicker } from './datepicker';
import { MatDatepickerContent, MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER, } from './datepicker-base';
import { MatDatepickerInput } from './datepicker-input';
import { MatDatepickerIntl } from './datepicker-intl';
import { MatDatepickerToggle, MatDatepickerToggleIcon } from './datepicker-toggle';
import { MatMonthView } from './month-view';
import { MatMultiYearView } from './multi-year-view';
import { MatYearView } from './year-view';
import { MatDateRangeInput } from './date-range-input';
import { MatStartDate, MatEndDate } from './date-range-input-parts';
import { MatDateRangePicker } from './date-range-picker';
import { MatDatepickerActions, MatDatepickerApply, MatDatepickerCancel } from './datepicker-actions';
import * as i0 from "@angular/core";
export class MatDatepickerModule {
}
MatDatepickerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatDatepickerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatDatepickerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatDatepickerModule, declarations: [MatCalendar,
        MatCalendarBody,
        MatDatepicker,
        MatDatepickerContent,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatDatepickerToggleIcon,
        MatMonthView,
        MatYearView,
        MatMultiYearView,
        MatCalendarHeader,
        MatDateRangeInput,
        MatStartDate,
        MatEndDate,
        MatDateRangePicker,
        MatDatepickerActions,
        MatDatepickerCancel,
        MatDatepickerApply], imports: [CommonModule,
        MatButtonModule,
        OverlayModule,
        A11yModule,
        PortalModule,
        MatCommonModule], exports: [CdkScrollableModule,
        MatCalendar,
        MatCalendarBody,
        MatDatepicker,
        MatDatepickerContent,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatDatepickerToggleIcon,
        MatMonthView,
        MatYearView,
        MatMultiYearView,
        MatCalendarHeader,
        MatDateRangeInput,
        MatStartDate,
        MatEndDate,
        MatDateRangePicker,
        MatDatepickerActions,
        MatDatepickerCancel,
        MatDatepickerApply] });
MatDatepickerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatDatepickerModule, providers: [MatDatepickerIntl, MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER], imports: [[
            CommonModule,
            MatButtonModule,
            OverlayModule,
            A11yModule,
            PortalModule,
            MatCommonModule,
        ], CdkScrollableModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatDatepickerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        MatButtonModule,
                        OverlayModule,
                        A11yModule,
                        PortalModule,
                        MatCommonModule,
                    ],
                    exports: [
                        CdkScrollableModule,
                        MatCalendar,
                        MatCalendarBody,
                        MatDatepicker,
                        MatDatepickerContent,
                        MatDatepickerInput,
                        MatDatepickerToggle,
                        MatDatepickerToggleIcon,
                        MatMonthView,
                        MatYearView,
                        MatMultiYearView,
                        MatCalendarHeader,
                        MatDateRangeInput,
                        MatStartDate,
                        MatEndDate,
                        MatDateRangePicker,
                        MatDatepickerActions,
                        MatDatepickerCancel,
                        MatDatepickerApply,
                    ],
                    declarations: [
                        MatCalendar,
                        MatCalendarBody,
                        MatDatepicker,
                        MatDatepickerContent,
                        MatDatepickerInput,
                        MatDatepickerToggle,
                        MatDatepickerToggleIcon,
                        MatMonthView,
                        MatYearView,
                        MatMultiYearView,
                        MatCalendarHeader,
                        MatDateRangeInput,
                        MatStartDate,
                        MatEndDate,
                        MatDateRangePicker,
                        MatDatepickerActions,
                        MatDatepickerCancel,
                        MatDatepickerApply,
                    ],
                    providers: [MatDatepickerIntl, MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGF0ZXBpY2tlci9kYXRlcGlja2VyLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDN0MsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNqRCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDekQsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDM0QsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxXQUFXLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDMUQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ2hELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDM0MsT0FBTyxFQUNMLG9CQUFvQixFQUNwQiwrQ0FBK0MsR0FDaEQsTUFBTSxtQkFBbUIsQ0FBQztBQUMzQixPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUN0RCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNwRCxPQUFPLEVBQUMsbUJBQW1CLEVBQUUsdUJBQXVCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNqRixPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzFDLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDeEMsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDckQsT0FBTyxFQUFDLFlBQVksRUFBRSxVQUFVLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNsRSxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUN2RCxPQUFPLEVBQUMsb0JBQW9CLEVBQUUsa0JBQWtCLEVBQUUsbUJBQW1CLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQzs7QUFzRG5HLE1BQU0sT0FBTyxtQkFBbUI7O2dIQUFuQixtQkFBbUI7aUhBQW5CLG1CQUFtQixpQkFyQjVCLFdBQVc7UUFDWCxlQUFlO1FBQ2YsYUFBYTtRQUNiLG9CQUFvQjtRQUNwQixrQkFBa0I7UUFDbEIsbUJBQW1CO1FBQ25CLHVCQUF1QjtRQUN2QixZQUFZO1FBQ1osV0FBVztRQUNYLGdCQUFnQjtRQUNoQixpQkFBaUI7UUFDakIsaUJBQWlCO1FBQ2pCLFlBQVk7UUFDWixVQUFVO1FBQ1Ysa0JBQWtCO1FBQ2xCLG9CQUFvQjtRQUNwQixtQkFBbUI7UUFDbkIsa0JBQWtCLGFBOUNsQixZQUFZO1FBQ1osZUFBZTtRQUNmLGFBQWE7UUFDYixVQUFVO1FBQ1YsWUFBWTtRQUNaLGVBQWUsYUFHZixtQkFBbUI7UUFDbkIsV0FBVztRQUNYLGVBQWU7UUFDZixhQUFhO1FBQ2Isb0JBQW9CO1FBQ3BCLGtCQUFrQjtRQUNsQixtQkFBbUI7UUFDbkIsdUJBQXVCO1FBQ3ZCLFlBQVk7UUFDWixXQUFXO1FBQ1gsZ0JBQWdCO1FBQ2hCLGlCQUFpQjtRQUNqQixpQkFBaUI7UUFDakIsWUFBWTtRQUNaLFVBQVU7UUFDVixrQkFBa0I7UUFDbEIsb0JBQW9CO1FBQ3BCLG1CQUFtQjtRQUNuQixrQkFBa0I7aUhBd0JULG1CQUFtQixhQUZuQixDQUFDLGlCQUFpQixFQUFFLCtDQUErQyxDQUFDLFlBakR0RTtZQUNQLFlBQVk7WUFDWixlQUFlO1lBQ2YsYUFBYTtZQUNiLFVBQVU7WUFDVixZQUFZO1lBQ1osZUFBZTtTQUNoQixFQUVDLG1CQUFtQjsyRkEwQ1YsbUJBQW1CO2tCQXBEL0IsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUU7d0JBQ1AsWUFBWTt3QkFDWixlQUFlO3dCQUNmLGFBQWE7d0JBQ2IsVUFBVTt3QkFDVixZQUFZO3dCQUNaLGVBQWU7cUJBQ2hCO29CQUNELE9BQU8sRUFBRTt3QkFDUCxtQkFBbUI7d0JBQ25CLFdBQVc7d0JBQ1gsZUFBZTt3QkFDZixhQUFhO3dCQUNiLG9CQUFvQjt3QkFDcEIsa0JBQWtCO3dCQUNsQixtQkFBbUI7d0JBQ25CLHVCQUF1Qjt3QkFDdkIsWUFBWTt3QkFDWixXQUFXO3dCQUNYLGdCQUFnQjt3QkFDaEIsaUJBQWlCO3dCQUNqQixpQkFBaUI7d0JBQ2pCLFlBQVk7d0JBQ1osVUFBVTt3QkFDVixrQkFBa0I7d0JBQ2xCLG9CQUFvQjt3QkFDcEIsbUJBQW1CO3dCQUNuQixrQkFBa0I7cUJBQ25CO29CQUNELFlBQVksRUFBRTt3QkFDWixXQUFXO3dCQUNYLGVBQWU7d0JBQ2YsYUFBYTt3QkFDYixvQkFBb0I7d0JBQ3BCLGtCQUFrQjt3QkFDbEIsbUJBQW1CO3dCQUNuQix1QkFBdUI7d0JBQ3ZCLFlBQVk7d0JBQ1osV0FBVzt3QkFDWCxnQkFBZ0I7d0JBQ2hCLGlCQUFpQjt3QkFDakIsaUJBQWlCO3dCQUNqQixZQUFZO3dCQUNaLFVBQVU7d0JBQ1Ysa0JBQWtCO3dCQUNsQixvQkFBb0I7d0JBQ3BCLG1CQUFtQjt3QkFDbkIsa0JBQWtCO3FCQUNuQjtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSwrQ0FBK0MsQ0FBQztpQkFDaEYiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtBMTF5TW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge092ZXJsYXlNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7UG9ydGFsTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdEJ1dHRvbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvYnV0dG9uJztcbmltcG9ydCB7Q2RrU2Nyb2xsYWJsZU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01hdENhbGVuZGFyLCBNYXRDYWxlbmRhckhlYWRlcn0gZnJvbSAnLi9jYWxlbmRhcic7XG5pbXBvcnQge01hdENhbGVuZGFyQm9keX0gZnJvbSAnLi9jYWxlbmRhci1ib2R5JztcbmltcG9ydCB7TWF0RGF0ZXBpY2tlcn0gZnJvbSAnLi9kYXRlcGlja2VyJztcbmltcG9ydCB7XG4gIE1hdERhdGVwaWNrZXJDb250ZW50LFxuICBNQVRfREFURVBJQ0tFUl9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWV9QUk9WSURFUixcbn0gZnJvbSAnLi9kYXRlcGlja2VyLWJhc2UnO1xuaW1wb3J0IHtNYXREYXRlcGlja2VySW5wdXR9IGZyb20gJy4vZGF0ZXBpY2tlci1pbnB1dCc7XG5pbXBvcnQge01hdERhdGVwaWNrZXJJbnRsfSBmcm9tICcuL2RhdGVwaWNrZXItaW50bCc7XG5pbXBvcnQge01hdERhdGVwaWNrZXJUb2dnbGUsIE1hdERhdGVwaWNrZXJUb2dnbGVJY29ufSBmcm9tICcuL2RhdGVwaWNrZXItdG9nZ2xlJztcbmltcG9ydCB7TWF0TW9udGhWaWV3fSBmcm9tICcuL21vbnRoLXZpZXcnO1xuaW1wb3J0IHtNYXRNdWx0aVllYXJWaWV3fSBmcm9tICcuL211bHRpLXllYXItdmlldyc7XG5pbXBvcnQge01hdFllYXJWaWV3fSBmcm9tICcuL3llYXItdmlldyc7XG5pbXBvcnQge01hdERhdGVSYW5nZUlucHV0fSBmcm9tICcuL2RhdGUtcmFuZ2UtaW5wdXQnO1xuaW1wb3J0IHtNYXRTdGFydERhdGUsIE1hdEVuZERhdGV9IGZyb20gJy4vZGF0ZS1yYW5nZS1pbnB1dC1wYXJ0cyc7XG5pbXBvcnQge01hdERhdGVSYW5nZVBpY2tlcn0gZnJvbSAnLi9kYXRlLXJhbmdlLXBpY2tlcic7XG5pbXBvcnQge01hdERhdGVwaWNrZXJBY3Rpb25zLCBNYXREYXRlcGlja2VyQXBwbHksIE1hdERhdGVwaWNrZXJDYW5jZWx9IGZyb20gJy4vZGF0ZXBpY2tlci1hY3Rpb25zJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgICBNYXRCdXR0b25Nb2R1bGUsXG4gICAgT3ZlcmxheU1vZHVsZSxcbiAgICBBMTF5TW9kdWxlLFxuICAgIFBvcnRhbE1vZHVsZSxcbiAgICBNYXRDb21tb25Nb2R1bGUsXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBDZGtTY3JvbGxhYmxlTW9kdWxlLFxuICAgIE1hdENhbGVuZGFyLFxuICAgIE1hdENhbGVuZGFyQm9keSxcbiAgICBNYXREYXRlcGlja2VyLFxuICAgIE1hdERhdGVwaWNrZXJDb250ZW50LFxuICAgIE1hdERhdGVwaWNrZXJJbnB1dCxcbiAgICBNYXREYXRlcGlja2VyVG9nZ2xlLFxuICAgIE1hdERhdGVwaWNrZXJUb2dnbGVJY29uLFxuICAgIE1hdE1vbnRoVmlldyxcbiAgICBNYXRZZWFyVmlldyxcbiAgICBNYXRNdWx0aVllYXJWaWV3LFxuICAgIE1hdENhbGVuZGFySGVhZGVyLFxuICAgIE1hdERhdGVSYW5nZUlucHV0LFxuICAgIE1hdFN0YXJ0RGF0ZSxcbiAgICBNYXRFbmREYXRlLFxuICAgIE1hdERhdGVSYW5nZVBpY2tlcixcbiAgICBNYXREYXRlcGlja2VyQWN0aW9ucyxcbiAgICBNYXREYXRlcGlja2VyQ2FuY2VsLFxuICAgIE1hdERhdGVwaWNrZXJBcHBseSxcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgTWF0Q2FsZW5kYXIsXG4gICAgTWF0Q2FsZW5kYXJCb2R5LFxuICAgIE1hdERhdGVwaWNrZXIsXG4gICAgTWF0RGF0ZXBpY2tlckNvbnRlbnQsXG4gICAgTWF0RGF0ZXBpY2tlcklucHV0LFxuICAgIE1hdERhdGVwaWNrZXJUb2dnbGUsXG4gICAgTWF0RGF0ZXBpY2tlclRvZ2dsZUljb24sXG4gICAgTWF0TW9udGhWaWV3LFxuICAgIE1hdFllYXJWaWV3LFxuICAgIE1hdE11bHRpWWVhclZpZXcsXG4gICAgTWF0Q2FsZW5kYXJIZWFkZXIsXG4gICAgTWF0RGF0ZVJhbmdlSW5wdXQsXG4gICAgTWF0U3RhcnREYXRlLFxuICAgIE1hdEVuZERhdGUsXG4gICAgTWF0RGF0ZVJhbmdlUGlja2VyLFxuICAgIE1hdERhdGVwaWNrZXJBY3Rpb25zLFxuICAgIE1hdERhdGVwaWNrZXJDYW5jZWwsXG4gICAgTWF0RGF0ZXBpY2tlckFwcGx5LFxuICBdLFxuICBwcm92aWRlcnM6IFtNYXREYXRlcGlja2VySW50bCwgTUFUX0RBVEVQSUNLRVJfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUllfUFJPVklERVJdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXREYXRlcGlja2VyTW9kdWxlIHt9XG4iXX0=