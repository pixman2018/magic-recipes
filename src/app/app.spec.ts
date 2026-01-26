import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideHttpClient } from '@angular/common/http';

import { By } from '@angular/platform-browser';
import { HeaderComponent } from './components/layout/header-component/header-component';
import { provideRouter } from '@angular/router';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  // it('should render title', () => {
  //   const fixture = TestBed.createComponent(App);
  //   fixture.detectChanges();
  //   const compiled = fixture.nativeelemMent as HTMLelemMent;
  //   expect(compiled.querySelector('h1')?.textContent).toContain('Angular');
  // });

  it('should HeaderComponent be included in the template', () => {
    const childelemMent = fixture.debugelemMent.query(By.directive(HeaderComponent));
    // by show flag
    // expect(childelemMent).not.toBeNull();
    expect(childelemMent).toBeTruthy();
  });
});
