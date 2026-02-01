import { Component, inject, Signal, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Store Interface
import { RecipeStore } from '../../../services/recipesStore/recipe-store';
import { I_Recipe } from '../../../models/recipe.model';
import { I_IngredientInRecipe } from '../../../models/ingredient.model';
// pipes
import { UcfirstPipe } from '../../../shared/pipes/ucFirst/ucfirst.pipe';
import { RoundPipe } from '../../../shared/pipes/round/round.pipe-pipe';

@Component({
  selector: 'app-recipe-details',
  imports: [UcfirstPipe, RoundPipe],
  templateUrl: './recipe-details-pages.html',
  styleUrl: './recipe-details-pages.scss',
})
export class RecipeDetails {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _recipeStore = inject(RecipeStore);

  protected recipe = signal<I_Recipe | null>(null);

  protected ingredients: I_IngredientInRecipe[] = [];
  // A copy of the original ingredients in the recipe to calculate the portions.
  private ingredientsOriginal: I_IngredientInRecipe[] = [];
  protected servingSize: number = 1;

  constructor() {
    this._getRecipe();
  }

  /**
   *
   * @description
   * go to the previous page
   *
   * @returns void
   *
   */
  protected onGoBack(): void {
    this._router.navigate(['..'], { relativeTo: this._route });
  }

  // TODO: get the like from the current users likes recepies
  protected onChanceLike(result: boolean) {}

  /**
   *
   * @description
   * increases or decreases the property 'servingSize'
   * and refers to the method “_calcIngredient()”
   *
   * @param calc
   * add or subtract from the portions
   *
   * @returns void
   *
   */
  protected onChangeServingSize(calc: 'add' | 'min'): void {
    if (this.servingSize > 1 && calc === 'min') {
      this.servingSize--;
    }
    if (calc === 'add') {
      this.servingSize++;
    }
    this._calcIngridient();
  }

  /**
   *
   * @description
   * Creates a shopping list object and forwards it to the "ShoppingList-Service".
   *
   * @returns void
   *
   */
  protected onAdInShoppingList(): void {
    const shoppingListObj = {
      recipeName: this.recipe()?.title,
      ingredients: this.ingredients,
    };
  }

  /**
   *
   * @description
   * Calculates the new quantity of ingredients when increasing or reducing the portions.
   *
   * @returns void
   *
   */
  private _calcIngridient(): void {
    this.ingredients.forEach((ingredient, index) => {
      if (this.ingredientsOriginal.at(index)?.unit) {
        ingredient.unit = this.ingredientsOriginal.at(index)?.unit! * this.servingSize;
      } else {
        console.log('ERROR ingredientsOriginal undefined');
      }
    });
  }

  /**
   *
   * @description
   * retrieves the recipe by its ID and stores the data in the properties:
   * - recipe
   * - ingredient
   *
   * @returns void
   *
   */
  private async _getRecipe() {
    const id = this._route.snapshot.paramMap.get('id');
    if (!id) {
      console.error('No recipe ID found');
      return;
    }
    try {
      const recipe = await this._recipeStore.getById(id);
      this.recipe.set(recipe);

      if (recipe?.ingredients) {
        this.ingredientsOriginal = structuredClone(recipe?.ingredients);
        this.ingredients = structuredClone(recipe?.ingredients);
      }
    } catch (error) {
      console.error('can not loaded a ingredient by Id');
    }
  }
}
