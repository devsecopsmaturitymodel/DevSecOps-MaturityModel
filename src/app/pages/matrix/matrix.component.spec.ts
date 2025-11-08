import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatrixComponent, MatrixRow } from './matrix.component';
import { MatChip } from '@angular/material/chips';
import { ModalMessageComponent } from '../../component/modal-message/modal-message.component';
import { MatDialogRef } from '@angular/material/dialog';
import { LoaderService } from 'src/app/service/loader/data-loader.service';
import { MockLoaderService } from 'src/app/service/loader/mock-data-loader.service';

// Setup test data
const MOCK_DATA: any = {
  'Test Category': {
    'Test Dimension': {
      'Activity 1': { uuid: '1', level: 1, tags: ['tag1', 'tag2'] },
      'Activity 2': { uuid: '2', level: 1, tags: ['tag2', 'tag3'] },
    },
  },
  'Test Category 2': {
    'Test Dimension 2': {
      'Activity Other': { uuid: '3', level: 1, tags: [] },
    },
  },
};
let mockLoaderService: MockLoaderService;

describe('MatrixComponent', () => {
  let component: MatrixComponent;
  let fixture: ComponentFixture<MatrixComponent>;

  beforeEach(async () => {
    mockLoaderService = new MockLoaderService(MOCK_DATA);
    await TestBed.configureTestingModule({
      providers: [
        HttpClientTestingModule,
        { provide: LoaderService, useValue: mockLoaderService },
        { provide: MatDialogRef, useValue: {} },
        { provide: ModalMessageComponent, useValue: {} },
      ],
      imports: [RouterTestingModule, HttpClientModule],
      declarations: [MatrixComponent, MatChip],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(MatrixComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build matrix data', () => {
    // Verify the data was loaded
    expect(component.MATRIX_DATA).toBeTruthy();
    expect(component.MATRIX_DATA.length).toBeGreaterThan(0);
    expect(component.MATRIX_DATA[0].Category).toBe('Test Category');
    expect(component.MATRIX_DATA[0].Dimension).toBe('Test Dimension');
    expect(component.MATRIX_DATA[0].level1.length).toBe(2);

    // Verify filters were initialized
    expect(Object.keys(component.filtersTag)).toContain('tag1');
    expect(Object.keys(component.filtersDim)).toContain('Test Dimension');
  });

  it('should filter data when tag filter is selected', () => {
    expect(component.dataSource.data.length).toBe(2);
    expect(component.dataSource.data[0].level1.length).toBe(2);

    // Create a mock MatChip with proper state tracking
    const mockChip = {
      value: 'tag1',
      selected: false,
      toggleSelected: function () {
        this.selected = !this.selected;
      },
    } as MatChip;

    // Ensure initial state
    mockChip.selected = false;

    // Toggle tag filter on
    console.log('Turn chip filter on');
    component.toggleTagFilters(mockChip);
    // console.log('data after "on":', component.dataSource.data);
    expect(component.filtersTag['tag1']).toBeTrue();
    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0].level1.length).toBe(1);

    // Toggle tag filter off again
    console.log('Turn chip filter off');
    component.toggleTagFilters(mockChip);
    // console.log('data after "off": ', component.dataSource.data);
    expect(component.filtersTag['tag1']).toBeFalse();
    expect(component.dataSource.data.length).toBe(2);
    expect(component.dataSource.data[0].level1.length).toBe(2);
  });
});
