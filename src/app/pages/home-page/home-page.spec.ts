import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home-page';
import { DebugElement, provideZonelessChangeDetection } from '@angular/core';
import { RecipeStore } from '../../services/recipesStore/recipe-store';
import { of } from 'rxjs';
import { RECIPES } from '../../../test/data';

// describe('HomePage (Zone-less)', () => {
// let component: HomePage;
// let fixture: ComponentFixture<HomePage>;
// let el: DebugElement;
// let recipeServiceSpy: jasmine.SpyObj<RecipeService>;
// beforeEach(async () => {
//   recipeServiceSpy = jasmine.createSpyObj('RecipeService', ['getAllRecipes']);
//   recipeServiceSpy.getAllRecipes.and.returnValue(of(RECIPES));
//   await TestBed.configureTestingModule({
//     imports: [HomePage],
//     providers: [
//       provideZonelessChangeDetection(),
//       { provide: RecipeService, useValue: recipeServiceSpy },
//     ],
//   }).compileComponents();
//   fixture = TestBed.createComponent(HomePage);
//   component = fixture.componentInstance;
//   el = fixture.debugElement;
//   // **Service set before detectChanges**
//   (component as any)['_recipeService'] = recipeServiceSpy;
//   fixture.detectChanges(); // call ngOnInit()
// });
// it('should create HomePage', () => {
//   expect(component).toBeTruthy();
// });
// it('should call private _getAllRecipes(), set recipes', () => {
//   // Private Methode explizit aufrufen
//   (component as any)._getAllRecipes();
//   expect(component.recipes).toEqual(RECIPES, 'Recipes not found');
//   expect(component.recipes.length).toBeGreaterThan(0, 'The request length is 0.');
//   const firstRecipe = component.recipes.at(0);
//   expect(firstRecipe?.id).toBe('1', 'ID from the first recipe is not 1');
//   expect(recipeServiceSpy.getAllRecipes).toHaveBeenCalled();
// });
// });
