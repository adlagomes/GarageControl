import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GarageList } from './garage-list.component';

describe('GarageList', () => {
  let component: GarageList;
  let fixture: ComponentFixture<GarageList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GarageList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GarageList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
