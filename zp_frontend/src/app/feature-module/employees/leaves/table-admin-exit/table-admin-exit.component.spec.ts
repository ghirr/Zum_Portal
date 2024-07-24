import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableAdminExitComponent } from './table-admin-exit.component';

describe('TableAdminExitComponent', () => {
  let component: TableAdminExitComponent;
  let fixture: ComponentFixture<TableAdminExitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableAdminExitComponent]
    });
    fixture = TestBed.createComponent(TableAdminExitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
