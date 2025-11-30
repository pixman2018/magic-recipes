import { Component, inject, Signal } from '@angular/core';
import { SettingsService } from '../../../services/settingsService/settings.service';
import { I_Settings } from '../../../models/settings';

@Component({
  selector: 'app-toogle-theme',
  imports: [],
  templateUrl: './toogle-theme.html',
  styleUrl: './toogle-theme.scss',
})
export class ToogleTheme {
  private _settingsService = inject(SettingsService);

  private _settings: Signal<I_Settings> = this._settingsService.getSettings();
  protected isDark = this._settings().isDarkMode;

  /**
   *
   * @description
   * switches from dark to light mode
   *
   * @protected
   * @returns void
   *
   */
  protected toggleTheme(): void {
    this._settingsService.toggleTheme();
    this.isDark = this._settings().isDarkMode;
  }
}
