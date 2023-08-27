import { HttpClientModule, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { MatAutocomplete } from '@angular/material/autocomplete';
import { RouterTestingModule } from '@angular/router/testing';
import { ymlService } from 'src/app/service/yaml-parser/yaml-parser.service';
import { MatChip } from '@angular/material/chips';

import { Teams } from './teams.component';

describe('Teams', () => {
  let component: Teams;
  let fixture: ComponentFixture<Teams>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [ymlService, HttpClientTestingModule],
      imports: [RouterTestingModule, HttpClientModule],
      declarations: [Teams, MatChip],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Teams);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
