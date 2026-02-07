import { Component, effect, inject, Signal } from '@angular/core';
// servicxe, model
import { ShoppingListStore } from '../../../../services/shoppingListStore/shopping-list-store';
import { I_ShoppingList } from '../../../../models/shoppingList.model';
import { JsonPipe } from '@angular/common';
import { UcfirstPipe } from '../../../../shared/pipes/ucFirst/ucfirst.pipe';
import { ShoppingListItem } from '../../shopping-list-item/shopping-list-item';
import { MessageService } from '../../../../components/message/messageService/message-service';
import { AppService } from '../../../../services/appService/app-service';

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [ShoppingListItem, UcfirstPipe, JsonPipe],
  templateUrl: './shopping-list-pages.html',
  styleUrl: './shopping-list-pages.scss',
})
export class ShoppingListPages {
  private _shoppingListStore = inject(ShoppingListStore);
  private _messageService = inject(MessageService);
  private _appService = inject(AppService);

  protected shoppingList: Signal<I_ShoppingList[]> = this._shoppingListStore.shoppingList;

  constructor() {
    this._shoppingListStore.getAllArchive();
  }

  protected async onCompletedList(shoppingListItem: I_ShoppingList) {
    shoppingListItem.archiv = true;
    shoppingListItem.ingredients.map((ingedient) => (ingedient.isAvailable = false));
    this._shoppingListStore.edit(shoppingListItem);
    this._messageService.setMessage({
      message: 'Das Rezept wird aus der Einkaufsliste herausgenommen.',
    });
    this._appService.scrollToTop();
  }
}
