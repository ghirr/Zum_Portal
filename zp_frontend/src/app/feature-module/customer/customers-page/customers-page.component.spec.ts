import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersPageComponent } from './customers-page.component';

describe('CustomersPageComponent', () => {
  let component: CustomersPageComponent;
  let fixture: ComponentFixture<CustomersPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomersPageComponent]
    });
    fixture = TestBed.createComponent(CustomersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
