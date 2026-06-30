import { Component, OnInit, signal, computed } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '../../service/loader/data-loader.service';
import { SettingsService } from '../../service/settings/settings.service';
import {
  Activity,
  DifficultyOfImplementation,
  Implementation,
  ActivityStore,
} from '../../model/activity-store';
import { MarkdownText } from '../../model/markdown-text';
import { DataStore } from '../../model/data-store';
import { ProgressStore } from '../../model/progress-store';
import { ReportConfig, getReportConfig, saveReportConfig } from '../../model/report-config';
import {
  ReportConfigModalComponent,
  ReportConfigModalData,
} from '../../component/report-config-modal/report-config-modal.component';
import { ProgressTitle, TeamGroups } from '../../model/types';
import { EvidenceEntry } from '../../model/evidence-store';
import { DatePipe, NgIf, NgFor } from '@angular/common';
import {
  ViewEvidenceModalComponent,
  ViewEvidenceModalData,
} from '../../component/view-evidence-modal/view-evidence-modal.component';
import { dialogSizeConfig } from '../../util/dialog-sizes';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ColResizeDirective } from '../../directive/col-resize.directive';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TeamSelectorComponent } from '../../component/team-selector/team-selector.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TopHeaderComponent } from '../../component/top-header/top-header.component';

export interface ReportSubDimension {
  name: string;
  activities: Activity[];
}

export interface ReportDimension {
  name: string;
  subDimensions: ReportSubDimension[];
}

export interface LevelOverview {
  level: number;
  totalActivities: number;
  completedCount: number;
  completionPercent: number;
}

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  providers: [DatePipe],
  standalone: true,
  imports: [
    TopHeaderComponent,
    MatButtonModule,
    MatIconModule,
    NgIf,
    TeamSelectorComponent,
    MatProgressSpinnerModule,
    NgFor,
    ColResizeDirective,
    MatTooltipModule,
  ],
})
export class ReportComponent implements OnInit {
  reportConfig = signal<ReportConfig>(getReportConfig());
  allActivities = signal<Activity[]>([]);
  isLoading: boolean = true;

  // For the config modal
  allDimensionNames: string[] = [];
  allSubdimensionNames: string[] = [];
  allTeams: string[] = [];
  teamGroups: TeamGroups = {};

  allProgressTitles: ProgressTitle[] = [];

  maxLevelFromSettings: number = 0;

  private activityStore: ActivityStore | null = null;

  filteredDimensions = computed<ReportDimension[]>(() => {
    const config = this.reportConfig();
    const all = this.allActivities();

    // Filter activities using hierarchical exclusion
    const filtered = all.filter(activity => {
      if (config.excludedDimensions.includes(activity.category)) return false;
      if (config.excludedSubdimensions.includes(activity.dimension)) return false;
      if (config.excludedActivities.includes(activity.uuid)) return false;
      return true;
    });

    // Group by dimension (category) → subdimension (dimension)
    const dimensionMap = new Map<string, Map<string, Activity[]>>();

    for (const activity of filtered) {
      if (!dimensionMap.has(activity.category)) {
        dimensionMap.set(activity.category, new Map<string, Activity[]>());
      }
      const subMap = dimensionMap.get(activity.category)!;
      if (!subMap.has(activity.dimension)) {
        subMap.set(activity.dimension, []);
      }
      subMap.get(activity.dimension)!.push(activity);
    }

    const result: ReportDimension[] = [];
    const sortedDimensions = Array.from(dimensionMap.keys()).sort();
    for (const dimName of sortedDimensions) {
      const subMap = dimensionMap.get(dimName)!;
      const subDimensions: ReportSubDimension[] = [];
      const sortedSubDimensions = Array.from(subMap.keys()).sort();

      for (const subDimName of sortedSubDimensions) {
        const activities = subMap.get(subDimName)!;
        activities.sort((a, b) => {
          if (a.level !== b.level) return a.level - b.level;
          return a.name.localeCompare(b.name);
        });
        subDimensions.push({ name: subDimName, activities });
      }
      result.push({ name: dimName, subDimensions });
    }
    return result;
  });

  levelByLevelOverviewFromActivties = computed<LevelOverview[]>(() => {
    const config = this.reportConfig();
    const dims = this.filteredDimensions();

    const activities: Activity[] = [];
    for (const dim of dims) {
      for (const sub of dim.subDimensions) {
        activities.push(...sub.activities);
      }
    }

    const levelMap = new Map<number, { total: number; completed: number }>();

    for (const activity of activities) {
      if (!levelMap.has(activity.level)) {
        levelMap.set(activity.level, { total: 0, completed: 0 });
      }
      const entry = levelMap.get(activity.level)!;
      entry.total++;

      if (config.selectedTeams.length > 0) {
        const allCompleted = config.selectedTeams.every(team =>
          this.isActivityCompletedByTeam(activity, team)
        );
        if (allCompleted) {
          entry.completed++;
        }
      }
    }

    return Array.from(levelMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([level, data]) => ({
        level,
        totalActivities: data.total,
        completedCount: data.completed,
        completionPercent: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
      }));
  });

  totalFilteredActivities = computed(() => {
    let count = 0;
    for (const dim of this.filteredDimensions()) {
      for (const sub of dim.subDimensions) {
        count += sub.activities.length;
      }
    }
    return count;
  });

  constructor(
    private loader: LoaderService,
    private settings: SettingsService,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadActivities();
  }

  get progressStore(): ProgressStore | undefined {
    return this.loader.datastore?.progressStore ?? undefined;
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

        this.maxLevelFromSettings = this.settings.getMaxLevel() || dataStore.getMaxLevel();
        const activities = dataStore.activityStore.getAllActivitiesUpToLevel(
          this.maxLevelFromSettings
        );
        this.activityStore = dataStore.activityStore;

        const dimensionSet = new Set<string>();
        const subdimensionSet = new Set<string>();

        for (const activity of activities) {
          dimensionSet.add(activity.category);
          subdimensionSet.add(activity.dimension);
        }

        this.allDimensionNames = Array.from(dimensionSet).sort();
        this.allSubdimensionNames = Array.from(subdimensionSet).sort();
        this.allTeams = dataStore?.meta?.teams || [];
        this.teamGroups = dataStore?.meta?.teamGroups || {};

        if (dataStore.progressStore) {
          const inProgress = dataStore.progressStore.getInProgressTitles();
          const completed = dataStore.progressStore.getCompletedProgressTitle();
          this.allProgressTitles = [...inProgress, completed].filter(t => !!t);
        }

        const currentConfig = this.reportConfig();
        if (currentConfig.selectedTeams.length === 0 && this.allTeams.length > 0) {
          this.reportConfig.set({ ...currentConfig, selectedTeams: [...this.allTeams] });
        }

        this.allActivities.set(activities);
        this.isLoading = false;
      })
      .catch(err => {
        console.error('Error loading activities for report:', err);
        this.isLoading = false;
      });
  }

  // --- Progress helpers ---

  isActivityCompletedByTeam(activity: Activity, teamName: string): boolean {
    if (!this.progressStore || !activity.uuid) return false;
    const completedTitle = this.progressStore.getCompletedProgressTitle();
    if (!completedTitle) return false;
    const teamTitle = this.progressStore.getTeamProgressTitle(activity.uuid, teamName);

    return teamTitle === completedTitle;
  }

  getTeamProgressName(activity: Activity, teamName: string): string {
    if (!this.progressStore || !activity.uuid) return '';
    return this.progressStore.getTeamActivityTitle(activity.uuid, teamName);
  }

  getTeamsForProgress(activity: Activity, progressTitle: ProgressTitle): string {
    if (!this.progressStore || !activity.uuid) return '';
    const teams: string[] = [];
    for (const team of this.reportConfig().selectedTeams) {
      const teamTitle = this.progressStore.getTeamProgressTitle(activity.uuid, team);
      if (teamTitle === progressTitle) {
        teams.push(team);
      }
    }
    return teams.join(', ') || '—';
  }

  truncateWords(text: any, max: number): string {
    if (!text) return '';
    const str = String(text);
    const words = str.split(/\s+/);
    if (words.length <= max) return str;
    return words.slice(0, max).join(' ') + '...';
  }

  renderCappedDescription(description: any, wordCap: number): string {
    if (!description) return '';
    // First, render the full markdown
    const rendered = new MarkdownText(String(description)).render();
    // Then, apply the word cap on the rendered HTML
    const container = document.createElement('div');
    container.innerHTML = rendered;
    const textContent = (container.textContent || '').trim();
    const words = textContent.split(/\s+/).filter(w => w.length > 0);

    if (words.length <= wordCap) {
      return rendered;
    }

    // Truncate text nodes in the DOM, preserving HTML structure
    let remaining = wordCap;
    const truncateNode = (node: Node): boolean => {
      if (remaining <= 0) {
        node.parentNode?.removeChild(node);
        return true;
      }
      if (node.nodeType === Node.TEXT_NODE) {
        const nodeWords = (node.textContent || '').split(/\s+/).filter(w => w.length > 0);
        if (nodeWords.length <= remaining) {
          remaining -= nodeWords.length;
          return false;
        }
        node.textContent = nodeWords.slice(0, remaining).join(' ') + '…';
        remaining = 0;
        return false;
      }
      // Element node — walk children
      const children = Array.from(node.childNodes);
      for (const child of children) {
        truncateNode(child);
      }
      return false;
    };
    truncateNode(container);

    return container.innerHTML;
  }

  openConfigModal(): void {
    const modalData: ReportConfigModalData = {
      config: this.reportConfig(),
      allActivities: this.allActivities(),
      allTeams: this.allTeams,
      allDimensions: this.allDimensionNames,
      allSubdimensions: this.allSubdimensionNames,
      allProgressTitles: this.allProgressTitles,
      teamGroups: this.loader.datastore?.meta?.teamGroups || {},
    };

    const dialogRef = this.dialog.open(ReportConfigModalComponent, {
      ...dialogSizeConfig('lg'),
      data: modalData,
    });

    dialogRef.afterClosed().subscribe((result: ReportConfig | null) => {
      if (result) {
        this.reportConfig.set(result);
        saveReportConfig(result);
      }
    });
  }

  onTeamsChanged(teams: string[]): void {
    const updated = { ...this.reportConfig(), selectedTeams: teams };
    this.reportConfig.set(updated);
    saveReportConfig(updated);
  }

  printReport(): void {
    const menuAlert: Boolean = localStorage.getItem('state.menuIsOpen') === 'true';
    const darkModeAlert: Boolean = localStorage.getItem('theme') === 'dark';

    if (menuAlert || darkModeAlert) {
      alert(
        `${menuAlert ? '- Please close the app Menu before printing.\n' : ''}${
          darkModeAlert ? '- Please enable Light Mode before printing.\n' : ''
        }`
      );
    } else window.print();
  }

  formatTags(tags: string[]): string {
    if (!tags || tags.length === 0) return '—';
    return tags.join(', ');
  }

  formatDifficulty(d: DifficultyOfImplementation): string {
    if (!d) return '—';
    const parts: string[] = [];
    if (d.knowledge != null) parts.push(`K:${d.knowledge}`);
    if (d.time != null) parts.push(`T:${d.time}`);
    if (d.resources != null) parts.push(`R:${d.resources}`);
    return parts.length > 0 ? parts.join(' / ') : '—';
  }

  formatRefList(refs: string[] | undefined): string {
    if (!refs || refs.length === 0) return '—';
    return refs.join(', ');
  }

  formatReferences(refs: any): string {
    if (!refs) return '—';
    const attrs = this.reportConfig().activityAttributes;
    const pairs: string[] = [];

    const renderItems = (key: string, items: any[] | undefined): void => {
      if (!items || items.length === 0) return;

      const plainItems = items.map(raw => String(raw));
      const formatted = plainItems.map(item => {
        if (item.startsWith('http://') || item.startsWith('https://')) {
          return `<a href="${item}" target="_blank" rel="noopener" class="ref-link">↗</a>`;
        }
        return item;
      });

      pairs.push(`${key}: <abbr title="${plainItems.join(', ')}">${formatted.join(', ')}</abbr>`);
    };

    if (attrs.showReferencesIso27001_2017) renderItems('iso27001-2017', refs.iso27001_2017);
    if (attrs.showReferencesIso27001_2022) renderItems('iso27001-2022', refs.iso27001_2022);
    if (attrs.showReferencesSamm2) renderItems('samm2', refs.samm2);
    if (attrs.showReferencesOpenCRE) renderItems('openCRE', refs.openCRE);

    return pairs.length > 0 ? `${pairs.join(', ')}` : '—';
  }

  formatImplementation(impls: Implementation[] | undefined): string {
    if (!impls || impls.length === 0) return '—';
    const items = impls.map(impl => {
      const namePart = impl.name || '?';
      const linkPart = impl.url
        ? ` <a href="${impl.url}" target="_blank" rel="noopener" title="${impl.url}" class="ref-link">↗</a>`
        : '';
      return `${namePart}${linkPart}`;
    });
    return items.join(', ');
  }

  formatDependsOn(deps: string[] | undefined): string {
    if (!deps || deps.length === 0) return '—';
    const items = deps.map(dep => {
      if (this.activityStore) {
        const resolved = this.activityStore.getActivityByName(dep);
        if (resolved && resolved.uuid) {
          return `${dep} (${resolved.uuid.substring(0, 8)})`;
        }
      }
      return dep;
    });
    return items.join(', ');
  }

  formatEvidence(activity: Activity): string {
    const evidenceStore = this.loader.datastore?.evidenceStore;
    if (!evidenceStore || !activity.uuid || !evidenceStore.hasEvidence(activity.uuid)) {
      return '—';
    }

    const allEntries: EvidenceEntry[] = evidenceStore.getEvidence(activity.uuid);
    const attrs = this.reportConfig().activityAttributes;
    const selectedTeams = this.reportConfig().selectedTeams;

    const entries = allEntries.filter(entry => entry.teams.some(t => selectedTeams.includes(t)));

    if (entries.length === 0) return '—';

    const parts = entries.map(entry => {
      const items: string[] = [];

      if (attrs.showEvidenceTitle && entry.title) {
        items.push(`${entry.title}`);
      }
      if (attrs.showEvidenceDescription && entry.description) {
        items.push(`<span class="evidence-desc">${entry.description}</span>`);
      }
      if (attrs.showEvidenceDate && entry.evidenceRecorded) {
        items.push(
          `<span class="evidence-meta"><strong>Date: </strong>${this.datePipe.transform(
            entry.evidenceRecorded,
            'mediumDate'
          )}</span>`
        );
      }
      if (attrs.showEvidenceReviewer && entry.reviewer) {
        items.push(
          `<span class="evidence-meta"><strong>Reviewer: </strong>${entry.reviewer}</span>`
        );
      }
      if (attrs.showEvidenceAttachments && entry.attachment?.length) {
        const links = entry.attachment.map(
          a =>
            `<a href="${a.externalLink}" target="_blank" rel="noopener" class="ref-link">${a.type} ↗</a>`
        );
        items.push(links.join(' '));
      }

      // Show only the selected teams for this entry
      const matchingTeams = entry.teams.filter(t => selectedTeams.includes(t));
      const teamsLabel =
        matchingTeams.length > 0
          ? `<span class="evidence-teams">[${matchingTeams.join(', ')}]</span> `
          : '';

      return `<div class="evidence-item"><strong>${teamsLabel}</strong>${items.join(' · ')}</div>`;
    });

    return parts.join('');
  }

  openViewEvidenceModal(activityUuid: string, activityName: string): void {
    const dialogData: ViewEvidenceModalData = {
      activityUuid,
      activityName,
    };

    this.dialog.open(ViewEvidenceModalComponent, {
      ...dialogSizeConfig('md'),
      data: dialogData,
    });
  }
}
