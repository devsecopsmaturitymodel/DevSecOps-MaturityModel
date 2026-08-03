import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
})
export class LogoComponent {
  constructor() {}
}
