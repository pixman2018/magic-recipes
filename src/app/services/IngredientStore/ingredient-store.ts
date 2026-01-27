import { inject, Injectable, resource, signal } from '@angular/core';
import { SchemaPath, validateAsync } from '@angular/forms/signals';
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from '@angular/fire/firestore';
import {
  I_Ingredient,
  I_IngredientInRecipe,
  I_IngredientItem,
} from '../../models/ingredient.model';

@Injectable({
  providedIn: 'root',
})
export class IngredientStore {
  private _firestore = inject(Firestore);
  private _table = 'ingredients';
  private _ingredientsColRef = collection(this._firestore, this._table);
  private _ingredients = signal<I_Ingredient[]>([]);

  constructor() {
    this._getAll();
  }

  public get ingredients() {
    return this._ingredients.asReadonly();
  }

  private async _getAll(): Promise<void> {
    const snapshot = await getDocs(this._ingredientsColRef);

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as I_Ingredient),
    }));
    // const querySnapshot = await getDocs(this._ingredientsColRef);

    // const data = querySnapshot.docs.map((doc) => ({
    //   id: doc.id,
    //   ...(doc.data() as I_IngredientInRecipe), // Hier sagst du TS: Vertrau mir, das passt!
    // })) as I_IngredientInRecipe[];
    this._ingredients.set(data);
  }

  public async getById(id: string): Promise<I_Ingredient | null> {
    const ingredientRef = doc(this._firestore, `${this._table}/${id}`);
    const snapshot = await getDoc(ingredientRef);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...(snapshot.data() as I_Ingredient),
    };
  }

  public async getByIngredient(ingredient: string): Promise<I_Ingredient[]> {
    console.log('params', ingredient);
    const q = query(this._ingredientsColRef, where('ingredient', '==', ingredient.trim()));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as I_Ingredient),
    }));
  }

  public async addIngredient(ingredient: I_IngredientItem): Promise<I_IngredientItem> {
    // mit ID
    // const userRef = doc(this.firestore, `users/${id}`);

    const recipesRef: DocumentReference = await addDoc(this._ingredientsColRef, ingredient);
    const ingredientObject = {
      ...ingredient,
      id: recipesRef.id,
      refLink: recipesRef.path,
    };
    this._setIngredient(ingredientObject);
    return ingredientObject;
  }

  public updateIngredient(ingredient: I_Ingredient, id: string) {
    this._setIngredient(ingredient);
    const ingredientRef = doc(this._firestore, `${this._table}/${id}`);
    return updateDoc(ingredientRef, { ...ingredient });
  }

  public async updateAllIngredients() {
    const snapshot = await getDocs(this._ingredientsColRef);
    // init batch
    const batch = writeBatch(this._firestore);

    snapshot.forEach((document) => {
      const docRef = doc(this._firestore, `${this._table}/${document.id}`);
      // document add batch
      batch.update(docRef, { isSpices: false, updatedAt: Date.now(), createdAt: Date.now() });
    });

    // Submit all changes at once
    await batch.commit();
    console.log('Alle Zutaten wurden aktualisiert!');
  }

  private _setIngredient(ingredient: I_Ingredient) {
    this._ingredients.update((ingredients) => ({
      ...ingredients,
      ingredient,
    }));
  }
}

export function ingridentExists(
  field: SchemaPath<string>,
  ingredientService: IngredientStore,
  options?: { message?: string },
) {
  validateAsync(field, {
    params: ({ value }) => value(),
    factory: (params) =>
      resource({
        params,
        loader: async ({ params }) => {
          // Simulate API call
          console.log('params', params);
          const ingredients = await ingredientService.getByIngredient(params);
          return { result: ingredients.length > 0 };
        },
      }),
    onSuccess: (result) => {
      if (result.result) {
        return {
          kind: 'ingredientExist',
          message: options?.message ?? 'Diese Zutat existiert bereits.',
        };
      }
      return null;
    },
    onError: (error) => ({
      kind: 'networkError',
      message: 'Could not verify username availability',
    }),
  });
}

/*
Rule
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
*/
