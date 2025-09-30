import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FooterGlobal } from '../../common/footer-global/footer-global';
import { MenuGlobal } from '../../common/menu-global/menu-global';
import { ReadingJournalService } from '../../services/reading-journal-service';
import { Book } from '../../models/reading-journal/book';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Genres } from '../../enums/genres';
import { Status } from '../../enums/status';
import { Formats } from '../../enums/formats';
import { Author } from '../../models/reading-journal/author';
import { Series } from '../../models/reading-journal/series';
import { ChartsService } from '../../services/charts-service';

import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { Tag } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { MultiSelect } from 'primeng/multiselect';
import { DatePicker } from 'primeng/datepicker';
import { AutoComplete } from 'primeng/autocomplete';
import { Select } from 'primeng/select';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-reading-journal',
  imports: [MenuGlobal, FooterGlobal, ReactiveFormsModule, DatePipe, CurrencyPipe,
    TableModule, IconFieldModule, InputIconModule, DialogModule, ButtonModule, ToolbarModule,
    Tag, ToastModule, InputGroup, InputGroupAddon, MultiSelect, DatePicker, AutoComplete, Select,
    InputNumber, InputText, Textarea],
  templateUrl: './reading-journal.html',
  styleUrl: './reading-journal.scss'
})
export class ReadingJournal {
  @ViewChild('formatChart') formatChart!: ElementRef;
  @ViewChild('genresChart') genresChart!: ElementRef;
  @ViewChild('dt') dt!: Table;
  private readingJournalService = inject(ReadingJournalService);
  private chartsService = inject(ChartsService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);

  titulo: string = 'Reading Journal';
  modalTitle: string = '';
  modalButtonTitle: string = '';
  selectedBook?: Book;
  totalPages: number = 0;
  totalPrice: number = 0;
  totalDaysSpent: number = 0;
  totalBooks = 0;
  dialogVisible: boolean = false;
  newBookDialogvisible: boolean = false;
  cols: Column[] = [
    { header: 'Name', field: 'name' },
    { header: 'Author', field: 'author.name' },
    { header: 'Publisher', field: 'publisher' },
    { header: 'Status', field: 'status' },
    { header: 'Pages', field: 'pages' },
    { header: 'Current Page', field: 'currentPage' },
    { header: 'Start Date', field: 'startDate' },
    { header: 'End Date', field: 'endDate' },
    { header: 'Genre', field: 'genre' },
    { header: 'Format', field: 'format' },
    { header: 'Price', field: 'price' },
    { header: 'Series', field: 'series.name' },
    { header: 'Days Spend', field: 'daysSpentReading' },
    { header: 'Progress', field: 'progressPercentage' }
  ];
  filteredAuthors: Author[] = [];
  filteredSeries: Series[] = [];

  filterFields: string[] = this.cols.map(col => col.field);

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
      id: "1",
      name: 'The Pragmatic Programmer',
      author: { id: 1, name: 'Andrew Hunt' } as Author,
      pages: 352,
      currentPage: 100,
      startDate: new Date(2025, 8, 20),
      endDate: new Date(2025, 8, 24),
      genre: [Genres.Technology],
      publisher: 'Addison-Wesley',
      format: Formats.eBook,
      description: 'A book about pragmatic approaches to software development.',
      review: 'Excelente leitura para devs.',
      status: Status.InProgress,
      price: 199.90,
      series: { id: 1, name: 'Programming Mastery' } as Series
    }),
    new Book({
      id: "2",
      name: 'Clean Code',
      author: { id: 2, name: 'Robert C. Martin' } as Author,
      pages: 464,
      currentPage: 200,
      startDate: new Date(2025, 7, 15),
      endDate: new Date(2025, 7, 30),
      genre: [Genres.Technology, Genres.NonFiction],
      publisher: 'Prentice Hall',
      format: Formats.ComicBook,
      description: 'Guidelines for writing clean and maintainable code.',
      review: 'Indispensável para qualquer programador.',
      status: Status.Finished,
      price: 249.50,
      series: { id: 2, name: 'Clean Code Series' } as Series
    }),
    new Book({
      id: "3",
      name: 'Harry Potter and the Philosopher\'s Stone',
      author: { id: 3, name: 'J.K. Rowling' } as Author,
      pages: 223,
      currentPage: 223,
      startDate: new Date(2025, 0, 5),
      endDate: new Date(2025, 0, 15),
      genre: [Genres.Fantasy],
      publisher: 'Bloomsbury',
      format: Formats.Other,
      description: 'The first book in the Harry Potter series.',
      review: 'Clássico da fantasia moderna.',
      status: Status.Finished,
      price: 99.90,
      series: { id: 3, name: 'Harry Potter' } as Series
    }),
    new Book({
      id: "4",
      name: 'The Pragmatic Programmer',
      author: { id: 1, name: 'Andrew Hunt' } as Author,
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
      series: { id: 1, name: 'Programming Mastery' } as Series
    }),
    new Book({
      id: "5",
      name: 'The Pragmatic Programmer',
      author: { id: 1, name: 'Andrew Hunt' } as Author,
      pages: 352,
      currentPage: 100,
      startDate: new Date(2025, 8, 20),
      endDate: new Date(2025, 8, 24),
      genre: [Genres.Technology],
      publisher: 'Addison-Wesley',
      format: Formats.Paperback,
      description: 'A book about pragmatic approaches to software development.',
      review: 'Excelente leitura para devs.',
      status: Status.InProgress,
      price: 199.90,
      series: { id: 1, name: 'Programming Mastery' } as Series
    }),
    new Book({
      id: "6",
      name: 'The Pragmatic Programmer',
      author: { id: 1, name: 'Andrew Hunt' } as Author,
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
      series: { id: 1, name: 'Programming Mastery' } as Series
    }),
    new Book({
      id: "7",
      name: 'sss',
      author: { id: 1, name: 'Andrew Hunt' } as Author,
      pages: 352,
      currentPage: 100,
      startDate: new Date(2025, 8, 20),
      endDate: new Date(),
      genre: [Genres.Technology],
      publisher: 'Addison-Wesley',
      format: Formats.Hardcover,
      description: 'A book about pragmatic approaches to software development.',
      review: 'Excelente leitura para devs.',
      status: Status.ToRead,
      price: 199.90,
      series: { id: 1, name: 'Programming Mastery' } as Series
    }),
    new Book({
      id: "8",
      name: 'The Pragmatic Programmer',
      author: { id: 1, name: 'Andrew Hunt' } as Author,
      pages: 352,
      currentPage: 100,
      startDate: new Date(2025, 8, 20),
      endDate: new Date(2025, 8, 24),
      genre: [Genres.Technology],
      publisher: 'Addison-Wesley',
      format: Formats.Hardcover,
      description: 'A book about pragmatic approaches to software development.',
      review: 'Excelente leitura para devs.',
      status: Status.ToRead,
      price: 199.90,
      series: { id: 1, name: 'Programming Mastery' } as Series
    }),
    new Book({
      id: "9",
      name: 'The Pragmatic Programmer',
      author: { id: 1, name: 'Andrew Hunt' } as Author,
      pages: 352,
      currentPage: 100,
      startDate: new Date(2025, 8, 20),
      endDate: new Date(2025, 8, 24),
      genre: [Genres.Technology],
      publisher: 'Addison-Wesley',
      format: Formats.Hardcover,
      description: 'A book about pragmatic approaches to software development.',
      review: 'Excelente leitura para devs.',
      status: Status.Paused,
      price: 199.90,
      series: { id: 1, name: 'Programming Mastery' } as Series
    }),
    new Book({
      id: "10",
      name: 'The Pragmatic Programmer',
      author: { id: 1, name: 'Andrew Hunt' } as Author,
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
      series: { id: 1, name: 'Programming Mastery' } as Series
    }),
    new Book({
      id: "11",
      name: 'The Pragmatic Programmer',
      author: { id: 1, name: 'Andrew Hunt' } as Author,
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
      series: { id: 1, name: 'Programming Mastery' } as Series
    }),
    new Book({
      id: "12",
      name: 'The Pragmatic Programmer',
      author: { id: 1, name: 'Andrew Hunt' } as Author,
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
      series: { id: 1, name: 'Programming Mastery' } as Series
    })
  ];

  // >>>>>>>>>>>>>>>>>>>>>>>>>> FIM DO MOCK <<<<<<<<<<<<<<<<<<<<<<<<<<

  bookForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    author: ['', Validators.required],
    publisher: ['', Validators.required],
    price: [null],
    pages: [null, [
      Validators.required,
      Validators.min(1)
    ]],
    currentPage: [null],
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
    this.updateCounters();

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

  ngAfterViewInit() {
    const countsFormat: { [key: string]: number } = {};
    const countsGenres: { [key: string]: number } = {};

    for (const book of this.books) {
      const formatName = Formats[book.format];
      countsFormat[formatName] = (countsFormat[formatName] || 0) + 1;
    }

    for (const book of this.books) {
      if (book.genre && Array.isArray(book.genre)) {
        for (const genre of book.genre) {
          const genreName = Genres[genre];
          countsGenres[genreName] = (countsGenres[genreName] || 0) + 1;
        }
      }
    }

    const labelsFormart = Object.keys(countsFormat);
    const seriesFormart = Object.values(countsFormat);
    const labelsGenres = Object.keys(countsGenres);
    const seriesGenres = Object.values(countsGenres);

    this.chartsService.renderDonutChart(this.formatChart.nativeElement, 'Formats', labelsFormart, seriesFormart);
    this.chartsService.renderDonutChart(this.genresChart.nativeElement, 'Genres', labelsGenres, seriesGenres);
  }

  getSeverity(status: number) {
    switch (status) {
      case 1:
        return 'secondary';
      case 2:
        return 'info';
      case 3:
        return 'warn';
      case 4:
        return 'success';
      default:
        return null;
    }
  }

  showDialog() {
    this.dialogVisible = true;
  }

  showNewBookDialog() {
    this.modalTitle = 'Add a Book';
    this.newBookDialogvisible = true;

    this.bookForm.reset();
    this.bookForm.enable();
  }

  deleteBook(id: string) {
    this.readingJournalService.deleteBook(id).subscribe({
      next: (success) => {
        if (success) {
          this.messageService.add({ severity: 'success', summary: 'Delete', detail: 'Livro deletado com sucesso!' });
          this.getAllBooks();
          this.updateCounters();
        }
      },
      error: (err) => {
        console.error(err);
      }
    })
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

  updateCounters(): void {
    const newPages = this.books.reduce((sum, book) => sum + (book.pages || 0), 0);
    const newPrice = this.books.reduce((sum, book) => sum + (book.price || 0), 0);
    const newDays = this.books.reduce((sum, book) => sum + (book.daysSpentReading || 0), 0);
    const newBooks = this.books.length;

    this.animateCounter("totalPages", newPages, 500);
    this.animateCounter("totalPrice", newPrice, 500);
    this.animateCounter("totalDaysSpent", newDays, 500);
    this.animateCounter("totalBooks", newBooks, 500);
  }

  private animateCounter(
    prop: "totalPages" | "totalPrice" | "totalDaysSpent" | "totalBooks",
    target: number,
    duration: number
  ) {
    let start = this[prop];
    const step = Math.ceil((target - start) / (duration / 20)); // passo baseado em 20fps

    const timer = setInterval(() => {
      start += step;

      if ((step > 0 && start >= target) || (step < 0 && start <= target)) {
        this[prop] = target; // garante que não passe do valor
        clearInterval(timer);
      } else {
        this[prop] = start;
      }
    }, 30);
  }

  exportCSV() {
    this.dt.exportFilename = 'list_books';
    this.dt.exportCSV();
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Lista de livros exportada com sucesso!' });
  }

  // Função genérica para converter enums
  enumToString(value: number | number[] | undefined, enumType: any): string {
    if (!value) return ''; // cobre undefined, null ou array vazio
    if (Array.isArray(value)) {
      return value.map(v => enumType[v]).join(', ');
    }
    return enumType[value];
  }

  filterAuthors(event: any) {
    const query = event.query.toLowerCase();
    this.filteredAuthors = this.authors.filter(a =>
      a.name?.toLowerCase().includes(query)
    );
  }

  filterSeries(event: any) {
    const query = event.query.toLowerCase();
    this.filteredSeries = this.series.filter(a =>
      a.name?.toLowerCase().includes(query)
    );
  }

  onSubmit() {
    if (this.bookForm.valid) {
      this.readingJournalService.createBook(this.bookForm.value).subscribe({
        next: (success) => {
          if (success) {
            this.messageService.add({ severity: 'success', summary: 'Create', detail: 'Livro criado com sucesso!' });
            this.getAllBooks();
            this.updateCounters()
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
    // atualizar método do service para edit e não create
    if (this.bookForm.valid) {
      this.readingJournalService.createBook(this.bookForm.value).subscribe({
        next: (success) => {
          if (success) {
            this.getAllBooks();
            this.messageService.add({ severity: 'success', summary: 'Edit', detail: 'Livro editado com sucesso!' });
            this.updateCounters()
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

  openCreateBook() {
    this.modalTitle = 'Add a Book';

    this.selectedBook = undefined;
    this.bookForm.reset();
    this.bookForm.enable();
  }

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