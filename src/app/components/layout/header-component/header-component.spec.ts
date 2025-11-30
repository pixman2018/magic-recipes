import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header-component';
import { provideZonelessChangeDetection, Signal, signal, WritableSignal } from '@angular/core';
import { MainNavComponent } from '../../ui/main-nav/main-nav-component';
import { SettingsService } from '../../../services/settingsService/settings.service';
import { VERSION } from '@angular/core';
import { version } from '../../../../../package.json';
import { I_Settings } from '../../../models/settings';
import { provideRouter } from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockSettingStore: jasmine.SpyObj<SettingsService>;
  let mockSignal: WritableSignal<I_Settings>;

  const versionTmp = version.split('.');
  const initialSettings: I_Settings = {
    isDarkMode: true,
    angular: {
      major: parseInt(VERSION.major),
      minor: parseInt(VERSION.minor),
      patch: parseInt(VERSION.patch),
      full: VERSION.full,
    },
    version: {
      major: parseInt(versionTmp[0]),
      minor: parseInt(versionTmp[1]),
      patch: parseInt(versionTmp[2]),
      full: version,
    },
  };

  beforeEach(async () => {
    mockSignal = signal<I_Settings>({ ...initialSettings });
    mockSettingStore = jasmine.createSpyObj<SettingsService>('SettingsStore', [
      'toggleTheme',
      'getSettings',
    ]);
    mockSettingStore.getSettings.and.returnValue(mockSignal);
    mockSettingStore.toggleTheme.and.callFake(() => {
      const current = mockSignal();
      mockSignal.set({ ...current, isDarkMode: !current.isDarkMode });
    });

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, MainNavComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: SettingsService, useValue: mockSettingStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set showSearchbar = true when pagename is null in constructor', () => {
    expect(component['navigationOptions'].showSearchbar).toBeTrue();
    expect(component['navigationOptions'].pagename).toBeNull();
  });

  it('onShowSearch should update navigationOptions', () => {
    const options = { showSearchbar: false, pagename: 'Dashboard' };
    component['onShowSearch'](options);

    expect(component['navigationOptions']).toEqual(options);
  });
});
