import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavesEmployeeComponent } from './leaves-employee.component';

describe('LeavesEmployeeComponent', () => {
  let component: LeavesEmployeeComponent;
  let fixture: ComponentFixture<LeavesEmployeeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeavesEmployeeComponent]
    });
    fixture = TestBed.createComponent(LeavesEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
