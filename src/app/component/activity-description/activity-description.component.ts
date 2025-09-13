import { Component, ViewChildren, QueryList, OnInit } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from '../../service/loader/data-loader.service';
import { Activity } from '../../model/activity-store';
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

  constructor(private route: ActivatedRoute, private loader: LoaderService) {}

  ngOnInit() {
    let uuid: string = this.route.snapshot.queryParams['uuid'];
    let name: string = this.route.snapshot.queryParams['name'];

    // Load data
    this.loader
      .load()
      .then((dataStore: DataStore) => {
        // Find the activity with matching UUID (or potentially name)
        if (!dataStore.activityStore) throw Error('TODO: Must handle these');

        let activity: Activity = dataStore.activityStore.getActivity(uuid, name);
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
