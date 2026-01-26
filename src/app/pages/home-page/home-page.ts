import { Component, effect, inject, Signal } from '@angular/core';

import { I_Recipe } from '../../models/recipe.model';
import { RecipeStore } from '../../services/recipesStore/recipe-store';
import { RecipesList } from '../recipe/recipes-list/recipes-list';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RecipesList],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  private _recipeStore = inject(RecipeStore);
  protected recipes: Signal<I_Recipe[]> = this._recipeStore.recipes;

  constructor() {
    effect(() => {
      this.recipes = this._recipeStore.recipes;
    });
  }
}
