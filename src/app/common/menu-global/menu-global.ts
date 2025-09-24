import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-menu-global',
  imports: [FontAwesomeModule],
  templateUrl: './menu-global.html',
  styleUrl: './menu-global.scss'
})
export class MenuGlobal {
  faRightFromBracket = faRightFromBracket;
}
