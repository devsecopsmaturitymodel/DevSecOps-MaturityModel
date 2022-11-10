import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { ymlService } from 'src/app/service/yaml-parser/yaml-parser.service';

import { MappingComponent } from './mapping.component';

describe('MappingComponent', () => {
  let component: MappingComponent;
  let fixture: ComponentFixture<MappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [ymlService, HttpClient, HttpHandler],
      declarations: [MappingComponent, MatAutocomplete],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check for table generation', () => {
    const HTMLElement: HTMLElement = fixture.nativeElement;
    const table = HTMLElement.querySelector('table')!;
    expect(table).toBeTruthy();
  });

  it('check for chip deletion', () => {
    component.currentChip = ['row1', 'row2'];
    component.removeChip('row1');
    const newChipRow = ['row2'];
    fixture.detectChanges();
    expect(component.currentChip).toEqual(newChipRow);
  });
});
