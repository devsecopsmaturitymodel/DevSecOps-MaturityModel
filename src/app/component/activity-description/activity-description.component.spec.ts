import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { sample } from 'rxjs';
import { ymlService } from 'src/app/service/yaml-parser/yaml-parser.service';

import { ActivityDescriptionComponent } from './activity-description.component';

describe('ActivityDescriptionComponent', () => {
  let component: ActivityDescriptionComponent;
  let fixture: ComponentFixture<ActivityDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [ymlService, HttpClient, HttpHandler],
      imports: [RouterTestingModule],
      declarations: [ActivityDescriptionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check if header is being genenrated', () => {
    const testDimension = 'Sample Dimension';
    const testSubDimension = 'Sample subDimension';
    component.currentActivity.dimension = testDimension;
    component.currentActivity.subDimension = testSubDimension;
    fixture.detectChanges();
    const HTMLElement: HTMLElement = fixture.nativeElement;
    const heading = HTMLElement.querySelector('h1')!;
    expect(heading.textContent).toContain(testDimension);
    expect(heading.textContent).toContain(testSubDimension);
  });

  it('check if UUID is being genenrated', () => {
    const testUUID = '00000000-0000-0000-0000-000000000000';
    component.currentActivity.uuid = testUUID;
    fixture.detectChanges();
    const HTMLElement: HTMLElement = fixture.nativeElement;
    const contentDisplayedinParagraphTag = HTMLElement.querySelectorAll('p')!;
    expect(contentDisplayedinParagraphTag[0].textContent).toContain(testUUID);
  });

  it('check if description is being genenrated', () => {
    const testDescription = 'Sample Description';
    component.currentActivity.description = testDescription;
    fixture.detectChanges();
    const HTMLElement: HTMLElement = fixture.nativeElement;
    const contentDisplayedinParagraphTag = HTMLElement.querySelectorAll('p')!;
    expect(contentDisplayedinParagraphTag[1].textContent).toContain(
      testDescription
    );
  });

  it('check if risk is being genenrated', () => {
    const testRisk = 'Sample Risk';
    component.currentActivity.risk = testRisk;
    fixture.detectChanges();
    const HTMLElement: HTMLElement = fixture.nativeElement;
    const contentDisplayedinParagraphTag = HTMLElement.querySelectorAll('p')!;
    expect(contentDisplayedinParagraphTag[2].textContent).toContain(testRisk);
  });

  it('check if measure is being genenrated', () => {
    const testMeasure = 'Sample Measure';
    component.currentActivity.measure = testMeasure;
    fixture.detectChanges();
    const HTMLElement: HTMLElement = fixture.nativeElement;
    const contentDisplayedinParagraphTag = HTMLElement.querySelectorAll('p')!;
    expect(contentDisplayedinParagraphTag[3].textContent).toContain(
      testMeasure
    );
  });

  it('check if implementation guide is being genenrated', () => {
    const testImplementationGuide = 'Sample Implementation Guide';
    component.currentActivity.implementatonGuide = testImplementationGuide;
    fixture.detectChanges();
    const HTMLElement: HTMLElement = fixture.nativeElement;
    const contentDisplayedinParagraphTag = HTMLElement.querySelectorAll('p')!;
    expect(contentDisplayedinParagraphTag[4].textContent).toContain(
      testImplementationGuide
    );
  });

  it('check if evidence is being genenrated', () => {
    const testEvidence = 'Sample Evidence';
    component.currentActivity.evidence = testEvidence;
    fixture.detectChanges();
    const HTMLElement: HTMLElement = fixture.nativeElement;
    const contentDisplayedinParagraphTag = HTMLElement.querySelectorAll('p')!;
    expect(contentDisplayedinParagraphTag[7].textContent).toContain(
      testEvidence
    );
  });

  it('check if assessment is being genenrated', () => {
    const testAssessment = 'Sample Assessment';
    component.currentActivity.assessment = testAssessment;
    fixture.detectChanges();
    const HTMLElement: HTMLElement = fixture.nativeElement;
    const contentDisplayedinParagraphTag = HTMLElement.querySelectorAll('p')!;
    expect(contentDisplayedinParagraphTag[8].textContent).toContain(
      testAssessment
    );
  });

  it('check if comments is being genenrated', () => {
    const testComments = 'Sample Comments';
    component.currentActivity.comments = testComments;
    fixture.detectChanges();
    const HTMLElement: HTMLElement = fixture.nativeElement;
    const contentDisplayedinParagraphTag = HTMLElement.querySelectorAll('p')!;
    expect(contentDisplayedinParagraphTag[11].textContent).toContain(
      testComments
    );
  });

  it('check if references is being genenrated', () => {
    const testSAMM = [' Sample SAMM '];
    const testISO = [' Sample ISO'];
    const testISO22 = [' Sample ISO22'];
    component.currentActivity.samm = testSAMM;
    component.currentActivity.iso = testISO;
    component.currentActivity.iso22 = testISO22;
    fixture.detectChanges();
    const HTMLElement: HTMLElement = fixture.nativeElement;
    const contentDisplayedinParagraphTag = HTMLElement.querySelectorAll('p')!;
    expect(contentDisplayedinParagraphTag[10].textContent).toContain(
      component.SAMMVersion +
        testSAMM[0] +
        component.ISOVersion +
        testISO[0] +
        component.ISO22Version +
        testISO22[0]
    );
  });
});
