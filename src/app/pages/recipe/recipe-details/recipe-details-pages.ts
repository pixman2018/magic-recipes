import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { I_Recipe } from '../../../models/recipe';
import { Subscription } from 'rxjs';
import { RecipeStore } from '../../../services/recipesStore/recipe-store';
import { AsyncPipe, JsonPipe } from '@angular/common';

import { I_IngridientInRecipe } from '../../../models/ingridient';

@Component({
  selector: 'app-recipe-details',
  imports: [AsyncPipe, JsonPipe],
  templateUrl: './recipe-details-pages.html',
  styleUrl: './recipe-details-pages.scss',
})
export class RecipeDetails implements OnDestroy {
  private _activateRoute = inject(ActivatedRoute);
  private _recipeStore = inject(RecipeStore);

  private recipeSubcription: Subscription = new Subscription();

  protected recipe: I_Recipe | null = null;
  protected ingredients: I_IngridientInRecipe[] = [];
  protected servingSize: number = 1;

  constructor() {
    // // this.recipe$ = this._recipeStore.getRecipeById(this._id);
    // const id = signal(this._activateRoute.snapshot.paramMap.get('id'));
    // if (id()) {
    //   this.recipe = toSignal(
    //     toObservable(id).pipe(
    //       switchMap((id) => (id ? this._recipeStore.getRecipeById(id) : of(undefined)))
    //     ),
    //     { initialValue: undefined }
    //   );
    // }
    // effect(() => {
    //   console.log(this.recipe);
    // });
    // firstValueFrom()
    // lastValueFrom()

    this._getRecipe();
  }

  ngOnDestroy(): void {
    this.recipeSubcription.unsubscribe();
  }

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
      recipeName: this.recipe?.title,
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
    for (let ingridient of this.ingredients) {
      ingridient.unit = ingridient.unit * this.servingSize;
    }
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
  private _getRecipe(): void {
    const id = this._activateRoute.snapshot.paramMap.get('id');
    if (id) {
      this.recipeSubcription = this._recipeStore.getRecipeById(id).subscribe((recipe) => {
        this.recipe = recipe;
        this.ingredients = recipe?.ingredients;
        console.log('recipe', this.recipe);
      });
    }
  }
}
