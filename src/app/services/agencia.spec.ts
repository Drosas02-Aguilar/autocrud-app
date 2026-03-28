import { TestBed } from '@angular/core/testing';

import { Agencia } from './agenciaService';

describe('Agencia', () => {
  let service: Agencia;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Agencia);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
