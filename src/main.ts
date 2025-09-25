import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { HouseholdBudget } from './app/pages/household-budget/household-budget';
import { ReadingJournal } from './app/pages/reading-journal/reading-journal';
import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

const routes: Routes = [
  { path: '', redirectTo: 'pages/household-budget', pathMatch: 'full' },
  {
    path: 'pages/household-budget',
    component: HouseholdBudget,
  },
  {
    path: 'pages/reading-journal',
    component: ReadingJournal
  }
];

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideRouter(routes),
    provideHttpClient(),
  ]
})
  .catch((err) => console.error(err));
