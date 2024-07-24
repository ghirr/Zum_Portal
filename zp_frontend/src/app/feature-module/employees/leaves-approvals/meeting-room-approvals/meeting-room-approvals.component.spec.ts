import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingRoomApprovalsComponent } from './meeting-room-approvals.component';

describe('MeetingRoomApprovalsComponent', () => {
  let component: MeetingRoomApprovalsComponent;
  let fixture: ComponentFixture<MeetingRoomApprovalsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeetingRoomApprovalsComponent]
    });
    fixture = TestBed.createComponent(MeetingRoomApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
