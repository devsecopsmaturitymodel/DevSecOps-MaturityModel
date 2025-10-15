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
  @Input() showCloseButton: boolean = false;
  @Output() activityClicked = new EventEmitter<string>();
  @Output() closeRequested = new EventEmitter<void>();

  currentActivity: Partial<Activity> = {};
  TimeLabel: string = '';
  KnowledgeLabel: string = '';
  ResourceLabel: string = '';
  UsefulnessLabel: string = '';
  SAMMVersion: string = 'OWASP SAMM VERSION 2';
  ISOVersion: string = 'ISO 27001:2017';
  ISO22Version: string = 'ISO 27001:2022';
  openCREVersion: string = 'OpenCRE';

  @ViewChildren(MatAccordion) accordion!: QueryList<MatAccordion>;

  constructor(private loader: LoaderService) {}

  ngOnInit() {
    // Set activity data if provided
    if (this.activity) {
      this.setActivityData(this.activity);
    }
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
      this.KnowledgeLabel = dataStore.getMetaString('knowledgeLabels', activity.difficultyOfImplementation.knowledge);
      this.TimeLabel = dataStore.getMetaString('labels', activity.difficultyOfImplementation.time);
      this.ResourceLabel = dataStore.getMetaString('labels', activity.difficultyOfImplementation.resources);
      this.UsefulnessLabel = dataStore.getMetaString('labels', activity.usefulness);
      /* eslint-enable */
    }

    // Auto-expand all panels after a short delay
    setTimeout(() => {
      this.openAll();
    });
  }

  onActivityClicked(activityName: string) {
    // Emit event for parent component to handle
    this.activityClicked.emit(activityName);
  }

  onCloseRequested() {
    this.closeRequested.emit();
  }

  // Expand all function
  openAll(): void {
    this.accordion.forEach(element => {
      element.openAll();
    });
  }

  // Close all function
  closeAll(): void {
    this.accordion.forEach(element => {
      element.closeAll();
    });
  }
}
