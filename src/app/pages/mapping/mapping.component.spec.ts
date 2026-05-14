import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyAutocomplete as MatAutocomplete } from '@angular/material/legacy-autocomplete';

import { MappingComponent } from './mapping.component';
import { ModalMessageComponent } from 'src/app/component/modal-message/modal-message.component';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

describe('MappingComponent', () => {
  let component: MappingComponent;
  let fixture: ComponentFixture<MappingComponent>;

  beforeEach(async () => {
    /* eslint-disable */
    await TestBed.configureTestingModule({
      declarations: [MappingComponent, MatAutocomplete],
      imports: [MatDialogModule],
      providers: [HttpClient,
        HttpHandler,
        { provide: ModalMessageComponent, useValue: {} },
      ],
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
