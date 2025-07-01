import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GarageForm } from './garage-form.component';

describe('GarageForm', () => {
  let component: GarageForm;
  let fixture: ComponentFixture<GarageForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GarageForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GarageForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
