import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuGlobal } from './menu-global';

describe('MenuGlobal', () => {
  let component: MenuGlobal;
  let fixture: ComponentFixture<MenuGlobal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuGlobal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuGlobal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
