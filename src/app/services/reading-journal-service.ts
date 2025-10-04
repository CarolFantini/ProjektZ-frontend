import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookDTO } from '../models/reading-journal/bookDTO';
import { AuthorDTO } from '../models/reading-journal/authorDTO';
import { Series } from '../models/reading-journal/series';

@Injectable({
  providedIn: 'root'
})
export class ReadingJournalService {
  private readonly apiUrl = environment.apiUrl + '/ReadingJournal';
  private http = inject(HttpClient);

  getAllBooks(): Observable<BookDTO[]> {
    return this.http.get<BookDTO[]>(`${this.apiUrl}/books/getall`);
  }

  getAllAuthors(): Observable<AuthorDTO[]> {
    return this.http.get<AuthorDTO[]>(`${this.apiUrl}/authors/getall`);
  }

  getAllSeries(): Observable<Series[]> {
    return this.http.get<Series[]>(`${this.apiUrl}/series/getall`);
  }

  editBook(book: BookDTO): Observable<boolean> {
    return this.http.patch<boolean>(`${this.apiUrl}/book/edit`, book);
  }

  createBook(book: BookDTO): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/book/create`, book);
  }

  deleteBook(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/book/${id}`);
  }

  createAuthors(name: string): Observable<AuthorDTO> {
    return this.http.post<AuthorDTO>(
      `${this.apiUrl}/author/create`,
      { name },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  createSeries(name: string): Observable<Series> {
    return this.http.post<Series>(
      `${this.apiUrl}/series/create`,
      name,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
}
