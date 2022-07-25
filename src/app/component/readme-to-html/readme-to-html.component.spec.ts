import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadmeToHtmlComponent } from './readme-to-html.component';

describe('ReadmeToHtmlComponent', () => {
  let component: ReadmeToHtmlComponent;
  let fixture: ComponentFixture<ReadmeToHtmlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadmeToHtmlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadmeToHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
