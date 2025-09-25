import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FooterGlobal } from '../../common/footer-global/footer-global';
import { MenuGlobal } from '../../common/menu-global/menu-global';
import { ChartsService } from '../../services/charts-service';

@Component({
  selector: 'app-household-budget',
  imports: [MenuGlobal, FooterGlobal, FontAwesomeModule],
  templateUrl: './household-budget.html',
  styleUrl: './household-budget.scss'
})
export class HouseholdBudget implements AfterViewInit {
  titulo: string = 'Household Budget';
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  constructor(private chartService: ChartsService) { }

  ngAfterViewInit(): void {
    this.chartService.renderLineChart(
      this.chartContainer.nativeElement,
      'Vendas',
      ['Jan', 'Fev', 'Mar'],
      [{ name: 'Produto A', data: [10, 20, 30] }]
    );
  }
}
