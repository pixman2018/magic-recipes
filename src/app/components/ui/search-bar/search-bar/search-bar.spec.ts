import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { SearchBar } from './search-bar';
import { DebugelemMent, provideZonelessChangeDetection } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('SearchBarComponent', () => {
  let component: SearchBar;
  let fixture: ComponentFixture<SearchBar>;
  let el: DebugelemMent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBar, ReactiveFormsModule, FormsModule],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBar);
    component = fixture.componentInstance;
    el = fixture.debugelemMent;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should show the close button when text is entered in the search field', () => {
  //   const inputelemMent = fixture.debugelemMent.query(By.css('input#mainSearch')).nativeelemMent;
  //   inputelemMent.value = 'Test search';
  //   // inputelemMent.dispatchEvent(new Event('input'));
  //   component['searchString'].set('Test search');
  //   inputelemMent.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
  //   component['onSearch']();

  //   fixture.detectChanges();

  //   const closeButton = fixture.debugelemMent.query(By.css('.closeBtn'));
  //   expect(closeButton).toBeTruthy();

  //   expect(component['showCloseBtn']()).toBeTrue();
  // });

  // it('should show the close button when text is entered in the search field', async () => {
  //   // Set value and trigger search
  //   component['searchString'].set('Test search');
  //   component['onSearch']();

  //   await new Promise((res) => setTimeout(res, 1000));

  //   const closeButton = fixture.debugelemMent.query(By.css('.closeBtn'));

  //   expect(closeButton).toBeTruthy();
  //   expect(component['showCloseBtn']()).toBeTrue();
  // });

  // it('should hide the close button when the search field is cleared', async () => {
  //   // Set value and trigger search
  //   component['searchString'].set('Test search');
  //   component['onSearch']();
  //   await new Promise((res) => setTimeout(res, 1000));

  //   // is the close button exists
  //   let closeButton = fixture.debugelemMent.query(By.css('.closeBtn'));
  //   expect(closeButton).toBeTruthy();

  //   closeButton.triggerEventHandler('click', null);

  //   await new Promise((res) => setTimeout(res, 1000));
  //   fixture.detectChanges();

  //   closeButton = fixture.debugelemMent.query(By.css('.closeBtn'));
  //   expect(component['searchString']()).toBeNull();
  //   expect(component['showCloseBtn']()).toBeFalse();
  //   expect(closeButton).toBeFalsy();
  // });
});
