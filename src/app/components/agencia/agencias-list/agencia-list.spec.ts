import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgenciaList } from './agencia-list';

describe('AgenciaList', () => {
  let component: AgenciaList;
  let fixture: ComponentFixture<AgenciaList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgenciaList],
    }).compileComponents();

    fixture = TestBed.createComponent(AgenciaList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
