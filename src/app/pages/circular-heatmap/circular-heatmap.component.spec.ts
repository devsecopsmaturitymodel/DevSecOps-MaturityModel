import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoaderService } from 'src/app/service/loader/data-loader.service';
import { CircularHeatmapComponent } from './circular-heatmap.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatChip } from '@angular/material/chips';
import { ModalMessageComponent } from '../../component/modal-message/modal-message.component';
import { MatDialogModule } from '@angular/material/dialog';

describe('CircularHeatmapComponent', () => {
  let component: CircularHeatmapComponent;
  let fixture: ComponentFixture<CircularHeatmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CircularHeatmapComponent, MatChip],
      imports: [RouterTestingModule, MatDialogModule],
      providers: [
        LoaderService,
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
