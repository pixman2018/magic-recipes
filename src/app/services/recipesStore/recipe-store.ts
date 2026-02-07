import { inject, Injectable, resource, Signal, signal } from '@angular/core';
import { SchemaPath, validateAsync } from '@angular/forms/signals';
// firestore
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
  getDoc,
  getDocs,
  orderBy,
  query,
  QueryConstraint,
  updateDoc,
  where,
  writeBatch,
} from '@angular/fire/firestore';
import { convertSnap, convertSnaps } from '../../shared/data access/db-until';
// services, models
import { SearchService } from '../../components/ui/search-bar/searchService/search.service';
import { FilterService } from '../../components/ui/filter/filterService/filter';
import { I_Recipe } from '../../models/recipe.model';
import { HttpBasesAbstractClass } from '../../shared/data access/http-basis-abstract-class';

@Injectable({
  providedIn: 'root',
})
export class RecipeStore extends HttpBasesAbstractClass {
  private _searchService = inject(SearchService);
  private _filterService = inject(FilterService);
  private _recipes = signal<I_Recipe[]>([]);

  private _recipesColRef;

  constructor() {
    super();
    this.dbPath = 'recipes';
    this._recipesColRef = collection(this.firestore, this.dbPath);
  }

  public get recipes(): Signal<I_Recipe[]> {
    return this._recipes.asReadonly();
  }

  public override async getAll(
    category: string = 'all',
    like: boolean = false,
  ): Promise<I_Recipe[] | []> {
    const searchTerm = this._searchService.searchQueryObject()?.searchQuery.toLowerCase();
    const filterTerm = this._filterService.filterbject()?.filter;
    const constraints: QueryConstraint[] = [];

    if (filterTerm === 'like') {
      constraints.push(where('like', '==', true));
    } else if (filterTerm && filterTerm !== 'all') {
      category = filterTerm;
    }

    if (searchTerm && searchTerm.trim() !== '') {
      constraints.push(where('searchKeys', 'array-contains', searchTerm));
    }

    if (like) {
      constraints.push(where('like', '==', true));
    }

    constraints.push(orderBy('title'));

    try {
      const q = query(this._recipesColRef, ...constraints);
      const snapshot = await getDocs(q);
      // map data
      let data: I_Recipe[] = convertSnaps(snapshot);

      // save client-side filter
      if (category && category !== 'all') {
        data = data.filter((recipe) => recipe.categories && recipe.categories.includes(category));
      }
      // update signal
      this._recipes.set(data);
      return data;
    } catch (error) {
      console.error('Fehler beim Laden der Rezepte:', error);
      return [];
    }
  }

  public override async getById(id: string): Promise<I_Recipe | null> {
    try {
      const recipeRef = doc(this.firestore, `${this.dbPath}/${id}`);
      const snapshot = await getDoc(recipeRef);

      if (!snapshot.exists()) {
        return null;
      }

      const data = convertSnap<I_Recipe>(snapshot);
      return data;
    } catch (error) {
      console.error(`Error by get recipe by ID: "${id}"`);
      return null;
    }
  }

  public async getByIngridient(name: string): Promise<I_Recipe[]> {
    try {
      const q = query(this._recipesColRef, where('ingredient', '==', name));
      const snapshot = await getDocs(q);

      return convertSnaps(snapshot);
    } catch (error) {
      console.error('Error by create a new recipe:', error);
      throw error;
    }
  }

  public override async create(
    recipe: I_Recipe,
  ): Promise<DocumentReference<DocumentData, DocumentData>> {
    try {
      const docRef = await addDoc(this._recipesColRef, recipe);
      const recipeWithId: I_Recipe = {
        ...recipe,
        id: docRef.id,
      };
      this._setRecipes(recipeWithId);
      return docRef;
    } catch (error) {
      console.error('Error by create a new recipe:', error);
      throw error;
    }
  }

  public override edit(recipe: I_Recipe, id: string): Promise<void> {
    try {
      this._setRecipes(recipe);
      const resipeRef = doc(this.firestore, `${this.dbPath}/${id}`);
      return updateDoc(resipeRef, { ...recipe });
    } catch (error) {
      console.error('Error by create a new recipe:', error);
      throw error;
    }
  }

  public override async delete(id: string): Promise<void> {
    try {
      const recipeRef = doc(this.firestore, `${this.dbPath}/${id}`);
      return await deleteDoc(recipeRef);
    } catch (error) {
      console.error('Error by del recipe:', error);
      throw error;
    }
  }

  public async updateAllRecipes(newRecipe: {}) {
    const snapshot = await getDocs(this._recipesColRef);
    // init batch
    const batch = writeBatch(this.firestore);
    try {
      snapshot.forEach(async (document) => {
        const docRef = doc(this.firestore, `${this.dbPath}/${document.id}`);
        const snapshot = await getDoc(docRef);
        const data: I_Recipe | null = convertSnap(snapshot);
        if (data) {
          data.updatedAt = Date.now();
        }
        // document add batch
        batch.update(docRef, { ...newRecipe });
      });

      // Submit all changes at once
      await batch.commit();
      console.log('Alle Rezepte wurden aktualisiert!');
    } catch (error) {
      console.log('Error by upadate all recipess');
      throw error;
    }
  }

  public recipeExists(
    field: SchemaPath<string>,
    recipeStore: RecipeStore,
    options?: { message?: string },
  ) {
    validateAsync(field, {
      params: ({ value }) => value(),
      factory: (params) =>
        resource({
          params,
          loader: async ({ params }) => {
            // Simulate API call
            const recipes = await recipeStore.getByIngridient(params);
            return { result: recipes.length > 0 };
          },
        }),
      onSuccess: (result) => {
        if (result.result) {
          return {
            kind: 'recipeExist',
            message: options?.message ?? 'Das Rezept existiert bereits.',
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

  private _setRecipes(recipe: I_Recipe) {
    this._recipes.update((recipes) => [...recipes, recipe]);
  }
}
