import { Component, inject, Signal } from '@angular/core';

// interface
import { I_NavigationOptions } from '../../../models/options';
import { I_Settings } from '../../../models/settings';
// service
import { SettingsService } from '../../../services/settingsService/settings.service';
// components
import { MainNavComponent } from '../../ui/main-nav/main-nav-component';
import { FilterComponent } from '../../ui/filter/filter';
import { SearchBarComponent } from '../../ui/search-bar.component/search-bar.component';
import { ToogleTheme } from '../../ui/toogle-theme/toogle-theme';

/**
 * This is the parent component at the top of the page.
 * The child components are the ‘mainnav’, ‘searchbar’, and ‘filter’ components.
 *
 * It also controls when the search bar and filter components are displayed
 * and ensures that the correct categories are provided.
 *
 * Furthermore, you can switch from dark to light mode here.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MainNavComponent, SearchBarComponent, FilterComponent, ToogleTheme],
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss',
})
export class HeaderComponent {
  protected navigationOptions: I_NavigationOptions = { showSearchbar: false, pagename: null };

  constructor() {
    // Standard setting for displaying the search bar
    if (this.navigationOptions.pagename === null) {
      this.navigationOptions.showSearchbar = true;
    }
  }

  /**
   *
   * @description
   * Retrieves the options from the child component “mainnav.” These options control the display
   * of the search bar and filter component and the provision of categories in the filter (recipe or ingredient).
   *
   * @protected
   * @param navigationOptions
   * @returns void
   *
   */
  protected onShowSearch(navigationOptions: I_NavigationOptions): void {
    this.navigationOptions.showSearchbar = navigationOptions.showSearchbar;
    this.navigationOptions.pagename = navigationOptions.pagename;
  }
}
