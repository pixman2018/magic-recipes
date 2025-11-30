import { TestBed } from '@angular/core/testing';

import { ShoppingListService } from './shopping-list.service';
import { provideZonelessChangeDetection } from '@angular/core';

describe('ShoppingListService', () => {
  let service: ShoppingListService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(ShoppingListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
