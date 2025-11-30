import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipesList } from './recipes-list';
import { Component, input, provideZonelessChangeDetection, signal } from '@angular/core';

import { RECIPES } from '../../../../test/data';
import { I_Recipe } from '../../../models/recipe';

// Parent-Komponente simuliert Input
@Component({
  selector: 'app-host',
  template: `<app-recipes-list [recipes]="recipes"></app-recipes-list>`,
  standalone: true,
  imports: [RecipesList],
})
class HostComponent {
  recipes: I_Recipe[] = [];
}

// describe('RecipesList', () => {
//   let component: RecipesList;
//   let fixture: ComponentFixture<HostComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [RecipesList],
//       providers: [provideZonelessChangeDetection()],
//     }).compileComponents();

// fixture = TestBed.createComponent(RecipesList);
// component = fixture.componentInstance;

//   fixture = TestBed.createComponent(HostComponent);
//   fixture.componentInstance.recipes = RECIPES;

//   fixture.detectChanges();
// });

// it('should create RecipesList component', () => {
//   const recipesListDE = fixture.debugElement.query(
//     (d) => d.componentInstance instanceof RecipesList
//   );
//   const recipesList = recipesListDE.componentInstance;
//   expect(recipesList).toBeTruthy();
// });

// it('should render recipes from input', () => {
//   const recipesListDE = fixture.debugElement.query(
//     (d) => d.componentInstance instanceof RecipesList
//   );
//   const recipesList = recipesListDE.componentInstance;

//   // Prüfen, dass das Signal die Rezepte enthält
//   expect(recipesList.recipes()).toEqual(RECIPES);

//   // Prüfen, ob die Namen im DOM gerendert werden
//   const compiled = recipesListDE.nativeElement as HTMLElement;
//   expect(compiled.textContent).toContain('Recipe 1');
//   expect(compiled.textContent).toContain('Recipe 2');
// });
// });
