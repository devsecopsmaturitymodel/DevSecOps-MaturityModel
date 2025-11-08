import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageComponent } from './usage.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('UsageComponent', () => {
  let component: UsageComponent;
  let fixture: ComponentFixture<UsageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsageComponent],
    }).compileComponents();
  });

  it('should create', () => {
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: { params: of({}) },
    });

    fixture = TestBed.createComponent(UsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.page).toBe('USAGE');
  });

  it('should load page', () => {
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: { params: of({ page: 'test-page' }) },
    });

    fixture = TestBed.createComponent(UsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.page).toBe('test-page');
  });
});
