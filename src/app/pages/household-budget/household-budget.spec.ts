import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdBudget } from './household-budget';

describe('HouseholdBudget', () => {
  let component: HouseholdBudget;
  let fixture: ComponentFixture<HouseholdBudget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HouseholdBudget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HouseholdBudget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
