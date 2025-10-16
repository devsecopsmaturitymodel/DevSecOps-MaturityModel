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
  OnDestroy,
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
export class ActivityDescriptionComponent implements OnInit, OnChanges, OnDestroy {
  @Input() activity: Activity | null = null;
  @Input() showCloseButton: boolean = false;
  @Output() activityClicked = new EventEmitter<string>();
  @Output() closeRequested = new EventEmitter<void>();

  remSize: number = parseFloat(getComputedStyle(document.documentElement).fontSize);
  private resizeObserver?: ResizeObserver;
  private mutationObserver?: MutationObserver;
  private lastWidth: number = 0;

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
    this.setupResizeObserver();
    this.setupMutationObserver();
    // Set up interval to periodically check width changes
    this.setupPeriodicCheck();
  }

  ngOnDestroy() {
    // Cleanup observers
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
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

  // Check if screen is narrow and update property
  private checkWidthForActivityPanel(): void {
    let elemtn: HTMLElement | null = document.querySelector('app-activity-description');
    if (!elemtn) return;

    const currentWidth = elemtn.offsetWidth;
    const wasNarrow = this.isNarrowScreen;
    this.isNarrowScreen = currentWidth < 500;

    // Only log if width actually changed
    if (currentWidth !== this.lastWidth || wasNarrow !== this.isNarrowScreen) {
      console.log(
        `ActivityDescriptionComponent: isNarrowScreen = ${this.isNarrowScreen} ${currentWidth}px (was ${this.lastWidth}px)`
      );
      this.lastWidth = currentWidth;
    }
  }

  // Set up ResizeObserver to watch for component width changes
  private setupResizeObserver(): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(entries => {
        // Debounce the resize check to avoid excessive calls
        setTimeout(() => {
          this.checkWidthForActivityPanel();
        }, 100);
      });

      // Start observing the component element
      const element = document.querySelector('app-activity-description');
      if (element) {
        this.resizeObserver.observe(element);
      }
    }
  }

  // Set up MutationObserver to watch for DOM changes that might affect layout
  private setupMutationObserver(): void {
    this.mutationObserver = new MutationObserver(mutations => {
      let shouldCheck = false;
      mutations.forEach(mutation => {
        // Check if any class changes might affect layout (like menu open/close)
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          shouldCheck = true;
        }
        // Check if any child elements were added/removed that might affect layout
        if (mutation.type === 'childList') {
          shouldCheck = true;
        }
      });

      if (shouldCheck) {
        setTimeout(() => {
          this.checkWidthForActivityPanel();
        }, 150); // Slightly longer delay for DOM changes
      }
    });

    // Observe the document body for class changes (like menu states)
    this.mutationObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
      childList: true,
      subtree: true,
    });
  }

  // Set up periodic check as fallback
  private setupPeriodicCheck(): void {
    // Check width every 500ms as a fallback for missed events
    setInterval(() => {
      this.checkWidthForActivityPanel();
    }, 500);
  }
}
