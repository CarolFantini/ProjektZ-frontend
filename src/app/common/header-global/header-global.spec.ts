import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderGlobal } from './header-global';

describe('HeaderGlobal', () => {
  let component: HeaderGlobal;
  let fixture: ComponentFixture<HeaderGlobal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderGlobal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderGlobal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
