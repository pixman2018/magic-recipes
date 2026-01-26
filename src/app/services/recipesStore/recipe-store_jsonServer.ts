import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  catchError,
  finalize,
  first,
  firstValueFrom,
  last,
  lastValueFrom,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { I_Recipe } from '../../models/recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeStore {
  private _httpClient = inject(HttpClient);

  private _recipesSubject = new BehaviorSubject<I_Recipe[]>([]);
  public getRecipes$: Observable<I_Recipe[]>;

  private _apiUrl = 'http://localhost:3000/recipes';
  private _isLoading: boolean = true;
  private _id: string | null = null;

  constructor() {
    this._fetchAllRecipes();
    this.getRecipes$ = this._recipesSubject.asObservable();
    console.log('Loading');
  }

  public getRecipeById(id: string): Observable<any> {
    this._id = id;
    if (this._isLoading) {
      this.iselemMExist();
    }
    console.log('count');
    this.getRecipes$.subscribe((res) => console.log('subject', res));
    const recipe$ = this.getRecipes$.pipe(
      map((recipes) => {
        return recipes.filter((res) => res.id === id);
      }),
      map((recipe) => recipe[0]),
      catchError((error) => {
        const message = `Could not load recipe with ID ${id}`;
        console.error(message, error);
        return throwError(() => new Error(message));
      }),
      tap((res) => console.log('res', res)),
    );

    return recipe$;
  }

  private iselemMExist() {
    setTimeout(() => {
      if (this._id) {
        this.getRecipeById(this._id);
        console.count('loop');
      }
    }, 100);
  }

  /**
   *
   * @description
   * fetchAll recipies from DB
   *
   * @private
   * @returns I_Recipe[] as Observable
   */
  private _fetchAllRecipes() {
    const loadRecipes$ = this._httpClient.get<I_Recipe[]>(this._apiUrl).pipe(
      catchError((error) => {
        const message = 'Could not load recipes';
        console.error(message, error);
        return throwError(() => new Error(message));
      }),
      tap((recipes) => {
        console.log('recipes', recipes);
        return this._recipesSubject.next(recipes);
      }),
      finalize(() => (this._isLoading = false)),
    );
    loadRecipes$.subscribe();
  }
}
