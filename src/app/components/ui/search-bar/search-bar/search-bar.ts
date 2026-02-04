import { Component, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import { SearchService } from '../searchService/search.service';
import { I_NavigationOptions } from '../../../../models/options.model';
import { RecipeStore } from '../../../../services/recipesStore/recipe-store';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs';
import { query } from '@angular/fire/firestore';

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
  private _serachValue = viewChild<ElementRef>('searchQuery');
  protected showCloseBtn = signal(false);

  constructor() {
    const search$ = toObservable(this._searchService.searchQueryObject).pipe(
      map((obj) => obj?.searchQuery ?? ''),
      debounceTime(800),
      distinctUntilChanged(),
    );

    search$.subscribe((query) => {
      if (query.length >= 3 || query.length === 0) {
        this._recipeStore._getAllRecipes();
      }
    });
  }

  protected onSearch(searchQuery: string) {
    this._searchService.searchQueryObject.set({
      searchQuery: searchQuery,
      pageName: this.navigationOptions().pagename ?? '',
    });

    this.showCloseBtn.set(searchQuery.length > 0);
  }

  protected onClearSearch() {
    this.showCloseBtn.set(false);
    this._searchService.searchQueryObject.set(null);

    const inputElement = this._serachValue()?.nativeElement;
    if (inputElement) {
      inputElement.value = '';
    }
  }
}
