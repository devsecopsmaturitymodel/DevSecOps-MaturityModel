import { TestBed } from '@angular/core/testing';
import { SettingsService } from './settings.service';

describe('SettingsService', () => {
  let service: SettingsService;
  let localStorageSpy: any;

  beforeEach(() => {
    // Clear all mocks and create fresh instance for each test
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingsService);
    localStorageSpy = spyOn(localStorage, 'setItem').and.callThrough();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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
