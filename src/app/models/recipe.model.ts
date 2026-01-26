import { I_IngredientInRecipe } from './ingredient.model';

export interface I_Recipe {
  id?: string;
  title: string;
  text: string;
  image: string;
  levelOfDifficulty: number;
  searchKeys: string[];
  rating: number;
  like: boolean;
  cookingTime: number;
  preparationTime: number;
  totalTime: number;
  servingSize: number;
  ingredients: I_IngredientInRecipe[];
  steps: string[];
  categories: string[];
  nutritionalValues: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    dietaryFiber: number;
  };
  createdAt: number;
  updatedAt: number;
}
