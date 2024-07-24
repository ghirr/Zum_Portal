import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeContractsComponent } from './employee-contracts.component';

describe('EmployeeContractsComponent', () => {
  let component: EmployeeContractsComponent;
  let fixture: ComponentFixture<EmployeeContractsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeContractsComponent]
    });
    fixture = TestBed.createComponent(EmployeeContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
