import { I_IngredientInShoppiungList } from './ingredient.model';

export interface I_ShoppingList {
  id?: string;
  recipeName: string;
  recipeNameLower: string;
  ingredients: I_IngredientInShoppiungList[];
  archiv: boolean;
  number: number;
  createdAt: number;
  updatedAt: number;
}
