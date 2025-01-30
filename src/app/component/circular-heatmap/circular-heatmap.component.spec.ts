import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ymlService } from 'src/app/service/yaml-parser/yaml-parser.service';
import { CircularHeatmapComponent } from './circular-heatmap.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatChip } from '@angular/material/chips';
import { ModalMessageComponent } from '../modal-message/modal-message.component';

describe('CircularHeatmapComponent', () => {
  let component: CircularHeatmapComponent;
  let fixture: ComponentFixture<CircularHeatmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CircularHeatmapComponent, MatChip],
      imports: [RouterTestingModule],
      providers: [
        ymlService,
        HttpClient,
        HttpHandler,
        { provide: ModalMessageComponent, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CircularHeatmapComponent); // Create fixture and component here
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
