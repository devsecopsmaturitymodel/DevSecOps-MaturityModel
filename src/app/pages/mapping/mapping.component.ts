import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
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

const FILTER_SEPARATOR = '\x1F';
const SORTABLE_COLUMNS = new Set(['dimension', 'subDimension', 'activityName']);

export interface MappingRow {
  uuid: Uuid;
  dimension: string;
  subDimension: string;
  activityName: string;
  samm2: string[];
  ISO17: string[];
  ISO22: string[];
  _samm2Str: string;
  _ISO17Str: string;
  _ISO22Str: string;
  _searchBlob: string;
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
  teamImplementation?: Record<string, unknown>;
}

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MappingComponent implements OnInit, AfterViewInit, OnDestroy {
  allMappings: MappingRow[] = [];
  dataSource = new MatTableDataSource<MappingRow>([]);

  displayedColumns = ['dimension', 'subDimension', 'activityName', 'samm2', 'ISO17', 'ISO22'];

  separatorKeysCodes: number[] = [ENTER, COMMA];
  searchCtrl = new FormControl('');
  searchTerms: string[] = [];
  liveInputValue = '';

  loading = true;
  pageSizeOptions = [10, 25, 50, 100];
  defaultPageSize = 25;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private destroy$ = new Subject<void>();
  dataStore: DataStore = new DataStore();

  constructor(
    private loader: LoaderService,
    private settings: SettingsService,
    private cdr: ChangeDetectorRef,
    public modal: ModalMessageComponent
  ) {}

  ngOnInit(): void {
    console.log(`${perfNow()}: Mapping: init`);
    this.initSearchListener();

    this.loader
      .load()
      .then((ds: DataStore) => {
        this.setYamlData(ds);
        this.setupFilter();
        this.setupSorting();
        this.loading = false;
        this.cdr.markForCheck();
      })
      .catch(err => {
        this.loading = false;
        this.displayMessage(new DialogInfo(err.message, 'An error occurred'));
        console.error(err);
        this.cdr.markForCheck();
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.sort?.sortChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.paginator?.firstPage();
      this.cdr.detectChanges();
    });

    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initSearchListener(): void {
    this.searchCtrl.valueChanges
      .pipe(debounceTime(150), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(value => {
        this.liveInputValue = (value ?? '').trim().toLowerCase();
        this.applyFilter();
      });
  }

  commitCurrentInput(inputEl?: HTMLInputElement): void {
    const raw = (inputEl?.value ?? this.searchCtrl.value ?? '').trim().toLowerCase();
    if (!raw) return;

    if (!this.searchTerms.includes(raw)) {
      this.searchTerms = [...this.searchTerms, raw];
    }

    this.liveInputValue = '';
    this.searchCtrl.setValue('', { emitEvent: false });
    if (inputEl) inputEl.value = '';

    this.applyFilter();
  }

  removeSearchTerm(term: string): void {
    this.searchTerms = this.searchTerms.filter(t => t !== term);
    this.applyFilter();
  }

  clearFilter(): void {
    this.searchTerms = [];
    this.liveInputValue = '';
    this.searchCtrl.setValue('', { emitEvent: false });
    this.dataSource.filter = '';
    this.paginator?.firstPage();
  }

  private applyFilter(resetPage = true): void {
    const all = [...this.searchTerms];
    if (this.liveInputValue && !all.includes(this.liveInputValue)) {
      all.push(this.liveInputValue);
    }

    this.dataSource.filter = all.length ? all.join(FILTER_SEPARATOR) : '';
    if (resetPage) this.paginator?.firstPage();
    this.cdr.markForCheck();
  }

  private setYamlData(ds: DataStore): void {
    this.dataStore = ds;
    this.allMappings = this.transformDataStore(ds);
    this.dataSource.data = this.allMappings;

    if (this.sort) this.dataSource.sort = this.sort;
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
      this.paginator.firstPage();
    }
  }

  private transformDataStore(ds: DataStore): MappingRow[] {
    if (!ds.activityStore) return [];

    const activities = ds.activityStore.getAllActivitiesUpToLevel(this.settings.getMaxLevel());

    return activities.map(activity => {
      const refs = activity?.references ?? {};

      const samm2 = refs['samm2'] ?? [];
      const ISO17 = refs['iso27001_2017'] ?? [];
      const ISO22 = refs['iso27001_2022'] ?? [];

      const _samm2Str = samm2.join(', ');
      const _ISO17Str = ISO17.join(', ');
      const _ISO22Str = ISO22.join(', ');

      const dimension = activity.category ?? '';
      const subDimension = activity.dimension ?? '';
      const activityName = activity.name ?? '';

      const _searchBlob = [dimension, subDimension, activityName, _samm2Str, _ISO17Str, _ISO22Str]
        .join(' ')
        .toLowerCase();

      return {
        uuid: activity.uuid ?? '',
        dimension,
        subDimension,
        activityName,
        samm2,
        ISO17,
        ISO22,
        _samm2Str,
        _ISO17Str,
        _ISO22Str,
        _searchBlob,
        level: activity.level ?? 0,
      };
    });
  }

  isSortable(col: string): boolean {
    return SORTABLE_COLUMNS.has(col);
  }

  private setupSorting(): void {
    this.dataSource.sortData = (data, sort) => {
      if (!sort.active || sort.direction === '' || !SORTABLE_COLUMNS.has(sort.active)) {
        return data;
      }

      const dir = sort.direction === 'asc' ? 1 : -1;

      return data
        .map((item, i) => ({ item, i }))
        .sort(({ item: a, i: ai }, { item: b, i: bi }) => {
          const vA = ((a as any)[sort.active] ?? '').toString().toLowerCase();
          const vB = ((b as any)[sort.active] ?? '').toString().toLowerCase();
          const c = vA.localeCompare(vB);
          return c !== 0 ? dir * c : ai - bi;
        })
        .map(({ item }) => item);
    };
  }

  private setupFilter(): void {
    this.dataSource.filterPredicate = (data: MappingRow, filter: string) => {
      if (!filter) return true;
      return filter
        .split(FILTER_SEPARATOR)
        .filter(Boolean)
        .every(t => data._searchBlob.includes(t));
    };
  }

  exportToExcel(): void {
    const rows = this.dataSource.filteredData.map(r => ({
      Dimension: r.dimension,
      'Sub-Dimension': r.subDimension,
      Activity: r.activityName,
      Level: r.level ?? '',
      SAMM: r._samm2Str,
      'ISO 27001:2017': r._ISO17Str,
      'ISO 27001:2022': r._ISO22Str,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Mappings');
    XLSX.writeFile(wb, 'DSOMM-Mappings.xlsx');
  }

  trackByUuid(_: number, row: MappingRow): Uuid {
    return row.uuid;
  }

  get totalResults(): number {
    return this.dataSource.filteredData.length;
  }
  get totalAll(): number {
    return this.allMappings.length;
  }

  get isFiltered(): boolean {
    return this.searchTerms.length > 0 || this.liveInputValue.length > 0;
  }

  private displayMessage(di: DialogInfo): void {
    this.modal.openDialog(di);
  }
}
