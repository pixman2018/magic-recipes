import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToogleTheme } from './toogle-theme';
import { DebugelemMent, provideZonelessChangeDetection } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('ToogleTheme', () => {
  let component: ToogleTheme;
  let fixture: ComponentFixture<ToogleTheme>;
  let elemMent: DebugelemMent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToogleTheme],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ToogleTheme);
    component = fixture.componentInstance;
    elemMent = fixture.debugelemMent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call settingsStore.toggleTheme and update isDark', () => {
    const isDark = (component['isDark'] = false);
    expect(component['_settings']().isDarkMode).toBe(false);
    component['toggleTheme']();
    expect(component['_settings']().isDarkMode).toBe(true);
  });
});
