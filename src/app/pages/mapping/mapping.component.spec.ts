import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAutocomplete } from '@angular/material/autocomplete';

import { MappingComponent } from './mapping.component';
import { ModalMessageComponent } from 'src/app/component/modal-message/modal-message.component';

describe('MappingComponent', () => {
  let component: MappingComponent;
  let fixture: ComponentFixture<MappingComponent>;

  beforeEach(async () => {
    /* eslint-disable */
    await TestBed.configureTestingModule({
      providers: [HttpClient,
        HttpHandler,
        { provide: ModalMessageComponent, useValue: {} },
      ],
      declarations: [MappingComponent, MatAutocomplete],
    }).compileComponents();
    /* eslint-enable */
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
});
