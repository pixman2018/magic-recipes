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
import { Field, form, pattern } from '@angular/forms/signals';

@Component({
  selector: 'app-ingridient-list',
  standalone: true,
  imports: [JsonPipe, Field],
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
    effect(() => {});
  }

  updateAll() {
    console.log('update');
    this._ingredientsStore.updateAllIngredients();
  }
  updateAllRecipies() {
    this._recipesStore.updateAllRecipes({ updatedAt: Date.now(), createdAt: Date.now() });
  }
}
