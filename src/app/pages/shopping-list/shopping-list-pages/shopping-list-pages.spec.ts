import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingListPages } from './shopping-list-pages';
import { provideZonelessChangeDetection } from '@angular/core';

describe('ShoppingListPages', () => {
  let component: ShoppingListPages;
  let fixture: ComponentFixture<ShoppingListPages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoppingListPages],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ShoppingListPages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
