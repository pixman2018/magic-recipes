import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Example } from './example';
import { provideZonelessChangeDetection } from '@angular/core';

describe('Example', () => {
  let component: Example;
  let fixture: ComponentFixture<Example>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Example],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Example);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
