import { Component, inject, input } from '@angular/core';
// data
import recipiesCategories from '../../../../../data/recipiesCategories.json';
import { I_NavigationOptions } from '../../../models/options.model';
import { FilterService } from './filterService/filter';
import { RecipeStore } from '../../../services/recipesStore/recipe-store';
import { UcfirstPipe } from '../../../shared/pipes/ucFirst/ucfirst.pipe';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [UcfirstPipe],
  templateUrl: './filter.html',
  styleUrl: './filter.scss',
})
export class FilterComponent {
  private _filterService = inject(FilterService);
  private _recipeStore = inject(RecipeStore);
  public navigationOptions = input.required<I_NavigationOptions>();
  protected recipiesCategories: string[] = recipiesCategories;

  protected onChangeFilter(filter: any) {
    this._filterService.filterbject.set({
      filter: filter,
      pageName: this.navigationOptions().pagename ?? '',
    });
    this._recipeStore.getAll();
  }
}
