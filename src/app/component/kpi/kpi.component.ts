import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi',
  templateUrl: './kpi.component.html',
  styleUrls: ['./kpi.component.css'],
})
export class KpiComponent {
  @Input() title: string = '';
  @Input() value: number | string | undefined = '';
  @Input() suffix: string = '';
  @Input() subtitle: string = '';
}
