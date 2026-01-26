import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { IngredientListPage } from './pages/ingredients/ingridient-list-pages/ingredient-list-pages';
import { ShoppingListPages } from './pages/shopping-list/shopping-list-pages/shopping-list-pages';
import { MealPlanPages } from './pages/meal-plan/meal-plan-pages/meal-plan-pages';
import { RecipeDetails } from './pages/recipe/recipe-details/recipe-details-pages';
import { Example } from './example/example';
import { NotFound } from './pages/not-found/not-found';
import { RecipeForm } from './pages/recipe/recipe-form/recipe-form';

export const routes: Routes = [
  {
    path: 'recipes',
    component: HomePage,
  },
  {
    path: 'recipe/:id',
    component: RecipeDetails,
  },
  {
    path: 'ingredient',
    component: IngredientListPage,
  },
  {
    path: 'shopping-list',
    component: ShoppingListPages,
  },
  {
    path: 'mealplan',
    component: MealPlanPages,
  },
  {
    path: 'add-recipe',
    component: RecipeForm,
  },
  {
    path: 'example',
    component: Example,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/recipes',
  },
  {
    path: 'recipe',
    pathMatch: 'full',
    redirectTo: 'recipes',
  },
  {
    path: '**',
    component: NotFound,
  },
];
