import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavButtonsComponent } from './sidenav-buttons.component';

describe('SidenavButtonsComponent', () => {
  let component: SidenavButtonsComponent;
  let fixture: ComponentFixture<SidenavButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidenavButtonsComponent],
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
    const NavigationList = HTMLElement.querySelectorAll('a > h3')!;
    let NavigationNamesBeingShown = [];
    for (var x = 0; x < NavigationList.length; x += 1) {
      NavigationNamesBeingShown.push(NavigationList[x].textContent);
    }
    //console.log({ ...NavigationNamesBeingShown });
    //console.log(component.Options);
    expect(NavigationNamesBeingShown).toEqual(component.Options);
  });

  it('ensure all navigation options has its own icon and route', () => {
    expect(component.Icons.length).toEqual(component.Options.length);
    expect(component.Routing.length).toEqual(component.Options.length);
  });
});
