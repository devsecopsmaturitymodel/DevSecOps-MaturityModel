import { HttpClientModule, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { RouterTestingModule } from '@angular/router/testing';
import { ymlService } from 'src/app/service/yaml-parser/yaml-parser.service';
import { MatrixComponent } from './matrix.component';

describe('MatrixComponent', () => {
  let component: MatrixComponent;
  let fixture: ComponentFixture<MatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [ymlService, HttpClientTestingModule],
      imports: [RouterTestingModule, HttpClientModule],
      declarations: [MatrixComponent, MatAutocomplete],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('check for table generation', () => {
    const HTMLElement: HTMLElement = fixture.nativeElement;
    const table = HTMLElement.querySelector('table')!;
    expect(table).toBeTruthy();
  });

  it('check for chip deletion', () => {
    component.rowsCurrentlyBeingShown = ['row1', 'row2'];
    component.removeSubDimension('row1');
    component.tasksCurrentlyBeingShown = ['row1', 'row2'];
    component.removeTask('row1');
    const newChipRow = ['row2'];
    fixture.detectChanges();
    expect(component.rowsCurrentlyBeingShown).toEqual(newChipRow);
    expect(component.tasksCurrentlyBeingShown).toEqual(newChipRow);
  });
});
