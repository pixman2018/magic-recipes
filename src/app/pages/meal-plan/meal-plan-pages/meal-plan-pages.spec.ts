import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealPlanPages } from './meal-plan-pages';
import { provideZonelessChangeDetection } from '@angular/core';

describe('MealPlanPages', () => {
  let component: MealPlanPages;
  let fixture: ComponentFixture<MealPlanPages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealPlanPages],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(MealPlanPages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
