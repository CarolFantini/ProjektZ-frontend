import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadingJournal } from './reading-journal';

describe('ReadingJournal', () => {
  let component: ReadingJournal;
  let fixture: ComponentFixture<ReadingJournal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadingJournal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadingJournal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
