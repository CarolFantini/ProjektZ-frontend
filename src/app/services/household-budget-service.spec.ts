import { TestBed } from '@angular/core/testing';

import { HouseholdBudgetService } from './household-budget-service';

describe('HouseholdBudgetService', () => {
  let service: HouseholdBudgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HouseholdBudgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
