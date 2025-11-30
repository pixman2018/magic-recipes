import { TestBed } from '@angular/core/testing';

import { SettingsService } from './settings.service';
import { isDevMode, provideZonelessChangeDetection } from '@angular/core';

describe('SettingsStore', () => {
  let service: SettingsService;

  beforeEach(() => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');

    TestBed.configureTestingModule({
      providers: [SettingsService, provideZonelessChangeDetection()],
    });

    service = TestBed.inject(SettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should toggle the dark mode setting and save it to localStorage', () => {
    // Init isDarkMode false
    expect(service.getSettings()().isDarkMode).toBeFalse();

    service.toggleTheme();

    expect(service.getSettings()().isDarkMode).toBeTrue();

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'settings',
      JSON.stringify(service.getSettings()())
    );
  });

  it('should The value of getSettings()  be equal to the value of _signal', () => {
    const settingsMethod = service.getSettings()();
    const settingsSignal = service['_settings']();
    expect(settingsMethod.isDarkMode).toEqual(settingsSignal.isDarkMode);
    expect(settingsMethod.angular.full).toEqual(settingsSignal.angular.full);
    expect(settingsMethod.version.full).toEqual(settingsSignal.version.full);
  });
});
