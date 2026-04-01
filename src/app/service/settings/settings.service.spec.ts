import { TestBed } from '@angular/core/testing';
import { SettingsService, LabelParts } from './settings.service';

describe('SettingsService', () => {
  let service: SettingsService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingsService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('parseLabelParts', () => {
    it('should parse a simple label without pipe', () => {
      const result: LabelParts = SettingsService.parseLabelParts('Team');
      expect(result).toEqual({ singular: 'Team', plural: 'Teams' });
    });

    it('should parse a pipe-separated label', () => {
      const result: LabelParts = SettingsService.parseLabelParts('Industry|Industries');
      expect(result).toEqual({ singular: 'Industry', plural: 'Industries' });
    });

    it('should handle empty string', () => {
      const result: LabelParts = SettingsService.parseLabelParts('');
      expect(result).toEqual({ singular: '', plural: '' });
    });

    it('should handle pipe with empty plural (fallback to +s)', () => {
      const result: LabelParts = SettingsService.parseLabelParts('App|');
      expect(result).toEqual({ singular: 'App', plural: 'Apps' });
    });

    it('should trim whitespace', () => {
      const result: LabelParts = SettingsService.parseLabelParts(' Client | Clients ');
      expect(result).toEqual({ singular: 'Client', plural: 'Clients' });
    });
  });

  describe('encodeLabelParts', () => {
    it('should encode without pipe when plural is default +s', () => {
      expect(SettingsService.encodeLabelParts('Team', 'Teams')).toBe('Team');
    });

    it('should encode with pipe when plural is custom', () => {
      expect(SettingsService.encodeLabelParts('Industry', 'Industries')).toBe(
        'Industry|Industries'
      );
    });

    it('should encode without pipe when plural is empty', () => {
      expect(SettingsService.encodeLabelParts('App', '')).toBe('App');
    });
  });

  describe('migrateOldKeys', () => {
    it('should migrate legacy team label key', () => {
      localStorage.clear();
      localStorage.setItem('settings.teamLabel', JSON.stringify('Client'));
      // Create a new service instance to trigger migration
      const freshService = new SettingsService();
      expect(localStorage.getItem('settings.teamLabel')).toBeNull();
      expect(freshService.getTeamLabel()).toBe('Client');
    });

    it('should migrate legacy group label key', () => {
      localStorage.clear();
      localStorage.setItem('settings.groupLabel', JSON.stringify('Portfolio'));
      const freshService = new SettingsService();
      expect(localStorage.getItem('settings.groupLabel')).toBeNull();
      expect(freshService.getGroupLabel()).toBe('Portfolio');
    });

    it('should not overwrite existing consolidated key', () => {
      localStorage.clear();
      localStorage.setItem('settings.labels', JSON.stringify({ team: 'Existing', group: '' }));
      localStorage.setItem('settings.teamLabel', JSON.stringify('ShouldBeIgnored'));
      const freshService = new SettingsService();
      expect(freshService.getTeamLabel()).toBe('Existing');
    });
  });

  describe('initFromMeta', () => {
    it('should set meta defaults for team and group', () => {
      service.initFromMeta({
        team: 'App',
        group: 'Portfolio|Portfolios',
        allTeamsGroupName: 'All',
        labels: [],
        maturityLevels: [],
        knowledgeLabels: [],
      });
      // Without any localStorage override, getters should return meta defaults
      expect(service.getTeamLabel()).toBe('App');
      expect(service.getTeamLabelPlural()).toBe('Apps');
      expect(service.getGroupLabel()).toBe('Portfolio');
      expect(service.getGroupLabelPlural()).toBe('Portfolios');
    });

    it('should be overridden by localStorage values', () => {
      service.initFromMeta({
        team: 'App',
        group: 'Portfolio',
        allTeamsGroupName: 'All',
        labels: [],
        maturityLevels: [],
        knowledgeLabels: [],
      });
      service.setTeamLabel('Client', 'Clients');
      expect(service.getTeamLabel()).toBe('Client');
      expect(service.getTeamLabelPlural()).toBe('Clients');
    });
  });

  describe('Consolidated labels round-trip', () => {
    it('should store and retrieve team label', () => {
      service.setTeamLabel('App');
      expect(service.getTeamLabel()).toBe('App');
      expect(service.getTeamLabelPlural()).toBe('Apps');
    });

    it('should store and retrieve team label with custom plural', () => {
      service.setTeamLabel('Category', 'Categories');
      expect(service.getTeamLabel()).toBe('Category');
      expect(service.getTeamLabelPlural()).toBe('Categories');
    });

    it('should store and retrieve group label', () => {
      service.setGroupLabel('Division');
      expect(service.getGroupLabel()).toBe('Division');
      expect(service.getGroupLabelPlural()).toBe('Divisions');
    });

    it('should store and retrieve group label with custom plural', () => {
      service.setGroupLabel('Industry', 'Industries');
      expect(service.getGroupLabel()).toBe('Industry');
      expect(service.getGroupLabelPlural()).toBe('Industries');
    });

    it('should use localStorage key settings.labels', () => {
      service.setTeamLabel('Foo');
      service.setGroupLabel('Bar', 'Bars');
      const stored = JSON.parse(localStorage.getItem('settings.labels')!);
      expect(stored.team).toBe('Foo');
      expect(stored.group).toBe('Bar');
    });

    it('should clear labels from localStorage when reset to default', () => {
      service.setTeamLabel('Custom');
      expect(localStorage.getItem('settings.labels')).not.toBeNull();
      service.setTeamLabel('Team');
      service.setGroupLabel('Group');
      expect(localStorage.getItem('settings.labels')).toBeNull();
    });
  });

  describe('General Settings Operations', () => {
    it('should handle empty string settings', () => {
      service.saveSettings('test.key', '');
      expect(localStorage.getItem('test.key')).toBeNull();
    });

    it('should handle empty array settings', () => {
      service.saveSettings('test.key', []);
      expect(localStorage.getItem('test.key')).toBeNull();
    });

    it('should handle empty object settings', () => {
      service.saveSettings('test.key', {});
      expect(localStorage.getItem('test.key')).toBeNull();
    });

    it('should properly store and retrieve number settings', () => {
      localStorage.setItem('test.key', '42');
      expect(service.getSettingsNumber('test.key')).toBe(42);
    });

    it('should return null for non-existent number settings', () => {
      expect(service.getSettingsNumber('nonexistent.key')).toBeNull();
    });

    it('should handle complex object settings', () => {
      const complexObj = {
        key1: 'value1',
        key2: 42,
        nested: { prop: true },
      };
      service.saveSettings('test.complex', complexObj);
      expect(service.getSettings('test.complex')).toEqual(complexObj);
    });
  });
});
