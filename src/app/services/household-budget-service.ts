import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HouseholdBudgetService {
  private readonly apiUrl = environment.apiUrl + '/HouseholdBudget';
  private http = inject(HttpClient);
}
