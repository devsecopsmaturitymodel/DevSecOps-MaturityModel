import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Teams } from './teams.component';

describe('Teams', () => {
  let component: Teams;
  let fixture: ComponentFixture<Teams>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Teams],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Teams);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
