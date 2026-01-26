import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import {
  form,
  minLength,
  required,
  min,
  Field,
  applyEach,
  FieldTree,
} from '@angular/forms/signals';

// store, service, interfaces
import { IngredientStore } from '../../../services/IngredientStore/ingredient-store';
import { RecipeStore } from '../../../services/recipesStore/recipe-store';
import { CalcCaloriesServiceTs } from '../../../services/calcCaloriesService/calc-calories-service';
import { I_Recipe } from '../../../models/recipe.model';
import {
  I_Ingredient,
  I_IngredientInRecipe,
  I_NutritionalValues,
} from '../../../models/ingredient.model';

// validators
import { isBetween } from '../../../shared/validators';
// components
import { Stepper } from '../../../components/lib/stepper/stepper/stepper';
import { Step } from '../../../components/lib/stepper/step/step';
import { ErrorMessage } from '../../../components/lib/error-message/error-message';
import { DropdownCheckbox } from '../../../components/ui/dropdown-checkbox/dropdown-checkbox';
import { Dropdown } from '../../../components/ui/dropdown/dropdown';
import { IngredientForm } from '../../ingredients/ingredient-form/ingredient-form';
// data
import recipiesCategories from '../../../../../data/recipiesCategories.json';
import unitOfmeasurements from '../../../../../data/unitOfmeasurements.json';

interface I_GeneralRecipeData {
  title: string;
  text: string;
  image: string;
  levelOfDifficulty: number;
  cookingTime: number;
  preparationTime: number;
  categories: string[];
}

interface I_IngridientListData {
  ingredients: I_IngridientData[];
}

interface I_IngridientData {
  ingredient: string;
  unit: number;
  unitOfmeasurement: string;
  spices: boolean;
  ingredientId: string;
}

interface I_StepListData {
  steps: I_StepData[];
}
interface I_StepData {
  step: string;
}

@Component({
  selector: 'app-recipe-form',
  imports: [Field, Stepper, Step, ErrorMessage, Dropdown, DropdownCheckbox, IngredientForm],
  providers: [CalcCaloriesServiceTs],
  templateUrl: './recipe-form.html',
  styleUrl: './recipe-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeForm {
  private _ingridientStore = inject(IngredientStore);
  private _recipeStore = inject(RecipeStore);
  private _calcCaloriesService = inject(CalcCaloriesServiceTs);

  protected recipiesCategories: string[] = recipiesCategories;
  protected unitOfmeasurements: string[] = unitOfmeasurements;
  protected selectedCategories = signal<string[]>([]);
  protected currentStep = signal<number>(1);
  protected isLastStepValid = signal<boolean>(false);
  protected ingredientFormValid = signal<boolean>(false);
  protected showIngredientForm = signal<boolean>(false);
  private _totalNutritionalValues = signal<I_NutritionalValues>({
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    dietaryFiber: 0,
    fat: 0,
  });

  constructor() {
    effect(() => {
      // console.log('log generalRecipeForm', this.generalRecipeForm.categories().value());
      // console.log('log recipeForm', this.ingridientForm().value());
      // console.log('log stepForm', this.stepForm().value());
    });
  }

  protected onNextStep() {
    this.currentStep.update((value) => value + 1);
  }

  protected onPrevStep() {
    this.currentStep.update((value) => value - 1);
  }

  private _generalRecipeModel = signal<I_GeneralRecipeData>({
    title: '',
    text: '',
    image: '',
    levelOfDifficulty: 0,
    cookingTime: 0,
    preparationTime: 0,
    categories: [],
  });

  protected generalRecipeForm = form(this._generalRecipeModel, (schemaPath) => {
    required(schemaPath.title, { message: 'Bitte gebe den Titel an.' });
    minLength(schemaPath.title, 3, { message: 'Der Titel muss mindestens 3 Buchstabenlang sein.' });
    required(schemaPath.text, { message: 'Bitte gebe die Beschreibung an.' });
    minLength(schemaPath.text, 3, {
      message: 'Die Beschreibung muss mindestens 3 Buchstabenlang sein.',
    });

    required(schemaPath.levelOfDifficulty, {
      message: 'Bitte gebe den Schwierigkeitsgrad des Rezeptes an.',
    });
    isBetween(schemaPath.levelOfDifficulty, 1, 3, {
      message: 'Der Schwierigkeitsgrad muss zwischen 1 und 3 liegen.',
    });

    required(schemaPath.cookingTime, { message: 'Bitte gebe die Kochzeit an.' });
    required(schemaPath.preparationTime, { message: 'Bitte gebe die Vorbereitungszeit an.' });
    minLength(schemaPath.categories, 1, { message: 'Bitte geben mindestens eine Kategorie an.' });
  });

  private _ingridientModel = signal<I_IngridientListData>({
    ingredients: [],
  });

  protected ingridientForm = form(this._ingridientModel, (schemaPath) => {
    applyEach(schemaPath.ingredients, (recipePath) => {
      required(recipePath.ingredient, { message: 'Bitte gebe die Zutat an.' });
      minLength(recipePath.ingredient, 3, {
        message: 'Die Zutat muss mindestens drei Zeichen lang sein.',
      });
      min(recipePath.unit, 1, { message: 'Das Gewicht muss mindestens 1 sein.' });
      required(recipePath.unitOfmeasurement, { message: 'Bitte gebt die Maße des Gewichts an.' });
    });
  });

  protected onAddIngridient(ingredient?: I_IngridientData) {
    console.log('valid', this.ingridientForm.ingredients().valid());
    console.log('ingredient', ingredient);
    console.log('ingredient.unitOfmeasurement', ingredient?.unitOfmeasurement);
    if (this.ingridientForm.ingredients().valid()) {
      if (ingredient?.unitOfmeasurement) {
        ingredient.unitOfmeasurement = ingredient?.unitOfmeasurement.toLowerCase();
      }

      this.ingredientFormValid.set(false);
      this._ingridientModel.update((currentIngredient) => ({
        ...currentIngredient,
        ingredients: [
          ...currentIngredient.ingredients,
          ingredient ?? {
            unit: 0,
            unitOfmeasurement: '',
            ingredient: '',
            spices: false,
            ingredientId: '',
          },
        ],
      }));
    }
  }

  protected onDeleteIngredient(index: number) {
    this._ingridientModel.update((oldIngridients) => ({
      ...oldIngridients,
      ingridients: [
        ...oldIngridients.ingredients.slice(0, index),
        ...oldIngridients.ingredients.slice(index + 1),
      ],
    }));
  }

  protected async onAddAndCheckIngredient(
    ingredient: FieldTree<I_IngridientData, number>,
    index: number,
  ) {
    const ingredientTmp = await this._ingridientStore.getByIngredient(
      ingredient.ingredient().value().toLowerCase(),
    );

    if (ingredientTmp.length && ingredientTmp[0].id && index >= 0) {
      this.ingredientFormValid.set(true);
      this.showIngredientForm.set(false);
      this._updateIdInIngredient(ingredientTmp[0].id, index);
      // set nutritional values
      const nutritionalValues: I_NutritionalValues | void =
        await this._calcCaloriesService.convertCaloriens(
          ingredient().value(),
          ingredient().value().ingredientId,
        );
      console.log('nutritionalValues', nutritionalValues);
      if (nutritionalValues) {
        this.setAllNutritionalValues(this._ingridientModel().ingredients[index], nutritionalValues);
      } else {
        console.error('No nutritionalValues.');
      }
    } else {
      this.ingredientFormValid.set(false);
      this.showIngredientForm.set(true);
    }
  }
  // output
  protected async onIndredientFormResult(ingredient: I_Ingredient | null): Promise<void> {
    if (ingredient && ingredient.id && ingredient.indexIngredient !== undefined) {
      this._updateIdInIngredient(ingredient.id, ingredient.indexIngredient);

      const nutritionalValues: I_NutritionalValues | void =
        await this._calcCaloriesService.convertCaloriens(
          this._ingridientModel().ingredients[ingredient.indexIngredient],
          this._ingridientModel().ingredients[ingredient.indexIngredient].ingredientId,
        );

      if (nutritionalValues) {
        this.setAllNutritionalValues(
          this._ingridientModel().ingredients[ingredient.indexIngredient],
          nutritionalValues,
        );
      } else {
        console.error('nutritionalValues not found.');
      }
    }
    this.showIngredientForm.set(false);
    this.ingredientFormValid.set(true);
  }

  private _updateIdInIngredient(id: string, indexIngredient: number): void {
    if (indexIngredient !== undefined && indexIngredient !== null) {
      this._ingridientModel.update((currentIngredient) => ({
        ...currentIngredient,
        ingredients: currentIngredient.ingredients.map((ingredient, index) =>
          index === indexIngredient ? { ...ingredient, ingredientId: id } : ingredient,
        ),
      }));
    }
  }

  private setAllNutritionalValues(
    ingredient: I_IngredientInRecipe,
    nutritionalValues: I_NutritionalValues,
  ): void {
    console.log('ingredient', ingredient);
    console.log('nutritionalValues', nutritionalValues);
    this._totalNutritionalValues.update((currentNutritionalValues) => ({
      ...currentNutritionalValues,
      calories: (currentNutritionalValues.calories += nutritionalValues.calories),
      protein: (currentNutritionalValues.protein += nutritionalValues.protein),
      carbohydrates: (currentNutritionalValues.carbohydrates += nutritionalValues.carbohydrates),
      fat: (currentNutritionalValues.fat += nutritionalValues.fat),
      dietaryFiber: (currentNutritionalValues.dietaryFiber += nutritionalValues.dietaryFiber),
    }));
  }

  private _stepModel = signal<I_StepListData>({
    steps: [],
  });

  protected stepForm = form(this._stepModel, (schemaPath) => {
    applyEach(schemaPath.steps, (stepPath) => {
      required(stepPath.step, { message: 'Bitte gebe den schritt ein.' });
      minLength(stepPath.step, 3, { message: 'Der Schritt muss mindestens 3 Zeichen lang sein.' });
    });
  });

  protected onAddStep(step?: I_StepData) {
    if (this.stepForm.steps().valid()) {
      this._stepModel.update((oldSteps) => ({
        ...oldSteps,
        steps: [...oldSteps.steps, step ?? { step: '' }],
      }));
    }
  }

  protected onDeleteStep(index: number) {
    this._stepModel.update((oldSteps) => ({
      ...oldSteps,
      ingridients: [...oldSteps.steps.slice(0, index), ...oldSteps.steps.slice(index + 1)],
    }));
  }

  protected onCheckStepValue() {
    if (this._stepModel().steps[0].step.length) {
      this.isLastStepValid.set(true);
    } else {
      this.isLastStepValid.set(false);
    }
  }

  protected async onSubmit() {
    if (
      this.generalRecipeForm().valid() &&
      this.ingridientForm().valid() &&
      this.stepForm().valid()
    ) {
      const searchkeys: string[] = [];
      for (let ingredient of this.ingridientForm().value().ingredients) {
        searchkeys.push(ingredient.ingredient.toLowerCase());
      }
      searchkeys.push(this.generalRecipeForm.title().value().toLowerCase());

      const ingridients = [];
      const recipeObject: I_Recipe = {
        ...this.generalRecipeForm().value(),
        searchKeys: searchkeys,
        rating: 0,
        like: false,
        totalTime:
          this.generalRecipeForm.preparationTime().value() +
          this.generalRecipeForm.cookingTime().value(),
        servingSize: 1,
        ingredients: this.ingridientForm().value().ingredients,
        steps: this.stepForm()
          .value()
          .steps.map((s) => s.step),
        nutritionalValues: {
          calories: this._totalNutritionalValues().calories,
          protein: this._totalNutritionalValues().protein,
          carbohydrates: this._totalNutritionalValues().carbohydrates,
          fat: this._totalNutritionalValues().fat,
          dietaryFiber: this._totalNutritionalValues().dietaryFiber,
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      const result = await this._recipeStore.addRecipe(recipeObject);
    }
  }
}
