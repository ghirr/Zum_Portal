import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { simpeOrScrumOrProjectManagerGuard } from './simpe-or-scrum-or-project-manager.guard';

describe('simpeOrScrumOrProjectManagerGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => simpeOrScrumOrProjectManagerGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
