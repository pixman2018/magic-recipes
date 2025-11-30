import { computed, Injectable, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { VERSION } from '@angular/core';
import { version } from '../../../../package.json';
import { I_Settings } from '../../models/settings';
/**
 *
 * The SettingService provides global methods for configuring the page. The results are stored in Signal and localStorage.
 *
 * @export
 * @class SettingsService
 * @implements {OnInit}
 *
 * @property
 * @private _settings
 * The object contains all settings.
 *
 * @method
 * @public getSettings()
 * @public toggleTheme()
 * @private _createDefaultSettings()
 */
@Injectable({
  providedIn: 'root',
})
export class SettingsService implements OnInit {
  private _settings: WritableSignal<I_Settings> = signal<I_Settings>(this._createDefaultSettings());

  /**
   *
   * @description
   * Checks whether the settings are in local storage; if not, they are set to a default value.
   *
   * @public
   * @returns void
   *
   */
  public ngOnInit(): void {
    const settingsString: string | null = localStorage.getItem('settings');
    if (settingsString) {
      this._settings.set(JSON.parse(settingsString));
    } else {
      localStorage.setItem('settings', JSON.stringify(this._createDefaultSettings()));
      this._settings.set(this._createDefaultSettings());
    }
  }

  /**
   *
   * @description
   * returns the signal “settings” as read-only
   *
   * @public
   * @returns Signal from the interface I_Settings
   *
   */
  public getSettings(): Signal<I_Settings> {
    return this._settings.asReadonly();
    // return computed(() => this._settings());
  }

  /**
   *
   * @description
   * Changes the value of “Darkmode” and writes it to the signal and localStorage.
   *
   * @public
   * @returns void
   *
   */
  public toggleTheme(): void {
    const newSetting = this._settings();
    newSetting.isDarkMode = !newSetting.isDarkMode;
    const attribute = newSetting.isDarkMode ? 'dark' : 'light';
    this._settings.set(newSetting);
    localStorage.setItem('settings', JSON.stringify(newSetting));
    document.querySelector('html')?.setAttribute('data-theme', attribute);
  }

  /**
   *
   * @description
   * Creates a default object from settings
   *
   * @private
   * @returns DEfault Setting Object
   *
   */
  private _createDefaultSettings(): I_Settings {
    const versionTmp = version.split('.');
    return {
      isDarkMode: false,
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
  }
}
