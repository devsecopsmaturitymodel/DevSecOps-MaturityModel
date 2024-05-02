import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

const DEFAULT_TITLE = 'DSOMM';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title: string = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map(route => {
          let childRoute = route;
          while (childRoute.firstChild) childRoute = childRoute.firstChild;
          return childRoute;
        }),
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data)
      )
      .subscribe((event: { [x: string]: string }) => {
        const title = event['title'] || DEFAULT_TITLE; // Default title if not provided
        this.updateTitle(title);
      });
  }

  updateTitle(newTitle: string) {
    this.titleService.setTitle(`DSOMM - ${newTitle}`);
  }
}
