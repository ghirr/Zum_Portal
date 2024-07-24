import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavesAdminComponent } from './leaves-admin.component';

describe('LeavesAdminComponent', () => {
  let component: LeavesAdminComponent;
  let fixture: ComponentFixture<LeavesAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeavesAdminComponent]
    });
    fixture = TestBed.createComponent(LeavesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
