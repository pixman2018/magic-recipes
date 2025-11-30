import { I_IngridientInRecipe } from './ingridient';

export interface I_Recipe {
  id: string;
  title: string;
  text: string;
  image: string;
  LevelOfDifficulty: number;
  nutritionalValues: I_NutritionalValues;
  rating: number;
  like: boolean;
  cookingTime: number;
  preparationTime: number;
  totalTime: number;
  servingSize: number;
  ingredients: I_IngridientInRecipe[];
  steps: string[];
  categories: string[];
}

interface I_NutritionalValues {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  dietaryFiber: number;
}
