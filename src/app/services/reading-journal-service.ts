import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/reading-journal/book';
import { Author } from '../models/reading-journal/author';
import { Series } from '../models/reading-journal/series';

@Injectable({
  providedIn: 'root'
})
export class ReadingJournalService {
  private readonly apiUrl = environment.apiUrl + '/ReadingJournal';
  private http = inject(HttpClient);

  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/books/getall`);
  }

  editBook(book: Book): Observable<boolean> {
    return this.http.patch<boolean>(`${this.apiUrl}/book/edit`, book);
  }

  createBook(book: Book): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/book/create`, book);
  }

  deleteBook(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/book/delete/${id}`);
  }

  createAuthor(authorName: string): Observable<Author> {
    return this.http.post<Author>(
      `${this.apiUrl}/author/create`,
      `"${authorName}"`,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  createSeries(seriesName: string): Observable<Series> {
    return this.http.post<Series>(
      `${this.apiUrl}/series/create`,
      `"${seriesName}"`,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
}
