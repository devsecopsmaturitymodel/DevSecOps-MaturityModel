import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { UserdayComponent } from './userday.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('UserdayComponent', () => {
  let component: UserdayComponent;
  let fixture: ComponentFixture<UserdayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserdayComponent],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
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
