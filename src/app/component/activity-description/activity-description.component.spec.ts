import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivityDescriptionComponent } from './activity-description.component';
import { LoaderService } from 'src/app/service/loader/data-loader.service';
import { MockLoaderService } from 'src/app/service/loader/mock-data-loader.service';
import { MarkdownText } from 'src/app/model/markdown-text';
import { Data } from 'src/app/model/activity-store';
import { isEmptyObj } from 'src/app/util/util';

let mockLoaderService: MockLoaderService;
let mockActivatedRoute = {
  snapshot: {
    queryParams: { uuid: '00000000-1111-1111-1111-0000000000000' },
  },
};
let mockData = {
  'Dim 1': {
    'SubDim 1.1': {
      'Activity 111': {
        uuid: '00000000-1111-1111-1111-0000000000000',
        level: 1,
        description: new MarkdownText('Description 111'),
        difficultyOfImplementation: { time: 1, knowledge: 1, resources: 1 },
        usefulness: 1,
        references: {
          openCRE: ['OpenCRE 1.1'],
          samm2: ['SAMM 1.1'],
          iso27001_2017: ['ISO 17 1.1'],
          iso27001_2022: ['ISO 22 1.1'],
        },
        risk: new MarkdownText('Risk 111'),
        measure: new MarkdownText('Measure 111'),
        implementationGuide: new MarkdownText('Implementation Guide 111'),
        teamsEvidence: { Default: 'Evidence 111' },
        assessment: new MarkdownText('Assessment 111'),
        comments: new MarkdownText('Comments 111'),
      },
    },
  },
};

describe('ActivityDescriptionComponent', () => {
  let component: ActivityDescriptionComponent;
  let fixture: ComponentFixture<ActivityDescriptionComponent>;
  mockLoaderService = new MockLoaderService(mockData as unknown as Data);

  beforeEach(async () => {
    await mockLoaderService.load();
    await TestBed.configureTestingModule({
      providers: [
        HttpClient,
        HttpHandler,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: LoaderService, useValue: mockLoaderService },
      ],
      imports: [RouterTestingModule],
      declarations: [ActivityDescriptionComponent],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(ActivityDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load activity', () => {
    expect(isEmptyObj(component.currentActivity)).toBeFalsy();
  });

  it('check if header is being generated', () => {
    const testDimension = 'Dim 1';
    const testSubDimension = 'SubDim 1.1';

    fixture.detectChanges();
    const HTMLElement: HTMLElement = fixture.nativeElement;
    const heading = HTMLElement.querySelector('h1')!;

    expect(heading?.textContent).toContain(testDimension);
    expect(heading?.textContent).toContain(testSubDimension);
  });

  it('check if content is displayed', () => {
    // console.log(`${perfNow()}: ActivityDescription: "check if content is displayed"`);
    const testUUID = '00000000-1111-1111-1111-0000000000000';
    const testDesc = 'Description 111';
    const testRisk = 'Risk 111';
    const testMeasure = 'Measure 111';
    const testAssessment = 'Assessment 111';
    const testComments = 'Comments 111';
    const testImplementationGuide = 'Implementation Guide 111';

    fixture.detectChanges();
    const HTMLElement: HTMLElement = fixture.nativeElement;

    expect(HTMLElement.querySelector('#uuid')?.textContent).toContain(testUUID);
    expect(HTMLElement.querySelector('#description')?.textContent).toContain(testDesc);
    expect(HTMLElement.querySelector('#risk')?.textContent).toContain(testRisk);
    expect(HTMLElement.querySelector('#measure')?.textContent).toContain(testMeasure);
    expect(HTMLElement.querySelector('#assessment')?.textContent).toContain(testAssessment);
    expect(HTMLElement.querySelector('#comments')?.textContent).toContain(testComments);
    expect(HTMLElement.querySelector('#implementationGuide')?.textContent).toContain(testImplementationGuide); // eslint-disable-line
  });

  /*
  it('check if references is being generated', () => {
    const testSAMM = [' Sample SAMM '];
    const testISO17 = [' Sample ISO'];
    const testISO22 = [' Sample ISO22'];
    const uuid = 'abcd'; // for openCRE

    expect(component.currentActivity).toBeTruthy();
    // expect(component.currentActivity.references).toBeTruthy();
    if (component.currentActivity.references) {
      component.currentActivity.references.samm2 = testSAMM;
      component.currentActivity.references.iso27001_2017 = testISO17;
      component.currentActivity.references.iso27001_2022 = testISO22;
      component.currentActivity.uuid = uuid;
    }

    fixture.detectChanges();
    const HTMLElement: HTMLElement = fixture.nativeElement;
    const contentDisplayedInParagraphTag = HTMLElement.querySelectorAll('#references')!;

    expect(contentDisplayedInParagraphTag[0].textContent).toContain(
      component.SAMMVersion +
        testSAMM[0] +
        component.ISOVersion +
        testISO17[0] +
        component.ISO22Version +
        testISO22[0] +
        component.openCREVersion
    );
  });
  */
});
