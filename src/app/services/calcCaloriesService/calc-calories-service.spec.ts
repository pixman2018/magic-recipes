import { TestBed } from '@angular/core/testing';

import { CalcCaloriesServiceTs } from './calc-calories-service.js';

describe('CalcCaloriesServiceTs', () => {
  let service: CalcCaloriesServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalcCaloriesServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
