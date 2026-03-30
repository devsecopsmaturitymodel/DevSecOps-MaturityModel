import { HttpClient, HttpHandler } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { LoaderService } from 'src/app/service/loader/data-loader.service';
import { CircularHeatmapComponent } from './circular-heatmap.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalMessageComponent } from '../../component/modal-message/modal-message.component';
import { MatDialogModule } from '@angular/material/dialog';

describe('CircularHeatmapComponent', () => {
  let component: CircularHeatmapComponent;
  let fixture: ComponentFixture<CircularHeatmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CircularHeatmapComponent],
      imports: [RouterTestingModule, MatDialogModule],
      providers: [
        LoaderService,
        HttpClient,
        HttpHandler,
        {
          provide: ModalMessageComponent,
          useValue: {
            openDialog: vi.fn(() => ({ afterClosed: () => of('Cancel') })),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CircularHeatmapComponent); // Create fixture and component here
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
