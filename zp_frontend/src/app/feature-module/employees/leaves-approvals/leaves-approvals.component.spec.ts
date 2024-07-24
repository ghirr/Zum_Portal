import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavesApprovalsComponent } from './leaves-approvals.component';

describe('LeavesApprovalsComponent', () => {
  let component: LeavesApprovalsComponent;
  let fixture: ComponentFixture<LeavesApprovalsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeavesApprovalsComponent]
    });
    fixture = TestBed.createComponent(LeavesApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
