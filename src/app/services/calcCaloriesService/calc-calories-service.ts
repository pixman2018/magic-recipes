import { inject, Injectable } from '@angular/core';
import { IngredientStore } from '../IngredientStore/ingredient-store';
import {
  I_Ingredient,
  I_IngredientInRecipe,
  I_NutritionalValues,
} from '../../models/ingredient.model';

interface I_ConvertValue {
  oel: { el: number; tl: number };
  zwiebel: { gramm: number };
  knoblauch: { gramm: number };
  spises: { el: number; tl: number };
}

@Injectable()
export class CalcCaloriesServiceTs {
  private _ingredientStore = inject(IngredientStore);

  private convertValue: I_ConvertValue = {
    oel: {
      el: 5,
      tl: 3,
    },
    zwiebel: {
      gramm: 40,
    },
    knoblauch: {
      gramm: 15,
    },
    spises: {
      tl: 1.5,
      el: 3,
    },
  };

  public async convertCaloriens(
    ingredientInRecipe: I_IngredientInRecipe,
    id: string,
  ): Promise<void | I_NutritionalValues> {
    if (!id) {
      console.log('No ID');
      return;
    }
    const ingredient = await this._ingredientStore.getById(id);

    if (ingredient) {
      let weight = 0;
      if (ingredientInRecipe.ingredient.includes('öl')) {
        if (ingredientInRecipe.unitOfmeasurement === 'el') {
          weight = this.convertValue.oel.el * ingredientInRecipe.unit;
        } else if (ingredientInRecipe.unitOfmeasurement === 'tl') {
          weight = this.convertValue.oel.tl * ingredientInRecipe.unit;
        }
      } else if (ingredient.isSpices) {
        if (ingredientInRecipe.unitOfmeasurement === 'el') {
          weight = this.convertValue.spises.el * ingredientInRecipe.unit;
        } else if (ingredientInRecipe.unitOfmeasurement === 'tl') {
          weight = this.convertValue.spises.tl * ingredientInRecipe.unit;
        }
        weight = this.convertValue.spises.el;
      } else if (ingredientInRecipe.ingredient === 'zwiebel') {
        weight = this.convertValue.zwiebel.gramm * ingredientInRecipe.unit;
      } else if (ingredientInRecipe.ingredient === 'knoblauch') {
        weight = this.convertValue.knoblauch.gramm * ingredientInRecipe.unit;
      } else {
        weight = ingredientInRecipe.unit;
      }
      switch (ingredientInRecipe.unitOfmeasurement) {
        default:
      }

      return this._convertToAGram(ingredient, weight);
    } else {
      console.log('No Ingredient');
    }
  }

  private _convertToAGram(ingredient: I_Ingredient, weight: number): I_NutritionalValues {
    const nutritionalValues: I_NutritionalValues = {
      calories: this.calcBrewedValue(ingredient.calories, weight),
      protein: this.calcBrewedValue(ingredient.protein, weight),
      carbohydrates: this.calcBrewedValue(ingredient.carbohydrates, weight),
      fat: this.calcBrewedValue(ingredient.fat, weight),
      dietaryFiber: this.calcBrewedValue(ingredient.dietaryFiber, weight),
    };
    return nutritionalValues;
  }

  private calcBrewedValue(weight: number, brewedWeight: number): number {
    return Math.round((weight / 100) * brewedWeight * 100) / 100;
  }
}
