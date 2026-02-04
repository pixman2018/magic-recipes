import { Component, effect, inject, signal, Signal, WritableSignal } from '@angular/core';

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
  protected recipes = this._recipeStore.recipes;

  constructor() {
    try {
      this._recipeStore._getAllRecipes();
    } catch (error) {
      console.error('Fehler beim Laden der Rezepte:', error);
    }
  }
}
