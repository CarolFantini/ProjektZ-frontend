import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterGlobal } from './footer-global';

describe('FooterGlobal', () => {
  let component: FooterGlobal;
  let fixture: ComponentFixture<FooterGlobal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterGlobal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterGlobal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
