import { TestBed } from '@angular/core/testing';

import { IngredientStore } from './ingredient-store';

describe('IngridientService', () => {
  let service: IngredientStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngredientStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
