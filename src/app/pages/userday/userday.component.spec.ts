import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UserdayComponent } from './userday.component';

describe('UserdayComponent', () => {
  let component: UserdayComponent;
  let fixture: ComponentFixture<UserdayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserdayComponent, HttpClientTestingModule],
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
