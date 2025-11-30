import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterComponent } from './filter';
import { DebugElement, provideZonelessChangeDetection } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('Filter', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('The categories should not be an empty array. ', () => {
    expect(component['recipiesCategories'].length).toBeGreaterThan(0);
  });

  it('should call onChangeCategory with the selected DOM element when category changes', () => {
    //   // 🕵️  Observe method
    spyOn(component as any, 'onChangeCategory').and.callThrough();

    const select: HTMLSelectElement = fixture.nativeElement.querySelector('#categoryCtrl');
    // Ensure that the options have been rendered
    fixture.detectChanges();
    //   // Select second option
    select.selectedIndex = 3;
    const selectedOption = select.options[3];

    //   // execute Change-Event
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component['onChangeCategory']).toHaveBeenCalledWith(select);
    expect(selectedOption.value).toBe('Main course');
  });
});
