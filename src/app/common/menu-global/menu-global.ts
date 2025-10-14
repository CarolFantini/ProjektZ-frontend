import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Menubar } from 'primeng/menubar';

@Component({
  selector: 'app-menu-global',
  imports: [ButtonModule, Menubar],
  templateUrl: './menu-global.html',
  styleUrl: './menu-global.scss'
})
export class MenuGlobal {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        url: 'pages/home',
      },
      {
        label: 'Household Budget',
        icon: 'pi pi-chart-line',
        url: 'pages/household-budget'
      },
      {
        label: 'Reading Journal',
        icon: 'pi pi-book',
        url: 'pages/reading-journal'
      },
      {
        label: 'Yearly OKRs Tracker',
        icon: 'pi pi-compass',
        items: [
          {
            label: '2025 Yearly OKRs Tracker',
            url: ''
          },
          {
            label: '2024 Yearly OKRs Tracker',
            url: ''
          }
        ]
      }
    ]
  }
}
