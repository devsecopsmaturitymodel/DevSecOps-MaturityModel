import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SettingsComponent } from './settings.component';
import { SettingsService } from '../../service/settings/settings.service';
import { LoaderService } from '../../service/loader/data-loader.service';
import { MockLoaderService } from '../../service/loader/mock-data-loader.service';
import { Data } from 'src/app/model/activity-store';
import { ModalMessageComponent } from 'src/app/component/modal-message/modal-message.component';

let mockLoaderService: MockLoaderService;
const MOCK_DATA = {
  'Build and Deployment': {
    'Deployment Process': {
      'Automated Deployment': {
        uuid: 'test-uuid-1',
        level: 5,
        name: 'Automated Deployment',
      },
    },
  },
};

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let settingsService: jasmine.SpyObj<SettingsService>;
  let modalComponent: jasmine.SpyObj<ModalMessageComponent>;
  mockLoaderService = new MockLoaderService(MOCK_DATA as unknown as Data);

  beforeEach(async () => {
    await mockLoaderService.load();
    settingsService = jasmine.createSpyObj('SettingsService', [
      'getMaxLevel',
      'setMaxLevel',
      'getDateFormat',
      'setDateFormat',
    ]);
    modalComponent = jasmine.createSpyObj('ModalMessageComponent', ['openDialog']);

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatSliderModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
      ],
      declarations: [SettingsComponent],
      providers: [
        HttpClient,
        HttpHandler,
        { provide: SettingsService, useValue: settingsService },
        { provide: LoaderService, useValue: mockLoaderService },
        { provide: ModalMessageComponent, useValue: modalComponent },
      ],
    }).compileComponents();
  });

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
  }));

  it('should create', fakeAsync(() => {
    expect(component).toBeTruthy();
  }));

  it('should update max level settings correctly', fakeAsync(() => {
    component.onMaxLevelChange(3);

    expect(component.selectedMaxLevel).toBe(3);
    expect(settingsService.setMaxLevel).toHaveBeenCalledWith(3);
  }));

  it('should handle max level reset to default', fakeAsync(() => {
    component.onMaxLevelChange(5);

    expect(component.selectedMaxLevel).toBe(5);

    // Remove localStorage when settings' maxLevel is set to activity's maxLevel
    expect(settingsService.setMaxLevel).toHaveBeenCalledWith(null);
  }));
});
