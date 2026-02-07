import { Component, inject, input } from '@angular/core';
import { I_ShoppingList } from '../../../models/shoppingList.model';
import { JsonPipe } from '@angular/common';
import { I_IngredientInShoppiungList } from '../../../models/ingredient.model';
import { ShoppingListStore } from '../../../services/shoppingListStore/shopping-list-store';
import { UcfirstPipe } from '../../../shared/pipes/ucFirst/ucfirst.pipe';
import { OrderByPipe } from '../../../shared/pipes/orderBy/orderBy.pipe';

@Component({
  selector: 'app-shopping-list-item',
  imports: [UcfirstPipe, OrderByPipe, JsonPipe],
  templateUrl: './shopping-list-item.html',
  styleUrl: './shopping-list-item.scss',
})
export class ShoppingListItem {
  private _shoppingListStore = inject(ShoppingListStore);

  public ingredients = input.required<I_IngredientInShoppiungList[]>();
  public shoppingItem = input.required<I_ShoppingList>();

  protected onChanceAvailable(
    shoppingItem: I_ShoppingList,
    ingredient: I_IngredientInShoppiungList,
  ) {
    const updateIngredient = shoppingItem.ingredients.map((ing) => {
      if (ing.ingredientId === ingredient.ingredientId) {
        return { ...ing, isAvailable: !ing.isAvailable };
      }
      return ing;
    });

    const updatedShoppingItem = {
      ...shoppingItem,
      ingredients: updateIngredient,
    };
    // update shoppinglist
    const result = this._shoppingListStore.edit(updatedShoppingItem);
  }
}
