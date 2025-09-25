import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FooterGlobal } from '../../common/footer-global/footer-global';
import { MenuGlobal } from '../../common/menu-global/menu-global';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ReadingJournalService } from '../../services/reading-journal-service';
import { Book } from '../../models/reading-journal/book';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Genres } from '../../enums/genres';
import { Status } from '../../enums/status';
import { Formats } from '../../enums/formats';
import { Author } from '../../models/reading-journal/author';
import { Series } from '../../models/reading-journal/series';

@Component({
  selector: 'app-reading-journal',
  imports: [MenuGlobal, FooterGlobal, FontAwesomeModule, ReactiveFormsModule, DatePipe],
  templateUrl: './reading-journal.html',
  styleUrl: './reading-journal.scss'
})
export class ReadingJournal {
  private readingJournalService = inject(ReadingJournalService);
  private fb = inject(FormBuilder);

  titulo: string = 'Reading Journal';
  modalTitle: string = '';
  modalButtonTitle: string = '';
  faPlus = faPlus;
  selectedBook?: Book;

  Genres = Genres;   // <--- assim você consegue usar no template
  Status = Status;
  Formats = Formats;

  // >>>>>>>>>>>>>>>>>>>>>>>>>> MOCKADO, DEPOIS BUSCAR NO BACKEND <<<<<<<<<<<<<<<<<<<<<<<<<<
  authors: Author[] = [
    { id: 1, name: 'Andrew Hunt' },
    { id: 2, name: 'Robert C. Martin' },
    { id: 3, name: 'J.K. Rowling' }
  ];

  series: Series[] = [
    { id: 1, name: 'Programming Mastery' },
    { id: 2, name: 'Clean Code Series' },
    { id: 3, name: 'Harry Potter' }
  ];

  formats: { key: number; value: string }[] = [];
  statuses: { key: number; value: string }[] = [];
  genersList: { key: number; value: string }[] = [];

  books: Book[] = [
    new Book({
      id: 1,
      name: 'The Pragmatic Programmer',
      author: { id: 1, name: 'Andrew Hunt', books: [] } as Author,
      pages: 352,
      currentPage: 100,
      startDate: new Date(2025, 8, 20),
      endDate: new Date(2025, 8, 24),
      genre: [Genres.Technology],
      publisher: 'Addison-Wesley',
      format: Formats.Hardcover,
      description: 'A book about pragmatic approaches to software development.',
      review: 'Excelente leitura para devs.',
      status: Status.InProgress,
      price: 199.90,
      series: { id: 1, name: 'Programming Mastery', books: [] } as Series
    }),
    new Book({
      id: 2,
      name: 'Clean Code',
      author: { id: 2, name: 'Robert C. Martin', books: [] } as Author,
      pages: 464,
      currentPage: 200,
      startDate: new Date(2025, 7, 15),
      endDate: new Date(2025, 7, 30),
      genre: [Genres.Technology, Genres.NonFiction],
      publisher: 'Prentice Hall',
      format: Formats.Paperback,
      description: 'Guidelines for writing clean and maintainable code.',
      review: 'Indispensável para qualquer programador.',
      status: Status.Finished,
      price: 249.50,
      series: { id: 2, name: 'Clean Code Series', books: [] } as Series
    }),
    new Book({
      id: 3,
      name: 'Harry Potter and the Philosopher\'s Stone',
      author: { id: 3, name: 'J.K. Rowling', books: [] } as Author,
      pages: 223,
      currentPage: 223,
      startDate: new Date(2025, 0, 5),
      endDate: new Date(2025, 0, 15),
      genre: [Genres.Fantasy],
      publisher: 'Bloomsbury',
      format: Formats.Hardcover,
      description: 'The first book in the Harry Potter series.',
      review: 'Clássico da fantasia moderna.',
      status: Status.Finished,
      price: 99.90,
      series: { id: 3, name: 'Harry Potter', books: [] } as Series
    })
  ];

  // >>>>>>>>>>>>>>>>>>>>>>>>>> FIM DO MOCK <<<<<<<<<<<<<<<<<<<<<<<<<<

  bookForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    author: ['', Validators.required],
    publisher: ['', Validators.required],
    price: [null, [
      Validators.pattern(/^\d+(\.\d{1,2})?$/)   // até 2 casas decimais
    ]],
    pages: [0, [
      Validators.required,
      Validators.min(1),
      Validators.pattern(/^\d+$/)   // somente inteiros
    ]],
    currentPage: [null, [
      Validators.pattern(/^\d+$/)   // somente inteiros
    ]],
    startDate: [null],
    endDate: [null],
    genre: [[], Validators.required],
    series: [''],
    format: [null, Validators.required],
    status: [null, Validators.required],
    description: [''],
    review: ['']
  }, {
    validators: (group: AbstractControl) => {
      const startDate = group.get('startDate')?.value;
      const endDate = group.get('endDate')?.value;
      const currentPage = group.get('currentPage')?.value;
      const pages = group.get('pages')?.value;

      const errors: any = {};

      // 1️⃣ endDate só pode ter valor se startDate estiver preenchido
      if (endDate && !startDate) {
        errors.endDate = { startDateRequired: true };
      }

      // 2️⃣ currentPage só pode ter valor se pages estiver preenchido
      if (currentPage != null && pages == null) {
        errors.currentPage = { pagesRequired: true };
      }

      // 3️⃣ endDate >= startDate
      if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
        errors.endDate = { ...errors.endDate, dateRangeInvalid: true };
      }

      // 4️⃣ currentPage <= pages
      if (currentPage != null && pages != null && currentPage > pages) {
        errors.currentPage = { ...errors.currentPage, pagesInvalid: true };
      }

      return Object.keys(errors).length ? { customErrors: errors } : null;
    }
  });

  get endDateErrors() {
    return this.bookForm.errors?.['customErrors']?.['endDate'];
  }

  get currentPageErrors() {
    return this.bookForm.errors?.['customErrors']?.['currentPage'];
  }

  ngOnInit(): void {
    this.getAllBooks();

    this.formats = Object.keys(Formats)
      .filter(key => isNaN(Number(key)))
      .map(key => ({ key: Formats[key as keyof typeof Formats], value: key }));

    this.statuses = Object.keys(Status)
      .filter(key => isNaN(Number(key)))
      .map(key => ({ key: Status[key as keyof typeof Status], value: key }));

    this.genersList = Object.keys(Genres)
      .filter(key => isNaN(Number(key)))
      .map(key => ({ key: Genres[key as keyof typeof Genres], value: key }));
  }

  getAllBooks(): void {
    this.readingJournalService.getAllBooks().subscribe({
      next: (data) => {
        this.books = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  onSubmit() {
    if (this.bookForm.valid) {
      this.readingJournalService.createBook(this.bookForm.value).subscribe({
        next: (success) => {
          if (success) {
            this.getAllBooks();
            this.bookForm.reset();
          }
        },
        error: (err) => {
          console.error(err);
        }
      })
    } else {
      this.bookForm.markAllAsTouched(); // força validação na tela
    }
  }

  onEdit() {
    if (this.bookForm.valid) {
      this.readingJournalService.createBook(this.bookForm.value).subscribe({
        next: (success) => {
          if (success) {
            this.getAllBooks();
            this.bookForm.reset();
          }
        },
        error: (err) => {
          console.error(err);
        }
      })
    } else {
      this.bookForm.markAllAsTouched(); // força validação na tela
    }
  }

  // Função genérica para converter enums
  enumToString(value: number | number[] | undefined, enumType: any): string {
    if (!value) return ''; // cobre undefined, null ou array vazio
    if (Array.isArray(value)) {
      return value.map(v => enumType[v]).join(', ');
    }
    return enumType[value];
  }

  // Função auxiliar para retornar os nomes dos gêneros como string
  getGenresString(book: Book): string {
    if (!book.genre || book.genre.length === 0) return '';
    return book.genre.map(g => Genres[g]).join(', ');
  }

  // Converte o status em string
  getStatusString(book: Book): string {
    return Status[book.status];
  }

  // Converte o formato em string
  getFormatString(book: Book): string {
    return Formats[book.format];
  }

  // Para abrir o modal de criação
  openCreateBook() {
    this.modalTitle = 'Add a Book';

    this.selectedBook = undefined;
    this.bookForm.reset();
    this.bookForm.enable();
  }
  // Para abrir o modal de edição
  openEditBook(book: Book) {
    this.modalTitle = 'Edit the book - ' + book.name;
    this.selectedBook = book;

    this.bookForm.get('name')?.disable();
    this.bookForm.get('author')?.disable();
    this.bookForm.get('publisher')?.disable();
    this.bookForm.get('format')?.disable();
    this.bookForm.get('pages')?.disable();

    // Preenche o formulário com os dados do livro
    this.bookForm.patchValue({
      name: book.name || '',
      author: book.author?.name || '',
      publisher: book.publisher || '',
      price: book.price ?? null,
      pages: book.pages ?? null,
      currentPage: book.currentPage ?? null,
      startDate: book.startDate ? new Date(book.startDate) : null,
      endDate: book.endDate ? new Date(book.endDate) : null,
      genre: book.genre || [],
      series: book.series?.name || '',
      format: book.format,
      status: book.status,
      description: book.description || '',
      review: book.review || ''
    });
  }
}