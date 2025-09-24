import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FooterGlobal } from '../../common/footer-global/footer-global';
import { MenuGlobal } from '../../common/menu-global/menu-global';

@Component({
  selector: 'app-reading-journal',
  imports: [MenuGlobal, FooterGlobal, FontAwesomeModule],
  templateUrl: './reading-journal.html',
  styleUrl: './reading-journal.scss'
})
export class ReadingJournal {

}
