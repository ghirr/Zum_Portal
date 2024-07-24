import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableExitauthorizationComponent } from './table-exitauthorization.component';

describe('TableExitauthorizationComponent', () => {
  let component: TableExitauthorizationComponent;
  let fixture: ComponentFixture<TableExitauthorizationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableExitauthorizationComponent]
    });
    fixture = TestBed.createComponent(TableExitauthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
