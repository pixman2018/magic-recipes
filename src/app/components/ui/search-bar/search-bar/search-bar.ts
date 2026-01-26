import { Component, inject, input, signal } from '@angular/core';
import { SearchService } from '../searchService/search.service';
import { I_NavigationOptions } from '../../../../models/options.model';
import { RecipeStore } from '../../../../services/recipesStore/recipe-store';

@Component({
  selector: 'app-search-bar',
  imports: [],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar {
  private _searchService = inject(SearchService);
  private _recipeStore = inject(RecipeStore);
  public navigationOptions = input.required<I_NavigationOptions>();
  protected showCloseBtn = signal(false);

  protected onSearch(searchQuery: string) {
    this._searchService.searchQueryObject.set({
      searchQuery: searchQuery,
      pageName: this.navigationOptions().pagename ?? '', // Nutze deine Optionen
    });

    if (searchQuery.length >= 3 || searchQuery.length === 0) {
      // Rufe die Methode im Store auf
      this._recipeStore._getAllRecipes();
    }
    this.showCloseBtn.set(searchQuery.length > 0);
  }

  protected onClearSearch() {
    this.showCloseBtn.set(false);
    this._searchService.searchQueryObject.set(null);
    console.log('set', this.showCloseBtn());
  }
}
