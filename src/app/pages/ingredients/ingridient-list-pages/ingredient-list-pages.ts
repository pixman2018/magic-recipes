import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { IngredientStore } from '../../../services/IngredientStore/ingredient-store';
import { I_Ingredient, I_IngredientInRecipe } from '../../../models/ingredient.model';
import { JsonPipe } from '@angular/common';
import { IngredientForm } from '../ingredient-form/ingredient-form';
import { RecipeStore } from '../../../services/recipesStore/recipe-store';
import { I_Recipe } from '../../../models/recipe.model';
import { form, pattern } from '@angular/forms/signals';

@Component({
  selector: 'app-ingridient-list',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './ingredient-list-pages.html',
  styleUrl: './ingredient-list-pages.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IngredientListPage {
  private _ingredientsStore = inject(IngredientStore);
  private _recipesStore = inject(RecipeStore);

  protected ingredients: Signal<I_Ingredient[]> = this._ingredientsStore.ingredients;
  protected recipes: Signal<I_Recipe[]> = this._recipesStore.recipes;

  constructor() {
    this._ingredientsStore.getAll();
  }

  private _getIngredients(): void {
    try {
      this.ingredients = this._ingredientsStore.ingredients;
    } catch (error) {
      console.error('Error by fetch all recipes', error);
    }
  }

  updateAll() {
    console.log('update');

    try {
      this._ingredientsStore.updateAllIngredients({ updatedAt: Date.now(), createdAt: Date.now() });
    } catch (error) {
      console.error('Error by update from all ingredients', error);
    }
  }
  updateAllRecipies() {
    this._recipesStore.updateAllRecipes({ updatedAt: Date.now(), createdAt: Date.now() });
    try {
      this.ingredients = this._ingredientsStore.ingredients;
    } catch (error) {
      console.error('Error by update from all recipes', error);
    }
  }
}
