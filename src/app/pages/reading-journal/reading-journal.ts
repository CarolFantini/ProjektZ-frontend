import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FooterGlobal } from '../../common/footer-global/footer-global';
import { MenuGlobal } from '../../common/menu-global/menu-global';
import { ReadingJournalService } from '../../services/reading-journal-service';
import { BookDTO } from '../../models/reading-journal/bookDTO';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Genres } from '../../enums/genres';
import { Status } from '../../enums/status';
import { Formats } from '../../enums/formats';
import { AuthorDTO } from '../../models/reading-journal/authorDTO';
import { Series } from '../../models/reading-journal/series';
import { ChartsService } from '../../services/charts-service';

import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule, ButtonSeverity } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { Tag } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { MultiSelect } from 'primeng/multiselect';
import { DatePicker } from 'primeng/datepicker';
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
    Tag, ToastModule, InputGroup, InputGroupAddon, MultiSelect, DatePicker, Select,
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
  selectedBook?: BookDTO;
  isEditMode: boolean = false;
  totalPages: number = 0;
  totalPrice: number = 0;
  totalDaysSpent: number = 0;
  totalBooks: number = 0;
  averageTime: string = '';
  tableDialogVisible: boolean = false;
  dialogVisible: boolean = false;
  buttonSeverity: ButtonSeverity = 'success';
  // precisa para order by
  cols: Column[] = [
    { header: 'Name', field: 'name' },
    { header: 'Authors', field: 'authors' },
    { header: 'Publisher', field: 'publisher' },
    { header: 'Genres', field: 'genres' },
    { header: 'Format', field: 'format' },
    { header: 'Pages', field: 'pages' },
    { header: 'Current Page', field: 'currentPage' },
    { header: 'Start Date', field: 'startDate' },
    { header: 'End Date', field: 'endDate' },
    { header: 'Status', field: 'status' },
    { header: 'Price', field: 'price' },
    { header: 'Series', field: 'series.name' },
    { header: 'Days Spend', field: 'daysSpentReading' },
    { header: 'Progress', field: 'progressPercentage' }
  ];
  // ---
  // precisa para o search
  filterFields: string[] = this.cols.map(col => col.field);
  // ---
  authors: AuthorDTO[] = [];
  series: Series[] = [];
  books: BookDTO[] = [];

  formats: { key: number; value: string }[] = [];
  statuses: { key: number; value: string }[] = [];
  genersList: { key: number; value: string }[] = [];
  // NECESSÁRIO
  Genres = Genres;
  Status = Status;
  Formats = Formats;

  bookForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    authors: [[], Validators.required],
    publisher: ['', Validators.required],
    price: [null],
    pages: [null, [
      Validators.required,
      Validators.min(1)
    ]],
    currentPage: [null],
    startDate: [null],
    endDate: [null],
    genres: [[], Validators.required],
    series: [null],
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
    this.getAllAuthors();
    this.getAllSeries();

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

  renderCharts() {
    const countsFormat: { [key: string]: number } = {};
    const countsGenres: { [key: string]: number } = {};

    for (const book of this.books) {
      const formatName = Formats[book.format];
      countsFormat[formatName] = (countsFormat[formatName] || 0) + 1;
    }

    for (const book of this.books) {
      if (book.genres && Array.isArray(book.genres)) {
        for (const genre of book.genres) {
          const genreName = Genres[genre];
          countsGenres[genreName] = (countsGenres[genreName] || 0) + 1;
        }
      }
    }

    const labelsFormat = Object.keys(countsFormat);
    const seriesFormat = Object.values(countsFormat);
    const labelsGenres = Object.keys(countsGenres);
    const seriesGenres = Object.values(countsGenres);

    this.chartsService.renderDonutChart(this.formatChart.nativeElement, 'Formats', labelsFormat, seriesFormat);
    this.chartsService.renderDonutChart(this.genresChart.nativeElement, 'Genres', labelsGenres, seriesGenres);
  }

  getSeverity(status: number) {
    switch (status) {
      case 1:
        return 'success';
      case 2:
        return 'info';
      case 3:
        return 'warn';
      case 4:
        return 'secondary';
      default:
        return null;
    }
  }

  showDialog() {
    this.tableDialogVisible = true;
  }

  openCreateDialog() {
    this.modalTitle = 'Add a Book';
    this.buttonSeverity = 'success';
    this.isEditMode = false;
    this.dialogVisible = true;
    this.bookForm.reset();
    this.enableAllFields();
  }

  openEditDialog(book: BookDTO) {
    this.bookForm.reset();
    this.selectedBook = book;
    this.modalTitle = 'Edit a Book - ' + book.name;
    this.buttonSeverity = 'warn';
    this.isEditMode = true;
    this.dialogVisible = true;

    this.bookForm.patchValue({
      name: book.name || '',
      authors: book.authors,
      publisher: book.publisher || '',
      price: book.price ?? null,
      pages: book.pages ?? null,
      currentPage: book.currentPage ?? null,
      startDate: book.startDate ? new Date(book.startDate) : null,
      endDate: book.endDate ? new Date(book.endDate) : null,
      genres: book.genres || [],
      series: book.series,
      format: book.format,
      status: book.status,
      description: book.description || '',
      review: book.review || ''
    });

    if (book.startDate) {
      this.bookForm.get('startDate')?.disable();
    } else {
      this.bookForm.get('startDate')?.enable();
    }

    this.bookForm.get('name')?.disable();
    this.bookForm.get('authors')?.disable();
    this.bookForm.get('publisher')?.disable();
    this.bookForm.get('format')?.disable();
    this.bookForm.get('pages')?.disable();
  }

  deleteBook(id: number) {
    this.readingJournalService.deleteBook(id).subscribe({
      next: (success) => {
        if (success) {
          this.messageService.add({ severity: 'success', summary: 'Delete', detail: 'Book deleted successfully!' });
          this.getAllBooks();
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
        this.updateCounters();
        this.renderCharts();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getAllAuthors(): void {
    this.readingJournalService.getAllAuthors().subscribe({
      next: (data) => {
        this.authors = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getAllSeries(): void {
    this.readingJournalService.getAllSeries().subscribe({
      next: (data) => {
        this.series = data;
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

    this.averageTime = (newDays / newBooks).toFixed();
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

  enableAllFields() {
    Object.keys(this.bookForm.controls).forEach(key => {
      this.bookForm.get(key)?.enable();
    });
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

  finishBook(book: BookDTO) {
    this.selectedBook = book;

    this.selectedBook.currentPage = this.selectedBook.pages;
    this.selectedBook.status = Status.Finished;
    this.selectedBook.endDate = new Date();

    this.readingJournalService.editBook(this.selectedBook).subscribe({
      next: (success) => {
        if (success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Finished',
            detail: 'Book has been finished!'
          });
          this.getAllBooks();
          this.bookForm.reset();
        }
      },
      error: (err) => console.error(err)
    });
  }

  onSubmit(): void {
    if (!this.bookForm.valid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    // Pega todos os campos, incluindo os desabilitados
    const bookData = this.bookForm.getRawValue();

    const request$ = this.isEditMode
      ? this.readingJournalService.editBook({ ...this.selectedBook, ...bookData })
      : this.readingJournalService.createBook(bookData);

    request$.subscribe({
      next: (success) => {
        if (success) {
          this.messageService.add({
            severity: 'success',
            summary: this.isEditMode ? 'Edit' : 'Create',
            detail: this.isEditMode
              ? 'Book successfully edited!'
              : 'Book created successfully!'
          });
          this.getAllBooks();
          this.bookForm.reset();
          this.dialogVisible = false;
          this.isEditMode = false;
        }
      },
      error: (err) => console.error(err)
    });
  }
}