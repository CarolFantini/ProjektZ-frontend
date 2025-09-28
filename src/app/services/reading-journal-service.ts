import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/reading-journal/book';

@Injectable({
  providedIn: 'root'
})
export class ReadingJournalService {
  private readonly apiUrl = environment.apiUrl + '/ReadingJournal';
  private http = inject(HttpClient);

  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/books/getall`);
  }

  createBook(book: Book): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/book/create`, book);
  }

  deleteBook(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/book/delete/${id}`);
  }
}
