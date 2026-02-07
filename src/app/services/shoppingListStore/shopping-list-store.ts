import { inject, Injectable, Signal, signal } from '@angular/core';
// firestore
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { DocumentData, DocumentReference } from '@angular/fire/compat/firestore';
import { convertSnap, convertSnaps } from '../../shared/data access/db-until';
// service, model
import { I_ShoppingList } from '../../models/shoppingList.model';
import { HttpBasesAbstractClass } from '../../shared/data access/http-basis-abstract-class';

@Injectable({
  providedIn: 'root',
})
export class ShoppingListStore extends HttpBasesAbstractClass {
  private _shoppingListColRef;
  private _shoppingList = signal<I_ShoppingList[]>([]);

  constructor() {
    super();
    this.dbPath = 'shoppingList';
    this._shoppingListColRef = collection(this.firestore, this.dbPath);
  }

  public get shoppingList(): Signal<I_ShoppingList[]> {
    return this._shoppingList.asReadonly();
  }

  public override async getAll(): Promise<I_ShoppingList[] | []> {
    try {
      const snapshot = await getDocs(this._shoppingListColRef);
      const data: I_ShoppingList[] = convertSnaps(snapshot);
      this._shoppingList.set(data);
      return data;
    } catch (error) {
      console.error('Error by load from all shoppinglist');
      return [];
    }
  }

  public override async getById(id: string): Promise<I_ShoppingList | null> {
    try {
      const shoppinglistRef = doc(this.firestore, `${this.dbPath}/${id}`);
      const snapshot = await getDoc(shoppinglistRef);
      if (!snapshot.exists()) {
        return null;
      }

      return convertSnap(snapshot);
    } catch (error) {
      console.error(`Error by get shoppinglist by ID: "${id}"`);
      return null;
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

  public override async create(
    shoppingList: I_ShoppingList,
  ): Promise<DocumentReference<DocumentData> | {}> {
    try {
      const docRef = await addDoc(this._shoppingListColRef, shoppingList);
      const shoppingListWithId: I_ShoppingList = {
        ...shoppingList,
        id: docRef.id,
      };
      this._setShoppingList(shoppingListWithId);
      return docRef;
    } catch (error) {
      console.error('Error by create a new shopping-list:', error);
      throw error;
    }
  }

  public override async edit(shoppingList: I_ShoppingList): Promise<void> {
    try {
      shoppingList.updatedAt = Date.now();
      const shoppingListRef = doc(this.firestore, `${this.dbPath}/${shoppingList.id}`);
      await updateDoc(shoppingListRef, { ...shoppingList });
      this._shoppingList.update((currentShoppingList) =>
        currentShoppingList.map((list) => (list.id === shoppingList.id ? shoppingList : list)),
      );
    } catch (error) {
      console.error('the shoppingList can`t updated.');
    }
  }

  public override async delete(id: string): Promise<void> {
    try {
      const shoppingListRef = doc(this.firestore, `${this.dbPath}/${id}`);
      await deleteDoc(shoppingListRef);
    } catch (error) {
      console.error('Error by del shoppinglist:', error);
      throw error;
    }
  }

  private _setShoppingList(shoppinglist: I_ShoppingList) {
    this._shoppingList.update((currentShoppinglist) => [...currentShoppinglist, shoppinglist]);
  }
}
