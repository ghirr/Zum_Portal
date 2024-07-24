import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableAdminLeaveComponent } from './table-admin-leave.component';

describe('TableAdminLeaveComponent', () => {
  let component: TableAdminLeaveComponent;
  let fixture: ComponentFixture<TableAdminLeaveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableAdminLeaveComponent]
    });
    fixture = TestBed.createComponent(TableAdminLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
