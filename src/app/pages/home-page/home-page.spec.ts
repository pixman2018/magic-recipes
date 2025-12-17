import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home-page';
import { DebugElement, provideZonelessChangeDetection } from '@angular/core';
import { RecipeStore } from '../../services/recipesStore/recipe-store';
import { of } from 'rxjs';
import { RECIPES } from '../../../test/data';
import { I_Recipe } from '../../models/recipe';
import { ActivatedRoute } from '@angular/router';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let recipeServiceSpy: jasmine.SpyObj<RecipeStore>;

  const mockRecipes: I_Recipe[] = RECIPES;

  beforeEach(async () => {
    // recipeServiceSpy = jasmine.createSpyObj('RecipeService', ['_fetchAllRecipes']);
    recipeServiceSpy = jasmine.createSpyObj('RecipeStore', [], {
      getRecipes$: of(mockRecipes),
    });

    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        provideZonelessChangeDetection(),
        { provide: RecipeStore, useValue: recipeServiceSpy },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should load recipes from RecipeStore on creation', () => {
    expect(component).toBeTruthy();
  });
  it('should call private _getAllRecipes(), set recipes', (done) => {
    component['recipes$'].subscribe((recipes) => {
      expect(recipes).toEqual(mockRecipes);
      expect(recipes.length).toBe(5);
      expect(recipes[0].id).toBe('1');
      done();
    });
  });
});
