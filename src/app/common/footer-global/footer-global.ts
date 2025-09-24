import { Component } from '@angular/core';

@Component({
  selector: 'app-footer-global',
  imports: [],
  templateUrl: './footer-global.html',
  styleUrl: './footer-global.scss'
})
export class FooterGlobal {
  currentYear: number = new Date().getFullYear();
}
