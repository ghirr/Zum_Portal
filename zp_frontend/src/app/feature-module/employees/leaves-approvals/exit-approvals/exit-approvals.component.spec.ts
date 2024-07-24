import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitApprovalsComponent } from './exit-approvals.component';

describe('ExitApprovalsComponent', () => {
  let component: ExitApprovalsComponent;
  let fixture: ComponentFixture<ExitApprovalsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExitApprovalsComponent]
    });
    fixture = TestBed.createComponent(ExitApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
