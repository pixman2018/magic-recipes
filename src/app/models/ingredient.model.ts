export interface I_IngredientInRecipe {
  ingredientId?: string;
  unit: number;
  unitOfmeasurement: string;
  ingredient: string;
}

export interface I_IngredientInShoppiungList extends I_IngredientInRecipe {
  isAvailable: boolean;
}

export interface I_Ingredient {
  id?: string;
  image?: string;
  refLink?: string;
  indexIngredient?: number;
  ingredient: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  dietaryFiber: number;
  isSpices: boolean;
}

export interface I_IngredientItem extends I_Ingredient {
  createdAt: number;
  updatedAt: number;
}

export interface I_NutritionalValues {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  dietaryFiber: number;
}
