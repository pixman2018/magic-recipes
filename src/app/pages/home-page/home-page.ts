import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { I_Recipe } from '../../models/recipe';
import { RecipeStore } from '../../services/recipesStore/recipe-store';
import { RecipesList } from '../../components/recipe/recipes-list/recipes-list';

/**
 *
 * @description
 * provides the recipes and filters their content as needed.
 * These are passed on to the presentation component “recipe-list.”
 *
 * @property
 * @private _recipeStore
 * @protected recipes$
 * Observable vom Recipes
 *
 * @method
 * @private
 * _loadAllRecipes
 */
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RecipesList],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  // private _recipeStore = inject(RecipeStore);
  // protected recipes$: Observable<I_Recipe[] | []> = this._loadAllRecipes();
  /**
   *
   * @description
   * fetch all resipe from the "recipe-store"
   *
   * @private
   * @returns recipes as Observable
   */
  // private _loadAllRecipes(): Observable<I_Recipe[]> {
  //   return (this.recipes$ = this._recipeStore.getRecipes$);
  // }
}
