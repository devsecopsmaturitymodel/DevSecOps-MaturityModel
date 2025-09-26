import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router, NavigationExtras } from '@angular/router';
import { LoaderService } from 'src/app/service/loader/data-loader.service';
import { Activity, ActivityStore, Data } from 'src/app/model/activity-store';
import { UntilDestroy } from '@ngneat/until-destroy';
import { MatChip, MatChipList } from '@angular/material/chips';
import { deepCopy } from 'src/app/util/util';
import {
  ModalMessageComponent,
  DialogInfo,
} from '../../component/modal-message/modal-message.component';
import { DataStore } from 'src/app/model/data-store';
import { perfNow } from 'src/app/util/util';

export interface MatrixRow {
  Category: string;
  Dimension: string;
  level1: Activity[];
  level2: Activity[];
  level3: Activity[];
  level4: Activity[];
  level5: Activity[];
}
type LevelKey = keyof Pick<MatrixRow, 'level1' | 'level2' | 'level3' | 'level4' | 'level5'>;

@UntilDestroy()
@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.css'],
})
export class MatrixComponent implements OnInit {
  Routing: string = '/activity-description';
  dataStore: DataStore = new DataStore();
  data: Data = {};
  levels: Partial<Record<LevelKey, string>> = {};
  filtersTag: Record<string, boolean> = {};
  filtersDim: Record<string, boolean> = {};
  columnNames: string[] = [];
  allCategoryNames: string[] = [];
  allDimensionNames: string[] = [];
  MATRIX_DATA: MatrixRow[] = [];
  dataSource: any = new MatTableDataSource<MatrixRow>(this.MATRIX_DATA);

  /* eslint-disable */
  constructor(
    private loader: LoaderService,
    private router: Router,
    public modal: ModalMessageComponent
  ) {}
  /* eslint-enable */

  reset() {
    for (let dim in this.filtersDim) {
      this.filtersDim[dim] = false;
    }
    for (let tag in this.filtersTag) {
      this.filtersTag[tag] = false;
    }
    this.updateActivitiesBeingDisplayed();
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
        this.displayMessage(new DialogInfo(err.message, 'An error occurred'));
        if (err.hasOwnProperty('stack')) {
          console.warn(err);
        }
      });
  }

  displayMessage(dialogInfo: DialogInfo) {
    this.modal.openDialog(dialogInfo);
  }

  setYamlData(dataStore: DataStore) {
    this.dataStore = dataStore;
    if (!dataStore.activityStore) {
      return;
    }
    // this.data = this.activities.getData();
    this.allCategoryNames = dataStore?.activityStore?.getAllCategoryNames() || [];
    this.allDimensionNames = dataStore?.activityStore?.getAllDimensionNames() || [];

    this.MATRIX_DATA = this.buildMatrixData(dataStore.activityStore);
    this.levels = this.buildLevels(dataStore.getLevels());
    this.filtersTag = this.buildFiltersForTag(dataStore.activityStore.getAllActivities());  // eslint-disable-line
    this.filtersDim = this.buildFiltersForDim(this.MATRIX_DATA);
    this.columnNames = ['Category', 'Dimension'];
    this.columnNames.push(...Object.keys(this.levels));

    this.dataSource.data = deepCopy(this.MATRIX_DATA);
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

  buildMatrixData(activityStore: ActivityStore): MatrixRow[] {
    let matrixData: MatrixRow[] = [];
    for (let dim of this.allDimensionNames) {
      let matrixRow: Partial<MatrixRow> = {};
      for (let level = 1; level <= 5; level++) {
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

  @ViewChild(MatChipList)
  chipsControl = new FormControl(['chipsControl']);
  chipList!: MatChipList;

  toggleTagFilters(chip: MatChip) {
    chip.toggleSelected();
    this.filtersTag[chip.value] = chip.selected;
    console.log(`${perfNow()}: Matrix: Chip flip Tag '${chip.value}: ${chip.selected}`);
    this.updateActivitiesBeingDisplayed();
  }

  toggleDimensionFilters(chip: MatChip) {
    chip.toggleSelected();
    this.filtersDim[chip.value] = chip.selected;
    console.log(`${perfNow()}: Matrix: Chip flip Dim '${chip.value}: ${chip.selected}`);
    this.updateActivitiesBeingDisplayed();
  }

  @ViewChild('rowInput') rowInput!: ElementRef<HTMLInputElement>;
  @ViewChild('activityInput') activityInput!: ElementRef<HTMLInputElement>;

  updateActivitiesBeingDisplayed(): void {
    let hasDimFilter = Object.values(this.filtersDim).some(v => v === true);
    let hasTagFilter = Object.values(this.filtersTag).some(v => v === true);

    if (!hasTagFilter && !hasDimFilter) {
      this.dataSource.data = this.MATRIX_DATA;
      return;
    }

    // Apply dimension filters
    let itemsStage1: MatrixRow[] = [];
    if (!hasDimFilter) {
      itemsStage1 = this.MATRIX_DATA;
    } else {
      for (let srcItem of this.MATRIX_DATA) {
        if (this.filtersDim[srcItem.Dimension]) {
          itemsStage1.push(srcItem as MatrixRow);
        }
      }
    }

    // Apply tag filters
    let itemsStage2: MatrixRow[];
    if (!hasTagFilter) {
      itemsStage2 = itemsStage1;
    } else {
      itemsStage2 = [];
      for (let srcItem of itemsStage1) {
        let hasContent = false;

        let trgItem: Partial<MatrixRow> = {};
        if (hasTagFilter) {
          // Include activities withing each level, that match the tag filter

          // If tag filter is active, filter activities by tags
          for (let lvl of Object.keys(this.levels) as LevelKey[]) {
            let tmp: Activity[];
            tmp = srcItem[lvl].filter(activity => this.hasTag(activity));
            if (tmp.length > 0) {
              trgItem[lvl] = tmp;
              hasContent = true;
            }
          }

          // Only include the row if it has any activities after tag filtering
          if (hasContent) {
            // Copy metadata, since the element has remaining activities after filtering
            trgItem.Category = srcItem.Category;
            trgItem.Dimension = srcItem.Dimension;

            itemsStage2.push(trgItem as MatrixRow);
          }
        }
      }
    }
    this.dataSource.data = itemsStage2;
  }

  hasTag(activity: Activity): boolean {
    if (activity.tags) {
      for (let tagName of activity.tags) {
        if (this.filtersTag[tagName]) return true;
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
