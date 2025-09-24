import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FooterGlobal } from '../../common/footer-global/footer-global';
import { MenuGlobal } from '../../common/menu-global/menu-global';

@Component({
  selector: 'app-household-budget',
  imports: [MenuGlobal, FooterGlobal, FontAwesomeModule],
  templateUrl: './household-budget.html',
  styleUrl: './household-budget.scss'
})
export class HouseholdBudget {

}
