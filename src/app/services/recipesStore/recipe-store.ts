import {
  effect,
  inject,
  Injectable,
  resource,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  DocumentReference,
  endAt,
  Firestore,
  getDoc,
  getDocs,
  orderBy,
  query,
  QueryConstraint,
  startAt,
  updateDoc,
  where,
  writeBatch,
} from '@angular/fire/firestore';
import { I_Recipe } from '../../models/recipe.model';
import { SchemaPath, validateAsync } from '@angular/forms/signals';
import { SearchService } from '../../components/ui/search-bar/searchService/search.service';
import { FilterService } from '../../components/ui/filter/filterService/filter';

@Injectable({
  providedIn: 'root',
})
export class RecipeStore {
  private _searchService = inject(SearchService);
  private _filterService = inject(FilterService);
  private _firestore = inject(Firestore);
  private _table = 'recipes';
  private _recipesColRef = collection(this._firestore, this._table);
  private _recipes = signal<I_Recipe[]>([]);

  constructor() {
    // Automatically responds to every change in SearchService
    // effect(() => {
    //   const search = this._searchService.searchQueryObject();
    //   const filter = this._filterService.filterbject();
    //   // Only search if we are on the recipe page or the search and filter is empty
    //   if (!search || !filter || search.pageName === 'recipe') {
    //     console.log('init');
    //     this._getAllRecipes();
    //   }
    // });
  }

  public get recipes(): Signal<I_Recipe[]> {
    return this._recipes.asReadonly();
  }

  public async _getAllRecipes(category: string = 'all', like: boolean = false) {
    const searchTerm = this._searchService.searchQueryObject()?.searchQuery.toLowerCase();
    const filterTerm = this._filterService.filterbject()?.filter;
    const constraints: QueryConstraint[] = [];

    if (filterTerm === 'like') {
      constraints.push(where('like', '==', true));
    } else if (filterTerm && filterTerm !== 'all') {
      category = filterTerm;
    }

    try {
      if (searchTerm && searchTerm.trim() !== '') {
        constraints.push(where('searchKeys', 'array-contains', searchTerm));
      }

      if (like) {
        constraints.push(where('like', '==', true));
      }

      const q = query(this._recipesColRef, ...constraints);
      const snapshot = await getDocs(q);
      // map data
      let data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as I_Recipe),
      }));

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

  public async getById(id: string): Promise<I_Recipe | null> {
    const recipeRef = doc(this._firestore, `${this._table}/${id}`);
    const snapshot = await getDoc(recipeRef);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...(snapshot.data() as I_Recipe),
    };
  }

  public async getByIngridient(name: string): Promise<I_Recipe[]> {
    const q = query(this._recipesColRef, where('ingredient', '==', name));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as I_Recipe),
    }));
  }

  public async addRecipe(recipe: I_Recipe): Promise<DocumentReference<DocumentData, DocumentData>> {
    this._setRecipes(recipe);
    const docRef = await addDoc(this._recipesColRef, recipe);
    const recipeWithId: I_Recipe = {
      ...recipe,
      id: docRef.id,
    };
    this._setRecipes(recipeWithId);
    return docRef;
  }

  public updateRecipe(recipe: I_Recipe, id: string) {
    this._setRecipes(recipe);
    const resipeRef = doc(this._firestore, `${this._table}/${id}`);
    return updateDoc(resipeRef, { ...recipe });
  }

  public async updateAllRecipes(newRecipe: {}) {
    const snapshot = await getDocs(this._recipesColRef);
    // init batch
    const batch = writeBatch(this._firestore);

    snapshot.forEach((document) => {
      const docRef = doc(this._firestore, `${this._table}/${document.id}`);
      // document add batch
      batch.update(docRef, { ...newRecipe });
    });

    // Submit all changes at once
    await batch.commit();
    console.log('Alle Rezepte wurden aktualisiert!');
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
            console.log('params', params);
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
