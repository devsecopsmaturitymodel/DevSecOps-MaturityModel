import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '../../service/loader/data-loader.service';
import { Activity } from '../../model/activity-store';
import { DataStore } from '../../model/data-store';
import { ReportConfig, getReportConfig, saveReportConfig } from '../../model/report-config';
import {
  ReportConfigModalComponent,
  ReportConfigModalData,
} from '../../component/report-config-modal/report-config-modal.component';

export interface ReportDimension {
  name: string;
  subdimensions: ReportSubdimension[];
}

export interface ReportSubdimension {
  name: string;
  activities: Activity[];
}

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements OnInit {
  reportConfig: ReportConfig;
  allActivities: Activity[] = [];
  filteredDimensions: ReportDimension[] = [];
  isLoading: boolean = true;

  // For the config modal
  allDimensionNames: string[] = [];
  allSubdimensionNames: string[] = [];
  allLevels: number[] = [];

  constructor(private loader: LoaderService, private dialog: MatDialog) {
    this.reportConfig = getReportConfig();
  }

  ngOnInit(): void {
    this.loadActivities();
  }

  loadActivities(): void {
    this.isLoading = true;
    this.loader
      .load()
      .then((dataStore: DataStore) => {
        if (!dataStore.activityStore) {
          this.isLoading = false;
          return;
        }

        this.allActivities = dataStore.activityStore.getAllActivities();

        // Collect unique dimensions, subdimensions, levels
        const dimensionSet = new Set<string>();
        const subdimensionSet = new Set<string>();
        const levelSet = new Set<number>();

        for (const activity of this.allActivities) {
          dimensionSet.add(activity.category);
          subdimensionSet.add(activity.dimension);
          levelSet.add(activity.level);
        }

        this.allDimensionNames = Array.from(dimensionSet).sort();
        this.allSubdimensionNames = Array.from(subdimensionSet).sort();
        this.allLevels = Array.from(levelSet).sort((a, b) => a - b);

        this.applyFilters();
        this.isLoading = false;
      })
      .catch(err => {
        console.error('Error loading activities for report:', err);
        this.isLoading = false;
      });
  }

  applyFilters(): void {
    const config = this.reportConfig;

    // Filter activities using hierarchical exclusion
    const filtered = this.allActivities.filter(activity => {
      // 1. Check dimension (category)
      if (config.excludedDimensions.includes(activity.category)) return false;
      // 2. Check subdimension (dimension)
      if (config.excludedSubdimensions.includes(activity.dimension)) return false;
      // 3. Check level
      if (config.excludedLevels.includes(activity.level)) return false;
      // 4. Check individual activity
      if (config.excludedActivities.includes(activity.uuid)) return false;
      return true;
    });

    // Group by dimension (category) → subdimension (dimension)
    const dimensionMap = new Map<string, Map<string, Activity[]>>();

    for (const activity of filtered) {
      if (!dimensionMap.has(activity.category)) {
        dimensionMap.set(activity.category, new Map());
      }
      const subdimMap = dimensionMap.get(activity.category)!;
      if (!subdimMap.has(activity.dimension)) {
        subdimMap.set(activity.dimension, []);
      }
      subdimMap.get(activity.dimension)!.push(activity);
    }

    // Convert to array structure sorted by name
    this.filteredDimensions = [];
    const sortedDimensions = Array.from(dimensionMap.keys()).sort();
    for (const dimName of sortedDimensions) {
      const subdimMap = dimensionMap.get(dimName)!;
      const subdimensions: ReportSubdimension[] = [];
      const sortedSubdims = Array.from(subdimMap.keys()).sort();
      for (const subdimName of sortedSubdims) {
        const activities = subdimMap.get(subdimName)!;
        // Sort activities by level, then by name
        activities.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
        subdimensions.push({ name: subdimName, activities });
      }
      this.filteredDimensions.push({ name: dimName, subdimensions });
    }
  }

  openConfigModal(): void {
    const modalData: ReportConfigModalData = {
      config: this.reportConfig,
      allActivities: this.allActivities,
      allDimensions: this.allDimensionNames,
      allSubdimensions: this.allSubdimensionNames,
      allLevels: this.allLevels,
    };

    const dialogRef = this.dialog.open(ReportConfigModalComponent, {
      width: '700px',
      maxHeight: '90vh',
      data: modalData,
    });

    dialogRef.afterClosed().subscribe((result: ReportConfig | null) => {
      if (result) {
        this.reportConfig = result;
        saveReportConfig(result);
        this.applyFilters();
      }
    });
  }

  get totalFilteredActivities(): number {
    let count = 0;
    for (const dim of this.filteredDimensions) {
      for (const subdim of dim.subdimensions) {
        count += subdim.activities.length;
      }
    }
    return count;
  }
}
