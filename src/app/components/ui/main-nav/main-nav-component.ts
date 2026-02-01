import { Component, OnInit, output, signal } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
// interfaces
import { I_NavigationOptions } from '../../../models/options.model';

@Component({
  selector: 'app-main-nav',
  standalone: true,
  imports: [RouterLink, RouterModule],
  templateUrl: './main-nav-component.html',
  styleUrl: './main-nav-component.scss',
  host: {
    '(window:resize)': 'onSetViewport($event)',
  },
})
export class MainNavComponent implements OnInit {
  handleShowSearch = output<I_NavigationOptions>();

  protected viewportWidth = signal(0);

  protected isMobile: boolean = false;
  protected showNavigation: boolean = false;

  ngOnInit(): void {
    this.onSetViewport();
  }

  /**
   *
   * @description
   * Displays the menu when you click on the hamburger button.
   *
   * @protected
   * @returns void
   *
   */
  protected onShowNav(): void {
    this.showNavigation = true;
  }

  /**
   *
   * @description
   * Hides the menu when you click on the hamburger button
   *
   * @protected
   * @returns void
   *
   */
  protected onHiddenNav(): void {
    this.showNavigation = false;
  }

  /**
   *
   * @description
   * Checks whether the viewport is <= 639
   *
   * @returns boolean
   *
   */
  protected isMobileViewport(): boolean {
    return this.viewportWidth() <= 639;
  }

  /**
   *
   * @description
   * Output binding ‘handleShowSearch’ specifies whether the search bar should be displayed or not.
   * The name of the current page is also displayed.
   *
   * @param show
   * show the Searchbar or not
   * @param pagename
   * the name of the current page
   *
   */
  protected onShowSearchbar(show: boolean, pagename: string): void {
    this.onHiddenNav();
    this.handleShowSearch.emit({ showSearchbar: show, pagename });
  }

  /**
   *
   * @description
   * Sets the values for the viewport
   * - viewportWidth
   * - isMobile
   * - showNavigation
   *
   * @param event UIEvent
   * Optional from the event 'window:resize'
   * @returns void
   *
   */
  protected onSetViewport(event?: UIEvent): void {
    this.viewportWidth.set(window.innerWidth);
    this.isMobile = this.isMobileViewport();
    this.showNavigation = this.isMobile ? false : true;
  }
}
