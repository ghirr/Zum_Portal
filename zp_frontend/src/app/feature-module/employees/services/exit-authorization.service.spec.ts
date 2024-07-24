import { TestBed } from '@angular/core/testing';

import { ExitAuthorizationService } from './exit-authorization.service';

describe('ExitAuthorizationService', () => {
  let service: ExitAuthorizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExitAuthorizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
