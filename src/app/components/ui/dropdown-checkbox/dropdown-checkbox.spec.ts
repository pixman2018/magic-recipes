import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownCheckbox } from './dropdown-checkbox';

describe('DropdownCheckbox', () => {
  let component: DropdownCheckbox;
  let fixture: ComponentFixture<DropdownCheckbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownCheckbox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownCheckbox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
