import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ymlService } from 'src/app/service/yaml-parser/yaml-parser.service';
import { CircularHeatmapComponent } from './circular-heatmap.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatChip } from '@angular/material/chips';

describe('CircularHeatmapComponent', () => {
  let component: CircularHeatmapComponent;
  let fixture: ComponentFixture<CircularHeatmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [ymlService, HttpClient, HttpHandler],
      imports: [RouterTestingModule],
      declarations: [CircularHeatmapComponent],
    }).compileComponents();
  });
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [MatChip],
    }).compileComponents();
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
