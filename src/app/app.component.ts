import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']  // This is for component-specific styles.
})
export class AppComponent {
  title = 'DSOMM';
  isNightMode = false;

  toggleTheme() {
    this.isNightMode = !this.isNightMode;
    if (this.isNightMode) {
      document.body.classList.add('night-mode');
    } else {
      document.body.classList.remove('night-mode');
    }
  }
}
