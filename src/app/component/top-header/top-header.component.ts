import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-top-header',
  templateUrl: './top-header.component.html',
  styleUrls: ['./top-header.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
})
export class TopHeaderComponent {
  @Input() section: string = 'Default';

  constructor() {}
}
