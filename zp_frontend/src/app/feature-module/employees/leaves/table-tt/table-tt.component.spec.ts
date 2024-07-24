import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableTTComponent } from './table-tt.component';

describe('TableTTComponent', () => {
  let component: TableTTComponent;
  let fixture: ComponentFixture<TableTTComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableTTComponent]
    });
    fixture = TestBed.createComponent(TableTTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
