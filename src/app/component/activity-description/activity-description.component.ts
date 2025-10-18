import {
  Component,
  ViewChildren,
  QueryList,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  OnInit,
  HostListener,
} from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Activity } from '../../model/activity-store';
import { LoaderService } from '../../service/loader/data-loader.service';

@Component({
  selector: 'app-activity-description',
  templateUrl: './activity-description.component.html',
  styleUrls: ['./activity-description.component.css'],
})
export class ActivityDescriptionComponent implements OnInit, OnChanges {
  @Input() activity: Activity | null = null;
  @Input() iconName: string = '';
  @Input() showCloseButton: boolean = false;
  @Output() activityClicked = new EventEmitter<string>();
  @Output() closeRequested = new EventEmitter<void>();

  currentActivity: Partial<Activity> = {};
  TimeLabel: string = '';
  KnowledgeLabel: string = '';
  ResourceLabel: string = '';
  UsefulnessLabel: string = '';
  SAMMVersion: string = 'OWASP SAMM v2';
  ISOVersion: string = 'ISO 27001:2017';
  ISO22Version: string = 'ISO 27001:2022';
  openCREVersion: string = 'OpenCRE';
  isNarrowScreen: boolean = false;

  @ViewChildren(MatAccordion) accordion!: QueryList<MatAccordion>;

  constructor(private loader: LoaderService) {}

  ngOnInit() {
    // Set activity data if provided
    if (this.activity) {
      this.setActivityData(this.activity);
    }
    // Check initial screen size
    this.checkWidthForActivityPanel();
    // Set up observers to watch for layout changes
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkWidthForActivityPanel();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Handle changes to activity input
    if (changes['activity'] && changes['activity'].currentValue) {
      this.setActivityData(changes['activity'].currentValue);
    }
  }

  setActivityData(activity: Activity) {
    this.currentActivity = activity;

    // Get datastore for labels
    const dataStore = this.loader.datastore;
    if (dataStore) {
      /* eslint-disable */
      this.KnowledgeLabel = dataStore.getMetaString('knowledgeLabels', activity.difficultyOfImplementation.knowledge - 1);
      this.TimeLabel = dataStore.getMetaString('labels', activity.difficultyOfImplementation.time - 1);
      this.ResourceLabel = dataStore.getMetaString('labels', activity.difficultyOfImplementation.resources - 1);
      this.UsefulnessLabel = dataStore.getMetaString('labels', activity.usefulness - 1);
      /* eslint-enable */
    }
  }

  onActivityClicked(activityName: string) {
    // Emit event for parent component to handle
    this.activityClicked.emit(activityName);
  }

  onCloseRequested() {
    this.closeRequested.emit();
  }

  // Check if screen is narrow and update property
  private checkWidthForActivityPanel(): void {
    let elemtn: HTMLElement | null = document.querySelector('app-activity-description');
    if (!elemtn) return;

    const currentWidth = elemtn.offsetWidth;
    const wasNarrow = this.isNarrowScreen;
    this.isNarrowScreen = currentWidth < 500;
  }
}
