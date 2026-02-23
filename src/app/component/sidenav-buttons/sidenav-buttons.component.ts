import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { GITHUB_SVG } from '../../../assets/svg_icons';
import { ThemeService } from '../../service/theme.service';

@Component({
  selector: 'app-sidenav-buttons',
  templateUrl: './sidenav-buttons.component.html',
  styleUrls: ['./sidenav-buttons.component.css'],
})
export class SidenavButtonsComponent implements OnInit {
  Options: string[] = [
    'Overview',
    'Matrix',
    'Mappings',
    'Teams',
    'Report',
    'Settings',
    'Usage',
    'Roadmap',
    'DSOMM User Day',
    'About Us',
  ];
  Icons: string[] = [
    'pie_chart',
    'table_chart',
    'timeline',
    'people',
    'summarize',
    'list',
    'description',
    'landscape',
    'school',
    'info',
  ];
  Routing: string[] = [
    '/circular-heatmap',
    '/matrix',
    '/mapping',
    '/teams',
    '/report',
    '/settings',
    '/usage',
    '/roadmap',
    '/userday',
    '/about',
  ];

  isNightMode = false;

  constructor(
    private themeService: ThemeService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.iconRegistry.addSvgIconLiteral(
      'github',
      this.sanitizer.bypassSecurityTrustHtml(GITHUB_SVG)
    );
  }

  ngOnInit(): void {
    const currentTheme = this.themeService.getTheme();
    this.isNightMode = currentTheme === 'dark';
  }

  toggleTheme(): void {
    this.isNightMode = !this.isNightMode;
    const newTheme = this.isNightMode ? 'dark' : 'light';
    this.themeService.setTheme(newTheme);
  }
}
