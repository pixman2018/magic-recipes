import { TestBed } from '@angular/core/testing';

import { ShoppingListStore } from './shopping-list-store';

describe('ShoppingListStore', () => {
  let service: ShoppingListStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShoppingListStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
