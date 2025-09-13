import { Component, OnInit } from '@angular/core';
import { ThemeService } from './service/theme.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'DSOMM';
  subtitle = '';
  menuIsOpen: boolean = true;

  constructor(private themeService: ThemeService) {
    this.themeService.initTheme();
  }

  ngOnInit(): void {
    let menuState: string | null = localStorage.getItem('state.menuIsOpen');
    if (menuState === 'false') {
      setTimeout(() => {
        this.menuIsOpen = false;
      }, 600);
    }

    if (environment?.production === false) {
      fetch(
        'https://api.github.com/repos/devsecopsmaturitymodel/DevSecOps-MaturityModel/branches/v4'
      ).then(async response => {
        let gitinfo: any = await response.json();
        let commitDate: string = gitinfo?.commit?.commit?.author?.date;
        if (commitDate) {
          this.subtitle = `Released: ${commitDate?.replace('T', ' ')}`;
        }
      });
    }
  }

  toggleMenu(): void {
    this.menuIsOpen = !this.menuIsOpen;
    localStorage.setItem('state.menuIsOpen', this.menuIsOpen.toString());
  }
}
