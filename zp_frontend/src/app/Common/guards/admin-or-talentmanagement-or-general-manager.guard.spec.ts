import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { adminOrTalentmanagementOrGeneralManagerGuard } from './admin-or-talentmanagement-or-general-manager.guard';

describe('adminOrTalentmanagementOrGeneralManagerGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adminOrTalentmanagementOrGeneralManagerGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
