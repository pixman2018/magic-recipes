// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { RecipeDetails } from './recipe-details-pages';
// import { provideZonelessChangeDetection } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { of } from 'rxjs';
// import {
//   HttpClientTestingModule,
//   HttpTestingController,
//   provideHttpClientTesting,
// } from '@angular/common/http/testing';

// describe('RecipeDetails', () => {
//   let component: RecipeDetails;
//   let fixture: ComponentFixture<RecipeDetails>;
//   let httpMock: HttpTestingController;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [RecipeDetails],
//       providers: [
//         provideHttpClientTesting(),
//         provideZonelessChangeDetection(),
//         {
//           provide: ActivatedRoute,
//           useValue: {
//             snapshot: {
//               paramMap: { get: () => 'some-id' }, // Mock den Routenparameter hier
//             },
//             queryParams: of({ search: 'test' }), // Optional: Mock der Abfrageparameter
//           },
//         },
//       ],
//     }).compileComponents();

//     fixture = TestBed.createComponent(RecipeDetails);
//     component = fixture.componentInstance;
//     httpMock = TestBed.inject(HttpTestingController);
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   afterEach(() => {
//     httpMock.verify();
//   });
// });
