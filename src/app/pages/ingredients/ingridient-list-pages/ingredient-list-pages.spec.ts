import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientListPage } from './ingredient-list-pages';
import { provideZonelessChangeDetection } from '@angular/core';

describe('IngridientListPages', () => {
  let component: IngredientListPage;
  let fixture: ComponentFixture<IngredientListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientListPage],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(IngredientListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
