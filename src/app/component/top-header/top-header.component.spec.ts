import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopHeaderComponent } from './top-header.component';

describe('TopHeaderComponent', () => {
  let component: TopHeaderComponent;
  let fixture: ComponentFixture<TopHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopHeaderComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check if header is being generated', () => {
    const HTMLElement: HTMLElement = fixture.nativeElement;
    const heading = HTMLElement.querySelector('h1')!;
    expect(heading.textContent).toEqual('Default');
  });

  it('check if header is being changed', async () => {
    const changedTextElement = 'changed';
    fixture.componentRef.setInput('section', changedTextElement);
    await fixture.whenStable();
    fixture.detectChanges();
    const HTMLElement: HTMLElement = fixture.nativeElement;
    const heading = HTMLElement.querySelector('h1')!;
    expect(heading.textContent).toEqual('changed');
  });
});
