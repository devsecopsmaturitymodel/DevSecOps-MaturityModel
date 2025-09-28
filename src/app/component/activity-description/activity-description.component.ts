import { Component, ViewChildren, QueryList, OnInit } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../service/loader/data-loader.service';
import { Activity, ActivityStore } from '../../model/activity-store';
import { DataStore } from 'src/app/model/data-store';

@Component({
  selector: 'app-activity-description',
  templateUrl: './activity-description.component.html',
  styleUrls: ['./activity-description.component.css'],
})
export class ActivityDescriptionComponent implements OnInit {
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

  constructor(
    private route: ActivatedRoute,
    private loader: LoaderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const uuid: string = params['uuid'];
      const name: string = params['name'];
      this.loadActivity(uuid, name);
    });
  }

  loadActivity(uuid?: string, name?: string) {
    this.loader
      .load()
      .then((dataStore: DataStore) => {
        if (!dataStore.activityStore) throw Error('DateStore not loaded');
        // Ensure uuid and name are strings (fallback to empty string if undefined)
        const uuidStr = uuid ?? '';
        const nameStr = name ?? '';
        let activity: Activity = dataStore.activityStore.getActivity(uuidStr, nameStr);
        if (!activity) {
          throw new Error('Activity not found');
        }

        // Get meta data
        /* eslint-disable */
        this.currentActivity = activity;
        this.KnowledgeLabel = dataStore.getMetaString('knowledgeLabels', activity.difficultyOfImplementation.knowledge);
        this.TimeLabel = dataStore.getMetaString('labels', activity.difficultyOfImplementation.time);
        this.ResourceLabel = dataStore.getMetaString('labels', activity.difficultyOfImplementation.resources);
        this.UsefulnessLabel = dataStore.getMetaString('labels', activity.usefulness);
        /* eslint-enable */

        setTimeout(() => {
          this.openAll();
        });
      })
      .catch(err => {
        console.error('Error loading activity data:', err);
      });
  }

  onActivityClicked(activityName: string) {
    // Find the activity by name and update the view without reloading the page
    const activityStore: ActivityStore = this.loader.datastore?.activityStore as ActivityStore;
    const activity: Activity = activityStore?.getActivityByName(activityName) as Activity;

    if (activity) {
      // Update the URL query params (SPA style)
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { uuid: activity.uuid },
        queryParamsHandling: 'merge',
      });
      this.loadActivity(activity.uuid, activity.name);
    }
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
