import { Component, inject, OnDestroy, OnInit, Signal } from '@angular/core';

// interface
import { I_NavigationOptions } from '../../../models/options.model';
import { I_Settings } from '../../../models/settings.model';
// service
import { SettingsService } from '../../../services/settingsService/settings.service';
// components
import { MainNavComponent } from '../../ui/main-nav/main-nav-component';
import { FilterComponent } from '../../ui/filter/filter';
import { SearchBar } from '../../ui/search-bar/search-bar/search-bar';
import { ToogleTheme } from '../../ui/toogle-theme/toogle-theme';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, Subscription, tap } from 'rxjs';

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
  imports: [MainNavComponent, SearchBar, FilterComponent, ToogleTheme],
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);

  private _routerEventSub = new Subscription();
  protected navigationOptions: I_NavigationOptions = { showSearchbar: false, pagename: null };

  ngOnInit() {
    this._getPagename();
  }

  ngOnDestroy(): void {
    this._routerEventSub.unsubscribe();
  }

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

  /**
   *
   * @description
   * Retrieves the page name from the active route. If it is a redirect,
   * the page name must be retrieved from the router events observable.
   *
   * @returns void
   *
   */
  private _getPagename(): void {
    const path = this._route.routeConfig?.path;
    if (path) {
      this.navigationOptions.pagename = path;
    } else {
      const event$ = this._router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          if (event.urlAfterRedirects) {
            this.navigationOptions.pagename = event.urlAfterRedirects.split('/')[1];
          }
        });

      this._routerEventSub.add(event$);
    }
  }
}
