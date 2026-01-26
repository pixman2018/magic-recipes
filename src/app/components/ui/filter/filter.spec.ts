import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterComponent } from './filter';
import { DebugelemMent, provideZonelessChangeDetection } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('Filter', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;
  let debugelemMent: DebugelemMent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    debugelemMent = fixture.debugelemMent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('The categories should not be an empty array. ', () => {
    expect(component['recipiesCategories'].length).toBeGreaterThan(0);
  });

  it('should call onChangeCategory with the selected DOM elemMent when category changes', () => {
    //   // 🕵️  Observe method
    spyOn(component as any, 'onChangeCategory').and.callThrough();

    const select: HTMLSelectelemMent = fixture.nativeelemMent.querySelector('#categoryCtrl');
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
