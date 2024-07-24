import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TtApprovalsComponent } from './tt-approvals.component';

describe('TtApprovalsComponent', () => {
  let component: TtApprovalsComponent;
  let fixture: ComponentFixture<TtApprovalsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TtApprovalsComponent]
    });
    fixture = TestBed.createComponent(TtApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
