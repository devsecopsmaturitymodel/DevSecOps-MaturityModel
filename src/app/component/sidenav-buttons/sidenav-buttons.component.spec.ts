import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SidenavButtonsComponent } from './sidenav-buttons.component';
import { ThemeService } from '../../service/theme.service';

class MockThemeService {
  theme = signal<string>('light');
  initTheme() {}
  getTheme() {
    return this.theme();
  }
  setTheme(theme: string) {
    this.theme.set(theme);
  }
  toggleTheme() {
    this.theme.set(this.theme() === 'light' ? 'dark' : 'light');
  }
}

describe('SidenavButtonsComponent', () => {
  let component: SidenavButtonsComponent;
  let fixture: ComponentFixture<SidenavButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidenavButtonsComponent, HttpClientTestingModule],
      providers: [provideRouter([]), { provide: ThemeService, useClass: MockThemeService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check for navigation list generation', () => {
    const HTMLElement: HTMLElement = fixture.nativeElement;
    const NavigationList = HTMLElement.querySelector('mat-nav-list')!;
    //console.log(NavigationList);
    expect(NavigationList).toBeTruthy();
  });

  it('check for navigation names being shown in the same order as options array', () => {
    const HTMLElement: HTMLElement = fixture.nativeElement;
    const NavigationList = HTMLElement.querySelectorAll('a h3')!;
    let NavigationNamesBeingShown = [];
    for (var x = 0; x < NavigationList.length; x += 1) {
      NavigationNamesBeingShown.push(NavigationList[x].textContent);
    }
    NavigationNamesBeingShown.pop(); // Remove GitHub link
    expect(NavigationNamesBeingShown).toEqual(component.Options);
  });

  it('ensure all navigation options has its own icon and route', () => {
    expect(component.Icons.length).toEqual(component.Options.length);
    expect(component.Routing.length).toEqual(component.Options.length);
  });
});
