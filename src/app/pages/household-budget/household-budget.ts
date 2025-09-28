import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FooterGlobal } from '../../common/footer-global/footer-global';
import { MenuGlobal } from '../../common/menu-global/menu-global';
import { ChartsService } from '../../services/charts-service';

@Component({
  selector: 'app-household-budget',
  imports: [MenuGlobal, FooterGlobal],
  templateUrl: './household-budget.html',
  styleUrl: './household-budget.scss'
})
export class HouseholdBudget {
  private chartsService = inject(ChartsService);
  titulo: string = 'Household Budget';
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
}
