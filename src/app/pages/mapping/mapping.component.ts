import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import * as XLSX from 'xlsx';
import { LoaderService } from 'src/app/service/loader/data-loader.service';
import {
  DialogInfo,
  ModalMessageComponent,
} from 'src/app/component/modal-message/modal-message.component';
import { DataStore } from 'src/app/model/data-store';
import { Uuid } from 'src/app/model/types';
import { perfNow } from 'src/app/util/util';
import { SettingsService } from 'src/app/service/settings/settings.service';

const SEPARATOR = '\x1F'; // ASCII Unit Separator

export interface MappingRow {
  uuid: Uuid;
  dimension: string;
  subDimension: string;
  activityName: string;
  samm2: string[];
  ISO17: string[];
  ISO22: string[];
  description?: string;
  risk?: string;
  measure?: string;
  knowledge?: string;
  resources?: string;
  time?: string;
  usefulness?: string;
  dependsOn?: string[];
  comments?: string;
  assessment?: string;
  level?: number;
}

// Enum for sort mode
enum SortMode {
  Activity = 'sortByActivity',
  SAMM = 'sortBySAMM',
  ISO17 = 'sortByISO',
  ISO22 = 'sortByISO22',
}

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.css'],
})
export class MappingComponent implements OnInit, AfterViewInit {
  allMappings: MappingRow[] = [];
  dataSource = new MatTableDataSource<MappingRow>([]);

  //labels
  knowledgeLabels: string[] = [];
  generalLabels: string[] = [];

  allTeams: string[] = [];
  displayedColumns: string[] = [
    'dimension',
    'subDimension',
    'activityName',
    'samm2',
    'ISO17',
    'ISO22',
  ];
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('chipInput') chipInput!: ElementRef<HTMLInputElement>;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  dataStore: DataStore = new DataStore();

  searchTerms: string[] = [];
  searchCtrl = new FormControl('');

  constructor(
    private loader: LoaderService,
    private settings: SettingsService,
    public modal: ModalMessageComponent
  ) {}

  ngOnInit(): void {
    console.log(`${perfNow()}: Mapping: Loading yamls...`);
    this.loader
      .load()
      .then((dataStore: DataStore) => {
        this.setYamlData(dataStore);
        this.dataSource.filterPredicate = this.filterFunction;
        console.log(`${perfNow()}: Page loaded: Mapping`);
      })
      .catch(err => {
        this.displayMessage(new DialogInfo(err.message, 'An error occurred'));
        if (err.hasOwnProperty('stack')) {
          console.warn(err);
        }
      });
  }

  ngAfterViewInit() {
    if (this.sort) {
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item: MappingRow, property: string) => {
        const value = (item as any)[property];
        if (Array.isArray(value)) {
          return value.join(', ');
        }
        return value;
      };
    }
  }

  displayMessage(dialogInfo: DialogInfo) {
    this.modal.openDialog(dialogInfo);
  }

  setYamlData(dataStore: DataStore) {
    this.dataStore = dataStore;
    this.allTeams = dataStore.meta?.teams || [];
    this.allMappings = this.transformDataStore(dataStore);
    this.dataSource.data = this.allMappings;
  }

  // Transform DataStore to MappingRow[]
  transformDataStore(dataStore: DataStore): MappingRow[] {
    if (!dataStore.activityStore) {
      return [];
    }

    let activities = dataStore.activityStore.getAllActivitiesUpToLevel(this.settings.getMaxLevel());
    return activities.map(activity => {
      return {
        uuid: activity.uuid || '',
        dimension: activity.category || '',
        subDimension: activity.dimension || '',
        activityName: activity.name || '',
        samm2: activity?.references?.samm2 || [],
        ISO17: activity?.references?.iso27001_2017 || [],
        ISO22: activity?.references?.iso27001_2022 || [],
        description: activity.description.toString() || '',
        risk: activity.risk.toString() || '',
        measure: activity.measure.toString() || '',
        knowledge: dataStore.getMetaString('knowledgeLabels', activity.knowledge),
        resources: dataStore.getMetaString('labels', activity.resources),
        time: dataStore.getMetaString('labels', activity.time),
        usefulness: dataStore.getMetaString('labels', activity.usefulness),
        dependsOn: activity.dependsOn || [],
        comments: activity.comments.toString() || '',
        assessment: activity.assessment.toString() || '',
        level: activity.level || 0,
        teamImplementation: activity.implementation || {},
        // teamsEvidence: activity.teamsEvidence || {},
      };
    });
  }

  exportToExcel() {
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, { raw: true });
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'DSOMM - Activities.xlsx');
    console.log(`${perfNow()}: Mapping: Exported to Excel`);
  }

  //-----------------------------
  // Filtering and sorting logic
  //-----------------------------
  applyFilter(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    if (event.key === 'Enter' && value) {
      if (!this.searchTerms.includes(value.toLowerCase())) {
        this.searchTerms.push(value.toLowerCase());
        this.updateFilter();
      }
      input.value = '';
      this.searchCtrl.setValue('');
    } else if (!value && this.searchTerms.length === 0) {
      this.dataSource.filter = '';
    }
  }

  removeSearchTerm(term: string) {
    this.searchTerms = this.searchTerms.filter(t => t !== term);
    this.updateFilter();
  }

  clearFilter() {
    console.log(`${perfNow()}: Mapping: Clear search filter`);
    this.searchTerms = [];
    this.dataSource.filter = '';
    this.searchCtrl.setValue('');
  }

  updateFilter() {
    this.dataSource.filter = this.searchTerms.join(SEPARATOR);
    console.log(
      `${perfNow()}: Mapping: Search filter: ${this.dataSource.filter?.replace(SEPARATOR, ', ')}`
    );
  }

  filterFunction(data: MappingRow, filter: string): boolean {
    // Split filter into terms, require all terms to match
    const terms = filter.split(SEPARATOR).filter(t => t);
    const dataStr = [
      data.dimension,
      data.subDimension,
      data.activityName,
      (data.samm2 || []).join(' '),
      (data.ISO17 || []).join(' '),
      (data.ISO22 || []).join(' '),
    ]
      .join(' ')
      .toLowerCase();

    return terms.every(term => dataStr.includes(term));
  }
}
