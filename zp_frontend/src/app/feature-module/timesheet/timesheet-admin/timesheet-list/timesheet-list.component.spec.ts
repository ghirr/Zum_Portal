import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetListComponent } from './timesheet-list.component';

describe('TimesheetListComponent', () => {
  let component: TimesheetListComponent;
  let fixture: ComponentFixture<TimesheetListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimesheetListComponent]
    });
    fixture = TestBed.createComponent(TimesheetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
