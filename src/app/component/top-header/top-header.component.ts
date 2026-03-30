import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-top-header',
  templateUrl: './top-header.component.html',
  styleUrls: ['./top-header.component.css'],
})
export class TopHeaderComponent {
  @Input() section: string = 'Default';

  constructor() {}
}
