import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SidenavButtonsComponent } from './sidenav-buttons.component';

describe('SidenavButtonsComponent', () => {
  let component: SidenavButtonsComponent;
  let fixture: ComponentFixture<SidenavButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidenavButtonsComponent, RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
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
    const NavigationLinks = HTMLElement.querySelectorAll('mat-nav-list a')!;
    const NavigationNamesBeingShown = Array.from(NavigationLinks)
      .map(link => link.textContent?.trim())
      .filter((label): label is string => Boolean(label) && label !== 'GitHub');

    expect(NavigationNamesBeingShown).toHaveLength(component.Options.length);
    NavigationNamesBeingShown.forEach((label, index) => {
      expect(label).toContain(component.Options[index]);
    });
  });

  it('ensure all navigation options has its own icon and route', () => {
    expect(component.Icons.length).toEqual(component.Options.length);
    expect(component.Routing.length).toEqual(component.Options.length);
  });
});
