import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoList } from './auto-list';

describe('AutoList', () => {
  let component: AutoList;
  let fixture: ComponentFixture<AutoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoList],
    }).compileComponents();

    fixture = TestBed.createComponent(AutoList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
