// import { TestBed } from '@angular/core/testing';

// import { RecipeStore } from './recipe-store';
// import { provideZonelessChangeDetection } from '@angular/core';
// import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
// import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
// import { RECIPES } from '../../../test/data';

// describe('RecipeService', () => {
//   let resipeService: RecipeStore;
//   let httpTestingController: HttpTestingController;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [
//         provideZonelessChangeDetection(),
//         // provideHttpClient(withInterceptorsFromDi()),
//         provideHttpClientTesting(),
//       ],
//     });
//     resipeService = TestBed.inject(RecipeStore);
//     httpTestingController = TestBed.inject(HttpTestingController);
//   });

//   it('should be RecipeService created', () => {
//     expect(resipeService).toBeTruthy();
//   });

//   //   it('should retrieve all recipes', () => {
//   //     resipeService.getAllRecipes().subscribe((recipes) => {
//   //       expect(recipes).toBeTruthy();
//   //       expect(recipes[0].id).toBe('1', 'The ID from the first recipe is not 1');
//   //       expect(recipes[recipes.length - 1].id).toBe('3', 'The ID from the first recipe is not 3');
//   //       expect(recipes.length).toBe(3);
//   //     });

//   //     const testRequest = httpTestingController.expectOne('http://localhost:3000/recipes');
//   //     expect(testRequest.request.method).toEqual('GET', 'Has not the method GET');

//   //     testRequest.flush(RECIPES);
//   //   });
// });
