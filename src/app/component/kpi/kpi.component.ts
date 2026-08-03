import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-kpi',
  templateUrl: './kpi.component.html',
  styleUrls: ['./kpi.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
})
export class KpiComponent {
  @Input() title: string = '';
  @Input() value: number | string | undefined = '';
  @Input() suffix: string = '';
  @Input() subtitle: string = '';
}
