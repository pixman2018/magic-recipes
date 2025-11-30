import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { SearchBarComponent } from './search-bar.component';
import { DebugElement, provideZonelessChangeDetection } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { tickAsync } from '../../../../test/tick-async';

fdescribe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;
  let el: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBarComponent, ReactiveFormsModule, FormsModule],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the close button when text is entered in the search field', () => {
    const inputElement = fixture.debugElement.query(By.css('input#mainSearch')).nativeElement;
    inputElement.value = 'Test search';
    // inputElement.dispatchEvent(new Event('input'));
    component['searchString'].set('Test search');
    inputElement.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
    component['onSearch']();

    fixture.detectChanges();

    const closeButton = fixture.debugElement.query(By.css('.closeBtn'));
    expect(closeButton).toBeTruthy();

    expect(component['showCloseBtn']()).toBeTrue();
  });

  it('should show the close button when text is entered in the search field', async () => {
    // Set value and trigger search
    component['searchString'].set('Test search');
    component['onSearch']();

    await new Promise((res) => setTimeout(res, 1000));

    const closeButton = fixture.debugElement.query(By.css('.closeBtn'));

    expect(closeButton).toBeTruthy();
    expect(component['showCloseBtn']()).toBeTrue();
  });

  it('should hide the close button when the search field is cleared', async () => {
    // Set value and trigger search
    component['searchString'].set('Test search');
    component['onSearch']();
    await new Promise((res) => setTimeout(res, 1000));

    // is the close button exists
    let closeButton = fixture.debugElement.query(By.css('.closeBtn'));
    expect(closeButton).toBeTruthy();

    closeButton.triggerEventHandler('click', null);

    await new Promise((res) => setTimeout(res, 1000));
    fixture.detectChanges();

    closeButton = fixture.debugElement.query(By.css('.closeBtn'));
    expect(component['searchString']()).toBeNull();
    expect(component['showCloseBtn']()).toBeFalse();
    expect(closeButton).toBeFalsy();
  });
});
