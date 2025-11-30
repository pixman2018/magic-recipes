import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Parent } from './parent';
import { provideZonelessChangeDetection } from '@angular/core';
import { Child2 } from '../child2/child2';

import { By } from '@angular/platform-browser';

xdescribe('Parent', () => {
  let component: Parent;
  let fixture: ComponentFixture<Parent>;
  let h1: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Parent, Child2],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Parent);
    component = fixture.componentInstance;
    h1 = fixture.nativeElement.querySelector('h1');
    fixture.detectChanges();

    /*
    loacal storage
    */
    let store: { [key: string]: string } = {};
    const mockLocalStorage = {
      getItem: (key: string): string | null => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };

    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear').and.callFake(mockLocalStorage.clear);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /** Signal test  */
  it('should value from title', () => {
    expect(component.title()).toContain('Test Tour of Heroes');
  });

  it('should display original title', () => {
    // expect(h1.textContent).toContain('Test Tour of Heroes');
    expect(h1.textContent).toContain(component.title());
  });

  it('should display a different test title', async () => {
    const oldTitle = component.title();
    const newTitle = 'Test Title';
    component.title.set(newTitle);

    // Displayed title is old because Angular didn't yet run change detection
    expect(h1.textContent).toContain(oldTitle);
    await fixture.whenStable();
    expect(h1.textContent).toContain(newTitle);
  });

  // it('should display updated title after detectChanges', () => {
  //   component.title.set('Test Title');
  //   fixture.detectChanges();
  //   expect(h1.textContent).toContain(component.title);
  // });

  /** end Signal test  */

  /**  start property */
  it('should check private property', () => {
    expect(component['test']).toEqual('Basis');
  });

  it('should check protected property', () => {
    expect(component['test1']).toEqual('Wert');
  });

  it('should check protected public', () => {
    expect(component.test2).toEqual('Angular');
  });

  /**  start property */

  /** methode  */
  it('should call getFullname method', () => {
    expect(component['getFullName']()).toEqual(`${component.firstname} ${component.lastname}`);
  });
  /** end methode  */

  /** child component */
  it('should Child2Compoent be included in the template', () => {
    const childElement = fixture.debugElement.query(By.directive(Child2));
    // by show flag
    // expect(childElement).not.toBeNull();
    expect(childElement).toBeTruthy();
  });
});
