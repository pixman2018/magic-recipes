import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { IngridientListPages } from './pages/ingridients/ingridient-list-pages/ingridient-list-pages';
import { ShoppingListPages } from './pages/shopping-list/shopping-list-pages/shopping-list-pages';
import { MealPlanPages } from './pages/meal-plan/meal-plan-pages/meal-plan-pages';
import { RecipeDetails } from './pages/recipe/recipe-details/recipe-details-pages';
import { Example } from './example/example';
import { NotFound } from './pages/not-found/not-found';

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
    path: 'ingridiens',
    component: IngridientListPages,
  },
  {
    path: 'shoppinglist',
    component: ShoppingListPages,
  },
  {
    path: 'mealplan',
    component: MealPlanPages,
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
    path: '**',
    component: NotFound,
  },
];
