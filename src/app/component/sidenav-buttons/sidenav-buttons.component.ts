import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatIconRegistry, MatIconModule } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { GITHUB_SVG } from '../../../assets/svg_icons';
import { ThemeService } from '../../service/theme.service';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';

import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-sidenav-buttons',
  templateUrl: './sidenav-buttons.component.html',
  styleUrls: ['./sidenav-buttons.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatListModule, RouterLink, MatIconModule, MatDividerModule],
})
export class SidenavButtonsComponent {
  private themeService = inject(ThemeService);
  private iconRegistry = inject(MatIconRegistry);
  private sanitizer = inject(DomSanitizer);

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

  isNightMode = computed(() => this.themeService.theme() === 'dark');

  constructor() {
    this.iconRegistry.addSvgIconLiteral(
      'github',
      this.sanitizer.bypassSecurityTrustHtml(GITHUB_SVG)
    );
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
