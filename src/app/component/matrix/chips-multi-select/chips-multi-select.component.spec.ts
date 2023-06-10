import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipsMultiSelectComponent } from './chips-multi-select.component';

describe('ChipsMultiSelectComponent', () => {
  let component: ChipsMultiSelectComponent;
  let fixture: ComponentFixture<ChipsMultiSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChipsMultiSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipsMultiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
