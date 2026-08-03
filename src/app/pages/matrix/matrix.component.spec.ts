import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MatrixComponent, MatrixRow } from './matrix.component';
import { MatChipListboxChange } from '@angular/material/chips';
import { ModalMessageComponent } from '../../component/modal-message/modal-message.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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

function createChipListboxChangeEvent(selectedValues: string[]): MatChipListboxChange {
  return {
    source: {} as any,
    value: selectedValues,
  };
}

describe('MatrixComponent', () => {
  let component: MatrixComponent;
  let fixture: ComponentFixture<MatrixComponent>;

  beforeEach(async () => {
    mockLoaderService = new MockLoaderService(MOCK_DATA);
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, MatrixComponent],
      providers: [
        provideRouter([]),
        provideHttpClientTesting(),
        { provide: LoaderService, useValue: mockLoaderService },
        { provide: MatDialogRef, useValue: {} },
        { provide: ModalMessageComponent, useValue: {} },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
      ],
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
    expect(component.MATRIX_DATA()).toBeTruthy();
    expect(component.MATRIX_DATA().length).toBeGreaterThan(0);
    expect(component.MATRIX_DATA()[0].Category).toBe('Test Category');
    expect(component.MATRIX_DATA()[0].Dimension).toBe('Test Dimension');
    expect(component.MATRIX_DATA()[0].level1.length).toBe(2);

    // Verify filters were initialized
    expect(Object.keys(component.filtersTag())).toContain('tag1');
    expect(Object.keys(component.filtersDim())).toContain('Test Dimension');
  });

  it('should filter data when tag filter is selected', () => {
    expect(component.dataSource().length).toBe(2);
    expect(component.dataSource()[0].level1.length).toBe(2);

    // Toggle tag filter on
    console.log('Turn chip filter on');
    component.toggleTagFilters(createChipListboxChangeEvent(['tag1']));
    expect(component.filtersTag()['tag1']).toBeTrue();
    expect(component.dataSource().length).toBe(1);
    expect(component.dataSource()[0].level1.length).toBe(1);

    // Toggle tag filter off again
    console.log('Turn chip filter off');
    component.toggleTagFilters(createChipListboxChangeEvent([]));
    expect(component.filtersTag()['tag1']).toBeFalse();
    expect(component.dataSource().length).toBe(2);
    expect(component.dataSource()[0].level1.length).toBe(2);
  });
});
