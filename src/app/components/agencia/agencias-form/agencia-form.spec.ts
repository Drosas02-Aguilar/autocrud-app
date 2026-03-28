import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgenciaForm } from './agencia-form';

describe('AgenciaForm', () => {
  let component: AgenciaForm;
  let fixture: ComponentFixture<AgenciaForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgenciaForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AgenciaForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
