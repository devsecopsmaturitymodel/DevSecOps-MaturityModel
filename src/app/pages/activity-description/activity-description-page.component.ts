import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../service/loader/data-loader.service';
import { Activity, ActivityStore } from '../../model/activity-store';
import { DataStore } from 'src/app/model/data-store';
import {
  ModalMessageComponent,
  DialogInfo,
} from '../../component/modal-message/modal-message.component';

@Component({
  selector: 'app-activity-description-page',
  templateUrl: './activity-description-page.component.html',
  styleUrls: ['./activity-description-page.component.css'],
})
export class ActivityDescriptionPageComponent implements OnInit {
  currentActivity: Activity | null = null;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private loader: LoaderService,
    private router: Router,
    public modal: ModalMessageComponent
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const uuid: string = params['uuid'];
      const name: string = params['name'];
      this.loadActivity(uuid, name);
    });
  }

  loadActivity(uuid?: string, name?: string) {
    this.isLoading = true;

    this.loader
      .load()
      .then((dataStore: DataStore) => {
        if (!dataStore.activityStore) throw Error('DataStore not loaded');

        // Ensure uuid and name are strings (fallback to empty string if undefined)
        const uuidStr = uuid ?? '';
        const nameStr = name ?? '';
        let activity: Activity = dataStore.activityStore.getActivity(uuidStr, nameStr);

        if (!activity) {
          throw new Error('Activity not found');
        }

        this.currentActivity = activity;
        this.isLoading = false;
      })
      .catch(err => {
        console.error('Error loading activity data:', err);
        this.isLoading = false;
        this.displayMessage(
          new DialogInfo(err.message || 'Failed to load activity', 'An error occurred')
        );
      });
  }

  displayMessage(dialogInfo: DialogInfo) {
    this.modal.openDialog(dialogInfo);
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
}
