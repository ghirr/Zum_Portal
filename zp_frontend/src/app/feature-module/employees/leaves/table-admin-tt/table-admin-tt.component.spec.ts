import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableAdminTTComponent } from './table-admin-tt.component';

describe('TableAdminTTComponent', () => {
  let component: TableAdminTTComponent;
  let fixture: ComponentFixture<TableAdminTTComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableAdminTTComponent]
    });
    fixture = TestBed.createComponent(TableAdminTTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
