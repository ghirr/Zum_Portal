import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { talentOrGeneralOrScrumOrProjectManagerGuard } from './talent-or-general-or-scrum-or-project-manager.guard';

describe('talentOrGeneralOrScrumOrProjectManagerGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => talentOrGeneralOrScrumOrProjectManagerGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
