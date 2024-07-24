import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersModalComponent } from './customers-modal.component';

describe('CustomersModalComponent', () => {
  let component: CustomersModalComponent;
  let fixture: ComponentFixture<CustomersModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomersModalComponent]
    });
    fixture = TestBed.createComponent(CustomersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
