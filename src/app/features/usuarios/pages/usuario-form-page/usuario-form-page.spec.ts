import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioFormPage } from './usuario-form-page';

describe('UsuarioFormPage', () => {
  let component: UsuarioFormPage;
  let fixture: ComponentFixture<UsuarioFormPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioFormPage],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuarioFormPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
