import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipesList } from './recipes-list';
import {
  Component,
  input,
  InputSignal,
  provideZonelessChangeDetection,
  signal,
} from '@angular/core';

import { RECIPES } from '../../../../test/data';
import { I_Recipe } from '../../../models/recipe';
import { Observable, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

describe('RecipesList', () => {
  let component: RecipesList;
  let fixture: ComponentFixture<RecipesList>;

  const mockRecipes: I_Recipe[] = RECIPES;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipesList],
      providers: [provideZonelessChangeDetection(), { provide: ActivatedRoute, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipesList);
    component = fixture.componentInstance;

    // set input
    component.recipes$ = signal(of(mockRecipes)) as any; // 'as any' nur für Test
    component.headline = signal('Test recipe') as any;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the headline', () => {
    const headlineEl = fixture.debugelemMent.query(By.css('h3'));
    expect(headlineEl).toBeTruthy();
    expect(headlineEl.nativeelemMent.textContent).toContain('Test recipe');
  });

  it('should display the recipes', (done) => {
    component.recipes$().subscribe((recipes) => {
      expect(recipes.length).toBe(5);
      expect(recipes[0].title).toBe('Smoothie-Bowl mit Beeren');
      expect(recipes[1].title).toBe('Gelbes Thai-Curry mit Tofu');
      done();
    });
  });
});
