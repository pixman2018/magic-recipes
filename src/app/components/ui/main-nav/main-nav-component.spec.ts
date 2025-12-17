import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainNavComponent } from './main-nav-component';
import { DebugElement, provideZonelessChangeDetection } from '@angular/core';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterLink } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('MainNavComponent', () => {
  let component: MainNavComponent;
  let fixture: ComponentFixture<MainNavComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainNavComponent, RouterLink],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MainNavComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.autoDetectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true when viewport width is <= 639px ', () => {
    component['viewportWidth'].set(500);
    expect(component['isMobileViewport']()).toBeTrue();
  });

  it('should return false when viewport width is > 639px', () => {
    component['viewportWidth'].set(800);
    expect(component['isMobileViewport']()).toBeFalse();
  });

  it('should click hamburger button', () => {
    component['showNavigation'] = false;
    const hamburgerBtn = debugElement.query(By.css('#hamburgerBtn'));
    expect(hamburgerBtn).toBeTruthy();

    hamburgerBtn.triggerEventHandler('click');
    expect(component['showNavigation']).toBeTrue();
  });

  it('should close navigation when close icon is clicked', () => {
    component['showNavigation'] = true;
    const closeBtn = debugElement.query(By.css('#closeBtn'));
    expect(closeBtn).toBeTruthy();

    closeBtn.triggerEventHandler('click');
    expect(component['showNavigation']).toBeFalse();
  });

  it('should handle window resize event', () => {
    const comp = fixture.componentInstance as any;
    const innerWidthSpy = spyOnProperty(window, 'innerWidth', 'get');
    innerWidthSpy.and.returnValue(400);
    comp['onSetViewport'](new Event('resize'));
    expect(comp.isMobile).toBeTrue();
    expect(comp.showNavigation).toBeFalse();
    innerWidthSpy.and.returnValue(800);
    comp['onSetViewport'](new Event('resize'));
    expect(comp.isMobile).toBeFalse();
    expect(comp.showNavigation).toBeTrue();
  });

  it('should emit handleShowSearch when clicking on "Rezepte"', () => {
    const emittedValues: any[] = [];
    component.handleShowSearch.subscribe((value) => emittedValues.push(value));
    const link = fixture.debugElement.query(By.css('a[routerLink="recipesList"]'));
    link.triggerEventHandler('click', new Event('click'));
    expect(emittedValues.length).toBe(1);
    expect(emittedValues[0]).toEqual({
      showSearchbar: true,
      pagename: 'recipies',
    });
  });
});
