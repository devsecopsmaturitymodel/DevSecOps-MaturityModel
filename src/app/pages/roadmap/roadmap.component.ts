import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/service/loader/data-loader.service';
import { Activity } from 'src/app/model/activity-store';
import { DataStore } from 'src/app/model/data-store';
import { perfNow } from 'src/app/util/util';

export type ActivityState = 'done' | 'available' | 'locked';

export interface RoadmapCard {
  activity: Activity;
  state: ActivityState;
  missingDeps: string[];
}

@Component({
  selector: 'app-roadmap',
  templateUrl: './roadmap.component.html',
  styleUrls: ['./roadmap.component.css'],
})
export class RoadmapComponent implements OnInit {
  levelGroups: Map<number, RoadmapCard[]> = new Map();
  levels: number[] = [];
  loading = true;
  viewMode: 'timeline' | 'dag' = 'timeline';

  constructor(private loader: LoaderService) {}

  ngOnInit() {
    console.log(`${perfNow()}: Page loaded: Roadmap`);
    this.loader.load().then((dataStore: DataStore) => {
      if (!dataStore.activityStore) return;
      const activities = dataStore.activityStore.getAllActivities();
      this.buildTimeline(activities);
      this.loading = false;
    });
  }

  buildTimeline(activities: Activity[]) {
    const doneNames = new Set<string>(
      activities.filter(a => a.isImplemented).map(a => a.name)
    );

    const cards: RoadmapCard[] = activities.map(a => {
      const deps = a.dependsOn || [];
      const missingDeps = deps.filter(d => !doneNames.has(d));
      let state: ActivityState;
      if (a.isImplemented) {
        state = 'done';
      } else if (missingDeps.length === 0) {
        state = 'available';
      } else {
        state = 'locked';
      }
      return { activity: a, state, missingDeps };
    });

    const groups = new Map<number, RoadmapCard[]>();
    for (const card of cards) {
      const lvl = card.activity.level || 1;
      if (!groups.has(lvl)) groups.set(lvl, []);
      groups.get(lvl)!.push(card);
    }

    this.levelGroups = groups;
    this.levels = Array.from(groups.keys()).sort((a, b) => a - b);
  }

  getUsefulnessClass(val: number): string {
    const classes: Record<number, string> = { 4: 'u-high', 3: 'u-med', 2: 'u-low', 1: 'u-vlow' };
    return classes[val] || 'u-med';
  }

  getDifficultyWidth(val: number): string {
    return `${(val / 4) * 100}%`;
  }

  getDifficultyBarClass(val: number): string {
    if (val <= 1) return 'bar-low';
    if (val === 2) return 'bar-med';
    if (val === 3) return 'bar-high';
    return 'bar-vhigh';
  }
}
