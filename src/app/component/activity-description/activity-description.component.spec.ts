import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ActivityDescriptionComponent } from './activity-description.component';
import { LoaderService } from 'src/app/service/loader/data-loader.service';
import { MockLoaderService } from 'src/app/service/loader/mock-data-loader.service';
import { MarkdownText } from 'src/app/model/markdown-text';
import { Data } from 'src/app/model/activity-store';
import { isEmptyObj } from 'src/app/util/util';
import { MaterialModule } from 'src/app/material/material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DataStore } from 'src/app/model/data-store';

let mockLoaderService: MockLoaderService;
let mockActivatedRoute = {
  queryParams: of({ uuid: '00000000-1111-1111-1111-0000000000000' }),
};
let mockData = {
  'Dim 1': {
    'SubDim-1.1': {
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

@Component({
  selector: 'app-dependency-graph',
  template: '',
})
class DependencyGraphStubComponent {
  @Input() activityName: string = '';
  @Output() activityClicked = new EventEmitter<string>();
}

describe('ActivityDescriptionComponent', () => {
  let component: ActivityDescriptionComponent;
  let fixture: ComponentFixture<ActivityDescriptionComponent>;
  mockLoaderService = new MockLoaderService(mockData as unknown as Data);
  let dataStore: DataStore;

  beforeEach(async () => {
    dataStore = (await mockLoaderService.load()) as DataStore;
    await TestBed.configureTestingModule({
      providers: [
        HttpClient,
        HttpHandler,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: LoaderService, useValue: mockLoaderService },
      ],
      imports: [RouterTestingModule, MaterialModule, NoopAnimationsModule],
      declarations: [ActivityDescriptionComponent, DependencyGraphStubComponent],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(ActivityDescriptionComponent);
    component = fixture.componentInstance;
    // Provide the @Input activity before first change detection so ngOnInit uses it
    const testUUID = '00000000-1111-1111-1111-0000000000000';
    const activity =
      dataStore.activityStore?.getActivityByUuid(testUUID) ||
      dataStore.activityStore?.getActivityByName('Activity 111');
    // Fallback for safety in case lookup fails in future changes
    if (activity) {
      component.activity = activity as any;
    }
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

  it('check if header is being generated', async () => {
    const testSubDimension = 'SubDim-1.1';
    const testActivity = 'Activity 111';

    await fixture.whenStable();
    fixture.detectChanges();

    const HTMLElement: HTMLElement = fixture.nativeElement;
    const subDimHeading = HTMLElement.querySelector('.title-above span')!;
    const activityHeading = HTMLElement.querySelector('.activity-header h1')!;

    expect(subDimHeading?.textContent).toContain(testSubDimension);
    expect(activityHeading?.textContent).toContain(testActivity);
  });

  it('check if content is displayed', async () => {
    // console.log(`${perfNow()}: ActivityDescription: "check if content is displayed"`);
    const testUUID = '00000000-1111-1111-1111-0000000000000';
    const testDesc = 'Description 111';
    const testRisk = 'Risk 111';
    const testMeasure = 'Measure 111';
    const testAssessment = 'Assessment 111';
    const testComments = 'Comments 111';
    const testImplementationGuide = 'Implementation Guide 111';

    await fixture.whenStable();
    fixture.detectChanges();
    const HTMLElement: HTMLElement = fixture.nativeElement;

    expect(HTMLElement.querySelector('.uuid-value')?.textContent).toContain(testUUID);
    expect(HTMLElement.querySelector('#description')?.textContent).toContain(testDesc);
    expect(HTMLElement.querySelector('#risk')?.textContent).toContain(testRisk);
    expect(HTMLElement.querySelector('#measure')?.textContent).toContain(testMeasure);
    expect(HTMLElement.querySelector('#assessment')?.textContent).toContain(testAssessment);
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
