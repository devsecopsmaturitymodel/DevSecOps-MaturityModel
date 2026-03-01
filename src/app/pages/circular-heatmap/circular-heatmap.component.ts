import { Component, OnInit, OnDestroy } from '@angular/core';
import { equalArray } from 'src/app/util/util';
import { LoaderService } from 'src/app/service/loader/data-loader.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatChip } from '@angular/material/chips';
import { Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';
import * as md from 'markdown-it';
import {
  ModalMessageComponent,
  DialogInfo,
} from '../../component/modal-message/modal-message.component';
import { Activity } from 'src/app/model/activity-store';
import {
  Uuid,
  ProgressDefinitions,
  TeamName,
  ProgressTitle,
  TeamGroups,
} from 'src/app/model/types';
import { SectorService } from '../../service/sector-service';
import { DataStore } from 'src/app/model/data-store';
import { Sector } from 'src/app/model/sector';
import { perfNow } from 'src/app/util/util';
import { downloadYamlFile } from 'src/app/util/download';
import { ThemeService } from '../../service/theme.service';
import { TitleService } from '../../service/title.service';
import { SettingsService } from 'src/app/service/settings/settings.service';
import { D3HeatmapRenderer, HeatmapColors } from '../../renderer/d3-heatmap.renderer';

@Component({
  selector: 'app-circular-heatmap',
  templateUrl: './circular-heatmap.component.html',
  styleUrls: ['./circular-heatmap.component.css'],
})
export class CircularHeatmapComponent implements OnInit, OnDestroy {
  Routing: string = '/activity-description';
  markdown: md = md();
  showOverlay: boolean = false;
  showFilters: boolean = true;
  showActivityCard: Sector | null = null;

  showActivityDetails: Activity | null = null;

  dataStore: DataStore | null = null;

  // New properties for refactored data
  dimLabels: string[] = [];
  filtersTeams: Record<string, boolean> = {};
  filtersTeamGroups: Record<string, boolean> = {};
  teamGroups: TeamGroups = {};
  hasTeamsFilter: boolean = false;
  maxLevel: number = 0;
  dimensionLabels: string[] = [];
  progressStates: string[] = [];
  allSectors: Sector[] = [];
  selectedSector: Sector | null = null;
  theme: string;
  theme_colors!: HeatmapColors;

  private destroy$ = new Subject<void>();

  constructor(
    private loader: LoaderService,
    private sectorService: SectorService,
    private settings: SettingsService,
    private themeService: ThemeService,
    private titleService: TitleService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public modal: ModalMessageComponent,
    private heatmapRenderer: D3HeatmapRenderer
  ) {
    this.theme = this.themeService.getTheme();
  }

  ngOnInit(): void {
    requestAnimationFrame(() => {
      // Now the DOM has the correct class and CSS vars are live
      console.log(`${perfNow()}s: ngOnInit: Initial theme:`, this.theme);
      const css = getComputedStyle(document.body);
      this.theme_colors = {
        background: css.getPropertyValue('--heatmap-background').trim(),
        filled: css.getPropertyValue('--heatmap-filled').trim(),
        disabled: css.getPropertyValue('--heatmap-disabled').trim(),
        cursor: css.getPropertyValue('--heatmap-cursor-hover').trim(),
        stroke: css.getPropertyValue('--heatmap-stroke').trim(),
      };
      console.debug(`${perfNow()}s: ngOnInit: Heatmap theme colors:`, this.theme_colors);
      if (!this.theme_colors['background'] || !this.theme_colors['filled']) {
        console.debug(css);
      }

      console.log(`${perfNow()}: Heat: Loading yamls...`);
      // Ensure that Levels and Teams load before MaturityData
      // using promises, since ngOnInit does not support async/await
      this.loader
        .load()
        .then((dataStore: DataStore) => {
          if (!dataStore.activityStore) {
            throw Error('No activityStore available');
          }
          if (!dataStore.progressStore) {
            throw Error('No progressStore available');
          }

          this.filtersTeams = this.buildFilters(dataStore.meta?.teams as string[]);
          // Insert key: 'All' with value: [], in the first position of the meta.teamGroups Record
          const allTeamsGroupName: string = dataStore.getMetaString('allTeamsGroupName') || 'All';
          this.teamGroups = { [allTeamsGroupName]: [], ...(dataStore.meta?.teamGroups || {}) };
          this.filtersTeamGroups = this.buildFilters(Object.keys(this.teamGroups));
          this.filtersTeamGroups[allTeamsGroupName] = true;

          let progressDefinition: ProgressDefinitions = dataStore.meta?.progressDefinition || {};
          this.sectorService.init(
            dataStore.progressStore,
            dataStore.meta?.teams || [],
            dataStore?.progressStore?.getProgressData() || {},
            progressDefinition
          );
          this.progressStates = this.sectorService.getProgressStates();

          this.setYamlData(dataStore);

          // For now, just draw the sectors (no activities yet)
          this.initializeHeatmap();
          console.log(`${perfNow()}: Page loaded: Circular Heatmap`);

          // Check if there's a URL fragment and open the corresponding activity
          this.checkUrlFragmentForActivity();
        })
        .catch(err => {
          this.displayMessage(new DialogInfo(err.message, 'An error occurred'));
          if (err.hasOwnProperty('stack')) {
            console.warn(err);
          }
        });
    });
    // Reactively handle theme changes (if user toggles later)
    this.themeService.theme$.pipe(takeUntil(this.destroy$)).subscribe((theme: string) => {
      console.log(`${perfNow()}s: themeService.pipe: Theme changed to:`, theme);
      const css = getComputedStyle(document.body);
      this.theme_colors = {
        background: css.getPropertyValue('--heatmap-background').trim(),
        filled: css.getPropertyValue('--heatmap-filled').trim(),
        disabled: css.getPropertyValue('--heatmap-disabled').trim(),
        cursor: css.getPropertyValue('--heatmap-cursor-hover').trim(),
        stroke: css.getPropertyValue('--heatmap-stroke').trim(),
      };
      console.debug(`${perfNow()}s: themeService.pipe: Heatmap theme colors:`, this.theme_colors);

      // Only update theme colors if renderer is initialized
      if (this.heatmapRenderer.isInitialized()) {
        this.heatmapRenderer.updateThemeColors(this.theme_colors);
        this.reColorHeatmap();
      }
    });
  }

  private initializeHeatmap() {
    this.heatmapRenderer.initialize(
      '#chart',
      {
        imageWidth: 1200,
        margin: 5,
        maxLevel: this.maxLevel,
        dimLabels: this.dimensionLabels,
        colors: this.theme_colors,
      },
      sector => this.getSectorProgress(sector)
    );

    this.heatmapRenderer.render(
      this.allSectors,
      {
        onClick: (sector, index, id) => {
          this.selectedSector = sector;
          if (this.selectedSector?.activities?.length) {
            this.heatmapRenderer.setSectorCursor('#selected', id);
            this.showActivityCard = this.selectedSector;
            console.log(
              `${perfNow()}: Heat: Clicked sector: '${this.selectedSector.dimension}' Level: ${
                this.selectedSector.level
              }`
            );
          } else {
            this.showActivityCard = null;
            this.heatmapRenderer.setSectorCursor('#selected', '');
            console.log(
              `${perfNow()}: Heat: Clicked disabled sector: '${
                this.selectedSector?.dimension
              }' Level: ${this.selectedSector?.level}`
            );
          }
        },
        onMouseOver: (sector, index, id) => {
          if (sector?.activities?.length) {
            this.heatmapRenderer.setSectorCursor('#hover', id);
            this.titleService.setTitle({
              level: sector.level,
              dimension: sector.dimension,
              // subdimension: sector.subdimension, // Sector interface doesn't have subdimension
            });
          } else {
            this.heatmapRenderer.setSectorCursor('#hover', '');
          }
        },
        onMouseOut: () => {
          this.heatmapRenderer.setSectorCursor('#hover', '');
          this.titleService.clearTitle();
        },
      },
      sector => this.getSectorProgress(sector)
    );
  }

  ngOnDestroy(): void {
    this.titleService.clearTitle();
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkUrlFragmentForActivity() {
    // Check if there's a URL fragment that might be an activity UUID
    this.route.fragment
      .pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe(fragment => {
        if (fragment && this.dataStore) {
          this.navigateToActivityByUuid(fragment);
        }
      });
  }

  displayMessage(dialogInfo: DialogInfo) {
    this.modal.openDialog(dialogInfo);
  }

  setYamlData(dataStore: DataStore) {
    this.dataStore = dataStore;
    this.maxLevel = this.settings?.getMaxLevel() || dataStore.getMaxLevel();
    this.dimensionLabels = dataStore?.activityStore?.getAllDimensionNames() || [];

    // Prepare all sectors: one for each (dimension, level) pair
    this.allSectors = [];
    for (let level = 1; level <= this.maxLevel; level++) {
      // let DEBUG_DIM_INDEX = 0;
      for (let dimName of this.dimensionLabels) {
        const activities: Activity[] =
          dataStore?.activityStore?.getActivities(dimName, level) || [];
        this.allSectors.push({
          dimension: dimName,
          // dimensionIndex: DEBUG_DIM_INDEX++,
          level: level,
          activities: activities,
        });
      }
    }
  }

  buildFilters(names: string[]): Record<string, boolean> {
    let filters: Record<string, boolean> = {};
    if (names) {
      for (let name of names) {
        filters[name] = false;
      }
    }
    return filters;
  }

  toggleTeamGroupFilter(chip: MatChip) {
    let teamGroup = chip.value.trim();
    if (!chip.selected) {
      chip.toggleSelected();
      console.log(`${perfNow()}: Heat: Chip flip Group '${teamGroup}: ${chip.selected}`);

      // Update the team selections based on the team group selection
      let selectedTeams: TeamName[] = [];
      Object.keys(this.filtersTeams).forEach(key => {
        this.filtersTeams[key] = this.teamGroups[teamGroup]?.includes(key) || false;
        if (this.filtersTeams[key]) {
          selectedTeams.push(key);
        }
        this.sectorService.setVisibleTeams(selectedTeams);
      });
      this.hasTeamsFilter = Object.values(this.filtersTeams).some(v => v === true);
      this.reColorHeatmap();
    } else {
      console.log(`${perfNow()}: Heat: Chip flip Group '${teamGroup}: already on`);
    }
  }

  toggleTeamFilter(chip: MatChip) {
    chip.toggleSelected();
    this.filtersTeams[chip.value.trim()] = chip.selected;
    console.log(`${perfNow()}: Heat: Chip flip Team '${chip.value}: ${chip.selected}`);

    this.hasTeamsFilter = Object.values(this.filtersTeams).some(v => v === true);

    let selectedTeams: string[] = Object.keys(this.filtersTeams).filter(
      key => this.filtersTeams[key]
    );
    this.sectorService.setVisibleTeams(selectedTeams);

    // Update team group filter, if one matches selection
    Object.keys(this.teamGroups || {}).forEach(group => {
      let match: boolean = equalArray(selectedTeams, this.teamGroups[group]);
      this.filtersTeamGroups[group] = match;
    });
    this.filtersTeamGroups = this.filtersTeamGroups;

    this.reColorHeatmap();
  }

  getTeamProgressState(activityUuid: string, teamName: string): string {
    return this.dataStore?.progressStore?.getTeamActivityTitle(activityUuid, teamName) || '';
  }

  getBackedupTeamProgressState(activityUuid: string, teamName: string): string {
    return this.dataStore?.progressStore?.getTeamActivityTitle(activityUuid, teamName, true) || '';
  }

  onProgressChange(activityUuid: Uuid, teamName: TeamName, newProgress: ProgressTitle) {
    if (!this.dataStore || !this.dataStore.progressStore || !this.dataStore.activityStore) {
      throw Error('Data store or progress store is not initialized.');
    }

    this.dataStore.progressStore.setTeamActivityProgressState(activityUuid, teamName, newProgress);
    let activity: Activity = this.dataStore.activityStore.getActivityByUuid(activityUuid);
    let index =
      this.dimensionLabels.indexOf(activity.dimension) +
      this.dimensionLabels.length * (activity.level - 1);

    this.recolorSector(index);
  }

  getSectorProgress(sector: Sector): number {
    return this.pinch(0.08, 0.8, this.sectorService.getSectorProgress(sector.activities));
  }

  pinch(min: number, max: number, value: number): number {
    if (value === 0 || value === 1) return value;

    return value * (max - min) + min;
  }

  onDependencyClicked(activityName: string) {
    console.log(`${perfNow()}: Heat: Dependency clicked: '${activityName}'`);
    const activity = this.dataStore?.activityStore?.getActivityByName(activityName);
    if (activity?.uuid) {
      this.navigateToActivityByUuid(activity.uuid);
    }
  }

  defineStringValues(dataToCheck: string, valueOfDataIfUndefined: string): string {
    try {
      return this.markdown.render(dataToCheck);
    } catch {
      return valueOfDataIfUndefined;
    }
  }

  onPanelOpened(activity: Activity) {
    console.log(`${perfNow()}: Heat: Card Panel opened: '${activity.name}'`);
  }
  onPanelClosed(activity: Activity) {
    console.log(`${perfNow()}: Heat: Card Panel closed: '${activity.name}'`);
  }

  openActivityDetails(uuid: string) {
    // Find the activity in the selected sector
    if (!this.dataStore || !this.dataStore.activityStore) {
      console.error(`Data store is not initialized. Cannot open activity ${uuid}`);
      return;
    }
    if (!this.showActivityCard || !this.showActivityCard.activities) {
      this.showOverlay = true;
      return;
    }

    const activity: Activity = this.dataStore.activityStore.getActivityByUuid(uuid);
    if (!activity) {
      this.showOverlay = true;
      return;
    }

    // Prepare navigationExtras and details
    /* eslint-disable */
    console.log(`${perfNow()}: Heat: Open Overlay: '${activity.name}'`);
    this.showActivityDetails = activity;
    this.showOverlay = true;

    // Update URL with activity UUID as fragment
    if (activity.uuid) {
      this.router.navigate([], {
        relativeTo: this.route,
        fragment: activity.uuid,
        queryParamsHandling: 'preserve'
      });
    }
    /* eslint-enable */
  }

  navigateToActivityByUuid(uuid: string) {
    console.log(`${perfNow()}: Heat: Attempting to open activity with UUID: ${uuid}`);
    if (!this.dataStore || !this.dataStore.activityStore) {
      console.error('Data store is not initialized. Cannot open activity by UUID');
      return;
    }
    const activity: Activity = this.dataStore.activityStore.getActivityByUuid(uuid);
    const sector = this.allSectors.find(s => s.activities.some(a => a.uuid === uuid));
    if (activity && sector) {
      this.selectedSector = sector;
      this.showActivityCard = sector;
      this.openActivityDetails(activity.uuid);
    } else {
      // Only close the overlay, do not update the URL
      this.showOverlay = false;
      console.warn(`Heat: Activity with UUID ${uuid} not found.`);
    }
  }

  closeOverlay() {
    // Clear the URL fragment when closing overlay
    this.router.navigate([], {
      relativeTo: this.route,
      fragment: undefined,
      queryParamsHandling: 'preserve',
    });
    this.showOverlay = false;
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  reColorHeatmap() {
    console.debug(`${perfNow()}s: Recoloring heatmap of ${this.allSectors.length} sectors`);
    for (let index = 0; index < this.allSectors.length; index++) {
      this.recolorSector(index);
    }
  }

  recolorSector(index: number) {
    let progressValue: number = this.getSectorProgress(this.allSectors[index]);
    if (progressValue)
      console.debug(
        `${perfNow()}s: recolorSector #${index} sector: ${progressValue.toFixed(2)} (${
          this.theme_colors.filled
        })`
      );

    this.heatmapRenderer.recolorSector(index, progressValue);
  }

  exportTeamProgress() {
    console.log(`${perfNow()}: Exporting teams and groups`);

    let yamlStr: string | null = this.dataStore?.progressStore?.asYamlString() || null;
    if (!yamlStr) {
      this.displayMessage(new DialogInfo('No team progress data available', 'Export Error'));
      return;
    }

    downloadYamlFile(yamlStr, this.dataStore?.meta?.teamProgressFile || 'team-progress.yaml');
  }

  async deleteLocalTeamsProgress() {
    let buttonClicked: string = await this.displayDeleteLocalProgressDialog();

    if (buttonClicked === 'Delete') {
      this.dataStore?.progressStore?.deleteBrowserStoredTeamProgress();
      location.reload(); // Make sure all load routines are initialized
    }
  }

  displayDeleteLocalProgressDialog(): Promise<string> {
    return new Promise((resolve, reject) => {
      let title: string = 'Delete local browser data';
      let message: string =
        'Do you want to delete all progress for each team?' +
        '\n\nThis deletes all progress stored in your local browser, but does ' +
        'not change any progress stored in the yaml file on the server.';
      let buttons: string[] = ['Cancel', 'Delete'];
      this.modal
        .openDialog({ title, message, buttons, template: '' })
        .afterClosed()
        .subscribe(data => {
          resolve(data);
        });
    });
  }

  getDatasetFromBrowserStorage(): Sector[] | null {
    console.log(`${perfNow()}s: getDatasetFromBrowserStorage() ####`);
    // @ts-ignore
    if (this.old_ALL_CARD_DATA?.length && this.old_ALL_CARD_DATA[0]?.Task != null) {
      console.log('Found outdated dataset, removing');
      localStorage.removeItem('dataset');
    }

    var content = localStorage.getItem('dataset');
    if (content != null) {
      return JSON.parse(content);
    }
    return null;
  }

  unsorted() {
    return 0;
  }
}
