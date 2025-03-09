import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], // This is for component-specific styles.
})
export class AppComponent implements OnInit {
  title = 'DSOMM';
  isNightMode = false;
  menuIsOpen: boolean = true;

  ngOnInit(): void {
    // Load menu state
    let menuState: string | null = localStorage.getItem('state.menuIsOpen');

    if (menuState === 'false') {
      setTimeout(() => {
        this.menuIsOpen = false;
      }, 600);
    }

    // Load night mode state
    let nightModeState: string | null =
      localStorage.getItem('state.isNightMode');

    if (nightModeState === 'true') {
      this.isNightMode = true;
      document.body.classList.add('night-mode');
    }
  }

  toggleTheme(): void {
    this.isNightMode = !this.isNightMode;
    if (this.isNightMode) {
      document.body.classList.add('night-mode');
    } else {
      document.body.classList.remove('night-mode');
    }
    localStorage.setItem('state.isNightMode', this.isNightMode.toString());
  }

  toggleMenu(): void {
    this.menuIsOpen = !this.menuIsOpen;
    localStorage.setItem('state.menuIsOpen', this.menuIsOpen.toString());
  }
}
