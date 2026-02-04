import { inject, Injectable, Signal, signal } from '@angular/core';
// firestore
import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { DocumentData, DocumentReference } from '@angular/fire/compat/firestore';
import { convertSnaps } from '../../shared/data access/db-until';
// service, model
import { I_ShoppingList } from '../../models/shoppingList.model';

@Injectable({
  providedIn: 'root',
})
export class ShoppingListStore {
  private _firestore = inject(Firestore);
  private _table = 'shoppingList';
  private _shoppingListColRef = collection(this._firestore, this._table);
  private _shoppingList = signal<I_ShoppingList[]>([]);

  constructor() {
    this._getAllShoppingList();
  }

  public get shoppingList(): Signal<I_ShoppingList[]> {
    return this._shoppingList.asReadonly();
  }

  private async _getAllShoppingList() {
    try {
      const snapshot = await getDocs(this._shoppingListColRef);
      const data: I_ShoppingList[] = convertSnaps(snapshot);
      this._shoppingList.set(data);
    } catch (error) {
      console.error('Error by load from all shoppinglist');
    }
  }

  public async getShoppingListByTitle(ttile: string): Promise<I_ShoppingList[]> {
    try {
      const q = query(
        this._shoppingListColRef,
        where('recipeNameLower', '==', ttile.toLowerCase()),
      );
      const snapshot = await getDocs(q);

      return convertSnaps(snapshot);
    } catch (error) {
      console.error('Error by load from all shoppinglist');
    }
    return [];
  }

  public async addShoppingList(shoppingList: I_ShoppingList): Promise<I_ShoppingList | null> {
    try {
      const docRef = await addDoc(this._shoppingListColRef, shoppingList);
      const shoppingListWithId: I_ShoppingList = {
        ...shoppingList,
        id: docRef.id,
      };
      this._setShoppingList(shoppingListWithId);

      return shoppingListWithId;
    } catch (error) {
      console.error('Error by create a new shopping-list:', error);
    }
    return null;
  }

  public async updateShoppingList(shoppingList: I_ShoppingList): Promise<void> {
    try {
      const shoppingListRef = doc(this._firestore, `${this._table}/${shoppingList.id}`);
      await updateDoc(shoppingListRef, { ...shoppingList });
      this._shoppingList.update((currentShoppingList) =>
        currentShoppingList.map((list) => (list.id === shoppingList.id ? shoppingList : list)),
      );
    } catch (error) {
      console.error('the shoppingList can`t updated.');
    }
  }

  private _setShoppingList(shoppinglist: I_ShoppingList) {
    this._shoppingList.update((currentShoppinglist) => [...currentShoppinglist, shoppinglist]);
  }
}
