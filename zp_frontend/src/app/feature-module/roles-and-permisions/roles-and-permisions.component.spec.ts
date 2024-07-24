import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesAndPermisionsComponent } from './roles-and-permisions.component';

describe('RolesAndPermisionsComponent', () => {
  let component: RolesAndPermisionsComponent;
  let fixture: ComponentFixture<RolesAndPermisionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RolesAndPermisionsComponent]
    });
    fixture = TestBed.createComponent(RolesAndPermisionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
