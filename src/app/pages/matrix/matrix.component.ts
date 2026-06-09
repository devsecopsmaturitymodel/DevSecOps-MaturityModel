import { Component, OnInit, ElementRef, ViewChild, signal, computed } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { Router, NavigationExtras } from '@angular/router';
import { LoaderService } from 'src/app/service/loader/data-loader.service';
import { Activity, ActivityStore, Data } from 'src/app/model/activity-store';
import { UntilDestroy } from '@ngneat/until-destroy';
import { MatChipListbox, MatChipSelectionChange, MatChipsModule } from '@angular/material/chips';
import { DataStore } from 'src/app/model/data-store';
import { perfNow } from 'src/app/util/util';
import { SettingsService } from 'src/app/service/settings/settings.service';
import { NotificationService } from 'src/app/service/notification.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { NgFor, NgIf, KeyValuePipe } from '@angular/common';
import { TopHeaderComponent } from '../../component/top-header/top-header.component';

export interface MatrixRow {
  Category: string;
  Dimension: string;
  level1: Activity[];
  level2: Activity[];
  level3: Activity[];
  level4: Activity[];
  level5: Activity[];
  level6: Activity[];
  level7: Activity[];
}
type LevelKey = keyof Pick<MatrixRow, 'level1' | 'level2' | 'level3' | 'level4' | 'level5' | 'level6' | 'level7'>;  // eslint-disable-line

@UntilDestroy()
@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.css'],
  standalone: true,
  imports: [
    TopHeaderComponent,
    MatChipsModule,
    NgFor,
    MatDividerModule,
    MatTableModule,
    MatIconModule,
    NgIf,
    KeyValuePipe,
  ],
})
export class MatrixComponent implements OnInit {
  Routing: string = '/activity-description';
  dataStore: DataStore = new DataStore();
  data: Data = {};
  levels = signal<Partial<Record<LevelKey, string>>>({});
  filtersTag = signal<Record<string, boolean>>({});
  filtersDim = signal<Record<string, boolean>>({});
  columnNames = signal<string[]>([]);
  MATRIX_DATA = signal<MatrixRow[]>([]);

  dataSource = computed((): MatrixRow[] => {
    const hasDimFilter = Object.values(this.filtersDim()).some(v => v === true);
    const hasTagFilter = Object.values(this.filtersTag()).some(v => v === true);

    if (!hasTagFilter && !hasDimFilter) {
      return this.MATRIX_DATA();
    }

    let itemsStage1: MatrixRow[];
    if (!hasDimFilter) {
      itemsStage1 = this.MATRIX_DATA();
    } else {
      itemsStage1 = this.MATRIX_DATA().filter(srcItem => this.filtersDim()[srcItem.Dimension]);
    }

    if (!hasTagFilter) {
      return itemsStage1;
    }

    const itemsStage2: MatrixRow[] = [];
    for (const srcItem of itemsStage1) {
      let hasContent = false;
      const trgItem: Partial<MatrixRow> = {};

      for (const lvl of Object.keys(this.levels()) as LevelKey[]) {
        const tmp = srcItem[lvl].filter(activity => this.hasTag(activity));
        if (tmp.length > 0) {
          trgItem[lvl] = tmp;
          hasContent = true;
        }
      }

      if (hasContent) {
        trgItem.Category = srcItem.Category;
        trgItem.Dimension = srcItem.Dimension;
        itemsStage2.push(trgItem as MatrixRow);
      }
    }
    return itemsStage2;
  });

  /* eslint-disable */
  constructor(
    private loader: LoaderService,
    private settings: SettingsService,
    private router: Router,
    private notificationService: NotificationService
  ) {}
  /* eslint-enable */

  reset() {
    this.filtersDim.set(Object.fromEntries(Object.keys(this.filtersDim()).map(k => [k, false])));
    this.filtersTag.set(Object.fromEntries(Object.keys(this.filtersTag()).map(k => [k, false])));
  }

  ngOnInit(): void {
    console.log(`${perfNow()}: Matrix: Loading yamls...`);
    this.loader
      .load()
      .then((dataStore: DataStore) => {
        this.setYamlData(dataStore);
        console.log(`${perfNow()}: Page loaded: Matrix`);
      })
      .catch(err => {
        this.notificationService.notify('An error occurred', err.message);
        if (err.hasOwnProperty('stack')) {
          console.warn(err);
        }
      });
  }

  setYamlData(dataStore: DataStore) {
    this.dataStore = dataStore;
    if (!dataStore.activityStore) {
      return;
    }
    const allCategoryNames = dataStore?.activityStore?.getAllCategoryNames() || [];
    const allDimensionNames = dataStore?.activityStore?.getAllDimensionNames() || [];

    this.MATRIX_DATA.set(this.buildMatrixData(dataStore.activityStore, allDimensionNames));
    const levelsObj = this.buildLevels(dataStore.getLevelTitles(this.settings.getMaxLevel())); // eslint-disable-line
    this.levels.set(levelsObj);
    this.filtersTag.set(this.buildFiltersForTag(dataStore.activityStore.getAllActivities()));  // eslint-disable-line
    this.filtersDim.set(this.buildFiltersForDim(this.MATRIX_DATA()));
    this.columnNames.set(['Category', 'Dimension', ...Object.keys(levelsObj)]);
  }

  buildFiltersForTag(activities: Activity[]): Record<string, boolean> {
    let tags: Record<string, boolean> = {};
    for (let activity of activities) {
      if (activity.tags) {
        for (let tag of activity.tags) {
          tags[tag] = false;
        }
      }
    }
    return tags;
  }

  buildFiltersForDim(matrixData: MatrixRow[]): Record<string, boolean> {
    let dimensions: Record<string, boolean> = {};
    for (let item of matrixData) {
      if (item.Dimension) {
        dimensions[item.Dimension] = false;
      }
    }
    return dimensions;
  }

  buildLevels(levelNames: string[]): Record<string, string> {
    let levels: Record<string, string> = {};
    let i: number = 1;
    for (let name of levelNames) {
      levels['level' + i] = name;
      i++;
    }
    return levels;
  }

  buildMatrixData(activityStore: ActivityStore, allDimensionNames: string[]): MatrixRow[] {
    let matrixData: MatrixRow[] = [];
    for (let dim of allDimensionNames) {
      let matrixRow: Partial<MatrixRow> = {};
      for (let level = 1; level <= activityStore.getMaxLevel(); level++) {
        let activities: Activity[] = activityStore.getActivities(dim, level);
        let levelLabel: LevelKey = `level${level}` as LevelKey;
        matrixRow[levelLabel] = activities;
        if (activities.length > 0 && !matrixRow.Category) {
          matrixRow['Category'] = activities[0].category;
          matrixRow['Dimension'] = activities[0].dimension;
        }
      }
      matrixData.push(matrixRow as MatrixRow);
    }
    return matrixData;
  }

  @ViewChild(MatChipListbox)
  chipsControl = new FormControl(['chipsControl']);
  chipList!: MatChipListbox;

  toggleTagFilters(event: MatChipSelectionChange) {
    if (!event?.source || event.source.value == null) return;

    const value = event.source.value;
    const selected = event.selected;

    setTimeout(() => {
      this.filtersTag.update(f => ({ ...f, [value]: selected }));
      console.log(`${perfNow()}: Matrix: Chip flip Tag '${value}: ${selected}`);
    });
  }

  toggleDimensionFilters(event: MatChipSelectionChange) {
    if (!event?.source || event.source.value == null) return;

    const value = event.source.value;
    const selected = event.selected;

    setTimeout(() => {
      this.filtersDim.update(f => ({ ...f, [value]: selected }));
      console.log(`${perfNow()}: Matrix: Chip flip Dim '${value}: ${selected}`);
    });
  }

  @ViewChild('rowInput') rowInput!: ElementRef<HTMLInputElement>;
  @ViewChild('activityInput') activityInput!: ElementRef<HTMLInputElement>;

  hasTag(activity: Activity): boolean {
    if (activity.tags) {
      for (let tagName of activity.tags) {
        if (this.filtersTag()[tagName]) return true;
      }
    }
    return false;
  }

  hasFilterValues(filter: Record<string, boolean>): boolean {
    let lastValue: boolean | null = null;
    for (let value of Object.values(filter)) {
      if (lastValue == null) {
        lastValue = value;
      } else {
        if (value != lastValue) return true;
      }
    }
    return false;
  }

  // activity description routing + providing parameters
  navigate(uuid: string) {
    const navigationExtras: NavigationExtras = {
      queryParams: { uuid: uuid },
    };
    console.log(`${perfNow()}: Matrix: Open Details: '${this.dataStore?.activityStore?.getActivityByUuid(uuid).name}'`); // eslint-disable-line
    this.router.navigate([this.Routing], navigationExtras);
  }
}
