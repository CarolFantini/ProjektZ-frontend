import { TestBed } from '@angular/core/testing';

import { ReadingJournalService } from './reading-journal-service';

describe('ReadingJournalService', () => {
  let service: ReadingJournalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReadingJournalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
