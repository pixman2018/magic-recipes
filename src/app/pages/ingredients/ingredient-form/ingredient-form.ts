import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { form, required, Field, min, minLength, disabled, readonly } from '@angular/forms/signals';
import { ErrorMessage } from '../../../components/lib/error-message/error-message';
import { I_Ingredient, I_IngredientItem } from '../../../models/ingredient.model';
import { IngredientStore } from '../../../services/IngredientStore/ingredient-store';

@Component({
  selector: 'app-ingredient-form',
  imports: [Field, ErrorMessage],
  templateUrl: './ingredient-form.html',
  styleUrl: './ingredient-form.scss',
})
export class IngredientForm {
  private _ingridientService = inject(IngredientStore);
  public ingridient = input.required<string>();
  public indredientFormResult = output<I_Ingredient | null>();
  public indexIngredient = input.required<number>();
  private _ingredientModel = signal<I_Ingredient>({
    ingredient: '',
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    dietaryFiber: 0,
    isSpices: false,
  });

  constructor() {
    effect(() => {
      this._ingredientModel.update((currentIngridient) => ({
        ...currentIngridient,
        ingredient: this.ingridient(),
      }));
    });
  }

  protected indredientForm = form(this._ingredientModel, (schemaPath) => {
    required(schemaPath.ingredient);
    readonly(schemaPath.ingredient);
    minLength(schemaPath.ingredient, 3, {
      message: 'Die Zutat muss mindestens 3 Buchstaben haben.',
    });
    required(schemaPath.calories, { message: 'Bitte die Kalorien angeben.' });
    min(schemaPath.calories, 0, { message: 'Die Kalorienwert muss positive sein.' });
    required(schemaPath.protein, { message: 'Bitte die Proteine angeben.' });
    min(schemaPath.protein, 0, { message: 'Der Proteinewert muss positive sein.' });
    required(schemaPath.carbohydrates, { message: 'Bitte die Kohlenhydrate angeben.' });
    min(schemaPath.carbohydrates, 0, { message: 'Der Kohlengydrate muss positive sein.' });
    required(schemaPath.dietaryFiber, { message: 'Bitte die Ballaststoffe angeben.' });
    min(schemaPath.dietaryFiber, 0, { message: 'Der Ballaststoffe muss positive sein.' });
  });

  protected async onSubmit() {
    if (this.indredientForm().valid()) {
      this._ingredientModel.update((currentIngridient) => ({
        ...currentIngridient,
        ingredient: currentIngridient.ingredient.toLocaleLowerCase(),
      }));
      const ingredient: I_IngredientItem = {
        ...this.indredientForm().value(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const result = await this._ingridientService.addIngredient(ingredient);
      result.indexIngredient = this.indexIngredient();
      this.indredientFormResult.emit(result);
      this.indredientForm().reset();
    }
    this.indredientFormResult.emit(null);
  }
}
