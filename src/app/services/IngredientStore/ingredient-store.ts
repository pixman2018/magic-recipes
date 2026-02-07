import { inject, Injectable, resource, signal } from '@angular/core';
import { SchemaPath, validateAsync } from '@angular/forms/signals';
// firebase
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from '@angular/fire/firestore';
import { convertSnap, convertSnaps } from '../../shared/data access/db-until';
// service model
import { I_Ingredient, I_IngredientItem } from '../../models/ingredient.model';
import { HttpBasesAbstractClass } from '../../shared/data access/http-basis-abstract-class';
import { SearchService } from '../../components/ui/search-bar/searchService/search.service';
import { FilterService } from '../../components/ui/filter/filterService/filter';

@Injectable({
  providedIn: 'root',
})
export class IngredientStore extends HttpBasesAbstractClass {
  private _searchService = inject(SearchService);
  private _filterService = inject(FilterService);

  private _ingredientsColRef;
  private _ingredients = signal<I_Ingredient[]>([]);

  constructor() {
    super();
    this.dbPath = 'ingredients';
    this._ingredientsColRef = collection(this.firestore, this.dbPath);
  }

  public get ingredients() {
    return this._ingredients.asReadonly();
  }

  public override async getAll(): Promise<I_Ingredient[]> {
    try {
      const snapshot = await getDocs(this._ingredientsColRef);

      const data: I_Ingredient[] = convertSnaps(snapshot);

      this._ingredients.set(data);
      return data;
    } catch (error) {
      console.error('Error by get all ingredients');
      throw error;
    }
  }

  public override async getById(id: string): Promise<I_Ingredient | null> {
    try {
      const ingredientRef = doc(this.firestore, `${this.dbPath}/${id}`);
      const snapshot = await getDoc(ingredientRef);

      if (!snapshot.exists()) {
        return null;
      }

      return convertSnap(snapshot);
    } catch (error) {
      console.error(`Error by get ingredients by ID: "${id}"`);
      return null;
    }
  }

  public async getByIngredient(ingredient: string): Promise<I_Ingredient[] | []> {
    try {
      const q = query(this._ingredientsColRef, where('ingredient', '==', ingredient.trim()));
      const snapshot = await getDocs(q);

      return convertSnaps(snapshot);
    } catch (error) {
      console.error(`Error by get ingredients by name: "${ingredient}"`);
      return [];
    }
  }

  public override async create(ingredient: I_IngredientItem): Promise<I_IngredientItem> {
    try {
      const recipesRef: DocumentReference = await addDoc(this._ingredientsColRef, ingredient);
      const ingredientObject = {
        ...ingredient,
        id: recipesRef.id,
        refLink: recipesRef.path,
      };
      this._setIngredient(ingredientObject);
      return ingredientObject;
    } catch (error) {
      console.error(`Error by add ingredient`);
      throw error;
    }
  }

  public override edit(ingredient: I_IngredientItem, id: string): Promise<void> {
    try {
      ingredient.updatedAt = Date.now();
      this._setIngredient(ingredient);
      const ingredientRef = doc(this.firestore, `${this.dbPath}/${id}`);
      return updateDoc(ingredientRef, { ...ingredient });
    } catch (error) {
      console.error(`Error by add ingredient`);
      throw error;
    }
  }

  public override async delete(id: string): Promise<void> {
    try {
      const ingredientRef = doc(this.firestore, `${this.dbPath}/${id}`);
      await deleteDoc(ingredientRef);
    } catch (error) {
      console.error('Error by del ingredient:', error);
      throw error;
    }
  }

  public async updateAllIngredients(newIngredient: {}) {
    const snapshot = await getDocs(this._ingredientsColRef);
    // init batch
    const batch = writeBatch(this.firestore);
    try {
      snapshot.forEach(async (document) => {
        const docRef = doc(this.firestore, `${this.dbPath}/${document.id}`);
        const snapshot = await getDoc(docRef);
        const data: I_IngredientItem | null = convertSnap(snapshot);
        if (data) {
          data.updatedAt = Date.now();
        }
        // document add batch
        batch.update(docRef, {
          ...newIngredient,
        });
      });

      // Submit all changes at once
      await batch.commit();
      console.log('Alle Zutaten wurden aktualisiert!');
    } catch (error) {
      console.log('Error by upadate all ingredient');
      throw error;
    }
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
