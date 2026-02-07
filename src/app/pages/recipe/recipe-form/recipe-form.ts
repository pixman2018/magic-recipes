import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import {
  form,
  minLength,
  required,
  min,
  applyEach,
  FieldTree,
  FormField,
} from '@angular/forms/signals';
import { Router } from '@angular/router';

// store, service, interfaces
import { IngredientStore } from '../../../services/IngredientStore/ingredient-store';
import { RecipeStore } from '../../../services/recipesStore/recipe-store';
import { CalcCaloriesServiceTs } from '../../../services/calcCaloriesService/calc-calories-service';
import { I_Recipe } from '../../../models/recipe.model';
import { I_Ingredient, I_NutritionalValues } from '../../../models/ingredient.model';

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
  nutritionalValues?: I_NutritionalValues;
}

interface I_StepListData {
  steps: I_StepData[];
}
interface I_StepData {
  step: string;
}

@Component({
  selector: 'app-recipe-form',
  imports: [FormField, Stepper, Step, ErrorMessage, Dropdown, DropdownCheckbox, IngredientForm],
  providers: [CalcCaloriesServiceTs],
  templateUrl: './recipe-form.html',
  styleUrl: './recipe-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeForm {
  private _router = inject(Router);
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

  protected totalNutritionalValues = computed(() => {
    const ingredients = this._ingredientModel().ingredients;
    // set default value
    const totals: I_NutritionalValues = {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      dietaryFiber: 0,
      fat: 0,
    };
    // sum up all ingredients that already have calculated values
    ingredients.forEach((ingredient) => {
      if (ingredient.nutritionalValues) {
        ((totals.calories += ingredient.nutritionalValues.calories),
          (totals.protein += ingredient.nutritionalValues.protein),
          (totals.carbohydrates += ingredient.nutritionalValues.carbohydrates),
          (totals.fat += ingredient.nutritionalValues.fat),
          (totals.dietaryFiber += ingredient.nutritionalValues.dietaryFiber));
      }
    });

    return totals;
  });

  protected difficultyLabel = computed(() => {
    const value = Number(this.generalRecipeForm.levelOfDifficulty().value());
    const labels: Record<number, string> = {
      1: 'Einfach',
      2: 'Mittel',
      3: 'Schwer',
    };
    return labels[value] || 'Unbekannt';
  });

  protected onReset(): void {
    this._generalRecipeModel.set(this._getRecipeFormObj());
    this._ingredientModel.set({ ingredients: [] });
    this._stepModel.set({ steps: [] });
  }

  protected onBackToIndex(index: number) {
    if (this.currentStep() > index) {
      this.currentStep.set(index);
    }
  }

  protected onNextStep() {
    this.currentStep.update((value) => value + 1);
  }

  protected onPrevStep() {
    this.currentStep.update((value) => value - 1);
  }

  private _generalRecipeModel = signal<I_GeneralRecipeData>(this._getRecipeFormObj());

  private _getRecipeFormObj(): I_GeneralRecipeData {
    return {
      title: '',
      text: '',
      image: '',
      levelOfDifficulty: 1,
      cookingTime: 0,
      preparationTime: 0,
      categories: [],
    };
  }

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

  private _ingredientModel = signal<I_IngridientListData>({
    ingredients: [],
  });

  protected ingridientForm = form(this._ingredientModel, (schemaPath) => {
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
    if (this.ingridientForm.ingredients().valid()) {
      if (ingredient?.unitOfmeasurement) {
        ingredient.unitOfmeasurement = ingredient?.unitOfmeasurement.toLowerCase();
      }

      this.ingredientFormValid.set(false);
      this._ingredientModel.update((currentIngredient) => ({
        ...currentIngredient,
        ingredients: [ingredient ?? this._setIngredientObj(), ...currentIngredient.ingredients],
      }));
    }
  }

  protected onDeleteIngredient(index: number) {
    this._ingredientModel.update((oldIngredients) => ({
      ...oldIngredients,
      ingredients: oldIngredients.ingredients.filter((_, i) => i !== index),
    }));
  }

  private _setIngredientObj(): I_IngridientData {
    return { unit: 0, unitOfmeasurement: '', ingredient: '', spices: false, ingredientId: '' };
  }

  protected async onAddAndCheckIngredient(
    ingredientField: FieldTree<I_IngridientData, number>,
    index: number,
  ) {
    // Wait briefly to ensure the signal has received the value.
    await Promise.resolve();
    const ingredientValue = ingredientField.ingredient().value();

    if (!ingredientValue || ingredientValue.length < 3) {
      this.ingredientFormValid.set(false);
      this.showIngredientForm.set(false);
      return;
    }

    try {
      const ingredientTmp = await this._ingridientStore.getByIngredient(
        ingredientValue.toLowerCase().trim(),
      );

      if (ingredientTmp.length > 0 && ingredientTmp[0].id) {
        const id = ingredientTmp[0].id;
        this.ingredientFormValid.set(true);
        this.showIngredientForm.set(false);

        // Update ID in model
        this._updateIdInIngredient(id, index);

        // Calculate calories
        // We retrieve the current status of the specific ingredient
        const currentIngData = this._ingredientModel().ingredients[index];

        if (currentIngData.unit > 0) {
          const nutritionalValues: I_NutritionalValues | void =
            await this._calcCaloriesService.convertCaloriens(currentIngData, id);
          if (nutritionalValues) {
            this.setAllNutritionalValues(nutritionalValues, index);
          } else {
            console.error('No nutritionalValues.');
          }
        } else {
          console.error('currentIngData.unit > 0');
        }
      } else {
        // Ingredient not in DB -> Display form for creating new entry
        this.ingredientFormValid.set(false);
        this.showIngredientForm.set(true);
      }
    } catch (error) {
      this.ingredientFormValid.set(false);
    }
  }
  // output
  protected async onIndredientFormResult(ingredient: I_Ingredient | null): Promise<void> {
    if (ingredient && ingredient.id && ingredient.indexIngredient !== undefined) {
      this._updateIdInIngredient(ingredient.id, ingredient.indexIngredient);

      const nutritionalValues: I_NutritionalValues | void =
        await this._calcCaloriesService.convertCaloriens(
          this._ingredientModel().ingredients[ingredient.indexIngredient],
          this._ingredientModel().ingredients[ingredient.indexIngredient].ingredientId,
        );

      if (nutritionalValues) {
        this.setAllNutritionalValues(nutritionalValues, ingredient.indexIngredient);
      } else {
        console.error('nutritionalValues not found.');
      }
    }
    this.showIngredientForm.set(false);
    this.ingredientFormValid.set(true);
  }

  private _updateIdInIngredient(id: string, indexIngredient: number): void {
    if (indexIngredient !== undefined && indexIngredient !== null) {
      this._ingredientModel.update((currentIngredient) => ({
        ...currentIngredient,
        ingredients: currentIngredient.ingredients.map((ingredient, index) =>
          index === indexIngredient ? { ...ingredient, ingredientId: id } : ingredient,
        ),
      }));
    }
  }

  private setAllNutritionalValues(nutritionalValues: I_NutritionalValues, index: number): void {
    if (nutritionalValues) {
      this._ingredientModel.update((currentIngredient) => ({
        ...currentIngredient,
        ingredients: currentIngredient.ingredients.map((ingredient, i) =>
          i === index ? { ...ingredient, nutritionalValues: nutritionalValues } : ingredient,
        ),
      }));
    }
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
    if (this.stepForm.steps().valid() || this.stepForm.steps().value().length === 0) {
      this._stepModel.update((currentSteps) => ({
        ...currentSteps,
        steps: [step ?? { step: '' }, ...currentSteps.steps],
      }));
    }
  }

  protected onDeleteStep(index: number) {
    this._stepModel.update((oldSteps) => ({
      ...oldSteps,
      steps: oldSteps.steps.filter((_, i) => i !== index),
    }));

    console.log(this._stepModel().steps);
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
          calories: this.totalNutritionalValues().calories,
          protein: this.totalNutritionalValues().protein,
          carbohydrates: this.totalNutritionalValues().carbohydrates,
          fat: this.totalNutritionalValues().fat,
          dietaryFiber: this.totalNutritionalValues().dietaryFiber,
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const result = await this._recipeStore.create(recipeObject);
      if (result) {
        this._router.navigate(['/recipes']);
      }
    }
  }
}
