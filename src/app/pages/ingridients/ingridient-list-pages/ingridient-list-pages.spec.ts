import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngridientListPages } from './ingridient-list-pages';
import { provideZonelessChangeDetection } from '@angular/core';

describe('IngridientListPages', () => {
  let component: IngridientListPages;
  let fixture: ComponentFixture<IngridientListPages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngridientListPages],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(IngridientListPages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
