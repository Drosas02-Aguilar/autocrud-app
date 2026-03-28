import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoForm } from './auto-form';

describe('AutoForm', () => {
  let component: AutoForm;
  let fixture: ComponentFixture<AutoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AutoForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
