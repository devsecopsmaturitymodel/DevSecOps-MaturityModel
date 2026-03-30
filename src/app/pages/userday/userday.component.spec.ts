import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserdayComponent } from './userday.component';

describe('UserdayComponent', () => {
  let component: UserdayComponent;
  let fixture: ComponentFixture<UserdayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserdayComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserdayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
