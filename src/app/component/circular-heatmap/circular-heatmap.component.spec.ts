import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircularHeatmapComponent } from './circular-heatmap.component';

describe('CircularHeatmapComponent', () => {
  let component: CircularHeatmapComponent;
  let fixture: ComponentFixture<CircularHeatmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CircularHeatmapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CircularHeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
