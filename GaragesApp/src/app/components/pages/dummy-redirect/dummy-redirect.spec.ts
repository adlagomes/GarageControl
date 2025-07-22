import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DummyRedirect } from './dummy-redirect';

describe('DummyRedirect', () => {
  let component: DummyRedirect;
  let fixture: ComponentFixture<DummyRedirect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DummyRedirect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DummyRedirect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
